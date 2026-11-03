export const examples = [
  [
    "kwadrat",
    "Kwadrat",
    "2d",
    "Cztery kroki do pierwszego rysunku.",
    `; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]`,
  ],
  [
    "gwiazda",
    "Gwiazda",
    "2d",
    "Mała zmiana kąta, wielka różnica.",
    `; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]`,
  ],
  [
    "rozeta",
    "Rozeta",
    "2d",
    "Jeden kwadrat. Wiele możliwości.",
    `; Obróć kwadrat i zobacz, co powstanie.
kolor "#16866a"
grubosc 2
powtorz 12 [
  powtorz 4 [
    np 100
    pw 90
  ]
  pw 30
]`,
  ],
  [
    "spirala",
    "Spirala",
    "2d",
    "Licznik powtórzeń i zmienna zmieniają kolor.",
    `; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]`,
  ],
  [
    "wielokaty",
    "Wielokąty",
    "2d",
    "Procedura liczy kąt z liczby boków.",
    `; Jedna procedura, wiele figur: kąt liczy się sam.
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
  ],
  [
    "drzewo",
    "Drzewo",
    "2d",
    "Gałąź rysuje dwie mniejsze gałęzie.",
    `; Rekurencja: gałąź rysuje dwie mniejsze gałęzie.
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
  ],
  [
    "sniezynka",
    "Śnieżynka",
    "2d",
    "Krzywa Kocha z czterech poziomów.",
    `; Krzywa Kocha: każdy odcinek dzieli się na cztery.
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
  ],
  [
    "schody",
    "Schody",
    "3d",
    "Pierwszy krok w trzeci wymiar.",
    `; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]`,
  ],
  [
    "szescian",
    "Sześcian",
    "3d",
    "Zbuduj bryłę z prostych poleceń.",
    `; Dwa kwadraty połączone krawędziami.
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
  ],
  [
    "pierscien",
    "Pierścień",
    "3d",
    "Okrąg przechylony w przestrzeni.",
    `; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]`,
  ],
  [
    "kula",
    "Kula",
    "3d",
    "Okręgi obrócone wokół kierunku żółwia.",
    `; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]`,
  ],
  [
    "helisa",
    "Helisa",
    "3d",
    "Spirala wznosi się obrót po obrocie.",
    `; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]`,
  ],
  [
    "drzewo3d",
    "Drzewo 3D",
    "3d",
    "Gałęzie obracają się wokół pnia.",
    `; Drzewo w przestrzeni: gałęzie obracają się wokół pnia.
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
  ],
].map(([id, name, mode, description, source]) => ({
  id,
  name,
  mode,
  description,
  source,
}));
export const challenges = [
  {
    id: "square",
    name: "Pierwszy kwadrat",
    mode: "2d",
    description:
      "Narysuj kwadrat o boku 100. Zacznij w (0, 0), w kierunku +Y. Użyj pętli lub czterech ruchów.",
    hint: "Pełny obrót ma 360°. Kwadrat potrzebuje czterech równych skrętów.",
    source: "powtorz 4 [np 100 pw 90]",
    starter: "; Kwadrat o boku 100\npowtorz 4 [\n  np 100\n  ; dodaj skręt\n]",
  },
  {
    id: "triangle",
    name: "Trzy równe boki",
    mode: "2d",
    description:
      "Narysuj trójkąt równoboczny o boku 120, zaczynając w (0, 0), w kierunku +Y i skręcając w prawo.",
    hint: "Żółw skręca o kąt zewnętrzny: 360 / 3.",
    source: "powtorz 3 [np 120 pw 120]",
    starter: "; Trzy boki po 120\n",
  },
  {
    id: "star",
    name: "Pięć ramion",
    mode: "2d",
    description:
      "Narysuj pięcioramienną gwiazdę: pięć odcinków po 150, skręty w prawo. Start w (0, 0), kierunek +Y.",
    hint: "Wypróbuj kąt 144°.",
    source: "powtorz 5 [np 150 pw 144]",
    starter: "; Pięć odcinków, jeden niezwykły kąt\n",
  },
  {
    id: "dash",
    name: "Przerwa na oddech",
    mode: "2d",
    description:
      "Narysuj trzy pionowe kreski po 30 jednostek. Między nimi zostaw po 20 pustych jednostek. Zacznij w (0, 0), kierunek +Y.",
    hint: "Podnieś pisak na czas przerwy i ponownie go opuść.",
    source: "np 30 pod np 20 opu np 30 pod np 20 opu np 30",
    starter: "; Rysuj, zrób przerwę, rysuj dalej\n",
  },
  {
    id: "stairs",
    name: "W górę!",
    mode: "3d",
    description:
      "Zbuduj trzy stopnie: każdy ma 40 jednostek w kierunku +Y, potem 25 jednostek w górę (+Z). Zacznij w początku układu.",
    hint: "gora 90 i dol 90 zmieniają kierunek między poziomem a pionem.",
    source: "powtorz 3 [np 40 gora 90 np 25 dol 90]",
    starter: "; Trzy stopnie w przestrzeni\npowtorz 3 [\n  np 40\n]",
  },
];
