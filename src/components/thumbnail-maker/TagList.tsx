import { cn } from "src/lib/utils";
import { TagItem } from "./TagItem";
import { Tag } from "./assets/palette.types";
import { useTagAction, useTagList } from "./Tag.context";

interface Props {
  setOpenTagSheet: (tag: Tag) => void;
}

export function TagList({ setOpenTagSheet }: Props) {
  const { tags } = useTagList();
  const { onRemoveTag } = useTagAction();

  return (
    <>
      {tags.map((tag) => (
        <TagItem
          key={tag.id}
          tag={tag}
          onRemove={() => onRemoveTag(tag.id)}
          onClick={() => setOpenTagSheet(tag)}
          className={cn(tag.content.type !== "3d-emoji" && "cursor-pointer")}
        />
      ))}
    </>
  );
}
