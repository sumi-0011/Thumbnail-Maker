import { CSSProperties } from "react";

export const tagVariant = ["filled", "outlined", "ghost"] as const;
export const tagShape = ["round", "squared", "emoji"] as const;

type TagVariant = (typeof tagVariant)[number];
type TagShape = (typeof tagShape)[number];

type PalletTag = `${TagVariant}-${TagShape}`;

export const tagStyleMap = tagVariant.flatMap((variant) =>
  tagShape.map((shape) => ({ variant, shape }))
);

export type PaletteVariant = "blue_gradient";

export type PaletteTagStyle = { [key in PalletTag]: CSSProperties };

type PaletteStyle = {
  background: string;
  isImageBg?: boolean;
  tagStyle: {
    [key in PalletTag]: CSSProperties;
  };
};

export const PALETTE: Record<PaletteVariant, PaletteStyle> = {
  blue_gradient: {
    background: "url(/assets/palette/thumbnail-blue-gradient-bg.webp)",

    tagStyle: {
      "filled-round": {
        background:
          "linear-gradient(120deg, #2EA1FF 14.35%, #5D9CFF 45.44%, #1F65FD 93.51%)",
        color: "#fff",
        padding: "0 24px",
      },
      "filled-squared": {
        background: "#fff",
        color: "#3176FF",
        padding: "0 24px",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#fff",
        padding: "0 24px",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#fff",
        padding: "0 24px",
      },
      "ghost-round": {
        borderRadius: "45px",
        background: "transparent",
        color: "#fff",
        padding: "0 12px",
      },
      "ghost-squared": {
        borderRadius: "16px",
        background: "transparent",
        color: "#fff",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
      },
    },
  },
};
