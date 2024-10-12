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
import { Skeleton } from "src/components/ui/skeleton";

export default function GalleryPage() {
  const { templates, isLoading } = useTemplates();
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
      <div className="mx-auto h-screen w-full max-w-[1024px] py-[10vh]">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <p className="mt-2 text-base text-gray-300">
          Create thumbnails easily using templates made by others! 🎨🚀
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {isLoading && (
            <>
              <Skeleton style={{ aspectRatio: "330/172" }} />
              <Skeleton style={{ aspectRatio: "330/172" }} />
              <Skeleton style={{ aspectRatio: "330/172" }} />
              <Skeleton style={{ aspectRatio: "330/172" }} />
              <Skeleton style={{ aspectRatio: "330/172" }} />
              <Skeleton style={{ aspectRatio: "330/172" }} />
            </>
          )}
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
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    getTemplates()
      .then((templates) => {
        setTemplates(templates);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { templates, isLoading };
};
