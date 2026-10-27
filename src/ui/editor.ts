import { highlight, type Mark } from './highlight';

export interface EditorOptions {
  onChange: (value: string) => void;
  onRun: () => void;
}

/**
 * A lightweight code editor: a textarea for input, a highlighted <pre> behind it
 * and a line-number gutter. Lines never wrap so the layers stay aligned.
 */
export class Editor {
  readonly root: HTMLElement;
  private readonly gutter: HTMLElement;
  private readonly pre: HTMLElement;
  private readonly code: HTMLElement;
  private readonly textarea: HTMLTextAreaElement;
  private marks: Mark[] = [];
  private lineCount = 0;

  constructor(root: HTMLElement, private readonly opts: EditorOptions) {
    this.root = root;
    root.classList.add('editor');
    root.innerHTML = `
      <div class="editor-gutter" aria-hidden="true"><div class="editor-gutter-inner"></div></div>
      <div class="editor-body">
        <pre class="editor-highlight" aria-hidden="true"><code></code></pre>
        <textarea class="editor-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Program w języku Logo"></textarea>
      </div>`;
    this.gutter = root.querySelector('.editor-gutter-inner')!;
    this.pre = root.querySelector('.editor-highlight')!;
    this.code = this.pre.querySelector('code')!;
    this.textarea = root.querySelector('textarea')!;

    this.textarea.addEventListener('input', () => {
      this.marks = [];
      this.render();
      this.opts.onChange(this.textarea.value);
    });
    this.textarea.addEventListener('scroll', () => this.syncScroll());
    this.textarea.addEventListener('keydown', (e) => this.onKeyDown(e));
    this.render();
  }

  get value(): string {
    return this.textarea.value;
  }

  set value(v: string) {
    this.textarea.value = v;
    this.marks = [];
    this.render();
    this.textarea.scrollTop = 0;
    this.textarea.scrollLeft = 0;
    this.syncScroll();
  }

  focus(): void {
    this.textarea.focus();
  }

  /** Replaces all marks (error underline / active statement). */
  setMarks(marks: Mark[]): void {
    this.marks = marks;
    this.render();
  }

  /** Places the caret at a 1-based line/column and scrolls it into view. */
  goTo(line: number, column: number): void {
    const lines = this.textarea.value.split('\n');
    let offset = 0;
    for (let i = 0; i < line - 1 && i < lines.length; i++) offset += lines[i]!.length + 1;
    offset += Math.max(0, column - 1);
    offset = Math.min(offset, this.textarea.value.length);
    this.textarea.focus();
    this.textarea.setSelectionRange(offset, offset);
    this.revealLine(line);
  }

  revealLine(line: number): void {
    const lineHeight = parseFloat(getComputedStyle(this.textarea).lineHeight) || 20;
    const top = (line - 1) * lineHeight;
    const ta = this.textarea;
    const pad = lineHeight * 2;
    if (top < ta.scrollTop + pad) ta.scrollTop = Math.max(0, top - pad);
    else if (top + lineHeight > ta.scrollTop + ta.clientHeight - pad) ta.scrollTop = top - ta.clientHeight + pad + lineHeight;
    this.syncScroll();
  }

  private onKeyDown(e: KeyboardEvent): void {
    const ta = this.textarea;
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.opts.onRun();
      return;
    }
    if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      this.insert('  ');
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
      // Keep the indentation of the current line.
      const start = ta.selectionStart;
      const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
      const indent = /^[ \t]*/.exec(ta.value.slice(lineStart, start))?.[0] ?? '';
      if (indent) {
        e.preventDefault();
        this.insert('\n' + indent);
      }
    }
  }

  private insert(text: string): void {
    const ta = this.textarea;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (typeof ta.setRangeText === 'function') {
      ta.setRangeText(text, start, end, 'end');
    } else {
      ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
      ta.selectionStart = ta.selectionEnd = start + text.length;
    }
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private render(): void {
    const src = this.textarea.value;
    // Trailing newline so the last (empty) line keeps its height.
    this.code.innerHTML = highlight(src, this.marks) + '\n';
    const n = src.split('\n').length;
    if (n !== this.lineCount) {
      this.lineCount = n;
      let g = '';
      for (let i = 1; i <= n; i++) g += `<span>${i}</span>`;
      this.gutter.innerHTML = g;
    }
    const markedLines = new Set(this.marks.map((m) => m.line));
    const spans = this.gutter.children;
    for (let i = 0; i < spans.length; i++) {
      const ln = i + 1;
      const el = spans[i] as HTMLElement;
      const mark = this.marks.find((m) => m.line === ln);
      el.className = markedLines.has(ln) && mark ? `ln-${mark.cls}` : '';
    }
    this.syncScroll();
  }

  private syncScroll(): void {
    const { scrollTop, scrollLeft } = this.textarea;
    this.pre.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    this.gutter.style.transform = `translateY(${-scrollTop}px)`;
  }
}
