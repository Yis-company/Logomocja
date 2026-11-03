import { highlightHTML } from './highlight';
import type { ErrorInfo } from '../lang/errors';

/** Przesunięcie w tekście dla wiersza i kolumny (kolumny w punktach kodowych, od 1). */
export function offsetOf(src: string, line: number, col: number): number {
  let off = 0;
  for (let l = 1; l < line; l++) {
    const nl = src.indexOf('\n', off);
    if (nl < 0) return src.length;
    off = nl + 1;
  }
  const rest = Array.from(src.slice(off).split('\n')[0]);
  return off + rest.slice(0, col - 1).join('').length;
}

const lineCount = (s: string) => {
  let n = 1;
  for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) === 10) n++;
  return n;
};

/**
 * Edytor: pole tekstowe z nakładką kolorującą składnię, numerami wierszy,
 * znacznikiem błędu w wierszu i podświetleniem wykonywanego wiersza.
 */
export class Editor {
  readonly root: HTMLElement;
  readonly textarea: HTMLTextAreaElement;
  private gutter: HTMLElement;
  private text: HTMLElement;
  private bands: HTMLElement;
  private lens: HTMLElement;
  private execBand: HTMLElement;
  private errBand: HTMLElement;
  private error: ErrorInfo | null = null;
  private execLine: number | null = null;
  private prev = '';
  private pending = false;
  private listeners: ((v: string) => void)[] = [];

  constructor(label: string) {
    this.root = document.createElement('div');
    this.root.className = 'editor';
    this.root.innerHTML = `
      <div class="ed-gutter" aria-hidden="true"><pre class="ed-nums"></pre></div>
      <div class="ed-body">
        <div class="ed-bands" aria-hidden="true"><div class="ed-band ed-band-exec" hidden></div><div class="ed-band ed-band-err" hidden></div></div>
        <pre class="ed-text" aria-hidden="true"></pre>
        <textarea class="ed-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea>
        <div class="ed-lens" aria-hidden="true" hidden></div>
      </div>`;
    this.gutter = this.root.querySelector('.ed-nums')!;
    this.text = this.root.querySelector('.ed-text')!;
    this.bands = this.root.querySelector('.ed-bands')!;
    this.execBand = this.root.querySelector('.ed-band-exec')!;
    this.errBand = this.root.querySelector('.ed-band-err')!;
    this.lens = this.root.querySelector('.ed-lens')!;
    this.textarea = this.root.querySelector('textarea')!;
    this.textarea.setAttribute('aria-label', label);
    this.textarea.addEventListener('input', () => this.onInput());
    this.textarea.addEventListener('scroll', () => this.syncScroll());
    this.textarea.addEventListener('keydown', (e) => this.onKey(e));
    this.render();
  }

  get value() {
    return this.textarea.value;
  }

  /** Wstawia nowy tekst (np. przykład); historia cofania pola zaczyna się od nowa. */
  setValue(v: string) {
    this.textarea.value = v;
    this.prev = v;
    this.error = null;
    this.execLine = null;
    this.textarea.scrollTop = 0;
    this.textarea.scrollLeft = 0;
    this.render();
  }

  onChange(fn: (v: string) => void) {
    this.listeners.push(fn);
  }

  setError(err: ErrorInfo | null) {
    this.error = err;
    this.render();
  }

  setExecLine(line: number | null) {
    if (line === this.execLine) return;
    this.execLine = line;
    this.renderBands();
    if (line !== null) this.revealLine(line);
  }

  focusAt(line: number, col: number) {
    const off = offsetOf(this.value, line, col);
    this.textarea.focus();
    this.textarea.setSelectionRange(off, off);
    this.revealLine(line);
  }

  private chw = 0;
  private charWidth() {
    if (!this.chw) {
      const probe = document.createElement('span');
      probe.textContent = '0000000000';
      probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
      this.text.append(probe);
      this.chw = probe.getBoundingClientRect().width / 10 || 8.4;
      probe.remove();
      if (document.fonts) document.fonts.ready.then(() => { this.chw = 0; });
    }
    return this.chw;
  }

  private lineHeight() {
    return parseFloat(getComputedStyle(this.textarea).lineHeight) || 22;
  }

  private padTop() {
    return parseFloat(getComputedStyle(this.textarea).paddingTop) || 0;
  }

  private revealLine(line: number) {
    const lh = this.lineHeight();
    const top = this.padTop() + (line - 1) * lh;
    const ta = this.textarea;
    if (top < ta.scrollTop + lh) ta.scrollTop = Math.max(0, top - lh * 2);
    else if (top + lh > ta.scrollTop + ta.clientHeight - lh) ta.scrollTop = top - ta.clientHeight + lh * 3;
  }

