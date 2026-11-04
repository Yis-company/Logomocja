import { describe, expect, it } from "vitest";
import type { RunResult } from "../bench/result";
import { conformanceRate, groupByVersion, layerName } from "./benchmark";

const run = (overrides: Partial<RunResult>): RunResult => ({
  schema: 4,
  id: "x",
  task: "app",
  prompt: "v1",
  env: "1",
  image: "logomocja-bench:env-1",
  commit: "abc",
  repoVersion: "0.2.0",
  runner: "claude",
  model: "m",
  cliVersion: "2",
  effort: null,
  startedAt: "2026-10-27T00:00:00.000Z",
  agentMs: 60_000,
  totalMs: 70_000,
  status: "completed",
  statusDetail: "success",
  tokens: { input: 1, cachedInput: 2, output: 3, reasoning: 4 },
  costUsd: null,
  costBasis: null,
  turns: 1,
  toolCalls: 0,
  verify: { installed: true, built: true, tests: "none", distFiles: 1, distBytes: 1 },
  conformance: null,
  gallery: null,
  cases: null,
  humanScore: null,
  notes: "",
  ...overrides,
});

describe("benchmark grouping", () => {
  it("groups one task by prompt/env, newest version first, best run first", () => {
    const groups = groupByVersion(
      [
        run({ model: "old", prompt: "v1", env: "2" }),
        run({ model: "tests-only", task: "tests" }),
        run({ model: "broken", verify: { installed: true, built: false, tests: "none", distFiles: 0, distBytes: 0 } }),
        run({ model: "conformant", conformance: { a: { passed: 9, total: 10, hook: true } } }),
        run({ model: "slow", agentMs: 120_000 }),
        run({ model: "fast", agentMs: 30_000 }),
      ],
      "app",
    );
    expect(groups.map((g) => g.version)).toEqual(["v1/e2", "v1/e1"]);
    expect(groups[1].runs.map((r) => r.model)).toEqual(["conformant", "fast", "slow", "broken"]);
  });

  it("keeps layered runs out of base rankings, with the base group first", () => {
    const layer = { id: "impeccable-v1", skillVersion: "4.7.0", engineVersion: "0.1.16" };
    const groups = groupByVersion([run({ id: "layered", layer }), run({ id: "base" })], "app");
    expect(groups.map((g) => [g.version, g.layer, g.runs.map((r) => r.id)])).toEqual([
      ["v1/e1", "base", ["base"]],
      ["v1/e1", "impeccable-v1", ["layered"]],
    ]);
  });

  it("computes the conformance rate across suites", () => {
    expect(conformanceRate(run({}))).toBeNull();
    expect(conformanceRate(run({ conformance: { a: { passed: 1, total: 4, hook: true }, b: { passed: 3, total: 4, hook: true } } }))).toBe(0.5);
  });
  it("keeps the TDD and combined conditions separate and labels them accurately", () => {
    const groups = groupByVersion([
      run({ id: "tdd", layer: { id: "tdd-v1", tddSourceCommit: "abc" } }),
      run({ id: "both", layer: { id: "impeccable-tdd-v1", skillVersion: "4.7.0", tddSourceCommit: "abc" } }),
      run({ id: "base" }),
    ], "app");
    expect(groups.map((g) => [layerName(g.layer), g.runs.map((r) => r.id)])).toEqual([
      ["base", ["base"]],
      ["Impeccable + TDD", ["both"]],
      ["TDD", ["tdd"]],
    ]);
  });
});
