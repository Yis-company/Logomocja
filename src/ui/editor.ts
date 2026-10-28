import { h } from './dom';
import { highlightHtml } from './highlight';

export interface EditorError {
  message: string;
  line: number;
  column: number;
  /** Błąd sprawdzania na bieżąco (łagodniejszy wygląd) czy z uruchomienia. */
  soft?: boolean;
}

export interface ActiveRange {
  line: number;
  column: number;
  length: number;
}

const INDENT = '  ';

/** Pozycja w źródle dla (wiersz, kolumna) liczonych od 1. */
export function offsetOf(source: string, line: number, column: number): number {
  let offset = 0;
  for (let l = 1; l < line; l++) {
    const nl = source.indexOf('\n', offset);
    if (nl < 0) return source.length;
    offset = nl + 1;
  }
  return Math.min(source.length, offset + column - 1);
}

/** Długość tokenu zaczynającego się w danym miejscu (do podkreślenia błędu). */
function tokenLengthAt(source: string, offset: number): number {
  const rest = source.slice(offset, offset + 200);
  const m = /^(?:"[^"\n]*"?|(?:\d+(?:\.\d+)?|\.\d+)[\p{L}\p{N}_.]*|:?[\p{L}_][\p{L}\p{M}\p{N}_]*:?|<=|>=|<>|\S)/u.exec(rest);
  return m ? m[0].length : 1;
}

/**
 * Edytor kodu: zwykłe pole tekstowe z nałożoną warstwą kolorowania składni,
 * numeracją wierszy, znacznikiem błędu i podświetleniem wykonywanego wiersza.
 */
export class CodeEditor {
  readonly root: HTMLElement;
  readonly textarea: HTMLTextAreaElement;
  private readonly pre: HTMLElement;
  private readonly layer: HTMLElement;
  private readonly gutter: HTMLElement;
  private readonly gutterInner: HTMLElement;
  private readonly activeLine: HTMLElement;
  private readonly bubble: HTMLElement;
  private error: EditorError | null = null;
  private active: ActiveRange | null = null;
  private escapeTab = false;
  private changeHandlers: ((value: string) => void)[] = [];
  private renderQueued = false;

  constructor(opts: { label: string; id: string }) {
    this.textarea = h('textarea', {
      id: opts.id,
      class: 'ed-input',
      spellcheck: 'false',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      wrap: 'off',
      'aria-label': opts.label,
      'aria-describedby': `${opts.id}-help`,
      'aria-multiline': 'true',
    });
    this.pre = h('pre', { class: 'ed-hl', 'aria-hidden': 'true' });
    this.activeLine = h('div', { class: 'ed-active', hidden: true, 'aria-hidden': 'true' });
    this.bubble = h('div', { class: 'ed-bubble', hidden: true, role: 'presentation' });
    this.layer = h('div', { class: 'ed-layer' }, this.activeLine, this.pre, this.bubble);
    this.gutterInner = h('div', { class: 'ed-gutter-inner' });
    this.gutter = h('div', { class: 'ed-gutter', 'aria-hidden': 'true' }, this.gutterInner);
    this.root = h(
      'div',
      { class: 'editor' },
      this.gutter,
      h('div', { class: 'ed-code' }, this.layer, this.textarea),
      h(
        'p',
        { id: `${opts.id}-help`, class: 'sr-only' },
        'Klawisz Tab wcina wiersz. Aby wyjść z edytora klawiaturą, naciśnij Escape, a potem Tab.',
      ),
    );

    this.textarea.addEventListener('input', () => {
      this.render();
      for (const fn of this.changeHandlers) fn(this.textarea.value);
    });
    this.textarea.addEventListener('scroll', () => this.syncScroll());
    this.textarea.addEventListener('keydown', (e) => this.onKey(e));
    this.textarea.addEventListener('blur', () => (this.escapeTab = false));
    this.render();
  }

  get value(): string {
    return this.textarea.value;
  }

