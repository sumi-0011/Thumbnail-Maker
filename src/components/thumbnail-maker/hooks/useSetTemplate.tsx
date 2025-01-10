import useStorageState from "use-storage-state";
import {
  THUMBNAIL_MAKER_STORAGE_KEY,
  THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY,
} from "../assets/constants";
import { Tag, PaletteVariant } from "../assets/palette.types";

type TemplateDataType = {
  palette: {
    type: PaletteVariant | string;
  };
  tags: string;
};

export function useSetTemplate() {
  const [, setTags] = useStorageState<Tag[]>(THUMBNAIL_MAKER_STORAGE_KEY, {
    defaultValue: [],
  });

  const [, setPalette] = useStorageState<PaletteVariant>(
    THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY
  );

  const onUseTemplate = (template: TemplateDataType) => {
    const tags: Tag[] = JSON.parse(template.tags);
    // TODO: custom palette 추가
    const palette: PaletteVariant = template.palette.type as PaletteVariant;

    setTags(tags);
    setPalette(palette);
  };

  return { onUseTemplate };
}
