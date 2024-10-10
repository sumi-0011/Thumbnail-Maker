import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Tag } from "./assets/palette.types";
import { useThumbnailTagList } from "./hooks/useThumbnailTagList";

interface TagListContextType {
  tags: Tag[];
}

interface TagActionContextType {
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: number) => void;
  onUpdateTag: (tagId: number, newTag: Tag) => void;
  onResetTags: () => void;
  onRollbackTags: () => void;
}

const TagListContext = createContext<TagListContextType | undefined>({
  tags: [],
});
const TagActionContext = createContext<TagActionContextType | undefined>({
  onAddTag: () => {},
  onRemoveTag: () => {},
  onUpdateTag: () => {},
  onResetTags: () => {},
  onRollbackTags: () => {},
});

interface SelectTagContextType {
  selectedTag: Tag | null;
}

interface SelectTagActionContextType {
  onSelectTag: (tag: Tag) => void;
  clearSelectedTag: () => void;
}

const SelectedTagContext = createContext<SelectTagContextType | undefined>({
  selectedTag: null,
});
const SelectTagActionContext = createContext<
  SelectTagActionContextType | undefined
>({
  onSelectTag: () => {},
  clearSelectedTag: () => {},
});

export const TagProvider = ({ children }: PropsWithChildren) => {
  const {
    tags,
    onAddTag,
    onRemoveTag,
    onUpdateTag,
    onResetTags,
    onRollbackTags,
  } = useThumbnailTagList();

  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const onSelectTag = (tag: Tag) => {
    setSelectedTag(tag);
  };

  const clearSelectedTag = () => {
    setSelectedTag(null);
  };

  return (
    <TagListContext.Provider value={{ tags }}>
      <TagActionContext.Provider
        value={{
          onAddTag,
          onRemoveTag,
          onUpdateTag,
          onResetTags,
          onRollbackTags,
        }}
      >
        <SelectedTagContext.Provider value={{ selectedTag }}>
          <SelectTagActionContext.Provider
            value={{ onSelectTag, clearSelectedTag }}
          >
            {children}
          </SelectTagActionContext.Provider>
        </SelectedTagContext.Provider>
      </TagActionContext.Provider>
    </TagListContext.Provider>
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

export const useTagList = () => {
  const context = useContext(TagListContext);
  if (context === undefined) {
    throw new Error("useTagList must be used within a TagProvider");
  }
  return context;
};

export const useTagAction = () => {
  const context = useContext(TagActionContext);
  if (context === undefined) {
    throw new Error("useTagAction must be used within a TagProvider");
  }
  return context;
};
