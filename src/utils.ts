import got, { RequestError } from "got";

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
