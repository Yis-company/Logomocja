import { type Highlight, type LogoError, type Mode, type RunResult, type Segment, type Turtle, Interpreter, compile, copySegment } from '../lang/index';
import { initialTurtle } from '../lang/turtle';
import { EXAMPLES, type Example } from '../content/examples';
import { el, download } from './dom';
import { createDialog } from './dialogs';
import { Editor } from './editor';
import { loadItem, saveItem } from './storage';
import { decodeProgram, permalink } from './share';
import { toast } from './toast';
import { View2D } from './view2d';
import { type View3D } from './view3d';
import { webglProblem } from './webgl';

const MODE_KEY = 'tryb';
const SPEED_KEY = 'szybkosc';
const DEFAULT_SPEED = 70;
const MAX_STEPS_PER_FRAME = 2000;

const STARTERS: Record<Mode, string> = {
  '2d': EXAMPLES.find((e) => e.name === 'kwadrat')!.source,
  '3d': EXAMPLES.find((e) => e.name === 'schody')!.source,
};

const MODE_HINT: Record<Mode, string> = {
  '2d': 'Płaszczyzna XY. Przeciągnij, aby przesunąć; kółko myszy przybliża i oddala.',
  '3d': 'Przestrzeń. Przeciągnij, aby obracać; prawym przyciskiem przesuwać; kółko przybliża.',
};

function draftKey(mode: Mode): string {
  return `szkic.${mode}`;
}

/** Converts a speed slider position (0–100) to statements per second, from 1 to about 3000. */
function stepsPerSecond(slider: number): number {
  return Math.round(Math.pow(10, (slider / 100) * 3.5));
}

/**
 * The studio page: editor, run controls, drawing stage and status.
 * It owns the interpreter and the animation loop; the views only draw what they are given.
 */
export class Workspace {
  readonly element: HTMLElement;
  private mode: Mode = '2d';
  private editor!: Editor;
  private interp: Interpreter | null = null;
  private stale = false;
  private running = false;
  private raf = 0;
  private lastFrame = 0;
  private budget = 0;
  private speed = DEFAULT_SPEED;
  private view2!: View2D;
  private view3: View3D | null = null;
  private view3Promise: Promise<View3D | null> | null = null;
  private view3Problem: string | null = null;
  private runError: LogoError | null = null;
  private parseError: LogoError | null = null;
  private saveTimer = 0;
  private liveTimer = 0;

  private modeButtons!: Record<Mode, HTMLButtonElement>;
  private runButton!: HTMLButtonElement;
  private stepButton!: HTMLButtonElement;
  private pauseButton!: HTMLButtonElement;
  private resetButton!: HTMLButtonElement;
  private speedInput!: HTMLInputElement;
  private status!: HTMLElement;
  private errorBox!: HTMLElement;
  private stageInfo!: HTMLElement;
  private stageNote!: HTMLElement;
  private turtleInfo!: HTMLElement;
  private stageHost!: HTMLElement;
  private fileInput!: HTMLInputElement;
  private examplesDialog!: HTMLDialogElement;
  private shareDialog!: HTMLDialogElement;
  private shareField!: HTMLInputElement;
  private helpDialog!: HTMLDialogElement;
  private fitButton!: HTMLButtonElement;
  private cameraButton!: HTMLButtonElement;
  private zoomButtons: HTMLButtonElement[] = [];
  private orbitButtons: HTMLButtonElement[] = [];

  constructor() {
    this.element = el('section', { class: 'workspace', 'aria-label': 'Edytor programów' });
    this.build();
    window.addEventListener('logomocja:theme', () => this.render());
    window.addEventListener('pagehide', () => this.flushSave());
    document.addEventListener('keydown', (e) => this.onKey(e));
    const problem = webglProblem();
    if (problem) this.disable3D(problem);
    const saved = loadItem(MODE_KEY);
    const mode: Mode = saved === '3d' && !problem ? '3d' : '2d';
    this.mode = mode;
    const rawSpeed = loadItem(SPEED_KEY);
    const speed = rawSpeed === null ? NaN : Number(rawSpeed);
    if (Number.isFinite(speed) && speed >= 0 && speed <= 100) this.speed = speed;
    this.speedInput.value = String(this.speed);
    this.editor.setTextSilently(this.draft(mode));
    this.applyModeUi();
    if (mode === '3d') void this.ensureView3D();
    this.render();
    this.updateControls();
    this.scheduleLiveCheck();
  }

