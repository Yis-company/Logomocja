import { prepare, run, startTurtle, type RunResult, type Segment } from '../lang/interp';
import type { ErrorInfo } from '../lang/errors';
import { plural, type Mode } from '../lang/parser';
import { fmtInt } from '../lang/lexer';
import { Editor } from './editor';
import { Runner, SPEEDS, type RunState } from './runner';
import { View2D } from './view2d';
import type { Scene, View } from './scene';
import { icon } from './icons';
import { load, save, loadJSON, saveJSON, type Progress } from './store';
import { downloadBlob, permalink, slug } from './share';
import { toast } from './toast';
import { checkTask, solutionSegments, type Task } from '../challenges';
import { EXAMPLES, type Example } from '../examples';
import { SHORTCUTS } from './shortcuts';

export type DocCtx = { kind: 'draft' } | { kind: 'task'; task: Task };

const STARTERS: Record<Mode, string> = {
  '2d': '; Witaj w Logomocji! Naciśnij „Uruchom” albo Ctrl+Enter.\nkolor "#16866a"\npowtorz 4 [\n  np 100\n  pw 90\n]\n',
  '3d': '; Tryb 3D: żółw może też wznosić się i przechylać.\nkolor "#2b6fb3"\npowtorz 4 [np 100 pw 90]\ngora 90 np 100 dol 90\npowtorz 4 [np 100 pw 90]\n',
};


