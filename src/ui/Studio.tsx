import { useEffect, useRef } from 'preact/hooks';
import { Editor, type EditorHandle } from '../editor/Editor';
import { COMMANDS_3D } from '../lang/keywords';
import { tokenize } from '../lang/lexer';
import { plural } from '../lang/errors';
import { speedLabel, SPEED_MAX, SPEED_MIN } from '../run/player';
import { CHALLENGES } from '../content/challenges';
import { navigate } from '../state/router';
import {
  activeChallenge, challengeProgress, checkActiveChallenge, checkResult, editSource, exec, getViewport,
  loadProgram, mode, notice, progress, reset, run, saveProgram, setGhostVisible, setSpeed, showGhost,
  shownError, source, speed, stats, status, step, togglePause,
} from '../state/studio';
import { ask, shareOpen, shortcutsOpen, toast } from '../state/ui';
import { DrawingView } from './DrawingView';
import { downloadBlob, downloadText, pickTextFile, readFileText, slug } from './files';
import { Icon } from './icons';
import { isMac, SHORTCUTS } from './shortcuts';

let editorHandle: EditorHandle | null = null;

export function focusEditor(): void {
  editorHandle?.focus();
}

function revealError(): void {
  const err = shownError.peek();
  if (err && editorHandle) editorHandle.reveal(err.offset, err.end);
}

function Toolbar() {
  const st = status.value;
  const canPause = st === 'running' || st === 'paused';
  const paused = st === 'paused';
  const sp = speed.value;
  return (
    <div class="toolbar" role="toolbar" aria-label="Wykonanie programu">
      <button
        type="button"
        class="btn btn-primary"
        onClick={() => run()}
        aria-keyshortcuts={SHORTCUTS.run.aria}
        title={`Uruchom cały program (${SHORTCUTS.run.label})`}
      >
        <Icon name="play" /> <span>Uruchom</span>
      </button>
      <button
        type="button"
        class="btn"
        onClick={() => step()}
        aria-keyshortcuts={SHORTCUTS.step.aria}
        title={`Wykonaj jedno polecenie (${SHORTCUTS.step.label})`}
      >
        <Icon name="step" /> <span>Krok</span>
      </button>
      <button
        type="button"
        class="btn"
        onClick={() => togglePause()}
        disabled={!canPause}
        aria-keyshortcuts={SHORTCUTS.pause.aria}
        title={`${paused ? 'Wznów' : 'Wstrzymaj'} (${SHORTCUTS.pause.label})`}
      >
        <Icon name={paused ? 'play' : 'pause'} /> <span>{paused ? 'Wznów' : 'Pauza'}</span>
      </button>
      <button
        type="button"
        class="btn"
        onClick={() => reset()}
        aria-keyshortcuts={SHORTCUTS.reset.aria}
        title={`Wyczyść rysunek i ustaw żółwia na starcie (${SHORTCUTS.reset.label})`}
      >
        <Icon name="reset" /> <span>Od nowa</span>
      </button>
      <label class="speed">
        <span class="speed-label">Tempo</span>
        <input
          type="range"
          min={SPEED_MIN}
          max={SPEED_MAX}
          step={1}
          value={sp}
          onInput={(e) => setSpeed(Number((e.currentTarget as HTMLInputElement).value))}
          aria-valuetext={`${sp} z ${SPEED_MAX}: ${speedLabel(sp)}`}
        />
        <span class="speed-value" aria-hidden="true">{speedLabel(sp)}</span>
      </label>
    </div>
  );
}

