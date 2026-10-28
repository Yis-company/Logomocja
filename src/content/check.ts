import type { Mode } from '../lang/ast';
import { execute, type Segment } from '../lang/interpreter';
import { tokenize } from '../lang/lexer';
import { plural } from '../lang/errors';
import type { Challenge } from './challenges';

export interface CheckResult {
  pass: boolean;
  /** Short verdict. */
  title: string;
  /** Explanations (why it failed, or praise). */
  reasons: string[];
  /** Target segments the user's drawing lacks, in the user's coordinates. */
  missing: Segment[];
}

type P3 = [number, number, number];

interface Line {
  a: P3;
  b: P3;
}

const TOL = 0.5;

function sub(a: readonly number[], b: readonly number[]): P3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function dot(a: readonly number[], b: readonly number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Merges collinear, overlapping or touching segments into maximal lines, so a
 * side drawn in two pieces (or twice) compares equal to one drawn at once.
 */
export function mergeLines(segs: readonly Segment[]): Line[] {
  const groups = new Map<string, { dir: P3; foot: P3; spans: [number, number][] }>();
  for (const s of segs) {
    const d = sub(s.to, s.from);
    const len = Math.hypot(d[0], d[1], d[2]);
    if (len < 1e-9) continue;
    let dir: P3 = [d[0] / len, d[1] / len, d[2] / len];
    const eps = 1e-9;
    const flip = dir[0] < -eps || (Math.abs(dir[0]) <= eps && (dir[1] < -eps || (Math.abs(dir[1]) <= eps && dir[2] < 0)));
    if (flip) dir = [-dir[0], -dir[1], -dir[2]];
    const t0 = dot(s.from, dir);
    const t1 = dot(s.to, dir);
    const foot: P3 = [s.from[0] - dir[0] * t0, s.from[1] - dir[1] * t0, s.from[2] - dir[2] * t0];
    const key = [...dir.map((v) => Math.round(v * 200)), ...foot.map((v) => Math.round(v * 4))].join(',');
    let g = groups.get(key);
    if (!g) {
      g = { dir, foot, spans: [] };
      groups.set(key, g);
    }
    g.spans.push(t0 < t1 ? [t0, t1] : [t1, t0]);
  }
  const lines: Line[] = [];
  for (const g of groups.values()) {
    g.spans.sort((p, q) => p[0] - q[0]);
    let [s0, s1] = g.spans[0];
    const flush = () => {
      lines.push({
        a: [g.foot[0] + g.dir[0] * s0, g.foot[1] + g.dir[1] * s0, g.foot[2] + g.dir[2] * s0],
        b: [g.foot[0] + g.dir[0] * s1, g.foot[1] + g.dir[1] * s1, g.foot[2] + g.dir[2] * s1],
      });
    };
    for (let i = 1; i < g.spans.length; i++) {
      const [t0, t1] = g.spans[i];
      if (t0 <= s1 + TOL) {
        s1 = Math.max(s1, t1);
      } else {
        flush();
        [s0, s1] = [t0, t1];
      }
    }
    flush();
  }
  return lines;
}

function bbox(lines: Line[]): { min: P3; max: P3 } {
  const min: P3 = [Infinity, Infinity, Infinity];
  const max: P3 = [-Infinity, -Infinity, -Infinity];
  for (const l of lines) {
    for (const p of [l.a, l.b]) {
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], p[k]);
        max[k] = Math.max(max[k], p[k]);
      }
    }
  }
  return { min, max };
}

function near(p: readonly number[], q: readonly number[]): boolean {
  return Math.abs(p[0] - q[0]) <= TOL && Math.abs(p[1] - q[1]) <= TOL && Math.abs(p[2] - q[2]) <= TOL;
}

function fmt(v: number): string {
  return String(Math.round(v * 10) / 10).replace('.', ',');
}

function sizeText(min: P3, max: P3, mode: Mode): string {
  const w = max[0] - min[0];
  const h = max[1] - min[1];
  const d = max[2] - min[2];
  return mode === '3d' ? `${fmt(w)} × ${fmt(h)} × ${fmt(d)}` : `${fmt(w)} × ${fmt(h)}`;
}

export interface Comparison {
  equal: boolean;
  reasons: string[];
  missing: Segment[];
}

