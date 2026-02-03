import { Template } from "./useTemplates";
import { PALETTE } from "src/components/thumbnail-maker/assets/palette.constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "src/components/ui/alert-dialog";

interface TemplatePreviewModalProps {
  template: Template | null;
  onClose: () => void;
  onApply: (template: Template) => void;
}

export function TemplatePreviewModal({
  template,
  onClose,
  onApply,
}: TemplatePreviewModalProps) {
  if (!template) return null;

  const paletteStyle = PALETTE[template.palette];

  const getTagStyle = (tag: typeof template.tags[0]) => {
    const key = `${tag.tagVariant}-${tag.tagShape}` as const;
    const baseStyle = paletteStyle.tagStyle[key] || {};

    return {
      ...baseStyle,
      fontSize: "14px",
      padding: "6px 16px",
      borderRadius: tag.tagShape === "round" ? "9999px" : "8px",
    };
  };

  return (
    <AlertDialog open={!!template} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{template.name}</AlertDialogTitle>
          <AlertDialogDescription>{template.description}</AlertDialogDescription>
        </AlertDialogHeader>

        {/* Preview */}
        <div
          className="w-full aspect-video rounded-lg flex items-center justify-center gap-2 flex-wrap p-4"
          style={{
            background: paletteStyle.background,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {template.tags.map((tag) => (
            <span key={tag.id} style={getTagStyle(tag)} className="whitespace-nowrap">
              {tag.content.type === "text" ? tag.content.value : ""}
            </span>
          ))}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            This will replace your current tags with the template tags. Your
            current work will be lost.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onApply(template)}>
            Apply Template
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