  // ---- public entry points ----

  /** Loads a program into the editor, switching mode if needed, and optionally runs it. */
  async load(source: string, options: { mode?: Mode; run?: boolean; label?: string }): Promise<void> {
    const mode = options.mode ?? this.mode;
    if (mode !== this.mode) {
      await this.setMode(mode);
      if (mode !== this.mode) {
        toast('Tryb 3D jest w tej przeglądarce niedostępny, więc program nie został wczytany.');
        return;
      }
    }
    this.reset();
    const previous = this.editor.value;
    this.editor.replaceText(source);
    if (previous.trim() !== '' && previous !== source) {
      toast(`Wczytano ${options.label ?? 'program'}.`, {
        label: 'Przywróć poprzedni tekst',
        run: () => this.editor.replaceText(previous),
      });
    } else if (options.label) {
      toast(`Wczytano ${options.label}.`);
    }
    if (options.run) this.run();
    else this.editor.focus();
  }

  /** Runs the program without animation and fits the view; used by the testing hook. */
  async openForTest(source: string, mode: Mode): Promise<RunResult> {
    if (mode !== this.mode) await this.setMode(mode);
    this.reset();
    this.editor.replaceText(source);
    const compiled = compile(source, mode);
    let result: RunResult;
    if (!compiled.ok) {
      this.setParseError(compiled.error);
      result = { segments: [], error: compiled.error };
    } else {
      const interp = new Interpreter(compiled.program);
      interp.runToEnd();
      this.interp = interp;
      this.setRunError(interp.error);
      result = { segments: interp.segments.map((s) => copySegment(s)), error: interp.error };
    }
    this.view2.autoFit = true;
    this.render();
    if (this.mode === '2d') this.view2.fit();
    else (await this.ensureView3D())?.fit();
    this.render();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return result;
  }

  // ---- building the page ----

