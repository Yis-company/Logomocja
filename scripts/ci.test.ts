import { describe, expect, it } from "vitest";
import {
  compareVersions,
  isChangeset,
  isVersionPR,
  type PullRequest,
  verifyDispatch,
  verifyFreshVersion,
  verifyVersionChange,
  verifyAddedChangeset,
  releaseSHA,
} from "./ci";
const repo = "Yis-company/Logomocja";
const sha = "a".repeat(40);
const pr: PullRequest = {
  number: 2,
  state: "open",
  user: { login: "github-actions[bot]" },
  base: { ref: "main", sha: "b".repeat(40), repo: { full_name: repo } },
  head: { ref: "changeset-release/main", sha, repo: { full_name: repo } },
  merged: false,
  merge_commit_sha: null,
};
const paths = [
  "package.json",
  "bun.lock",
  "CHANGELOG.md",
  ".changeset/feature.md",
];
const change = (
  overrides: {
    before?: string;
    after?: string;
    paths?: string[];
    removed?: string[];
    pending?: string[];
    changelog?: string;
  } = {},
) =>
  verifyVersionChange(
    overrides.before ?? "0.1.0",
    overrides.after ?? "0.2.0",
    overrides.paths ?? paths,
    overrides.removed ?? [".changeset/feature.md"],
    overrides.pending ?? [".changeset/config.json"],
    overrides.changelog ??
      "# logomocja\n\n## 0.2.0\n\n### Minor Changes\n- Drawing",
  );
describe("PR policy", () => {
  it("recognises only same-repo automation version PRs", () => {
    expect(isVersionPR(pr, repo)).toBe(true);
    expect(isVersionPR({ ...pr, user: { login: "human" } }, repo)).toBe(false);
    expect(
      isVersionPR(
        { ...pr, head: { ...pr.head, repo: { full_name: "fork/Logomocja" } } },
        repo,
      ),
    ).toBe(false);
    expect(
      isVersionPR({ ...pr, base: { ...pr.base, ref: "other" } }, repo),
    ).toBe(false);
  });
  it("rejects stale dispatch and wrong checkout, even for genuine version PRs", () => {
    expect(() => verifyDispatch(pr, repo, sha, sha)).not.toThrow();
    expect(() => verifyDispatch(pr, repo, "b".repeat(40), sha)).toThrow(
      /changed/,
    );
    expect(() => verifyDispatch(pr, repo, sha, "b".repeat(40))).toThrow(
      /changed/,
    );
    expect(() =>
      verifyDispatch({ ...pr, merged: true }, repo, sha, sha),
    ).toThrow(/open/);
    expect(() =>
      verifyDispatch({ ...pr, state: "closed" }, repo, sha, sha),
    ).toThrow(/open/);
  });
  it("requires a newly added changeset, with an empty maintenance entry allowed", () => {
    expect(() => verifyAddedChangeset([])).toThrow(/Add a changeset/);
    expect(() => verifyAddedChangeset([".changeset/README.md"])).toThrow();
    expect(() =>
      verifyAddedChangeset([".changeset/maintenance.md"]),
    ).not.toThrow();
  });
  it("accepts maintenance changeset paths and excludes docs, config and nested files", () => {
    expect(isChangeset(".changeset/maintenance.md")).toBe(true);
    for (const path of [
      ".changeset/README.md",
      ".changeset/config.json",
      ".changeset/nested/x.md",
      "docs/change.md",
    ])
      expect(isChangeset(path)).toBe(false);
  });
});
describe("release metadata", () => {
  it("takes only the verified merged version PR commit", () => {
    expect(
      releaseSHA({ ...pr, merged: true, merge_commit_sha: sha }, repo),
    ).toBe(sha);
    expect(() => releaseSHA(pr, repo)).toThrow(/merged/);
    expect(() =>
      releaseSHA(
        {
          ...pr,
          merged: true,
          merge_commit_sha: sha,
          user: { login: "human" },
        },
        repo,
      ),
    ).toThrow(/merged/);
  });
  it("accepts a consumed changeset and increasing stable version", () =>
    expect(change).not.toThrow());
  it("rejects non-version changes masquerading as a version PR", () => {
    expect(() => change({ paths: [...paths, "src/App.tsx"] })).toThrow(
      /outside/,
    );
    expect(() => change({ removed: [] })).toThrow(/consume/);
    expect(() => change({ pending: [".changeset/feature.md"] })).toThrow(
      /consume/,
    );
    expect(() => change({ after: "0.1.0" })).toThrow(/increase/);
    expect(() => change({ changelog: "## 0.1.0" })).toThrow(/changelog/);
  });
  it("compares semantic version numbers rather than strings", () => {
    expect(compareVersions("0.10.0", "0.9.0")).toBe(1);
    expect(compareVersions("1.0.0", "0.99.0")).toBe(1);
    expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
    expect(() => compareVersions("1.0.0-beta", "1.0.0")).toThrow(/stable/);
  });
  it("permits retries at the same tag SHA and blocks conflicting tags or rollback", () => {
    expect(() =>
      verifyFreshVersion("0.2.0", "0.2.0", ["0.2.0"], sha, sha),
    ).not.toThrow();
    expect(() =>
      verifyFreshVersion("0.2.0", "0.2.0", [], null, sha),
    ).not.toThrow();
    expect(() => verifyFreshVersion("0.2.0", "0.3.0", [], null, sha)).toThrow(
      /main/,
    );
    expect(() =>
      verifyFreshVersion("0.2.0", "0.2.0", ["0.3.0"], null, sha),
    ).toThrow(/published/);
    expect(() =>
      verifyFreshVersion("0.2.0", "0.2.0", [], "b".repeat(40), sha),
    ).toThrow(/different commit/);
  });
});
