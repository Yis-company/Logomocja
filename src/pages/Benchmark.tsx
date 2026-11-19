// biome-ignore-all lint/a11y/noRedundantRoles: Explicit table roles retain semantics when CSS stacks rows.
import { ArrowDown, ArrowDownUp, ArrowUp, Moon, Sun } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { version } from "../../package.json";
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
import {
  attempts,
  methodology,
  pilotReport,
  repository,
} from "../benchmark-attempts";
import { benchmarkCopy } from "../benchmark-copy";
import { TurtleMark } from "../components/Icon";
import { Button, buttonVariants } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { benchmarkPath, studioPath } from "../routes";
import type { Theme } from "../theme";
import {
  benchmarkFormats,
  RunComparison,
  RunDetails,
  TryApp,
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

export function Benchmark({
  theme,
  toggleTheme,
}: {
  theme: Theme;
  toggleTheme: () => void;
}) {
  const [params, setParams] = useSearchParams();
  const title = useRef<HTMLHeadingElement>(null);
  const returningToRow = useRef(false);
  const detailsOpen = params.has("run");
  useEffect(() => {
    if (!detailsOpen && !returningToRow.current)
      title.current?.focus({ preventScroll: true });
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
  const sortOptions: [SortKey, string][] = [
    ["date", copy.date],
    ["model", copy.model],
    ["conformance", copy.conformance],
    ["time", copy.time],
    ["cost", copy.cost],
  ];

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
    returningToRow.current = true;
    update({ run: null });
    requestAnimationFrame(() => {
      (document.getElementById(`evidence-${id}`) ?? title.current)?.focus();
      returningToRow.current = false;
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

  function changeSort(key: SortKey) {
    const direction =
      sort.key === key
        ? sort.direction === "asc"
          ? "desc"
          : "asc"
        : key === "conformance" || key === "date"
          ? "desc"
          : "asc";
    update({ sort: key, order: direction, page: null });
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
        role="columnheader"
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
          onClick={() => changeSort(key)}
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
        <Link
          className="brand benchmark-brand"
          to={{
            pathname: benchmarkPath,
            search: language === "pl" ? "?lang=pl" : "",
          }}
        >
          <TurtleMark size={28} />
          logomocja<span className="brand-dot">.</span>
        </Link>
        <div className="benchmark-header-actions">
          <fieldset className="benchmark-language">
            <legend className="sr-only">{copy.language}</legend>
            <Button
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
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={theme === "dark" ? copy.lightTheme : copy.darkTheme}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>
          <Link
            className={buttonVariants({ variant: "outline" })}
            to={studioPath}
          >
            {copy.studio}
          </Link>
        </div>
      </header>
      <div className="benchmark-intro">
        <h1 id="benchmark-title" ref={title} tabIndex={-1}>
          Benchmark
        </h1>
        <p>{copy.intro}</p>
        <div className="benchmark-links">
          <a className="text-link" href={methodology}>
            {copy.method}
          </a>
          <a className="text-link" href={pilotReport}>
            {copy.pilot}
          </a>
          <a className="text-link" href={repository}>
            GitHub
          </a>
        </div>
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
        <div className="benchmark-filter-options">
          <details
            open={additionalFilters.some((key) => params.has(key)) || undefined}
          >
            <summary>{copy.more}</summary>
            <div className="benchmark-filter-grid">
              {additionalFilters.map(filter)}
            </div>
          </details>
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
        </div>
      </div>

      <div className="benchmark-result-tools">
        <span role="status">
          {copy.results(
            format.count(ordered.length ? offset + 1 : 0),
            format.count(offset + visible.length),
            format.count(ordered.length),
          )}
        </span>
        <label className="benchmark-mobile-sort">
          <span className="benchmark-mobile-sort-label">{copy.sort}</span>
          <select
            value={`${sort.key}:${sort.direction}`}
            onChange={(event) => {
              const [key, direction] = event.target.value.split(":");
              update({ sort: key, order: direction, page: null });
            }}
          >
            {sortOptions.flatMap(([key, label]) =>
              [
                ["desc", copy.descending],
                ["asc", copy.ascending],
              ].map(([direction, order]) => (
                <option
                  key={`${key}:${direction}`}
                  value={`${key}:${direction}`}
                  disabled={isMetric(key) && !oneProtocol}
                >
                  {label} · {order}
                </option>
              )),
            )}
          </select>
        </label>
        {!oneProtocol && (
          <p className="benchmark-sort-scope">{copy.sortScope}</p>
        )}
      </div>

      {selected.length > 0 && (
        <div className="benchmark-selection">
          <div>
            <strong>
              {copy.comparison} ({selected.length}/2)
            </strong>
            <p>
              {selected
                .map(
                  (attempt) =>
                    `${attempt.model} · ${copy.values[attempt.condition] ?? attempt.condition}`,
                )
                .join(" / ")}
            </p>
          </div>
          <div className="benchmark-links">
            {eligibleSecond && (
              <Button
                type="button"
                onClick={() =>
                  document.getElementById("run-comparison")?.focus()
                }
              >
                {copy.compare}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => update({ compare: null })}
            >
              {copy.clearComparison}
            </Button>
          </div>
        </div>
      )}

      <section
        id="benchmark-results"
        className="benchmark-results"
        aria-label={copy.attempts}
        tabIndex={-1}
      >
        {/* Explicit roles preserve table navigation when rows stack at narrow widths. */}
        <table
          className="benchmark-table"
          aria-label={copy.attempts}
          role="table"
        >
          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader">
                <span className="sr-only">{copy.compare}</span>
              </th>
              {sortHeader("model", copy.model)}
              <th scope="col" role="columnheader">
                {copy.source} / {copy.protocol}
              </th>
              <th scope="col" role="columnheader">
                {copy.status}
              </th>
              {sortHeader("conformance", copy.conformance)}
              {sortHeader("time", copy.time)}
              {sortHeader("cost", copy.cost)}
              {sortHeader("date", copy.date)}
              <th scope="col" role="columnheader">
                {copy.actions}
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {visible.length === 0 && (
              <tr role="row">
                <td className="benchmark-empty" colSpan={9} role="cell">
                  {copy.none}
                </td>
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
                  role="row"
                  data-selected={checked || undefined}
                >
                  <td className="benchmark-compare-cell" role="cell">
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
                  <th scope="row" role="rowheader" className="benchmark-model">
                    {attempt.model}
                    <span className="benchmark-cell-meta">
                      {copy.values[attempt.condition] ?? attempt.condition} ·{" "}
                      {copy.values[attempt.effort ?? "default"] ??
                        attempt.effort}
                    </span>
                  </th>
                  <td className="benchmark-protocol" role="cell">
                    {copy.values[attempt.source]}
                    <span className="benchmark-cell-meta">
                      {attempt.protocol}
                    </span>
                  </td>
                  <td className="benchmark-status-cell" role="cell">
                    <span
                      className="benchmark-status"
                      data-status={attempt.status}
                    >
                      {copy.values[attempt.status]}
                    </span>
                    <span className="benchmark-cell-meta">
                      {copy.values[attempt.task]}
                    </span>
                  </td>
                  <td className="benchmark-score" role="cell">
                    <span className="benchmark-cell-label">{copy.score}</span>
                    {format.score(attempt, "interpreter")}
                  </td>
                  <td className="benchmark-time" role="cell">
                    <span className="benchmark-cell-label">{copy.time}</span>
                    {format.time(attempt)}
                  </td>
                  <td className="benchmark-cost" role="cell">
                    <span className="benchmark-cell-label">{copy.cost}</span>
                    {format.cost(attempt)}
                  </td>
                  <td className="benchmark-date" role="cell">
                    <time dateTime={attempt.startedAt}>
                      {format.date(attempt.startedAt)}
                    </time>
                  </td>
                  <td className="benchmark-action-cell" role="cell">
                    <div className="benchmark-row-actions">
                      <Button
                        type="button"
                        id={`evidence-${attempt.id}`}
                        size="sm"
                        variant="outline"
                        aria-label={`${copy.viewEvidence}: ${attempt.model}, ${attempt.id}`}
                        onClick={() => update({ run: attempt.id })}
                      >
                        {copy.viewEvidence}
                      </Button>
                      <TryApp run={attempt} copy={copy} />
                    </div>
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
      <footer className="benchmark-footer">
        <nav className="benchmark-links" aria-label={copy.studioResources}>
          <Link className="text-link" to="/examples">
            {copy.examples}
          </Link>
          <Link className="text-link" to="/commands">
            {copy.commands}
          </Link>
          <Link className="text-link" to="/challenges">
            {copy.challenges}
          </Link>
        </nav>
        <span className="app-version">v{version}</span>
      </footer>
    </div>
  );
}
