import React, { useState, useRef, useEffect } from "react";
import { Image } from "lucide-react";
import { Button } from "../ui/button";
import { PALLETTE } from "./constants";
import { Tag } from "./types";
import { AddTagSection } from "./AddTagSection";
import { CanvasContainer } from "./CanvasContainer";
import { TagItem } from "./TagItem";
import { toast } from "sonner";

function ThumbnailMaker() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [bgColor, setBgColor] = useState(PALLETTE.gradient_blue.bg);

  const { previewRef, onDownload } = usePreview();
  const { tagsContainerRef, checkOverflow, showOverflowToast } =
    useCheckTagContainerOverflow();

  const onTagsUpdate = (newTags: Tag[]) => {
    setTags(newTags);
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onTagsUpdate(newTags);
  };

  const handleAddTag = (newTag: (typeof tags)[0]) => {
    const newTags = [...tags, newTag];
    onTagsUpdate(newTags);

    //  requestAnimationFrame을 사용하여 다음 렌더링 사이클에서 오버플로우를 체크함으로써, DOM 업데이트가 완료된 후에 체크
    requestAnimationFrame(() => {
      const overflow = checkOverflow();
      if (overflow) {
        showOverflowToast(overflow);
        onTagsUpdate(tags);
      }
    });
  };

  return (
    <div className="mx-auto max-w-[768px]">
      <h1 className="mb-7 text-center text-[80px] text-white">
        Thumbnail Maker
      </h1>
      <AddTagSection onAction={handleAddTag} />
      <div className="mt-8">
        <CanvasContainer
          previewRef={previewRef}
          bgColor={bgColor}
          tagsContainerRef={tagsContainerRef}
        >
          {tags.map((tag, index) => (
            <TagItem
              key={index}
              tag={tag}
              onRemove={() => handleRemoveTag(index)}
            />
          ))}
        </CanvasContainer>
      </div>
      <Button variant="secondary" onClick={onDownload} className="mt-6">
        <Image size={20} style={{ marginRight: "10px" }} /> 이미지 다운로드
      </Button>
    </div>
  );
}

export default ThumbnailMaker;

type OverflowMessage = "vertical-overflow" | "horizontal-overflow";

const useCheckTagContainerOverflow = () => {
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  const showOverflowToast = (overflow: OverflowMessage) => {
    if (overflow === "vertical-overflow") {
      toast.error("공간이 부족해 태그를 더 이상 추가할 수 없습니다.", {
        position: "top-right",
      });
    } else if (overflow === "horizontal-overflow") {
      toast.error("너무 긴 태그는 추가할 수 없습니다.", {
        position: "top-right",
      });
    }
  };

  const checkOverflow = (): false | OverflowMessage => {
    if (tagsContainerRef.current) {
      const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } =
        tagsContainerRef.current;
      const hasHorizontalOverflow = scrollWidth > offsetWidth;
      const hasVerticalOverflow = scrollHeight > offsetHeight;

      if (hasVerticalOverflow) return "vertical-overflow";
      if (hasHorizontalOverflow) return "horizontal-overflow";
    }
    return false;
  };

  return { tagsContainerRef, checkOverflow, showOverflowToast };
};

const usePreview = () => {
  const previewRef = useRef<HTMLDivElement>(null);

  const onDownload = () => {};

  return { previewRef, onDownload };
};
