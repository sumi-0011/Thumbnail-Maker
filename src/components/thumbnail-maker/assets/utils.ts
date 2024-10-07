import { Tag, PalletTag } from "./palette.types";

export const getTagStyleKey = (tag: Tag) => {
  return `${tag.tagVariant}-${tag.tagShape}` as PalletTag;
};
