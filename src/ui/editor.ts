import { highlightLines } from './highlight';
import { h } from './dom';

export interface EditorError {
  line: number;
  column: number;
  length: number;
  message: string;
}

export interface EditorOptions {
  label: string;
  describedBy?: string;
  onInput: (value: string) => void;
}

const LINE_H = 24;
const PAD_TOP = 12;
const PAD_LEFT = 14;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Code editor: a native textarea over a highlighted mirror. Keeps native
 * caret, selection, undo, IME and screen-reader behaviour.
 */
export class Editor {
  readonly root: HTMLElement;
  readonly textarea: HTMLTextAreaElement;
  private readonly gutter: HTMLElement;
  private readonly layer: HTMLElement;
  private readonly hl: HTMLElement;
  private readonly bubble: HTMLElement;
  private error: EditorError | null = null;
  private execLine: number | null = null;
  private escapeArmed = false;
  private charW = 8.4;

  constructor(private readonly opts: EditorOptions) {
    this.textarea = h('textarea', {
      class: 'ed-input',
      spellcheck: 'false',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      wrap: 'off',
      'aria-label': opts.label,
      'aria-describedby': opts.describedBy ?? '',
      'aria-multiline': 'true',
    }) as HTMLTextAreaElement;
    this.gutter = h('div', { class: 'ed-gutter-inner' });
    this.hl = h('div', { class: 'ed-hl' });
    this.bubble = h('div', { class: 'ed-bubble', hidden: true });
    this.layer = h('div', { class: 'ed-layer', 'aria-hidden': 'true' }, this.hl, this.bubble);
    this.root = h(
      'div',
      { class: 'editor' },
      h('div', { class: 'ed-gutter', 'aria-hidden': 'true' }, this.gutter),
      h('div', { class: 'ed-main' }, this.layer, this.textarea),
    );

    this.textarea.addEventListener('input', () => {
      this.render();
      this.opts.onInput(this.textarea.value);
    });
    this.textarea.addEventListener('scroll', () => this.syncScroll());
    this.textarea.addEventListener('keydown', (e) => this.onKey(e));
    this.textarea.addEventListener('blur', () => (this.escapeArmed = false));
    this.render();
    document.fonts?.ready.then(() => this.measure());
  }

  get value() {
    return this.textarea.value;
  }

  /** Replaces the text (kept in the native undo history when possible). */
  setValue(v: string, { undoable = false } = {}) {
    if (undoable && document.activeElement === this.textarea) {
      this.textarea.select();
      if (!document.execCommand('insertText', false, v)) this.textarea.value = v;
    } else {
      this.textarea.value = v;
    }
    this.textarea.scrollTop = 0;
    this.render();
  }

  focus() {
    this.textarea.focus();
  }

  setError(err: EditorError | null) {
    this.error = err;
    this.render();
    if (err) this.revealLine(err.line);
  }

  setExecLine(line: number | null) {
    if (line === this.execLine) return;
    const prev = this.execLine;
    this.execLine = line;
    // cheap path: toggle classes instead of re-rendering everything
    if (prev) this.hl.children[prev - 1]?.classList.remove('is-exec');
    if (prev) this.gutter.children[prev - 1]?.classList.remove('is-exec');
    if (line) {
      this.hl.children[line - 1]?.classList.add('is-exec');
      this.gutter.children[line - 1]?.classList.add('is-exec');
      this.revealLine(line);
    }
  }

  /** Puts the caret at a 1-based line and column. */
  jumpTo(line: number, col: number) {
    const lines = this.textarea.value.split(/\r\n|\r|\n/);
    let offset = 0;
    for (let k = 0; k < line - 1 && k < lines.length; k++) offset += lines[k].length + 1;
    offset += Math.max(0, col - 1);
    this.textarea.focus();
    this.textarea.setSelectionRange(offset, offset);
    this.revealLine(line);
  }

  revealLine(line: number) {
    const ta = this.textarea;
    const top = PAD_TOP + (line - 1) * LINE_H;
    const bottom = top + LINE_H * (this.error?.line === line ? 3 : 1);
    if (top < ta.scrollTop) ta.scrollTop = Math.max(0, top - LINE_H);
    else if (bottom > ta.scrollTop + ta.clientHeight) ta.scrollTop = bottom - ta.clientHeight + LINE_H;
  }

  private measure() {
    const probe = h('span', { class: 'ed-probe' }, 'MMMMMMMMMM');
    this.hl.append(probe);
    const w = probe.getBoundingClientRect().width / 10;
    probe.remove();
    if (w > 0) this.charW = w;
    this.render();
  }

  private syncScroll() {
    const ta = this.textarea;
    this.layer.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
    this.gutter.style.transform = `translateY(${-ta.scrollTop}px)`;
  }

