import React, { useState, useRef } from "react";
import { Tag, Plus, Image, Palette, X, SmilePlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { AddTagSection, TagShape, TagVariant } from "./AddTagSection";
import ThumbnailPreview from "./ThumbnailPreview";
import { PALLETTE } from "./constants";

type Tag = { text: string; tagVariant: TagVariant; tagShape: TagShape };

const ThumbnailMaker = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [bgColor, setBgColor] = useState(PALLETTE.gradient_blue.bg);
  const previewRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const handleTagsUpdate = (newTags: Tag[], overflow: boolean) => {
    setTags(newTags);
    setIsOverflowing(overflow);
    if (overflow) {
      // 추가적인 UI 피드백이나 로직을 여기에 구현할 수 있습니다.
      console.warn("태그 영역이 가득 찼습니다.");
    }
  };

  const addTag = (newTag: Tag) => {
    if (!isOverflowing) {
      // ThumbnailPreview 컴포넌트 내부의 handleAddTag가 이를 처리합니다.
      // 실제 태그 추가 여부는 오버플로우 체크 후 결정됩니다.
      setTags((prevTags) => [...prevTags, newTag]);
    } else {
      console.warn("태그를 더 이상 추가할 수 없습니다.");
    }
  };
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handlePreview = () => {
    // console.log("Preview functionality not implemented yet");
  };

  return (
    <div
      style={{
        maxWidth: "768px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 className="mb-7 text-center text-[80px] text-white">
        Thumbnail Maker
      </h1>

      {/* <AddTagSection onAction={addTag} /> */}

      <ThumbnailPreview
        tags={tags}
        bgColor={bgColor}
        previewRef={previewRef}
        // removeTag={removeTag}
        // onTagOverflow={() => console.log("overflow")}

        onTagsUpdate={handleTagsUpdate}
      />

      <Button variant="secondary" onClick={handlePreview} className="mt-6">
        <Image size={20} style={{ marginRight: "10px" }} /> 이미지 다운로드
      </Button>
      {isOverflowing && (
        <div className="alert alert-warning mt-2">
          태그 영역이 가득 찼습니다. 더 이상 태그를 추가할 수 없습니다.
        </div>
      )}
    </div>
  );
};

export default ThumbnailMaker;
