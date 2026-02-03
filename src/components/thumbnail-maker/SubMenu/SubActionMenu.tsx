import { Menu } from "lucide-react";
import { Button } from "../../ui/button";
import { useTagAction } from "../Tag.context";
import { ImageIcon, LayoutTemplateIcon } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../../ui/menubar";
import { Link } from "react-router-dom";

import { useState } from "react";
import { SaveTemplateSheet } from "./SaveTemplateSheet";
import { DownloadTemplateToLocalConfirm } from "./DownloadTemplateToLocalConfirm";
import { ImportTemplateConfirm } from "./ImportTemplateConfirm";
import { toast } from "sonner";
import { useUserStats } from "src/hooks/useUserStats";

export function SubActionMenu({
  getImageFile,
  downloadImage,
}: {
  getImageFile: () => Promise<Blob | null>;
  downloadImage: () => void;
}) {
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
    toast.message("Downloaded Successfully", {
      duration: 5000,
      description:
        "Share your carefully crafted image with others through the gallery! 🎨",
      action: {
        label: "Upload",
        onClick: () => {
          setIsSaveTemplateSheetOpen(true);
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={onDownload}>
        <ImageIcon size={20} className="mr-2" /> Download Image
      </Button>
    </div>
  );
}
