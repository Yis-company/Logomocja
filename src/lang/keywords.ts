/** Canonical command identifiers. */
export type Cmd =
  | 'fd' | 'bk' | 'rt' | 'lt' | 'pu' | 'pd' | 'color' | 'width' | 'repeat' | 'let'
  | 'if' | 'ifelse' | 'stop' | 'home' | 'cs' | 'pitchup' | 'pitchdown' | 'rollright' | 'rollleft';

const table: Record<Cmd, string[]> = {
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
  if: ['jesli', 'jeśli', 'if'],
  ifelse: ['jezeli', 'jeżeli', 'ifelse'],
  stop: ['stop'],
  home: ['dom', 'home'],
  cs: ['czysc', 'czyść', 'cs', 'clearscreen'],
  pitchup: ['gora', 'góra', 'pitchup'],
  pitchdown: ['dol', 'dół', 'pitchdown'],
  rollright: ['pp', 'przechylprawo', 'rr', 'rollright'],
  rollleft: ['pl', 'przechyllewo', 'rl', 'rollleft'],
};

export const COMMANDS = new Map<string, Cmd>();
for (const [cmd, names] of Object.entries(table)) {
  for (const n of names) COMMANDS.set(n.normalize('NFC'), cmd as Cmd);
}

export const DEF_WORDS = new Set(['oto', 'to']);
export const END_WORDS = new Set(['juz', 'już', 'end']);
export const REP_WORDS = new Set(['nrpowt', 'repcount']);

/** Commands that exist only in 3D. */
export const THREE_D_ONLY = new Set<Cmd>(['pitchup', 'pitchdown', 'rollright', 'rollleft']);

export function isReserved(name: string): boolean {
  return COMMANDS.has(name) || DEF_WORDS.has(name) || END_WORDS.has(name) || REP_WORDS.has(name);
}

/** Lower-case + NFC normalisation used for every name comparison. */
export function norm(s: string): string {
  return s.normalize('NFC').toLowerCase();
}
