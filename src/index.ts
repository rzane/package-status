import { getInput, setOutput, info, setFailed } from "@actions/core";
import { Config, PackageType, Result } from "./types";
import { gem } from "./gem";
import { hex } from "./hex";
import { npm } from "./npm";

const adapters = { gem, hex, npm };

export const run = async ({ cwd, name, type }: Config): Promise<Result> => {
  const adapter = adapters[type];
  if (!adapter) {
    throw new Error(`Unsupported project type: ${type}.`);
  }

  const version = await adapter.getVersion(cwd, name);
  const published = await adapter.isPublished(name, version);

  return { version, published };
};

export const runAction = async () => {
  const cwd = getInput("cwd", { required: true });
  const name = getInput("name", { required: true });
  const type = getInput("type", { required: true }) as PackageType;

  try {
    const { version, published } = await run({ cwd, type, name });

    const state = published ? "already" : "not";
    info(`${name} version ${version} has ${state} been published.`);

    setOutput("version", version);
    setOutput("published", published);
  } catch (error) {
    setFailed(error);
  }
};
