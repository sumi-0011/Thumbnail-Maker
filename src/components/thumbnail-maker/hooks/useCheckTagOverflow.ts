import { useRef } from "react";
import { toast } from "sonner";

type OverflowMessage = "vertical-overflow" | "horizontal-overflow";

export const useCheckTagOverflow = () => {
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  const showOverflowToast = (overflow: OverflowMessage) => {
    if (overflow === "vertical-overflow") {
      toast.error("공간이 부족해 태그를 더 이상 추가할 수 없습니다.", {
        position: "top-right",
      });
    } else if (overflow === "horizontal-overflow") {
      toast.error("너무 긴 태그는 추가할 수 없습니다.", {
        position: "top-right",
      });
    }
  };

  const checkOverflow = (): false | OverflowMessage => {
    if (tagsContainerRef.current) {
      const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } =
        tagsContainerRef.current;
      const hasHorizontalOverflow = scrollWidth > offsetWidth;
      const hasVerticalOverflow = scrollHeight > offsetHeight;

      if (hasVerticalOverflow) return "vertical-overflow";
      if (hasHorizontalOverflow) return "horizontal-overflow";
    }
    return false;
  };

  return { tagsContainerRef, checkOverflow, showOverflowToast };
};
