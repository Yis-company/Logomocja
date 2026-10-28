import { CHALLENGES, checkChallenge, type Challenge } from '../logo/challenges';
import { EXAMPLES } from '../logo/examples';
import {
  compile, LogoError, Machine, runProgram,
  type ErrorInfo, type Mode, type Pos, type RunResult, type TurtleState,
} from '../logo/index';
import { CodeEditor } from './editor';
import { copyKey, draftKey, markSolved, store } from './storage';
import { decodeSource, permalink } from './share';
import { Plane2D, Space3D, type PlanView } from './views';

/** Statements executed per animation frame, for speed levels 1..10. */
const STEP_COUNTS = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];
const DEFAULT_SOURCE: Record<Mode, string> = {
  '2d': EXAMPLES.find((e) => e.name === 'kwadrat')!.source,
  '3d': EXAMPLES.find((e) => e.name === 'schody')!.source,
};
/** Polish plural of "odcinek" (segment) for a count. */
function segmentsWord(n: number): string {
  if (n === 1) return `${n} odcinek`;
  const last = n % 10;
  const teens = n % 100 >= 12 && n % 100 <= 14;
  return last >= 2 && last <= 4 && !teens ? `${n} odcinki` : `${n} odcinków`;
}

const IDLE_TURTLE: TurtleState = {
  pos: [0, 0, 0], heading: [0, 1, 0], up: [0, 0, 1], right: [1, 0, 0], pen: true, color: '#16866a', width: 3,
};

type Status = 'idle' | 'running' | 'paused' | 'done' | 'error';

/** The page API used by the testing hook; null when the editor is not on screen. */
export interface EditorApi {
  open(source: string, mode: Mode): Promise<RunResult>;
}
let active: EditorApi | null = null;
export const editorApi = (): EditorApi | null => active;

const TEMPLATE = `
<section class="workspace" aria-labelledby="ws-title">
  <h1 id="ws-title" class="sr-only">Edytor programu</h1>
  <div class="toolbar" role="toolbar" aria-label="Sterowanie programem">
    <div class="group" role="group" aria-label="Tryb rysowania">
      <button type="button" data-mode="2d" aria-pressed="true">Plan 2D</button>
      <button type="button" data-mode="3d" aria-pressed="false">Przestrzeń 3D</button>
    </div>
    <div class="group">
      <button type="button" id="run" class="primary" title="Ctrl+Enter">Uruchom <kbd>Ctrl+Enter</kbd></button>
      <button type="button" id="step" title="F8">Krok <kbd>F8</kbd></button>
      <button type="button" id="pause" title="F9">Pauza <kbd>F9</kbd></button>
      <button type="button" id="reset" title="Esc">Reset <kbd>Esc</kbd></button>
    </div>
    <label class="speed">Tempo
      <input type="range" id="speed" min="1" max="10" value="5" aria-valuetext="" />
    </label>
    <div class="group">
      <label class="sr-only" for="examples">Przykłady</label>
      <select id="examples">
        <option value="">Przykłady…</option>
        ${EXAMPLES.map((e) => `<option value="${e.name}">${e.title} (${e.mode === '2d' ? '2D' : '3D'})</option>`).join('')}
      </select>
      <button type="button" id="open">Wczytaj .logo</button>
      <input type="file" id="file" accept=".logo,text/plain" hidden />
      <button type="button" id="save">Pobierz .logo</button>
      <button type="button" id="share">Kopiuj link</button>
      <button type="button" id="png">Zapisz PNG</button>
    </div>
  </div>
  <div id="challenge" class="challenge" hidden></div>
  <div class="split">
    <div class="pane-code"><div id="code"></div></div>
    <div class="pane-view">
      <div class="view-tools">
        <button type="button" id="fit">Dopasuj</button>
        <button type="button" id="view-reset">Widok domyślny</button>
        <span class="hint">Przeciągnij, aby przesunąć (w 3D: obróć). Kółko: zoom.</span>
      </div>
      <div class="canvas-wrap">
        <canvas class="view" data-mode="2d" tabindex="0" role="img" aria-label="Rysunek żółwia na płaszczyźnie"></canvas>
        <canvas class="view" data-mode="3d" tabindex="0" role="img" aria-label="Rysunek żółwia w przestrzeni" hidden></canvas>
      </div>
    </div>
  </div>
  <div class="statusbar">
    <p id="status" class="status" role="status" aria-live="polite"></p>
    <button type="button" id="restore" hidden>Przywróć poprzedni szkic</button>
  </div>
  <details class="shortcuts">
    <summary>Skróty klawiszowe</summary>
    <ul>
      <li><kbd>Ctrl+Enter</kbd> uruchom program od początku</li>
      <li><kbd>F8</kbd> wykonaj jedno polecenie</li>
      <li><kbd>F9</kbd> wstrzymaj lub wznów</li>
      <li><kbd>Esc</kbd> reset rysunku</li>
      <li>Na widoku: strzałki obracają lub przesuwają, <kbd>+</kbd> i <kbd>-</kbd> przybliżają, <kbd>0</kbd> resetuje widok</li>
    </ul>
  </details>
</section>`;

