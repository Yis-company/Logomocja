import { COMMAND_BY_ID, KEYWORDS } from '../lang/keywords';
import { lex, type Token } from '../lang/lexer';

export interface Run {
  text: string;
  cls: string;
  /** Kolor próbki dla literału koloru. */
  swatch?: string;
}

const CLASS_BY_GROUP = {
  move: 't-move',
  turn: 't-move',
  pen: 't-pen',
  style: 't-pen',
  flow: 't-flow',
  var: 't-flow',
  turn3d: 't-3d',
} as const;

interface Seg {
  start: number;
  end: number;
  cls: string;
  swatch?: string;
}

export const HIGHLIGHT_MAX_CHARS = 200_000;

/** Dzieli źródło na wiersze złożone z fragmentów o jednej klasie podświetlenia. */
export function highlight(source: string): Run[][] {
  const lineStarts: number[] = [0];
  for (let i = 0; i < source.length; i++) {
    const c = source.charCodeAt(i);
    if (c === 10) lineStarts.push(i + 1);
    else if (c === 13) {
      if (source.charCodeAt(i + 1) === 10) i++;
      lineStarts.push(i + 1);
    }
  }
  const lineCount = lineStarts.length;

  if (source.length > HIGHLIGHT_MAX_CHARS) return plainLines(source, lineStarts);

  const { tokens, comments } = lex(source, { limits: false });
  const procNames = new Set<string>();
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (t.kind === 'word' && t.firstOnLine && KEYWORDS.get(t.name)?.kind === 'def') {
      const n = tokens[i + 1];
      if (n && n.kind === 'word' && n.line === t.line) procNames.add(n.name);
    }
  }

  const segs: Seg[] = [];
  let depth = 0;
  for (const t of tokens) {
    const seg: Seg = { start: t.start, end: t.end, cls: classify(t, procNames) };
    if (t.kind === 'lbr') {
      seg.cls = `t-br t-br${depth % 3}`;
      depth++;
    } else if (t.kind === 'rbr') {
      depth--;
      seg.cls = depth < 0 ? 't-err' : `t-br t-br${depth % 3}`;
      if (depth < 0) depth = 0;
    } else if (t.kind === 'str') {
      const m = /^"(#[0-9a-fA-F]{6})"$/.exec(t.text);
      if (m) seg.swatch = m[1]!.toLowerCase();
      else seg.cls = 't-str t-bad';
    }
    segs.push(seg);
  }
  for (const [s, e] of comments) segs.push({ start: s, end: e, cls: 't-com' });
  segs.sort((a, b) => a.start - b.start);

  const lines: Run[][] = [];
  let si = 0;
  for (let li = 0; li < lineCount; li++) {
    const ls = lineStarts[li]!;
    let le = li + 1 < lineCount ? lineStarts[li + 1]! : source.length;
    // bez znaku nowego wiersza
    while (le > ls && (source.charCodeAt(le - 1) === 10 || source.charCodeAt(le - 1) === 13)) le--;
    const runs: Run[] = [];
    let pos = ls;
    while (si < segs.length && segs[si]!.end <= ls) si++;
    let sj = si;
    while (sj < segs.length && segs[sj]!.start < le) {
      const s = segs[sj]!;
      if (s.start > pos) runs.push({ text: source.slice(pos, s.start), cls: '' });
      const from = Math.max(s.start, pos);
      const to = Math.min(s.end, le);
      if (to > from) runs.push({ text: source.slice(from, to), cls: s.cls, swatch: s.swatch });
      pos = Math.max(pos, to);
      sj++;
    }
    if (pos < le) runs.push({ text: source.slice(pos, le), cls: '' });
    lines.push(runs);
  }
  return lines;
}

function plainLines(source: string, lineStarts: number[]): Run[][] {
  return lineStarts.map((ls, i) => {
    let le = i + 1 < lineStarts.length ? lineStarts[i + 1]! : source.length;
    while (le > ls && (source.charCodeAt(le - 1) === 10 || source.charCodeAt(le - 1) === 13)) le--;
    return [{ text: source.slice(ls, le), cls: '' }];
  });
}

function classify(t: Token, procNames: Set<string>): string {
  switch (t.kind) {
    case 'num': return 't-num';
    case 'str': return 't-str';
    case 'op': case 'cmp': case 'comma': case 'colon': return 't-op';
    case 'lpar': case 'rpar': return 't-par';
    case 'err': return 't-err';
    case 'cname': return 't-name';
    case 'word': {
      const kw = KEYWORDS.get(t.name);
      if (kw) {
        if (kw.kind === 'cmd') return CLASS_BY_GROUP[COMMAND_BY_ID.get(kw.id)!.group];
        if (kw.kind === 'repcount') return 't-rep';
        return 't-def';
      }
      return procNames.has(t.name) ? 't-proc' : 't-name';
    }
    default: return '';
  }
}

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
export function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ESC[c]!);
}

export function runsToHtml(runs: Run[]): string {
  let out = '';
  for (const r of runs) {
    const t = escapeHtml(r.text);
    if (!r.cls) out += t;
    else if (r.swatch) out += `<span class="${r.cls}" style="--sw:${r.swatch}">${t}</span>`;
    else out += `<span class="${r.cls}">${t}</span>`;
  }
  return out;
}

/** Podświetlony kod jako HTML (do stron z opisem i przykładami). */
export function highlightToHtml(source: string): string {
  return highlight(source).map((runs) => `<span class="code-line">${runsToHtml(runs)}</span>`).join('\n');
}
