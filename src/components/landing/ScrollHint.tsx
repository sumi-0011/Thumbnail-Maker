import { ChevronDown } from "lucide-react";
import { useViewportHeight } from "src/hooks/useViewportHeight";

interface ScrollHintProps {
  onClick?: () => void;
  text?: string;
}

export function ScrollHint({
  onClick,
  text = "Explore Templates",
}: ScrollHintProps) {
  const { isSmallViewport } = useViewportHeight();

  // 작은 화면에서는 ScrollHint를 숨김 (일반 스크롤 모드에서는 불필요)
  if (isSmallViewport) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Scroll to templates"
    >
      <span className="text-sm font-medium opacity-70 transition-opacity group-hover:opacity-100">
        {text}
      </span>
      <div className="animate-bounce">
        <ChevronDown className="h-6 w-6" />
      </div>
    </button>
  );
}
