import { X } from "lucide-react";
import { cn } from "src/lib/utils";
import { CSSProperties } from "react";
import { getTagStyleKey } from "./assets/utils";
import { useCurrentPaletteStyle } from "./Palette.context";
import { Tag } from "./assets/palette.types";
import { cva } from "class-variance-authority";
import { get3DEmojiImage } from "../3d-emoji-picker";
import { useTagSize, TagSizeStyle } from "./TagSize.context";

interface Props {
  tag: Tag;
  onRemove?: () => void;
  onClick?: () => void;
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
      {onRemove && (
        <div
          className="absolute -right-1 -top-1  hidden h-6 w-6 cursor-default justify-center rounded-full bg-white/80 p-0.5 align-middle group-hover:flex"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X size={20} color="#454545" />
        </div>
      )}
    </div>
  );
}

interface TagItemViewProps {
  tag: Tag;
  tagStyle: CSSProperties;
  size?: "base" | "small";
  sizeStyleOverride?: TagSizeStyle;
}

export function TagItemView({
  tag,
  tagStyle,
  size = "base",
  sizeStyleOverride,
}: TagItemViewProps) {
  const tagSizeCtx = useTagSize();
  const sizeStyle = sizeStyleOverride ?? tagSizeCtx.sizeStyle;

  // small size는 편집 시트 프리뷰 전용 - 기존 CVA 사용
  if (size === "small") {
    return (
      <div
        className={cn(
          tagVariants({ variant: tag.tagVariant, shape: tag.tagShape, size })
        )}
        style={tagStyle}
      >
        {tag.content.type === "3d-emoji" ? (
          <img
            src={get3DEmojiImage(tag.content.value)}
            width={48}
            height={48}
            style={{ pointerEvents: "none" }}
            className="h-full w-full"
          />
        ) : tag.content.type === "text" ? (
          tag.content.value
        ) : null}
      </div>
    );
  }

  // base size는 TagSize Context의 동적 값 사용
  const dynamicStyle: CSSProperties = {
    ...tagStyle,
    fontSize: sizeStyle.fontSize,
    height: sizeStyle.tagHeight,
    lineHeight: sizeStyle.lineHeight,
  };

  if (tag.tagShape === "emoji") {
    dynamicStyle.width = sizeStyle.emojiSize;
    dynamicStyle.height = sizeStyle.emojiSize;
  } else if (tag.tagVariant !== "ghost") {
    dynamicStyle.paddingLeft = sizeStyle.paddingX;
    dynamicStyle.paddingRight = sizeStyle.paddingX;
  }

  if (tag.tagShape === "round") {
    dynamicStyle.borderRadius = sizeStyle.borderRadius.round;
  } else if (tag.tagShape === "squared") {
    dynamicStyle.borderRadius = sizeStyle.borderRadius.squared;
  }

  if (tag.tagVariant === "outlined") {
    dynamicStyle.borderWidth = sizeStyle.borderWidth;
  }

  return (
    <div
      className={cn(
        tagVariants({ variant: tag.tagVariant, shape: tag.tagShape, size: "base" })
      )}
      style={dynamicStyle}
    >
      {tag.content.type === "3d-emoji" ? (
        <img
          src={get3DEmojiImage(tag.content.value)}
          width={parseInt(sizeStyle.emojiSize)}
          height={parseInt(sizeStyle.emojiSize)}
          style={{ pointerEvents: "none" }}
          className="h-full w-full"
        />
      ) : tag.content.type === "text" ? (
        tag.content.value
      ) : null}
    </div>
  );
}

const tagVariants = cva(
  "relative flex min-w-fit max-w-full cursor-pointer select-none items-center overflow-hidden truncate whitespace-nowrap transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        filled: "",
        outlined: "border-white/70 bg-white/10 text-white",
        ghost: "bg-transparent color-white",
      },
      size: {
        base: "font-bold",
        small: "h-[48px] text-[24px] font-bold leading-[48px] px-3",
      },
      shape: {
        round: "",
        squared: "",
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
      {
        variant: "ghost",
        shape: "emoji",
        size: "small",
        className: "h-16 w-16",
      },
    ],
    defaultVariants: {
      variant: "filled",
      size: "base",
    },
  }
);
