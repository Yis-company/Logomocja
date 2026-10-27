import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export type Task = "app" | "tests";
const files: Record<Task, string> = { app: "spec.md", tests: "tests.md" };

/** The full prompt for a task: the task brief with the shared dialect section filled in. */
export function renderPrompt(version: string, task: Task): string {
  if (!/^v\d+$/.test(version))
    throw new Error(`Prompt version must look like v1, got ${version}`);
  const read = (name: string) =>
    readFileSync(
      fileURLToPath(new URL(`./prompts/${version}/${name}`, import.meta.url)),
      "utf8",
    );
  const dialect = read("dialect.md").trim();
  const text = read(files[task]).replace("{{dialect}}", dialect);
  if (text.includes("{{")) throw new Error("Unfilled placeholder in prompt");
  return `${text.trim()}\n`;
}
