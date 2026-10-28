import { batch, signal } from '@preact/signals';
import type { Mode } from '../lang/ast';
import type { SourceSpan } from '../lang/errors';
import { LogoError } from '../lang/errors';
import { execute, initialTurtle, type Outcome, type Segment } from '../lang/interpreter';
import { parse } from '../lang/parser';
import { runPublic, type PublicResult } from '../lang/index';
import { Player, SPEED_MAX, type PlayerView } from '../run/player';
import type { Scene } from '../render/scene';
import type { Viewport } from '../render/viewport';
import { EXAMPLES } from '../content/examples';
import { findChallenge, type Challenge } from '../content/challenges';
import { checkChallenge, targetOf, type CheckResult } from '../content/check';
import { load, save } from './storage';
import { announce, ask, toast } from './ui';

export type RunStatus = 'idle' | 'running' | 'paused' | 'done' | 'error' | 'interrupted';

export interface ShownError {
  message: string;
  line: number;
  column: number;
  offset: number;
  end: number;
  phase: 'parse' | 'run' | 'live';
}

interface Draft {
  code: string;
  /** The text as last loaded (example, file, link); edits make the draft "dirty". */
  baseline: string;
}

export const WELCOME: Record<Mode, string> = {
  '2d': `; Witaj w Logomocji!
; Napisz program i naciśnij „Uruchom” (Ctrl+Enter).
kolor "#16866a"
powtorz 4 [
  np 100
  pw 90
]
`,
  '3d': `; Tryb 3D: żółw porusza się w przestrzeni.
; gora i dol pochylają jego nos, pp i pl przechylają go na boki.
kolor "#2b6fb3"
powtorz 4 [
  np 100
  pw 90
]
gora 90
np 100
`,
};

function loadDrafts(): Record<Mode, Draft> {
  const stored = load<Partial<Record<Mode, Draft>>>('drafts', {});
  const fix = (m: Mode): Draft => {
    const d = stored[m];
    if (d && typeof d.code === 'string') return { code: d.code, baseline: typeof d.baseline === 'string' ? d.baseline : d.code };
    return { code: WELCOME[m], baseline: WELCOME[m] };
  };
  return { '2d': fix('2d'), '3d': fix('3d') };
}

const drafts = loadDrafts();
let freeMode: Mode = load<Mode>('mode', '2d') === '3d' ? '3d' : '2d';

export const mode = signal<Mode>(freeMode);
export const source = signal<string>(drafts[freeMode].code);
export const speed = signal<number>(Math.min(SPEED_MAX, Math.max(1, Number(load('speed', 6)) || 6)));
export const status = signal<RunStatus>('idle');
export const shownError = signal<ShownError | null>(null);
export const exec = signal<SourceSpan | null>(null);
export const progress = signal<{ done: number; total: number }>({ done: 0, total: 0 });
export const stats = signal<{ segments: number; operations: number } | null>(null);
export const notice = signal<string>('');
export const activeChallenge = signal<Challenge | null>(null);
export const checkResult = signal<CheckResult | null>(null);
export const showGhost = signal<boolean>(true);
export const dirty = signal<boolean>(false);

// ------------------------------------------------------------------ progress of challenges

export interface ChallengeProgress {
  solved: boolean;
  code: string;
}

export const challengeProgress = signal<Record<string, ChallengeProgress>>(load('challenges', {}));

function saveChallengeCode(id: string, code: string, solved?: boolean): void {
  const prev = challengeProgress.value[id];
  challengeProgress.value = {
    ...challengeProgress.value,
    [id]: { code, solved: solved ?? prev?.solved ?? false },
  };
  save('challenges', challengeProgress.value);
}

// ------------------------------------------------------------------ my programs

export interface SavedProgram {
  id: string;
  name: string;
  mode: Mode;
  code: string;
  updated: number;
}

export const programs = signal<SavedProgram[]>(load('programs', []));

