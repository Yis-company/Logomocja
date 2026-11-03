// Słowa kluczowe dialektu. Każdy alias (polski, angielski, z ogonkami i bez) wskazuje
// na jedno znaczenie. Nazwy porównujemy po zamianie na małe litery.

export type Kw =
  | 'fd' | 'bk' | 'rt' | 'lt' | 'pu' | 'pd' | 'color' | 'width'
  | 'repeat' | 'let' | 'if' | 'ifelse' | 'stop' | 'home' | 'cs'
  | 'up' | 'down' | 'rr' | 'rl' | 'repcount' | 'to' | 'end';

const TABLE: Record<Kw, string[]> = {
  fd: ['np', 'naprzod', 'naprzód', 'fd', 'forward'],
  bk: ['ws', 'wstecz', 'bk', 'back'],
  rt: ['pw', 'prawo', 'rt', 'right'],
  lt: ['lw', 'lewo', 'lt', 'left'],
  pu: ['pod', 'podnies', 'podnieś', 'pu', 'penup'],
  pd: ['opu', 'opusc', 'opuść', 'pd', 'pendown'],
  color: ['kolor', 'color'],
  width: ['grubosc', 'grubość', 'width'],
  repeat: ['powtorz', 'powtórz', 'repeat'],
  let: ['niech', 'let'],
  if: ['jeśli', 'jesli', 'if'],
  ifelse: ['jeżeli', 'jezeli', 'ifelse'],
  stop: ['stop'],
  home: ['dom', 'home'],
  cs: ['czyść', 'czysc', 'cs', 'clearscreen'],
  up: ['gora', 'góra', 'pitchup'],
  down: ['dol', 'dół', 'pitchdown'],
  rr: ['pp', 'przechylprawo', 'rr', 'rollright'],
  rl: ['pl', 'przechyllewo', 'rl', 'rollleft'],
  repcount: ['nrpowt', 'repcount'],
  to: ['oto', 'to'],
  end: ['już', 'juz', 'end'],
};

export const KEYWORDS = new Map<string, Kw>();
for (const [kw, names] of Object.entries(TABLE) as [Kw, string[]][]) {
  for (const n of names) KEYWORDS.set(n, kw);
}

export const ALIASES = TABLE;

/** Polecenia, które działają tylko w przestrzeni. */
export const ONLY_3D = new Set<Kw>(['up', 'down', 'rr', 'rl']);

export function normName(s: string): string {
  return s.toLowerCase();
}
