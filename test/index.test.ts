import * as entry from "../src";

test("exports", () => {
  expect(Object.keys(entry).sort()).toEqual(["detect", "gem", "hex", "npm"]);
});
