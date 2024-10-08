import { useState } from "react";
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
  { variant: "filled", shape: "squared" },
  { variant: "outlined", shape: "round" },
  { variant: "outlined", shape: "squared" },
  { variant: "ghost", shape: "squared" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tag: Tag;
  onAction: (newTag: Tag) => void;
}

function TagSheet({ isOpen, onClose, tag: initTag, onAction }: Props) {
  const paletteStyle = useCurrentPaletteStyle();
  const [tag, setTag] = useState<Tag>(initTag);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>태그 변경하기</SheetTitle>
          <SheetDescription>원하는대로 태그를 변경해보세요!</SheetDescription>
        </SheetHeader>
        <div className="flex min-w-fit flex-col gap-4 overflow-y-auto">
          <div className="flex min-h-[200px] scale-50 items-center justify-center">
            <TagItemView
              tag={tag}
              tagStyle={paletteStyle.tagStyle[getTagStyleKey(tag)]}
            />
          </div>
          <div>
            <p className="mb-4 text-sm text-white">태그 텍스트</p>
            <Input
              value={tag.text}
              onChange={(e) => setTag({ ...tag, text: e.target.value })}
            />
          </div>
          <div>
            <p className="mb-4 text-sm text-white">태그 스타일</p>
            <div className="flex flex-wrap gap-2">
              {selectTagStyleMap.map((style) => {
                const currentTag: Tag = {
                  tagVariant: style.variant,
                  tagShape: style.shape,
                  text: "tag",
                };

                return (
                  <button
                    key={getTagStyleKey(currentTag)}
                    type="button"
                    className="h-fit w-fit origin-top-left scale-50 transform transition-all duration-300 ease-in-out"
                    onClick={() => setTag({ ...currentTag, text: tag.text })}
                  >
                    <TagItemView
                      tag={currentTag}
                      tagStyle={
                        paletteStyle.tagStyle[getTagStyleKey(currentTag)]
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button onClick={() => onAction(tag)}>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TagSheet;
