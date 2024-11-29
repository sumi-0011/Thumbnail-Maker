import { Image } from "lucide-react";
import { Button } from "../ui/button";
import { AddTagSection } from "./AddTagSection";
import { CanvasContainer } from "./CanvasContainer";
import { useCheckTagOverflow } from "./hooks/useCheckTagOverflow";
import { usePreview } from "./hooks/usePreview";
import { TagChangeSheet } from "./TagChangeSheet";
import { PalettePicker } from "./PalettePicker";
import { Tag } from "./assets/palette.types";
import { TagEmojiSheet } from "./TagEmojiSheet";
import { SubActionMenu } from "./SubActionMenu";
import { TagList } from "./TagList";
import { useSelectedTagAction, useTagAction } from "./Tag.context";
import { Switch } from "../ui/switch";
import { useState } from "react";

function ThumbnailMaker() {
  const [isDragMode, setIsDragMode] = useState(false);
  const { previewRef, onDownload, getImageFile } = usePreview();
  const { tagsContainerRef, checkOverflow, showOverflowToast } =
    useCheckTagOverflow();

  const { onAddTag, onRemoveTag, onRollbackTags, onUpdateTag } = useTagAction();

  const { onSelectTag, clearSelectedTag } = useSelectedTagAction();

  const handleAddTag = (newTag: Tag) => {
    onAddTag(newTag);

    //  requestAnimationFrame을 사용하여 다음 렌더링 사이클에서 오버플로우를 체크함으로써, DOM 업데이트가 완료된 후에 체크
    requestAnimationFrame(() => {
      const overflow = checkOverflow();
      if (overflow) {
        showOverflowToast(overflow);
        onRollbackTags();
      }
    });
  };

  const handleChangeTag = async (newTag: Tag) => {
    onUpdateTag(newTag.id, newTag);

    requestAnimationFrame(() => {
      const overflow = checkOverflow();
      if (overflow) {
        showOverflowToast(overflow);
        onRollbackTags();
      } else {
        clearSelectedTag();
      }
    });
  };

  const handleRemoveTag = (tagId: number) => {
    onRemoveTag(tagId);
    clearSelectedTag();
  };

  return (
    <div className="mx-auto flex max-w-[768px] flex-col gap-4">
      <h1 className="mb-7 text-center text-[60px] text-[#C1CCFF]">
        Thumbnail Maker
      </h1>

      <AddTagSection onAction={handleAddTag} />

      <div className="flex items-center gap-2">
        <Switch />
        <p>Drag Mode</p>
      </div>
      <CanvasContainer
        previewRef={previewRef}
        tagsContainerRef={tagsContainerRef}
      >
        <TagList setOpenTagSheet={onSelectTag} />
      </CanvasContainer>
      <TagChangeSheet
        onStyleChange={handleChangeTag}
        onRemove={handleRemoveTag}
      />
      <TagEmojiSheet
        onStyleChange={handleChangeTag}
        onRemove={handleRemoveTag}
      />
      <div className="flex items-center justify-between">
        <PalettePicker />
        <div className="flex items-center gap-2">
          <SubActionMenu getImageFile={getImageFile} />
          <Button onClick={onDownload}>
            <Image size={20} className="mr-2" /> Download Image
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ThumbnailMaker;
