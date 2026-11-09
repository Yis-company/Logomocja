import { lazy, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import type { RunResult } from "../../bench/result";
import { conformanceRate, groupByVersion, layerName } from "../benchmark";
import { Frame, FramePanel } from "../components/reui/frame";

const Gallery = lazy(() => import("./BenchmarkGallery"));

const results = Object.values(
  import.meta.glob("../../bench/results/*/result.json", { eager: true, import: "default" }),
) as RunResult[];
const repo = "https://github.com/Yis-company/Logomocja";
const minutes = (ms: number) => `${(ms / 60_000).toFixed(1)} min`;
const n = (value: number) => value.toLocaleString("pl-PL");
const percent = (value: number | null) => (value === null ? "—" : `${Math.round(value * 100)}%`);
const usd = (run: RunResult) =>
  run.costUsd === null
    ? "—"
    : `${run.costBasis === "list" ? "≈" : ""}${run.costUsd.toLocaleString("pl-PL", { style: "currency", currency: "USD" })}`;

function AppRows({ runs, suites }: { runs: RunResult[]; suites: string[] }) {
  return (
    <>
      {runs.map((run) => (
        <tr key={run.id} id={`run-${run.id}`}>
          <td>
            <code>{run.model}</code>
            {run.status !== "completed" ? <small> ({run.status})</small> : null}
          </td>
          <td>{run.runner}</td>
          <td>{run.effort ?? "domyślny"}</td>
          <td>{minutes(run.agentMs)}</td>
          <td>{n(run.tokens.input + run.tokens.cachedInput)}</td>
          <td>{n(run.tokens.output)}</td>
          <td>{n(run.tokens.reasoning)}</td>
          <td>{usd(run)}</td>
          <td>{n(run.toolCalls)}</td>
          <td>{run.verify?.built ? "tak" : "nie"}</td>
          <td>{run.verify?.tests === "none" ? "brak" : run.verify?.tests === "pass" ? "ok" : "błąd"}</td>
          {suites.map((suite) => {
            const score = run.conformance?.[suite];
            return (
              <td key={suite}>
                {score ? `${score.passed}/${score.total}` : "—"}
                {score && !score.hook ? <small> brak haka</small> : null}
              </td>
            );
          })}
          <td>{percent(conformanceRate(run))}</td>
          <td>{run.humanScore === null ? "—" : run.humanScore}</td>
          <td>
            {run.verify?.built ? (
              <a className="text-link" href={`${import.meta.env.BASE_URL}builds/${run.id}/`}>
                Otwórz
              </a>
            ) : null}{" "}
            <a className="text-link" href={`${repo}/tree/build/${run.id}`}>
              Kod
            </a>{" "}
            {run.baselineId ? (
              <Link className="text-link" to={`/benchmark?run=${run.baselineId}`}>Baza</Link>
            ) : null}{" "}
            <a className="text-link" href={`${repo}/blob/main/bench/results/${run.id}/transcript.jsonl`}>
              Zapis
            </a>
          </td>
        </tr>
      ))}
    </>
  );
}

export function Benchmark() {
  const [searchParams] = useSearchParams();
  const selected = searchParams.get("run");
  useEffect(() => {
    if (selected) document.getElementById(`run-${selected}`)?.scrollIntoView({ block: "center" });
  }, [selected]);
  const apps = groupByVersion(results, "app");
  const tests = groupByVersion(results, "tests");
  return (
    <>
      {apps.length === 0 ? (
        <Frame>
          <FramePanel>
            <p>Brak wyników.</p>
          </FramePanel>
        </Frame>
      ) : null}
      {apps.map(({ version, layer, runs }) => {
        const suites = [...new Set(runs.flatMap((run) => Object.keys(run.conformance ?? {})))];
        return (
          <Frame key={`${version}-${layer}`} className="reference-block">
            <FramePanel>
              <h2>{layer === "base" ? `Wersja ${version}` : `${layerName(layer)} · ${version} · ${layer}`}</h2>
              {layer !== "base" ? (
                <p>Oddzielna warstwa: {layerName(layer)}.
                  {runs[0].layer?.skillVersion ? ` Impeccable ${runs[0].layer.skillVersion}.` : ""}
                  {runs[0].layer?.tddSourceCommit ? ` TDD ${runs[0].layer.tddSourceCommit.slice(0, 7)}.` : ""}
                  {" "}Ten sam opis produktu, nowe aplikacje od zera.
                  Link „Baza” prowadzi do wyniku tego samego modelu i wysiłku. Historyczne wyniki mogą różnić się ze względu na zmiany modelu i losowość.</p>
              ) : null}
              <div className="table-scroll">
                <table className="command-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Narzędzie</th>
                      <th>Wysiłek</th>
                      <th>Czas agenta</th>
                      <th>Tokeny wejścia</th>
                      <th>Tokeny wyjścia</th>
                      <th>Rozumowanie</th>
                      <th>Koszt</th>
                      <th>Wywołania narzędzi</th>
                      <th>Build</th>
                      <th>Własne testy</th>
                      {suites.map((suite) => (
                        <th key={suite}>Zgodność: {suite}</th>
                      ))}
                      <th>Zgodność</th>
                      <th>Ocena</th>
                      <th>Linki</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AppRows runs={runs} suites={suites} />
                  </tbody>
                </table>
              </div>
              <p>
                Wersja to para: wersja opisu i wersja środowiska. Tokeny wejścia obejmują pamięć
                podręczną. Koszt to cena katalogowa API: podana przez narzędzie Claude, a dla
                Codex oszacowana (≈) z liczby tokenów. Zgodność to udział przypadków testowych języka, które zbudowana
                aplikacja przechodzi. Ocena to ocena ludzka wpisana w pliku wyniku.
              </p>
              <Gallery version={version} runs={runs} />
            </FramePanel>
          </Frame>
        );
      })}
      {tests.map(({ version, runs }) => (
        <Frame key={`tests-${version}`} className="reference-block">
          <FramePanel>
            <h2>Autorzy testów zgodności, wersja {version}</h2>
            <div className="table-scroll">
              <table className="command-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Narzędzie</th>
                    <th>Runda</th>
                    <th>Przypadki</th>
                    <th>Czas agenta</th>
                    <th>Tokeny wejścia</th>
                    <th>Tokeny wyjścia</th>
                    <th>Koszt</th>
                    <th>Linki</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr key={run.id}>
                      <td>
                        <code>{run.model}</code>
                      </td>
                      <td>{run.runner}</td>
                      <td>{run.task === "tests-round2" ? 2 : 1}</td>
                      <td>{run.cases ?? 0}</td>
                      <td>{minutes(run.agentMs)}</td>
                      <td>{n(run.tokens.input + run.tokens.cachedInput)}</td>
                      <td>{n(run.tokens.output)}</td>
                      <td>{usd(run)}</td>
                      <td>
                        <a className="text-link" href={`${repo}/tree/build/${run.id}`}>
                          Kod
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FramePanel>
        </Frame>
      ))}
    </>
  );
}
