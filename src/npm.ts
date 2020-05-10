import got from "got";
import { promises as fs } from "fs";
import { join } from "path";
import { Adapter } from "./types";

const getVersion = async (cwd: string) => {
  const file = join(cwd, "package.json");
  const data = await fs.readFile(file, "utf-8");
  return JSON.parse(data).version;
};

const isPublished = async (name: string, version: string) => {
  const slug = encodeURIComponent(name);

  const { statusCode } = await got(
    `https://registry.npmjs.org/${slug}/${version}`
  );

  return statusCode !== 404;
};

export const npm: Adapter = {
  getVersion,
  isPublished,
};
