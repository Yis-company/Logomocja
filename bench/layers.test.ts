import { describe, expect, it } from "vitest";
import { findBaseline, layerPrompt, loadLayer } from "./layers";
import { renderPrompt } from "./prompt";

describe("design benchmark layer", () => {
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
  });
  it("matches the historical control by model, effort, prompt and environment", () => {
    const match = { prompt: "v2", env: "2", runner: "codex" as const, model: "gpt-6.1-sol", effort: "high" };
    expect(findBaseline(process.cwd(), match)).toBe("v2-e2-codex-gpt-6.1-sol-20261028-075037Z");
    expect(findBaseline(process.cwd(), { ...match, effort: "not-an-effort" })).toBeNull();
  });
});
