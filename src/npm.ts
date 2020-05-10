import { promises as fs } from "fs";
import { join } from "path";
import { Adapter } from "./types";
import { isFound } from "./isFound";

const getVersion = async (cwd: string) => {
  const file = join(cwd, "package.json");
  const data = await fs.readFile(file, "utf-8");
  return JSON.parse(data).version;
};

const isPublished = (name: string, version: string) => {
  const slug = encodeURIComponent(name);
  return isFound(`https://registry.npmjs.org/${slug}/${version}`);
};

export const npm: Adapter = {
  getVersion,
  isPublished,
};
