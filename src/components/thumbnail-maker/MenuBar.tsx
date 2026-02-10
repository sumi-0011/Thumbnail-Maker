import { MousePointer2, Move, RotateCcw, Shuffle } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
import { Separator } from "../ui/separator";
import { useTagAction } from "./Tag.context";
import { SaveTemplateSheet } from "./SubMenu/SaveTemplateSheet";
import { DownloadTemplateToLocalConfirm } from "./SubMenu/DownloadTemplateToLocalConfirm";
import { ImportTemplateConfirm } from "./SubMenu/ImportTemplateConfirm";
import { useCanvasSize, useCanvasSizeAction } from "./CanvasSize.context";
import { CanvasSizePreset } from "./assets/constants";
import { AlignmentMenu } from "./SubMenu/AlignmentMenu";

export function MenuBar({
  getImageFile,
}: {
  getImageFile: () => Promise<Blob | null>;
}) {
  return (
    <Menubar className="border-none bg-transparent p-0">
      <TemplateMenu getImageFile={getImageFile} />
    </Menubar>
  );
}

export function Toolbar({
  isDragMode,
  setIsDragMode,
}: {
  isDragMode: boolean;
  setIsDragMode: (isDragMode: boolean) => void;
}) {
  const { t } = useTranslation("translation");
  const { onRandomShuffle, onResetTags } = useTagAction();
  const handleChangeDragMode = () => setIsDragMode(!isDragMode);

  useHotkeys("ctrl+d", handleChangeDragMode);
  useHotkeys("ctrl+r", onRandomShuffle);

  return (
    <div className="flex items-center gap-1 rounded-md ">
      {/* Left group: Reset, Shuffle, Drag/Select */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onResetTags}>
            <RotateCcw size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{t("toolbar.resetCanvas")}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onRandomShuffle}>
            <Shuffle size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{t("toolbar.randomShuffle")}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            pressed={isDragMode}
            onPressedChange={handleChangeDragMode}
          >
            {isDragMode ? <Move size={16} /> : <MousePointer2 size={16} />}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {isDragMode ? t("toolbar.dragMode") : t("toolbar.selectMode")}
          </p>
        </TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Right group: Alignment, Canvas Size */}
      <AlignmentMenu />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <CanvasSizeSegment />
    </div>
  );
}

function CanvasSizeSegment() {
  const { t } = useTranslation("translation");
  const { currentSize } = useCanvasSize();
  const { onSizeChange } = useCanvasSizeAction();

  const sizes: { value: CanvasSizePreset; labelKey: string }[] = [
    { value: "wide", labelKey: "toolbar.wide" },
    { value: "square", labelKey: "toolbar.square" },
  ];

  return (
    <div className="flex gap-0.5 rounded-md border p-0.5">
      {sizes.map(({ value, labelKey }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          className={
            currentSize === value
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          }
          onClick={() => onSizeChange(value)}
        >
          {t(labelKey as "toolbar.wide" | "toolbar.square")}
        </Button>
      ))}
    </div>
  );
}

function TemplateMenu({
  getImageFile,
}: {
  getImageFile: () => Promise<Blob | null>;
}) {
  const { t } = useTranslation("translation");
  const [isSaveTemplateSheetOpen, setIsSaveTemplateSheetOpen] = useState(false);
  const [isDownloadTemplateSheetOpen, setIsDownloadTemplateSheetOpen] =
    useState(false);
  const [isImportTemplateSheetOpen, setIsImportTemplateSheetOpen] =
    useState(false);

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>{t("menuBar.template")}</MenubarTrigger>
        <MenubarContent>
          <Link to="/gallery">
            <MenubarItem>{t("menuBar.goToManyTemplates")}</MenubarItem>
          </Link>
          <MenubarSeparator />
          <MenubarItem onClick={() => setIsSaveTemplateSheetOpen(true)}>
            {t("menuBar.saveTemplate")}
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => setIsDownloadTemplateSheetOpen(true)}>
            {t("menuBar.downloadTemplateToLocal")}
          </MenubarItem>
          <MenubarItem onClick={() => setIsImportTemplateSheetOpen(true)}>
            {t("menuBar.importTemplate")}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
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
    </>
  );
}
