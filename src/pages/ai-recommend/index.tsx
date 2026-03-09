import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "src/components/ui/button";
import { Textarea } from "src/components/ui/textarea";
import { useAITagRecommend } from "src/components/thumbnail-maker/hooks/useAITagRecommend";
import {
  TitleRecommendation,
  AnalysisResult,
  TitleType,
  TITLE_TYPE_OPTIONS,
} from "src/services/ai/geminiService";
import {
  Tag,
  TagShape,
  TagVariant,
} from "src/components/thumbnail-maker/assets/palette.types";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Info,
  ArrowLeft,
  ChevronRight,
  Lightbulb,
  Target,
  Hash,
  BookOpen,
} from "lucide-react";
import { cn } from "src/lib/utils";

interface LocationState {
  tagVariant?: TagVariant;
  tagShape?: TagShape;
}

export default function AIRecommendPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isKo = i18n.language === "ko";

  const locationState = location.state as LocationState | null;
  const currentTagVariant = locationState?.tagVariant ?? "filled";
  const currentTagShape = locationState?.tagShape ?? "round";

  const [content, setContent] = useState("");

  const {
    step,
    analysisResult,
    selectedTitleType,
    titles,
    status,
    error,
    usedFallback,
    isLoading,
    analyzeContent,
    generateTitles,
    backToAnalysis,
    reset,
  } = useAITagRecommend();

  const handleAnalyze = () => {
    analyzeContent(content);
  };

  const handleTitleTypeSelect = (titleType: TitleType) => {
    generateTitles(titleType);
  };

  const handleTitleSelect = (title: TitleRecommendation) => {
    const newTags: Tag[] = title.tags.map((tagRec, index) => ({
      id: Date.now() + index,
      content: {
        type: "text" as const,
        value: tagRec.text,
      },
      tagVariant: tagRec.type === "emoji" ? "ghost" : currentTagVariant,
      tagShape: tagRec.type === "emoji" ? "round" : currentTagShape,
    }));

    navigate("/", { state: { newTags } });
  };

  const handleBack = () => {
    if (step === "titles") {
      backToAnalysis();
    } else {
      navigate("/");
    }
  };

  const handleReset = () => {
    reset();
    setContent("");
  };

  return (
    <>
      <Helmet>
        <title>
          {t("ai.title", "AI Tag Recommendation")} - Thumbnail Maker
        </title>
      </Helmet>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="-ml-2 mb-4 text-[#9292A1] hover:text-white"
          >
            <ArrowLeft size={16} className="mr-2" />
            {step === "titles"
              ? t("ai.backToAnalysis", "분석 결과로 돌아가기")
              : t("ai.back", "Back to Editor")}
          </Button>

          <h1 className="flex items-center gap-3 text-2xl font-bold text-white">
            <Sparkles size={28} className="text-[#6366f1]" />
            {t("ai.title", "AI Tag Recommendation")}
          </h1>
          <p className="mt-2 text-[#9292A1]">
            {step === "idle" &&
              t(
                "ai.description",
                "블로그 내용을 붙여넣으면 AI가 관련 태그를 추천해드립니다"
              )}
            {step === "analysis" &&
              t(
                "ai.selectTitleType",
                "분석 결과를 확인하고 제목 타입을 선택하세요"
              )}
            {step === "titles" &&
              t(
                "ai.selectTitles",
                "제목을 선택하여 썸네일에 적용하세요"
              )}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <StepIndicator
            number={1}
            label={t("ai.step1", "Content")}
            active={step === "idle"}
            completed={step === "analysis" || step === "titles"}
          />
          <ChevronRight size={16} className="text-[#464856]" />
          <StepIndicator
            number={2}
            label={t("ai.step2", "분석")}
            active={step === "analysis"}
            completed={step === "titles"}
          />
          <ChevronRight size={16} className="text-[#464856]" />
          <StepIndicator
            number={3}
            label={t("ai.step3", "제목")}
            active={step === "titles"}
            completed={false}
          />
        </div>

        <div className="flex flex-col gap-6">
          {/* Step 1: Content Input */}
          {step === "idle" && (
            <>
              <section>
                <label className="mb-3 block text-sm font-medium text-[#e4e4e7]">
                  {t("ai.contentLabel", "Blog Content")}
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t(
                    "ai.contentPlaceholder",
                    "블로그 글 내용을 여기에 붙여넣으세요..."
                  )}
                  className="min-h-[200px] resize-y"
                />
              </section>

              <Button
                onClick={handleAnalyze}
                disabled={isLoading || content.trim().length < 10}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    {t("ai.analyzingContent", "블로그 분석 중...")}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" />
                    {t("ai.analyzeButton", "블로그 분석하기")}
                  </>
                )}
              </Button>
            </>
          )}

          {/* Step 2: Analysis Result + Title Type Selection */}
          {step === "analysis" && (
            <>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={32} className="mb-4 animate-spin text-[#6366f1]" />
                  <p className="text-[#9292A1]">
                    {t("ai.analyzingContent", "블로그 분석 중...")}
                  </p>
                </div>
              ) : analysisResult ? (
                <section className="flex flex-col gap-6">
                  {/* Analysis Summary Card */}
                  <AnalysisSummaryCard
                    analysis={analysisResult}
                    isKo={isKo}
                  />

                  {/* Title Type Selection */}
                  <div>
                    <label className="mb-4 block text-sm font-medium text-[#e4e4e7]">
                      {t("ai.recommendedTypes", "추천 제목 타입")}
                      <span className="ml-2 text-xs text-[#9292A1]">
                        ({t("ai.clickToGenerate", "클릭하여 제목 생성")})
                      </span>
                    </label>

                    <div className="flex flex-col gap-3">
                      {analysisResult.recommended_types.map((typeId) => {
                        const option = TITLE_TYPE_OPTIONS.find(
                          (o) => o.id === typeId
                        );
                        if (!option) return null;
                        return (
                          <TitleTypeCard
                            key={typeId}
                            option={option}
                            isKo={isKo}
                            onClick={() => handleTitleTypeSelect(typeId)}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full"
                  >
                    {t("ai.tryAgain", "Try with different content")}
                  </Button>
                </section>
              ) : null}
            </>
          )}

          {/* Step 3: Title Selection */}
          {step === "titles" && (
            <>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={32} className="mb-4 animate-spin text-[#6366f1]" />
                  <p className="text-[#9292A1]">
                    {t("ai.generatingTitles", "제목 생성 중...")}
                  </p>
                </div>
              ) : (
                <section>
                  {/* Selected Title Type Display */}
                  {selectedTitleType && (
                    <div className="mb-6 rounded-lg border border-[#6366f1]/30 bg-[#6366f1]/10 p-4">
                      <p className="text-xs text-[#9292A1]">
                        {t("ai.selectedType", "선택한 제목 타입")}
                      </p>
                      <p className="mt-1 text-[#e4e4e7]">
                        {isKo
                          ? TITLE_TYPE_OPTIONS.find(o => o.id === selectedTitleType)?.labelKo
                          : TITLE_TYPE_OPTIONS.find(o => o.id === selectedTitleType)?.labelEn}
                      </p>
                    </div>
                  )}

                  <label className="mb-4 block text-sm font-medium text-[#e4e4e7]">
                    {t("ai.recommendedTitles", "Recommended Titles")}
                    <span className="ml-2 text-xs text-[#9292A1]">
                      ({t("ai.clickToApply", "Click to apply")})
                    </span>
                  </label>

                  <div className="flex flex-col gap-4">
                    {titles.map((title, titleIndex) => (
                      <TitleOptionCard
                        key={titleIndex}
                        title={title}
                        index={titleIndex}
                        isKo={isKo}
                        onClick={() => handleTitleSelect(title)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Error Message */}
          {error && status === "error" && (
            <div className="flex items-start gap-3 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Fallback Notice */}
          {usedFallback && status === "fallback" && (
            <div className="flex items-start gap-3 rounded-lg bg-yellow-500/10 p-4 text-sm text-yellow-400">
              <Info size={18} className="mt-0.5 shrink-0" />
              <span>
                {t(
                  "ai.fallbackNotice",
                  "키워드 추출 모드 (AI 사용 불가)"
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Step Indicator Component
interface StepIndicatorProps {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}

function StepIndicator({ number, label, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
          active && "bg-[#6366f1] text-white",
          completed && "bg-[#22c55e] text-white",
          !active && !completed && "bg-[#464856] text-[#9292A1]"
        )}
      >
        {completed ? "✓" : number}
      </span>
      <span
        className={cn(
          "text-sm",
          active && "text-white",
          !active && "text-[#9292A1]"
        )}
      >
        {label}
      </span>
    </div>
  );
}

// Analysis Summary Card Component
interface AnalysisSummaryCardProps {
  analysis: AnalysisResult;
  isKo: boolean;
}

function AnalysisSummaryCard({ analysis, isKo }: AnalysisSummaryCardProps) {
  return (
    <div className="rounded-xl border border-[#464856] bg-[#212129]/50 p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-[#e4e4e7]">
        <BookOpen size={16} className="text-[#6366f1]" />
        {isKo ? "분석 결과" : "Analysis Result"}
      </h3>

      <div className="flex flex-col gap-4">
        {/* Hook */}
        {analysis.intro.hook && (
          <div className="flex items-start gap-3">
            <Lightbulb size={14} className="mt-1 shrink-0 text-yellow-400" />
            <div>
              <p className="text-xs text-[#9292A1]">
                {isKo ? "도입부 후킹" : "Introduction Hook"}
              </p>
              <p className="mt-0.5 text-sm text-[#e4e4e7]">{analysis.intro.hook}</p>
            </div>
          </div>
        )}

        {/* Core Topic */}
        {analysis.body.core_topic && (
          <div className="flex items-start gap-3">
            <Target size={14} className="mt-1 shrink-0 text-[#6366f1]" />
            <div>
              <p className="text-xs text-[#9292A1]">
                {isKo ? "핵심 주제" : "Core Topic"}
              </p>
              <p className="mt-0.5 text-sm text-[#e4e4e7]">
                {analysis.body.core_topic}
              </p>
            </div>
          </div>
        )}

        {/* Key Terms */}
        {analysis.body.key_terms.length > 0 && (
          <div className="flex items-start gap-3">
            <Hash size={14} className="mt-1 shrink-0 text-emerald-400" />
            <div>
              <p className="text-xs text-[#9292A1]">
                {isKo ? "키워드" : "Key Terms"}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {analysis.body.key_terms.map((term, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-[#464856]/50 px-2 py-0.5 text-xs text-[#c4c4ff]"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Takeaway */}
        {analysis.conclusion.takeaway && (
          <div className="flex items-start gap-3">
            <Sparkles size={14} className="mt-1 shrink-0 text-orange-400" />
            <div>
              <p className="text-xs text-[#9292A1]">
                {isKo ? "핵심 교훈" : "Key Takeaway"}
              </p>
              <p className="mt-0.5 text-sm text-[#e4e4e7]">
                {analysis.conclusion.takeaway}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Title Type Card Component
interface TitleTypeCardProps {
  option: { id: TitleType; labelKo: string; labelEn: string; descriptionKo: string; descriptionEn: string };
  isKo: boolean;
  onClick: () => void;
}

function TitleTypeCard({ option, isKo, onClick }: TitleTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-xl border border-[#464856] bg-[#212129]/50 p-4 text-left transition-all hover:border-[#6366f1] hover:bg-[#6366f1]/10"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#464856] text-sm group-hover:bg-[#6366f1]">
          <Sparkles size={14} className="text-white" />
        </span>
        <div>
          <p className="font-medium text-[#e4e4e7] group-hover:text-white">
            {isKo ? option.labelKo : option.labelEn}
          </p>
          <p className="mt-0.5 text-xs text-[#9292A1]">
            {isKo ? option.descriptionKo : option.descriptionEn}
          </p>
        </div>
        <ChevronRight
          size={16}
          className="ml-auto text-[#464856] group-hover:text-[#6366f1]"
        />
      </div>
    </button>
  );
}

// Title Option Card Component
interface TitleOptionCardProps {
  title: TitleRecommendation;
  index: number;
  isKo: boolean;
  onClick: () => void;
}

function TitleOptionCard({ title, index, isKo, onClick }: TitleOptionCardProps) {
  const titleTypeLabel = title.title_type
    ? TITLE_TYPE_OPTIONS.find((o) => o.id === title.title_type)
    : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-xl border border-[#464856] bg-[#212129]/50 p-5 text-left transition-all hover:border-[#6366f1] hover:bg-[#6366f1]/10"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#464856] text-sm font-medium text-white group-hover:bg-[#6366f1]">
          {index + 1}
        </span>
        {titleTypeLabel && (
          <span className="rounded-md bg-[#6366f1]/20 px-2 py-0.5 text-xs text-[#c4c4ff]">
            {isKo ? titleTypeLabel.labelKo : titleTypeLabel.labelEn}
          </span>
        )}
        <span className="ml-auto text-sm text-[#9292A1] group-hover:text-[#c4c4ff]">
          {isKo ? "클릭하여 적용" : "Click to apply"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {title.tags.map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm transition-colors",
              tag.type === "emoji"
                ? "bg-transparent text-xl"
                : "border border-[#464856] bg-[#2a2a35] text-[#e4e4e7] group-hover:border-[#6366f1]/50 group-hover:bg-[#6366f1]/20"
            )}
          >
            {tag.text}
          </span>
        ))}
      </div>
    </button>
  );
}
