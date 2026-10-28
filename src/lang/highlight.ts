import { DEFINITION_WORDS, END_WORDS, findCommand, REPEAT_VALUE_WORDS } from './commands';

export type HighlightKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'number'
  | 'command'
  | 'keyword'
  | 'procedure'
  | 'name'
  | 'bracket'
  | 'operator'
  | 'error';

export interface HighlightSpan {
  start: number;
  end: number;
  kind: HighlightKind;
}

const NAME_START = /[\p{L}_]/u;
const NAME_RE = /[\p{L}_][\p{L}\p{N}\p{M}_]*/uy;
const NUMBER_RE = /(?:\d+(?:\.\d+)?|\.\d+)/y;

/**
 * Colours a source text for the editor. The spans cover the whole text in order, so
 * joining them reproduces the input exactly. Works on broken programs too.
 */
export function highlightSource(source: string): HighlightSpan[] {
  const procs = findProcedureNames(source);
  const spans: HighlightSpan[] = [];
  const add = (start: number, end: number, kind: HighlightKind): void => {
    if (end <= start) return;
    const last = spans[spans.length - 1];
    if (last && last.kind === kind && last.end === start) last.end = end;
    else spans.push({ start, end, kind });
  };

  let i = 0;
  while (i < source.length) {
    const ch = source[i]!;
    if (ch === ';') {
      const nl = source.indexOf('\n', i);
      const end = nl === -1 ? source.length : nl;
      add(i, end, 'comment');
      i = end;
    } else if (ch === '"') {
      const close = source.indexOf('"', i + 1);
      const nl = source.indexOf('\n', i + 1);
      const end = close === -1 || (nl !== -1 && nl < close) ? (nl === -1 ? source.length : nl) : close + 1;
      add(i, end, close === -1 || end !== close + 1 ? 'error' : 'string');
      i = end;
    } else if ((ch >= '0' && ch <= '9') || (ch === '.' && /[0-9]/.test(source[i + 1] ?? ''))) {
      NUMBER_RE.lastIndex = i;
      const m = NUMBER_RE.exec(source);
      const len = m ? m[0].length : 1;
      add(i, i + len, 'number');
      i += len;
    } else if (NAME_START.test(ch)) {
      NAME_RE.lastIndex = i;
      const m = NAME_RE.exec(source)!;
      const word = m[0];
      const lower = word.normalize('NFC').toLowerCase();
      let kind: HighlightKind = 'name';
      if (findCommand(lower)) kind = 'command';
      else if (DEFINITION_WORDS.includes(lower) || END_WORDS.includes(lower) || lower === 'ma' || REPEAT_VALUE_WORDS.includes(lower)) kind = 'keyword';
      else if (procs.has(lower)) kind = 'procedure';
      add(i, i + word.length, kind);
      i += word.length;
    } else if (ch === ':' && NAME_START.test(source[i + 1] ?? '')) {
      NAME_RE.lastIndex = i + 1;
      const m = NAME_RE.exec(source)!;
      add(i, i + 1 + m[0].length, 'name');
      i += 1 + m[0].length;
    } else if ('[]()'.includes(ch)) {
      add(i, i + 1, 'bracket');
      i++;
    } else if ('+-*/=<>'.includes(ch)) {
      add(i, i + 1, 'operator');
      i++;
    } else {
      add(i, i + 1, 'plain');
      i++;
    }
  }
  return spans;
}

/** Names that follow `oto` at the start of a line, so calls to them can be coloured as procedures. */
function findProcedureNames(source: string): Set<string> {
  const names = new Set<string>();
  const re = /^[ \t]*(?:oto|to)[ \t]+([\p{L}_][\p{L}\p{N}\p{M}_]*)/gmu;
  for (const m of source.matchAll(re)) {
    names.add(m[1]!.normalize('NFC').toLowerCase());
  }
  return names;
}
