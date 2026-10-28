import { commandKindOf, DEFINE_WORDS, END_WORDS, normaliseName, VALUE_WORDS } from '../lang/spec';

/** Permissive highlighter: it never fails, so it works while the program is being edited. */

export type TokenClass =
  | 'comment'
  | 'string'
  | 'number'
  | 'command'
  | 'keyword'
  | 'value'
  | 'proc'
  | 'name'
  | 'op'
  | 'bracket'
  | 'punct'
  | 'plain';

interface Span {
  start: number;
  end: number;
  cls: TokenClass;
}

const TOKEN_RE = /;[^\n]*|"[^"\n]*"?|\d+(?:\.\d*)?|\.\d+|[\p{L}_][\p{L}\p{N}\p{M}_]*|<=|>=|<>|[-+*/<>=]|[[\]()]|[,:]|\s+|[\s\S]/gu;
const NAME_RE = /^[\p{L}_]/u;
const NUMBER_RE = /^(\d|\.\d)/;

/** Names that follow `oto` anywhere in the program: procedure names. */
function collectProcedureNames(lines: readonly string[]): Set<string> {
  const names = new Set<string>();
  for (const line of lines) {
    const match = /^\s*(?:oto|to)\s+([\p{L}_][\p{L}\p{N}\p{M}_]*)/iu.exec(line);
    if (match) names.add(normaliseName(match[1]));
  }
  return names;
}

function spansOf(line: string, procNames: ReadonlySet<string>): Span[] {
  const spans: Span[] = [];
  let nameFollowsDefine = false;
  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(line)) !== null) {
    const text = match[0];
    const start = match.index;
    const end = start + text.length;
    if (/^\s+$/.test(text)) {
      spans.push({ start, end, cls: 'plain' });
      continue;
    }
    let cls: TokenClass;
    if (text.startsWith(';')) cls = 'comment';
    else if (text.startsWith('"')) cls = 'string';
    else if (NUMBER_RE.test(text)) cls = 'number';
    else if (NAME_RE.test(text)) {
      const norm = normaliseName(text);
      if (nameFollowsDefine) cls = 'proc';
      else if (DEFINE_WORDS.has(norm)) cls = 'keyword';
      else if (commandKindOf(norm)) cls = 'command';
      else if (END_WORDS.has(norm) || norm === 'ma') cls = 'keyword';
      else if (VALUE_WORDS.has(norm)) cls = 'value';
      else if (procNames.has(norm)) cls = 'proc';
      else cls = 'name';
      nameFollowsDefine = DEFINE_WORDS.has(norm);
      spans.push({ start, end, cls });
      continue;
    } else if (/^(<=|>=|<>|[-+*/<>=])$/.test(text)) cls = 'op';
    else if (/^[[\]()]$/.test(text)) cls = 'bracket';
    else if (/^[,:]$/.test(text)) cls = 'punct';
    else cls = 'plain';
    nameFollowsDefine = false;
    spans.push({ start, end, cls });
  }
  return spans;
}

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Token length at a position, used to size the error marker. */
export function tokenLengthAt(line: string, column: number): number {
  const index = Math.max(0, column - 1);
  if (index >= line.length) return 0;
  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match.index <= index && index < match.index + match[0].length) {
      const text = match[0];
      if (/^\s+$/.test(text)) return 1;
      return match.index + text.length - index;
    }
  }
  return 1;
}

/** Highlighted HTML for every line. `errorLine`/`errorColumn` mark one spot in the text. */
export function highlightLines(
  lines: readonly string[],
  error: { line: number; column: number } | null,
): string[] {
  const procNames = collectProcedureNames(lines);
  return lines.map((line, index) => {
    const spans = spansOf(line, procNames);
    const mark = error && error.line === index + 1 ? error : null;
    const markStart = mark ? Math.min(mark.column - 1, line.length) : -1;
    const markEnd = mark ? markStart + Math.max(1, tokenLengthAt(line, mark.column)) : -1;
    let html = '';
    for (const span of spans) {
      let cursor = span.start;
      const cuts = [span.start, span.end];
      if (mark && markStart < span.end && markEnd > span.start) {
        cuts.push(Math.max(span.start, markStart), Math.min(span.end, markEnd));
      }
      const points = [...new Set(cuts)].sort((a, b) => a - b);
      for (const point of points) {
        if (point <= cursor) continue;
        const piece = line.slice(cursor, point);
        const inMark = mark !== null && cursor >= markStart && point <= markEnd;
        html += pieceHtml(piece, span.cls, inMark);
        cursor = point;
      }
    }
    if (mark && mark.column - 1 >= line.length) {
      html += '<span class="err-eol"></span>';
    }
    return html || ' ';
  });
}

function pieceHtml(text: string, cls: TokenClass, inMark: boolean): string {
  const escaped = escapeHtml(text);
  const classes = [cls === 'plain' ? '' : `tok-${cls}`, inMark ? 'tok-err' : ''].filter(Boolean);
  return classes.length ? `<span class="${classes.join(' ')}">${escaped}</span>` : escaped;
}
