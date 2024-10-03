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

export function AddTagSection({
  onAction,
}: {
  onAction: (inputValue: string, tagStyle: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [tagVariant, setTagVariant] = useState("filled");
  const [tagShape, setTagShape] = useState("round");
  const onActionClick = async () => {
    onAction(inputValue, tagVariant);
    setInputValue("");
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a tag"
      />

      <Select
        value={tagVariant}
        onValueChange={setTagVariant}
        defaultValue="filled"
      >
        <SelectTrigger className="w-[130px] ">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="filled">Filled</SelectItem>
          <SelectItem value="outlined">Outlined</SelectItem>
        </SelectContent>
      </Select>
      <Select value={tagShape} onValueChange={setTagShape} defaultValue="round">
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
