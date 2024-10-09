import { useEffect, useState } from "react";
import { Image } from "lucide-react";
import { Button } from "../ui/button";
import { AddTagSection } from "./AddTagSection";
import { CanvasContainer } from "./CanvasContainer";
import { TagItem } from "./TagItem";
import { useCheckTagOverflow } from "./hooks/useCheckTagOverflow";
import { usePreview } from "./hooks/usePreview";
import { TagChangeSheet } from "./TagChangeSheet";
import { PallettePicker } from "./PallettePicker";
import { cn } from "src/lib/utils";
import { PaletteProvider } from "./Palette.context";
import { Tag } from "./assets/palette.types";
import TagEmojiSheet from "./TagEmojiSheet";
import { TemplateSaveButton } from "./TemplateSaveButton";
import { useThumbnailTagList } from "./hooks/useThumbnailTagList";
import { EMPTY_TAG } from "./assets/constants";
import { TagList } from "./TagList";

function ThumbnailMaker() {
  const { previewRef, onDownload } = usePreview();
  const { tagsContainerRef, checkOverflow, showOverflowToast } =
    useCheckTagOverflow();

  const { tags, onAddTag, onRemoveTag, onRollbackTags, onUpdateTag } =
    useThumbnailTagList();

  const [openTagSheet, setOpenTagSheet] = useState<Tag | null>(null);

  const handleAddTag = (newTag: (typeof tags)[0]) => {
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
    if (openTagSheet === null) return;

    onUpdateTag(openTagSheet.id, newTag);

    requestAnimationFrame(() => {
      const overflow = checkOverflow();
      if (overflow) {
        showOverflowToast(overflow);
        onRollbackTags();
      } else {
        setOpenTagSheet(null);
      }
    });
  };

  return (
    <div className="mx-auto flex max-w-[768px] flex-col gap-4">
      <h1 className="mb-7 text-center text-[80px] text-white">
        Thumbnail Maker
      </h1>
      <PaletteProvider>
        <AddTagSection onAction={handleAddTag} />
        <CanvasContainer
          previewRef={previewRef}
          tagsContainerRef={tagsContainerRef}
        >
          <TagList setOpenTagSheet={setOpenTagSheet} />
        </CanvasContainer>
        <TagChangeSheet
          isOpen={
            openTagSheet !== null && openTagSheet.content.type !== "3d-emoji"
          }
          onClose={() => setOpenTagSheet(null)}
          tag={openTagSheet ?? EMPTY_TAG}
          onStyleChange={handleChangeTag}
          onRemove={() => {
            if (openTagSheet === null) return;
            onRemoveTag(openTagSheet.id);
            setOpenTagSheet(null);
          }}
        />
        <TagEmojiSheet
          isOpen={
            openTagSheet !== null && openTagSheet.content.type === "3d-emoji"
          }
          onClose={() => setOpenTagSheet(null)}
          tag={openTagSheet ?? EMPTY_TAG}
          onStyleChange={handleChangeTag}
          onRemove={() => {
            if (openTagSheet === null) return;
            onRemoveTag(openTagSheet.id);
            setOpenTagSheet(null);
          }}
        />
        <div className="flex items-center justify-between">
          <PallettePicker />
          <div className="flex items-center gap-2">
            <TemplateSaveButton />
            <Button onClick={onDownload}>
              <Image size={20} className="mr-2" /> Download Image
            </Button>
          </div>
        </div>
      </PaletteProvider>
    </div>
  );
}

export default ThumbnailMaker;
