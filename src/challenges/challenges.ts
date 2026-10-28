import type { Mode } from '../lang';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  /** What to draw, in Polish. */
  task: string;
  /** Optional hint, in Polish. */
  hint?: string;
  /** A program that draws the target. Only used to produce the expected drawing. */
  reference: string;
}

export const CHALLENGES: readonly Challenge[] = [
  {
    id: 'kwadrat-100',
    title: 'Kwadrat o boku 100',
    mode: '2d',
    task: 'Narysuj kwadrat o boku 100. Żółw zaczyna w punkcie (0, 0) i patrzy w górę, w stronę +Y.',
    hint: 'Cztery odcinki i cztery skręty w prawo po 90 stopni.',
    reference: 'powtorz 4 [np 100 pw 90]',
  },
  {
    id: 'trojkat',
    title: 'Trójkąt równoboczny',
    mode: '2d',
    task: 'Narysuj trójkąt równoboczny o boku 120, zaczynając w punkcie (0, 0) i patrząc w górę.',
    hint: 'Zakręty w prawo mają po 120 stopni.',
    reference: 'powtorz 3 [np 120 pw 120]',
  },
  {
    id: 'gwiazda',
    title: 'Gwiazda pięcioramienna',
    mode: '2d',
    task: 'Narysuj gwiazdę pięcioramienną o ramionach długości 150. Każdy skręt w prawo to 144 stopnie.',
    reference: 'powtorz 5 [np 150 pw 144]',
  },
  {
    id: 'spirala',
    title: 'Spirala z rosnącymi bokami',
    mode: '2d',
    task: 'Narysuj sześć odcinków: pierwszy ma długość 20, a każdy następny jest o 20 dłuższy. Po każdym odcinku skręć w prawo o 90 stopni.',
    hint: 'Zmienna z poleceniem niech i powtórz zrobią resztę pracy.',
    reference: 'niech d 20\npowtorz 6 [np d pw 90 niech d d + 20]',
  },
  {
    id: 'szesciokat',
    title: 'Sześciokąt z procedurą',
    mode: '2d',
    task: 'Narysuj sześciokąt foremny o boku 50, zaczynając w punkcie (0, 0). Napisz procedurę z parametrem bok i ją wywołaj.',
    hint: 'Sześć boków, a skręt między nimi ma 60 stopni.',
    reference: 'oto sześciokąt ma: bok\n  powtorz 6 [np bok pw 60]\njuz\nsześciokąt 50',
  },
  {
    id: 'schody',
    title: 'Trzy stopnie w górę',
    mode: '3d',
    task: 'Narysuj trzy stopnie. Każdy ma 40 jednostek w przód i 25 w górę. Wejście na stopień zaczyna się od gora 90, a kończy dol 90.',
    reference: 'powtorz 3 [np 40 gora 90 np 25 dol 90]',
  },
  {
    id: 'pionowy-kwadrat',
    title: 'Pionowy kwadrat',
    mode: '3d',
    task: 'Narysuj kwadrat o boku 80, który stoi pionowo. Zacznij od gora 90, a potem rysuj kwadrat, skręcając w prawo o 90 stopni.',
    hint: 'Po gora 90 żółw patrzy w górę, a prawa strona wskazuje na +X.',
    reference: 'gora 90\npowtorz 4 [np 80 pw 90]',
  },
];
