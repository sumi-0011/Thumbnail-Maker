import { useState } from "react";
import { Image } from "lucide-react";
import { Button } from "../ui/button";
import { AddTagSection } from "./AddTagSection";
import { CanvasContainer } from "./CanvasContainer";
import { TagItem } from "./TagItem";
import { useCheckTagOverflow } from "./hooks/useCheckTagOverflow";
import { usePreview } from "./hooks/usePreview";
import TagSheet from "./TagSheet";
import { PallettePicker } from "./PallettePicker";
import { cn } from "src/lib/utils";
import { PaletteProvider } from "./Palette.context";
import { Tag } from "./assets/palette.types";
import EmojiPicker from "../3d-emoji-picker/CustomEmojiPicker";

function ThumbnailMaker() {
  const { previewRef, onDownload } = usePreview();
  const { tagsContainerRef, checkOverflow, showOverflowToast } =
    useCheckTagOverflow();

  const [tags, setTags] = useState<Tag[]>([]);
  const [openTagSheetIndex, setOpenTagSheetIndex] = useState<number | null>(
    null
  );

  const onTagsUpdate = (newTags: Tag[]) => {
    setTags(newTags);
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onTagsUpdate(newTags);
  };

  const handleAddTag = (newTag: (typeof tags)[0]) => {
    const newTags = [...tags, newTag];
    onTagsUpdate(newTags);

    //  requestAnimationFrame을 사용하여 다음 렌더링 사이클에서 오버플로우를 체크함으로써, DOM 업데이트가 완료된 후에 체크
    requestAnimationFrame(() => {
      const overflow = checkOverflow();
      if (overflow) {
        showOverflowToast(overflow);
        onTagsUpdate(tags);
      }
    });
  };

  const handleChangeTag = async (newTag: Tag) => {
    if (openTagSheetIndex === null) return;

    const prevTags = [...tags];
    const newTags = [...tags];
    newTags[openTagSheetIndex] = newTag;
    onTagsUpdate(newTags);

    requestAnimationFrame(() => {
      const overflow = checkOverflow();
      if (overflow) {
        showOverflowToast(overflow);
        onTagsUpdate(prevTags);
      } else {
        setOpenTagSheetIndex(null);
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
          {tags.map((tag, index) => (
            <TagItem
              key={index}
              tag={tag}
              onRemove={() => handleRemoveTag(index)}
              onClick={() =>
                tag.tagContentType !== "3d-emoji" && setOpenTagSheetIndex(index)
              }
              className={cn(
                tag.tagContentType ? "cursor-default" : "cursor-pointer"
              )}
            />
          ))}
        </CanvasContainer>
        <TagSheet
          key={openTagSheetIndex}
          isOpen={openTagSheetIndex !== null}
          onClose={() => setOpenTagSheetIndex(null)}
          tag={
            openTagSheetIndex !== null
              ? tags[openTagSheetIndex]
              : { text: "", tagVariant: "filled", tagShape: "round" }
          }
          onAction={handleChangeTag}
        />
        <div className="flex items-center justify-between">
          <PallettePicker />
          <Button onClick={onDownload}>
            <Image size={20} className="mr-2" /> Download Image
          </Button>
        </div>
      </PaletteProvider>
    </div>
  );
}

export default ThumbnailMaker;
