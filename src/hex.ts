import exec from "execa";
import got from "got";
import { Adapter } from "./types";

const getVersion = async (cwd: string) => {
  const args = ["run", "-e", "IO.puts(Mix.Project.config()[:version])"];
  const { stdout } = await exec("mix", args, { cwd });
  const [version] = stdout.trim().split("\n").slice(-1);
  return version;
};

const isPublished = async (name: string, version: string) => {
  const { statusCode } = await got(
    `https://hex.pm/api/packages/${name}/releases/${version}`
  );

  return statusCode !== 404;
};

export const hex: Adapter = {
  getVersion,
  isPublished,
};
