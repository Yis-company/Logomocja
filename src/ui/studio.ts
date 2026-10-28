import { Machine, run, RunResult, Segment } from '../lang/interp';
import { LogoError, Mode, parse } from '../lang/parser';
import type { Token } from '../lang/lexer';
import { EXAMPLES, Example } from '../data/examples';
import { CHALLENGES, Challenge, CHALLENGE_BY_ID } from '../data/challenges';
import { SHORTCUTS } from '../data/reference';
import { compareDrawings } from '../lib/check';
import { decodeSource, permalinkHash } from '../lib/share';
import * as store from '../lib/storage';
import { anyDialogOpen, ask, makeDialog, toast } from './dialog';
import { Draw, newDraw, View } from './draw';
import { download, h, raf } from './dom';
import { Editor, EditorError } from './editor';
import { drawThumb } from './thumb';
import { View2D } from './view2d';
import { webglProblem } from './webgl';

type State = 'idle' | 'running' | 'paused' | 'done' | 'error';

const SPEEDS = [1, 2, 4, 8, 20, 60, 150, 400, 1500, Infinity];
const SPEED_LABELS = ['1 polecenie/s', '2/s', '4/s', '8/s', '20/s', '60/s', '150/s', '400/s', '1500/s', 'natychmiast'];
const DEFAULT_SPEED = 6;
const DEFAULT_DRAFT: Record<Mode, string> = {
  '2d': EXAMPLES.find(e => e.id === 'kwadrat')!.source,
  '3d': EXAMPLES.find(e => e.id === 'szescian')!.source,
};

interface Progress { [id: string]: { done: boolean; at: string } }

export class Studio {
  readonly root: HTMLElement;
  mode: Mode = '2d';
  readonly editor = new Editor('Kod programu Logo');
  private draw: Draw = newDraw();
  private state: State = 'idle';
  private machine: Machine | null = null;
  private gen: Generator<Token, void, void> | null = null;
  private lastT = 0;
  private budget = 0;
  private speed = DEFAULT_SPEED;
  private lastTok: Token | null = null;
  private steps = 0;
  private totalSteps = 0;
  private glProblem: string | null = null;
  private view2d: View2D;
  private viewIso: View2D;
  private view3d: View | null = null;
  private view3dLoading: Promise<void> | null = null;
  private visible = true;
  private challenge: Challenge | null = null;
  private showGhost = true;
  private ghost: Segment[] = [];
  private parseTimer = 0;
  private exampleCache = new Map<string, Segment[]>();

  // elementy
  private btnRun!: HTMLButtonElement;
  private btnStep!: HTMLButtonElement;
  private btnPause!: HTMLButtonElement;
  private btnReset!: HTMLButtonElement;
  private btnRestore!: HTMLButtonElement;
  private modeBtns = new Map<Mode, HTMLButtonElement>();
  private statusEl!: HTMLElement;
  private liveEl!: HTMLElement;
  private slot!: HTMLElement;
  private notice!: HTMLElement;
  private workspace!: HTMLElement;
  private tabBtns = new Map<string, HTMLButtonElement>();
  private banner!: HTMLElement;
  private bannerBody!: HTMLElement;
  private bannerResult!: HTMLElement;
  private ghostToggle!: HTMLInputElement;
  private speedLabel!: HTMLElement;
  private speedInput!: HTMLInputElement;

  constructor() {
    this.glProblem = webglProblem();
    this.view2d = new View2D(this.draw, false, 'Rysunek żółwia na płaszczyźnie (2D)');
    this.viewIso = new View2D(this.draw, true, 'Rzut izometryczny rysunku 3D (widok 3D jest wyłączony)');
    this.root = this.build();
    const savedSpeed = Number(store.load('speed'));
    if (savedSpeed >= 1 && savedSpeed <= SPEEDS.length) this.speed = savedSpeed;
    this.speedInput.value = String(this.speed);
    this.updateSpeedLabel();

    const savedMode = store.load('mode') === '3d' ? '3d' : '2d';
    this.mode = savedMode;
    this.editor.value = store.load('draft.' + this.mode) ?? DEFAULT_DRAFT[this.mode];
    this.editor.onInput = () => this.onEdit();
    this.applyModeUi();
    void this.swapView();

    const active = store.load('active');
    if (active && CHALLENGE_BY_ID.has(active) && CHALLENGE_BY_ID.get(active)!.mode === this.mode) {
      this.activateChallenge(CHALLENGE_BY_ID.get(active)!);
    }
    this.syncButtons();
    this.setStatus('Gotowe. Napisz program i naciśnij „Uruchom” (Ctrl+Enter).');
    this.scheduleParseCheck();
    document.addEventListener('keydown', e => this.onKey(e));
  }

