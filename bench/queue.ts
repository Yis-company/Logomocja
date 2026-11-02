import { spawn, spawnSync } from "node:child_process";
import {
  closeSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { renderPrompt } from "./prompt";
import type { RunResult } from "./result";
import { parseModelSpec } from "./runners";

type Entry = {
  model: string;
  effort: string | null;
  status: "queued" | "running" | "completed" | "failed" | "interrupted";
  pid?: number;
};
type Queue = {
  root: string;
  prompt: string;
  noPush: boolean;
  entries: Entry[];
};
type RunInfo = { id: string; transcript: string };
const root = fileURLToPath(new URL("..", import.meta.url));
const read = <T>(file: string): T => JSON.parse(readFileSync(file, "utf8"));
const stateFile = (dir: string) => join(dir, "state.json");
function save(dir: string, queue: Queue) {
  writeFileSync(`${stateFile(dir)}.tmp`, `${JSON.stringify(queue, null, 2)}\n`);
  renameSync(`${stateFile(dir)}.tmp`, stateFile(dir));
}
export function alive(pid?: number) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code !== "ESRCH";
  }
}
export function parseMatrix(value: unknown): Entry[] {
  if (!Array.isArray(value) || !value.length)
    throw Error("Matrix must be a nonempty array");
  return value.map((row, i) => {
    if (
      !row ||
      typeof row !== "object" ||
      typeof row.model !== "string" ||
      !/^(claude|codex):[\w.-]+$/.test(row.model) ||
      (row.effort != null &&
        (typeof row.effort !== "string" || !/^[\w-]+$/.test(row.effort))) ||
      Object.keys(row).some((key) => !["model", "effort"].includes(key))
    )
      throw Error(
        `Invalid matrix entry ${i + 1}: expected model and optional effort`,
      );
    parseModelSpec(row.model);
    return { model: row.model, effort: row.effort ?? null, status: "queued" };
  });
}
export function createQueue(
  matrix: unknown,
  prompt: string,
  noPush: boolean,
  repoRoot = root,
) {
  const entries = parseMatrix(matrix);
  renderPrompt(prompt, "app");
  const parent = join(repoRoot, "output/bench-queues");
  mkdirSync(parent, { recursive: true });
  const dir = mkdtempSync(
    join(parent, `${new Date().toISOString().replace(/[:.]/g, "-")}-`),
  );
  save(dir, { root: repoRoot, prompt, noPush, entries });
  return dir;
}
function info(dir: string, i: number) {
  const file = join(dir, `${i + 1}.run.json`);
  return existsSync(file) ? read<RunInfo>(file) : null;
}
function result(queue: Queue, run: RunInfo | null) {
  const file = run && join(queue.root, "bench/results", run.id, "result.json");
  return file && existsSync(file) ? read<RunResult>(file) : null;
}
function completed(queue: Queue, entry: Entry, run: RunInfo | null) {
  const saved = result(queue, run);
  const model = parseModelSpec(entry.model);
  return (
    !!saved &&
    !!run &&
    saved.id === run.id &&
    saved.task === "app" &&
    saved.prompt === queue.prompt &&
    saved.runner === model.runner.name &&
    saved.model === model.model &&
    saved.effort === entry.effort &&
    saved.status === "completed" &&
    saved.verify?.built === true
  );
}
function containerRunning(id: string) {
  const check = spawnSync(
    "docker",
    ["container", "ls", "--filter", `name=^/${id}$`, "--format", "{{.Names}}"],
    { encoding: "utf8" },
  );
  if (check.status !== 0)
    throw Error(
      `Cannot check container ${id}; restore Docker access before resuming`,
    );
  return check.stdout.trim() === id;
}

