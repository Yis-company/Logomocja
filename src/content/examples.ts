import type { Mode } from '../lang/ast';

export interface Example {
  /** Name used to load the example (also in the URL: #/przyklad/<id>). */
  id: string;
  title: string;
  mode: Mode;
  /** One-line description. */
  blurb: string;
  source: string;
}

/** The thirteen standard programs, verbatim. */
export const EXAMPLES: readonly Example[] = [
  {
    id: 'kwadrat',
    title: 'Kwadrat',
    mode: '2d',
    blurb: 'Cztery kroki do pierwszego rysunku.',
    source: `; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]`,
  },
  {
    id: 'gwiazda',
    title: 'Gwiazda',
    mode: '2d',
    blurb: 'Mała zmiana kąta, wielka różnica.',
    source: `; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]`,
  },
  {
    id: 'rozeta',
    title: 'Rozeta',
    mode: '2d',
    blurb: 'Jeden kwadrat. Wiele możliwości.',
    source: `; Obróć kwadrat i zobacz, co powstanie.
kolor "#16866a"
grubosc 2
powtorz 12 [
  powtorz 4 [
    np 100
    pw 90
  ]
  pw 30
]`,
  },
  {
    id: 'spirala',
    title: 'Spirala',
    mode: '2d',
    blurb: 'Licznik powtórzeń i zmienna zmieniają kolor.',
    source: `; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]`,
  },
  {
    id: 'wielokaty',
    title: 'Wielokąty',
    mode: '2d',
    blurb: 'Procedura liczy kąt z liczby boków.',
    source: `; Jedna procedura, wiele figur: kąt liczy się sam.
oto wielokąt ma: boki, bok
  powtorz boki [np bok pw 360 / boki]
już

grubosc 2
niech n 3
powtorz 7 [
  wielokąt n 60
  niech n n + 1
  pw 360 / 7
]`,
  },
  {
    id: 'drzewo',
    title: 'Drzewo',
    mode: '2d',
    blurb: 'Gałąź rysuje dwie mniejsze gałęzie.',
    source: `; Rekurencja: gałąź rysuje dwie mniejsze gałęzie.
oto gałąź ma: dł
  jeśli dł < 6 [stop]
  jeżeli dł > 30 [kolor "#6b4f2a" grubosc 3] [kolor "#2f8f4e" grubosc 1]
  np dł
  lw 25
  gałąź dł * 0.7
  pw 50
  gałąź dł * 0.7
  lw 25
  pod ws dł opu
już

pod ws 120 opu
gałąź 90`,
  },
  {
    id: 'sniezynka',
    title: 'Śnieżynka',
    mode: '2d',
    blurb: 'Krzywa Kocha z czterech poziomów.',
    source: `; Krzywa Kocha: każdy odcinek dzieli się na cztery.
oto koch ma: dł, poziom
  jeśli poziom = 0 [np dł stop]
  koch dł / 3 poziom - 1
  lw 60
  koch dł / 3 poziom - 1
  pw 120
  koch dł / 3 poziom - 1
  lw 60
  koch dł / 3 poziom - 1
już

kolor "#2b6fb3"
grubosc 1
pod pw 90 ws 135 lw 90 np 80 opu
powtorz 3 [
  koch 270 4
  pw 120
]`,
  },
  {
    id: 'schody',
    title: 'Schody',
    mode: '3d',
    blurb: 'Pierwszy krok w trzeci wymiar.',
    source: `; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]`,
  },
  {
    id: 'szescian',
    title: 'Sześcian',
    mode: '3d',
    blurb: 'Zbuduj bryłę z prostych poleceń.',
    source: `; Dwa kwadraty połączone krawędziami.
kolor "#16866a"
grubosc 3
powtorz 4 [np 100 pw 90]
gora 90 np 100 dol 90
powtorz 4 [np 100 pw 90]
powtorz 4 [
  np 100
  dol 90 np 100
  pod ws 100 opu
  gora 90 pw 90
]`,
  },
  {
    id: 'pierscien',
    title: 'Pierścień',
    mode: '3d',
    blurb: 'Okrąg przechylony w przestrzeni.',
    source: `; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]`,
  },
  {
    id: 'kula',
    title: 'Kula',
    mode: '3d',
    blurb: 'Okręgi obrócone wokół kierunku żółwia.',
    source: `; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]`,
  },
  {
    id: 'helisa',
    title: 'Helisa',
    mode: '3d',
    blurb: 'Spirala wznosi się obrót po obrocie.',
    source: `; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]`,
  },
  {
    id: 'drzewo3d',
    title: 'Drzewo 3D',
    mode: '3d',
    blurb: 'Gałęzie obracają się wokół pnia.',
    source: `; Drzewo w przestrzeni: gałęzie obracają się wokół pnia.
oto gałąź ma: dł
  jeśli dł < 8 [stop]
  jeżeli dł > 30 [kolor "#6b4f2a" grubosc 3] [kolor "#2f8f4e" grubosc 1]
  np dł
  powtorz 3 [
    gora 35
    gałąź dł * 0.6
    dol 35
    pp 120
  ]
  pod ws dł opu
już

gora 90
gałąź 70`,
  },
];

export function findExample(id: string): Example | undefined {
  const key = id.normalize('NFC').toLowerCase();
  return EXAMPLES.find((e) => e.id === key || e.title.toLowerCase() === key);
}
