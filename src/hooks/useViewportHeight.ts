import { useState, useEffect } from "react";

const VIEWPORT_THRESHOLD = 840;

/**
 * 뷰포트 높이를 감지하고 1000px 기준으로 작은 화면 여부를 판단하는 훅
 * @returns { height: number, isSmallViewport: boolean }
 */
export function useViewportHeight() {
  const [height, setHeight] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerHeight;
    }
    return VIEWPORT_THRESHOLD;
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      // 디바운싱으로 성능 최적화
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setHeight(window.innerHeight);
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    // 초기 높이 설정 (SSR 대응)
    if (typeof window !== "undefined") {
      setHeight(window.innerHeight);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isSmallViewport = height < VIEWPORT_THRESHOLD;

  return { height, isSmallViewport };
}
