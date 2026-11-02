import { describe, expect, it, vi } from "vitest";
import { reportValidation, validationState } from "./validation-status";

const repo = "Yis-company/Logomocja";
const sha = "a".repeat(40);
function fixture() {
  const run = {
    id: 100,
    workflow_id: 55,
    path: ".github/workflows/pr.yml",
    event: "workflow_dispatch",
    head_branch: "changeset-release/main",
    head_sha: sha,
    repository: { full_name: repo },
    head_repository: { full_name: repo },
    status: "completed",
    conclusion: "success" as string | null,
  };
  const pr = {
    number: 8,
    state: "open",
    merged: false,
    user: { login: "github-actions[bot]" },
    base: { ref: "main", sha: "b".repeat(40), repo: { full_name: repo } },
    head: { ref: "changeset-release/main", sha, repo: { full_name: repo } },
  };
  const data = {
    run,
    pr,
    current: pr,
    latest: 100,
    jobs: [{ name: "Validation", conclusion: "success" }],
    paginate: false,
  };
  const request = vi.fn(
    async (path: string, method = "GET", body?: unknown) => {
      if (path === "actions/runs/100") return data.run;
      if (path === "actions/workflows/pr.yml") return { id: 55 };
      if (path.startsWith("actions/workflows/pr.yml/runs?"))
        return { workflow_runs: [{ ...data.run, id: data.latest }] };
      if (path.startsWith("pulls?")) {
        if (data.paginate && path.endsWith("page=1"))
          return Array.from({ length: 100 }, () => ({
            ...data.pr,
            user: { login: "human" },
          }));
        return [data.pr];
      }
      if (path.startsWith("actions/runs/100/jobs?")) {
        if (data.paginate && path.endsWith("page=1"))
          return {
            jobs: Array.from({ length: 100 }, () => ({
              name: "Other",
              conclusion: "skipped",
            })),
          };
        return { jobs: data.jobs };
      }
      if (path === "pulls/8") return data.current;
      if (path === `statuses/${sha}` && method === "POST") return body;
      throw Error(`Unexpected request: ${method} ${path}`);
    },
  );
  const posts = () => request.mock.calls.filter((call) => call[1] === "POST");
  return { data, request, posts };
}

describe("dispatched validation status", () => {
  it("posts Validation to the exact PR head with a link to the original run", async () => {
    const f = fixture();
    expect(await reportValidation(repo, 100, f.request)).toBe(true);
    expect(f.posts()).toEqual([
      [
        `statuses/${sha}`,
        "POST",
        {
          context: "Validation",
          state: "success",
          description: "Dispatched validation: success",
          target_url: `https://github.com/${repo}/actions/runs/100`,
        },
      ],
    ]);
  });
  it.each([
    ["queued", null, "pending"],
    ["in_progress", null, "pending"],
    ["completed", "success", "success"],
    ["completed", "failure", "failure"],
    ["completed", "cancelled", "error"],
    ["completed", "timed_out", "error"],
    ["completed", "action_required", "error"],
    ["completed", "skipped", "error"],
    ["completed", "neutral", "error"],
    ["completed", null, "error"],
  ])("maps %s/%s to %s", async (status, conclusion, expected) => {
    const f = fixture();
    f.data.run.status = status as string;
    f.data.run.conclusion = conclusion;
    expect(validationState(status as string, conclusion)).toBe(expected);
    await reportValidation(repo, 100, f.request);
    expect(f.posts()[0]?.[2]).toMatchObject({ state: expected });
  });
  it.each([
    { event: "pull_request" },
    { head_branch: "feature" },
    { repository: { full_name: "other/repo" } },
    { head_repository: { full_name: "fork/Logomocja" } },
    { head_sha: "bad" },
    { workflow_id: 999 },
    { path: ".github/workflows/release.yml" },
  ])("ignores unrelated runs %j", async (override) => {
    const f = fixture();
    Object.assign(f.data.run, override);
    expect(await reportValidation(repo, 100, f.request)).toBe(false);
    expect(f.posts()).toEqual([]);
  });
  it("ignores an older run for the same commit", async () => {
    const f = fixture();
    f.data.latest = 101;
    expect(await reportValidation(repo, 100, f.request)).toBe(false);
    expect(f.posts()).toEqual([]);
  });
  it.each(["human", "fork", "stale", "closed", "merged", "other-base"])(
    "ignores a %s PR",
    async (reason) => {
      const f = fixture();
      if (reason === "human") f.data.pr.user.login = "human";
      if (reason === "fork") f.data.pr.head.repo.full_name = "fork/Logomocja";
      if (reason === "stale") f.data.pr.head.sha = "b".repeat(40);
      if (reason === "closed") f.data.pr.state = "closed";
      if (reason === "merged") f.data.pr.merged = true;
      if (reason === "other-base") f.data.pr.base.ref = "other";
      expect(await reportValidation(repo, 100, f.request)).toBe(false);
      expect(f.posts()).toEqual([]);
    },
  );
  it("rechecks the PR head after looking up jobs", async () => {
    const f = fixture();
    f.data.current = {
      ...f.data.pr,
      head: { ...f.data.pr.head, sha: "b".repeat(40) },
    };
    expect(await reportValidation(repo, 100, f.request)).toBe(false);
    expect(f.posts()).toEqual([]);
  });
  it.each([
    [],
    [{ name: "Validation", conclusion: "skipped" }],
    [{ name: "Validation", conclusion: "failure" }],
  ])(
    "does not turn a skipped or absent validation job into success: %j",
    async (...jobs) => {
      const f = fixture();
      f.data.jobs = jobs;
      await reportValidation(repo, 100, f.request);
      expect(f.posts()[0]?.[2]).toMatchObject({ state: "error" });
    },
  );
  it("paginates PRs and jobs", async () => {
    const f = fixture();
    f.data.paginate = true;
    expect(await reportValidation(repo, 100, f.request)).toBe(true);
    expect(
      f.request.mock.calls.filter(([path]) => path.endsWith("page=2")),
    ).toHaveLength(2);
  });
  it("uses current API state for delayed start events and propagates status write failures", async () => {
    const f = fixture();
    await reportValidation(repo, 100, f.request);
    expect(f.posts()[0]?.[2]).toMatchObject({ state: "success" });
    const failing = async (path: string, method = "GET", body?: unknown) => {
      if (method === "POST") throw Error("HTTP 403");
      return f.request(path, method, body);
    };
    await expect(reportValidation(repo, 100, failing)).rejects.toThrow(/403/);
  });
});