  set value(text: string) {
    this.textarea.value = text;
    this.render();
    this.syncScroll();
  }

  onChange(fn: (value: string) => void): void {
    this.changeHandlers.push(fn);
  }

  focus(): void {
    this.textarea.focus();
  }

  setError(err: EditorError | null): void {
    this.error = err;
    this.scheduleRender();
  }

  getError(): EditorError | null {
    return this.error;
  }

  setActive(range: ActiveRange | null): void {
    const same =
      range === this.active ||
      (range && this.active && range.line === this.active.line && range.column === this.active.column && range.length === this.active.length);
    if (same) return;
    this.active = range;
    this.renderActive();
  }

  /** Przesuwa kursor do miejsca w programie i przewija do niego. */
  goTo(line: number, column: number): void {
    const off = offsetOf(this.value, line, column);
    this.textarea.focus();
    this.textarea.setSelectionRange(off, off);
    this.scrollIntoView(line, column);
  }

  private scheduleRender(): void {
    if (this.renderQueued) return;
    this.renderQueued = true;
    queueMicrotask(() => {
      this.renderQueued = false;
      this.render();
    });
  }

  private lineHeight(): number {
    return parseFloat(getComputedStyle(this.textarea).lineHeight) || 22;
  }

  private charWidth(): number {
    const probe = h('span', { class: 'ed-probe' }, 'MMMMMMMMMM');
    this.layer.append(probe);
    const w = probe.getBoundingClientRect().width / 10 || 8.4;
    probe.remove();
    return w;
  }

  private padding(): { top: number; left: number } {
    const cs = getComputedStyle(this.textarea);
    return { top: parseFloat(cs.paddingTop) || 0, left: parseFloat(cs.paddingLeft) || 0 };
  }

  private render(): void {
    const src = this.textarea.value;
    let mark: { start: number; end: number } | null = null;
    if (this.error) {
      const start = offsetOf(src, this.error.line, this.error.column);
      mark = { start, end: start + tokenLengthAt(src, start) };
    }
    this.pre.innerHTML = highlightHtml(src, mark);
    this.pre.classList.toggle('soft', !!this.error?.soft);

    const lines = src.split('\n').length;
    let html = '';
    for (let i = 1; i <= lines; i++) {
      const cls = this.error && this.error.line === i ? (this.error.soft ? 'ln err soft' : 'ln err') : 'ln';
      html += `<div class="${cls}">${i}</div>`;
    }
    this.gutterInner.innerHTML = html;
    this.renderBubble();
    this.renderActive();
  }

  private renderBubble(): void {
    const err = this.error;
    if (!err) {
      this.bubble.hidden = true;
      return;
    }
    const lh = this.lineHeight();
    const pad = this.padding();
    const cw = this.charWidth();
    const lineText = this.textarea.value.split('\n')[err.line - 1] ?? '';
    const endLeft = pad.left + (lineText.trimEnd().length + 3) * cw;
    const room = this.textarea.clientWidth + this.textarea.scrollLeft - endLeft;
    this.bubble.hidden = false;
    this.bubble.textContent = err.message;
    if (room > 220) {
      // na końcu błędnego wiersza — nie zasłania kodu
      this.bubble.className = `ed-bubble inline${err.soft ? ' soft' : ''}`;
      this.bubble.style.top = `${pad.top + (err.line - 1) * lh}px`;
      this.bubble.style.left = `${endLeft}px`;
      this.bubble.style.maxWidth = `${Math.floor(room - 12)}px`;
    } else {
      this.bubble.className = `ed-bubble${err.soft ? ' soft' : ''}`;
      this.bubble.style.top = `${pad.top + err.line * lh + 2}px`;
      this.bubble.style.left = `${Math.max(4, pad.left + (err.column - 1) * cw - 10)}px`;
      this.bubble.style.maxWidth = '';
    }
  }

