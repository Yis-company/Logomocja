import { Execution, checkSource, parse, runSource, type Pos, type RunError, type Turtle, type Segment } from '../logo';
import type { Mode } from '../logo/ast';
import { EXAMPLES, type Example } from '../logo/examples';
import { judge, type Challenge, type Verdict } from '../logo/check';
import { View2D } from './view2d';
import type { View3D } from './view3d';
import { Editor } from './editor';
import {
  download,
  encodeProgram,
  escapeHtml,
  safeFileName,
  storageGet,
  storageRemove,
  storageSet,
  webglAvailable,
} from './util';
import { progressOf, markPassed } from './progress';

export type Doc = { kind: 'mode'; mode: Mode } | { kind: 'challenge'; challenge: Challenge };

export const STARTER = 'powtorz 4 [np 100 pw 90]\n';
const TEMPO_MAX = 11;
const BACKUP_KEY = 'logomocja.kopia';
const LAST_MODE_KEY = 'logomocja.tryb';

export const draftKey = (doc: Doc) => (doc.kind === 'mode' ? `logomocja.szkic.${doc.mode}` : `logomocja.wyzwanie.${doc.challenge.id}`);

type RunState = 'idle' | 'running' | 'paused' | 'done';

interface Backup {
  key: string;
  text: string;
  label: string;
}

/** Steps per second for the speed slider; the last position runs without animation. */
const tempoRate = (v: number) => (v >= TEMPO_MAX ? Infinity : 2 ** v);
const tempoLabel = (v: number) => (v >= TEMPO_MAX ? 'natychmiast' : `${2 ** v} krok/s`);

const STUDIO_HTML = `
  <div class="studio">
    <section class="pane pane-code" aria-labelledby="h-code">
      <h2 id="h-code" class="visually-hidden">Program</h2>
      <div class="toolbar" role="toolbar" aria-label="Sterowanie programem">
        <div class="seg" role="radiogroup" aria-label="Tryb rysowania">
          <button type="button" role="radio" data-mode="2d" aria-checked="true">2D</button>
          <button type="button" role="radio" data-mode="3d" aria-checked="false">3D</button>
        </div>
        <button type="button" class="btn primary" data-act="run" title="Uruchom (Ctrl+Enter)">Uruchom</button>
        <button type="button" class="btn" data-act="step" title="Krok (F10)">Krok</button>
        <button type="button" class="btn" data-act="pause" title="Pauza lub wznowienie (F9)" disabled>Pauza</button>
        <button type="button" class="btn" data-act="reset" title="Zatrzymaj i wyczyść rysunek (Esc)">Reset</button>
        <label class="tempo">Tempo
          <input type="range" min="0" max="${TEMPO_MAX}" value="6" data-tempo />
          <output data-tempo-out>${tempoLabel(6)}</output>
        </label>
      </div>
      <div class="toolbar sub" role="toolbar" aria-label="Pliki i przykłady">
        <label class="inline">Przykład
          <select data-examples></select>
        </label>
        <button type="button" class="btn" data-act="load-example">Wczytaj przykład</button>
        <button type="button" class="btn" data-act="open">Otwórz plik</button>
        <button type="button" class="btn" data-act="download">Pobierz .logo</button>
        <button type="button" class="btn" data-act="share">Kopiuj link</button>
        <button type="button" class="btn" data-act="undo" disabled>Cofnij wczytanie</button>
      </div>
      <div class="editor-host" data-editor></div>
      <div class="messages">
        <p class="status" data-status role="status" aria-live="polite"></p>
        <p class="error" data-error role="alert"></p>
      </div>
      <div class="challenge" data-challenge hidden></div>
    </section>
    <section class="pane pane-view" aria-labelledby="h-view">
      <h2 id="h-view" class="visually-hidden">Rysunek</h2>
      <div class="toolbar" role="toolbar" aria-label="Widok rysunku">
        <button type="button" class="btn" data-act="fit">Dopasuj</button>
        <button type="button" class="btn icon" data-act="zoom-in" aria-label="Powiększ">+</button>
        <button type="button" class="btn icon" data-act="zoom-out" aria-label="Pomniejsz">&minus;</button>
        <button type="button" class="btn" data-act="reset-view" data-only-3d>Widok domyślny</button>
        <button type="button" class="btn" data-act="png">Zapisz PNG</button>
      </div>
      <div class="view-host" data-view></div>
      <p class="view-note" data-note></p>
    </section>
    <input type="file" accept=".logo,.txt,text/plain" hidden data-file />
  </div>`;

