import { useTranslation } from "react-i18next";
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
import { useImportTemplate } from "../hooks/useImportTemplate";

export function ImportTemplateConfirm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation("translation");
  const { handleImportTemplate } = useImportTemplate();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("importTemplate.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex items-center gap-1">
              {t("importTemplate.warning")}
            </div>
            {t("importTemplate.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("importTemplate.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleImportTemplate}>
            {t("importTemplate.import")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
