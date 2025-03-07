import { cn } from "src/lib/utils";
import { useCurrentPaletteStyle } from "./Palette.context";
import { useCanvasSize } from "./CanvasSize.context";
import { TAG_ALIGNMENT_VALUES, useTagStyle } from "./Tag.context";

interface Props {
  previewRef: React.RefObject<HTMLDivElement>;
  tagsContainerRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export function CanvasContainer({
  previewRef,
  tagsContainerRef,
  children,
}: Props) {
  const paletteStyle = useCurrentPaletteStyle();
  const { canvasStyle } = useCanvasSize();
  const { alignment } = useTagStyle();

  const bg = paletteStyle.background.includes("url")
    ? { backgroundImage: paletteStyle.background }
    : { background: paletteStyle.background };

  return (
    <div className="max-h-full w-[768px] overflow-hidden rounded-lg">
      <div
        ref={previewRef}
        key={paletteStyle.background}
        style={{
          ...bg,
          aspectRatio: canvasStyle.aspectRatio,
          padding: canvasStyle.padding,
        }}
        className={cn("bg-cover bg-center bg-no-repeat")}
      >
        <div
          ref={tagsContainerRef}
          style={{ gap: canvasStyle.gap, ...TAG_ALIGNMENT_VALUES[alignment] }}
          className="flex h-full flex-wrap content-start"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
