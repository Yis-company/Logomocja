import type { Pos } from '../logo';
import { highlightLine } from './highlight';

/**
 * A textarea laid over a highlighted copy of its text. Both use the same font,
 * line height and padding, so the overlay lines up with the typed characters.
 */
export class Editor {
  readonly textarea: HTMLTextAreaElement;
  private readonly overlay: HTMLElement;
  private readonly gutter: HTMLElement;
  private execPos: Pos | null = null;
  private errorPos: Pos | null = null;
  private frame = 0;
  private lineCount = 0;
  private lastKey = '';

  constructor(
    host: HTMLElement,
    private readonly onInput: () => void,
  ) {
    host.innerHTML = `
      <div class="editor">
        <div class="gutter" aria-hidden="true"></div>
        <div class="code">
          <div class="code-overlay" aria-hidden="true"></div>
          <textarea class="code-input" id="program" aria-label="Program w języku Logo. Ctrl+Enter uruchamia program."
            spellcheck="false" wrap="off" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
        </div>
      </div>`;
    this.textarea = host.querySelector('textarea')!;
    this.overlay = host.querySelector('.code-overlay')!;
    this.gutter = host.querySelector('.gutter')!;

    this.textarea.addEventListener('input', () => {
      this.scheduleRender();
      this.onInput();
    });
    this.textarea.addEventListener('scroll', () => this.syncScroll());
    this.render();
  }

  get value(): string {
    return this.textarea.value;
  }

  set value(text: string) {
    this.textarea.value = text;
    this.textarea.scrollTop = 0;
    this.textarea.scrollLeft = 0;
    this.render();
  }

  /** Highlights the statement about to run and the position of an error. */
  setMarks(exec: Pos | null, error: Pos | null) {
    const moved = exec?.line !== this.execPos?.line;
    this.execPos = exec;
    this.errorPos = error;
    this.render();
    if (exec && moved) this.revealLine(exec.line);
  }

  focus() {
    this.textarea.focus({ preventScroll: true });
  }

  private scheduleRender() {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.render());
  }

  private render() {
    const text = this.textarea.value;
    const key = `${text}\u0000${this.execPos?.line}\u0000${this.errorPos?.line}:${this.errorPos?.col}`;
    if (key === this.lastKey) return;
    this.lastKey = key;
    const lines = text.split('\n');
    const html = lines
      .map((text, i) => {
        const n = i + 1;
        const cls = ['ln'];
        if (this.execPos?.line === n) cls.push('exec');
        const mark = this.errorPos?.line === n ? this.errorPos.col : undefined;
        if (mark !== undefined) cls.push('err-line');
        return `<div class="${cls.join(' ')}">${highlightLine(text, mark) || '&#8203;'}</div>`;
      })
      .join('');
    this.overlay.innerHTML = html;
    if (lines.length !== this.lineCount || this.gutter.childElementCount === 0) {
      this.lineCount = lines.length;
      this.gutter.innerHTML = lines.map((_, i) => `<div class="gn">${i + 1}</div>`).join('');
    }
    [...this.gutter.children].forEach((g, i) => {
      g.classList.toggle('exec', this.execPos?.line === i + 1);
      g.classList.toggle('err', this.errorPos?.line === i + 1);
    });
    this.syncScroll();
  }

  private syncScroll() {
    this.overlay.scrollTop = this.textarea.scrollTop;
    this.overlay.scrollLeft = this.textarea.scrollLeft;
    this.gutter.scrollTop = this.textarea.scrollTop;
  }

  /** Scrolls the textarea just enough to show a line. */
  private revealLine(line: number) {
    const lh = parseFloat(getComputedStyle(this.textarea).lineHeight) || 22;
    const top = (line - 1) * lh;
    const bottom = top + lh;
    const ta = this.textarea;
    if (top < ta.scrollTop) ta.scrollTop = top;
    else if (bottom > ta.scrollTop + ta.clientHeight) ta.scrollTop = bottom - ta.clientHeight;
    this.syncScroll();
  }
}
