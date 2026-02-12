import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "src/components/ui/sheet";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import { fetchBlogMetadata } from "src/lib/fetchBlogMetadata";
import { supabase } from "src/lib/supabaseClient";

interface AddBlogExampleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddBlogExampleSheet({
  open,
  onOpenChange,
  onSuccess,
}: AddBlogExampleSheetProps) {
  const { t } = useTranslation("translation");
  const [url, setUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error(t("addBlog.toast.urlRequired"));
      return;
    }

    // URL 유효성 검사
    try {
      const parsedUrl = new URL(url.trim());
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        toast.error(t("addBlog.toast.invalidUrl"));
        return;
      }
    } catch {
      toast.error(t("addBlog.toast.invalidUrl"));
      return;
    }

    setIsSubmitting(true);

    try {
      // 인증된 사용자 ID 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Authentication required. Please sign in.");
        setIsSubmitting(false);
        return;
      }

      // 1. 메타데이터 가져오기
      toast.loading(t("addBlog.toast.fetchingMetadata"), {
        id: "fetch-metadata",
      });
      const metadata = await fetchBlogMetadata(url.trim());
      toast.dismiss("fetch-metadata");

      // 2. Supabase에 저장
      toast.loading(t("addBlog.toast.saving"), { id: "save-template" });
      const { error } = await supabase.from("template").insert({
        title: metadata.title,
        description: metadata.description,
        thumbnail: metadata.image || "",
        template_type: "blog_only",
        blog_url: metadata.url,
        blog_title: metadata.title,
        blog_description: metadata.description,
        blog_image: metadata.image,
        author_name: authorName || metadata.author || null,
        data: null,
        userId: user.id,
        createdAt: new Date().toISOString(),
      });
      toast.dismiss("save-template");

      if (error) throw error;

      toast.success(t("addBlog.toast.success"));
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.dismiss("fetch-metadata");
      toast.dismiss("save-template");
      console.error("Error:", err);
      toast.error(t("addBlog.toast.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setUrl("");
    setAuthorName("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent inner="center">
        <SheetHeader>
          <SheetTitle>{t("addBlog.title")}</SheetTitle>
          <SheetDescription>{t("addBlog.description")}</SheetDescription>
        </SheetHeader>
        <div className="flex min-w-fit flex-col overflow-y-auto pt-[14px]">
          {/* URL 입력 */}
          <div className="mb-8">
            <p className="mb-3 text-[13px] text-[#9292A1]">
              {t("addBlog.urlLabel")}
            </p>
            <Input
              id="blog-url"
              type="url"
              placeholder={t("addBlog.urlPlaceholder")}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
            />
          </div>

          {/* 저자명 입력 (선택) */}
          <div className="mb-8">
            <p className="mb-3 text-[13px] text-[#9292A1]">
              {t("addBlog.authorLabel")}
            </p>
            <Input
              id="author-name"
              type="text"
              placeholder={t("addBlog.authorPlaceholder")}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
            />
            <p className="mt-2 text-xs text-[#9292A1]">
              {t("addBlog.authorHint")}
            </p>
          </div>
        </div>
        <SheetFooter className="mt-[96px] flex justify-center gap-2 sm:justify-center">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !url.trim()}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("addBlog.button.submitting")}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t("addBlog.button.submit")}
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
