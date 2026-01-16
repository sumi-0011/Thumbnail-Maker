import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Tag, TagShape, TagVariant } from "./assets/palette.types";
import { EmojiPicker } from "./EmojiPicker";
import { EmojiType } from "../3d-emoji-picker";
import { AITagRecommendSheet } from "./AITagRecommendSheet";

interface Props {
  onAction: (tag: Tag) => void;
}

export function AddTagSection({ onAction }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [tagVariant, setTagVariant] = useState<TagVariant>("filled");
  const [tagShape, setTagShape] = useState<TagShape>("round");
  const [isAISheetOpen, setIsAISheetOpen] = useState(false);

  const onActionClick = async () => {
    if (inputValue.trim() === "") return;

    const id = new Date().getTime();

    onAction({
      id,
      content: {
        type: "text",
        value: inputValue,
      },
      tagVariant: tagVariant,
      tagShape: tagShape,
    });
    setInputValue("");
  };

  const onEmojiClick = (emoji: EmojiType) => {
    const id = new Date().getTime();
    onAction({
      id,
      content: {
        type: "3d-emoji",
        value: emoji,
      },
      tagShape: "emoji",
      tagVariant: "ghost",
    });
  };

  return (
    <>
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a tag"
          // enter 누르면
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (e.key === "Enter") {
              onActionClick();
            }
          }}
        />

        <Select
          value={tagVariant}
          onValueChange={(value) => setTagVariant(value as TagVariant)}
          defaultValue="filled"
        >
          <SelectTrigger className="w-fit min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="filled">Filled</SelectItem>
            <SelectItem value="outlined">Outlined</SelectItem>
            <SelectItem value="ghost">Ghost</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={tagShape}
          onValueChange={(value) => setTagShape(value as TagShape)}
          defaultValue="round"
        >
          <SelectTrigger className="w-fit min-w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="round">Round</SelectItem>
            <SelectItem value="squared">Squared</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onActionClick}>
          <Plus size={12} className="mr-3" /> Add
        </Button>
        <Button
          variant="secondary"
          onClick={() => setIsAISheetOpen(true)}
          title="AI Tag Recommendation"
        >
          <Sparkles size={12} className="mr-3" /> AI
        </Button>
        <EmojiPicker onAction={onEmojiClick} />
      </div>

      <AITagRecommendSheet
        open={isAISheetOpen}
        onOpenChange={setIsAISheetOpen}
        onAddTag={onAction}
        currentTagVariant={tagVariant}
        currentTagShape={tagShape}
      />
    </>
  );
}
