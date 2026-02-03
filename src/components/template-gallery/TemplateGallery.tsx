import { useState, useCallback } from "react";
import { useTemplates, Template } from "./useTemplates";
import { TemplateCard } from "./TemplateCard";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
import { cn } from "src/lib/utils";
import { ChevronUp } from "lucide-react";
import { useScrollToSection } from "../landing/FullPageScroller";

interface TemplateGalleryProps {
  onApply: (template: Template) => void;
}

export function TemplateGallery({ onApply }: TemplateGalleryProps) {
  const { templates, categories, selectedCategory, setSelectedCategory } = useTemplates();
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const { scrollToSection } = useScrollToSection();

  const handlePreview = useCallback((template: Template) => {
    setPreviewTemplate(template);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewTemplate(null);
  }, []);

  const handleApply = useCallback((template: Template) => {
    onApply(template);
    setPreviewTemplate(null);
  }, [onApply]);

  const handleScrollToEditor = useCallback(() => {
    scrollToSection("editor");
  }, [scrollToSection]);

  return (
    <div className="h-full flex flex-col px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Template Gallery</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a template to get started quickly
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

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {templates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={handlePreview}
              index={index}
            />
          ))}
        </div>

        {templates.length === 0 && (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            No templates found in this category
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        onClose={handleClosePreview}
        onApply={handleApply}
      />
    </div>
  );
}
