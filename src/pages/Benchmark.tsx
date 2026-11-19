import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import {
  canCompare,
  filterAttempts,
  filterKeys,
  isMetric,
  readSort,
  sortAttempts,
  type FilterKey,
  type SortKey,
} from "../benchmark";
import { attempts, methodology, pilotReport } from "../benchmark-attempts";
import { benchmarkCopy } from "../benchmark-copy";
import { Button, buttonVariants } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { studioPath } from "../routes";
import {
  benchmarkFormats,
  RunComparison,
  RunDetails,
} from "./BenchmarkEvidence";

const pageSize = 25;
const byId = new Map(attempts.map((run) => [run.id, run]));
const options = Object.fromEntries(
  filterKeys.map((key) => [
    key,
    [...new Set(attempts.map((run) => run[key] ?? "default"))].sort((a, b) =>
      a.localeCompare(b, "en", { numeric: true }),
    ),
  ]),
);
const primaryFilters: FilterKey[] = ["source", "protocol", "status"];
const additionalFilters = filterKeys.filter(
  (key) => !primaryFilters.includes(key),
);

export function Benchmark() {
  const [params, setParams] = useSearchParams();
  const title = useRef<HTMLHeadingElement>(null);
  const detailsOpen = params.has("run");
  useEffect(() => {
    if (!detailsOpen) title.current?.focus({ preventScroll: true });
  }, [detailsOpen]);
  const language = params.get("lang") === "pl" ? "pl" : "en";
  const copy = benchmarkCopy[language];
  const format = benchmarkFormats(language, copy);
  const match = filterAttempts(attempts, params);
  const oneProtocol =
    match.length > 0 &&
    match.every(
      (run) =>
        run.source === match[0].source && run.protocol === match[0].protocol,
    );
  const sort = readSort(params, oneProtocol);
  const ordered = sortAttempts(match, sort);
  const pageCount = Math.max(1, Math.ceil(ordered.length / pageSize));
  const page = Math.min(
    pageCount,
    Math.max(1, Number.parseInt(params.get("page") ?? "", 10) || 1),
  );
  const offset = (page - 1) * pageSize;
  const visible = ordered.slice(offset, offset + pageSize);
  const id = params.get("run");
  const run = id ? byId.get(id) : undefined;
  const compareIds = params.getAll("compare");
  const first = byId.get(compareIds[0]);
  const second = byId.get(compareIds[1]);
  const eligibleFirst = first && canCompare(first) ? first : undefined;
  const eligibleSecond =
    eligibleFirst && second && canCompare(eligibleFirst, second)
      ? second
      : undefined;
  const selected = [eligibleFirst, eligibleSecond].filter(
    (attempt) => attempt !== undefined,
  );
  const hasFilters =
    params.has("q") || filterKeys.some((key) => params.has(key));

  function update(values: Record<string, string | null>, replace = false) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next, { replace, preventScrollReset: true });
  }

  function setCompare(id: string) {
    const next = new URLSearchParams(params);
    next.delete("compare");
    const ids = selected.map((attempt) => attempt.id);
    for (const chosen of ids.includes(id)
      ? ids.filter((key) => key !== id)
      : [...ids, id]) {
      next.append("compare", chosen);
    }
    setParams(next, { preventScrollReset: true });
  }

  function closeDetails() {
    update({ run: null });
    requestAnimationFrame(() => {
      const trigger = document
        .getElementById(`run-${id}`)
        ?.querySelector("button");
      (trigger ?? document.getElementById("benchmark-title"))?.focus();
    });
  }

  function goToPage(next: number) {
    update({ page: next === 1 ? null : String(next) });
    document.getElementById("benchmark-results")?.focus();
  }

  function filter(key: FilterKey) {
    return (
      <label key={key}>
        {copy[key]}
        <select
          value={params.get(key) ?? ""}
          onChange={(event) =>
            update({ [key]: event.target.value, page: null })
          }
        >
          <option value="">{copy.all}</option>
          {options[key].map((value) => (
            <option value={value} key={value}>
              {copy.values[value] ?? value}
            </option>
          ))}
        </select>
      </label>
    );
  }

  function sortHeader(key: SortKey, label: string) {
    const active = sort.key === key;
    const Glyph = active
      ? sort.direction === "asc"
        ? ArrowUp
        : ArrowDown
      : ArrowDownUp;
    return (
      <th
        scope="col"
        aria-sort={
          active
            ? sort.direction === "asc"
              ? "ascending"
              : "descending"
            : undefined
        }
      >
        <button
          type="button"
          disabled={isMetric(key) && !oneProtocol}
          onClick={() =>
            update({
              sort: key,
              order: active
                ? sort.direction === "asc"
                  ? "desc"
                  : "asc"
                : key === "conformance"
                  ? "desc"
                  : "asc",
              page: null,
            })
          }
        >
          {label}
          <Glyph aria-hidden size={13} />
        </button>
      </th>
    );
  }

  return (
    <div className="benchmark-page">
      <header className="benchmark-header">
        <div>
          <h1 id="benchmark-title" ref={title} tabIndex={-1}>
            Benchmark
          </h1>
          <p>{copy.intro}</p>
        </div>
        <div className="benchmark-header-actions">
          <fieldset className="benchmark-language">
            <legend className="sr-only">{copy.language}</legend>
            <Button
              size="lg"
              variant={language === "en" ? "secondary" : "ghost"}
              type="button"
              lang="en"
              aria-label="English"
              aria-pressed={language === "en"}
              onClick={() => update({ lang: null })}
            >
              EN
            </Button>
            <Button
              size="lg"
              variant={language === "pl" ? "secondary" : "ghost"}
              type="button"
              lang="pl"
              aria-label="Polski"
              aria-pressed={language === "pl"}
              onClick={() => update({ lang: "pl" })}
            >
              PL
            </Button>
          </fieldset>
          <Link className={buttonVariants({ size: "lg" })} to={studioPath}>
            {copy.studio}
          </Link>
        </div>
      </header>

      <div className="benchmark-filters">
        <div className="benchmark-filter-grid">
          <label htmlFor="benchmark-search">
            {copy.search}
            <Input
              id="benchmark-search"
              type="search"
              value={params.get("q") ?? ""}
              onChange={(event) =>
                update({ q: event.target.value, page: null }, true)
              }
            />
          </label>
          {primaryFilters.map(filter)}
        </div>
        <details
          open={additionalFilters.some((key) => params.has(key)) || undefined}
        >
          <summary>{copy.more}</summary>
          <div className="benchmark-filter-grid">
            {additionalFilters.map(filter)}
          </div>
        </details>
      </div>

      <div className="benchmark-result-tools">
        <span role="status">
          {copy.results(
            format.count(ordered.length ? offset + 1 : 0),
            format.count(offset + visible.length),
            format.count(ordered.length),
          )}
        </span>
        <div className="benchmark-links">
          {hasFilters && (
            <button
              type="button"
              className="text-link"
              onClick={() =>
                update(
                  Object.fromEntries(
                    ["q", "page", ...filterKeys].map((key) => [key, null]),
                  ),
                )
              }
            >
              {copy.clear}
            </button>
          )}
          {selected.length > 0 && (
            <button
              type="button"
              className="text-link"
              onClick={() => document.getElementById("run-comparison")?.focus()}
            >
              {copy.comparison} ({selected.length}/2)
            </button>
          )}
          <a className="text-link" href={methodology}>
            {copy.method}
          </a>
          <a className="text-link" href={pilotReport}>
            {copy.pilot}
          </a>
        </div>
      </div>

      {!oneProtocol && <p className="benchmark-sort-scope">{copy.sortScope}</p>}
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: Make the horizontal scrolling region keyboard-accessible. */}
      <section id="benchmark-results" className="table-scroll benchmark-scroll" aria-label={copy.attempts} tabIndex={0}>
        <table className="benchmark-table" aria-label={copy.attempts}>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">{copy.compare}</span>
              </th>
              {sortHeader("model", copy.model)}
              <th scope="col">{copy.source} / {copy.protocol}</th>
              <th scope="col">{copy.task}</th>
              <th scope="col">{copy.status}</th>
              {sortHeader("conformance", copy.conformance)}
              {sortHeader("time", copy.time)}
              {sortHeader("cost", copy.cost)}
              {sortHeader("date", copy.date)}
              <th scope="col">{copy.evidence}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={10}>{copy.none}</td>
              </tr>
            )}
            {visible.map((attempt) => {
              const checked = selected.includes(attempt);
              const comparable = eligibleFirst
                ? canCompare(eligibleFirst, attempt)
                : canCompare(attempt);
              return (
                <tr
                  key={attempt.id}
                  id={`run-${attempt.id}`}
                  data-selected={checked || undefined}
                >
                  <td>
                    {canCompare(attempt) && (
                      <label className="benchmark-checkbox">
                        <input
                          type="checkbox"
                          aria-label={copy.compareRun(attempt.id)}
                          checked={checked}
                          disabled={
                            !checked && (!comparable || selected.length === 2)
                          }
                          onChange={() => setCompare(attempt.id)}
                        />
                      </label>
                    )}
                  </td>
                  <th scope="row">
                    <button
                      type="button"
                      className="text-link"
                      aria-label={copy.viewRun(attempt.model, attempt.id)}
                      onClick={() => update({ run: attempt.id })}
                    >
                      {attempt.model}
                    </button>
                    <span>
                      {copy.values[attempt.condition] ?? attempt.condition} ·{" "}
                      {copy.values[attempt.effort ?? "default"] ??
                        attempt.effort}
                    </span>
                  </th>
                  <td>
                    {copy.values[attempt.source]}
                    <span>{attempt.protocol}</span>
                  </td>
                  <td>{copy.values[attempt.task]}</td>
                  <td>
                    <span
                      className="benchmark-status"
                      data-status={attempt.status}
                    >
                      {copy.values[attempt.status]}
                    </span>
                  </td>
                  <td className="benchmark-number">
                    {format.score(attempt, "interpreter")}
                  </td>
                  <td className="benchmark-number">{format.time(attempt)}</td>
                  <td className="benchmark-number">{format.cost(attempt)}</td>
                  <td>
                    <time dateTime={attempt.startedAt}>
                      {format.date(attempt.startedAt)}
                    </time>
                  </td>
                  <td>
                    <a className="text-link" href={attempt.evidenceUrl}>
                      {copy.evidence}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div className="benchmark-result-tools benchmark-pagination">
        <p>{copy.pickPair}</p>
        {pageCount > 1 && (
          <nav aria-label={copy.attempts}>
            <Button
              type="button"
              variant="outline"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
            >
              {copy.previous}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={page === pageCount}
              onClick={() => goToPage(page + 1)}
            >
              {copy.next}
            </Button>
          </nav>
        )}
      </div>

      {id && (
        <RunDetails
          key={id}
          id={id}
          run={run}
          copy={copy}
          format={format}
          onOpen={(next) => update({ run: next })}
          onClose={closeDetails}
        />
      )}

      {compareIds.length > 0 && (
        <section
          className="benchmark-evidence"
          aria-labelledby="run-comparison"
        >
          <div className="benchmark-section-header">
            <h2 id="run-comparison" tabIndex={-1}>
              {copy.comparison}
            </h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => update({ compare: null })}
            >
              {copy.clearComparison}
            </Button>
          </div>
          {eligibleFirst && eligibleSecond ? (
            <RunComparison
              first={eligibleFirst}
              second={eligibleSecond}
              copy={copy}
              format={format}
            />
          ) : (
            <p role="status">
              {compareIds.length > selected.length
                ? copy.invalidComparison
                : copy.pickPair}
            </p>
          )}
        </section>
      )}
      <p className="benchmark-method-note">{copy.pilotNote}</p>
    </div>
  );
}
