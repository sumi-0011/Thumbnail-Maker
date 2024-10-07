export type TagVariant = "filled" | "outlined" | "ghost";
export type TagShape = "round" | "squared" | "emoji";

export type TagContentType = "text" | "3d-emoji";

export type Tag = {
  text: string | EmojiType;
  tagVariant: TagVariant;
  tagShape: TagShape;
  tagContentType?: TagContentType;
};

export type PalletTag = `${TagVariant}-${TagShape}`;

export type PaletteVariant =
  | "blue_gradient"
  | "rose_gradient"
  | "yellow_dark"
  | "green_dark"
  | "blue_dark"
  | "purple_light"
  | "blue_light"
  | "green_light"
  | "orange_light"
  | "pink_light";

export type PaletteTagStyle = { [key in PalletTag]: CSSProperties };

export type PaletteStyle = {
  background: string;
  paletteBackground: string;
  tagStyle: PaletteTagStyle;
};
