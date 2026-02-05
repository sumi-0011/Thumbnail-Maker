import {
  MousePointer2,
  Move,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";
import { useTagAction } from "./Tag.context";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useHotkeys } from "react-hotkeys-hook";
import { useState } from "react";
import { SaveTemplateSheet } from "./SubMenu/SaveTemplateSheet";
import { DownloadTemplateToLocalConfirm } from "./SubMenu/DownloadTemplateToLocalConfirm";
import { ImportTemplateConfirm } from "./SubMenu/ImportTemplateConfirm";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useCanvasSize, useCanvasSizeAction } from "./CanvasSize.context";
import { CanvasSizePreset } from "./assets/constants";
import { AlignmentMenu } from "./SubMenu/AlignmentMenu";
import { Toggle } from "../ui/toggle";
import { Separator } from "../ui/separator";

export function MenuBar({
  getImageFile,
}: {
  getImageFile: () => Promise<Blob | null>;
}) {
  return (
    <Menubar className="border-none p-0 bg-transparent">
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
          <p className="text-xs">Reset Canvas</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onRandomShuffle}>
            <Shuffle size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Random Shuffle (Ctrl+R)</p>
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
            {isDragMode ? "Drag Mode" : "Select Mode"} (Ctrl+D)
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
  const { currentSize } = useCanvasSize();
  const { onSizeChange } = useCanvasSizeAction();

  const sizes: { value: CanvasSizePreset; label: string }[] = [
    { value: "wide", label: "Wide" },
    { value: "square", label: "Square" },
  ];

  return (
    <div className="flex gap-0.5 rounded-md border p-0.5">
      {sizes.map(({ value, label }) => (
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
          {label}
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
  const [isSaveTemplateSheetOpen, setIsSaveTemplateSheetOpen] = useState(false);
  const [isDownloadTemplateSheetOpen, setIsDownloadTemplateSheetOpen] =
    useState(false);
  const [isImportTemplateSheetOpen, setIsImportTemplateSheetOpen] =
    useState(false);

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>Template</MenubarTrigger>
        <MenubarContent>
          <Link to="/gallery">
            <MenubarItem>Go to Many Templates</MenubarItem>
          </Link>
          <MenubarSeparator />
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
