import { cn } from "src/lib/utils";
import { useThumbnailTagList } from "./hooks/useThumbnailTagList";
import { TagItem } from "./TagItem";
import { Tag } from "./assets/palette.types";

interface Props {
  setOpenTagSheet: (tag: Tag) => void;
}

export function TagList({ setOpenTagSheet }: Props) {
  const { tags, onRemoveTag } = useThumbnailTagList();

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
