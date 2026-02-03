export type TagVariant = "filled" | "outlined" | "ghost";
export type TagShape = "round" | "squared" | "emoji";

export type TagContentType =
  | {
      type: "text";
      value: string;
    }
  | {
      type: "3d-emoji";
      value: EmojiType;
    }
  | {
      type: "line-break";
    };

export type Tag = {
  id: number;
  content: TagContentType;
  tagVariant: TagVariant;
  tagShape: TagShape;
  position?: { x: number; y: number };
};

export type PaletteTag = `${TagVariant}-${TagShape}`;

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

export type PaletteTagStyle = { [key in PaletteTag]: CSSProperties };

export type PaletteStyle = {
  background: string;
  paletteBackground: string;
  tagStyle: Partial<PaletteTagStyle>;
};
