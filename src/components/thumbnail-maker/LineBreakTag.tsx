import { X } from "lucide-react";

interface Props {
  onRemove: () => void;
}

export function LineBreakTag({ onRemove }: Props) {
  return (
    <div
      className="group relative"
      style={{ flexBasis: "100%", height: 0 }}
      data-line-break
    >
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed border-white/30"
        data-no-export
      />
      <div
        className="absolute right-0 top-1/2 hidden h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 group-hover:flex"
        onClick={onRemove}
        data-no-export
      >
        <X size={14} color="#454545" />
      </div>
    </div>
  );
}
