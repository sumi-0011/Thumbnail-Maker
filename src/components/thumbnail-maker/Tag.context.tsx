import {
  createContext,
  CSSProperties,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Tag } from "./assets/palette.types";
import { useThumbnailTagList } from "./hooks/useThumbnailTagList";

// 태그 정렬 타입 정의
export type TagAlignment = "start" | "center" | "end";

export const TAG_ALIGNMENT_VALUES: Record<TagAlignment, CSSProperties> = {
  start: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  end: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    alignContent: "flex-end",
  },
};

interface TagListContextType {
  tags: Tag[];
}

interface TagActionContextType {
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: number) => void;
  onUpdateTag: (tagId: number, newTag: Tag) => void;
  onResetTags: () => void;
  onRollbackTags: () => void;
  onUpdateTagOrder: (newTags: Tag[]) => void;
  onRandomShuffle: () => void;
}

// 태그 스타일 컨텍스트 추가
interface TagStyleContextType {
  alignment: TagAlignment;
}

interface TagStyleActionContextType {
  setAlignment: (alignment: TagAlignment) => void;
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
  onUpdateTagOrder: () => {},
  onRandomShuffle: () => {},
});

// 새로운 스타일 컨텍스트 생성
const TagStyleContext = createContext<TagStyleContextType | undefined>({
  alignment: "start",
});

const TagStyleActionContext = createContext<
  TagStyleActionContextType | undefined
>({
  setAlignment: () => {},
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
    onUpdateTagOrder,
    onRandomShuffle,
  } = useThumbnailTagList();

  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  // 태그 정렬 상태 추가
  const [alignment, setAlignment] = useState<TagAlignment>("start");

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
          onUpdateTagOrder,
          onRandomShuffle,
        }}
      >
        <SelectedTagContext.Provider value={{ selectedTag }}>
          <SelectTagActionContext.Provider
            value={{ onSelectTag, clearSelectedTag }}
          >
            <TagStyleContext.Provider value={{ alignment }}>
              <TagStyleActionContext.Provider value={{ setAlignment }}>
                {children}
              </TagStyleActionContext.Provider>
            </TagStyleContext.Provider>
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

// 새로운 훅 추가
export const useTagStyle = () => {
  const context = useContext(TagStyleContext);
  if (context === undefined) {
    throw new Error("useTagStyle must be used within a TagProvider");
  }
  return context;
};

export const useTagStyleAction = () => {
  const context = useContext(TagStyleActionContext);
  if (context === undefined) {
    throw new Error("useTagStyleAction must be used within a TagProvider");
  }
  return context;
};
