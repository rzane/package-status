import exec from "execa";
import { promises as fs } from "fs";
import { Adapter } from "./types";
import { isFound } from "./utils";

const findGemspec = async (cwd: string) => {
  const files = await fs.readdir(cwd);
  return files.find((file) => /\.gemspec$/.test(file));
};

const getProperty = async (cwd: string, gemspec: string, key: string) => {
  const code = `puts Gem::Specification.load("${gemspec}").${key}`;
  const { stdout } = await exec("ruby", ["-e", code], { cwd });
  const [value] = stdout.trim().split("\n").slice(-1);
  return value;
};

const isProject = (cwd: string) => {
  return findGemspec(cwd).then(Boolean);
};

const getProject = async (cwd: string) => {
  const gemspec = await findGemspec(cwd);

  if (!gemspec) {
    throw new Error("Gem specification not found.");
  }

  const [name, version] = await Promise.all([
    getProperty(cwd, gemspec, "name"),
    getProperty(cwd, gemspec, "version"),
  ]);

  return { name, version };
};

const isPublished = (name: string, version: string) => {
  return isFound(
    `https://rubygems.org/api/v2/rubygems/${name}/versions/${version}.json`
  );
};

export const gem: Adapter = {
  isProject,
  getProject,
  isPublished,
};