  private build(): void {
    this.modeButtons = {
      '2d': el('button', { class: 'seg-btn', type: 'button', 'aria-pressed': 'true', text: '2D', on: { click: () => void this.setMode('2d') } }),
      '3d': el('button', { class: 'seg-btn', type: 'button', 'aria-pressed': 'false', text: '3D', on: { click: () => void this.setMode('3d') } }),
    };
    this.runButton = this.button('▶ Uruchom', 'Uruchom program (Ctrl+Enter)', () => this.run(), 'btn-primary');
    this.stepButton = this.button('▸ Krok', 'Wykonaj jedno polecenie (Alt+K)', () => this.step());
    this.pauseButton = this.button('⏸ Pauza', 'Wstrzymaj lub wznów (Alt+P)', () => this.togglePause());
    this.resetButton = this.button('⟲ Reset', 'Wyczyść rysunek i zatrzymaj program (Alt+R)', () => this.reset());
    this.speedInput = el('input', {
      type: 'range',
      min: '0',
      max: '100',
      step: '1',
      class: 'speed',
      'aria-label': 'Szybkość animacji',
      title: 'Szybkość animacji',
      on: {
        input: () => {
          this.speed = Number(this.speedInput.value);
          saveItem(SPEED_KEY, String(this.speed));
        },
      },
    });

    const exampleButton = this.button('Przykłady', 'Wczytaj jeden z wbudowanych programów', () => this.examplesDialog.showModal());
    const shareButton = this.button('Udostępnij', 'Pokaż link do tego programu', () => this.openShare());
    const saveButton = this.button('Zapisz .logo', 'Pobierz program jako plik tekstowy', () => this.saveFile());
    const openButton = this.button('Otwórz .logo', 'Wczytaj program z pliku .logo', () => this.fileInput.click());
    const pngButton = this.button('Eksport PNG', 'Pobierz rysunek jako obraz PNG', () => this.exportPng());
    this.fileInput = el('input', { type: 'file', accept: '.logo,text/plain', hidden: true, 'aria-hidden': 'true' });
    this.fileInput.addEventListener('change', () => void this.openFile());

    const toolbar = el(
      'div',
      { class: 'toolbar', role: 'toolbar', 'aria-label': 'Sterowanie programem' },
      el('div', { class: 'seg', role: 'group', 'aria-label': 'Tryb rysowania' }, this.modeButtons['2d'], this.modeButtons['3d']),
      el('div', { class: 'toolbar-group', role: 'group', 'aria-label': 'Wykonanie' }, this.runButton, this.stepButton, this.pauseButton, this.resetButton),
      el('label', { class: 'speed-wrap' }, el('span', { class: 'speed-label', text: 'Szybkość' }), this.speedInput),
      el('div', { class: 'toolbar-group toolbar-end', role: 'group', 'aria-label': 'Pliki i udostępnianie' }, exampleButton, shareButton, openButton, saveButton, pngButton),
      this.fileInput,
    );

    const editorHost = el('div', { class: 'editor-host' });
    this.editor = new Editor(editorHost, {
      label: 'Program w języku Logomocja',
      describedBy: 'ws-error',
      onInput: () => this.onEditorInput(),
    });
    const codePanel = el(
      'section',
      { class: 'panel panel-code', 'aria-labelledby': 'code-title' },
      el('header', { class: 'panel-head' }, el('h2', { id: 'code-title', text: 'Program' }), el('span', { class: 'panel-hint', text: 'Ctrl+Enter uruchamia' })),
      editorHost,
    );

    this.stageHost = el('div', { class: 'stage-host' });
    this.stageInfo = el('p', { class: 'stage-info', text: MODE_HINT['2d'] });
    this.stageNote = el('p', { class: 'stage-note', role: 'note', hidden: true });
    this.turtleInfo = el('p', { class: 'turtle-info', 'aria-live': 'off' });
    this.fitButton = this.button('Dopasuj widok', 'Dopasuj rysunek do okna', () => this.fit());
    this.cameraButton = this.button('Resetuj kamerę', 'Przywróć domyślne ustawienie kamery', () => this.resetCamera());
    this.cameraButton.hidden = true;
    // Keyboard alternatives to mouse and touch gestures on the stage.
    this.zoomButtons = [
      this.button('−', 'Oddal widok', () => this.zoom(1 / 1.25), 'btn-icon'),
      this.button('+', 'Przybliż widok', () => this.zoom(1.25), 'btn-icon'),
    ];
    this.orbitButtons = [
      this.button('←', 'Obróć kamerę w lewo', () => this.orbit(-12, 0), 'btn-icon'),
      this.button('↑', 'Obróć kamerę w górę', () => this.orbit(0, -12), 'btn-icon'),
      this.button('↓', 'Obróć kamerę w dół', () => this.orbit(0, 12), 'btn-icon'),
      this.button('→', 'Obróć kamerę w prawo', () => this.orbit(12, 0), 'btn-icon'),
    ];
    for (const b of this.orbitButtons) b.hidden = true;
    const stagePanel = el(
      'section',
      { class: 'panel panel-stage', 'aria-labelledby': 'stage-title' },
      el('header', { class: 'panel-head' }, el('h2', { id: 'stage-title', text: 'Rysunek' })),
      el('div', { class: 'view-bar', role: 'group', 'aria-label': 'Widok' }, ...this.zoomButtons, this.fitButton, ...this.orbitButtons, this.cameraButton),
      this.stageNote,
      this.stageHost,
      el('div', { class: 'stage-foot' }, this.stageInfo, this.turtleInfo),
    );

    this.errorBox = el('div', { id: 'ws-error', class: 'error-box', role: 'alert', hidden: true });
    this.status = el('p', { class: 'status', role: 'status', 'aria-live': 'polite' });
    const shortcuts = el(
      'p',
      { class: 'shortcuts' },
      el('kbd', { text: 'Ctrl+Enter' }),
      ' uruchom  ',
      el('kbd', { text: 'Alt+K' }),
      ' krok  ',
      el('kbd', { text: 'Alt+P' }),
      ' pauza  ',
      el('kbd', { text: 'Alt+R' }),
      ' reset  ',
      el('button', { class: 'btn btn-link', type: 'button', text: 'Wszystkie skróty', on: { click: () => this.helpDialog.showModal() } }),
    );

    this.element.append(toolbar, el('div', { class: 'workspace-main' }, codePanel, stagePanel), el('div', { class: 'workspace-foot' }, this.errorBox, this.status, shortcuts));
    this.buildDialogs();
    this.view2 = new View2D(this.stageHost, () => this.updateStatus());
  }

