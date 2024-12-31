import { useSetTemplate } from "./useSetTemplate";

export const useImportTemplate = () => {
  const { onUseTemplate } = useSetTemplate();

  const handleImportTemplate = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          // TODO: 파싱된 데이터 처리
          console.log(data);
          onUseTemplate(data);
        };
        reader.readAsText(file);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };
    fileInput.click();
  };

  return { handleImportTemplate };
};
