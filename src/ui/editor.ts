import { h } from './dom';
import { highlightLines } from './highlight';

export interface EditorMark {
  start: number;
  end: number;
  line: number;
  column: number;
  message: string;
  /** 'error' – błąd uruchomienia lub składni, 'hint' – podgląd podczas pisania. */
  severity: 'error' | 'hint';
}

export interface EditorOptions {
  label: string;
  describedBy?: string;
  onChange: (value: string) => void;
}

/**
 * Edytor programu: zwykłe pole tekstowe z nałożoną warstwą kolorowania,
 * numerami wierszy, znacznikiem błędu i podświetleniem wykonywanego wiersza.
 */
export class Editor {
  readonly root: HTMLElement;
  readonly textarea: HTMLTextAreaElement;
  private readonly gutterInner: HTMLElement;
  private readonly code: HTMLElement;
  private readonly codeLayer: HTMLElement;
  private readonly bgLayer: HTMLElement;
  private readonly execBar: HTMLElement;
  private readonly errBar: HTMLElement;
  private mark: EditorMark | null = null;
  private execLine: number | null = null;
  private lineCount = 0;
  private pending = false;
  private tabMovesFocus = false;
  private lineHeight = 22;
  private padTop = 12;

  constructor(private readonly opts: EditorOptions) {
    this.textarea = h('textarea', {
      class: 'ed-input',
      spellcheck: 'false',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      wrap: 'off',
      'aria-label': opts.label,
      'aria-describedby': opts.describedBy ?? null,
      'aria-multiline': 'true',
    });
    this.gutterInner = h('div', { class: 'ed-gutter-inner' });
    this.code = h('div', { class: 'ed-code' });
    this.codeLayer = h('div', { class: 'ed-layer' }, this.code);
    this.execBar = h('div', { class: 'ed-execbar', hidden: true });
    this.errBar = h('div', { class: 'ed-errbar', hidden: true });
    this.bgLayer = h('div', { class: 'ed-bg' }, this.execBar, this.errBar);
    this.root = h('div', { class: 'editor' },
      h('div', { class: 'ed-gutter', 'aria-hidden': 'true' }, this.gutterInner),
      h('div', { class: 'ed-main' }, this.bgLayer, this.codeLayer, this.textarea),
    );

    this.textarea.addEventListener('input', () => {
      this.schedule();
      this.opts.onChange(this.textarea.value);
    });
    this.textarea.addEventListener('scroll', () => this.syncScroll());
    this.textarea.addEventListener('keydown', (e) => this.onKey(e));
    this.textarea.addEventListener('blur', () => { this.tabMovesFocus = false; });
    new ResizeObserver(() => this.measure()).observe(this.root);
    this.render();
  }

  get value(): string {
    return this.textarea.value;
  }

  /** Wstawia nowy tekst (np. przy wczytaniu przykładu). */
  setValue(value: string): void {
    if (this.textarea.value === value) return;
    this.textarea.value = value;
    this.textarea.scrollTop = 0;
    this.textarea.scrollLeft = 0;
    this.mark = null;
    this.execLine = null;
    this.render();
  }

  setMark(mark: EditorMark | null): void {
    this.mark = mark;
    this.schedule();
  }

  getMark(): EditorMark | null {
    return this.mark;
  }

  setExecLine(line: number | null): void {
    if (line === this.execLine) return;
    this.execLine = line;
    this.renderBars();
    this.renderGutterState();
    if (line !== null) this.revealLine(line);
  }

  /** Ustawia kursor w danym miejscu i przewija do niego. */
  focusAt(offset: number): void {
    this.textarea.focus();
    this.textarea.setSelectionRange(offset, offset);
    const line = this.textarea.value.slice(0, offset).split('\n').length;
    this.revealLine(line);
  }

  focus(): void {
    this.textarea.focus();
  }

  private revealLine(line: number): void {
    const ta = this.textarea;
    const top = this.padTop + (line - 1) * this.lineHeight;
    if (top < ta.scrollTop + this.lineHeight) ta.scrollTop = Math.max(0, top - this.lineHeight * 2);
    else if (top + this.lineHeight > ta.scrollTop + ta.clientHeight - this.lineHeight) {
      ta.scrollTop = top - ta.clientHeight + this.lineHeight * 3;
    }
  }

  private measure(): void {
    const cs = getComputedStyle(this.textarea);
    const lh = parseFloat(cs.lineHeight);
    if (Number.isFinite(lh) && lh > 0) this.lineHeight = lh;
    this.padTop = parseFloat(cs.paddingTop) || 0;
    this.renderBars();
    this.syncScroll();
  }

  private schedule(): void {
    if (this.pending) return;
    this.pending = true;
    requestAnimationFrame(() => {
      this.pending = false;
      this.render();
    });
  }

