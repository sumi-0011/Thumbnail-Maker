const fs = require("fs").promises;
const axios = require("axios");
require("dotenv").config();

// DeepL API 설정
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

// 고유 키워드 추출 함수
const extractUniqueKeywords = async (inputPath) => {
  try {
    const data = await fs.readFile(inputPath, "utf-8");
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
  const dictionary = {};
  const batchSize = 50;
  const failedTranslations = new Set();

  console.log(`Total unique keywords: ${keywords.length}`);

  for (let i = 0; i < keywords.length; i += batchSize) {
    const batch = keywords.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(keywords.length / batchSize);

    console.log(`Processing batch ${batchNumber}/${totalBatches}`);

    try {
      const translationResults = await translateBatch(batch);

      translationResults.forEach(({ original, translated }) => {
        const lowercaseOriginal = original.toLowerCase();

        // 번역 성공 조건:
        // 1. 번역 결과가 존재하고
        // 2. 원본과 다르고
        // 3. 공백이 아닌 경우
        if (
          translated &&
          translated.toLowerCase() !== lowercaseOriginal &&
          translated.trim() !== ""
        ) {
          dictionary[lowercaseOriginal] = {
            en: original,
            ko: translated,
          };
          console.log(`✓ ${original} -> ${translated}`);
        } else {
          failedTranslations.add(original);
          console.log(`✗ Failed to translate: ${original}`);
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error in batch ${batchNumber}:`, error.message);
      // 에러 발생한 배치의 키워드들을 실패 목록에 추가
      batch.forEach((keyword) => failedTranslations.add(keyword));
      // 잠시 대기 후 다음 배치 처리
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return {
    dictionary,
    failedTranslations: Array.from(failedTranslations),
  };
};

// 번역 결과 검증 함수
const validateTranslations = (dictionary, originalKeywords) => {
  const processedCount = Object.keys(dictionary).length;
  const skippedCount = originalKeywords.length - processedCount;

  console.log("\nTranslation Results:");
  console.log("-------------------");
  console.log(`Total keywords: ${originalKeywords.length}`);
  console.log(`Successfully translated: ${processedCount}`);
  console.log(`Skipped/Failed: ${skippedCount}`);

  return {
    totalCount: originalKeywords.length,
    successCount: processedCount,
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
    console.log("Extracting unique keywords...");
    const uniqueKeywords = await extractUniqueKeywords("./input-emoji.json");
    console.log("Unique keywords extracted:", uniqueKeywords.length);

    // 2. 번역 사전 생성
    console.log("\nGenerating translation dictionary...");
    const { dictionary, failedTranslations } = await generateDictionary(
      uniqueKeywords
    );

    // 3. 번역 결과 검증
    console.log("\nValidating translations...");
    const validationResult = validateTranslations(dictionary, uniqueKeywords);

    // 4. 사전 파일 저장 (성공한 번역만)
    console.log("\nSaving successful translations...");
    await fs.writeFile(
      "./translation-dictionary.json",
      JSON.stringify(dictionary, null, 2),
      "utf-8"
    );

    // 5. 실패한 번역 목록 저장 (선택적)
    if (failedTranslations.length > 0) {
      const failureReport = {
        timestamp: new Date().toISOString(),
        totalKeywords: uniqueKeywords.length,
        failedCount: failedTranslations.length,
        failedKeywords: failedTranslations.sort(),
      };

      await fs.writeFile(
        "./failed-translations.json",
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

// 실행
main();
