import { CircleEllipsis, Frown, InfoIcon, Menu, Terminal } from "lucide-react";
import { Button } from "../ui/button";
import { useTagAction, useTagList } from "./Tag.context";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import { Link } from "react-router-dom";

import { useState } from "react";
import { SaveTemplateSheet } from "./SubMenu/SaveTemplateSheet";
import { DownloadTemplateToLocalConfirm } from "./SubMenu/DownloadTemplateToLocalConfirm";
import { useImportTemplate } from "./hooks/useImportTemplate";
import { ImportTemplateConfirm } from "./SubMenu/ImportTemplateConfirm";

export function SubActionMenu({
  getImageFile,
}: {
  getImageFile: () => Promise<Blob | null>;
}) {
  const [isSaveTemplateSheetOpen, setIsSaveTemplateSheetOpen] = useState(false);
  const [isDownloadTemplateSheetOpen, setIsDownloadTemplateSheetOpen] =
    useState(false);
  const [isImportTemplateSheetOpen, setIsImportTemplateSheetOpen] =
    useState(false);
  const { tags } = useTagList();
  const { onResetTags } = useTagAction();

  return (
    <div>
      <Menubar className="bg-transparent">
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Button variant="secondary">
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
    </div>
  );
}
