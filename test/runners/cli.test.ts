import nock from "nock";
import { run } from "../../src/runners/cli";

const host = "https://registry.npmjs.org";
const path = "/example";

const { version } = require("../../package.json");

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

    const { status, stdout } = await run(["test/fixtures/npm"]);
    expect(status).toEqual(0);
    expect(stdout).toEqual("example version 1.2.3 has not been published\n");
  });

  test("a published package", async () => {
    const body = JSON.stringify({ versions: { "1.2.3": {} } });
    nock(host).get(path).reply(200, body);

    const { status, stdout } = await run(["test/fixtures/npm"]);
    expect(status).toEqual(1);
    expect(stdout).toEqual(
      "example version 1.2.3 has already been published\n"
    );
  });

  test("wrong number of arguments", async () => {
    await expect(run(["test/fixtures/npm", "crap"])).rejects.toThrowError(
      "Too many arguments"
    );
  });

  test("invalid option", async () => {
    await expect(run(["test/fixtures/npm", "--crap"])).rejects.toThrowError(
      "Invalid option: crap"
    );
  });

  test("invalid package", async () => {
    await expect(run(["test/fixtures"])).rejects.toThrowError(
      "Failed to determine package type"
    );
  });
});
