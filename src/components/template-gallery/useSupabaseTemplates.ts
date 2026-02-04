import { useState, useEffect, useMemo } from "react";
import { supabase } from "src/lib/supabaseClient";
import { Template as GalleryTemplate } from "src/components/gallery/GalleryItem";
import templatesData from "src/data/templates.json";

// templates.json에 정의된 템플릿 ID 목록
const ALLOWED_TEMPLATE_IDS = new Set(
  templatesData.templates.map((t) => Number(t.id))
);

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

        // templates.json에 정의된 ID와 매칭되는 템플릿만 필터링
        const filteredTemplates = (data as GalleryTemplate[])?.filter(
          (template) => ALLOWED_TEMPLATE_IDS.has(template.id)
        ) || [];

        setTemplates(filteredTemplates);
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
