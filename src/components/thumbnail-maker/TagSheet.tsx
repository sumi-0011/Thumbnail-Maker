import React, { useState } from "react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
  SheetClose,
  SheetFooter,
} from "../ui/sheet";
import { Tag } from "./tag.types";
import { Button } from "../ui/button";
import { TagItemView } from "./TagItem";
import { Input } from "../ui/input";
import { PaletteTagStyle, tagStyleMap } from "./pallette.constants";
import { getTagStyleKey } from "./utils";
import { useCurrentPaletteStyle } from "./Palette.context";

function TagSheet({
  isOpen,
  onClose,
  tag: initTag,
  onAction,
}: {
  isOpen: boolean;
  onClose: () => void;
  tag: Tag;
  onAction: (newTag: Tag) => void;
}) {
  const paletteStyle = useCurrentPaletteStyle();
  const [tag, setTag] = useState<Tag>(initTag);

  const onSaveClick = () => {
    onAction(tag);
  };

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
              {tagStyleMap.map((style) => {
                const currentTag = {
                  ...tag,
                  tagVariant: style.variant,
                  tagShape: style.shape,
                  text: "tag",
                };

                return (
                  <button
                    key={style.variant + style.shape}
                    className="h-fit w-fit origin-top-left scale-50 transform transition-all duration-300 ease-in-out"
                    onClick={() => setTag(currentTag)}
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
          {/* <SheetClose asChild> */}
          <Button onClick={onSaveClick}>Save changes</Button>
          {/* </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TagSheet;
