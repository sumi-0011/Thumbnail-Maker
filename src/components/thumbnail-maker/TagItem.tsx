import { X } from "lucide-react";
import { cn } from "src/lib/utils";
import { TagVariant, TagShape } from "./AddTagSection";
import { tagSize, tagStyle } from "./constants";

export function TagItem({
  tag,
  onRemove,
}: {
  tag: { text: string; tagVariant: TagVariant; tagShape: TagShape };
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        ...tagSize.base,
        ...tagStyle[`${tag.tagVariant}-${tag.tagShape}`],
      }}
      className={cn(
        "relative flex min-w-fit max-w-full cursor-pointer items-center overflow-hidden truncate whitespace-nowrap rounded-full transition-all duration-300 ease-in-out"
      )}
    >
      <span>{tag.text}</span>
      <div
        className="absolute -right-1 -top-1 hidden cursor-pointer rounded-full bg-white/80 p-0.5"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X size={12} color="#ff4d4f" />
      </div>
    </div>
  );
}
