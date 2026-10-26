import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { challenges } from "../src/challenges/tasks";
import { extractCode } from "./extract";
import { loadPrompt } from "./prompt";
import { CliError, complete, runners } from "./runners";
import {
  judgeSample,
  resultFileName,
  type RunResult,
  type Sample,
  summarize,
  type TaskResult,
} from "./score";

const here = fileURLToPath(new URL(".", import.meta.url));
const { values } = parseArgs({
  options: {
    model: { type: "string" },
    prompt: { type: "string", default: "v1" },
    samples: { type: "string", default: "1" },
    effort: { type: "string" },
    out: { type: "string", default: join(here, "results") },
    probe: { type: "boolean", default: false },
  },
});
const spec = values.model ?? "";
const [runnerName, ...rest] = spec.split(":");
const runner = runners[runnerName as keyof typeof runners];
const model = rest.join(":");
if (!runner || !model) {
  console.error("Usage: bun bench/run.ts --model <claude|codex>:<model-id> [--prompt v1] [--samples 1] [--effort low|medium|high|xhigh] [--probe]");
  process.exit(2);
}
const samples = Number(values.samples);
if (!Number.isInteger(samples) || samples < 1)
  throw new Error("--samples must be a positive integer");
const effort = values.effort ?? null;
const log = (line: string) => console.error(line);

if (values.probe) {
  const run = complete(runner, {
    model,
    effort,
    system: "You are a connectivity probe. Reply with exactly the single word OK.",
    user: "Say the word.",
  });
  console.log(JSON.stringify({ ...run.completion, latencyMs: run.latencyMs }));
  process.exit(run.completion.text.trim() === "OK" ? 0 : 1);
}

const prompt = loadPrompt(values.prompt);
const env = readFileSync(join(here, "env/VERSION"), "utf8").trim();
const startedAt = new Date().toISOString();
const started = performance.now();
const tasks: TaskResult[] = [];
let argv: string[] = [];
let partial = false;

outer: for (const task of challenges) {
  const result: TaskResult = { id: task.id, samples: [] };
  tasks.push(result);
  for (let index = 0; index < samples; index++) {
    const sample: Sample = {
      index,
      passed: false,
      casesPassed: 0,
      casesTotal: task.cases.length,
      failure: null,
      code: null,
      response: null,
      usage: {},
      toolCalls: 0,
      latencyMs: 0,
      humanScore: null,
    };
    result.samples.push(sample);
    try {
      const run = complete(runner, {
        model,
        effort,
        system: prompt.system,
        user: prompt.task(task),
      });
      argv = run.argv;
      sample.response = run.completion.text;
      sample.usage = run.completion.usage;
      sample.toolCalls = run.completion.toolCalls;
      sample.latencyMs = run.latencyMs;
      sample.code = extractCode(run.completion.text);
      Object.assign(sample, await judgeSample(sample.code, task));
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      sample.failure = { kind: "cli", message };
      if (cause instanceof CliError && cause.fatal) {
        partial = true;
        log(`${task.id} #${index + 1}: fatal: ${message}`);
        break outer;
      }
    }
    log(
      `${task.id} #${index + 1}: ${sample.passed ? "pass" : `fail (${sample.failure?.kind}: ${sample.failure?.message.slice(0, 120)})`} ${(sample.latencyMs / 1000).toFixed(1)}s`,
    );
  }
}

const result: RunResult = {
  schema: 1,
  prompt: prompt.version,
  env,
  image: `logomocja-bench:env-${env}`,
  commit: process.env.BENCH_COMMIT ?? "unknown",
  runner: runner.name,
  cliVersion: runner.version(),
  model,
  settings: { effort, argv },
  startedAt,
  durationMs: Math.round(performance.now() - started),
  partial,
  tasks,
  summary: summarize(tasks),
};
mkdirSync(values.out, { recursive: true });
const file = join(values.out, resultFileName(result));
writeFileSync(file, `${JSON.stringify(result, null, 2)}\n`);
log(
  `${runner.name}:${model} tasks ${(result.summary.taskPassRate * 100).toFixed(0)}% cases ${(result.summary.casePassRate * 100).toFixed(0)}% mean ${(result.summary.meanLatencyMs / 1000).toFixed(1)}s${partial ? " (partial)" : ""} -> ${file}`,
);
