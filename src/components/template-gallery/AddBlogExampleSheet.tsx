import { useState } from "react";
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
  const [url, setUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error("URL을 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 메타데이터 가져오기
      toast.loading("메타데이터를 가져오는 중...", { id: "fetch-metadata" });
      const metadata = await fetchBlogMetadata(url);
      toast.dismiss("fetch-metadata");

      // 2. Supabase에 저장
      toast.loading("저장 중...", { id: "save-template" });
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
        data: {},
        userId: "anonymous",
        createdAt: new Date().toISOString(),
      });
      toast.dismiss("save-template");

      if (error) throw error;

      toast.success("사용 예시가 추가되었습니다!");
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.dismiss("fetch-metadata");
      toast.dismiss("save-template");
      console.error("Error:", err);
      toast.error("추가에 실패했습니다. URL을 확인해주세요.");
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
          <SheetTitle>사용 예시 추가</SheetTitle>
          <SheetDescription>
            블로그 URL을 입력하면 자동으로 정보를 가져와 추가합니다
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-w-fit flex-col overflow-y-auto pt-[14px]">
          {/* URL 입력 */}
          <div className="mb-8">
            <p className="mb-3 text-[13px] text-[#9292A1]">블로그 URL</p>
            <Input
              id="blog-url"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
            />
          </div>

          {/* 저자명 입력 (선택) */}
          <div className="mb-8">
            <p className="mb-3 text-[13px] text-[#9292A1]">저자명 (선택)</p>
            <Input
              id="author-name"
              type="text"
              placeholder="작성자 이름 (비워두면 자동 추출)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
            />
            <p className="mt-2 text-xs text-[#9292A1]">
              비워두면 블로그에서 자동으로 추출합니다
            </p>
          </div>
        </div>
        <SheetFooter className="mt-[96px] flex justify-center gap-2 sm:justify-center">
          <Button onClick={handleSubmit} disabled={isSubmitting || !url.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                추가하기
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
