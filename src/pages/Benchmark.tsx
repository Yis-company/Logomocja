import type { RunResult } from "../../bench/score";
import { groupByVersion, humanScore, tokenTotals } from "../benchmark";
import { Frame, FramePanel } from "../components/reui/frame";

const results = Object.values(
  import.meta.glob("../../bench/results/*.json", {
    eager: true,
    import: "default",
  }),
) as RunResult[];
const percent = (value: number) => `${Math.round(value * 100)}%`;
const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;
const date = (iso: string) => iso.slice(0, 10);

function RunRows({ runs, taskIds }: { runs: RunResult[]; taskIds: string[] }) {
  return (
    <>
      {runs.map((run) => {
        const score = humanScore(run);
        const tokens = tokenTotals(run);
        return (
          <tr key={`${run.startedAt}-${run.model}`}>
            <td>
              <code>{run.model}</code>
            </td>
            <td>{run.runner}</td>
            <td>{run.settings.effort ?? "domyślny"}</td>
            <td>
              {run.prompt} / {run.env}
            </td>
            <td>{run.summary.samples}</td>
            <td>{percent(run.summary.taskPassRate)}</td>
            <td>{percent(run.summary.casePassRate)}</td>
            <td>{seconds(run.summary.meanLatencyMs)}</td>
            <td>{tokens.input.toLocaleString("pl-PL")}</td>
            <td>{tokens.output.toLocaleString("pl-PL")}</td>
            <td>{tokens.reasoning.toLocaleString("pl-PL")}</td>
            <td>{score === null ? "—" : score.toFixed(1)}</td>
            <td>
              {date(run.startedAt)}
              {run.partial ? " (częściowy)" : ""}
            </td>
            {taskIds.map((id) => {
              const task = run.tasks.find((item) => item.id === id);
              if (!task?.samples.length) return <td key={id}>—</td>;
              const passed = task.samples.reduce((sum, s) => sum + s.casesPassed, 0);
              const total = task.samples.reduce((sum, s) => sum + s.casesTotal, 0);
              const kinds = [...new Set(task.samples.flatMap((s) => (s.failure ? [s.failure.kind] : [])))];
              return (
                <td key={id} title={kinds.join(", ")}>
                  {passed}/{total}
                  {kinds.length ? <small> {kinds.join(", ")}</small> : null}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

export function Benchmark() {
  const groups = groupByVersion(results);
  return (
    <>
      <div className="workspace-heading">
        <div>
          <h1 tabIndex={-1}>Benchmark</h1>
          <p>Jak modele językowe radzą sobie z wyzwaniami, wersja po wersji.</p>
        </div>
      </div>
      {groups.length === 0 ? (
        <Frame>
          <FramePanel>
            <p>Brak wyników.</p>
          </FramePanel>
        </Frame>
      ) : null}
      {groups.map(({ version, runs }) => {
        const taskIds = [...new Set(runs.flatMap((run) => run.tasks.map((task) => task.id)))];
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
                      <th>Prompt / środowisko</th>
                      <th>Próby</th>
                      <th>Zadania</th>
                      <th>Przypadki</th>
                      <th>Średni czas</th>
                      <th>Tokeny wejścia</th>
                      <th>Tokeny wyjścia</th>
                      <th>Rozumowanie</th>
                      <th>Ocena</th>
                      <th>Data</th>
                      {taskIds.map((id) => (
                        <th key={id}>{id}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <RunRows runs={runs} taskIds={taskIds} />
                  </tbody>
                </table>
              </div>
              <p>
                Zadanie liczy się jako zaliczone tylko wtedy, gdy wszystkie jego przypadki
                przechodzą. Przypadki pokazują częściowy wynik. Tokeny to sumy z całego
                przebiegu według narzędzia; wejście obejmuje tokeny z pamięci podręcznej
                i własną otoczkę narzędzia, więc porównuj je w obrębie jednego narzędzia.
                Ocena to średnia ocen ludzkich, jeśli zostały wpisane w plikach wyników.
              </p>
            </FramePanel>
          </Frame>
        );
      })}
    </>
  );
}
