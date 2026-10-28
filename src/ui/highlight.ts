import { lex, type Token } from '../lang/lexer';
import { escapeHtml } from './dom';

const CONTROL = new Set(['repeat', 'if', 'ifelse', 'stop', 'to', 'end', 'let']);

function tokenClass(t: Token, procs: Set<string>, depth: number): string {
  switch (t.kind) {
    case 'num': return 'tk-num';
    case 'str': return /^#[0-9a-fA-F]{6}$/.test(t.str!) ? 'tk-str' : 'tk-bad';
    case 'lbr': case 'rbr': return `tk-br tk-d${depth % 3}`;
    case 'lpar': case 'rpar': return 'tk-par';
    case 'op': case 'cmp': return 'tk-op';
    case 'comma': return 'tk-op';
    case 'bad': return 'tk-bad';
    case 'word':
      if (t.name === 'ma:') return 'tk-ctl';
      if (t.keyword === 'repcount') return 'tk-val';
      if (t.keyword) return CONTROL.has(t.keyword) ? 'tk-ctl' : 'tk-cmd';
      if (!t.colon && procs.has(t.name!)) return 'tk-proc';
      return 'tk-name';
  }
}

export interface HighlightMark {
  /** Przesunięcia w źródle. */
  start: number;
  end: number;
  cls: string;
  /** Dopisek na końcu wiersza (np. treść błędu). */
  note?: string;
}

/**
 * Zamienia źródło na HTML z kolorowaniem składni. Zwraca tablicę wierszy
 * (bez znaków nowego wiersza), żeby edytor mógł je łatwo złożyć.
 */
export function highlightLines(source: string, mark?: HighlightMark | null): string[] {
  const { tokens, comments } = lex(source);
  const procs = new Set<string>();
  for (let k = 0; k < tokens.length - 1; k++) {
    const t = tokens[k]!;
    if (t.kind === 'word' && t.keyword === 'to' && t.firstOnLine) {
      const n = tokens[k + 1]!;
      if (n.kind === 'word' && n.line === t.line && !n.keyword) procs.add(n.name!);
    }
  }
  // Przedziały do pokolorowania, posortowane po początku.
  type Span = { start: number; end: number; cls: string; style?: string };
  const spans: Span[] = [];
  let depth = 0;
  for (const t of tokens) {
    let d = depth;
    if (t.kind === 'lbr') { d = depth; depth++; }
    else if (t.kind === 'rbr') { depth = Math.max(0, depth - 1); d = depth; }
    const span: Span = { start: t.start, end: t.end, cls: tokenClass(t, procs, d) };
    if (t.kind === 'str' && span.cls === 'tk-str') span.style = `--swatch:${t.str!.toLowerCase()}`;
    spans.push(span);
  }
  for (const c of comments) spans.push({ start: c.start, end: c.end, cls: 'tk-com' });
  spans.sort((a, b) => a.start - b.start);

  // Wynik budujemy znak po znaku przez przedziały, dzieląc na wiersze.
  const out: string[] = [];
  let line = '';
  let pos = 0;
  const emitText = (text: string, cls?: string, style?: string) => {
    const parts = text.split(/\r\n|\r|\n/);
    parts.forEach((p, idx) => {
      if (idx > 0) { out.push(line); line = ''; }
      if (!p) return;
      const e = escapeHtml(p);
      line += cls ? `<span class="${cls}"${style ? ` style="${style}"` : ''}>${e}</span>` : e;
    });
  };
  const markStart = mark ? mark.start : -1;
  const markEnd = mark ? Math.max(mark.end, mark.start + 1) : -1;
  const emitRange = (from: number, to: number, cls?: string, style?: string) => {
    // Dzieli fragment na część przed znacznikiem, w znaczniku i po nim.
    if (mark && from < markEnd && to > markStart) {
      const a = Math.max(from, markStart), b = Math.min(to, markEnd);
      if (from < a) emitText(source.slice(from, a), cls, style);
      emitText(source.slice(a, b), `${cls ?? ''} ${mark.cls}`.trim(), style);
      if (b < to) emitText(source.slice(b, to), cls, style);
    } else {
      emitText(source.slice(from, to), cls, style);
    }
  };
  for (const sp of spans) {
    if (sp.start < pos) continue;
    if (sp.start > pos) emitRange(pos, sp.start);
    emitRange(sp.start, sp.end, sp.cls, sp.style);
    pos = sp.end;
  }
  if (pos < source.length) emitRange(pos, source.length);
  // Znacznik za końcem tekstu (np. błąd na końcu programu).
  if (mark && markStart >= source.length) line += `<span class="${mark.cls} mark-eol"> </span>`;
  out.push(line);
  return out;
}

/** Statyczny blok kodu (np. w dokumentacji). */
export function highlightBlock(source: string): string {
  return highlightLines(source.replace(/\n$/, '')).join('\n');
}