export class Studio {
  private editor!: Editor;
  private view: View2D | View3D | null = null;
  private viewToken = 0;
  private mode: Mode;
  private exec: Execution | null = null;
  private state: RunState = 'idle';
  private error: RunError | null = null;
  private raf = 0;
  private lastTs = 0;
  private carry = 0;
  private tempo = 6;
  private saveTimer = 0;
  private liveTimer = 0;
  private backup: Backup | null = null;
  private verdict: Verdict | null = null;
  private readonly q = <T extends Element = HTMLElement>(sel: string) => this.root.querySelector<T>(sel)!;
  private readonly onKey = (e: KeyboardEvent) => this.keyboard(e);
  private readonly onTheme = () => this.view?.setTheme();
  private destroyed = false;
  /** Resolves once the first view is on screen. */
  ready: Promise<void>;

  constructor(
    private readonly root: HTMLElement,
    private readonly doc: Doc,
  ) {
    this.mode = doc.kind === 'mode' ? doc.mode : doc.challenge.mode;
    this.root.innerHTML = STUDIO_HTML;
    this.editor = new Editor(this.q('[data-editor]'), () => this.onEdit());
    this.populateExamples();
    this.renderChallengePanel();
    this.restoreBackup();

    const saved = storageGet(draftKey(doc));
    this.editor.value = saved ?? (doc.kind === 'challenge' ? '' : STARTER);
    this.bind();
    this.ready = this.useView(this.mode, true).then(() => undefined);
    this.updateControls();
    this.setStatus(
      doc.kind === 'challenge'
        ? 'Napisz program i kliknij „Sprawdź”.'
        : 'Gotowe. Uruchom program (Ctrl+Enter) albo wybierz przykład.',
    );
    this.checkLive();
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('logomocja:theme', this.onTheme);
  }

