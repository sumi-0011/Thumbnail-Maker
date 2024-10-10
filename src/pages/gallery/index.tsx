import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import GalleryItem, { Template } from "src/components/gallery/GalleryItem";

import templates from "src/assets/templates/template.json";
import useStorageState from "use-storage-state";
import {
  THUMBNAIL_MAKER_STORAGE_KEY,
  THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY,
} from "src/components/thumbnail-maker/assets/constants";
import {
  PaletteVariant,
  Tag,
} from "src/components/thumbnail-maker/assets/palette.types";

export default function GalleryPage() {
  const [, setTags] = useStorageState<Tag[]>(THUMBNAIL_MAKER_STORAGE_KEY, {
    defaultValue: [],
  });

  const [, setPalette] = useStorageState<PaletteVariant>(
    THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY,
    {
      defaultValue: "blue_gradient",
    }
  );

  const onItemClick = (template: Template) => {
    console.log("template: ", template);
    const tags: Tag[] = JSON.parse(template.content.tags);
    // TODO: custom palette 추가
    const palette: PaletteVariant = template.content.pallet
      .type as PaletteVariant;

    setTags(tags);
    setPalette(palette);
  };

  return (
    <>
      <Helmet>
        <title>Thumbnail Maker</title>
      </Helmet>
      <div className="mx-auto max-w-[1024px]">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {templates.map((template) => (
            <GalleryItem
              key={template.id}
              template={template}
              onClick={onItemClick}
            />
          ))}
        </div>
      </div>
    </>
  );
}
