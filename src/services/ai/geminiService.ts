// Prompt MD 파일 import (RAG 방식)
import basePrompt from "./prompts/base.md?raw";
import summaryPrompt from "./prompts/summary.md?raw";
import narrativePrompt from "./prompts/narrative.md?raw";
import highlightPrompt from "./prompts/highlight.md?raw";
import minimalPrompt from "./prompts/minimal.md?raw";
import creativePrompt from "./prompts/creative.md?raw";
import technicalPrompt from "./prompts/technical.md?raw";
import questionPrompt from "./prompts/question.md?raw";
import examplesPrompt from "./prompts/examples.md?raw";

export interface TagRecommendation {
  text: string;
  type: "text" | "emoji";
}

/** 하나의 제목 추천 (태그 배열) */
export interface TitleRecommendation {
  tags: TagRecommendation[];
}

/** AI 응답: 3개의 제목 추천 */
export interface GeminiResponse {
  titles: TitleRecommendation[];
  language: "ko" | "en" | "mixed";
}

/** 요약 항목 (요약 + 키워드) */
export interface SummaryItem {
  summary: string;
  keywords: string[];
}

/** AI 응답: 요약 목록 */
export interface SummaryResponse {
  items: SummaryItem[];
  language: "ko" | "en" | "mixed";
}

export type TagStyle =
  | "narrative"
  | "highlight"
  | "minimal"
  | "creative"
  | "technical"
  | "question";

export interface TagStyleOption {
  id: TagStyle;
  labelKo: string;
  labelEn: string;
  descriptionKo: string;
  descriptionEn: string;
  examplesKo: string[];
  examplesEn: string[];
}

export const TAG_STYLE_OPTIONS: TagStyleOption[] = [
  {
    id: "narrative",
    labelKo: "서술형",
    labelEn: "Narrative",
    descriptionKo: "제목을 자연스럽게 이어지는 조각으로 분리",
    descriptionEn: "Break title into naturally flowing pieces",
    examplesKo: [
      "프론트엔드",
      "개발자 관점으로",
      "바라보는",
      "관심사의 분리",
      "✨",
    ],
    examplesEn: [
      "Frontend",
      "Developer's View on",
      "Separation of",
      "Concerns",
      "✨",
    ],
  },
  {
    id: "highlight",
    labelKo: "강조형",
    labelEn: "Highlight",
    descriptionKo: "핵심 키워드와 부가 설명을 분리",
    descriptionEn: "Separate key concepts from supporting text",
    examplesKo: ["React Hooks", "완벽 가이드", "실전 예제 포함", "🚀"],
    examplesEn: ["React Hooks", "Complete Guide", "With Examples", "🚀"],
  },
  {
    id: "minimal",
    labelKo: "미니멀",
    labelEn: "Minimal",
    descriptionKo: "핵심만 짧고 간결하게",
    descriptionEn: "Short and concise core points only",
    examplesKo: ["TypeScript", "입문", "가이드", "📘"],
    examplesEn: ["TypeScript", "Basics", "Guide", "📘"],
  },
  {
    id: "creative",
    labelKo: "캐주얼",
    labelEn: "Casual",
    descriptionKo: "친근하고 재미있는 표현으로",
    descriptionEn: "Friendly and fun expressions",
    examplesKo: ["뚝딱뚝딱", "만들어보는", "나만의 앱", "😎"],
    examplesEn: ["Let's Build", "Your Own", "Cool App", "😎"],
  },
  {
    id: "technical",
    labelKo: "기술형",
    labelEn: "Technical",
    descriptionKo: "기술 용어와 버전을 명확하게",
    descriptionEn: "Clear technical terms and versions",
    examplesKo: ["Next.js 14", "App Router", "마이그레이션", "⚙️"],
    examplesEn: ["Next.js 14", "App Router", "Migration", "⚙️"],
  },
  {
    id: "question",
    labelKo: "질문형",
    labelEn: "Question",
    descriptionKo: "질문과 답변 구조로 호기심 유발",
    descriptionEn: "Question and answer format to spark curiosity",
    examplesKo: ["이럴 때 뭐 쓰지?", "🤔", "golang 패키지 추천", "📦"],
    examplesEn: ["What to use?", "🤔", "Package Recommendations", "📦"],
  },
];