function StatusBar() {
  const err = shownError.value;
  const st = status.value;
  const pr = progress.value;
  const s = stats.value;
  const n = notice.value;
  if (err) {
    return (
      <div class={`status status-error${err.phase === 'live' ? ' status-live' : ''}`} id="editor-status">
        <button type="button" class="status-link" onClick={revealError} title="Pokaż miejsce błędu w kodzie">
          <span class="status-badge">{err.phase === 'run' ? 'Błąd wykonania' : 'Błąd'}</span>
          <span>
            Linia {err.line}, kolumna {err.column}: {err.message}
          </span>
        </button>
        {err.phase === 'run' && s && (
          <span class="status-note">Narysowano wcześniej: {s.segments} {plural(s.segments, 'odcinek', 'odcinki', 'odcinków')}.</span>
        )}
      </div>
    );
  }
  let text: string;
  if (n) text = n;
  else if (st === 'running') text = `Rysuję… operacja ${pr.done} z ${pr.total}.`;
  else if (st === 'paused') text = `Wstrzymano po operacji ${pr.done} z ${pr.total}. Krok: ${SHORTCUTS.step.label}, wznowienie: ${SHORTCUTS.pause.label}.`;
  else if (st === 'done' && s) {
    text = `Gotowe: ${s.segments} ${plural(s.segments, 'odcinek', 'odcinki', 'odcinków')}, ${s.operations} ${plural(s.operations, 'operacja', 'operacje', 'operacji')}.`;
  } else text = `Napisz program i naciśnij „Uruchom” (${SHORTCUTS.run.label}).`;
  return (
    <div class={`status${st === 'done' ? ' status-ok' : ''}`} id="editor-status">
      <span>{text}</span>
    </div>
  );
}

function detectMode(text: string): '2d' | '3d' | null {
  for (const t of tokenize(text)) if (t.kw && COMMANDS_3D.has(t.kw)) return '3d';
  return null;
}

function currentName(): string {
  const ch = activeChallenge.peek();
  if (ch) return `wyzwanie-${ch.id}`;
  const first = /^\s*;\s*(.+)$/m.exec(source.peek());
  return first ? slug(first[1]).slice(0, 40) : 'program';
}

async function openFile(): Promise<void> {
  const file = await pickTextFile();
  if (file) await openText(file.name, file.text);
}

async function openDropped(e: DragEvent): Promise<void> {
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  e.preventDefault();
  await openText(file.name, await readFileText(file));
}

async function openText(name: string, text: string): Promise<void> {
  const file = { name, text };
  if (file.text.length > 200_000) {
    toast('Ten plik jest za duży, by był programem Logo.', { tone: 'error' });
    return;
  }
  const m = detectMode(file.text) ?? mode.peek();
  const ok = await loadProgram(file.text, m, { title: file.name });
  if (ok) navigate({ name: 'studio' });
}

async function exportPng(): Promise<void> {
  const vp = getViewport();
  if (!vp) return;
  const blob = await vp.exportPNG();
  if (!blob) {
    toast('Nie udało się zapisać obrazka.', { tone: 'error' });
    return;
  }
  downloadBlob(blob, `${currentName()}.png`);
  toast('Zapisano rysunek jako PNG.', { tone: 'success' });
}

async function saveToLibrary(): Promise<void> {
  const first = /^\s*;\s*(.+)$/m.exec(source.peek());
  const { choice, input } = await ask(
    'Zapisz w „Moich programach”',
    'Program zostanie zapisany w pamięci tej przeglądarki.',
    [
      { value: 'save', label: 'Zapisz', primary: true },
      { value: 'cancel', label: 'Anuluj' },
    ],
    { label: 'Nazwa programu', value: first ? first[1].slice(0, 60) : 'Mój program' },
  );
  if (choice !== 'save') return;
  const name = (input ?? '').trim() || 'Mój program';
  saveProgram(name, source.peek(), mode.peek());
  toast(`Zapisano „${name}” w Moich programach.`, { tone: 'success' });
}

function FileBar() {
  return (
    <div class="filebar" role="toolbar" aria-label="Plik i udostępnianie">
      <button type="button" class="btn btn-quiet" onClick={openFile} title="Otwórz plik .logo z dysku">
        <Icon name="upload" size={18} /> <span>Otwórz</span>
      </button>
      <button type="button" class="btn btn-quiet" onClick={() => downloadText(source.peek(), `${currentName()}.logo`)} title="Pobierz program jako plik .logo">
        <Icon name="download" size={18} /> <span>Pobierz .logo</span>
      </button>
      <button type="button" class="btn btn-quiet" onClick={exportPng} title="Zapisz rysunek jako obrazek PNG">
        <Icon name="image" size={18} /> <span>PNG</span>
      </button>
      <button type="button" class="btn btn-quiet" onClick={() => (shareOpen.value = true)} title="Utwórz link do programu">
        <Icon name="link" size={18} /> <span>Udostępnij</span>
      </button>
      {!activeChallenge.value && (
        <button type="button" class="btn btn-quiet" onClick={saveToLibrary} title="Zapisz w Moich programach">
          <Icon name="save" size={18} /> <span>Zapisz</span>
        </button>
      )}
      <button type="button" class="btn btn-quiet" onClick={() => (shortcutsOpen.value = true)} title="Skróty klawiszowe">
        <Icon name="keyboard" size={18} /> <span>Skróty</span>
      </button>
    </div>
  );
}

