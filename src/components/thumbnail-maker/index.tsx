import React, { useState, useRef } from "react";
import { Tag, Plus, Image, Palette, X, SmilePlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { AddTagSection, TagShape, TagVariant } from "./AddTagSection";
import ThumbnailPreview from "./ThumbnailPreview";
import { PALLETTE } from "./constants";
import { toast } from "src/hooks/use-toast";

type Tag = { text: string; tagVariant: TagVariant; tagShape: TagShape };

const ThumbnailMaker = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [bgColor, setBgColor] = useState(PALLETTE.gradient_blue.bg);
  const previewRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState<false | string>(false);

  const handleTagsUpdate = (newTags: Tag[], overflow: false | string) => {
    setTags(newTags);
    setIsOverflowing(overflow);
    if (overflow) {
      // 추가적인 UI 피드백이나 로직을 여기에 구현할 수 있습니다.
      console.warn("태그 영역이 가득 찼습니다.");
    }
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
      <ThumbnailPreview
        tags={tags}
        bgColor={bgColor}
        previewRef={previewRef}
        onTagsUpdate={handleTagsUpdate}
      />
      <Button variant="secondary" onClick={handlePreview} className="mt-6">
        <Image size={20} style={{ marginRight: "10px" }} /> 이미지 다운로드
      </Button>{" "}
      <Button onClick={() => toast({ title: "Scheduled: Catch up" })}>
        Show Toast
      </Button>
    </div>
  );
};

export default ThumbnailMaker;
