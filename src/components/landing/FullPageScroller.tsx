import { PropsWithChildren, useRef, useCallback } from "react";

interface FullPageScrollerProps extends PropsWithChildren {
  className?: string;
}

export function FullPageScroller({ children, className = "" }: FullPageScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((index: number) => {
    if (containerRef.current) {
      const sections = containerRef.current.querySelectorAll("[data-section]");
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

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
