import { h } from './dom';
import { highlight, ErrRange } from './highlight';

export interface EditorError { line: number; column: number; length: number; message: string }

export class Editor {
  readonly root: HTMLElement;
  readonly ta: HTMLTextAreaElement;
  private layer: HTMLElement;
  private pre: HTMLPreElement;
  private gutter: HTMLElement;
  private gutterInner: HTMLElement;
  private activeBar: HTMLElement;
  private errBar: HTMLElement;
  private bubble: HTMLElement;
  private lines = 0;
  private err: EditorError | null = null;
  private active: number | null = null;
  private lh = 22;
  private cw = 8.4;
  private padL = 12;
  private padT = 10;
  onInput: () => void = () => {};

  constructor(label: string) {
    this.ta = h('textarea', {
      class: 'ed-ta', 'aria-label': label, spellcheck: 'false', autocapitalize: 'off',
      autocomplete: 'off', autocorrect: 'off', wrap: 'off', id: 'editor-input',
    });
    this.pre = h('pre', { class: 'ed-pre', 'aria-hidden': 'true' });
    this.activeBar = h('div', { class: 'ed-bar ed-bar-active', hidden: true });
    this.errBar = h('div', { class: 'ed-bar ed-bar-err', hidden: true });
    this.bubble = h('div', { class: 'ed-bubble', role: 'note', hidden: true });
    this.layer = h('div', { class: 'ed-layer' }, this.activeBar, this.errBar, this.pre, this.bubble);
    this.gutterInner = h('div', { class: 'ed-gutter-inner' });
    this.gutter = h('div', { class: 'ed-gutter', 'aria-hidden': 'true' }, this.gutterInner);
    const view = h('div', { class: 'ed-view' }, this.layer, this.ta);
    this.root = h('div', { class: 'editor' }, this.gutter, view);

    this.ta.addEventListener('input', () => { this.refresh(); this.onInput(); });
    this.ta.addEventListener('scroll', () => this.syncScroll());
    this.ta.addEventListener('keydown', e => this.onKey(e));
    new ResizeObserver(() => this.measure()).observe(this.root);
  }

  get value(): string { return this.ta.value; }
  set value(v: string) {
    this.ta.value = v;
    this.err = null;
    this.active = null;
    this.refresh();
  }

  focus() { this.ta.focus(); }

  private onKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && !e.isComposing) {
      const { selectionStart: s, value } = this.ta;
      const ls = value.lastIndexOf('\n', s - 1) + 1;
      const before = value.slice(ls, s);
      let indent = /^[ \t]*/.exec(before)![0];
      const t = before.trim().toLowerCase();
      if (/\[\s*(;.*)?$/.test(before) || /^(oto|to)\b/.test(t)) indent += '  ';
      e.preventDefault();
      if (!document.execCommand('insertText', false, '\n' + indent)) {
        this.ta.setRangeText('\n' + indent, s, this.ta.selectionEnd, 'end');
      }
      this.refresh();
      this.onInput();
    }
  }

  measure() {
    const cs = getComputedStyle(this.ta);
    this.lh = parseFloat(cs.lineHeight) || 22;
    this.padL = parseFloat(cs.paddingLeft) || 12;
    this.padT = parseFloat(cs.paddingTop) || 10;
    const probe = h('span', { class: 'ed-probe' }, 'M'.repeat(50));
    probe.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font:${cs.font};letter-spacing:${cs.letterSpacing}`;
    this.root.append(probe);
    this.cw = probe.getBoundingClientRect().width / 50 || 8.4;
    probe.remove();
    this.layoutMarks();
  }

  private syncScroll() {
    const { scrollLeft: x, scrollTop: y } = this.ta;
    this.layer.style.transform = `translate(${-x}px, ${-y}px)`;
    this.gutterInner.style.transform = `translateY(${-y}px)`;
  }

  private refresh() {
    const val = this.ta.value;
    const range: ErrRange | null = this.err ? { line: this.err.line, col: this.err.column, len: this.err.length } : null;
    this.pre.innerHTML = highlight(val, range);
    const count = val.split('\n').length;
    if (count !== this.lines) {
      this.lines = count;
      this.gutterInner.replaceChildren(...Array.from({ length: count }, (_, i) => h('div', { class: 'ed-ln' }, String(i + 1))));
    }
    this.layoutMarks();
    this.syncScroll();
  }

  private layoutMarks() {
    const lines = this.gutterInner.children;
    for (const el of Array.from(lines)) el.classList.remove('is-err', 'is-active');
    const place = (bar: HTMLElement, line: number | null) => {
      bar.hidden = line === null;
      if (line !== null) {
        bar.style.top = `${this.padT + (line - 1) * this.lh}px`;
        bar.style.height = `${this.lh}px`;
      }
    };
    place(this.activeBar, this.active);
    place(this.errBar, this.err ? this.err.line : null);
    if (this.active !== null) lines[this.active - 1]?.classList.add('is-active');
    if (this.err) lines[this.err.line - 1]?.classList.add('is-err');
    if (this.err) {
      this.bubble.hidden = false;
      this.bubble.textContent = `Wiersz ${this.err.line}, kolumna ${this.err.column}: ${this.err.message}`;
      this.bubble.style.top = `${this.padT + this.err.line * this.lh + 2}px`;
      const viewW = this.ta.clientWidth;
      const bw = Math.min(this.bubble.offsetWidth || 320, viewW - 8);
      const want = this.padL + (this.err.column - 1) * this.cw - 8;
      const left = Math.max(this.ta.scrollLeft + 4, Math.min(want, this.ta.scrollLeft + viewW - bw - 4));
      this.bubble.style.left = `${Math.max(4, left)}px`;
    } else {
      this.bubble.hidden = true;
    }
  }

  setError(err: EditorError | null, reveal = false) {
    this.err = err;
    this.refresh();
    if (err && reveal) this.reveal(err.line);
  }

  setActiveLine(line: number | null) {
    this.active = line;
    this.layoutMarks();
    if (line !== null) this.reveal(line, false);
  }

  reveal(line: number, withBubble = true) {
    const top = this.padT + (line - 1) * this.lh;
    const bottom = top + this.lh * (withBubble ? 3.2 : 1);
    const ta = this.ta;
    if (top < ta.scrollTop) ta.scrollTop = Math.max(0, top - this.lh);
    else if (bottom > ta.scrollTop + ta.clientHeight) ta.scrollTop = bottom - ta.clientHeight + this.lh;
  }
}
