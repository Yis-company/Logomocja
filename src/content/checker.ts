import { compile, run, type Mode, type Segment } from '../lang';
import type { Stmt } from '../lang/ast';
import type { Vec3 } from '../lang/geometry';
import type { Challenge } from './challenges';

export interface CheckResult {
  pass: boolean;
  /** Wyjaśnienie po polsku. */
  reason: string;
}

type Box = { min: Vec3; max: Vec3 };

function box(segments: readonly Segment[]): Box {
  const min: Vec3 = [Infinity, Infinity, Infinity], max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const s of segments) {
    for (const p of [s.from, s.to]) {
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k]!, p[k]!);
        max[k] = Math.max(max[k]!, p[k]!);
      }
    }
  }
  return { min, max };
}

function distToSegment(p: Vec3, s: Segment): number {
  const a = s.from, b = s.to;
  const ab: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ap: Vec3 = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
  const len2 = ab[0] * ab[0] + ab[1] * ab[1] + ab[2] * ab[2];
  let t = len2 > 0 ? (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const dx = ap[0] - ab[0] * t, dy = ap[1] - ab[1] * t, dz = ap[2] - ab[2] * t;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Punkty rozłożone wzdłuż odcinków co około `step` jednostek. */
function samples(segments: readonly Segment[], step: number): Vec3[] {
  const pts: Vec3[] = [];
  for (const s of segments) {
    const len = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
    const n = Math.max(1, Math.ceil(len / step));
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      pts.push([
        s.from[0] + (s.to[0] - s.from[0]) * t,
        s.from[1] + (s.to[1] - s.from[1]) * t,
        s.from[2] + (s.to[2] - s.from[2]) * t,
      ]);
    }
  }
  return pts;
}

const round = (v: number) => {
  const r = Math.round(v);
  return Object.is(r, -0) ? 0 : r;
};
const fmtPoint = (p: Vec3, mode: Mode) =>
  mode === '3d' ? `(${round(p[0])}, ${round(p[1])}, ${round(p[2])})` : `(${round(p[0])}, ${round(p[1])})`;
const fmtSize = (b: Box, mode: Mode) => {
  const d = [0, 1, 2].map((k) => round(b.max[k]! - b.min[k]!));
  return mode === '3d' ? `${d[0]} × ${d[1]} × ${d[2]}` : `${d[0]} × ${d[1]}`;
};

function walk(stmts: Stmt[], visit: (s: Stmt) => void): void {
  for (const s of stmts) {
    visit(s);
    if (s.k === 'repeat') walk(s.body, visit);
    if (s.k === 'if') walk(s.then, visit);
    if (s.k === 'ifelse') { walk(s.then, visit); walk(s.else, visit); }
  }
}

/**
 * Porównuje rysunek ucznia ze wzorem. Kolejność i kierunek rysowania nie
 * mają znaczenia, położenie całego rysunku też nie (liczy się kształt
 * i rozmiar). Tolerancja: około 1% rozmiaru wzoru, co najmniej 1,5 jednostki.
 */
export function compareDrawings(user: readonly Segment[], expected: readonly Segment[], mode: Mode): CheckResult {
  if (!user.length) return { pass: false, reason: 'Nic nie zostało narysowane. Czy pióro jest opuszczone?' };
  const ub = box(user), eb = box(expected);
  const size = Math.max(...[0, 1, 2].map((k) => eb.max[k]! - eb.min[k]!), 1);
  const tol = Math.max(1.5, size * 0.01);
  for (let k = 0; k < 3; k++) {
    const du = ub.max[k]! - ub.min[k]!, de = eb.max[k]! - eb.min[k]!;
    if (Math.abs(du - de) > tol * 1.5) {
      return {
        pass: false,
        reason: `Rozmiar się nie zgadza: rysunek ma wymiary ${fmtSize(ub, mode)}, a wzór ${fmtSize(eb, mode)}.`,
      };
    }
  }
  // Przesuwamy rysunek ucznia tak, żeby jego ramka pokryła się z ramką wzoru.
  const shift: Vec3 = [eb.min[0] - ub.min[0], eb.min[1] - ub.min[1], eb.min[2] - ub.min[2]];
  const moved = user.map((s) => ({
    ...s,
    from: [s.from[0] + shift[0], s.from[1] + shift[1], s.from[2] + shift[2]] as Vec3,
    to: [s.to[0] + shift[0], s.to[1] + shift[1], s.to[2] + shift[2]] as Vec3,
  }));
  const step = Math.max(tol / 2, size / 300);
  for (const p of samples(moved, step)) {
    let best = Infinity;
    for (const s of expected) {
      best = Math.min(best, distToSegment(p, s));
      if (best <= tol) break;
    }
    if (best > tol) {
      const orig: Vec3 = [p[0] - shift[0], p[1] - shift[1], p[2] - shift[2]];
      return { pass: false, reason: `Na rysunku jest linia, której nie ma we wzorze – na przykład w punkcie ${fmtPoint(orig, mode)}.` };
    }
  }
  for (const p of samples(expected, step)) {
    let best = Infinity;
    for (const s of moved) {
      best = Math.min(best, distToSegment(p, s));
      if (best <= tol) break;
    }
    if (best > tol) {
      const orig: Vec3 = [p[0] - shift[0], p[1] - shift[1], p[2] - shift[2]];
      return { pass: false, reason: `Brakuje części wzoru – na przykład w pobliżu punktu ${fmtPoint(orig, mode)}.` };
    }
  }
  return { pass: true, reason: 'Rysunek zgadza się ze wzorem.' };
}

const expectedCache = new Map<string, Segment[]>();
export function expectedDrawing(ch: Challenge): Segment[] {
  let segs = expectedCache.get(ch.id);
  if (!segs) {
    segs = run(ch.solution, ch.mode).segments;
    expectedCache.set(ch.id, segs);
  }
  return segs;
}

/** Sprawdza rozwiązanie wyzwania. */
export function checkChallenge(ch: Challenge, source: string): CheckResult {
  const result = run(source, ch.mode);
  if (result.error) {
    return {
      pass: false,
      reason: `Program zgłasza błąd (wiersz ${result.error.line}, kolumna ${result.error.column}): ${result.error.message}`,
    };
  }
  if (ch.requires) {
    const c = compile(source, ch.mode);
    if (c.ok) {
      let repeat = false;
      walk(c.program.main, (s) => { if (s.k === 'repeat') repeat = true; });
      for (const p of c.program.procedures.values()) walk(p.body, (s) => { if (s.k === 'repeat') repeat = true; });
      if (ch.requires.repeat && !repeat) {
        return { pass: false, reason: 'Rysunek może się zgadzać, ale to zadanie trzeba rozwiązać z użyciem polecenia „powtórz”.' };
      }
      if (ch.requires.procedure) {
        let called = false;
        walk(c.program.main, (s) => { if (s.k === 'call') called = true; });
        if (c.program.procedures.size === 0 || !called) {
          return { pass: false, reason: 'To zadanie wymaga zdefiniowania procedury („oto … już”) i wywołania jej.' };
        }
      }
    }
  }
  const expected = expectedDrawing(ch);
  const verdict = compareDrawings(result.segments, expected, ch.mode);
  if (!verdict.pass && result.segments.length) {
    // Częsty błąd: skręty w przeciwną stronę dają lustrzane odbicie wzoru.
    const mirrored = result.segments.map((s) => ({
      ...s, from: [-s.from[0], s.from[1], s.from[2]] as Vec3, to: [-s.to[0], s.to[1], s.to[2]] as Vec3,
    }));
    if (compareDrawings(mirrored, expected, ch.mode).pass) {
      return { pass: false, reason: 'Rysunek jest lustrzanym odbiciem wzoru – może żółw skręca w złą stronę (pw zamiast lw albo odwrotnie)?' };
    }
  }
  return verdict;
}
