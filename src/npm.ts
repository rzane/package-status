import got from "got";
import { join } from "path";
import { Adapter } from "./types";

const getVersion = async (cwd: string) => {
  const pkg = join(cwd, "package.json");
  const { version } = require(pkg);
  return version;
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
