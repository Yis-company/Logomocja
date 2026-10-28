import type { Challenge } from './check';

export const CHALLENGES: Challenge[] = [
  {
    id: 'kwadrat',
    title: 'Kwadrat',
    mode: '2d',
    task: 'Narysuj kwadrat o boku 100. Zacznij w punkcie startowym (0, 0), żółw patrzy w górę.',
    reference: 'powtorz 4 [np 100 pw 90]',
  },
  {
    id: 'trojkat',
    title: 'Trójkąt równoboczny',
    mode: '2d',
    task: 'Narysuj trójkąt równoboczny o boku 100, zaczynając w (0, 0), żółw patrzy w górę.',
    reference: 'powtorz 3 [np 100 pw 120]',
  },
  {
    id: 'szesciokat',
    title: 'Sześciokąt w procedurze',
    mode: '2d',
    task: 'Napisz procedurę (słowo oto) rysującą sześciokąt foremny o boku podanym jako parametr, a potem wywołaj ją z bokiem 60.',
    reference: 'oto szesciokat ma: bok\n  powtorz 6 [np bok pw 60]\njuz\n\nszesciokat 60',
    requires: [
      { pattern: /(^|\s)(oto|to)\s/im, hint: 'Zadanie wymaga procedury: użyj słowa oto.' },
    ],
  },
  {
    id: 'gwiazda',
    title: 'Pięcioramienna gwiazda',
    mode: '2d',
    task: 'Narysuj gwiazdę o pięciu ramionach, każde długie na 100, z kątem skrętu 144 stopnie. Start: (0, 0).',
    reference: 'powtorz 5 [np 100 pw 144]',
  },
  {
    id: 'drabinka',
    title: 'Rosnące odcinki',
    mode: '2d',
    task: 'Narysuj pięć odcinków: pierwszy długości 20, każdy następny o 20 dłuższy, a między nimi skręt o 90 stopni w prawo. Użyj nrpowt.',
    reference: 'powtorz 5 [np nrpowt * 20 pw 90]',
    requires: [
      { pattern: /nrpowt|repcount/i, hint: 'Zadanie wymaga użycia nrpowt, czyli numeru powtórzenia.' },
    ],
  },
  {
    id: 'pionowy-kwadrat',
    title: 'Pionowy kwadrat w 3D',
    mode: '3d',
    task: 'W trybie 3D narysuj kwadrat o boku 100 leżący w pionie, w płaszczyźnie XZ. Start: (0, 0, 0), żółw patrzy w górę (gora 90 przechyla nos).',
    reference: 'gora 90\npowtorz 4 [np 100 pw 90]',
  },
];

export function findChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}
