import type { RunResult } from "../bench/result";
import pilot from "../bench/comparisons/2026-11-19-gemini-4-medium/comparison.json";
import { benchmarkVersion } from "./benchmark";

export const repository = "https://github.com/Yis-company/Logomocja";
const files = `${repository}/blob/main`;
const pilotDirectory = "bench/comparisons/2026-11-19-gemini-4-medium";
export const methodology = `${files}/bench/README.md`;
export const pilotReport = `${files}/${pilotDirectory}/README.md`;

type InterruptedAttempt = Pick<
  RunResult,
  "id" | "task" | "runner" | "model" | "effort" | "prompt" | "env"
> & {
  reason: string;
};

export type Attempt = {
  id: string;
  source: "docker" | "antigravity";
  protocol: string;
  prompt: string;
  runner: string;
  model: string;
  effort: string | null;
  condition: string;
  task: RunResult["task"];
  status: RunResult["status"] | "scored" | "interrupted" | "setup-blocked";
  startedAt: string;
  cliVersion?: string;
  built: boolean;
  timeMs?: number;
  costUsd?: number;
  costEstimated?: boolean;
  conformance?: Record<
    string,
    { passed: number; total: number; hook?: boolean }
  >;
  tokens?: RunResult["tokens"];
  generatedTests?: NonNullable<RunResult["verify"]>["tests"];
  generatedTestsPassed?: number;
  toolCalls?: number;
  cases?: number;
  humanScore?: number;
  notes?: string;
  statusDetail?: string;
  baselineId?: string;
  buildUrl?: string;
  sourceUrl?: string;
  evidenceUrl: string;
  transcriptUrl?: string;
  gallery?: { directory: string; matches: Record<string, boolean> };
  quality?: RunResult["quality"];
};

const finalized = Object.values(
  import.meta.glob<RunResult>("../bench/results/*/result.json", {
    eager: true,
    import: "default",
  }),
);
const interrupted = Object.values(
  import.meta.glob<InterruptedAttempt>("../bench/results/*/interrupted.json", {
    eager: true,
    import: "default",
  }),
);
const buildFiles = new Set(
  Object.keys(import.meta.glob("../builds/*/index.html", { query: "?url" })),
);
const transcripts = new Set(
  Object.keys(
    import.meta.glob("../bench/results/*/transcript.jsonl", { query: "?url" }),
  ),
);
const publishedSourceIds = new Set(
  import.meta.env.VITE_PUBLISHED_BENCHMARK_SOURCE_IDS.split(" "),
);
const finalizedIds = new Set(finalized.map((run) => run.id));

function dockerEvidence(id: string) {
  const directory = `bench/results/${id}`;
  return {
    directory,
    transcriptUrl: transcripts.has(`../${directory}/transcript.jsonl`)
      ? `${files}/${directory}/transcript.jsonl`
      : undefined,
  };
}

function hostedBuild(id: string) {
  return buildFiles.has(`../builds/${id}/index.html`)
    ? `${import.meta.env.BASE_URL}builds/${id}/`
    : undefined;
}

function dockerAttempt(run: RunResult): Attempt {
  const { directory, transcriptUrl } = dockerEvidence(run.id);
  const built = run.verify?.built ?? false;
  return {
    id: run.id,
    source: "docker",
    protocol: benchmarkVersion(run),
    prompt: run.prompt,
    runner: run.runner,
    model: run.model,
    effort: run.effort,
    condition: run.layer?.id ?? "base",
    task: run.task,
    status: run.status,
    startedAt: run.startedAt,
    cliVersion: run.cliVersion,
    built,
    timeMs: run.agentMs,
    costUsd: run.costUsd ?? undefined,
    costEstimated: run.costBasis === "list",
    conformance: run.conformance ?? undefined,
    tokens: run.tokens,
    generatedTests: run.verify?.tests,
    toolCalls: run.toolCalls,
    cases: run.cases ?? undefined,
    quality: run.quality,
    humanScore: run.humanScore ?? undefined,
    notes: run.notes || undefined,
    statusDetail:
      run.statusDetail === "success"
        ? undefined
        : run.statusDetail || undefined,
    baselineId: run.baselineId ?? undefined,
    buildUrl: built ? hostedBuild(run.id) : undefined,
    sourceUrl: publishedSourceIds.has(run.id)
      ? `${repository}/tree/build/${run.id}`
      : undefined,
    evidenceUrl: `${files}/${directory}/result.json`,
    transcriptUrl,
    gallery: run.gallery ? { matches: run.gallery, directory } : undefined,
  };
}

function interruptedAttempt(run: InterruptedAttempt): Attempt {
  const { directory, transcriptUrl } = dockerEvidence(run.id);
  const startedAt = run.id.replace(
    /^.*-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})Z$/,
    "$1-$2-$3T$4:$5:$6Z",
  );
  return {
    id: run.id,
    source: "docker",
    protocol: benchmarkVersion(run),
    prompt: run.prompt,
    runner: run.runner,
    model: run.model,
    effort: run.effort,
    condition: "base",
    task: run.task,
    status: "interrupted",
    startedAt,
    built: false,
    statusDetail: run.reason,
    evidenceUrl: `${files}/${directory}/interrupted.json`,
    transcriptUrl,
  };
}

const pilotRuns = new Map(pilot.runs.map((run) => [run.id, run]));
const pilotVerification = pilot.verificationImage.split(":").at(-1);
const pilotGalleries = import.meta.glob<{
  programs: Record<string, { matches: boolean }>;
}>("../bench/comparisons/2026-11-19-gemini-4-medium/*/gallery.json", {
  eager: true,
  import: "default",
});

function pilotAttempt(attempt: (typeof pilot.attempts)[number]): Attempt {
  const run = attempt.evidence ? pilotRuns.get(attempt.evidence) : undefined;
  const directory = `${pilotDirectory}/${run?.id}`;
  const gallery = pilotGalleries[`../${directory}/gallery.json`];
  return {
    id: run
      ? `gemini-4-medium/${run.id}`
      : `gemini-4-medium/${attempt.model}-${attempt.startedAt}`,
    source: "antigravity",
    protocol: `${pilot.prompt} · ${pilot.generationPlatform} · ${pilotVerification}`,
    prompt: pilot.prompt,
    runner: "antigravity",
    model: attempt.model.replace(/-medium$/, ""),
    effort: "medium",
    condition:
      attempt.condition === "impeccable" ? "impeccable-v1" : attempt.condition,
    task: "app",
    status: run ? "scored" : "setup-blocked",
    startedAt: attempt.startedAt,
    cliVersion: attempt.cliVersion,
    built: Boolean(run),
    timeMs: run ? run.agentSeconds * 1_000 : undefined,
    conformance: run?.conformance,
    generatedTestsPassed: run?.generatedTestsPassed,
    statusDetail: attempt.reason,
    buildUrl: run ? hostedBuild(`gemini-4-medium-${run.id}`) : undefined,
    sourceUrl: run ? `${files}/${directory}/source.tar.gz` : undefined,
    evidenceUrl: run
      ? `${files}/${directory}/conformance.json`
      : `${files}/${pilotDirectory}/comparison.json`,
    gallery: gallery
      ? {
          directory,
          matches: Object.fromEntries(
            Object.entries(gallery.programs).map(([program, result]) => [
              program,
              result.matches,
            ]),
          ),
        }
      : undefined,
  };
}

export const attempts = [
  ...finalized.map(dockerAttempt),
  ...interrupted
    .filter((run) => !finalizedIds.has(run.id))
    .map(interruptedAttempt),
  ...pilot.attempts.map(pilotAttempt),
];
