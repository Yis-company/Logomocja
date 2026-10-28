import { COMMANDS, KEYWORD_SETS } from '../lang/parser';
import { escapeHtml } from './dom';

export interface ErrRange { line: number; col: number; len: number }

const CONTROL = new Set(['repeat', 'if', 'ifelse', 'let', 'stop']);
const TOKEN = /(;.*)|("[^"\n]*"?)|(\d+(?:\.\d+)?|\.\d+)|(:?[\p{L}_][\p{L}\p{N}_]*:?)|([[\]()])|([+\-*/<>=,])/uy;

function procNames(src: string): Set<string> {
  const out = new Set<string>();
  for (const m of src.matchAll(/^[ \t]*(?:oto|to)[ \t]+:?([\p{L}_][\p{L}\p{N}_]*)/giu)) {
    out.add(m[1].normalize('NFC').toLowerCase());
  }
  return out;
}

interface Piece { text: string; cls: string }

function classify(m: RegExpExecArray, procs: Set<string>): string {
  if (m[1] !== undefined) return 'tok-com';
  if (m[2] !== undefined) return 'tok-str';
  if (m[3] !== undefined) return 'tok-num';
  if (m[4] !== undefined) {
    let w = m[4];
    if (w.endsWith(':')) return w.toLowerCase() === 'ma:' ? 'tok-kw' : 'tok-name';
    const colon = w.startsWith(':');
    if (colon) w = w.slice(1);
    w = w.normalize('NFC').toLowerCase();
    if (colon) return 'tok-name';
    const cmd = COMMANDS.get(w);
    if (cmd) return CONTROL.has(cmd) ? 'tok-kw' : 'tok-cmd';
    if (KEYWORD_SETS.REP_WORDS.has(w)) return 'tok-rep';
    if (KEYWORD_SETS.DEF_WORDS.has(w) || KEYWORD_SETS.END_WORDS.has(w)) return 'tok-kw';
    if (procs.has(w)) return 'tok-proc';
    return 'tok-name';
  }
  if (m[5] !== undefined) return 'tok-br';
  return 'tok-op';
}

function lineHtml(line: string, lineNo: number, procs: Set<string>, err: ErrRange | null): string {
  const pieces: Piece[] = [];
  let i = 0;
  while (i < line.length) {
    TOKEN.lastIndex = i;
    const m = TOKEN.exec(line);
    if (m && m.index === i) {
      pieces.push({ text: m[0], cls: classify(m, procs) });
      i += m[0].length;
    } else {
      const last = pieces[pieces.length - 1];
      if (last && last.cls === '') last.text += line[i];
      else pieces.push({ text: line[i], cls: '' });
      i++;
    }
  }
  if (err && err.line === lineNo) {
    const a = err.col - 1;
    const b = a + err.len;
    const out: Piece[] = [];
    let pos = 0;
    for (const p of pieces) {
      const s = pos;
      const e = pos + p.text.length;
      pos = e;
      if (e <= a || s >= b) { out.push(p); continue; }
      const x = Math.max(a, s) - s;
      const y = Math.min(b, e) - s;
      if (x > 0) out.push({ text: p.text.slice(0, x), cls: p.cls });
      out.push({ text: p.text.slice(x, y), cls: (p.cls + ' tok-err').trim() });
      if (y < p.text.length) out.push({ text: p.text.slice(y), cls: p.cls });
    }
    if (a >= line.length) out.push({ text: ' ', cls: 'tok-err' });
    return out.map(render).join('');
  }
  return pieces.map(render).join('');
}

function render(p: Piece): string {
  const t = escapeHtml(p.text);
  return p.cls ? `<span class="${p.cls}">${t}</span>` : t;
}

/** Zwraca HTML z podświetleniem składni (jeden wiersz = jeden wiersz tekstu). */
export function highlight(src: string, err: ErrRange | null = null): string {
  const procs = procNames(src);
  return src.split('\n').map((l, i) => lineHtml(l.replace(/\r$/, ''), i + 1, procs, err)).join('\n') + '\n';
}
