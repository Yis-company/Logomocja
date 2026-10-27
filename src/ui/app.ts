import { compile, headingDegrees, Runner, type LogoError, type Mode, type Segment, type StepEvent } from '../logo';
import { initialTurtle, type TurtleState } from '../logo/turtle';
import { Editor } from './editor';
import { EXAMPLES, findExample } from './examples';
import { HELP_HTML } from './help';
import type { Mark } from './highlight';
import type { Stage } from './stage';
import * as storage from './storage';
import { View2D } from './view2d';

type RunState = 'idle' | 'running' | 'paused' | 'finished' | 'error' | 'stale';

/** Steps per second for each slider position; the last one runs the program instantly. */
const SPEEDS = [3, 8, 20, 50, 120, 300, 800, 2000, 6000, Infinity];
const DEFAULT_SPEED = 5;

const STATE_LABEL: Record<RunState, string> = {
  idle: 'Gotowy',
  running: 'Rysuje…',
  paused: 'Wstrzymano',
  finished: 'Zakończono',
  error: 'Błąd',
  stale: 'Zmieniono',
};

function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Brak elementu #${id}`);
  return el as T;
}

function fmt(n: number): string {
  const r = Math.round(n * 10) / 10;
  return (Object.is(r, -0) ? 0 : r).toLocaleString('pl-PL', { maximumFractionDigits: 1 });
}

export class App {
  private mode: Mode = '2d';
  private readonly editor: Editor;
  private readonly stage2d: View2D;
  private stage3d: Stage | null = null;
  private stage: Stage;
  private runner: Runner | null = null;
  private state: RunState = 'idle';
  private segments: Segment[] = [];
  private turtle: TurtleState = initialTurtle();
  private speedIndex = DEFAULT_SPEED;
  private autoFit = true;
  private grid = true;
  private rafId = 0;
  private lastTime = 0;
  private acc = 0;
  private lastLoaded = '';

  private readonly el = {
    mode2d: $<HTMLButtonElement>('mode-2d'),
    mode3d: $<HTMLButtonElement>('mode-3d'),
    examples: $<HTMLSelectElement>('examples'),
    helpBtn: $<HTMLButtonElement>('help-btn'),
    help: $<HTMLDialogElement>('help'),
    helpBody: $<HTMLElement>('help-body'),
    helpClose: $<HTMLButtonElement>('help-close'),
    run: $<HTMLButtonElement>('btn-run'),
    pause: $<HTMLButtonElement>('btn-pause'),
    pauseLabel: $<HTMLElement>('btn-pause-label'),
    step: $<HTMLButtonElement>('btn-step'),
    reset: $<HTMLButtonElement>('btn-reset'),
    speed: $<HTMLInputElement>('speed'),
    message: $<HTMLElement>('message'),
    stage: $<HTMLElement>('stage'),
    fit: $<HTMLButtonElement>('btn-fit'),
    gridBtn: $<HTMLButtonElement>('btn-grid'),
    notice: $<HTMLElement>('stage-notice'),
    stState: $<HTMLElement>('st-state'),
    stPos: $<HTMLElement>('st-pos'),
    stHeading: $<HTMLElement>('st-heading'),
    stSegments: $<HTMLElement>('st-segments'),
    stOps: $<HTMLElement>('st-ops'),
    splitter: $<HTMLElement>('splitter'),
    workspace: $<HTMLElement>('workspace'),
  };

  constructor() {
    this.editor = new Editor($('editor'), {
      onChange: (v) => this.onSourceChanged(v),
      onRun: () => this.run(),
    });
    this.stage2d = new View2D(this.el.stage);
    this.stage = this.stage2d;
    this.stage.onUserInteraction = () => (this.autoFit = false);
    this.stage.setSegments(this.segments);
    this.stage.setTurtle(this.turtle);

    this.fillExamples();
    this.el.helpBody.innerHTML = HELP_HTML;
    this.bindControls();
    this.bindSplitter();
    this.updateControls();
    this.updateStatus();
    void this.init();
  }

  private async init(): Promise<void> {
    await this.restore();
    // Run the restored program straight away so the drawing is there on arrival.
    if (this.editor.value.trim()) this.run();
  }

  // ---- setup ---------------------------------------------------------

  private fillExamples(): void {
    for (const ex of EXAMPLES) {
      const opt = document.createElement('option');
      opt.value = ex.id;
      opt.textContent = ex.title;
      this.el.examples.appendChild(opt);
    }
  }

