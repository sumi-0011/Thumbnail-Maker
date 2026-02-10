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

const VALID_PALETTE_VARIANTS: PaletteVariant[] = [
  "blue_gradient",
  "rose_gradient",
  "yellow_dark",
  "green_dark",
  "blue_dark",
  "purple_light",
  "blue_light",
  "green_light",
  "orange_light",
  "pink_light",
];

const DEFAULT_PALETTE: PaletteVariant = "blue_gradient";

function isPaletteVariant(value: unknown): value is PaletteVariant {
  return (
    typeof value === "string" &&
    VALID_PALETTE_VARIANTS.includes(value as PaletteVariant)
  );
}

export function useSetTemplate() {
  const [, setTags] = useStorageState<Tag[]>(THUMBNAIL_MAKER_STORAGE_KEY, {
    defaultValue: [],
  });

  const [, setPalette] = useStorageState<PaletteVariant>(
    THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY,
  );

  const onUseTemplate = (template: TemplateDataType | null) => {
    // blog_only 타입 등 data가 null인 경우 무시
    if (!template) return;

    // JSON.parse를 try-catch로 감싸기
    let tags: Tag[] = [];
    try {
      tags = JSON.parse(template.tags);
      if (!Array.isArray(tags)) {
        tags = [];
      }
    } catch {
      tags = [];
    }

    // palette 타입 가드 사용
    const palette: PaletteVariant = isPaletteVariant(template.palette.type)
      ? template.palette.type
      : DEFAULT_PALETTE;

    setTags(tags);
    setPalette(palette);
  };

  return { onUseTemplate };
}
