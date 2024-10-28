const fs = require("fs").promises;
const axios = require("axios");
require("dotenv").config();

// DeepL API 설정
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

// 고유 키워드 추출 함수
const extractUniqueKeywords = async (inputPath) => {
  try {
    const data = await fs.readFile(inputPath, "utf-8");
    const emojiDb = JSON.parse(data);

    // 모든 키워드를 Set으로 모음
    const uniqueKeywords = new Set();

    // 그룹별로 순회
    for (const group of Object.values(emojiDb)) {
      // 각 이모지별로 순회
      for (const emoji of Object.values(group)) {
        // 키워드 추가
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

    return response.data.translations[0].text.split("\n");
  } catch (error) {
    console.error("Translation error:", error.message);
    throw error;
  }
};

// 번역 사전 생성 함수
const generateDictionary = async (keywords) => {
  const dictionary = {};
  const batchSize = 50; // DeepL API 한 번에 보낼 키워드 수

  console.log(`Total unique keywords: ${keywords.length}`);

  // 배치 처리
  for (let i = 0; i < keywords.length; i += batchSize) {
    const batch = keywords.slice(i, i + batchSize);
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        keywords.length / batchSize
      )}`
    );

    try {
      // 배치 번역
      const translatedTexts = await translateBatch(batch);

      // 각 키워드에 대한 사전 항목 생성
      batch.forEach((keyword, index) => {
        dictionary[keyword.toLowerCase()] = {
          en: keyword,
          ko: translatedTexts[index],
        };
      });

      // API 요청 간격 조절
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(
        `Error in batch ${Math.floor(i / batchSize) + 1}:`,
        error.message
      );
      // 에러 발생한 배치의 키워드들은 원본 유지
      batch.forEach((keyword) => {
        dictionary[keyword.toLowerCase()] = {
          en: keyword,
          ko: keyword, // 에러 시 원본 키워드 사용
        };
      });
    }
  }

  return dictionary;
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
    console.log("uniqueKeywords: ", uniqueKeywords);
    console.log("Unique keywords extracted:", uniqueKeywords.length);

    // 2. 번역 사전 생성
    console.log("Generating translation dictionary...");
    const dictionary = await generateDictionary(uniqueKeywords);

    // 3. 사전 파일 저장
    console.log("Saving dictionary...");
    await fs.writeFile(
      "./translation-dictionary.json",
      JSON.stringify(dictionary, null, 2),
      "utf-8"
    );

    console.log("Dictionary generation completed successfully!");
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  }
};

// 실행
main();
