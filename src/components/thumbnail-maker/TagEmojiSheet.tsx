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
import { Input } from "../ui/input";
import { getTagStyleKey } from "./assets/utils";
import { useCurrentPaletteStyle } from "./Palette.context";
import { Tag, TagShape, TagVariant } from "./assets/palette.types";
import { EmojiType, ThreeDEmojiPicker } from "../3d-emoji-picker";

const selectTagStyleMap: { variant: TagVariant; shape: TagShape }[] = [
  { variant: "filled", shape: "round" },
  { variant: "outlined", shape: "round" },
  { variant: "ghost", shape: "squared" },
  { variant: "filled", shape: "squared" },
  { variant: "outlined", shape: "squared" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;

  tag: Tag;

  onStyleChange: (newTag: Tag) => void;
  onRemove: () => void;
}

function TagEmojiSheet({
  isOpen,
  onClose,
  tag: initTag,
  onStyleChange,
  onRemove,
}: Props) {
  const paletteStyle = useCurrentPaletteStyle();
  const [tag, setTag] = useState<Tag>(initTag);

  const onChangeEmoji = (emoji: EmojiType) => {
    setTag({ ...tag, content: { type: "3d-emoji", value: emoji } });
  };

  // NOTE: sheet open animation을 위해 useEffect 사용
  useEffect(() => {
    if (!initTag.content.value) return;
    setTag(initTag);
  }, [initTag]);

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
          <Button onClick={onRemove} variant="secondary">
            Delete
          </Button>
          <Button onClick={() => onStyleChange(tag)}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TagEmojiSheet;
