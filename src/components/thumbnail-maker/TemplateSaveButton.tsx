import { ScrollText } from "lucide-react";
import { Button } from "../ui/button";
import { useThumbnailTagList } from "./hooks/useThumbnailTagList";

export function TemplateSaveButton() {
  const { tags } = useThumbnailTagList();

  return (
    <div>
      <Button variant="secondary">
        <ScrollText size={20} />
      </Button>
    </div>
  );
}
