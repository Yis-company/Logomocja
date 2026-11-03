/** Canonical command identifiers. Every alias in a group is equivalent. */
export type Keyword =
  | 'forward'
  | 'back'
  | 'right'
  | 'left'
  | 'penup'
  | 'pendown'
  | 'color'
  | 'width'
  | 'repeat'
  | 'let'
  | 'if'
  | 'ifelse'
  | 'stop'
  | 'home'
  | 'clear'
  | 'pitchup'
  | 'pitchdown'
  | 'rollright'
  | 'rollleft'
  | 'repcount'
  | 'to'
  | 'end';

export const ALIASES: Record<Keyword, string[]> = {
  forward: ['np', 'naprzod', 'naprzód', 'fd', 'forward'],
  back: ['ws', 'wstecz', 'bk', 'back'],
  right: ['pw', 'prawo', 'rt', 'right'],
  left: ['lw', 'lewo', 'lt', 'left'],
  penup: ['pod', 'podnies', 'podnieś', 'pu', 'penup'],
  pendown: ['opu', 'opusc', 'opuść', 'pd', 'pendown'],
  color: ['kolor', 'color'],
  width: ['grubosc', 'grubość', 'width'],
  repeat: ['powtorz', 'powtórz', 'repeat'],
  let: ['niech', 'let'],
  if: ['jeśli', 'jesli', 'if'],
  ifelse: ['jeżeli', 'jezeli', 'ifelse'],
  stop: ['stop'],
  home: ['dom', 'home'],
  clear: ['czyść', 'czysc', 'cs', 'clearscreen'],
  pitchup: ['gora', 'góra', 'pitchup'],
  pitchdown: ['dol', 'dół', 'pitchdown'],
  rollright: ['pp', 'przechylprawo', 'rr', 'rollright'],
  rollleft: ['pl', 'przechyllewo', 'rl', 'rollleft'],
  repcount: ['nrpowt', 'repcount'],
  to: ['oto', 'to'],
  end: ['już', 'juz', 'end'],
};

const LOOKUP = new Map<string, Keyword>();
for (const [kw, list] of Object.entries(ALIASES) as [Keyword, string[]][]) {
  for (const alias of list) LOOKUP.set(alias, kw);
}

/** Lower-cased, NFC-normalised form used for every name comparison. */
export function normalizeName(text: string): string {
  return text.normalize('NFC').toLowerCase();
}

export function keywordOf(lower: string): Keyword | undefined {
  return LOOKUP.get(lower);
}

export function isReserved(lower: string): boolean {
  return LOOKUP.has(lower);
}

/** Commands that exist only in space mode. */
export const SPATIAL: ReadonlySet<Keyword> = new Set(['pitchup', 'pitchdown', 'rollright', 'rollleft']);

/** Preferred Polish spelling for messages. */
export const DISPLAY: Record<Keyword, string> = {
  forward: 'np',
  back: 'ws',
  right: 'pw',
  left: 'lw',
  penup: 'pod',
  pendown: 'opu',
  color: 'kolor',
  width: 'grubość',
  repeat: 'powtórz',
  let: 'niech',
  if: 'jeśli',
  ifelse: 'jeżeli',
  stop: 'stop',
  home: 'dom',
  clear: 'czyść',
  pitchup: 'góra',
  pitchdown: 'dół',
  rollright: 'pp',
  rollleft: 'pl',
  repcount: 'nrpowt',
  to: 'oto',
  end: 'już',
};
