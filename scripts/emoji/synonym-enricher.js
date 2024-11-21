const fs = require("fs").promises;
const axios = require("axios");

// Datamuse API를 사용한 동의어 검색 함수
const getSynonyms = async (word) => {
  try {
    const response = await axios.get(
      `https://api.datamuse.com/words?rel_syn=${word}`
    );
    // 상위 5개 동의어만 선택
    return response.data
      .slice(0, 5)
      .map((item) => item.word)
      .filter((syn) => syn.indexOf(" ") === -1); // 단일 단어만 선택
  } catch (error) {
    console.error(`Error getting synonyms for ${word}:`, error.message);
    return [];
  }
};

// 딜레이 함수
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 메인 처리 함수
const findSynonymsForEmojis = async (inputPath, outputPath) => {
  try {
    // 원본 데이터 읽기
    const data = await fs.readFile(inputPath, "utf-8");
    const emojiDb = JSON.parse(data);
    const enrichedDb = {};

    // 각 그룹 처리
    for (const [groupName, group] of Object.entries(emojiDb)) {
      console.log(`\nProcessing group: ${groupName}`);
      enrichedDb[groupName] = {};

      // 각 이모지 처리
      for (const [emojiName, emoji] of Object.entries(group)) {
        console.log(`Processing emoji: ${emojiName}`);

        // 각 키워드에 대한 동의어 찾기
        const enrichedKeywords = [];
        const processedWords = new Set(); // 중복 처리 방지

        for (const keyword of emoji.keywords) {
          // 복합 키워드 처리 (예: "black flag")
          const words = keyword.split(" ");

          for (const word of words) {
            // 이미 처리된 단어는 건너뛰기
            if (processedWords.has(word.toLowerCase())) continue;
            processedWords.add(word.toLowerCase());

            const synonyms = await getSynonyms(word);
            if (synonyms.length > 0) {
              enrichedKeywords.push(...synonyms);
            }

            // API 요청 간격 조절
            await delay(100);
          }
        }

        // 원본 키워드와 동의어를 합치고 중복 제거
        const allKeywords = [
          ...new Set([...emoji.keywords, ...enrichedKeywords]),
        ];

        // 결과 저장
        enrichedDb[groupName][emojiName] = {
          ...emoji,
          keywords: allKeywords,
          originalKeywords: emoji.keywords, // 원본 키워드도 보관
        };
      }
    }

    // 결과 저장
    await fs.writeFile(
      outputPath,
      JSON.stringify(enrichedDb, null, 2),
      "utf-8"
    );

    console.log("\nSynonym finding completed successfully!");
  } catch (error) {
    console.error("Error processing emojis:", error);
    throw error;
  }
};

// 실행
const main = async () => {
  try {
    await findSynonymsForEmojis("./input-emoji.json", "./enriched-emoji.json");
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  }
};

main();
