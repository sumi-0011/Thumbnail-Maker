import { ChevronDown } from "lucide-react";

interface ScrollHintProps {
  onClick?: () => void;
  text?: string;
}

export function ScrollHint({
  onClick,
  text = "Explore Templates",
}: ScrollHintProps) {
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
