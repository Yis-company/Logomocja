import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Challenge } from "../src/challenges/tasks";

export type Prompt = {
  version: string;
  system: string;
  task: (task: Challenge) => string;
};

export function render(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key];
    if (value === undefined) throw new Error(`Unknown placeholder {{${key}}}`);
    return value;
  });
}

export function loadPrompt(version: string): Prompt {
  if (!/^v\d+$/.test(version))
    throw new Error(`Prompt version must look like v1, got ${version}`);
  const read = (name: string) =>
    readFileSync(
      fileURLToPath(new URL(`./prompts/${version}/${name}`, import.meta.url)),
      "utf8",
    );
  const system = read("system.md").trim();
  const template = read("task.md");
  const reference = read("reference.md").trim();
  return {
    version,
    system,
    task: (task) =>
      render(template, {
        reference,
        id: task.id,
        title: task.title,
        mode: task.mode.toUpperCase(),
        description: task.description,
        contract: task.contract,
        params: task.params.join(", "),
      }).trim(),
  };
}