export function saveProgram(name: string, code: string, m: Mode): SavedProgram {
  const p: SavedProgram = { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name, mode: m, code, updated: Date.now() };
  programs.value = [p, ...programs.value];
  if (!save('programs', programs.value)) toast('Nie udało się zapisać w pamięci przeglądarki.', { tone: 'error' });
  return p;
}

export function deleteProgram(id: string): SavedProgram | undefined {
  const p = programs.value.find((x) => x.id === id);
  programs.value = programs.value.filter((x) => x.id !== id);
  save('programs', programs.value);
  return p;
}

export function restoreProgram(p: SavedProgram): void {
  programs.value = [p, ...programs.value.filter((x) => x.id !== p.id)].sort((a, b) => b.updated - a.updated);
  save('programs', programs.value);
}

export function renameProgram(id: string, name: string): void {
  programs.value = programs.value.map((p) => (p.id === id ? { ...p, name, updated: Date.now() } : p));
  save('programs', programs.value);
}

function stamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ------------------------------------------------------------------ viewport and player

let viewport: Viewport | null = null;
const viewportWaiters: ((v: Viewport) => void)[] = [];
let ghost: Segment[] | null = null;
let marks: Segment[] | null = null;
let traceSource: string | null = null;

function decorate(scene: Scene): Scene {
  return { ...scene, ghost: showGhost.value ? ghost : null, marks };
}

function idleScene(): Scene {
  return decorate({ log: [], start: 0, end: 0, partial: null, turtle: initialTurtle(), ghost: null });
}

function onFrame(view: PlayerView): void {
  viewport?.setScene(decorate(view.scene));
  const at = view.at;
  const cur = exec.peek();
  if (!at || !cur || at.offset !== cur.offset) exec.value = at;
  progress.value = { done: view.done, total: view.total };
}

function onEnd(): void {
  const out = player.outcome;
  if (!out) return;
  batch(() => {
    exec.value = null;
    stats.value = { segments: out.segments.length, operations: out.operations };
    if (out.error) {
      status.value = 'error';
      shownError.value = errorInfo(out.error, 'run');
      announce(`Błąd w linii ${out.error.line}, kolumnie ${out.error.column}: ${out.error.message}`);
    } else {
      status.value = 'done';
      announce(`Gotowe. Narysowano odcinków: ${out.segments.length}.`);
    }
  });
}

export const player = new Player(onFrame, onEnd);

export function attachViewport(v: Viewport): void {
  viewport = v;
  v.setMode(mode.peek());
  if (fitOnAttach) {
    v.fitTo(fitOnAttach.scene, fitOnAttach.resetCamera);
    fitOnAttach = null;
  }
  if (player.outcome) player.emit();
  else v.setScene(idleScene());
  while (viewportWaiters.length) viewportWaiters.shift()!(v);
}

export function detachViewport(v: Viewport): void {
  if (viewport === v) viewport = null;
}

export function getViewport(): Viewport | null {
  return viewport;
}

function whenViewport(): Promise<Viewport> {
  if (viewport) return Promise.resolve(viewport);
  return new Promise((resolve) => viewportWaiters.push(resolve));
}

function errorInfo(e: LogoError, phase: ShownError['phase']): ShownError {
  return { message: e.message, line: e.line, column: e.column, offset: e.offset, end: e.end, phase };
}

// ------------------------------------------------------------------ drafts

let saveTimer = 0;

function isExampleCode(code: string): boolean {
  return EXAMPLES.some((e) => e.source === code) || code === WELCOME['2d'] || code === WELCOME['3d'];
}

function updateDirty(): void {
  const ch = activeChallenge.peek();
  if (ch) {
    dirty.value = false;
    return;
  }
  const d = drafts[mode.peek()];
  dirty.value = d.code.trim() !== '' && d.code !== d.baseline && !isExampleCode(d.code);
}

export function flushDrafts(): void {
  window.clearTimeout(saveTimer);
  saveTimer = 0;
  const ch = activeChallenge.peek();
  if (ch) saveChallengeCode(ch.id, source.peek());
  else drafts[mode.peek()].code = source.peek();
  save('drafts', drafts);
}

