import { runProgram, type Segment } from './index';
import type { Mode } from './vocab';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  task: string;
  starter: string;
  /** A reference program; its drawing is the target shape. */
  expected: string;
  /** Largest allowed distance between the drawings, in units. */
  tolerance: number;
  /** Extra requirement on the program text; returns a reason when it is not met. */
  requires?: (source: string) => string | null;
}

export interface CheckResult {
  ok: boolean;
  reason: string;
}

const needs = (re: RegExp, what: string) => (src: string) => (re.test(src) ? null : `Użyj ${what}.`);

export const CHALLENGES: Challenge[] = [
  {
    id: 'kwadrat-100',
    title: 'Kwadrat o boku 100',
    mode: '2d',
    task: 'Narysuj kwadrat o boku 100. Żółw startuje z punktu (0, 0) i patrzy w górę ekranu.',
    starter: '; Twój kwadrat\n',
    expected: 'powtorz 4 [np 100 pw 90]',
    tolerance: 2,
  },
  {
    id: 'trojkat-100',
    title: 'Równoboczny trójkąt',
    mode: '2d',
    task: 'Narysuj równoboczny trójkąt o boku 100, startując z punktu (0, 0).',
    starter: '; Trójkąt\n',
    expected: 'powtorz 3 [np 100 pw 120]',
    tolerance: 2,
  },
  {
    id: 'szesciokat-procedura',
    title: 'Sześciokąt z procedurą',
    mode: '2d',
    task: 'Narysuj sześciokąt foremny o boku 50. Zdefiniuj procedurę (oto … już) i użyj jej.',
    starter: 'oto szesciokat ma: bok\n  ; uzupełnij ciało\njuz\n\nszesciokat 50\n',
    expected: 'oto szesciokat ma: bok\n  powtorz 6 [np bok pw 60]\njuz\nszesciokat 50',
    tolerance: 2,
    requires: (src) => (/^\s*(oto|to)\s/im.test(src) ? null : 'Zdefiniuj procedurę słowem „oto”.'),
  },
  {
    id: 'gwiazda-180',
    title: 'Gwiazda pięcioramienna',
    mode: '2d',
    task: 'Narysuj gwiazdę o pięciu ramionach, każde o długości 180. Użyj polecenia powtórz.',
    starter: '; Gwiazda\n',
    expected: 'powtorz 5 [np 180 pw 144]',
    tolerance: 3,
    requires: needs(/\bpowt[oó]rz\b/i, 'polecenia „powtórz”'),
  },
  {
    id: 'schody-2d',
    title: 'Schodki',
    mode: '2d',
    task: 'Narysuj cztery stopnie schodów: w górę 20, w prawo 20, cztery razy, zaczynając w (0, 0).',
    starter: '; Schodki\n',
    expected: 'powtorz 4 [np 20 pw 90 np 20 lw 90]',
    tolerance: 2,
  },
  {
    id: 'pionowy-kwadrat-3d',
    title: 'Pionowy kwadrat w 3D',
    mode: '3d',
    task: 'W trybie 3D narysuj kwadrat o boku 100 leżący w płaszczyźnie pionowej. Użyj polecenia gora.',
    starter: '; Pionowy kwadrat\n',
    expected: 'powtorz 4 [np 100 gora 90]',
    tolerance: 2,
    requires: needs(/\bgora\b|\bpitchup\b/i, 'polecenia „gora”'),
  },
];

const SAMPLE_STEP = 2;

function distToSegment(p: number[], s: Segment): number {
  const [ax, ay, az] = s.from;
  const d = [s.to[0] - ax, s.to[1] - ay, s.to[2] - az];
  const len2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
  let t = len2 === 0 ? 0 : ((p[0] - ax) * d[0] + (p[1] - ay) * d[1] + (p[2] - az) * d[2]) / len2;
  t = Math.max(0, Math.min(1, t));
  const x = ax + d[0] * t - p[0];
  const y = ay + d[1] * t - p[1];
  const z = az + d[2] * t - p[2];
  return Math.sqrt(x * x + y * y + z * z);
}

/** Largest distance from a sample point on `a` to the nearest part of `b`. */
export function deviation(a: Segment[], b: Segment[]): number {
  let worst = 0;
  for (const s of a) {
    const len = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
    const n = Math.max(1, Math.min(64, Math.ceil(len / SAMPLE_STEP)));
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      const p = [0, 1, 2].map((i) => s.from[i] + (s.to[i] - s.from[i]) * t);
      let best = Infinity;
      for (const r of b) {
        const d = distToSegment(p, r);
        if (d < best) best = d;
        if (best === 0) break;
      }
      if (best > worst) worst = best;
    }
  }
  return worst;
}

export function checkChallenge(c: Challenge, source: string): CheckResult {
  const run = runProgram(source, c.mode);
  if (run.error) {
    return { ok: false, reason: `Błąd w linii ${run.error.line}, kolumna ${run.error.column}: ${run.error.message}` };
  }
  const req = c.requires?.(source);
  if (req) return { ok: false, reason: req };
  if (run.segments.length === 0) return { ok: false, reason: 'Nic nie zostało narysowane.' };

  const target = runProgram(c.expected, c.mode).segments;
  const extra = deviation(run.segments, target);
  if (extra > c.tolerance) {
    return { ok: false, reason: `Rysunek nie pasuje do wzoru: fragment jest oddalony o ok. ${extra.toFixed(1)}.` };
  }
  const missing = deviation(target, run.segments);
  if (missing > c.tolerance) {
    return { ok: false, reason: `Brakuje fragmentu rysunku: ok. ${missing.toFixed(1)} jednostek od wzoru bez pokrycia.` };
  }
  return { ok: true, reason: 'Zgadza się!' };
}
