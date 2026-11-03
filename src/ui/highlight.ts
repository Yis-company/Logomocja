import { keywordOf, normName, type Keyword } from '../lang/keywords';

export type HlClass = 'cmd' | 'ctl' | 'num' | 'name' | 'proc' | 'str' | 'comment' | 'bracket' | 'paren' | 'op' | 'bad' | 'ma';

export interface HlToken {
  cls: HlClass;
  text: string;
  /** 0-based column within the line */
  col: number;
  color?: string;
}

const CONTROL = new Set<Keyword>(['powtorz', 'jesli', 'jezeli', 'oto', 'juz', 'stop', 'niech', 'nrpowt']);

/** Tolerant per-line tokenizer for highlighting; never throws. */
export function highlightLines(source: string): HlToken[][] {
  const lines = source.split(/\r\n|\r|\n/);
  const procNames = new Set<string>();
  for (const m of source.matchAll(/^[ \t]*(?:oto|to)[ \t]+([\p{L}_][\p{L}\p{N}\p{M}_]*)/gimu)) procNames.add(normName(m[1]));

  return lines.map((line) => {
    const out: HlToken[] = [];
    let i = 0;
    while (i < line.length) {
      const c = line[i];
      if (c === ' ' || c === '\t') {
        i++;
        continue;
      }
      const start = i;
      if (c === ';') {
        out.push({ cls: 'comment', text: line.slice(i), col: i });
        break;
      }
      if (/[0-9.]/.test(c)) {
        const m = /^(\d+(\.\d+)?|\.\d+)/.exec(line.slice(i));
        if (m) {
          i += m[0].length;
          let cls: HlClass = 'num';
          if (i < line.length && /[\p{L}\p{N}_.]/u.test(line[i])) {
            while (i < line.length && /[\p{L}\p{N}_.]/u.test(line[i])) i++;
            cls = 'bad';
          }
          out.push({ cls, text: line.slice(start, i), col: start });
          continue;
        }
      }
      if (c === ':' || /[\p{L}_]/u.test(c)) {
        i++;
        while (i < line.length && /[\p{L}\p{N}\p{M}_]/u.test(line[i])) i++;
        const text = line.slice(start, i);
        if (text === ':') {
          out.push({ cls: 'bad', text, col: start });
          continue;
        }
        if (normName(text) === 'ma' && line[i] === ':') {
          i++;
          out.push({ cls: 'ma', text: line.slice(start, i), col: start });
          continue;
        }
        const kw = text.startsWith(':') ? undefined : keywordOf(text);
        let cls: HlClass = 'name';
        if (kw) cls = CONTROL.has(kw) ? 'ctl' : 'cmd';
        else if (!text.startsWith(':') && procNames.has(normName(text))) cls = 'proc';
        out.push({ cls, text, col: start });
        continue;
      }
      if (c === '"') {
        i++;
        while (i < line.length && line[i] !== '"') i++;
        if (i < line.length) i++;
        const text = line.slice(start, i);
        const m = /^"(#[0-9a-fA-F]{6})"$/.exec(text);
        out.push({ cls: m ? 'str' : 'bad', text, col: start, color: m ? m[1] : undefined });
        continue;
      }
      if (c === '[' || c === ']') {
        out.push({ cls: 'bracket', text: c, col: i });
        i++;
        continue;
      }
      if (c === '(' || c === ')' || c === ',') {
        out.push({ cls: 'paren', text: c, col: i });
        i++;
        continue;
      }
      if (/[+\-*/<>=]/.test(c)) {
        const two = line.slice(i, i + 2);
        const len = two === '<=' || two === '>=' || two === '<>' ? 2 : 1;
        out.push({ cls: 'op', text: line.slice(i, i + len), col: i });
        i += len;
        continue;
      }
      out.push({ cls: 'bad', text: c, col: i });
      i++;
    }
    return out;
  });
}
