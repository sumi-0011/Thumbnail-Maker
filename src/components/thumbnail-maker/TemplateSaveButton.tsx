import { ScrollText } from "lucide-react";
import { Button } from "../ui/button";
import { useStorageState } from "@toss/react";
import { THUMBNAIL_MAKER_STORAGE_KEY } from "./assets/constants";
import { Tag } from "./assets/palette.types";
import { useThumbnailTagList } from "./hooks/useThumbnailTagList";

const isDev = process.env.NODE_ENV === "development";

export function TemplateSaveButton() {
  const { tags } = useThumbnailTagList();

  const handleSaveTemplate = () => {
    const json = JSON.stringify(tags);
    console.log(json);
  };

  if (!isDev) return null;

  return (
    <div>
      <Button variant="secondary" onClick={handleSaveTemplate}>
        <ScrollText size={20} />
      </Button>
    </div>
  );
}
