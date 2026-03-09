import { useState, useCallback } from "react";
import {
  analyzeContent as analyzeContentAPI,
  generateTitlesFromAnalysis,
  TitleRecommendation,
  TitleType,
  AnalysisResult,
} from "src/services/ai/geminiService";
import { extractKeywords } from "src/services/ai/keywordExtractor";

export type AITagRecommendStep = "idle" | "analysis" | "titles";
export type AITagRecommendStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "fallback";

export interface AITagRecommendState {
  step: AITagRecommendStep;
  status: AITagRecommendStatus;
  // Step 1: 분석 결과
  analysisResult: AnalysisResult | null;
  selectedTitleType: TitleType | null;
  // Step 2: 제목
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
  analysisResult: null,
  selectedTitleType: null,
  titles: [],
  error: null,
  language: "mixed",
  usedFallback: false,
};

function detectLanguage(text: string): "ko" | "en" | "mixed" {
  const koreanChars = (text.match(/[가-힣]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const total = koreanChars + englishChars;
  if (total === 0) return "mixed";
  if (koreanChars / total > 0.6) return "ko";
  if (englishChars / total > 0.6) return "en";
  return "mixed";
}

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
   * Step 1: 블로그 내용 구조 분석
   */
  const analyzeContent = useCallback(
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
        step: "analysis",
        status: "loading",
        error: null,
      }));

      try {
        const result = await analyzeContentAPI(content);
        setState((prev) => ({
          ...prev,
          status: "success",
          analysisResult: result,
          language: result.language,
        }));
      } catch (error) {
        const errorCode = error instanceof Error ? error.message : "DEFAULT";

        // Fallback: 키워드 추출로 최소한의 분석 결과 생성
        if (
          errorCode === "API_KEY_NOT_SET" ||
          errorCode === "RATE_LIMIT_EXCEEDED"
        ) {
          const fallbackResponse = extractKeywords(content);
          const fallbackTitle = fallbackResponse.titles[0]?.tags
            .filter(t => t.type === "text")
            .map(t => t.text)
            .join(" ") || "";
          const fallbackKeywords = fallbackResponse.titles[0]?.tags
            .filter(t => t.type === "text")
            .map(t => t.text) || [];
          const detectedLang = detectLanguage(content);

          const fallbackAnalysis: AnalysisResult = {
            intro: { hook: "", hook_type: "none", writing_motivation: "" },
            body: {
              core_topic: fallbackTitle,
              key_terms: fallbackKeywords.slice(0, 5),
              unique_angle: "",
              content_type: "tutorial",
            },
            conclusion: { takeaway: "", emotion: "neutral" },
            recommended_types: ["keyword_stack", "highlight"],
            language: detectedLang,
          };

          setState((prev) => ({
            ...prev,
            status: "fallback",
            analysisResult: fallbackAnalysis,
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
   * Step 2: 선택된 제목 타입으로 제목 생성
   */
  const generateTitles = useCallback(
    async (titleType: TitleType) => {
      if (!state.analysisResult) return;

      setState((prev) => ({
        ...prev,
        step: "titles",
        status: "loading",
        selectedTitleType: titleType,
        error: null,
      }));

      try {
        const response = await generateTitlesFromAnalysis(
          state.analysisResult,
          titleType
        );
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
    [state.analysisResult, getErrorMessage]
  );

  /**
   * 분석 결과 단계로 돌아가기
   */
  const backToAnalysis = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: "analysis",
      status: "success",
      selectedTitleType: null,
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
    analyzeContent,
    generateTitles,
    backToAnalysis,
    reset,
    isLoading: state.status === "loading",
  };
}
