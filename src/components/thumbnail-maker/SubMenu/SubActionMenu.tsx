import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useUserStats } from "src/hooks/useUserStats";
import { useTagAction } from "../Tag.context";
import { Button } from "../../ui/button";

export function SubActionMenu({
  getImageFile,
  downloadImage,
}: {
  getImageFile: () => Promise<Blob | null>;
  downloadImage: () => void;
}) {
  const { t } = useTranslation("translation");
  const [isSaveTemplateSheetOpen, setIsSaveTemplateSheetOpen] = useState(false);
  const [isDownloadTemplateSheetOpen, setIsDownloadTemplateSheetOpen] =
    useState(false);
  const [isImportTemplateSheetOpen, setIsImportTemplateSheetOpen] =
    useState(false);
  const { onResetTags } = useTagAction();
  const { incrementDownload } = useUserStats();

  const onDownload = () => {
    incrementDownload();
    downloadImage();
    toast.message(t("subActionMenu.toast.title"), {
      duration: 5000,
      description: t("subActionMenu.toast.description"),
      action: {
        label: t("subActionMenu.toast.upload"),
        onClick: () => {
          setIsSaveTemplateSheetOpen(true);
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={onDownload}>
        <ImageIcon size={20} /> {t("subActionMenu.downloadImage")}
      </Button>
    </div>
  );
}