function scheduleSave(): void {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(flushDrafts, 400);
}

// ------------------------------------------------------------------ live syntax check

let liveTimer = 0;

function scheduleLiveCheck(delay = 650): void {
  window.clearTimeout(liveTimer);
  liveTimer = window.setTimeout(liveCheck, delay);
}

function liveCheck(): void {
  const cur = shownError.peek();
  if (cur && cur.phase !== 'live') return;
  try {
    parse(source.peek(), mode.peek());
    shownError.value = null;
  } catch (e) {
    if (e instanceof LogoError) shownError.value = errorInfo(e, 'live');
  }
}

/** Called for every edit made by the user in the editor. */
export function editSource(text: string): void {
  if (text === source.peek()) return;
  batch(() => {
    source.value = text;
    if (!activeChallenge.peek()) drafts[mode.peek()].code = text;
    updateDirty();
    if (status.peek() === 'running' || status.peek() === 'paused') {
      player.halt();
      status.value = 'interrupted';
      exec.value = null;
      notice.value = 'Kod został zmieniony, więc wykonanie przerwano. Uruchom program ponownie.';
      announce(notice.value);
    }
    const cur = shownError.peek();
    if (cur && cur.phase !== 'live') shownError.value = null;
    if (checkResult.peek()) {
      checkResult.value = null;
      marks = null;
    }
  });
  scheduleSave();
  scheduleLiveCheck();
}

// ------------------------------------------------------------------ running

export interface RunOptions {
  instant?: boolean;
  fit?: boolean;
  resetCamera?: boolean;
}

function prepare(): Outcome {
  window.clearTimeout(liveTimer);
  const out = execute(source.peek(), mode.peek(), { trace: true });
  traceSource = source.peek();
  notice.value = '';
  return out;
}

function showParseError(out: Outcome): void {
  player.clear();
  batch(() => {
    status.value = 'error';
    exec.value = null;
    stats.value = null;
    progress.value = { done: 0, total: 0 };
    shownError.value = errorInfo(out.error!, 'parse');
  });
  viewport?.setScene(idleScene());
  announce(`Błąd w linii ${out.error!.line}, kolumnie ${out.error!.column}: ${out.error!.message}`);
}

/** A fit requested while the studio was not on screen, applied when the view appears. */
let fitOnAttach: { scene: Scene; resetCamera: boolean } | null = null;

function fitFor(out: Outcome, opts: RunOptions): void {
  const scene = decorate({ log: out.log, start: 0, end: out.log.length, partial: null, turtle: out.turtle, ghost: null });
  if (!viewport) {
    fitOnAttach = { scene, resetCamera: !!opts.resetCamera };
    return;
  }
  if (opts.fit || !viewport.userAdjusted) viewport.fitTo(scene, opts.resetCamera);
}

/** Runs the whole program from the start (animated unless instant or at full speed). */
export function run(opts: RunOptions = {}): Outcome {
  const out = prepare();
  if (out.error && out.error.phase === 'parse') {
    showParseError(out);
    if (opts.fit) viewport?.fitTo(idleScene(), opts.resetCamera);
    return out;
  }
  batch(() => {
    shownError.value = null;
    stats.value = null;
  });
  player.load(out);
  player.speed = speed.peek();
  fitFor(out, opts);
  if (opts.instant || speed.peek() >= SPEED_MAX) {
    player.toEnd();
  } else {
    status.value = 'running';
    announce('Rysuję…');
    player.play();
  }
  return out;
}

export function step(): void {
  const st = status.peek();
  const stale = traceSource !== source.peek();
  if (st === 'idle' || st === 'done' || st === 'error' || st === 'interrupted' || stale || !player.outcome) {
    const out = prepare();
    if (out.error && out.error.phase === 'parse') {
      showParseError(out);
      return;
    }
    shownError.value = null;
    stats.value = null;
    player.load(out);
    fitFor(out, {});
    player.emit();
  }
  player.speed = speed.peek();
  status.value = 'paused';
  player.step();
}

