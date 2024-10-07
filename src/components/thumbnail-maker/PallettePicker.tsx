import { cn } from "src/lib/utils";
import { usePalette, usePaletteAction } from "./Palette.context";
import { PALETTE } from "./assets/pallette.constants";
import { PaletteVariant } from "./assets/palette.types";

export function PallettePicker() {
  const { currentPalette } = usePalette();
  const { onPaletteChange } = usePaletteAction();

  return (
    <div className="flex gap-1.5">
      {Object.entries(PALETTE).map(([variant, palette]) => (
        <div
          key={variant}
          className={cn(
            "h-8 w-8 rounded-[4px]",
            "bg-cover",
            currentPalette === variant ? "border-[1px] border-white" : ""
          )}
          style={{ background: palette.paletteBackground }}
          onClick={() => onPaletteChange(variant as PaletteVariant)}
        ></div>
      ))}
    </div>
  );
}
