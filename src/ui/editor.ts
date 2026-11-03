// Code editor: a textarea over a highlighted <pre>, sized by the <pre> so no scroll syncing is needed.
import { KEYWORDS } from '../lang/parser';
import { normName } from '../lang/lexer';

export interface EditorError { message: string; line: number; column: number }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const RE = /(;[^\n]*)|("[^"\n]*"?)|(:?[\p{L}_][\p{L}\p{M}\p{N}_]*:?)|((?:\d+(?:\.\d*)?|\.\d+)[\p{L}\p{N}_.]*)|([[\]])|([()])|(<=|>=|<>|[<>=+\-*/,])|(\n)|([^\s])/gu;

/** Highlight source into HTML. Wraps the error token, if any, in a marker span. */
export function highlight(src: string, error: EditorError | null): string {
  let out = '';
  let line = 1;
  let lineStart = 0;
  let last = 0;
  RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = RE.exec(src))) {
    out += esc(src.slice(last, m.index));
    last = m.index + m[0].length;
    const text = m[0];
    if (m[8]) { out += '\n'; line++; lineStart = last; continue; }
    let cls = 'x';
    let style = '';
    if (m[1]) cls = 'c';
    else if (m[2]) {
      cls = 's';
      const hex = /^"#([0-9a-fA-F]{6})"$/.exec(text);
      if (hex) style = ` style="--sw:#${hex[1]}"`;
      else cls = 's bad';
    } else if (m[3]) {
      const w = normName(text.replace(/^:|:$/g, ''));
      const kw = text.startsWith(':') ? undefined : KEYWORDS[w];
      if (text === 'ma:' || normName(text) === 'ma:') cls = 'k2';
      else if (kw === 'def' || kw === 'end') cls = 'k2';
      else if (kw === 'rep') cls = 'v';
      else if (kw) cls = 'k';
      else cls = 'n';
    } else if (m[4]) cls = 'num';
    else if (m[5]) cls = 'b';
    else if (m[6]) cls = 'p';
    else if (m[7]) cls = 'o';
    const col = m.index - lineStart + 1;
    const isErr = error && error.line === line && error.column === col;
    out += `<span class="t-${cls.replace(' ', ' t-')}${isErr ? ' t-err' : ''}"${style}>${esc(text)}</span>`;
  }
  out += esc(src.slice(last));
  return out;
}

export class Editor {
  root: HTMLElement;
  ta: HTMLTextAreaElement;
  private pre: HTMLElement;
  private gutter: HTMLElement;
  private band: HTMLElement;
  private bubble: HTMLElement;
  private scroller: HTMLElement;
  private error: EditorError | null = null;
  private execLine = 0;
  onInput: (value: string) => void = () => {};
  onKey: (e: KeyboardEvent) => boolean = () => false;

  constructor(label: string, id: string) {
    this.root = document.createElement('div');
    this.root.className = 'editor';
    this.root.innerHTML = `
      <div class="ed-scroll">
        <div class="ed-gutter" aria-hidden="true"></div>
        <div class="ed-code">
          <div class="ed-band" hidden></div>
          <pre class="ed-hl" aria-hidden="true"></pre>
          <textarea id="${id}" class="ed-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="${label}" aria-describedby="${id}-help"></textarea>
          <div class="ed-bubble" role="alert" hidden></div>
        </div>
      </div>
      <p id="${id}-help" class="sr-only">Tab wstawia wcięcie. Aby wyjść z edytora klawiaturą, naciśnij Escape, a potem Tab.</p>`;
    this.scroller = this.root.querySelector('.ed-scroll')!;
    this.gutter = this.root.querySelector('.ed-gutter')!;
    this.pre = this.root.querySelector('.ed-hl')!;
    this.ta = this.root.querySelector('textarea')!;
    this.band = this.root.querySelector('.ed-band')!;
    this.bubble = this.root.querySelector('.ed-bubble')!;
    let tabEscapes = false;
    this.ta.addEventListener('input', () => {
      this.error = null;
      this.render();
      this.onInput(this.ta.value);
    });
    this.ta.addEventListener('keydown', (e) => {
      if (this.onKey(e)) return;
      if (e.key === 'Escape') { tabEscapes = true; return; }
      if (e.key === 'Tab' && !tabEscapes && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        this.indent(e.shiftKey);
        return;
      }
      if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const { selectionStart: s, value } = this.ta;
        const ls = value.lastIndexOf('\n', s - 1) + 1;
        const ind = /^[ \t]*/.exec(value.slice(ls))![0];
        const extra = /\[\s*$/.test(value.slice(ls, s)) ? '  ' : '';
        document.execCommand('insertText', false, '\n' + ind + extra);
      }
      if (e.key !== 'Tab' && e.key !== 'Shift') tabEscapes = false;
    });
    this.ta.addEventListener('blur', () => { tabEscapes = false; });
    this.ta.addEventListener('keyup', () => this.revealCaret());
    this.ta.addEventListener('click', () => this.revealCaret());
    this.render();
  }

