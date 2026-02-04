import { useCallback } from "react";
import { ChevronUp } from "lucide-react";
import { useScrollToSection } from "../landing/FullPageScroller";
import { useSupabaseTemplates } from "./useSupabaseTemplates";
import { TemplateGalleryItem } from "./TemplateGalleryItem";
import { Skeleton } from "src/components/ui/skeleton";
import { Template } from "src/components/gallery/GalleryItem";

interface TemplateGalleryProps {
  onApply: (template: Template) => void;
}

export function TemplateGallery({ onApply }: TemplateGalleryProps) {
  const { templates, isLoading, error } = useSupabaseTemplates();
  const { scrollToSection } = useScrollToSection();

  const handleScrollToEditor = useCallback(() => {
    scrollToSection("editor");
  }, [scrollToSection]);

  const handleItemClick = useCallback(
    (template: Template) => {
      onApply(template);
    },
    [onApply]
  );

  return (
    <div className="h-full flex flex-col px-6 py-8 max-w-[1024px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gallery</h2>
          <p className="text-base text-gray-300 mt-2">
            Create thumbnails easily using templates made by others! 🎨🚀
          </p>
        </div>
        <button
          onClick={handleScrollToEditor}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
          Back to Editor
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto scrollbar">
        {error && (
          <div className="flex items-center justify-center h-40 text-red-400">
            Failed to load templates. Please try again later.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {isLoading && (
            <>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} style={{ aspectRatio: "330/172" }} />
              ))}
            </>
          )}

          {!isLoading &&
            templates.map((template, index) => (
              <TemplateGalleryItem
                key={template.id}
                template={template}
                onClick={handleItemClick}
                index={index}
              />
            ))}
        </div>

        {!isLoading && !error && templates.length === 0 && (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            No templates available
          </div>
        )}
      </div>
    </div>
  );
}
