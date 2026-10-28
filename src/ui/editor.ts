import { h } from './dom';
import { escapeHtml, highlight, runsToHtml, type Run } from './highlight';

export interface ErrorMark {
  line: number;
  column: number;
  length: number;
  message: string;
  /** `parse` — błąd wykryty przed rysowaniem; `run` — w trakcie wykonania. */
  phase?: 'parse' | 'run';
}

export interface EditorOptions {
  ariaLabel: string;
  placeholder?: string;
  onInput?: (text: string) => void;
  onCaret?: (line: number, column: number) => void;
}

/** Edytor: textarea z nałożoną warstwą podświetlania, numerami wierszy i znacznikami. */
export class Editor {
  readonly el: HTMLElement;
  readonly textarea: HTMLTextAreaElement;
  private scroller: HTMLElement;
  private overlay: HTMLElement;
  private gutter: HTMLElement;
  private error: ErrorMark | null = null;
  private activeLine: number | null = null;
  private lines: Run[][] = [];
  private raf = 0;
  private lastText = '';
  private metrics: { lh: number; cw: number; padTop: number; padLeft: number } | null = null;
  private pendingReveal = false;
  private ro: ResizeObserver | null = null;

  constructor(private opts: EditorOptions) {
    this.textarea = h('textarea', {
      class: 'editor-input',
      spellcheck: 'false',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      wrap: 'off',
      'aria-label': opts.ariaLabel,
      placeholder: opts.placeholder ?? '',
      rows: 1,
    });
    this.overlay = h('pre', { class: 'editor-overlay', 'aria-hidden': 'true' });
    this.gutter = h('div', { class: 'editor-gutter', 'aria-hidden': 'true' });
    const wrap = h('div', { class: 'editor-code' }, this.overlay, this.textarea);
    this.scroller = h('div', { class: 'editor-scroll' }, h('div', { class: 'editor-inner' }, this.gutter, wrap));
    this.el = h('div', { class: 'editor' }, this.scroller);

    this.textarea.addEventListener('input', () => {
      this.refresh(true);
      opts.onInput?.(this.textarea.value);
    });
    this.textarea.addEventListener('scroll', () => {
      this.textarea.scrollTop = 0;
      this.textarea.scrollLeft = 0;
    });
    const caret = () => this.reportCaret();
    this.textarea.addEventListener('keyup', caret);
    this.textarea.addEventListener('click', caret);
    this.textarea.addEventListener('focus', caret);
    this.textarea.addEventListener('keydown', (e) => {
      if (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End' || e.key === 'PageUp' || e.key === 'PageDown') {
        requestAnimationFrame(() => this.revealCaret());
      }
    });
    // Kliknięcie w pusty obszar edytora ustawia fokus w polu tekstowym.
    this.scroller.addEventListener('mousedown', (e) => {
      if (e.target === this.scroller || (e.target as HTMLElement).classList?.contains('editor-inner')) {
        e.preventDefault();
        this.textarea.focus();
      }
    });
    this.dirtyText = true;
    this.render();
    if (typeof ResizeObserver === 'function') {
      this.ro = new ResizeObserver(() => {
        this.metrics = null;
      });
      this.ro.observe(this.el);
    }
    void document.fonts?.ready?.then(() => {
      this.metrics = null;
    });
  }

  get value(): string {
    return this.textarea.value;
  }

  setValue(text: string, silent = true): void {
    this.textarea.value = text;
    this.dirtyText = true;
    this.render();
    this.scroller.scrollTop = 0;
    this.scroller.scrollLeft = 0;
    if (!silent) this.opts.onInput?.(text);
  }

  focus(): void {
    this.textarea.focus({ preventScroll: true });
  }

  setError(err: ErrorMark | null): void {
    this.error = err;
    this.scheduleRender();
  }

  setActiveLine(line: number | null, reveal = true): void {
    if (this.activeLine === line) return;
    this.activeLine = line;
    this.scheduleRender();
    if (line !== null && reveal) this.revealLine(line);
  }

  setReadOnly(ro: boolean): void {
    this.textarea.readOnly = ro;
  }

  /** Zaznacza błędny fragment i przenosi do niego fokus. */
  selectError(): void {
    const e = this.error;
    if (!e) return;
    const starts = this.lineStarts();
    const ls = starts[e.line - 1] ?? 0;
    const from = ls + e.column - 1;
    this.textarea.focus({ preventScroll: true });
    this.textarea.setSelectionRange(from, from + Math.max(1, e.length));
    this.revealLine(e.line);
    this.revealCaret();
  }

  // ----- wnętrze --------------------------------------------------------

