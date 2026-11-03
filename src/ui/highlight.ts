import { KEYWORDS } from '../lang/keywords';

export type HlKind = 'cmd' | 'def' | 'num' | 'name' | 'str' | 'com' | 'br' | 'par' | 'op' | 'bad' | 'ws';

export interface HlTok {
  kind: HlKind;
  start: number;
  end: number;
  /** Głębokość nawiasu kwadratowego (dla kolorowania par). */
  depth?: number;
  color?: string;
}

const isLetter = (c: string) => /[\p{L}_]/u.test(c);
const isWordChar = (c: string) => /[\p{L}\p{N}_]/u.test(c);
const isDigit = (c: string) => c >= '0' && c <= '9';

/** Pobłażliwy podział na tokeny do kolorowania: nigdy nie zgłasza błędu. */
export function hlTokens(src: string): HlTok[] {
  const out: HlTok[] = [];
  let i = 0;
  let depth = 0;
  while (i < src.length) {
    const c = src[i];
    const start = i;
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      while (i < src.length && /[ \t\n\r]/.test(src[i])) i++;
      out.push({ kind: 'ws', start, end: i });
      continue;
    }
    if (c === ';') {
      while (i < src.length && src[i] !== '\n') i++;
      out.push({ kind: 'com', start, end: i });
      continue;
    }
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1] ?? ''))) {
      while (i < src.length && (isWordChar(src[i]) || src[i] === '.')) i++;
      const ok = /^(\d+(\.\d+)?|\.\d+)$/.test(src.slice(start, i));
      out.push({ kind: ok ? 'num' : 'bad', start, end: i });
      continue;
    }
    if (isLetter(c) || c === ':') {
      i++;
      while (i < src.length && isWordChar(src[i])) i++;
      if (c !== ':' && src[i] === ':') i++;
      const w = src.slice(start, i).toLowerCase();
      const kw = KEYWORDS.get(w);
      let kind: HlKind = 'name';
      if (kw === 'to' || kw === 'end' || w === 'ma:') kind = 'def';
      else if (kw === 'repcount') kind = 'name';
      else if (kw) kind = 'cmd';
      out.push({ kind, start, end: i });
      continue;
    }
    if (c === '"') {
      i++;
      while (i < src.length && src[i] !== '"' && src[i] !== '\n') i++;
      if (src[i] === '"') i++;
      const text = src.slice(start, i);
      const m = /^"(#[0-9a-fA-F]{6})"$/.exec(text);
      out.push({ kind: 'str', start, end: i, color: m ? m[1] : undefined });
      continue;
    }
    i++;
    if (c === '[') {
      depth++;
      out.push({ kind: 'br', start, end: i, depth });
    } else if (c === ']') {
      out.push({ kind: 'br', start, end: i, depth: Math.max(depth, 1) });
      depth = Math.max(0, depth - 1);
    } else if (c === '(' || c === ')') {
      out.push({ kind: 'par', start, end: i });
    } else if ('+-*/<>=,'.includes(c)) {
      out.push({ kind: 'op', start, end: i });
    } else {
      out.push({ kind: 'bad', start, end: i });
    }
  }
  return out;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * HTML z kolorowaniem. `errorAt` to przesunięcie znaku z błędem: token, który je obejmuje
 * (albo zaczyna się w nim), dostaje podkreślenie.
 */
export function highlightHTML(src: string, errorAt = -1): string {
  const toks = hlTokens(src);
  let html = '';
  let marked = false;
  for (const t of toks) {
    const text = esc(src.slice(t.start, t.end));
    if (t.kind === 'ws') {
      if (!marked && errorAt >= t.start && errorAt < t.end && src[errorAt] !== '\n') {
        // błąd wskazuje na odstęp: zaznaczamy jeden znak
        marked = true;
        html += esc(src.slice(t.start, errorAt)) + `<mark class="hl-err">${esc(src[errorAt])}</mark>` + esc(src.slice(errorAt + 1, t.end));
        continue;
      }
      html += text;
      continue;
    }
    let cls = `hl-${t.kind}`;
    if (t.kind === 'br' && t.depth) cls += ` hl-d${((t.depth - 1) % 3) + 1}`;
    // Kolor w cudzysłowie dostaje pasek w swoim kolorze; pasek nie zajmuje miejsca w wierszu.
    const style = t.kind === 'str' && t.color ? ` style="--sw:${t.color}"` : '';
    if (t.kind === 'str' && t.color) cls += ' hl-swatch';
    const isErr = !marked && errorAt >= t.start && errorAt < t.end;
    if (isErr) {
      marked = true;
      html += `<mark class="hl-err"><span class="${cls}"${style}>${text}</span></mark>`;
    } else {
      html += `<span class="${cls}"${style}>${text}</span>`;
    }
  }
  if (!marked && errorAt >= 0) html += '<mark class="hl-err hl-eof"> </mark>';
  return html;
}
