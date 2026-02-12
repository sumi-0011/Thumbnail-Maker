import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ThumbnailMaker from "src/components/thumbnail-maker";
import { PaletteProvider } from "src/components/thumbnail-maker/Palette.context";
import { TagProvider } from "src/components/thumbnail-maker/Tag.context";
import {
  FullPageScroller,
  useScrollToSection,
} from "src/components/landing/FullPageScroller";
import { Section } from "src/components/landing/Section";
import { ScrollHint } from "src/components/landing/ScrollHint";
import { TemplateGallery } from "src/components/template-gallery/TemplateGallery";
import { Template } from "src/components/gallery/GalleryItem";
import { useSetTemplate } from "src/components/thumbnail-maker/hooks/useSetTemplate";
import { useUserStats } from "src/hooks/useUserStats";
import { ThankYouAlert } from "./ThankYouAlert";

export default function Home() {
  const { t } = useTranslation("translation");
  const [templateKey, setTemplateKey] = useState(0);
  const { scrollToSection } = useScrollToSection();
  const { onUseTemplate } = useSetTemplate();
  const { incrementVisit, shouldShowGitHubToast } = useUserStats();

  useEffect(() => {
    incrementVisit();
  }, []);

  const handleScrollToTemplates = useCallback(() => {
    scrollToSection("templates");
  }, [scrollToSection]);

  const handleApplyTemplate = useCallback(
    (template: Template) => {
      // blog_only 타입은 블로그 링크만 열기
      if (template.template_type === "blog_only") {
        if (template.blog_url) {
          window.open(template.blog_url, "_blank", "noopener,noreferrer");
        }
        return;
      }

      // template.data 검증
      if (!template.data) {
        console.warn("Template data is missing");
        return;
      }

      // Supabase Template 데이터를 useSetTemplate 형식으로 전달
      onUseTemplate(template.data);

      // Provider를 리마운트하여 새로운 상태 반영
      setTemplateKey((prev) => prev + 1);

      // 에디터 섹션으로 스크롤
      scrollToSection("editor");

      toast.success("Template applied successfully!");
    },
    [scrollToSection, onUseTemplate],
  );

  return (
    <>
      <Helmet>
        <title>Thumbnail Maker</title>
      </Helmet>
      <FullPageScroller>
        {/* Page 1: Editor */}
        <Section id="editor">
          <div className="relative grid w-full grid-cols-[1fr_minmax(0,782px)_1fr] gap-4 px-4 md:grid-cols-[1fr_782px_1fr]">
            <div></div>
            <PaletteProvider key={`palette-${templateKey}`}>
              <TagProvider key={`tag-${templateKey}`}>
                <ThumbnailMaker />
              </TagProvider>
            </PaletteProvider>

            <div className="flex justify-end">
              <ThankYouAlert />
            </div>
          </div>

          <ScrollHint onClick={handleScrollToTemplates} />
        </Section>

        {/* Page 2: Template Gallery */}
        <Section id="templates">
          <TemplateGallery onApply={handleApplyTemplate} />
        </Section>
      </FullPageScroller>
    </>
  );
}
