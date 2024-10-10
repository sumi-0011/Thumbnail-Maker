import { ScrollText } from "lucide-react";
import { Button } from "../ui/button";
import { useTagList } from "./Tag.context";

export function TemplateSaveButton() {
  const { tags } = useTagList();

  return (
    <div>
      <Button variant="secondary">
        <ScrollText size={20} />
      </Button>
    </div>
  );
}