export function pause(): void {
  if (status.peek() !== 'running') return;
  player.pause();
  status.value = 'paused';
  announce('Wstrzymano.');
}

export function resume(): void {
  if (status.peek() !== 'paused' || !player.outcome) return;
  player.speed = speed.peek();
  status.value = 'running';
  if (speed.peek() >= SPEED_MAX) player.toEnd();
  else player.play();
}

export function togglePause(): void {
  if (status.peek() === 'running') pause();
  else if (status.peek() === 'paused') resume();
}

export function reset(): void {
  player.clear();
  batch(() => {
    status.value = 'idle';
    exec.value = null;
    stats.value = null;
    notice.value = '';
    progress.value = { done: 0, total: 0 };
    const cur = shownError.peek();
    if (cur && cur.phase !== 'live') shownError.value = null;
  });
  viewport?.setScene(idleScene());
  scheduleLiveCheck(0);
}

export function setSpeed(level: number): void {
  speed.value = level;
  player.speed = level;
  save('speed', level);
  if (level >= SPEED_MAX && status.peek() === 'running') player.toEnd();
}

// ------------------------------------------------------------------ mode and loading

function applyMode(m: Mode): void {
  mode.value = m;
  viewport?.setMode(m);
}

export function setMode(m: Mode): void {
  if (activeChallenge.peek() || m === mode.peek()) return;
  flushDrafts();
  player.clear();
  freeMode = m;
  save('mode', m);
  batch(() => {
    applyMode(m);
    source.value = drafts[m].code;
    shownError.value = null;
    status.value = 'idle';
    exec.value = null;
    updateDirty();
  });
  run({ instant: true, fit: true, resetCamera: true });
  announce(`Tryb ${m === '2d' ? '2D' : '3D'}.`);
}

export interface LoadOptions {
  title: string;
  /** Ask before replacing a modified draft (false: back it up silently). */
  confirm?: boolean;
  animate?: boolean;
}

/**
 * Loads a program into the editor in the given mode. A modified draft is
 * never lost: the user is asked, a copy can be kept in "Moje programy", and
 * the toast offers an undo.
 */
export async function loadProgram(code: string, m: Mode, opts: LoadOptions): Promise<boolean> {
  code = code.replace(/\r\n?/g, '\n');
  if (activeChallenge.peek()) leaveChallenge(false);
  flushDrafts();
  const draft = drafts[m];
  const isDirty = draft.code.trim() !== '' && draft.code !== draft.baseline && !isExampleCode(draft.code) && draft.code !== code;
  let previous: Draft | null = null;
  if (isDirty) {
    const modeName = m === '2d' ? '2D' : '3D';
    if (opts.confirm !== false) {
      const { choice } = await ask(
        `Wczytać „${opts.title}”?`,
        `Twój szkic w trybie ${modeName} ma niezapisane zmiany. Możesz zachować jego kopię w „Moich programach”.`,
        [
          { value: 'save', label: 'Zachowaj kopię i wczytaj', primary: true },
          { value: 'replace', label: 'Wczytaj bez kopii' },
          { value: 'cancel', label: 'Anuluj' },
        ],
      );
      if (!choice || choice === 'cancel') return false;
      if (choice === 'save') {
        saveProgram(`Szkic ${modeName} — ${stamp()}`, draft.code, m);
      }
    } else {
      saveProgram(`Szkic ${modeName} — ${stamp()}`, draft.code, m);
    }
    previous = { ...draft };
  }
  player.clear();
  freeMode = m;
  save('mode', m);
  batch(() => {
    applyMode(m);
    drafts[m] = { code, baseline: code };
    source.value = code;
    shownError.value = null;
    updateDirty();
  });
  save('drafts', drafts);
  run({ instant: !opts.animate, fit: true, resetCamera: true });
  const prevDraft = previous;
  toast(`Wczytano „${opts.title}”.`, {
    action: prevDraft
      ? {
          label: 'Przywróć szkic',
          run: () => {
            if (activeChallenge.peek()) {
              drafts[m] = prevDraft;
              save('drafts', drafts);
              toast('Szkic przywrócono — zobaczysz go po wyjściu z wyzwania.');
              return;
            }
            if (mode.peek() !== m) {
              drafts[m] = prevDraft;
              setMode(m);
            } else {
              drafts[m] = prevDraft;
              source.value = prevDraft.code;
              run({ instant: true, fit: true });
            }
            updateDirty();
            save('drafts', drafts);
          },
        }
      : undefined,
  });
  return true;
}

