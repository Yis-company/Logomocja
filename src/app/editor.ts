import { h } from './dom';
import { highlightHtml, offsetOf } from './highlight';

export interface EditorError {
  message: string;
  line: number;
  column: number;
}

/**
 * Edytor kodu: prawdziwy <textarea> (obsługa klawiatury, IME, zaznaczania na telefonach)
 * z przezroczystym tekstem, pod którym leży podświetlona kopia. Numery wierszy,
 * znaczniki błędu i podświetlenie wykonywanego wiersza przesuwają się razem z przewijaniem.
 */
export class CodeEditor {
  readonly el: HTMLElement;
  readonly textarea: HTMLTextAreaElement;
  onInput: ((value: string) => void) | null = null;

  private gutterInner: HTMLElement;
  private gutterText: HTMLElement;
  private gutterActive: HTMLElement;
  private gutterError: HTMLElement;
  private layersInner: HTMLElement;
  private code: HTMLElement;
  private activeBand: HTMLElement;
  private errorBand: HTMLElement;
  private bubble: HTMLElement;
  private measure: HTMLElement;
  private lineCount = 0;
  private charW = 8;
  private lineH = 21;
  private padTop = 10;
  private padLeft = 12;
  private error: EditorError | null = null;
  private activeLine: number | null = null;
  private renderQueued = false;

  constructor(label: string) {
    this.textarea = h('textarea', {
      class: 'code-input',
      spellcheck: 'false',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      wrap: 'off',
      placeholder: 'Napisz program Logo, np.  powtorz 4 [np 100 pw 90]',
      'aria-label': label,
      'data-testid': 'editor-input',
    });
    this.gutterText = h('pre', { class: 'gutter-text' });
    this.gutterActive = h('div', { class: 'gutter-active', hidden: true });
    this.gutterError = h('div', { class: 'gutter-error', hidden: true }, '!');
    this.gutterInner = h('div', { class: 'gutter-inner' }, this.gutterActive, this.gutterError, this.gutterText);
    const gutter = h('div', { class: 'gutter', 'aria-hidden': 'true' }, this.gutterInner);

    this.code = h('code');
    this.activeBand = h('div', { class: 'band band-active', hidden: true });
    this.errorBand = h('div', { class: 'band band-error', hidden: true });
    this.layersInner = h(
      'div',
      { class: 'layers-inner' },
      this.activeBand,
      this.errorBand,
      h('pre', { class: 'code-highlight' }, this.code),
    );
    const layers = h('div', { class: 'layers', 'aria-hidden': 'true' }, this.layersInner);
    this.bubble = h('div', { class: 'err-bubble', role: 'presentation', hidden: true });
    this.measure = h('span', { class: 'measure', 'aria-hidden': 'true' }, 'M'.repeat(64));

    this.el = h(
      'div',
      { class: 'editor', 'data-testid': 'editor' },
      gutter,
      h('div', { class: 'editor-body' }, layers, this.textarea, this.bubble, this.measure),
    );

    this.textarea.addEventListener('input', () => {
      this.queueRender();
      this.onInput?.(this.textarea.value);
    });
    this.textarea.addEventListener('scroll', () => this.syncScroll());
    new ResizeObserver(() => {
      this.measureFont();
      this.layout();
    }).observe(this.el);
    if (document.fonts?.ready) void document.fonts.ready.then(() => this.measureFont());
  }

  get value(): string {
    return this.textarea.value;
  }

  /** Ustawia treść (np. po wczytaniu przykładu) bez wywoływania onInput. */
  setValue(value: string): void {
    this.textarea.value = value;
    this.error = null;
    this.activeLine = null;
    this.textarea.scrollTop = 0;
    this.textarea.scrollLeft = 0;
    this.render();
  }

  focus(): void {
    this.textarea.focus();
  }

  setError(err: EditorError | null): void {
    this.error = err;
    this.render();
  }

  setActiveLine(line: number | null, reveal = true): void {
    this.activeLine = line;
    this.layout();
    if (line !== null && reveal) this.reveal(line);
  }

