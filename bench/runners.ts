import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export type Completion = {
  text: string;
  usage: Record<string, number>;
  toolCalls: number;
};
export type Request = {
  model: string;
  effort: string | null;
  system: string;
  user: string;
};
export type Runner = {
  name: "claude" | "codex";
  version: () => string;
  argv: (request: Request) => string[];
  parse: (stdout: string) => Completion;
};

/** A CLI failure. `fatal` means the whole run should stop (auth, usage limit). */
export class CliError extends Error {
  constructor(
    message: string,
    public fatal = /limit|quota|429|unauthori[sz]ed|not logged in|login/i.test(
      message,
    ),
  ) {
    super(message);
    this.name = "CliError";
  }
}

const TIMEOUT_MS = 15 * 60_000;
const scratch = () => mkdtempSync(join(tmpdir(), "logomocja-bench-"));

function versionOf(command: string, pick: (output: string) => string) {
  const run = spawnSync(command, ["--version"], { encoding: "utf8" });
  if (run.status !== 0) throw new CliError(`${command} --version failed`, true);
  return pick(run.stdout.trim());
}

type ClaudeJson = {
  type?: string;
  is_error?: boolean;
  result?: string;
  num_turns?: number;
  usage?: Record<string, unknown>;
};
export const claude: Runner = {
  name: "claude",
  version: () => versionOf("claude", (out) => out.split(/\s+/)[0]),
  argv: ({ model, effort, system }) => [
    "claude",
    "-p",
    "--bare",
    "--restricted",
    "--tools",
    "",
    "--setting-sources",
    "",
    "--no-session-persistence",
    "--output-format",
    "json",
    "--model",
    model,
    ...(effort ? ["--effort", effort] : []),
    "--system-prompt",
    system,
  ],
  parse: (stdout) => {
    let json: ClaudeJson;
    try {
      json = JSON.parse(stdout) as ClaudeJson;
    } catch {
      throw new CliError(`claude returned non-JSON output: ${stdout.slice(0, 300)}`);
    }
    if (json.is_error || typeof json.result !== "string")
      throw new CliError(`claude failed: ${json.result ?? stdout.slice(0, 300)}`);
    const usage = json.usage ?? {};
    const numeric = (key: string) =>
      typeof usage[key] === "number" ? (usage[key] as number) : 0;
    return {
      text: json.result,
      usage: {
        input: numeric("input_tokens"),
        cachedInput:
          numeric("cache_read_input_tokens") +
          numeric("cache_creation_input_tokens"),
        output: numeric("output_tokens"),
        reasoning:
          (usage.output_tokens_details as { thinking_tokens?: number })
            ?.thinking_tokens ?? 0,
      },
      toolCalls: Math.max(0, (json.num_turns ?? 1) - 1),
    };
  },
};

type CodexEvent = {
  type: string;
  item?: { type: string; text?: string; message?: string };
  usage?: Record<string, number>;
  error?: { message: string };
  message?: string;
};
export const codex: Runner = {
  name: "codex",
  version: () => versionOf("codex", (out) => out.split(/\s+/).at(-1) ?? out),
  argv: ({ model, effort, system }) => {
    const instructions = join(scratch(), "instructions.md");
    writeFileSync(instructions, `${system}\n`);
    return [
      "codex",
      "exec",
      "--ignore-user-config",
      "--ignore-rules",
      "--ephemeral",
      "--skip-git-repo-check",
      "--sandbox",
      "read-only",
      "--json",
      "--color",
      "never",
      "-c",
      `model_instructions_file=${JSON.stringify(instructions)}`,
      ...(effort ? ["-c", `model_reasoning_effort=${JSON.stringify(effort)}`] : []),
      "--model",
      model,
      "-",
    ];
  },
  parse: (stdout) => {
    const events = stdout
      .split("\n")
      .filter((line) => line.startsWith("{"))
      .map((line) => JSON.parse(line) as CodexEvent);
    const failed =
      events.find((e) => e.type === "turn.failed") ??
      events.find((e) => e.type === "error");
    if (failed)
      throw new CliError(`codex failed: ${failed.error?.message ?? failed.message}`);
    const items = events
      .filter((e) => e.type === "item.completed" && e.item)
      .map((e) => e.item as NonNullable<CodexEvent["item"]>);
    const message = items.filter((item) => item.type === "agent_message").at(-1);
    if (!message?.text) throw new CliError("codex produced no agent message");
    const usage = events.find((e) => e.type === "turn.completed")?.usage ?? {};
    return {
      text: message.text,
      usage: {
        input: usage.input_tokens ?? 0,
        cachedInput: usage.cached_input_tokens ?? 0,
        output: usage.output_tokens ?? 0,
        reasoning: usage.reasoning_output_tokens ?? 0,
      },
      toolCalls: items.filter(
        (item) => !["agent_message", "reasoning", "error"].includes(item.type),
      ).length,
    };
  },
};

export const runners: Record<Runner["name"], Runner> = { claude, codex };

/** Runs one completion through a CLI in an empty working directory. */
export function complete(
  runner: Runner,
  request: Request,
): { argv: string[]; completion: Completion; latencyMs: number } {
  const argv = runner.argv(request);
  const started = performance.now();
  const run = spawnSync(argv[0], argv.slice(1), {
    input: request.user,
    encoding: "utf8",
    cwd: scratch(),
    timeout: TIMEOUT_MS,
    maxBuffer: 64 * 1024 * 1024,
  });
  const latencyMs = Math.round(performance.now() - started);
  if (run.error) throw new CliError(`${runner.name}: ${run.error.message}`);
  if (run.status !== 0 && !run.stdout.trim())
    throw new CliError(
      `${runner.name} exited with ${run.status}: ${run.stderr.trim().slice(0, 500)}`,
    );
  return { argv, completion: runner.parse(run.stdout), latencyMs };
}
