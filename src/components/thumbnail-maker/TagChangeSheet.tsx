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

export function TagChangeSheet({
  isOpen,
  onClose,
  tag: initTag,
  onStyleChange,
  onRemove,
}: Props) {
  const paletteStyle = useCurrentPaletteStyle();
  const [tag, setTag] = useState<Tag>(initTag);

  const onChangeTagStyle = (variant: TagVariant, shape: TagShape) => {
    setTag({ ...tag, tagVariant: variant, tagShape: shape });
  };

  const onChangeTagContent = (value: string) => {
    setTag({ ...tag, content: { type: "text", value } });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onStyleChange(tag);
    }
  };

  // NOTE: sheet open animation을 위해 useEffect 사용
  useEffect(() => {
    if (!initTag.content.value) return;
    setTag(initTag);
  }, [initTag]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent inner="center">
        <SheetHeader>
          <SheetTitle>Change Tag</SheetTitle>
          <SheetDescription>Try changing the tag as you want!</SheetDescription>
        </SheetHeader>
        <div className="flex min-w-fit flex-col overflow-y-auto pt-[14px]">
          <div className="mb-12 flex min-h-[120px] w-full items-center justify-center rounded-[8px] bg-[#212129]">
            <TagItemView
              tag={tag}
              tagStyle={paletteStyle.tagStyle[getTagStyleKey(tag)]}
              size="small"
            />
          </div>
          <div className="mb-8">
            <p className="mb-3 text-[13px] text-[#9292A1]">Tag text</p>
            <Input
              value={tag.content.value}
              onChange={(e) => onChangeTagContent(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
          <div>
            <p className="mb-5 text-[13px] text-[#9292A1]">Tag style</p>
            <TagStylePicker onClick={onChangeTagStyle} />
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

function TagStylePicker({
  onClick,
}: {
  onClick: (variant: TagVariant, shape: TagShape) => void;
}) {
  const paletteStyle = useCurrentPaletteStyle();
  return (
    <div className="grid grid-cols-3 gap-4">
      {selectTagStyleMap.map((style) => {
        const currentTag: Tag = {
          id: 0,
          tagVariant: style.variant,
          tagShape: style.shape,
          content: { type: "text", value: "TAG" },
        };

        return (
          <button
            key={getTagStyleKey(currentTag)}
            type="button"
            className="h-fit w-fit origin-top-left transform transition-all duration-300 ease-in-out"
            onClick={() => onClick(style.variant, style.shape)}
          >
            <TagItemView
              tag={currentTag}
              tagStyle={paletteStyle.tagStyle[getTagStyleKey(currentTag)]}
              size="small"
            />
          </button>
        );
      })}
    </div>
  );
}
