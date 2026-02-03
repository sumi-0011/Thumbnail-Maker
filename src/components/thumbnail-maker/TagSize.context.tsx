import { createContext, PropsWithChildren, useContext } from "react";
import useStorageState from "use-storage-state";

export type TagSizePreset = "S" | "M" | "L";

export interface TagSizeStyle {
  fontSize: string;
  tagHeight: string;
  lineHeight: string;
  gap: string;
  paddingX: string;
  borderRadius: {
    round: string;
    squared: string;
  };
  emojiSize: string;
  borderWidth: string;
}

const TAG_SIZE_PRESETS: Record<TagSizePreset, TagSizeStyle> = {
  S: {
    fontSize: "24px",
    tagHeight: "48px",
    lineHeight: "48px",
    gap: "8px 4px",
    paddingX: "12px",
    borderRadius: {
      round: "24px",
      squared: "8px",
    },
    emojiSize: "48px",
    borderWidth: "2px",
  },
  M: {
    fontSize: "48px",
    tagHeight: "90px",
    lineHeight: "90px",
    gap: "16px 8px",
    paddingX: "24px",
    borderRadius: {
      round: "45px",
      squared: "16px",
    },
    emojiSize: "90px",
    borderWidth: "4px",
  },
  L: {
    fontSize: "64px",
    tagHeight: "120px",
    lineHeight: "120px",
    gap: "24px 12px",
    paddingX: "32px",
    borderRadius: {
      round: "60px",
      squared: "20px",
    },
    emojiSize: "120px",
    borderWidth: "5px",
  },
};

const TAG_SIZE_STORAGE_KEY = "@thumbnail-maker/tag-size";

interface TagSizeContextType {
  currentSize: TagSizePreset;
  sizeStyle: TagSizeStyle;
}

interface TagSizeActionContextType {
  onSizeChange: (size: TagSizePreset) => void;
}

const TagSizeContext = createContext<TagSizeContextType | undefined>(undefined);
const TagSizeActionContext = createContext<
  TagSizeActionContextType | undefined
>(undefined);

export function TagSizeProvider({ children }: PropsWithChildren) {
  const [currentSize, setCurrentSize] = useStorageState<TagSizePreset>(
    TAG_SIZE_STORAGE_KEY,
    {
      defaultValue: "M",
    }
  );

  const value = {
    currentSize,
    sizeStyle: TAG_SIZE_PRESETS[currentSize],
  };

  const actions = {
    onSizeChange: (size: TagSizePreset) => setCurrentSize(size),
  };

  return (
    <TagSizeContext.Provider value={value}>
      <TagSizeActionContext.Provider value={actions}>
        {children}
      </TagSizeActionContext.Provider>
    </TagSizeContext.Provider>
  );
}

export const useTagSize = () => {
  const context = useContext(TagSizeContext);
  if (context === undefined) {
    throw new Error("useTagSize must be used within a TagSizeProvider");
  }
  return context;
};

export const useTagSizeAction = () => {
  const context = useContext(TagSizeActionContext);
  if (context === undefined) {
    throw new Error("useTagSizeAction must be used within a TagSizeProvider");
  }
  return context;
};