  private indent(out: boolean) {
    const { selectionStart: s, selectionEnd: e, value } = this.ta;
    if (!out && s === e) { document.execCommand('insertText', false, '  '); return; }
    const ls = value.lastIndexOf('\n', s - 1) + 1;
    const block = value.slice(ls, e);
    const changed = out ? block.replace(/^ {1,2}/gm, '') : block.replace(/^/gm, '  ');
    this.ta.setSelectionRange(ls, e);
    document.execCommand('insertText', false, changed);
    this.ta.setSelectionRange(ls, ls + changed.length);
  }

  get value() { return this.ta.value; }

  set value(v: string) {
    this.ta.value = v;
    this.error = null;
    this.execLine = 0;
    this.render();
  }

  setError(e: EditorError | null) {
    this.error = e;
    this.render();
    if (e) this.revealLine(e.line);
  }

  setExecLine(line: number) {
    if (line === this.execLine) return;
    this.execLine = line;
    this.placeBand();
    if (line) this.revealLine(line);
  }

  focusError() {
    if (!this.error) return;
    const lines = this.ta.value.split('\n');
    let idx = 0;
    for (let i = 0; i < this.error.line - 1 && i < lines.length; i++) idx += lines[i].length + 1;
    idx += this.error.column - 1;
    this.ta.focus();
    this.ta.setSelectionRange(idx, idx);
    this.revealLine(this.error.line);
  }

  private lineHeight() {
    return parseFloat(getComputedStyle(this.pre).lineHeight) || 21;
  }

  private padTop() {
    return parseFloat(getComputedStyle(this.pre).paddingTop) || 0;
  }

  private revealLine(line: number) {
    const lh = this.lineHeight();
    const top = this.padTop() + (line - 1) * lh;
    const s = this.scroller;
    if (top < s.scrollTop || top + lh * 2 > s.scrollTop + s.clientHeight) {
      s.scrollTop = Math.max(0, top - s.clientHeight / 3);
    }
  }

  private revealCaret() {
    const before = this.ta.value.slice(0, this.ta.selectionStart);
    const line = before.split('\n').length;
    const col = before.length - before.lastIndexOf('\n') - 1;
    const lh = this.lineHeight();
    const top = this.padTop() + (line - 1) * lh;
    const s = this.scroller;
    if (top < s.scrollTop) s.scrollTop = top;
    else if (top + lh > s.scrollTop + s.clientHeight) s.scrollTop = top + lh - s.clientHeight + 8;
    const chW = lh * 0.42;
    const x = col * chW + 56;
    if (x > s.scrollLeft + s.clientWidth - 24) s.scrollLeft = x - s.clientWidth + 48;
    else if (x < s.scrollLeft + 56) s.scrollLeft = Math.max(0, x - 80);
  }

  private placeBand() {
    if (!this.execLine) { this.band.hidden = true; return; }
    this.band.hidden = false;
    this.band.style.top = `${this.padTop() + (this.execLine - 1) * this.lineHeight()}px`;
    this.band.style.height = `${this.lineHeight()}px`;
  }

  render() {
    const v = this.ta.value;
    this.pre.innerHTML = highlight(v, this.error) + '\n';
    const n = v.split('\n').length;
    let g = '';
    for (let i = 1; i <= n; i++) g += `<span${this.error?.line === i ? ' class="g-err"' : ''}>${i}</span>`;
    this.gutter.innerHTML = g;
    this.placeBand();
    if (this.error) {
      const lh = this.lineHeight();
      this.bubble.hidden = false;
      this.bubble.textContent = this.error.message;
      this.bubble.style.top = `${this.padTop() + this.error.line * lh + 2}px`;
      this.bubble.style.setProperty('--col', String(Math.max(0, this.error.column - 1)));
    } else {
      this.bubble.hidden = true;
    }
  }
}
