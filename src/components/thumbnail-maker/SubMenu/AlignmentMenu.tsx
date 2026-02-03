import { TagAlignment, useTagStyle, useTagStyleAction } from "../Tag.context";
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

const alignmentOptions: {
  value: TagAlignment;
  icon: typeof AlignLeftIcon;
  label: string;
}[] = [
  { value: "start", icon: AlignLeftIcon, label: "Align Left" },
  { value: "center", icon: AlignCenterIcon, label: "Align Center" },
  { value: "end", icon: AlignRightIcon, label: "Align Right" },
];

export const AlignmentMenu = () => {
  const { alignment } = useTagStyle();
  const { setAlignment } = useTagStyleAction();

  return (
    <div className="flex gap-0.5">
      {alignmentOptions.map(({ value, icon: Icon, label }) => (
        <Tooltip key={value}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={alignment === value ? "bg-accent" : ""}
              onClick={() => setAlignment(value)}
            >
              <Icon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
