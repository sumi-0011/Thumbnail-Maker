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

// 새 프롬프트 (분석 기반 2단계 플로우)
import analysisPrompt from "./prompts/분석.md?raw";

export interface TagRecommendation {
  text: string;
  type: "text" | "emoji";
}

/** 하나의 제목 추천 (태그 배열) */
export interface TitleRecommendation {
  tags: TagRecommendation[];
  title_type?: TitleType;
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

// === 새 분석 기반 플로우 타입 ===

/** 제목 타입 (8가지) */
export type TitleType =
  | "narrative"
  | "question"
  | "keyword_stack"
  | "subtitle"
  | "retrospective"
  | "provocative"
  | "highlight"
  | "casual";

/** 분석 결과 */
export interface AnalysisResult {
  intro: {
    hook: string;
    hook_type: "problem" | "curiosity" | "empathy" | "challenge" | "none";
    writing_motivation: string;
  };
  body: {
    core_topic: string;
    key_terms: string[];
    unique_angle: string;
    content_type: string;
  };
  conclusion: {
    takeaway: string;
    emotion: string;
  };
  recommended_types: TitleType[];
  language: "ko" | "en" | "mixed";
}

/** 제목 타입 옵션 (UI 표시용) */
export interface TitleTypeOption {
  id: TitleType;
  labelKo: string;
  labelEn: string;
  descriptionKo: string;
  descriptionEn: string;
}

export const TITLE_TYPE_OPTIONS: TitleTypeOption[] = [
  {
    id: "narrative",
    labelKo: "서술형",
    labelEn: "Narrative",
    descriptionKo: "자연스럽게 이어지는 문장형 제목",
    descriptionEn: "Naturally flowing sentence-style title",
  },
  {
    id: "question",
    labelKo: "질문형",
    labelEn: "Question",
    descriptionKo: "질문으로 호기심을 유발하는 제목",
    descriptionEn: "Question that sparks curiosity",
  },
  {
    id: "keyword_stack",
    labelKo: "키워드 스택",
    labelEn: "Keyword Stack",
    descriptionKo: "핵심 키워드를 나열하는 제목",
    descriptionEn: "Stacked key terms and keywords",
  },
  {
    id: "subtitle",
    labelKo: "부제 포함형",
    labelEn: "With Subtitle",
    descriptionKo: "메인 제목 + 부제로 구성된 제목",
    descriptionEn: "Main title with a descriptive subtitle",
  },
  {
    id: "retrospective",
    labelKo: "회고/감성형",
    labelEn: "Retrospective",
    descriptionKo: "시간과 감성을 담은 회고 제목",
    descriptionEn: "Emotional retrospective with timeline",
  },
  {
    id: "provocative",
    labelKo: "도발/놀라움형",
    labelEn: "Provocative",
    descriptionKo: "의외성으로 시선을 끄는 제목",
    descriptionEn: "Surprising angle that grabs attention",
  },
  {
    id: "highlight",
    labelKo: "핵심 강조형",
    labelEn: "Highlight",
    descriptionKo: "핵심 키워드를 강조하는 제목",
    descriptionEn: "Emphasis on key concepts",
  },
  {
    id: "casual",
    labelKo: "캐주얼/재미형",
    labelEn: "Casual",
    descriptionKo: "친근하고 재미있는 표현의 제목",
    descriptionEn: "Friendly and fun expressions",
  },
];

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
const API_MODEL = "llama-3.3-70b-versatile";

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

// === 새 분석 기반 2단계 플로우 ===

const VALID_TITLE_TYPES: TitleType[] = [
  "narrative", "question", "keyword_stack", "subtitle",
  "retrospective", "provocative", "highlight", "casual",
];

/**
 * 분석 JSON 파싱 헬퍼 - 다양한 형식과 잘린 응답 처리
 */
function parseAnalysisJSON(text: string): AnalysisResult | null {
  console.log("[parseAnalysisJSON] Raw input:", text.slice(0, 200) + "...");

  const cleaned = cleanJsonResponse(text);

  // 방법 1: 정규 JSON 파싱 시도
  try {
    const jsonMatch = cleaned.match(/\{[\s\S]*"intro"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log("[parseAnalysisJSON] Standard parse success");
      return parsed;
    }
  } catch {
    console.warn("[parseAnalysisJSON] Standard parse failed, trying repair...");
  }

  // 방법 2: 잘린 JSON 복구 후 파싱 시도
  try {
    const repaired = tryRepairTruncatedJson(cleaned);
    const parsed = JSON.parse(repaired);
    console.log("[parseAnalysisJSON] Repaired parse success");
    return parsed;
  } catch {
    console.warn("[parseAnalysisJSON] Repair parse failed");
  }

  // 방법 3: 개별 필드 regex 추출
  try {
    const hookMatch = cleaned.match(/"hook"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const coreTopicMatch = cleaned.match(/"core_topic"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const takeawayMatch = cleaned.match(/"takeaway"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    const keyTermsMatch = cleaned.match(/"key_terms"\s*:\s*\[((?:[^\]])*)\]/);
    const recommendedTypesMatch = cleaned.match(/"recommended_types"\s*:\s*\[((?:[^\]])*)\]/);

    if (coreTopicMatch) {
      const keyTerms = keyTermsMatch
        ? keyTermsMatch[1].split(",").map(k => k.trim().replace(/"/g, "")).filter(k => k.length > 0)
        : [];
      const recommendedTypes = recommendedTypesMatch
        ? recommendedTypesMatch[1].split(",").map(k => k.trim().replace(/"/g, "")).filter(k => VALID_TITLE_TYPES.includes(k as TitleType)) as TitleType[]
        : ["narrative", "highlight"] as TitleType[];

      return {
        intro: {
          hook: hookMatch ? hookMatch[1].replace(/\\"/g, '"') : "",
          hook_type: "none",
          writing_motivation: "",
        },
        body: {
          core_topic: coreTopicMatch[1].replace(/\\"/g, '"'),
          key_terms: keyTerms,
          unique_angle: "",
          content_type: "tutorial",
        },
        conclusion: {
          takeaway: takeawayMatch ? takeawayMatch[1].replace(/\\"/g, '"') : "",
          emotion: "neutral",
        },
        recommended_types: recommendedTypes.length > 0 ? recommendedTypes : ["narrative", "highlight"],
        language: "ko",
      };
    }
  } catch {
    console.warn("[parseAnalysisJSON] Regex extraction failed");
  }

  console.error("[parseAnalysisJSON] All parse methods failed");
  return null;
}

/**
 * 분석 결과 검증 - 필수 필드 확인 및 정규화
 */
function validateAnalysisResult(result: AnalysisResult): AnalysisResult {
  const validatedTypes = (result.recommended_types || [])
    .filter(t => VALID_TITLE_TYPES.includes(t))
    .slice(0, 3);

  return {
    intro: {
      hook: result.intro?.hook || "",
      hook_type: result.intro?.hook_type || "none",
      writing_motivation: result.intro?.writing_motivation || "",
    },
    body: {
      core_topic: result.body?.core_topic || "",
      key_terms: Array.isArray(result.body?.key_terms)
        ? result.body.key_terms.filter(k => typeof k === "string" && k.length > 0).slice(0, 5)
        : [],
      unique_angle: result.body?.unique_angle || "",
      content_type: result.body?.content_type || "tutorial",
    },
    conclusion: {
      takeaway: result.conclusion?.takeaway || "",
      emotion: result.conclusion?.emotion || "neutral",
    },
    recommended_types: validatedTypes.length >= 2 ? validatedTypes : ["narrative", "highlight"],
    language: result.language || "ko",
  };
}

/**
 * Step 1 (New): 블로그 내용 구조 분석
 */
export async function analyzeContent(content: string): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_NOT_SET");
  }

  try {
    const trimmedContent = content.slice(0, 2000);
    const prompt = `${analysisPrompt}\n${trimmedContent}`;

    const response = await callGroqAPI(prompt, apiKey, 0.6, 1500);
    console.log("[analyzeContent] Raw response:", response);

    const parsed = parseAnalysisJSON(response);
    if (!parsed) {
      throw new Error("INVALID_ANALYSIS_RESPONSE");
    }

    const validated = validateAnalysisResult(parsed);
    console.log("[analyzeContent] Validated result:", validated);
    return validated;
  } catch (error) {
    console.error("[analyzeContent] Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("ANALYSIS_PARSE_ERROR");
  }
}

/**
 * 타입별 규칙 + 예시 (동적 프롬프트 구성용)
 * 선택된 타입의 규칙만 포함하여 noise를 제거
 */
const TITLE_TYPE_RULES: Record<TitleType, string> = {
  narrative: `## narrative (서술형)
태그를 순서대로 읽으면 하나의 자연스러운 문장이 되는 구조.

규칙:
- 태그 읽는 순서 = 문장 읽는 순서
- 한국어 조사(은/는/이/가/을/를/에서/으로)는 반드시 앞 단어에 붙임
- 4~6개 태그, 각 2~12자
- 분석의 writing_motivation을 문장 흐름으로 변환

좋은 예시:
1) "프론트엔드" → "개발자 관점으로" → "바라보는" → "관심사의 분리" → "✨"
2) "Java" → "동시성 프로그래밍" → "🧑‍💻" → "Thread" → "Future" → "Callable"
3) "브라우저가" → "닫혀도" → "API 요청을" → "안전하게 보내는 법" → "☁️"`,

  question: `## question (질문 후킹형)
독자가 공감할 질문으로 시작해서 답(주제)으로 이어지는 구조.

규칙:
- 첫 1~2개 태그가 질문 (반드시 ? 포함)
- 질문 직후에 이모지(🤔, 💭, ❓) 배치
- 나머지 태그가 답/해결책
- 질문은 독자의 실제 고민 반영 (추상적 질문 금지)
- 4~5개 태그

좋은 예시:
1) "이럴 때 뭐 쓰지?" → "🤔" → "golang" → "패키지 추천" → "📦"
2) "API 요청이 사라진다?" → "🤔" → "keepalive로 해결" → "브라우저 종료 대응"
3) "왜 이렇게 느릴까?" → "💭" → "Context Switching" → "비용 분석"`,

  keyword_stack: `## keyword_stack (키워드 스택형)
핵심 기술 키워드를 시각적으로 나열하여 한눈에 주제 파악.

규칙:
- 기술 용어는 영어 원문 그대로 유지
- 관계어 1~2개로 맥락 부여: "장점", "차이점", "비교", "정리", "활용"
- 가장 중요한 키워드를 첫 번째에 배치
- 5~7개 태그, 각 1~8자

좋은 예시:
1) "Java" → "Kotlin" → "장점" → "차이점" → "Co-Routine" → "확장 함수"
2) "DynamoDB" → "AWS" → "localStack" → "로컬 테스트" → "⚙️"
3) "React" → "Vue" → "Angular" → "비교" → "2024" → "프레임워크 선택"`,

  subtitle: `## subtitle (부제 포함형)
메인 제목 태그들 + 콜론(:)으로 시작하는 부제 태그 1개.

규칙:
- 부제 태그는 반드시 ": "(콜론+공백)으로 시작하는 마지막 태그
- 부제 역할 3가지 중 택 1:
  (a) 구체적 방법: ": keepalive 옵션 활용"
  (b) 핵심 교훈: ": 복잡도를 줄이기 위한 전략"
  (c) 감성 코멘트: ": 그래도 재밌었잖아"
- 메인 태그 3~5개 + 부제 1개, 부제 8~20자

좋은 예시:
1) "브라우저 종료 시" → "☁️" → "안정적으로" → "API 요청하기" → ": keepalive 옵션 활용"
2) "디자인 패턴" → "전략 패턴" → "장단점 분석" → ": 복잡도를 줄이기 위한 선택"
3) "Spring으로도" → "Slack Bot을?!" → "Spring🌱" → ": Slack API 연동기"`,

  retrospective: `## retrospective (회고/감성형)
개인적 경험, 감정, 시간 흐름을 담은 따뜻하거나 솔직한 톤.

규칙:
- 시간 표현으로 시작: 연도, 분기, "N년차", "하반기" 등
- 구체적 경험/활동 키워드 포함 (컨퍼런스명, 프로젝트명)
- 감성적 마무리 또는 솔직한 감상 포함
- 구어체/반말 허용
- 4~6개 태그

좋은 예시:
1) "2024년" → "하반기를 돌아보며" → "디프만" → "SIPE" → "여행" → ": 그래도 재밌었잖아"
2) "2025 회고" → "넥스터즈" → "구름톤" → "바쁘다 바빠" → "😵‍💫"
3) "1년차 개발자의" → "우당탕탕" → "성장기" → "✨" → ": 아직도 모르는 게 많지만"`,

  provocative: `## provocative (도발/놀라움형)
의외성, 놀라움, 반전을 전면에 내세워 클릭 유도.

규칙:
- ?!, ~도?, ~이라고?, 실화? 등 놀라움 표현 사용
- 예상을 깨는 조합 강조
- 첫 태그에서 반전 요소 제시
- 과장 금지 — 실제 내용 기반
- 3~5개 태그

좋은 예시:
1) "Spring으로도" → "Slack Bot을?!" → "Spring🌱" → "Slack API 연동💬"
2) "CSS만으로" → "3D 애니메이션을?!" → "transform 완전정복" → "🤯"
3) "SQL 한 줄로" → "성능 10배?!" → "인덱스의 마법" → "⚡"`,

  highlight: `## highlight (핵심 강조형)
가장 중요한 키워드를 첫 번째에 크게 배치, 나머지가 보충.

규칙:
- 1번째 태그 = 핵심 주제 (가장 큰 글씨)
- 2~3번째 = 세부 주제/범위
- 마지막 = 행동/결론 (가이드, 정리, 비교, 실전)
- 이모지를 키워드 사이에 배치하여 시각적 리듬
- 3~5개 태그

좋은 예시:
1) "CS" → "⚙️" → "Context Switching" → "🔄" → "하드웨어 관점"
2) "React Hooks" → "완벽 가이드" → "실전 예제 포함" → "🚀"
3) "TypeScript" → "🔷" → "제네릭 마스터" → "실전 패턴"`,

  casual: `## casual (캐주얼/재미형)
친근하고 가벼운 톤으로 접근성을 높이는 구조.

규칙:
- 의성어/의태어 활용: 뚝딱뚝딱, 슥슥, 차근차근
- 구어체/반말 OK: ~해보자, ~만들어보는, ~인데요
- 이모지 적극 활용 (2~3개)
- 기술 용어도 친근하게 풀어쓰기
- 3~5개 태그

좋은 예시:
1) "뚝딱뚝딱" → "만들어보는" → "나만의 앱" → "😎" → "처음이라 떨리는 중"
2) "차근차근" → "배워보는" → "Docker" → "🐳" → "생각보다 쉽잖아?"
3) "사이드 프로젝트" → "🐱" → "열심히" → "만들어요!" → "✨"`,
};

/**
 * 분석 결과를 자연어로 포맷 (raw JSON 대신)
 */
function formatAnalysisForPrompt(analysis: AnalysisResult): string {
  const lines: string[] = [];

  if (analysis.intro.hook) {
    lines.push(`도입부 후킹: ${analysis.intro.hook}`);
  }
  if (analysis.intro.hook_type !== "none") {
    lines.push(`후킹 유형: ${analysis.intro.hook_type}`);
  }
  if (analysis.intro.writing_motivation) {
    lines.push(`글쓴 동기: ${analysis.intro.writing_motivation}`);
  }
  lines.push(`핵심 주제: ${analysis.body.core_topic}`);
  if (analysis.body.key_terms.length > 0) {
    lines.push(`키워드: ${analysis.body.key_terms.join(", ")}`);
  }
  if (analysis.body.unique_angle) {
    lines.push(`차별점: ${analysis.body.unique_angle}`);
  }
  lines.push(`글 유형: ${analysis.body.content_type}`);
  if (analysis.conclusion.takeaway) {
    lines.push(`핵심 교훈: ${analysis.conclusion.takeaway}`);
  }
  if (analysis.conclusion.emotion) {
    lines.push(`마무리 톤: ${analysis.conclusion.emotion}`);
  }

  return lines.join("\n");
}

/**
 * 선택된 타입에 맞는 집중 프롬프트 생성
 */
function buildTitlePrompt(analysis: AnalysisResult, titleType: TitleType): string {
  const typeRule = TITLE_TYPE_RULES[titleType];
  const analysisText = formatAnalysisForPrompt(analysis);

  return `You are a blog thumbnail title generator. Generate exactly 3 title variations.

<critical_rules>
- OUTPUT PURE JSON ONLY
- NO markdown code blocks (no \`\`\`json or \`\`\`)
- NO explanations before or after JSON
- Start response with { and end with }
</critical_rules>

<blog_analysis>
${analysisText}
</blog_analysis>

<selected_style>
${typeRule}
</selected_style>

<variation_guide>
3개 제목은 서로 다른 관점/톤이어야 한다:
- 제목 1: 분석의 core_topic을 중심으로
- 제목 2: 분석의 hook 또는 unique_angle을 활용
- 제목 3: 분석의 takeaway 또는 key_terms를 활용
</variation_guide>

<common_rules>
- 기술 용어(React, Docker, API 등)는 영어 유지
- 이모지: 독립 태그 또는 텍스트 뒤 붙이기. 최대 2~3개
- 태그 길이: 한국어 2~12자, 영어/혼용 2~16자
- 블로그 언어: ${analysis.language}
</common_rules>

<format>
{"titles":[{"tags":[{"text":"내용","type":"text"},{"text":"🤔","type":"emoji"}],"title_type":"${titleType}"},{"tags":[...],"title_type":"${titleType}"},{"tags":[...],"title_type":"${titleType}"}],"language":"${analysis.language}"}
</format>`;
}

/**
 * Step 2 (New): 분석 결과 + 선택된 제목 타입으로 제목 생성
 */
export async function generateTitlesFromAnalysis(
  analysis: AnalysisResult,
  titleType: TitleType
): Promise<GeminiResponse> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_NOT_SET");
  }

  try {
    const prompt = buildTitlePrompt(analysis, titleType);
    console.log("[generateTitlesFromAnalysis] Prompt length:", prompt.length);

    const response = await callGroqAPI(prompt, apiKey, 0.75, 1500);
    const parsed = parseJSON(response);

    if (!Array.isArray(parsed.titles) || parsed.titles.length === 0) {
      throw new Error("INVALID_RESPONSE_STRUCTURE");
    }

    const normalizedTitles: TitleRecommendation[] = parsed.titles
      .slice(0, 3)
      .map((title) => {
        const titleObj = title as { tags?: unknown[]; title_type?: string };
        const tags = Array.isArray(titleObj.tags) ? titleObj.tags : [];
        return {
          tags: normalizeTags(tags),
          title_type: VALID_TITLE_TYPES.includes(titleObj.title_type as TitleType)
            ? (titleObj.title_type as TitleType)
            : titleType,
        };
      })
      .filter((title) => title.tags.length > 0);

    console.log("[generateTitlesFromAnalysis] Result:", normalizedTitles);
    return {
      titles: normalizedTitles,
      language: (parsed.language as "ko" | "en" | "mixed") || "mixed",
    };
  } catch (error) {
    console.error("[generateTitlesFromAnalysis] Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("JSON_PARSE_ERROR");
  }
}
