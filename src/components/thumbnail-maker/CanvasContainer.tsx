import { cn } from "src/lib/utils";
import { canvasSize } from "./assets/constants";
import { useCurrentPaletteStyle } from "./Palette.context";

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
