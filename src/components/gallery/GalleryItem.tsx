import { ArrowRightIcon, ExternalLink, User, Sparkles, LucideIcon } from "lucide-react";
import { PaletteVariant } from "../thumbnail-maker/assets/palette.types";

export type TemplateType = "blog_only" | "full_with_blog" | "template_only";

export type Template = {
  id: number;
  userId: string;
  title: string;
  description: string;
  thumbnail: string;
  data: {
    palette: {
      type: PaletteVariant | string;
    };
    tags: string;
  } | null;
  // 블로그 연동 필드
  template_type?: TemplateType;
  blog_url?: string;
  blog_title?: string;
  blog_description?: string;
  blog_image?: string;
  author_name?: string;
};

// ============================================================================
// Variant Styles
// ============================================================================

type CardVariant = "blog" | "template";

const variantStyles = {
  blog: {
    border: "border-purple-500/30",
    hoverBorder: "hover:border-purple-500/50",
    bg: "from-purple-900/10",
    shadow: "hover:shadow-purple-500/10",
    badge: "bg-purple-500/20 text-purple-400",
    action: "text-purple-400 group-hover:text-purple-300",
    fallbackGradient: "from-purple-500/20 to-pink-500/20",
    fallbackEmoji: "📝",
  },
  template: {
    border: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-500/50",
    bg: "from-emerald-900/10",
    shadow: "hover:shadow-emerald-500/10",
    badge: "bg-emerald-500/20 text-emerald-400",
    action: "text-emerald-400 group-hover:text-emerald-300",
    fallbackGradient: "from-emerald-500/20 to-teal-500/20",
    fallbackEmoji: "🎨",
  },
} as const;

const variantConfig: Record<
  CardVariant,
  {
    badgeIcon: LucideIcon;
    badgeText: string;
    defaultDescription: string;
  }
> = {
  blog: {
    badgeIcon: ExternalLink,
    badgeText: "Blog",
    defaultDescription: "블로그에서 이 썸네일이 사용되었습니다",
  },
  template: {
    badgeIcon: Sparkles,
    badgeText: "Template",
    defaultDescription: "이 템플릿을 사용해보세요",
  },
};

// ============================================================================
// Sub Components
// ============================================================================

interface ImageSectionProps {
  image: string | undefined;
  alt: string;
  variant: CardVariant;
}

function ImageSection({ image, alt, variant }: ImageSectionProps) {
  const styles = variantStyles[variant];

  return (
    <div className="relative aspect-video overflow-hidden">
      {image ? (
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-[101%] transition-transform duration-300"
          draggable={false}
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${styles.fallbackGradient} flex items-center justify-center`}
        >
          <span className="text-4xl">{styles.fallbackEmoji}</span>
        </div>
      )}
    </div>
  );
}

interface BadgeProps {
  variant: CardVariant;
}

function Badge({ variant }: BadgeProps) {
  const styles = variantStyles[variant];
  const config = variantConfig[variant];
  const Icon = config.badgeIcon;

  return (
    <p
      className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 ${styles.badge} rounded-full text-[10px] font-medium`}
    >
      <Icon className="w-2.5 h-2.5" />
      {config.badgeText}
    </p>
  );
}

interface ContentSectionProps {
  title: string;
  description: string | undefined;
  variant: CardVariant;
}

function ContentSection({ title, description, variant }: ContentSectionProps) {
  const config = variantConfig[variant];

  return (
    <>
      <Badge variant={variant} />
      <div className="flex items-start gap-2">
        <h3 className="text-sm font-semibold text-white line-clamp-1 flex-1">
          {title}
        </h3>
      </div>
      <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px]">
        {description || config.defaultDescription}
      </p>
    </>
  );
}

interface FooterSectionProps {
  template: Template;
  variant: CardVariant;
}

function FooterSection({ template, variant }: FooterSectionProps) {
  const styles = variantStyles[variant];
  const hasLinkedBlog =
    variant === "template" && template.template_type === "full_with_blog";

  return (
    <div className="flex items-center justify-between pt-2 border-t border-white/10">
      {template.author_name ? (
        <div className="flex items-center gap-1.5 text-gray-400">
          <User className="w-3 h-3" />
          <span className="text-xs">{template.author_name}</span>
        </div>
      ) : (
        <div />
      )}

      {variant === "blog" ? (
        <div
          className={`flex items-center gap-1 ${styles.action} text-xs transition-colors`}
        >
          <span>View Blog</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {hasLinkedBlog && template.blog_url && (
            <a
              href={template.blog_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Blog
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <div
            className={`flex items-center gap-1 ${styles.action} text-xs transition-colors`}
          >
            <ArrowRightIcon size={14} />
            <span>Use</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface GalleryCardProps {
  template: Template;
  variant: CardVariant;
  onClick: (template: Template) => void;
}

function GalleryCard({ template, variant, onClick }: GalleryCardProps) {
  const styles = variantStyles[variant];

  // blog variant는 블로그 데이터 우선 사용
  const displayImage =
    variant === "blog"
      ? template.blog_image || template.thumbnail
      : template.thumbnail;
  const displayTitle =
    variant === "blog" ? template.blog_title || template.title : template.title;
  const displayDescription =
    variant === "blog"
      ? template.blog_description || template.description
      : template.description;

  return (
    <div
      className={`group cursor-pointer rounded-xl overflow-hidden border ${styles.border} bg-gradient-to-b ${styles.bg} to-background ${styles.hoverBorder} transition-all duration-300 hover:shadow-lg ${styles.shadow}`}
      onClick={() => onClick(template)}
    >
      <ImageSection image={displayImage} alt={displayTitle} variant={variant} />

      <div className="p-4 space-y-2">
        <ContentSection
          title={displayTitle}
          description={displayDescription}
          variant={variant}
        />
        <FooterSection template={template} variant={variant} />
      </div>
    </div>
  );
}

// ============================================================================
// Export
// ============================================================================

interface GalleryItemProps {
  template: Template;
  onClick: (template: Template) => void;
}

function GalleryItem({ template, onClick }: GalleryItemProps) {
  const variant: CardVariant =
    template.template_type === "blog_only" ? "blog" : "template";

  return (
    <GalleryCard template={template} variant={variant} onClick={onClick} />
  );
}

export default GalleryItem;
