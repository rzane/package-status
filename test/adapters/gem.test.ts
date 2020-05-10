import nock from "nock";
import { RequestError } from "got";
import { gem } from "../../src";

const host = "https://rubygems.org";
const path = "/api/v2/rubygems/example/versions/1.2.3.json";

describe("gem", () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
  });

  test("getProject", async () => {
    const { name, version } = await gem.getProject("test/fixtures/gem");
    expect(name).toEqual("example");
    expect(version).toEqual("1.2.3");
  });

  test("isPublished (already published)", async () => {
    nock(host).get(path).reply(200);

    const published = await gem.isPublished("example", "1.2.3");
    expect(published).toEqual(true);
  });

  test("isPublished (not published)", async () => {
    nock(host).get(path).reply(404);

    const published = await gem.isPublished("example", "1.2.3");
    expect(published).toEqual(false);
  });

  test("isPublished (error)", async () => {
    nock(host).get(path).reply(401);

    await expect(gem.isPublished("example", "1.2.3")).rejects.toThrowError(
      RequestError
    );
  });
});