  private render() {
    const src = this.textarea.value;
    const lines = highlightLines(src);
    const raw = src.split(/\r\n|\r|\n/);
    const err = this.error;
    let html = '';
    let gutter = '';
    for (let n = 0; n < raw.length; n++) {
      const text = raw[n];
      const toks = lines[n] ?? [];
      let out = '';
      let pos = 0;
      for (const t of toks) {
        if (t.col > pos) out += esc(text.slice(pos, t.col));
        const style = t.color ? ` style="--swatch:${t.color}"` : '';
        out += `<span class="t-${t.cls}"${style}>${esc(t.text)}</span>`;
        pos = t.col + t.text.length;
      }
      if (pos < text.length) out += esc(text.slice(pos));
      if (err && err.line === n + 1) out = this.markError(text, out, err);
      const cls = ['ln'];
      if (err && err.line === n + 1) cls.push('is-error');
      if (this.execLine === n + 1) cls.push('is-exec');
      html += `<div class="${cls.join(' ')}">${out || ''}</div>`;
      gutter += `<div class="${cls.join(' ')}">${n + 1}</div>`;
    }
    this.hl.innerHTML = html;
    this.gutter.innerHTML = gutter;

    if (err && err.line <= raw.length) {
      const line = raw[err.line - 1] ?? '';
      const visualCol = expandTabs(line.slice(0, err.column - 1)).length;
      this.bubble.hidden = false;
      this.bubble.textContent = err.message;
      this.bubble.style.top = `${PAD_TOP + err.line * LINE_H + 2}px`;
      this.bubble.style.left = `${PAD_LEFT + Math.max(0, visualCol) * this.charW - 6}px`;
    } else {
      this.bubble.hidden = true;
    }
    this.syncScroll();
  }

  /** Re-renders a line with the erroneous span underlined. */
  private markError(text: string, _html: string, err: EditorError): string {
    const start = Math.min(err.column - 1, text.length);
    const end = Math.min(text.length, start + err.length);
    const lines = highlightLines(text)[0] ?? [];
    let out = '';
    let pos = 0;
    const emit = (from: number, to: number, cls?: string, style = '') => {
      if (to <= from) return;
      const seg = text.slice(from, to);
      // split by the error range so the underline covers exactly the token
      const parts: [number, number, boolean][] = [];
      const a = Math.max(from, start);
      const b = Math.min(to, end);
      if (a < b) {
        if (from < a) parts.push([from, a, false]);
        parts.push([a, b, true]);
        if (b < to) parts.push([b, to, false]);
      } else parts.push([from, to, false]);
      for (const [x, y, isErr] of parts) {
        const inner = esc(text.slice(x, y));
        const c = [cls ? `t-${cls}` : '', isErr ? 't-err' : ''].filter(Boolean).join(' ');
        out += c ? `<span class="${c}"${style}>${inner}</span>` : inner;
      }
      void seg;
    };
    for (const t of lines) {
      emit(pos, t.col);
      emit(t.col, t.col + t.text.length, t.cls, t.color ? ` style="--swatch:${t.color}"` : '');
      pos = t.col + t.text.length;
    }
    emit(pos, text.length);
    if (start >= text.length) out += '<span class="t-err t-err-eol"> </span>';
    return out;
  }

  private onKey(e: KeyboardEvent) {
    const ta = this.textarea;
    if (e.key === 'Escape') {
      this.escapeArmed = true;
      return;
    }
    if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (this.escapeArmed) {
        this.escapeArmed = false;
        return; // let focus move on
      }
      e.preventDefault();
      if (e.shiftKey) this.dedent();
      else this.insert('  ');
      return;
    }
    this.escapeArmed = false;
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && !e.isComposing) {
      const before = ta.value.slice(0, ta.selectionStart);
      const lineStart = before.lastIndexOf('\n') + 1;
      const current = before.slice(lineStart);
      let indent = /^[ \t]*/.exec(current)![0];
      if (/\[\s*$/.test(current) || /^\s*(oto|to)\s/i.test(current)) indent += '  ';
      e.preventDefault();
      this.insert('\n' + indent);
    }
    if (e.key === ']' && !e.ctrlKey && !e.metaKey) {
      // close bracket on an otherwise empty line: pull it back one level
      const before = ta.value.slice(0, ta.selectionStart);
      const lineStart = before.lastIndexOf('\n') + 1;
      const current = before.slice(lineStart);
      if (/^ {2,}$/.test(current) && ta.selectionStart === ta.selectionEnd) {
        e.preventDefault();
        ta.setSelectionRange(ta.selectionStart - 2, ta.selectionStart);
        this.insert(']');
      }
    }
  }

  private insert(text: string) {
    const ta = this.textarea;
    if (!document.execCommand('insertText', false, text)) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
      ta.dispatchEvent(new Event('input'));
    }
  }

  private dedent() {
    const ta = this.textarea;
    const v = ta.value;
    const lineStart = v.lastIndexOf('\n', ta.selectionStart - 1) + 1;
    const m = /^ {1,2}/.exec(v.slice(lineStart));
    if (!m) return;
    const caret = ta.selectionStart;
    ta.setSelectionRange(lineStart, lineStart + m[0].length);
    if (!document.execCommand('delete')) {
      ta.setRangeText('', lineStart, lineStart + m[0].length, 'start');
      ta.dispatchEvent(new Event('input'));
    }
    const pos = Math.max(lineStart, caret - m[0].length);
    ta.setSelectionRange(pos, pos);
  }
}

function expandTabs(s: string) {
  return s.replace(/\t/g, '  ');
}
