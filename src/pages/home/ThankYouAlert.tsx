import { Alert, AlertTitle, AlertDescription } from "src/components/ui/alert";

export function ThankYouAlert() {
  return (
    <Alert
      variant="outline"
      className="mb-4 mt-auto h-fit max-w-[260px] bg-[#31353F]"
    >
      <div className="flex flex-col gap-2 !pl-1">
        <AlertTitle>Thank you everyone for using Thumbnail Maker 😄</AlertTitle>
        <AlertDescription>
          - Please provide sources when using thumbnails on your blog
          <br />- Your valuable input helps us create a better service for
          everyone [
          <a href="https://github.com/sumi-0011/Thumbnail-Maker/issues/new">
            feedback form
          </a>
          ]
        </AlertDescription>
      </div>
    </Alert>
  );
}
