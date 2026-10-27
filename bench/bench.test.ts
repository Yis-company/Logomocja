import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { challenges } from "../src/challenges/tasks";
import { extractCode } from "./extract";
import { loadPrompt, render } from "./prompt";
import { renderSummary } from "./report";
import { claude, CliError, codex } from "./runners";
import {
  judgeSample,
  type RunResult,
  resultFileName,
  type Sample,
  summarize,
} from "./score";

const fixture = (name: string) =>
  readFileSync(fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url)), "utf8");
const task = (id: string) => {
  const found = challenges.find((item) => item.id === id);
  if (!found) throw new Error(`Missing task ${id}`);
  return found;
};
const solutions: Record<string, string> = {
  kwadrat: "oto kwadrat ma: x\npowtorz 4 [np x pw 90]\njuż",
  gwiazda: "oto gwiazda ma: x\npowtorz 5 [np x pw 144]\njuż",
  schody: "oto schody ma: ile, dl\npowtorz ile [np dl pw 90 np dl lw 90]\njuż",
  rzad: "oto rzad ma: ile, dl\npowtorz ile [powtorz 4 [np dl pw 90] pod pw 90 np dl np dl lw 90 opu]\njuż",
  rozeta: "oto rozeta ma: dl\npowtorz 8 [powtorz 4 [np dl pw 90] lw 45]\njuż",
  schody3d: "oto schody3d ma: ile, dl, h\npowtorz ile [np dl gora 90 np h dol 90]\njuż",
};

