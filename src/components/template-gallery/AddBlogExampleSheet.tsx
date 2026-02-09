import { useState } from "react";
import { Loader2, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "src/components/ui/sheet";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
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
      <SheetContent side="right" className="w-[400px] sm:max-w-[400px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-purple-400" />
            사용 예시 추가
          </SheetTitle>
          <SheetDescription>
            블로그 URL을 입력하면 자동으로 정보를 가져와 추가합니다
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* URL 입력 */}
          <div className="space-y-2">
            <Label htmlFor="blog-url" className="text-white">
              블로그 URL
            </Label>
            <Input
              id="blog-url"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              className="bg-background/50"
            />
          </div>

          {/* 저자명 입력 (선택) */}
          <div className="space-y-2">
            <Label htmlFor="author-name" className="text-white">
              저자명 (선택)
            </Label>
            <Input
              id="author-name"
              type="text"
              placeholder="작성자 이름 (비워두면 자동 추출)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">
              비워두면 블로그에서 자동으로 추출합니다
            </p>
          </div>

          {/* 제출 버튼 */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !url.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
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

          {/* 안내 문구 */}
          <p className="text-center text-xs text-muted-foreground">
            URL을 입력하면 제목, 설명, 이미지를 자동으로 가져옵니다
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
