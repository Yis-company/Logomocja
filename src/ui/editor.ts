// Edytor: textarea z nakładką kolorującą składnię, numerami wierszy, znacznikiem błędu i wiersza.
import { COMMANDS, DEF_WORDS, END_WORDS, REP_WORDS } from "../interp/parser";
import { norm } from "../interp/lexer";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const TOKEN =
  /(;[^\n]*)|("[^"\n]*"?)|((?:\d+(?:\.\d+)?|\.\d+)[\p{L}\p{M}\p{N}_.]*)|(:[\p{L}_][\p{L}\p{M}\p{N}_]*)|([\p{L}_][\p{L}\p{M}\p{N}_]*:?)|([\[\]()])|(<=|>=|<>|[-+*\/<>=,])/gu;

export interface ErrorMark { offset: number; length: number; line: number; column: number; message: string }

/** Zamienia źródło na HTML z klasami składni; opcjonalnie oznacza zakres błędu. */
export function highlight(src: string, mark: ErrorMark | null): string {
  const procs = new Set<string>();
  for (const m of src.matchAll(/^[ \t]*(?:oto|to)[ \t]+([\p{L}_][\p{L}\p{M}\p{N}_]*)/gimu)) procs.add(norm(m[1]));
  const parts: { text: string; cls: string; start: number }[] = [];
  let last = 0;
  TOKEN.lastIndex = 0;
  for (let m = TOKEN.exec(src); m; m = TOKEN.exec(src)) {
    if (m.index > last) parts.push({ text: src.slice(last, m.index), cls: "", start: last });
    let cls = "";
    if (m[1]) cls = "t-com";
    else if (m[2]) cls = "t-str";
    else if (m[3]) cls = "t-num";
    else if (m[4]) cls = "t-name";
    else if (m[5]) {
      const w = norm(m[5]);
      if (w === "ma:") cls = "t-kw";
      else {
        const bare = w.endsWith(":") ? w.slice(0, -1) : w;
        if (w.endsWith(":")) { TOKEN.lastIndex--; m[0] = m[0].slice(0, -1); }
        if (COMMANDS.has(bare)) cls = "t-cmd";
        else if (DEF_WORDS.has(bare) || END_WORDS.has(bare)) cls = "t-kw";
        else if (REP_WORDS.has(bare)) cls = "t-num";
        else if (procs.has(bare)) cls = "t-proc";
        else cls = "t-name";
      }
    } else if (m[6]) cls = "t-br";
    else cls = "t-op";
    parts.push({ text: m[0], cls, start: m.index });
    last = m.index + m[0].length;
  }
  if (last < src.length) parts.push({ text: src.slice(last), cls: "", start: last });

  let html = "";
  const ms = mark ? mark.offset : -1;
  const me = mark ? mark.offset + mark.length : -1;
  const span = (text: string, cls: string) => (cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text));
  let bubbleDone = false;
  const bubble = () => {
    if (bubbleDone || !mark) return "";
    bubbleDone = true;
    return `<span class="err-bubble" role="presentation">${esc(mark.message)}</span>`;
  };
  for (const p of parts) {
    const s = p.start, e = p.start + p.text.length;
    if (!mark || e <= ms || s >= me) { html += span(p.text, p.cls); continue; }
    const a = Math.max(s, ms) - s, b = Math.min(e, me) - s;
    html += span(p.text.slice(0, a), p.cls);
    html += `<span class="err-mark">${bubble()}${span(p.text.slice(a, b), p.cls)}</span>`;
    html += span(p.text.slice(b), p.cls);
  }
  if (mark && !bubbleDone) html += `<span class="err-mark err-eof">${bubble()} </span>`;
  return html + "\n";
}

export class Editor {
  readonly root: HTMLElement;
  readonly textarea: HTMLTextAreaElement;
  onChange: ((value: string) => void) | null = null;
  private gutter: HTMLElement;
  private code: HTMLElement;
  private layer: HTMLElement;
  private band: HTMLElement;
  private mark: ErrorMark | null = null;
  private execLine = 0;
  private lines = 0;

