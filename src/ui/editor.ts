import { highlight, type Mark } from "./highlight";

export interface EditorMarks {
  error?: { line: number; column: number; length: number } | null;
  active?: { line: number; column: number; length: number } | null;
}

/**
 * Plain textarea with a syntax-highlighted overlay and line numbers.
 * Native editing, undo, IME and mobile keyboards keep working.
 */
export class CodeEditor {
  readonly element: HTMLDivElement;
  readonly textarea: HTMLTextAreaElement;
  private readonly overlay: HTMLDivElement;
  private readonly gutter: HTMLDivElement;
  private marks: EditorMarks = {};
  private lineCount = 0;
  private pending = 0;

  constructor(host: HTMLElement, private readonly onInput: (value: string) => void) {
    this.element = document.createElement("div");
    this.element.className = "editor";
    this.gutter = document.createElement("div");
    this.gutter.className = "editor-gutter";
    this.gutter.setAttribute("aria-hidden", "true");
    const body = document.createElement("div");
    body.className = "editor-body";
    this.overlay = document.createElement("div");
    this.overlay.className = "editor-hl";
    this.overlay.setAttribute("aria-hidden", "true");
    this.textarea = document.createElement("textarea");
    this.textarea.className = "editor-input";
    this.textarea.spellcheck = false;
    this.textarea.wrap = "off";
    this.textarea.setAttribute("autocapitalize", "off");
    this.textarea.setAttribute("autocomplete", "off");
    this.textarea.setAttribute("autocorrect", "off");
    this.textarea.setAttribute("aria-label", "Program w języku Logo");
    body.append(this.overlay, this.textarea);
    this.element.append(this.gutter, body);
    host.append(this.element);

    this.textarea.addEventListener("input", () => {
      this.refresh();
      this.onInput(this.textarea.value);
    });
    this.textarea.addEventListener("scroll", () => this.syncScroll());
    this.textarea.addEventListener("keydown", (e) => this.onKey(e));
  }

  get value(): string {
    return this.textarea.value;
  }

  /** Replace the whole text; keeps native undo where the browser supports it. */
  setValue(value: string, undoable = false): void {
    if (undoable && document.activeElement !== null) {
      this.textarea.focus();
      this.textarea.select();
      // execCommand keeps the change on the undo stack; fall back when unsupported.
      let ok = false;
      try {
        ok = document.execCommand("insertText", false, value);
      } catch {
        ok = false;
      }
      if (!ok || this.textarea.value !== value) this.textarea.value = value;
      this.textarea.setSelectionRange(0, 0);
      this.textarea.scrollTop = 0;
    } else {
      this.textarea.value = value;
    }
    this.refresh();
  }

  setMarks(marks: EditorMarks): void {
    const same =
      JSON.stringify(marks.error ?? null) === JSON.stringify(this.marks.error ?? null) &&
      JSON.stringify(marks.active ?? null) === JSON.stringify(this.marks.active ?? null);
    if (same) return;
    this.marks = marks;
    this.refresh();
  }

  /** Put the caret at a 1-based position and scroll it into view. */
  reveal(line: number, column: number, length = 0): void {
    const off = this.offsetOf(line, column);
    this.textarea.focus({ preventScroll: true });
    this.textarea.setSelectionRange(off, off + length);
    this.scrollToLine(line);
  }

  scrollToLine(line: number): void {
    const lh = parseFloat(getComputedStyle(this.textarea).lineHeight) || 20;
    const top = (line - 1) * lh;
    const ta = this.textarea;
    if (top < ta.scrollTop + lh || top > ta.scrollTop + ta.clientHeight - 2 * lh) {
      ta.scrollTop = Math.max(0, top - ta.clientHeight / 3);
    }
  }

  private offsetOf(line: number, column: number): number {
    const text = this.textarea.value;
    let off = 0;
    for (let l = 1; l < line; l++) {
      const nl = text.indexOf("\n", off);
      if (nl < 0) return text.length;
      off = nl + 1;
    }
    return Math.min(text.length, off + column - 1);
  }

  refresh(): void {
    if (this.pending) return;
    this.pending = requestAnimationFrame(() => {
      this.pending = 0;
      this.paint();
    });
  }

  private paint(): void {
    const src = this.textarea.value;
    const marks: Mark[] = [];
    const lineClasses = new Map<number, string>();
    const { error, active } = this.marks;
    if (active) {
      marks.push({ offset: this.offsetOf(active.line, active.column), length: active.length, cls: "m-active" });
      lineClasses.set(active.line, "line-active");
    }
    if (error) {
      marks.push({ offset: this.offsetOf(error.line, error.column), length: error.length, cls: "m-error" });
      lineClasses.set(error.line, "line-error");
    }
    this.overlay.innerHTML = `<div class="editor-hl-inner">${highlight(src, marks, lineClasses)}</div>`;

    const lines = src.split("\n").length;
    if (lines !== this.lineCount || error || active || this.gutter.querySelector(".err,.act")) {
      this.lineCount = lines;
      let html = "";
      for (let i = 1; i <= lines; i++) {
        const cls = error?.line === i ? "err" : active?.line === i ? "act" : "";
        html += `<div${cls ? ` class="${cls}"` : ""}>${i}</div>`;
      }
      this.gutter.innerHTML = `<div class="editor-gutter-inner">${html}</div>`;
    }
    this.syncScroll();
  }

  private syncScroll(): void {
    const { scrollTop, scrollLeft } = this.textarea;
    const inner = this.overlay.firstElementChild as HTMLElement | null;
    if (inner) inner.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    const g = this.gutter.firstElementChild as HTMLElement | null;
    if (g) g.style.transform = `translateY(${-scrollTop}px)`;
  }

  private insert(text: string): void {
    let ok = false;
    try {
      ok = document.execCommand("insertText", false, text);
    } catch {
      ok = false;
    }
    if (!ok) this.textarea.setRangeText(text, this.textarea.selectionStart, this.textarea.selectionEnd, "end");
    this.refresh();
    this.onInput(this.textarea.value);
  }

  private onKey(e: KeyboardEvent): void {
    const ta = this.textarea;
    if (e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
      // Tab indents; Esc first lets keyboard users leave the editor.
      if (ta.dataset.escaped === "1") {
        delete ta.dataset.escaped;
        return;
      }
      e.preventDefault();
      this.insert("  ");
      return;
    }
    if (e.key === "Escape") {
      ta.dataset.escaped = "1";
      return;
    }
    delete ta.dataset.escaped;
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && !e.isComposing) {
      // Keep the indentation of the current line.
      const start = ta.selectionStart;
      const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
      const indent = /^[ \t]*/.exec(ta.value.slice(lineStart, start))![0];
      if (indent) {
        e.preventDefault();
        this.insert("\n" + indent);
      }
    }
  }
}
