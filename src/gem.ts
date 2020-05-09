import exec from "execa";
import got from "got";
import { Adapter } from "./types";

const getVersion = async (cwd: string, name: string) => {
  const spec = `${name}.gemspec`;
  const code = `puts Gem::Specification.load("${spec}").version`;
  const { stdout } = await exec("ruby", ["-e", code], { cwd });
  return stdout.trim();
};

const isPublished = async (name: string, version: string) => {
  const { statusCode } = await got(
    `https://rubygems.org/api/v2/rubygems/${name}/versions/${version}.json`
  );

  return statusCode !== 404;
};

export const gem: Adapter = {
  getVersion,
  isPublished,
};
