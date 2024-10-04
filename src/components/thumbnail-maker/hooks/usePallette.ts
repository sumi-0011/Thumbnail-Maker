import { CSSProperties, useState } from "react";

type TagStyle =
  | "filled-round"
  | "outlined-round"
  | "filled-squared"
  | "outlined-squared"
  | "ghost-round"
  | "ghost-squared";

interface Palette {
  canvasBg: string;
  tagStyle: {
    [key in TagStyle]: CSSProperties;
  };
}

type PaletteName = "gradient_blue";

export const PALLETTE: Record<PaletteName, Palette> = {
  gradient_blue: {
    canvasBg:
      "linear-gradient(127deg, #8ECDF2 3.2%, #A0C8FC 21.06%, #A4C7FE 30.47%, #96BDFE 38.93%, #84B0FE 47.86%, #2B6FFF 97.22%)",
    tagStyle: {
      "filled-round": {
        borderRadius: "52px",
        background:
          "linear-gradient(120deg, #2EA1FF 14.35%, #5D9CFF 45.44%, #1F65FD 93.51%)",
        color: "#fff",
      },
      "outlined-round": {
        borderRadius: "52px",
        border: "4px solid #FFF",
        background: "rgba(255, 255, 255, 0.20)",
      },
      "filled-squared": {
        borderRadius: "20px",
        color: "#3176FF",
        background: "#FFFFFF",
      },
      "outlined-squared": {
        background: "rgba(255, 255, 255, 0.20)",
        border: "4px solid #FFF",
        borderRadius: "20px",
      },
      "ghost-round": {
        background: "transparent",
      },
      "ghost-squared": {
        background: "transparent",
      },
    },
  },
};

export const usePallette = () => {
  const [pallet, setPallet] = useState(PALLETTE.gradient_blue);

  const canvasBg = pallet.canvasBg;
  const tagStyle = pallet.tagStyle;

  const onChangePallet = (palletName: PaletteName) => {
    setPallet(PALLETTE[palletName]);
  };

  return { canvasBg, tagStyle, onChangePallet };
};
