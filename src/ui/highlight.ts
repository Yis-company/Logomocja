import { COMMANDS, DEFINE_WORDS, END_WORDS, REPCOUNT_WORDS, THREE_D_ONLY, normaliseName } from '../lang/keywords';
import { escapeHtml } from './dom';

export type HlKind = 'kw' | 'kw3' | 'def' | 'rep' | 'proc' | 'name' | 'num' | 'str' | 'com' | 'op' | 'br' | 'par' | 'bad' | 'text';

export interface HlToken {
  kind: HlKind;
  text: string;
  start: number;
  depth?: number;
}

const RE = new RegExp(
  [
    '(;[^\\n]*)', // 1 komentarz
    '("[^"\\n]*"?)', // 2 napis
    '((?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:[\\p{L}\\p{N}_.]+)?)', // 3 liczba (z ewentualnym błędnym ogonem)
    '(:?[\\p{L}_][\\p{L}\\p{M}\\p{N}_]*:?)', // 4 słowo
    '(<=|>=|<>|[-+*/<>=,])', // 5 operator
    '([\\[\\]])', // 6 nawias kwadratowy
    '([()])', // 7 nawias okrągły
    '(\\s+)', // 8 biały znak
    '([^])', // 9 cokolwiek innego
  ].join('|'),
  'gu',
);

/** Nazwy procedur zdefiniowanych w źródle (dla kolorowania wywołań). */
function procNames(source: string): Set<string> {
  const names = new Set<string>();
  const re = /^[ \t]*(?:oto|to)[ \t]+([\p{L}_][\p{L}\p{M}\p{N}_]*)/gimu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) names.add(normaliseName(m[1]));
  return names;
}

export function highlightTokens(source: string): HlToken[] {
  const out: HlToken[] = [];
  const procs = procNames(source);
  let depth = 0;
  let afterDef = false;
  RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = RE.exec(source))) {
    const text = m[0];
    const start = m.index;
    let kind: HlKind = 'text';
    let d: number | undefined;
    if (m[1]) kind = 'com';
    else if (m[2]) kind = /^"#[0-9a-f]{6}"$/i.test(text) ? 'str' : 'bad';
    else if (m[3]) kind = /^(\d+(\.\d+)?|\.\d+)$/.test(text) ? 'num' : 'bad';
    else if (m[4]) {
      const lower = normaliseName(text.replace(/^:/, ''));
      const cmd = text.startsWith(':') ? undefined : COMMANDS.get(lower);
      if (afterDef) kind = 'proc';
      else if (cmd) kind = THREE_D_ONLY.has(cmd) ? 'kw3' : 'kw';
      else if (DEFINE_WORDS.has(lower) || END_WORDS.has(lower) || lower === 'ma:') kind = 'def';
      else if (REPCOUNT_WORDS.has(lower)) kind = 'rep';
      else if (!text.startsWith(':') && procs.has(lower)) kind = 'proc';
      else kind = 'name';
      afterDef = DEFINE_WORDS.has(lower) && !text.startsWith(':');
    } else if (m[5]) kind = 'op';
    else if (m[6]) {
      kind = 'br';
      if (text === '[') d = depth++;
      else d = depth = Math.max(0, depth - 1);
    } else if (m[7]) kind = 'par';
    else if (m[8]) kind = 'text';
    else kind = 'bad';
    if (!m[8] && !m[1]) {
      if (!m[4]) afterDef = false;
    } else if (m[8] && text.includes('\n')) afterDef = false;
    out.push({ kind, text, start, depth: d });
  }
  return out;
}

function tokenHtml(t: HlToken, text = t.text): string {
  const esc = escapeHtml(text);
  if (t.kind === 'text') return esc;
  if (t.kind === 'str') {
    const color = t.text.slice(1, 7 + 1);
    return `<span class="t-str" style="--sw:${color}">${esc}</span>`;
  }
  if (t.kind === 'br') return `<span class="t-br b${(t.depth ?? 0) % 3}">${esc}</span>`;
  return `<span class="t-${t.kind}">${esc}</span>`;
}

/**
 * HTML z kolorowaniem składni. Fragment `mark` (przesunięcia w źródle)
 * zostaje opakowany w znacznik błędu.
 */
export function highlightHtml(source: string, mark?: { start: number; end: number } | null): string {
  let html = '';
  for (const t of highlightTokens(source)) {
    const tEnd = t.start + t.text.length;
    if (!mark || tEnd <= mark.start || t.start >= mark.end) {
      html += tokenHtml(t);
      continue;
    }
    // Token zachodzi na zaznaczenie — dzielimy go na części.
    const a = Math.max(mark.start, t.start) - t.start;
    const b = Math.min(mark.end, tEnd) - t.start;
    if (a > 0) html += tokenHtml(t, t.text.slice(0, a));
    html += `<span class="err-mark">${tokenHtml(t, t.text.slice(a, b))}</span>`;
    if (b < t.text.length) html += tokenHtml(t, t.text.slice(b));
  }
  return html + '\n';
}