const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export class Studio {
  readonly root: HTMLElement;
  readonly editor: Editor;
  readonly runner: Runner;
  mode: Mode = '2d';
  ctx: DocCtx = { kind: 'draft' };
  private view2d: View2D;
  private view3d: View | null = null;
  private no3dReason = '';
  private view: View;
  private figNo = 0;
  private loaded: { title: string; source: string; number?: number } | null = null;
  private saveTimer = 0;
  private lastError: ErrorInfo | null = null;
  private els: Record<string, HTMLElement> = {};
  private visible = true;
  private status: { text: string; tone: 'idle' | 'busy' | 'ok' | 'error'; error?: ErrorInfo | null } = { text: '', tone: 'idle' };

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'studio';
    this.root.innerHTML = this.template();
    const $ = (s: string) => this.root.querySelector(s) as HTMLElement;
    for (const el of this.root.querySelectorAll<HTMLElement>('[data-el]')) this.els[el.dataset.el!] = el;

    this.editor = new Editor('Kod programu w języku Logo');
    $('.editor-slot').replaceWith(this.editor.root);
    this.editor.onChange(() => this.onEdit());

    this.view2d = new View2D('Rysunek 2D');
    this.els.viewport.append(this.view2d.element);
    this.view = this.view2d;

    this.runner = new Runner({
      scene: (s) => this.onScene(s),
      state: (st, info) => this.onState(st, info.line, info.error),
    });
    const speed = Number(load('tempo') ?? 4);
    this.runner.setSpeed(Number.isFinite(speed) ? speed : 4);
    (this.els.speed as HTMLInputElement).value = String(this.runner.speed);
    this.paintSpeed();

    this.bind();
    const lastMode = load('tryb') === '3d' ? '3d' : '2d';
    this.mode = lastMode;
    this.loadDoc();
    this.applyMode();
    this.runner.reset();
    this.setStatus('Gotowe. Naciśnij „Uruchom”, a żółw narysuje program.', 'idle');
  }

  private template() {
    const kbd = (s: string) => `<kbd>${s}</kbd>`;
    const mod = isMac ? '⌘' : 'Ctrl';
    return `
    <section class="pane pane-code" aria-label="Program">
      <div class="task" data-el="task" hidden></div>
      <div class="bar bar-run" role="toolbar" aria-label="Wykonanie programu">
        <button type="button" class="btn btn-primary" data-act="run" title="Uruchom (${mod}+Enter)">${icon('play')}<span>Uruchom</span>${kbd(mod + ' ↵')}</button>
        <button type="button" class="btn" data-act="step" title="Krok (F10)">${icon('step')}<span>Krok</span></button>
        <button type="button" class="btn" data-act="pause" data-el="pause" title="Pauza / wznów (F9)" disabled>${icon('pause')}<span data-el="pauseLabel">Pauza</span></button>
        <button type="button" class="btn" data-act="reset" data-el="reset" title="Reset (Esc)">${icon('reset')}<span>Reset</span></button>
      </div>
      <div class="editor-slot"></div>
      <div class="status" data-el="status" role="status" aria-live="polite"></div>
      <div class="bar bar-file" role="toolbar" aria-label="Plik i udostępnianie">
        <button type="button" class="btn btn-quiet" data-act="new">${icon('newfile')}<span>Nowy</span></button>
        <button type="button" class="btn btn-quiet" data-act="open">${icon('upload')}<span>Otwórz</span></button>
        <button type="button" class="btn btn-quiet" data-act="save">${icon('download')}<span>Pobierz .logo</span></button>
        <button type="button" class="btn btn-quiet" data-act="link" popovertarget="pop-link">${icon('link')}<span>Link</span></button>
        <button type="button" class="btn btn-quiet" data-act="png">${icon('image')}<span>PNG</span></button>
        <button type="button" class="btn btn-quiet" popovertarget="pop-keys" data-act="keys">${icon('keyboard')}<span>Skróty</span></button>
        <input type="file" accept=".logo,.txt,text/plain" data-el="file" hidden>
      </div>
      <div id="pop-keys" popover class="pop" aria-label="Skróty klawiszowe">
        <h2 class="pop-title">Skróty klawiszowe</h2>
        <dl class="keys">${SHORTCUTS.map(([k, v]) => `<dt>${k.replace('Ctrl', mod)}</dt><dd>${v}</dd>`).join('')}</dl>
        <p class="pop-note">Klawisz Tab przenosi fokus dalej; wcięcia robi Enter i spacje.</p>
      </div>
      <div id="pop-link" popover class="pop pop-link" aria-label="Link do programu">
        <h2 class="pop-title">Link do tego programu</h2>
        <p class="pop-note">Kto go otworzy, zobaczy ten kod w trybie <span data-el="linkMode">2D</span> i od razu jego rysunek.</p>
        <div class="link-row">
          <input type="text" readonly data-el="linkInput" aria-label="Adres linku">
          <button type="button" class="btn btn-primary" data-act="copy">${icon('copy')}<span>Kopiuj</span></button>
        </div>
      </div>
    </section>
    <section class="pane pane-sheet" aria-label="Rysunek">
      <div class="bar bar-sheet">
        <fieldset class="seg" data-el="modes">
          <legend class="sr-only">Tryb rysowania</legend>
          <label><input type="radio" name="tryb" value="2d"><span>2D</span></label>
          <label><input type="radio" name="tryb" value="3d"><span>3D</span></label>
        </fieldset>
        <label class="speed" title="Tempo animacji">
          <span class="speed-label">Tempo</span>
          <input type="range" min="1" max="${SPEEDS.length}" step="1" data-el="speed" aria-describedby="speed-out">
          <output id="speed-out" data-el="speedOut"></output>
        </label>
        <div class="tools" role="group" aria-label="Widok">
          <button type="button" class="btn btn-icon" data-act="zoomout" aria-label="Oddal" title="Oddal">${icon('minus')}</button>
          <button type="button" class="btn btn-icon" data-act="zoomin" aria-label="Przybliż" title="Przybliż">${icon('plus')}</button>
          <button type="button" class="btn btn-icon" data-act="fit" aria-label="Dopasuj rysunek do widoku" title="Dopasuj">${icon('fit')}</button>
          <button type="button" class="btn btn-icon" data-act="home" data-el="homeBtn" aria-label="Widok początkowy" title="Widok początkowy">${icon('camera')}</button>
        </div>
      </div>
      <div class="viewport" data-el="viewport">
        <div class="notice" data-el="notice" hidden></div>
      </div>
      <p class="caption" data-el="caption" aria-live="off"></p>
    </section>`;
  }

  private bind() {
    this.root.addEventListener('click', (e) => {
      const b = (e.target as Element).closest<HTMLElement>('[data-act]');
      if (!b || !this.root.contains(b)) return;
      this.act(b.dataset.act!, b);
    });
    const speed = this.els.speed as HTMLInputElement;
    speed.addEventListener('input', () => {
      this.runner.setSpeed(Number(speed.value));
      save('tempo', String(this.runner.speed));
      this.paintSpeed();
    });
    this.els.modes.addEventListener('change', (e) => {
      const v = (e.target as HTMLInputElement).value as Mode;
      if (v !== this.mode) this.switchMode(v);
    });
    (this.els.file as HTMLInputElement).addEventListener('change', () => this.openFile());
    const linkPop = this.root.querySelector<HTMLElement>('#pop-link')!;
    linkPop.addEventListener('toggle', async (e) => {
      if ((e as ToggleEvent).newState !== 'open') return;
      this.placePopover(linkPop, this.root.querySelector('[data-act="link"]')!);
      const input = this.els.linkInput as HTMLInputElement;
      input.value = 'Tworzę link…';
      input.value = await permalink(this.editor.value, this.mode);
      this.els.linkMode.textContent = this.mode.toUpperCase();
      input.select();
    });
    const keysPop = this.root.querySelector<HTMLElement>('#pop-keys')!;
    keysPop.addEventListener('toggle', (e) => {
      if ((e as ToggleEvent).newState === 'open') this.placePopover(keysPop, this.root.querySelector('[data-act="keys"]')!);
    });
    this.els.status.addEventListener('click', (e) => {
      if ((e.target as Element).closest('[data-goto]') && this.lastError) this.editor.focusAt(this.lastError.line, this.lastError.column);
    });
    document.addEventListener('keydown', (e) => this.onKey(e));
  }

  private placePopover(pop: HTMLElement, anchor: HTMLElement) {
    const r = anchor.getBoundingClientRect();
    const w = Math.min(pop.id === 'pop-keys' ? 460 : 400, window.innerWidth - 16);
    pop.style.width = w + 'px';
    const left = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
    pop.style.left = left + 'px';
    const below = r.bottom + 8;
    const h = pop.offsetHeight || 200;
    pop.style.top = (below + h > window.innerHeight - 8 ? Math.max(8, r.top - h - 8) : below) + 'px';
  }

  setVisible(v: boolean) {
    this.visible = v;
    this.root.hidden = !v;
    this.view.setActive(v);
    if (!v) this.runner.pause();
  }

  private onKey(e: KeyboardEvent) {
    if (!this.visible) return;
    const mod = e.ctrlKey || e.metaKey;
    const k = e.key;
    if (mod && !e.shiftKey && !e.altKey && k === 'Enter') {
      e.preventDefault();
      this.act('run');
    } else if (k === 'F10' || (mod && e.shiftKey && k === 'Enter')) {
      e.preventDefault();
      this.act('step');
    } else if (k === 'F9' || (mod && e.shiftKey && (k === ' ' || e.code === 'Space'))) {
      e.preventDefault();
      this.act('pause');
    } else if (k === 'Escape' && !e.defaultPrevented) {
      if (document.querySelector(':popover-open')) return;
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' && t !== this.editor.textarea) return;
      this.act('reset');
    }
  }

  act(name: string, el?: HTMLElement) {
    switch (name) {
      case 'run': this.runProgram(false); break;
      case 'step': this.stepProgram(); break;
      case 'pause':
        if (this.runner.state === 'running') this.runner.pause();
        else if (this.runner.state === 'paused') this.runner.resume();
        break;
      case 'reset':
        this.runner.reset();
        this.setStatus('Rysunek wyczyszczony. Żółw wrócił na start.', 'idle');
        break;
      case 'zoomin': this.view.zoomBy(1.25); break;
      case 'zoomout': this.view.zoomBy(0.8); break;
      case 'fit': this.view.fit(); break;
      case 'home': this.view.resetView(); break;
      case 'new': this.newProgram(); break;
      case 'open': (this.els.file as HTMLInputElement).click(); break;
      case 'save': this.saveFile(); break;
      case 'png': this.exportPNG(); break;
      case 'copy': this.copyLink(el); break;
    }
  }

  // --- dokumenty ---------------------------------------------------------------

  private docKey() {
    return this.ctx.kind === 'task' ? `zadanie.${this.ctx.task.id}` : `szkic.${this.mode}`;
  }

  private loadDoc() {
    const stored = load(this.docKey());
    let text: string;
    if (this.ctx.kind === 'task') text = stored ?? this.ctx.task.starter;
    else text = stored ?? STARTERS[this.mode];
    this.editor.setValue(text);
    this.loaded = null;
    this.lastError = null;
  }

  private persist() {
    clearTimeout(this.saveTimer);
    save(this.docKey(), this.editor.value);
  }

  private onEdit() {
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.persist(), 250);
    if (this.runner.state === 'running' || this.runner.state === 'paused') {
      this.runner.halt();
      this.setStatus('Zatrzymano, bo kod się zmienił w trakcie rysowania. Uruchom program ponownie.', 'idle');
    }
    if (this.ctx.kind === 'task') this.showVerdict(null);
    this.paintCaption();
  }

  /** Otwiera szkic (pracownię) w danym trybie. */
  openDraft(mode?: Mode) {
    if (this.ctx.kind !== 'draft') {
      this.persist();
      this.ctx = { kind: 'draft' };
      this.root.dataset.ctx = 'draft';
      this.els.task.hidden = true;
      this.runner.ghost = null;
      if (mode) this.mode = mode;
      this.loadDoc();
      this.applyMode();
      this.runner.reset();
      this.setStatus('Gotowe. Naciśnij „Uruchom”, a żółw narysuje program.', 'idle');
    } else if (mode && mode !== this.mode) {
      this.switchMode(mode);
    }
  }

  openTask(task: Task) {
    if (this.ctx.kind === 'task' && this.ctx.task.id === task.id) return;
    this.persist();
    this.ctx = { kind: 'task', task };
    this.root.dataset.ctx = 'task';
    this.mode = task.mode;
    this.runner.ghost = solutionSegments(task);
    this.renderTaskPanel(task);
    this.loadDoc();
    this.applyMode();
    this.runner.reset();
    this.view.fit();
    this.setStatus('Napisz program, uruchom go, a potem naciśnij „Sprawdź”.', 'idle');
  }

  private switchMode(mode: Mode) {
    if (this.ctx.kind === 'task') return;
    this.persist();
    this.mode = mode;
    save('tryb', mode);
    this.loadDoc();
    this.applyMode();
    this.runner.reset();
    this.setStatus(`Tryb ${mode.toUpperCase()}. Twój szkic w tym trybie jest zapisany osobno.`, 'idle');
  }

  /**
   * Wstawia nowy program w miejsce szkicu. Poprzedni szkic trafia do schowka
   * i można go przywrócić jednym kliknięciem: nic nie znika po cichu.
   */
  replaceDraft(text: string, mode: Mode, what: string, loaded?: { title: string; number?: number }, quiet = false) {
    this.openDraft(mode);
    if (this.mode !== mode) this.switchMode(mode);
    const current = this.editor.value;
    if (current.trim() && current !== text && current !== STARTERS[mode] && !EXAMPLES.some((e) => e.source === current)) {
      saveJSON('poprzedni', { mode, text: current, at: Date.now() });
      toast(`${what} Poprzedni szkic ${mode.toUpperCase()} jest w schowku.`, {
        label: 'Przywróć szkic',
        run: () => this.restoreStash(),
      });
    } else if (!quiet) {
      toast(what);
    }
    this.editor.setValue(text);
    this.persist();
    this.loaded = loaded ? { ...loaded, source: text } : null;
    this.runner.reset();
  }

  restoreStash() {
    const stash = loadJSON<{ mode: Mode; text: string } | null>('poprzedni', null);
    if (!stash) return;
    this.openDraft(stash.mode);
    const now = this.editor.value;
    this.editor.setValue(stash.text);
    this.persist();
    saveJSON('poprzedni', { mode: stash.mode, text: now, at: Date.now() });
    this.loaded = null;
    this.runner.reset();
    this.setStatus('Przywrócono poprzedni szkic. To, co było w edytorze, czeka w schowku.', 'idle');
  }

  loadExample(ex: Example) {
    const n = EXAMPLES.indexOf(ex) + 1;
    this.replaceDraft(ex.source, ex.mode, `Wczytano przykład „${ex.title}”.`, { title: ex.title, number: n });
    this.runProgram(false);
  }

  private newProgram() {
    if (this.ctx.kind === 'task') {
      this.editor.setValue(this.ctx.task.starter);
      this.persist();
      this.runner.reset();
      return;
    }
    this.replaceDraft('', this.mode, 'Nowy, pusty program.');
    this.editor.textarea.focus();
    this.setStatus('Pusty program. Napisz np. „np 100” i naciśnij „Uruchom”.', 'idle');
  }

  // --- tryb i widoki --------------------------------------------------------------

  /** Ładuje widok 3D (Three.js) dopiero wtedy, gdy jest potrzebny. */
  private async load3D() {
    const { View3D, webglAvailable } = await import('./view3d');
    if (!webglAvailable()) {
      this.no3dReason = 'Widok 3D jest wyłączony: ta przeglądarka nie udostępnia WebGL (grafiki przestrzennej). Programy 3D nadal działają, a rysunek widać w uproszczonym rzucie.';
      this.view3d = new View2D('Rysunek 3D w rzucie', 'iso');
    } else {
      try {
        this.view3d = new View3D('Rysunek 3D: przeciągnij, aby obrócić');
      } catch {
        this.no3dReason = 'Widok 3D jest wyłączony: nie udało się uruchomić WebGL. Programy 3D nadal działają, a rysunek widać w uproszczonym rzucie.';
        this.view3d = new View2D('Rysunek 3D w rzucie', 'iso');
      }
    }
    this.els.viewport.append(this.view3d.element);
  }

  private three: Promise<void> | null = null;

  async ready3D() {
    if (!this.three) this.three = this.load3D();
    await this.three;
  }

  private async applyMode() {
    for (const input of this.els.modes.querySelectorAll<HTMLInputElement>('input')) {
      input.checked = input.value === this.mode;
      input.disabled = this.ctx.kind === 'task' && input.value !== this.mode;
    }
    this.root.dataset.mode = this.mode;
    let next: View = this.view2d;
    if (this.mode === '3d') {
      await this.ready3D();
      if (this.mode !== '3d') return;
      next = this.view3d!;
    }
    const notice = this.els.notice;
    notice.hidden = !(this.mode === '3d' && this.no3dReason);
    notice.innerHTML = this.no3dReason ? `${icon('warn')}<span>${this.no3dReason}</span>` : '';
    if (next !== this.view) {
      this.view.setActive(false);
      this.view.element.hidden = true;
      this.view = next;
    }
    this.view.element.hidden = false;
    this.view.setActive(true);
    this.view.onThemeChange();
    this.view.setScene(this.runner.scene());
    this.paintCaption();
  }

  onThemeChange() {
    this.view2d.onThemeChange();
    this.view3d?.onThemeChange();
  }

  // --- wykonanie ----------------------------------------------------------------

  private prepareOrReport() {
    const p = prepare(this.editor.value, this.mode);
    if (p.error) {
      this.runner.reset();
      this.reportError(p.error, true);
      return null;
    }
    this.editor.setError(null);
    this.lastError = null;
    return p.program;
  }

  /** Kadruje widok na końcowy rysunek, zanim animacja się zacznie. */
  private frameFinal(): RunResult {
    const res = run(this.editor.value, this.mode);
    const scene: Scene = {
      segments: res.segments,
      turtle: startTurtle(),
      partial: null,
      ghost: this.runner.ghost,
      version: -1,
    };
    this.view.setScene(scene);
    this.view.fit();
    return res;
  }

  runProgram(instant: boolean): RunResult | null {
    if (this.mode === '3d' && !this.view3d) {
      // widok 3D jeszcze się ładuje
      this.ready3D().then(() => this.runProgram(instant));
      return null;
    }
    const program = this.prepareOrReport();
    if (!program) return null;
    this.figNo++;
    const res = this.frameFinal();
    this.runner.start(program, instant);
    return res;
  }

  private stepProgram() {
    this.runner.step(() => {
      const p = this.prepareOrReport();
      if (p) {
        this.figNo++;
        this.frameFinal();
      }
      return p;
    });
  }

  private reportError(err: ErrorInfo, parse: boolean) {
    this.lastError = err;
    this.editor.setError(err);
    const where = `Wiersz ${err.line}, kolumna ${err.column}`;
    this.setStatus(`${where}: ${err.message}${parse ? ' Nic nie zostało narysowane.' : ' Rysunek zatrzymał się w tym miejscu.'}`, 'error', err);
  }

  private onScene(s: Scene) {
    this.view.setScene(s);
    this.paintCaption(s);
  }

  private onState(st: RunState, line: number | null, error: ErrorInfo | null) {
    this.editor.setExecLine(st === 'running' || st === 'paused' ? line : null);
    const pause = this.els.pause as HTMLButtonElement;
    pause.disabled = !(st === 'running' || st === 'paused');
    this.els.pauseLabel.textContent = st === 'paused' ? 'Wznów' : 'Pauza';
    pause.innerHTML = `${icon(st === 'paused' ? 'play' : 'pause')}<span data-el="pauseLabel">${st === 'paused' ? 'Wznów' : 'Pauza'}</span>`;
    this.els.pauseLabel = pause.querySelector('span')!;
    pause.setAttribute('aria-pressed', String(st === 'paused'));
    this.root.dataset.state = st;
    const ex = this.runner.ex;
    switch (st) {
      case 'running':
        this.setStatus(line ? `Rysuję… wiersz ${line}.` : 'Rysuję…', 'busy');
        break;
      case 'paused':
        this.setStatus(line ? `Pauza po wierszu ${line}. „Krok” wykona następne polecenie.` : 'Pauza. „Krok” wykona pierwsze polecenie.', 'busy');
        break;
      case 'done': {
        const n = ex?.segments.length ?? 0;
        this.setStatus(`Gotowe: ${n} ${plural(n, 'odcinek', 'odcinki', 'odcinków')}, ${fmtInt(ex?.ops ?? 0)} ${plural(ex?.ops ?? 0, 'operacja', 'operacje', 'operacji')}.`, 'ok');
        break;
      }
      case 'error':
        if (error) this.reportError(error, false);
        break;
    }
  }

  private setStatus(text: string, tone: 'idle' | 'busy' | 'ok' | 'error', error: ErrorInfo | null = null) {
    if (this.status.text === text && this.status.tone === tone) return;
    this.status = { text, tone, error };
    const el = this.els.status;
    el.dataset.tone = tone;
    const ic = tone === 'error' ? icon('warn') : tone === 'ok' ? icon('check') : '';
    el.innerHTML = `${ic}<span class="status-text"></span>${error ? '<button type="button" class="btn btn-link" data-goto>Przejdź do błędu</button>' : ''}`;
    el.querySelector('.status-text')!.textContent = text;
  }

  private paintSpeed() {
    const s = SPEEDS[this.runner.speed - 1];
    this.els.speedOut.textContent = s.label;
    (this.els.speed as HTMLInputElement).setAttribute('aria-valuetext', s.label);
  }

  private captionTitle(): string {
    if (this.ctx.kind === 'task') return this.ctx.task.title;
    if (this.loaded && this.loaded.source === this.editor.value) return this.loaded.title;
    return this.mode === '3d' ? 'Twój rysunek w przestrzeni' : 'Twój rysunek';
  }

  private paintCaption(s?: Scene) {
    const scene = s ?? this.runner.scene();
    const segs = scene.segments;
    const n = segs.length;
    let len = 0;
    for (const g of segs) len += Math.hypot(g.to[0] - g.from[0], g.to[1] - g.from[1], g.to[2] - g.from[2]);
    const ops = this.runner.ex?.ops ?? 0;
    const fig = this.ctx.kind === 'task'
      ? `Zad. ${taskNumber(this.ctx.task)}.`
      : this.figNo ? `Rys. ${this.figNo}.` : 'Rys.';
    const title = this.captionTitle();
    const stats = this.runner.ex
      ? `${n} ${plural(n, 'odcinek', 'odcinki', 'odcinków')} · łączna długość ${fmtInt(Math.round(len))} · ${fmtInt(ops)} ${plural(ops, 'operacja', 'operacje', 'operacji')} · ${this.mode.toUpperCase()}`
      : `jeszcze nie narysowano · ${this.mode.toUpperCase()}`;
    const html = `<span class="fig">${fig}</span> <span class="cap-title"></span> <span class="cap-stats">${stats}</span>`;
    const el = this.els.caption;
    if (el.dataset.html !== html + title) {
      el.innerHTML = html;
      el.querySelector('.cap-title')!.textContent = title;
      el.dataset.html = html + title;
      const label = `${title}: ${n} ${plural(n, 'odcinek', 'odcinki', 'odcinków')}`;
      (this.view as View2D).setLabel?.(label);
    }
  }

  // --- zadania ---------------------------------------------------------------

  private renderTaskPanel(task: Task) {
    const el = this.els.task;
    el.hidden = false;
    const progress = loadJSON<Progress>('zadania', {});
    const solved = progress[task.id]?.solved;
    el.innerHTML = `
      <div class="task-head">
        <span class="zad" aria-hidden="true">${taskNumber(task)}</span>
        <h1 class="task-title"><span class="sr-only">Zadanie ${taskNumber(task)}. </span>${task.title}</h1>
        <span class="chip ${solved ? 'chip-ok' : ''}" data-el="taskChip">${solved ? icon('check') + 'Rozwiązane' : task.mode.toUpperCase()}</span>
        <a class="btn btn-quiet btn-small" href="#/zadania">${icon('back')}<span>Wszystkie zadania</span></a>
      </div>
      <p class="task-prompt"></p>
      <details class="task-hint"><summary>Podpowiedź</summary><p></p></details>
      <div class="task-actions">
        <button type="button" class="btn btn-accent" data-task="check">${icon('check')}<span>Sprawdź</span></button>
        <label class="check"><input type="checkbox" data-task="ghost" checked><span>Pokaż wzór na rysunku</span></label>
      </div>
      <div class="verdict" data-el="verdict" role="status" aria-live="polite" hidden></div>`;
    el.querySelector('.task-prompt')!.textContent = task.prompt;
    el.querySelector('.task-hint p')!.textContent = task.hint;
    el.querySelector('[data-task="check"]')!.addEventListener('click', () => this.checkCurrent());
    el.querySelector<HTMLInputElement>('[data-task="ghost"]')!.addEventListener('change', (e) => {
      this.runner.ghost = (e.target as HTMLInputElement).checked ? solutionSegments(task) : null;
      this.view.setScene(this.runner.scene());
    });
    this.els.verdict = el.querySelector('.verdict')!;
  }

  private showVerdict(r: { ok: boolean; reason: string } | null) {
    const v = this.els.verdict;
    if (!v) return;
    if (!r) {
      v.hidden = true;
      return;
    }
    v.hidden = false;
    v.dataset.ok = String(r.ok);
    v.innerHTML = `${icon(r.ok ? 'check' : 'cross')}<div><strong>${r.ok ? 'Zaliczone!' : 'Jeszcze nie.'}</strong> <span></span></div>`;
    v.querySelector('span')!.textContent = r.reason;
  }

  private checkCurrent() {
    if (this.ctx.kind !== 'task') return;
    const task = this.ctx.task;
    this.persist();
    this.runProgram(true);
    const r = checkTask(task, this.editor.value);
    this.showVerdict(r);
    if (r.ok) {
      const progress = loadJSON<Progress>('zadania', {});
      progress[task.id] = { solved: true, at: Date.now() };
      saveJSON('zadania', progress);
      const chip = this.els.task.querySelector('[data-el="taskChip"]');
      if (chip) {
        chip.className = 'chip chip-ok';
        chip.innerHTML = icon('check') + 'Rozwiązane';
      }
    }
  }

  // --- pliki ---------------------------------------------------------------------

  private fileTitle() {
    return slug(this.ctx.kind === 'task' ? `zadanie-${this.ctx.task.id}` : this.captionTitle() === 'Twój rysunek' || this.captionTitle().startsWith('Twój') ? `szkic-${this.mode}` : this.captionTitle());
  }

  private saveFile() {
    const blob = new Blob([this.editor.value], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${this.fileTitle()}.logo`);
    toast(`Pobrano plik ${this.fileTitle()}.logo.`);
  }

  private async openFile() {
    const input = this.els.file as HTMLInputElement;
    const f = input.files?.[0];
    input.value = '';
    if (!f) return;
    if (f.size > 200_000) {
      toast('Ten plik jest za duży jak na program Logo (najwyżej 50 000 znaków).');
      return;
    }
    const text = (await f.text()).replace(/\r\n?/g, '\n');
    // Plik nie zapisuje trybu: jeśli program używa poleceń przestrzennych, otwieramy go w 3D.
    let mode = this.mode;
    if (this.ctx.kind === 'draft') {
      const in2d = prepare(text, '2d');
      const in3d = prepare(text, '3d');
      if (in2d.error && !in3d.error) mode = '3d';
    }
    if (this.ctx.kind === 'task') {
      this.editor.setValue(text);
      this.persist();
      toast(`Otwarto plik ${f.name}.`);
    } else {
      this.replaceDraft(text, mode, `Otwarto plik ${f.name}.`);
    }
    this.runProgram(false);
  }

  private async exportPNG() {
    await this.view.flush();
    const blob = await this.view.toPNG();
    if (!blob) {
      toast('Nie udało się zapisać obrazu.');
      return;
    }
    downloadBlob(blob, `${this.fileTitle()}.png`);
    toast(`Zapisano obraz ${this.fileTitle()}.png.`);
  }

  private async copyLink(btn?: HTMLElement) {
    const input = this.els.linkInput as HTMLInputElement;
    input.select();
    let ok = false;
    try {
      await navigator.clipboard.writeText(input.value);
      ok = true;
    } catch {
      ok = document.execCommand?.('copy') ?? false;
    }
    if (btn) btn.querySelector('span')!.textContent = ok ? 'Skopiowano' : 'Zaznaczono';
    setTimeout(() => { if (btn) btn.querySelector('span')!.textContent = 'Kopiuj'; }, 1800);
  }

  // --- haczyk testowy ------------------------------------------------------------------

  async openFromHook(source: string, mode: Mode): Promise<RunResult> {
    const m: Mode = mode === '3d' ? '3d' : '2d';
    this.openDraft(m);
    if (this.mode !== m) this.switchMode(m);
    if (m === '3d') {
      await this.ready3D();
      await this.applyMode();
    }
    this.replaceDraft(String(source), m, 'Wczytano program.', undefined, true);
    this.runProgram(true);
    this.view.fit();
    await this.view.flush();
    const r = run(String(source), m);
    return { segments: r.segments.map(copySeg), error: r.error };
  }

  async openShared(source: string, mode: Mode) {
    this.replaceDraft(source, mode, 'Otwarto program z linku.');
    if (mode === '3d') {
      await this.ready3D();
      await this.applyMode();
    }
    this.runProgram(false);
  }
}

const copySeg = (s: Segment): Segment => ({ from: [...s.from], to: [...s.to], color: s.color, width: s.width });

import { TASKS } from '../challenges';
export const taskNumber = (t: Task) => TASKS.indexOf(t) + 1;
