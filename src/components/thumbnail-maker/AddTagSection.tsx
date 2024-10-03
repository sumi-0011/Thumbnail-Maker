import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Plus, SmilePlusIcon } from "lucide-react";
import { useState } from "react";

export type TagVariant = "filled" | "outlined" | "ghost";
export type TagShape = "round" | "squared";

export function AddTagSection({
  onAction,
}: {
  onAction: (
    tag: {
      text: string;
      tagVariant: TagVariant;
      tagShape: TagShape;
    }
    // inputValue: string,
    // tagVariant: TagVariant,
    // tagShape: TagShape
  ) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [tagVariant, setTagVariant] = useState<TagVariant>("filled");
  const [tagShape, setTagShape] = useState<TagShape>("round");

  const onActionClick = async () => {
    if (inputValue.trim() === "") return;

    onAction({
      text: inputValue,
      tagVariant: tagVariant,
      tagShape: tagShape,
    });
    setInputValue("");
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a tag"
        // enter 누르면
        onKeyDown={(e) => {
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
        <SelectTrigger className="w-[130px] ">
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
        <SelectTrigger className="w-[130px] ">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="round">Round</SelectItem>
          <SelectItem value="squared">Squared</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={onActionClick} variant="secondary" size="lg">
        <Plus size={20} style={{ marginRight: "8px" }} /> Add Tag
      </Button>
      <Button onClick={onActionClick} variant="secondary">
        <SmilePlusIcon size={20} />
      </Button>
    </div>
  );
}
