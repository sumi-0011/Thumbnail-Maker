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

  const onDownload = () => {
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
      <Menubar className="bg-transparent">
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Button variant="outline">
              <Menu />
            </Button>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onResetTags}>Reset Canvas</MenubarItem>
            <MenubarSeparator />
            <Link to="/gallery">
              <MenubarItem>Go to Gallery</MenubarItem>
            </Link>
            <MenubarItem onClick={() => setIsSaveTemplateSheetOpen(true)}>
              Save Template
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => setIsDownloadTemplateSheetOpen(true)}>
              Download Template to Local
            </MenubarItem>
            <MenubarItem onClick={() => setIsImportTemplateSheetOpen(true)}>
              Import Template
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <SaveTemplateSheet
        getImageFile={getImageFile}
        isOpen={isSaveTemplateSheetOpen}
        onClose={() => setIsSaveTemplateSheetOpen(false)}
      />
      <DownloadTemplateToLocalConfirm
        isOpen={isDownloadTemplateSheetOpen}
        onClose={() => setIsDownloadTemplateSheetOpen(false)}
      />
      <ImportTemplateConfirm
        isOpen={isImportTemplateSheetOpen}
        onClose={() => setIsImportTemplateSheetOpen(false)}
      />
      <Link to="/gallery">
        <Button variant="secondary">
          <LayoutTemplateIcon size={20} />
        </Button>
      </Link>
      <Button onClick={onDownload}>
        <ImageIcon size={20} className="mr-2" /> Download Image
      </Button>
    </div>
  );
}
