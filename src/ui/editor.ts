import { highlight } from './highlight';
import type { Pos } from '../logo/index';

export const LINE_HEIGHT = 24;
export const PAD = 12;

/**
 * A textarea laid over a highlighted copy of its text. Both share font metrics, so the
 * overlay lines up with the caret; markers for the running line and the error are bands
 * positioned by line number.
 */
export class CodeEditor {
  readonly textarea: HTMLTextAreaElement;
  private readonly gutter: HTMLElement;
  private readonly hl: HTMLElement;
  private readonly execBand: HTMLElement;
  private readonly errBand: HTMLElement;
  private readonly errMark: HTMLElement;
  private readonly layers: HTMLElement;
  onInput: (() => void) | null = null;

  constructor(root: HTMLElement) {
    root.classList.add('code');
    root.innerHTML = `
      <div class="gutter" aria-hidden="true"></div>
      <div class="layers">
        <pre class="hl" aria-hidden="true"></pre>
        <div class="band band-exec" hidden></div>
        <div class="band band-err" hidden></div>
        <div class="mark-err" hidden></div>
        <textarea class="src" id="src" spellcheck="false" autocapitalize="off" autocomplete="off"
          aria-label="Program w języku Logo. Wiersze i kolumny podano w pasku stanu."></textarea>
      </div>`;
    this.gutter = root.querySelector('.gutter')!;
    this.layers = root.querySelector('.layers')!;
    this.hl = root.querySelector('.hl')!;
    this.execBand = root.querySelector('.band-exec')!;
    this.errBand = root.querySelector('.band-err')!;
    this.errMark = root.querySelector('.mark-err')!;
    this.textarea = root.querySelector('textarea')!;
    this.textarea.addEventListener('input', () => {
      this.refresh();
      this.onInput?.();
    });
  }

  get value(): string {
    return this.textarea.value;
  }

  set value(text: string) {
    this.textarea.value = text;
    this.refresh();
  }

  /** Re-draws the highlight, gutter and sizes after the text changed. */
  refresh() {
    const text = this.textarea.value;
    const lines = text.split('\n');
    const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
    this.hl.innerHTML = highlight(text) + '\n';
    this.gutter.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    const height = lines.length * LINE_HEIGHT + PAD * 2 + LINE_HEIGHT;
    this.textarea.style.height = `${height}px`;
    this.layers.style.height = `${height}px`;
    this.layers.style.minWidth = `calc(${longest + 4}ch + ${PAD * 2}px)`;
  }

  /** Marks the line that is executing now (null to clear). */
  setExec(pos: Pos | null) {
    this.setBand(this.execBand, pos);
  }

  /** Marks the error position (null to clear). */
  setError(pos: Pos | null) {
    this.setBand(this.errBand, pos);
    if (pos) {
      this.errMark.hidden = false;
      this.errMark.style.top = `${PAD + (pos.line - 1) * LINE_HEIGHT}px`;
      this.errMark.style.left = `calc(${PAD}px + ${pos.column - 1}ch)`;
    } else {
      this.errMark.hidden = true;
    }
  }

  private setBand(el: HTMLElement, pos: Pos | null) {
    if (!pos) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.style.top = `${PAD + (pos.line - 1) * LINE_HEIGHT}px`;
    el.style.height = `${LINE_HEIGHT}px`;
  }

  /** Scrolls so that a line is visible. */
  reveal(pos: Pos) {
    const top = PAD + (pos.line - 1) * LINE_HEIGHT;
    const box = this.layers.parentElement!;
    if (top < box.scrollTop + LINE_HEIGHT || top > box.scrollTop + box.clientHeight - 2 * LINE_HEIGHT) {
      box.scrollTop = Math.max(0, top - box.clientHeight / 3);
    }
  }
}
