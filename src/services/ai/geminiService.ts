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
    examplesKo: ["프론트엔드", "개발자 관점으로", "바라보는", "관심사의 분리", "✨"],
    examplesEn: ["Frontend", "Developer's View on", "Separation of", "Concerns", "✨"],
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

// Groq API 설정 (무료, 빠름)
// API 키 발급: https://console.groq.com/keys
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant"; // 빠르고 가벼운 모델


const STYLE_PROMPTS: Record<TagStyle, string> = {
  narrative: `서술형: 제목을 자연스럽게 흐르는 조각으로. 조사는 앞 단어에 붙임.
예: ["프론트엔드", "개발자 관점으로", "바라보는", "✨", "관심사의 분리"]`,

  highlight: `강조형: 핵심 키워드 강조, 설명 문구 추가.
예: ["React Hooks", "🎯", "완벽 가이드", "실전 예제"]`,

  minimal: `미니멀: 핵심만 짧게. 각 조각 1-3단어.
예: ["TypeScript", "📘", "타입 기초"]`,

  creative: `캐주얼: 의성어/구어체 OK. 이모지 중간에!
예: ["사이드 프로젝트", "🐱", "뚝딱뚝딱", "만들어요!", "😎"]`,

  technical: `기술형: 버전번호, 정식 용어 사용.
예: ["Next.js 14", "⚙️", "App Router", "마이그레이션"]`,

  question: `질문형: 질문 + 🤔 + 답변 구조.
예: ["이럴 때 뭐 쓰지?", "🤔", "golang 패키지", "📦"]`,
};

// 3개 제목 추천 프롬프트
const createTagPrompt = (coreContent: string, style: TagStyle): string => {
  const styleInstruction = STYLE_PROMPTS[style];

  return `블로그 썸네일용 제목을 3가지 버전으로 추천해줘.

역할: 블로그 내용 분석 → 매력적인 제목 3개 생성 → 각 제목을 태그 조각으로 분리

${styleInstruction}

규칙:
- 3개의 서로 다른 제목 추천
- 각 제목: 4-7개 조각 (텍스트+이모지)
- 이모지(🤔💭⚙️🚀📦✨🔥🎯😎🐱📘)를 태그 사이에 1-2개 배치
- 제목을 읽을 때 자연스럽게 이어지도록

예시:
제목1: "프론트엔드" + "개발자 관점으로" + "바라보는" + "✨" + "관심사의 분리"
제목2: "관심사 분리" + "🎯" + "프론트엔드" + "폴더 구조 가이드"
제목3: "좋은 코드란?" + "🤔" + "관심사 분리로" + "알아보기"

JSON만 출력:
{"titles":[{"tags":[{"text":"텍스트","type":"text"},{"text":"🎯","type":"emoji"}]},{"tags":[...]},{"tags":[...]}],"language":"ko"}

블로그 내용:
${coreContent}`;
};

// Groq API 호출 헬퍼 (OpenAI 호환 형식)
async function callGroqAPI(prompt: string, apiKey: string, temperature = 0.7): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    if (response.status === 401) {
      throw new Error("INVALID_API_KEY");
    }
    throw new Error(error.error?.message || "GROQ_API_ERROR");
  }

  const data = await response.json();
  const textContent = data.choices?.[0]?.message?.content;
  if (!textContent) throw new Error("EMPTY_RESPONSE");

  return textContent;
}

// JSON 파싱 헬퍼 - titles 형식 처리
function parseJSON(text: string): { titles: unknown[]; language: string } {
  // {"titles": [...]} 형식 시도
  const titlesMatch = text.match(/\{[\s\S]*"titles"[\s\S]*\}/);
  if (titlesMatch) {
    return JSON.parse(titlesMatch[0]);
  }

  // 기존 {"tags": [...]} 형식도 지원 (하위 호환)
  const tagsMatch = text.match(/\{[\s\S]*"tags"[\s\S]*\}/);
  if (tagsMatch) {
    const parsed = JSON.parse(tagsMatch[0]);
    // 단일 tags를 titles 형식으로 변환
    return { titles: [{ tags: parsed.tags }], language: parsed.language || "ko" };
  }

  // 배열 형식 [[...], [...], [...]] 시도
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    const parsed = JSON.parse(arrayMatch[0]);
    // 배열의 첫 번째 요소가 배열이면 다중 제목
    if (Array.isArray(parsed[0])) {
      return { titles: parsed.map((tags: unknown[]) => ({ tags })), language: "ko" };
    }
    // 단일 배열이면 하나의 제목
    return { titles: [{ tags: parsed }], language: "ko" };
  }

  throw new Error("INVALID_JSON_RESPONSE");
}

/** 태그 배열 정규화 헬퍼 */
function normalizeTags(tags: unknown[]): TagRecommendation[] {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

  return tags.flatMap((tag) => {
    // 이미 객체 형식인 경우
    if (typeof tag === "object" && tag !== null && "text" in tag) {
      const tagObj = tag as { text: string; type?: string };
      return [{
        text: String(tagObj.text).trim(),
        type: (tagObj.type === "emoji" ? "emoji" : "text") as "text" | "emoji",
      }];
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
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("JSON_PARSE_ERROR");
  }
}