  private render(): void {
    const value = this.textarea.value;
    const m = this.mark;
    const lines = highlightLines(value, m ? {
      start: m.start, end: m.end, cls: m.severity === 'error' ? 'mark-error' : 'mark-hint',
    } : null);
    if (m && m.line >= 1 && m.line <= lines.length) {
      const note = m.message.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      lines[m.line - 1] += `<span class="ed-note ed-note-${m.severity}" aria-hidden="true">${note}</span>`;
    }
    this.code.innerHTML = lines.map((l) => `<div class="ed-line">${l || '​'}</div>`).join('');
    if (lines.length !== this.lineCount) {
      this.lineCount = lines.length;
      let html = '';
      for (let k = 1; k <= lines.length; k++) html += `<div class="ed-num" data-line="${k}">${k}</div>`;
      this.gutterInner.innerHTML = html;
    }
    this.renderGutterState();
    this.renderBars();
    this.syncScroll();
  }

  private renderGutterState(): void {
    this.gutterInner.querySelectorAll('.is-exec, .is-error, .is-hint').forEach((el) =>
      el.classList.remove('is-exec', 'is-error', 'is-hint'));
    if (this.mark) {
      this.gutterInner.children[this.mark.line - 1]?.classList.add(this.mark.severity === 'error' ? 'is-error' : 'is-hint');
    }
    if (this.execLine !== null) this.gutterInner.children[this.execLine - 1]?.classList.add('is-exec');
  }

  private renderBars(): void {
    const place = (bar: HTMLElement, line: number | null) => {
      bar.hidden = line === null;
      if (line !== null) {
        bar.style.top = `${this.padTop + (line - 1) * this.lineHeight}px`;
        bar.style.height = `${this.lineHeight}px`;
      }
    };
    place(this.execBar, this.execLine);
    place(this.errBar, this.mark && this.mark.severity === 'error' ? this.mark.line : null);
  }

  private syncScroll(): void {
    const { scrollTop, scrollLeft } = this.textarea;
    this.code.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    this.bgLayer.style.transform = `translateY(${-scrollTop}px)`;
    this.gutterInner.style.transform = `translateY(${-scrollTop}px)`;
  }

  private insert(text: string): void {
    const ta = this.textarea;
    // execCommand zachowuje historię cofania; gdy go brak, wstawiamy ręcznie.
    if (!document.execCommand?.('insertText', false, text)) {
      const { selectionStart: s, selectionEnd: e } = ta;
      ta.setRangeText(text, s, e, 'end');
      ta.dispatchEvent(new Event('input'));
    }
  }

  private onKey(e: KeyboardEvent): void {
    const ta = this.textarea;
    if (e.key === 'Escape') {
      this.tabMovesFocus = true;
      return;
    }
    if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (this.tabMovesFocus) return;
      e.preventDefault();
      const { selectionStart: s, selectionEnd: end, value } = ta;
      const lineStart = value.lastIndexOf('\n', s - 1) + 1;
      if (e.shiftKey) {
        // Zmniejsz wcięcie bieżącego wiersza.
        const m = /^ {1,2}/.exec(value.slice(lineStart));
        if (m) {
          ta.setSelectionRange(lineStart, lineStart + m[0].length);
          this.insert('');
          const ns = Math.max(lineStart, s - m[0].length);
          ta.setSelectionRange(ns, Math.max(ns, end - m[0].length));
        }
        return;
      }
      if (s !== end && value.slice(s, end).includes('\n')) {
        // Wcięcie wielu wierszy.
        const block = value.slice(lineStart, end);
        const indented = block.replace(/^/gm, '  ');
        ta.setSelectionRange(lineStart, end);
        this.insert(indented);
        ta.setSelectionRange(lineStart, lineStart + indented.length);
        return;
      }
      this.insert('  ');
      return;
    }
    this.tabMovesFocus = false;
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && !e.isComposing) {
      const { selectionStart: s, value } = ta;
      const lineStart = value.lastIndexOf('\n', s - 1) + 1;
      const before = value.slice(lineStart, s);
      let indent = /^[ \t]*/.exec(before)![0];
      const trimmed = before.replace(/;.*$/, '').trimEnd();
      if (trimmed.endsWith('[')) indent += '  ';
      else if (/^\s*(oto|to)\s/i.test(before)) indent += '  ';
      e.preventDefault();
      this.insert('\n' + indent);
      return;
    }
    if (e.key === ']' && !e.ctrlKey && !e.metaKey) {
      // Zamykający nawias w pustym wierszu cofa wcięcie.
      const { selectionStart: s, selectionEnd: end, value } = ta;
      const lineStart = value.lastIndexOf('\n', s - 1) + 1;
      const before = value.slice(lineStart, s);
      if (s === end && /^ {2,}$/.test(before)) {
        e.preventDefault();
        ta.setSelectionRange(s - 2, s);
        this.insert(']');
      }
    }
  }
}
