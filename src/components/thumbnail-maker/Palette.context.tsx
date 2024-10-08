import { createContext, PropsWithChildren, useContext, useState } from "react";
import { PALETTE } from "./assets/palette.constants";
import { PaletteVariant } from "./assets/palette.types";
import useStorageState from "use-storage-state";
import { THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY } from "./assets/constants";

interface PaletteContextType {
  currentPalette: PaletteVariant;
}

interface PaletteActionContextType {
  onPaletteChange: (palette: PaletteVariant) => void;
}

// 차라리 zustand 쓰는게 더 낫지 않을까?
const PaletteContext = createContext<PaletteContextType | undefined>(undefined);
const PaletteActionContext = createContext<
  PaletteActionContextType | undefined
>(undefined);

export const PaletteProvider = ({ children }: PropsWithChildren) => {
  const [currentPalette, setCurrentPalette] = useStorageState<PaletteVariant>(
    THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY,
    {
      defaultValue: "blue_gradient",
    }
  );

  const setPalette = (palette: PaletteVariant) => {
    setCurrentPalette(palette);
  };

  return (
    <PaletteContext.Provider value={{ currentPalette }}>
      <PaletteActionContext.Provider value={{ onPaletteChange: setPalette }}>
        {children}
      </PaletteActionContext.Provider>
    </PaletteContext.Provider>
  );
};

export const usePalette = () => {
  const context = useContext(PaletteContext);
  if (context === undefined) {
    throw new Error("usePalette must be used within a PaletteProvider");
  }
  return context;
};

export const useCurrentPaletteStyle = () => {
  const { currentPalette } = usePalette();
  return PALETTE[currentPalette];
};

export const usePaletteAction = () => {
  const context = useContext(PaletteActionContext);
  if (context === undefined) {
    throw new Error("usePaletteAction must be used within a PaletteProvider");
  }
  return context;
};
