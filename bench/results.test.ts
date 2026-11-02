import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseSuite } from "./conformance/compare";
import type { RunResult } from "./result";

type ScoredResult = Pick<
  RunResult,
  "id" | "task" | "prompt" | "verify" | "conformance"
>;
const bench = fileURLToPath(new URL(".", import.meta.url));
function scoreErrors(result: ScoredResult, suites: Record<string, number>) {
  if (result.task !== "app" || !result.verify?.built) return [];
  const errors: string[] = [];
  for (const [name, total] of Object.entries(suites)) {
    for (const key of result.prompt === "v1"
      ? [name]
      : [name, `${name}@open`]) {
      const score = result.conformance?.[key];
      if (
        !score ||
        !Number.isInteger(score.passed) ||
        score.passed < 0 ||
        score.passed > total ||
        score.total !== total ||
        typeof score.hook !== "boolean"
      )
        errors.push(
          `${result.id}: missing or malformed ${key} (expected ${total} cases)`,
        );
    }
  }
  return errors;
}

describe("stored benchmark scores", () => {
  const eligible = readdirSync(join(bench, "results")).flatMap((id) => {
    const file = join(bench, "results", id, "result.json");
    if (!existsSync(file)) return [];
    const result = JSON.parse(readFileSync(file, "utf8")) as RunResult;
    return result.task === "app" && result.verify?.built ? [result] : [];
  });
  it.each(eligible)("$id has all scoring passes for its prompt", (result) => {
    const dir = join(bench, "conformance", result.prompt);
    const suites = Object.fromEntries(
      readdirSync(dir)
        .filter((name) => name.endsWith(".json"))
        .map((name) => [
          name.slice(0, -5),
          parseSuite(JSON.parse(readFileSync(join(dir, name), "utf8"))).length,
        ]),
    );
    expect(Object.keys(suites).length).toBeGreaterThan(0);
    expect(scoreErrors(result, suites)).toEqual([]);
  });

  const fixture: ScoredResult = {
    id: "fixture",
    task: "app",
    prompt: "v2",
    verify: {
      installed: true,
      built: true,
      tests: "none",
      distFiles: 1,
      distBytes: 1,
    },
    conformance: Object.fromEntries(
      ["combined", "combined@open", "stress", "stress@open"].map((name) => [
        name,
        { passed: 0, total: 2, hook: false },
      ]),
    ),
  };
  const suites = { combined: 2, stress: 2 };
  it.each(["combined@open", "stress", "stress@open"])(
    "detects a missing %s even if other scores exist",
    (name) => {
      const conformance = { ...fixture.conformance };
      delete conformance[name];
      expect(scoreErrors({ ...fixture, conformance }, suites)).toEqual([
        `fixture: missing or malformed ${name} (expected 2 cases)`,
      ]);
    },
  );
  it("detects stale totals and malformed scores without requiring passing models", () => {
    expect(scoreErrors(fixture, suites)).toEqual([]);
    expect(scoreErrors(fixture, { ...suites, stress: 3 })).toHaveLength(2);
    expect(scoreErrors({ ...fixture, conformance: null }, suites)).toHaveLength(
      4,
    );
    expect(
      scoreErrors(
        {
          ...fixture,
          conformance: {
            ...fixture.conformance,
            combined: { passed: -1, total: 2, hook: true },
          },
        },
        suites,
      ),
    ).toHaveLength(1);
  });
  it("preserves v1 scoring and excludes test-author and failed builds", () => {
    expect(
      scoreErrors(
        {
          ...fixture,
          prompt: "v1",
          conformance: { original: { passed: 0, total: 1, hook: false } },
        },
        { original: 1 },
      ),
    ).toEqual([]);
    expect(
      scoreErrors({ ...fixture, task: "tests", conformance: null }, suites),
    ).toEqual([]);
    expect(
      scoreErrors(
        { ...fixture, task: "tests-round2", conformance: null },
        suites,
      ),
    ).toEqual([]);
    expect(
      scoreErrors({ ...fixture, verify: null, conformance: null }, suites),
    ).toEqual([]);
  });
});
