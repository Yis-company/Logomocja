import { h } from './dom';
import { COMMANDS, DEF_WORDS, END_WORDS, REP_WORDS, norm } from '../lang/keywords';
import type { LogoError } from '../lang/types';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CONTROL = new Set(['repeat', 'let', 'if', 'ifelse', 'stop']);
const TOKEN_RE = /(;[^\n]*)|("[^"\n]*"?)|(\d+\.\d+|\d+|\.\d+)|(:?[\p{L}_][\p{L}\p{M}\p{N}_]*)|([\[\]])|([()])|(<=|>=|<>|[<>=+\-*/,:])|(\s+)|([\s\S])/gu;

interface Item { text: string; cls: string }

function procNames(src: string): Set<string> {
  const names = new Set<string>();
  const re = /^[ \t]*(?:oto|to)[ \t]+([\p{L}_][\p{L}\p{M}\p{N}_]*)/gimu;
  for (let m = re.exec(src); m; m = re.exec(src)) names.add(norm(m[1]));
  return names;
}

function classify(word: string, procs: Set<string>, prevWord: string): string {
  const raw = word.startsWith(':') ? word.slice(1) : word;
  const n = norm(raw);
  if (word.startsWith(':')) return 'tk-name';
  if (DEF_WORDS.has(n) || END_WORDS.has(n)) return 'tk-def';
  if (REP_WORDS.has(n)) return 'tk-builtin';
  const cmd = COMMANDS.get(n);
  if (cmd) return CONTROL.has(cmd) ? 'tk-kw' : 'tk-cmd';
  if (procs.has(n)) return prevWord === 'oto' || prevWord === 'to' ? 'tk-def-name' : 'tk-proc';
  return 'tk-name';
}

/** Splits one line into classified items. */
function lineItems(line: string, procs: Set<string>): Item[] {
  const items: Item[] = [];
  let prev = '';
  TOKEN_RE.lastIndex = 0;
  for (let m = TOKEN_RE.exec(line); m; m = TOKEN_RE.exec(line)) {
    const [text, comment, str, num, word, br, par, op, ws] = m;
    let cls = '';
    if (comment) cls = 'tk-comment';
    else if (str) cls = 'tk-string';
    else if (num) cls = 'tk-num';
    else if (word) { cls = classify(word, procs, prev); prev = norm(word); }
    else if (br) cls = 'tk-bracket';
    else if (par) cls = 'tk-paren';
    else if (op) cls = 'tk-op';
    else if (ws) cls = '';
    else cls = 'tk-bad';
    items.push({ text, cls });
  }
  return items;
}

export function highlightHtml(src: string, error: LogoError | null): string {
  const procs = procNames(src);
  const lines = src.split('\n');
  const out: string[] = [];
  lines.forEach((line, i) => {
    const items = lineItems(line, procs);
    const isErr = error && error.line === i + 1;
    let html = '';
    let pos = 0;
    let marked = false;
    for (const it of items) {
      const end = pos + it.text.length;
      let cls = it.cls;
      if (isErr && !marked && error!.column - 1 >= pos && error!.column - 1 < end && it.text.trim() !== '') {
        cls += ' err-mark';
        marked = true;
      }
      html += cls ? `<span class="${cls}">${esc(it.text)}</span>` : esc(it.text);
      pos = end;
    }
    if (isErr) {
      if (!marked) html += '<span class="err-mark"> </span>';
      html += `<span class="err-eol" data-msg="${esc(error!.message).replace(/"/g, '&quot;')}"></span>`;
    }
    out.push(html);
  });
  return out.join('\n') + '\n';
}

export interface EditorOptions {
  value: string;
  label: string;
  onChange?: (value: string) => void;
}

export class CodeEditor {
  readonly el: HTMLElement;
  readonly textarea: HTMLTextAreaElement;
  private pre: HTMLElement;
  private layer: HTMLElement;
  private gutter: HTMLElement;
  private gutterInner: HTMLElement;
  private bar: HTMLElement;
  private error: LogoError | null = null;
  private activeLine: number | null = null;
  private onChange?: (v: string) => void;

