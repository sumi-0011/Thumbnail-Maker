import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp, Plus } from "lucide-react";
import { Skeleton } from "src/components/ui/skeleton";
import { Template } from "src/components/gallery/GalleryItem";
import { useScrollToSection } from "../landing/FullPageScroller";
import { Button } from "../ui/button";
import { useSupabaseTemplates } from "./useSupabaseTemplates";
import { Marquee, ParticleBackground } from "./animations";
import { BlogCard } from "./BlogCard";
import { AddBlogExampleSheet } from "./AddBlogExampleSheet";

interface TemplateGalleryProps {
  onApply: (template: Template) => void;
}

export function TemplateGallery({ onApply }: TemplateGalleryProps) {
  const { templates, isLoading, error, refetch } = useSupabaseTemplates();
  const { scrollToSection } = useScrollToSection();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const handleScrollToEditor = useCallback(() => {
    scrollToSection("editor");
  }, [scrollToSection]);

  const handleItemClick = useCallback(
    (template: Template) => {
      onApply(template);
    },
    [onApply],
  );

  const handleAddSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground particleCount={60} />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1200px] flex-col px-6 py-8">
        {/* Header */}

        {/* Floating Buttons */}
        <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
          {/* Add Example Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={() => setIsAddSheetOpen(true)} variant="default">
              <Plus className="h-4 w-4" />
              사용 예시 추가
            </Button>
          </motion.div>

          {/* Back Button */}
          <motion.div
            onClick={handleScrollToEditor}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={handleScrollToEditor} variant="outline">
              <ChevronUp className="h-4 w-4" />
              Editor
            </Button>
          </motion.div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex h-40 items-center justify-center text-red-400">
            Failed to load templates. Please try again later.
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[160px] w-[280px] rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* Marquee View */}
        {!isLoading && !error && templates.length > 0 && (
          <motion.div
            className="flex flex-1 flex-col justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Row 1 - left */}
            <Marquee direction="left" speed={35} pauseOnHover>
              {templates.map((template) => (
                <MarqueeCard
                  key={template.id}
                  template={template}
                  onClick={() => handleItemClick(template)}
                />
              ))}
            </Marquee>

            {/* Row 2 - right */}
            <Marquee direction="right" speed={30} pauseOnHover>
              {[...templates].reverse().map((template) => (
                <MarqueeCard
                  key={template.id}
                  template={template}
                  onClick={() => handleItemClick(template)}
                />
              ))}
            </Marquee>

            {/* Row 3 - left (slower) */}
            <Marquee direction="left" speed={25} pauseOnHover>
              {templates.map((template) => (
                <MarqueeCard
                  key={template.id}
                  template={template}
                  onClick={() => handleItemClick(template)}
                />
              ))}
            </Marquee>

            {/* Row 4 - right (slower) */}
            <Marquee direction="right" speed={20} pauseOnHover>
              {[...templates].reverse().map((template) => (
                <MarqueeCard
                  key={template.id}
                  template={template}
                  onClick={() => handleItemClick(template)}
                />
              ))}
            </Marquee>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && templates.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            No templates available
          </div>
        )}
      </div>

      {/* Add Blog Example Sheet */}
      <AddBlogExampleSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}

// Marquee card component - 템플릿 타입에 따라 다른 카드 렌더링
interface MarqueeCardProps {
  template: Template;
  onClick: () => void;
}

function MarqueeCard({ template, onClick }: MarqueeCardProps) {
  // blog_only 타입은 BlogCard로 렌더링
  if (template.template_type === "blog_only") {
    return <BlogCard template={template} onClick={onClick} />;
  }

  // full_with_blog 타입: 기존 템플릿 카드 + 블로그 링크 배지
  const hasBlog =
    template.template_type === "full_with_blog" && template.blog_url;

  return (
    <motion.div
      className="relative h-[160px] w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border/30"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={template.thumbnail}
        alt={template.title}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <motion.div
        className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition-opacity hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="flex-1">
          <h3 className="text-sm font-medium text-white">{template.title}</h3>
          <p className="mt-1 line-clamp-1 text-xs text-gray-300">
            {template.description}
          </p>
          {template.author_name && (
            <p className="mt-1 text-xs text-gray-400">
              by {template.author_name}
            </p>
          )}
        </div>
        {hasBlog && (
          <a
            href={template.blog_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-2 text-xs text-purple-300 underline hover:text-purple-200"
          >
            Blog
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}
