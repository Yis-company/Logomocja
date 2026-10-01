import { describe, expect, it } from "vitest";
import { defaults } from "./examples";
import { DRAFT_KEY, readDrafts, writeDrafts, type Drafts } from "./persistence";
describe("draft recovery", () => {
  it("round-trips mode and separate drafts without execution state", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    const drafts: Drafts = {
      version: 1,
      mode: "3d",
      sources: { "2d": "np 80", "3d": "gora 90 np 20" },
    };
    expect(writeDrafts(storage, drafts)).toBe(true);
    expect(readDrafts(storage)).toEqual(drafts);
    expect(JSON.parse(store.get(DRAFT_KEY) ?? "{}")).not.toHaveProperty(
      "drawing",
    );
  });
  it.each([
    "broken",
    "null",
    '{"version":2}',
    '{"version":1,"mode":"3d","sources":{"2d":42}}',
  ])("recovers from invalid storage %s", (raw) => {
    expect(readDrafts({ getItem: () => raw }).sources).toEqual(defaults);
  });
  it("handles denied reads and writes without throwing", () => {
    expect(
      readDrafts({
        getItem: () => {
          throw new Error("denied");
        },
      }).sources,
    ).toEqual(defaults);
    expect(
      writeDrafts(
        {
          setItem: () => {
            throw new Error("quota");
          },
        },
        { version: 1, mode: "2d", sources: defaults },
      ),
    ).toBe(false);
  });
});
