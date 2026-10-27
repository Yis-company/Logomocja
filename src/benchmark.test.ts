import { describe, expect, it } from "vitest";
import type { RunResult } from "../bench/score";
import { groupByVersion, humanScore, tokenTotals } from "./benchmark";

const run = (
  appVersion: string,
  model: string,
  taskPassRate: number,
  meanLatencyMs = 1000,
  scores: (number | null)[] = [null],
): RunResult => ({
  schema: 1,
  prompt: "v1",
  env: "1",
  image: "logomocja-bench:env-1",
  commit: "abc",
  appVersion,
  runner: "codex",
  cliVersion: "0",
  model,
  settings: { effort: null, argv: [] },
  startedAt: "2026-10-26T00:00:00.000Z",
  durationMs: 0,
  partial: false,
  tasks: [
    {
      id: "kwadrat",
      samples: scores.map((score, index) => ({
        index,
        passed: true,
        casesPassed: 6,
        casesTotal: 6,
        failure: null,
        code: "",
        response: "",
        usage: { input: 2, cachedInput: 1000, output: 50, reasoning: 20 },
        toolCalls: 0,
        latencyMs: meanLatencyMs,
        humanScore: score,
      })),
    },
  ],
  summary: { samples: scores.length, taskPassRate, casePassRate: taskPassRate, meanLatencyMs },
});

describe("benchmark groups", () => {
  it("orders versions newest first and runs by score, then speed", () => {
    const groups = groupByVersion([
      run("0.2.0", "slow", 1, 5000),
      run("0.10.0", "later", 0.5),
      run("0.2.0", "weak", 0.5),
      run("0.2.0", "fast", 1, 1000),
    ]);
    expect(groups.map((g) => g.version)).toEqual(["0.10.0", "0.2.0"]);
    expect(groups[1].runs.map((r) => r.model)).toEqual(["fast", "slow", "weak"]);
  });

  it("averages human scores and reports none when unfilled", () => {
    expect(humanScore(run("0.2.0", "m", 1, 1, [null, null]))).toBeNull();
    expect(humanScore(run("0.2.0", "m", 1, 1, [4, null, 5]))).toBe(4.5);
  });
});

describe("token totals", () => {
  it("sums input with cached input, output and reasoning over samples", () => {
    expect(tokenTotals(run("0.2.0", "m", 1, 1, [null, null]))).toEqual({
      input: 2004,
      output: 100,
      reasoning: 40,
    });
  });
});
