import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadPrograms } from "./programs";

export type Task = "app" | "tests" | "tests-round2";
const files: Record<Task, string> = { app: "spec.md", tests: "tests.md", "tests-round2": "tests-round2.md" };

/** The full prompt for a task: the task brief with the shared sections filled in. */
export function renderPrompt(version: string, task: Task): string {
  if (!/^v\d+$/.test(version))
    throw new Error(`Prompt version must look like v1, got ${version}`);
  const read = (name: string) =>
    readFileSync(
      fileURLToPath(new URL(`./prompts/${version}/${name}`, import.meta.url)),
      "utf8",
    );
  let text = read(files[task]).replace("{{dialect}}", read("dialect.md").trim());
  if (text.includes("{{programs}}"))
    text = text.replace(
      "{{programs}}",
      loadPrograms(version)
        .map((p) => `### ${p.name} (\`${p.id}\`, ${p.mode.toUpperCase()})\n\n${p.description}\n\n\`\`\`logo\n${p.source}\n\`\`\``)
        .join("\n\n"),
    );
  if (text.includes("{{")) throw new Error("Unfilled placeholder in prompt");
  return `${text.trim()}\n`;
}
