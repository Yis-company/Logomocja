export type Op =
  | 'forward'
  | 'back'
  | 'right'
  | 'left'
  | 'penUp'
  | 'penDown'
  | 'setColor'
  | 'setWidth'
  | 'pitchUp'
  | 'pitchDown';

/** What follows the command word: a number, a colour literal, nothing, or a width (number with range). */
export type ArgKind = 'number' | 'none' | 'color' | 'width';

export interface CommandSpec {
  op: Op;
  arg: ArgKind;
  /** Pitch commands only exist in 3D. */
  spaceOnly?: boolean;
}

const TABLE: Array<{ words: string[] } & CommandSpec> = [
  { words: ['np', 'naprzod', 'naprzód', 'fd', 'forward'], op: 'forward', arg: 'number' },
  { words: ['ws', 'wstecz', 'bk', 'back'], op: 'back', arg: 'number' },
  { words: ['pw', 'prawo', 'rt', 'right'], op: 'right', arg: 'number' },
  { words: ['lw', 'lewo', 'lt', 'left'], op: 'left', arg: 'number' },
  { words: ['pod', 'podnies', 'podnieś', 'pu', 'penup'], op: 'penUp', arg: 'none' },
  { words: ['opu', 'opusc', 'opuść', 'pd', 'pendown'], op: 'penDown', arg: 'none' },
  { words: ['kolor', 'color'], op: 'setColor', arg: 'color' },
  { words: ['grubosc', 'grubość', 'width'], op: 'setWidth', arg: 'width' },
  { words: ['gora', 'góra', 'pitchup'], op: 'pitchUp', arg: 'number', spaceOnly: true },
  { words: ['dol', 'dół', 'pitchdown'], op: 'pitchDown', arg: 'number', spaceOnly: true },
];

export const COMMANDS = new Map<string, CommandSpec>();
for (const { words, ...spec } of TABLE) {
  for (const word of words) COMMANDS.set(word, spec);
}

export const REPEAT_WORDS = new Set(['powtorz', 'powtórz', 'repeat']);
export const DEFINE_WORDS = new Set(['oto', 'to']);
export const END_WORDS = new Set(['już', 'juz', 'end']);
export const PARAMS_WORD = 'ma';

/** Words that cannot name a procedure or a parameter. */
export function isReserved(word: string): boolean {
  return (
    COMMANDS.has(word) ||
    REPEAT_WORDS.has(word) ||
    DEFINE_WORDS.has(word) ||
    END_WORDS.has(word) ||
    word === PARAMS_WORD
  );
}