  private onKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      // Nowy wiersz z tym samym wcięciem; po „[” na końcu wiersza o dwie spacje głębiej.
      const ta = this.textarea;
      const before = ta.value.slice(0, ta.selectionStart);
      const lineStart = before.lastIndexOf('\n') + 1;
      const line = before.slice(lineStart);
      let indent = /^[ \t]*/.exec(line)![0];
      if (/\[\s*$/.test(line)) indent += '  ';
      e.preventDefault();
      if (!document.execCommand('insertText', false, '\n' + indent)) {
        ta.setRangeText('\n' + indent, ta.selectionStart, ta.selectionEnd, 'end');
        this.onInput();
      }
    }
  }

  private onInput() {
    const v = this.textarea.value;
    this.trackError(this.prev, v);
    this.prev = v;
    this.render();
    for (const fn of this.listeners) fn(v);
  }

  /** Znacznik błędu trwa, dopóki wiersz z błędem nie zostanie zmieniony; przesuwa się z tekstem. */
  private trackError(oldV: string, newV: string) {
    if (!this.error) return;
    let p = 0;
    const max = Math.min(oldV.length, newV.length);
    while (p < max && oldV[p] === newV[p]) p++;
    let s = 0;
    while (s < max - p && oldV[oldV.length - 1 - s] === newV[newV.length - 1 - s]) s++;
    const startLine = lineCount(oldV.slice(0, p));
    const endLine = lineCount(oldV.slice(0, oldV.length - s));
    const line = this.error.line;
    if (line >= startLine && line <= endLine) {
      this.error = null;
    } else if (line > endLine) {
      const delta = lineCount(newV.slice(p, newV.length - s)) - lineCount(oldV.slice(p, oldV.length - s));
      this.error = { ...this.error, line: line + delta };
    }
  }

  private render() {
    if (this.pending) return;
    this.pending = true;
    queueMicrotask(() => {
      this.pending = false;
      this.paint();
    });
  }

  private paint() {
    const v = this.textarea.value;
    const n = lineCount(v);
    let nums = '';
    for (let i = 1; i <= n; i++) nums += i + '\n';
    this.gutter.textContent = nums;
    const err = this.error;
    const errOff = err ? offsetOf(v, err.line, err.column) : -1;
    // Końcowy znak nowego wiersza, żeby nakładka miała tyle wierszy co pole.
    this.text.innerHTML = highlightHTML(v, errOff) + '\n';
    this.root.classList.toggle('has-error', !!err);
    if (err) {
      const lineText = v.split('\n')[err.line - 1] ?? '';
      const len = Array.from(lineText.replace(/\t/g, '  ')).length;
      this.lens.hidden = false;
      this.lens.textContent = err.message;
      this.lens.style.setProperty('--line', String(err.line - 1));
      this.lens.style.setProperty('--len', String(len));
      // Komunikat mieści się w widocznej szerokości; całość i tak widać w pasku stanu.
      const ch = this.charWidth();
      const left = (parseFloat(getComputedStyle(this.textarea).paddingLeft) || 14) + (len + 2) * ch;
      const room = this.textarea.clientWidth - left - 8;
      this.lens.style.maxWidth = Math.max(room, 120) + 'px';
      this.lens.style.display = room < 60 ? 'none' : '';
      this.root.querySelectorAll('.ed-gutter').forEach((g) => g.setAttribute('data-err', String(err.line)));
    } else {
      this.lens.hidden = true;
    }
    this.renderBands();
    this.syncScroll();
  }

  private renderBands() {
    const set = (el: HTMLElement, line: number | null) => {
      el.hidden = line === null;
      if (line !== null) el.style.setProperty('--line', String(line - 1));
    };
    set(this.execBand, this.execLine);
    set(this.errBand, this.error ? this.error.line : null);
    const nums = this.gutter;
    nums.dataset.exec = this.execLine ? String(this.execLine) : '';
    nums.style.setProperty('--exec', this.execLine ? String(this.execLine - 1) : '-10');
    nums.style.setProperty('--err', this.error ? String(this.error.line - 1) : '-10');
  }

  private syncScroll() {
    const { scrollTop, scrollLeft } = this.textarea;
    this.text.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    this.lens.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    this.bands.style.transform = `translateY(${-scrollTop}px)`;
    this.gutter.style.transform = `translateY(${-scrollTop}px)`;
  }
}
