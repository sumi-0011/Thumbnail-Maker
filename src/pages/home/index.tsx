import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ThumbnailMaker from "src/components/thumbnail-maker";
import { PaletteProvider } from "src/components/thumbnail-maker/Palette.context";
import { TagProvider } from "src/components/thumbnail-maker/Tag.context";
import { Button } from "src/components/ui/button";

export default function Home() {
  const { t } = useTranslation("translation");
  const [isToastShown, setIsToastShown] = useState(false);

  useEffect(() => {
    // 약간의 지연을 주어 toast가 준비된 후 실행
    const timer = setTimeout(() => {
      if (!isToastShown) {
        toast("Love this project? ⭐️", {
          duration: Infinity,
          position: "bottom-left",
          description: (
            <>
              Show your support by giving us a star on GitHub!
              <br />
              Stars help others discover this project and keep you notified of
              updates and new features.
              <Button
                size="sm"
                variant="outline"
                className="block mt-2 ml-auto"
                asChild
              >
                <a
                  href="https://github.com/sumi-0011/Thumbnail-Maker"
                  target="_blank"
                >
                  Star on GitHub
                </a>
              </Button>
            </>
          ),
        });
        setIsToastShown(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isToastShown]);

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
