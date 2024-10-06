import React from "react";
import {
  PALETTE,
  PaletteStyle,
  PaletteVariant,
  paletteVariant,
} from "./pallette.constants";
import { cn } from "src/lib/utils";
import { usePalette, usePaletteAction } from "./Palette.context";

function PallettePicker() {
  const { currentPalette } = usePalette();
  const { onPaletteChange } = usePaletteAction();

  return (
    <div className="flex gap-1.5">
      {Object.entries(PALETTE).map(([variant, palette]) => (
        <div
          key={variant}
          className={cn(
            "h-8 w-8 rounded-[4px]",
            currentPalette === variant ? "border-[1px] border-white" : "",
            "bg-cover"
          )}
          style={{ background: palette.paletteBackground }}
          onClick={() => onPaletteChange(variant as PaletteVariant)}
        ></div>
      ))}
    </div>
  );
}

export default PallettePicker;
