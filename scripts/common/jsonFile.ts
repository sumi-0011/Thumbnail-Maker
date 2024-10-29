import { promises as fs } from "fs";

export const test = (): void => {
  console.log("test");
};

export const loadJson = async (
  filePath: string,
  { throwError = false } = {}
): Promise<object> => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading JSON from ${filePath}: ${error}`);
    if (throwError) {
      throw error;
    }
    return {};
  }
};

export const saveJson = async (filePath: string, data: any): Promise<void> => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};
