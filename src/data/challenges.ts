import type { Mode } from '../lang/parser';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  /** Co narysować (po polsku). */
  task: string;
  hint: string;
  /** Rozwiązanie wzorcowe: wzorzec jest rysowany tym programem. */
  solution: string;
  starter: string;
  tolerance?: number;
}

const START = '; Żółw startuje w środku i patrzy w górę.\n';

export const CHALLENGES: Challenge[] = [
  {
    id: 'kwadrat-100', title: 'Kwadrat 100', mode: '2d',
    task: 'Narysuj kwadrat o boku 100. Pierwszy bok idzie prosto w górę od środka ekranu.',
    hint: 'Cztery razy: naprzód 100 i skręt w prawo o 90 stopni. Użyj powtorz.',
    solution: 'powtorz 4 [np 100 pw 90]',
    starter: START,
  },
  {
    id: 'trojkat-120', title: 'Trójkąt równoboczny', mode: '2d',
    task: 'Narysuj trójkąt równoboczny o boku 120, zaczynając od boku skierowanego w górę.',
    hint: 'Kąt zewnętrzny trójkąta równobocznego to 360 / 3 = 120 stopni.',
    solution: 'powtorz 3 [np 120 pw 120]',
    starter: START,
  },
  {
    id: 'szesciokat-60', title: 'Sześciokąt', mode: '2d',
    task: 'Narysuj foremny sześciokąt o boku 60.',
    hint: 'Sześć boków, skręt 360 / 6 = 60 stopni.',
    solution: 'powtorz 6 [np 60 pw 60]',
    starter: START,
  },
  {
    id: 'gwiazda-150', title: 'Gwiazda pięcioramienna', mode: '2d',
    task: 'Narysuj pięcioramienną gwiazdę jedną linią, każdy odcinek ma długość 150.',
    hint: 'Skręcaj o 144 stopnie, nie o 72.',
    solution: 'powtorz 5 [np 150 pw 144]',
    starter: START,
  },
  {
    id: 'schodki', title: 'Schodki', mode: '2d',
    task: 'Narysuj cztery schodki: w górę 40, w prawo 40, i tak cztery razy.',
    hint: 'Powtórz: naprzód 40, w prawo 90, naprzód 40, w lewo 90.',
    solution: 'powtorz 4 [np 40 pw 90 np 40 lw 90]',
    starter: START,
  },
  {
    id: 'okrag', title: 'Okrąg', mode: '2d',
    task: 'Narysuj okrąg, który zaczyna się w środku i skręca w prawo. Obwód ok. 360 jednostek.',
    hint: 'Małe kroki i małe skręty: 36 razy naprzód 10 i w prawo 10 stopni.',
    solution: 'powtorz 36 [np 10 pw 10]',
    starter: START,
    tolerance: 6,
  },
  {
    id: 'domek', title: 'Domek', mode: '2d',
    task: 'Narysuj domek: kwadrat o boku 100 i trójkątny dach o boku 100 na jego górnej krawędzi.',
    hint: 'Kwadrat, potem w górę o 100, skręt 30 w prawo i trójkąt równoboczny.',
    solution: 'powtorz 4 [np 100 pw 90] np 100 pw 30 powtorz 3 [np 100 pw 120]',
    starter: START,
  },
  {
    id: 'spirala-kw', title: 'Kwadratowa spirala', mode: '2d',
    task: 'Narysuj kwadratową spiralę z 20 boków: bok numer n ma długość 8 · n, po każdym skręt w prawo o 90.',
    hint: 'Licznik powtórzeń nazywa się nrpowt.',
    solution: 'powtorz 20 [np nrpowt * 8 pw 90]',
    starter: START,
  },
  {
    id: 'kwadrat-pionowy', title: 'Kwadrat w pionie', mode: '3d',
    task: 'Narysuj w 3D kwadrat o boku 80, który stoi pionowo (leży w płaszczyźnie XZ), pierwszy bok idzie w górę.',
    hint: 'Najpierw unieś nos o 90 stopni (gora 90), potem zwykły kwadrat.',
    solution: 'gora 90 powtorz 4 [np 80 pw 90]',
    starter: START,
  },
  {
    id: 'trojnog', title: 'Trzy osie', mode: '3d',
    task: 'Narysuj trzy odcinki długości 100 wychodzące ze środka wzdłuż osi Y, X i Z (każdy w obie strony do środka i z powrotem).',
    hint: 'Naprzód 100, wstecz 100, potem skręć w prawo o 90 (oś X), wróć do kierunku i unieś nos o 90 (oś Z).',
    solution: 'np 100 ws 100 pw 90 np 100 ws 100 lw 90 gora 90 np 100 ws 100',
    starter: START,
  },
];

export const CHALLENGE_BY_ID = new Map(CHALLENGES.map(c => [c.id, c]));
