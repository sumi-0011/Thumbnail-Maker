import {
  PropsWithChildren,
  Children,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  isValidElement,
  cloneElement,
  ReactElement,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import {
  FullPageProvider,
  useFullPageContext,
  useScrollToSectionStandalone,
} from "./FullPageContext";
import { useViewportHeight } from "src/hooks/useViewportHeight";

import "swiper/css";

interface FullPageScrollerProps extends PropsWithChildren {
  className?: string;
}

interface FullPageContentProps extends PropsWithChildren {
  className?: string;
}

function FullPageContent({ children, className = "" }: FullPageContentProps) {
  const { registerSection, setScrollHandler, setCurrentIndex } =
    useFullPageContext();
  const swiperRef = useRef<SwiperType | null>(null);
  const { isSmallViewport } = useViewportHeight();

  const childArray = Children.toArray(children);

  // Extract section IDs once to avoid infinite loop
  const sectionIds = useMemo(() => {
    return childArray.map((child, index) => {
      if (isValidElement(child)) {
        return { id: child.props?.id as string | undefined, index };
      }
      return { id: undefined, index };
    });
  }, [children]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    sectionIds.forEach(({ id, index }) => {
      if (id) {
        registerSection(id, index);
      }
    });
  }, [sectionIds, registerSection]);

  // 일반 스크롤 모드에서 섹션으로 스크롤하는 핸들러
  const scrollToSectionById = useCallback((id: string) => {
    const element = document.querySelector(`[data-section="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // 작은 화면에서는 일반 스크롤 핸들러 설정
  useEffect(() => {
    if (isSmallViewport) {
      setScrollHandler((index: number) => {
        const sectionId = sectionIds.find((s) => s.index === index)?.id;
        if (sectionId) {
          scrollToSectionById(sectionId);
        }
      });
    }
    // 큰 화면에서는 Swiper 초기화 시 handleSwiperInit에서 설정됨
  }, [isSmallViewport, setScrollHandler, sectionIds, scrollToSectionById]);

  const handleSwiperInit = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      setScrollHandler((index: number) => {
        swiper.slideTo(index);
      });
    },
    [setScrollHandler],
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      setCurrentIndex(swiper.activeIndex);
    },
    [setCurrentIndex],
  );

  // 스크롤 모드에 따라 body에 data 속성 설정
  useEffect(() => {
    if (isSmallViewport) {
      document.body.setAttribute("data-scroll-mode", "normal");
    } else {
      document.body.setAttribute("data-scroll-mode", "fullpage");
    }
    return () => {
      document.body.removeAttribute("data-scroll-mode");
    };
  }, [isSmallViewport]);

  // 작은 화면: 일반 스크롤 모드
  if (isSmallViewport) {
    return (
      <div
        className={`full-page-wrapper full-page-wrapper--normal-scroll ${className}`}
      >
        {childArray.map((child, index) => {
          if (isValidElement(child)) {
            return cloneElement(child as ReactElement<{ className?: string }>, {
              key: child.props?.id || index,
              className: `${child.props?.className || ""} slide-content`.trim(),
            });
          }
          return <div key={index}>{child}</div>;
        })}
      </div>
    );
  }

  // 큰 화면: Swiper 기반 fullpage 스크롤
  return (
    <div className={`full-page-wrapper ${className}`}>
      <Swiper
        direction="vertical"
        slidesPerView={1}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          thresholdDelta: 10,
        }}
        keyboard={{
          enabled: true,
        }}
        speed={800}
        modules={[Mousewheel, Keyboard]}
        onSwiper={handleSwiperInit}
        onSlideChange={handleSlideChange}
        className="h-full"
      >
        {childArray.map((child, index) => {
          if (isValidElement(child)) {
            return (
              <SwiperSlide key={child.props?.id || index}>
                {cloneElement(child as ReactElement<{ className?: string }>, {
                  className: `${
                    child.props?.className || ""
                  } slide-content`.trim(),
                })}
              </SwiperSlide>
            );
          }
          return <SwiperSlide key={index}>{child}</SwiperSlide>;
        })}
      </Swiper>
    </div>
  );
}

export function FullPageScroller({
  children,
  className = "",
}: FullPageScrollerProps) {
  return (
    <FullPageProvider>
      <FullPageContent className={className}>{children}</FullPageContent>
    </FullPageProvider>
  );
}

export function useScrollToSection() {
  return useScrollToSectionStandalone();
}
