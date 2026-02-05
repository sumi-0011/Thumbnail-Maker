import { ChevronDown } from "lucide-react";

interface ScrollHintProps {
  onClick?: () => void;
  text?: string;
}

export function ScrollHint({ onClick, text = "Explore Templates" }: ScrollHintProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
      aria-label="Scroll to templates"
    >
      <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
        {text}
      </span>
      <div className="animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>
    </button>
  );
}
