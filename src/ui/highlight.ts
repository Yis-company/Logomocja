import { lex, type Token } from "../lang/lexer";
import { END_WORDS, PARAMS_WORD, PRIMITIVES, REPEAT_WORDS, TO_WORDS, norm } from "../lang/names";

export interface Mark {
  offset: number;
  length: number;
  cls: string;
}

const COLOR_RE = /^"#[0-9a-fA-F]{6}"$/;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Turn source text into highlighted HTML, one block per line, so the overlay
 * lines up exactly with the textarea above it.
 */
export function highlight(source: string, marks: Mark[], lineClasses: Map<number, string>): string {
  let tokens: Token[] = [];
  let comments: Array<{ offset: number; length: number }> = [];
  try {
    ({ tokens, comments } = lex(source, true));
  } catch {
    /* tolerant lexing does not throw */
  }

  // Procedure names (anywhere) and parameter names (per definition body).
  const procNames = new Set<string>();
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (t.type === "word" && t.lineStart && TO_WORDS.has(norm(t.text))) {
      const n = tokens[i + 1];
      if (n && n.type === "word") procNames.add(norm(n.text));
    }
  }

  const classes = new Map<number, string>();
  let params: Set<string> | null = null;
  let inHeader = false;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (t.type === "newline") {
      inHeader = false;
      continue;
    }
    let cls = "";
    const k = norm(t.text);
    if (t.type === "number") cls = "t-num";
    else if (t.type === "string") cls = COLOR_RE.test(t.text) ? "t-str" : "t-bad";
    else if (t.type === "lbracket" || t.type === "rbracket") cls = "t-br";
    else if (t.type === "comma") cls = "t-punct";
    else if (t.lineStart && TO_WORDS.has(k)) {
      cls = "t-ctl";
      params = new Set();
      inHeader = true;
      const n = tokens[i + 1];
      if (n && n.type === "word") {
        classes.set(n.offset, "t-procdef");
        i++;
      }
    } else if (END_WORDS.has(k)) {
      cls = "t-ctl";
      if (t.lineStart) params = null;
    } else if (inHeader && k.startsWith(PARAMS_WORD)) {
      cls = "t-ctl";
      if (k.length > PARAMS_WORD.length) params?.add(k.slice(PARAMS_WORD.length).replace(/^:/, ""));
    } else if (inHeader && t.type === "word") {
      cls = "t-param";
      params?.add(k.replace(/^:/, ""));
    } else if (PRIMITIVES.has(k)) cls = "t-cmd";
    else if (REPEAT_WORDS.has(k)) cls = "t-ctl";
    else if (k.startsWith(":") || params?.has(k)) cls = "t-param";
    else if (procNames.has(k)) cls = "t-proc";
    if (cls && !classes.has(t.offset)) classes.set(t.offset, cls);
  }

  type Span = { offset: number; length: number; cls: string; style?: string };
  const spans: Span[] = [];
  for (const t of tokens) {
    if (t.type === "newline") continue;
    const cls = classes.get(t.offset) ?? "";
    const extra = marks.filter((m) => m.offset >= t.offset && m.offset < t.offset + Math.max(1, t.length));
    const all = [cls, ...extra.map((m) => m.cls)].filter(Boolean).join(" ");
    const style = cls === "t-str" ? `--swatch:${t.text.slice(1, -1)}` : undefined;
    if (all) spans.push({ offset: t.offset, length: t.length, cls: all, style });
  }
  for (const c of comments) spans.push({ offset: c.offset, length: c.length, cls: "t-com" });
  // Marks that do not fall on any token (e.g. past the end of a line).
  for (const m of marks) {
    if (!spans.some((s) => m.offset >= s.offset && m.offset < s.offset + Math.max(1, s.length))) {
      spans.push({ offset: m.offset, length: 0, cls: m.cls + " t-caret" });
    }
  }
  spans.sort((a, b) => a.offset - b.offset);

  let html = "";
  let pos = 0;
  let line = 1;
  const openLine = () => `<div class="hl-line${lineClasses.has(line) ? " " + lineClasses.get(line) : ""}">`;
  html += openLine();
  const emitText = (text: string) => {
    const parts = text.split("\n");
    parts.forEach((p, idx) => {
      if (idx > 0) {
        line++;
        html += "</div>" + openLine();
      }
      html += esc(p);
    });
  };
  for (const s of spans) {
    if (s.offset < pos) continue;
    emitText(source.slice(pos, s.offset));
    const style = s.style ? ` style="${s.style}"` : "";
    html += `<span class="${s.cls}"${style}>${esc(source.slice(s.offset, s.offset + s.length))}</span>`;
    pos = s.offset + s.length;
  }
  emitText(source.slice(pos));
  html += "</div>";
  return html;
}
