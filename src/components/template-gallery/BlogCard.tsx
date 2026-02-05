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
      className="relative w-[280px] h-[160px] rounded-xl overflow-hidden shrink-0 border border-border/30 bg-card"
      whileHover={{ scale: 1.03   }}
      transition={{ duration: 0.3 }}
    >
      {/* 이미지 */}
      {displayImage ? (
        <img
          src={displayImage}
          alt={displayTitle}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
      )}

      {/* 블로그 버튼만 표시 */}
      <motion.button
        onClick={handleBlogClick}
        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-500/80 hover:bg-purple-500 backdrop-blur-sm rounded-full text-white text-xs font-medium transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ExternalLink className="w-3 h-3" />
        Blog
      </motion.button>
    </motion.div>
  );
}
