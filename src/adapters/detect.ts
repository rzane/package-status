import { gem } from "./gem";
import { npm } from "./npm";
import { hex } from "./hex";
import { Adapter } from "../types";

const attempt = async (cwd: string): Promise<Adapter | undefined> => {
  for (const adapter of [gem, hex, npm]) {
    if (await adapter.isProject(cwd)) {
      return adapter;
    }
  }
};

export const detect = async (cwd: string): Promise<Adapter> => {
  const adapter = await attempt(cwd);

  if (!adapter) {
    throw new Error("Failed to determine package type.");
  }

  return adapter;
};
