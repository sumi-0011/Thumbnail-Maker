import { useMemo } from "react";
import Fuse from "fuse.js";
import {
  THREE_D_EMOJI_CATEGORIES,
  THREE_D_EMOJI_MAP,
  ThreeDEmojiCategory,
} from "./index.constants";
import { EmojiType } from "./index.types";

interface UseEmojiProps {
  searchTerm: string;
  category: ThreeDEmojiCategory;
}

interface UseEmojiReturn {
  categories: ThreeDEmojiCategory[];
  searchResults: EmojiType[];
}

export function useEmoji({
  searchTerm,
  category,
}: UseEmojiProps): UseEmojiReturn {
  const categories = THREE_D_EMOJI_CATEGORIES as ThreeDEmojiCategory[];
  const fuseOptions = {
    shouldSort: true,
    findAllMatches: true,
    keys: ["keywords"],
    threshold: 0.5,
    minMatchCharLength:
      searchTerm.length > 4 ? searchTerm.length - 1 : searchTerm.length,
  };

  const emojis = Object.values(THREE_D_EMOJI_MAP[category]);

  const fuse = useMemo(
    () => new Fuse(emojis, fuseOptions),
    [emojis, fuseOptions],
  );

  const searchResults: EmojiType[] = useMemo(() => {
    const _result = fuse.search(searchTerm);

    return searchTerm ? _result.map((r) => r.item) : emojis;
  }, [fuse, searchTerm, emojis]);

  return {
    categories,
    searchResults,
  };
}