// API 설정
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_MODEL = "llama-3.1-70b-versatile";

// 스타일별 프롬프트 매핑
const STYLE_PROMPTS: Record<TagStyle, string> = {
  narrative: narrativePrompt,
  highlight: highlightPrompt,
  minimal: minimalPrompt,
  creative: creativePrompt,
  technical: technicalPrompt,
  question: questionPrompt,
};

/**
 * 요약 생성 프롬프트
 */
const createSummaryPrompt = (content: string): string => {
  return `${summaryPrompt}

## 블로그 내용
${content}`;
};

/**
 * 요약 기반 태그 생성 프롬프트
 * style.md가 핵심 (예시 포함)
 */
const createTagFromSummaryPrompt = (
  selectedSummary: string,
  style: TagStyle
): string => {
  const stylePrompt = STYLE_PROMPTS[style];

  return `${stylePrompt}

---

이제 아래 주제로 위 예시들과 동일한 형식의 JSON을 생성하세요.

주제: "${selectedSummary}"`;
};

/**
 * RAG 방식으로 프롬프트 조합 (기존 - 전체 내용 기반)
 * base.md + style.md + examples.md + 블로그 내용
 */
const createTagPrompt = (coreContent: string, style: TagStyle): string => {
  const stylePrompt = STYLE_PROMPTS[style];

  return `${basePrompt}

## 스타일 지침
${stylePrompt}

## 참고 예시
${examplesPrompt}

## 블로그 내용
${coreContent}`;
};

// Groq API 호출 헬퍼 (OpenAI 호환 형식)
async function callGroqAPI(
  prompt: string,
  apiKey: string,
  temperature = 0.7,
  maxTokens = 512
): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: API_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("[Groq API Error]", {
      status: response.status,
      error,
    });
    if (response.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    if (response.status === 401) {
      throw new Error("INVALID_API_KEY");
    }
    throw new Error(error.error?.message || "GROQ_API_ERROR");
  }

  const data = await response.json();
  console.log("[Groq API Response]", {
    finishReason: data.choices?.[0]?.finish_reason,
    usage: data.usage,
  });

  const textContent = data.choices?.[0]?.message?.content;
  if (!textContent) {
    console.error("[Groq API] Empty response", data);
    throw new Error("EMPTY_RESPONSE");
  }

  return textContent;
}

// JSON 파싱 헬퍼 - titles 형식 처리
function parseJSON(text: string): { titles: unknown[]; language: string } {
  console.log("[parseJSON] Raw AI response:", text);

  try {
    // {"titles": [...]} 형식 시도
    const titlesMatch = text.match(/\{[\s\S]*"titles"[\s\S]*\}/);
    if (titlesMatch) {
      const parsed = JSON.parse(titlesMatch[0]);
      console.log("[parseJSON] Parsed titles format:", parsed);
      return parsed;
    }

    // 기존 {"tags": [...]} 형식도 지원 (하위 호환)
    const tagsMatch = text.match(/\{[\s\S]*"tags"[\s\S]*\}/);
    if (tagsMatch) {
      const parsed = JSON.parse(tagsMatch[0]);
      console.log("[parseJSON] Parsed tags format:", parsed);
      // 단일 tags를 titles 형식으로 변환
      return {
        titles: [{ tags: parsed.tags }],
        language: parsed.language || "ko",
      };
    }

    // 배열 형식 [[...], [...], [...]] 시도
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      const parsed = JSON.parse(arrayMatch[0]);
      console.log("[parseJSON] Parsed array format:", parsed);
      // 배열의 첫 번째 요소가 배열이면 다중 제목
      if (Array.isArray(parsed[0])) {
        return {
          titles: parsed.map((tags: unknown[]) => ({ tags })),
          language: "ko",
        };
      }
      // 단일 배열이면 하나의 제목
      return { titles: [{ tags: parsed }], language: "ko" };
    }

    console.error("[parseJSON] No valid JSON found in response");
    throw new Error("INVALID_JSON_RESPONSE");
  } catch (error) {
    console.error("[parseJSON] Parse error:", error);
    console.error("[parseJSON] Failed text:", text);
    throw error;
  }
}

