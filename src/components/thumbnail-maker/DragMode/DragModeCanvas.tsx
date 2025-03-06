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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "src/lib/utils";
import { useCurrentPaletteStyle } from "../Palette.context";
import { SortableTagItem } from "./SortableTagItem";
import { useTagAction, useTagList } from "../Tag.context";
import { TagItem } from "../TagItem";
import { useCanvasSize } from "../CanvasSize.context";

interface Props {
  previewRef: React.RefObject<HTMLDivElement>;
  tagsContainerRef: React.RefObject<HTMLDivElement>;
}

export function DragModeCanvas({ previewRef, tagsContainerRef }: Props) {
  const paletteStyle = useCurrentPaletteStyle();
  const { canvasStyle: canvasSize } = useCanvasSize();

  const { tags } = useTagList();
  const { onUpdateTagOrder } = useTagAction();

  const sensors = useSensors(
    useSensor(PointerSensor),
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
        const newTags = arrayMove(tags, oldIndex, newIndex);

        onUpdateTagOrder(newTags);
      }
    }
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div
            ref={tagsContainerRef}
            style={{ gap: canvasSize.gap }}
            className="flex h-full flex-wrap content-start"
          >
            <SortableContext
              items={tags.map((tag) => tag.id)}
              strategy={verticalListSortingStrategy}
            >
              {tags.map((tag) => (
                <SortableTagItem key={tag.id} tag={tag}>
                  <TagItem tag={tag} />
                </SortableTagItem>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