  /** Ustawia kursor w podanym miejscu i przewija tak, by było widoczne. */
  focusAt(line: number, column: number): void {
    const off = offsetOf(this.textarea.value, line, column);
    this.textarea.focus();
    this.textarea.setSelectionRange(off, off);
    this.reveal(line);
  }

  private reveal(line: number): void {
    const ta = this.textarea;
    const top = this.padTop + (line - 1) * this.lineH;
    const bottom = top + this.lineH;
    if (top < ta.scrollTop) ta.scrollTop = Math.max(0, top - this.lineH * 2);
    else if (bottom > ta.scrollTop + ta.clientHeight) ta.scrollTop = bottom - ta.clientHeight + this.lineH * 2;
  }

  private queueRender(): void {
    if (this.renderQueued) return;
    this.renderQueued = true;
    requestAnimationFrame(() => {
      this.renderQueued = false;
      this.render();
    });
  }

  private measureFont(): void {
    const w = this.measure.getBoundingClientRect().width / 64;
    const cs = getComputedStyle(this.textarea);
    const lh = parseFloat(cs.lineHeight);
    if (w > 0) this.charW = w;
    if (lh > 0) this.lineH = lh;
    this.padTop = parseFloat(cs.paddingTop) || 0;
    this.padLeft = parseFloat(cs.paddingLeft) || 0;
  }

  private render(): void {
    const value = this.textarea.value;
    const errOff = this.error ? offsetOf(value, this.error.line, this.error.column) : null;
    this.code.innerHTML = highlightHtml(value, errOff);
    const lines = value.split('\n').length;
    if (lines !== this.lineCount) {
      this.lineCount = lines;
      let s = '';
      for (let i = 1; i <= lines; i++) s += i + (i < lines ? '\n' : '');
      this.gutterText.textContent = s;
      this.el.style.setProperty('--gutter-digits', String(Math.max(2, String(lines).length)));
    }
    this.layout();
  }

  private syncScroll(): void {
    const { scrollLeft, scrollTop } = this.textarea;
    this.layersInner.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    this.gutterInner.style.transform = `translateY(${-scrollTop}px)`;
    this.placeBubble();
  }

  /** Ustawia pasma podświetlenia i dymek błędu. */
  private layout(): void {
    this.syncScroll();
    const place = (el: HTMLElement, gutter: HTMLElement | null, line: number | null) => {
      if (line === null) {
        el.hidden = true;
        if (gutter) gutter.hidden = true;
        return;
      }
      const top = this.padTop + (line - 1) * this.lineH;
      el.hidden = false;
      el.style.top = `${top}px`;
      el.style.height = `${this.lineH}px`;
      if (gutter) {
        gutter.hidden = false;
        gutter.style.top = `${top}px`;
        gutter.style.height = `${this.lineH}px`;
      }
    };
    place(this.activeBand, this.gutterActive, this.activeLine);
    place(this.errorBand, this.gutterError, this.error ? this.error.line : null);
    this.placeBubble();
  }

  private placeBubble(): void {
    const err = this.error;
    if (!err) {
      this.bubble.hidden = true;
      return;
    }
    if (this.bubble.textContent !== err.message) this.bubble.textContent = err.message;
    this.bubble.hidden = false;
    const ta = this.textarea;
    const viewW = ta.clientWidth;
    const viewH = ta.clientHeight;
    const x = this.padLeft + (err.column - 1) * this.charW - ta.scrollLeft;
    const lineTop = this.padTop + (err.line - 1) * this.lineH - ta.scrollTop;
    const bw = this.bubble.offsetWidth;
    const bh = this.bubble.offsetHeight;
    const left = Math.max(6, Math.min(x, viewW - bw - 6));
    let top = lineTop + this.lineH + 4;
    let above = false;
    if (top + bh > viewH && lineTop - bh - 4 >= 0) {
      top = lineTop - bh - 4;
      above = true;
    }
    this.bubble.classList.toggle('above', above);
    this.bubble.style.left = `${left}px`;
    this.bubble.style.top = `${top}px`;
    this.bubble.style.setProperty('--arrow-x', `${Math.max(10, Math.min(x - left + this.charW / 2, bw - 14))}px`);
    this.bubble.hidden = lineTop + this.lineH < 0 || lineTop > viewH;
  }
}
