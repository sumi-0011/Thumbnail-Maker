import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

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
    <Card onClick={() => onClick(template)}>
      <CardHeader>
        {" "}
        <img src={template.thumbnail} alt={template.title} />
        {/* <CardTitle>{template.title}</CardTitle>
        <CardDescription>{template.description}</CardDescription> */}
      </CardHeader>
      {/* <CardContent>
        <img src={template.thumbnail} alt={template.title} />
      </CardContent> */}
    </Card>
  );
}

export default GalleryItem;