describe("prompt", () => {
  it("renders placeholders and rejects unknown ones", () => {
    expect(render("a {{x}} b", { x: "1" })).toBe("a 1 b");
    expect(() => render("{{nope}}", {})).toThrow(/nope/);
  });

  it("builds the v1 prompt from the task's own text and the language reference", () => {
    const prompt = loadPrompt("v1");
    expect(prompt.system).toMatch(/```logo|`logo`/);
    for (const challenge of challenges) {
      const text = prompt.task(challenge);
      expect(text).toContain(challenge.description);
      expect(text).toContain(challenge.contract);
      expect(text).toContain(`\`${challenge.id}\``);
      expect(text).toContain(challenge.mode.toUpperCase());
      expect(text).not.toMatch(/\{\{/);
    }
    for (const word of ["np", "ws", "pw", "lw", "pod", "opu", "powtorz", "gora", "dol", "oto", "ma:", "już"])
      expect(prompt.task(task("kwadrat"))).toContain(word);
    expect(() => loadPrompt("../etc")).toThrow(/v1/);
  });
});

describe("extractCode", () => {
  it("prefers the last logo block, then any block, then bare code", () => {
    expect(extractCode("x\n```logo\noto a\njuż\n```\ny")).toBe("oto a\njuż");
    expect(extractCode("```python\nprint(1)\n```\n```logo\noto b\njuż\n```")).toBe("oto b\njuż");
    expect(extractCode("```Logo\noto a\njuż\n```\n```logo\noto c\njuż\n```")).toBe("oto c\njuż");
    expect(extractCode("```\noto d\njuż\n```")).toBe("oto d\njuż");
    expect(extractCode("  oto e ma: x\n  np x\njuż\n")).toBe("oto e ma: x\n  np x\njuż");
    expect(extractCode("I cannot solve this.")).toBeNull();
  });
});

describe("judgeSample", () => {
  it("passes every reference solution headlessly", async () => {
    for (const challenge of challenges) {
      const verdict = await judgeSample(solutions[challenge.id], challenge);
      expect(verdict, challenge.id).toEqual({ passed: true, casesPassed: 6, casesTotal: 6, failure: null });
    }
  });

  it("classifies failures", async () => {
    const square = task("kwadrat");
    expect(await judgeSample(null, square)).toMatchObject({ passed: false, failure: { kind: "no-code" } });
    expect(await judgeSample("oto inne ma: bok\nnp bok\njuż", square)).toMatchObject({ failure: { kind: "parse" } });
    expect(await judgeSample("oto kwadrat ma: bok\npowtorz 4 [np 60 pw 90]\njuż", square)).toMatchObject({
      passed: false,
      casesPassed: 1,
      failure: { kind: "geometry" },
    });
    expect(await judgeSample("oto kwadrat ma: bok\npowtorz 10000 [np 1]\njuż", square)).toMatchObject({
      failure: { kind: "runtime" },
    });
  });
});

describe("runners", () => {
  it("parses Claude Code JSON output", () => {
    const completion = claude.parse(fixture("claude-ok.json"));
    expect(completion).toEqual({
      text: "OK",
      usage: { input: 2, cachedInput: 623, output: 4, reasoning: 0 },
      toolCalls: 0,
    });
    expect(() => claude.parse('{"is_error":true,"result":"Not logged in"}')).toThrow(CliError);
    expect(() => claude.parse("garbage")).toThrow(/non-JSON/);
  });

  it("parses Codex JSONL events and counts tool calls", () => {
    const completion = codex.parse(fixture("codex-ok.jsonl"));
    expect(completion.text).toContain("oto kwadrat");
    expect(completion.usage).toEqual({ input: 13659, cachedInput: 8064, output: 5, reasoning: 0 });
    expect(completion.toolCalls).toBe(1);
    expect(() => codex.parse(fixture("codex-failed.jsonl"))).toThrow(/not supported/);
  });

  it("builds argv that strips host configuration and marks fatal errors", () => {
    const request = { model: "m", effort: "high", system: "SYS", user: "U" };
    const claudeArgv = claude.argv(request);
    expect(claudeArgv).toEqual(expect.arrayContaining(["--restricted", "--tools", "", "--model", "m", "--effort", "high", "--system-prompt", "SYS"]));
    const codexArgv = codex.argv(request);
    expect(claudeArgv).not.toContain("--bare");
    expect(codexArgv).toEqual(expect.arrayContaining(["--ignore-user-config", "--ephemeral", "--model", "m", "-"]));
    const file = codexArgv[codexArgv.indexOf("-c") + 1].replace(/^model_instructions_file=/, "");
    expect(readFileSync(JSON.parse(file), "utf8")).toBe("SYS\n");
    expect(new CliError("You have hit your usage limit").fatal).toBe(true);
    expect(new CliError("timeout").fatal).toBe(false);
  });
});

describe("scoring and report", () => {
  const sample = (overrides: Partial<Sample>): Sample => ({
    index: 0,
    passed: true,
    casesPassed: 6,
    casesTotal: 6,
    failure: null,
    code: "",
    response: "",
    usage: {},
    toolCalls: 0,
    latencyMs: 1000,
    humanScore: null,
    ...overrides,
  });
  const run = (model: string, samples: Sample[]): RunResult => {
    const tasks = [
      { id: "kwadrat", samples },
      { id: "gwiazda", samples: [sample({ latencyMs: 3000 })] },
    ];
    return {
      schema: 1,
      prompt: "v1",
      env: "1",
      image: "logomocja-bench:env-1",
      commit: "abc",
      appVersion: "0.2.0",
      runner: "claude",
      cliVersion: "2.1.310",
      model,
      settings: { effort: null, argv: [] },
      startedAt: "2026-10-26T10:20:30.123Z",
      durationMs: 5000,
      partial: false,
      tasks,
      summary: summarize(tasks),
    };
  };
  const strong = run("strong", [sample({})]);
  const weak = run("weak", [sample({ passed: false, casesPassed: 2, failure: { kind: "geometry", message: "x" } })]);

  it("summarizes strictly per task and partially per case", () => {
    expect(weak.summary).toEqual({ samples: 2, taskPassRate: 0.5, casePassRate: 8 / 12, meanLatencyMs: 2000 });
    expect(resultFileName(strong)).toBe("claude-strong_pv1_e1_2026-10-26T10-20-30Z.json");
  });

  it("ranks runs and lists per-task outcomes", () => {
    const summary = renderSummary([weak, strong]);
    expect(summary.indexOf("| strong |")).toBeLessThan(summary.indexOf("| weak |"));
    expect(summary).toContain("| weak | v1 | 1 | 2/6 geometry | 6/6 |");
    expect(summary).toContain("| strong | 0.2.0 | claude | v1 | 1 | default | 2 | 100% | 100% | 2.0s | 5.0s | 2026-10-26 10:20 |  |");
  });
});
