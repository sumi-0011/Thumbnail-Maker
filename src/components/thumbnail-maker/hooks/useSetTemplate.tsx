import useStorageState from "use-storage-state";
import {
  THUMBNAIL_MAKER_STORAGE_KEY,
  THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY,
} from "../assets/constants";
import { Tag, PaletteVariant } from "../assets/palette.types";

export type TemplateDataType = {
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

  const onUseTemplate = (template: TemplateDataType | null) => {
    // blog_only 타입 등 data가 null인 경우 무시
    if (!template) return;

    const tags: Tag[] = JSON.parse(template.tags);
    // TODO: custom palette 추가
    const palette: PaletteVariant = template.palette.type as PaletteVariant;

    setTags(tags);
    setPalette(palette);
  };

  return { onUseTemplate };
}
