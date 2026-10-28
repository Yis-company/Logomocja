import { type Highlight } from '../lang/index';
import { highlightSource, type HighlightKind } from '../lang/highlight';
import { el } from './dom';

export interface EditorMark {
  line: number;
  column: number;
  /** Shown at the end of the line, next to the marked character. */
  message?: string;
}

export interface EditorOptions {
  label: string;
  describedBy?: string;
  onInput: () => void;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, '&quot;');
}

/**
 * A code editor made of a textarea over a highlighted copy of its text.
 * Both layers use the same metrics, so the caret lines up with the colours.
 */
export class Editor {
  readonly element: HTMLElement;
  private readonly textarea: HTMLTextAreaElement;
  private readonly lines: HTMLElement;
  private readonly gutter: HTMLElement;
  private active: number | null = null;
  private error: EditorMark | null = null;
  private renderedText: string | null = null;
  private kinds: HighlightKind[] = [];
  private errorChanged = false;
  private frame = 0;

  constructor(
    container: HTMLElement,
    private readonly options: EditorOptions,
  ) {
    this.lines = el('div', { class: 'ed-lines', 'aria-hidden': 'true' });
    this.gutter = el('div', { class: 'ed-gutter', 'aria-hidden': 'true' });
    this.textarea = el('textarea', {
      class: 'ed-input',
      spellcheck: 'false',
      autocomplete: 'off',
      autocapitalize: 'off',
      autocorrect: 'off',
      wrap: 'off',
      'aria-label': options.label,
      'aria-describedby': options.describedBy,
      'aria-multiline': 'true',
      on: {
        input: () => {
          this.scheduleRender();
          options.onInput();
        },
        scroll: () => this.syncScroll(),
      },
    });
    this.element = el('div', { class: 'editor' }, this.gutter, el('div', { class: 'ed-surface' }, this.lines, this.textarea));
    container.append(this.element);
    this.render();
  }

  get value(): string {
    return this.textarea.value;
  }

  focus(): void {
    this.textarea.focus({ preventScroll: true });
  }

  /**
   * Replaces the whole text the way a paste would, so Ctrl+Z brings the previous text back.
   * Falls back to a plain assignment where execCommand is unavailable.
   */
  replaceText(text: string): void {
    const ta = this.textarea;
    ta.focus({ preventScroll: true });
    ta.select();
    let inserted = false;
    try {
      inserted = document.execCommand('insertText', false, text);
    } catch {
      inserted = false;
    }
    if (!inserted || ta.value !== text) ta.value = text;
    this.scheduleRender();
    this.options.onInput();
  }

  /** Replaces the text without touching undo history or notifying the owner (used when switching drafts). */
  setTextSilently(text: string): void {
    this.textarea.value = text;
    this.scheduleRender();
  }

  /** Highlights the statement being executed, or clears the highlight with null. */
  setActive(at: Highlight | null): void {
    const line = at ? at.line : null;
    if (line === this.active) return;
    this.active = line;
    this.render();
    if (line !== null) this.scrollToLine(line);
  }

  setError(mark: EditorMark | null): void {
    this.error = mark;
    this.errorChanged = true;
    this.render();
    if (mark) this.scrollToLine(mark.line);
  }

  private scheduleRender(): void {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.render();
    });
  }

  private syncScroll(): void {
    const { scrollTop, scrollLeft } = this.textarea;
    this.lines.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    this.gutter.style.transform = `translateY(${-scrollTop}px)`;
  }

  private scrollToLine(line: number): void {
    const lh = parseFloat(getComputedStyle(this.textarea).lineHeight) || 20;
    const top = (line - 1) * lh;
    const ta = this.textarea;
    if (top < ta.scrollTop || top > ta.scrollTop + ta.clientHeight - lh * 2) {
      ta.scrollTop = Math.max(0, top - ta.clientHeight / 3);
      this.syncScroll();
    }
  }

  private render(): void {
    const text = this.textarea.value;
    if (text !== this.renderedText) {
      this.renderedText = text;
      this.kinds = this.computeKinds(text);
      this.gutter.innerHTML = this.renderGutter(text);
      this.lines.innerHTML = this.renderLines(text);
    } else if (this.errorChanged) {
      this.lines.innerHTML = this.renderLines(text);
    } else {
      this.markLines();
    }
    this.errorChanged = false;
    this.syncScroll();
  }

  private computeKinds(text: string): HighlightKind[] {
    const kinds: HighlightKind[] = new Array<HighlightKind>(text.length);
    for (const span of highlightSource(text)) {
      for (let i = span.start; i < span.end; i++) kinds[i] = span.kind;
    }
    return kinds;
  }

  private lineCount(text: string): number {
    let n = 1;
    for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) n++;
    return n;
  }

  private renderGutter(text: string): string {
    const n = this.lineCount(text);
    let html = '';
    for (let i = 1; i <= n; i++) html += `<div class="ed-num" data-line="${i}">${i}</div>`;
    return html;
  }

  private renderLines(text: string): string {
    const kinds = this.kinds;
    const errorOffset = this.error ? this.offsetOf(text, this.error) : -1;

    const rows: string[] = [];
    let row = '';
    let runKind: string | null = null;
    let run = '';
    const flush = (): void => {
      if (run) row += runKind === 'plain' ? escapeHtml(run) : `<span class="t-${runKind}">${escapeHtml(run)}</span>`;
      run = '';
    };
    for (let i = 0; i <= text.length; i++) {
      const ch = text[i];
      if (ch === '\n' || ch === undefined) {
        flush();
        rows.push(row);
        row = '';
        runKind = null;
        continue;
      }
      const kind = i === errorOffset ? 'error-char' : (kinds[i] ?? 'plain');
      if (kind !== runKind) {
        flush();
        runKind = kind;
      }
      run += ch;
    }
    return rows
      .map((content, idx) => {
        const n = idx + 1;
        const isError = this.error?.line === n;
        const cls = ['ed-line', n === this.active ? 'is-active' : '', isError ? 'is-error' : ''].filter(Boolean).join(' ');
        // The message is drawn by CSS after the line's text. It exists only in this layer, so the caret is unaffected.
        const msg = isError && this.error?.message ? ` data-msg="${escapeAttr(this.error.message)}"` : '';
        return `<div class="${cls}" data-line="${n}"${msg}>${content || '<br>'}</div>`;
      })
      .join('');
  }

  /** Updates only the highlight classes; the text itself is unchanged. */
  private markLines(): void {
    const mark = (node: HTMLElement): void => {
      const n = Number(node.dataset.line);
      node.classList.toggle('is-active', n === this.active);
      node.classList.toggle('is-error', this.error?.line === n);
    };
    this.lines.querySelectorAll<HTMLElement>('.ed-line').forEach(mark);
    this.gutter.querySelectorAll<HTMLElement>('.ed-num').forEach(mark);
  }

  private offsetOf(text: string, mark: EditorMark): number {
    let line = 1;
    let start = 0;
    for (let i = 0; i < text.length && line < mark.line; i++) {
      if (text.charCodeAt(i) === 10) {
        line++;
        start = i + 1;
      }
    }
    if (line !== mark.line) return -1;
    const offset = start + mark.column - 1;
    const end = text.indexOf('\n', start);
    const lineEnd = end === -1 ? text.length : end;
    return offset < lineEnd ? offset : -1;
  }
}
