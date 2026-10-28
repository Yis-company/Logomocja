import { DEFINE_WORDS, END_WORDS, NRPOWT_WORDS, WORDS } from '../logo/keywords';
import { escapeHtml } from './util';

const TOKEN = /;.*|"[^"]*"?|\d+(?:\.\d+)?|\.\d+|[\p{L}_][\p{L}\p{N}_]*|:[\p{L}_][\p{L}\p{N}_]*|<>|<=|>=|[<>=+\-*/]|[[\]()]|,|\s+|[^]/gu;

function classify(text: string): string {
  if (text.startsWith(';')) return 'com';
  if (text.startsWith('"')) return 'str';
  if (/^(\d|\.\d)/.test(text)) return 'num';
  if (text.startsWith(':')) return 'name';
  if (/^[\p{L}_]/u.test(text)) {
    const key = text.normalize('NFC').toLowerCase();
    return WORDS.has(key) || DEFINE_WORDS.has(key) || END_WORDS.has(key) || NRPOWT_WORDS.has(key) ? 'kw' : 'name';
  }
  if (/^[[\]()]$/.test(text)) return 'br';
  if (/^(<>|<=|>=|[<>=+\-*/])$/.test(text)) return 'op';
  return '';
}

/**
 * HTML for one line of source. `markCol` (1-based) wraps that character in an
 * error marker; a column past the end of the line marks the end of the line.
 */
export function highlightLine(line: string, markCol?: number): string {
  let out = '';
  let offset = 0;
  let marked = false;
  for (const m of line.matchAll(TOKEN)) {
    const text = m[0];
    const cls = classify(text);
    const start = offset;
    offset += text.length;
    const mark = markCol !== undefined && markCol - 1 >= start && markCol - 1 < offset ? markCol - 1 - start : -1;
    if (mark === -1) {
      out += cls ? `<span class="${cls}">${escapeHtml(text)}</span>` : escapeHtml(text);
    } else {
      const before = text.slice(0, mark);
      const hit = text[mark];
      const after = text.slice(mark + 1);
      if (before) out += cls ? `<span class="${cls}">${escapeHtml(before)}</span>` : escapeHtml(before);
      out += `<span class="err-char">${escapeHtml(hit)}</span>`;
      if (after) out += cls ? `<span class="${cls}">${escapeHtml(after)}</span>` : escapeHtml(after);
      marked = true;
    }
  }
  if (markCol !== undefined && !marked && markCol - 1 >= offset) {
    out += '<span class="err-char eol"> </span>';
  }
  return out;
}
