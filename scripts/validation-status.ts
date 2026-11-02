// Runs only from the trusted default-branch workflow, never a PR checkout.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { api, isVersionPR, type PullRequest } from "./ci";

type WorkflowRun = {
  id: number;
  workflow_id: number;
  path: string;
  event: string;
  head_branch: string;
  head_sha: string;
  repository: { full_name: string };
  head_repository: { full_name: string } | null;
  status: string;
  conclusion: string | null;
};
export function validationState(status: string, conclusion: string | null) {
  if (status !== "completed") return "pending";
  if (conclusion === "success") return "success";
  return conclusion === "failure" ? "failure" : "error";
}

export async function reportValidation(
  repo: string,
  runId: number,
  request: typeof api = api,
) {
  if (!Number.isSafeInteger(runId) || runId <= 0)
    throw Error("Expected a workflow run ID");
  // Fetch current state so a delayed start event cannot overwrite a final status.
  const run: WorkflowRun = await request(`actions/runs/${runId}`);
  if (
    run.event !== "workflow_dispatch" ||
    run.head_branch !== "changeset-release/main" ||
    run.repository.full_name !== repo ||
    run.head_repository?.full_name !== repo ||
    !/^[a-f0-9]{40}$/.test(run.head_sha)
  )
    return false;
  const workflow: { id: number } = await request("actions/workflows/pr.yml");
  if (
    run.workflow_id !== workflow.id ||
    run.path.split("@")[0] !== ".github/workflows/pr.yml"
  )
    return false;
  const latest: { workflow_runs: WorkflowRun[] } = await request(
    `actions/workflows/pr.yml/runs?event=workflow_dispatch&branch=changeset-release%2Fmain&head_sha=${run.head_sha}&per_page=1`,
  );
  if (latest.workflow_runs[0]?.id !== run.id) return false;

  const pulls: PullRequest[] = [];
  for (let page = 1; ; page++) {
    const batch: PullRequest[] = await request(
      `pulls?state=open&head=${encodeURIComponent(`${repo.split("/")[0]}:changeset-release/main`)}&per_page=100&page=${page}`,
    );
    pulls.push(...batch);
    if (batch.length < 100) break;
  }
  const pr = pulls.find(
    (pr) =>
      isVersionPR(pr, repo) &&
      pr.state === "open" &&
      pr.head.sha === run.head_sha,
  );
  if (!pr) return false;
  let state = validationState(run.status, run.conclusion);
  if (state === "success") {
    const jobs: { name: string; conclusion: string | null }[] = [];
    for (let page = 1; ; page++) {
      const batch: { jobs: typeof jobs } = await request(
        `actions/runs/${run.id}/jobs?filter=latest&per_page=100&page=${page}`,
      );
      jobs.push(...batch.jobs);
      if (batch.jobs.length < 100) break;
    }
    if (
      !jobs.some(
        (job) => job.name === "Validation" && job.conclusion === "success",
      )
    )
      state = "error";
  }
  // Recheck the head immediately before writing, after any job lookups.
  const current: PullRequest = await request(`pulls/${pr.number}`);
  if (
    !isVersionPR(current, repo) ||
    current.state !== "open" ||
    current.merged ||
    current.head.sha !== run.head_sha
  )
    return false;
  await request(`statuses/${run.head_sha}`, "POST", {
    context: "Validation",
    state,
    description:
      state === "pending"
        ? "Dispatched validation is running"
        : `Dispatched validation: ${state}`,
    target_url: `https://github.com/${repo}/actions/runs/${run.id}`,
  });
  return true;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (process.env.GITHUB_EVENT_NAME !== "workflow_run")
    throw Error("Expected workflow_run event");
  const event = JSON.parse(
    readFileSync(process.env.GITHUB_EVENT_PATH ?? "", "utf8"),
  );
  if (!process.env.GITHUB_REPOSITORY) throw Error("Missing GITHUB_REPOSITORY");
  const posted = await reportValidation(
    process.env.GITHUB_REPOSITORY,
    event.workflow_run?.id,
  );
  console.log(
    posted
      ? "Reported Validation status"
      : "Ignored unrelated or stale validation run",
  );
}
