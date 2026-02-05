import { useState, useEffect } from "react";
import { supabase } from "src/lib/supabaseClient";
import { Template as GalleryTemplate } from "src/components/gallery/GalleryItem";
import templatesData from "src/data/templates.json";

// templates.json에 정의된 우선 표시 템플릿 ID 목록
const PRIORITY_TEMPLATE_IDS = new Set(templatesData.priorityTemplateIds);

export function useSupabaseTemplates() {
  const [templates, setTemplates] = useState<GalleryTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from("template")
          .select("*");

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        const allTemplates = (data as GalleryTemplate[]) || [];

        // templates.json에 있는 템플릿을 우선 정렬
        const sortedTemplates = allTemplates.sort((a, b) => {
          const aIsPriority = PRIORITY_TEMPLATE_IDS.has(a.id);
          const bIsPriority = PRIORITY_TEMPLATE_IDS.has(b.id);

          if (aIsPriority && !bIsPriority) return -1;
          if (!aIsPriority && bIsPriority) return 1;
          return 0;
        });

        setTemplates(sortedTemplates);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  return { templates, isLoading, error };
}
