import type { Mode, Program } from './lang/ast';
import { compile, run } from './lang/index';
import type { Segment, V3 } from './lang/interpreter';

export type Requirement = 'repeat' | 'procedure' | 'variable' | 'if' | 'nrpowt';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  level: 1 | 2 | 3;
  task: string;
  hint: string;
  /** reference solution; its drawing is the pattern */
  solution: string;
  requires?: Requirement[];
  /** compare inks as well as shape */
  checkColor?: boolean;
  /** starter text placed in the editor */
  starter: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'trojkat',
    title: 'Trójkąt równoboczny',
    mode: '2d',
    level: 1,
    task: 'Narysuj trójkąt równoboczny o boku 100.',
    hint: 'Żółw obraca się łącznie o 360°. Ile stopni przypada na jeden róg?',
    solution: 'powtorz 3 [np 100 pw 120]',
    starter: '; Trójkąt równoboczny o boku 100\n',
  },
  {
    id: 'schodki',
    title: 'Schodki',
    mode: '2d',
    level: 1,
    task: 'Narysuj pięć schodków. Każdy stopień to 30 w górę i 30 w prawo.',
    hint: 'Jeden stopień: np 30 pw 90 np 30 lw 90. Teraz powtórz go.',
    solution: 'powtorz 5 [np 30 pw 90 np 30 lw 90]',
    requires: ['repeat'],
    starter: '; Pięć schodków po 30\n',
  },
  {
    id: 'szesciokat',
    title: 'Sześciokąt z procedury',
    mode: '2d',
    level: 2,
    task: 'Zdefiniuj procedurę z parametrem bok, która rysuje sześciokąt foremny, i narysuj nią sześciokąt o boku 60.',
    hint: 'oto sześciokąt ma: bok … już, a w środku powtórz 6 razy: naprzód o bok i skręt o 60°.',
    solution: 'oto sześciokąt ma: bok\n  powtorz 6 [np bok pw 60]\njuż\nsześciokąt 60',
    requires: ['procedure'],
    starter: 'oto sześciokąt ma: bok\n  \njuż\n\n',
  },
  {
    id: 'kwiat',
    title: 'Kwiat z kwadratów',
    mode: '2d',
    level: 2,
    task: 'Narysuj osiem kwadratów o boku 70. Każdy następny jest obrócony o 45° względem poprzedniego.',
    hint: 'Powtórzenie w powtórzeniu: wewnętrzne rysuje kwadrat, zewnętrzne obraca żółwia.',
    solution: 'powtorz 8 [powtorz 4 [np 70 pw 90] pw 45]',
    requires: ['repeat'],
    starter: '; Osiem kwadratów, co 45°\n',
  },
  {
    id: 'spirala',
    title: 'Kwadratowa spirala',
    mode: '2d',
    level: 2,
    task: 'Narysuj spiralę z 16 odcinków: pierwszy ma długość 10, każdy kolejny jest o 10 dłuższy, a po każdym żółw skręca w prawo o 90°.',
    hint: 'nrpowt mówi, które to powtórzenie: 1, 2, 3… Pomnóż je przez 10.',
    solution: 'powtorz 16 [np nrpowt * 10 pw 90]',
    requires: ['repeat'],
    starter: '; Spirala z 16 odcinków\n',
  },
  {
    id: 'gwiazda8',
    title: 'Gwiazda w dwóch kolorach',
    mode: '2d',
    level: 3,
    task: 'Narysuj ośmioramienną gwiazdę: 8 odcinków po 120 i skręt o 135° po każdym. Odcinki mają na zmianę kolor "#16866a" i "#c1763d", zaczynając od zielonego.',
    hint: 'Przyda się zmienna, która co krok zmienia znak, i jeżeli z dwoma blokami.',
    solution:
      'niech z 1\npowtorz 8 [\n  jeżeli z > 0 [kolor "#16866a"] [kolor "#c1763d"]\n  niech z -z\n  np 120\n  pw 135\n]',
    checkColor: true,
    starter: '; Ośmioramienna gwiazda, kolory na zmianę\n',
  },
  {
    id: 'pionowy',
    title: 'Pionowy kwadrat',
    mode: '3d',
    level: 2,
    task: 'Narysuj pionowy kwadrat o boku 80. Pierwszy bok prowadzi prosto w górę, a żółw skręca tylko poleceniem góra.',
    hint: 'gora 90 kieruje nos żółwia w górę. Cztery razy: obrót w górę i krok naprzód.',
    solution: 'powtorz 4 [gora 90 np 80]',
    starter: '; Pionowy kwadrat o boku 80\n',
  },
  {
    id: 'wieza',
    title: 'Wieża z trzech pięter',
    mode: '3d',
    level: 3,
    task: 'Narysuj trzy poziome kwadraty o boku 60, jeden nad drugim co 40. Połącz je pionową linią w rogu, w którym zaczyna żółw.',
    hint: 'Po każdym kwadracie: gora 90, naprzód o 40, dol 90 — i kolejny kwadrat.',
    solution:
      'powtorz 4 [np 60 pw 90]\npowtorz 2 [\n  gora 90 np 40 dol 90\n  powtorz 4 [np 60 pw 90]\n]',
    starter: '; Trzy piętra po 40\n',
  },
];