  private buildDialogs(): void {
    const list = el('div', { class: 'example-list' });
    for (const group of ['2d', '3d'] as Mode[]) {
      list.append(el('h3', { text: group === '2d' ? 'Płaszczyzna 2D' : 'Przestrzeń 3D' }));
      for (const ex of EXAMPLES.filter((e) => e.mode === group)) {
        list.append(this.exampleCard(ex));
      }
    }
    this.examplesDialog = createDialog('dialog-przyklady', 'Przykłady', [
      el('p', { text: 'Wbudowane programy. Wczytanie zastępuje tekst w edytorze, a poprzedni można przywrócić.' }),
      list,
    ]);

    this.shareField = el('input', { type: 'text', readonly: true, class: 'share-field', 'aria-label': 'Link do programu' });
    this.shareField.addEventListener('focus', () => this.shareField.select());
    this.shareDialog = createDialog('dialog-udostepnij', 'Udostępnij program', [
      el('p', { text: 'Ten link otwiera program w tym samym trybie i uruchamia go od razu.' }),
      el(
        'div',
        { class: 'share-row' },
        this.shareField,
        el('button', { class: 'btn', type: 'button', text: 'Kopiuj', on: { click: () => void this.copyShare() } }),
      ),
    ]);

    this.helpDialog = createDialog('dialog-skroty', 'Skróty klawiszowe', [
      el(
        'table',
        { class: 'shortcut-table' },
        el('tbody', {},
          ...[
            ['Ctrl+Enter', 'Uruchom program od początku'],
            ['Alt+K', 'Krok: wykonaj jedno polecenie'],
            ['Alt+P', 'Wstrzymaj lub wznów'],
            ['Alt+R', 'Reset: wyczyść rysunek i zatrzymaj'],
          ].map(([keys, what]) => el('tr', {}, el('th', { scope: 'row' }, el('kbd', { text: keys })), el('td', { text: what }))),
        ),
      ),
      el('p', { text: 'Skróty działają z każdego miejsca na stronie poza oknami dialogowymi. Edytor zachowuje zwykłe skróty przeglądarki (Ctrl+Z, Ctrl+C).' }),
    ]);
  }

  private exampleCard(ex: Example): HTMLElement {
    return el(
      'div',
      { class: 'example-card' },
      el('div', {}, el('strong', { text: ex.title }), ' ', el('span', { class: 'badge', text: ex.mode.toUpperCase() }), el('p', { class: 'muted', text: ex.blurb })),
      el('code', { class: 'example-name', text: ex.name }),
      el('button', {
        class: 'btn',
        type: 'button',
        text: 'Wczytaj',
        'aria-label': `Wczytaj przykład ${ex.title}`,
        on: {
          click: () => {
            this.examplesDialog.close();
            void this.load(ex.source, { mode: ex.mode, run: true, label: `przykład „${ex.title}”` });
          },
        },
      }),
    );
  }

  private button(label: string, title: string, action: () => void, extra = ''): HTMLButtonElement {
    return el('button', { class: `btn ${extra}`.trim(), type: 'button', title, text: label, on: { click: action } });
  }

  // ---- mode and drafts ----

  private draft(mode: Mode): string {
    return loadItem(draftKey(mode)) ?? STARTERS[mode];
  }

