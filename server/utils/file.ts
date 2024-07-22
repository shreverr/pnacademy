import fs from "fs/promises";
import { AppError } from "../lib/appError";

export const deleteFileFromDisk = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    throw new AppError(`Error deleting file ${filePath}`, 500, error, true);
  }
}