  constructor(root: HTMLElement, label: string) {
    this.root = root;
    root.classList.add("editor");
    root.innerHTML = `
      <div class="ed-gutter" aria-hidden="true"></div>
      <div class="ed-main">
        <div class="ed-layer" aria-hidden="true"><div class="ed-band" hidden></div><pre class="ed-code"></pre></div>
        <textarea class="ed-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea>
      </div>`;
    this.gutter = root.querySelector(".ed-gutter")!;
    this.layer = root.querySelector(".ed-layer")!;
    this.code = root.querySelector(".ed-code")!;
    this.band = root.querySelector(".ed-band")!;
    this.textarea = root.querySelector("textarea")!;
    this.textarea.setAttribute("aria-label", label);
    this.textarea.addEventListener("input", () => {
      this.mark = null;
      this.paint();
      this.onChange?.(this.textarea.value);
    });
    this.textarea.addEventListener("scroll", () => this.syncScroll());
    this.textarea.addEventListener("keydown", (e) => this.keydown(e));
    this.paint();
  }

  get value(): string { return this.textarea.value; }

  setValue(v: string): void {
    this.textarea.value = v;
    this.mark = null;
    this.execLine = 0;
    this.textarea.scrollTop = 0;
    this.textarea.scrollLeft = 0;
    this.paint();
  }

  setError(mark: ErrorMark | null, reveal = false): void {
    this.mark = mark;
    this.paint();
    if (mark && reveal) this.revealLine(mark.line);
  }

  setExecLine(line: number, reveal = true): void {
    if (line === this.execLine) return;
    this.execLine = line;
    this.paintLines();
    if (line && reveal) this.revealLine(line);
  }

  focus(): void { this.textarea.focus(); }

  private lineHeight(): number {
    return parseFloat(getComputedStyle(this.textarea).lineHeight) || 21;
  }

  private revealLine(line: number): void {
    const lh = this.lineHeight();
    const ta = this.textarea;
    const top = (line - 1) * lh, pad = lh * 2;
    if (top < ta.scrollTop + pad) ta.scrollTop = Math.max(0, top - pad);
    else if (top + lh > ta.scrollTop + ta.clientHeight - pad) ta.scrollTop = top + lh - ta.clientHeight + pad;
    this.syncScroll();
  }

  private paint(): void {
    const src = this.textarea.value;
    this.code.innerHTML = highlight(src, this.mark);
    let n = 1;
    for (let i = 0; i < src.length; i++) if (src.charCodeAt(i) === 10) n++;
    if (n !== this.lines) {
      this.lines = n;
      let g = "";
      for (let i = 1; i <= n; i++) g += `<div class="ed-ln" data-ln="${i}">${i}</div>`;
      this.gutter.innerHTML = g;
    }
    this.paintLines();
    this.syncScroll();
  }

  private paintLines(): void {
    for (const el of this.gutter.querySelectorAll(".is-exec, .is-err")) el.classList.remove("is-exec", "is-err");
    if (this.execLine) this.gutter.children[this.execLine - 1]?.classList.add("is-exec");
    if (this.mark) this.gutter.children[this.mark.line - 1]?.classList.add("is-err");
    if (this.execLine) {
      this.band.hidden = false;
      this.band.style.top = `calc(var(--ed-pad) + ${(this.execLine - 1) * this.lineHeight()}px)`;
    } else this.band.hidden = true;
  }

  private syncScroll(): void {
    const ta = this.textarea;
    this.layer.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
    this.gutter.style.transform = `translateY(${-ta.scrollTop}px)`;
  }

  private insert(text: string): void {
    const ta = this.textarea;
    ta.focus();
    let ok = false;
    try { ok = document.execCommand("insertText", false, text); } catch { ok = false; }
    if (!ok) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  private keydown(e: KeyboardEvent): void {
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && !e.isComposing) {
      const ta = this.textarea;
      const before = ta.value.slice(0, ta.selectionStart);
      const lineStart = before.lastIndexOf("\n") + 1;
      const line = before.slice(lineStart);
      let indent = /^[ \t]*/.exec(line)![0];
      if (/\[\s*$/.test(line) || /^\s*(oto|to)\s/i.test(line)) indent += "  ";
      if (indent) { e.preventDefault(); this.insert("\n" + indent); }
    }
  }
}
