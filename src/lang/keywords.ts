/** Canonical identifiers of every keyword of the dialect. */
export type Keyword =
  | 'fd' | 'bk' | 'rt' | 'lt' | 'pu' | 'pd' | 'color' | 'width'
  | 'repeat' | 'let' | 'if' | 'ifelse' | 'stop' | 'home' | 'cs'
  | 'up' | 'down' | 'rr' | 'rl'
  | 'to' | 'end' | 'repcount';

/** Every spelling (lower case, NFC) mapped to its keyword. */
const ALIASES: Record<Keyword, string[]> = {
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
  to: ['oto', 'to'],
  end: ['już', 'juz', 'end'],
  repcount: ['nrpowt', 'repcount'],
};

const LOOKUP = new Map<string, Keyword>();
for (const [kw, list] of Object.entries(ALIASES) as [Keyword, string[]][]) {
  for (const spelling of list) LOOKUP.set(spelling.normalize('NFC'), kw);
}

/** Normalises a name for comparison: NFC and lower case (names ignore case). */
export function nameKey(text: string): string {
  return text.normalize('NFC').toLowerCase();
}

export function keywordOf(key: string): Keyword | undefined {
  return LOOKUP.get(key);
}

export function aliasesOf(kw: Keyword): readonly string[] {
  return ALIASES[kw];
}

/** All reserved spellings, used for suggestions and highlighting. */
export const ALL_SPELLINGS: readonly string[] = [...LOOKUP.keys()];

export const COMMANDS_3D: ReadonlySet<Keyword> = new Set<Keyword>(['up', 'down', 'rr', 'rl']);

/** Keyword groups used by the syntax highlighter. */
export type KeywordGroup = 'move' | 'pen' | 'control' | 'space' | 'value';

export function keywordGroup(kw: Keyword): KeywordGroup {
  switch (kw) {
    case 'fd': case 'bk': case 'rt': case 'lt': case 'home':
      return 'move';
    case 'pu': case 'pd': case 'color': case 'width': case 'cs':
      return 'pen';
    case 'up': case 'down': case 'rr': case 'rl':
      return 'space';
    case 'repcount':
      return 'value';
    default:
      return 'control';
  }
}
