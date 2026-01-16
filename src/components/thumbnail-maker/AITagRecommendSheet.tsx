import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useAITagRecommend } from "./hooks/useAITagRecommend";
import {
  TAG_STYLE_OPTIONS,
  TagStyle,
  TitleRecommendation,
  TagStyleOption,
} from "src/services/ai/geminiService";
import { Tag, TagShape, TagVariant } from "./assets/palette.types";
import { Sparkles, Loader2, AlertCircle, Info, Check } from "lucide-react";
import { cn } from "src/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTag: (tag: Tag) => void;
  currentTagVariant: TagVariant;
  currentTagShape: TagShape;
}

export function AITagRecommendSheet({
  open,
  onOpenChange,
  onAddTag,
  currentTagVariant,
  currentTagShape,
}: Props) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "ko" ? "ko" : "en";

  const [content, setContent] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<TagStyle>("narrative");

  const { titles, status, error, usedFallback, isLoading, generateTags, reset } =
    useAITagRecommend();

  const handleGenerate = () => {
    generateTags(content, selectedStyle);
  };

  /** 제목 선택 시 해당 제목의 모든 태그를 추가 */
  const handleTitleSelect = (title: TitleRecommendation) => {
    title.tags.forEach((tagRec, index) => {
      const newTag: Tag = {
        id: Date.now() + index,
        content: {
          type: "text",
          value: tagRec.text,
        },
        tagVariant: tagRec.type === "emoji" ? "ghost" : currentTagVariant,
        tagShape: tagRec.type === "emoji" ? "round" : currentTagShape,
      };
      onAddTag(newTag);
    });
    // 선택 후 시트 닫기
    handleClose(false);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setContent("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent inner="center" className="min-w-[70vw]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles size={20} />
            {t("ai.title", "AI Title Recommendation")}
          </SheetTitle>
          <SheetDescription>
            {t(
              "ai.description",
              "Paste your blog content and AI will suggest thumbnail titles"
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4 overflow-y-auto">
          {/* Content Input */}
          <div>
            <label className="mb-2 block text-[13px] text-[#9292A1]">
              {t("ai.contentLabel", "Blog Content")}
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t(
                "ai.contentPlaceholder",
                "Paste your blog post content here..."
              )}
              className="min-h-[200px]"
            />
          </div>

          {/* Style Selection with Examples */}
          <div>
            <label className="mb-3 block text-[13px] text-[#9292A1]">
              {t("ai.styleLabel", "Title Style")}
            </label>
            <div className="flex gap-2 flex-wrap">
              {TAG_STYLE_OPTIONS.map((option) => (
                <StyleOptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedStyle === option.id}
                  onClick={() => setSelectedStyle(option.id)}
                  currentLang={currentLang}
                />
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading || content.trim().length < 10}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {t("ai.generating", "Generating...")}
              </>
            ) : (
              <>
                <Sparkles size={16} className="mr-2" />
                {t("ai.generateButton", "Generate Titles")}
              </>
            )}
          </Button>

          {/* Error Message */}
          {error && status === "error" && (
            <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Fallback Notice */}
          {usedFallback && status === "fallback" && (
            <div className="flex items-start gap-2 rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-400">
              <Info size={16} className="mt-0.5 shrink-0" />
              <span>
                {t(
                  "ai.fallbackNotice",
                  "Using keyword extraction (AI unavailable)"
                )}
              </span>
            </div>
          )}

          {/* Recommended Titles */}
          {titles.length > 0 && (
            <div>
              <label className="mb-3 block text-[13px] text-[#9292A1]">
                {t("ai.recommendedTitles", "Recommended Titles")}
                <span className="ml-2 text-xs">
                  ({t("ai.clickToApply", "Click to apply")})
                </span>
              </label>

              <div className="flex flex-col gap-3">
                {titles.map((title, titleIndex) => (
                  <TitleOptionCard
                    key={titleIndex}
                    title={title}
                    index={titleIndex}
                    onClick={() => handleTitleSelect(title)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="mt-4">
          <Button variant="secondary" onClick={() => handleClose(false)}>
            {t("ai.close", "Close")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/** 제목 추천 카드 컴포넌트 */
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
      className="group w-full rounded-lg border border-[#464856] bg-[#212129]/50 p-4 text-left transition-all hover:border-[#6366f1] hover:bg-[#6366f1]/10"
    >
      {/* Title Number */}
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#464856] text-xs font-medium text-white group-hover:bg-[#6366f1]">
          {index + 1}
        </span>
        <span className="text-xs text-[#9292A1] group-hover:text-[#c4c4ff]">
          Click to apply all tags
        </span>
      </div>

      {/* Tags Preview */}
      <div className="flex flex-wrap gap-2">
        {title.tags.map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className={cn(
              "rounded-full px-3 py-1 text-sm transition-colors",
              tag.type === "emoji"
                ? "bg-transparent text-lg"
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

interface StyleOptionCardProps {
  option: TagStyleOption;
  isSelected: boolean;
  onClick: () => void;
  currentLang: "ko" | "en";
}

function StyleOptionCard({
  option,
  isSelected,
  onClick,
  currentLang,
}: StyleOptionCardProps) {
  const label = currentLang === "ko" ? option.labelKo : option.labelEn;
  const description =
    currentLang === "ko" ? option.descriptionKo : option.descriptionEn;
  const examples = currentLang === "ko" ? option.examplesKo : option.examplesEn;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full rounded-lg border p-3 text-left transition-all max-w-[48%]",
        isSelected
          ? "border-[#6366f1] bg-[#6366f1]/10"
          : "border-[#464856] bg-[#212129]/50 hover:border-[#6366f1]/50"
      )}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#6366f1]">
          <Check size={12} className="text-white" />
        </div>
      )}

      {/* Title & Description */}
      <div className="mb-2">
        <span
          className={cn(
            "text-sm font-medium",
            isSelected ? "text-white" : "text-[#e4e4e7]"
          )}
        >
          {label}
        </span>
        <span className="ml-2 text-xs text-[#9292A1]">{description}</span>
      </div>

      {/* Example Tags */}
      <div className="flex flex-wrap gap-1.5">
        {examples.map((example, index) => (
          <span
            key={index}
            className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              isSelected
                ? "border border-[#6366f1]/50 bg-[#6366f1]/20 text-[#c4c4ff]"
                : "border border-[#464856]/50 bg-[#2a2a35] text-[#b4b4c4]"
            )}
          >
            {example}
          </span>
        ))}
      </div>
    </button>
  );
}
