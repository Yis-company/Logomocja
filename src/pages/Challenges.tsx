import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { DrawingStage } from "../components/DrawingStage";
import { Editor } from "../components/Editor";
import { Icon } from "../components/Icon";
import { Frame, FramePanel } from "../components/reui/frame";
import { Button } from "../components/ui/button";
import { emptyDrawing, type Segment } from "../logo/types";
import type { Theme } from "../theme";
import { runChallenge, type JudgeResult } from "../challenges/judge";
import {
  challenges,
  expectedDrawing,
  starter,
  type Challenge,
} from "../challenges/tasks";
import {
  readChallenges,
  recordFor,
  writeChallenges,
  type ChallengeRecords,
} from "../challenges/storage";

const localStore = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
};
const load = () => readChallenges(localStore);
const makeDrawing = (segments: Segment[]) => ({ ...emptyDrawing(), segments });
const inputs = (task: Challenge, args: readonly number[]) =>
  task.params.map((name, i) => `${name}=${args[i]}`).join(", ");

function ChallengeArt({
  task,
  args = task.sample,
}: {
  task: Challenge;
  args?: readonly number[];
}) {
  const segments = expectedDrawing(task, args);
  const project = ([x, y, z]: readonly number[]) =>
    task.mode === "3d" ? [x + z * 0.7, y + z * 0.45] : [x, y];
  const points = segments.flatMap((segment) => [
    project(segment.from),
    project(segment.to),
  ]);
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const scale = Math.min(124 / width, 88 / height);
  const x = (value: number) => 75 + (value - (minX + maxX) / 2) * scale;
  const y = (value: number) => 57.5 - (value - (minY + maxY) / 2) * scale;
  return (
    <svg
      className="challenge-art"
      viewBox="0 0 150 115"
      role="img"
      aria-label={`Rysunek: ${task.title}`}
    >
      <path
        d={segments
          .map((segment) => {
            const from = project(segment.from);
            const to = project(segment.to);
            return `M ${x(from[0])} ${y(from[1])} L ${x(to[0])} ${y(to[1])}`;
          })
          .join(" ")}
      />
    </svg>
  );
}

export function ChallengeCatalog() {
  const [mode, setMode] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [completion, setCompletion] = useState("all");
  const [records] = useState(load);
  const filtered = challenges.filter(
    (task) =>
      (mode === "all" || task.mode === mode) &&
      (difficulty === "all" || task.difficulty === difficulty) &&
      (completion === "all" ||
        (completion === "completed") === recordFor(records, task).completed),
  );
  return (
    <>
      <div className="workspace-heading">
        <div>
          <h1 tabIndex={-1}>Wyzwania</h1>
          <p>Napisz procedurę i sprawdź ją na różnych danych.</p>
        </div>
      </div>
      <div className="challenge-filters">
        <label>
          Tryb{" "}
          <select
            aria-label="Filtr trybu"
            value={mode}
            onChange={(event) => setMode(event.target.value)}
          >
            <option value="all">Wszystkie</option>
            <option value="2d">2D</option>
            <option value="3d">3D</option>
          </select>
        </label>
        <label>
          Poziom{" "}
          <select
            aria-label="Filtr poziomu"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
          >
            <option value="all">Wszystkie</option>
            <option value="Łatwe">Łatwe</option>
            <option value="Średnie">Średnie</option>
          </select>
        </label>
        <label>
          Postęp{" "}
          <select
            aria-label="Filtr postępu"
            value={completion}
            onChange={(event) => setCompletion(event.target.value)}
          >
            <option value="all">Wszystkie</option>
            <option value="completed">Ukończone</option>
            <option value="pending">Do zrobienia</option>
          </select>
        </label>
      </div>
      {filtered.length ? (
        <div className="challenge-grid">
          {filtered.map((task) => (
            <Frame key={task.id} spacing="sm">
              <FramePanel>
                <div className="library-art">
                  <ChallengeArt task={task} />
                </div>
                <div className="library-body">
                  <span className="task-meta">
                    {task.mode.toUpperCase()} · {task.difficulty}
                  </span>
                  <h2>{task.title}</h2>
                  <p>{task.description}</p>
                  {recordFor(records, task).completed && (
                    <span className="solved-badge">✓ Ukończono wcześniej</span>
                  )}
                  <Link className="library-open" to={`/challenges/${task.id}`}>
                    Otwórz wyzwanie <Icon name="arrow" size={16} />
                  </Link>
                </div>
              </FramePanel>
            </Frame>
          ))}
        </div>
      ) : (
        <p className="empty-filter">Brak wyzwań dla wybranych filtrów.</p>
      )}
    </>
  );
}

