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
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { FreeFormCanvas } from "./FreeFormCanvas";
import { MenuBar } from "./MenuBar";
import { CanvasSizeProvider, useCanvasSize } from "./CanvasSize.context";
import { PaletteProvider } from "./Palette.context";

function ThumbnailMaker() {
  return (
    <PaletteProvider>
      <CanvasSizeProvider>
        <ThumbnailMakerInner />
      </CanvasSizeProvider>
    </PaletteProvider>
  );
}

function ThumbnailMakerInner() {
  const { previewRef, onDownload: downloadImage, getImageFile } = usePreview();
  const { tagsContainerRef, checkOverflow, showOverflowToast } =
    useCheckTagOverflow();

  const {
    onAddTags,
    onRemoveTag,
    onRollbackTags,
    onUpdateTag,
  } = useTagAction();

  const { onSelectTag, clearSelectedTag } = useSelectedTagAction();
  const { layoutMode } = useCanvasSize();

  const handleAddTags = (newTags: Tag[]) => {
    onAddTags(newTags);

    requestAnimationFrame(() => {
      const overflow = checkOverflow();
      if (overflow) {
        showOverflowToast(overflow);
        onRollbackTags();
      }
    });
  };

  const handleAddTag = (newTag: Tag) => {
    handleAddTags([newTag]);
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
    <div className="mx-auto flex max-w-[768px] flex-col gap-4 py-8">
      <h1 className="mb-7 text-center text-[60px] text-[#C1CCFF]">
        Thumbnail Maker
      </h1>
      <MenuBar
        getImageFile={getImageFile}
        downloadImage={downloadImage}
      />

      <AddTagSection onAction={handleAddTag} onBatchAction={handleAddTags} />

      {layoutMode === "free-form" ? (
        <FreeFormCanvas previewRef={previewRef} />
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
  );
}

export default ThumbnailMaker;
