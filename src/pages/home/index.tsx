import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import ThumbnailMaker from "src/components/thumbnail-maker";

export default function Home() {
  const { t } = useTranslation("translation");
  return (
    <>
      <Helmet>
        <title>Thumbnail Maker</title>
      </Helmet>
      <ThumbnailMaker />
    </>
  );
}
