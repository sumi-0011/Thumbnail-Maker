import { useTranslation } from "react-i18next";
import { TagAlignment, useTagStyle, useTagStyleAction } from "../Tag.context";
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

const alignmentOptions: {
  value: TagAlignment;
  icon: typeof AlignLeftIcon;
  labelKey: string;
}[] = [
  { value: "start", icon: AlignLeftIcon, labelKey: "toolbar.alignLeft" },
  { value: "center", icon: AlignCenterIcon, labelKey: "toolbar.alignCenter" },
  { value: "end", icon: AlignRightIcon, labelKey: "toolbar.alignRight" },
];

export const AlignmentMenu = () => {
  const { t } = useTranslation("translation");
  const { alignment } = useTagStyle();
  const { setAlignment } = useTagStyleAction();

  return (
    <div className="flex gap-0.5">
      {alignmentOptions.map(({ value, icon: Icon, labelKey }) => (
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
            <p className="text-xs">
              {t(
                labelKey as
                  | "toolbar.alignLeft"
                  | "toolbar.alignCenter"
                  | "toolbar.alignRight",
              )}
            </p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
