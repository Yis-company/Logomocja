import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { conformance } from "../benchmark";
import type { Attempt } from "../benchmark-attempts";
import type { BenchmarkCopy, BenchmarkLanguage } from "../benchmark-copy";
import { Button } from "../components/ui/button";

const Gallery = lazy(() => import("./BenchmarkGallery"));

export function benchmarkFormats(
  language: BenchmarkLanguage,
  copy: BenchmarkCopy,
) {
  const number = new Intl.NumberFormat(language);
  const decimal = new Intl.NumberFormat(language, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });
  const date = new Intl.DateTimeFormat(language, {
    dateStyle: "medium",
    timeZone: "UTC",
  });
  const usd = new Intl.NumberFormat(language, {
    style: "currency",
    currency: "USD",
  });
  return {
    count: (value: number) => number.format(value),
    date: (value: string) => date.format(new Date(value)),
    time: (run: Attempt) =>
      run.timeMs === undefined
        ? copy.unavailable
        : `${decimal.format(run.timeMs / 60_000)} min`,
    cost: (run: Attempt) =>
      run.costUsd === undefined
        ? copy.unavailable
        : `${run.costEstimated ? "≈" : ""}${usd.format(run.costUsd)}`,
    score: (run: Attempt, path: "interpreter" | "editor") => {
      const score = conformance(run, path);
      return score
        ? `${number.format(score.passed)}/${number.format(score.total)}`
        : copy.unavailable;
    },
  };
}

type Props = {
  copy: BenchmarkCopy;
  format: ReturnType<typeof benchmarkFormats>;
};

export function RunDetails({
  run,
  id,
  copy,
  format,
  onOpen,
  onClose,
}: Props & {
  run?: Attempt;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  const [showGallery, setShowGallery] = useState(false);
  useEffect(() => {
    title.current?.focus();
  }, []);

  return (
    <section className="benchmark-evidence" aria-labelledby="run-details">
      <div className="benchmark-section-header">
        <h2 ref={title} id="run-details" tabIndex={-1}>
          {copy.details}
        </h2>
        <Button type="button" variant="outline" onClick={onClose}>
          {copy.close}
        </Button>
      </div>
      {run ? (
        <>
          <p>
            <strong>{run.model}</strong> ·{" "}
            {copy.values[run.condition] ?? run.condition}
          </p>
          <p>
            <code>{id}</code>
          </p>
          <dl className="benchmark-facts">
            <div>
              <dt>{copy.source}</dt>
              <dd>{copy.values[run.source]}</dd>
            </div>
            <div>
              <dt>{copy.protocol}</dt>
              <dd>{run.protocol}</dd>
            </div>
            <div>
              <dt>{copy.runner}</dt>
              <dd>{copy.values[run.runner] ?? run.runner}</dd>
            </div>
            <div>
              <dt>{copy.cli}</dt>
              <dd>{run.cliVersion ?? copy.unavailable}</dd>
            </div>
            <div>
              <dt>{copy.status}</dt>
              <dd>{copy.values[run.status]}</dd>
            </div>
            <div>
              <dt>{copy.time}</dt>
              <dd>{format.time(run)}</dd>
            </div>
            <div>
              <dt>{copy.cost}</dt>
              <dd>{format.cost(run)}</dd>
            </div>
            {run.generatedTests !== undefined && (
              <div>
                <dt>{copy.generatedTests}</dt>
                <dd>{copy.values[run.generatedTests]}</dd>
              </div>
            )}
            {run.generatedTestsPassed !== undefined && (
              <div>
                <dt>{copy.generatedTests}</dt>
                <dd>
                  {format.count(run.generatedTestsPassed)} · {copy.values.pass}
                </dd>
              </div>
            )}
            {run.tokens && (
              <>
                <div>
                  <dt>{copy.input}</dt>
                  <dd>
                    {format.count(run.tokens.input + run.tokens.cachedInput)}
                  </dd>
                </div>
                <div>
                  <dt>{copy.output}</dt>
                  <dd>{format.count(run.tokens.output)}</dd>
                </div>
                <div>
                  <dt>{copy.reasoning}</dt>
                  <dd>{format.count(run.tokens.reasoning)}</dd>
                </div>
              </>
            )}
            {run.toolCalls !== undefined && (
              <div>
                <dt>{copy.toolCalls}</dt>
                <dd>{format.count(run.toolCalls)}</dd>
              </div>
            )}
            {run.cases !== undefined && (
              <div>
                <dt>{copy.cases}</dt>
                <dd>{format.count(run.cases)}</dd>
              </div>
            )}
            {run.humanScore !== undefined && (
              <div>
                <dt>{copy.humanScore}</dt>
                <dd>{run.humanScore}</dd>
              </div>
            )}
          </dl>
          {run.statusDetail && <p lang="en">{run.statusDetail}</p>}
          {run.notes && <p>{run.notes}</p>}
          <div className="benchmark-links">
            {run.buildUrl && (
              <a className="text-link" href={run.buildUrl}>
                {copy.build}
              </a>
            )}
            {run.sourceUrl && (
              <a className="text-link" href={run.sourceUrl}>
                {copy.code}
              </a>
            )}
            <a className="text-link" href={run.evidenceUrl}>
              {copy.evidence}
            </a>
            {run.transcriptUrl && (
              <a className="text-link" href={run.transcriptUrl}>
                {copy.transcript}
              </a>
            )}
            {run.baselineId && (
              <button
                className="text-link"
                type="button"
                onClick={() => onOpen(run.baselineId ?? "")}
              >
                {copy.baseline}
              </button>
            )}
          </div>
          {run.conformance && (
            <details className="benchmark-suites">
              <summary>{copy.suites}</summary>
              <dl className="benchmark-facts">
                {Object.entries(run.conformance).map(([suite, score]) => (
                  <div key={suite}>
                    <dt>
                      <code>{suite}</code>
                    </dt>
                    <dd>
                      {score.passed}/{score.total}
                      {score.hook === false && ` · ${copy.missingHook}`}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
          )}
          {run.gallery && (
            <div className="benchmark-suites">
              {showGallery ? (
                <Suspense fallback={<p role="status">{copy.loading}</p>}>
                  <Gallery run={run} copy={copy} />
                </Suspense>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowGallery(true)}
                >
                  {copy.viewGallery}
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <p>{copy.unknown}</p>
      )}
    </section>
  );
}

export function RunComparison({
  first,
  second,
  copy,
  format,
}: Props & { first: Attempt; second: Attempt }) {
  const rows = [
    [
      copy.cli,
      first.cliVersion ?? copy.unavailable,
      second.cliVersion ?? copy.unavailable,
    ],
    [
      copy.conformance,
      format.score(first, "interpreter"),
      format.score(second, "interpreter"),
    ],
    [
      copy.editor,
      format.score(first, "editor"),
      format.score(second, "editor"),
    ],
    [copy.time, format.time(first), format.time(second)],
    [copy.cost, format.cost(first), format.cost(second)],
  ];
  return (
    <>
      <p>
        {copy.values[first.source]} · {first.protocol}
      </p>
      <table className="benchmark-compare-table">
        <thead>
          <tr>
            <td />
            {[first, second].map((run) => (
              <th scope="col" key={run.id}>
                {run.model}
                <span>
                  {copy.values[run.condition] ?? run.condition} ·{" "}
                  {copy.values[run.effort ?? "default"] ?? run.effort}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, a, b]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{a}</td>
              <td>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{copy.comparisonNote}</p>
      {first.source === "antigravity" && <p>{copy.pilotNote}</p>}
    </>
  );
}
