import { useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useScrollToSection } from "../landing/FullPageScroller";
import { useSupabaseTemplates } from "./useSupabaseTemplates";
import { Skeleton } from "src/components/ui/skeleton";
import { Template } from "src/components/gallery/GalleryItem";
import { Marquee, ParticleBackground } from "./animations";

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
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground particleCount={60} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col px-6 py-8 max-w-[1200px] mx-auto w-full">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h2
              className="text-3xl font-bold text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ✨ Template Gallery
            </motion.h2>
            <motion.p
              className="text-base text-gray-300 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Create thumbnails easily using templates made by others! 🎨🚀
            </motion.p>
          </div>
          <motion.button
            onClick={handleScrollToEditor}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ y: -2 }}
          >
            <ChevronUp className="w-4 h-4" />
            Back to Editor
          </motion.button>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center h-40 text-red-400">
            Failed to load templates. Please try again later.
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-[280px] h-[160px] rounded-xl"
                />
              ))}
            </div>
          </div>
        )}

        {/* Marquee View */}
        {!isLoading && !error && templates.length > 0 && (
          <motion.div
            className="flex-1 flex flex-col justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top row - left direction */}
            <Marquee direction="left" speed={40} pauseOnHover>
              {templates.map((template) => (
                <MarqueeCard
                  key={template.id}
                  template={template}
                  onClick={() => handleItemClick(template)}
                />
              ))}
            </Marquee>

            {/* Bottom row - right direction */}
            <Marquee direction="right" speed={35} pauseOnHover>
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
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No templates available
          </div>
        )}
      </div>
    </div>
  );
}

// Marquee card component
interface MarqueeCardProps {
  template: Template;
  onClick: () => void;
}

function MarqueeCard({ template, onClick }: MarqueeCardProps) {
  return (
    <motion.div
      className="relative w-[280px] h-[160px] rounded-xl overflow-hidden cursor-pointer shrink-0 border border-border/30"
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={template.thumbnail}
        alt={template.title}
        className="w-full h-full object-cover"
        draggable={false}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <div>
          <h3 className="text-white font-medium text-sm">{template.title}</h3>
          <p className="text-gray-300 text-xs mt-1 line-clamp-1">
            {template.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
