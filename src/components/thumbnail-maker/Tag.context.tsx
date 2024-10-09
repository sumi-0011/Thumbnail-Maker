import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Tag } from "./assets/palette.types";

interface SelectTagContextType {
  selectedTag: Tag | null;
}

interface SelectTagActionContextType {
  onSelectTag: (tag: Tag) => void;
  clearSelectedTag: () => void;
}

const SelectedTagContext = createContext<SelectTagContextType | undefined>(
  undefined
);
const SelectTagActionContext = createContext<
  SelectTagActionContextType | undefined
>(undefined);

export const TagProvider = ({ children }: PropsWithChildren) => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const setTag = (tag: Tag) => {
    setSelectedTag(tag);
  };

  const clearSelectedTag = () => {
    setSelectedTag(null);
  };

  return (
    <SelectedTagContext.Provider value={{ selectedTag }}>
      <SelectTagActionContext.Provider
        value={{ onSelectTag: setTag, clearSelectedTag }}
      >
        {children}
      </SelectTagActionContext.Provider>
    </SelectedTagContext.Provider>
  );
};

export const useSelectedTag = () => {
  const context = useContext(SelectedTagContext);
  if (context === undefined) {
    throw new Error("useSelectedTag must be used within a TagProvider");
  }
  return context;
};

export const useSelectedTagAction = () => {
  const context = useContext(SelectTagActionContext);
  if (context === undefined) {
    throw new Error("useSelectedTagAction must be used within a TagProvider");
  }
  return context;
};
