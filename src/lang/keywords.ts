/** Canonical command identifiers and every alias (Polish, accented Polish, English). */
export type Keyword =
  | 'np' | 'ws' | 'pw' | 'lw' | 'pod' | 'opu' | 'kolor' | 'grubosc'
  | 'powtorz' | 'niech' | 'jesli' | 'jezeli' | 'stop' | 'dom' | 'czysc'
  | 'gora' | 'dol' | 'pp' | 'pl' | 'nrpowt' | 'oto' | 'juz';

export const ALIASES: Record<Keyword, string[]> = {
  np: ['np', 'naprzod', 'naprzód', 'fd', 'forward'],
  ws: ['ws', 'wstecz', 'bk', 'back'],
  pw: ['pw', 'prawo', 'rt', 'right'],
  lw: ['lw', 'lewo', 'lt', 'left'],
  pod: ['pod', 'podnies', 'podnieś', 'pu', 'penup'],
  opu: ['opu', 'opusc', 'opuść', 'pd', 'pendown'],
  kolor: ['kolor', 'color'],
  grubosc: ['grubosc', 'grubość', 'width'],
  powtorz: ['powtorz', 'powtórz', 'repeat'],
  niech: ['niech', 'let'],
  jesli: ['jeśli', 'jesli', 'if'],
  jezeli: ['jeżeli', 'jezeli', 'ifelse'],
  stop: ['stop'],
  dom: ['dom', 'home'],
  czysc: ['czyść', 'czysc', 'cs', 'clearscreen'],
  gora: ['gora', 'góra', 'pitchup'],
  dol: ['dol', 'dół', 'pitchdown'],
  pp: ['pp', 'przechylprawo', 'rr', 'rollright'],
  pl: ['pl', 'przechyllewo', 'rl', 'rollleft'],
  nrpowt: ['nrpowt', 'repcount'],
  oto: ['oto', 'to'],
  juz: ['już', 'juz', 'end'],
};

const LOOKUP = new Map<string, Keyword>();
for (const [kw, list] of Object.entries(ALIASES) as [Keyword, string[]][]) {
  for (const alias of list) LOOKUP.set(alias, kw);
}

/** Identifiers ignore case; NFC keeps precomposed and decomposed accents equal. */
export function normName(s: string): string {
  return s.normalize('NFC').toLowerCase();
}

export function keywordOf(name: string): Keyword | undefined {
  return LOOKUP.get(normName(name));
}

/** The spelling shown to learners in messages and the reference. */
export const DISPLAY: Record<Keyword, string> = {
  np: 'np', ws: 'ws', pw: 'pw', lw: 'lw', pod: 'pod', opu: 'opu', kolor: 'kolor',
  grubosc: 'grubość', powtorz: 'powtórz', niech: 'niech', jesli: 'jeśli', jezeli: 'jeżeli',
  stop: 'stop', dom: 'dom', czysc: 'czyść', gora: 'góra', dol: 'dół', pp: 'pp', pl: 'pl',
  nrpowt: 'nrpowt', oto: 'oto', juz: 'już',
};

export const ALL_ALIASES: string[] = [...LOOKUP.keys()];