/** 태그 배열 정규화 헬퍼 */
function normalizeTags(tags: unknown[]): TagRecommendation[] {
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

  return tags.flatMap((tag) => {
    // 이미 객체 형식인 경우
    if (typeof tag === "object" && tag !== null && "text" in tag) {
      const tagObj = tag as { text: string; type?: string };
      return [
        {
          text: String(tagObj.text).trim(),
          type: (tagObj.type === "emoji" ? "emoji" : "text") as
            | "text"
            | "emoji",
        },
      ];
    }

    // 문자열인 경우 - 이모지가 포함되어 있으면 분리
    const tagStr = String(tag).trim();
    const emojis = tagStr.match(emojiRegex);

    if (emojis && emojis.length > 0) {
      const textPart = tagStr.replace(emojiRegex, "").trim();
      const result: TagRecommendation[] = [];

      if (textPart) {
        result.push({ text: textPart, type: "text" as const });
      }
      emojis.forEach((emoji) => {
        result.push({ text: emoji, type: "emoji" as const });
      });

      return result;
    }

    // 순수 텍스트
    return [{ text: tagStr, type: "text" as const }];
  });
}

/**
 * AI로 3개의 제목 추천 생성
 * - Groq API (llama-3.1-8b-instant) 사용
 * - 내용은 최대 1500자로 제한
 */
export async function generateTagsWithGemini(
  content: string,
  style: TagStyle = "narrative"
): Promise<GeminiResponse> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY_NOT_SET");
  }

  try {
    // 내용을 1500자로 제한 (토큰 절약)
    const trimmedContent = content.slice(0, 1500);
    const prompt = createTagPrompt(trimmedContent, style);
    const temperature = style === "creative" ? 0.9 : 0.8;

    const response = await callGroqAPI(prompt, apiKey, temperature);
    const parsed = parseJSON(response);

    // titles 결과 검증
    if (!Array.isArray(parsed.titles) || parsed.titles.length === 0) {
      throw new Error("INVALID_RESPONSE_STRUCTURE");
    }

    // 각 제목의 태그 정규화
    const normalizedTitles: TitleRecommendation[] = parsed.titles
      .slice(0, 3) // 최대 3개
      .map((title) => {
        const titleObj = title as { tags?: unknown[] };
        const tags = Array.isArray(titleObj.tags) ? titleObj.tags : [];
        return { tags: normalizeTags(tags) };
      })
      .filter((title) => title.tags.length > 0); // 빈 제목 제거

    return {
      titles: normalizedTitles,
      language: (parsed.language as "ko" | "en" | "mixed") || "mixed",
    };
  } catch (error) {
    console.error("[generateTagsWithGemini] Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("JSON_PARSE_ERROR");
  }
}

/**
 * 마크다운 코드 블록 및 불필요한 텍스트 제거
 */
function cleanJsonResponse(text: string): string {
  let cleaned = text;

  // 마크다운 코드 블록 제거 (```json ... ``` 또는 ``` ... ```)
  cleaned = cleaned.replace(/```(?:json)?\s*([\s\S]*?)```/g, "$1");

  // 앞뒤 공백 및 줄바꿈 제거
  cleaned = cleaned.trim();

  // JSON 시작 전의 텍스트 제거 (예: "Here is the JSON:" 등)
  const jsonStart = cleaned.indexOf("{");
  if (jsonStart > 0) {
    cleaned = cleaned.slice(jsonStart);
  }

  return cleaned;
}

/**
 * 잘린 JSON 복구 시도
 */
function tryRepairTruncatedJson(text: string): string {
  let repaired = text.trim();

  // 마지막 완전한 item 이후의 불완전한 부분 제거
  const lastCompleteItem = repaired.lastIndexOf("}");
  if (lastCompleteItem > 0) {
    // } 이후에 불완전한 텍스트가 있으면 제거
    const afterBrace = repaired.slice(lastCompleteItem + 1).trim();
    if (afterBrace && !afterBrace.startsWith("]") && !afterBrace.startsWith(",")) {
      repaired = repaired.slice(0, lastCompleteItem + 1);
    }
  }

  // 닫는 괄호 보완
  const openBrackets = (repaired.match(/\[/g) || []).length;
  const closeBrackets = (repaired.match(/\]/g) || []).length;
  const openBraces = (repaired.match(/\{/g) || []).length;
  const closeBraces = (repaired.match(/\}/g) || []).length;

  // 배열 닫기
  for (let i = 0; i < openBrackets - closeBrackets; i++) {
    repaired += "]";
  }

  // 객체 닫기
  for (let i = 0; i < openBraces - closeBraces; i++) {
    repaired += "}";
  }

  return repaired;
}

