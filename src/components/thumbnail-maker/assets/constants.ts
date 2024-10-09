export const canvasSize = {
  aspectRatio: 1080 / 565,
  padding: "40px 50px",
  gap: "16px 8px",
} as const;

export const THUMBNAIL_MAKER_STORAGE_KEY = "@thumbnail-maker/tags";

export const EMPTY_TAG = {
  id: 0,
  content: { type: "text", value: "" },
  tagVariant: "filled",
  tagShape: "round",
} as const;