/** Compares two drawings up to translation, ignoring order, direction and colours. */
export function compareDrawings(target: readonly Segment[], actual: readonly Segment[], mode: Mode): Comparison {
  const tl = mergeLines(target);
  const al = mergeLines(actual);
  if (al.length === 0) return { equal: false, reasons: ['Nic nie zostało narysowane.'], missing: [...target] };
  const tb = bbox(tl);
  const ab = bbox(al);
  const shift = (l: Line, m: P3): Line => ({ a: sub(l.a, m), b: sub(l.b, m) });
  const tn = tl.map((l) => shift(l, tb.min));
  const an = al.map((l) => shift(l, ab.min));
  const reasons: string[] = [];
  const tSize = sub(tb.max, tb.min);
  const aSize = sub(ab.max, ab.min);
  if (!near(tSize, aSize)) {
    reasons.push(`Rysunek ma wymiary ${sizeText(ab.min, ab.max, mode)}, a powinien mieć ${sizeText(tb.min, tb.max, mode)}.`);
  }
  const used = new Array<boolean>(an.length).fill(false);
  const missing: Segment[] = [];
  for (let i = 0; i < tn.length; i++) {
    const t = tn[i];
    let found = -1;
    for (let j = 0; j < an.length; j++) {
      if (used[j]) continue;
      const a = an[j];
      if ((near(t.a, a.a) && near(t.b, a.b)) || (near(t.a, a.b) && near(t.b, a.a))) {
        found = j;
        break;
      }
    }
    if (found >= 0) used[found] = true;
    else {
      const o = tl[i];
      missing.push({
        from: [o.a[0] - tb.min[0] + ab.min[0], o.a[1] - tb.min[1] + ab.min[1], o.a[2] - tb.min[2] + ab.min[2]],
        to: [o.b[0] - tb.min[0] + ab.min[0], o.b[1] - tb.min[1] + ab.min[1], o.b[2] - tb.min[2] + ab.min[2]],
        color: '#d64545',
        width: 3,
      });
    }
  }
  const extra = used.filter((u) => !u).length;
  if (reasons.length === 0) {
    if (missing.length) {
      reasons.push(`Brakuje ${missing.length} ${plural(missing.length, 'odcinka', 'odcinków', 'odcinków')} wzoru (${missing.length === 1 ? 'zaznaczono go' : 'zaznaczono je'} na czerwono).`);
    }
    if (extra) {
      reasons.push(`${extra === 1 ? 'Jeden odcinek nie pasuje' : `${extra} ${plural(extra, 'odcinek nie pasuje', 'odcinki nie pasują', 'odcinków nie pasuje')}`} do wzoru.`);
    }
  }
  return { equal: reasons.length === 0, reasons, missing: reasons.length ? missing : [] };
}

export function targetOf(ch: Challenge): Segment[] {
  return execute(ch.solution, ch.mode).segments;
}

export function checkChallenge(ch: Challenge, source: string): CheckResult {
  const out = execute(source, ch.mode);
  if (out.error) {
    return {
      pass: false,
      title: 'Program zawiera błąd',
      reasons: [`Linia ${out.error.line}, kolumna ${out.error.column}: ${out.error.message}`],
      missing: [],
    };
  }
  const reasons: string[] = [];
  const req = ch.requires ?? {};
  const toks = tokenize(source);
  if (req.repeat && !toks.some((t) => t.kw === 'repeat')) reasons.push('Użyj polecenia powtorz.');
  if (req.repcount && !toks.some((t) => t.kw === 'repcount')) reasons.push('Użyj wartości nrpowt.');
  if (req.condition && !toks.some((t) => t.kw === 'if' || t.kw === 'ifelse')) reasons.push('Użyj warunku jeśli albo jeżeli.');
  if (req.procedure) {
    const names = new Set<string>();
    for (let i = 0; i + 1 < toks.length; i++) {
      if (toks[i].kw === 'to' && toks[i + 1].type === 'name') names.add(toks[i + 1].key!);
    }
    const called = toks.some((t, i) => t.type === 'name' && names.has(t.key!) && !(i > 0 && toks[i - 1].kw === 'to'));
    if (!names.size) reasons.push('Zdefiniuj własną procedurę: oto … już.');
    else if (!called) reasons.push('Zdefiniowana procedura nie jest nigdzie wywoływana.');
  }
  if (req.color && out.segments.some((s) => s.color !== req.color)) {
    reasons.push(`Wszystkie linie powinny mieć kolor "${req.color}".`);
  }
  const cmp = compareDrawings(targetOf(ch), out.segments, ch.mode);
  reasons.push(...cmp.reasons);
  if (reasons.length === 0) {
    return { pass: true, title: 'Zadanie rozwiązane!', reasons: ['Rysunek zgadza się ze wzorem.'], missing: [] };
  }
  return { pass: false, title: 'Jeszcze nie', reasons, missing: cmp.missing };
}
