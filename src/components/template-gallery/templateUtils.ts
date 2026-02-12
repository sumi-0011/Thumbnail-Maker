import { Template } from "src/components/gallery/GalleryItem";

/**
 * 템플릿에서 표시할 이미지와 제목을 가져옵니다.
 * blog_image/blog_title이 있으면 우선 사용하고, 없으면 thumbnail/title을 사용합니다.
 */
export function getDisplayImageAndTitle(template: Template): {
  displayImage: string | undefined;
  displayTitle: string;
} {
  const displayImage = template.blog_image || template.thumbnail;
  const displayTitle = template.blog_title || template.title;
  return { displayImage, displayTitle };
}
