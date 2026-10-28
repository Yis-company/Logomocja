import { keywordGroup } from '../lang/keywords';
import { tokenize, type Token } from '../lang/lexer';

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ESC[c]);
}

function tokenClass(t: Token, procs: Set<string>, depth: number, prevKw: string | undefined): string {
  switch (t.type) {
    case 'comment': return 'tk-comment';
    case 'num': return 'tk-num';
    case 'str': return /^#[0-9a-f]{6}$/i.test(t.str ?? '') ? 'tk-str tk-color' : 'tk-str';
    case 'name':
      if (t.kw) return `tk-kw tk-${keywordGroup(t.kw)}`;
      if (prevKw === 'to') return 'tk-proc tk-proc-def';
      return procs.has(t.key!) ? 'tk-proc' : 'tk-var';
    case 'param': return 'tk-var';
    case 'ma': return 'tk-kw tk-control';
    case 'op': case 'cmp': return 'tk-op';
    case '[': case ']': return `tk-br tk-br${depth % 3}`;
    case '(': case ')': return 'tk-paren';
    case ',': return 'tk-punct';
    case 'error': return 'tk-error';
    default: return '';
  }
}

/** Names defined with `oto` (to highlight calls of user procedures). */
export function procedureNames(tokens: Token[]): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i + 1 < tokens.length; i++) {
    if (tokens[i].kw === 'to' && tokens[i + 1].type === 'name' && !tokens[i + 1].kw) set.add(tokens[i + 1].key!);
  }
  return set;
}

/**
 * Produces the HTML of the highlighted source. Every token span carries its
 * start offset in `data-o`, so markers can be positioned over tokens.
 */
export function highlight(src: string, errorOffset: number | null): string {
  const tokens = tokenize(src, true);
  const procs = procedureNames(tokens);
  let out = '';
  let pos = 0;
  let depth = 0;
  let prevKw: string | undefined;
  for (const t of tokens) {
    if (t.type === 'eof') break;
    if (t.offset > pos) out += escapeHtml(src.slice(pos, t.offset));
    let d = depth;
    if (t.type === '[') depth++;
    else if (t.type === ']') d = depth = Math.max(0, depth - 1);
    let cls = tokenClass(t, procs, d, prevKw);
    if (errorOffset !== null && t.offset === errorOffset) cls += ' tk-err-at';
    const style = t.type === 'str' && /^#[0-9a-f]{6}$/i.test(t.str ?? '') ? ` style="--swatch:${t.str}"` : '';
    out += `<span class="${cls}" data-o="${t.offset}"${style}>${escapeHtml(t.text)}</span>`;
    pos = t.end;
    if (t.type !== 'comment') prevKw = t.kw;
  }
  if (pos < src.length) out += escapeHtml(src.slice(pos));
  // A trailing newline needs content after it to be laid out like in the textarea.
  return out + '\n';
}
