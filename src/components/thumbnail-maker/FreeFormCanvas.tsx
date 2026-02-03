import { useRef, useCallback } from "react";
import { cn } from "src/lib/utils";
import { useCurrentPaletteStyle } from "./Palette.context";
import { useCanvasSize } from "./CanvasSize.context";
import { useTagAction, useTagList, useSelectedTagAction } from "./Tag.context";
import { useTagSize } from "./TagSize.context";
import { TagItem } from "./TagItem";
import { Tag } from "./assets/palette.types";

interface Props {
  previewRef: React.RefObject<HTMLDivElement>;
}

export function FreeFormCanvas({ previewRef }: Props) {
  const paletteStyle = useCurrentPaletteStyle();
  const { canvasStyle } = useCanvasSize();
  const { sizeStyle } = useTagSize();
  const { tags } = useTagList();
  const { onUpdateTag, onRemoveTag } = useTagAction();
  const { onSelectTag } = useSelectedTagAction();

  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    tagId: number;
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
    moved: boolean;
  } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, tag: Tag) => {
      if (tag.content.type === "line-break") return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      dragState.current = {
        tagId: tag.id,
        startX: e.clientX,
        startY: e.clientY,
        startPosX: tag.position?.x ?? 0,
        startPosY: tag.position?.y ?? 0,
        moved: false,
      };
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const state = dragState.current;
      const container = containerRef.current;
      if (!state || !container) return;

      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        state.moved = true;
      }

      const rect = container.getBoundingClientRect();
      const newX = state.startPosX + (dx / rect.width) * 100;
      const newY = state.startPosY + (dy / rect.height) * 100;

      // Update visually via DOM for smooth dragging
      const el = container.querySelector(
        `[data-tag-id="${state.tagId}"]`
      ) as HTMLElement | null;
      if (el) {
        el.style.left = `${Math.max(0, Math.min(90, newX))}%`;
        el.style.top = `${Math.max(0, Math.min(90, newY))}%`;
      }
    },
    []
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const state = dragState.current;
      const container = containerRef.current;
      if (!state || !container) return;

      if (state.moved) {
        const rect = container.getBoundingClientRect();
        const dx = e.clientX - state.startX;
        const dy = e.clientY - state.startY;
        const newX = Math.max(
          0,
          Math.min(90, state.startPosX + (dx / rect.width) * 100)
        );
        const newY = Math.max(
          0,
          Math.min(90, state.startPosY + (dy / rect.height) * 100)
        );

        const tag = tags.find((t) => t.id === state.tagId);
        if (tag) {
          onUpdateTag(tag.id, { ...tag, position: { x: newX, y: newY } });
        }
      } else {
        // Click — open edit sheet
        const tag = tags.find((t) => t.id === state.tagId);
        if (tag && tag.content.type !== "line-break") {
          onSelectTag(tag);
        }
      }

      dragState.current = null;
    },
    [tags, onUpdateTag, onSelectTag]
  );

  const bg = paletteStyle.background.includes("url")
    ? { backgroundImage: paletteStyle.background }
    : { background: paletteStyle.background };

  // Filter out line-break tags in free-form mode
  const visibleTags = tags.filter((t) => t.content.type !== "line-break");

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
          ref={containerRef}
          className="relative h-full w-full"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {visibleTags.map((tag) => (
            <div
              key={tag.id}
              data-tag-id={tag.id}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                left: `${tag.position?.x ?? 0}%`,
                top: `${tag.position?.y ?? 0}%`,
              }}
              onPointerDown={(e) => handlePointerDown(e, tag)}
            >
              <TagItem
                tag={tag}
                onRemove={() => onRemoveTag(tag.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
