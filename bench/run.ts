// Host side: runs one benchmark task in the versioned container, then imports
// the artefacts: source branch, static build, result record, conformance score.
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { runConformance } from "./conformance/run";
import { renderPrompt, type Task } from "./prompt";
import type { RunResult } from "./result";
import { parseModelSpec } from "./runners";

const root = fileURLToPath(new URL("..", import.meta.url));
const { values } = parseArgs({
  options: {
    model: { type: "string" },
    task: { type: "string", default: "app" },
    prompt: { type: "string", default: "v1" },
    effort: { type: "string" },
    "no-push": { type: "boolean", default: false },
  },
});
if (!values.model) {
  console.error("Usage: bun bench/run.ts --model <claude|codex>:<id> [--task app|tests] [--prompt v1] [--effort high] [--no-push]");
  process.exit(2);
}
const task = values.task as Task;
if (task !== "app" && task !== "tests") throw new Error("--task must be app or tests");
const { runner, model } = parseModelSpec(values.model);
const effort = values.effort ?? null;
const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const log = (line: string) => console.error(`[bench] ${line}`);

const envVersion = readFileSync(join(root, "bench/env/VERSION"), "utf8").trim();
const image = `logomocja-bench:env-${envVersion}`;
if (spawnSync("docker", ["image", "inspect", image], { stdio: "ignore" }).status !== 0) {
  log(`building ${image}`);
  execFileSync("docker", ["build", "-f", "bench/env/Dockerfile", "-t", image, "bench/env"], { cwd: root, stdio: "inherit" });
}

const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z").replace("T", "-");
const id = `${values.prompt}-e${envVersion}-${runner.name}-${model.replace(/[^\w.-]+/g, "-")}-${stamp}`;
const basePath = `/Logomocja/builds/${id}/`;
const scratch = mkdtempSync(join(tmpdir(), "logomocja-bench-"));
const out = join(scratch, "out");
const auth = join(scratch, "codex");
mkdirSync(out);
mkdirSync(auth);
writeFileSync(join(out, "prompt.md"), renderPrompt(values.prompt, task));
const codexAuth = join(homedir(), ".codex/auth.json");
if (existsSync(codexAuth)) cpSync(codexAuth, join(auth, "auth.json"));
const token =
  process.env.CLAUDE_CODE_OAUTH_TOKEN ??
  (process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE
    ? readFileSync(process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE, "utf8").trim()
    : "");
const envFile = join(scratch, "env");
writeFileSync(envFile, token ? `CLAUDE_CODE_OAUTH_TOKEN=${token}\n` : "");
const repoVersion = (JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { version: string }).version;
const commit = git("rev-parse", "HEAD");
log(`run ${id}: repo ${repoVersion} at ${commit.slice(0, 7)} (${git("branch", "--show-current") || "detached"})`);

const started = performance.now();
const container = spawnSync(
  "docker",
  [
    "run", "--rm", "--name", id,
    "--env-file", envFile,
    "-e", `BENCH_TASK=${task}`,
    "-e", `BENCH_MODEL=${values.model}`,
    "-e", `BENCH_EFFORT=${effort ?? ""}`,
    "-e", `BENCH_RUN_ID=${id}`,
    "-e", `BENCH_BASE_PATH=${basePath}`,
    "-v", `${join(root, "bench")}:/bench:ro`,
    "-v", `${out}:/out`,
    "-v", `${auth}:/home/agent/.codex`,
    image,
    "bun", "/bench/agent.ts",
  ],
  { stdio: "inherit" },
);
rmSync(envFile, { force: true });
rmSync(auth, { recursive: true, force: true });
if (container.status !== 0 || !existsSync(join(out, "result.json")))
  throw new Error(`container exited with ${container.status} and no result.json`);

const inner = JSON.parse(readFileSync(join(out, "result.json"), "utf8")) as Omit<RunResult, "schema" | "id" | "prompt" | "env" | "image" | "commit" | "repoVersion" | "totalMs" | "conformance" | "humanScore" | "notes"> & { hasCommit: boolean };
const resultsDir = join(root, "bench/results", id);
mkdirSync(resultsDir, { recursive: true });
for (const name of ["transcript.jsonl", "agent.stderr.log", "verify.log"])
  if (existsSync(join(out, name))) cpSync(join(out, name), join(resultsDir, name));

let conformance: RunResult["conformance"] = null;
if (task === "app" && inner.verify?.built) {
  const buildDir = join(root, "builds", id);
  cpSync(join(out, "dist"), buildDir, { recursive: true });
  const suitesDir = join(root, "bench/conformance", values.prompt);
  if (existsSync(suitesDir)) {
    log("running conformance suites");
    const report = await runConformance(buildDir, basePath, suitesDir);
    writeFileSync(join(resultsDir, "conformance.json"), `${JSON.stringify(report, null, 2)}\n`);
    conformance = Object.fromEntries(
      Object.entries(report.suites).map(([name, suite]) => [name, { passed: suite.passed, total: suite.total, hook: report.hook }]),
    );
  }
}
if (task === "tests" && existsSync(join(out, "cases.json"))) {
  const target = join(root, "bench/conformance", values.prompt, `${model}.json`);
  mkdirSync(join(root, "bench/conformance", values.prompt), { recursive: true });
  cpSync(join(out, "cases.json"), target);
  log(`cases written to ${target} (review before use)`);
}

const { hasCommit, ...rest } = inner;
const result: RunResult = {
  schema: 2,
  id,
  ...rest,
  prompt: values.prompt,
  env: envVersion,
  image,
  commit,
  repoVersion,
  totalMs: Math.round(performance.now() - started),
  conformance,
  humanScore: null,
  notes: "",
};
writeFileSync(join(resultsDir, "result.json"), `${JSON.stringify(result, null, 2)}\n`);

if (hasCommit && existsSync(join(out, "source.bundle"))) {
  git("fetch", "-q", join(out, "source.bundle"), "HEAD");
  git("branch", "-f", `build/${id}`, "FETCH_HEAD");
  if (!values["no-push"]) git("push", "-q", "-u", "origin", `build/${id}`);
  log(`source on branch build/${id}${values["no-push"] ? " (not pushed)" : ""}`);
}
rmSync(scratch, { recursive: true, force: true });
log(
  `${result.status} in ${(result.agentMs / 60_000).toFixed(1)} min, ${result.tokens.input + result.tokens.cachedInput} in / ${result.tokens.output} out tokens, ${result.toolCalls} tool calls` +
    (result.verify ? `, built=${result.verify.built} tests=${result.verify.tests}` : "") +
    (result.cases !== null ? `, cases=${result.cases}` : "") +
    (conformance ? `, conformance ${Object.entries(conformance).map(([n, s]) => `${n} ${s.passed}/${s.total}`).join(" ")}` : ""),
);
