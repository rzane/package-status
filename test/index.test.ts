import nock from "nock";
import { join } from "path";
import { run } from "../src";

const { version } = require("../package.json");

const host = "https://registry.npmjs.org";
const path = "/example";
const fixtures = join(__dirname, "fixtures");
const fixture = join(fixtures, "npm");

describe("run", () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  test("-h", async () => {
    const { status, stdout } = await run(["-h"]);
    expect(status).toEqual(0);
    expect(stdout).toContain("is-unpublished");
  });

  test("--help", async () => {
    const { status, stdout } = await run(["--help"]);
    expect(status).toEqual(0);
    expect(stdout).toContain("is-unpublished");
  });

  test("-v", async () => {
    const { status, stdout } = await run(["-v"]);
    expect(status).toEqual(0);
    expect(stdout).toEqual(`${version}\n`);
  });

  test("--version", async () => {
    const { status, stdout } = await run(["--version"]);
    expect(status).toEqual(0);
    expect(stdout).toEqual(`${version}\n`);
  });

  test("an unpublished package", async () => {
    nock(host).get(path).reply(404);

    const { status, stdout } = await run([fixture]);
    expect(status).toEqual(0);
    expect(stdout).toEqual("example version 1.2.3 has not been published\n");
  });

  test("a published package", async () => {
    const body = JSON.stringify({ versions: { "1.2.3": {} } });
    nock(host).get(path).reply(200, body);

    const { status, stdout } = await run([fixture]);
    expect(status).toEqual(1);
    expect(stdout).toEqual(
      "example version 1.2.3 has already been published\n"
    );
  });

  test("wrong number of arguments", async () => {
    const { status, stderr } = await run([fixture, "a"]);
    expect(status).toEqual(1);
    expect(stderr).toEqual("ERROR: Too many arguments\n");
  });

  test("invalid option", async () => {
    const { status, stderr } = await run([fixture, "--crap"]);
    expect(status).toEqual(1);
    expect(stderr).toEqual("ERROR: Invalid option: crap\n");
  });

  test("invalid package", async () => {
    const { status, stderr } = await run([fixtures]);
    expect(status).toEqual(1);
    expect(stderr).toEqual("ERROR: Failed to determine package type\n");
  });
});
