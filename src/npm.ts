import got from "got";
import { promises as fs } from "fs";
import { join } from "path";
import { Adapter } from "./types";
import { is404 } from "./utils";

const getVersion = async (cwd: string) => {
  const file = join(cwd, "package.json");
  const data = await fs.readFile(file, "utf-8");
  return JSON.parse(data).version;
};

const isPublished = async (name: string, version: string) => {
  const slug = encodeURIComponent(name);
  const url = `https://registry.npmjs.org/${slug}`;

  try {
    const { body } = await got<any>(url, { responseType: "json" });
    return version in body.versions;
  } catch (error) {
    if (is404(error)) {
      return false;
    } else {
      throw error;
    }
  }
};

export const npm: Adapter = {
  getVersion,
  isPublished,
};
