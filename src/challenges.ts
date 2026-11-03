import { compile, runProgram } from './lang/interpreter';
import type { Expr, Program, Stmt } from './lang/parser';
import type { LogoError, Mode, Segment, Vec3 } from './lang/types';

export type Requirement = 'repeat' | 'procedure-params' | 'counter' | 'spatial';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  /** What to draw, one or two sentences. */
  task: string;
  hint: string;
  solution: string;
  requires?: Requirement[];
  checkColor?: boolean;
  checkWidth?: boolean;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'kwadrat-100',
    title: 'Kwadrat 100',
    mode: '2d',
    task: 'Narysuj kwadrat o boku 100.',
    hint: 'Cztery razy: krok naprzód i skręt o 90 stopni. Możesz użyć powtórz 4 [ ... ].',
    solution: 'powtorz 4 [np 100 pw 90]',
  },
  {
    id: 'trojkat',
    title: 'Trójkąt równoboczny',
    mode: '2d',
    task: 'Narysuj trójkąt równoboczny o boku 120, używając polecenia powtórz.',
    hint: 'Żółw obraca się w sumie o 360 stopni. Na ile skrętów trzeba to podzielić?',
    solution: 'powtorz 3 [np 120 pw 120]',
    requires: ['repeat'],
  },
  {
    id: 'schodki',
    title: 'Schodki',
    mode: '2d',
    task: 'Narysuj pięć schodków. Każdy stopień ma 30 w górę i 30 w bok.',
    hint: 'Jeden stopień to: np 30, skręt w prawo, np 30, skręt w lewo.',
    solution: 'powtorz 5 [np 30 pw 90 np 30 lw 90]',
  },
  {
    id: 'szesciokat',
    title: 'Niebieski sześciokąt',
    mode: '2d',
    task: 'Narysuj sześciokąt foremny o boku 60, kolorem "#2b6fb3" i grubością 4.',
    hint: 'Kolor i grubość ustaw przed rysowaniem: kolor "#2b6fb3" i grubosc 4. Kąt to 360 / 6.',
    solution: 'kolor "#2b6fb3"\ngrubosc 4\npowtorz 6 [np 60 pw 60]',
    checkColor: true,
    checkWidth: true,
  },
  {
    id: 'domek',
    title: 'Domek',
    mode: '2d',
    task: 'Narysuj domek: kwadrat o boku 100, a na nim dach, czyli trójkąt równoboczny o boku 100.',
    hint: 'Po kwadracie wejdź na górny róg (np 100), skręć o 30 stopni i narysuj trójkąt.',
    solution: 'powtorz 4 [np 100 pw 90]\nnp 100\npw 30\npowtorz 3 [np 100 pw 120]',
  },
  {
    id: 'kwiat',
    title: 'Kwiat z kwadratów',
    mode: '2d',
    task: 'Narysuj osiem kwadratów o boku 70, obracając żółwia o 45 stopni po każdym.',
    hint: 'Powtórz w powtórz: zewnętrzne 8 razy, wewnętrzne rysuje kwadrat.',
    solution: 'powtorz 8 [\n  powtorz 4 [np 70 pw 90]\n  pw 45\n]',
    requires: ['repeat'],
  },
  {
    id: 'prostokaty',
    title: 'Własna procedura',
    mode: '2d',
    task: 'Napisz procedurę prostokąta z dwoma parametrami i narysuj nią dwa prostokąty z tego samego miejsca: 40 szeroki na 80 wysoki oraz 80 szeroki na 40 wysoki.',
    hint: 'oto prostokąt ma: a, b … już, a w środku powtorz 2 [np a pw 90 np b pw 90].',
    solution: 'oto prostokąt ma: a, b\n  powtorz 2 [np a pw 90 np b pw 90]\njuż\n\nprostokąt 80 40\nprostokąt 40 80',
    requires: ['procedure-params'],
  },
  {
    id: 'spirala-kwadratowa',
    title: 'Kwadratowa spirala',
    mode: '2d',
    task: 'Narysuj spiralę z 20 odcinków: pierwszy ma długość 5, każdy następny jest o 5 dłuższy, a skręt zawsze wynosi 90 stopni.',
    hint: 'nrpowt podaje numer powtórzenia: np nrpowt * 5. Można też zwiększać zmienną poleceniem niech.',
    solution: 'powtorz 20 [np nrpowt * 5 pw 90]',
    requires: ['counter'],
  },
  {
    id: 'pionowy-kwadrat',
    title: 'Kwadrat na stojąco',
    mode: '3d',
    task: 'W przestrzeni narysuj kwadrat o boku 80, który stoi pionowo na podłodze: pierwszy bok idzie prosto w górę.',
    hint: 'Najpierw gora 90, żeby żółw patrzył w niebo. Potem zwykły kwadrat.',
    solution: 'gora 90\npowtorz 4 [np 80 pw 90]',
    requires: ['spatial'],
  },
  {
    id: 'osie',
    title: 'Trzy osie',
    mode: '3d',
    task: 'Narysuj trzy odcinki o długości 100 przecinające się w punkcie startu: jeden przód–tył, jeden lewo–prawo i jeden dół–góra.',
    hint: 'np 50 ws 100 np 50 rysuje pierwszy. Potem obróć żółwia (pw, gora) i powtórz ten ruch.',
    solution: 'np 50 ws 100 np 50\npw 90 np 50 ws 100 np 50\ngora 90 np 50 ws 100 np 50',
    requires: ['spatial'],
  },
];

