import { highlight } from "../core/highlight";
import type { LogoError } from "../core/interp";

export class Editor {
  root: HTMLElement;
  ta: HTMLTextAreaElement;
  onInput: (value: string) => void = () => {};
  private scroll: HTMLElement;
  private gutter: HTMLElement;
  private code: HTMLElement;
  private exec: HTMLElement;
  private bubble: HTMLElement;
  private lines = 0;
  private error: LogoError | null = null;
  private execLine: number | null = null;

  constructor(host: HTMLElement, label: string) {
    host.innerHTML = `
      <div class="ed-scroll">
        <div class="ed-gutter" aria-hidden="true"></div>
        <div class="ed-body">
          <div class="ed-exec" hidden></div>
          <pre class="ed-pre" aria-hidden="true"><code></code></pre>
          <textarea class="ed-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="${label}" aria-describedby="status"></textarea>
          <div class="ed-bubble" hidden></div>
        </div>
      </div>`;
    this.root = host;
    this.scroll = host.querySelector(".ed-scroll")!;
    this.gutter = host.querySelector(".ed-gutter")!;
    this.code = host.querySelector("code")!;
    this.exec = host.querySelector(".ed-exec")!;
    this.bubble = host.querySelector(".ed-bubble")!;
    this.ta = host.querySelector("textarea")!;
    this.ta.addEventListener("input", () => {
      this.render();
      this.onInput(this.ta.value);
    });
    this.ta.addEventListener("pointerdown", () => { this.bubble.hidden = true; });
    this.ta.addEventListener("keydown", (e) => this.key(e));
    this.render();
  }

  get value(): string {
    return this.ta.value;
  }

  setValue(text: string) {
    this.ta.value = text;
    this.error = null;
    this.execLine = null;
    this.render();
    this.scroll.scrollTop = 0;
    this.scroll.scrollLeft = 0;
  }

  setError(err: LogoError | null) {
    if (!err && !this.error) return;
    this.error = err;
    this.render();
  }

  setExecLine(line: number | null, reveal = false) {
    this.execLine = line;
    this.paintExec();
    if (line && reveal) this.reveal(line);
  }

  focusAt(line: number, column: number) {
    const rows = this.ta.value.split("\n");
    let pos = 0;
    for (let i = 0; i < Math.min(line - 1, rows.length); i++) pos += rows[i].length + 1;
    pos = Math.min(this.ta.value.length, pos + Math.max(0, column - 1));
    this.ta.focus();
    this.ta.setSelectionRange(pos, pos);
    this.reveal(line);
  }

  private lh(): number {
    return parseFloat(getComputedStyle(this.ta).lineHeight) || 22;
  }

  private reveal(line: number) {
    const lh = this.lh();
    const top = (line - 1) * lh;
    const s = this.scroll;
    if (top < s.scrollTop + lh) s.scrollTop = Math.max(0, top - lh * 2);
    else if (top > s.scrollTop + s.clientHeight - lh * 3) s.scrollTop = top - s.clientHeight + lh * 4;
  }

  private key(e: KeyboardEvent) {
    if (e.key !== "Enter" || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.isComposing) return;
    const ta = this.ta;
    const start = ta.selectionStart;
    const before = ta.value.slice(0, start);
    const line = before.slice(before.lastIndexOf("\n") + 1);
    let indent = /^[ \t]*/.exec(line)![0];
    if (/\[\s*$/.test(line)) indent += "  ";
    if (!indent) return;
    e.preventDefault();
    const text = "\n" + indent;
    // execCommand zachowuje historię cofania; setRangeText jest zapasem
    if (!document.execCommand || !document.execCommand("insertText", false, text)) {
      ta.setRangeText(text, start, ta.selectionEnd, "end");
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  private render() {
    const src = this.ta.value;
    this.code.innerHTML = highlight(src, this.error) + "\n ";
    const n = src.split("\n").length;
    if (n !== this.lines) {
      this.lines = n;
      let html = "";
      for (let i = 1; i <= n; i++) html += `<div>${i}</div>`;
      this.gutter.innerHTML = html;
    }
    this.gutter.querySelector(".is-error")?.classList.remove("is-error");
    this.bubble.hidden = true;
    if (this.error) {
      this.gutter.children[this.error.line - 1]?.classList.add("is-error");
      const mark = this.code.querySelector<HTMLElement>("[data-err]");
      if (mark) {
        this.bubble.textContent = this.error.message;
        this.bubble.hidden = false;
        const lh = this.lh();
        const max = Math.max(0, this.scroll.clientWidth - this.gutter.offsetWidth - Math.min(360, this.scroll.clientWidth * 0.8) - 12 + this.scroll.scrollLeft);
        this.bubble.style.left = `${Math.max(4, Math.min(mark.offsetLeft, max))}px`;
        this.bubble.style.top = `${mark.offsetTop + lh + 4}px`;
      }
    }
    this.paintExec();
  }

  private paintExec() {
    this.gutter.querySelector(".is-exec")?.classList.remove("is-exec");
    if (!this.execLine) {
      this.exec.hidden = true;
      return;
    }
    const lh = this.lh();
    this.exec.hidden = false;
    this.exec.style.top = `${(this.execLine - 1) * lh}px`;
    this.exec.style.height = `${lh}px`;
    this.gutter.children[this.execLine - 1]?.classList.add("is-exec");
  }
}
