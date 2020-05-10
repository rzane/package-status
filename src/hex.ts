import exec from "execa";
import { Adapter } from "./types";
import { isFound } from "./utils";

const getVersion = async (cwd: string) => {
  const args = ["run", "-e", "IO.puts(Mix.Project.config()[:version])"];
  const { stdout } = await exec("mix", args, { cwd });
  const [version] = stdout.trim().split("\n").slice(-1);
  return version;
};

const isPublished = (name: string, version: string) => {
  return isFound(`https://hex.pm/api/packages/${name}/releases/${version}`);
};

export const hex: Adapter = {
  getVersion,
  isPublished,
};
