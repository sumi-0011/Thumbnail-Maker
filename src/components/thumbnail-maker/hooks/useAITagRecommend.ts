import { useState, useCallback } from "react";
import {
  generateSummaries,
  generateTagsFromSummary,
  TitleRecommendation,
  TagStyle,
  SummaryItem,
} from "src/services/ai/geminiService";
import { extractKeywords } from "src/services/ai/keywordExtractor";

export type AITagRecommendStep = "idle" | "summaries" | "tags";
export type AITagRecommendStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "fallback";

export interface AITagRecommendState {
  step: AITagRecommendStep;
  status: AITagRecommendStatus;
  // Step 1: 요약 + 키워드
  summaryItems: SummaryItem[];
  selectedSummary: string | null;
  // Step 2: 태그
  titles: TitleRecommendation[];
  error: string | null;
  language: "ko" | "en" | "mixed";
  usedFallback: boolean;
}

const ERROR_MESSAGES: Record<string, { ko: string; en: string }> = {
  API_KEY_NOT_SET: {
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

const initialState: AITagRecommendState = {
  step: "idle",
  status: "idle",
  summaryItems: [],
  selectedSummary: null,
  titles: [],
  error: null,
  language: "mixed",
  usedFallback: false,
};

export function useAITagRecommend() {
  const [state, setState] = useState<AITagRecommendState>(initialState);

  const getErrorMessage = useCallback(
    (errorCode: string, lang: "ko" | "en" = "ko"): string => {
      const messages = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.DEFAULT;
      return messages[lang];
    },
    []
  );

  /**
   * Step 1: 블로그 내용에서 요약 생성
   */
  const generateSummariesFromContent = useCallback(
    async (content: string) => {
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
        step: "summaries",
        status: "loading",
        error: null,
      }));

      try {
        const response = await generateSummaries(content);
        setState((prev) => ({
          ...prev,
          status: "success",
          summaryItems: response.items,
          language: response.language,
        }));
      } catch (error) {
        const errorCode = error instanceof Error ? error.message : "DEFAULT";

        // Fallback: 키워드 추출 사용
        if (
          errorCode === "API_KEY_NOT_SET" ||
          errorCode === "RATE_LIMIT_EXCEEDED"
        ) {
          const fallbackResponse = extractKeywords(content);
          // 키워드를 요약처럼 변환
          const fallbackItems: SummaryItem[] = fallbackResponse.titles.map(
            (title) => ({
              summary: title.tags.map((t) => t.text).join(" "),
              keywords: title.tags.map((t) => t.text),
            })
          );
          setState((prev) => ({
            ...prev,
            status: "fallback",
            summaryItems: fallbackItems,
            error: getErrorMessage(errorCode),
            usedFallback: true,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            status: "error",
            error: getErrorMessage(errorCode),
          }));
        }
      }
    },
    [getErrorMessage]
  );

  /**
   * Step 2: 선택된 요약으로 태그 생성
   */
  const generateTagsFromSelectedSummary = useCallback(
    async (summary: string, style: TagStyle = "question") => {
      setState((prev) => ({
        ...prev,
        step: "tags",
        status: "loading",
        selectedSummary: summary,
        error: null,
      }));

      try {
        const response = await generateTagsFromSummary(summary, style);
        setState((prev) => ({
          ...prev,
          status: "success",
          titles: response.titles,
          language: response.language,
        }));
      } catch (error) {
        const errorCode = error instanceof Error ? error.message : "DEFAULT";
        setState((prev) => ({
          ...prev,
          status: "error",
          error: getErrorMessage(errorCode),
        }));
      }
    },
    [getErrorMessage]
  );

  /**
   * 요약 선택 단계로 돌아가기
   */
  const backToSummaries = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: "summaries",
      status: "success",
      selectedSummary: null,
      titles: [],
      error: null,
    }));
  }, []);

  /**
   * 전체 리셋
   */
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    generateSummaries: generateSummariesFromContent,
    generateTagsFromSummary: generateTagsFromSelectedSummary,
    backToSummaries,
    reset,
    isLoading: state.status === "loading",
  };
}
