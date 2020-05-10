import exec from "execa";
import { join } from "path";
import { Adapter } from "../types";
import { isFound, exists } from "./utils";

const getProperty = async (cwd: string, key: string) => {
  const args = ["run", "-e", `IO.puts(Mix.Project.config()[:${key}])`];
  const { stdout } = await exec("mix", args, { cwd });
  const [value] = stdout.trim().split("\n").slice(-1);
  return value;
};

const isProject = (cwd: string) => {
  return exists(join(cwd, "mix.exs"));
};

const getProject = async (cwd: string) => {
  const [name, version] = await Promise.all([
    getProperty(cwd, "app"),
    getProperty(cwd, "version"),
  ]);

  return { name, version };
};

const isPublished = (name: string, version: string) => {
  return isFound(`https://hex.pm/api/packages/${name}/releases/${version}`);
};

export const hex: Adapter = {
  isProject,
  getProject,
  isPublished,
};
