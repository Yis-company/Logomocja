// Runs inside the container as the `agent` user. Launches the CLI on the brief,
// records the transcript, commits the result, verifies it, and writes /out.
import { spawn, spawnSync } from "node:child_process";
import {
  cpSync,
  createWriteStream,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import type { Verify } from "./result";
import { parseModelSpec } from "./runners";

const WORK = "/work";
const OUT = "/out";
const env = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};
const task = env("BENCH_TASK") as "app" | "tests";
const { runner, model } = parseModelSpec(env("BENCH_MODEL"));
const effort = process.env.BENCH_EFFORT || null;
const basePath = env("BENCH_BASE_PATH");
const prompt = readFileSync(join(OUT, "prompt.md"), "utf8");
const log = (line: string) => console.error(`[agent] ${line}`);
const sh = (
  argv: string[],
  options: { cwd?: string; timeoutMs?: number; env?: NodeJS.ProcessEnv; logTo?: string } = {},
) => {
  const run = spawnSync(argv[0], argv.slice(1), {
    cwd: options.cwd ?? WORK,
    encoding: "utf8",
    timeout: options.timeoutMs,
    env: { ...process.env, ...options.env },
    maxBuffer: 64 * 1024 * 1024,
  });
  if (options.logTo)
    writeFileSync(
      options.logTo,
      `\n$ ${argv.join(" ")}\n${run.stdout ?? ""}${run.stderr ?? ""}(exit ${run.status})\n`,
      { flag: "a" },
    );
  return run;
};

sh(["git", "init", "-q", "-b", "main"]);
writeFileSync(join(WORK, ".git/info/exclude"), "node_modules/\ndist/\n.bun/\n.cache/\n");
const git = ["git", "-c", "user.name=Logomocja bench", "-c", "user.email=bench@logomocja.invalid"];

const startedAt = new Date().toISOString();
const started = performance.now();
const argv = runner.argv({ model, effort });
log(`starting ${argv.join(" ")}`);
const agentExit: number | null = await new Promise((resolve) => {
  const child = spawn(argv[0], argv.slice(1), { cwd: WORK, stdio: ["pipe", "pipe", "pipe"] });
  child.stdout.pipe(createWriteStream(join(OUT, "transcript.jsonl")));
  child.stderr.pipe(createWriteStream(join(OUT, "agent.stderr.log")));
  child.on("close", (code) => resolve(code));
  child.stdin.end(prompt);
});
const agentMs = Math.round(performance.now() - started);
log(`agent exited with ${agentExit} after ${(agentMs / 1000 / 60).toFixed(1)} min`);
const parsed = runner.parse(readFileSync(join(OUT, "transcript.jsonl"), "utf8"));

sh([...git, "add", "-A"]);
sh([...git, "commit", "-q", "-m", `Benchmark run ${env("BENCH_RUN_ID")}`]);
const hasCommit = sh(["git", "rev-parse", "-q", "--verify", "HEAD"]).status === 0;
if (hasCommit) sh(["git", "bundle", "create", join(OUT, "source.bundle"), "HEAD"]);

let verify: Verify | null = null;
let cases: number | null = null;
if (task === "app") {
  const verifyLog = join(OUT, "verify.log");
  writeFileSync(verifyLog, "");
  for (const dir of ["node_modules", "dist"]) rmSync(join(WORK, dir), { recursive: true, force: true });
  const installed = sh(["bun", "install"], { timeoutMs: 15 * 60_000, logTo: verifyLog }).status === 0;
  const built =
    installed &&
    sh(["bun", "run", "build"], { timeoutMs: 15 * 60_000, logTo: verifyLog, env: { BASE_PATH: basePath } }).status === 0 &&
    existsSync(join(WORK, "dist/index.html"));
  let tests: Verify["tests"] = "none";
  try {
    const pkg = JSON.parse(readFileSync(join(WORK, "package.json"), "utf8")) as { scripts?: Record<string, string> };
    if (installed && pkg.scripts?.test)
      tests = sh(["bun", "run", "test"], { timeoutMs: 15 * 60_000, logTo: verifyLog, env: { CI: "1" } }).status === 0 ? "pass" : "fail";
  } catch {
    /* no package.json: nothing to test */
  }
  let distFiles = 0;
  let distBytes = 0;
  if (built) {
    cpSync(join(WORK, "dist"), join(OUT, "dist"), { recursive: true });
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) walk(path);
        else {
          distFiles++;
          distBytes += statSync(path).size;
        }
      }
    };
    walk(join(OUT, "dist"));
  }
  verify = { installed, built, tests, distFiles, distBytes };
  log(`verify: installed=${installed} built=${built} tests=${tests} files=${distFiles}`);
} else {
  const file = join(WORK, "cases.json");
  try {
    const suite = JSON.parse(readFileSync(file, "utf8")) as { cases?: unknown[] };
    cases = Array.isArray(suite.cases) ? suite.cases.length : 0;
    cpSync(file, join(OUT, "cases.json"));
  } catch {
    cases = 0;
  }
  log(`cases: ${cases}`);
}

const versionOutput = sh([runner.name, "--version"]).stdout ?? "";
writeFileSync(
  join(OUT, "result.json"),
  JSON.stringify(
    {
      task,
      runner: runner.name,
      model,
      cliVersion: runner.version(versionOutput),
      effort,
      startedAt,
      agentMs,
      agentExit,
      hasCommit,
      status: parsed.status,
      statusDetail: parsed.detail,
      tokens: parsed.tokens,
      costUsd: parsed.costUsd,
      turns: parsed.turns,
      toolCalls: parsed.toolCalls,
      verify,
      cases,
    },
    null,
    2,
  ),
);
log("done");
