import { promises as fs } from "fs";
import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { test, loadJson, saveJson } from "../common/jsonFile.js";
import {
  getTranslateKeywordInfo,
  getDirectTranslations,
  getDirectTranslationCount,
  getCache,
  getCacheTranslationCount,
} from "./translateAsset.js";

// 현재 파일의 디렉토리 경로 구하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

const CACHE_FILE = join(__dirname, "assets", "translation-cache.json");
const FAILED_FILE = join(__dirname, "assets", "failed-translations.json");
const DIRECT_FILE = join(__dirname, "assets", "direct-translations.json");
const INPUT_FILE = join(__dirname, "output", "enriched-emoji.json");
const OUTPUT_FILE = join(__dirname, "output", "translation-dictionary.json");

// 캐시 로드 함수
const loadCache = async () => {
  try {
    const cache = await loadJson(CACHE_FILE);
    console.log(`Loaded ${Object.keys(cache).length} cached translations`);
    return cache;
  } catch (error) {
    console.log("No existing cache found, starting with empty cache");
    return {};
  }
};

// 직접 매핑한 번역 로드 함수 추가
const loadDirectTranslations = async () => {
  try {
    const direct = await loadJson(DIRECT_FILE);
    console.log(`Loaded ${Object.keys(direct).length} direct translations`);
    return direct;
  } catch (error) {
    console.log("No direct translations found");
    return {};
  }
};

const saveCache = async (cache) => {
  console.log("save cache: ", cache);
  try {
    await saveJson(CACHE_FILE, cache);
    console.log(`Saved ${Object.keys(cache).length} translations to cache`);
  } catch (error) {
    console.error("Error saving cache:", error);
  }
};

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
    console.error("Error extracting keywords:", error);
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
    console.error("Translation error:", error.message);
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

  // 이전 실패 기록 로드
  //   const previousFailures = await loadFailedTranslations();
  const directTranslations = await getDirectTranslations();

  console.log(`\nTranslation status:`);
  console.log(`Total keywords: ${keywords.length}`);
  console.log(`Found in cache: ${cachedKeywords.length}`);
  console.log(`Previously failed (skip): ${skipKeywords.length}`);
  console.log(`Need translation: ${needTranslation.length}`);
  console.log(`Direct translations: ${directKeywords.length}`);

  // 캐시된 번역 처리
  cachedKeywords.forEach((keyword) => {
    const cached = cache[keyword];
    if (cached && cached.ko && cached.ko !== keyword) {
      dictionary[keyword] = cached;
      console.log(`[CACHE] ✓ ${keyword} -> ${cached.ko}`);
    } else {
      failedTranslations.add(keyword);
      console.log(`[CACHE] ✗ Invalid translation for: ${keyword}`);
    }
  });

  // 이전 실패 건 처리
  skipKeywords.forEach((keyword) => {
    console.log(`[SKIP] → ${keyword} (previously failed)`);
    failedTranslations.add(keyword);
  });

  // 직접 매핑 처리 추가
  directKeywords.forEach((keyword) => {
    const direct = directTranslations[keyword];
    dictionary[keyword] = {
      en: keyword,
      ko: direct,
    };
    console.log(`[DIRECT] ✓ ${keyword} -> ${direct}`);
  });

  // 새로운 번역 처리
  for (let i = 0; i < needTranslation.length; i += batchSize) {
    const batch = needTranslation.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(needTranslation.length / batchSize);

    console.log(`\nProcessing batch ${batchNumber}/${totalBatches}`);

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
          console.log(`[NEW] ✓ ${original} -> ${translated}`);
        } else {
          failedTranslations.add(original);
          console.log(`[NEW] ✗ Failed to translate: ${original}`);
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error in batch ${batchNumber}:`, error.message);
      batch.forEach((keyword) => {
        failedTranslations.add(keyword);
        console.log(`[NEW] ✗ Error translating: ${keyword}`);
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

  console.log("\nTranslation Results:");
  console.log("-------------------");
  console.log(`Total keywords: ${originalKeywords.length}`);
  console.log(`Successfully translated: ${processedCount}`);
  console.log(`  - From cache: ${fromCache}`);
  console.log(`  - Newly translated: ${fromNewTranslation}`);
  console.log(`  - From direct mapping: ${fromDirect}`);
  console.log(`Skipped/Failed: ${skippedCount}`);

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
    // 1. 캐시 로드
    const cache = await loadCache();

    // 2. 고유 키워드 추출
    console.log("Extracting unique keywords...");
    const uniqueKeywords = await extractUniqueKeywords(INPUT_FILE);
    console.log("Unique keywords extracted:", uniqueKeywords.length);

    // 3. 번역 사전 생성
    console.log("\nGenerating translation dictionary...");
    const { dictionary, failedTranslations, newCache } =
      await generateDictionary(uniqueKeywords);

    // 4. 번역 결과 검증
    console.log("\nValidating translations...");
    validateTranslations(dictionary, uniqueKeywords);

    // 5. 캐시 저장
    await saveCache(newCache);

    // 6. 최종 사전 파일 저장
    console.log("\nSaving successful translations...");
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

      await fs.writeFile(
        FAILED_FILE,
        JSON.stringify(failureReport, null, 2),
        "utf-8"
      );

      console.log("\nFailed translations saved to failed-translations.json");
    }

    console.log("\nDictionary generation completed successfully!");
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  }
};

main();
