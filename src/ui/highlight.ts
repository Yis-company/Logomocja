import { COMMAND_BY_WORD, DEFINE_WORDS, END_WORDS } from '../logo/commands';

export interface Mark {
  line: number;
  column: number;
  length: number;
  cls: 'err' | 'active';
}

type Piece = [text: string, cls: string];

const NUMBER_RE = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
const COLOR_RE = /^"#[0-9a-fA-F]{6}"$/;
const LINE_RE = /(;.*$)|("[^"\s]*"?)|([[\],])|(\s+)|([^\s[\],;"]+)/g;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function classify(word: string): string {
  const lower = word.toLowerCase();
  if (NUMBER_RE.test(word)) return 'num';
  if (DEFINE_WORDS.has(lower) || END_WORDS.has(lower) || lower === 'ma:') return 'kw';
  if (COMMAND_BY_WORD.has(lower)) return 'cmd';
  if (word.startsWith(':') && word.length > 1) return 'param';
  return 'ident';
}

function piecesForLine(line: string): Piece[] {
  const out: Piece[] = [];
  LINE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = LINE_RE.exec(line)) !== null) {
    if (m[1] !== undefined) out.push([m[1], 'comment']);
    else if (m[2] !== undefined) out.push([m[2], COLOR_RE.test(m[2]) ? 'color' : 'badcolor']);
    else if (m[3] !== undefined) out.push([m[3], 'bracket']);
    else if (m[4] !== undefined) out.push([m[4], '']);
    else if (m[5] !== undefined) out.push([m[5], classify(m[5])]);
    if (m[0].length === 0) LINE_RE.lastIndex++;
  }
  return out;
}

/** Splits pieces so that [start, start+len) becomes its own piece with an extra class. */
function applyMark(pieces: Piece[], start: number, len: number, cls: string): Piece[] {
  const out: Piece[] = [];
  let pos = 0;
  const end = start + Math.max(len, 1);
  for (const [text, c] of pieces) {
    const a = pos;
    const b = pos + text.length;
    pos = b;
    if (b <= start || a >= end) {
      out.push([text, c]);
      continue;
    }
    const s = Math.max(a, start);
    const e = Math.min(b, end);
    if (s > a) out.push([text.slice(0, s - a), c]);
    out.push([text.slice(s - a, e - a), `${c} ${cls}`.trim()]);
    if (e < b) out.push([text.slice(e - a), c]);
  }
  // Mark at end of line (e.g. missing argument reported at EOF column).
  if (pos < start) {
    out.push([' '.repeat(start - pos), '']);
    out.push([' ', cls]);
  } else if (pos === start) {
    out.push([' ', cls]);
  }
  return out;
}

/** Renders source to highlighted HTML, one `<span class="ln">` per line, with optional marks. */
export function highlight(source: string, marks: Mark[]): string {
  const lines = source.split('\n');
  const byLine = new Map<number, Mark[]>();
  for (const m of marks) {
    const arr = byLine.get(m.line) ?? [];
    arr.push(m);
    byLine.set(m.line, arr);
  }
  const html: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    let pieces = piecesForLine(lines[i]!);
    const ms = byLine.get(i + 1);
    if (ms) for (const m of ms) pieces = applyMark(pieces, m.column - 1, m.length, m.cls);
    let s = '';
    for (const [text, cls] of pieces) {
      const esc = escapeHtml(text);
      if (cls === 'color') {
        const hex = text.slice(1, 8).toLowerCase();
        s += `<span class="color"><i class="swatch" style="background:${hex}"></i>${esc}</span>`;
      } else if (cls) {
        s += `<span class="${cls}">${esc}</span>`;
      } else {
        s += esc;
      }
    }
    html.push(s);
  }
  return html.join('\n');
}
