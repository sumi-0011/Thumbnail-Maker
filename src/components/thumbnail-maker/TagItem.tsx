import { X } from "lucide-react";
import { cn } from "src/lib/utils";
import { CSSProperties, useEffect } from "react";
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
}

export function TagItemView({ tag, tagStyle }: TagItemViewProps) {
  const src =
    "https://avahrjwyynzeocqpyfhw.supabase.co/storage/v1/object/public/3d-emoji/1st_place_medal_3d.png";
  const fuc = async () => {
    const image = await fetch(src);
    console.log("image: ", image);
  };

  useEffect(() => {
    fuc();
  }, []);

  return (
    <div
      className={cn(
        tagVariants({ variant: tag.tagVariant, shape: tag.tagShape })
      )}
      style={tagStyle}
    >
      <span>
        {tag.tagContentType === "3d-emoji" ? (
          <img
            src={src}
            // src={tag.text.url}
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
  "relative flex min-w-fit max-w-full cursor-pointer select-none items-center overflow-hidden truncate whitespace-nowrap rounded-full transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        filled: "px-6",
        outlined: "px-6 border-[4px] border-white/70 bg-white/10 text-white",
        ghost: "px-3 bg-transparent color-white",
      },
      size: {
        base: "h-[90px] text-[48px] font-bold leading-[90px]",
      },
      shape: {
        round: "rounded-[45px]",
        squared: "rounded-[16px]",
        emoji: "rounded-0 p-0",
      },
    },
    compoundVariants: [
      {
        variant: "filled",
        shape: "round",
        className: "filled-round",
      },
      {
        variant: "filled",
        shape: "squared",
        className: "filled-squared",
      },
      {
        variant: "outlined",
        shape: "round",
        className: "outlined-round",
      },
      {
        variant: "outlined",
        shape: "squared",
        className: "outlined-squared",
      },
    ],
    defaultVariants: {
      variant: "filled",
      size: "base",
    },
  }
);
