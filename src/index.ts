import { info, getInput, setOutput, setFailed } from "@actions/core";
import { gem } from "./gem";
import { hex } from "./hex";
import { npm } from "./npm";
import { Adapter } from "./types";

const adapters: Record<string, Adapter> = { gem, hex, npm };

const run = async () => {
  const name = getInput("name", { required: true });
  const type = getInput("type", { required: true });
  const cwd = getInput("cwd");

  const adapter = adapters[type];
  if (!adapter) {
    throw new Error(`Unsupported project type: ${type}.`);
  }

  const version = await adapter.getVersion(cwd, name);
  const published = await adapter.isPublished(name, version);

  const state = published ? "already" : "not";
  info(`${name} version ${version} has ${state} been published.`);

  setOutput("version", version);
  setOutput("published", published);

  return { version, published };
};

run().catch((error) => setFailed(error));
