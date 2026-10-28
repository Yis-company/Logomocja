import type { Mode } from '../lang/ast';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  level: 1 | 2 | 3;
  /** What to draw, in one or two sentences. */
  task: string;
  hint: string;
  /** Reference solution: its drawing is the target. */
  solution: string;
  /** Starting code put in the editor. */
  starter: string;
  /** Extra requirements checked besides the drawing. */
  requires?: {
    repeat?: boolean;
    procedure?: boolean;
    repcount?: boolean;
    condition?: boolean;
    /** Every segment must have this colour. */
    color?: string;
  };
}

export const CHALLENGES: readonly Challenge[] = [
  {
    id: 'kwadrat',
    title: 'Pierwszy kwadrat',
    mode: '2d',
    level: 1,
    task: 'Narysuj kwadrat o boku 100.',
    hint: 'Kwadrat ma cztery równe boki, a po każdym boku żółw skręca o 90 stopni.',
    solution: 'powtorz 4 [np 100 pw 90]',
    starter: '; Narysuj kwadrat o boku 100.\nnp 100\npw 90\n',
  },
  {
    id: 'trojkat',
    title: 'Niebieski trójkąt',
    mode: '2d',
    level: 1,
    task: 'Narysuj trójkąt równoboczny o boku 120 w kolorze "#2b6fb3".',
    hint: 'Żółw musi obrócić się łącznie o 360 stopni, a trójkąt ma trzy wierzchołki: 360 / 3 = 120. Kolor ustawisz poleceniem kolor "#2b6fb3".',
    solution: 'kolor "#2b6fb3"\npowtorz 3 [np 120 pw 120]',
    starter: '; Trójkąt równoboczny o boku 120, kolor "#2b6fb3".\n',
    requires: { color: '#2b6fb3' },
  },
  {
    id: 'schodki',
    title: 'Schodki',
    mode: '2d',
    level: 1,
    task: 'Narysuj pięć schodków: każdy ma 20 w górę i 20 w prawo.',
    hint: 'Jeden schodek to: np 20, pw 90, np 20, lw 90. Powtórz go pięć razy.',
    solution: 'powtorz 5 [np 20 pw 90 np 20 lw 90]',
    starter: '; Pięć schodków po 20.\n',
  },
  {
    id: 'szesciokat',
    title: 'Plaster miodu',
    mode: '2d',
    level: 2,
    task: 'Narysuj sześciokąt foremny o boku 60, używając polecenia powtorz.',
    hint: 'Sześć boków, a kąt skrętu to 360 / 6.',
    solution: 'powtorz 6 [np 60 pw 60]',
    starter: '; Sześciokąt o boku 60 — użyj powtorz.\n',
    requires: { repeat: true },
  },
  {
    id: 'domek',
    title: 'Domek',
    mode: '2d',
    level: 2,
    task: 'Narysuj domek: kwadrat o boku 100, a na nim dach — trójkąt równoboczny o boku 100.',
    hint: 'Po narysowaniu kwadratu żółw stoi w lewym dolnym rogu. Przejdź do lewego górnego rogu, skręć w prawo o 30 stopni i narysuj trójkąt.',
    solution: 'powtorz 4 [np 100 pw 90]\nnp 100\npw 30\npowtorz 3 [np 100 pw 120]',
    starter: '; Domek: kwadrat 100 i dach.\n',
  },
  {
    id: 'spirala',
    title: 'Kwadratowa spirala',
    mode: '2d',
    level: 2,
    task: 'Narysuj spiralę z dziesięciu odcinków o długościach 10, 20, 30, …, 100, skręcając po każdym w prawo o 90 stopni. Użyj nrpowt.',
    hint: 'nrpowt to numer bieżącego powtórzenia: 1, 2, 3… Długość odcinka to nrpowt * 10.',
    solution: 'powtorz 10 [np nrpowt * 10 pw 90]',
    starter: '; Spirala: 10, 20, 30, … 100.\npowtorz 10 [\n  \n]\n',
    requires: { repeat: true, repcount: true },
  },
  {
    id: 'kwiat',
    title: 'Kwiat z kwadratów',
    mode: '2d',
    level: 3,
    task: 'Zdefiniuj procedurę rysującą kwadrat o podanym boku i narysuj nią kwiat: osiem kwadratów o boku 60, każdy obrócony o 45 stopni.',
    hint: 'oto kwadrat ma: bok … już, a potem powtorz 8 [kwadrat 60 pw 45].',
    solution: 'oto kwadrat ma: bok\n  powtorz 4 [np bok pw 90]\njuż\n\npowtorz 8 [kwadrat 60 pw 45]',
    starter: 'oto kwadrat ma: bok\n  \njuż\n\n',
    requires: { procedure: true },
  },
  {
    id: 'sciana',
    title: 'Kwadrat w pionie',
    mode: '3d',
    level: 2,
    task: 'Narysuj kwadrat o boku 80 stojący pionowo przed żółwiem — w płaszczyźnie osi Y i Z.',
    hint: 'Zamiast skręcać w prawo, zadzieraj nos żółwia poleceniem gora 90.',
    solution: 'powtorz 4 [np 80 gora 90]',
    starter: '; Pionowy kwadrat o boku 80.\n',
  },
  {
    id: 'wieza',
    title: 'Wieża',
    mode: '3d',
    level: 3,
    task: 'Narysuj trzy kwadraty o boku 60, jeden nad drugim co 30, połączone pionowymi odcinkami w rogu, z którego startuje żółw. Nad ostatnim kwadratem nie rysuj już nic.',
    hint: 'Po każdym kwadracie wznieś się o 30 (gora 90 np 30 dol 90), ale tylko gdy nrpowt < 3 — użyj jeśli.',
    solution: 'powtorz 3 [\n  powtorz 4 [np 60 pw 90]\n  jeśli nrpowt < 3 [gora 90 np 30 dol 90]\n]',
    starter: '; Trzy piętra po 30.\n',
  },
];

export function findChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}
