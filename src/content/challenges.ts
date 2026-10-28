import type { Mode } from '../lang/ast';
import { compareDrawings } from '../lang/compare';
import { run, type Segment } from '../lang/interpreter';
import { tokenize } from '../lang/lexer';
import { COMMANDS, DEFINE_WORDS } from '../lang/keywords';

export type Requirement = 'repeat' | 'procedure' | 'variable';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  level: 1 | 2 | 3;
  task: string;
  hint: string;
  /** Rozwiązanie wzorcowe — z niego powstaje oczekiwany rysunek. */
  solution: string;
  colors?: boolean;
  requires?: Requirement[];
  starter: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'trojkat',
    title: 'Trójkąt',
    mode: '2d',
    level: 1,
    task: 'Narysuj trójkąt równoboczny o boku 100. Zacznij w początku układu, idź naprzód i skręcaj w prawo.',
    hint: 'Żółw musi obrócić się łącznie o 360°. Przy trzech wierzchołkach to 360 / 3 = 120° na każdym.',
    solution: 'powtorz 3 [np 100 pw 120]',
    starter: '; Trójkąt równoboczny o boku 100\n',
  },
  {
    id: 'domek',
    title: 'Domek',
    mode: '2d',
    level: 1,
    task: 'Narysuj domek: kwadrat o boku 100 (od początku układu w górę i w prawo) z dachem — trójkątem równobocznym o boku 100 na górnej krawędzi.',
    hint: 'Najpierw kwadrat: powtórz 4 [np 100 pw 90]. Potem wejdź na górny lewy róg (np 100), skręć o 30° w prawo i narysuj dwa boki dachu, skręcając między nimi o 120°.',
    solution: 'powtorz 4 [np 100 pw 90]\nnp 100 pw 30 np 100 pw 120 np 100',
    starter: '; Domek z dachem\n',
  },
  {
    id: 'schodki',
    title: 'Schodki',
    mode: '2d',
    level: 1,
    task: 'Narysuj cztery schodki prowadzące w górę i w prawo: każdy stopień ma 30 w górę i 30 w prawo. Użyj polecenia „powtórz”.',
    hint: 'Jeden stopień to: np 30 pw 90 np 30 lw 90. Wystarczy go powtórzyć.',
    solution: 'powtorz 4 [np 30 pw 90 np 30 lw 90]',
    requires: ['repeat'],
    starter: '; Cztery schodki\n',
  },
  {
    id: 'kolorowy-kwadrat',
    title: 'Dwukolorowy kwadrat',
    mode: '2d',
    level: 2,
    task: 'Narysuj kwadrat o boku 80, skręcając w prawo. Boki mają na zmianę kolory "#c1763d" (pierwszy, pionowy) i "#2b6fb3". Liczą się też kolory!',
    hint: 'Zmień kolor przed każdym bokiem albo powtórz dwa razy parę boków w dwóch kolorach.',
    solution: 'powtorz 2 [kolor "#c1763d" np 80 pw 90 kolor "#2b6fb3" np 80 pw 90]',
    colors: true,
    starter: '; Kwadrat w dwóch kolorach\n',
  },
  {
    id: 'szesciokat',
    title: 'Sześciokąt z procedury',
    mode: '2d',
    level: 2,
    task: 'Zdefiniuj procedurę „sześciokąt” z parametrem „bok” i wywołaj ją, aby narysować sześciokąt foremny o boku 50 (skręcając w prawo).',
    hint: 'oto sześciokąt ma: bok … już — a w środku powtórz 6 razy krok i obrót o 60°.',
    solution: 'oto sześciokąt ma: bok\n  powtorz 6 [np bok pw 60]\njuż\nsześciokąt 50',
    requires: ['procedure', 'repeat'],
    starter: 'oto sześciokąt ma: bok\n  ; uzupełnij\njuż\n\nsześciokąt 50\n',
  },
  {
    id: 'wiatraczek',
    title: 'Wiatraczek',
    mode: '2d',
    level: 2,
    task: 'Narysuj sześć kwadratów o boku 60, obracając żółwia w prawo o 60° po każdym kwadracie. Wszystkie zaczynają się w początku układu.',
    hint: 'To powtórzenie w powtórzeniu: zewnętrzne 6 razy, wewnętrzne 4 razy.',
    solution: 'powtorz 6 [powtorz 4 [np 60 pw 90] pw 60]',
    requires: ['repeat'],
    starter: '; Sześć kwadratów dookoła\n',
  },
  {
    id: 'pionowy-kwadrat',
    title: 'Kwadrat w pionie',
    mode: '3d',
    level: 2,
    task: 'Postaw kwadrat o boku 80 pionowo: zaczyna się w początku układu, pierwszy bok idzie prosto w górę (wzdłuż osi z), a drugi w stronę +x.',
    hint: 'Najpierw „góra 90”, żeby żółw patrzył w niebo. Prawe skrzydło żółwia wciąż wskazuje +x, więc dalej wystarczy „pw 90”.',
    solution: 'gora 90\npowtorz 4 [np 80 pw 90]',
    starter: '; Kwadrat stojący pionowo\n',
  },
  {
    id: 'krzyz',
    title: 'Krzyż przestrzenny',
    mode: '3d',
    level: 3,
    task: 'Narysuj trzy odcinki o długości 100 leżące na osiach x, y i z. Każdy ma środek w początku układu (od −50 do 50).',
    hint: 'Podnieś pióro, cofnij się o 50, opuść pióro i idź 100 naprzód. Wróć na środek i obróć się: pw 90 dla osi x, góra 90 dla osi z.',
    solution:
      'pod ws 50 opu np 100\npod ws 50 pw 90 ws 50 opu np 100\npod ws 50 lw 90 gora 90 ws 50 opu np 100',
    starter: '; Trzy osie układu\n',
  },
];

