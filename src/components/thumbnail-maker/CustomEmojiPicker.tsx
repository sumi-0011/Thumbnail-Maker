import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ThreeDEmojiMap from "src/assets/emojis/3d-emoji-map.json";

const categories = Object.keys(ThreeDEmojiMap);
console.log("categories: ", categories);
// [
//   "animals&nature",
//   "flags",
//   "travel&places",
//   "smileys&emotion",
//   "objects",
//   "food&drink",
//   "symbols",
//   "activities",
//   "people&body"
// ]

const CategoryEmojiMap = {
  "animals&nature": "🐶",
  flags: "🚩",
  "travel&places": "🛫",
  "smileys&emotion": "😊",
  objects: "🔍",
  "food&drink": "🍔",
  symbols: "✡️",
  activities: "⚽️",
  "people&body": "👤",
};
type EmojiType = {
  cldr: string;
  glyph: string;
  group: string;
  keywords: string[];
  unicode: string;
};

interface Props {
  // onEmojiSelect: (emoji: EmojiType) => void;
}

const getImage = (emoji: EmojiType) => {
  return `https://avahrjwyynzeocqpyfhw.supabase.co/storage/v1/object/public/3d-fluent-emojis/${emoji.group}/${emoji.cldr}/3D/${emoji.cldr}_3d.png`;
};

const CustomEmojiPicker = ({}: Props) => {
  const [selectedTab, setSelectedTab] = useState("animals&nature");

  const handleEmojiClick = (emoji: EmojiType) => {
    console.log("emoji: ", emoji);
    // if (onEmojiSelect) {
    //   onEmojiSelect(emoji);
    // }
  };

  return (
    <div className="h-[360px] max-w-[360px] rounded-lg border shadow-md">
      <Tabs defaultValue="animals&nature" onValueChange={setSelectedTab}>
        <TabsList className="flex h-[38px] gap-1 p-0">
          {categories.map((category) => (
            <TabsTrigger
              className="h-[38px] w-[38px] flex-1 p-0 text-[28px]"
              value={category}
            >
              {CategoryEmojiMap[category as keyof typeof CategoryEmojiMap]}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => {
          const emojis =
            ThreeDEmojiMap[category as keyof typeof ThreeDEmojiMap];
          console.log("emojis: ", emojis);
          return (
            <TabsContent
              value={category}
              className="mt-4 max-h-[300px] overflow-y-auto"
            >
              <div className="flex flex-wrap gap-1">
                {Object.values(emojis).map((emoji, index) => (
                  <button key={index} onClick={() => handleEmojiClick(emoji)}>
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
    <div className="flex-0 flex h-[38px] w-[38px] items-center justify-center">
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