  // ---------------------------------------------------------------- budowa UI
  private btn(label: string, icon: string, onclick: () => void, extra: Record<string, unknown> = {}): HTMLButtonElement {
    return h('button', { type: 'button', class: 'btn', onclick, ...extra },
      icon ? h('span', { class: 'ico', 'aria-hidden': 'true' }, icon) : null, h('span', { class: 'lbl' }, label));
  }

  private build(): HTMLElement {
    this.btnRun = this.btn('Uruchom', '▶', () => this.cmdRun(), { class: 'btn btn-primary', title: 'Uruchom program (Ctrl+Enter)', 'aria-keyshortcuts': 'Control+Enter' });
    this.btnStep = this.btn('Krok', '⏭', () => this.cmdStep(), { title: 'Wykonaj jedno polecenie (F10 lub Ctrl+Shift+Enter)', 'aria-keyshortcuts': 'F10' });
    this.btnPause = this.btn('Pauza', '⏸', () => this.cmdPause(), { title: 'Wstrzymaj wykonywanie (F6 lub Ctrl+.)', 'aria-keyshortcuts': 'F6' });
    this.btnReset = this.btn('Reset', '↺', () => this.cmdReset(), { title: 'Zatrzymaj i wyczyść rysunek (F8 lub Esc)', 'aria-keyshortcuts': 'F8' });

    this.speedInput = h('input', {
      type: 'range', min: 1, max: SPEEDS.length, step: 1, value: this.speed, id: 'speed',
      'aria-describedby': 'speed-label',
    });
    this.speedInput.addEventListener('input', () => {
      this.speed = Number(this.speedInput.value);
      store.save('speed', String(this.speed));
      this.updateSpeedLabel();
    });
    this.speedLabel = h('span', { id: 'speed-label', class: 'speed-val' });
    const speed = h('div', { class: 'speed' }, h('label', { for: 'speed' }, 'Prędkość'), this.speedInput, this.speedLabel);

    const modeGroup = h('div', { class: 'seg', role: 'group', 'aria-label': 'Tryb rysowania' });
    for (const m of ['2d', '3d'] as Mode[]) {
      const b = h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': 'false', 'data-mode': m, onclick: () => this.setMode(m) }, m.toUpperCase());
      this.modeBtns.set(m, b);
      modeGroup.append(b);
    }

    this.btnRestore = this.btn('Poprzedni szkic', '⟲', () => this.restoreStash(), { title: 'Przywróć szkic zastąpiony wczytanym programem', hidden: true });

    const files = h('div', { class: 'bar-group', role: 'group', 'aria-label': 'Programy i pliki' },
      this.btn('Przykłady', '✦', () => this.showExamples()),
      this.btn('Wyzwania', '★', () => this.showChallenges()),
      this.btn('Link', '🔗', () => this.showShare(), { title: 'Utwórz link do programu' }),
      this.btn('Zapisz .logo', '⭳', () => this.downloadLogo(), { title: 'Pobierz program jako plik .logo' }),
      this.btn('Otwórz plik', '📂', () => fileInput.click(), { title: 'Wczytaj program z pliku .logo' }),
      this.btn('PNG', '🖼', () => void this.exportPng(), { title: 'Zapisz rysunek jako obraz PNG' }),
      this.btnRestore,
      this.btn('Skróty', '⌨', () => this.showShortcuts(), { title: 'Skróty klawiszowe (?)' }),
    );
    const fileInput = h('input', { type: 'file', accept: '.logo,.txt,text/plain', hidden: true, 'aria-label': 'Wybierz plik programu' });
    fileInput.addEventListener('change', async () => {
      const f = fileInput.files?.[0];
      fileInput.value = '';
      if (!f) return;
      if (f.size > 200_000) { toast('Plik jest za duży na program Logo.'); return; }
      const text = (await f.text()).replace(/\r\n?/g, '\n');
      await this.openFile(text, f.name);
    });

    const runBar = h('div', { class: 'bar-group', role: 'group', 'aria-label': 'Sterowanie wykonywaniem' },
      this.btnRun, this.btnStep, this.btnPause, this.btnReset, speed);
    const toolbar = h('div', { class: 'toolbar', role: 'toolbar', 'aria-label': 'Narzędzia pracowni' }, runBar, modeGroup, files, fileInput);

    // zadanie
    this.bannerResult = h('p', { class: 'banner-result', role: 'status' });
    this.bannerBody = h('div', { class: 'banner-body' });
    this.ghostToggle = h('input', { type: 'checkbox', id: 'ghost-toggle', checked: true });
    this.ghostToggle.addEventListener('change', () => { this.showGhost = this.ghostToggle.checked; this.applyGhost(); });
    this.banner = h('section', { class: 'banner', 'aria-label': 'Aktywne zadanie', hidden: true },
      this.bannerBody,
      h('div', { class: 'banner-actions' },
        this.btn('Sprawdź rozwiązanie', '✓', () => this.checkChallenge(), { class: 'btn btn-primary' }),
        h('label', { class: 'check' }, this.ghostToggle, h('span', {}, 'Pokaż wzór')),
        this.btn('Zamknij zadanie', '', () => this.closeChallenge()),
      ),
      this.bannerResult);

    // panele
    this.statusEl = h('div', { class: 'status', id: 'status' });
    this.liveEl = h('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
    const codePane = h('section', { class: 'pane pane-code', 'aria-label': 'Kod', 'data-pane': 'code' }, this.editor.root);

    this.slot = h('div', { class: 'view-slot' });
    this.notice = h('div', { class: 'notice', role: 'status', hidden: true });
    const viewBar = h('div', { class: 'view-bar', role: 'toolbar', 'aria-label': 'Widok rysunku' },
      this.btn('Dopasuj', '⤢', () => this.curView().fit(), { title: 'Dopasuj widok do rysunku' }),
      this.btn('Resetuj widok', '⌖', () => this.curView().reset(), { title: 'Przywróć domyślny widok' }),
      this.btn('Przybliż', '+', () => this.curView().zoom(1.25), { 'aria-label': 'Przybliż' }),
      this.btn('Oddal', '−', () => this.curView().zoom(0.8), { 'aria-label': 'Oddal' }),
    );
    const viewPane = h('section', { class: 'pane pane-view', 'aria-label': 'Rysunek', 'data-pane': 'view' }, viewBar, this.notice, this.slot);

    const tabs = h('div', { class: 'tabs', role: 'group', 'aria-label': 'Przełącz panel' });
    for (const [id, label] of [['code', 'Kod'], ['view', 'Rysunek']] as const) {
      const b = h('button', { type: 'button', class: 'tab', 'aria-pressed': 'false', onclick: () => this.showPane(id) }, label);
      this.tabBtns.set(id, b);
      tabs.append(b);
    }
    this.workspace = h('div', { class: 'workspace', 'data-show': 'code' }, codePane, viewPane);
    this.showPane('code');

    return h('div', { class: 'studio' }, toolbar, this.banner, tabs, this.workspace, this.statusEl, this.liveEl);
  }

  private showPane(id: 'code' | 'view') {
    this.workspace.dataset.show = id;
    for (const [k, b] of this.tabBtns) b.setAttribute('aria-pressed', String(k === id));
  }

  private isNarrow(): boolean {
    return window.matchMedia('(max-width: 860px)').matches;
  }

  private updateSpeedLabel() {
    this.speedLabel.textContent = SPEED_LABELS[this.speed - 1];
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (!v && this.state === 'running') this.cmdPause();
  }

  // ---------------------------------------------------------------- widoki
  private curView(): View {
    if (this.mode === '2d') return this.view2d;
    return this.view3d ?? this.viewIso;
  }

  private async swapView() {
    this.notice.hidden = true;
    if (this.mode === '3d' && !this.glProblem && !this.view3d) {
      if (!this.view3dLoading) {
        this.view3dLoading = import('./view3d').then(m => {
          this.view3d = new m.View3D(this.draw);
        }).catch(e => {
          this.glProblem = `nie udało się uruchomić renderera (${(e as Error).message})`;
        });
      }
      await this.view3dLoading;
    }
    if (this.mode === '3d' && this.glProblem) {
      this.notice.hidden = false;
      this.notice.textContent = `Widok 3D jest wyłączony: ${this.glProblem}. Programy 3D nadal się wykonują; rysunek jest pokazany jako płaski rzut izometryczny, bez obracania kamerą.`;
    }
    const v = this.curView();
    if (this.slot.firstChild !== v.el) this.slot.replaceChildren(v.el);
    v.invalidate();
  }

  themeChanged() {
    for (const v of [this.view2d, this.viewIso, this.view3d]) {
      if (!v) continue;
      (v as unknown as { refreshTheme?: () => void }).refreshTheme?.();
      v.invalidate();
    }
  }

  // ---------------------------------------------------------------- tryb i szkice
  private applyModeUi() {
    for (const [m, b] of this.modeBtns) b.setAttribute('aria-pressed', String(m === this.mode));
    this.editor.ta.setAttribute('aria-label', `Kod programu Logo (tryb ${this.mode.toUpperCase()})`);
  }

  async setMode(m: Mode, opts: { keepRun?: boolean } = {}) {
    if (m === this.mode) return;
    this.saveDraft();
    this.cancelRun();
    this.mode = m;
    store.save('mode', m);
    if (this.challenge && this.challenge.mode !== m) this.closeChallenge(false);
    this.editor.value = store.load('draft.' + m) ?? DEFAULT_DRAFT[m];
    this.clearDrawing();
    this.applyModeUi();
    await this.swapView();
    this.curView().reset();
    this.setStatus(`Tryb ${m.toUpperCase()}.`);
    this.scheduleParseCheck();
    void opts;
  }

  private saveDraft() {
    store.save('draft.' + this.mode, this.editor.value);
  }

  private draftOf(mode: Mode): string {
    return mode === this.mode ? this.editor.value : (store.load('draft.' + mode) ?? DEFAULT_DRAFT[mode]);
  }

  private isPristine(text: string): boolean {
    const t = text.trim();
    if (!t) return true;
    if (EXAMPLES.some(e => e.source.trim() === t)) return true;
    return CHALLENGES.some(c => c.starter.trim() === t);
  }

  /** Wczytuje program do szkicu danego trybu; pyta, jeśli grozi to utratą niezapisanej pracy. */
  async loadSource(text: string, mode: Mode, opts: { confirm?: boolean; label?: string } = {}): Promise<boolean> {
    const cur = this.draftOf(mode);
    const loses = !this.isPristine(cur) && cur.trim() !== text.trim();
    if (loses && opts.confirm) {
      const a = await ask('Zastąpić bieżący kod?',
        `W trybie ${mode.toUpperCase()} masz własny, niezapisany program. Wczytanie „${opts.label ?? 'programu'}” go zastąpi. Poprzedni szkic zachowamy i możesz go przywrócić przyciskiem „Poprzedni szkic”.`,
        [
          { id: 'replace', label: 'Zastąp', primary: true },
          { id: 'backup', label: 'Pobierz kopię i zastąp' },
          { id: 'cancel', label: 'Anuluj' },
        ]);
      if (a === 'cancel') return false;
      if (a === 'backup') download(`kopia-${mode}.logo`, new Blob([cur.endsWith('\n') ? cur : cur + '\n'], { type: 'text/plain;charset=utf-8' }));
    }
    if (loses) { store.save('stash.' + mode, cur); this.updateRestore(); }
    if (mode !== this.mode) await this.setMode(mode);
    this.cancelRun();
    this.editor.value = text;
    this.saveDraft();
    this.clearDrawing();
    this.scheduleParseCheck();
    return true;
  }

  private updateRestore() {
    this.btnRestore.hidden = store.load('stash.' + this.mode) === null;
  }

  private restoreStash() {
    const s = store.load('stash.' + this.mode);
    if (s === null) return;
    const cur = this.editor.value;
    this.cancelRun();
    this.editor.value = s;
    if (!this.isPristine(cur)) store.save('stash.' + this.mode, cur); else store.remove('stash.' + this.mode);
    this.saveDraft();
    this.clearDrawing();
    this.updateRestore();
    this.scheduleParseCheck();
    this.setStatus('Przywrócono poprzedni szkic.');
  }

  // ---------------------------------------------------------------- edycja
  private onEdit() {
    this.saveDraft();
    if (this.state === 'running' || this.state === 'paused') {
      this.cancelRun();
      this.syncButtons();
      this.setStatus('Edycja zatrzymała program. Rysunek pokazuje stan sprzed zmiany; uruchom ponownie.');
    } else if (this.state === 'error' || this.state === 'done') {
      this.state = 'idle';
    }
    this.editor.setError(null);
    this.scheduleParseCheck();
  }

  private scheduleParseCheck() {
    clearTimeout(this.parseTimer);
    this.parseTimer = window.setTimeout(() => this.parseCheck(), 350);
  }

  private parseCheck() {
    if (this.state === 'running' || this.state === 'paused') return;
    try {
      parse(this.editor.value, this.mode);
      this.editor.setError(null);
      if (this.statusEl.classList.contains('is-error')) this.setStatus('Gotowe.');
    } catch (e) {
      if (e instanceof LogoError) this.showError(e, false);
    }
  }

  private showError(e: LogoError, reveal: boolean) {
    const err: EditorError = { line: e.line, column: e.column, length: e.length, message: e.message };
    this.editor.setError(err, reveal);
    this.setStatus(`Błąd w wierszu ${e.line}, kolumnie ${e.column}: ${e.message}`, true);
  }

  // ---------------------------------------------------------------- wykonywanie
  private clearDrawing() {
    const d = this.draw;
    d.segments = [];
    d.pos = [0, 0, 0]; d.h = [0, 1, 0]; d.r = [1, 0, 0]; d.u = [0, 0, 1]; d.pen = true;
    d.version++;
    d.showTurtle = true;
    this.machine = null;
    this.gen = null;
    this.state = 'idle';
    this.steps = 0;
    this.lastTok = null;
    this.editor.setActiveLine(null);
    this.curView().invalidate();
    this.syncButtons();
  }

  private cancelRun() {
    this.gen = null;
    if (this.state === 'running' || this.state === 'paused') this.state = 'idle';
    this.editor.setActiveLine(null);
  }

  private syncButtons() {
    const s = this.state;
    this.btnRun.querySelector('.lbl')!.textContent = s === 'paused' ? 'Wznów' : 'Uruchom';
    this.btnRun.disabled = s === 'running';
    this.btnPause.disabled = s !== 'running';
    this.btnReset.disabled = s === 'idle' && this.draw.segments.length === 0;
    this.btnStep.disabled = false;
    this.updateRestore();
  }

  private setStatus(msg: string, error = false) {
    this.statusEl.textContent = msg;
    this.statusEl.classList.toggle('is-error', error);
  }

  private announce(msg: string) {
    this.liveEl.textContent = '';
    setTimeout(() => { this.liveEl.textContent = msg; }, 30);
  }

  /** Kompiluje program i przygotowuje maszynę. Zwraca false przy błędzie składni. */
  private begin(fit: boolean): boolean {
    const src = this.editor.value;
    this.editor.setError(null);
    let program;
    try {
      program = parse(src, this.mode);
    } catch (e) {
      if (!(e instanceof LogoError)) throw e;
      this.clearDrawing();
      this.state = 'error';
      this.showError(e, true);
      this.announce(`Błąd w wierszu ${e.line}: ${e.message}`);
      this.syncButtons();
      return false;
    }
    const m = new Machine(program);
    this.machine = m;
    this.gen = m.steps();
    this.steps = 0;
    this.budget = 0;
    const d = this.draw;
    d.segments = m.segments;
    d.version++;
    this.sync();
    // próbny przebieg: ostateczny rozmiar rysunku i liczba poleceń (do dopasowania widoku i tempa)
    const probe = new Machine(program);
    let n = 0;
    try { for (const _ of probe.steps()) n++; } catch { /* błąd pokaże właściwy przebieg */ }
    this.totalSteps = n;
    if (fit) this.curView().fit([...probe.segments, ...(this.showGhost ? this.ghost : [])]);
    return true;
  }

  private sync() {
    const m = this.machine;
    if (!m) return;
    const d = this.draw;
    d.segments = m.segments;
    d.pos = [...m.pos]; d.h = [...m.h]; d.r = [...m.r]; d.u = [...m.u]; d.pen = m.pen;
    d.version++;
    this.curView().invalidate();
  }

  private stepOnce(): boolean {
    if (!this.gen || !this.machine) return false;
    try {
      const r = this.gen.next();
      this.steps++;
      if (r.done) { this.finish(null); return false; }
      this.lastTok = r.value;
      return true;
    } catch (e) {
      if (e instanceof LogoError) { this.finish(e); return false; }
      throw e;
    }
  }

  private finish(err: LogoError | null) {
    this.gen = null;
    this.sync();
    this.editor.setActiveLine(null);
    const n = this.machine?.segments.length ?? 0;
    if (err) {
      this.state = 'error';
      this.showError(err, true);
      this.announce(`Błąd wykonania w wierszu ${err.line}: ${err.message}`);
    } else {
      this.state = 'done';
      this.setStatus(`Zakończono. Odcinków: ${n}, wykonanych operacji: ${this.machine?.ops ?? 0}.`);
      this.announce(`Program zakończony, ${n} odcinków.`);
    }
    this.syncButtons();
  }

  private showProgress() {
    const n = this.machine?.segments.length ?? 0;
    const line = this.lastTok?.line;
    this.editor.setActiveLine(line ?? null);
    if (this.state === 'paused') this.setStatus(`Wstrzymano${line ? ` po poleceniu w wierszu ${line}` : ''}. Odcinków: ${n}.`);
    else this.setStatus(`Wykonywanie… wiersz ${line ?? '-'}, odcinków: ${n}.`);
  }

  private loop = (t: number) => {
    if (this.state !== 'running') return;
    const dt = Math.min(0.1, (t - this.lastT) / 1000);
    this.lastT = t;
    let rate = SPEEDS[this.speed - 1];
    // animacja nie trwa dłużej niż ok. 12 s, nawet przy małej prędkości
    if (rate !== Infinity) rate = Math.max(rate, this.totalSteps / 12);
    let n: number;
    if (rate === Infinity) n = Infinity;
    else { this.budget += rate * dt; n = Math.floor(this.budget); this.budget -= n; }
    let alive = true;
    const t0 = performance.now();
    for (let i = 0; i < n && alive; i++) {
      alive = this.stepOnce();
      if (i % 64 === 63 && performance.now() - t0 > 12) break;
    }
    if (alive && this.state === 'running') {
      this.sync();
      this.showProgress();
      requestAnimationFrame(this.loop);
    }
  };

  cmdRun() {
    if (this.state === 'running') return;
    if (this.state === 'paused') {
      this.state = 'running';
      this.announce('Wznowiono.');
    } else {
      if (!this.begin(true)) return;
      this.state = 'running';
      this.announce('Uruchomiono program.');
      if (this.isNarrow()) this.showPane('view');
    }
    this.syncButtons();
    this.lastT = performance.now();
    requestAnimationFrame(this.loop);
  }

  cmdStep() {
    if (this.state === 'running') this.state = 'paused';
    if (this.state !== 'paused') {
      if (!this.begin(true)) return;
      this.state = 'paused';
    }
    if (this.isNarrow()) this.showPane('view');
    const alive = this.stepOnce();
    if (alive) {
      this.sync();
      this.showProgress();
    }
    this.syncButtons();
  }

  cmdPause() {
    if (this.state === 'running') {
      this.state = 'paused';
      this.syncButtons();
      this.showProgress();
      this.announce('Wstrzymano.');
    } else if (this.state === 'paused') {
      this.cmdRun();
    }
  }

  cmdReset() {
    this.cancelRun();
    this.clearDrawing();
    this.editor.setError(null);
    this.setStatus('Zresetowano.');
    this.announce('Zresetowano rysunek.');
    this.scheduleParseCheck();
  }

  /** Wykonuje program do końca bez animacji i dopasowuje widok. */
  async runInstant(): Promise<void> {
    this.cancelRun();
    if (!this.begin(false)) return;
    this.state = 'running';
    while (this.stepOnce()) { /* do końca */ }
    this.sync();
    this.curView().fit();
    await this.curView().settled();
    await raf();
  }

  // ---------------------------------------------------------------- skróty
  private onKey(e: KeyboardEvent) {
    if (!this.visible || anyDialogOpen()) return;
    const mod = e.ctrlKey || e.metaKey;
    const tag = (e.target as HTMLElement).tagName;
    const typing = tag === 'TEXTAREA' || tag === 'INPUT';
    let handled = true;
    if (mod && !e.shiftKey && e.key === 'Enter') this.cmdRun();
    else if (e.key === 'F10' || (mod && e.shiftKey && e.key === 'Enter')) this.cmdStep();
    else if (e.key === 'F6' || (mod && e.key === '.')) this.cmdPause();
    else if (e.key === 'F8' || (e.key === 'Escape' && this.state !== 'idle')) this.cmdReset();
    else if (e.key === '?' && !typing) this.showShortcuts();
    else handled = false;
    if (handled) e.preventDefault();
  }

  showShortcuts() {
    const d = makeDialog('Skróty klawiszowe', { onClose: () => d.dlg.remove() });
    d.body.append(h('table', { class: 'keys' },
      h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Skrót'), h('th', { scope: 'col' }, 'Działanie'))),
      h('tbody', {}, ...SHORTCUTS.map(s => h('tr', {}, h('td', {}, h('kbd', {}, s.keys)), h('td', {}, s.action))))),
      h('p', { class: 'muted' }, 'Na komputerach Mac zamiast Ctrl użyj Cmd. Widok 3D obracasz przeciągnięciem, a prawy przycisk myszy (lub dwa palce) go przesuwa.'));
    d.open();
  }

  // ---------------------------------------------------------------- przykłady
  private exampleSegs(ex: Example): Segment[] {
    let s = this.exampleCache.get(ex.id);
    if (!s) { s = run(ex.source, ex.mode).segments; this.exampleCache.set(ex.id, s); }
    return s;
  }

  showExamples() {
    const d = makeDialog('Przykłady', { wide: true, onClose: () => d.dlg.remove() });
    const grid = h('ul', { class: 'cards' });
    for (const ex of EXAMPLES) {
      const disabled = false;
      const cv = h('canvas', { width: 220, height: 140, 'aria-hidden': 'true' });
      drawThumb(cv, this.exampleSegs(ex), ex.mode === '3d');
      const b = h('button', {
        type: 'button', class: 'card', 'data-example': ex.id, disabled,
        onclick: async () => {
          const ok = await this.loadSource(ex.source, ex.mode, { confirm: true, label: ex.name });
          if (!ok) return;
          d.close();
          this.closeChallenge(false);
          this.cmdRun();
        },
      }, cv,
        h('span', { class: 'card-title' }, ex.name, h('span', { class: 'badge' }, ex.mode.toUpperCase())),
        h('span', { class: 'card-sub' }, ex.blurb));
      grid.append(h('li', {}, b));
    }
    d.body.append(h('p', { class: 'muted' }, 'Wybierz program, aby wczytać go do edytora w odpowiednim trybie i uruchomić.'), grid);
    d.open();
  }

  // ---------------------------------------------------------------- wyzwania
  private progress(): Progress {
    return store.loadJson<Progress>('progress', {});
  }

  showChallenges() {
    const d = makeDialog('Wyzwania', { wide: true, onClose: () => d.dlg.remove() });
    const prog = this.progress();
    const done = CHALLENGES.filter(c => prog[c.id]?.done).length;
    d.body.append(h('p', {}, `Zaliczone: ${done} z ${CHALLENGES.length}. Napisz program, który narysuje to samo co wzór, i naciśnij „Sprawdź rozwiązanie”.`));
    const list = h('ul', { class: 'tasks' });
    for (const c of CHALLENGES) {
      const ok = !!prog[c.id]?.done;
      const active = this.challenge?.id === c.id;
      list.append(h('li', { class: 'task' },
        h('div', { class: 'task-main' },
          h('h3', {}, c.title, h('span', { class: 'badge' }, c.mode.toUpperCase()), ok ? h('span', { class: 'badge badge-ok' }, '✓ zaliczone') : null),
          h('p', {}, c.task)),
        h('button', {
          type: 'button', class: 'btn', 'data-challenge': c.id,
          onclick: async () => {
            if (active) { d.close(); return; }
            const okLoad = await this.loadSource(c.starter, c.mode, { confirm: true, label: `zadanie „${c.title}”` });
            if (!okLoad) return;
            this.activateChallenge(c);
            d.close();
            this.showPane('code');
            this.editor.focus();
          },
        }, active ? 'Kontynuuj' : ok ? 'Rozwiąż ponownie' : 'Rozwiąż')));
    }
    d.body.append(list);
    d.open();
  }

  private activateChallenge(c: Challenge) {
    this.challenge = c;
    store.save('active', c.id);
    const exp = run(c.solution, c.mode);
    this.ghost = exp.segments;
    this.showGhost = true;
    this.ghostToggle.checked = true;
    this.bannerBody.replaceChildren(
      h('h2', {}, `Zadanie: ${c.title}`),
      h('p', {}, c.task),
      h('details', {}, h('summary', {}, 'Podpowiedź'), h('p', {}, c.hint)));
    this.bannerResult.textContent = '';
    this.bannerResult.className = 'banner-result';
    this.banner.hidden = false;
    this.applyGhost();
    this.curView().fit([...this.ghost]);
  }

  private closeChallenge(refresh = true) {
    if (!this.challenge && this.banner.hidden) return;
    this.challenge = null;
    store.remove('active');
    this.banner.hidden = true;
    this.ghost = [];
    this.applyGhost();
    void refresh;
  }

  private applyGhost() {
    this.draw.ghost = this.challenge && this.showGhost ? this.ghost : null;
    this.draw.ghostVersion++;
    this.curView().invalidate();
  }

  private async checkChallenge() {
    const c = this.challenge;
    if (!c) return;
    const src = this.editor.value;
    const res = run(src, this.mode);
    await this.runInstant();
    let ok = false;
    let msg: string;
    if (res.error) {
      msg = `Program ma błąd (wiersz ${res.error.line}, kolumna ${res.error.column}): ${res.error.message}`;
    } else {
      const expected = run(c.solution, c.mode).segments;
      const r = compareDrawings(res.segments, expected, { tolerance: c.tolerance });
      ok = r.ok;
      msg = r.reason;
    }
    this.bannerResult.textContent = (ok ? '✓ Zaliczone! ' : '✗ Jeszcze nie. ') + msg;
    this.bannerResult.className = `banner-result ${ok ? 'is-ok' : 'is-bad'}`;
    if (ok) {
      const p = this.progress();
      p[c.id] = { done: true, at: new Date().toISOString() };
      store.saveJson('progress', p);
    }
    this.announce(this.bannerResult.textContent);
    this.curView().fit([...res.segments, ...(this.showGhost ? this.ghost : [])]);
  }

  // ---------------------------------------------------------------- pliki i linki
  async openFile(text: string, name: string) {
    let mode: Mode = this.mode;
    try { parse(text, mode); } catch (e) {
      if (e instanceof LogoError && e.code === 'needs3d' && mode === '2d') mode = '3d';
    }
    const ok = await this.loadSource(text, mode, { confirm: true, label: name });
    if (ok) {
      this.closeChallenge(false);
      this.setStatus(`Wczytano plik ${name} (tryb ${mode.toUpperCase()}).`);
    }
  }

  private downloadLogo() {
    const t = this.editor.value;
    download(`program-${this.mode}.logo`, new Blob([t.endsWith('\n') ? t : t + '\n'], { type: 'text/plain;charset=utf-8' }));
    this.setStatus('Pobrano plik .logo.');
  }

  private async exportPng() {
    const blob = await this.curView().toBlob();
    if (!blob) { toast('Nie udało się utworzyć obrazu.'); return; }
    download(`rysunek-${this.mode}.png`, blob);
    this.setStatus('Zapisano obraz PNG.');
  }

  permalink(): string {
    const base = location.href.split('#')[0];
    return base + permalinkHash(this.editor.value, this.mode);
  }

  private showShare() {
    const url = this.permalink();
    const d = makeDialog('Link do programu', { onClose: () => d.dlg.remove() });
    const input = h('input', { type: 'text', readonly: true, value: url, id: 'share-url', class: 'share-input' });
    const copy = h('button', { type: 'button', class: 'btn btn-primary' }, 'Kopiuj link');
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(url); toast('Link skopiowany.'); }
      catch { input.select(); toast('Zaznaczono link: skopiuj go skrótem Ctrl+C.'); }
    });
    d.body.append(
      h('p', {}, 'Każdy, kto otworzy ten adres, zobaczy Twój program w trybie ' + this.mode.toUpperCase() + ' i od razu go uruchomi. Program jest zapisany w samym adresie, nic nie jest wysyłane na serwer.'),
      h('label', { for: 'share-url', class: 'sr-only' }, 'Adres programu'), input,
      ...(url.length > 8000 ? [h('p', { class: 'muted' }, 'Ten link jest bardzo długi; niektóre komunikatory mogą go ucinać. Rozważ plik .logo.')] : []),
      h('div', { class: 'dlg-actions' }, copy));
    d.open();
    input.select();
  }

  /** Wczytuje program z parametrów adresu (#/?tryb=..&kod=..) i uruchamia. */
  async openFromParams(params: URLSearchParams): Promise<boolean> {
    const kod = params.get('kod');
    if (kod === null) return false;
    const mode: Mode = params.get('tryb') === '3d' ? '3d' : '2d';
    const src = decodeSource(kod);
    if (src === null) { toast('Link jest uszkodzony: nie udało się odczytać programu.'); return true; }
    const before = this.draftOf(mode);
    const stashed = !this.isPristine(before) && before.trim() !== src.trim();
    await this.loadSource(src, mode, { confirm: false });
    this.closeChallenge(false);
    history.replaceState(null, '', location.pathname + location.search + '#/');
    if (stashed) toast('Wczytano program z linku. Twój poprzedni szkic zachowano.', { label: 'Przywróć', run: () => this.restoreStash() }, 9000);
    await this.runInstant();
    return true;
  }

  /** Używane przez window.logomocja.open. */
  async open(source: string, mode: Mode): Promise<RunResult> {
    const m: Mode = mode === '3d' ? '3d' : '2d';
    if (this.mode !== m) await this.setMode(m);
    this.closeChallenge(false);
    this.cancelRun();
    this.editor.value = source;
    this.saveDraft();
    this.clearDrawing();
    await this.runInstant();
    this.scheduleParseCheck();
    return run(source, m);
  }
}