export function findChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

const expectedCache = new Map<string, Segment[]>();

export function expectedSegments(c: Challenge): Segment[] {
  let segs = expectedCache.get(c.id);
  if (!segs) {
    const r = run(c.solution, c.mode);
    if (r.error) throw new Error(`Wzorzec wyzwania ${c.id} ma błąd: ${r.error.message}`);
    segs = r.segments;
    expectedCache.set(c.id, segs);
  }
  return segs;
}

function usesRequirement(source: string, req: Requirement): boolean {
  let toks;
  try {
    toks = tokenize(source);
  } catch {
    return false;
  }
  return toks.some((t) => {
    if (t.type !== 'word' || t.colon) return false;
    if (req === 'procedure') return DEFINE_WORDS.has(t.lower) && t.lineStart;
    const cmd = COMMANDS.get(t.lower);
    return req === 'repeat' ? cmd === 'repeat' : cmd === 'let';
  });
}

const REQUIREMENT_TEXT: Record<Requirement, string> = {
  repeat: 'W tym zadaniu użyj polecenia „powtórz”.',
  procedure: 'W tym zadaniu zdefiniuj własną procedurę słowem „oto”.',
  variable: 'W tym zadaniu użyj zmiennej („niech”).',
};

export interface CheckResult {
  ok: boolean;
  message: string;
  segments: Segment[];
}

function fmt(p: readonly number[], mode: Mode): string {
  const r = (v: number) => String(Math.round(v)).replace('-', '−');
  return mode === '3d' ? `(${r(p[0])}, ${r(p[1])}, ${r(p[2])})` : `(${r(p[0])}, ${r(p[1])})`;
}

/** Sprawdza rozwiązanie: uruchamia program i porównuje rysunek z wzorcem. */
export function checkChallenge(c: Challenge, source: string): CheckResult {
  const result = run(source, c.mode);
  if (result.error) {
    const e = result.error;
    return {
      ok: false,
      message: `Program zgłasza błąd w wierszu ${e.line}, kolumnie ${e.column}: ${e.message}`,
      segments: result.segments,
    };
  }
  if (!result.segments.length) {
    return { ok: false, message: 'Program niczego nie narysował.', segments: [] };
  }
  for (const req of c.requires ?? []) {
    if (!usesRequirement(source, req)) return { ok: false, message: REQUIREMENT_TEXT[req], segments: result.segments };
  }
  const cmp = compareDrawings(expectedSegments(c), result.segments, { colors: c.colors, tol: 1.5 });
  if (cmp.ok) {
    return { ok: true, message: 'Brawo! Rysunek zgadza się ze wzorem.', segments: result.segments };
  }
  const where = fmt(cmp.at, c.mode);
  const message =
    cmp.kind === 'missing'
      ? `Jeszcze nie to: brakuje części rysunku w okolicy punktu ${where}.`
      : cmp.kind === 'extra'
        ? `Jeszcze nie to: na rysunku jest linia, której nie ma we wzorze — w okolicy punktu ${where}.`
        : `Kształt się zgadza, ale kolor nie: w okolicy punktu ${where} powinien być ${cmp.expectedColor}.`;
  return { ok: false, message, segments: result.segments };
}
