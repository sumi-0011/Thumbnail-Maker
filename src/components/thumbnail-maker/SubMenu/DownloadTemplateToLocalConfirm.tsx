import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "src/components/ui/alert-dialog";
import { usePalette } from "../Palette.context";
import { useTagList } from "../Tag.context";

interface DownloadTemplateToLocalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadTemplateToLocalConfirm({
  isOpen,
  onClose,
}: DownloadTemplateToLocalConfirmProps) {
  const { t } = useTranslation("translation");
  const { tags } = useTagList();
  const { currentPalette } = usePalette();

  const initTitle = tags
    .map((tag) => (tag.content.type === "text" ? tag.content.value : ""))
    .join(" ")
    .replace(/[^\w\s가-힣]/g, "") // 특수 문자 제거
    .trim(); // 앞뒤 공백 제거

  const data = {
    tags: JSON.stringify(tags),
    palette: { type: currentPalette },
  };

  const onDownloadTemplate = () => {
    // JSON 데이터를 문자열로 변환
    const jsonString = JSON.stringify(data, null, 2);

    // Blob 객체 생성
    const blob = new Blob([jsonString], { type: "application/json" });

    // 다운로드 링크 생성
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // 링크 속성 설정
    link.href = url;
    link.download = `${initTitle || "template"}.json`; // 파일명이 비어있을 경우 'template' 사용

    // 링크 클릭 시뮬레이션
    document.body.appendChild(link);
    link.click();

    // 메모리 정리
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onClose(); // 다운로드 후 모달 닫기
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("downloadTemplate.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("downloadTemplate.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("downloadTemplate.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onDownloadTemplate}>
            {t("downloadTemplate.download")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
