import { useEffect, useState } from "react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
  SheetFooter,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { TagItemView } from "./TagItem";
import { getTagStyleKey } from "./assets/utils";
import { useCurrentPaletteStyle } from "./Palette.context";
import { Tag, TagShape, TagVariant } from "./assets/palette.types";
import { EmojiType, ThreeDEmojiPicker } from "../3d-emoji-picker";
import { useSelectedTag, useSelectedTagAction } from "./Tag.context";
import { EMPTY_TAG } from "./assets/constants";

interface Props {
  onStyleChange: (newTag: Tag) => void;
  onRemove: (tagId: number) => void;
}

export function TagEmojiSheet({ onStyleChange, onRemove }: Props) {
  const paletteStyle = useCurrentPaletteStyle();
  const { clearSelectedTag: onClose } = useSelectedTagAction();

  const { tag, setTag, isOpen } = useSheetTag();

  const onChangeEmoji = (emoji: EmojiType) => {
    setTag({ ...tag, content: { type: "3d-emoji", value: emoji } });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent inner="center" className="!max-w-[410px] px-6">
        <SheetHeader>
          <SheetTitle>Change Emoji</SheetTitle>
          <SheetDescription>
            Try changing the emoji as you want!
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-w-fit flex-col overflow-y-auto pt-[14px]">
          <div className="mb-12 flex min-h-[120px] w-full items-center justify-center rounded-[8px] bg-[#212129]">
            <TagItemView
              tag={tag}
              tagStyle={paletteStyle.tagStyle[getTagStyleKey(tag)]}
              size="small"
            />
          </div>
          <div>
            <ThreeDEmojiPicker onEmojiSelect={onChangeEmoji} />
          </div>
        </div>
        <SheetFooter className="mt-[96px] flex justify-center gap-2 sm:justify-center">
          <Button onClick={() => onRemove(tag.id)} variant="secondary">
            Delete
          </Button>
          <Button onClick={() => onStyleChange(tag)}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const useSheetTag = () => {
  const { selectedTag } = useSelectedTag();

  const [tag, setTag] = useState<Tag>(selectedTag ?? EMPTY_TAG);

  const isOpen = selectedTag?.content.type === "3d-emoji";

  useEffect(() => {
    if (!selectedTag) return;
    setTag(selectedTag);
  }, [selectedTag]);

  return { tag, setTag, isOpen };
};
