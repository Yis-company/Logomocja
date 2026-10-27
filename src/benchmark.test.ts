import { describe, expect, it } from "vitest";
import type { RunResult } from "../bench/result";
import { conformanceRate, groupByVersion } from "./benchmark";

const run = (overrides: Partial<RunResult>): RunResult => ({
  schema: 2,
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
  turns: 1,
  toolCalls: 0,
  verify: { installed: true, built: true, tests: "none", distFiles: 1, distBytes: 1 },
  conformance: null,
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

  it("computes the conformance rate across suites", () => {
    expect(conformanceRate(run({}))).toBeNull();
    expect(conformanceRate(run({ conformance: { a: { passed: 1, total: 4, hook: true }, b: { passed: 3, total: 4, hook: true } } }))).toBe(0.5);
  });
});
