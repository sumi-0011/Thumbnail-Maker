import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Template } from "src/components/gallery/GalleryItem";

interface BlogCardProps {
  template: Template;
  onClick?: () => void;
}

export function BlogCard({ template }: BlogCardProps) {
  const displayImage = template.blog_image || template.thumbnail;
  const displayTitle = template.blog_title || template.title;

  const handleBlogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (template.blog_url) {
      window.open(template.blog_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      className="relative h-[160px] w-[280px] shrink-0 overflow-hidden rounded-xl border border-border/30 bg-card"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* 이미지 */}
      {displayImage ? (
        <img
          src={displayImage}
          alt={displayTitle}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <span className="text-4xl">📝</span>
        </div>
      )}

      {/* 블로그 버튼만 표시 */}
      <motion.button
        onClick={handleBlogClick}
        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-purple-500/80 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-purple-500"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ExternalLink className="h-3 w-3" />
        Blog
      </motion.button>
    </motion.div>
  );
}
