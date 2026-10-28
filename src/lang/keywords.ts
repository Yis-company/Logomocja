/** Słownik poleceń dialektu Logo: nazwy polskie i angielskie, wszystkie aliasy. */

export type CommandId =
  | 'forward' | 'back' | 'right' | 'left'
  | 'penup' | 'pendown' | 'color' | 'width'
  | 'repeat' | 'let' | 'if' | 'ifelse' | 'stop'
  | 'home' | 'clear'
  | 'pitchup' | 'pitchdown' | 'rollright' | 'rollleft';

export type KeywordInfo =
  | { kind: 'cmd'; id: CommandId }
  | { kind: 'def' }
  | { kind: 'end' }
  | { kind: 'repcount' };

export type CommandGroup = 'move' | 'turn' | 'pen' | 'style' | 'flow' | 'var' | 'turn3d';

export interface CommandSpec {
  id: CommandId;
  /** Nazwy polskie (pierwsza jest główną). */
  pl: string[];
  /** Nazwy angielskie. */
  en: string[];
  group: CommandGroup;
  /** Polecenie dostępne tylko w trybie 3D. */
  only3d?: boolean;
}

export const COMMANDS: CommandSpec[] = [
  { id: 'forward', pl: ['np', 'naprzod', 'naprzód'], en: ['fd', 'forward'], group: 'move' },
  { id: 'back', pl: ['ws', 'wstecz'], en: ['bk', 'back'], group: 'move' },
  { id: 'right', pl: ['pw', 'prawo'], en: ['rt', 'right'], group: 'turn' },
  { id: 'left', pl: ['lw', 'lewo'], en: ['lt', 'left'], group: 'turn' },
  { id: 'penup', pl: ['pod', 'podnies', 'podnieś'], en: ['pu', 'penup'], group: 'pen' },
  { id: 'pendown', pl: ['opu', 'opusc', 'opuść'], en: ['pd', 'pendown'], group: 'pen' },
  { id: 'color', pl: ['kolor'], en: ['color'], group: 'style' },
  { id: 'width', pl: ['grubosc', 'grubość'], en: ['width'], group: 'style' },
  { id: 'repeat', pl: ['powtorz', 'powtórz'], en: ['repeat'], group: 'flow' },
  { id: 'let', pl: ['niech'], en: ['let'], group: 'var' },
  { id: 'if', pl: ['jeśli', 'jesli'], en: ['if'], group: 'flow' },
  { id: 'ifelse', pl: ['jeżeli', 'jezeli'], en: ['ifelse'], group: 'flow' },
  { id: 'stop', pl: ['stop'], en: ['stop'], group: 'flow' },
  { id: 'home', pl: ['dom'], en: ['home'], group: 'move' },
  { id: 'clear', pl: ['czyść', 'czysc'], en: ['cs', 'clearscreen'], group: 'pen' },
  { id: 'pitchup', pl: ['gora', 'góra'], en: ['pitchup'], group: 'turn3d', only3d: true },
  { id: 'pitchdown', pl: ['dol', 'dół'], en: ['pitchdown'], group: 'turn3d', only3d: true },
  { id: 'rollright', pl: ['pp', 'przechylprawo'], en: ['rr', 'rollright'], group: 'turn3d', only3d: true },
  { id: 'rollleft', pl: ['pl', 'przechyllewo'], en: ['rl', 'rollleft'], group: 'turn3d', only3d: true },
];

export const DEF_WORDS = ['oto', 'to'];
export const END_WORDS = ['już', 'juz', 'end'];
export const REPCOUNT_WORDS = ['nrpowt', 'repcount'];

/** Ignoruje wielkość liter; nie składa polskich znaków diakrytycznych. */
export function normalizeName(s: string): string {
  return s.normalize('NFC').toLowerCase();
}

export const KEYWORDS: Map<string, KeywordInfo> = (() => {
  const m = new Map<string, KeywordInfo>();
  for (const c of COMMANDS) for (const n of [...c.pl, ...c.en]) m.set(normalizeName(n), { kind: 'cmd', id: c.id });
  for (const n of DEF_WORDS) m.set(n, { kind: 'def' });
  for (const n of END_WORDS) m.set(normalizeName(n), { kind: 'end' });
  for (const n of REPCOUNT_WORDS) m.set(n, { kind: 'repcount' });
  return m;
})();

export const COMMAND_BY_ID: Map<CommandId, CommandSpec> = new Map(COMMANDS.map((c) => [c.id, c]));

export function keywordInfo(name: string): KeywordInfo | undefined {
  return KEYWORDS.get(name);
}

export function isKeyword(name: string): boolean {
  return KEYWORDS.has(name);
}
