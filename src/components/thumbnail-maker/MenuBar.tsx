import { MousePointer2, Move, RotateCcw, Shuffle } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useCanvasSize, useCanvasSizeAction } from "./CanvasSize.context";
import { CanvasSizePreset, canvasSizePresets } from "./assets/constants";

const canvasSizeLabels: Record<CanvasSizePreset, string> = {
  wide: "Wide (1080 x 565)",
  square: "Square (1:1)",
} as const;

export function MenuBar({
  isDragMode,
  setIsDragMode,
  downloadImage,
  getImageFile,
}: {
  isDragMode: boolean;
  setIsDragMode: (isDragMode: boolean) => void;
  downloadImage: () => void;
  getImageFile: () => Promise<Blob | null>;
}) {
  return (
    <Menubar>
      <TemplateMenu downloadImage={downloadImage} getImageFile={getImageFile} />
      <CanvasMenu isDragMode={isDragMode} setIsDragMode={setIsDragMode} />
      <CanvasSizeMenu />
    </Menubar>
  );
}

function TemplateMenu({
  downloadImage,
  getImageFile,
}: {
  downloadImage: () => void;
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

function CanvasMenu({
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
    <MenubarMenu>
      <Tooltip defaultOpen>
        <TooltipTrigger>
          <MenubarTrigger>Canvas</MenubarTrigger>
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px]">
          <p className="text-sm font-medium">Random Shuffle Open 🎉</p>
          <p className="text-xs text-muted-foreground">
            Randomly changes the style of the tag. It's useful if you want to
            make a thumbnail easily.
          </p>
        </TooltipContent>
      </Tooltip>
      <MenubarContent>
        <MenubarItem onClick={onResetTags}>
          <RotateCcw color="#fff" size={16} /> Reset Canvas
        </MenubarItem>
        <MenubarItem onClick={() => setIsDragMode(!isDragMode)}>
          {isDragMode ? <MousePointer2 size={16} /> : <Move size={16} />}
          {isDragMode ? "Change to Select Mode" : "Change to Drag Mode"}
          <MenubarShortcut>^D</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={onRandomShuffle}>
          <Shuffle color="#fff" size={16} /> Random Shuffle
          <MenubarShortcut>^R</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}

export function CanvasSizeMenu() {
  const { currentSize } = useCanvasSize();
  const { onSizeChange } = useCanvasSizeAction();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {canvasSizeLabels[currentSize]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(canvasSizePresets).map((size) => (
          <DropdownMenuItem
            key={size}
            onClick={() => onSizeChange(size as CanvasSizePreset)}
          >
            {canvasSizeLabels[size as CanvasSizePreset]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
