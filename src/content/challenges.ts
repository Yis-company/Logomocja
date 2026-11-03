// Practice tasks and the drawing checker.
import { compile, run, Segment, Vec } from '../lang/interp';
import type { Mode } from '../lang/parser';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  task: string;
  hint: string;
  /** Reference solution; the expected drawing is its output. */
  solution: string;
  needs?: 'procedure' | 'repeat';
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'kwadrat-100', title: 'Kwadrat o boku 100', mode: '2d',
    task: 'Narysuj kwadrat o boku 100. Zacznij w punkcie startowym, idź w górę i skręcaj w prawo.',
    hint: 'Cztery razy: naprzód i skręt o 90 stopni. Spróbuj z powtorz.',
    solution: 'powtorz 4 [np 100 pw 90]',
  },
  {
    id: 'trojkat', title: 'Trójkąt równoboczny', mode: '2d',
    task: 'Narysuj trójkąt równoboczny o boku 120, skręcając w prawo.',
    hint: 'Żółw musi obrócić się łącznie o 360°. Przy trzech bokach każdy skręt to 360 / 3.',
    solution: 'powtorz 3 [np 120 pw 120]',
  },
  {
    id: 'schodki', title: 'Schodki', mode: '2d',
    task: 'Narysuj cztery stopnie: każdy ma 30 w górę i 30 w prawo. Zacznij od kroku w górę.',
    hint: 'Jeden stopień to: np 30 pw 90 np 30 lw 90.',
    solution: 'powtorz 4 [np 30 pw 90 np 30 lw 90]',
  },
  {
    id: 'dwa-kwadraty', title: 'Dwa kwadraty', mode: '2d',
    task: 'Narysuj dwa kwadraty o boku 60 obok siebie, z przerwą 30 między nimi. Pierwszy zaczyna się w punkcie startowym.',
    hint: 'Między kwadratami podnieś pisak (pod), przejdź 90 w prawo i opuść go (opu).',
    solution: 'powtorz 4 [np 60 pw 90]\npod pw 90 np 90 lw 90 opu\npowtorz 4 [np 60 pw 90]',
  },
  {
    id: 'szesciokat', title: 'Sześciokąt w procedurze', mode: '2d',
    task: 'Zdefiniuj procedurę, która rysuje sześciokąt foremny, i wywołaj ją z bokiem 70.',
    hint: 'oto sześciokąt ma: bok … już, a w środku powtorz 6 razy np bok pw 60.',
    solution: 'oto sześciokąt ma: bok\n  powtorz 6 [np bok pw 60]\njuż\nsześciokąt 70',
    needs: 'procedure',
  },
  {
    id: 'rosnace-kwadraty', title: 'Rosnące kwadraty', mode: '2d',
    task: 'Narysuj pięć kwadratów o wspólnym rogu, o bokach 20, 40, 60, 80 i 100.',
    hint: 'nrpowt mówi, które to powtórzenie: bok to nrpowt * 20.',
    solution: 'oto kw ma: b\n  powtorz 4 [np b pw 90]\njuż\npowtorz 5 [kw nrpowt * 20]',
  },
  {
    id: 'pionowy-kwadrat', title: 'Kwadrat na ścianie', mode: '3d',
    task: 'W trybie 3D narysuj kwadrat o boku 80 stojący pionowo: pierwszy bok idzie prosto w górę, a kolejne skręcają w prawo.',
    hint: 'Najpierw unieś nos żółwia: gora 90. Potem rysuj zwykły kwadrat.',
    solution: 'gora 90\npowtorz 4 [np 80 pw 90]',
  },
];

export interface CheckResult {
  ok: boolean;
  reason: string;
  segments: Segment[];
  error?: { message: string; line: number; column: number };
}

const TOL = 2;

function sample(s: Segment): Vec[] {
  const d = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
  const n = Math.max(1, Math.ceil(d / 2));
  const pts: Vec[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([
      s.from[0] + (s.to[0] - s.from[0]) * t,
      s.from[1] + (s.to[1] - s.from[1]) * t,
      s.from[2] + (s.to[2] - s.from[2]) * t,
    ]);
  }
  return pts;
}

function distToSeg(p: Vec, s: Segment): number {
  const ab = [s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]];
  const ap = [p[0] - s.from[0], p[1] - s.from[1], p[2] - s.from[2]];
  const len = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2;
  const t = len === 0 ? 0 : Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / len));
  return Math.hypot(ap[0] - ab[0] * t, ap[1] - ab[1] * t, ap[2] - ab[2] * t);
}

function firstUncovered(a: Segment[], b: Segment[]): Vec | null {
  for (const s of a) for (const p of sample(s)) if (!b.some((t) => distToSeg(p, t) <= TOL)) return p;
  return null;
}

const where = (p: Vec, mode: Mode) =>
  `(${p.slice(0, mode === '3d' ? 3 : 2).map((v) => Math.round(v)).join('; ')})`;

const cache = new Map<string, Segment[]>();
export function expected(c: Challenge): Segment[] {
  if (!cache.has(c.id)) cache.set(c.id, run(c.solution, c.mode).segments);
  return cache.get(c.id)!;
}

/** Compare a program's drawing with the expected one, point by point, within 2 units. */
export function check(c: Challenge, source: string): CheckResult {
  const res = run(source, c.mode);
  if (res.error) {
    return { ok: false, reason: `Program ma błąd w wierszu ${res.error.line}, kolumnie ${res.error.column}: ${res.error.message}`, segments: res.segments, error: res.error };
  }
  if (!res.segments.length) return { ok: false, reason: 'Program niczego nie narysował.', segments: [] };
  const exp = expected(c);
  const missing = firstUncovered(exp, res.segments);
  if (missing) return { ok: false, reason: `Brakuje części wzoru w okolicy punktu ${where(missing, c.mode)}.`, segments: res.segments };
  const extra = firstUncovered(res.segments, exp);
  if (extra) return { ok: false, reason: `Rysunek wychodzi poza wzór w okolicy punktu ${where(extra, c.mode)}.`, segments: res.segments };
  if (c.needs === 'procedure' && compile(source, c.mode).procs.size === 0) {
    return { ok: false, reason: 'Rysunek się zgadza, ale zadanie wymaga zdefiniowania procedury słowem oto.', segments: res.segments };
  }
  return { ok: true, reason: 'Rysunek zgadza się ze wzorem.', segments: res.segments };
}
