import saveAs from "file-saver";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";

export const usePreview = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  console.log("imageUrl: ", imageUrl);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const div = previewRef.current;
      const canvas = await html2canvas(div, { scale: 2 });
      canvas.toBlob((blob) => {
        if (blob !== null) {
          saveAs(blob, "result.png");
        }
      });
    } catch (error) {
      console.error("Error converting div to image:", error);
    }
  };

  return { previewRef, onDownload: handleDownload };
};
