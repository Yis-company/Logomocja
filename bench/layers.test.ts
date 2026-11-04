import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { findBaseline, layerPrompt, loadLayer, prepareLayer } from "./layers";
import { renderPrompt } from "./prompt";

vi.mock("node:child_process", () => ({
  execFileSync: vi.fn(() => "impeccable-engine 0.1.16\n"),
}));

describe("benchmark layers", () => {
  beforeEach(() => vi.clearAllMocks());
  it("leaves base prompts byte-for-byte unchanged and validates opt-in layers", () => {
    const base = renderPrompt("v2", "app");
    expect(layerPrompt(base, loadLayer())).toBe(base);
    expect(layerPrompt(base, loadLayer("base"))).toBe(base);
    expect(() => loadLayer("../other")).toThrow(/Unknown/);
    expect(() => loadLayer("impeccable-v1", "tests")).toThrow(/only supported for app/);
  });
  it("adds the frozen skill and unattended authorization after the unchanged brief", () => {
    const base = renderPrompt("v2", "app");
    const prompt = layerPrompt(base, loadLayer("impeccable-v1"));
    expect(prompt.startsWith(base)).toBe(true);
    expect(prompt).toContain("/bench/layers/impeccable-v1/skill/SKILL.md");
    expect(prompt).toContain("without human interviews");
    expect(prompt).toContain("Do not call another model");
    expect(prompt).toBe(readFileSync("bench/results/v2-e2-impeccable-v1-codex-gpt-6.1-sol-20261103-034140Z/prompt.md", "utf8"));
  });
  it("gives both TDD conditions identical testing guidance, adding Impeccable only to the combined condition", () => {
    const base = renderPrompt("v2", "app");
    const tdd = layerPrompt(base, loadLayer("tdd-v1"));
    const combined = layerPrompt(base, loadLayer("impeccable-tdd-v1"));
    const instructions = readFileSync("bench/layers/tdd-v1/instructions.md", "utf8");
    for (const prompt of [tdd, combined]) {
      expect(prompt.startsWith(base)).toBe(true);
      expect(prompt.endsWith(instructions)).toBe(true);
      expect(prompt).toContain("/bench/layers/tdd-v1/skill/SKILL.md");
      expect(prompt).toContain("explicitly approved these public testing boundaries");
    }
    expect(tdd).not.toContain("Use Impeccable");
    expect(combined).toContain("/bench/layers/impeccable-v1/skill/SKILL.md");
    expect(loadLayer("tdd-v1")?.tddSourceCommit).toBe(loadLayer("impeccable-tdd-v1")?.tddSourceCommit);
  });
  it.each(["tdd-v1", "impeccable-tdd-v1"])("rejects %s on test-author tasks", (id) => {
    expect(() => loadLayer(id, "tests")).toThrow(/only supported for app/);
    expect(() => loadLayer(id, "tests-round2")).toThrow(/only supported for app/);
  });
  it("prepares the frozen engine only for Impeccable conditions, sharing its read-only cache", () => {
    const root = mkdtempSync(join(tmpdir(), "logomocja-layer-"));
    expect(prepareLayer(null, root, "image")).toEqual([]);
    expect(prepareLayer(loadLayer("tdd-v1"), root, "image")).toEqual([]);
    expect(execFileSync).not.toHaveBeenCalled();
    const base = prepareLayer(loadLayer("impeccable-v1"), root, "image");
    const combined = prepareLayer(loadLayer("impeccable-tdd-v1"), root, "image");
    expect(combined).toEqual(base);
    expect(combined).toEqual(["-v", `${root}/output/bench-tools/impeccable-v1:/home/agent/.impeccable:ro`]);
    expect(execFileSync).toHaveBeenLastCalledWith("docker", expect.arrayContaining([
      "/bench/layers/impeccable-v1/skill/scripts/impeccable", "engine-probe",
    ]), expect.any(Object));
  });
  it("matches the historical control by model, effort, prompt and environment", () => {
    const match = { prompt: "v2", env: "2", runner: "codex" as const, model: "gpt-6.1-sol", effort: "high" };
    expect(findBaseline(process.cwd(), match)).toBe("v2-e2-codex-gpt-6.1-sol-20261028-075037Z");
    expect(findBaseline(process.cwd(), { ...match, effort: "not-an-effort" })).toBeNull();
  });
});
