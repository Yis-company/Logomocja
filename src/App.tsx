import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router";
import { AppSidebar } from "./components/AppSidebar";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { DrawingStage } from "./components/DrawingStage";
import { Editor } from "./components/Editor";
import { Icon } from "./components/Icon";
import { Button } from "./components/ui/button";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Slider } from "./components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Frame, FramePanel } from "./components/reui/frame";
import { defaults, type Example } from "./examples";
import { parse } from "./logo/parser";
import { Executor } from "./logo/runtime";
import { emptyDrawing, LogoError, type Mode } from "./logo/types";
import { Examples } from "./pages/Examples";
import { Commands } from "./pages/Commands";
import { ChallengeCatalog, ChallengePage } from "./pages/Challenges";
import { readDrafts, writeDrafts } from "./persistence";
import { useTheme } from "./theme";
type Status = "idle" | "running" | "paused" | "done" | "error";
const labels: Record<Status, string> = {
  idle: "Gotowy do rysowania",
  running: "Żółw rysuje…",
  paused: "Program wstrzymany",
  done: "Program zakończony",
  error: "Sprawdź polecenia",
};
export default function App() {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);
  const { theme, toggle } = useTheme();
  const [drafts, setDrafts] = useState(() =>
    readDrafts({ getItem: (key) => window.localStorage.getItem(key) }),
  );
  const mode = drafts.mode;
  const source = drafts.sources[mode];
  const [drawing, setDrawing] = useState(emptyDrawing);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<LogoError | null>(null);
  const [saved, setSaved] = useState(true);
  const [speed, setSpeed] = useState(35);
  const speedRef = useRef(speed);
  const [viewVersion, setViewVersion] = useState(0);
  const [pendingExample, setPendingExample] = useState<Example | null>(null);
  const cleanSources = useRef<Record<Mode, string>>({ ...defaults });
  const executor = useRef<Executor | null>(null);
  const frame = useRef<number | null>(null);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    const persist = () =>
      setSaved(
        writeDrafts(
          { setItem: (key, value) => window.localStorage.setItem(key, value) },
          drafts,
        ),
      );
    const timer = window.setTimeout(persist, 300);
    window.addEventListener("pagehide", persist);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pagehide", persist);
    };
  }, [drafts]);
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  function stop() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }
  function cancel() {
    stop();
    executor.current = null;
    setStatus("idle");
    setError(null);
  }
  function reset() {
    cancel();
    setDrawing(emptyDrawing());
    setViewVersion((v) => v + 1);
  }
  function switchMode(next: Mode) {
    if (next === mode) return;
    reset();
    setDrafts((d) => ({ ...d, mode: next }));
  }
  function changeSource(value: string) {
    cancel();
    setDrafts((d) => ({ ...d, sources: { ...d.sources, [mode]: value } }));
  }
  function loadExample(example: Example) {
    reset();
    cleanSources.current[example.mode] = example.source;
    setDrafts((d) => ({
      ...d,
      mode: example.mode,
      sources: { ...d.sources, [example.mode]: example.source },
    }));
    setPendingExample(null);
    navigate("/");
  }
  function chooseExample(example: Example) {
    const destination = drafts.sources[example.mode];
    if (
      destination !== cleanSources.current[example.mode] &&
      destination.trim()
    )
      setPendingExample(example);
    else loadExample(example);
  }
  function start(single = false) {
    stop();
    let runtime = executor.current;
    if (status !== "paused" || !runtime) {
      try {
        runtime = new Executor(parse(source, mode));
        executor.current = runtime;
        setDrawing(runtime.snapshot());
        setError(null);
      } catch (cause) {
        setError(
          cause instanceof LogoError
            ? cause
            : new LogoError("Nie udało się odczytać programu."),
        );
        setStatus("error");
        return;
      }
    }
    const current = runtime;
    setStatus(single ? "paused" : "running");
    let previous = performance.now();
    let allowance = single ? 1 : 0;
    const pump = (now: number) => {
      frame.current = null;
      const rate = 2 + (speedRef.current / 100) ** 2 * 1000;
      if (!single)
        allowance = Math.min(
          100,
          allowance + (Math.min(now - previous, 100) / 1000) * rate,
        );
      previous = now;
      let work = 0;
      let commandExecuted = false;
      const deadline = performance.now() + 4;
      try {
        while (allowance >= 1 && work++ < 128 && performance.now() < deadline) {
          const tick = current.tick();
          if (tick === "command") {
            allowance--;
            commandExecuted = true;
            if (single) break;
          }
          if (tick === "done") {
            setDrawing(current.snapshot());
            setStatus("done");
            return;
          }
        }
        if (commandExecuted) setDrawing(current.snapshot());
        if (single && commandExecuted) return;
        frame.current = requestAnimationFrame(pump);
      } catch (cause) {
        setDrawing(current.snapshot());
        setError(
          cause instanceof LogoError
            ? cause
            : new LogoError("Nie udało się wykonać programu."),
        );
        setStatus("error");
      }
    };
    frame.current = requestAnimationFrame(pump);
  }
  function pause() {
    stop();
    setStatus("paused");
  }

  useEffect(() => {
    if (pathname === "/" && hash === "#examples") {
      navigate("/examples", { replace: true });
      return;
    }
    if (previousPath.current !== pathname) {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
        setStatus("paused");
      }
      document
        .querySelector<HTMLElement>("main h1")
        ?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
    const title = document.querySelector("main h1")?.textContent ?? "Logomocja";
    document.title = `${title} · Logomocja`;
  }, [pathname, hash, navigate]);
  const coordinates = drawing.turtle.position.map((n) =>
    Math.abs(n) < 0.005 ? "0" : Number(n.toFixed(1)).toString(),
  );
  const studio = (
    <>
      <div className="workspace-heading">
        <div>
          <div className="eyebrow">KODUJ. RYSUJ. ODKRYWAJ.</div>
          <h1 tabIndex={-1}>
            Pracownia żółwia<span className="title-dot">.</span>
          </h1>
          <p>
            Małe polecenia, wielkie pomysły. Zobacz, dokąd zaprowadzi Cię kod.
          </p>
        </div>
        <Tabs value={mode} onValueChange={(value) => switchMode(value as Mode)}>
          <TabsList
            className="mode-switch"
            aria-label="Tryb rysowania"
            activateOnFocus={false}
          >
            <TabsTrigger value="2d">
              <Icon name="plane" />
              2D Płaszczyzna
            </TabsTrigger>
            <TabsTrigger value="3d">
              <Icon name="cube" />
              3D Przestrzeń
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="studio-grid">
        <div className="code-column">
          <Editor
            source={source}
            onChange={changeSource}
            activeLine={drawing.activeLine}
          />
          <Frame spacing="sm">
            <FramePanel>
              <p className="studio-note">
                Zacznij od <code>np 100</code> i <code>pw 90</code>. Zdefiniuj
                własne polecenie, użyj go wiele razy.
              </p>
              <Link className="text-link" to="/commands">
                Słownik poleceń <Icon name="arrow" size={15} />
              </Link>
            </FramePanel>
          </Frame>
        </div>
        <section className="stage-panel" aria-labelledby="stage-title">
          <div className="panel-heading">
            <div className="panel-title">
              <span className="stage-indicator" />
              <h2 id="stage-title">Twój rysunek</h2>
              <span className="dimension-label">{mode.toUpperCase()}</span>
            </div>
          </div>
          <DrawingStage
            drawing={drawing}
            mode={mode}
            theme={theme}
            viewVersion={viewVersion}
          />
          <div className="stage-status">
            <div className="status-label" role="status" aria-live="polite">
              <i className={status} />
              {labels[status]}
            </div>
            <div className="coordinates">
              <span>X {coordinates[0]}</span>
              <span>Y {coordinates[1]}</span>
              {mode === "3d" && <span>Z {coordinates[2]}</span>}
              <span>{drawing.segments.length} odc.</span>
            </div>
          </div>
          <div className="execution-toolbar">
            <div className="execution-actions">
              <Button
                className="run-button"
                onClick={() => start()}
                disabled={status === "running"}
              >
                <Icon name="play" size={17} />
                {status === "paused" ? "Wznów" : "Uruchom"}
              </Button>
              <Button
                variant="outline"
                onClick={pause}
                disabled={status !== "running"}
              >
                <Icon name="pause" size={16} />
                Pauza
              </Button>
              <Button
                variant="outline"
                onClick={() => start(true)}
                disabled={status === "running"}
              >
                <Icon name="step" size={17} />
                Krok
              </Button>
              <Button variant="ghost" onClick={reset}>
                <Icon name="reset" size={16} />
                Reset
              </Button>
            </div>
            <div className="speed-control">
              <span id="speed-label">Tempo</span>
              <Slider
                className="data-[orientation=horizontal]:w-24 shrink-0"
                aria-labelledby="speed-label"
                aria-label="Tempo rysowania"
                min={5}
                max={100}
                value={[speed]}
                onValueChange={(value) =>
                  setSpeed(Array.isArray(value) ? value[0] : value)
                }
              />
              <span>{speed}%</span>
            </div>
          </div>
        </section>
      </div>
      {error && (
        <div className="error-message" role="alert">
          <strong>
            Wiersz {error.span.line}, kolumna {error.span.column}
          </strong>
          <span>{error.message}</span>
        </div>
      )}
      {!saved && (
        <div className="storage-message" role="status">
          Nie udało się zapisać szkicu w tej przeglądarce. Kod pozostaje w
          edytorze — skopiuj go przed zamknięciem.
        </div>
      )}
      <footer className="workspace-footer">
        <Link className="text-link" to="/examples">
          Odkryj przykłady <Icon name="arrow" size={15} />
        </Link>
        <span>
          {saved ? "Szkic zapisany w tej przeglądarce" : "Szkic niezapisany"}
        </span>
      </footer>
    </>
  );
  return (
    <SidebarProvider
      open={true}
      onOpenChange={() => {}}
      style={{ "--sidebar-width": "208px" } as React.CSSProperties}
    >
      <AppSidebar theme={theme} toggleTheme={toggle} />
      <main className="workspace">
        <div className="mobile-navigation">
          <SidebarTrigger aria-label="Otwórz nawigację" />
          <span>logomocja.</span>
        </div>
        <Routes>
          <Route path="/" element={studio} />
          <Route
            path="/examples"
            element={<Examples onChoose={chooseExample} />}
          />
          <Route path="/commands" element={<Commands />} />
          <Route path="/challenges" element={<ChallengeCatalog />} />
          <Route
            path="/challenges/:slug"
            element={<ChallengePage theme={theme} />}
          />
          <Route
            path="*"
            element={
              <>
                <h1 tabIndex={-1}>Nie znaleziono strony</h1>
                <Link className="text-link" to="/">
                  Wróć do pracowni
                </Link>
              </>
            }
          />
        </Routes>
      </main>
      <ConfirmDialog
        open={pendingExample !== null}
        title="Wczytać nowy przykład?"
        description={`Zastąpi on szkic w trybie ${pendingExample?.mode.toUpperCase() ?? ""}. Drugi szkic pozostanie zapisany.`}
        action="Wczytaj przykład"
        onCancel={() => setPendingExample(null)}
        onConfirm={() => {
          if (pendingExample) loadExample(pendingExample);
        }}
      />
    </SidebarProvider>
  );
}
