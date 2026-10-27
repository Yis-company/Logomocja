import index from "../bench/prompts/v2/programs/index.json";
import type { Mode } from "./logo/types";
export type Example = {
  id: string;
  mode: Mode;
  name: string;
  description: string;
  level: string;
  source: string;
};
// The standard programs of the current benchmark prompt are the app's examples.
const sources = import.meta.glob("../bench/prompts/v2/programs/*.logo", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;
export const examples: Example[] = (index as Omit<Example, "source">[]).map((meta) => ({
  ...meta,
  source: sources[`../bench/prompts/v2/programs/${meta.id}.logo`].trimEnd(),
}));
export const defaults: Record<Mode, string> = {
  "2d": examples.find((e) => e.id === "rozeta")?.source ?? "",
  "3d": examples.find((e) => e.id === "schody")?.source ?? "",
};
