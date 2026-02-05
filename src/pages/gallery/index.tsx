import { useEffect, useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Plus } from "lucide-react";
import GalleryItem, { Template } from "src/components/gallery/GalleryItem";
import { Tabs, TabsList, TabsTrigger } from "src/components/ui/tabs";

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
import { useSetTemplate } from "src/components/thumbnail-maker/hooks/useSetTemplate";
import { AddBlogExampleSheet } from "src/components/template-gallery/AddBlogExampleSheet";
import { Button } from "src/components/ui/button";
import { ScrollArea } from "src/components/ui/scroll-area";

type FilterType = "all" | "template" | "blog";

export default function GalleryPage() {
  const { templates, isLoading, refetch } = useTemplates();
  const navigate = useNavigate();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const { onUseTemplate } = useSetTemplate();

  const filteredTemplates = useMemo(() => {
    if (filter === "all") return templates;
    if (filter === "blog") {
      return templates.filter((t) => t.template_type === "blog_only");
    }
    // template: blog_only가 아닌 것들
    return templates.filter((t) => t.template_type !== "blog_only");
  }, [templates, filter]);

  const onItemClick = (template: Template) => {
    // blog_only 타입은 블로그 링크 열기
    if (template.template_type === "blog_only") {
      if (template.blog_url) {
        window.open(template.blog_url, "_blank", "noopener,noreferrer");
      }
      return;
    }

    onUseTemplate(template.data);
    navigate(`/?templateId=${template.id}`);
  };

  const handleAddSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <Helmet>
        <title>Thumbnail Maker</title>
      </Helmet>
      <div className="mx-auto h-screen w-full max-w-[1024px] px-6 py-[10vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gallery</h1>
            <p className="mt-2 text-base text-gray-300">
              Create thumbnails easily using templates made by others!
            </p>
          </div>
          <Button
            onClick={() => setIsAddSheetOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            사용 예시 추가
          </Button>
        </div>

        {/* Filter Tabs */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as FilterType)}
          className="mt-6"
        >
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="template">템플릿</TabsTrigger>
            <TabsTrigger value="blog">블로그</TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="flex-1 min-h-0">
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
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
            {filteredTemplates.map((template) => (
              <GalleryItem
                key={template.id}
                template={template}
                onClick={onItemClick}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Add Blog Example Sheet */}
      <AddBlogExampleSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSuccess={handleAddSuccess}
      />
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
    // blog_only 타입 등 data가 null인 경우 무시
    if (!template.data) return;

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

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("template").select("*");

      if (error) {
        console.error("Error fetching templates:", error);
        setTemplates([]);
        return;
      }

      setTemplates((data as Template[]) || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return { templates, isLoading, refetch: fetchTemplates };
};
