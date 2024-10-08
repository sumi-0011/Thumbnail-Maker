import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { SmilePlusIcon } from "lucide-react";
import { useOutsideClick } from "src/hooks/use-outside-click";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CustomEmojiPicker, {
  EmojiType,
} from "../3d-emoji-picker/CustomEmojiPicker";
import { cn } from "src/lib/utils";

interface Props {
  onAction: (emoji: EmojiType) => void;
}

export function EmojiPicker({ onAction }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const pickerRef = useRef(null);
  useOutsideClick(pickerRef, () => setIsOpen(false));

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => setIsOpen((prev) => !prev)}
              variant="secondary"
              size="icon"
              className="h-[42px] min-w-[42px]"
            >
              <SmilePlusIcon size={18} color="#6A83FF" />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>
            <p>원하는 3D 이모지를 추가할 수 있어요!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div
        className={cn(
          "absolute right-0 z-10 mt-2",
          isOpen ? "block" : "hidden"
        )}
        ref={pickerRef}
      >
        <CustomEmojiPicker onEmojiSelect={onAction} />
        {/* <Picker
          isOpen={isOpen}
          handleEmojiSelect={(selectedEmoji: EmojiType) => {
            console.log("selectedEmoji: ", selectedEmoji);
            onAction(selectedEmoji);
          }}
        /> */}
      </div>
    </div>
  );
}
