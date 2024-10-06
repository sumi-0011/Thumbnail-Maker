import { Picker, EmojiType } from "ms-3d-emoji-picker";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { SmilePlusIcon } from "lucide-react";
import { useOutsideClick } from "src/hooks/use-outside-click";

function EmojiPicker({ onAction }: { onAction: (emoji: EmojiType) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const pickerRef = useRef(null);
  useOutsideClick(pickerRef, () => setIsOpen(false));

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
      <div className="absolute right-0 z-10 mt-2" ref={pickerRef}>
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
