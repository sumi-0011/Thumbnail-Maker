import saveAs from "file-saver";
import html2canvas from "html2canvas";
import { useRef } from "react";

export const usePreview = () => {
  const previewRef = useRef<HTMLDivElement>(null);

  const getImageFile = async (): Promise<Blob | null> => {
    if (!previewRef.current) return null;

    try {
      const canvas = await html2canvas(previewRef.current, {
        allowTaint: true,
        useCORS: true,
      });

      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png");
      });
    } catch (error) {
      console.error("Error converting div to image:", error);
      return null;
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        allowTaint: true,
        useCORS: true,
      });

      canvas.toBlob((blob) => {
        if (blob !== null) {
          saveAs(blob, "result.png");
        }
      });
    } catch (error) {
      console.error("Error converting div to image:", error);
    }
  };

  return { previewRef, onDownload: handleDownload, getImageFile };
};
