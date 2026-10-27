import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { type Case, compareCase, type Outcome, parseSuite, type Segment } from "./conformance/compare";
import { cost } from "./prices";
import { renderPrompt } from "./prompt";
import { claude, codex, parseModelSpec } from "./runners";

const fixture = (name: string) =>
  readFileSync(fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url)), "utf8");

describe("prompts", () => {
  it("renders both briefs with the shared dialect and the hook contract", () => {
    const app = renderPrompt("v1", "app");
    const tests = renderPrompt("v1", "tests");
    for (const text of [app, tests]) {
      expect(text).toContain("| `np`, `naprzod`, `naprzód` |");
      expect(text).toContain("run(source, mode)");
      expect(text).not.toContain("{{");
    }
    expect(app).toContain("window.logomocja");
    expect(app).toContain("BASE_PATH");
    expect(tests).toContain("cases.json");
    expect(() => renderPrompt("../x", "app")).toThrow(/v1/);
  });
});

describe("runners", () => {
  it("builds autonomous argv for both CLIs and parses model specs", () => {
    expect(claude.argv({ model: "m", effort: "high" })).toEqual(
      expect.arrayContaining(["--dangerously-skip-permissions", "--setting-sources", "", "--output-format", "stream-json", "--model", "m", "--effort", "high"]),
    );
    expect(codex.argv({ model: "m", effort: null })).toEqual(
      expect.arrayContaining(["--dangerously-bypass-approvals-and-sandbox", "--ignore-user-config", "--json", "--model", "m", "-"]),
    );
    expect(parseModelSpec("codex:gpt-6-astra").model).toBe("gpt-6-astra");
    expect(() => parseModelSpec("gemini:x")).toThrow(/claude/);
  });

  it("parses a Claude stream-json transcript", () => {
    expect(claude.parse(fixture("claude-stream.jsonl"))).toEqual({
      tokens: { input: 130, cachedInput: 4500, output: 910, reasoning: 300 },
      costUsd: 1.25,
      turns: 3,
      toolCalls: 3,
      status: "completed",
      detail: "success",
      finalText: "Done. The app is in dist/.",
    });
    expect(claude.parse('{"type":"result","subtype":"error_max_turns","is_error":true,"result":"","num_turns":9}').status).toBe("partial");
    expect(claude.parse('{"type":"result","subtype":"success","is_error":true,"result":"You have hit your usage limit"}').status).toBe("partial");
    expect(claude.parse("").status).toBe("failed");
  });

  it("parses a Codex JSONL transcript", () => {
    expect(codex.parse(fixture("codex-exec.jsonl"))).toEqual({
      tokens: { input: 10000, cachedInput: 40000, output: 7000, reasoning: 2500 },
      costUsd: null,
      turns: 1,
      toolCalls: 2,
      status: "completed",
      detail: "turn.completed",
      finalText: "Built the app.",
    });
    expect(codex.parse('{"type":"turn.failed","error":{"message":"rate limit reached"}}').status).toBe("partial");
    expect(codex.parse('{"type":"error","message":"boom"}').status).toBe("failed");
  });
});

describe("cost", () => {
  it("keeps the CLI figure, else prices tokens from the table", () => {
    const tokens = { input: 1_000_000, cachedInput: 2_000_000, output: 100_000, reasoning: 0 };
    expect(cost("gpt-6-astra", { costUsd: 1.25, tokens })).toEqual({ costUsd: 1.25, costBasis: "cli" });
    expect(cost("gpt-6-astra", { costUsd: null, tokens })).toEqual({ costUsd: 17, costBasis: "list" });
    expect(cost("unknown", { costUsd: null, tokens })).toEqual({ costUsd: null, costBasis: null });
  });
});

describe("conformance", () => {
  const segments: Segment[] = [
    { from: [0, 0, 0], to: [0, 10, 0], color: "#16866a", width: 3 },
    { from: [0, 10, 0], to: [10, 10, 0], color: "#16866a", width: 3 },
    { from: [10, 10, 0], to: [10, 0, 0], color: "#16866a", width: 3 },
    { from: [10, 0, 0], to: [0, 0, 0], color: "#16866a", width: 3 },
  ];
  const square: Case = { name: "square", mode: "2d", source: "powtorz 4 [np 10 pw 90]", expect: { segments } };
  const drawn: Outcome = { segments, error: null };

  it("validates suite files", () => {
    expect(parseSuite({ cases: [square, { name: "e", mode: "3d", source: "x", expect: { error: { line: 1 } } }] })).toHaveLength(2);
    expect(() => parseSuite({ cases: [{ name: "bad", mode: "2d", source: "", expect: {} }] })).toThrow(/segments or error/);
    expect(() => parseSuite({})).toThrow(/cases/);
  });

  it("accepts tolerance and colour case, rejects count, order, position and error mismatches", () => {
    expect(compareCase(square, { ...drawn, segments: drawn.segments.map((s) => ({ ...s, color: "#16866A", to: [s.to[0] + 0.00001, s.to[1], 0] })) })).toBeNull();
    expect(compareCase(square, { segments: drawn.segments.slice(1), error: null })).toMatch(/expected 4 segments, got 3/);
    expect(compareCase(square, { segments: [...drawn.segments].reverse(), error: null })).toMatch(/segment 0/);
    expect(compareCase(square, { segments: drawn.segments.map((s) => ({ ...s, width: 2 })), error: null })).toMatch(/width/);
    expect(compareCase(square, { segments: [], error: { message: "x", line: 1, column: 1 } })).toMatch(/unexpected error/);
    const errorCase: Case = { ...square, expect: { error: { line: 2, column: 1 } } };
    expect(compareCase(errorCase, { segments: [], error: { message: "x", line: 2, column: 1 } })).toBeNull();
    expect(compareCase(errorCase, { segments: [], error: { message: "x", line: 1, column: 1 } })).toMatch(/line 2/);
    expect(compareCase(errorCase, drawn)).toMatch(/expected an error/);
    const runtime: Case = { ...square, expect: { error: { line: 2 }, segments: segments.slice(0, 1) } };
    expect(compareCase(runtime, { segments: segments.slice(0, 1), error: { message: "x", line: 2, column: 1 } })).toBeNull();
    expect(compareCase(runtime, { segments, error: { message: "x", line: 2, column: 1 } })).toMatch(/expected 1 segments/);
  });
});
