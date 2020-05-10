#!/usr/bin/env node

import parse from "minimist";
import { detect } from "../adapters/detect";
import { getDescription } from "./utils";

const validKeys = ["_", "h", "help", "v", "version", "print-version"];

const help = `Usage: is-unpublished [cwd] [options]

Has the current version of this package been published?

Options:
  --print-version        show the package version
  -v, --version          output the version number
  -h, --help             display help for command
`;

export const run = async (argv: string[]) => {
  const opts = parse(argv);
  const cwd = opts._[0] || ".";

  /**
   * Validate arguments
   */
  if (opts._.length > 1) {
    throw new Error("Too many arguments");
  }

  /**
   * Validate options
   */
  for (const key of Object.keys(opts)) {
    if (!validKeys.includes(key)) {
      throw new Error(`Invalid option: ${key}`);
    }
  }

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
    const pkg = require("../../package.json");
    return { status: 0, stdout: `${pkg.version}\n` };
  }

  /**
   * Determine which adapter to use.
   */
  const adapter = await detect(cwd);

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
      console.error(`ERROR: ${error.message}`);
      process.exit(1);
    });
}
