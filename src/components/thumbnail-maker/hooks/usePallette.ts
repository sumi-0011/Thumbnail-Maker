import { CSSProperties, useState } from "react";
import { PALETTE, PaletteVariant } from "../pallette.constants";

export const usePallette = () => {
  const [pallet, setPallet] = useState(PALETTE.blue_gradient);

  const canvasBg = pallet.background;
  const tagStyle = pallet.tagStyle;

  const onChangePallet = (palletName: PaletteVariant) => {
    setPallet(PALETTE[palletName]);
  };

  return { canvasBg, tagStyle, onChangePallet };
};
