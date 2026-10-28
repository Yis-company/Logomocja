import type { Mode } from '../lang';

export interface Example {
  /** Name under which the program is loaded, e.g. "kwadrat". */
  name: string;
  mode: Mode;
  /** Short Polish title shown in the examples dialog. */
  title: string;
  /** The one-line description from the brief. */
  blurb: string;
  /** Program text, shipped byte for byte. */
  source: string;
}

export const EXAMPLES: readonly Example[] = [
  {
    name: 'kwadrat',
    mode: '2d',
    title: 'Kwadrat',
    blurb: 'Cztery kroki do pierwszego rysunku.',
    source: `; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]
`,
  },
  {
    name: 'gwiazda',
    mode: '2d',
    title: 'Gwiazda',
    blurb: 'Mała zmiana kąta, wielka różnica.',
    source: `; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]
`,
  },
  {
    name: 'rozeta',
    mode: '2d',
    title: 'Rozeta',
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
]
`,
  },
  {
    name: 'spirala',
    mode: '2d',
    title: 'Spirala',
    blurb: 'Licznik powtórzeń i zmienna zmieniają kolor.',
    source: `; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]
`,
  },
  {
    name: 'wielokaty',
    mode: '2d',
    title: 'Wielokąty',
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
]
`,
  },
  {
    name: 'drzewo',
    mode: '2d',
    title: 'Drzewo',
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
gałąź 90
`,
  },
  {
    name: 'sniezynka',
    mode: '2d',
    title: 'Śnieżynka',
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
]
`,
  },
  {
    name: 'schody',
    mode: '3d',
    title: 'Schody',
    blurb: 'Pierwszy krok w trzeci wymiar.',
    source: `; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]
`,
  },
  {
    name: 'szescian',
    mode: '3d',
    title: 'Sześcian',
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
]
`,
  },
  {
    name: 'pierscien',
    mode: '3d',
    title: 'Pierścień',
    blurb: 'Okrąg przechylony w przestrzeni.',
    source: `; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]
`,
  },
  {
    name: 'kula',
    mode: '3d',
    title: 'Kula',
    blurb: 'Okręgi obrócone wokół kierunku żółwia.',
    source: `; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]
`,
  },
  {
    name: 'helisa',
    mode: '3d',
    title: 'Helisa',
    blurb: 'Spirala wznosi się obrót po obrocie.',
    source: `; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]
`,
  },
  {
    name: 'drzewo3d',
    mode: '3d',
    title: 'Drzewo 3D',
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
gałąź 70
`,
  },
];