  private async setMode(mode: Mode): Promise<void> {
    if (mode === this.mode) return;
    if (mode === '3d') {
      const view = await this.ensureView3D();
      if (!view) return;
    }
    this.flushSave();
    this.stop();
    this.mode = mode;
    saveItem(MODE_KEY, mode);
    this.interp = null;
    this.stale = false;
    this.setRunError(null);
    this.editor.setTextSilently(this.draft(mode));
    this.applyModeUi();
    this.setParseError(null);
    this.scheduleLiveCheck();
    this.render();
    this.updateControls();
  }

  private applyModeUi(): void {
    for (const m of ['2d', '3d'] as Mode[]) {
      this.modeButtons[m].setAttribute('aria-pressed', String(m === this.mode));
    }
    this.stageInfo.textContent = MODE_HINT[this.mode];
    this.cameraButton.hidden = this.mode !== '3d';
    for (const b of this.orbitButtons) b.hidden = this.mode !== '3d';
    this.view2.element.hidden = this.mode !== '2d';
    if (this.view3) this.view3.element.hidden = this.mode !== '3d';
  }

  /** Turns 3D off and says why; 2D keeps working. */
  private disable3D(reason: string): void {
    this.view3Problem = reason;
    this.modeButtons['3d'].disabled = true;
    this.modeButtons['3d'].title = `Tryb 3D wyłączony: ${reason}`;
    this.stageNote.textContent = `Tryb 3D jest wyłączony, ponieważ ${reason}. Tryb 2D działa normalnie.`;
    this.stageNote.hidden = false;
  }

  private async ensureView3D(): Promise<View3D | null> {
    if (this.view3) return this.view3;
    if (this.view3Problem) return null;
    if (!this.view3Promise) {
      this.view3Promise = (async () => {
        try {
          const { View3D: Class } = await import('./view3d');
          this.view3 = new Class(this.stageHost, () => this.updateStatus());
          this.view3.element.hidden = this.mode !== '3d';
          return this.view3;
        } catch (e) {
          this.view3Problem = `nie udało się uruchomić widoku 3D (${e instanceof Error ? e.message : String(e)})`;
          return null;
        }
      })();
    }
    const view = await this.view3Promise;
    if (!view && this.view3Problem) {
      this.disable3D(this.view3Problem);
      if (this.mode === '3d') {
        this.mode = '2d';
        saveItem(MODE_KEY, '2d');
        this.editor.setTextSilently(this.draft('2d'));
        this.applyModeUi();
      }
    } else if (view) {
      this.applyModeUi();
    }
    this.render();
    return view;
  }

  // ---- running ----

  private run(): void {
    const compiled = compile(this.editor.value, this.mode);
    if (!compiled.ok) {
      this.interp = null;
      this.stop();
      this.stale = false;
      this.setRunError(null);
      this.setParseError(compiled.error);
      this.render();
      this.updateControls();
      return;
    }
    this.stop();
    this.interp = new Interpreter(compiled.program);
    this.stale = false;
    this.setParseError(null);
    this.setRunError(null);
    this.view2.autoFit = true;
    if (this.view3) this.view3.autoFit = true;
    this.budget = 0;
    this.render();
    this.start();
  }

  private start(): void {
    if (!this.interp || this.interp.finished) return;
    this.running = true;
    this.lastFrame = performance.now();
    this.raf = requestAnimationFrame((t) => this.frame(t));
    this.updateStatus();
  }

  private stop(): void {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.updateStatus();
  }

