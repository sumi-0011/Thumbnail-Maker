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
import { usePalette } from "./Palette.context";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from "../ui/sheet";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function SubActionMenu() {
  const [isSaveTemplateSheetOpen, setIsSaveTemplateSheetOpen] = useState(false);
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
              Save Template (preparing)
            </MenubarItem>
            <MenubarSeparator />
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <SaveTemplateSheet
        isOpen={isSaveTemplateSheetOpen}
        onClose={() => setIsSaveTemplateSheetOpen(false)}
      />
    </div>
  );
}

function SaveTemplateSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { onSaveTemplate } = useTemplateSave();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[520px] pt-[80px]">
        <SheetHeader>
          <SheetTitle>Save Template</SheetTitle>
          <SheetDescription>
            Make the thumbnail you made into a template and share it with
            others! 🚀
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid-cols-[80px 1fr] grid items-center gap-4">
            <Label htmlFor="blogUrl" className="text-left">
              Blog URL
            </Label>
            <Input id="blogUrl" className="col-span-3" placeholder="https://" />
          </div>
          <div className="grid-cols-[80px 1fr] grid items-center gap-4">
            <Label htmlFor="username" className="text-left ">
              Username
            </Label>
            <Input id="username" className="col-span-3" placeholder="@" />
          </div>
        </div>
        <div className="my-4">
          <Alert variant="outline">
            <InfoIcon className="mt-0 h-4 w-4" />
            <div>
              <AlertTitle>
                The added templates are available in the gallery.
              </AlertTitle>
              <AlertDescription>
                Only anonymous additions are available at this time.
              </AlertDescription>
            </div>
          </Alert>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={onSaveTemplate}>
              Save Template
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const useTemplateSave = () => {
  const { tags } = useTagList();
  const { currentPalette } = usePalette();
  const onSaveTemplate = () => {
    console.log(tags, currentPalette);

    // const { error } = await supabase
    // .from("product")
    // .insert({ ...formData, image });
  };

  return { onSaveTemplate };
};
