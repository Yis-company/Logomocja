import type { RunStatus, Tokens } from "./result";

export type Parsed = {
  tokens: Tokens;
  costUsd: number | null;
  turns: number;
  toolCalls: number;
  status: RunStatus;
  detail: string;
  finalText: string;
};
export type Runner = {
  name: "claude" | "codex";
  version: (output: string) => string;
  argv: (options: { model: string; effort: string | null }) => string[];
  parse: (transcript: string) => Parsed;
};

const limited = (text: string) => /limit|quota|429|rate/i.test(text);
const lines = (transcript: string): unknown[] =>
  transcript
    .split("\n")
    .filter((line) => line.startsWith("{"))
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as unknown];
      } catch {
        return [];
      }
    });
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};
const num = (value: unknown) => (typeof value === "number" ? value : 0);

export const claude: Runner = {
  name: "claude",
  version: (output) => output.trim().split(/\s+/)[0],
  // Prompt goes on stdin. Not --bare: it would skip CLAUDE_CODE_OAUTH_TOKEN.
  argv: ({ model, effort }) => [
    "claude",
    "-p",
    "--permission-mode",
    "bypassPermissions",
    "--dangerously-skip-permissions",
    "--setting-sources",
    "",
    "--no-session-persistence",
    "--output-format",
    "stream-json",
    "--verbose",
    "--model",
    model,
    ...(effort ? ["--effort", effort] : []),
  ],
  parse: (transcript) => {
    const events = lines(transcript).map(record);
    let toolCalls = 0;
    for (const event of events) {
      if (event.type !== "assistant") continue;
      const content = record(event.message).content;
      if (Array.isArray(content))
        toolCalls += content.filter((b) => record(b).type === "tool_use").length;
    }
    const result = events.find((event) => event.type === "result");
    if (!result)
      return {
        tokens: { input: 0, cachedInput: 0, output: 0, reasoning: 0 },
        costUsd: null,
        turns: 0,
        toolCalls,
        status: "failed",
        detail: "no result event in transcript",
        finalText: "",
      };
    const tokens = { input: 0, cachedInput: 0, output: 0, reasoning: 0 };
    const byModel = record(result.modelUsage);
    if (Object.keys(byModel).length) {
      for (const entry of Object.values(byModel).map(record)) {
        tokens.input += num(entry.inputTokens);
        tokens.cachedInput +=
          num(entry.cacheReadInputTokens) + num(entry.cacheCreationInputTokens);
        tokens.output += num(entry.outputTokens);
        tokens.reasoning += num(entry.thinkingTokens);
      }
    } else {
      const usage = record(result.usage);
      tokens.input = num(usage.input_tokens);
      tokens.cachedInput =
        num(usage.cache_read_input_tokens) + num(usage.cache_creation_input_tokens);
      tokens.output = num(usage.output_tokens);
      tokens.reasoning = num(record(usage.output_tokens_details).thinking_tokens);
    }
    const finalText = typeof result.result === "string" ? result.result : "";
    const subtype = String(result.subtype ?? "");
    const status: RunStatus =
      subtype === "success" && !result.is_error
        ? "completed"
        : limited(finalText) || subtype.startsWith("error_max")
          ? "partial"
          : "failed";
    return {
      tokens,
      costUsd: typeof result.total_cost_usd === "number" ? result.total_cost_usd : null,
      turns: num(result.num_turns),
      toolCalls,
      status,
      detail: status === "completed" ? subtype : `${subtype}: ${finalText.slice(0, 300)}`,
      finalText,
    };
  },
};

const codexToolItems = new Set([
  "command_execution",
  "file_change",
  "mcp_tool_call",
  "web_search",
]);
export const codex: Runner = {
  name: "codex",
  version: (output) => output.trim().split(/\s+/).at(-1) ?? output.trim(),
  argv: ({ model, effort }) => [
    "codex",
    "exec",
    "--dangerously-bypass-approvals-and-sandbox",
    "--ignore-user-config",
    "--ignore-rules",
    "--ephemeral",
    "--skip-git-repo-check",
    "--json",
    "--color",
    "never",
    "--model",
    model,
    ...(effort ? ["-c", `model_reasoning_effort=${JSON.stringify(effort)}`] : []),
    "-",
  ],
  parse: (transcript) => {
    const events = lines(transcript).map(record);
    const items = events
      .filter((event) => event.type === "item.completed")
      .map((event) => record(event.item));
    const tokens = { input: 0, cachedInput: 0, output: 0, reasoning: 0 };
    let turns = 0;
    for (const event of events) {
      if (event.type !== "turn.completed") continue;
      turns++;
      const usage = record(event.usage);
      // Codex counts cached tokens inside input_tokens; store uncached input.
      tokens.input += num(usage.input_tokens) - num(usage.cached_input_tokens);
      tokens.cachedInput += num(usage.cached_input_tokens);
      tokens.output += num(usage.output_tokens);
      tokens.reasoning += num(usage.reasoning_output_tokens);
    }
    const message = items.filter((item) => item.type === "agent_message").at(-1);
    const finalText = typeof message?.text === "string" ? message.text : "";
    const failure = events.find(
      (event) => event.type === "turn.failed" || event.type === "error",
    );
    const failureText = failure
      ? String(record(failure.error).message ?? failure.message ?? "")
      : "";
    const status: RunStatus = failure
      ? limited(failureText)
        ? "partial"
        : "failed"
      : turns
        ? "completed"
        : "failed";
    return {
      tokens,
      costUsd: null,
      turns,
      toolCalls: items.filter((item) => codexToolItems.has(String(item.type))).length,
      status,
      detail: failure ? failureText.slice(0, 300) : turns ? "turn.completed" : "no turn completed",
      finalText,
    };
  },
};

export const runners: Record<Runner["name"], Runner> = { claude, codex };

export function parseModelSpec(spec: string): { runner: Runner; model: string } {
  const [name, ...rest] = spec.split(":");
  const runner = runners[name as Runner["name"]];
  const model = rest.join(":");
  if (!runner || !model)
    throw new Error(`Model must be claude:<id> or codex:<id>, got "${spec}"`);
  return { runner, model };
}
