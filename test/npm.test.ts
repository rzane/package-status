import nock from "nock";
import { join } from "path";
import { RequestError } from "got";
import { npm } from "../src/npm";

const host = "https://registry.npmjs.org";
const path = "/example/1.2.3";
const pathScoped = "/%40scope%2Fexample/1.2.3";

describe("npm", () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  test("getVersion", async () => {
    const cwd = join(__dirname, "fixtures", "npm");
    const version = await npm.getVersion(cwd, "example");
    expect(version).toEqual("1.2.3");
  });

  test("isPublished (already published)", async () => {
    nock(host).get(path).reply(200);

    const published = await npm.isPublished("example", "1.2.3");
    expect(published).toEqual(true);
  });

  test("isPublished (scoped)", async () => {
    nock(host).get(pathScoped).reply(200);

    const published = await npm.isPublished("@scope/example", "1.2.3");
    expect(published).toEqual(true);
  });

  test("isPublished (not published)", async () => {
    nock(host).get(path).reply(404);

    const published = await npm.isPublished("example", "1.2.3");
    expect(published).toEqual(false);
  });

  test("isPublished (error)", async () => {
    nock(host).get(path).reply(401);

    await expect(npm.isPublished("example", "1.2.3")).rejects.toThrowError(
      RequestError
    );
  });
});
