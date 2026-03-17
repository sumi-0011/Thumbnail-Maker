import { Fragment } from "react";
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
        <Fragment key={tag.id}>
          <TagItem
            tag={tag}
            onRemove={() => onRemoveTag(tag.id)}
            onClick={() => setOpenTagSheet(tag)}
            className="cursor-pointer"
          />
          {tag.lineBreakAfter && <div className="h-0 basis-full" />}
        </Fragment>
      ))}
    </>
  );
}