export function mountEditor(root: HTMLElement, query: URLSearchParams): () => void {
  root.innerHTML = TEMPLATE;
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const editor = new CodeEditor($<HTMLElement>('#code'));
  const canvases = root.querySelectorAll<HTMLCanvasElement>('canvas.view');
  const views: Record<Mode, PlanView> = {
    '2d': new Plane2D(canvases[0]),
    '3d': new Space3D(canvases[1]),
  };
  const speed = $<HTMLInputElement>('#speed');
  const status = $<HTMLElement>('#status');
  const restore = $<HTMLButtonElement>('#restore');
  const disposers: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(
    target: HTMLElement | Window | Document,
    type: K | string,
    fn: (e: any) => void,
  ) => {
    target.addEventListener(type, fn as EventListener);
    disposers.push(() => target.removeEventListener(type, fn as EventListener));
  };

  let mode: Mode = query.get('tryb') === '3d' ? '3d' : '2d';
  let challenge: Challenge | null = null;
  let machine: Machine | null = null;
  let steps: Generator<Pos, void, undefined> | null = null;
  let status_: Status = 'idle';
  let lastPos: Pos | null = null;
  let runError: ErrorInfo | null = null;
  let parseError: ErrorInfo | null = null;
  /** A one-off message shown in front of the status until the next run, step or reset. */
  let notice = '';
  let frame = 0;
  let saveTimer = 0;
  let disposed = false;

  const view = () => views[mode];
  const source = () => editor.value;
  const toPos = (e: ErrorInfo): Pos => ({ line: e.line, column: e.column });

  // ---- drafts -------------------------------------------------------------
  const saveDraftSoon = () => {
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => store.set(draftKey(mode), source()), 300);
  };
  const flushDraft = () => {
    clearTimeout(saveTimer);
    store.set(draftKey(mode), source());
  };
  const loadDraft = (m: Mode) => store.get(draftKey(m)) ?? DEFAULT_SOURCE[m];

  /** Keeps the editor's text before it is replaced, so loading an example never destroys a draft. */
  function keepCopy() {
    const text = source();
    if (!text.trim() || text === DEFAULT_SOURCE[mode]) return;
    store.set(copyKey(mode), text);
    restore.hidden = false;
  }

  // ---- status -------------------------------------------------------------
  function announce(extra = '') {
    const n = machine?.segments.length ?? 0;
    const where = lastPos ? ` w wierszu ${lastPos.line}` : '';
    let text: string;
    let kind = '';
    if (runError) {
      text = `Błąd w wierszu ${runError.line}, kolumnie ${runError.column}: ${runError.message} Narysowano ${segmentsWord(n)}.`;
      kind = 'err';
    } else if (parseError) {
      text = `Błąd w wierszu ${parseError.line}, kolumnie ${parseError.column}: ${parseError.message}`;
      kind = 'err';
    } else if (status_ === 'running') text = `Wykonywanie${where}. Odcinków: ${n}.`;
    else if (status_ === 'paused') text = `Wstrzymano${where}. Odcinków: ${n}.`;
    else if (status_ === 'done') text = `Gotowe. Narysowano ${segmentsWord(n)}.`;
    else text = 'Gotowe. Uruchom program: Ctrl+Enter.';
    status.textContent = [notice, text, extra].filter(Boolean).join(' ');
    status.dataset.kind = kind;
    $<HTMLElement>('#pause').innerHTML = `${status_ === 'paused' ? 'Wznów' : 'Pauza'} <kbd>F9</kbd>`;
  }

  function showMarker() {
    const e = runError ?? parseError;
    editor.setError(e ? toPos(e) : null);
  }

  function refreshParseState() {
    try {
      compile(source(), mode);
      parseError = null;
    } catch (e) {
      if (!(e instanceof LogoError)) throw e;
      parseError = { message: e.message, line: e.line, column: e.column };
    }
    showMarker();
  }

  // ---- execution ----------------------------------------------------------
  function stopAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function resetSession() {
    stopAnimation();
    notice = '';
    machine = null;
    steps = null;
    status_ = 'idle';
    lastPos = null;
    runError = null;
    editor.setExec(null);
  }

  /** Compiles and prepares a fresh run. A parse-time error draws nothing. */
  function start(): boolean {
    resetSession();
    let program;
    try {
      program = compile(source(), mode);
    } catch (e) {
      if (!(e instanceof LogoError)) throw e;
      parseError = { message: e.message, line: e.line, column: e.column };
      status_ = 'error';
      showMarker();
      render();
      announce();
      return false;
    }
    parseError = null;
    machine = new Machine(program);
    steps = machine.execute();
    view().fit(runProgram(source(), mode).segments);
    return true;
  }

  function advance(n: number) {
    if (!steps) return;
    try {
      for (let k = 0; k < n; k++) {
        const r = steps.next();
        if (r.done) {
          steps = null;
          status_ = 'done';
          break;
        }
        lastPos = r.value;
      }
    } catch (e) {
      if (!(e instanceof LogoError)) throw e;
      runError = { message: e.message, line: e.line, column: e.column };
      lastPos = toPos(runError);
      steps = null;
      status_ = 'error';
    }
    editor.setExec(status_ === 'running' || status_ === 'paused' ? lastPos : null);
    if (lastPos && (status_ === 'running' || status_ === 'paused')) editor.reveal(lastPos);
    showMarker();
  }

  function loop() {
    frame = 0;
    if (status_ !== 'running') return;
    advance(STEP_COUNTS[Number(speed.value) - 1]);
    render();
    announce();
    if (status_ === 'running') frame = requestAnimationFrame(loop);
  }

  function play() {
    status_ = 'running';
    stopAnimation();
    frame = requestAnimationFrame(loop);
    announce();
  }

  function run() {
    if (start()) play();
  }

  function step() {
    stopAnimation();
    if (!steps) {
      if (!start()) return;
    }
    status_ = 'paused';
    advance(1);
    render();
    announce();
  }

  function togglePause() {
    if (status_ === 'running') {
      stopAnimation();
      status_ = 'paused';
      editor.setExec(lastPos);
      render();
      announce();
    } else if (status_ === 'paused' && steps) {
      play();
    }
  }

  function reset() {
    resetSession();
    showMarker();
    render();
    announce();
  }

  function render() {
    view().render(machine?.segments ?? [], machine ? machine.turtle : IDLE_TURTLE);
  }

  // ---- modes, examples and files -----------------------------------------
  /** Switches the mode: the current draft is saved and the other mode's draft is shown. */
  function setMode(next: Mode) {
    if (next === mode) return;
    flushDraft();
    switchTo(next);
    editor.value = loadDraft(mode);
    resetSession();
    refreshParseState();
    run();
  }

  /** Changes the mode without touching the text: updates buttons and visible canvas. */
  function switchTo(next: Mode) {
    mode = next;
    for (const b of root.querySelectorAll<HTMLButtonElement>('button[data-mode]')) {
      b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    }
    for (const c of canvases) c.hidden = c.dataset.mode !== mode;
  }

  function loadText(text: string, next: Mode, label = '') {
    keepCopy();
    flushDraft();
    if (next !== mode) switchTo(next);
    challenge = null;
    showChallenge();
    editor.value = text;
    flushDraft();
    run();
    if (label) {
      notice = label;
      announce();
    }
  }

  function download(blob: Blob, name: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ---- challenges ----------------------------------------------------------
  function showChallenge() {
    const box = $<HTMLElement>('#challenge');
    if (!challenge) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    box.hidden = false;
    box.innerHTML = `
      <p class="eyebrow">Wyzwanie · ${challenge.mode === '2d' ? '2D' : '3D'}</p>
      <h2>${challenge.title}</h2>
      <p>${challenge.task}</p>
      <div class="challenge-actions">
        <button type="button" class="primary" id="check">Sprawdź rozwiązanie</button>
        <a href="#/wyzwania">Wszystkie wyzwania</a>
        <span id="check-result" role="status"></span>
      </div>`;
    box.querySelector<HTMLButtonElement>('#check')!.addEventListener('click', checkChallengeNow);
  }

  function checkChallengeNow() {
    if (!challenge) return;
    const result = checkChallenge(challenge, source());
    const out = document.getElementById('check-result');
    if (out) {
      out.textContent = result.ok ? `✔ Zaliczone. ${result.reason}` : `✘ Nie tym razem. ${result.reason}`;
      out.dataset.kind = result.ok ? 'ok' : 'err';
    }
    if (result.ok) markSolved(challenge.id);
    run();
  }

  // ---- event wiring -------------------------------------------------------
  root.querySelectorAll<HTMLButtonElement>('button[data-mode]').forEach((b) => {
    on(b, 'click', () => setMode(b.dataset.mode as Mode));
  });
  on($<HTMLButtonElement>('#run'), 'click', run);
  on($<HTMLButtonElement>('#step'), 'click', step);
  on($<HTMLButtonElement>('#pause'), 'click', togglePause);
  on($<HTMLButtonElement>('#reset'), 'click', reset);
  on(speed, 'input', () => {
    speed.setAttribute('aria-valuetext', `poziom ${speed.value} z 10`);
  });
  on($<HTMLSelectElement>('#examples'), 'change', (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const ex = EXAMPLES.find((x) => x.name === select.value);
    select.value = '';
    if (!ex) return;
    loadText(ex.source, ex.mode, `Wczytano przykład „${ex.title}”.`);
  });
  on($<HTMLButtonElement>('#open'), 'click', () => $<HTMLInputElement>('#file').click());
  on($<HTMLInputElement>('#file'), 'change', async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    loadText(await file.text(), mode, `Wczytano plik „${file.name}”.`);
  });
  on($<HTMLButtonElement>('#save'), 'click', () => {
    const name = challenge ? `${challenge.id}.logo` : `program-${mode}.logo`;
    download(new Blob([source()], { type: 'text/plain;charset=utf-8' }), name);
  });
  on($<HTMLButtonElement>('#share'), 'click', async () => {
    const url = permalink(source(), mode);
    try {
      await navigator.clipboard.writeText(url);
      announce('Link skopiowano do schowka.');
    } catch {
      announce(`Nie udało się skopiować. Link: ${url}`);
    }
  });
  on($<HTMLButtonElement>('#png'), 'click', () => {
    render();
    views[mode].canvas.toBlob((blob) => {
      if (blob) download(blob, `logomocja-${mode}.png`);
    }, 'image/png');
  });
  on($<HTMLButtonElement>('#fit'), 'click', () => view().fit(machine?.segments ?? []));
  on($<HTMLButtonElement>('#view-reset'), 'click', () => view().reset());
  on(restore, 'click', () => {
    const copy = store.get(copyKey(mode));
    if (copy !== null) {
      editor.value = copy;
      flushDraft();
      run();
    }
    restore.hidden = true;
  });
  for (const v of Object.values(views)) v.onChange = () => render();

  const resize = new ResizeObserver(() => render());
  resize.observe(root.querySelector('.pane-view')!);
  disposers.push(() => resize.disconnect());

  editor.onInput = () => {
    if (status_ === 'running' || status_ === 'paused') {
      resetSession();
      machine = null;
      render();
      notice = 'Program zmieniono w trakcie wykonywania: przerwano. Uruchom ponownie (Ctrl+Enter).';
    } else {
      runError = null;
      if (status_ === 'error') status_ = 'idle';
    }
    refreshParseState();
    saveDraftSoon();
    announce();
  };

  on(document, 'keydown', (e: KeyboardEvent) => {
    if (disposed) return;
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      run();
    } else if (e.key === 'F8') {
      e.preventDefault();
      step();
    } else if (e.key === 'F9') {
      e.preventDefault();
      togglePause();
    } else if (e.key === 'Escape') {
      if (machine || status_ !== 'idle') reset();
    }
  });
  on(window, 'pagehide', flushDraft);

  // ---- initial state -------------------------------------------------------
  const hasCopy = store.get(copyKey(mode)) !== null;
  restore.hidden = !hasCopy;

  const kod = query.get('kod');
  const wyzwanie = query.get('wyzwanie');
  if (wyzwanie) {
    challenge = CHALLENGES.find((c) => c.id === wyzwanie) ?? null;
  }
  if (challenge) {
    mode = challenge.mode;
    editor.value = challenge.starter;
    showChallenge();
  } else if (kod !== null) {
    editor.value = decodeSource(kod) ?? loadDraft(mode);
  } else {
    editor.value = loadDraft(mode);
  }
  switchTo(mode);
  speed.setAttribute('aria-valuetext', `poziom ${speed.value} z 10`);
  refreshParseState();
  run();
  announce();

  // ---- testing hook --------------------------------------------------------
  const api: EditorApi = {
    async open(text: string, m: Mode): Promise<RunResult> {
      if (m !== mode) switchTo(m);
      challenge = null;
      showChallenge();
      editor.value = text;
      flushDraft();
      if (start()) advance(Number.POSITIVE_INFINITY);
      const final = runProgram(text, m);
      view().fit(final.segments);
      render();
      announce();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      return { segments: final.segments, error: final.error };
    },
  };
  active = api;

  return () => {
    disposed = true;
    stopAnimation();
    clearTimeout(saveTimer);
    flushDraft();
    if (active === api) active = null;
    for (const d of disposers) d();
  };
}
