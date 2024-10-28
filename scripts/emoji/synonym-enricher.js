const fs = require("fs").promises;
const axios = require("axios");

// 동의어 캐시
const synonymsCache = new Map();

// 동의어 캐시 파일 관리
const CACHE_FILE = "./synonyms-cache.json";

// 캐시 파일 로드
const loadCache = async () => {
  try {
    const data = await fs.readFile(CACHE_FILE, "utf-8");
    const cache = JSON.parse(data);
    Object.entries(cache).forEach(([key, value]) => {
      synonymsCache.set(key, value);
    });
    console.log(`Loaded ${synonymsCache.size} cached items`);
  } catch (error) {
    console.log("No existing cache file found. Starting with empty cache.");
  }
};

// 캐시 파일 저장
const saveCache = async () => {
  try {
    const cache = Object.fromEntries(synonymsCache);
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
    console.log(`Saved ${synonymsCache.size} items to cache`);
  } catch (error) {
    console.error("Error saving cache:", error);
  }
};

// Datamuse API를 사용한 동의어 검색 함수
const getSynonyms = async (word) => {
  // 소문자로 정규화
  const normalizedWord = word.toLowerCase();

  // 캐시 확인
  if (synonymsCache.has(normalizedWord)) {
    console.log(`Cache hit for: ${normalizedWord}`);
    return synonymsCache.get(normalizedWord);
  }

  try {
    console.log(`Fetching synonyms for: ${normalizedWord}`);
    const response = await axios.get(
      `https://api.datamuse.com/words?rel_syn=${normalizedWord}`
    );

    // 상위 5개 동의어만 선택하고 단일 단어만 필터링
    const synonyms = response.data
      .slice(0, 5)
      .map((item) => item.word)
      .filter((syn) => syn.indexOf(" ") === -1);

    // 캐시에 저장
    synonymsCache.set(normalizedWord, synonyms);

    return synonyms;
  } catch (error) {
    console.error(
      `Error getting synonyms for ${normalizedWord}:`,
      error.message
    );
    synonymsCache.set(normalizedWord, []); // 빈 배열도 캐시
    return [];
  }
};

// 딜레이 함수
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 메인 처리 함수
const findSynonymsForEmojis = async (inputPath, outputPath) => {
  try {
    // 캐시 로드
    await loadCache();

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

        const enrichedKeywords = [];
        const processedWords = new Set();

        for (const keyword of emoji.keywords) {
          const words = keyword.split(" ");

          for (const word of words) {
            const normalizedWord = word.toLowerCase();
            if (processedWords.has(normalizedWord)) continue;
            processedWords.add(normalizedWord);

            const synonyms = await getSynonyms(normalizedWord);
            if (synonyms.length > 0) {
              enrichedKeywords.push(...synonyms);
            }

            // API 호출한 경우에만 딜레이 적용
            if (!synonymsCache.has(normalizedWord)) {
              await delay(100);
            }
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
          originalKeywords: emoji.keywords,
        };
      }
    }

    // 결과 저장
    await fs.writeFile(
      outputPath,
      JSON.stringify(enrichedDb, null, 2),
      "utf-8"
    );

    // 캐시 저장
    await saveCache();

    console.log("\nSynonym finding completed successfully!");

    // 캐시 통계 출력
    console.log(`\nCache statistics:`);
    console.log(`Total cached items: ${synonymsCache.size}`);
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
