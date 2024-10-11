import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import GalleryItem, { Template } from "src/components/gallery/GalleryItem";

import useStorageState from "use-storage-state";
import {
  THUMBNAIL_MAKER_STORAGE_KEY,
  THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY,
} from "src/components/thumbnail-maker/assets/constants";
import {
  PaletteVariant,
  Tag,
} from "src/components/thumbnail-maker/assets/palette.types";
import { supabase } from "src/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function GalleryPage() {
  const templates = useTemplates();
  console.log("templates: ", templates);
  const navigate = useNavigate();

  const { onUseTemplate } = useUseTemplate();

  const onItemClick = (template: Template) => {
    onUseTemplate(template);

    navigate(`/?templateId=${template.id}`);
  };

  return (
    <>
      <Helmet>
        <title>Thumbnail Maker</title>
      </Helmet>
      <div className="mx-auto max-w-[1024px]">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <p className="mt-2 text-base text-gray-300">
          Create thumbnails easily using templates made by others! 🎨🚀
        </p>
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

const useUseTemplate = () => {
  const [, setTags] = useStorageState<Tag[]>(THUMBNAIL_MAKER_STORAGE_KEY, {
    defaultValue: [],
  });

  const [, setPalette] = useStorageState<PaletteVariant>(
    THUMBNAIL_MAKERS_PALETTE_STORAGE_KEY
  );

  const onUseTemplate = (template: Template) => {
    const tags: Tag[] = JSON.parse(template.data.tags);
    // TODO: custom palette 추가
    const palette: PaletteVariant = template.data.palette
      .type as PaletteVariant;

    setTags(tags);
    setPalette(palette);
  };

  return { onUseTemplate };
};

const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);

  async function getTemplates(): Promise<Template[]> {
    let { data: templates, error } = await supabase
      .from("template")
      .select("*");
    console.log("templates, error: ", templates, error);

    if (error) {
      console.error("Error fetching templates:", error);
      return [];
    }

    return (templates as Template[]) || [];
  }

  useEffect(() => {
    getTemplates().then(setTemplates);
  }, []);

  return templates;
};
