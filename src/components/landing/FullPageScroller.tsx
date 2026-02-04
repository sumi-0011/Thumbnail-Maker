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
import { FullPageProvider, useFullPageContext, useScrollToSectionStandalone } from "./FullPageContext";

import "swiper/css";

interface FullPageScrollerProps extends PropsWithChildren {
  className?: string;
}

interface FullPageContentProps extends PropsWithChildren {
  className?: string;
}

function FullPageContent({ children, className = "" }: FullPageContentProps) {
  const { registerSection, setScrollHandler, setCurrentIndex } = useFullPageContext();
  const swiperRef = useRef<SwiperType | null>(null);

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

  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
    setScrollHandler((index: number) => {
      swiper.slideTo(index);
    });
  }, [setScrollHandler]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setCurrentIndex(swiper.activeIndex);
  }, [setCurrentIndex]);

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
                  className: `${child.props?.className || ""} slide-content`.trim(),
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

export function FullPageScroller({ children, className = "" }: FullPageScrollerProps) {
  return (
    <FullPageProvider>
      <FullPageContent className={className}>{children}</FullPageContent>
    </FullPageProvider>
  );
}

export function useScrollToSection() {
  return useScrollToSectionStandalone();
}
