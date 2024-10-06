import { X } from "lucide-react";
import { cn } from "src/lib/utils";
import { tagSize, tagStyle } from "./constants";
import { Tag } from "./tag.types";

export function TagItem({
  tag,
  onRemove,
  onClick,
  className,
}: {
  tag: Tag;
  onRemove: () => void;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div className={cn("group relative", className)} onClick={onClick}>
      <TagItemView tag={tag} />
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

export function TagItemView({ tag }: { tag: Tag }) {
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
      <span>
        {tag.tagContentType === "3d-emoji" ? (
          <img
            src={tag.text.url}
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