/**
 * 요약 JSON 파싱 헬퍼 - 다양한 형식과 잘린 응답 처리
 */
function parseSummaryJSON(
  text: string
): { items: SummaryItem[]; language: string } | null {
  console.log("[parseSummaryJSON] Raw input:", text.slice(0, 200) + "...");

  // Step 1: 마크다운 및 불필요한 텍스트 제거
  let cleaned = cleanJsonResponse(text);
  console.log("[parseSummaryJSON] After cleaning:", cleaned.slice(0, 200) + "...");

  // 방법 1: 정규 JSON 파싱 시도
  try {
    const jsonMatch = cleaned.match(/\{[\s\S]*"items"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log("[parseSummaryJSON] Standard parse success:", parsed);
      return parsed;
    }
  } catch (e) {
    console.warn("[parseSummaryJSON] Standard parse failed, trying repair...");
  }

  // 방법 2: 잘린 JSON 복구 후 파싱 시도
  try {
    const repaired = tryRepairTruncatedJson(cleaned);
    console.log("[parseSummaryJSON] Repaired JSON:", repaired.slice(-100));
    const parsed = JSON.parse(repaired);
    console.log("[parseSummaryJSON] Repaired parse success:", parsed);
    return parsed;
  } catch (e) {
    console.warn("[parseSummaryJSON] Repair parse failed:", e);
  }

  // 방법 3: 개별 item 추출 시도 (이스케이프 문자 처리 개선)
  try {
    const itemsMatch = cleaned.match(/"items"\s*:\s*\[([\s\S]*)/);
    if (itemsMatch) {
      const itemsContent = itemsMatch[1];
      // 이스케이프된 따옴표와 줄바꿈을 처리하는 개선된 정규식
      const itemRegex =
        /\{\s*"summary"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"keywords"\s*:\s*\[((?:[^\]])*)\]\s*\}/g;
      const items: SummaryItem[] = [];
      let match;

      while ((match = itemRegex.exec(itemsContent)) !== null) {
        const summary = match[1].replace(/\\"/g, '"').replace(/\\n/g, " ");
        const keywordsStr = match[2];
        const keywords = keywordsStr
          .split(",")
          .map((k) => k.trim().replace(/"/g, "").replace(/\\"/g, '"'))
          .filter((k) => k.length > 0);

        items.push({ summary, keywords });
      }

      if (items.length > 0) {
        console.log("[parseSummaryJSON] Extracted items via regex:", items);
        return { items, language: "ko" };
      }
    }
  } catch (e) {
    console.warn("[parseSummaryJSON] Regex extraction failed:", e);
  }

  // 방법 4: summary만이라도 추출 (이스케이프 처리 개선)
  try {
    const summaryRegex = /"summary"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
    const items: SummaryItem[] = [];
    let match;

    while ((match = summaryRegex.exec(cleaned)) !== null) {
      const summary = match[1].replace(/\\"/g, '"').replace(/\\n/g, " ");
      items.push({ summary, keywords: [] });
    }

    if (items.length > 0) {
      console.log("[parseSummaryJSON] Extracted summaries only:", items);
      return { items, language: "ko" };
    }
  } catch (e) {
    console.warn("[parseSummaryJSON] Summary-only extraction failed:", e);
  }

  console.error("[parseSummaryJSON] All parse methods failed");
  return null;
}

/**
 * 요약 응답 검증 - 품질 기준에 맞지 않는 항목 필터링
 */
function validateSummaryResponse(items: SummaryItem[]): SummaryItem[] {
  const MIN_SUMMARY_LENGTH = 30; // 최소 30자 (너무 짧은 요약 필터)
  const MAX_SUMMARY_LENGTH = 200; // 최대 200자 (너무 긴 요약 필터)
  const MIN_KEYWORDS = 1; // 최소 1개 키워드
  const MAX_KEYWORDS = 5; // 최대 5개 키워드

  return items
    .map((item) => {
      // 키워드 정제 - 빈 문자열 및 너무 긴 키워드 제거
      const validKeywords = item.keywords
        .filter((k) => k.length >= 2 && k.length <= 30)
        .slice(0, MAX_KEYWORDS);

      return {
        summary: item.summary.trim(),
        keywords: validKeywords.length >= MIN_KEYWORDS ? validKeywords : [],
      };
    })
    .filter((item) => {
      const len = item.summary.length;
      const isValidLength = len >= MIN_SUMMARY_LENGTH && len <= MAX_SUMMARY_LENGTH;

      if (!isValidLength) {
        console.warn(
          `[validateSummaryResponse] Filtered out: "${item.summary.slice(0, 50)}..." (length: ${len})`
        );
      }

      return isValidLength;
    });
}

/**
 * Step 1: 블로그 내용에서 4-5개 요약 + 키워드 생성
 */
export async function generateSummaries(
  content: string
): Promise<SummaryResponse> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_NOT_SET");
  }

  try {
    const trimmedContent = content.slice(0, 2000);
    const prompt = createSummaryPrompt(trimmedContent);

    // 70b 모델은 더 많은 토큰 지원
    const response = await callGroqAPI(prompt, apiKey, 0.7, 2000);
    console.log("[generateSummaries] Raw response:", response);

    // JSON 파싱 시도
    const parsed = parseSummaryJSON(response);
    if (!parsed || parsed.items.length === 0) {
      console.error("[generateSummaries] No valid JSON found in response");
      throw new Error("INVALID_SUMMARY_RESPONSE");
    }

    console.log("[generateSummaries] Parsed items:", parsed);

    // 각 아이템 정규화
    const normalizedItems: SummaryItem[] = parsed.items
      .slice(0, 5)
      .map((item) => ({
        summary: item.summary || "",
        keywords: Array.isArray(item.keywords) ? item.keywords : [],
      }))
      .filter((item) => item.summary.length > 0);

    // 품질 검증 적용
    const validatedItems = validateSummaryResponse(normalizedItems);
    console.log("[generateSummaries] Validated items:", validatedItems);

    // 검증 후에도 결과가 없으면 원본 반환 (fallback)
    const finalItems = validatedItems.length > 0 ? validatedItems : normalizedItems;

    return {
      items: finalItems,
      language: (parsed.language as "ko" | "en" | "mixed") || "ko",
    };
  } catch (error) {
    console.error("[generateSummaries] Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("SUMMARY_PARSE_ERROR");
  }
}

/**
 * Step 2: 선택된 요약을 바탕으로 태그 생성
 */
export async function generateTagsFromSummary(
  selectedSummary: string,
  style: TagStyle = "question"
): Promise<GeminiResponse> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_NOT_SET");
  }

  try {
    const prompt = createTagFromSummaryPrompt(selectedSummary, style);
    console.log("[generateTagsFromSummary] Prompt:", prompt);
    const temperature = style === "creative" ? 0.9 : 0.8;

    const response = await callGroqAPI(prompt, apiKey, temperature);
    const parsed = parseJSON(response);

    if (!Array.isArray(parsed.titles) || parsed.titles.length === 0) {
      console.error("[generateTagsFromSummary] Invalid structure:", parsed);
      throw new Error("INVALID_RESPONSE_STRUCTURE");
    }

    const normalizedTitles: TitleRecommendation[] = parsed.titles
      .slice(0, 5) // 최대 5개
      .map((title) => {
        const titleObj = title as { tags?: unknown[] };
        const tags = Array.isArray(titleObj.tags) ? titleObj.tags : [];
        return { tags: normalizeTags(tags) };
      })
      .filter((title) => title.tags.length > 0);

    console.log("[generateTagsFromSummary] Result:", normalizedTitles);
    return {
      titles: normalizedTitles,
      language: (parsed.language as "ko" | "en" | "mixed") || "mixed",
    };
  } catch (error) {
    console.error("[generateTagsFromSummary] Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("JSON_PARSE_ERROR");
  }
}
