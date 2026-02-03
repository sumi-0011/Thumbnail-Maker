import { Template } from "./useTemplates";
import { PALETTE } from "src/components/thumbnail-maker/assets/palette.constants";
import { cn } from "src/lib/utils";

interface TemplateCardProps {
  template: Template;
  onClick: (template: Template) => void;
  index: number;
}

export function TemplateCard({ template, onClick, index }: TemplateCardProps) {
  const paletteStyle = PALETTE[template.palette];

  const getTagStyle = (tag: typeof template.tags[0]) => {
    const key = `${tag.tagVariant}-${tag.tagShape}` as const;
    const baseStyle = paletteStyle.tagStyle[key] || {};

    return {
      ...baseStyle,
      fontSize: "10px",
      padding: "2px 8px",
      borderRadius: tag.tagShape === "round" ? "9999px" : "4px",
    };
  };

  return (
    <button
      onClick={() => onClick(template)}
      className={cn(
        "group relative flex flex-col rounded-lg overflow-hidden",
        "border border-border/50 hover:border-border",
        "bg-card/50 hover:bg-card",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg hover:scale-[1.02]",
        "opacity-0 animate-fade-in-up cursor-pointer text-left"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Preview Area */}
      <div
        className="relative h-28 w-full flex items-center justify-center gap-1.5 p-3 flex-wrap"
        style={{
          background: paletteStyle.background,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {template.tags.slice(0, 3).map((tag) => (
          <span
            key={tag.id}
            style={getTagStyle(tag)}
            className="whitespace-nowrap"
          >
            {tag.content.type === "text" ? tag.content.value : ""}
          </span>
        ))}
      </div>

      {/* Info Area */}
      <div className="p-3 flex-1 flex flex-col gap-1">
        <h3 className="font-medium text-sm text-foreground truncate">
          {template.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {template.description}
        </p>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </button>
  );
}
