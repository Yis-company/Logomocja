export type Op =
  | 'fd' | 'bk' | 'rt' | 'lt' | 'pu' | 'pd' | 'color' | 'width' | 'repeat' | 'let'
  | 'if' | 'ifelse' | 'stop' | 'home' | 'cs' | 'pitchup' | 'pitchdown' | 'rollright' | 'rollleft';

export interface WordInfo {
  op: Op;
  /** Number of expression arguments for simple commands. */
  args: number;
  /** Available only in 3D mode. */
  only3d?: boolean;
}

const entries: [string[], WordInfo][] = [
  [['np', 'naprzod', 'naprzód', 'fd', 'forward'], { op: 'fd', args: 1 }],
  [['ws', 'wstecz', 'bk', 'back'], { op: 'bk', args: 1 }],
  [['pw', 'prawo', 'rt', 'right'], { op: 'rt', args: 1 }],
  [['lw', 'lewo', 'lt', 'left'], { op: 'lt', args: 1 }],
  [['pod', 'podnies', 'podnieś', 'pu', 'penup'], { op: 'pu', args: 0 }],
  [['opu', 'opusc', 'opuść', 'pd', 'pendown'], { op: 'pd', args: 0 }],
  [['kolor', 'color'], { op: 'color', args: 0 }],
  [['grubosc', 'grubość', 'width'], { op: 'width', args: 1 }],
  [['powtorz', 'powtórz', 'repeat'], { op: 'repeat', args: 1 }],
  [['niech', 'let'], { op: 'let', args: 1 }],
  [['jeśli', 'jesli', 'if'], { op: 'if', args: 0 }],
  [['jeżeli', 'jezeli', 'ifelse'], { op: 'ifelse', args: 0 }],
  [['stop'], { op: 'stop', args: 0 }],
  [['dom', 'home'], { op: 'home', args: 0 }],
  [['czyść', 'czysc', 'cs', 'clearscreen'], { op: 'cs', args: 0 }],
  [['gora', 'góra', 'pitchup'], { op: 'pitchup', args: 1, only3d: true }],
  [['dol', 'dół', 'pitchdown'], { op: 'pitchdown', args: 1, only3d: true }],
  [['pp', 'przechylprawo', 'rr', 'rollright'], { op: 'rollright', args: 1, only3d: true }],
  [['pl', 'przechyllewo', 'rl', 'rollleft'], { op: 'rollleft', args: 1, only3d: true }],
];

/** Every command word (Polish and English aliases), keyed by lowercase NFC spelling. */
export const WORDS = new Map<string, WordInfo>();
for (const [names, info] of entries) {
  for (const name of names) WORDS.set(name.normalize('NFC').toLowerCase(), info);
}

export const DEFINE_WORDS = new Set(['oto', 'to']);
export const END_WORDS = new Set(['już', 'juz', 'end']);
export const NRPOWT_WORDS = new Set(['nrpowt', 'repcount']);
export const MA_WORD = 'ma';

/** Words that may not be used as procedure, parameter or variable names. */
export function isReserved(key: string): boolean {
  return (
    WORDS.has(key) ||
    DEFINE_WORDS.has(key) ||
    END_WORDS.has(key) ||
    NRPOWT_WORDS.has(key) ||
    key === MA_WORD
  );
}