  constructor(opts: EditorOptions) {
    this.onChange = opts.onChange;
    this.pre = h('pre', { class: 'hl', 'aria-hidden': 'true' });
    this.bar = h('div', { class: 'active-bar', hidden: true });
    this.layer = h('div', { class: 'layer', 'aria-hidden': 'true' }, this.bar, this.pre);
    this.gutterInner = h('pre', { class: 'gutter-inner' });
    this.gutter = h('div', { class: 'gutter', 'aria-hidden': 'true' }, this.gutterInner);
    this.textarea = h('textarea', {
      class: 'ta', spellcheck: false, autocapitalize: 'off', autocomplete: 'off', wrap: 'off',
      'aria-label': opts.label, value: opts.value,
    });
    this.el = h('div', { class: 'editor' }, this.gutter, h('div', { class: 'code' }, this.layer, this.textarea));
    this.textarea.addEventListener('input', () => {
      this.error = null;
      this.render();
      this.onChange?.(this.textarea.value);
    });
    this.textarea.addEventListener('scroll', () => this.syncScroll());
    this.textarea.addEventListener('keydown', (e) => this.onKey(e));
    this.render();
  }

  get value(): string { return this.textarea.value; }

  setValue(v: string, notify = false): void {
    this.textarea.value = v;
    this.error = null;
    this.textarea.scrollTop = 0;
    this.textarea.scrollLeft = 0;
    this.render();
    if (notify) this.onChange?.(v);
  }

  setError(e: LogoError | null): void {
    if (e === this.error || (e && this.error && e.line === this.error.line && e.column === this.error.column && e.message === this.error.message)) return;
    this.error = e;
    this.render();
    if (e) this.reveal(e.line);
  }

  setActiveLine(line: number | null): void {
    if (line === this.activeLine) return;
    this.activeLine = line;
    if (line === null) {
      this.bar.hidden = true;
    } else {
      this.bar.hidden = false;
      this.bar.style.setProperty('--line', String(line));
      this.reveal(line);
    }
    this.renderGutter();
  }

  focus(): void { this.textarea.focus(); }

  /** Moves the caret to a 1-based line / column and focuses the field. */
  goto(line: number, column: number): void {
    const lines = this.textarea.value.split('\n');
    let idx = 0;
    for (let i = 0; i < line - 1 && i < lines.length; i++) idx += lines[i].length + 1;
    idx += Math.min(column - 1, (lines[line - 1] ?? '').length);
    this.textarea.focus();
    this.textarea.setSelectionRange(idx, idx);
    this.reveal(line);
  }

  private lineHeight(): number {
    return parseFloat(getComputedStyle(this.textarea).lineHeight) || 22;
  }

  private reveal(line: number): void {
    const ta = this.textarea;
    const lh = this.lineHeight();
    const top = (line - 1) * lh;
    if (top < ta.scrollTop) ta.scrollTop = top;
    else if (top + lh * 2 > ta.scrollTop + ta.clientHeight) ta.scrollTop = Math.max(0, top - ta.clientHeight + lh * 3);
    this.syncScroll();
  }

  private syncScroll(): void {
    const { scrollLeft, scrollTop } = this.textarea;
    this.layer.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    this.gutterInner.style.transform = `translateY(${-scrollTop}px)`;
  }

  private renderGutter(): void {
    const n = this.textarea.value.split('\n').length;
    let s = '';
    for (let i = 1; i <= n; i++) {
      const cls = this.error?.line === i ? 'ln err' : this.activeLine === i ? 'ln act' : 'ln';
      s += `<span class="${cls}">${i}</span>\n`;
    }
    this.gutterInner.innerHTML = s;
  }

  private render(): void {
    this.pre.innerHTML = highlightHtml(this.textarea.value, this.error);
    this.renderGutter();
    this.syncScroll();
  }

  private onKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      const ta = this.textarea;
      const start = ta.selectionStart;
      const before = ta.value.slice(0, start);
      const line = before.slice(before.lastIndexOf('\n') + 1);
      let indent = /^[ \t]*/.exec(line)![0];
      const trimmed = line.trimEnd().replace(/;.*$/, '').trimEnd();
      const code = line.replace(/;.*$/, '').trim();
      if (trimmed.endsWith('[') || /^(oto|to)\s/i.test(code)) indent += '  ';
      e.preventDefault();
      const text = '\n' + indent;
      if (!document.execCommand || !document.execCommand('insertText', false, text)) {
        ta.setRangeText(text, start, ta.selectionEnd, 'end');
        ta.dispatchEvent(new Event('input'));
      }
    }
  }
}
