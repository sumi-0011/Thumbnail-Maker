import { useSortable } from "@dnd-kit/sortable";
import { PropsWithChildren } from "react";
import { cn } from "src/lib/utils";

interface SortableTagItemProps {
  tag: {
    id: string | number;
  };
}

export const SortableTagItem = ({
  tag,
  children,
}: PropsWithChildren<SortableTagItemProps>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tag.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        width: "auto",
        height: "auto",
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
      className={cn("touch-none", isDragging && "opacity-50")}
    >
      {children}
    </div>
  );
};
