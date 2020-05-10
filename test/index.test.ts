import { join } from "path";
import { gem } from "../src/gem";
import { npm } from "../src/npm";
import { hex } from "../src/hex";

describe("gem", () => {
  test("getVersion", async () => {
    const cwd = join(__dirname, "fixtures", "gem");
    const version = await gem.getVersion(cwd, "example");
    expect(version).toEqual("1.2.3");
  });
});

describe("npm", () => {
  test("getVersion", async () => {
    const cwd = join(__dirname, "fixtures", "npm");
    const version = await npm.getVersion(cwd, "example");
    expect(version).toEqual("1.2.3");
  });
});

describe("hex", () => {
  test("getVersion", async () => {
    const cwd = join(__dirname, "fixtures", "hex");
    const version = await hex.getVersion(cwd, "example");
    expect(version).toEqual("1.2.3");
  });
});
