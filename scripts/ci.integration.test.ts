import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, it } from "vitest";

const source = resolve(".");
function fixture(inheritedEnv: NodeJS.ProcessEnv = process.env) {
  const env = { ...inheritedEnv };
  // Push hooks export repository-local settings; fixtures own a different repo.
  for (const key of execFileSync("git", ["rev-parse", "--local-env-vars"], {
    encoding: "utf8",
  })
    .trim()
    .split("\n"))
    delete env[key];
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
      env,
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
    dir,
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
          ...env,
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

it("keeps fixture commits and configuration out of an inherited Git repository", () => {
  const parent = fixture();
  const files = ["config", "refs/heads/main"].map((file) =>
    join(parent.dir, ".git", file),
  );
  const before = files.map((file) => readFileSync(file, "utf8"));
  expect(() =>
    fixture({
      ...process.env,
      GIT_DIR: join(parent.dir, ".git"),
      GIT_WORK_TREE: parent.dir,
      GIT_INDEX_FILE: join(parent.dir, ".git/index"),
    }).check("---\n---\n\nMaintenance.\n"),
  ).not.toThrow();
  expect(files.map((file) => readFileSync(file, "utf8"))).toEqual(before);
});
