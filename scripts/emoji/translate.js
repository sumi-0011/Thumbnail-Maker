import { promises as fs } from "fs";
import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import chalk from "chalk";

import {
  getTranslateKeywordInfo,
  getDirectTranslations,
  getDirectTranslationCount,
  getCache,
  getCacheTranslationCount,
  saveCache,
  saveFailedFile,
} from "./translateAsset.js";

// 현재 파일의 디렉토리 경로 구하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

const INPUT_FILE = join(__dirname, "output", "enriched-emoji.json");
const OUTPUT_FILE = join(__dirname, "output", "translation-dictionary.json");

// 고유 키워드 추출 함수
const extractUniqueKeywords = async (inputPath) => {
  try {
    const data = await fs.readFile(INPUT_FILE, "utf-8");
    const emojiDb = JSON.parse(data);
    const uniqueKeywords = new Set();

    for (const group of Object.values(emojiDb)) {
      for (const emoji of Object.values(group)) {
        emoji.keywords.forEach((keyword) =>
          uniqueKeywords.add(keyword.toLowerCase())
        );
      }
    }

    return Array.from(uniqueKeywords);
  } catch (error) {
    console.error(chalk.red("Error extracting keywords:"), error);
    throw error;
  }
};

// 번역 함수
const translateBatch = async (texts) => {
  try {
    const response = await axios.post(
      DEEPL_API_URL,
      new URLSearchParams({
        text: texts.join("\n"),
        source_lang: "EN",
        target_lang: "KO",
      }),
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const translations = response.data.translations[0].text.split("\n");
    return translations.map((translation, index) => ({
      original: texts[index],
      translated: translation.trim(),
    }));
  } catch (error) {
    console.error(chalk.red("Translation error:"), error.message);
    throw error;
  }
};

// 번역 사전 생성 함수
const generateDictionary = async (keywords) => {
  const cache = await getCache();
  const dictionary = {};
  const batchSize = 50;
  const failedTranslations = new Set();

  const { directKeywords, cachedKeywords, skipKeywords, needTranslation } =
    await getTranslateKeywordInfo(keywords);

  const directTranslations = await getDirectTranslations();

  console.log(chalk.cyan("\nTranslation status:"));
  console.log(chalk.white(`Total keywords: ${keywords.length}`));
  console.log(chalk.blue(`Found in cache: ${cachedKeywords.length}`));
  console.log(chalk.yellow(`Previously failed (skip): ${skipKeywords.length}`));
  console.log(chalk.magenta(`Need translation: ${needTranslation.length}`));
  console.log(chalk.green(`Direct translations: ${directKeywords.length}`));

  // 캐시된 번역 처리
  cachedKeywords.forEach((keyword) => {
    const cached = cache[keyword];
    if (cached && cached.ko && cached.ko !== keyword) {
      dictionary[keyword] = cached;
      console.log(chalk.blue(`[CACHE] ✓ ${keyword} -> ${cached.ko}`));
    } else {
      failedTranslations.add(keyword);
      console.log(chalk.red(`[CACHE] ✗ Invalid translation for: ${keyword}`));
    }
  });

  // 이전 실패 건 처리
  skipKeywords.forEach((keyword) => {
    console.log(chalk.yellow(`[SKIP] → ${keyword} (previously failed)`));
    failedTranslations.add(keyword);
  });

  // 직접 매핑 처리 추가
  directKeywords.forEach((keyword) => {
    const direct = directTranslations[keyword];
    dictionary[keyword] = {
      en: keyword,
      ko: direct,
    };
    console.log(chalk.green(`[DIRECT] ✓ ${keyword} -> ${direct}`));
  });

  // 새로운 번역 처리
  for (let i = 0; i < needTranslation.length; i += batchSize) {
    const batch = needTranslation.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(needTranslation.length / batchSize);

    console.log(
      chalk.cyan(`\nProcessing batch ${batchNumber}/${totalBatches}`)
    );

    try {
      const translationResults = await translateBatch(batch);

      translationResults.forEach(({ original, translated }) => {
        const lowercaseOriginal = original.toLowerCase();

        if (
          translated &&
          translated.toLowerCase() !== lowercaseOriginal &&
          translated.trim() !== ""
        ) {
          const translationEntry = {
            en: original,
            ko: translated,
          };
          dictionary[lowercaseOriginal] = translationEntry;
          cache[lowercaseOriginal] = translationEntry;
          console.log(chalk.green(`[NEW] ✓ ${original} -> ${translated}`));
        } else {
          failedTranslations.add(original);
          console.log(chalk.red(`[NEW] ✗ Failed to translate: ${original}`));
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(chalk.red(`Error in batch ${batchNumber}:`), error.message);
      batch.forEach((keyword) => {
        failedTranslations.add(keyword);
        console.log(chalk.red(`[NEW] ✗ Error translating: ${keyword}`));
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return {
    dictionary,
    failedTranslations: Array.from(failedTranslations),
    newCache: cache,
  };
};

// 결과 검증 함수 수정
const validateTranslations = async (dictionary, originalKeywords) => {
  const cache = await getCache();
  const processedCount = Object.keys(dictionary).length;
  const skippedCount = originalKeywords.length - processedCount;

  // 캐시와 새로운 번역 구분 (안전하게 검사)
  const fromCache = await getCacheTranslationCount(dictionary);

  // 직접 매핑 번역 수 계산 추가
  const fromDirect = await getDirectTranslationCount(dictionary);
  const fromNewTranslation = processedCount - fromCache - fromDirect;

  console.log(chalk.cyan("\nTranslation Results:"));
  console.log(chalk.cyan("-------------------"));
  console.log(chalk.white(`Total keywords: ${originalKeywords.length}`));
  console.log(chalk.white(`Successfully translated: ${processedCount}`));
  console.log(chalk.white(`  - From cache: ${fromCache}`));
  console.log(chalk.white(`  - Newly translated: ${fromNewTranslation}`));
  console.log(chalk.white(`  - From direct mapping: ${fromDirect}`));
  console.log(chalk.white(`Skipped/Failed: ${skippedCount}`));

  return {
    totalCount: originalKeywords.length,
    successCount: processedCount,
    fromCache,
    fromNewTranslation,
    failedCount: skippedCount,
  };
};

// 메인 실행 함수
const main = async () => {
  if (!DEEPL_API_KEY) {
    throw new Error("DeepL API key not found in environment variables");
  }

  try {
    // 1. 고유 키워드 추출
    console.log(chalk.cyan("Extracting unique keywords..."));
    const uniqueKeywords = await extractUniqueKeywords(INPUT_FILE);
    console.log(
      chalk.green("Unique keywords extracted:"),
      uniqueKeywords.length
    );

    // 2. 번역 사전 생성
    console.log(chalk.cyan("\nGenerating translation dictionary..."));
    const { dictionary, failedTranslations, newCache } =
      await generateDictionary(uniqueKeywords);

    // 3. 번역 결과 검증
    console.log(chalk.cyan("\nValidating translations..."));
    validateTranslations(dictionary, uniqueKeywords);

    // 4. 캐시 저장
    await saveCache(newCache);

    // 6. 최종 사전 파일 저장
    console.log(chalk.cyan("\nSaving successful translations..."));
    await fs.writeFile(
      OUTPUT_FILE,
      JSON.stringify(dictionary, null, 2),
      "utf-8"
    );

    // 7. 실패 목록 저장
    if (failedTranslations.length > 0) {
      const failureReport = {
        timestamp: new Date().toISOString(),
        totalKeywords: uniqueKeywords.length,
        failedCount: failedTranslations.length,
        failedKeywords: failedTranslations.sort(),
      };

      await saveFailedFile(failureReport);
      console.log(
        chalk.yellow("\nFailed translations saved to failed-translations.json")
      );
    }

    console.log(chalk.green("\nDictionary generation completed successfully!"));
  } catch (error) {
    console.error(chalk.red("Script failed:"), error);
    process.exit(1);
  }
};

main();
