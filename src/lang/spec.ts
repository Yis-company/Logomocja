// Language tables and hard limits. Everything the lexer, parser and machine
// need to agree on lives here.

export type Mode = '2d' | '3d';

export const LIMITS = {
  maxChars: 50_000,
  maxTokens: 10_000,
  maxBracketDepth: 32,
  maxParenDepth: 256,
  maxFrames: 32,
  maxOps: 10_000,
  maxSegments: 10_000,
  maxCoord: 100_000,
  maxRepeat: 10_000,
  minWidth: 1,
  maxWidth: 12,
} as const;

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
  | 'let'
  | 'if'
  | 'ifelse'
  | 'stop'
  | 'home'
  | 'cs'
  | 'pitchup'
  | 'pitchdown'
  | 'rollright'
  | 'rollleft';

// Every spelling of every command, Polish first. Keys are normalised at load time.
export const COMMAND_TABLE: ReadonlyArray<readonly [CommandKind, readonly string[]]> = [
  ['fd', ['np', 'naprzod', 'naprzód', 'fd', 'forward']],
  ['bk', ['ws', 'wstecz', 'bk', 'back']],
  ['rt', ['pw', 'prawo', 'rt', 'right']],
  ['lt', ['lw', 'lewo', 'lt', 'left']],
  ['pu', ['pod', 'podnies', 'podnieś', 'pu', 'penup']],
  ['pd', ['opu', 'opusc', 'opuść', 'pd', 'pendown']],
  ['color', ['kolor', 'color']],
  ['width', ['grubosc', 'grubość', 'width']],
  ['repeat', ['powtorz', 'powtórz', 'repeat']],
  ['let', ['niech', 'let']],
  ['if', ['jeśli', 'jesli', 'if']],
  ['ifelse', ['jeżeli', 'jezeli', 'ifelse']],
  ['stop', ['stop']],
  ['home', ['dom', 'home']],
  ['cs', ['czyść', 'czysc', 'cs', 'clearscreen']],
  ['pitchup', ['gora', 'góra', 'pitchup']],
  ['pitchdown', ['dol', 'dół', 'pitchdown']],
  ['rollright', ['pp', 'przechylprawo', 'rr', 'rollright']],
  ['rollleft', ['pl', 'przechyllewo', 'rl', 'rollleft']],
];

export const PITCH_AND_ROLL: ReadonlySet<CommandKind> = new Set<CommandKind>([
  'pitchup',
  'pitchdown',
  'rollright',
  'rollleft',
]);

const commandByWord = new Map<string, CommandKind>();
for (const [kind, words] of COMMAND_TABLE) {
  for (const word of words) commandByWord.set(normaliseName(word), kind);
}

/** Integer with a plain space every three digits, e.g. 10 000. */
export function formatCount(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** Lower-case NFC form used for every name and keyword comparison. */
export function normaliseName(text: string): string {
  return text.normalize('NFC').toLowerCase();
}

export function commandKindOf(norm: string): CommandKind | undefined {
  return commandByWord.get(norm);
}

export const DEFINE_WORDS: ReadonlySet<string> = new Set(['oto', 'to'].map(normaliseName));
export const END_WORDS: ReadonlySet<string> = new Set(['już', 'juz', 'end'].map(normaliseName));
export const VALUE_WORDS: ReadonlySet<string> = new Set(['nrpowt', 'repcount']);
export const HEADER_WORD = 'ma';

/** Words that can never be a procedure, variable or parameter name. */
export const RESERVED: ReadonlySet<string> = new Set<string>([
  ...commandByWord.keys(),
  ...DEFINE_WORDS,
  ...END_WORDS,
  ...VALUE_WORDS,
]);

export const COMPARISON_OPERATORS: ReadonlySet<string> = new Set(['=', '<', '>', '<=', '>=', '<>']);

export function isReserved(norm: string): boolean {
  return RESERVED.has(norm);
}
