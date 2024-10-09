import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "src/lib/utils";

export type Template = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  data: string;
};

interface GalleryItemProps {
  template: Template;
  onClick: (template: Template) => void;
}

function GalleryItem({ template, onClick }: GalleryItemProps) {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden"
      onClick={() => onClick(template)}
    >
      <div className="overflow-hidden rounded-md">
        <img src={template.thumbnail} alt={template.title} draggable={false} />
      </div>
      {/* hover 했을떄 나타나기 */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full bg-black/70 p-4 transition-all duration-300 ",
          "flex items-end justify-end",
          "hidden group-hover:flex"
        )}
      >
        <button className="flex cursor-pointer items-center gap-2 text-base text-white hover:underline">
          <ArrowRightIcon className="text-white" size={18} />
          Using
        </button>
      </div>
    </div>
    // <Card onClick={() => onClick(template)}>
    //   <CardHeader>
    //     {" "}
    //     <img src={template.thumbnail} alt={template.title} />
    //     {/* <CardTitle>{template.title}</CardTitle>
    //     <CardDescription>{template.description}</CardDescription> */}
    //   </CardHeader>
    //   {/* <CardContent>
    //     <img src={template.thumbnail} alt={template.title} />
    //   </CardContent> */}
    // </Card>
  );
}

export default GalleryItem;