export function findChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export interface CheckResult {
  passed: boolean;
  verdict: string;
  reason: string;
  /** In the user's coordinate frame, for drawing on the plate. */
  missing: Segment[];
  extra: Segment[];
  error: LogoError | null;
}

const targetCache = new Map<string, Segment[]>();
export function targetOf(ch: Challenge): Segment[] {
  let t = targetCache.get(ch.id);
  if (!t) {
    t = runProgram(ch.solution, ch.mode).segments;
    targetCache.set(ch.id, t);
  }
  return t;
}

type P = Vec3;
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a: P) => Math.hypot(a[0], a[1], a[2]);

function distToSeg(p: P, a: P, b: P): number {
  const ab = sub(b, a);
  const ap = sub(p, a);
  const l2 = ab[0] * ab[0] + ab[1] * ab[1] + ab[2] * ab[2];
  const t = l2 === 0 ? 0 : Math.min(1, Math.max(0, (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / l2));
  return len(sub(p, [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t]));
}

/** Uniform grid over segments for nearest-segment queries within a tolerance. */
class SegIndex {
  private cells = new Map<string, number[]>();
  constructor(
    private segs: Segment[],
    private cell: number,
    tol: number,
  ) {
    segs.forEach((s, i) => {
      const lo = [0, 1, 2].map((k) => Math.floor((Math.min(s.from[k]!, s.to[k]!) - tol) / cell));
      const hi = [0, 1, 2].map((k) => Math.floor((Math.max(s.from[k]!, s.to[k]!) + tol) / cell));
      for (let x = lo[0]!; x <= hi[0]!; x++)
        for (let y = lo[1]!; y <= hi[1]!; y++)
          for (let z = lo[2]!; z <= hi[2]!; z++) {
            const key = `${x},${y},${z}`;
            let list = this.cells.get(key);
            if (!list) this.cells.set(key, (list = []));
            list.push(i);
          }
    });
  }
  nearest(p: P, tol: number): Segment | null {
    const key = `${Math.floor(p[0] / this.cell)},${Math.floor(p[1] / this.cell)},${Math.floor(p[2] / this.cell)}`;
    let best: Segment | null = null;
    let bestD = tol;
    for (const i of this.cells.get(key) ?? []) {
      const s = this.segs[i]!;
      const d = distToSeg(p, s.from, s.to);
      if (d <= bestD) {
        bestD = d;
        best = s;
      }
    }
    return best;
  }
}

interface Coverage {
  uncovered: number;
  runs: Segment[];
}

/** Length of `segs` not within `tol` of `index`, plus the uncovered pieces. */
function coverage(segs: Segment[], index: SegIndex, tol: number, step: number): Coverage {
  let uncovered = 0;
  const runs: Segment[] = [];
  for (const s of segs) {
    const L = len(sub(s.to, s.from));
    if (L === 0) continue;
    const n = Math.max(2, Math.ceil(L / step) + 1);
    let runStart = -1;
    let missCount = 0;
    const at = (i: number): P => {
      const t = i / (n - 1);
      return [s.from[0] + (s.to[0] - s.from[0]) * t, s.from[1] + (s.to[1] - s.from[1]) * t, s.from[2] + (s.to[2] - s.from[2]) * t];
    };
    for (let i = 0; i < n; i++) {
      const miss = !index.nearest(at(i), tol);
      if (miss) {
        missCount++;
        if (runStart < 0) runStart = i;
      }
      if ((!miss || i === n - 1) && runStart >= 0) {
        const endI = miss ? i : i - 1;
        runs.push({ ...s, from: at(Math.max(runStart - 0.5, 0)), to: at(Math.min(endI + 0.5, n - 1)) });
        runStart = -1;
      }
    }
    uncovered += (missCount / n) * L;
  }
  return { uncovered, runs };
}

function totalLength(segs: Segment[]): number {
  return segs.reduce((a, s) => a + len(sub(s.to, s.from)), 0);
}

function bbox(segs: Segment[]) {
  const lo: P = [Infinity, Infinity, Infinity];
  const hi: P = [-Infinity, -Infinity, -Infinity];
  for (const s of segs) for (const p of [s.from, s.to]) for (let k = 0; k < 3; k++) {
    lo[k] = Math.min(lo[k]!, p[k]!);
    hi[k] = Math.max(hi[k]!, p[k]!);
  }
  return { lo, hi, center: [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2] as P };
}

function walk(program: Program, visit: (s: Stmt) => void): void {
  const rec = (list: Stmt[]) => {
    for (const s of list) {
      visit(s);
      if (s.k === 'repeat') rec(s.body);
      if (s.k === 'if') {
        rec(s.then);
        if (s.else) rec(s.else);
      }
    }
  };
  rec(program.main);
  for (const p of program.procs.values()) rec(p.body);
}

function exprs(s: Stmt): Expr[] {
  switch (s.k) {
    case 'move':
    case 'turn':
    case 'pitch':
    case 'roll':
    case 'width':
    case 'let':
      return [s.arg];
    case 'repeat':
      return [s.count];
    case 'if':
      return [s.left, s.right];
    case 'call':
      return s.args;
    default:
      return [];
  }
}

const REQUIREMENT_TEXT: Record<Requirement, string> = {
  repeat: 'użycia polecenia powtórz',
  'procedure-params': 'własnej procedury z parametrami (oto … ma: … już), wywołanej w programie',
  counter: 'liczenia długości: przez nrpowt albo zmienną zmienianą poleceniem niech',
  spatial: 'poleceń przestrzennych, takich jak gora albo dol',
};

export function missingRequirement(ch: Challenge, source: string): Requirement | null {
  const c = compile(source, ch.mode);
  if (!c.program) return null;
  const prog = c.program;
  const has = new Set<Requirement>();
  let called = false;
  walk(prog, (s) => {
    if (s.k === 'repeat') has.add('repeat');
    if (s.k === 'pitch' || s.k === 'roll') has.add('spatial');
    if (s.k === 'let') has.add('counter');
    if (s.k === 'call' && (prog.procs.get(s.name)?.params.length ?? 0) > 0) called = true;
    for (const e of exprs(s)) if (e.rpn.some((op) => op.k === 'rep')) has.add('counter');
  });
  if (called) has.add('procedure-params');
  for (const r of ch.requires ?? []) if (!has.has(r)) return r;
  return null;
}

function fmtLen(v: number): string {
  return String(Math.round(v));
}

/** Checks a program against a challenge's expected drawing. */
export function checkChallenge(ch: Challenge, source: string): CheckResult {
  const fail = (verdict: string, reason: string, extra: Partial<CheckResult> = {}): CheckResult => ({
    passed: false,
    verdict,
    reason,
    missing: [],
    extra: [],
    error: null,
    ...extra,
  });
  const res = runProgram(source, ch.mode);
  if (res.error) {
    return fail(
      'Program ma błąd',
      `Wiersz ${res.error.line}, kolumna ${res.error.column}: ${res.error.message}`,
      { error: res.error },
    );
  }
  const user = res.segments;
  if (!user.length) return fail('Pusty rysunek', 'Żółw nic nie narysował. Sprawdź, czy pisak jest opuszczony (opu) i czy żółw się porusza (np).');
  if (user.length > 6000) return fail('Za dużo linii', 'Rysunek ma znacznie więcej odcinków niż wzór. Spróbuj prostszego programu.');

  const target = targetOf(ch);
  const tb = bbox(target);
  const diag = len(sub(tb.hi, tb.lo));
  const tol = Math.max(1.5, diag * 0.006);
  const step = Math.max(1, tol);
  const targetLen = totalLength(target);
  const userLen = totalLength(user);
  const targetIndex = new SegIndex(target, Math.max(10, tol * 4), tol);

  type Cand = { mirror: boolean; offset: P; missing: Coverage; extra: Coverage; score: number };
  let best: Cand | null = null;
  for (const mirror of [false, true]) {
    const mapped = mirror ? user.map((s) => ({ ...s, from: [-s.from[0], s.from[1], s.from[2]] as P, to: [-s.to[0], s.to[1], s.to[2]] as P })) : user;
    const ub = bbox(mapped);
    const offsets: P[] = [[0, 0, 0], sub(tb.center, ub.center), sub(tb.lo, ub.lo), sub(target[0]!.from, mapped[0]!.from)];
    for (const off of offsets) {
      const moved = mapped.map((s) => ({ ...s, from: [s.from[0] + off[0], s.from[1] + off[1], s.from[2] + off[2]] as P, to: [s.to[0] + off[0], s.to[1] + off[1], s.to[2] + off[2]] as P }));
      const userIndex = new SegIndex(moved, Math.max(10, tol * 4), tol);
      const missing = coverage(target, userIndex, tol, step);
      const extra = coverage(moved, targetIndex, tol, step);
      const score = missing.uncovered + extra.uncovered + (mirror ? 1e-6 : 0) + (off[0] || off[1] || off[2] ? 1e-9 : 0);
      if (!best || score < best.score) best = { mirror, offset: off, missing, extra, score };
    }
  }
  const b = best!;
  // map pieces back into the user's frame
  const back = (s: Segment): Segment => {
    const f = (p: P): P => {
      const q: P = [p[0] - b.offset[0], p[1] - b.offset[1], p[2] - b.offset[2]];
      return b.mirror ? [-q[0], q[1], q[2]] : q;
    };
    return { ...s, from: f(s.from), to: f(s.to) };
  };
  const allowed = Math.max(2, targetLen * 0.01);
  const missing = b.missing.runs.map(back);
  const extra = b.extra.runs.map(back);
  if (b.missing.uncovered > allowed || b.extra.uncovered > allowed) {
    const parts: string[] = [];
    if (b.missing.uncovered > allowed) parts.push(`brakuje około ${fmtLen(b.missing.uncovered)} jednostek linii (czerwona przerywana)`);
    if (b.extra.uncovered > allowed) parts.push(`około ${fmtLen(b.extra.uncovered)} jednostek jest nadmiarowe (pomarańczowe)`);
    let reason = `Rysunek różni się od wzoru: ${parts.join(', a ')}.`;
    if (Math.abs(userLen - targetLen) / targetLen > 0.03) {
      reason += ` Twoje linie mają razem ${fmtLen(userLen)} jednostek, a we wzorze ${fmtLen(targetLen)}. Sprawdź długości i liczbę powtórzeń.`;
    } else {
      reason += ' Łączna długość linii się zgadza, więc sprawdź kąty skrętów i kolejność ruchów.';
    }
    return fail('Jeszcze nie', reason, { missing, extra });
  }
  // colour and width, compared at the middle of every target segment
  if (ch.checkColor || ch.checkWidth) {
    const fwd = (p: P): P => {
      const q: P = b.mirror ? [-p[0], p[1], p[2]] : p;
      return [q[0] + b.offset[0], q[1] + b.offset[1], q[2] + b.offset[2]];
    };
    const moved = user.map((s) => ({ ...s, from: fwd(s.from), to: fwd(s.to) }));
    const idx = new SegIndex(moved, Math.max(10, tol * 4), tol);
    for (const t of target) {
      const mid: P = [(t.from[0] + t.to[0]) / 2, (t.from[1] + t.to[1]) / 2, (t.from[2] + t.to[2]) / 2];
      const near = idx.nearest(mid, tol);
      if (!near) continue;
      if (ch.checkColor && near.color !== t.color) {
        return fail('Prawie', `Kształt się zgadza, ale linie mają kolor ${near.color}, a powinny mieć "${t.color}".`);
      }
      if (ch.checkWidth && near.width !== t.width) {
        return fail('Prawie', `Kształt się zgadza, ale grubość linii wynosi ${near.width}, a powinna wynosić ${t.width}.`);
      }
    }
  }
  const req = missingRequirement(ch, source);
  if (req) return fail('Prawie', `Kształt się zgadza, ale to zadanie wymaga ${REQUIREMENT_TEXT[req]}.`);
  const notes: string[] = [];
  if (b.mirror) notes.push('Rysunek jest lustrzanym odbiciem wzoru, co też się liczy.');
  else if (b.offset[0] || b.offset[1] || b.offset[2]) notes.push('Rysunek leży w innym miejscu niż wzór, ale kształt jest ten sam.');
  return { passed: true, verdict: 'Zaliczone', reason: ['Rysunek zgadza się ze wzorem.', ...notes].join(' '), missing: [], extra: [], error: null };
}
