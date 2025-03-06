export type CanvasSizePreset = "wide" | "square";

export const canvasSizePresets: Record<
  CanvasSizePreset,
  {
    aspectRatio: number;
    padding: string;
    gap: string;
  }
> = {
  wide: {
    aspectRatio: 1080 / 565,
    padding: "40px 50px",
    gap: "16px 8px",
  },
  square: {
    aspectRatio: 1,
    padding: "40px",
    gap: "16px 8px",
  },
} as const;

export const CANVAS_SIZE_STORAGE_KEY = "@thumbnail-maker/canvas-size";

export const THUMBNAIL_MAKER_STORAGE_KEY = "@thumbnail-maker/tags";
export const THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY = "@thumbnail-maker/palette";

export const EMPTY_TAG = {
  id: -1,
  content: { type: "text", value: "" },
  tagVariant: "filled",
  tagShape: "round",
} as const;
