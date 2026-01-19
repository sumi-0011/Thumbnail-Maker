import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "src/components/ui/button";
import { Textarea } from "src/components/ui/textarea";
import { useAITagRecommend } from "src/components/thumbnail-maker/hooks/useAITagRecommend";
import { TitleRecommendation, SummaryItem } from "src/services/ai/geminiService";
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
} from "lucide-react";
import { cn } from "src/lib/utils";

interface LocationState {
  tagVariant?: TagVariant;
  tagShape?: TagShape;
}

export default function AIRecommendPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as LocationState | null;
  const currentTagVariant = locationState?.tagVariant ?? "filled";
  const currentTagShape = locationState?.tagShape ?? "round";

  const [content, setContent] = useState("");

  const {
    step,
    summaryItems,
    selectedSummary,
    titles,
    status,
    error,
    usedFallback,
    isLoading,
    generateSummaries,
    generateTagsFromSummary,
    backToSummaries,
    reset,
  } = useAITagRecommend();

  // Step 1: 요약 생성
  const handleGenerateSummaries = () => {
    generateSummaries(content);
  };

  // Step 2: 선택된 요약으로 태그 생성
  const handleSummarySelect = (summary: string) => {
    generateTagsFromSummary(summary, "question");
  };

  // 태그 선택 시 메인 페이지로 이동
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
    if (step === "tags") {
      backToSummaries();
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
            {step === "tags"
              ? t("ai.backToSummaries", "Back to Summaries")
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
                "Paste your blog content and AI will suggest thumbnail titles"
              )}
            {step === "summaries" &&
              t("ai.selectSummary", "Select a summary that best fits your blog")}
            {step === "tags" &&
              t("ai.selectTags", "Select tags to apply to your thumbnail")}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <StepIndicator
            number={1}
            label={t("ai.step1", "Content")}
            active={step === "idle"}
            completed={step === "summaries" || step === "tags"}
          />
          <ChevronRight size={16} className="text-[#464856]" />
          <StepIndicator
            number={2}
            label={t("ai.step2", "Summary")}
            active={step === "summaries"}
            completed={step === "tags"}
          />
          <ChevronRight size={16} className="text-[#464856]" />
          <StepIndicator
            number={3}
            label={t("ai.step3", "Tags")}
            active={step === "tags"}
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
                    "Paste your blog post content here..."
                  )}
                  className="min-h-[200px] resize-y"
                />
              </section>

              <Button
                onClick={handleGenerateSummaries}
                disabled={isLoading || content.trim().length < 10}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    {t("ai.analyzing", "Analyzing...")}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" />
                    {t("ai.analyzeButton", "Analyze Content")}
                  </>
                )}
              </Button>
            </>
          )}

          {/* Step 2: Summary Selection */}
          {step === "summaries" && (
            <>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={32} className="mb-4 animate-spin text-[#6366f1]" />
                  <p className="text-[#9292A1]">
                    {t("ai.generatingSummaries", "Generating summaries...")}
                  </p>
                </div>
              ) : (
                <section>
                  <label className="mb-4 block text-sm font-medium text-[#e4e4e7]">
                    {t("ai.summariesLabel", "Choose a summary")}
                    <span className="ml-2 text-xs text-[#9292A1]">
                      ({t("ai.clickToSelect", "Click to select")})
                    </span>
                  </label>

                  <div className="flex flex-col gap-3">
                    {summaryItems.map((item, index) => (
                      <SummaryOptionCard
                        key={index}
                        item={item}
                        index={index}
                        onClick={() => handleSummarySelect(item.summary)}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="mt-4 w-full"
                  >
                    {t("ai.tryAgain", "Try with different content")}
                  </Button>
                </section>
              )}
            </>
          )}

          {/* Step 3: Tag Selection */}
          {step === "tags" && (
            <>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={32} className="mb-4 animate-spin text-[#6366f1]" />
                  <p className="text-[#9292A1]">
                    {t("ai.generatingTags", "Generating tags...")}
                  </p>
                </div>
              ) : (
                <section>
                  {/* Selected Summary Display */}
                  {selectedSummary && (
                    <div className="mb-6 rounded-lg border border-[#6366f1]/30 bg-[#6366f1]/10 p-4">
                      <p className="text-xs text-[#9292A1]">
                        {t("ai.selectedSummary", "Selected summary")}
                      </p>
                      <p className="mt-1 text-[#e4e4e7]">{selectedSummary}</p>
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
                  "Using keyword extraction (AI unavailable)"
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

// Summary Option Card Component
interface SummaryOptionCardProps {
  item: SummaryItem;
  index: number;
  onClick: () => void;
}

function SummaryOptionCard({ item, index, onClick }: SummaryOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-xl border border-[#464856] bg-[#212129]/50 p-4 text-left transition-all hover:border-[#6366f1] hover:bg-[#6366f1]/10"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#464856] text-sm font-medium text-white group-hover:bg-[#6366f1]">
          {index + 1}
        </span>
        <div className="flex flex-col gap-2">
          <span className="text-[#e4e4e7] group-hover:text-white leading-relaxed">
            {item.summary}
          </span>
          {item.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-[#464856]/50 px-2 py-0.5 text-xs text-[#9292A1] group-hover:bg-[#6366f1]/30 group-hover:text-[#c4c4ff]"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// Title Option Card Component
interface TitleOptionCardProps {
  title: TitleRecommendation;
  index: number;
  onClick: () => void;
}

function TitleOptionCard({ title, index, onClick }: TitleOptionCardProps) {
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
        <span className="text-sm text-[#9292A1] group-hover:text-[#c4c4ff]">
          Click to apply all tags
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
