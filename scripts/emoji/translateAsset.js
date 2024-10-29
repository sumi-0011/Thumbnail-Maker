import { promises as fs } from "fs";
import chalk from "chalk";
import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { loadJson, saveJson } from "../common/jsonFile.js";

// 현재 파일의 디렉토리 경로 구하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const CACHE_FILE = join(__dirname, "assets", "translation-cache.json");
const FAILED_FILE = join(__dirname, "assets", "failed-translations.json");
const DIRECT_FILE = join(__dirname, "assets", "direct-translations.json");

let cache = null;
let failed = null;
let direct = null;

// 캐시 로드 함수
const loadCache = async () => {
  // 새로운 객체 반환
  if (cache !== null) return { ...cache };

  try {
    cache = await loadJson(CACHE_FILE);
    console.log(`Loaded ${Object.keys(cache).length} cached translations`);
    return { ...cache };
  } catch (error) {
    console.log("No existing cache found, starting with empty cache");
    cache = {};
    return cache;
  }
};

// 실패 기록 로드 함수
const loadFailedTranslations = async () => {
  if (failed !== null) return failed;

  try {
    const failedData = await loadJson(FAILED_FILE);
    failed = new Set(failedData.failedKeywords);
    console.log(`Loaded ${failed.size} previously failed translations`);
    return failed;
  } catch (error) {
    console.log("No previous failure record found");
    failed = new Set();
    return failed;
  }
};

// 직접 매핑한 번역 로드 함수 추가
const loadDirectTranslations = async () => {
  if (direct !== null) return direct;

  try {
    direct = await loadJson(DIRECT_FILE);
    console.log(`Loaded ${Object.keys(direct).length} direct translations`);
    return direct;
  } catch (error) {
    console.log("No direct translations found");
    direct = {};
    return direct;
  }
};

const loadAllAssets = async () => {
  cache = await loadCache();
  failed = await loadFailedTranslations();
  direct = await loadDirectTranslations();
};

export const getTranslateKeywordInfo = async (keywords) => {
  await loadAllAssets();

  const directKeywords = keywords.filter((keyword) => direct[keyword]);
  const cachedKeywords = keywords.filter((keyword) => cache[keyword]);
  const skipKeywords = keywords.filter((keyword) => failed.has(keyword));

  const needTranslation = keywords.filter(
    (keyword) => !cache[keyword] && !failed.has(keyword) && !direct[keyword]
  );

  return {
    directKeywords,
    cachedKeywords,
    skipKeywords,
    needTranslation,
  };
};

export const getDirectTranslations = async () => {
  return await loadDirectTranslations();
};

export const getDirectTranslationCount = async (dictionary) => {
  const directTranslations = await loadDirectTranslations();

  return Object.keys(dictionary).filter((key) => {
    if (key in directTranslations) {
      const dictEntry = dictionary[key];
      return directTranslations[key] === dictEntry.ko;
    }
    return false;
  }).length;
};

export const getCache = async () => {
  return await loadCache();
};

export const getCacheTranslationCount = async (dictionary) => {
  const cache = await loadCache();

  return Object.keys(dictionary).filter((key) => {
    const cacheEntry = cache?.[key];
    const dictEntry = dictionary?.[key];
    // 캐시와 사전 모두에 존재하고, 번역 결과가 동일한지 확인
    return (
      cacheEntry &&
      dictEntry &&
      cacheEntry.ko === dictEntry.ko &&
      cacheEntry.en === dictEntry.en
    );
  }).length;
};

export const saveCache = async (cache) => {
  try {
    await saveJson(CACHE_FILE, cache);
    console.log(
      chalk.green(`Saved ${Object.keys(cache).length} translations to cache`)
    );
  } catch (error) {
    console.error(chalk.red("Error saving cache:"), error);
  }
};

export const saveFailedFile = async (failureReport) => {
  await fs.writeFile(
    FAILED_FILE,
    JSON.stringify(failureReport, null, 2),
    "utf-8"
  );
};
