import type { RunResult } from "../bench/result";

export const benchmarkVersion = (run: RunResult) => `${run.prompt}/e${run.env}`;

const layerNames: Record<string, string> = {
  "impeccable-v1": "Impeccable",
  "tdd-v1": "TDD",
  "impeccable-tdd-v1": "Impeccable + TDD",
};
export const layerName = (id: string) => layerNames[id] ?? id;

/** Share of conformance cases passed across suites, or null without suites. */
export function conformanceRate(run: RunResult): number | null {
  const suites = Object.values(run.conformance ?? {});
  const total = suites.reduce((sum, s) => sum + s.total, 0);
  return total ? suites.reduce((sum, s) => sum + s.passed, 0) / total : null;
}

/** Leaderboard order: conformance, then a working build, then agent time. */
export function compareRuns(a: RunResult, b: RunResult): number {
  return (
    (conformanceRate(b) ?? -1) - (conformanceRate(a) ?? -1) ||
    Number(b.verify?.built ?? false) - Number(a.verify?.built ?? false) ||
    a.agentMs - b.agentMs ||
    b.startedAt.localeCompare(a.startedAt)
  );
}

const compareVersions = (a: string, b: string) => {
  const parse = (v: string) => v.split(/[^\d]+/).filter(Boolean).map(Number);
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const diff = (x[i] ?? 0) - (y[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return a.localeCompare(b);
};

export type VersionGroup = { version: string; layer: string; runs: RunResult[] };

/** Groups runs by prompt/env and layer, newest version then base first. "tests" includes its later rounds. */
export function groupByVersion(runs: readonly RunResult[], task: RunResult["task"]): VersionGroup[] {
  const groups = new Map<string, RunResult[]>();
  for (const run of runs) {
    if (!run.task.startsWith(task)) continue;
    const key = `${benchmarkVersion(run)}:${run.layer?.id ?? "base"}`;
    groups.set(key, [...(groups.get(key) ?? []), run]);
  }
  return [...groups.values()]
    .map((list) => ({ version: benchmarkVersion(list[0]), layer: list[0].layer?.id ?? "base", runs: list.sort(compareRuns) }))
    .sort((a, b) => compareVersions(b.version, a.version) || Number(b.layer === "base") - Number(a.layer === "base") || a.layer.localeCompare(b.layer));
}
