import type { Mode } from './types';

export interface Example {
  id: string;
  name: string;
  mode: Mode;
  source: string;
}

export const EXAMPLES: Example[] = [
  {
    id: 'rozeta',
    name: 'Rozeta z kwadratów',
    mode: '2d',
    source: `; Procedura z parametrem, wywołana dwanaście razy z obrotem
oto kwadrat ma: bok
  powtorz 4 [np bok pw 90]
już

kolor "#d9482b"
powtorz 12 [kwadrat 50 pw 30]
`,
  },
  {
    id: 'gwiazda',
    name: 'Gwiazda pięcioramienna',
    mode: '2d',
    source: `; Pięć odcinków i obrót o 144 stopnie
grubosc 2
kolor "#d9482b"
powtorz 5 [np 160 pw 144]
`,
  },
  {
    id: 'okrag',
    name: 'Okrąg',
    mode: '2d',
    source: `; Trzydzieści sześć krótkich odcinków tworzy okrąg
grubosc 4
powtorz 36 [np 10 pw 10]
`,
  },
  {
    id: 'wieza',
    name: 'Skręcona wieża',
    mode: '3d',
    source: `; Ośmiokąty ułożone jeden nad drugim, każdy obrócony o 10 stopni
oto osmiokat
  powtorz 8 [np 20 pw 45]
już

powtorz 12 [osmiokat gora 90 np 4 dol 90 pw 10]
`,
  },
];
