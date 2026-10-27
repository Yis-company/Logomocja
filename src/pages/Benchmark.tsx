import type { RunResult } from "../../bench/result";
import { conformanceRate, groupByVersion } from "../benchmark";
import { Frame, FramePanel } from "../components/reui/frame";

const results = Object.values(
  import.meta.glob("../../bench/results/*/result.json", { eager: true, import: "default" }),
) as RunResult[];
const shots = import.meta.glob("../../bench/results/*/gallery/*.{png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const repo = "https://github.com/Yis-company/Logomocja";
/** Screenshot URLs by run id and program, from the files captured by the harness. */
function galleryOf(runId: string): Record<string, string> {
  const prefix = `../../bench/results/${runId}/gallery/`;
  return Object.fromEntries(
    Object.entries(shots)
      .filter(([path]) => path.startsWith(prefix))
      .map(([path, url]) => [path.slice(prefix.length).replace(/\.(png|webp)$/, ""), url]),
  );
}

function Gallery({ version, runs }: { version: string; runs: RunResult[] }) {
  const reference = { id: `reference-${version.split("/")[0]}`, label: "wzorzec", gallery: null as RunResult["gallery"] };
  const rows = [reference, ...runs.map((run) => ({ id: run.id, label: run.model, gallery: run.gallery }))]
    .map((row) => ({ ...row, shots: galleryOf(row.id) }))
    .filter((row) => Object.keys(row.shots).length);
  const programs = [...new Set(rows.flatMap((row) => Object.keys(row.shots)))].sort(
    (a, b) => Number(a.startsWith("mobile-")) - Number(b.startsWith("mobile-")) || a.localeCompare(b),
  );
  if (!rows.length) return null;
  return (
    <>
      <h3>Programy wzorcowe</h3>
      <div className="table-scroll">
        <table className="gallery-table">
          <thead>
            <tr>
              <th>Model</th>
              {programs.map((program) => (
                <th key={program}>{program.replace("mobile-", "telefon: ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <code>{row.label}</code>
                </th>
                {programs.map((program) => {
                  const url = row.shots[program];
                  const mismatch = row.gallery?.[program] === false;
                  return (
                    <td key={program} className={mismatch ? "gallery-mismatch" : undefined}>
                      {url ? (
                        <a href={url} target="_blank" rel="noreferrer" title={mismatch ? `${program}: odcinki różne od wzorca` : program}>
                          <img src={url} alt={`${row.label}: ${program}`} loading="lazy" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Zrzuty ekranu każdej aplikacji po wczytaniu programu wzorcowego przez <code>open</code>.
        Czerwona ramka: odcinki zwrócone przez aplikację różnią się od wzorca.
      </p>
    </>
  );
}
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
        <tr key={run.id}>
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
  const apps = groupByVersion(results, "app");
  const tests = groupByVersion(results, "tests");
  return (
    <>
      <div className="workspace-heading">
        <div>
          <h1 tabIndex={-1}>Benchmark</h1>
          <p>Każdy agent buduje całą Logomocję od zera na podstawie tego samego opisu.</p>
        </div>
      </div>
      {apps.length === 0 ? (
        <Frame>
          <FramePanel>
            <p>Brak wyników.</p>
          </FramePanel>
        </Frame>
      ) : null}
      {apps.map(({ version, runs }) => {
        const suites = [...new Set(runs.flatMap((run) => Object.keys(run.conformance ?? {})))];
        return (
          <Frame key={version} className="reference-block">
            <FramePanel>
              <h2>Wersja {version}</h2>
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