  /* ---------- lifecycle ---------- */

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.stopLoop();
    clearTimeout(this.liveTimer);
    this.flushDraft();
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('logomocja:theme', this.onTheme);
    this.viewToken++;
    this.view?.dispose?.();
    this.view = null;
  }

  /** Saves the draft when the page is left or hidden. */
  flushDraft() {
    clearTimeout(this.saveTimer);
    storageSet(draftKey(this.doc), this.editor.value);
  }

  get source(): string {
    return this.editor.value;
  }

  /* ---------- wiring ---------- */

  private bind() {
    this.root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) =>
      b.addEventListener('click', () => this.switchMode(b.dataset.mode as Mode)),
    );
    this.root.querySelectorAll<HTMLButtonElement>('[data-act]').forEach((b) =>
      b.addEventListener('click', () => this.act(b.dataset.act!)),
    );
    const tempo = this.q<HTMLInputElement>('[data-tempo]');
    tempo.addEventListener('input', () => {
      this.tempo = Number(tempo.value);
      this.q('[data-tempo-out]').textContent = tempoLabel(this.tempo);
    });
    this.q<HTMLInputElement>('[data-file]').addEventListener('change', (e) => this.openFile(e));
  }

  private populateExamples() {
    const sel = this.q<HTMLSelectElement>('[data-examples]');
    const groups = (['2d', '3d'] as Mode[]).map(
      (m) =>
        `<optgroup label="${m === '2d' ? 'Płaszczyzna 2D' : 'Przestrzeń 3D'}">${EXAMPLES.filter((e) => e.mode === m)
          .map((e) => `<option value="${e.name}">${escapeHtml(e.name)} — ${escapeHtml(e.description)}</option>`)
          .join('')}</optgroup>`,
    );
    sel.innerHTML = groups.join('');
    if (this.doc.kind === 'challenge') {
      sel.closest('label')!.hidden = true;
      this.q('[data-act="load-example"]').hidden = true;
    }
  }

  private act(name: string) {
    switch (name) {
      case 'run':
        return this.start();
      case 'step':
        return this.step();
      case 'pause':
        return this.togglePause();
      case 'reset':
        return this.reset();
      case 'load-example':
        return this.loadExampleByName(this.q<HTMLSelectElement>('[data-examples]').value);
      case 'open':
        return this.q<HTMLInputElement>('[data-file]').click();
      case 'download':
        return this.downloadProgram();
      case 'share':
        return this.shareLink();
      case 'undo':
        return this.undoLoad();
      case 'fit':
        return this.fit();
      case 'zoom-in':
        return this.view instanceof View2D && this.view.zoom(1.25);
      case 'zoom-out':
        return this.view instanceof View2D && this.view.zoom(0.8);
      case 'reset-view':
        return (this.view as View3D | null)?.reset?.();
      case 'png':
        return this.exportPng();
      case 'check':
        return this.check();
      case 'show-reference':
        return this.showReference();
    }
  }

  private keyboard(e: KeyboardEvent) {
    if (this.destroyed || document.querySelector('dialog[open]')) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      this.start();
    } else if (e.key === 'F10') {
      e.preventDefault();
      this.step();
    } else if (e.key === 'F9') {
      e.preventDefault();
      this.togglePause();
    } else if (e.key === 'Escape' && document.activeElement?.closest('.pane-code, .pane-view')) {
      this.reset();
    }
  }

  /* ---------- editing and drafts ---------- */

  private onEdit() {
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => storageSet(draftKey(this.doc), this.editor.value), 400);
    if (this.state === 'running' || this.state === 'paused') {
      this.stopLoop();
      this.exec = null;
      this.state = 'idle';
      this.error = null;
      this.drawNow();
      this.setStatus('Program został zmieniony w czasie rysowania: rysunek wyczyszczono. Uruchom ponownie.');
    } else if (this.state === 'done') {
      this.setStatus('Program zmieniony od ostatniego uruchomienia. Uruchom ponownie, aby zobaczyć efekt.');
    }
    this.verdict = null;
    this.renderChallengePanel();
    clearTimeout(this.liveTimer);
    this.liveTimer = window.setTimeout(() => this.checkLive(), 250);
    this.updateControls();
  }

  /** Parse-time diagnostics while typing; run-time errors come from running. */
  private checkLive() {
    if (this.state === 'running' || this.state === 'paused') return;
    const err = checkSource(this.editor.value, this.mode);
    this.error = err;
    this.showError();
    this.editor.setMarks(null, err ? { line: err.line, col: err.column } : null);
  }

  private showError() {
    const el = this.q('[data-error]');
    el.textContent = this.error ? `Wiersz ${this.error.line}, kolumna ${this.error.column}: ${this.error.message}` : '';
    el.classList.toggle('visible', !!this.error);
  }

  private setStatus(text: string) {
    this.q('[data-status]').textContent = text;
  }

  private writeEditor(text: string) {
    this.editor.value = text;
    storageSet(draftKey(this.doc), text);
  }

  /** Replaces the draft, keeping the previous text so the load can be undone. */
  private loadText(text: string, label: string) {
    const prev = this.editor.value;
    this.stopLoop();
    this.exec = null;
    this.state = 'idle';
    this.error = null;
    if (prev.trim() !== '' && prev !== text) {
      this.backup = { key: draftKey(this.doc), text: prev, label };
      storageSet(BACKUP_KEY, JSON.stringify(this.backup));
    }
    this.writeEditor(text);
    this.verdict = null;
    this.renderChallengePanel();
    this.drawNow();
    this.checkLive();
    this.setStatus(`Wczytano: ${label}.${this.backup ? ' Poprzedni szkic można przywrócić przyciskiem „Cofnij wczytanie”.' : ''}`);
    this.updateControls();
  }

  private restoreBackup() {
    try {
      const raw = storageGet(BACKUP_KEY);
      this.backup = raw ? (JSON.parse(raw) as Backup) : null;
    } catch {
      this.backup = null;
    }
  }

  private undoLoad() {
    if (!this.backup) return;
    const b = this.backup;
    storageSet(b.key, b.text);
    this.backup = null;
    storageRemove(BACKUP_KEY);
    if (b.key === draftKey(this.doc)) {
      this.stopLoop();
      this.exec = null;
      this.state = 'idle';
      this.editor.value = b.text;
      this.checkLive();
      this.drawNow();
      this.setStatus('Przywrócono poprzedni szkic.');
    } else {
      this.setStatus('Poprzedni szkic przywrócono w innym trybie.');
    }
    this.updateControls();
  }

  private loadExampleByName(name: string) {
    const ex = EXAMPLES.find((e) => e.name === name);
    if (!ex || this.doc.kind !== 'mode') return;
    this.loadExample(ex);
  }

  loadExample(ex: Example) {
    if (this.doc.kind !== 'mode') return;
    const label = `przykład „${ex.name}” (${ex.mode.toUpperCase()})`;
    if (ex.mode !== this.mode) {
      this.switchMode(ex.mode).then(() => this.loadText(ex.source, label));
    } else {
      this.loadText(ex.source, label);
    }
  }

  /** Loads a program from a permalink or a `.logo` file, then runs it. */
  loadFromLink(source: string, mode: Mode) {
    const go = () => {
      this.loadText(source, 'program z linku');
      this.start();
    };
    if (this.doc.kind === 'mode' && mode !== this.mode) this.switchMode(mode).then(go);
    else go();
  }

  private openFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (file.size > 200_000) {
      this.setStatus('Plik jest zbyt duży, aby go wczytać.');
      return;
    }
    file.text().then((text) => this.loadText(text, `plik ${file.name}`));
  }

  private downloadProgram() {
    const name = this.doc.kind === 'challenge' ? this.doc.challenge.id : `program-${this.mode}`;
    download(`${safeFileName(name)}.logo`, new Blob([this.editor.value], { type: 'text/plain;charset=utf-8' }));
    this.setStatus('Zapisano plik .logo.');
  }

  private shareLink() {
    const url = `${location.origin}${location.pathname}#/?m=${this.mode}&p=${encodeProgram(this.editor.value)}`;
    const dlg = document.createElement('dialog');
    dlg.className = 'share-dialog';
    dlg.innerHTML = `
      <form method="dialog">
        <h2>Link do programu</h2>
        <p>Link zawiera program i tryb. Otwarcie go uruchamia program.</p>
        <label class="stack">Adres
          <textarea readonly rows="4" data-link>${escapeHtml(url)}</textarea>
        </label>
        <p class="copy-result" role="status"></p>
        <div class="dialog-actions">
          <button type="button" class="btn primary" data-copy>Kopiuj</button>
          <button type="submit" class="btn">Zamknij</button>
        </div>
      </form>`;
    document.body.append(dlg);
    const field = dlg.querySelector<HTMLTextAreaElement>('[data-link]')!;
    const result = dlg.querySelector<HTMLElement>('.copy-result')!;
    dlg.querySelector('[data-copy]')!.addEventListener('click', async () => {
      field.select();
      try {
        await navigator.clipboard.writeText(url);
        result.textContent = 'Skopiowano do schowka.';
      } catch {
        document.execCommand('copy');
        result.textContent = 'Zaznaczono adres: skopiuj go ręcznie (Ctrl+C).';
      }
    });
    dlg.addEventListener('close', () => dlg.remove());
    dlg.showModal();
    field.focus();
    field.select();
  }

  /* ---------- modes and views ---------- */

  private async switchMode(mode: Mode): Promise<void> {
    if (this.doc.kind !== 'mode' || mode === this.mode) return;
    this.flushDraft();
    this.stopLoop();
    this.exec = null;
    this.state = 'idle';
    this.mode = mode;
    storageSet(LAST_MODE_KEY, mode);
    this.editor.value = storageGet(draftKey(this.doc)) ?? STARTER;
    this.checkLive();
    await this.useView(mode);
    this.updateControls();
  }

  /** Creates the view for a mode. The 3D view is loaded only when needed. */
  private async useView(mode: Mode, initial = false): Promise<void> {
    const token = ++this.viewToken;
    const host = this.q('[data-view]');
    let target: Mode = mode;
    if (mode === '3d' && !webglAvailable()) {
      target = '2d';
      this.q('[data-note]').textContent =
        'Tryb 3D wymaga WebGL, a ta przeglądarka go nie udostępnia. Rysowanie w 2D działa normalnie.';
      if (this.doc.kind === 'mode') this.mode = '2d';
    } else {
      this.q('[data-note]').textContent = '';
    }
    this.view?.dispose?.();
    this.view = null;
    host.innerHTML = '';
    if (target === '2d') {
      this.view = new View2D(host);
    } else {
      const { View3D: Cls } = await import('./view3d');
      if (token !== this.viewToken || this.destroyed) return;
      this.view = new Cls(host);
    }
    this.syncModeButtons();
    this.drawNow();
    if (initial) this.fit();
    this.updateControls();
  }

  private syncModeButtons() {
    this.root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) => {
      const on = b.dataset.mode === this.mode;
      b.setAttribute('aria-checked', String(on));
      b.classList.toggle('on', on);
      b.disabled = this.doc.kind === 'challenge';
    });
    this.root.querySelectorAll<HTMLElement>('[data-only-3d]').forEach((el) => (el.hidden = this.mode !== '3d'));
  }

  private segments(): Segment[] {
    return this.exec ? this.exec.machine.segments : [];
  }

  private turtle(): Turtle | null {
    return this.exec ? this.exec.machine.turtle : null;
  }

  private drawNow() {
    if (!this.view) return;
    this.view.draw(this.segments(), this.turtle());
  }

  private fit() {
    this.view?.fit(this.segments(), this.turtle());
  }

  private exportPng() {
    if (!this.view) return;
    this.view.exportPng().then((blob) => {
      download(`logomocja-${this.mode}-${Date.now()}.png`, blob);
      this.setStatus('Zapisano obraz PNG.');
    });
  }

  /* ---------- running ---------- */

  /** Builds an execution from the editor text. Returns false when there is a parse error. */
  private prepare(): boolean {
    try {
      const prog = parse(this.editor.value, this.mode);
      this.exec = new Execution(prog);
      this.error = null;
      return true;
    } catch (e) {
      const err = e as { message?: string; line?: number; column?: number };
      this.exec = null;
      this.error = { message: err.message ?? String(e), line: err.line ?? 1, column: err.column ?? 1 };
      this.showError();
      this.drawNow();
      this.editor.setMarks(null, { line: this.error.line, col: this.error.column });
      this.setStatus('Program zawiera błąd. Nic nie zostało narysowane.');
      return false;
    }
  }

  private start() {
    this.stopLoop();
    if (!this.prepare()) return this.updateControls();
    this.state = 'running';
    this.carry = 0;
    this.setStatus('Rysowanie…');
    this.startLoop();
    this.updateControls();
  }

  private step() {
    if (this.state === 'running') this.stopLoop();
    if (!this.exec || this.exec.done) {
      if (!this.prepare()) return this.updateControls();
      this.state = 'paused';
      this.render();
      this.setStatus('Krok po kroku: podświetlono następne polecenie. Krok wykonuje je.');
      return this.updateControls();
    }
    this.exec.step();
    this.state = 'paused';
    this.render();
    this.finishIfDone();
    this.updateControls();
  }

  private togglePause() {
    if (this.state === 'running') {
      this.stopLoop();
      this.state = 'paused';
      this.setStatus('Wstrzymano. Wznów (F9) albo wykonaj krok (F10).');
      this.updateControls();
    } else if (this.state === 'paused' && this.exec) {
      this.state = 'running';
      this.startLoop();
      this.updateControls();
    }
  }

  private reset() {
    this.stopLoop();
    this.exec = null;
    this.state = 'idle';
    this.error = null;
    this.drawNow();
    this.editor.setMarks(null, null);
    this.checkLive();
    this.setStatus('Zresetowano. Rysunek wyczyszczono.');
    this.updateControls();
  }

  private startLoop() {
    this.lastTs = performance.now();
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.tick);
  }

  private stopLoop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private tick = (ts: number) => {
    if (!this.exec || this.state !== 'running') return;
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min(ts - this.lastTs, 100);
    this.lastTs = ts;
    const rate = tempoRate(this.tempo);
    if (rate === Infinity) {
      this.exec.runToEnd();
    } else {
      this.carry += (rate * dt) / 1000;
      while (this.carry >= 1 && !this.exec.done) {
        this.exec.step();
        this.carry -= 1;
      }
    }
    this.render();
    this.finishIfDone();
  };

  private render() {
    if (this.view) this.drawNow();
    const cur: Pos | null = this.exec && !this.exec.done ? this.exec.current : null;
    const err = this.exec?.error ? { line: this.exec.error.line, col: this.exec.error.column } : null;
    this.editor.setMarks(cur, err);
    if (this.exec?.error) {
      this.error = this.exec.error;
      this.showError();
    }
  }

  private finishIfDone() {
    if (!this.exec || !this.exec.done) return;
    this.stopLoop();
    this.state = 'done';
    this.render();
    this.fit();
    if (this.exec.error) {
      this.state = 'done';
      this.setStatus('Wykonanie przerwane błędem. Narysowano to, co zdążyło się wykonać.');
    } else {
      this.setStatus(`Gotowe: narysowano ${this.exec.machine.segments.length} odcinków.`);
    }
    this.updateControls();
  }

  private updateControls() {
    const st = this.state;
    const q = (sel: string) => this.q<HTMLButtonElement>(sel);
    q('[data-act="pause"]').disabled = !(st === 'running' || (st === 'paused' && !!this.exec));
    q('[data-act="pause"]').textContent = st === 'running' ? 'Pauza' : 'Wznów';
    q('[data-act="reset"]').disabled = st === 'idle' && !this.exec;
    q('[data-act="undo"]').disabled = !this.backup || this.backup.key !== draftKey(this.doc);
    this.root.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) => {
      if (this.doc.kind === 'mode') b.disabled = st === 'running';
    });
    const tempo = this.q<HTMLInputElement>('[data-tempo]');
    tempo.value = String(this.tempo);
  }

  /* ---------- challenges ---------- */

  private renderChallengePanel() {
    const panel = this.q('[data-challenge]');
    if (this.doc.kind !== 'challenge') {
      panel.hidden = true;
      return;
    }
    const c = this.doc.challenge;
    const done = progressOf().includes(c.id);
    const req = (c.requires ?? []).map((r) => `<li>${escapeHtml(r.hint)}</li>`).join('');
    panel.hidden = false;
    panel.innerHTML = `
      <h2>${escapeHtml(c.title)} <span class="badge ${done ? 'ok' : ''}">${done ? 'zaliczone' : 'do zrobienia'}</span></h2>
      <p class="task">${escapeHtml(c.task)}</p>
      ${req ? `<ul class="reqs">${req}</ul>` : ''}
      <div class="dialog-actions left">
        <button type="button" class="btn primary" data-act="check">Sprawdź</button>
        <button type="button" class="btn" data-act="show-reference">Pokaż wzorcowy program</button>
      </div>
      <p class="verdict ${this.verdict ? (this.verdict.passed ? 'pass' : 'fail') : ''}" role="status">${
        this.verdict ? escapeHtml(this.verdict.reason) : ''
      }</p>
      <pre class="reference" data-reference hidden></pre>`;
    panel.querySelectorAll<HTMLButtonElement>('[data-act]').forEach((b) =>
      b.addEventListener('click', () => this.act(b.dataset.act!)),
    );
  }

  private check() {
    if (this.doc.kind !== 'challenge') return;
    const c = this.doc.challenge;
    this.verdict = judge(this.editor.value, c);
    if (this.verdict.passed) markPassed(c.id);
    // Show what the program draws, without animation.
    this.prepare();
    if (this.exec) {
      this.exec.runToEnd();
      this.state = 'done';
      this.render();
      this.fit();
    }
    this.renderChallengePanel();
    this.setStatus(this.verdict.passed ? 'Zadanie zaliczone.' : 'Jeszcze nie. Zobacz uwagi poniżej.');
    this.updateControls();
  }

  private showReference() {
    if (this.doc.kind !== 'challenge') return;
    const ref = this.q('[data-reference]');
    ref.hidden = false;
    ref.textContent = this.doc.challenge.reference;
  }

  /* ---------- external API used by the test hook ---------- */

  /** Loads source as if pasted, runs it to the end and fits the view. */
  async openInstant(source: string, mode: Mode): Promise<{ segments: Segment[]; error: RunError | null }> {
    await this.ready;
    if (this.doc.kind === 'mode' && mode !== this.mode) await this.switchMode(mode);
    this.stopLoop();
    this.writeEditor(source);
    this.checkLive();
    const result = runSource(source, this.mode);
    this.prepare();
    if (this.exec) {
      this.exec.runToEnd();
      this.render();
    }
    this.state = 'done';
    this.fit();
    this.updateControls();
    this.setStatus('Wczytano program.');
    return result;
  }
}