  private renderActive(): void {
    const a = this.active;
    const lines = this.gutterInner.children;
    for (const el of Array.from(this.gutterInner.querySelectorAll('.ln.cur'))) el.classList.remove('cur');
    if (!a) {
      this.activeLine.hidden = true;
      return;
    }
    const lh = this.lineHeight();
    const pad = this.padding();
    const cw = this.charWidth();
    this.activeLine.hidden = false;
    this.activeLine.style.top = `${pad.top + (a.line - 1) * lh}px`;
    this.activeLine.style.height = `${lh}px`;
    this.activeLine.style.setProperty('--tok-left', `${pad.left + (a.column - 1) * cw}px`);
    this.activeLine.style.setProperty('--tok-width', `${Math.max(1, a.length) * cw}px`);
    lines[a.line - 1]?.classList.add('cur');
    this.scrollIntoView(a.line, a.column);
  }

  private scrollIntoView(line: number, column: number): void {
    const ta = this.textarea;
    const lh = this.lineHeight();
    const pad = this.padding();
    const top = pad.top + (line - 1) * lh;
    if (top < ta.scrollTop + lh) ta.scrollTop = Math.max(0, top - lh * 2);
    else if (top + lh > ta.scrollTop + ta.clientHeight - lh) ta.scrollTop = top - ta.clientHeight + lh * 3;
    const left = pad.left + (column - 1) * this.charWidth();
    if (left < ta.scrollLeft) ta.scrollLeft = Math.max(0, left - 40);
    else if (left > ta.scrollLeft + ta.clientWidth - 40) ta.scrollLeft = left - ta.clientWidth + 80;
    this.syncScroll();
  }

  private syncScroll(): void {
    const { scrollTop, scrollLeft } = this.textarea;
    this.layer.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    this.gutterInner.style.transform = `translateY(${-scrollTop}px)`;
  }

  private insert(text: string, selStart: number, selEnd: number): void {
    const ta = this.textarea;
    ta.setSelectionRange(selStart, selEnd);
    // execCommand zachowuje historię cofania (Ctrl+Z); gdy go brak — setRangeText.
    const ok = typeof document.execCommand === 'function' && document.execCommand('insertText', false, text);
    if (!ok) {
      ta.setRangeText(text, selStart, selEnd, 'end');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  private onKey(e: KeyboardEvent): void {
    const ta = this.textarea;
    if (e.key === 'Escape') {
      this.escapeTab = true;
      return;
    }
    if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (this.escapeTab) {
        this.escapeTab = false;
        return; // domyślne przejście fokusu
      }
      e.preventDefault();
      const v = ta.value;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      const lineStart = v.lastIndexOf('\n', s - 1) + 1;
      if (s === en && !e.shiftKey) {
        this.insert(INDENT, s, en);
        return;
      }
      // Wcięcie lub cofnięcie wcięcia zaznaczonych wierszy.
      const lineEnd = v.indexOf('\n', en - (en > s && v[en - 1] === '\n' ? 1 : 0));
      const blockEnd = lineEnd < 0 ? v.length : lineEnd;
      const block = v.slice(lineStart, blockEnd);
      const lines = block.split('\n');
      const changed = e.shiftKey
        ? lines.map((l) => l.replace(/^( {1,2}|\t)/, ''))
        : lines.map((l) => INDENT + l);
      const text = changed.join('\n');
      this.insert(text, lineStart, blockEnd);
      ta.setSelectionRange(lineStart, lineStart + text.length);
      return;
    }
    this.escapeTab = false;
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      const v = ta.value;
      const s = ta.selectionStart;
      const lineStart = v.lastIndexOf('\n', s - 1) + 1;
      const indent = /^[ \t]*/.exec(v.slice(lineStart, s))![0];
      const before = v.slice(lineStart, s).trimEnd();
      const extra = before.endsWith('[') ? INDENT : '';
      if (indent || extra) {
        e.preventDefault();
        this.insert('\n' + indent + extra, s, ta.selectionEnd);
      }
    }
  }
}
