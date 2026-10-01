import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";

export interface PullRequest {
  number: number;
  state: "open" | "closed";
  user: { login: string };
  base: { ref: string; sha: string; repo: { full_name: string } };
  head: { ref: string; sha: string; repo: { full_name: string } | null };
  merged: boolean;
  merge_commit_sha: string | null;
}
const versionBranch = "changeset-release/main";
const repository = process.env.GITHUB_REPOSITORY ?? "Yis-company/Logomocja";
const git = (...args: string[]) =>
  execFileSync("git", args, { encoding: "utf8" }).trim();
const run = (command: string, args: string[]) =>
  execFileSync(command, args, { stdio: "inherit" });
function requireCondition(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) throw Error(message);
}
export function isVersionPR(pr: PullRequest, repo: string) {
  return (
    pr.user.login === "github-actions[bot]" &&
    pr.base.ref === "main" &&
    pr.base.repo.full_name === repo &&
    pr.head.ref === versionBranch &&
    pr.head.repo?.full_name === repo
  );
}
export function verifyDispatch(
  pr: PullRequest,
  repo: string,
  expected: string,
  checkout: string,
) {
  requireCondition(
    isVersionPR(pr, repo) && pr.state === "open" && !pr.merged,
    "Dispatch requires an open automation version PR",
  );
  requireCondition(
    /^[a-f0-9]{40}$/.test(expected) &&
      pr.head.sha === expected &&
      checkout === expected,
    "Version PR changed since dispatch",
  );
}
export function compareVersions(a: string, b: string) {
  const parse = (version: string) => {
    requireCondition(
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version),
      "Expected a stable semantic version",
    );
    return version.split(".").map(Number);
  };
  const left = parse(a),
    right = parse(b);
  for (let i = 0; i < 3; i++)
    if (left[i] !== right[i]) return Math.sign(left[i] - right[i]);
  return 0;
}
export function isChangeset(path: string) {
  return (
    /^\.changeset\/[^/]+\.md$/.test(path) && path !== ".changeset/README.md"
  );
}
export function verifyAddedChangeset(paths: string[]) {
  requireCondition(
    paths.some(isChangeset),
    "Add a changeset for this PR (empty maintenance changesets are valid)",
  );
}
export function releaseSHA(pr: PullRequest, repo: string) {
  requireCondition(
    isVersionPR(pr, repo) && pr.merged && pr.merge_commit_sha,
    "Release requires a merged automation version PR",
  );
  requireCondition(
    /^[a-f0-9]{40}$/.test(pr.merge_commit_sha),
    "Invalid merge SHA",
  );
  return pr.merge_commit_sha;
}
export function verifyVersionChange(
  before: string,
  after: string,
  paths: string[],
  removed: string[],
  pending: string[],
  changelog: string,
) {
  requireCondition(compareVersions(after, before) > 0, "Version must increase");
  requireCondition(
    paths.includes("package.json") && paths.includes("CHANGELOG.md"),
    "Version PR must update package and changelog",
  );
  requireCondition(
    removed.some(isChangeset) && !pending.some(isChangeset),
    "Version PR must consume pending changesets",
  );
  requireCondition(
    changelog.split("\n").includes(`## ${after}`),
    "Missing version changelog section",
  );
  const allowed = (path: string) =>
    ["package.json", "bun.lock", "CHANGELOG.md"].includes(path) ||
    isChangeset(path);
  requireCondition(
    paths.every(allowed),
    "Version PR contains changes outside release metadata",
  );
}
export function verifyFreshVersion(
  version: string,
  current: string,
  published: string[],
  tagSHA: string | null,
  sha: string,
) {
  requireCondition(
    compareVersions(version, current) >= 0,
    "A newer main version supersedes this release",
  );
  requireCondition(
    published.every((v) => compareVersions(version, v) >= 0),
    "A newer published version supersedes this release",
  );
  requireCondition(
    tagSHA === null || tagSHA === sha,
    "Version tag already belongs to a different commit",
  );
}
async function api(
  path: string,
  method = "GET",
  body?: unknown,
  optional = false,
) {
  const response = await fetch(
    `https://api.github.com/repos/${repository}/${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    },
  );
  if (optional && response.status === 404) return null;
  requireCondition(
    response.ok,
    `GitHub ${method} ${path}: HTTP ${response.status}`,
  );
  return response.status === 204 ? null : response.json();
}
function output(key: string, value: string | number) {
  requireCondition(!String(value).includes("\n"), "Invalid workflow output");
  if (process.env.GITHUB_OUTPUT)
    appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  console.log(`${key}=${value}`);
}
function number(value: unknown): number {
  requireCondition(
    typeof value === "string" && /^[1-9]\d*$/.test(value),
    "Expected a PR number",
  );
  return Number(value);
}
function event() {
  return JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH ?? "", "utf8"));
}
function packageAt(sha: string): { version: string; [key: string]: unknown } {
  return JSON.parse(git("show", `${sha}:package.json`));
}
function versionChange(base: string, sha: string) {
  const { version: beforeVersion, ...before } = packageAt(base);
  const { version: afterVersion, ...after } = packageAt(sha);
  requireCondition(
    isDeepStrictEqual(before, after),
    "Version PR may only change the package version",
  );
  verifyVersionChange(
    beforeVersion,
    afterVersion,
    git("diff", "--name-only", base, sha).split("\n"),
    git("diff", "--diff-filter=D", "--name-only", base, sha).split("\n"),
    git("ls-tree", "-r", "--name-only", sha, "--", ".changeset").split("\n"),
    git("show", `${sha}:CHANGELOG.md`),
  );
}
function status(since?: string) {
  const path = join(tmpdir(), `logomocja-changesets-${process.pid}.json`);
  run("bun", [
    "run",
    "changeset:status",
    ...(since ? ["--since", since] : []),
    "--output",
    path,
  ]);
  return JSON.parse(readFileSync(path, "utf8")) as { releases: unknown[] };
}
async function pullRequest() {
  const data = event();
  const dispatched = process.env.GITHUB_EVENT_NAME === "workflow_dispatch";
  const pr: PullRequest = dispatched
    ? await api(`pulls/${number(data.inputs["pr-number"])}`)
    : data.pull_request;
  const sha = git("rev-parse", "HEAD");
  if (dispatched) verifyDispatch(pr, repository, data.inputs["head-sha"], sha);
  else requireCondition(sha === pr.head.sha, "Checkout must match PR head");
  const base = git("merge-base", pr.base.sha, sha);
  if (isVersionPR(pr, repository)) versionChange(base, sha);
  else {
    const added = git(
      "diff",
      "--diff-filter=A",
      "--name-only",
      base,
      sha,
    ).split("\n");
    verifyAddedChangeset(added);
    status(base);
  }
}
async function release() {
  const data = event();
  const pr: PullRequest = await api(
    `pulls/${number(process.env.RELEASE_PR ?? String(data.pull_request?.number ?? data.inputs?.["pr-number"]))}`,
  );
  const sha = releaseSHA(pr, repository);
  // A merge into main must still be in its history; the SHA never comes from a retry ref.
  run("git", ["fetch", "origin", "main"]);
  run("git", ["merge-base", "--is-ancestor", sha, "origin/main"]);
  versionChange(`${sha}^1`, sha);
  const version = packageAt(sha).version;
  const releases: { tag_name: string; draft: boolean; prerelease: boolean }[] =
    await api("releases?per_page=100");
  let tag = await api(`git/ref/tags/v${version}`, "GET", undefined, true);
  if (tag?.object.type === "tag") tag = await api(`git/tags/${tag.object.sha}`);
  verifyFreshVersion(
    version,
    packageAt("origin/main").version,
    releases
      .filter(
        (r) => !r.draft && !r.prerelease && /^v\d+\.\d+\.\d+$/.test(r.tag_name),
      )
      .map((r) => r.tag_name.slice(1)),
    tag?.object.sha ?? null,
    sha,
  );
  output("sha", sha);
  output("version", version);
  output("pr", pr.number);
  return { version, sha, tag };
}
async function publish() {
  const { version, sha, tag } = await release();
  if (!tag)
    await api("git/refs", "POST", { ref: `refs/tags/v${version}`, sha });
  const changelog = git("show", `${sha}:CHANGELOG.md`);
  const notes = changelog
    .split(`## ${version}\n`)[1]
    ?.split(/\n## /)[0]
    ?.trim();
  requireCondition(notes, "Missing release notes");
  const notesPath = join(tmpdir(), "logomocja-release-notes.md");
  writeFileSync(notesPath, notes);
  const existing = await api(
    `releases/tags/v${version}`,
    "GET",
    undefined,
    true,
  );
  const args = [
    "release",
    existing ? "edit" : "create",
    `v${version}`,
    "--repo",
    repository,
    "--title",
    `Logomocja ${version}`,
    "--notes-file",
    notesPath,
  ];
  if (!existing) args.push("--verify-tag", "--draft");
  run("gh", args);
  run("gh", [
    "release",
    "upload",
    `v${version}`,
    `logomocja-${version}.zip`,
    "--repo",
    repository,
    "--clobber",
  ]);
  run("gh", [
    "release",
    "edit",
    `v${version}`,
    "--repo",
    repository,
    "--draft=false",
  ]);
}
async function main() {
  switch (process.argv[2]) {
    case "pr":
      await pullRequest();
      break;
    case "pending":
      output("pending", status().releases.length > 0 ? "true" : "false");
      break;
    case "dispatch": {
      const pr: PullRequest = await api(
        `pulls/${number(process.env.VERSION_PR)}`,
      );
      verifyDispatch(pr, repository, pr.head.sha, pr.head.sha);
      await api("actions/workflows/pr.yml/dispatches", "POST", {
        ref: versionBranch,
        inputs: { "pr-number": String(pr.number), "head-sha": pr.head.sha },
      });
      break;
    }
    case "release":
      await release();
      break;
    case "publish":
      await publish();
      break;
    default:
      throw Error("Expected pr, pending, dispatch, release or publish");
  }
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await main();
}
