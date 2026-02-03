import { cn } from "src/lib/utils";
import { TagItem } from "./TagItem";
import { Tag } from "./assets/palette.types";
import { useTagAction, useTagList } from "./Tag.context";
import { LineBreakTag } from "./LineBreakTag";
import { SortableTagItem } from "./DragMode/SortableTagItem";

interface Props {
  setOpenTagSheet: (tag: Tag) => void;
}

export function TagList({ setOpenTagSheet }: Props) {
  const { tags } = useTagList();
  const { onRemoveTag } = useTagAction();

  return (
    <>
      {tags.map((tag) => (
        <SortableTagItem key={tag.id} tag={tag}>
          {tag.content.type === "line-break" ? (
            <LineBreakTag onRemove={() => onRemoveTag(tag.id)} />
          ) : (
            <TagItem
              tag={tag}
              onRemove={() => onRemoveTag(tag.id)}
              onClick={() => setOpenTagSheet(tag)}
              className={cn(
                tag.content.type !== "3d-emoji" && "cursor-pointer"
              )}
            />
          )}
        </SortableTagItem>
      ))}
    </>
  );
}
