import { AlertCircle } from "lucide-react";
import { useImportTemplate } from "../hooks/useImportTemplate";
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

export function ImportTemplateConfirm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { handleImportTemplate } = useImportTemplate();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Import Template</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex items-center gap-1">Warning!</div>
            The current content on the canvas will be lost. Are you sure you
            want to import?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleImportTemplate}>
            Import
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
