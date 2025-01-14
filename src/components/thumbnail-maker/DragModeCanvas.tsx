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
import { useState } from "react";
import { cn } from "src/lib/utils";
import { canvasSize } from "./assets/constants";
import { useCurrentPaletteStyle } from "./Palette.context";
import { SortableTagItem } from "./SortableTagItem";
import { useTagAction, useTagList } from "./Tag.context";
import { TagItem } from "./TagItem";

interface Props {
  previewRef: React.RefObject<HTMLDivElement>;
  tagsContainerRef: React.RefObject<HTMLDivElement>;
}

export function DragModeCanvas({ previewRef, tagsContainerRef }: Props) {
  const paletteStyle = useCurrentPaletteStyle();
  // const [tags, setTags] = useState([]);
  const { tags } = useTagList();
  console.log("tags: ", tags);
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
        console.log("newTags: ", newTags);
        console.log(
          "newTags: ",
          newTags.map((tag) => tag.tagVariant).join(", ")
        );
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
                  {/* <div></div> */}
                  <TagItem key={tag.id} tag={tag} />
                </SortableTagItem>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
