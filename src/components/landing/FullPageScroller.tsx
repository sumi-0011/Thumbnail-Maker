import { PropsWithChildren, useRef, useCallback, useEffect, useState } from "react";

interface FullPageScrollerProps extends PropsWithChildren {
  className?: string;
}

export function FullPageScroller({ children, className = "" }: FullPageScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const isScrollingRef = useRef(false);

  const scrollToSection = useCallback((index: number) => {
    if (containerRef.current && !isScrollingRef.current) {
      const sections = containerRef.current.querySelectorAll("[data-section]");
      const maxIndex = sections.length - 1;
      const targetIndex = Math.max(0, Math.min(index, maxIndex));

      if (sections[targetIndex]) {
        isScrollingRef.current = true;
        setCurrentSection(targetIndex);
        sections[targetIndex].scrollIntoView({ behavior: "smooth" });

        // 스크롤 애니메이션 완료 후 플래그 해제
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrollingRef.current) return;

      const sections = container.querySelectorAll("[data-section]");
      const maxIndex = sections.length - 1;

      if (e.deltaY > 0) {
        // 아래로 스크롤
        scrollToSection(Math.min(currentSection + 1, maxIndex));
      } else {
        // 위로 스크롤
        scrollToSection(Math.max(currentSection - 1, 0));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [currentSection, scrollToSection]);

  return (
    <div
      ref={containerRef}
      className={`full-page-container ${className}`}
      data-scroller
    >
      {children}
    </div>
  );
}

export function useScrollToSection() {
  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return { scrollToSection };
}
