import { COMMAND_WORDS, BLOCK_WORDS, END_WORDS, VALUE_WORDS } from '../logo/vocab';

const TOKEN = /;[^\n]*|"[^"\n]*"?|\d+(?:\.\d+)?|\.\d+|[\p{L}_][\p{L}\p{N}_]*|<=|>=|<>|[<>=+\-*/]|[()[\],:]/gu;

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function classOf(tok: string): string | null {
  if (tok.startsWith(';')) return 'c';
  if (tok.startsWith('"')) return 's';
  if (/^[\d.]/.test(tok)) return 'n';
  if (/^[\p{L}_]/u.test(tok)) {
    const key = tok.toLowerCase();
    if (COMMAND_WORDS.has(key)) return 'k';
    if (BLOCK_WORDS.has(key) || END_WORDS.has(key)) return 'd';
    if (VALUE_WORDS.has(key)) return 'v';
    return 'i';
  }
  if (/^[()[\],:]$/.test(tok)) return 'b';
  return 'o';
}

/** HTML with each token wrapped in a span whose class names its kind (see the `.tok-*` styles). */
export function highlight(src: string): string {
  let out = '';
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    out += escapeHtml(src.slice(last, at));
    const cls = classOf(m[0]);
    out += cls ? `<span class="t-${cls}">${escapeHtml(m[0])}</span>` : escapeHtml(m[0]);
    last = at + m[0].length;
  }
  return out + escapeHtml(src.slice(last));
}
