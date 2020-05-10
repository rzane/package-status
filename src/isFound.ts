import got from "got";

export const isFound = async (url: string): Promise<boolean> => {
  try {
    await got(url);
    return true;
  } catch (error) {
    if (error?.response?.statusCode === 404) {
      return false;
    }

    throw error;
  }
};
