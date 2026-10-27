export interface Example {
  id: string;
  title: string;
  mode: '2d' | '3d';
  source: string;
}

export const EXAMPLES: Example[] = [
  {
    id: 'kwadrat',
    title: 'Kwadrat',
    mode: '2d',
    source: `; Żółw zaczyna na środku, zwrócony w górę.
; np – naprzód, pw – w prawo (w stopniach)

powtórz 4 [
  np 120
  pw 90
]
`,
  },
  {
    id: 'gwiazda',
    title: 'Gwiazda',
    mode: '2d',
    source: `; Pięcioramienna gwiazda: pięć kroków i obroty o 144°.

kolor "#d9480f"
grubość 5
powtórz 5 [np 200 pw 144]
`,
  },
  {
    id: 'rozeta',
    title: 'Rozeta',
    mode: '2d',
    source: `; Kwadrat obracany o 10° – klasyczna rozeta.

oto kwadrat ma: bok
  powtórz 4 [np bok pw 90]
już

kolor "#1c7ed6"
grubość 2
powtórz 36 [
  kwadrat 120
  pw 10
]
`,
  },
  {
    id: 'kwiat',
    title: 'Kwiat',
    mode: '2d',
    source: `; Procedury z parametrami: płatek z dwóch łuków,
; a kwiat to płatki obracane dookoła.

oto łuk ma: krok, kąt
  powtórz 12 [np krok pw kąt]
już

oto płatek ma: krok
  łuk krok 5
  pw 120
  łuk krok 5
  pw 120
już

oto kwiat ma: ile, krok
  powtórz ile [płatek krok pw 30]
już

kolor "#e8590c"
grubość 3
kwiat 12 20

; łodyga
kolor "#2b8a3e"
grubość 6
pw 180
np 260
`,
  },
  {
    id: 'domek',
    title: 'Domek',
    mode: '2d',
    source: `; Dom z dachem i oknem. „pod” podnosi pisak,
; „opu” go opuszcza – żółw może iść, nie rysując.

oto prostokąt ma: szer, wys
  powtórz 2 [np wys pw 90 np szer pw 90]
już

oto trójkąt ma: bok
  powtórz 3 [np bok pw 120]
już

; ściany
pod ws 80 lw 90 np 90 pw 90 opu
kolor "#c92a2a"
grubość 4
prostokąt 180 120

; dach
np 120 pw 90
kolor "#5c3b1e"
lw 60
trójkąt 180
pw 60 lw 90
ws 120

; okno
pod pw 90 np 40 lw 90 np 60 opu
kolor "#1971c2"
grubość 3
prostokąt 40 40
pw 90 np 20 lw 90 np 40
lw 90 np 20 ws 40

; drzwi
pod pw 90 np 50 pw 90 np 60 pw 90 opu
kolor "#5c3b1e"
grubość 4
prostokąt 36 60
`,
  },
  {
    id: 'szescian',
    title: 'Sześcian (3D)',
    mode: '3d',
    source: `; W trybie 3D żółw może unosić nos: „góra” i „dół”.
; Obróć widok myszką (lub palcem), kółkiem przybliżaj.

oto kwadrat ma: bok
  powtórz 4 [np bok pw 90]
już

oto ściana ma: bok
  kwadrat bok
  np bok
  pw 90
już

kolor "#1864ab"
grubość 4
kwadrat 100          ; podłoga
góra 90
powtórz 4 [ściana 100]   ; 4 ściany
dół 90
`,
  },
  {
    id: 'spirala3d',
    title: 'Sprężyna (3D)',
    mode: '3d',
    source: `; Mały obrót w prawo i lekko do góry w każdym kroku
; daje w przestrzeni sprężynę.

kolor "#9c36b5"
grubość 3
powtórz 240 [
  np 12
  pw 15
  góra 4
]
`,
  },
  {
    id: 'kula',
    title: 'Kula (3D)',
    mode: '3d',
    source: `; Okrąg w pionie, obracany dookoła osi – siatka kuli.

oto okrąg ma: krok
  powtórz 36 [np krok góra 10]
już

grubość 2
kolor "#099268"
powtórz 18 [
  okrąg 14
  pw 10
]
`,
  },
];

export function findExample(id: string): Example | undefined {
  return EXAMPLES.find((e) => e.id === id);
}
