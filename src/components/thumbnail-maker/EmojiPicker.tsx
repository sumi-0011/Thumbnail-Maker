import { Picker, EmojiType } from "ms-3d-emoji-picker";
import { Button } from "../ui/button";
import { useState } from "react";
import { SmilePlusIcon } from "lucide-react";

function EmojiPicker({ onAction }: { onAction: (emoji: EmojiType) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        variant="secondary"
        size="icon"
        className="h-[42px] min-w-[42px]"
      >
        <SmilePlusIcon size={18} color="#6A83FF" />
      </Button>
      <div className="absolute right-0 mt-2">
        <Picker
          isOpen={isOpen}
          handleEmojiSelect={(selectedEmoji: EmojiType) =>
            onAction(selectedEmoji)
          }
        />
      </div>
    </div>
  );
}

export default EmojiPicker;
