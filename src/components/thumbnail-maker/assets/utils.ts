import { Tag, PaletteTag } from "./palette.types";

export const getTagStyleKey = (tag: Tag) => {
  return `${tag.tagVariant}-${tag.tagShape}` as const as PaletteTag;
};
