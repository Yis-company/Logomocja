// Textarea + highlighted overlay code editor with line numbers, error marker and active line.
import { COMMANDS } from "../lang/parser";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const TOKEN_RE = /(;.*)|("[^"\s\[\]]*"?)|(\d+(?:\.\d*)?|\.\d+)|(:?[\p{L}\p{N}_]+:?)|([\[\]])|([()])|([+\-*/]|<=|>=|<>|[<>=]|,)|(\s+)|(.)/gu;

const DEF = new Set(["oto", "to", "już", "juz", "end", "ma:"]);
const VALUE = new Set(["nrpowt", "repcount"]);

export function highlightLine(line: string, procs: Set<string>): string {
  let out = "";
  for (const m of line.matchAll(TOKEN_RE)) {
    const [text, com, str, num, word, br, par, op] = m;
    let cls = "";
    if (com) cls = "t-com";
    else if (str) cls = /^"#[0-9a-fA-F]{6}"$/.test(str) ? "t-str" : "t-bad";
    else if (num) cls = "t-num";
    else if (word) {
      const w = word.toLowerCase();
      if (DEF.has(w)) cls = "t-def";
      else if (COMMANDS[w]) cls = "t-cmd";
      else if (VALUE.has(w)) cls = "t-val";
      else if (procs.has(w)) cls = "t-proc";
      else cls = "t-name";
    } else if (br) cls = "t-br";
    else if (par) cls = "t-par";
    else if (op) cls = "t-op";
    out += cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text);
  }
  return out;
}

export interface EditorMarker {
  line: number;
  column: number;
  message: string;
}

export class Editor {
  root: HTMLElement;
  ta: HTMLTextAreaElement;
  private hl: HTMLElement;
  private gutter: HTMLElement;
  private marker: EditorMarker | null = null;
  private active = 0;
  onInput: () => void = () => {};

  constructor(root: HTMLElement) {
    this.root = root;
    root.classList.add("editor");
    root.innerHTML = `
      <div class="ed-gutter" aria-hidden="true"><div class="ed-gutter-inner"></div></div>
      <div class="ed-body">
        <div class="ed-hl" aria-hidden="true"></div>
        <textarea class="ed-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"
          aria-label="Program w języku Logo" aria-describedby="error-box"></textarea>
      </div>`;
    this.ta = root.querySelector("textarea")!;
    this.hl = root.querySelector(".ed-hl")!;
    this.gutter = root.querySelector(".ed-gutter-inner")!;
    this.ta.addEventListener("input", () => {
      this.marker = null;
      this.render();
      this.onInput();
    });
    this.ta.addEventListener("scroll", () => this.syncScroll());
    this.ta.addEventListener("keydown", (e) => this.keydown(e));
    this.render();
  }

  get value() {
    return this.ta.value;
  }
  set value(v: string) {
    this.ta.value = v;
    this.marker = null;
    this.active = 0;
    this.render();
    this.ta.scrollTop = 0;
    this.syncScroll();
  }

  setMarker(m: EditorMarker | null) {
    this.marker = m;
    this.render();
  }
  setActiveLine(n: number) {
    if (n === this.active) return;
    this.active = n;
    this.render();
    if (n > 0) this.scrollToLine(n);
  }

  focusAt(line: number, column: number) {
    const lines = this.ta.value.split("\n");
    let off = 0;
    for (let i = 0; i < line - 1 && i < lines.length; i++) off += lines[i]!.length + 1;
    off += column - 1;
    this.ta.focus();
    this.ta.setSelectionRange(off, off);
    this.scrollToLine(line);
  }

  private scrollToLine(n: number) {
    const lh = parseFloat(getComputedStyle(this.ta).lineHeight) || 20;
    const top = (n - 1) * lh;
    const pad = 8;
    if (top < this.ta.scrollTop) this.ta.scrollTop = Math.max(0, top - pad);
    else if (top + lh > this.ta.scrollTop + this.ta.clientHeight - pad * 2) this.ta.scrollTop = top + lh * 2 - this.ta.clientHeight + pad * 2;
  }

  private keydown(e: KeyboardEvent) {
    // Enter keeps the indentation of the current line.
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      const { selectionStart: s, selectionEnd: en, value } = this.ta;
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      const indent = /^[ \t]*/.exec(value.slice(lineStart, s))![0];
      if (indent) {
        e.preventDefault();
        this.ta.setRangeText("\n" + indent, s, en, "end");
        this.ta.dispatchEvent(new Event("input"));
      }
    }
  }

  private syncScroll() {
    const { scrollTop, scrollLeft } = this.ta;
    this.hl.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    this.gutter.style.transform = `translateY(${-scrollTop}px)`;
  }

  render() {
    const src = this.ta.value;
    const lines = src.split("\n");
    const procs = new Set<string>();
    for (const m of src.matchAll(/^\s*(?:oto|to)\s+([\p{L}\p{N}_]+)/gimu)) procs.add(m[1]!.toLowerCase());
    let html = "";
    let gut = "";
    lines.forEach((ln, i) => {
      const n = i + 1;
      const cls = ["ed-line"];
      if (n === this.active) cls.push("is-active");
      let body = highlightLine(ln, procs);
      if (this.marker && this.marker.line === n) {
        cls.push("is-error");
        body = this.markLine(ln, this.marker.column, procs);
      }
      html += `<div class="${cls.join(" ")}">${body || " "}</div>`;
      const g = ["ed-num"];
      if (n === this.active) g.push("is-active");
      if (this.marker && this.marker.line === n) g.push("is-error");
      gut += `<div class="${g.join(" ")}">${this.marker && this.marker.line === n ? "⚠" : n}</div>`;
    });
    if (this.marker && this.marker.line > lines.length) {
      html += `<div class="ed-line is-error"><span class="ed-err"> </span></div>`;
    }
    this.hl.innerHTML = html;
    this.gutter.innerHTML = gut;
  }

  private markLine(ln: string, col: number, procs: Set<string>): string {
    const i = Math.max(0, Math.min(col - 1, ln.length));
    const rest = ln.slice(i);
    const m = /^(:?[\p{L}\p{N}_.]+:?|"[^"\s]*"?|<=|>=|<>|\S)/u.exec(rest);
    const len = m ? m[0].length : 0;
    const before = highlightLine(ln.slice(0, i), procs);
    const tok = len ? esc(rest.slice(0, len)) : " ";
    const msg = esc(this.marker!.message);
    return `${before}<span class="ed-err" title="${msg}">${tok}</span>${highlightLine(rest.slice(len), procs)}`;
  }
}
