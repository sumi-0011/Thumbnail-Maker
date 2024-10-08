import { X } from "lucide-react";
import { cn } from "src/lib/utils";
import { CSSProperties } from "react";
import { getTagStyleKey } from "./assets/utils";
import { useCurrentPaletteStyle } from "./Palette.context";
import { Tag } from "./assets/palette.types";
import { cva } from "class-variance-authority";

interface Props {
  tag: Tag;
  onRemove: () => void;
  onClick: () => void;
  className?: string;
}

export function TagItem({ tag, onRemove, onClick, className }: Props) {
  const paletteStyle = useCurrentPaletteStyle();
  return (
    <div className={cn("group relative", className)} onClick={onClick}>
      <TagItemView
        tag={tag}
        tagStyle={paletteStyle.tagStyle[getTagStyleKey(tag)]}
      />
      <div
        className="absolute -right-1 -top-1  hidden h-6 w-6 cursor-default justify-center rounded-full bg-white/80 p-0.5 align-middle group-hover:flex"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X size={20} color="#454545" />
      </div>
    </div>
  );
}

interface TagItemViewProps {
  tag: Tag;
  tagStyle: CSSProperties;
  size?: "base" | "small";
}

export function TagItemView({
  tag,
  tagStyle,
  size = "base",
}: TagItemViewProps) {
  return (
    <div
      className={cn(
        tagVariants({ variant: tag.tagVariant, shape: tag.tagShape, size })
      )}
      style={tagStyle}
    >
      <span>
        {tag.tagContentType === "3d-emoji" ? (
          <img
            src={`https://avahrjwyynzeocqpyfhw.supabase.co/storage/v1/object/public/3d-fluent-emojis${tag.text.image}`}
            width={90}
            height={90}
            style={{ pointerEvents: "none" }}
          />
        ) : (
          tag.text
        )}
      </span>
    </div>
  );
}

const tagVariants = cva(
  "relative flex min-w-fit max-w-full cursor-pointer select-none items-center overflow-hidden truncate whitespace-nowrap transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        filled: "px-6",
        outlined: "px-6 border-[4px] border-white/70 bg-white/10 text-white",
        ghost: "px-3 bg-transparent color-white",
      },
      size: {
        base: "h-[90px] text-[48px] font-bold leading-[90px]",
        small: "h-[48px] text-[24px] font-bold leading-[48px] px-3",
      },
      shape: {
        round: "rounded-[45px]",
        squared: "rounded-[16px]",
        emoji: "rounded-0 p-0",
      },
    },
    compoundVariants: [
      {
        shape: "round",
        size: "small",
        className: "px-3 rounded-[24px]",
      },
      {
        shape: "squared",
        size: "small",
        className: "px-3 rounded-[8px]",
      },
      {
        variant: "outlined",
        size: "small",
        className: "!border-[2px] border-white/70",
      },
      {
        variant: "ghost",
        size: "small",
        className: "px-[7px]",
      },
    ],
    defaultVariants: {
      variant: "filled",
      size: "base",
    },
  }
);
