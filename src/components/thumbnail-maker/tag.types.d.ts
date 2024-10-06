export type TagVariant = "filled" | "outlined" | "ghost";
export type TagShape = "round" | "squared" | "emoji";

export type TagContentType = "text" | "3d-emoji";

export type Tag = {
  text: string | EmojiType;
  tagVariant: TagVariant;
  tagShape: TagShape;
  tagContentType?: TagContentType;
};
