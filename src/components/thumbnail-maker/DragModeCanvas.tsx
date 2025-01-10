import { cn } from "src/lib/utils";
import { canvasSize } from "./assets/constants";
import { useCurrentPaletteStyle } from "./Palette.context";
import { TagItem } from "./TagItem";
import { useTagList } from "./Tag.context";

interface Props {
  previewRef: React.RefObject<HTMLDivElement>;
  tagsContainerRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export function DragModeCanvas({
  previewRef,
  tagsContainerRef,
  children,
}: Props) {
  const paletteStyle = useCurrentPaletteStyle();

  const { tags } = useTagList();

  return (
    <div className="max-h-full w-[768px] overflow-hidden rounded-lg">
      <div
        ref={previewRef}
        key={paletteStyle.background}
        style={{
          background: paletteStyle.background,
          aspectRatio: canvasSize.aspectRatio,
          padding: canvasSize.padding,
        }}
        className={cn("bg-cover bg-center bg-no-repeat")}
      >
        <div
          ref={tagsContainerRef}
          style={{ gap: canvasSize.gap }}
          className="flex h-full flex-wrap content-start"
        >
          {tags.map((tag) => (
            <TagItem key={tag.id} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
