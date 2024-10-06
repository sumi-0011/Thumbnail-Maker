import { PalletTag } from "./pallette.constants";
import { Tag } from "./types";

export const getTagStyleKey = (tag: Tag) => {
  return `${tag.tagVariant}-${tag.tagShape}` as PalletTag;
};
