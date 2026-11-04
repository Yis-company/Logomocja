import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { RunResult } from "./result";
import type { Task } from "./prompt";

export type Layer = NonNullable<RunResult["layer"]>;
const directory = fileURLToPath(new URL("./layers/", import.meta.url));

export function loadLayer(id?: string, task: Task = "app"): Layer | null {
  if (!id || id === "base") return null;
  if (!["impeccable-v1", "tdd-v1", "impeccable-tdd-v1"].includes(id))
    throw Error(`Unknown benchmark layer: ${id}`);
  if (task !== "app")
    throw Error("Benchmark layers are only supported for app runs");
  return JSON.parse(readFileSync(join(directory, id, "manifest.json"), "utf8"));
}

export function layerPrompt(base: string, layer: Layer | null): string {
  if (!layer) return base;
  const tdd = layer.tddSourceCommit
    ? readFileSync(join(directory, "tdd-v1/instructions.md"), "utf8")
    : "";
  if (layer.id === "tdd-v1")
    return `${base}\n## Benchmark layer: ${layer.id}\n\n${tdd}`;
  return (
    `${base}\n## Benchmark layer: ${layer.id}\n\n` +
    `Use Impeccable ${layer.skillVersion} throughout building this app. First read /bench/layers/impeccable-v1/skill/SKILL.md and follow its applicable references. Its base directory is /bench/layers/impeccable-v1/skill. Run its context loader from /work.\n\n` +
    "This benchmark explicitly authorizes you to infer all audience, design and implementation decisions from the product brief and proceed without human interviews, approval pages or questions. Build an Operate surface. You have no incumbent design to preserve. Do not inspect other benchmark builds, results or source for inspiration.\n\n" +
    "Use the same CLI tools available in this container. Native image generation, MCP browser controls and delegated agents are unavailable: use the skill's documented in-thread/degraded workflows where applicable, and report tool limitations honestly. Do not call another model or require external services. Do not update the frozen skill or engine; ignore update-offer directives. Keep all shipping assets local. Finish the app, perform the applicable finish review and document the resulting design. The product brief's language, features and delivery contract remain authoritative.\n" +
    (tdd ? `\n${tdd}` : "")
  );
}

/** Install the pinned Linux engine once, before starting any model. */
export function prepareLayer(
  layer: Layer | null,
  root: string,
  image: string,
): string[] {
  if (!layer?.engineVersion) return [];
  const cache = join(root, "output/bench-tools/impeccable-v1");
  mkdirSync(cache, { recursive: true });
  const skill = "/bench/layers/impeccable-v1/skill";
  const output = execFileSync(
    "docker",
    [
      "run",
      "--rm",
      "-v",
      `${join(root, "bench")}:/bench:ro`,
      "-v",
      `${cache}:/home/agent/.impeccable`,
      image,
      `${skill}/scripts/impeccable`,
      "engine-probe",
    ],
    { encoding: "utf8", timeout: 180_000 },
  );
  if (output.trim() !== `impeccable-engine ${layer.engineVersion}`)
    throw Error(`Unexpected Impeccable engine: ${output.trim()}`);
  return ["-v", `${cache}:/home/agent/.impeccable:ro`];
}

/** Match historical controls without modifying or rescoring them. */
export function findBaseline(
  root: string,
  match: Pick<RunResult, "prompt" | "env" | "runner" | "model" | "effort">,
): string | null {
  const dir = join(root, "bench/results");
  const runs = readdirSync(dir).flatMap((id) => {
    const file = join(dir, id, "result.json");
    return existsSync(file)
      ? [JSON.parse(readFileSync(file, "utf8")) as RunResult]
      : [];
  });
  return (
    runs
      .filter(
        (r) =>
          !r.layer &&
          r.task === "app" &&
          r.status === "completed" &&
          r.verify?.built &&
          r.prompt === match.prompt &&
          r.env === match.env &&
          r.runner === match.runner &&
          r.model === match.model &&
          r.effort === match.effort,
      )
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0]?.id ?? null
  );
}
