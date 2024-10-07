import React, { useEffect, useRef } from "react";
import "emoji-picker-element";

// emoji-picker-element의 타입 정의
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "emoji-picker": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface EmojiEvent extends Event {
  detail: {
    emoji: {
      unified: string;
      native: string;
      name: string;
    };
  };
}

interface CustomEmoji {
  name: string;
  shortcodes: string[];
  url: string;
}

interface EmojiPickerProps {
  onEmojiSelect?: (emoji: EmojiEvent["detail"]) => void;
  skinToneEmoji?: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  skinToneEmoji = "👍",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const customEmojis = [
    {
      name: "👍",
      shortcodes: ["thumbsup"],
      url: "/emojis/16.png",
    },
  ];

  useEffect(() => {
    if (containerRef.current) {
      const picker = document.createElement("emoji-picker") as HTMLElement & {
        skinToneEmoji: string;
        customEmoji: CustomEmoji[];
      };

      containerRef.current.appendChild(picker);

      picker.addEventListener(
        "emoji-click",
        (event: CustomEvent<EmojiEvent["detail"]>) => {
          console.log("Emoji clicked!", event.detail);
          if (onEmojiSelect) {
            onEmojiSelect(event.detail);
          }
        }
      );

      picker.skinToneEmoji = skinToneEmoji;

      if (customEmojis.length > 0) {
        picker.customEmoji = customEmojis;
      }

      // 클린업 함수
      return () => {
        containerRef.current?.removeChild(picker);
      };
    }
  }, [onEmojiSelect, skinToneEmoji, customEmojis]);

  return <div ref={containerRef}></div>;
};

export default EmojiPicker;
