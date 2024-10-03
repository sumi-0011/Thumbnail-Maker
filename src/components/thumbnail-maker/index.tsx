import React, { useState, useRef } from "react";
import { Tag, Plus, Image, Palette, X, SmilePlusIcon } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { AddTagSection } from "./AddTagSection";

const PALLETTE = {
  gradient_blue: {
    bg: "linear-gradient(127deg, #8ECDF2 3.2%, #A0C8FC 21.06%, #A4C7FE 30.47%, #96BDFE 38.93%, #84B0FE 47.86%, #2B6FFF 97.22%)",
    "filled-round": {
      bg: "linear-gradient(120deg, #2EA1FF 14.35%, #5D9CFF 45.44%, #1F65FD 93.51%)",
      color: "#fff",
    },
    "filled-square": {
      bg: "#fff",
      color: "#3176FF",
    },
  },
};

const ThumbnailMaker = () => {
  const [tags, setTags] = useState<{ text: string; style: string }[]>([]);
  const [bgColor, setBgColor] = useState(PALLETTE.gradient_blue.bg);
  const previewRef = useRef(null);
  console.log("previewRef: ", previewRef);

  const addTag = (inputValue: string, tagStyle: string) => {
    if (inputValue.trim() !== "") {
      setTags((prevTags) => [
        ...prevTags,
        { text: inputValue.trim(), style: tagStyle },
      ]);
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handlePreview = () => {
    console.log("Preview functionality not implemented yet");
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

      <AddTagSection onAction={addTag} />

      <ThumbnailPreview
        tags={tags}
        bgColor={bgColor}
        previewRef={previewRef}
        removeTag={removeTag}
      />

      <Button variant="secondary" onClick={handlePreview} className="mt-6">
        <Image size={20} style={{ marginRight: "10px" }} /> 이미지 다운로드
      </Button>
    </div>
  );
};

export default ThumbnailMaker;

function BgColorPicker({
  onChangeBgColor,
}: {
  onChangeBgColor: (value: string) => void;
}) {
  const [bgColor, setBgColor] = useState("#f0f4f8");

  const onChange = (value: string) => {
    setBgColor(value);
    onChangeBgColor(value);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          color: "#555",
        }}
      >
        <Palette size={20} style={{ marginRight: "8px" }} /> Background Color:
      </label>
      <input
        type="color"
        value={bgColor}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

function ThumbnailPreview({
  tags,
  bgColor,
  previewRef,
  removeTag,
}: {
  tags: { text: string; style: string }[];
  bgColor: string;
  previewRef: React.RefObject<HTMLDivElement>;
  removeTag: (index: number) => void;
}) {
  return (
    <div className="mt-8">
      <div
        ref={previewRef}
        style={{
          aspectRatio: "1080/565", // NOTE: 이후에 수정될 수 있음, 현재는 velog 기준
          background: bgColor,
          borderRadius: "8px",
          padding: "10px",
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-start",
          gap: "5px",
          overflow: "hidden",
        }}
      >
        {tags.map((tag, index) => (
          <div
            key={index}
            style={{
              backgroundColor:
                tag.style === "filled" ? "#4a90e2" : "transparent",
              color: tag.style === "filled" ? "white" : "#4a90e2",
              border: tag.style === "outlined" ? "1px solid #4a90e2" : "none",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
              transition: "all 0.3s ease",
              position: "relative",
            }}
          >
            <Tag size={12} style={{ marginRight: "5px", flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {tag.text}
            </span>
            <div
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "50%",
                padding: "2px",
                display: "none",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
            >
              <X size={12} color="#ff4d4f" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