function ChallengePanel() {
  const ch = activeChallenge.value!;
  const res = checkResult.value;
  const solved = challengeProgress.value[ch.id]?.solved;
  const idx = CHALLENGES.findIndex((c) => c.id === ch.id);
  const next = CHALLENGES[idx + 1];
  return (
    <section class="challenge-panel" aria-labelledby="challenge-title">
      <div class="challenge-head">
        <button type="button" class="btn btn-quiet btn-small" onClick={() => navigate({ name: 'challenges' })}>
          <Icon name="arrowLeft" size={16} /> <span>Wyzwania</span>
        </button>
        <span class="badge">{ch.mode === '2d' ? '2D' : '3D'}</span>
        <span class="badge badge-level" title="Poziom trudności">{'★'.repeat(ch.level)}<span class="sr-only">poziom {ch.level}</span></span>
        {solved && (
          <span class="badge badge-ok">
            <Icon name="check" size={14} /> rozwiązane
          </span>
        )}
      </div>
      <h2 id="challenge-title">
        {idx + 1}. {ch.title}
      </h2>
      <p class="challenge-task">{ch.task}</p>
      <details class="challenge-hint">
        <summary>Podpowiedź</summary>
        <p>{ch.hint}</p>
      </details>
      <div class="challenge-actions">
        <button type="button" class="btn btn-primary" onClick={() => checkActiveChallenge()}>
          <Icon name="check" /> <span>Sprawdź</span>
        </button>
        <label class="toggle">
          <input type="checkbox" checked={showGhost.value} onChange={(e) => setGhostVisible((e.currentTarget as HTMLInputElement).checked)} />
          <span>Pokaż wzór</span>
        </label>
        {next && (
          <button type="button" class="btn btn-quiet" onClick={() => navigate({ name: 'challenge', id: next.id })}>
            <span>Następne</span> <Icon name="arrowRight" size={16} />
          </button>
        )}
      </div>
      {res && (
        <div class={`check-result ${res.pass ? 'check-pass' : 'check-fail'}`} role="status">
          <strong>
            <Icon name={res.pass ? 'check' : 'close'} size={18} /> {res.title}
          </strong>
          <ul>
            {res.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function Studio() {
  const ch = activeChallenge.value;
  const err = shownError.value;
  const st = status.value;
  const editorRef = useRef<EditorHandle | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (e.key === 'Enter' && mod && !e.altKey) {
        e.preventDefault();
        if (e.shiftKey) step();
        else run();
        return;
      }
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.code === 'KeyK') {
          e.preventDefault();
          step();
        } else if (e.code === 'KeyP') {
          e.preventDefault();
          togglePause();
        } else if (e.code === 'KeyR') {
          e.preventDefault();
          reset();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main class="studio" id="main" tabIndex={-1}>
      <h1 class="sr-only">Logomocja — studio{ch ? `: wyzwanie ${ch.title}` : ''}</h1>
      <section
        class="pane pane-code"
        aria-label="Program"
        onDragOver={(e) => {
          if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
        }}
        onDrop={openDropped}
      >
        {ch && <ChallengePanel />}
        <Toolbar />
        <Editor
          value={source.value}
          onChange={editSource}
          error={err}
          errorBubble={!!err && err.phase !== 'live'}
          exec={exec.value}
          follow={st === 'paused' || (st === 'running' && speed.value <= 6)}
          label={ch ? `Kod rozwiązania wyzwania ${ch.title}` : `Kod programu (tryb ${mode.value === '2d' ? '2D' : '3D'})`}
          describedBy="editor-status"
          handleRef={(h) => {
            editorRef.current = h;
            editorHandle = h;
          }}
        />
        <StatusBar />
        <FileBar />
      </section>
      <section class="pane pane-view" aria-label="Rysunek">
        <DrawingView />
      </section>
    </main>
  );
}
