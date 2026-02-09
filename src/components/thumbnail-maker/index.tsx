import { InfoIcon } from "lucide-react";
import { AddTagSection } from "./AddTagSection";
import { CanvasContainer } from "./CanvasContainer";
import { useCheckTagOverflow } from "./hooks/useCheckTagOverflow";
import { usePreview } from "./hooks/usePreview";
import { TagChangeSheet } from "./TagChangeSheet";
import { PalettePicker } from "./PalettePicker";
import { Tag } from "./assets/palette.types";
import { TagEmojiSheet } from "./TagEmojiSheet";
import { SubActionMenu } from "./SubMenu/SubActionMenu";
import { TagList } from "./TagList";
import { useSelectedTagAction, useTagAction } from "./Tag.context";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { DragModeCanvas } from "./DragMode/DragModeCanvas";
import { MenuBar, Toolbar } from "./MenuBar";
import { CanvasSizeProvider } from "./CanvasSize.context";
import { PaletteProvider } from "./Palette.context";

function ThumbnailMaker() {
  const [isDragMode, setIsDragMode] = useState(false);
  const { previewRef, onDownload: downloadImage, getImageFile } = usePreview();
  const { tagsContainerRef, checkOverflow, showOverflowToast } =
    useCheckTagOverflow();

  const {
    onAddTag,
    onAddTags,
    onRemoveTag,
    onRollbackTags,
    onUpdateTag,
  } = useTagAction();

  const { onSelectTag, clearSelectedTag } = useSelectedTagAction();

  const handleAddTag = (newTag: Tag) => {
    onAddTag(newTag);

    //  requestAnimationFrame을 사용하여 다음 렌더링 사이클에서 오버플로우를 체크함으로써, DOM 업데이트가 완료된 후에 체크
    requestAnimationFrame(() => {
      const overflow = checkOverflow();
      if (overflow) {
        showOverflowToast(overflow);
        // 자동 롤백 제거 - 사용자가 직접 태그 조정 가능
      }
    });
  };

  const handleAddTags = (newTags: Tag[]) => {
    onAddTags(newTags);

    requestAnimationFrame(() => {
      const overflow = checkOverflow();
      if (overflow) {
        showOverflowToast(overflow);
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
    <PaletteProvider>
      <CanvasSizeProvider>
        <div className="mx-auto flex w-full flex-col gap-4 py-8">
          <h1 className="mb-7 text-center text-[60px] text-[#C1CCFF]">
            Thumbnail Maker
          </h1>
         <div className="flex bg-[#1D2027] flex-col gap-1 rounded-md border border-[#31353F] p-1">
          <MenuBar getImageFile={getImageFile} />
            <Toolbar
              isDragMode={isDragMode}
              setIsDragMode={setIsDragMode}
            />


         </div>
            <AddTagSection onAction={handleAddTag} onBatchAction={handleAddTags} />

          {isDragMode ? (
            <DragModeCanvas
              previewRef={previewRef}
              tagsContainerRef={tagsContainerRef}
            />
          ) : (
            <CanvasContainer
              previewRef={previewRef}
              tagsContainerRef={tagsContainerRef}
            >
              <TagList setOpenTagSheet={onSelectTag} />
            </CanvasContainer>
          )}
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
            <SubActionMenu
              getImageFile={getImageFile}
              downloadImage={downloadImage}
            />
          </div>
       
        </div>
      </CanvasSizeProvider>
    </PaletteProvider>
  );
}

export default ThumbnailMaker;
