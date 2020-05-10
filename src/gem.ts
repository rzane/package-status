import exec from "execa";
import { Adapter } from "./types";
import { isFound } from "./isFound";

const getVersion = async (cwd: string, name: string) => {
  const spec = `${name}.gemspec`;
  const code = `puts Gem::Specification.load("${spec}").version`;
  const { stdout } = await exec("ruby", ["-e", code], { cwd });
  return stdout.trim();
};

const isPublished = (name: string, version: string) => {
  return isFound(
    `https://rubygems.org/api/v2/rubygems/${name}/versions/${version}.json`
  );
};

export const gem: Adapter = {
  getVersion,
  isPublished,
};
