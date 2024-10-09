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
      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <GalleryItem
            key={template.id}
            template={template}
            onClick={onItemClick}
          />
        ))}
      </div>
    </>
  );
}
