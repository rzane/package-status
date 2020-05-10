#!/usr/bin/env node

import { gem } from "./gem";
import { hex } from "./hex";
import { npm } from "./npm";

const help = `Usage: is-unpublished [cwd] [options]

Has the current version of this package been published?

Options:
  -v, --version          output the version number
  -h, --help             display help for command
`;

const hasFlag = (argv: string[], ...flags: string[]) => {
  return flags.some((flag) => argv.includes(flag));
};

const detectAdapter = async (cwd: string) => {
  for (const adapter of [gem, hex, npm]) {
    if (await adapter.isProject(cwd)) {
      return adapter;
    }
  }
};

const getDescription = (name: string, version: string, published: boolean) => {
  if (published) {
    return `${name} version ${version} has already been published\n`;
  } else {
    return `${name} version ${version} has not been published\n`;
  }
};

export const run = async (argv: string[]) => {
  /**
   * Show the help message.
   */
  if (hasFlag(argv, "-h", "--help")) {
    return { status: 0, stdout: help };
  }

  /**
   * Print current version of this program.
   */
  if (hasFlag(argv, "-v", "--version")) {
    const pkg = require("../package.json");
    return { status: 0, stdout: `${pkg.version}\n` };
  }

  /**
   * Determine which adapter to use.
   */
  const cwd = argv[0] || ".";
  const adapter = await detectAdapter(cwd);
  if (!adapter) {
    return { status: 1, stdout: "Failed to determine package type.\n" };
  }

  const { name, version } = await adapter.getProject(cwd);
  const published = await adapter.isPublished(name, version);

  return {
    status: published ? 1 : 0,
    stdout: getDescription(name, version, published),
  };
};

if (require.main === module) {
  run(process.argv.slice(2))
    .then(({ stdout, status }) => {
      process.stdout.write(stdout);
      process.exit(status);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
