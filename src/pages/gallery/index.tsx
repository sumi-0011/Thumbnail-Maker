import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import GalleryItem, { Template } from "src/components/gallery/GalleryItem";

import templates from "src/assets/templates/template.json";

export default function GalleryPage() {
  const onItemClick = (template: Template) => {
    console.log("template: ", template);
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