  private lineStarts(): number[] {
    const text = this.textarea.value;
    const starts = [0];
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      if (c === 10) starts.push(i + 1);
      else if (c === 13) {
        if (text.charCodeAt(i + 1) === 10) i++;
        starts.push(i + 1);
      }
    }
    return starts;
  }

  private reportCaret(): void {
    if (!this.opts.onCaret) return;
    const pos = this.textarea.selectionStart;
    const starts = this.lineStarts();
    let line = 0;
    while (line + 1 < starts.length && starts[line + 1]! <= pos) line++;
    this.opts.onCaret(line + 1, pos - starts[line]! + 1);
  }

  private measure(): { lh: number; cw: number; padTop: number; padLeft: number } {
    if (this.metrics) return this.metrics;
    const cs = getComputedStyle(this.textarea);
    const lh = parseFloat(cs.lineHeight) || 22;
    const probe = h('span', { class: 'editor-probe' }, '0000000000');
    this.overlay.appendChild(probe);
    const cw = probe.getBoundingClientRect().width / 10 || 8;
    probe.remove();
    this.metrics = { lh, cw, padTop: parseFloat(cs.paddingTop) || 0, padLeft: parseFloat(cs.paddingLeft) || 0 };
    return this.metrics;
  }

  private revealLine(line: number): void {
    const { lh, padTop } = this.measure();
    const top = padTop + (line - 1) * lh;
    const view = this.scroller.clientHeight;
    const st = this.scroller.scrollTop;
    if (top < st + lh) this.scroller.scrollTop = Math.max(0, top - lh * 2);
    else if (top + lh * 2 > st + view) this.scroller.scrollTop = top + lh * 3 - view;
  }

  /** Zapewnia widoczność karetki (przy dopisywaniu na końcu długich wierszy lub dokumentu). */
  private revealCaret(): void {
    if (document.activeElement !== this.textarea) return;
    const pos = this.textarea.selectionStart;
    const starts = this.lineStarts();
    let line = 0;
    while (line + 1 < starts.length && starts[line + 1]! <= pos) line++;
    const col = pos - starts[line]!;
    const { lh, cw, padTop, padLeft } = this.measure();
    const gutterW = this.gutter.offsetWidth;
    const top = padTop + line * lh;
    const left = gutterW + padLeft + col * cw;
    const s = this.scroller;
    if (top < s.scrollTop) s.scrollTop = top;
    else if (top + lh + 4 > s.scrollTop + s.clientHeight) s.scrollTop = top + lh + 4 - s.clientHeight;
    if (left - gutterW < s.scrollLeft) s.scrollLeft = Math.max(0, left - gutterW - 30);
    else if (left + cw * 2 > s.scrollLeft + s.clientWidth) s.scrollLeft = left + cw * 4 - s.clientWidth;
  }

  private scheduleRender(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.render();
      if (this.pendingReveal) {
        this.pendingReveal = false;
        this.revealCaret();
      }
    });
  }

  private dirtyText = true;

  /** Przelicza podświetlenie po zmianie tekstu (scalane do jednej klatki animacji). */
  private refresh(revealCaret = false): void {
    this.dirtyText = true;
    if (revealCaret) this.pendingReveal = true;
    this.scheduleRender();
  }

  private render(): void {
    if (this.dirtyText) {
      this.dirtyText = false;
      const text = this.textarea.value;
      this.lastText = text;
      this.lines = highlight(text);
    }
    const e = this.error;
    const parts: string[] = [];
    const nums: string[] = [];
    for (let i = 0; i < this.lines.length; i++) {
      const lineNo = i + 1;
      const isErr = !!e && e.line === lineNo;
      const isActive = this.activeLine === lineNo;
      let html: string;
      if (isErr && e) html = runsToHtml(markRuns(this.lines[i]!, e.column - 1, e.column - 1 + Math.max(1, e.length)));
      else html = runsToHtml(this.lines[i]!);
      let msg = '';
      if (isErr && e) {
        const m = e.message.length > 120 ? e.message.slice(0, 119) + '…' : e.message;
        msg = `<span class="ln-msg" data-phase="${e.phase ?? 'parse'}">${escapeHtml(m)}</span>`;
      }
      parts.push(`<div class="ln${isActive ? ' ln-active' : ''}${isErr ? ' ln-err' : ''}">${html}${msg}</div>`);
      nums.push(`<div class="gl${isActive ? ' gl-active' : ''}${isErr ? ' gl-err' : ''}">${lineNo}</div>`);
    }
    this.overlay.innerHTML = parts.join('');
    this.gutter.innerHTML = nums.join('');
    this.gutter.style.setProperty('--digits', String(String(this.lines.length).length));
  }

  dispose(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
  }

  get text(): string {
    return this.lastText;
  }
}

/** Zaznacza zakres kolumn [from, to) w wierszu fragmentów. */
function markRuns(runs: Run[], from: number, to: number): Run[] {
  const out: Run[] = [];
  let pos = 0;
  for (const r of runs) {
    const s = pos;
    const e = pos + r.text.length;
    pos = e;
    if (e <= from || s >= to) {
      out.push(r);
      continue;
    }
    const a = Math.max(from, s) - s;
    const b = Math.min(to, e) - s;
    if (a > 0) out.push({ ...r, text: r.text.slice(0, a) });
    out.push({ ...r, text: r.text.slice(a, b), cls: `${r.cls} mk-err`.trim() });
    if (b < r.text.length) out.push({ ...r, text: r.text.slice(b) });
  }
  // Błąd poza końcem wiersza (np. brak argumentu na końcu): pokaż znacznik na końcu.
  if (from >= pos) out.push({ text: ' ', cls: 'mk-err' });
  return out;
}
