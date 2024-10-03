import React, { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "src/lib/utils";
import { canvasSize, tagSize, tagStyle } from "./constants";
import { AddTagSection, TagShape, TagVariant } from "./AddTagSection";

function ThumbnailPreview({
  tags,
  bgColor,
  previewRef,
  onTagsUpdate,
}: {
  tags: { text: string; tagVariant: TagVariant; tagShape: TagShape }[];
  bgColor: string;
  previewRef: React.RefObject<HTMLDivElement>;
  onTagsUpdate: (newTags: typeof tags, isOverflowing: false | string) => void;
}) {
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  const [overflowMessage, setOverflowMessage] = useState("");

  const checkOverflow = () => {
    if (tagsContainerRef.current) {
      const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } =
        tagsContainerRef.current;
      const hasHorizontalOverflow = scrollWidth > offsetWidth;
      const hasVerticalOverflow = scrollHeight > offsetHeight;
      const newIsOverflowing = hasHorizontalOverflow || hasVerticalOverflow;

      if (newIsOverflowing && hasHorizontalOverflow) {
        setOverflowMessage("태그가 너무 깁니다. ");
      }
      if (newIsOverflowing && hasVerticalOverflow) {
        setOverflowMessage(
          "태그를 더 이상 추가할 수 없습니다. 공간이 부족합니다."
        );
      }

      return newIsOverflowing;
    }
    return false;
  };

  useEffect(() => {
    checkOverflow();
  }, [tags]);

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onTagsUpdate(newTags, false);
  };

  const handleAddTag = (newTag: (typeof tags)[0]) => {
    const newTags = [...tags, newTag];
    onTagsUpdate(newTags, false);

    //  requestAnimationFrame을 사용하여 다음 렌더링 사이클에서 오버플로우를 체크함으로써, DOM 업데이트가 완료된 후에 체크
    requestAnimationFrame(() => {
      const overflow = checkOverflow();
      if (overflow) {
        console.warn("태그를 더 이상 추가할 수 없습니다. 공간이 부족합니다.");
        onTagsUpdate(tags, overflowMessage);
      }
    });
  };

  return (
    <>
      <AddTagSection onAction={handleAddTag} />
      <div className="mt-8">
        <div
          ref={previewRef}
          style={{
            background: bgColor,
            aspectRatio: canvasSize.aspectRatio,
            padding: canvasSize.padding,
            maxHeight: "100%",
            width: "768px",
          }}
          className="overflow-hidden rounded-lg"
        >
          <div
            ref={tagsContainerRef}
            style={{
              gap: canvasSize.gap,
            }}
            className="flex h-full flex-wrap content-start"
          >
            {tags.map((tag, index) => (
              <TagItem
                key={index}
                tag={tag}
                onRemove={() => handleRemoveTag(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ThumbnailPreview;

function TagItem({
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
