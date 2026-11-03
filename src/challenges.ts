import { run, type Segment, type Vec } from './lang/interp';
import type { Mode } from './lang/parser';
import { plural } from './lang/parser';

export interface Task {
  id: string;
  title: string;
  mode: Mode;
  /** Polecenie zadania, w punktach jak w podręczniku. */
  prompt: string;
  hint: string;
  /** Program wzorcowy: z niego powstaje rysunek, z którym porównujemy. */
  solution: string;
  starter: string;
}

export const TASKS: Task[] = [
  {
    id: 'trojkat',
    title: 'Trójkąt równoboczny',
    mode: '2d',
    prompt: 'Narysuj trójkąt równoboczny o boku 100. Zacznij od środka układu, idź naprzód i skręcaj w prawo.',
    hint: 'Trzy boki i trzy jednakowe skręty składają się na pełny obrót 360°.',
    solution: 'powtorz 3 [np 100 pw 120]',
    starter: '; Trójkąt równoboczny o boku 100\n',
  },
  {
    id: 'prostokat',
    title: 'Prostokąt',
    mode: '2d',
    prompt: 'Narysuj prostokąt o wysokości 60 i szerokości 140: najpierw w górę o 60, potem w prawo o 140.',
    hint: 'Boki przeciwległe są równe. Możesz powtórzyć dwa razy parę: krótki bok, długi bok.',
    solution: 'powtorz 2 [np 60 pw 90 np 140 pw 90]',
    starter: '; Prostokąt 140 × 60\n',
  },
  {
    id: 'szesciokat',
    title: 'Plaster miodu',
    mode: '2d',
    prompt: 'Narysuj sześciokąt foremny o boku 60, skręcając w prawo.',
    hint: 'Kąt skrętu to 360 podzielone przez liczbę boków.',
    solution: 'powtorz 6 [np 60 pw 60]',
    starter: '; Sześciokąt o boku 60\n',
  },
  {
    id: 'trzy-kwadraty',
    title: 'Trzy kwadraty w rzędzie',
    mode: '2d',
    prompt: 'Narysuj trzy kwadraty o boku 50 stojące w rzędzie w prawo, z przerwą 20 między nimi. Pierwszy zaczyna się w środku układu.',
    hint: 'Między kwadratami podnieś pióro („pod”), przesuń się i opuść je („opu”).',
    solution: 'powtorz 3 [\n  powtorz 4 [np 50 pw 90]\n  pod pw 90 np 70 lw 90 opu\n]',
    starter: '; Trzy kwadraty o boku 50, przerwa 20\n',
  },
  {
    id: 'gwiazda-osmioramienna',
    title: 'Gwiazda ośmioramienna',
    mode: '2d',
    prompt: 'Narysuj gwiazdę z ośmiu odcinków długości 120, skręcając za każdym razem w prawo o 135°.',
    hint: 'Osiem razy: naprzód, skręt. Sprawdź, czy żółw wróci na start.',
    solution: 'powtorz 8 [np 120 pw 135]',
    starter: '; Gwiazda ośmioramienna\n',
  },
  {
    id: 'schodki',
    title: 'Schodki w procedurze',
    mode: '2d',
    prompt: 'Napisz procedurę „stopień” o parametrze „wys”, która rysuje stopień: w górę o wys, w prawo o wys. Narysuj nią cztery stopnie o wysokości 30.',
    hint: 'Po każdym stopniu żółw powinien znów patrzeć w górę.',
    solution: 'oto stopień ma: wys\n  np wys pw 90 np wys lw 90\njuż\npowtorz 4 [stopień 30]',
    starter: 'oto stopień ma: wys\n  \njuż\n',
  },
  {
    id: 'sciana',
    title: 'Pionowa ściana',
    mode: '3d',
    prompt: 'W trybie 3D narysuj kwadrat o boku 80 stojący pionowo: idź naprzód i za każdym razem skręcaj w górę („gora”).',
    hint: 'To zwykły kwadrat, tylko skręty wykonujesz w górę zamiast w prawo.',
    solution: 'powtorz 4 [np 80 gora 90]',
    starter: '; Pionowy kwadrat o boku 80\n',
  },
  {
    id: 'trzy-osie',
    title: 'Trzy osie',
    mode: '3d',
    prompt: 'W trybie 3D narysuj z środka układu trzy odcinki długości 100: w prawo (oś x), naprzód (oś y) i w górę (oś z). Po każdym wróć do środka.',
    hint: 'Wracaj poleceniem „ws”, żeby nie rysować nowych linii. Do osi z prowadzi „gora 90”.',
    solution: 'pw 90 np 100 ws 100 lw 90\nnp 100 ws 100\ngora 90 np 100 ws 100 dol 90',
    starter: '; Trzy osie po 100: x, y i z\n',
  },
];

