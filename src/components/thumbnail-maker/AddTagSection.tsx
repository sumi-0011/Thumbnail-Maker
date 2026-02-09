import { Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EmojiType } from "../3d-emoji-picker";
import { Tag, TagShape, TagVariant } from "./assets/palette.types";
import { EmojiPicker } from "./EmojiPicker";

type SeparatorMode = "single" | "comma" | "newline" | "space";

interface Props {
  onAction: (tag: Tag) => void;
  onBatchAction: (tags: Tag[]) => void;
}

const placeholders: Record<SeparatorMode, string> = {
  single: "Enter a tag",
  comma: "react, vue, angular",
  newline: "한 줄에 하나씩",
  space: "react vue angular",
};

const parseTagTexts = (input: string, mode: SeparatorMode): string[] => {
  if (mode === "single") {
    const trimmed = input.trim();
    return trimmed ? [trimmed] : [];
  }

  const separators: Record<Exclude<SeparatorMode, "single">, RegExp> = {
    comma: /,/,
    newline: /\n/,
    space: /\s+/,
  };

  return input
    .split(separators[mode])
    .map((text) => text.trim())
    .filter((text) => text !== "");
};

export function AddTagSection({ onAction, onBatchAction }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [tagVariant, setTagVariant] = useState<TagVariant>("filled");
  const [tagShape, setTagShape] = useState<TagShape>("round");
  const [separatorMode, setSeparatorMode] = useState<SeparatorMode>("single");

  const onActionClick = async () => {
    if (inputValue.trim() === "") return;

    const tagTexts = parseTagTexts(inputValue, separatorMode);
    if (tagTexts.length === 0) return;

    const baseTime = new Date().getTime();

    const newTags: Tag[] = tagTexts.map((text, index) => ({
      id: baseTime + index,
      content: {
        type: "text" as const,
        value: text,
      },
      tagVariant: tagVariant,
      tagShape: tagShape,
    }));

    if (newTags.length === 1) {
      onAction(newTags[0]);
    } else {
      onBatchAction(newTags);
    }

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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;

    if (separatorMode === "newline") {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        onActionClick();
      }
    } else {
      if (e.key === "Enter") {
        e.preventDefault();
        onActionClick();
      }
    }
  };

  const isMultiLine = separatorMode === "newline";
  const isMultiMode = separatorMode !== "single";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {isMultiLine ? (
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholders[separatorMode]}
            className="min-h-[80px] resize-none"
            onKeyDown={handleKeyDown}
          />
        ) : (
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholders[separatorMode]}
            onKeyDown={handleKeyDown}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative shrink-0">
              <Settings2 size={16} />
              {isMultiMode && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>입력 모드</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={separatorMode}
              onValueChange={(value) =>
                setSeparatorMode(value as SeparatorMode)
              }
            >
              <DropdownMenuRadioItem value="single">
                단일 태그
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="comma">
                쉼표로 구분 (,)
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="newline">
                줄바꿈으로 구분
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="space">
                공백으로 구분
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

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
          <Plus size={12} />
          Add
        </Button>
        <EmojiPicker onAction={onEmojiClick} />
      </div>

      {isMultiLine && (
        <span className="text-xs text-muted-foreground">⌘+Enter로 추가</span>
      )}
    </div>
  );
}
