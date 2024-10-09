import React from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export default function GalleryPage() {
  const { t } = useTranslation("translation");
  return (
    <>
      <Helmet>
        <title>Thumbnail Maker</title>
      </Helmet>
      <div>GalleryPage</div>
    </>
  );
}
