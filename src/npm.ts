import got from "got";
import { promises as fs } from "fs";
import { join } from "path";
import { Adapter } from "./types";
import { is404, exists } from "./utils";

const isProject = async (cwd: string) => {
  return exists(join(cwd, "package.json"));
};

const getProject = async (cwd: string) => {
  const pkg = join(cwd, "package.json");
  const data = await fs.readFile(pkg, "utf-8");
  const { name, version } = JSON.parse(data);
  return { name, version };
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
  isProject,
  getProject,
  isPublished,
};
