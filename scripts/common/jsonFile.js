import { promises as fs } from "fs";

export const test = () => {
  console.log("test");
};

export const loadJson = async (filePath, { throwError = false } = {}) => {
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

export const saveJson = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};
