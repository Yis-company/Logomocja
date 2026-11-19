import type { RunResult } from "../bench/result";
import type { Attempt } from "./benchmark-attempts";

export const benchmarkVersion = (run: Pick<RunResult, "prompt" | "env">) =>
  `${run.prompt}/e${run.env}`;

export const filterKeys = [
  "source",
  "protocol",
  "model",
  "runner",
  "effort",
  "condition",
  "task",
  "status",
] as const;
export type FilterKey = (typeof filterKeys)[number];
export type SortKey = "date" | "model" | "conformance" | "time" | "cost";
export type Sort = { key: SortKey; direction: "asc" | "desc" };

export function conformance(run: Attempt, path: "interpreter" | "editor") {
  let passed = 0;
  let total = 0;
  for (const [name, suite] of Object.entries(run.conformance ?? {})) {
    if (name.endsWith("@open") !== (path === "editor")) continue;
    passed += suite.passed;
    total += suite.total;
  }
  return total ? { passed, total } : null;
}

export function isMetric(key: string): key is "conformance" | "time" | "cost" {
  return key === "conformance" || key === "time" || key === "cost";
}

export function readSort(params: URLSearchParams, oneProtocol: boolean): Sort {
  const key = params.get("sort");
  return {
    key:
      key === "model" || (key && oneProtocol && isMetric(key)) ? key : "date",
    direction: params.get("order") === "asc" ? "asc" : "desc",
  };
}

export function filterAttempts(
  runs: readonly Attempt[],
  params: URLSearchParams,
) {
  const query = params.get("q")?.trim().toLowerCase();
  const filters = filterKeys.flatMap((key) => {
    const value = params.get(key);
    return value ? [{ key, value }] : [];
  });
  return runs.filter(
    (run) =>
      (!query ||
        run.model.toLowerCase().includes(query) ||
        run.id.toLowerCase().includes(query)) &&
      filters.every(({ key, value }) => (run[key] ?? "default") === value),
  );
}

export function sortAttempts(runs: Attempt[], sort: Sort) {
  const direction = sort.direction === "asc" ? 1 : -1;
  const byDate = (a: Attempt, b: Attempt) =>
    a.startedAt.localeCompare(b.startedAt);
  const byId = (a: Attempt, b: Attempt) => a.id.localeCompare(b.id);
  const recency = (a: Attempt, b: Attempt) => byDate(b, a) || byId(a, b);
  if (sort.key === "date")
    return runs.sort((a, b) => direction * byDate(a, b) || byId(a, b));
  if (sort.key === "model") {
    return runs.sort(
      (a, b) => direction * a.model.localeCompare(b.model) || recency(a, b),
    );
  }
  const measure = (run: Attempt) => {
    if (sort.key === "time") return run.timeMs;
    if (sort.key === "cost") return run.costUsd;
    const score = conformance(run, "interpreter");
    return score ? score.passed / score.total : undefined;
  };
  return runs
    .map((run) => ({ run, value: measure(run) }))
    .sort((a, b) => {
      if (a.value === undefined || b.value === undefined) {
        return (
          Number(a.value === undefined) - Number(b.value === undefined) ||
          recency(a.run, b.run)
        );
      }
      return direction * (a.value - b.value) || recency(a.run, b.run);
    })
    .map(({ run }) => run);
}

export function canCompare(first: Attempt, second?: Attempt) {
  if (!first.built || first.task !== "app") return false;
  if (!second) return true;
  return (
    second.built &&
    second.task === "app" &&
    first.id !== second.id &&
    first.source === second.source &&
    first.protocol === second.protocol
  );
}