  private frame(now: number): void {
    this.raf = 0;
    if (!this.running || !this.interp) return;
    const dt = Math.min(0.1, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    this.budget += dt * stepsPerSecond(this.speed);
    const whole = Math.floor(this.budget);
    this.budget -= whole;
    for (let k = 0; k < Math.min(whole, MAX_STEPS_PER_FRAME) && this.interp.step(); k++) {
      // Each step runs one statement; the loop stops early when the program ends.
    }
    if (this.interp.finished) {
      this.running = false;
      this.onFinished();
      return;
    }
    this.render();
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private step(): void {
    if (this.interp?.finished) {
      this.updateStatus();
      return;
    }
    this.stop();
    if (!this.interp || this.stale) {
      const compiled = compile(this.editor.value, this.mode);
      if (!compiled.ok) {
        this.interp = null;
        this.setRunError(null);
        this.setParseError(compiled.error);
        this.render();
        return;
      }
      this.interp = new Interpreter(compiled.program);
      this.stale = false;
      this.setParseError(null);
      this.setRunError(null);
      this.view2.autoFit = true;
      if (this.view3) this.view3.autoFit = true;
    }
    this.interp.step();
    if (this.interp.finished) this.onFinished();
    this.render();
    this.updateControls();
  }

  private togglePause(): void {
    if (this.running) {
      this.stop();
    } else if (this.interp && !this.interp.finished) {
      this.start();
    } else {
      this.run();
    }
  }

  private reset(): void {
    this.stop();
    this.interp = null;
    this.stale = false;
    this.setRunError(null);
    this.editor.setActive(null);
    this.render();
    this.updateControls();
  }

  private onFinished(): void {
    this.editor.setActive(null);
    if (this.interp?.error) this.setRunError(this.interp.error);
    this.render();
    this.updateControls();
  }

  private fit(): void {
    if (this.mode === '2d') this.view2.fit();
    else void this.ensureView3D().then((v) => v?.fit());
  }

  private resetCamera(): void {
    this.view3?.resetCamera();
  }

  private zoom(factor: number): void {
    if (this.mode === '2d') this.view2.zoomBy(factor);
    else this.view3?.zoomBy(factor);
  }

  private orbit(horizontal: number, vertical: number): void {
    this.view3?.orbit(horizontal, vertical);
  }

  // ---- rendering ----

  private render(): void {
    const interp = this.interp;
    const segments: readonly Segment[] = interp ? interp.segments : [];
    const turtle: Turtle = interp ? interp.turtle : initialTurtle();
    this.editor.setActive(interp && !interp.finished ? (interp.highlight as Highlight | null) : null);
    if (this.mode === '2d') {
      this.view2.render(segments, turtle);
    } else if (this.view3) {
      this.view3.render(segments, turtle, null, interp ? interp.version : 0);
    }
    this.updateStatus();
  }

  private updateStatus(): void {
    const interp = this.interp;
    const segs = interp ? interp.segments.length : 0;
    const t = interp ? interp.turtle : initialTurtle();
    const fmt = (v: number): string => String(Math.round(v * 100) / 100);
    const p = t.pos;
    const pos = this.mode === '3d' ? `(${fmt(p[0])}, ${fmt(p[1])}, ${fmt(p[2])})` : `(${fmt(p[0])}, ${fmt(p[1])})`;
    this.turtleInfo.textContent = `Żółw: ${pos}, pisak ${t.pen ? 'opuszczony' : 'podniesiony'}, grubość ${t.width}`;

    let message: string;
    if (this.parseError) message = 'Błąd w programie. Popraw go, aby uruchomić.';
    else if (this.stale) message = 'Program zmieniono po uruchomieniu. Uruchom ponownie, aby zobaczyć nowy rysunek.';
    else if (this.runError) message = `Przerwano w linii ${this.runError.line}, kolumnie ${this.runError.column}.`;
    else if (!interp) message = 'Gotowe. Uruchom program lub wykonuj go krok po kroku.';
    else if (this.running) message = `Wykonywanie… odcinków: ${segs}, operacji: ${interp.operations}.`;
    else if (interp.finished) message = `Zakończono. Odcinków: ${segs}, operacji: ${interp.operations}.`;
    else message = `Wstrzymano. Odcinków: ${segs}, operacji: ${interp.operations}.`;
    this.status.textContent = message;
    this.updateControls();
  }

  private updateControls(): void {
    const interp = this.interp;
    const active = !!interp && !interp.finished;
    this.stepButton.disabled = !!interp && interp.finished && !this.stale;
    this.pauseButton.disabled = !active && !this.running;
    this.pauseButton.textContent = this.running ? '⏸ Pauza' : '▶ Wznów';
    this.pauseButton.setAttribute('aria-label', this.running ? 'Wstrzymaj (Alt+P)' : 'Wznów (Alt+P)');
    this.pauseButton.title = this.pauseButton.getAttribute('aria-label') ?? '';
  }

  private setRunError(error: LogoError | null): void {
    this.runError = error;
    this.refreshMark();
    this.showErrorBox();
  }

  private setParseError(error: LogoError | null): void {
    this.parseError = error;
    this.refreshMark();
    this.showErrorBox();
  }

  /** The editor marks the run-time error if there is one, otherwise the parse-time error. */
  private refreshMark(): void {
    const err = this.runError ?? this.parseError;
    this.editor.setError(err ? { line: err.line, column: err.column, message: err.message } : null);
  }

  private showErrorBox(): void {
    const err = this.parseError ?? this.runError;
    if (!err) {
      this.errorBox.hidden = true;
      this.errorBox.textContent = '';
      return;
    }
    const kind = this.parseError ? 'Błąd składni' : 'Błąd wykonania';
    this.errorBox.textContent = `${kind}, linia ${err.line}, kolumna ${err.column}: ${err.message}`;
    this.errorBox.hidden = false;
  }

  // ---- editing ----

  private onEditorInput(): void {
    this.scheduleSave();
    if (this.interp) {
      this.stop();
      this.stale = true;
      this.setRunError(null);
      this.editor.setActive(null);
    }
    this.scheduleLiveCheck();
    this.updateStatus();
  }

  private scheduleLiveCheck(): void {
    window.clearTimeout(this.liveTimer);
    this.liveTimer = window.setTimeout(() => {
      const compiled = compile(this.editor.value, this.mode);
      this.setParseError(compiled.ok ? null : compiled.error);
      this.updateStatus();
    }, 250);
  }

  private scheduleSave(): void {
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.flushSave(), 300);
  }

  private flushSave(): void {
    window.clearTimeout(this.saveTimer);
    saveItem(draftKey(this.mode), this.editor.value);
  }

  // ---- files and sharing ----

  private saveFile(): void {
    download(`program-${this.mode}.logo`, this.editor.value);
  }

  private async openFile(): Promise<void> {
    const file = this.fileInput.files?.[0];
    this.fileInput.value = '';
    if (!file) return;
    const text = await file.text();
    await this.load(text, { label: `plik „${file.name}”` });
  }

  private exportPng(): void {
    if (this.mode === '2d') this.view2.exportPng('logomocja-2d.png');
    else if (this.view3) this.view3.exportPng('logomocja-3d.png');
    else toast('Eksport 3D jest niedostępny, ponieważ WebGL nie działa w tej przeglądarce.');
  }

  private openShare(): void {
    this.shareField.value = permalink(this.editor.value, this.mode);
    this.shareDialog.showModal();
    this.shareField.focus();
  }

  private async copyShare(): Promise<void> {
    const text = this.shareField.value;
    try {
      await navigator.clipboard.writeText(text);
      toast('Link skopiowano do schowka.');
    } catch {
      this.shareField.select();
      document.execCommand('copy');
      toast('Link zaznaczono. Skopiuj go ręcznie, jeśli schowek jest niedostępny.');
    }
  }

  /** Loads a permalink: `#/?m=2d&p=...`. */
  loadPermalink(mode: string | null, encoded: string): void {
    const source = decodeProgram(encoded);
    if (source === null) {
      toast('Ten link nie zawiera poprawnego programu.');
      return;
    }
    void this.load(source, { mode: mode === '3d' ? '3d' : '2d', run: true, label: 'program z linku' });
  }

  // ---- keyboard ----

  private onKey(e: KeyboardEvent): void {
    // Shortcuts belong to the workspace only; a hidden workspace must not run in the background.
    if (e.defaultPrevented || !this.element.offsetParent) return;
    if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key === 'Enter') {
      e.preventDefault();
      this.run();
      return;
    }
    if (!e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.code === 'KeyK') {
      e.preventDefault();
      this.step();
    } else if (e.code === 'KeyP') {
      e.preventDefault();
      this.togglePause();
    } else if (e.code === 'KeyR') {
      e.preventDefault();
      this.reset();
    }
  }
}


