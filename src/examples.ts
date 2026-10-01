import type { Mode } from "./logo/types";
export type Example = {
  id: string;
  mode: Mode;
  name: string;
  description: string;
  level: string;
  source: string;
};
export const examples: Example[] = [
  {
    id: "rosette",
    mode: "2d",
    name: "Rozeta",
    description: "Jeden kwadrat. Wiele możliwości.",
    level: "POWTÓRZENIA",
    source:
      '; Obróć kwadrat i zobacz, co powstanie.\nkolor "#16866a"\ngrubosc 2\n\npowtorz 12 [\n  powtorz 4 [\n    np 100\n    pw 90\n  ]\n  pw 30\n]',
  },
  {
    id: "square",
    mode: "2d",
    name: "Kwadrat",
    description: "Cztery kroki do pierwszego rysunku.",
    level: "PIERWSZE KROKI",
    source:
      '; Cztery boki, cztery skręty.\nkolor "#16866a"\ngrubosc 3\npowtorz 4 [\n  np 120\n  pw 90\n]',
  },
  {
    id: "star",
    mode: "2d",
    name: "Gwiazda",
    description: "Mała zmiana kąta, wielka różnica.",
    level: "GEOMETRIA",
    source:
      '; Sekret gwiazdy? Kąt 144 stopni.\nkolor "#c1763d"\ngrubosc 3\npowtorz 5 [\n  np 180\n  pw 144\n]',
  },
  {
    id: "stairs",
    mode: "3d",
    name: "Schody",
    description: "Pierwszy krok w trzeci wymiar.",
    level: "PIERWSZE KROKI",
    source:
      '; Żółw wspina się w przestrzeni.\nkolor "#16866a"\ngrubosc 4\npowtorz 6 [\n  np 35\n  gora 90\n  np 20\n  dol 90\n]',
  },
  {
    id: "cube",
    mode: "3d",
    name: "Sześcian",
    description: "Zbuduj bryłę z prostych poleceń.",
    level: "GEOMETRIA",
    source:
      '; Dwa kwadraty połączone krawędziami.\nkolor "#16866a"\ngrubosc 3\npowtorz 4 [np 100 pw 90]\ngora 90 np 100 dol 90\npowtorz 4 [np 100 pw 90]\npowtorz 4 [\n  np 100\n  dol 90 np 100\n  pod ws 100 opu\n  gora 90 pw 90\n]',
  },
  {
    id: "spiral",
    mode: "3d",
    name: "Spirala",
    description: "Rysuj coraz wyżej, obrót po obrocie.",
    level: "POWTÓRZENIA",
    source:
      '; Skręty i wznoszenie tworzą spiralę.\nkolor "#a478c0"\ngrubosc 3\npowtorz 90 [\n  np 12\n  pw 18\n  gora 90 np 2 dol 90\n]',
  },
  {id: "procedure-rosette", mode: "2d", name: "Rozeta z procedury", description: "Zdefiniuj kwadrat i użyj go osiem razy.", level: "PROCEDURY", source: 'oto kwadrat :bok\n  powtorz 4 [np :bok pw 90]\njuż\n\npowtorz 8 [kwadrat 90 lw 45]'},
];
export const defaults: Record<Mode, string> = {
  "2d": examples[0].source,
  "3d": examples[3].source,
};
