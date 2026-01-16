import { useState, useCallback } from "react";
import {
  generateTagsWithGemini,
  TitleRecommendation,
  TagStyle,
} from "src/services/ai/geminiService";
import { extractKeywords } from "src/services/ai/keywordExtractor";

export type AITagRecommendStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "fallback";

export interface AITagRecommendState {
  status: AITagRecommendStatus;
  titles: TitleRecommendation[];
  error: string | null;
  language: "ko" | "en" | "mixed";
  usedFallback: boolean;
}

const ERROR_MESSAGES: Record<string, { ko: string; en: string }> = {
  GROQ_API_KEY_NOT_SET: {
    ko: "API 키가 설정되지 않았습니다. 키워드 추출로 대체합니다.",
    en: "API key not set. Using keyword extraction instead.",
  },
  RATE_LIMIT_EXCEEDED: {
    ko: "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
    en: "Rate limit exceeded. Please try again later.",
  },
  INVALID_API_KEY: {
    ko: "잘못된 API 키입니다. 설정을 확인해주세요.",
    en: "Invalid API key. Please check your settings.",
  },
  EMPTY_RESPONSE: {
    ko: "AI가 응답을 생성하지 못했습니다. 다시 시도해주세요.",
    en: "AI failed to generate a response. Please try again.",
  },
  CONTENT_TOO_SHORT: {
    ko: "더 많은 내용을 입력해주세요.",
    en: "Please enter more content.",
  },
  DEFAULT: {
    ko: "태그 생성 중 오류가 발생했습니다.",
    en: "An error occurred while generating tags.",
  },
};

export function useAITagRecommend() {
  const [state, setState] = useState<AITagRecommendState>({
    status: "idle",
    titles: [],
    error: null,
    language: "mixed",
    usedFallback: false,
  });

  const getErrorMessage = useCallback(
    (errorCode: string, lang: "ko" | "en" = "ko"): string => {
      const messages = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.DEFAULT;
      return messages[lang];
    },
    []
  );

  const generateTags = useCallback(
    async (content: string, style: TagStyle = "narrative") => {
      // Validate content
      if (content.trim().length < 10) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: getErrorMessage("CONTENT_TOO_SHORT"),
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        status: "loading",
        error: null,
      }));

      try {
        const response = await generateTagsWithGemini(content, style);
        setState({
          status: "success",
          titles: response.titles,
          error: null,
          language: response.language,
          usedFallback: false,
        });
      } catch (error) {
        const errorCode = error instanceof Error ? error.message : "DEFAULT";

        // If API key not set or rate limited, use fallback
        if (
          errorCode === "GROQ_API_KEY_NOT_SET" ||
          errorCode === "RATE_LIMIT_EXCEEDED"
        ) {
          const fallbackResponse = extractKeywords(content);
          setState({
            status: "fallback",
            titles: fallbackResponse.titles,
            error: getErrorMessage(errorCode),
            language: fallbackResponse.language,
            usedFallback: true,
          });
        } else {
          setState((prev) => ({
            ...prev,
            status: "error",
            error: getErrorMessage(errorCode),
            titles: [],
          }));
        }
      }
    },
    [getErrorMessage]
  );

  const reset = useCallback(() => {
    setState({
      status: "idle",
      titles: [],
      error: null,
      language: "mixed",
      usedFallback: false,
    });
  }, []);

  return {
    ...state,
    generateTags,
    reset,
    isLoading: state.status === "loading",
  };
}
