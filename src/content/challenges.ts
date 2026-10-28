import { type LogoError, type Mode, type Segment, type Vec3, runSource } from '../lang/index';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  /** What to draw, in Polish. */
  task: string;
  /** A program that draws the expected picture; shown only on request. */
  solution: string;
  /** Optional requirements on how the lines are drawn. */
  require?: { colour?: string; width?: number };
}

export const CHALLENGES: readonly Challenge[] = [
  {
    id: 'kwadrat',
    title: 'Kwadrat',
    mode: '2d',
    task: 'Narysuj kwadrat o boku 100. Żółw zaczyna w punkcie początkowym, patrząc w górę.',
    solution: 'powtorz 4 [np 100 pw 90]\n',
  },
  {
    id: 'trojkat',
    title: 'Trójkąt równoboczny',
    mode: '2d',
    task: 'Narysuj trójkąt równoboczny o boku 100, zaczynając od punktu początkowego.',
    solution: 'powtorz 3 [np 100 pw 120]\n',
  },
  {
    id: 'szesciokat',
    title: 'Sześciokąt z procedurą',
    mode: '2d',
    task: 'Napisz procedurę z parametrem bok i użyj jej, aby narysować sześciokąt foremny o boku 50.',
    solution: 'oto szesciokat ma: bok\n  powtorz 6 [np bok pw 60]\njuż\n\nszesciokat 50\n',
  },
  {
    id: 'gwiazda',
    title: 'Gwiazda pięcioramienna',
    mode: '2d',
    task: 'Narysuj gwiazdę pięcioramienną z odcinkami o długości 100. Skręt w każdym rogu wynosi 144 stopnie.',
    solution: 'powtorz 5 [np 100 pw 144]\n',
  },
  {
    id: 'przerywana',
    title: 'Linia przerywana',
    mode: '2d',
    task: 'Narysuj pięć kresek o długości 20, każda oddzielona od następnej przerwą o długości 10. Kreski mają być w kolorze #c1763d i mieć grubość 4.',
    solution: 'kolor "#c1763d"\ngrubosc 4\npowtorz 5 [np 20 pod np 10 opu]\n',
    require: { colour: '#c1763d', width: 4 },
  },
  {
    id: 'szescian',
    title: 'Sześcian w przestrzeni',
    mode: '3d',
    task: 'Zbuduj sześcian o boku 100 z prostych poleceń. Dolny kwadrat zaczyna się w punkcie początkowym.',
    solution:
      'powtorz 4 [np 100 pw 90]\ngora 90 np 100 dol 90\npowtorz 4 [np 100 pw 90]\npowtorz 4 [\n  np 100\n  dol 90 np 100\n  pod ws 100 opu\n  gora 90 pw 90\n]\n',
  },
];

export function findChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export type CheckResult = { ok: true; reason: string } | { ok: false; reason: string; error?: LogoError };

/** Distance between a point and a segment. */
function distanceToSegment(p: Vec3, a: Vec3, b: Vec3): number {
  const abx = b[0] - a[0];
  const aby = b[1] - a[1];
  const abz = b[2] - a[2];
  const len2 = abx * abx + aby * aby + abz * abz;
  let t = len2 === 0 ? 0 : ((p[0] - a[0]) * abx + (p[1] - a[1]) * aby + (p[2] - a[2]) * abz) / len2;
  t = Math.max(0, Math.min(1, t));
  const dx = a[0] + abx * t - p[0];
  const dy = a[1] + aby * t - p[1];
  const dz = a[2] + abz * t - p[2];
  return Math.hypot(dx, dy, dz);
}

/** Points spaced at most `step` apart along the segments, endpoints included. */
function samplePoints(segments: readonly Segment[], step: number): Vec3[] {
  const points: Vec3[] = [];
  for (const s of segments) {
    const len = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
    const parts = Math.max(1, Math.ceil(len / step));
    for (let k = 0; k <= parts; k++) {
      const t = k / parts;
      points.push([
        s.from[0] + (s.to[0] - s.from[0]) * t,
        s.from[1] + (s.to[1] - s.from[1]) * t,
        s.from[2] + (s.to[2] - s.from[2]) * t,
      ]);
    }
  }
  return points;
}

function nearest(p: Vec3, segments: readonly Segment[]): number {
  let best = Infinity;
  for (const s of segments) {
    const d = distanceToSegment(p, s.from, s.to);
    if (d < best) best = d;
  }
  return best;
}

const TOLERANCE = 1.5;
const SAMPLE_STEP = 2;

function fmt(p: Vec3, mode: Mode): string {
  const r = (v: number): string => String(Math.round(v));
  return mode === '3d' ? `(${r(p[0])}, ${r(p[1])}, ${r(p[2])})` : `(${r(p[0])}, ${r(p[1])})`;
}

/**
 * Compares the drawn ink with the expected picture: every expected point must be
 * drawn (within tolerance) and nothing outside the picture may be drawn. How the
 * picture was produced (loops, procedures, pen moves) does not matter.
 */
export function checkDrawing(challenge: Challenge, actual: readonly Segment[]): CheckResult {
  const expected = runSource(challenge.solution, challenge.mode);
  if (expected.error) {
    return { ok: false, reason: `Wzorcowe rozwiązanie nie działa: ${expected.error.message}` };
  }
  const drawn = actual.filter((s) => s.from.some((v, k) => v !== s.to[k]));
  if (drawn.length === 0) {
    return { ok: false, reason: 'Nic nie narysowano. Sprawdź, czy żółw opuszcza pisak (opu) przed ruchem.' };
  }
  const require = challenge.require;
  if (require?.colour) {
    const wrong = drawn.find((s) => s.color !== require.colour);
    if (wrong) return { ok: false, reason: `Wszystkie kreski mają być w kolorze ${require.colour}, a jedna jest w kolorze ${wrong.color}.` };
  }
  if (require?.width !== undefined) {
    const wrong = drawn.find((s) => s.width !== require.width);
    if (wrong) return { ok: false, reason: `Wszystkie kreski mają mieć grubość ${require.width}, a jedna ma ${wrong.width}.` };
  }

  const expectedPoints = samplePoints(expected.segments, SAMPLE_STEP);
  for (const p of expectedPoints) {
    if (nearest(p, drawn) > TOLERANCE) {
      return { ok: false, reason: `Brakuje fragmentu rysunku w pobliżu punktu ${fmt(p, challenge.mode)}.` };
    }
  }
  for (const p of samplePoints(drawn, SAMPLE_STEP)) {
    if (nearest(p, expected.segments) > TOLERANCE) {
      return { ok: false, reason: `Narysowano linię, która nie należy do wzoru, w pobliżu punktu ${fmt(p, challenge.mode)}.` };
    }
  }
  return { ok: true, reason: 'Rysunek zgadza się ze wzorem.' };
}