export const CHALLENGE_BY_ID = new Map(CHALLENGES.map((c) => [c.id, c]));

const REQUIREMENT_TEXT: Record<Requirement, string> = {
  repeat: 'polecenia powtórz',
  procedure: 'własnej procedury (oto … już)',
  variable: 'zmiennej (niech)',
  if: 'warunku (jeśli albo jeżeli)',
  nrpowt: 'licznika nrpowt',
};

export function requirementText(r: Requirement) {
  return REQUIREMENT_TEXT[r];
}

export interface CheckResult {
  pass: boolean;
  title: string;
  reason: string;
  segments: Segment[];
}

const patternCache = new Map<string, Segment[]>();

export function patternOf(c: Challenge): Segment[] {
  let p = patternCache.get(c.id);
  if (!p) {
    p = run(c.solution, c.mode).segments;
    patternCache.set(c.id, p);
  }
  return p;
}

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

function bbox(segs: Segment[]) {
  const min: V3 = [Infinity, Infinity, Infinity];
  const max: V3 = [-Infinity, -Infinity, -Infinity];
  for (const s of segs)
    for (const p of [s.from, s.to])
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], p[k]);
        max[k] = Math.max(max[k], p[k]);
      }
  return { min, max, size: sub(max, min) };
}

function distToSegment(p: V3, a: V3, b: V3): number {
  const ab = sub(b, a);
  const ap = sub(p, a);
  const len2 = ab[0] * ab[0] + ab[1] * ab[1] + ab[2] * ab[2];
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / len2));
  return Math.hypot(ap[0] - ab[0] * t, ap[1] - ab[1] * t, ap[2] - ab[2] * t);
}

function samples(segs: Segment[], step: number): { p: V3; color: string }[] {
  const out: { p: V3; color: string }[] = [];
  for (const s of segs) {
    const d = sub(s.to, s.from);
    const len = Math.hypot(d[0], d[1], d[2]);
    const n = Math.max(1, Math.min(200, Math.ceil(len / step)));
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      out.push({ p: [s.from[0] + d[0] * t, s.from[1] + d[1] * t, s.from[2] + d[2] * t], color: s.color });
    }
  }
  return out;
}

function nearest(p: V3, segs: Segment[]): { d: number; seg: Segment | null } {
  let best = Infinity;
  let seg: Segment | null = null;
  for (const s of segs) {
    const d = distToSegment(p, s.from, s.to);
    if (d < best) {
      best = d;
      seg = s;
    }
  }
  return { d: best, seg };
}

const fmt = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',');

/**
 * Compares the learner's drawing with the pattern. The drawing may start
 * anywhere (translation is ignored); shape, size and orientation must match
 * within a tolerance of 1% of the pattern's size (at least 1.5 units).
 */
