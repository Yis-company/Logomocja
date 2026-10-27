import { runChallenge } from "../src/challenges/judge";
import type { Challenge } from "../src/challenges/tasks";

export type FailureKind = "no-code" | "parse" | "runtime" | "geometry" | "cli";
export type Failure = { kind: FailureKind; message: string };
export type Sample = {
  index: number;
  passed: boolean;
  casesPassed: number;
  casesTotal: number;
  failure: Failure | null;
  code: string | null;
  response: string | null;
  usage: Record<string, number>;
  toolCalls: number;
  latencyMs: number;
  humanScore: number | null;
};
export type TaskResult = { id: string; samples: Sample[] };
export type Summary = {
  samples: number;
  taskPassRate: number;
  casePassRate: number;
  meanLatencyMs: number;
};
export type RunResult = {
  schema: 1;
  prompt: string;
  env: string;
  image: string;
  commit: string;
  /** package.json version of the app the run was scored against. */
  appVersion: string;
  runner: string;
  cliVersion: string;
  model: string;
  settings: { effort: string | null; argv: string[] };
  startedAt: string;
  durationMs: number;
  partial: boolean;
  tasks: TaskResult[];
  summary: Summary;
};

export type Verdict = {
  passed: boolean;
  casesPassed: number;
  casesTotal: number;
  failure: Failure | null;
};

/** Judges one submission headlessly against every case of the task. */
export async function judgeSample(
  code: string | null,
  task: Challenge,
): Promise<Verdict> {
  const casesTotal = task.cases.length;
  if (code === null)
    return {
      passed: false,
      casesPassed: 0,
      casesTotal,
      failure: { kind: "no-code", message: "No Logo code in the response." },
    };
  const result = await runChallenge(code, task, task.cases, {
    schedule: async () => {},
  });
  if (!result || result.error)
    return {
      passed: false,
      casesPassed: 0,
      casesTotal,
      failure: {
        kind: "parse",
        message: result?.error?.message ?? "Judge was cancelled.",
      },
    };
  const failed = result.cases.find((item) => !item.passed);
  return {
    passed: !failed,
    casesPassed: result.passed,
    casesTotal,
    failure: failed
      ? {
          kind: /^Wiersz \d+/.test(failed.message) ? "runtime" : "geometry",
          message: `[${failed.args.join(", ")}] ${failed.message}`,
        }
      : null,
  };
}

export function summarize(tasks: TaskResult[]): Summary {
  const samples = tasks.flatMap((task) => task.samples);
  const total = samples.length;
  const cases = samples.reduce((sum, item) => sum + item.casesTotal, 0);
  return {
    samples: total,
    taskPassRate: total ? samples.filter((s) => s.passed).length / total : 0,
    casePassRate: cases
      ? samples.reduce((sum, item) => sum + item.casesPassed, 0) / cases
      : 0,
    meanLatencyMs: total
      ? Math.round(samples.reduce((sum, s) => sum + s.latencyMs, 0) / total)
      : 0,
  };
}

export function resultFileName(
  result: Pick<RunResult, "runner" | "model" | "prompt" | "env" | "startedAt">,
): string {
  const stamp = result.startedAt.replace(/[:.]/g, "-").replace(/-\d{3}Z$/, "Z");
  const model = result.model.replace(/[^\w.-]+/g, "-");
  return `${result.runner}-${model}_p${result.prompt}_e${result.env}_${stamp}.json`;
}
