import { useMemo, useState } from "react";
import templatesData from "src/data/templates.json";
import { Tag, PaletteVariant } from "src/components/thumbnail-maker/assets/palette.types";

export interface Template {
  id: string;
  name: string;
  description: string;
  palette: PaletteVariant;
  tags: Tag[];
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export function useTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const templates: Template[] = useMemo(() => {
    return templatesData.templates.map((t) => ({
      ...t,
      palette: t.palette as PaletteVariant,
      tags: t.tags as Tag[],
    }));
  }, []);

  const categories: Category[] = useMemo(() => {
    return templatesData.categories;
  }, []);

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === "all") {
      return templates;
    }
    return templates.filter((t) => t.category === selectedCategory);
  }, [templates, selectedCategory]);

  return {
    templates: filteredTemplates,
    allTemplates: templates,
    categories,
    selectedCategory,
    setSelectedCategory,
  };
}
