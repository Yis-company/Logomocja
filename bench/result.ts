export type Tokens = {
  input: number;
  cachedInput: number;
  output: number;
  reasoning: number;
};
export type Verify = {
  installed: boolean;
  built: boolean;
  tests: "pass" | "fail" | "none";
  distFiles: number;
  distBytes: number;
};
export type SuiteScore = { passed: number; total: number; hook: boolean };
export type RunStatus = "completed" | "partial" | "failed";
export type RunResult = {
  schema: 3;
  id: string;
  task: "app" | "tests";
  prompt: string;
  env: string;
  image: string;
  commit: string;
  repoVersion: string;
  runner: "claude" | "codex";
  model: string;
  cliVersion: string;
  effort: string | null;
  startedAt: string;
  agentMs: number;
  totalMs: number;
  status: RunStatus;
  statusDetail: string;
  tokens: Tokens;
  costUsd: number | null;
  /** "cli": reported by the CLI; "list": estimated from bench/prices.ts. */
  costBasis: "cli" | "list" | null;
  turns: number;
  toolCalls: number;
  verify: Verify | null;
  conformance: Record<string, SuiteScore> | null;
  cases: number | null;
  humanScore: number | null;
  notes: string;
};
