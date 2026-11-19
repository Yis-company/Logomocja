import { describe, expect, it } from "vitest";
import { attempts } from "./benchmark-attempts";
import {
  canCompare,
  conformance,
  filterAttempts,
  readSort,
  sortAttempts,
} from "./benchmark";

const fableId = "v2-e5-claude-claude-fable-5-2-20261110-215004Z";
const layeredId =
  "v2-e5-impeccable-v1-claude-claude-fable-5-2-20261111-061434Z";
function recorded(id: string) {
  const attempt = attempts.find((run) => run.id === id);
  if (!attempt) throw new Error(`Missing benchmark attempt ${id}`);
  return attempt;
}
const fable = recorded(fableId);
const layered = recorded(layeredId);
const neon = recorded("gemini-4-medium/neon-base");

describe("benchmark explorer", () => {
  it("retains distinct finalized, interrupted, test-author, and pilot attempts", () => {
    const finalized = Object.values(
      import.meta.glob<{ id: string }>("../bench/results/*/result.json", {
        eager: true,
        import: "default",
      }),
    );
    expect(new Set(attempts.map(({ id }) => id)).size).toBe(attempts.length);
    expect(attempts.map(({ id }) => id)).toEqual(
      expect.arrayContaining(finalized.map(({ id }) => id)),
    );
    expect(attempts).toContainEqual(
      expect.objectContaining({ status: "interrupted", built: false }),
    );
    expect(attempts).toContainEqual(
      expect.objectContaining({ task: "tests-round2", built: false }),
    );
    const pilot = filterAttempts(
      attempts,
      new URLSearchParams("source=antigravity"),
    );
    expect(pilot.filter(({ status }) => status === "scored")).toHaveLength(4);
    expect(
      pilot.filter(({ status }) => status === "setup-blocked"),
    ).toHaveLength(3);
    expect(pilot.every(({ costUsd }) => costUsd === undefined)).toBe(true);
  });

  it("filters source, protocol, and effort with case-insensitive model or ID search", () => {
    expect(
      filterAttempts(
        attempts,
        new URLSearchParams(
          "source=docker&protocol=v2%2Fe5&effort=low&q=impeccable",
        ),
      ),
    ).toEqual([layered]);
    expect(
      filterAttempts(
        attempts,
        new URLSearchParams("q=GEMINI-4-NEON&status=scored&condition=base"),
      ),
    ).toEqual([neon]);
  });

  it("keeps interpreter and editor conformance distinct and preserves missing scores", () => {
    expect(conformance(fable, "interpreter")).toEqual({
      passed: 617,
      total: 618,
    });
    expect(conformance(fable, "editor")).toEqual({ passed: 617, total: 618 });
    const early = recorded("v1-e1-claude-claude-fable-5-1-20261027-070726Z");
    expect(conformance(early, "editor")).toBeNull();
    expect(conformance(neon, "editor")).toEqual({ passed: 618, total: 618 });
  });

  it("scopes metric ordering and puts unavailable measurements after scored runs", () => {
    const params = new URLSearchParams(
      "protocol=v2%2Fe5&sort=conformance&order=desc",
    );
    expect(readSort(params, false).key).toBe("date");
    const results = sortAttempts(
      filterAttempts(attempts, params),
      readSort(params, true),
    );
    expect(results.slice(0, 2).map(({ id }) => id)).toEqual([
      fableId,
      layeredId,
    ]);
    expect(
      results.slice(2).every((run) => conformance(run, "interpreter") === null),
    ).toBe(true);
    expect(
      sortAttempts([fable, neon], readSort(new URLSearchParams(), false)),
    ).toEqual([neon, fable]);
  });

  it("limits comparisons to distinct built apps in one protocol", () => {
    expect(canCompare(fable, layered)).toBe(true);
    expect(canCompare(fable, neon)).toBe(false);
    expect(canCompare(fable, fable)).toBe(false);
    expect(canCompare(fable, { ...layered, protocol: "v2/e2" })).toBe(false);
    expect(canCompare(fable, { ...layered, built: false })).toBe(false);
    expect(canCompare({ ...fable, task: "tests" })).toBe(false);
  });
});
