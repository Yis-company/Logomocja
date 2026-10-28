import { isDefClose, isDefOpen, isRepcount, COMMAND_TABLE } from '../lang/keywords';
import { type Token, tokenize } from '../lang/lexer';
import { escapeHtml } from './dom';

/** Zamienia (wiersz, kolumna) na przesunięcie w tekście; kolumna może wskazywać koniec wiersza. */
export function offsetOf(source: string, line: number, column: number): number {
  let off = 0;
  let l = 1;
  while (l < line) {
    const nl = source.indexOf('\n', off);
    if (nl < 0) return source.length;
    off = nl + 1;
    l++;
  }
  return Math.min(source.length, off + column - 1);
}

function classFor(t: Token, procs: Set<string>): string {
  switch (t.kind) {
    case 'ident': {
      const w = t.value as string;
      if (COMMAND_TABLE.has(w)) return 't-cmd';
      if (isDefOpen(w) || isDefClose(w)) return 't-def';
      if (isRepcount(w)) return 't-val';
      if (procs.has(w)) return 't-proc';
      return 't-name';
    }
    case 'cname':
      return 't-name';
    case 'num':
      return 't-num';
    case 'str':
      return 't-str';
    case 'comment':
      return 't-com';
    case 'lbr':
    case 'rbr':
    case 'lp':
    case 'rp':
      return 't-br';
    case 'op':
    case 'cmp':
    case 'comma':
    case 'colon':
      return 't-op';
    case 'error':
      return 't-bad';
    default:
      return '';
  }
}

/** HTML do warstwy podświetlania; zawsze kończy się znakiem nowej linii. */
export function highlightHtml(source: string, errorOffset: number | null = null): string {
  const tokens = tokenize(source, { comments: true });
  const procs = new Set<string>();
  for (let i = 0; i < tokens.length - 1; i++) {
    const t = tokens[i];
    if (t.kind === 'ident' && isDefOpen(t.value as string) && t.firstOnLine) {
      const n = tokens[i + 1];
      if (n.kind === 'ident' && n.line === t.line) procs.add(n.value as string);
    }
  }
  let out = '';
  let pos = 0;
  let marked = false;
  for (const t of tokens) {
    if (t.kind === 'eof') break;
    if (t.start > pos) {
      const gap = source.slice(pos, t.start);
      if (!marked && errorOffset !== null && errorOffset >= pos && errorOffset < t.start) {
        const k = errorOffset - pos;
        out += escapeHtml(gap.slice(0, k)) + '<span class="err-mark err-point"></span>' + escapeHtml(gap.slice(k));
        marked = true;
      } else out += escapeHtml(gap);
    }
    let cls = classFor(t, procs);
    const isErr = !marked && errorOffset !== null && errorOffset >= t.start && errorOffset < t.end;
    if (isErr) {
      cls += ' err-mark';
      marked = true;
    }
    let style = '';
    if (t.kind === 'str' && /^#[0-9a-fA-F]{6}$/.test(t.value as string)) {
      style = ` style="--swatch:${t.value}"`;
      cls += ' t-color';
    }
    out += `<span class="${cls}"${style}>${escapeHtml(t.text)}</span>`;
    pos = t.end;
  }
  if (pos < source.length) out += escapeHtml(source.slice(pos));
  if (!marked && errorOffset !== null && errorOffset >= pos) {
    out += '<span class="err-mark err-point"></span>';
  }
  return out + '\n';
}