export function checkChallenge(c: Challenge, source: string): CheckResult {
  const result = run(source, c.mode);
  const segs = result.segments;
  if (result.error) {
    return {
      pass: false,
      title: 'Program ma błąd',
      reason: `Wiersz ${result.error.line}, kolumna ${result.error.column}: ${result.error.message}`,
      segments: segs,
    };
  }
  if (!segs.length) {
    return { pass: false, title: 'Nic nie narysowano', reason: 'Program działa, ale żółw nie narysował ani jednego odcinka. Czy pióro jest opuszczone?', segments: segs };
  }
  const pattern = patternOf(c);
  // turning left instead of right everywhere draws the mirror image; both count
  const mirrored = pattern.map((s) => ({ ...s, from: [-s.from[0], s.from[1], s.from[2]] as V3, to: [-s.to[0], s.to[1], s.to[2]] as V3 }));
  const first = compareShapes(c, pattern, segs);
  const shape = first.pass ? first : compareShapes(c, mirrored, segs);
  if (!shape.pass) return { ...(first.pass ? shape : first), segments: segs };

  const compiled = compile(source, c.mode);
  const program = compiled.program as Program;
  const unmet = (c.requires ?? []).filter((r) => !uses(program, r));
  if (unmet.length) {
    return {
      pass: false,
      title: 'Prawie!',
      reason: `Rysunek się zgadza, ale to zadanie wymaga użycia ${unmet.map(requirementText).join(' i ')}.`,
      segments: segs,
    };
  }
  return { pass: true, title: 'Zaliczone!', reason: 'Rysunek zgadza się ze wzorem.', segments: segs };
}


function compareShapes(c: Challenge, target: Segment[], segs: Segment[]): { pass: boolean; title: string; reason: string } {
  const tb = bbox(target);
  const ub = bbox(segs);
  const diag = Math.hypot(...tb.size);
  const tol = Math.max(1.5, diag * 0.01);

  const sizeOff = [0, 1, 2].some((k) => Math.abs(tb.size[k] - ub.size[k]) > tol);
  if (sizeOff) {
    const dims = (s: V3) => (c.mode === '3d' ? `${fmt(s[0])} × ${fmt(s[1])} × ${fmt(s[2])}` : `${fmt(s[0])} × ${fmt(s[1])}`);
    return {
      pass: false,
      title: 'Inny rozmiar',
      reason: `Wzór zajmuje ${dims(tb.size)}, a twój rysunek ${dims(ub.size)}. Sprawdź długości odcinków i kąty.`,
          };
  }

  const shift = sub(tb.min, ub.min);
  const moved = segs.map((s) => ({ ...s, from: [s.from[0] + shift[0], s.from[1] + shift[1], s.from[2] + shift[2]] as V3, to: [s.to[0] + shift[0], s.to[1] + shift[1], s.to[2] + shift[2]] as V3 }));
  const step = Math.max(tol, diag / 400);

  const tSamples = samples(target, step);
  let missing = 0;
  let wrongInk = 0;
  for (const s of tSamples) {
    const n = nearest(s.p, moved);
    if (n.d > tol) missing++;
    else if (c.checkColor && n.seg && n.seg.color !== s.color) {
      // a matching stroke of the right ink anywhere nearby is fine
      const sameInk = moved.filter((m) => m.color === s.color);
      if (nearest(s.p, sameInk).d > tol) wrongInk++;
    }
  }
  const uSamples = samples(moved, step);
  let extra = 0;
  for (const s of uSamples) if (nearest(s.p, target).d > tol) extra++;

  const missingShare = missing / tSamples.length;
  const extraShare = extra / uSamples.length;
  if (missingShare > 0.01 || extraShare > 0.01) {
    const parts: string[] = [];
    if (missingShare > 0.01) parts.push(`brakuje około ${Math.max(1, Math.round(missingShare * 100))}% wzoru`);
    if (extraShare > 0.01) parts.push(`około ${Math.max(1, Math.round(extraShare * 100))}% twoich linii nie ma we wzorze`);
    return {
      pass: false,
      title: 'Kształt się różni',
      reason: `Rozmiar się zgadza, ale ${parts.join(', a ')}. Porównaj swój rysunek z przerywanym wzorem.`,
          };
  }
  if (wrongInk / tSamples.length > 0.01) {
    return {
      pass: false,
      title: 'Kolory się nie zgadzają',
      reason: 'Kształt jest dobry, ale część odcinków ma inny kolor niż we wzorze.',
          };
  }

  return { pass: true, title: '', reason: '' };
}

function uses(p: Program, r: Requirement): boolean {
  if (r === 'procedure') return p.uses.has('procedure');
  return p.uses.has(r);
}
