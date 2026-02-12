import {
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  PropsWithChildren,
} from "react";

interface SectionMapping {
  [sectionId: string]: number;
}

interface FullPageContextValue {
  registerSection: (id: string, index: number) => void;
  scrollToSection: (id: string) => void;
  setScrollHandler: (handler: (index: number) => void) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const FullPageContext = createContext<FullPageContextValue | null>(null);

// Global scroll handler for use outside of Provider
let globalScrollHandler: ((index: number) => void) | null = null;
const globalSectionMapping: SectionMapping = {};

export function FullPageProvider({ children }: PropsWithChildren) {
  const sectionMappingRef = useRef<SectionMapping>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollHandlerRef = useRef<((index: number) => void) | null>(null);

  const registerSection = useCallback((id: string, index: number) => {
    if (sectionMappingRef.current[id] !== index) {
      sectionMappingRef.current[id] = index;
      globalSectionMapping[id] = index;
    }
  }, []);

  const setScrollHandler = useCallback((handler: (index: number) => void) => {
    scrollHandlerRef.current = handler;
    globalScrollHandler = handler;
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const index = sectionMappingRef.current[id];
    if (index !== undefined && scrollHandlerRef.current) {
      scrollHandlerRef.current(index);
      return;
    }

    // Fallback: 일반 스크롤 모드에서 직접 DOM 요소로 스크롤
    const element = document.querySelector(`[data-section="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <FullPageContext.Provider
      value={{
        registerSection,
        scrollToSection,
        setScrollHandler,
        currentIndex,
        setCurrentIndex,
      }}
    >
      {children}
    </FullPageContext.Provider>
  );
}

export function useFullPageContext() {
  const context = useContext(FullPageContext);
  if (!context) {
    throw new Error("useFullPageContext must be used within FullPageProvider");
  }
  return context;
}

// Standalone hook that works both inside and outside Provider
export function useScrollToSectionStandalone() {
  const context = useContext(FullPageContext);

  const scrollToSection = useCallback(
    (id: string) => {
      if (context) {
        context.scrollToSection(id);
        return;
      }

      const index = globalSectionMapping[id];
      if (index !== undefined && globalScrollHandler) {
        globalScrollHandler(index);
        return;
      }

      // Fallback: 일반 스크롤 모드에서 직접 DOM 요소로 스크롤
      const element = document.querySelector(`[data-section="${id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [context],
  );

  return { scrollToSection };
}
