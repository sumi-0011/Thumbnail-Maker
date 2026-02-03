import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ThumbnailMaker from "src/components/thumbnail-maker";
import { PaletteProvider } from "src/components/thumbnail-maker/Palette.context";
import { TagProvider } from "src/components/thumbnail-maker/Tag.context";
import { Button } from "src/components/ui/button";
import { FullPageScroller, useScrollToSection } from "src/components/landing/FullPageScroller";
import { Section } from "src/components/landing/Section";
import { ScrollHint } from "src/components/landing/ScrollHint";
import { TemplateGallery } from "src/components/template-gallery/TemplateGallery";
import { Template } from "src/components/template-gallery/useTemplates";
import { useSetTemplate } from "src/components/thumbnail-maker/hooks/useSetTemplate";

export default function Home() {
  const { t } = useTranslation("translation");
  const [isToastShown, setIsToastShown] = useState(false);
  const [templateKey, setTemplateKey] = useState(0);
  const { scrollToSection } = useScrollToSection();
  const { onUseTemplate } = useSetTemplate();

  useEffect(() => {
    // 약간의 지연을 주어 toast가 준비된 후 실행
    const timer = setTimeout(() => {
      if (!isToastShown) {
        toast("Love this project? ⭐️", {
          duration: Infinity,
          position: "bottom-left",
          description: (
            <>
              Show your support by giving us a star on GitHub!
              <br />
              Stars help others discover this project and keep you notified of
              updates and new features.
              <Button
                size="sm"
                variant="outline"
                className="mt-2 ml-auto flex justify-center items-center w-fit"
                asChild
              >
                <a
                  href="https://github.com/sumi-0011/Thumbnail-Maker"
                  target="_blank"
                >
                  Star on GitHub
                </a>
              </Button>
            </>
          ),
        });
        setIsToastShown(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isToastShown]);

  const handleScrollToTemplates = useCallback(() => {
    scrollToSection("templates");
  }, [scrollToSection]);

  const handleApplyTemplate = useCallback((template: Template) => {
    // 템플릿 데이터를 useSetTemplate 형식에 맞게 변환
    onUseTemplate({
      palette: { type: template.palette },
      tags: JSON.stringify(template.tags),
    });

    // Provider를 리마운트하여 새로운 상태 반영
    setTemplateKey((prev) => prev + 1);

    // 에디터 섹션으로 스크롤
    scrollToSection("editor");

    toast.success("Template applied successfully!");
  }, [scrollToSection, onUseTemplate]);

  return (
    <>
      <Helmet>
        <title>Thumbnail Maker</title>
      </Helmet>
      <FullPageScroller>
        {/* Page 1: Editor */}
        <Section id="editor" className="relative">
          <PaletteProvider key={`palette-${templateKey}`}>
            <TagProvider key={`tag-${templateKey}`}>
              <ThumbnailMaker />
            </TagProvider>
          </PaletteProvider>
          <ScrollHint onClick={handleScrollToTemplates} />
        </Section>

        {/* Page 2: Template Gallery */}
        <Section id="templates" className="bg-[#1D2027]">
          <TemplateGallery onApply={handleApplyTemplate} />
        </Section>
      </FullPageScroller>
    </>
  );
}
