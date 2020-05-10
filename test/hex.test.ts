import nock from "nock";
import { join } from "path";
import { RequestError } from "got";
import { hex } from "../src/hex";

const host = "https://hex.pm";
const path = "/api/packages/example/releases/1.2.3";

describe("hex", () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  test("getProject", async () => {
    const cwd = join(__dirname, "fixtures", "hex");
    const { name, version } = await hex.getProject(cwd);
    expect(name).toEqual("example");
    expect(version).toEqual("1.2.3");
  });

  test("isPublished (already published)", async () => {
    nock(host).get(path).reply(200);

    const published = await hex.isPublished("example", "1.2.3");
    expect(published).toEqual(true);
  });

  test("isPublished (not published)", async () => {
    nock(host).get(path).reply(404);

    const published = await hex.isPublished("example", "1.2.3");
    expect(published).toEqual(false);
  });

  test("isPublished (error)", async () => {
    nock(host).get(path).reply(401);

    await expect(hex.isPublished("example", "1.2.3")).rejects.toThrowError(
      RequestError
    );
  });
});
