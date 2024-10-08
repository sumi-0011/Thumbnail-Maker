import { PaletteStyle, PaletteVariant } from "./palette.types";

export const PALETTE: Record<PaletteVariant, PaletteStyle> = {
  blue_gradient: {
    background:
      "no-repeat center/100% url(/assets/palette/thumbnail-blue-gradient-bg.webp)",
    paletteBackground:
      "linear-gradient(127deg, #8ECDF2 3.2%, #A0C8FC 21.06%, #A4C7FE 30.47%, #96BDFE 38.93%, #84B0FE 47.86%, #2B6FFF 97.22%)",
    tagStyle: {
      "filled-round": {
        background:
          "linear-gradient(120deg, #2EA1FF 14.35%, #5D9CFF 45.44%, #1F65FD 93.51%)",
        color: "#fff",
      },
      "filled-squared": {
        background: "#fff",
        color: "#3176FF",
      },
      "outlined-round": {
        color: "#3176FF",
      },
      "outlined-squared": {
        color: "#3176FF",
      },
      "ghost-round": {
        color: "#3176FF",
      },
      "ghost-squared": {
        color: "#3176FF",
      },
    },
  },
  rose_gradient: {
    background:
      "no-repeat center/100% url(/assets/palette/thumbnail-rose-gradient-bg.webp)",
    paletteBackground:
      "linear-gradient(115deg, #FDD4D5 0%, #EDB8D1 27.5%, #AFB6E4 70.5%, #92B5ED 100%)",
    tagStyle: {
      "filled-round": {
        background: "linear-gradient(99deg, #F59CB7 17.31%, #A7A0EF 94.56%)",
        color: "#FFF",
      },
      "filled-squared": {
        background: "#FFF",
        color: "#647DC8",
      },
      "outlined-round": {
        color: "#647DC8",
      },
      "outlined-squared": {
        color: "#647DC8",
      },
      "ghost-round": {
        color: "#647DC8",
      },
      "ghost-squared": {
        color: "#647DC8",
      },
    },
  },
  yellow_dark: {
    background: "#141417",
    paletteBackground: "#FFEA74",
    tagStyle: {
      "filled-round": {
        background: "#FFEA74",
        color: "#18181D",
      },
      "filled-squared": {
        background: "#FFC681",
        color: "#18181D",
      },
      "outlined-round": {
        border: "4px solid rgba(255, 234, 116, 0.70)",
        background: "rgba(255, 234, 116, 0.10)",
        color: "#FFEA74",
      },
      "outlined-squared": {
        border: "4px solid rgba(255, 198, 129, 0.70)",
        background: "rgba(255, 198, 129, 0.10)",
        color: "#FFC681",
      },
    },
  },
  green_dark: {
    background: "#141417",
    paletteBackground: "#DDF867",
    tagStyle: {
      "filled-round": {
        background: "#DDF867",
        color: "#18181D",
      },
      "outlined-round": {
        border: "4px solid rgba(221, 248, 103, 0.70)",
        background: "rgba(221, 248, 103, 0.10)",
        color: "#DDF867",
      },
      "filled-squared": {
        background: "#A8F867",
        color: "#18181D",
      },
      "outlined-squared": {
        border: "4px solid rgba(168, 248, 103, 0.70)",
        background: "rgba(168, 248, 103, 0.10)",
        color: "#A8F867",
      },
    },
  },
  blue_dark: {
    background: "#141417",
    paletteBackground: "#3D7EFF",
    tagStyle: {
      "filled-round": {
        background: "#3D7EFF",
        color: "#FFF",
      },
      "filled-squared": {
        background: "#FFF",
        color: "#326FE8",
      },
      "outlined-squared": {
        border: "4px solid rgba(159, 191, 255, 0.70)",
        background: "rgba(106, 155, 252, 0.10)",
        color: "#9FBFFF",
      },
    },
  },
  purple_light: {
    background: "#A0A0FB",
    paletteBackground: "#A0A0FB",
    tagStyle: {
      "filled-round": {
        background: "#FFF",
        color: "#7575BE",
      },
      "outlined-round": {
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(34, 26, 85, 0.30)",
      },
      "filled-squared": {
        background: "#8686F2",
        color: "#FFF",
      },
      "outlined-squared": {
        textShadow: "0px 0px 30.61px rgba(34, 26, 85, 0.30)",
      },
      "ghost-round": {
        textShadow: "0px 0px 30.61px rgba(34, 26, 85, 0.30)",
      },
      "ghost-squared": {
        textShadow: "0px 0px 30.61px rgba(34, 26, 85, 0.30)",
      },
    },
  },
  blue_light: {
    background: "#81AFFF",
    paletteBackground: "#81AFFF",
    tagStyle: {
      "filled-round": {
        background: "#FFF",
        color: "#5F86C9",
      },
      "outlined-round": {
        textShadow: "0px 0px 30.61px rgba(16, 36, 97, 0.30)",
      },
      "filled-squared": {
        background: "#6493E6",
        color: "#FFF",
      },
      "outlined-squared": {
        textShadow: "0px 0px 30.61px rgba(16, 36, 97, 0.30)",
      },
      "ghost-round": {
        textShadow: "0px 0px 30.61px rgba(16, 36, 97, 0.30)",
      },
      "ghost-squared": {
        textShadow: "0px 0px 30.61px rgba(16, 36, 97, 0.30)",
      },
    },
  },

  green_light: {
    background: "#7AD79D",
    paletteBackground: "#7AD79D",
    tagStyle: {
      "filled-round": {
        background: "#fff",
        color: "#669491",
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
      },
      "outlined-round": {
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
      },
      "filled-squared": {
        background: "#5DC486",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
      },
      "outlined-squared": {
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
      },
      "ghost-round": {
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
      },
      "ghost-squared": {
        textShadow: "0px 0px 30.61px rgba(9, 73, 15, 0.30)",
      },
    },
  },

  orange_light: {
    background: "#E98D74",
    paletteBackground: "#E98D74",
    tagStyle: {
      "filled-round": {
        background: "#fff",
        color: "#DC7255",
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
      },
      "filled-squared": {
        background: "#DC7255",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
      },
      "outlined-round": {
        border: "4px solid #fff",
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
      },
      "outlined-squared": {
        border: "4px solid #fff",
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
      },
      "ghost-round": {
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
      },
      "ghost-squared": {
        textShadow: "0px 0px 30.61px rgba(167, 69, 24, 0.30)",
      },
    },
  },
  pink_light: {
    background: "#E97497",
    paletteBackground: "#E97497",
    tagStyle: {
      "filled-round": {
        background: "#fff",
        color: "#D46385",
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
      },
      "filled-squared": {
        background: "#D46385",
        color: "#fff",
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
      },
      "outlined-round": {
        border: "4px solid #fff",
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
      },
      "outlined-squared": {
        border: "4px solid #fff",
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
      },
      "ghost-round": {
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
      },
      "ghost-squared": {
        textShadow: "0px 0px 30.61px rgba(133, 9, 24, 0.30)",
      },
    },
  },
};
