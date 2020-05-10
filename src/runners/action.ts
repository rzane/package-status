import { getInput, setFailed, setOutput, info } from "@actions/core";
import { detect } from "../adapters/detect";
import { getDescription } from "./utils";

const run = async () => {
  const cwd = getInput("cwd") || ".";
  const adapter = await detect(cwd);

  const { name, version } = await adapter.getProject(cwd);
  const published = await adapter.isPublished(name, version);

  setOutput("name", name);
  setOutput("version", version);
  setOutput("is-unpublished", !published);
  info(getDescription(name, version, published));
};

run().catch((error) => setFailed(error));
