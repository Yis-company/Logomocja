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
export type QualityFamily = "complexity" | "defects" | "types";
/** Lint findings under the frozen q1 ruleset (bench/quality.ts). Q = complexity + defects. */
export type Quality =
  | {
      version: "q1";
      q: number;
      /** TypeScript-only findings; null for JavaScript apps. */
      types: number | null;
      families: Record<QualityFamily, number>;
      rules: Record<string, number>;
      loc: number;
      language: "ts" | "js";
      files: string[];
    }
  | { version: "q1"; q: null; reason: "no source" | "not an app task" | "scan failed" };
export type RunStatus = "completed" | "partial" | "failed";
export type RunResult = {
  schema: 4;
  id: string;
  task: "app" | "tests" | "tests-round2";
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
  /** Standard programs captured through `open`: whether each matched the reference outcome. */
  gallery: Record<string, boolean> | null;
  cases: number | null;
  humanScore: number | null;
  notes: string;
  /** Missing on historical records and ordinary base runs. */
  layer?: { id: string; skillVersion?: string; engineVersion?: string; tddSourceCommit?: string };
  baselineId?: string | null;
  /** Set after the source import; missing only while a run is being finalized. */
  quality?: Quality;
};
