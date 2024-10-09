import { ScrollText } from "lucide-react";
import { Button } from "../ui/button";
import { useStorageState } from "@toss/react";
import { THUMBNAIL_MAKER_STORAGE_KEY } from "./assets/constants";
import { Tag } from "./assets/palette.types";
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
