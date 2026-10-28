export type Mode = '2d' | '3d';

export type CmdName =
  | 'fd' | 'bk' | 'rt' | 'lt' | 'pu' | 'pd' | 'color' | 'width'
  | 'repeat' | 'let' | 'if' | 'ifelse' | 'stop' | 'home' | 'cs'
  | 'pitchup' | 'pitchdown' | 'rollright' | 'rollleft';

/** Every spelling of every command, lowercase. */
const ALIASES: Record<CmdName, string[]> = {
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
  pitchup: ['gora', 'góra', 'pitchup'],
  pitchdown: ['dol', 'dół', 'pitchdown'],
  rollright: ['pp', 'przechylprawo', 'rr', 'rollright'],
  rollleft: ['pl', 'przechyllewo', 'rl', 'rollleft'],
};

export const COMMAND_WORDS = new Map<string, CmdName>();
for (const [name, words] of Object.entries(ALIASES) as [CmdName, string[]][]) {
  for (const w of words) COMMAND_WORDS.set(w, name);
}

/** 3D-only commands: pitch and roll. */
export const MODE_3D_ONLY = new Set<CmdName>(['pitchup', 'pitchdown', 'rollright', 'rollleft']);

export const BLOCK_WORDS = new Set(['oto', 'to']);
export const END_WORDS = new Set(['już', 'juz', 'end']);
export const VALUE_WORDS = new Set(['nrpowt', 'repcount']);

/** Words that can never be names of variables, parameters or procedures. */
export const RESERVED = new Set<string>([
  ...COMMAND_WORDS.keys(),
  ...BLOCK_WORDS,
  ...END_WORDS,
  ...VALUE_WORDS,
]);
