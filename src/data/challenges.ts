import { type Mode, type Program, type Segment, type Stmt, compile, runProgram } from '../lang';
import { type CheckOptions, type CheckResult, compareDrawings } from './check';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  level: 1 | 2 | 3;
  /** Co narysować. */
  task: string;
  /** Dodatkowe wymagania. */
  details: string[];
  hint: string;
  starter: string;
  solution: string;
  check?: CheckOptions;
  requires?: { repeat?: boolean; procedure?: boolean };
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'kwadrat-100',
    title: 'Kwadrat o boku 100',
    mode: '2d',
    level: 1,
    task: 'Narysuj kwadrat o boku 100. Zacznij w punkcie początkowym, a pierwszy bok poprowadź prosto w górę – żółw skręca w prawo.',
    details: ['Żółw startuje w punkcie (0, 0) skierowany w górę.', 'Kolor i grubość kreski są dowolne.'],
    hint: 'Cztery razy: krok naprzód o 100 i skręt w prawo o 90 stopni. Pomoże polecenie powtórz.',
    starter: '; Narysuj kwadrat o boku 100.\n',
    solution: 'powtorz 4 [np 100 pw 90]',
  },
  {
    id: 'trojkat',
    title: 'Trójkąt równoboczny',
    mode: '2d',
    level: 1,
    task: 'Narysuj trójkąt równoboczny o boku 120. Pierwszy bok idzie prosto w górę, żółw skręca w prawo.',
    details: ['Użyj polecenia powtórz.', 'Kąt zewnętrzny trójkąta równobocznego to 120 stopni.'],
    hint: 'Trzy razy: np 120 i pw 120. Skręt to nie kąt wewnętrzny (60°), lecz zewnętrzny (360 / 3).',
    starter: '; Trójkąt równoboczny o boku 120.\n',
    solution: 'powtorz 3 [np 120 pw 120]',
    requires: { repeat: true },
  },
  {
    id: 'schodki',
    title: 'Schodki',
    mode: '2d',
    level: 1,
    task: 'Narysuj pięć schodków: w górę o 30, w prawo o 30, w górę o 30, w prawo o 30 i tak dalej – razem pięć par kroków.',
    details: ['Po każdym kroku w górę żółw skręca w prawo, a po kroku w prawo wraca do kierunku „w górę”.'],
    hint: 'Jeden schodek to: np 30, pw 90, np 30, lw 90. Powtórz go pięć razy.',
    starter: '; Pięć schodków.\n',
    solution: 'powtorz 5 [np 30 pw 90 np 30 lw 90]',
  },
  {
    id: 'okrag',
    title: 'Okrąg',
    mode: '2d',
    level: 2,
    task: 'Narysuj okrąg o obwodzie około 360 jednostek. Środek okręgu leży po prawej stronie punktu początkowego.',
    details: ['Okrąg to wielokąt z wielu krótkich boków – wystarczy 36 boków i skręt o 10 stopni.', 'Sprawdzanie dopuszcza niewielkie odchylenia.'],
    hint: 'Powtórz 36 razy: krok naprzód o 10 i skręt w prawo o 10 stopni.',
    starter: '; Okrąg z wielu krótkich boków.\n',
    solution: 'powtorz 36 [np 10 pw 10]',
    check: { tolerance: 3 },
  },
  {
    id: 'dwa-kolory',
    title: 'Ramka w dwóch kolorach',
    mode: '2d',
    level: 2,
    task: 'Narysuj kwadrat o boku 100, w którym boki pionowe mają kolor #c1763d, a poziome kolor #2b6fb3.',
    details: ['Zacznij w górę od punktu początkowego, skręcaj w prawo.', 'Tym razem sprawdzane są także kolory.'],
    hint: 'Przed każdym bokiem ustaw kolor poleceniem kolor "#rrggbb". Boki pionowe to pierwszy i trzeci, poziome – drugi i czwarty.',
    starter: '; Kwadrat: pionowe boki #c1763d, poziome #2b6fb3.\n',
    solution: 'powtorz 2 [\n  kolor "#c1763d" np 100 pw 90\n  kolor "#2b6fb3" np 100 pw 90\n]',
    check: { colors: true },
  },
  {
    id: 'gwiazda-5',
    title: 'Gwiazda pięcioramienna',
    mode: '2d',
    level: 2,
    task: 'Narysuj pięcioramienną gwiazdę jednym pociągnięciem. Każdy odcinek ma długość 150.',
    details: ['Użyj polecenia powtórz.', 'Żółw wraca do punktu początkowego.'],
    hint: 'Skręt w gwieździe to 144 stopnie: powtorz 5 [np 150 pw 144].',
    starter: '; Gwiazda pięcioramienna, odcinki po 150.\n',
    solution: 'powtorz 5 [np 150 pw 144]',
    requires: { repeat: true },
  },
  {
    id: 'domek',
    title: 'Domek z własną procedurą',
    mode: '2d',
    level: 3,
    task: 'Narysuj domek: kwadrat o boku 100, a na jego górnym boku trójkąt równoboczny o boku 100 jako dach. Zdefiniuj własną procedurę rysującą wielokąt foremny i użyj jej dwa razy.',
    details: [
      'Zacznij w punkcie początkowym, w górę, skręcając w prawo.',
      'Wymagana jest co najmniej jedna procedura zdefiniowana przez oto … już.',
      'Dach stoi na górnym boku kwadratu (od punktu (0, 100) do (100, 100)).',
    ],
    hint: 'Procedura: oto wielokąt ma: boki, bok powtórz boki [np bok pw 360 / boki] już. Po kwadracie idź w górę o 100, skręć w prawo o 90 i w lewo o 60 – wtedy trójkąt zacznie się od skosu.',
    starter: '; Domek: kwadrat 100 i trójkątny dach.\n',
    solution:
      'oto wielokąt ma: boki, bok\n  powtorz boki [np bok pw 360 / boki]\njuż\n\nwielokąt 4 100\nnp 100 pw 90 lw 60\nwielokąt 3 100',
    requires: { procedure: true },
  },
  {
    id: 'pionowy-kwadrat',
    title: 'Kwadrat na stojąco',
    mode: '3d',
    level: 2,
    task: 'Narysuj kwadrat o boku 100 ustawiony pionowo: zacznij w punkcie początkowym, pierwszy bok poprowadź w górę (wzdłuż osi Z), a potem skręcaj w prawo.',
    details: ['Podnieś nos żółwia poleceniem gora, zanim zaczniesz rysować.', 'Kwadrat leży w płaszczyźnie XZ.'],
    hint: 'gora 90 kieruje żółwia w górę. Dalej jak w zwykłym kwadracie: powtorz 4 [np 100 pw 90].',
    starter: '; Kwadrat stojący pionowo.\n',
    solution: 'gora 90\npowtorz 4 [np 100 pw 90]',
  },
  {
    id: 'szescian-80',
    title: 'Sześcian',
    mode: '3d',
    level: 3,
    task: 'Narysuj wszystkie dwanaście krawędzi sześcianu o boku 80, jedną z krawędzi zaczynając od punktu początkowego (podstawa leży na płaszczyźnie z = 0).',
    details: ['Podstawa to kwadrat poprowadzony w prawo, wierzchołek sześcianu leży w punkcie (0, 0, 0).', 'Dopuszczalne jest rysowanie krawędzi po kilka razy.'],
    hint: 'Narysuj kwadrat podstawy, podnieś się o 80, narysuj kwadrat góry, a potem cztery pionowe krawędzie (jak w przykładzie „Sześcian”).',
    starter: '; Sześcian o boku 80.\n',
    solution:
      'powtorz 4 [np 80 pw 90]\ngora 90 np 80 dol 90\npowtorz 4 [np 80 pw 90]\npowtorz 4 [\n  np 80\n  dol 90 np 80\n  pod ws 80 opu\n  gora 90 pw 90\n]',
  },
];

