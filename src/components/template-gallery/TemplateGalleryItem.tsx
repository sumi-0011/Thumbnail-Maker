import { ArrowRightIcon } from "lucide-react";
import { cn } from "src/lib/utils";
import { Template } from "src/components/gallery/GalleryItem";

interface TemplateGalleryItemProps {
  template: Template;
  onClick: (template: Template) => void;
  index?: number;
}

export function TemplateGalleryItem({ template, onClick, index = 0 }: TemplateGalleryItemProps) {
  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-lg overflow-hidden",
        "border border-border/30 hover:border-border/60",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg hover:scale-[1.02]",
        "opacity-0 animate-fade-in-up"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
      onClick={() => onClick(template)}
    >
      {/* Thumbnail */}
      <div className="overflow-hidden">
        <img
          src={template.thumbnail}
          alt={template.title}
          draggable={false}
          className="w-full transition-transform duration-300 group-hover:scale-105"
          style={{ aspectRatio: "330/172" }}
        />
      </div>

      {/* Hover Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/70 p-4",
          "flex flex-col justify-between",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-300"
        )}
      >
        {/* Title & Description */}
        <div>
          <h3 className="text-sm font-medium text-white truncate">
            {template.title}
          </h3>
          {template.description && (
            <p className="text-xs text-gray-300 mt-1 line-clamp-2">
              {template.description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <button className="flex cursor-pointer items-center gap-2 text-sm text-white hover:underline self-end">
          <span>Use Template</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
