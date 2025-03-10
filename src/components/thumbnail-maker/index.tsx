import { Image, InfoIcon, Shuffle } from "lucide-react";
import { Button } from "../ui/button";
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
import { Switch } from "../ui/switch";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { DragModeCanvas } from "./DragMode/DragModeCanvas";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { MenuBar } from "./MenuBar";
import { CanvasSizeProvider } from "./CanvasSize.context";
import { PaletteProvider } from "./Palette.context";

function ThumbnailMaker() {
  const [isDragMode, setIsDragMode] = useState(false);
  const { previewRef, onDownload: downloadImage, getImageFile } = usePreview();
  const { tagsContainerRef, checkOverflow, showOverflowToast } =
    useCheckTagOverflow();

  const {
    onAddTag,
    onRemoveTag,
    onRollbackTags,
    onUpdateTag,
    onRandomShuffle,
  } = useTagAction();

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
    <PaletteProvider>
      <CanvasSizeProvider>
        <div className="mx-auto flex max-w-[768px] flex-col gap-4 py-8">
          <h1 className="mb-7 text-center text-[60px] text-[#C1CCFF]">
            Thumbnail Maker
          </h1>
          <MenuBar
            isDragMode={isDragMode}
            setIsDragMode={setIsDragMode}
            getImageFile={getImageFile}
            downloadImage={downloadImage}
          />

          <AddTagSection onAction={handleAddTag} />

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
          <Alert variant="outline" className="mt-8">
            <InfoIcon className="mt-0 h-4 w-4" />
            <div>
              <AlertTitle>
                Thank you everyone for using Thumbnail Maker 😄
              </AlertTitle>
              <AlertDescription>
                - Please provide sources when using thumbnails on your blog
                <br />- Your valuable input helps us create a better service for
                everyone [
                <a href="https://github.com/sumi-0011/Thumbnail-Maker/issues/new">
                  feedback form
                </a>
                ]
              </AlertDescription>
            </div>
          </Alert>
        </div>
      </CanvasSizeProvider>
    </PaletteProvider>
  );
}

export default ThumbnailMaker;
