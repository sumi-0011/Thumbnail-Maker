import { createContext, PropsWithChildren, useContext } from "react";
import useStorageState from "use-storage-state";
import {
  CANVAS_SIZE_STORAGE_KEY,
  CanvasSizePreset,
  canvasSizePresets,
} from "./assets/constants";

export type LayoutMode = "flow" | "free-form";

const LAYOUT_MODE_STORAGE_KEY = "@thumbnail-maker/layout-mode";

interface CanvasSizeContextType {
  currentSize: CanvasSizePreset;
  canvasStyle: (typeof canvasSizePresets)[CanvasSizePreset];
  layoutMode: LayoutMode;
}

interface CanvasSizeActionContextType {
  onSizeChange: (size: CanvasSizePreset) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
}

const CanvasSizeContext = createContext<CanvasSizeContextType | undefined>(
  undefined
);
const CanvasSizeActionContext = createContext<
  CanvasSizeActionContextType | undefined
>(undefined);

export function CanvasSizeProvider({ children }: PropsWithChildren) {
  const [currentSize, setCurrentSize] = useStorageState<CanvasSizePreset>(
    CANVAS_SIZE_STORAGE_KEY,
    {
      defaultValue: "wide",
    }
  );

  const [layoutMode, setLayoutMode] = useStorageState<LayoutMode>(
    LAYOUT_MODE_STORAGE_KEY,
    {
      defaultValue: "flow",
    }
  );

  const value = {
    currentSize,
    canvasStyle: canvasSizePresets[currentSize],
    layoutMode,
  };

  const actions = {
    onSizeChange: (size: CanvasSizePreset) => setCurrentSize(size),
    onLayoutModeChange: (mode: LayoutMode) => setLayoutMode(mode),
  };

  return (
    <CanvasSizeContext.Provider value={value}>
      <CanvasSizeActionContext.Provider value={actions}>
        {children}
      </CanvasSizeActionContext.Provider>
    </CanvasSizeContext.Provider>
  );
}

export const useCanvasSize = () => {
  const context = useContext(CanvasSizeContext);
  if (context === undefined) {
    throw new Error("useCanvasSize must be used within a CanvasSizeProvider");
  }
  return context;
};

export const useCanvasSizeAction = () => {
  const context = useContext(CanvasSizeActionContext);
  if (context === undefined) {
    throw new Error(
      "useCanvasSizeAction must be used within a CanvasSizeProvider"
    );
  }
  return context;
};
