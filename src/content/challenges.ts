import type { Mode } from '../lang';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  /** Co narysować – krótko, po polsku. */
  goal: string;
  hints: string[];
  /** Wzorcowe rozwiązanie: z niego powstaje rysunek do porównania. */
  solution: string;
  /** Szkic, od którego zaczyna uczeń. */
  starter: string;
  requires?: {
    repeat?: boolean;
    procedure?: boolean;
  };
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'trojkat',
    title: 'Trójkąt',
    mode: '2d',
    goal: 'Narysuj trójkąt równoboczny o boku 100.',
    hints: [
      'Żółw obchodząc figurę obraca się łącznie o 360°. Ile to stopni na jeden róg trójkąta?',
      'Kąt zewnętrzny trójkąta równobocznego to 120°.',
    ],
    solution: 'powtorz 3 [np 100 pw 120]',
    starter: '; Trójkąt równoboczny o boku 100\n',
  },
  {
    id: 'prostokat',
    title: 'Prostokąt',
    mode: '2d',
    goal: 'Narysuj prostokąt o szerokości 160 i wysokości 80.',
    hints: [
      'Prostokąt to dwa razy to samo: długi bok, obrót, krótki bok, obrót.',
      'Spróbuj: powtórz 2 [ … ] z dwoma różnymi długościami w środku.',
    ],
    solution: 'pw 90\npowtorz 2 [np 160 lw 90 np 80 lw 90]',
    starter: '; Prostokąt 160 × 80\n',
  },
  {
    id: 'szesciokat',
    title: 'Sześciokąt',
    mode: '2d',
    goal: 'Narysuj sześciokąt foremny o boku 60. Użyj polecenia „powtórz”.',
    hints: ['Sześć boków, sześć jednakowych obrotów. 360 / 6 = ?'],
    solution: 'powtorz 6 [np 60 pw 60]',
    starter: '; Sześciokąt foremny o boku 60\n',
    requires: { repeat: true },
  },
  {
    id: 'schodki',
    title: 'Schodki',
    mode: '2d',
    goal: 'Narysuj cztery schodki prowadzące w górę i w prawo: każdy ma 30 w górę i 30 w prawo.',
    hints: [
      'Jeden schodek: w górę 30, obrót w prawo, 30 naprzód, obrót w lewo.',
      'Potem wystarczy powtórzyć schodek cztery razy.',
    ],
    solution: 'powtorz 4 [np 30 pw 90 np 30 lw 90]',
    starter: '; Cztery schodki: 30 w górę, 30 w prawo\n',
  },
  {
    id: 'dwa-kwadraty',
    title: 'Dwa kwadraty',
    mode: '2d',
    goal: 'Narysuj dwa kwadraty o boku 60 obok siebie, z przerwą 40 między nimi. Między kwadratami żółw nie może rysować.',
    hints: [
      'Polecenie „pod” podnosi pióro, a „opu” je opuszcza.',
      'Po pierwszym kwadracie przejdź z podniesionym piórem 100 kroków w prawo (60 + 40).',
    ],
    solution: 'powtorz 4 [np 60 pw 90]\npod pw 90 np 100 lw 90 opu\npowtorz 4 [np 60 pw 90]',
    starter: '; Dwa kwadraty 60 × 60, przerwa 40\n',
  },
  {
    id: 'gwiazda-8',
    title: 'Gwiazda ośmioramienna',
    mode: '2d',
    goal: 'Narysuj gwiazdę z ośmiu odcinków długości 150, w której każdy obrót wynosi 135°.',
    hints: ['To jedna linijka: powtórz osiem razy krok i obrót.'],
    solution: 'powtorz 8 [np 150 pw 135]',
    starter: '; Gwiazda: 8 odcinków po 150, obroty o 135°\n',
  },
  {
    id: 'wiatraczek',
    title: 'Wiatraczek',
    mode: '2d',
    goal: 'Napisz procedurę „kwadrat” z parametrem „bok” i narysuj nią osiem kwadratów o boku 70, każdy obrócony o 45° względem poprzedniego.',
    hints: [
      'Definicja zaczyna się od „oto kwadrat ma: bok”, a kończy słowem „już” w osobnym wierszu.',
      'Potem: powtórz 8 [kwadrat 70 pw 45].',
    ],
    solution: 'oto kwadrat ma: bok\n  powtorz 4 [np bok pw 90]\njuż\n\npowtorz 8 [kwadrat 70 pw 45]',
    starter: 'oto kwadrat ma: bok\n  ; tu narysuj kwadrat o boku „bok”\njuż\n\n',
    requires: { procedure: true },
  },
  {
    id: 'trzy-osie',
    title: 'Trzy kierunki',
    mode: '3d',
    goal: 'Narysuj trzy odcinki długości 100 wychodzące z jednego punktu: w prawo, do przodu i w górę – jak osie X, Y i Z.',
    hints: [
      'Po narysowaniu odcinka wróć poleceniem „ws 100”.',
      '„pw 90” kieruje żółwia w prawo, a „gora 90” – w górę.',
    ],
    solution: 'np 100 ws 100\npw 90 np 100 ws 100 lw 90\ngora 90 np 100',
    starter: '; Trzy odcinki po 100: w prawo, do przodu, w górę\n',
  },
  {
    id: 'kwadrat-pionowy',
    title: 'Kwadrat w pionie',
    mode: '3d',
    goal: 'Narysuj kwadrat o boku 80 stojący pionowo przed żółwiem: pierwszy bok do przodu, a potem w górę.',
    hints: ['Zamiast skręcać w prawo („pw”), żółw może zadzierać nos do góry („gora”).'],
    solution: 'powtorz 4 [np 80 gora 90]',
    starter: '; Pionowy kwadrat o boku 80\n',
  },
];

export const challengeById = (id: string) => CHALLENGES.find((c) => c.id === id);
