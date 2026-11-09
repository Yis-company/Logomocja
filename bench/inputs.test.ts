import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { prepareInputs, readOnlyMount } from "./inputs";
import { layerPrompt, loadLayer } from "./layers";
import { renderPrompt, type Task } from "./prompt";

const root = fileURLToPath(new URL("..", import.meta.url));
const temporary: string[] = [];
const scratch = () => {
  const dir = mkdtempSync(join(tmpdir(), "logomocja-inputs-"));
  temporary.push(dir);
  return dir;
};
afterEach(() => {
  for (const dir of temporary.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("benchmark input boundary", () => {
  it.each(["base", "impeccable-v1", "tdd-v1", "impeccable-tdd-v1"])(
    "%s exposes its runtime and prompt references, excluding evaluations and other conditions",
    (id) => {
      const layer = loadLayer(id);
      const directory = prepareInputs(root, scratch(), layer);
      for (const file of ["agent.ts", "prices.ts", "runners.ts", "result.ts"])
        expect(readFileSync(join(directory, file))).toEqual(readFileSync(join(root, "bench", file)));
      const impeccable = id === "impeccable-v1" || id === "impeccable-tdd-v1";
      const tdd = id === "tdd-v1" || id === "impeccable-tdd-v1";
      expect(existsSync(join(directory, "layers/impeccable-v1/skill/SKILL.md"))).toBe(impeccable);
      expect(existsSync(join(directory, "layers/tdd-v1/skill/SKILL.md"))).toBe(tdd);
      expect(existsSync(join(directory, "layers/tdd-v1/references/codebase-design/SKILL.md"))).toBe(tdd);
      for (const forbidden of [
        "conformance", "results", "prompts", "queue.ts", "run.ts",
        "layers/impeccable-v1/manifest.json", "layers/impeccable-v1/sol.json",
        "layers/impeccable-v1/opus.json", "layers/tdd-v1/manifest.json",
        "layers/tdd-v1/matrix.json", "layers/impeccable-tdd-v1",
      ]) expect(existsSync(join(directory, forbidden)), forbidden).toBe(false);
      const prompt = layerPrompt(renderPrompt("v2", "app"), layer);
      for (const match of prompt.matchAll(/\/bench\/([\w./-]+)/g)) {
        const path = match[1].replace(/[.,]+$/, "");
        expect(existsSync(join(directory, path)), path).toBe(true);
      }
      expect(readOnlyMount(directory)).toEqual(["-v", `${directory}:/bench:ro`]);
    },
  );

  it.each(["tests", "tests-round2"] as Task[])("keeps %s independent of evaluation/history mounts", (task) => {
    const directory = prepareInputs(root, scratch(), loadLayer(undefined, task));
    expect(existsSync(join(directory, "agent.ts"))).toBe(true);
    expect(existsSync(join(directory, "layers"))).toBe(false);
    expect(existsSync(join(directory, "conformance"))).toBe(false);
    const prompt = renderPrompt("v2", task);
    if (task === "tests-round2") {
      expect(prompt).toContain("round1/own.json");
      expect(prompt).toContain("round1/other.json");
    }
  });

  it("does not follow a selected input symlink into evaluation material", () => {
    const fixture = scratch();
    mkdirSync(join(fixture, "bench/conformance"), { recursive: true });
    writeFileSync(join(fixture, "bench/conformance/private.json"), "private evaluation");
    symlinkSync("conformance/private.json", join(fixture, "bench/agent.ts"));
    expect(() => prepareInputs(fixture, scratch(), null)).toThrow(/symbolic link/);
  });

  it("refuses a reused stage that could retain inputs from another condition", () => {
    const directory = scratch();
    prepareInputs(root, directory, loadLayer("impeccable-v1"));
    expect(() => prepareInputs(root, directory, null)).toThrow();
  });

  it("mounts only the selected engine skill read-only", () => {
    expect(readOnlyMount("/selected/skill", "/bench/layers/impeccable-v1/skill")).toEqual([
      "-v", "/selected/skill:/bench/layers/impeccable-v1/skill:ro",
    ]);
  });
});
