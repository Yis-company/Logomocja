import type { Mode } from "../lang";

export interface Example {
  id: string;
  title: string;
  mode: Mode;
  source: string;
}

export const WELCOME = `; Witaj w Logomocji!
; Napisz program i naciśnij „Uruchom” (Ctrl+Enter).

oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kolor "#16866a"
powtorz 12 [kwadrat 80 90 pw 30]
`;

export const EXAMPLES: Example[] = [
  {
    id: "kwadrat",
    title: "Kwadrat",
    mode: "2d",
    source: `; Najprostsza procedura z dwoma parametrami.
oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90
`,
  },
  {
    id: "gwiazda",
    title: "Gwiazda",
    mode: "2d",
    source: `; Pięcioramienna gwiazda: 5 razy po 144°.
kolor "#d9480f"
grubość 4
pod ws 60 lw 90 ws 75 pw 90 opu
powtorz 5 [np 200 pw 144]
`,
  },
  {
    id: "kwiat",
    title: "Kwiat",
    mode: "2d",
    source: `; Płatek to dwa łuki; dwanaście płatków to kwiat.
oto łuk ma: krok
  powtorz 30 [np krok pw 3]
już

oto płatek ma: krok
  łuk krok pw 90
  łuk krok pw 90
już

kolor "#c2255c"
grubość 2
powtorz 12 [płatek 4 pw 30]

; łodyga
kolor "#2b8a3e"
grubość 5
pw 180 np 260
`,
  },
  {
    id: "drzewo",
    title: "Drzewo",
    mode: "2d",
    source: `; Bez rekurencji: każdy poziom drzewa to osobna procedura,
; a długości gałęzi podajemy jako parametry.
oto liść ma: d
  np d ws d
już

oto gałąź1 ma: a, b
  np a
  lw 25 liść b
  pw 50 liść b
  lw 25
  ws a
już

oto gałąź2 ma: a, b, c
  np a
  lw 25 gałąź1 b c
  pw 50 gałąź1 b c
  lw 25
  ws a
już

oto gałąź3 ma: a, b, c, d
  np a
  lw 25 gałąź2 b c d
  pw 50 gałąź2 b c d
  lw 25
  ws a
już

kolor "#7c4a1e"
grubość 6
pod ws 160 opu
gałąź3 110 75 50 35
`,
  },
  {
    id: "domek",
    title: "Domek",
    mode: "2d",
    source: `; Kolory, grubość i podnoszenie pisaka.
oto prostokąt ma: a, b
  powtorz 2 [np a pw 90 np b pw 90]
już

; ściany
kolor "#495057" grubość 4
prostokąt 120 140

; dach
kolor "#c92a2a"
np 120 pw 30 np 140 pw 120 np 140 pw 30 ws 120

; drzwi
pod pw 90 np 55 lw 90 opu
kolor "#7c4a1e" grubość 3
prostokąt 55 30

; okno
pod np 75 pw 90 ws 40 lw 90 opu
kolor "#1c7ed6"
powtorz 4 [np 25 pw 90]
`,
  },
  {
    id: "szescian",
    title: "Sześcian (3D)",
    mode: "3d",
    source: `; Cztery ściany sześcianu „przetoczone” wokół krawędzi.
; Obracaj widok, przeciągając rysunek.
oto ściana ma: a
  powtorz 4 [np a pw 90]
już

oto sześcian ma: a
  powtorz 4 [ściana a np a góra 90]
już

kolor "#1971c2"
grubość 4
sześcian 120
`,
  },
  {
    id: "kula",
    title: "Kula z okręgów (3D)",
    mode: "3d",
    source: `; Okrąg obracany w górę co 10° tworzy kulę.
oto okrąg
  powtorz 36 [np 12 pw 10]
już

grubość 2
powtorz 6 [
  kolor "#16866a" okrąg góra 10
  kolor "#1c7ed6" okrąg góra 10
  kolor "#f08c00" okrąg góra 10
]
`,
  },
  {
    id: "sprezyna",
    title: "Sprężyna (3D)",
    mode: "3d",
    source: `; Skręcaj w prawo i jednocześnie lekko w górę:
; żółw wznosi się po spirali.
grubość 3
oto zwój ma: krok
  powtorz 36 [np krok pw 10 góra 5]
już

kolor "#7048e8" zwój 10
kolor "#d6336c" zwój 10
kolor "#f08c00" zwój 10
kolor "#2f9e44" zwój 10
`,
  },
];
