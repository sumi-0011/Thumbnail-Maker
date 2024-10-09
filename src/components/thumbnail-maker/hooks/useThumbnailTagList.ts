import { useStorageState } from "@toss/react";
import { THUMBNAIL_MAKER_STORAGE_KEY } from "../assets/constants";
import { Tag } from "../assets/palette.types";
import { useRef } from "react";

export function useThumbnailTagList() {
  const [tags, setTags] = useStorageState<Tag[]>(THUMBNAIL_MAKER_STORAGE_KEY, {
    defaultValue: [],
  });
  const prevTags = useRef(tags);

  const onAddTag = (newTag: Tag) => {
    prevTags.current = tags;

    const newTags = [...tags, newTag];
    setTags(newTags);
  };

  const onRemoveTag = (index: number) => {
    prevTags.current = tags;

    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const onRollbackTags = () => {
    setTags(prevTags.current);
  };

  const onUpdateTag = (index: number, newTag: Tag) => {
    prevTags.current = tags;

    const newTags = [...tags];
    newTags[index] = newTag;
    setTags(newTags);
  };

  const onResetTags = () => {
    setTags([]);
  };

  return {
    tags,
    onAddTag,
    onRemoveTag,
    onRollbackTags,
    onUpdateTag,
    onResetTags,
  };
}
