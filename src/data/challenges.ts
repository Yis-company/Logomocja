import type { Mode } from '../lang/ast';
import { runSource } from '../lang';
import type { Segment } from '../lang/turtle';
import { checkDrawing, type CheckOptions, type CheckResult } from './check';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  level: 1 | 2 | 3;
  summary: string;
  /** Akapity opisu zadania. */
  task: string[];
  hints: string[];
  starter: string;
  /** Rozwiązanie wzorcowe — wyznacza też oczekiwany rysunek. */
  solution: string;
  check?: CheckOptions;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'kwadrat-100',
    title: 'Kwadrat o boku 100',
    mode: '2d',
    level: 1,
    summary: 'Cztery boki po 100 i cztery skręty.',
    task: [
      'Narysuj kwadrat o boku 100. Zaczynasz w początku układu (0, 0), a żółw patrzy w górę.',
      'Skręcaj w prawo — kwadrat ma leżeć po prawej stronie osi pionowej, od (0, 0) do (100, 100).',
    ],
    hints: ['Kwadrat to cztery razy ten sam bok i ten sam skręt.', 'Skręt w prawo o 90 stopni to „pw 90”.', 'Użyj „powtorz 4 [ … ]”.'],
    starter: '; Narysuj kwadrat o boku 100.\n',
    solution: 'powtorz 4 [np 100 pw 90]',
  },
  {
    id: 'trojkat',
    title: 'Trójkąt równoboczny',
    mode: '2d',
    level: 1,
    summary: 'Jaki skręt zamyka trójkąt?',
    task: [
      'Narysuj trójkąt równoboczny o boku 120. Zacznij w punkcie (0, 0) z żółwiem skierowanym w górę i skręcaj w prawo.',
    ],
    hints: [
      'Po obejściu figury żółw musi wykonać pełny obrót o 360 stopni.',
      'Trzy równe skręty dają razem 360°, więc jeden skręt ma 360 / 3 stopni.',
    ],
    starter: '; Trójkąt równoboczny o boku 120.\n',
    solution: 'powtorz 3 [np 120 pw 120]',
  },
  {
    id: 'szesciokat',
    title: 'Sześciokąt foremny',
    mode: '2d',
    level: 1,
    summary: 'Sześć boków po 80.',
    task: ['Narysuj sześciokąt foremny o boku 80. Zacznij w (0, 0), żółw patrzy w górę, skręcaj w prawo.'],
    hints: ['Kąt skrętu to 360 podzielone przez liczbę boków.', 'Możesz napisać „pw 360 / 6”.'],
    starter: '; Sześciokąt foremny o boku 80.\n',
    solution: 'powtorz 6 [np 80 pw 360 / 6]',
  },
  {
    id: 'gwiazda-5',
    title: 'Gwiazda pięcioramienna',
    mode: '2d',
    level: 2,
    summary: 'Jedna linia łamana, pięć ramion.',
    task: [
      'Narysuj gwiazdę pięcioramienną jednym ciągłym ruchem: pięć odcinków po 150. Zacznij w (0, 0), żółw patrzy w górę, skręcaj w prawo.',
    ],
    hints: ['Gwiazda to pięciokąt „przeskakujący” co drugi wierzchołek.', 'Kąt skrętu to dwa razy 360 / 5, czyli 144 stopnie.'],
    starter: '; Gwiazda pięcioramienna, odcinki po 150.\n',
    solution: 'powtorz 5 [np 150 pw 144]',
  },
  {
    id: 'schody-2d',
    title: 'Schody',
    mode: '2d',
    level: 2,
    summary: 'Pięć stopni w górę i w prawo.',
    task: [
      'Narysuj schody z pięciu stopni. Każdy stopień to 30 w górę i 30 w prawo. Zacznij w (0, 0), żółw patrzy w górę.',
      'Po ostatnim stopniu schody kończą się w punkcie (150, 150) — nie rysuj linii zamykającej.',
    ],
    hints: [
      'Jeden stopień: „np 30 pw 90 np 30 lw 90”.',
      'Po każdym stopniu żółw musi znów patrzeć w górę — dlatego na końcu skręcasz w lewo.',
    ],
    starter: '; Pięć stopni schodów.\n',
    solution: 'powtorz 5 [np 30 pw 90 np 30 lw 90]',
  },
  {
    id: 'kwiat',
    title: 'Kwiat z kwadratów',
    mode: '2d',
    level: 2,
    summary: 'Sześć obróconych kwadratów.',
    task: [
      'Narysuj sześć kwadratów o boku 60, każdy obrócony o 60 stopni względem poprzedniego, wszystkie wychodzące z punktu (0, 0).',
    ],
    hints: ['Powtórz sześć razy: kwadrat, a potem „pw 60”.', 'Kwadrat sam jest powtórzeniem: „powtorz 4 [np 60 pw 90]”.'],
    starter: '; Sześć kwadratów o boku 60.\n',
    solution: 'powtorz 6 [powtorz 4 [np 60 pw 90] pw 60]',
  },
  {
    id: 'trzy-kwadraty',
    title: 'Trzy kwadraty w rzędzie',
    mode: '2d',
    level: 3,
    summary: 'Procedura, powtórzenie i przesunięcie z uniesionym piórem.',
    task: [
      'Zdefiniuj procedurę „kwadrat” z parametrem „bok” i narysuj nią trzy kwadraty o boku 50 obok siebie.',
      'Lewy dolny róg pierwszego kwadratu to (0, 0), kolejne mają lewe dolne rogi w (70, 0) i (140, 0), czyli odstęp między kwadratami wynosi 20. Między kwadratami nie rysuj żadnych linii.',
    ],
    hints: [
      'Procedura: „oto kwadrat ma: bok … już”.',
      'Do przesunięcia w prawo uniesionym piórem: „pod pw 90 np 70 lw 90 opu”.',
      'Całość możesz zamknąć w „powtorz 3 [ … ]”.',
    ],
    starter: '; Trzy kwadraty o boku 50, odstęp 20.\noto kwadrat ma: bok\n  \njuż\n\n',
    solution: 'oto kwadrat ma: bok\n  powtorz 4 [np bok pw 90]\njuż\n\npowtorz 3 [\n  kwadrat 50\n  pod pw 90 np 70 lw 90 opu\n]',
  },
  {
    id: 'okrag',
    title: 'Okrąg',
    mode: '2d',
    level: 3,
    summary: 'Wielokąt z tak wielu boków, że wygląda jak koło.',
    task: [
      'Narysuj okrąg o obwodzie około 360 (promień około 57), tak aby żółw zaczął w punkcie (0, 0) skierowany w górę i skręcał w prawo — środek okręgu leży wtedy w punkcie (57, 0).',
      'Okrąg zbudujesz z wielu krótkich odcinków. Rysunek jest sprawdzany z niewielką tolerancją, więc możesz użyć 36 odcinków po 10 albo 72 po 5.',
    ],
    hints: ['Pełny obrót to 360 stopni. Przy 36 odcinkach każdy skręt ma 10 stopni.', '„powtorz 36 [np 10 pw 10]”.'],
    starter: '; Okrąg z krótkich odcinków.\n',
    solution: 'powtorz 36 [np 10 pw 10]',
    check: { tolerance: 3.5 },
  },
  {
    id: 'osie-3d',
    title: 'Trzy osie',
    mode: '3d',
    level: 2,
    summary: 'Trzy prostopadłe odcinki z jednego punktu.',
    task: [
      'Narysuj w przestrzeni trzy odcinki długości 100, wychodzące z początku układu: jeden w kierunku +Y (przed żółwiem), drugi w kierunku +X (w prawo) i trzeci w kierunku +Z (w górę).',
      'Po narysowaniu każdego odcinka wróć do początku układu — uniesionym piórem lub cofając się po tej samej linii.',
    ],
    hints: [
      'Pierwszy odcinek: „np 100 ws 100”. Cofnięcie się rysuje po tej samej linii, więc nic nie szkodzi.',
      'Na drugi skręć „pw 90”, a potem wróć do pierwotnego kierunku „lw 90”.',
      'Trzeci odcinek zacznij od „gora 90”.',
    ],
    starter: '; Trzy osie o długości 100.\n',
    solution: 'np 100 ws 100\npw 90 np 100 ws 100 lw 90\ngora 90 np 100 ws 100',
  },
  {
    id: 'okrag-pion',
    title: 'Okrąg w pionie',
    mode: '3d',
    level: 2,
    summary: 'Ten sam okrąg, ale stojący.',
    task: [
      'Narysuj okrąg z 36 odcinków po 10, który leży w pionowej płaszczyźnie: najpierw skieruj żółwia w górę (+Z), a potem skręcaj w prawo o 10° po każdym odcinku.',
      'Okrąg zaczyna się w początku układu, a jego środek leży w punkcie (57, 0, 0).',
    ],
    hints: ['„gora 90” kieruje żółwia w górę.', 'Po tym obrocie „pw 10” skręca w płaszczyźnie pionowej.', '„powtorz 36 [np 10 pw 10]”.'],
    starter: '; Okrąg w pionowej płaszczyźnie.\n',
    solution: 'gora 90\npowtorz 36 [np 10 pw 10]',
  },
  {
    id: 'szescian-80',
    title: 'Sześcian o krawędzi 80',
    mode: '3d',
    level: 3,
    summary: 'Dwanaście krawędzi z prostych poleceń.',
    task: [
      'Zbuduj szkielet sześcianu o krawędzi 80. Jeden wierzchołek leży w początku układu, a krawędzie biegną w kierunkach +Y, +X i +Z (sześcian stoi na płaszczyźnie XY, dalej niż żółw i na prawo od niego).',
      'Wszystkie dwanaście krawędzi mają być narysowane, a poza nimi nie powinno być innych linii.',
    ],
    hints: [
      'Zacznij od kwadratu na „podłodze”: „powtorz 4 [np 80 pw 90]”.',
      'Drugi kwadrat narysuj na wysokości 80: „gora 90 np 80 dol 90” przenosi żółwia nad pierwszy.',
      'Cztery krawędzie pionowe połącz, schodząc w dół i wracając piórem w górze.',
    ],
    starter: '; Sześcian o krawędzi 80.\n',
    solution:
      'powtorz 4 [np 80 pw 90]\ngora 90 np 80 dol 90\npowtorz 4 [np 80 pw 90]\npowtorz 4 [\n  np 80\n  dol 90 np 80\n  pod ws 80 opu\n  gora 90 pw 90\n]',
  },
];

export function findChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

const expectedCache = new Map<string, Segment[]>();

/** Oczekiwany rysunek wyznaczony programem wzorcowym. */
export function expectedDrawing(c: Challenge): Segment[] {
  let e = expectedCache.get(c.id);
  if (!e) {
    e = runSource(c.solution, c.mode).segments;
    expectedCache.set(c.id, e);
  }
  return e;
}

export function checkChallenge(c: Challenge, user: Segment[]): CheckResult {
  return checkDrawing(user, expectedDrawing(c), c.check);
}

export const LEVEL_LABEL: Record<1 | 2 | 3, string> = { 1: 'łatwe', 2: 'średnie', 3: 'trudniejsze' };