// ------------------------------------------------------------------ challenges

let modeBeforeChallenge: Mode = freeMode;

export function enterChallenge(id: string): boolean {
  const ch = findChallenge(id);
  if (!ch) return false;
  if (activeChallenge.peek()?.id === id) return true;
  if (activeChallenge.peek()) leaveChallenge(false);
  else {
    flushDrafts();
    modeBeforeChallenge = mode.peek();
  }
  player.clear();
  ghost = targetOf(ch);
  marks = null;
  batch(() => {
    activeChallenge.value = ch;
    checkResult.value = null;
    applyMode(ch.mode);
    source.value = challengeProgress.peek()[id]?.code ?? ch.starter;
    shownError.value = null;
    status.value = 'idle';
    exec.value = null;
    stats.value = null;
    dirty.value = false;
  });
  whenViewport().then((v) => {
    if (activeChallenge.peek()?.id !== id) return;
    v.setScene(idleScene());
    v.fitTo(idleScene(), true);
  });
  return true;
}

export function leaveChallenge(rerun = true): void {
  const ch = activeChallenge.peek();
  if (!ch) return;
  saveChallengeCode(ch.id, source.peek());
  player.clear();
  ghost = null;
  marks = null;
  const m = modeBeforeChallenge;
  batch(() => {
    activeChallenge.value = null;
    checkResult.value = null;
    applyMode(m);
    source.value = drafts[m].code;
    shownError.value = null;
    status.value = 'idle';
    exec.value = null;
    updateDirty();
  });
  if (rerun) {
    if (viewport) run({ instant: true, fit: true, resetCamera: true });
  }
}

export function setGhostVisible(v: boolean): void {
  showGhost.value = v;
  if (player.outcome) player.emit();
  else viewport?.setScene(idleScene());
}

export function checkActiveChallenge(): CheckResult | null {
  const ch = activeChallenge.peek();
  if (!ch) return null;
  const result = checkChallenge(ch, source.peek());
  marks = result.missing.length ? result.missing : null;
  checkResult.value = result;
  const wasSolved = challengeProgress.peek()[ch.id]?.solved;
  saveChallengeCode(ch.id, source.peek(), result.pass || undefined);
  run({ instant: speed.peek() >= SPEED_MAX });
  if (result.pass && !wasSolved) toast(`Brawo! Wyzwanie „${ch.title}” rozwiązane.`, { tone: 'success' });
  announce(`${result.title}. ${result.reasons.join(' ')}`);
  return result;
}

// ------------------------------------------------------------------ testing hook

/** Loads a program as if pasted, runs it instantly and fits the view. */
export async function openForTesting(code: string, m: Mode): Promise<PublicResult> {
  if (activeChallenge.peek()) leaveChallenge(false);
  const v = await whenViewport();
  player.clear();
  freeMode = m;
  save('mode', m);
  batch(() => {
    applyMode(m);
    source.value = code;
    drafts[m].code = code;
    shownError.value = null;
    updateDirty();
  });
  save('drafts', drafts);
  run({ instant: true, fit: true, resetCamera: true });
  v.paintNow();
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  return runPublic(code, m);
}

window.addEventListener('pagehide', flushDrafts);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushDrafts();
});

updateDirty();
