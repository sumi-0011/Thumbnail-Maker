import { createContext, PropsWithChildren, useContext } from "react";
import useStorageState from "use-storage-state";
import {
  CANVAS_SIZE_STORAGE_KEY,
  CanvasSizePreset,
  canvasSizePresets,
} from "./assets/constants";

interface CanvasSizeContextType {
  currentSize: CanvasSizePreset;
  canvasStyle: (typeof canvasSizePresets)[CanvasSizePreset];
}

interface CanvasSizeActionContextType {
  onSizeChange: (size: CanvasSizePreset) => void;
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

  const value = {
    currentSize,
    canvasStyle: canvasSizePresets[currentSize],
  };

  const actions = {
    onSizeChange: (size: CanvasSizePreset) => setCurrentSize(size),
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
