import { cn } from "src/lib/utils";
import { canvasSize } from "./constants";
import { useCurrentPaletteStyle } from "./Palette.context";

export function CanvasContainer({
  previewRef,
  tagsContainerRef,
  children,
}: {
  previewRef: React.RefObject<HTMLDivElement>;
  tagsContainerRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}) {
  const paletteStyle = useCurrentPaletteStyle();
  return (
    <div
      ref={previewRef}
      key={paletteStyle.background}
      style={{
        background: paletteStyle.background,
        aspectRatio: canvasSize.aspectRatio,
        padding: canvasSize.padding,
      }}
      className={cn(
        "max-h-full w-[768px] overflow-hidden rounded-lg ",
        "bg-cover bg-center bg-no-repeat"
      )}
    >
      <div
        ref={tagsContainerRef}
        style={{ gap: canvasSize.gap }}
        className="flex h-full flex-wrap content-start"
      >
        {children}
      </div>
    </div>
  );
}
