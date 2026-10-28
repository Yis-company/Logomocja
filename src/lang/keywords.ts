// Słownik poleceń dialektu. Każdy alias (polski, bez ogonków, angielski)
// wskazuje na jedną kanoniczną nazwę polecenia.

export type Mode = '2d' | '3d';

export type Command =
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
  | 'rr'
  | 'rl';

export interface CommandInfo {
  command: Command;
  /** Pisownia polska (z ogonkami na pierwszym miejscu), potem bez ogonków. */
  polish: string[];
  english: string[];
  /** Polecenia przestrzenne – błąd w trybie 2D. */
  only3d?: boolean;
}

export const COMMANDS: CommandInfo[] = [
  { command: 'fd', polish: ['np', 'naprzód', 'naprzod'], english: ['fd', 'forward'] },
  { command: 'bk', polish: ['ws', 'wstecz'], english: ['bk', 'back'] },
  { command: 'rt', polish: ['pw', 'prawo'], english: ['rt', 'right'] },
  { command: 'lt', polish: ['lw', 'lewo'], english: ['lt', 'left'] },
  { command: 'pu', polish: ['pod', 'podnieś', 'podnies'], english: ['pu', 'penup'] },
  { command: 'pd', polish: ['opu', 'opuść', 'opusc'], english: ['pd', 'pendown'] },
  { command: 'color', polish: ['kolor'], english: ['color'] },
  { command: 'width', polish: ['grubość', 'grubosc'], english: ['width'] },
  { command: 'repeat', polish: ['powtórz', 'powtorz'], english: ['repeat'] },
  { command: 'let', polish: ['niech'], english: ['let'] },
  { command: 'if', polish: ['jeśli', 'jesli'], english: ['if'] },
  { command: 'ifelse', polish: ['jeżeli', 'jezeli'], english: ['ifelse'] },
  { command: 'stop', polish: ['stop'], english: ['stop'] },
  { command: 'home', polish: ['dom'], english: ['home'] },
  { command: 'cs', polish: ['czyść', 'czysc'], english: ['cs', 'clearscreen'] },
  { command: 'pitchup', polish: ['góra', 'gora'], english: ['pitchup'], only3d: true },
  { command: 'pitchdown', polish: ['dół', 'dol'], english: ['pitchdown'], only3d: true },
  { command: 'rr', polish: ['pp', 'przechylprawo'], english: ['rr', 'rollright'], only3d: true },
  { command: 'rl', polish: ['pl', 'przechyllewo'], english: ['rl', 'rollleft'], only3d: true },
];

/** Słowa definiujące procedury. */
export const DEF_OPEN = ['oto', 'to'];
export const DEF_CLOSE = ['już', 'juz', 'end'];
export const REPCOUNT = ['nrpowt', 'repcount'];

const norm = (s: string) => s.normalize('NFC').toLowerCase();

export const COMMAND_TABLE = new Map<string, CommandInfo>();
for (const info of COMMANDS) {
  for (const w of [...info.polish, ...info.english]) COMMAND_TABLE.set(norm(w), info);
}

export const RESERVED = new Set<string>([
  ...COMMAND_TABLE.keys(),
  ...DEF_OPEN.map(norm),
  ...DEF_CLOSE.map(norm),
  ...REPCOUNT.map(norm),
]);

export function isDefOpen(name: string): boolean {
  return DEF_OPEN.includes(name);
}
export function isDefClose(name: string): boolean {
  return DEF_CLOSE.includes(name);
}
export function isRepcount(name: string): boolean {
  return REPCOUNT.includes(name);
}
