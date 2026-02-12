import { useTranslation, Trans } from "react-i18next";
import { Alert, AlertTitle, AlertDescription } from "src/components/ui/alert";

export function ThankYouAlert() {
  const { t } = useTranslation("translation");

  return (
    <Alert
      variant="outline"
      className="mb-4 mt-auto h-fit max-w-[260px] bg-card"
    >
      <div className="flex flex-col gap-2 !pl-1">
        <AlertTitle>{t("thankYou.title")}</AlertTitle>
        <AlertDescription>
          <Trans
            i18nKey="thankYou.description"
            components={{
              a: (
                <a
                  href="https://github.com/sumi-0011/Thumbnail-Maker/issues/new"
                  className="underline"
                />
              ),
              br: <br />,
            }}
          />
        </AlertDescription>
      </div>
    </Alert>
  );
}