export function ChallengePage({ theme }: { theme: Theme }) {
  const { slug } = useParams();
  const task = challenges.find((candidate) => candidate.id === slug);
  if (!task)
    return (
      <>
        <h1 tabIndex={-1}>Nie znaleziono wyzwania</h1>
        <Link className="text-link" to="/challenges">
          Wróć do wyzwań
        </Link>
      </>
    );
  return <ChallengeWorkspace key={task.id} task={task} theme={theme} />;
}

function ChallengeWorkspace({
  task,
  theme,
}: {
  task: Challenge;
  theme: Theme;
}) {
  const [records, setRecords] = useState<ChallengeRecords>(load);
  const [source, setSource] = useState(() => recordFor(records, task).draft);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [drawing, setDrawing] = useState(emptyDrawing);
  const [viewVersion, setViewVersion] = useState(0);
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const operation = useRef<AbortController | null>(null);
  const revision = useRef(0);
  useEffect(
    () => () => {
      operation.current?.abort();
      revision.current++;
    },
    [],
  );

  function cancel() {
    operation.current?.abort();
    operation.current = null;
    revision.current++;
    setBusy(false);
    setResult(null);
    setProgress(0);
    setTotal(0);
  }
  function persist(
    draft: string,
    completed = recordFor(records, task).completed,
  ) {
    const next = {
      ...records,
      [task.id]: { version: task.version, draft, completed },
    };
    setRecords(next);
    setSaveError(!writeChallenges(localStore, next));
  }
  function changeSource(value: string) {
    cancel();
    setSource(value);
    persist(value);
  }
  function selectSample(value: number) {
    cancel();
    setSampleIndex(value);
    setDrawing(emptyDrawing());
    setViewVersion((v) => v + 1);
  }
  async function execute(submit: boolean) {
    cancel();
    const controller = new AbortController();
    operation.current = controller;
    const currentRevision = revision.current;
    setBusy(true);
    const cases = submit ? task.cases : [selected];
    setTotal(cases.length);
    const answer = await runChallenge(source, task, cases, {
      signal: controller.signal,
      onProgress: ({ completed }) => {
        if (revision.current === currentRevision) setProgress(completed);
      },
      onSample: submit
        ? undefined
        : (segments) => {
            if (revision.current === currentRevision)
              setDrawing(makeDrawing(segments));
          },
    });
    if (
      controller.signal.aborted ||
      currentRevision !== revision.current ||
      !answer
    )
      return;
    operation.current = null;
    setBusy(false);
    setResult(answer);
    if (submit && !answer.error && answer.passed === task.cases.length)
      persist(source, true);
    if (submit && answer.cases.length)
      setDrawing(makeDrawing(answer.cases[0].actual));
  }
  function reset() {
    cancel();
    const next = starter(task);
    setSource(next);
    setDrawing(emptyDrawing());
    setViewVersion((v) => v + 1);
    persist(next);
    setConfirmReset(false);
  }
  const selected = task.cases[sampleIndex];
  const completed = recordFor(records, task).completed;
  const failed = result?.cases.find((item) => !item.passed);
  return (
    <>
      <Link className="text-link challenge-back" to="/challenges">
        ← Wszystkie wyzwania
      </Link>
      <div className="workspace-heading">
        <div>
          <span className="task-meta">
            {task.mode.toUpperCase()} · {task.difficulty}
          </span>
          <h1 tabIndex={-1}>{task.title}</h1>
          <p>Napisz procedurę, która działa dla różnych liczb.</p>
          {completed && (
            <span className="solved-badge">✓ Ukończono wcześniej</span>
          )}
        </div>
      </div>
      <div className="challenge-statement">
        <p>{task.description}</p>
        <p>
          Rysunek musi zaczynać się w podanym punkcie i zachować kierunki osi.
          Kolejność, kierunek, podział i ponowne kreślenie odcinków są dowolne;
          kolor, grubość i końcowa pozycja żółwia nie wpływają na ocenę.
        </p>
        <span className="challenge-contract">{task.contract}</span>
      </div>
      <div className="challenge-hints">
        {task.hints.map((hint, i) => (
          <details key={hint}>
            <summary>Podpowiedź {i + 1}</summary>
            <p>{hint}</p>
          </details>
        ))}
      </div>
      <div className="expected-preview">
        <h2>Oczekiwany rysunek · {inputs(task, selected)}</h2>
        <div className="library-art">
          <ChallengeArt task={task} args={selected} />
        </div>
      </div>
      <div className="studio-grid challenge-workspace">
        <div className="code-column">
          <Editor source={source} onChange={changeSource} activeLine={null} />
        </div>
        <section
          className="stage-panel"
          aria-labelledby="challenge-stage-title"
        >
          <div className="panel-heading">
            <div className="panel-title">
              <span className="stage-indicator" />
              <h2 id="challenge-stage-title">Twój rysunek</h2>
              <span className="dimension-label">{task.mode.toUpperCase()}</span>
            </div>
          </div>
          <DrawingStage
            drawing={drawing}
            mode={task.mode}
            theme={theme}
            viewVersion={viewVersion}
          />
          <div className="challenge-toolbar">
            <label>
              Przykład{" "}
              <select
                className="sample-select"
                aria-label="Wybierz przykład"
                value={sampleIndex}
                onChange={(event) => selectSample(Number(event.target.value))}
              >
                {task.cases.map((args, i) => (
                  <option key={args.join(",")} value={i}>
                    {inputs(task, args)}
                  </option>
                ))}
              </select>
            </label>
            <Button onClick={() => execute(false)} disabled={busy}>
              Uruchom przykład
            </Button>
            <Button onClick={() => execute(true)} disabled={busy}>
              Sprawdź rozwiązanie
            </Button>
            {busy && (
              <Button variant="outline" onClick={cancel}>
                Anuluj sprawdzanie
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() =>
                source !== starter(task) ? setConfirmReset(true) : reset()
              }
            >
              Resetuj kod
            </Button>
          </div>
          {busy && (
            <p role="status">
              Sprawdzanie: {progress}/{total}
            </p>
          )}
        </section>
      </div>
      {result && (
        <section className="test-results" aria-live="polite">
          <h2>Wyniki sprawdzania</h2>
          {result.error ? (
            <div className="error-message" role="alert">
              <strong>
                Wiersz {result.error.span.line}, kolumna{" "}
                {result.error.span.column}
              </strong>
              <span>{result.error.message}</span>
            </div>
          ) : (
            <>
              <p>
                {result.passed}/{result.cases.length} przypadków poprawnych
                {result.passed === task.cases.length
                  ? " · Zadanie ukończone!"
                  : ""}
              </p>
              {result.cases.map((item) => (
                <div className="test-case" key={item.args.join(",")}>
                  <header>
                    <strong>{inputs(task, item.args)}</strong>
                    <span>{item.passed ? "✓ Poprawnie" : "✕ Do poprawy"}</span>
                  </header>
                  <p>{item.message}</p>
                </div>
              ))}
              {failed && (
                <div className="comparison-grid">
                  <div>
                    <h3>Oczekiwany rysunek</h3>
                    <DrawingStage
                      drawing={makeDrawing(failed.expected)}
                      mode={task.mode}
                      theme={theme}
                      viewVersion={viewVersion}
                    />
                  </div>
                  <div>
                    <h3>Twój rysunek</h3>
                    <DrawingStage
                      drawing={makeDrawing(failed.actual)}
                      mode={task.mode}
                      theme={theme}
                      viewVersion={viewVersion}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
      {saveError && (
        <div className="storage-message" role="status">
          Nie udało się zapisać wyzwania w tej przeglądarce. Kod pozostaje w
          edytorze — skopiuj go przed zamknięciem.
        </div>
      )}
      <ConfirmDialog
        open={confirmReset}
        title="Zresetować kod wyzwania?"
        description="Twój obecny kod zostanie zastąpiony pustym szkicem. Wcześniejsze ukończenie pozostanie zapisane."
        action="Resetuj kod"
        onCancel={() => setConfirmReset(false)}
        onConfirm={reset}
      />
    </>
  );
}
