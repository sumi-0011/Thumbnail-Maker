import useStorageState from "use-storage-state";
import { THUMBNAIL_MAKER_STORAGE_KEY } from "../assets/constants";
import { Tag } from "../assets/palette.types";
import { useRef } from "react";
import { getRandomTagStyles } from "../assets/utils";

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

  const onAddTags = (newTagsToAdd: Tag[]) => {
    prevTags.current = tags;

    const newTags = [...tags, ...newTagsToAdd];
    setTags(newTags);
  };

  const onRemoveTag = (tagId: number) => {
    prevTags.current = tags;

    const newTags = tags.filter((tag) => tag.id !== tagId);
    setTags(newTags);
  };

  const onRollbackTags = () => {
    setTags(prevTags.current);
  };

  const onUpdateTag = (tagId: number, newTag: Tag) => {
    prevTags.current = tags;

    const newTags = tags.map((tag) =>
      tag.id === tagId ? { ...tag, ...newTag } : tag
    );

    setTags(newTags);
  };

  const onUpdateTagOrder = (newTags: Tag[]) => {
    setTags(newTags);
  };

  const onResetTags = () => {
    setTags([]);
  };

  const onRandomShuffle = () => {
    prevTags.current = tags;
    const newTags = getRandomTagStyles(tags);
    setTags(newTags);
  };

  return {
    tags,
    onAddTag,
    onAddTags,
    onRemoveTag,
    onRollbackTags,
    onUpdateTag,
    onResetTags,
    onUpdateTagOrder,
    onRandomShuffle,
  };
}
