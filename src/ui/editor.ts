import type { Diagnostic } from '../lang';
import { h } from './dom';
import { highlightLines } from './highlight';

export interface EditorOptions {
  label: string;
  describedBy: string;
  onChange: (source: string) => void;
}

/**
 * A textarea laid over a highlighted copy of its text. Both share one font,
 * line height and padding, and every logical line is exactly one visual line
 * (no wrapping), so the overlay and the caret line up.
 */
export class Editor {
  readonly element: HTMLElement;
  private readonly textarea: HTMLTextAreaElement;
  private readonly layer: HTMLElement;
  private readonly gutter: HTMLElement;
  private diagnostic: Diagnostic | null = null;
  private activeLine: number | null = null;
  private lineCount = 0;

  constructor(private readonly options: EditorOptions) {
    this.textarea = h('textarea', {
      class: 'code-input',
      spellcheck: false,
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      wrap: 'off',
      rows: 12,
      'aria-label': options.label,
      'aria-describedby': options.describedBy,
      'aria-invalid': 'false',
      on: {
        input: () => this.handleInput(),
        scroll: () => this.syncScroll(),
        keydown: (event) => this.handleKey(event as KeyboardEvent),
      },
    });
    this.layer = h('pre', { class: 'code-layer', 'aria-hidden': 'true' });
    this.gutter = h('div', { class: 'gutter', 'aria-hidden': 'true' });
    this.element = h(
      'div',
      { class: 'editor' },
      this.gutter,
      h('div', { class: 'code-wrap' }, this.layer, this.textarea),
    );
    this.refresh();
  }

  get value(): string {
    return this.textarea.value;
  }

  /** Replaces the whole text, as a paste would, so the browser undo stack keeps working. */
  setValue(text: string, options: { focus?: boolean } = {}): void {
    if (options.focus !== false) this.textarea.focus({ preventScroll: true });
    this.textarea.select();
    const inserted = text.length > 0 && document.execCommand('insertText', false, text);
    if (!inserted) {
      this.textarea.value = text;
      this.textarea.setSelectionRange(0, 0);
      this.handleInput();
    } else if (text.length === 0) {
      this.handleInput();
    }
    this.textarea.scrollTop = 0;
    this.textarea.scrollLeft = 0;
    this.syncScroll();
  }

  focus(): void {
    this.textarea.focus({ preventScroll: true });
  }

  setDiagnostic(diagnostic: Diagnostic | null): void {
    this.diagnostic = diagnostic;
    this.textarea.setAttribute('aria-invalid', diagnostic ? 'true' : 'false');
    this.refresh();
  }

  setActiveLine(line: number | null): void {
    if (this.activeLine === line) return;
    this.activeLine = line;
    this.refresh();
    if (line !== null) this.scrollToLine(line);
  }

  /** Keeps the given line visible without moving the caret. */
  private scrollToLine(line: number): void {
    const lineHeight = this.layer.firstElementChild?.getBoundingClientRect().height ?? 20;
    const top = (line - 1) * lineHeight;
    const viewTop = this.textarea.scrollTop;
    const viewBottom = viewTop + this.textarea.clientHeight - lineHeight;
    if (top < viewTop) this.textarea.scrollTop = Math.max(0, top - lineHeight);
    else if (top > viewBottom) this.textarea.scrollTop = top - this.textarea.clientHeight / 2;
    this.syncScroll();
  }

  private handleInput(): void {
    this.refresh();
    this.options.onChange(this.textarea.value);
  }

  private syncScroll(): void {
    this.layer.scrollTop = this.textarea.scrollTop;
    this.layer.scrollLeft = this.textarea.scrollLeft;
    this.gutter.scrollTop = this.textarea.scrollTop;
  }

  private handleKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey && !event.isComposing) {
      // Keep the indentation of the current line on the next one.
      const pos = this.textarea.selectionStart;
      const before = this.textarea.value.slice(0, pos);
      const lineStart = before.lastIndexOf('\n') + 1;
      const indent = /^[ \t]*/.exec(before.slice(lineStart))?.[0] ?? '';
      event.preventDefault();
      this.insertAtCaret('\n' + indent);
    }
  }

  private insertAtCaret(text: string): void {
    if (!document.execCommand('insertText', false, text)) {
      const { selectionStart, selectionEnd } = this.textarea;
      this.textarea.setRangeText(text, selectionStart, selectionEnd, 'end');
      this.handleInput();
    }
  }

  /** Redraws the highlighted layer and the gutter from the current text. */
  refresh(): void {
    const lines = this.textarea.value.split('\n');
    const errorLine = this.diagnostic?.line ?? null;
    const html = highlightLines(lines, this.diagnostic);
    this.layer.replaceChildren(
      ...html.map((content, index) => {
        const classes = ['ln'];
        if (index + 1 === this.activeLine) classes.push('active');
        if (index + 1 === errorLine) classes.push('has-error');
        const row = document.createElement('div');
        row.className = classes.join(' ');
        row.innerHTML = content;
        return row;
      }),
    );
    if (lines.length !== this.lineCount) {
      this.lineCount = lines.length;
      this.gutter.replaceChildren(
        ...lines.map((_, index) => h('div', { class: 'gutter-line' }, String(index + 1))),
      );
      this.gutter.style.setProperty('--digits', String(String(lines.length).length));
    }
    for (const [index, node] of Array.from(this.gutter.children).entries()) {
      node.classList.toggle('active', index + 1 === this.activeLine);
      node.classList.toggle('has-error', index + 1 === errorLine);
    }
    this.syncScroll();
  }
}