export const taskById = (id: string) => TASKS.find((t) => t.id === id);

export function solutionSegments(task: Task): Segment[] {
  return run(task.solution, task.mode).segments;
}

export interface CheckResult {
  ok: boolean;
  reason: string;
}

const TOLERANCE = 1.5;

function distToSeg(p: Vec, s: Segment): number {
  const a = s.from, b = s.to;
  const ab: Vec = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ap: Vec = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
  const len2 = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2;
  let t = len2 ? (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const q: Vec = [a[0] + ab[0] * t - p[0], a[1] + ab[1] * t - p[1], a[2] + ab[2] * t - p[2]];
  return Math.hypot(q[0], q[1], q[2]);
}

function samples(s: Segment): Vec[] {
  const len = Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]);
  const n = Math.max(2, Math.min(200, Math.ceil(len / 2)));
  const out: Vec[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    out.push([s.from[0] + (s.to[0] - s.from[0]) * t, s.from[1] + (s.to[1] - s.from[1]) * t, s.from[2] + (s.to[2] - s.from[2]) * t]);
  }
  return out;
}

/** Pierwszy punkt rysunku `a`, który leży dalej niż tolerancja od każdego odcinka `b`. */
function firstUncovered(a: Segment[], b: Segment[]): Vec | null {
  for (const s of a) {
    for (const p of samples(s)) {
      let best = Infinity;
      for (const t of b) {
        best = Math.min(best, distToSeg(p, t));
        if (best <= TOLERANCE) break;
      }
      if (best > TOLERANCE) return p;
    }
  }
  return null;
}

const fmtPoint = (p: Vec, mode: Mode) => {
  const r = (v: number) => String(Math.round(v)).replace('-0', '0');
  return mode === '3d' ? `(${r(p[0])}, ${r(p[1])}, ${r(p[2])})` : `(${r(p[0])}, ${r(p[1])})`;
};

/**
 * Porównuje rysunki jako zbiory linii: kolejność, kierunek i podział odcinków nie mają znaczenia,
 * liczy się, czy każdy fragment wzoru jest narysowany i czy nie ma nic ponad wzór (tolerancja 1,5).
 */
export function checkTask(task: Task, source: string): CheckResult {
  const res = run(source, task.mode);
  if (res.error) {
    return { ok: false, reason: `Program zgłasza błąd w wierszu ${res.error.line}, kolumnie ${res.error.column}: ${res.error.message}` };
  }
  if (!res.segments.length) return { ok: false, reason: 'Program niczego nie narysował. Czy pióro jest opuszczone?' };
  const expected = solutionSegments(task);
  const missing = firstUncovered(expected, res.segments);
  if (missing) {
    return { ok: false, reason: `Brakuje części rysunku: wzór przechodzi przez punkt ${fmtPoint(missing, task.mode)}, a Twój rysunek nie. Porównaj z szarym wzorem.` };
  }
  const extra = firstUncovered(res.segments, expected);
  if (extra) {
    return { ok: false, reason: `Na rysunku jest linia, której nie ma we wzorze, np. w punkcie ${fmtPoint(extra, task.mode)}. Może trzeba podnieść pióro?` };
  }
  const n = res.segments.length;
  return { ok: true, reason: `Rysunek zgadza się ze wzorem (${n} ${plural(n, 'odcinek', 'odcinki', 'odcinków')}).` };
}
