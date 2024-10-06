import { canvasSize } from "./constants";

export function CanvasContainer({
  previewRef,
  bgColor,
  tagsContainerRef,
  children,
}: {
  previewRef: React.RefObject<HTMLDivElement>;
  bgColor: string;
  tagsContainerRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={previewRef}
      style={{
        background: bgColor,
        aspectRatio: canvasSize.aspectRatio,
        padding: canvasSize.padding,
        backgroundSize: "100%",
      }}
      className="max-h-full w-[768px] overflow-hidden rounded-lg"
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
