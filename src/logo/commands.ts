/** Command aliases: Polish (with and without diacritics) and English. */
export type CommandKind =
  | 'fd'
  | 'bk'
  | 'rt'
  | 'lt'
  | 'pu'
  | 'pd'
  | 'color'
  | 'width'
  | 'repeat'
  | 'pitchup'
  | 'pitchdown';

const ALIASES: Record<CommandKind, string[]> = {
  fd: ['np', 'naprzod', 'naprzód', 'fd', 'forward'],
  bk: ['ws', 'wstecz', 'bk', 'back'],
  rt: ['pw', 'prawo', 'rt', 'right'],
  lt: ['lw', 'lewo', 'lt', 'left'],
  pu: ['pod', 'podnies', 'podnieś', 'pu', 'penup'],
  pd: ['opu', 'opusc', 'opuść', 'pd', 'pendown'],
  color: ['kolor', 'color'],
  width: ['grubosc', 'grubość', 'width'],
  repeat: ['powtorz', 'powtórz', 'repeat'],
  pitchup: ['gora', 'góra', 'pitchup'],
  pitchdown: ['dol', 'dół', 'pitchdown'],
};

export const DEFINE_WORDS = new Set(['oto', 'to']);
export const END_WORDS = new Set(['już', 'juz', 'end']);

export const COMMAND_BY_WORD: ReadonlyMap<string, CommandKind> = (() => {
  const m = new Map<string, CommandKind>();
  for (const [kind, words] of Object.entries(ALIASES) as [CommandKind, string[]][]) {
    for (const w of words) m.set(w, kind);
  }
  return m;
})();

/** True for every word that has a fixed meaning and cannot name a procedure or parameter. */
export function isReservedWord(word: string): boolean {
  return COMMAND_BY_WORD.has(word) || DEFINE_WORDS.has(word) || END_WORDS.has(word) || word === 'ma:';
}

/** Canonical Polish spelling of a command, used in help and messages. */
export const CANONICAL: Record<CommandKind, string> = {
  fd: 'np',
  bk: 'ws',
  rt: 'pw',
  lt: 'lw',
  pu: 'pod',
  pd: 'opu',
  color: 'kolor',
  width: 'grubość',
  repeat: 'powtórz',
  pitchup: 'góra',
  pitchdown: 'dół',
};
