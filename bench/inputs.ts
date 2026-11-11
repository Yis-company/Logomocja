import { chmodSync, cpSync, lstatSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Layer } from "./layers";

export function readOnlyMount(source: string, target = "/bench"): string[] {
  return ["-v", `${source}:${target}:ro`];
}

/** Give the container access to a host-owned output directory without opening it to everyone. */
export function writableMount(source: string, target: string): string[] {
  const stat = lstatSync(source);
  if (!stat.isDirectory() || stat.uid !== process.getuid?.() || stat.gid === 0)
    throw Error(`Writable benchmark mount requires a host-owned directory with a non-root group: ${source}`);
  chmodSync(source, 0o770);
  return ["--group-add", String(stat.gid), "-v", `${source}:${target}`];
}

// Frozen skills may contain directories, but never links to host-side evidence.
function rejectLinks(path: string): void {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw Error(`Benchmark input is a symbolic link: ${path}`);
  if (stat.isDirectory())
    for (const entry of readdirSync(path)) rejectLinks(join(path, entry));
}

/** Stage only the runtime closure and this condition's frozen references. */
export function prepareInputs(root: string, scratch: string, layer: Layer | null): string {
  const destination = join(scratch, "bench");
  mkdirSync(destination);
  const paths = ["agent.ts", "prices.ts", "runners.ts", "result.ts"];
  if (layer?.engineVersion) paths.push("layers/impeccable-v1/skill");
  if (layer?.tddSourceCommit) paths.push("layers/tdd-v1/skill", "layers/tdd-v1/references");
  for (const path of paths) {
    const source = join(root, "bench", path);
    rejectLinks(source);
    const target = join(destination, path);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(source, target, { recursive: true });
  }
  return destination;
}
