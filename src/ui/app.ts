import { errorInfoOf } from '../logo/errors';
import { EXAMPLES } from '../logo/examples';
import { Execution, validateLogo } from '../logo/run';
import type { LogoErrorInfo, Mode } from '../logo/types';
import { PlaneView } from '../render/plane';
import type { SpaceView } from '../render/space';
import type { StageView } from '../render/view';
import { webglProblem } from '../render/webgl';
import { readStorage, writeStorage } from './storage';

const DRAFT_KEY = 'logomocja.program.v1';
const MODE_KEY = 'logomocja.mode.v1';
const SAVE_DELAY_MS = 300;
const CHECK_DELAY_MS = 150;

function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Brak elementu #${id}`);
  return element as T;
}

/** Index of the character at 1-based line and column, clamped to the text. */
function offsetOf(text: string, line: number, column: number): number {
  const lines = text.split('\n');
  let offset = 0;
  for (let i = 0; i < Math.min(line, lines.length) - 1; i++) {
    offset += lines[i].length + 1;
  }
  return offset + Math.min(column - 1, (lines[line - 1] ?? '').length);
}

class App {
  private readonly source = byId<HTMLTextAreaElement>('source');
  private readonly diagnostic = byId<HTMLButtonElement>('diagnostic');
  private readonly status = byId<HTMLElement>('status');
  private readonly notice = byId<HTMLElement>('stage-notice');
  private readonly spaceHost = byId<HTMLElement>('space');
  private readonly planeCanvas = byId<HTMLCanvasElement>('plane');
  private readonly examples = byId<HTMLSelectElement>('example-select');
  private readonly speed = byId<HTMLInputElement>('speed');
  private readonly speedValue = byId<HTMLOutputElement>('speed-value');
  private readonly playButton = byId<HTMLButtonElement>('play');
  private readonly modeButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-mode]')];

  private readonly plane = new PlaneView(this.planeCanvas);
  private space: SpaceView | null = null;
  private spaceReady: Promise<boolean> | null = null;
  private spaceProblem: string | null = null;
  private mode: Mode = '2d';
  private execution: Execution | null = null;
  /** The source changed after the current run started, so the drawing no longer matches it. */
  private stale = false;
  private playing = false;
  private frame = 0;
  private lastTime = 0;
  private carry = 0;
  private saveTimer = 0;
  private checkTimer = 0;
  private problem: LogoErrorInfo | null = null;

  constructor() {
    for (const example of EXAMPLES) {
      this.examples.append(new Option(example.name, example.id));
    }

    this.spaceProblem = webglProblem();
    if (this.spaceProblem) this.disable3D(this.spaceProblem);

    this.source.value = readStorage(DRAFT_KEY) ?? EXAMPLES[0].source;
    this.updateSpeedLabel();
    this.bind();

    this.syncModeButtons();
    this.resetRun();
    if (readStorage(MODE_KEY) === '3d') void this.setMode('3d');
  }

  private bind(): void {
    for (const button of this.modeButtons) {
      button.addEventListener('click', () => void this.setMode(button.dataset.mode as Mode));
    }
    byId('run').addEventListener('click', () => this.runWhole());
    byId('step').addEventListener('click', () => this.step());
    this.playButton.addEventListener('click', () => this.togglePlay());
    byId('reset').addEventListener('click', () => this.resetRun());
    byId('fit').addEventListener('click', () => this.activeView().fit());
    byId('example-load').addEventListener('click', () => this.loadExample());
    this.speed.addEventListener('input', () => this.updateSpeedLabel());
    this.diagnostic.addEventListener('click', () => this.focusProblem());

    this.source.addEventListener('input', () => this.onEdit());
    this.source.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.runWhole();
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pause();
    });
  }

  private activeView(): StageView {
    return this.mode === '3d' && this.space ? this.space : this.plane;
  }

  private async setMode(mode: Mode): Promise<void> {
    if (mode === this.mode) return;
    if (mode === '3d' && !(await this.ensureSpace())) {
      this.setStatus(`Tryb 3D jest niedostępny: ${this.spaceProblem}.`);
      return;
    }
    this.mode = mode;
    this.planeCanvas.hidden = mode === '3d';
    this.spaceHost.hidden = mode !== '3d';
    this.syncModeButtons();
    writeStorage(MODE_KEY, mode);
    this.resetRun();
  }

  /** Loads three.js and creates the WebGL view on first use. Resolves false when 3D cannot be shown. */
  private ensureSpace(): Promise<boolean> {
    this.spaceReady ??= this.createSpace();
    return this.spaceReady;
  }

  private async createSpace(): Promise<boolean> {
    if (this.spaceProblem) return false;
    try {
      const { SpaceView } = await import('../render/space');
      this.space = new SpaceView(this.spaceHost);
      return true;
    } catch {
      this.disable3D('nie udało się utworzyć kontekstu WebGL');
      return false;
    }
  }

  private disable3D(reason: string): void {
    this.spaceProblem = reason;
    const button = byId<HTMLButtonElement>('mode-3d');
    button.disabled = true;
    button.title = `Tryb 3D jest wyłączony: ${reason}`;
    this.notice.hidden = false;
    this.notice.textContent = `Tryb 3D jest wyłączony: ${reason}. Tryb 2D działa normalnie.`;
  }

  private syncModeButtons(): void {
    for (const button of this.modeButtons) {
      const active = button.dataset.mode === this.mode;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('active', active);
    }
  }

  private runWhole(): void {
    const execution = this.startFresh();
    if (!execution) return;
    execution.runToEnd();
    this.show(execution);
  }

  private step(): void {
    if (!this.execution || this.execution.done || this.stale) {
      if (!this.startFresh()) return;
    }
    const execution = this.execution!;
    execution.step(1);
    this.show(execution);
  }

  private togglePlay(): void {
    if (this.playing) {
      this.pause();
      return;
    }
    if (!this.execution || this.execution.done || this.stale) {
      if (!this.startFresh()) return;
    }
    this.playing = true;
    this.playButton.textContent = 'Pauza';
    this.carry = 0;
    this.lastTime = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  private readonly tick = (now: number): void => {
    if (!this.playing || !this.execution) return;
    const elapsed = Math.min(now - this.lastTime, 250);
    this.lastTime = now;
    this.carry += (Number(this.speed.value) * elapsed) / 1000;
    const commands = Math.floor(this.carry);
    this.carry -= commands;
    if (commands > 0) this.execution.step(commands);
    this.show(this.execution);
    if (this.execution.done) {
      this.pause();
      return;
    }
    this.frame = requestAnimationFrame(this.tick);
  };

  private pause(): void {
    this.playing = false;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.playButton.textContent = 'Odtwórz';
  }

  /** Stops any run, clears the drawing and checks the program. */
  private resetRun(): void {
    this.pause();
    this.execution = null;
    this.stale = false;
    this.activeView().update([], null);
    this.setStatus('Gotowe.');
    this.validate();
  }

  /** Starts a new execution of the current source. Returns null, with the error shown, if it does not parse. */
  private startFresh(): Execution | null {
    this.pause();
    this.stale = false;
    try {
      this.execution = new Execution(this.source.value, this.mode);
    } catch (error) {
      this.execution = null;
      this.showProblem(errorInfoOf(error));
      this.activeView().update([], null);
      this.setStatus('Program nie został uruchomiony. Popraw błąd.');
      return null;
    }
    this.showProblem(null);
    const { machine } = this.execution;
    this.activeView().update(machine.segments, machine.turtle);
    return this.execution;
  }

  private show(execution: Execution): void {
    const { machine } = execution;
    this.activeView().update(machine.segments, machine.turtle);
    const drawn = machine.segments.length;

    if (execution.error) {
      this.showProblem(execution.error);
      this.activeView().fit();
      this.setStatus(`Program zatrzymany na błędzie. Narysowano odcinków: ${drawn}.`);
    } else if (execution.done) {
      this.activeView().fit();
      this.setStatus(`Koniec programu. Odcinków: ${drawn}, operacji: ${machine.operations}.`);
    } else {
      const last = execution.current;
      const where = last ? `„${last.text}” (wiersz ${last.line}, kolumna ${last.column})` : '—';
      this.setStatus(`Ostatnie polecenie: ${where}. Odcinków: ${drawn}, operacji: ${machine.operations}.`);
    }
  }

  private onEdit(): void {
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => writeStorage(DRAFT_KEY, this.source.value), SAVE_DELAY_MS);

    window.clearTimeout(this.checkTimer);
    this.checkTimer = window.setTimeout(() => this.validate(), CHECK_DELAY_MS);

    if (this.execution) {
      this.pause();
      this.stale = true;
      this.setStatus('Program zmieniono. Krok, Odtwórz lub Uruchom zacznie go od początku.');
    }
  }

  private validate(): void {
    this.showProblem(validateLogo(this.source.value, this.mode));
  }

  private loadExample(): void {
    const example = EXAMPLES.find((e) => e.id === this.examples.value);
    if (!example) return;
    const current = this.source.value.trim();
    if (current && current !== example.source.trim() && !window.confirm('Zastąpić bieżący program wybranym przykładem?')) {
      return;
    }
    this.source.value = example.source;
    writeStorage(DRAFT_KEY, example.source);
    this.resetRun();
    void this.setMode(example.mode);
  }

  private showProblem(problem: LogoErrorInfo | null): void {
    this.problem = problem;
    this.diagnostic.hidden = problem === null;
    if (problem) {
      this.diagnostic.textContent = `Wiersz ${problem.line}, kolumna ${problem.column}: ${problem.message}`;
    }
  }

  private focusProblem(): void {
    if (!this.problem) return;
    const offset = offsetOf(this.source.value, this.problem.line, this.problem.column);
    this.source.focus();
    this.source.setSelectionRange(offset, offset);
  }

  private setStatus(text: string): void {
    this.status.textContent = text;
  }

  private updateSpeedLabel(): void {
    this.speedValue.textContent = this.speed.value;
  }
}

export function startApp(): void {
  new App();
}
