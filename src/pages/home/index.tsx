import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import ThumbnailMaker from "src/components/thumbnail-maker";
import { PaletteProvider } from "src/components/thumbnail-maker/Palette.context";
import { TagProvider } from "src/components/thumbnail-maker/Tag.context";

export default function Home() {
  const { t } = useTranslation("translation");
  return (
    <>
      <Helmet>
        <title>Thumbnail Maker</title>
      </Helmet>
      <PaletteProvider>
        <TagProvider>
          <ThumbnailMaker />
        </TagProvider>
      </PaletteProvider>
    </>
  );
}
