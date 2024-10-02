import React, { useState, useRef } from "react";
import { Tag, Plus, Image, Palette, X } from "lucide-react";

const ThumbnailMaker = () => {
  const [tags, setTags] = useState<{ text: string; style: string }[]>([]);
  const [bgColor, setBgColor] = useState("#f0f4f8");
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
        maxWidth: "700px",
        margin: "0 auto",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        Thumbnail Maker
      </h1>

      <AddTagSection onAction={addTag} />

      <BgColorPicker onChangeBgColor={setBgColor} />

      <ThumbnailPreview
        tags={tags}
        bgColor={bgColor}
        previewRef={previewRef}
        removeTag={removeTag}
      />

      <button
        onClick={handlePreview}
        style={{
          padding: "12px 20px",
          backgroundColor: "#2ecc71",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          fontSize: "16px",
          transition: "background-color 0.3s ease",
        }}
      >
        <Image size={20} style={{ marginRight: "10px" }} /> Preview Thumbnail
      </button>
    </div>
  );
};

export default ThumbnailMaker;

function AddTagSection({
  onAction,
}: {
  onAction: (inputValue: string, tagStyle: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [tagStyle, setTagStyle] = useState("filled");

  const onActionClick = async () => {
    onAction(inputValue, tagStyle);
    setInputValue("");
  };

  return (
    <div style={{ display: "flex", marginBottom: "20px", gap: "10px" }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a tag"
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "6px",
          border: "1px solid #e0e0e0",
          fontSize: "16px",
          transition: "border-color 0.3s ease",
        }}
      />
      <select
        value={tagStyle}
        onChange={(e) => setTagStyle(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "6px",
          border: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        <option value="filled">Filled</option>
        <option value="outlined">Outlined</option>
      </select>
      <button
        onClick={onActionClick}
        style={{
          padding: "12px 20px",
          backgroundColor: "#4a90e2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "16px",
          transition: "background-color 0.3s ease",
        }}
      >
        <Plus size={20} style={{ marginRight: "8px" }} /> Add Tag
      </button>
    </div>
  );
}

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
    <div style={{ marginBottom: "20px" }}>
      <h3 style={{ marginBottom: "10px", color: "#333" }}>Preview</h3>
      <div
        ref={previewRef}
        style={{
          width: "300px",
          height: "200px",
          backgroundColor: bgColor,
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
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
