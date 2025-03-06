import React from "react";
import { TagAlignment, useTagStyle, useTagStyleAction } from "../Tag.context";
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from "lucide-react"; // 아이콘은 필요에 따라 변경하세요

export const AlignmentMenu = () => {
  const { alignment } = useTagStyle();
  const { setAlignment } = useTagStyleAction();

  const handleAlignmentChange = (newAlignment: TagAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">태그 정렬</h3>
      <div className="flex gap-2">
        <button
          className={`p-2 rounded border ${
            alignment === "start" ? "border border-gray-100" : "border-gray-50 "
          }`}
          onClick={() => handleAlignmentChange("start")}
          title="좌측 정렬"
        >
          <AlignLeftIcon size={16} />
        </button>
        <button
          className={`p-2 rounded border ${
            alignment === "center"
              ? "border border-gray-100"
              : "border-gray-50 "
          }`}
          onClick={() => handleAlignmentChange("center")}
          title="중앙 정렬"
        >
          <AlignCenterIcon size={16} />
        </button>
        <button
          className={`p-2 rounded border ${
            alignment === "end" ? "border border-gray-100" : "border-gray-50 "
          }`}
          onClick={() => handleAlignmentChange("end")}
          title="우측 정렬"
        >
          <AlignRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};
