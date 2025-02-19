import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ThreeDEmojiMap from "src/assets/emojis/3d-emoji-map.json";
import { cn } from "src/lib/utils";
import { EmojiType } from "./index.types";
import {
  THREE_D_EMOJI_CATEGORY_EMOJI_MAP,
  ThreeDEmojiCategory,
} from "./index.constants";
import { Input } from "../ui/input";
import { useEmoji } from "./useEmoji";

interface Props {
  onEmojiSelect: (emoji: EmojiType) => void;
}

const getImage = (emoji: EmojiType) => {
  return `https://avahrjwyynzeocqpyfhw.supabase.co/storage/v1/object/public/3d-fluent-emojis/${emoji.image}`;
};

export const ThreeDEmojiPicker = ({ onEmojiSelect }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ThreeDEmojiCategory>("animals&nature");

  const { categories, searchResults } = useEmoji({
    searchTerm,
    category: selectedCategory,
  });

  const handleEmojiClick = (emoji: EmojiType) => {
    onEmojiSelect(emoji);
  };

  return (
    <div className="h-[360px] min-h-fit max-w-[360px] rounded-lg border bg-[#1D2027] shadow-md">
      <div className="p-1">
        <Input
          placeholder="Search for emojis in English"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Tabs
        value={selectedCategory}
        onValueChange={(value) =>
          setSelectedCategory(value as ThreeDEmojiCategory)
        }
      >
        <TabsList className="flex gap-1 py-1">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              className="h-9 w-9 flex-1 px-1 py-0 text-[24px]"
              value={category}
            >
              {THREE_D_EMOJI_CATEGORY_EMOJI_MAP[category]}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex max-h-[300px] flex-wrap gap-1 overflow-y-auto p-1 scrollbar">
          {searchResults.map((emoji) => (
            <div
              key={emoji.cldr}
              onClick={() => handleEmojiClick(emoji)}
              className={emoji.cldr}
            >
              <EmojiItem emoji={emoji} />
            </div>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

function EmojiItem({ emoji }: { emoji: EmojiType }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = getImage(emoji);
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
  }, [emoji]);

  if (isLoading) {
    return (
      <div className="flex-0 h-[38px] w-[38px] animate-pulse rounded bg-gray-700" />
    );
  }

  if (hasError) {
    return (
      <div className="flex-0 flex h-[38px] w-[38px] items-center justify-center bg-red-100/50 text-red-500">
        !
      </div>
    );
  }

  return (
    <div
      className={cn(
        emoji.cldr,
        "flex-0 flex h-[38px] w-[38px] items-center justify-center"
      )}
    >
      <img
        width={32}
        height={32}
        src={getImage(emoji)}
        alt={emoji.cldr}
        className="h-8 w-8 object-contain"
      />
    </div>
  );
}
