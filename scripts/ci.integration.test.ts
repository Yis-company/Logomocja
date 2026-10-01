import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, it } from "vitest";

const source = resolve(".");
function fixture() {
  const dir = mkdtempSync(join(tmpdir(), "logomocja-pr-policy-"));
  for (const file of ["package.json", "bun.lock"])
    cpSync(join(source, file), join(dir, file));
  mkdirSync(join(dir, ".changeset"));
  cpSync(
    join(source, ".changeset/config.json"),
    join(dir, ".changeset/config.json"),
  );
  symlinkSync(join(source, "node_modules"), join(dir, "node_modules"), "dir");
  mkdirSync(join(dir, "scripts"));
  cpSync(join(source, "scripts/ci.ts"), join(dir, "scripts/ci.ts"));
  const git = (...args: string[]) =>
    execFileSync("git", args, {
      cwd: dir,
      encoding: "utf8",
      stdio: "pipe",
    }).trim();
  git("init", "-b", "main");
  git("config", "user.name", "Policy fixture");
  git("config", "user.email", "fixture@example.test");
  writeFileSync(
    join(dir, ".changeset/older.md"),
    '---\n"logomocja": minor\n---\n\nEarlier change.\n',
  );
  git("add", "package.json", "bun.lock", ".changeset");
  git("commit", "-m", "baseline");
  const base = git("rev-parse", "HEAD");
  return {
    check(content?: string, fork = false) {
      if (content !== undefined)
        writeFileSync(join(dir, ".changeset/new.md"), content);
      writeFileSync(join(dir, "feature.txt"), "feature");
      git("add", ".changeset", "feature.txt");
      git("commit", "-m", "new feature");
      const head = git("rev-parse", "HEAD");
      const repo = "Yis-company/Logomocja";
      const event = join(dir, "event.json");
      writeFileSync(
        event,
        JSON.stringify({
          pull_request: {
            number: 1,
            user: { login: "contributor" },
            base: { ref: "main", sha: base, repo: { full_name: repo } },
            head: {
              ref: "feature",
              sha: head,
              repo: { full_name: fork ? "fork/Logomocja" : repo },
            },
            merged: false,
            merge_commit_sha: null,
          },
        }),
      );
      return execFileSync("bun", ["scripts/ci.ts", "pr"], {
        cwd: dir,
        encoding: "utf8",
        stdio: "pipe",
        env: {
          ...process.env,
          GITHUB_EVENT_NAME: "pull_request",
          GITHUB_EVENT_PATH: event,
        },
      });
    },
  };
}
it("an older pending changeset does not satisfy a new feature PR", () => {
  expect(() => fixture().check()).toThrow(/Add a changeset/);
});
it("the actual Changesets CLI accepts an empty maintenance entry", () => {
  expect(() => fixture().check("---\n---\n\nMaintenance.\n")).not.toThrow();
});
it("valid new changesets pass for fork PRs without a privileged token", () => {
  expect(() =>
    fixture().check('---\n"logomocja": patch\n---\n\nFeature.\n', true),
  ).not.toThrow();
});
it("malformed changesets fail through the actual CLI", () => {
  expect(() =>
    fixture().check('---\n"logomocja": wrong\n---\n\nInvalid.\n'),
  ).toThrow();
});
