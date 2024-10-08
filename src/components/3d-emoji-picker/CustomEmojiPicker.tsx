import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ThreeDEmojiMap from "src/assets/emojis/3d-emoji-map.json";
import { cn } from "src/lib/utils";
import { EmojiType } from "./index.types";
import {
  THREE_D__EMOJI_CATEGORIES,
  THREE_D_EMOJI_CATEGORY_EMOJI_MAP,
} from "./index.constants";

interface Props {
  onEmojiSelect: (emoji: EmojiType) => void;
}

const getImage = (emoji: EmojiType) => {
  return `https://avahrjwyynzeocqpyfhw.supabase.co/storage/v1/object/public/3d-fluent-emojis/${emoji.image}`;
};

const CustomEmojiPicker = ({ onEmojiSelect }: Props) => {
  // const [selectedTab, setSelectedTab] = useState("animals&nature");

  const handleEmojiClick = (emoji: EmojiType) => {
    onEmojiSelect(emoji);
  };

  return (
    <div className="h-[360px] max-w-[360px] rounded-lg border bg-[#1D2027] shadow-md">
      <Tabs defaultValue="animals&nature">
        <TabsList className="flex h-[38px] gap-1 p-1">
          {THREE_D__EMOJI_CATEGORIES.map((category) => (
            <TabsTrigger
              className="h-[38px] w-[38px] flex-1 p-0 text-[28px]"
              value={category}
            >
              {
                THREE_D_EMOJI_CATEGORY_EMOJI_MAP[
                  category as keyof typeof THREE_D_EMOJI_CATEGORY_EMOJI_MAP
                ]
              }
            </TabsTrigger>
          ))}
        </TabsList>
        {THREE_D__EMOJI_CATEGORIES.map((category) => {
          const emojis =
            ThreeDEmojiMap[category as keyof typeof ThreeDEmojiMap];
          return (
            <TabsContent
              value={category}
              className="mt-4 max-h-[300px] overflow-y-auto p-1"
            >
              <div className="flex flex-wrap gap-1">
                {Object.values(emojis).map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiClick(emoji)}
                    className={emoji.cldr}
                  >
                    <EmojiItem emoji={emoji} />
                  </button>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default CustomEmojiPicker;

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
      console.log("emoji", emoji.cldr, emoji.group);
    };
  }, [emoji]);

  if (isLoading) {
    return (
      <div className="flex-0 h-[38px] w-[38px] animate-pulse rounded bg-gray-200"></div>
    );
  }

  if (hasError) {
    return (
      <div className="flex-0 flex h-[38px] w-[38px] items-center justify-center bg-red-100 text-red-500">
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
        width={24}
        height={24}
        src={getImage(emoji)}
        alt={emoji.cldr}
        className="h-7 w-7 object-contain"
      />
    </div>
  );
}
