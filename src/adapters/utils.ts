import got, { RequestError } from "got";
import { promises as fs } from "fs";

export const exists = async (file: string): Promise<boolean> => {
  try {
    await fs.stat(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    } else {
      throw error;
    }
  }
};

export const is404 = (error: RequestError): boolean => {
  return error.response?.statusCode === 404;
};

export const isFound = async (url: string): Promise<boolean> => {
  try {
    await got(url);
    return true;
  } catch (error) {
    if (is404(error)) {
      return false;
    } else {
      throw error;
    }
  }
};
