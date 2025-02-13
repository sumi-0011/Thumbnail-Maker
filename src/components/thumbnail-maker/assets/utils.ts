import { Tag, PaletteTag, TagVariant, TagShape } from "./palette.types";

export const getTagStyleKey = (tag: Tag) => {
  return `${tag.tagVariant}-${tag.tagShape}` as const as PaletteTag;
};

type StyleCombination = {
  tagVariant: TagVariant;
  tagShape: TagShape;
};

export const getStyleCombinations = (): StyleCombination[] => [
  { tagVariant: "filled", tagShape: "round" },
  { tagVariant: "filled", tagShape: "squared" },
  { tagVariant: "outlined", tagShape: "round" },
  { tagVariant: "outlined", tagShape: "squared" },
  { tagVariant: "ghost", tagShape: "round" },
  { tagVariant: "ghost", tagShape: "squared" },
];

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getRandomTagStyles = (tags: Tag[]): Tag[] => {
  const styleCombinations = getStyleCombinations();
  const shuffledStyles = shuffleArray(styleCombinations);

  return tags.map((tag, index) => {
    // emoji shape를 가진 태그는 스타일 변경하지 않음
    if (tag.tagShape === "emoji") {
      return tag;
    }

    let styleIndex = index % shuffledStyles.length;
    if (index > 0 && tags[index - 1].tagShape !== "emoji") {
      const prevStyle = tags[index - 1];
      while (
        prevStyle.tagVariant === shuffledStyles[styleIndex].tagVariant &&
        prevStyle.tagShape === shuffledStyles[styleIndex].tagShape
      ) {
        styleIndex = (styleIndex + 1) % shuffledStyles.length;
      }
    }

    return {
      ...tag,
      tagVariant: shuffledStyles[styleIndex].tagVariant,
      tagShape: shuffledStyles[styleIndex].tagShape,
    };
  });
};
