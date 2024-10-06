import { CSSProperties } from "react";

export const tagVariant = ["filled", "outlined", "ghost"] as const;
export const tagShape = ["round", "squared", "emoji"] as const;

type TagVariant = (typeof tagVariant)[number];
type TagShape = (typeof tagShape)[number];

export type PalletTag = `${TagVariant}-${TagShape}`;

export const tagStyleMap = tagVariant.flatMap((variant) =>
  tagShape.map((shape) => ({ variant, shape }))
);

export const paletteVariant = [
  "blue_gradient",
  "rose_gradient",
  "yellow_dark",
  "green_dark",
  "blue_dark",
  "purple_light",
  "blue_light",
  "green_light",
  "orange_light",
  "pink_light",
] as const;
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
  tagStyle: {
    [key in PalletTag]: CSSProperties;
  };
};

export const PALETTE: Record<PaletteVariant, PaletteStyle> = {
  blue_gradient: {
    background: "url(/assets/palette/thumbnail-blue-gradient-bg.webp)",
    paletteBackground:
      "linear-gradient(127deg, #8ECDF2 3.2%, #A0C8FC 21.06%, #A4C7FE 30.47%, #96BDFE 38.93%, #84B0FE 47.86%, #2B6FFF 97.22%)",
    tagStyle: {
      "filled-round": {
        borderRadius: "45px",
        background:
          "linear-gradient(120deg, #2EA1FF 14.35%, #5D9CFF 45.44%, #1F65FD 93.51%)",
        color: "#fff",
        padding: "0 24px",
      },
      "filled-squared": {
        borderRadius: "16px",
        background: "#fff",
        color: "#3176FF",
        padding: "0 24px",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#3176FF",
        padding: "0 24px",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#3176FF",
        padding: "0 24px",
      },
      "ghost-round": {
        borderRadius: "45px",
        background: "transparent",
        color: "#3176FF",
        padding: "0 12px",
      },
      "ghost-squared": {
        borderRadius: "16px",
        background: "transparent",
        color: "#3176FF",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
      },
    },
  },
  rose_gradient: {
    background: "url(/assets/palette/thumbnail-rose-gradient-bg.webp)",
    paletteBackground:
      "linear-gradient(115deg, #FDD4D5 0%, #EDB8D1 27.5%, #AFB6E4 70.5%, #92B5ED 100%)",
    tagStyle: {
      "filled-round": {
        borderRadius: "45px",
        background: "linear-gradient(99deg, #F59CB7 17.31%, #A7A0EF 94.56%)",
        color: "#FFF",
        padding: "0 24px",
      },
      "filled-squared": {
        borderRadius: "16px",
        background: "#FFF",
        color: "#647DC8",
        padding: "0 24px",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#647DC8",
        padding: "0 24px",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#647DC8",
        padding: "0 24px",
      },
      "ghost-round": {
        background: "transparent",
        color: "#647DC8",
        padding: "0 12px",
      },
      "ghost-squared": {
        background: "transparent",
        color: "#647DC8",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
      },
    },
  },
  yellow_dark: {
    background: "#141417",
    paletteBackground: "#FFEA74",
    tagStyle: {
      "filled-round": {
        borderRadius: "45px",
        background: "#FFEA74",
        color: "#18181D",
        padding: "0 24px",
      },
      "filled-squared": {
        borderRadius: "16px",
        background: "#FFC681",
        color: "#18181D",
        padding: "0 24px",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid rgba(255, 234, 116, 0.70)",
        background: "rgba(255, 234, 116, 0.10)",
        color: "#FFEA74",
        padding: "0 24px",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid rgba(255, 198, 129, 0.70)",
        background: "rgba(255, 198, 129, 0.10)",
        color: "#FFC681",
        padding: "0 24px",
      },
      "ghost-round": {
        borderRadius: "45px",
        background: "transparent",
        color: "#FFF",
        padding: "0 12px",
      },
      "ghost-squared": {
        borderRadius: "16px",
        background: "transparent",
        color: "#FFF",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
        color: "#FFF",
      },
    },
  },
  green_dark: {
    background: "#141417",
    paletteBackground: "#DDF867",
    tagStyle: {
      "filled-round": {
        borderRadius: "45px",
        background: "#DDF867",
        color: "#18181D",
        padding: "0 24px",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid rgba(221, 248, 103, 0.70)",
        background: "rgba(221, 248, 103, 0.10)",
        color: "#DDF867",
        padding: "0 24px",
      },
      "filled-squared": {
        borderRadius: "16px",
        background: "#A8F867",
        color: "#18181D",
        padding: "0 24px",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid rgba(168, 248, 103, 0.70)",
        background: "rgba(168, 248, 103, 0.10)",
        color: "#A8F867",
        padding: "0 24px",
      },
      "ghost-round": {
        borderRadius: "45px",
        background: "transparent",
        color: "#FFF",
        padding: "0 12px",
      },
      "ghost-squared": {
        borderRadius: "16px",
        background: "transparent",
        color: "#FFF",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
        color: "#FFF",
      },
    },
  },
  blue_dark: {
    background: "#141417",
    paletteBackground: "#3D7EFF",
    tagStyle: {
      "filled-round": {
        borderRadius: "45px",
        background: "#3D7EFF",
        color: "#FFF",
        padding: "0 24px",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#FFF",
        padding: "0 24px",
      },
      "filled-squared": {
        borderRadius: "16px",
        background: "#FFF",
        color: "#326FE8",
        padding: "0 24px",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid rgba(159, 191, 255, 0.70)",
        background: "rgba(106, 155, 252, 0.10)",
        color: "#9FBFFF",
        padding: "0 24px",
      },
      "ghost-round": {
        borderRadius: "45px",
        background: "transparent",
        color: "#FFF",
        padding: "0 12px",
      },
      "ghost-squared": {
        borderRadius: "16px",
        background: "transparent",
        color: "#FFF",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
        color: "#FFF",
      },
    },
  },
  purple_light: {
    background: "#A0A0FB",
    paletteBackground: "#A0A0FB",
    tagStyle: {
      "filled-round": {
        borderRadius: "45px",
        background: "#FFF",
        color: "#7575BE",
        padding: "0 24px",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#fff",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(34, 26, 85, 0.30)",
      },
      "filled-squared": {
        borderRadius: "16px",
        background: "#8686F2",
        color: "#FFF",
        padding: "0 24px",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#fff",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(34, 26, 85, 0.30)",
      },
      "ghost-round": {
        background: "transparent",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(34, 26, 85, 0.30)",
        padding: "0 12px",
      },
      "ghost-squared": {
        background: "transparent",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(34, 26, 85, 0.30)",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
      },
    },
  },
  blue_light: {
    background: "#81AFFF",
    paletteBackground: "#81AFFF",
    tagStyle: {
      "filled-round": {
        borderRadius: "45px",
        background: "#FFF",
        color: "#5F86C9",
        padding: "0 24px",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#FFF",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(16, 36, 97, 0.30)",
      },
      "filled-squared": {
        borderRadius: "16px",
        background: "#6493E6",
        color: "#FFF",
        padding: "0 24px",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#FFF",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(16, 36, 97, 0.30)",
      },
      "ghost-round": {
        background: "transparent",
        color: "#FFF",
        textShadow: "0px 0px 30.61px rgba(16, 36, 97, 0.30)",
        padding: "0 12px",
      },
      "ghost-squared": {
        background: "transparent",
        color: "#FFF",
        textShadow: "0px 0px 30.61px rgba(16, 36, 97, 0.30)",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
      },
    },
  },

  green_light: {
    background: "#7AD79D",
    paletteBackground: "#7AD79D",
    tagStyle: {
      "filled-round": {
        borderRadius: "45px",
        background: "#fff",
        color: "#669491",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        padding: "0 24px",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
      },
      "filled-squared": {
        borderRadius: "16px",
        background: "#5DC486",
        color: "#fff",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid rgba(255, 255, 255, 0.70)",
        background: "rgba(255, 255, 255, 0.10)",
        padding: "0 24px",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
      },
      "ghost-round": {
        background: "transparent",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
        padding: "0 12px",
      },
      "ghost-squared": {
        background: "transparent",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
      },
    },
  },

  orange_light: {
    background: "#E98D74",
    paletteBackground: "#E98D74",
    tagStyle: {
      "filled-round": {
        borderRadius: "45px",
        background: "#fff",
        color: "#DC7255",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
      },
      "filled-squared": {
        borderRadius: "16px",
        background: "#DC7255",
        color: "#fff",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid #fff",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#fff",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid #fff",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#fff",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
      },
      "ghost-round": {
        background: "transparent",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
        padding: "0 12px",
      },
      "ghost-squared": {
        background: "transparent",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
      },
    },
  },
  pink_light: {
    background: "#E97497",
    paletteBackground: "#E97497",
    tagStyle: {
      "filled-round": {
        borderRadius: "45px",
        background: "#fff",
        color: "#D46385",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
      },
      "filled-squared": {
        borderRadius: "16px",
        background: "#D46385",
        color: "#fff",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
      },
      "outlined-round": {
        borderRadius: "45px",
        border: "4px solid #fff",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#fff",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
      },
      "outlined-squared": {
        borderRadius: "16px",
        border: "4px solid #fff",
        background: "rgba(255, 255, 255, 0.10)",
        color: "#fff",
        padding: "0 24px",
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
      },
      "ghost-round": {
        background: "transparent",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
        padding: "0 12px",
      },
      "ghost-squared": {
        background: "transparent",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
        padding: "0 12px",
      },
      "filled-emoji": {},
      "outlined-emoji": {},
      "ghost-emoji": {
        padding: "0",
        color: "#fff",
      },
    },
  },
};
