import { useRef } from "react";

export const usePreview = () => {
  const previewRef = useRef<HTMLDivElement>(null);

  // TODO: 이미지 다운로드 로직 추가
  const onDownload = () => {};

  return { previewRef, onDownload };
};
