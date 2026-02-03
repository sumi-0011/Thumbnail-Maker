import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "src/lib/utils";
import { useCurrentPaletteStyle } from "./Palette.context";
import { useCanvasSize } from "./CanvasSize.context";
import {
  TAG_ALIGNMENT_VALUES,
  useTagAction,
  useTagList,
  useTagStyle,
} from "./Tag.context";
import { useTagSize } from "./TagSize.context";
import { SortableTagItem } from "./DragMode/SortableTagItem";

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
  const { sizeStyle } = useTagSize();
  const { tags } = useTagList();
  const { onUpdateTagOrder } = useTagAction();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tags.findIndex((tag) => tag.id === active.id);
      const newIndex = tags.findIndex((tag) => tag.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onUpdateTagOrder(arrayMove(tags, oldIndex, newIndex));
      }
    }
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div
            ref={tagsContainerRef}
            style={{ gap: sizeStyle.gap, ...TAG_ALIGNMENT_VALUES[alignment] }}
            className="flex h-full flex-wrap content-start"
          >
            <SortableContext
              items={tags.map((tag) => tag.id)}
              strategy={rectSortingStrategy}
            >
              {children}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
