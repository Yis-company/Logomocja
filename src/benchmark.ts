import type { RunResult } from "../bench/score";

/** Leaderboard order: strict task score, then partial credit, then speed. */
export function compareRuns(a: RunResult, b: RunResult): number {
  return (
    b.summary.taskPassRate - a.summary.taskPassRate ||
    b.summary.casePassRate - a.summary.casePassRate ||
    a.summary.meanLatencyMs - b.summary.meanLatencyMs ||
    b.startedAt.localeCompare(a.startedAt)
  );
}

const compareVersions = (a: string, b: string) => {
  const parse = (v: string) => v.split(/[.-]/).map((part) => Number(part));
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const diff = (x[i] ?? 0) - (y[i] ?? 0);
    if (!Number.isNaN(diff) && diff !== 0) return diff;
  }
  return a.localeCompare(b);
};

export type VersionGroup = { version: string; runs: RunResult[] };

/** Groups runs by the app version they scored, newest version first. */
export function groupByVersion(runs: readonly RunResult[]): VersionGroup[] {
  const groups = new Map<string, RunResult[]>();
  for (const run of runs) {
    const list = groups.get(run.appVersion) ?? [];
    list.push(run);
    groups.set(run.appVersion, list);
  }
  return [...groups]
    .sort(([a], [b]) => compareVersions(b, a))
    .map(([version, list]) => ({ version, runs: list.sort(compareRuns) }));
}

export function humanScore(run: RunResult): number | null {
  const scores = run.tasks
    .flatMap((task) => task.samples)
    .flatMap((sample) => (sample.humanScore === null ? [] : [sample.humanScore]));
  return scores.length
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length
    : null;
}

export type TokenTotals = { input: number; output: number; reasoning: number };

/** Token totals over every sample of a run, as reported by the CLI. Input includes cached tokens. */
export function tokenTotals(run: RunResult): TokenTotals {
  const totals = { input: 0, output: 0, reasoning: 0 };
  for (const sample of run.tasks.flatMap((task) => task.samples)) {
    totals.input += (sample.usage.input ?? 0) + (sample.usage.cachedInput ?? 0);
    totals.output += sample.usage.output ?? 0;
    totals.reasoning += sample.usage.reasoning ?? 0;
  }
  return totals;
}
