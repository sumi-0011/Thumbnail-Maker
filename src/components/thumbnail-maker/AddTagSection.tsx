import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { CornerDownLeft, Plus } from "lucide-react";
import { useState } from "react";
import { Tag, TagShape, TagVariant } from "./assets/palette.types";
import { EmojiPicker } from "./EmojiPicker";
import { EmojiType } from "../3d-emoji-picker";
import useStorageState from "use-storage-state";

const LAST_TAG_STYLE_KEY = "@thumbnail-maker/last-tag-style";

interface Props {
  onAction: (tag: Tag) => void;
  onBatchAction?: (tags: Tag[]) => void;
}

export function AddTagSection({ onAction, onBatchAction }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [savedStyle, setSavedStyle] = useStorageState<{
    variant: TagVariant;
    shape: TagShape;
  }>(LAST_TAG_STYLE_KEY, {
    defaultValue: { variant: "filled", shape: "round" },
  });

  const tagVariant = savedStyle.variant;
  const tagShape = savedStyle.shape;

  const setTagVariant = (variant: TagVariant) => {
    setSavedStyle({ ...savedStyle, variant });
  };

  const setTagShape = (shape: TagShape) => {
    setSavedStyle({ ...savedStyle, shape });
  };

  const onActionClick = async () => {
    if (inputValue.trim() === "") return;

    const parts = inputValue
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    if (parts.length === 0) return;

    const tags: Tag[] = parts.map((text) => ({
      id: Date.now() + Math.random(),
      content: {
        type: "text" as const,
        value: text,
      },
      tagVariant,
      tagShape,
    }));

    if (tags.length === 1) {
      onAction(tags[0]);
    } else if (onBatchAction) {
      onBatchAction(tags);
    } else {
      // fallback: 하나씩 추가
      tags.forEach((tag) => onAction(tag));
    }

    setInputValue("");
  };

  const onEmojiClick = (emoji: EmojiType) => {
    const id = Date.now() + Math.random();
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
    <div className="flex gap-2">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter tags (comma separated)"
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
        variant="outline"
        onClick={() => {
          onAction({
            id: Date.now() + Math.random(),
            content: { type: "line-break" },
            tagVariant: "ghost",
            tagShape: "round",
          });
        }}
        title="Add line break"
      >
        <CornerDownLeft size={14} />
      </Button>
      <EmojiPicker onAction={onEmojiClick} />
    </div>
  );
}
