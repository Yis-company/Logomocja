import { describe, expect, it } from "vitest";
import { readTheme } from "./theme";
describe("saved theme", () => {
  it("accepts explicit light and dark only", () => {
    for (const value of ["light", "dark"] as const)
      expect(readTheme({ getItem: () => value })).toBe(value);
    for (const value of [null, "system", "true", "{}"])
      expect(readTheme({ getItem: () => value })).toBeNull();
  });
  it("recovers when storage is inaccessible", () => {
    expect(
      readTheme({
        getItem: () => {
          throw new Error("Denied");
        },
      }),
    ).toBeNull();
  });
});
