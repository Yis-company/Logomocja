// Słownik poleceń dialektu Logomocji: każdy alias (polski i angielski)
// wskazuje na jedno polecenie kanoniczne.

export type CommandId =
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
  | 'rollleft';

export const COMMAND_ALIASES: Record<CommandId, readonly string[]> = {
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
};

/** Polska, kanoniczna nazwa polecenia używana w komunikatach. */
export const COMMAND_NAME_PL: Record<CommandId, string> = {
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
};

export const COMMANDS = new Map<string, CommandId>();
for (const [id, aliases] of Object.entries(COMMAND_ALIASES) as [CommandId, readonly string[]][]) {
  for (const alias of aliases) COMMANDS.set(alias, id);
}

export const REPCOUNT_WORDS = new Set(['nrpowt', 'repcount']);
export const DEFINE_WORDS = new Set(['oto', 'to']);
export const END_WORDS = new Set(['już', 'juz', 'end']);
export const PARAMS_WORD = 'ma:';

export const THREE_D_ONLY = new Set<CommandId>(['pitchup', 'pitchdown', 'rollright', 'rollleft']);

/** Słowa, których nie wolno użyć jako nazwy procedury, zmiennej ani parametru. */
export function isReservedWord(lower: string): boolean {
  return (
    COMMANDS.has(lower) ||
    REPCOUNT_WORDS.has(lower) ||
    DEFINE_WORDS.has(lower) ||
    END_WORDS.has(lower) ||
    lower === 'ma' ||
    lower === PARAMS_WORD
  );
}

/** Normalizacja nazw: wielkość liter nie ma znaczenia. */
export function normaliseName(word: string): string {
  return word.normalize('NFC').toLowerCase();
}
