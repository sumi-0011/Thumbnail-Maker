import { InfoIcon } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "src/components/ui/alert";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "src/components/ui/sheet";
import { Label } from "src/components/ui/label";
import { supabase } from "src/lib/supabaseClient";
import { usePalette } from "../Palette.context";
import { useTagList } from "../Tag.context";

export function SaveTemplateSheet({
  isOpen,
  onClose,
  getImageFile,
}: {
  isOpen: boolean;
  onClose: () => void;
  getImageFile: () => Promise<Blob | null>;
}) {
  const { t } = useTranslation("translation");
  const { tags } = useTagList();
  const { currentPalette } = usePalette();

  const initTitle = tags
    .map((tag) => (tag.content.type === "text" ? tag.content.value : ""))
    .join(" ")
    .replace(/[^\w\s가-힣]/g, "") // 특수 문자 제거
    .trim(); // 앞뒤 공백 제거

  const inputValues = useRef({
    title: initTitle,
    description: "",
    blogUrl: "",
    username: "",
  });

  const uploadThumbnail = async (
    thumbnail: Blob,
    id: string,
  ): Promise<string | null> => {
    try {
      // 임시 이미지 객체
      const { data, error } = await supabase.storage
        .from("templates")
        .upload(`user/${id}`, thumbnail, {
          contentType: "image/png",
          cacheControl: "3600",
          // upsert: false,
        });

      if (error) {
        throw new Error("Error uploading thumbnail:", error);
      }

      const { data: urlData } = supabase.storage
        .from("templates")
        .getPublicUrl(`user/${id}`);

      if (urlData && urlData.publicUrl) {
        return urlData.publicUrl;
      } else {
        throw new Error("Failed to get public URL");
      }
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      toast.error(t("saveTemplate.toast.error"));
      return null;
    }
  };

  const onSaveTemplate = async () => {
    try {
      const id = new Date().getTime().toString();
      const userId = "user";

      const thumbnail = await getImageFile();
      if (!thumbnail) return;
      const imageUrl = await uploadThumbnail(thumbnail, id);
      if (!imageUrl) return;
      // imageUrl을 사용하여 필요한 작업 수행

      const requestData = {
        id,
        userId,
        title: inputValues.current.title,
        description: inputValues.current.description,
        url: inputValues.current.blogUrl,
        username: inputValues.current.username,
        createdAt: new Date(),
        data: {
          tags: JSON.stringify(tags),
          palette: { type: currentPalette },
        },
        thumbnail: imageUrl,
      };

      const { data, error } = await supabase
        .from("template")
        .insert(requestData);

      toast.success(t("saveTemplate.toast.success"));
      onClose();
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      toast.error(t("saveTemplate.toast.error"));
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[520px] pt-[80px]">
        <SheetHeader>
          <SheetTitle>{t("saveTemplate.title")}</SheetTitle>
          <SheetDescription>{t("saveTemplate.description")}</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid-cols-[80px 1fr] grid items-center gap-4">
            <Label htmlFor="title" className="text-left">
              {t("saveTemplate.titleLabel")}
            </Label>
            <Input
              id="title"
              className="col-span-3"
              placeholder={t("saveTemplate.titlePlaceholder")}
              onChange={(e) => (inputValues.current.title = e.target.value)}
              defaultValue={initTitle}
            />
          </div>
          <div className="grid-cols-[80px 1fr] grid items-center gap-4">
            <Label htmlFor="description" className="text-left">
              {t("saveTemplate.descriptionLabel")}
            </Label>
            <Input
              id="description"
              className="col-span-3"
              placeholder={t("saveTemplate.descriptionPlaceholder")}
              onChange={(e) =>
                (inputValues.current.description = e.target.value)
              }
            />
          </div>
          <div className="grid-cols-[80px 1fr] grid items-center gap-4">
            <Label htmlFor="blogUrl" className="text-left">
              {t("saveTemplate.blogUrlLabel")}
            </Label>
            <Input
              id="blogUrl"
              className="col-span-3"
              placeholder={t("saveTemplate.blogUrlPlaceholder")}
              onChange={(e) => (inputValues.current.blogUrl = e.target.value)}
            />
          </div>
          <div className="grid-cols-[80px 1fr] grid items-center gap-4">
            <Label htmlFor="username" className="text-left ">
              {t("saveTemplate.usernameLabel")}
            </Label>
            <Input
              id="username"
              className="col-span-3"
              placeholder={t("saveTemplate.usernamePlaceholder")}
              onChange={(e) => (inputValues.current.username = e.target.value)}
            />
          </div>
        </div>
        <div className="my-4">
          <Alert variant="outline">
            <InfoIcon className="mt-0 h-4 w-4" />
            <div>
              <AlertTitle>{t("saveTemplate.alertTitle")}</AlertTitle>
              <AlertDescription>
                {t("saveTemplate.alertDescription")}
              </AlertDescription>
            </div>
          </Alert>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={onSaveTemplate}>
              {t("saveTemplate.button")}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
