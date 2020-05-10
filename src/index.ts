#!/usr/bin/env node

import parse from "minimist";
import { gem } from "./gem";
import { hex } from "./hex";
import { npm } from "./npm";

const help = `Usage: is-unpublished [cwd] [options]

Has the current version of this package been published?

Options:
  --print-version        show the package version
  -v, --version          output the version number
  -h, --help             display help for command
`;

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
  const opts = parse(argv);
  const cwd = opts._[0] || ".";

  /**
   * Show the help message.
   */
  if (opts.h || opts.help) {
    return { status: 0, stdout: help };
  }

  /**
   * Print current version of this program.
   */
  if (opts.v || opts.version) {
    const pkg = require("../package.json");
    return { status: 0, stdout: `${pkg.version}\n` };
  }

  /**
   * Determine which adapter to use.
   */
  const adapter = await detectAdapter(cwd);
  if (!adapter) {
    return { status: 1, stdout: "Failed to determine package type.\n" };
  }

  /**
   * Get information about the project
   */
  const { name, version } = await adapter.getProject(cwd);

  /**
   * Respect the `--print-version` flag
   */
  if (opts["print-version"]) {
    return { status: 0, stdout: `${version}\n` };
  }

  /**
   * Determine if the package has been published.
   * If the package has already been published, exit 1.
   */
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