export function findChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

function walk(stmts: Stmt[], visit: (s: Stmt) => void): void {
  for (const s of stmts) {
    visit(s);
    if (s.t === 'repeat') walk(s.body, visit);
    else if (s.t === 'if') {
      walk(s.then, visit);
      if (s.else) walk(s.else, visit);
    }
  }
}

function usesRepeat(p: Program): boolean {
  let found = false;
  const visit = (s: Stmt) => {
    if (s.t === 'repeat') found = true;
  };
  walk(p.body, visit);
  for (const def of p.procs.values()) walk(def.body, visit);
  return found;
}

export function targetSegments(c: Challenge): Segment[] {
  return runProgram(c.solution, c.mode).segments;
}

export interface ChallengeResult extends CheckResult {
  /** Błąd w programie użytkownika (składnia lub wykonanie). */
  programError: boolean;
}

/** Uruchamia program użytkownika i porównuje go ze wzorem. */
export function checkChallenge(c: Challenge, source: string, target = targetSegments(c)): ChallengeResult {
  const compiled = compile(source, c.mode);
  if (compiled.error) {
    return {
      pass: false,
      programError: true,
      reason: `Program zawiera błąd (wiersz ${compiled.error.line}, kolumna ${compiled.error.column}): ${compiled.error.message}`,
      coverage: 0,
      precision: 0,
      colorMatch: null,
    };
  }
  const run = runProgram(source, c.mode);
  if (run.error) {
    return {
      pass: false,
      programError: true,
      reason: `Program przerwał działanie (wiersz ${run.error.line}, kolumna ${run.error.column}): ${run.error.message}`,
      coverage: 0,
      precision: 0,
      colorMatch: null,
    };
  }
  const result = compareDrawings(run.segments, target, c.check);
  const program = compiled.program;
  if (result.pass && c.requires?.repeat && !usesRepeat(program)) {
    return { ...result, pass: false, programError: false, reason: 'Rysunek jest dobry, ale zadanie wymaga użycia polecenia powtórz.' };
  }
  if (result.pass && c.requires?.procedure && program.procs.size === 0) {
    return { ...result, pass: false, programError: false, reason: 'Rysunek jest dobry, ale zadanie wymaga własnej procedury (oto … już).' };
  }
  return { ...result, programError: false };
}
