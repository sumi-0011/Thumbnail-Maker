import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
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
      style={{
        width: "auto",
        height: "auto",
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
      className={cn("group/drag relative", isDragging && "opacity-50")}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-5 top-1/2 hidden h-full -translate-y-1/2 cursor-grab items-center touch-none group-hover/drag:flex [@media(hover:none)]:flex"
        data-no-export
      >
        <GripVertical size={14} className="text-white/60" />
      </div>
      {children}
    </div>
  );
};
