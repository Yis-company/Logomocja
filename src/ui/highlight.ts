import { lex } from '../lang/lexer';
import { prescan } from '../lang/parser';
import { keywordOf, type Keyword } from '../lang/keywords';
import { h } from './dom';

export type TokClass = 'cmd' | 'ctl' | 'rep' | 'num' | 'name' | 'proc' | 'str' | 'comment' | 'brack' | 'paren' | 'op' | 'bad';

export interface Span {
  from: number;
  to: number;
  cls: TokClass;
  /** Valid colour literal value, for swatches. */
  color?: string;
}

const CONTROL: ReadonlySet<Keyword> = new Set(['repeat', 'if', 'ifelse', 'let', 'to', 'end', 'stop']);

/** Classifies source for highlighting using the interpreter's own lexer, so colours never disagree with it. */
export function classify(source: string): Span[] {
  const { tokens, comments } = lex(source, true);
  const pre = prescan(tokens);
  const spans: Span[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    let cls: TokClass | null = null;
    let color: string | undefined;
    switch (t.kind) {
      case 'word': {
        const kw = keywordOf(t.name);
        if (kw === 'repcount') cls = 'rep';
        else if (kw) cls = CONTROL.has(kw) ? 'ctl' : 'cmd';
        else if (t.name === 'ma' && i >= 2 && keywordOf(tokens[i - 2]!.name) === 'to' && tokens[i - 2]!.line === t.line) cls = 'ctl';
        else if (pre.procs.has(t.name)) cls = 'proc';
        else cls = 'name';
        break;
      }
      case 'ref':
        cls = 'name';
        break;
      case 'num':
        cls = 'num';
        break;
      case 'str':
        cls = 'str';
        if (/^#[0-9a-fA-F]{6}$/.test(t.name)) color = t.name.toLowerCase();
        break;
      case 'op':
      case 'cmp':
      case 'comma':
      case 'colon':
        cls = 'op';
        break;
      case 'lbrack':
      case 'rbrack':
        cls = 'brack';
        break;
      case 'lparen':
      case 'rparen':
        cls = 'paren';
        break;
      case 'bad':
        cls = 'bad';
        break;
      default:
        break;
    }
    if (cls) spans.push({ from: t.offset, to: t.end, cls, color });
  }
  for (const c of comments) spans.push({ from: c.offset, to: c.end, cls: 'comment' });
  spans.sort((a, b) => a.from - b.from);
  return spans;
}

/** Static highlighted code block (reference page, examples). */
export function highlightedCode(source: string): HTMLElement {
  const code = h('code', { class: 'logo-code' });
  let pos = 0;
  for (const s of classify(source)) {
    if (s.from > pos) code.append(source.slice(pos, s.from));
    const span = h('span', { class: `tok-${s.cls}` }, source.slice(s.from, s.to));
    if (s.color) span.style.setProperty('--swatch', s.color);
    code.append(span);
    pos = s.to;
  }
  if (pos < source.length) code.append(source.slice(pos));
  return code;
}