  private bindControls(): void {
    const e = this.el;
    e.run.addEventListener('click', () => this.run());
    e.pause.addEventListener('click', () => (this.state === 'running' ? this.pause() : this.resume()));
    e.step.addEventListener('click', () => this.stepOnce());
    e.reset.addEventListener('click', () => this.reset());
    e.speed.addEventListener('input', () => {
      this.speedIndex = Number(e.speed.value) - 1;
      storage.save('speed', e.speed.value);
      this.updateSpeedLabel();
    });
    e.mode2d.addEventListener('click', () => void this.setMode('2d'));
    e.mode3d.addEventListener('click', () => void this.setMode('3d'));
    e.examples.addEventListener('change', () => {
      const id = e.examples.value;
      e.examples.value = '';
      if (id) void this.loadExample(id);
    });
    e.helpBtn.addEventListener('click', () => e.help.showModal());
    e.helpClose.addEventListener('click', () => e.help.close());
    e.help.addEventListener('click', (ev) => {
      if (ev.target === e.help) e.help.close();
    });
    e.fit.addEventListener('click', () => {
      this.autoFit = true;
      this.stage.fit();
    });
    e.gridBtn.addEventListener('click', () => this.setGrid(!this.grid));
    document.addEventListener('keydown', (ev) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') {
        ev.preventDefault();
        this.run();
      }
    });
  }

  private bindSplitter(): void {
    const sp = this.el.splitter;
    const ws = this.el.workspace;
    let dragging = false;
    const isRow = (): boolean => window.matchMedia('(min-width: 801px)').matches;
    sp.addEventListener('pointerdown', (ev) => {
      dragging = true;
      sp.setPointerCapture(ev.pointerId);
      sp.classList.add('dragging');
      ev.preventDefault();
    });
    sp.addEventListener('pointermove', (ev) => {
      if (!dragging) return;
      const rect = ws.getBoundingClientRect();
      if (isRow()) {
        const pct = Math.min(75, Math.max(25, ((ev.clientX - rect.left) / rect.width) * 100));
        ws.style.setProperty('--editor-width', `${pct}%`);
        storage.save('split-x', pct.toFixed(1));
      } else {
        const pct = Math.min(75, Math.max(20, ((ev.clientY - rect.top) / rect.height) * 100));
        ws.style.setProperty('--stage-height', `${pct}%`);
        storage.save('split-y', pct.toFixed(1));
      }
    });
    const end = (): void => {
      dragging = false;
      sp.classList.remove('dragging');
    };
    sp.addEventListener('pointerup', end);
    sp.addEventListener('pointercancel', end);
    const sx = storage.load('split-x');
    if (sx) ws.style.setProperty('--editor-width', `${sx}%`);
    const sy = storage.load('split-y');
    if (sy) ws.style.setProperty('--stage-height', `${sy}%`);
  }

  private async restore(): Promise<void> {
    const draft = storage.load('draft');
    if (draft !== null) {
      this.editor.value = draft;
    } else {
      const ex = EXAMPLES[0]!;
      this.editor.value = ex.source;
      this.lastLoaded = ex.source;
    }
    const speed = Number(storage.load('speed'));
    if (speed >= 1 && speed <= SPEEDS.length) {
      this.speedIndex = speed - 1;
      this.el.speed.value = String(speed);
    } else {
      this.el.speed.value = String(DEFAULT_SPEED + 1);
    }
    this.updateSpeedLabel();
    this.setGrid(storage.load('grid') !== '0');
    if (storage.load('mode') === '3d') await this.setMode('3d');
  }

  // ---- mode --------------------------------------------------------------

  private async setMode(mode: Mode): Promise<void> {
    if (mode === this.mode && (mode === '2d' || this.stage3d)) return;
    if (mode === '3d') {
      if (!this.stage3d) {
        this.el.mode3d.classList.add('loading');
        this.showNotice('Ładowanie trybu 3D…', 'info');
        try {
          const { View3D } = await import('./view3d');
          const view = new View3D(this.el.stage);
          view.setVisible(false);
          this.stage3d = view;
        } catch (err) {
          this.el.mode3d.classList.remove('loading');
          const reason = err instanceof Error ? err.message : String(err);
          this.showNotice(`Tryb 3D jest wyłączony. ${reason}`, 'warn', true);
          this.el.mode3d.setAttribute('aria-disabled', 'true');
          this.el.mode3d.title = `Tryb 3D niedostępny: ${reason}`;
          storage.save('mode', '2d');
          return;
        }
        this.el.mode3d.classList.remove('loading');
        this.hideNotice();
      }
    }
    this.mode = mode;
    storage.save('mode', mode);
    const next = mode === '3d' ? this.stage3d! : this.stage2d;
    if (next !== this.stage) {
      this.stage.setVisible(false);
      this.stage = next;
      this.stage.onUserInteraction = () => (this.autoFit = false);
      this.stage.setSegments(this.segments);
      this.stage.setTurtle(this.turtle);
      this.stage.setGrid(this.grid);
      this.stage.setVisible(true);
      this.stage.fit();
      this.autoFit = true;
    }
    this.el.mode2d.setAttribute('aria-pressed', String(mode === '2d'));
    this.el.mode3d.setAttribute('aria-pressed', String(mode === '3d'));
    document.body.dataset.mode = mode;
    // A program compiled for the other mode may now be invalid (or valid): recompile on next run.
    if (this.state === 'error' && this.runner === null) {
      this.clearMessage();
      this.editor.setMarks([]);
      this.setState('idle');
    }
    this.updateStatus();
  }

  private setGrid(on: boolean): void {
    this.grid = on;
    this.stage2d.setGrid(on);
    this.stage3d?.setGrid(on);
    this.el.gridBtn.setAttribute('aria-pressed', String(on));
    storage.save('grid', on ? '1' : '0');
  }

  // ---- examples ------------------------------------------------------------

  private async loadExample(id: string): Promise<void> {
    const ex = findExample(id);
    if (!ex) return;
    const current = this.editor.value;
    const isCustom = current.trim() !== '' && current !== this.lastLoaded && !EXAMPLES.some((x) => x.source === current);
    if (isCustom && !window.confirm('Zastąpić bieżący program przykładem? Twoje zmiany zostaną utracone.')) {
      return;
    }
    this.stopLoop();
    this.runner = null;
    if (ex.mode !== this.mode) await this.setMode(ex.mode);
    this.editor.value = ex.source;
    this.lastLoaded = ex.source;
    storage.save('draft', ex.source);
    this.autoFit = true;
    this.run();
  }

  // ---- run control ---------------------------------------------------------

  private onSourceChanged(value: string): void {
    storage.save('draft', value);
    if (this.runner) {
      // The running program no longer matches the text: stop, keep the drawing, ask for a rerun.
      this.stopLoop();
      this.runner = null;
      this.setState('stale');
      this.showMessage('Program został zmieniony. Uruchom go ponownie, aby zobaczyć nowy rysunek.', 'info');
    } else if (this.state === 'error' || this.state === 'finished') {
      this.clearMessage();
      this.setState('idle');
    }
  }

  /** Compiles the editor text and prepares a fresh run. Returns false on a parse error. */
  private start(): boolean {
    this.stopLoop();
    this.runner = null;
    this.clearMessage();
    this.editor.setMarks([]);
    const compiled = compile(this.editor.value, this.mode);
    if (compiled.error) {
      this.segments = [];
      this.turtle = initialTurtle();
      this.stage.setSegments(this.segments);
      this.stage.setTurtle(this.turtle);
      this.showError(compiled.error);
      this.setState('error');
      return false;
    }
    this.runner = new Runner(compiled.program);
    this.segments = this.runner.segments;
    this.turtle = this.runner.turtle;
    this.stage.setSegments(this.segments);
    this.stage.setTurtle(this.turtle);
    return true;
  }

  run(): void {
    if (!this.start()) return;
    this.setState('running');
    if (SPEEDS[this.speedIndex] === Infinity) {
      this.doSteps(Infinity);
      this.afterSteps();
    } else {
      this.startLoop();
    }
  }

  pause(): void {
    if (this.state !== 'running') return;
    this.stopLoop();
    this.setState('paused');
  }

  resume(): void {
    if (this.state !== 'paused' || !this.runner) return;
    this.setState('running');
    this.startLoop();
  }

  stepOnce(): void {
    if (this.state === 'running') this.pause();
    if (!this.runner) {
      if (!this.start()) return;
    }
    this.setState('paused');
    this.doSteps(1);
    this.afterSteps();
  }

  reset(): void {
    this.stopLoop();
    this.runner = null;
    this.segments = [];
    this.turtle = initialTurtle();
    this.stage.setSegments(this.segments);
    this.stage.setTurtle(this.turtle);
    this.editor.setMarks([]);
    this.clearMessage();
    this.autoFit = true;
    this.stage.fit();
    this.setState('idle');
  }

  private startLoop(): void {
    this.stopLoop();
    this.lastTime = performance.now();
    this.acc = 0;
    const tick = (now: number): void => {
      this.rafId = requestAnimationFrame(tick);
      const dt = Math.min(0.25, (now - this.lastTime) / 1000);
      this.lastTime = now;
      const sps = SPEEDS[this.speedIndex]!;
      let n: number;
      if (sps === Infinity) {
        n = Infinity;
      } else {
        this.acc += dt * sps;
        n = Math.floor(this.acc);
        this.acc -= n;
      }
      if (n > 0) this.doSteps(n);
      this.afterSteps();
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private lastEvent: StepEvent | null = null;

  private doSteps(n: number): void {
    const r = this.runner;
    if (!r) return;
    for (let i = 0; i < n && !r.finished; i++) {
      const ev = r.step();
      this.lastEvent = ev;
      if (ev.type === 'done' || ev.type === 'error') break;
    }
  }

  /** Reflects the runner state in the stage, editor marks, status and controls. */
  private afterSteps(): void {
    const r = this.runner;
    if (!r) return;
    this.stage.invalidate();
    const ev = this.lastEvent;
    if (r.finished) {
      this.stopLoop();
      if (r.error) {
        this.showError(r.error, true);
        this.setState('error');
      } else {
        this.editor.setMarks([]);
        this.setState('finished');
        this.showMessage(
          r.segments.length === 0
            ? 'Program zakończył się, nic nie rysując.'
            : `Gotowe: narysowano ${r.segments.length.toLocaleString('pl-PL')} ${pluralSeg(r.segments.length)}.`,
          'ok',
        );
      }
      if (this.autoFit) this.stage.fit();
    } else if (ev && 'stmt' in ev) {
      const p = ev.stmt.pos;
      const mark: Mark = { line: p.line, column: p.column, length: p.length, cls: 'active' };
      this.editor.setMarks([mark]);
      if (this.state === 'paused') this.editor.revealLine(p.line);
    }
    this.updateStatus();
  }

  // ---- presentation --------------------------------------------------------

  private setState(s: RunState): void {
    this.state = s;
    this.updateControls();
    this.updateStatus();
  }

  private updateControls(): void {
    const e = this.el;
    const running = this.state === 'running';
    const paused = this.state === 'paused';
    e.pause.disabled = !(running || paused);
    e.pauseLabel.textContent = paused ? 'Wznów' : 'Wstrzymaj';
    e.pause.classList.toggle('is-paused', paused);
    e.run.classList.toggle('is-running', running);
    e.stState.textContent = STATE_LABEL[this.state];
    e.stState.dataset.state = this.state;
  }

  private updateStatus(): void {
    const t = this.turtle;
    const pos = this.mode === '3d' ? `${fmt(t.position[0])}, ${fmt(t.position[1])}, ${fmt(t.position[2])}` : `${fmt(t.position[0])}, ${fmt(t.position[1])}`;
    this.el.stPos.textContent = pos;
    this.el.stHeading.textContent = `${fmt(headingDegrees(t))}°`;
    this.el.stSegments.textContent = this.segments.length.toLocaleString('pl-PL');
    this.el.stOps.textContent = (this.runner?.operations ?? 0).toLocaleString('pl-PL');
  }

  private updateSpeedLabel(): void {
    const sps = SPEEDS[this.speedIndex]!;
    this.el.speed.title = sps === Infinity ? 'Szybkość: natychmiast' : `Szybkość: ${sps} kroków na sekundę`;
    this.el.speed.setAttribute('aria-valuetext', sps === Infinity ? 'natychmiast' : `${sps} kroków na sekundę`);
  }

  private showError(err: LogoError, runtime = false): void {
    const mark: Mark = { line: err.line, column: err.column, length: err.length, cls: 'err' };
    this.editor.setMarks([mark]);
    const where = `wiersz ${err.line}, kolumna ${err.column}`;
    const kind = runtime ? 'Błąd podczas rysowania' : 'Błąd w programie';
    this.el.message.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'msg msg-error';
    box.setAttribute('role', 'alert');
    const strong = document.createElement('strong');
    strong.textContent = `${kind} (${where}): `;
    box.appendChild(strong);
    box.appendChild(document.createTextNode(err.message + ' '));
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'link';
    btn.textContent = 'Pokaż miejsce';
    btn.addEventListener('click', () => this.editor.goTo(err.line, err.column));
    box.appendChild(btn);
    this.el.message.appendChild(box);
  }

  private showMessage(text: string, kind: 'info' | 'ok'): void {
    this.el.message.innerHTML = '';
    const box = document.createElement('div');
    box.className = `msg msg-${kind}`;
    box.textContent = text;
    this.el.message.appendChild(box);
  }

  private clearMessage(): void {
    this.el.message.innerHTML = '';
  }

  private showNotice(text: string, kind: 'info' | 'warn', persistent = false): void {
    this.el.notice.textContent = text;
    this.el.notice.dataset.kind = kind;
    this.el.notice.hidden = false;
    this.el.notice.dataset.persistent = persistent ? '1' : '';
  }

  private hideNotice(): void {
    this.el.notice.hidden = true;
  }
}

function pluralSeg(n: number): string {
  const last = n % 10;
  const last2 = n % 100;
  if (n === 1) return 'odcinek';
  if (last >= 2 && last <= 4 && !(last2 >= 12 && last2 <= 14)) return 'odcinki';
  return 'odcinków';
}
