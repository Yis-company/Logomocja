import type { Mode } from './lang'

export interface Example {
  id: string
  title: string
  mode: Mode
  source: string
}

export const EXAMPLES: Example[] = [
  {
    id: 'kwadraty',
    title: 'Kwadraty (procedura)',
    mode: '2d',
    source: `; Procedura z parametrami: bok i kąt skrętu
oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kolor "#16866a"
powtorz 12 [kwadrat 90 90 pw 30]
kolor "#d1495b"
powtorz 12 [kwadrat 50 90 pw 30]
`,
  },
  {
    id: 'gwiazda',
    title: 'Gwiazda',
    mode: '2d',
    source: `; Pięcioramienna gwiazda
grubosc 4
kolor "#e0a526"
powtorz 5 [np 160 pw 144]
pod np 200 opu
kolor "#16866a"
grubosc 2
powtorz 10 [np 20 pw 36]
`,
  },
  {
    id: 'kwiat',
    title: 'Kwiat',
    mode: '2d',
    source: `oto luk
  powtorz 45 [np 3 pw 2]
już

oto platek
  powtorz 2 [luk pw 90]
już

grubosc 2
kolor "#c2185b"
powtorz 12 [platek pw 30]
kolor "#e0a526"
grubosc 5
powtorz 36 [np 1 pw 10]
`,
  },
  {
    id: 'szescian',
    title: 'Sześcian (3D)',
    mode: '3d',
    source: `; Krawędź pionowa: w górę i z powrotem
oto slup ma: wysokosc
  gora 90 np wysokosc ws wysokosc dol 90
już

oto sciana ma: bok
  powtorz 4 [np bok pw 90]
już

grubosc 3
kolor "#2f6fd0"
powtorz 4 [slup 80 np 80 pw 90]
kolor "#d1495b"
gora 90 np 80 dol 90
sciana 80
`,
  },
  {
    id: 'globus',
    title: 'Globus (3D)',
    mode: '3d',
    source: `; Okrąg w płaszczyźnie żółwia
oto kolo
  powtorz 36 [np 5 pw 10]
już

grubosc 2
kolor "#16866a"
powtorz 12 [kolo gora 15]
kolor "#2f6fd0"
powtorz 12 [kolo gora 15]
`,
  },
  {
    id: 'wstega',
    title: 'Wstęga (3D)',
    mode: '3d',
    source: `; Żółw jednocześnie skręca i unosi nos
grubosc 3
kolor "#8e44ad"
powtorz 180 [np 6 pw 8 gora 1]
kolor "#e0a526"
powtorz 180 [np 6 pw 8 dol 1]
`,
  },
]