export async function runQueue(
  dir: string,
  retry = false,
  options: {
    command?: string[];
    containerRunning?: (id: string) => boolean;
  } = {},
) {
  const lock = join(dir, "lock");
  if (existsSync(lock)) {
    const owner = readFileSync(lock, "utf8").trim();
    if (!owner || alive(Number(owner))) throw Error("Queue is already running");
    unlinkSync(lock);
  }
  const fd = openSync(lock, "wx");
  writeFileSync(fd, String(process.pid));
  let interrupted = false;
  let child: ReturnType<typeof spawn> | undefined;
  const stop = () => {
    interrupted = true;
    child?.kill("SIGINT");
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  try {
    const queue = read<Queue>(stateFile(dir));
    // Check every previous attempt before starting any additional work.
    for (const [i, entry] of queue.entries.entries()) {
      if (entry.status === "queued") continue;
      const run = info(dir, i);
      if (
        entry.status !== "completed" &&
        (alive(entry.pid) ||
          (run && (options.containerRunning ?? containerRunning)(run.id)))
      )
        throw Error(`Entry ${i + 1} is still running; do not retry it`);
      if (entry.status === "running") entry.status = "interrupted";
      if (entry.status === "completed" && !completed(queue, entry, run))
        throw Error(
          `Entry ${i + 1} completed but its saved result is missing or invalid`,
        );
    }
    save(dir, queue);
    for (const [i, entry] of queue.entries.entries()) {
      if (interrupted) break;
      if (entry.status === "completed" || (entry.status !== "queued" && !retry))
        continue;
      const runInfo = join(dir, `${i + 1}.run.json`);
      if (existsSync(runInfo)) unlinkSync(runInfo);
      const log = openSync(join(dir, `${i + 1}.log`), "a");
      const [program, ...args] = options.command ?? [
        "bun",
        join(queue.root, "bench/run.ts"),
      ];
      entry.status = "running";
      delete entry.pid;
      save(dir, queue);
      try {
        child = spawn(
          program,
          [
            ...args,
            "--model",
            entry.model,
            "--prompt",
            queue.prompt,
            ...(entry.effort ? ["--effort", entry.effort] : []),
            ...(queue.noPush ? ["--no-push"] : []),
            "--run-info",
            runInfo,
          ],
          { cwd: queue.root, stdio: ["ignore", log, log] },
        );
        entry.pid = child.pid;
        save(dir, queue);
        console.log(
          `${i + 1}/${queue.entries.length} ${entry.model} ${entry.effort ?? "default"}`,
        );
        const code = await new Promise<number | null>((done, reject) => {
          child?.once("error", reject);
          child?.once("close", done);
        });
        entry.status = interrupted
          ? "interrupted"
          : code === 0 && completed(queue, entry, info(dir, i))
            ? "completed"
            : "failed";
      } catch (error) {
        entry.status = interrupted ? "interrupted" : "failed";
        console.error(
          `Entry ${i + 1}: ${error instanceof Error ? error.message : String(error)}`,
        );
      } finally {
        closeSync(log);
        if (!interrupted) delete entry.pid;
        save(dir, queue);
      }
    }
    return (
      !interrupted &&
      queue.entries.every((entry) => entry.status === "completed")
    );
  } finally {
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
    closeSync(fd);
    unlinkSync(lock);
  }
}

export function queueStatus(dir: string, staleMinutes = 15, now = Date.now()) {
  const queue = read<Queue>(stateFile(dir));
  return queue.entries.map((entry, i) => {
    const run = info(dir, i);
    let status: string = entry.status;
    if (entry.status === "running") {
      if (!alive(entry.pid)) status = "interrupted (check Docker before retry)";
      else {
        const files = [join(dir, `${i + 1}.log`), run?.transcript].filter(
          (file): file is string => !!file && existsSync(file),
        );
        const last = Math.max(...files.map((file) => statSync(file).mtimeMs));
        if (now - last > staleMinutes * 60_000)
          status = "running (possibly stalled: no recent log activity)";
      }
    }
    return `${i + 1}. ${status} | ${entry.model} | ${entry.effort ?? "default"}${run ? ` | ${run.id}` : ""}`;
  });
}

if (import.meta.main) {
  const command = process.argv[2];
  const { values } = parseArgs({
    args: process.argv.slice(3),
    options: {
      matrix: { type: "string" },
      prompt: { type: "string" },
      resume: { type: "string" },
      retry: { type: "boolean", default: false },
      "no-push": { type: "boolean", default: false },
      queue: { type: "string" },
      "stale-minutes": { type: "string", default: "15" },
    },
  });
  if (command === "run") {
    if (
      (!values.matrix && !values.resume) ||
      (values.matrix && values.resume) ||
      (values.retry && !values.resume) ||
      (values.resume && (values.prompt || values["no-push"]))
    )
      throw Error(
        "Use --matrix <file> [--prompt v2] [--no-push], or --resume <queue-dir> [--retry]",
      );
    const dir = values.resume
      ? resolve(values.resume)
      : createQueue(
          read(values.matrix as string),
          values.prompt ?? "v2",
          values["no-push"],
        );
    console.log(`Queue: ${dir}`);
    if (!(await runQueue(dir, values.retry))) process.exitCode = 1;
  } else if (command === "status") {
    const minutes = Number(values["stale-minutes"]);
    if (!Number.isFinite(minutes) || minutes <= 0)
      throw Error("--stale-minutes must be positive");
    const parent = join(root, "output/bench-queues");
    const dirs = values.queue
      ? [resolve(values.queue)]
      : existsSync(parent)
        ? readdirSync(parent)
            .sort()
            .map((name) => join(parent, name))
        : [];
    for (const dir of dirs)
      console.log(`${dir}\n${queueStatus(dir, minutes).join("\n")}\n`);
    if (!dirs.length)
      console.log(
        "No saved queues. Start with bun run bench:queue -- --matrix <file>.",
      );
    const counts: Record<string, number> = {};
    for (const dir of readdirSync(join(root, "bench/results"))) {
      const file = join(root, "bench/results", dir, "result.json");
      if (!existsSync(file)) continue;
      const saved = read<RunResult>(file);
      if (saved.task === "app")
        counts[saved.status] = (counts[saved.status] ?? 0) + 1;
    }
    console.log(
      `Stored app results: ${Object.entries(counts)
        .map(([status, n]) => `${n} ${status}`)
        .join(", ")}`,
    );
  } else throw Error("Expected run or status");
}
