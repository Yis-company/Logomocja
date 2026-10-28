import { type Mode } from './limits';

export type CommandId =
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

export type ArgKind = 'none' | 'expr' | 'colour' | 'expr-repeat' | 'name-expr' | 'condition' | 'condition-ifelse';

export interface CommandDef {
  id: CommandId;
  /** Every spelling accepted in source, lower-cased. The first one is the canonical Polish name. */
  names: readonly string[];
  args: ArgKind;
  /** Only available in 3D. */
  only3d?: boolean;
}

export const COMMANDS: readonly CommandDef[] = [
  { id: 'fd', names: ['np', 'naprzod', 'naprzód', 'fd', 'forward'], args: 'expr' },
  { id: 'bk', names: ['ws', 'wstecz', 'bk', 'back'], args: 'expr' },
  { id: 'rt', names: ['pw', 'prawo', 'rt', 'right'], args: 'expr' },
  { id: 'lt', names: ['lw', 'lewo', 'lt', 'left'], args: 'expr' },
  { id: 'pu', names: ['pod', 'podnies', 'podnieś', 'pu', 'penup'], args: 'none' },
  { id: 'pd', names: ['opu', 'opusc', 'opuść', 'pd', 'pendown'], args: 'none' },
  { id: 'color', names: ['kolor', 'color'], args: 'colour' },
  { id: 'width', names: ['grubosc', 'grubość', 'width'], args: 'expr' },
  { id: 'repeat', names: ['powtorz', 'powtórz', 'repeat'], args: 'expr-repeat' },
  { id: 'let', names: ['niech', 'let'], args: 'name-expr' },
  { id: 'if', names: ['jeśli', 'jesli', 'if'], args: 'condition' },
  { id: 'ifelse', names: ['jeżeli', 'jezeli', 'ifelse'], args: 'condition-ifelse' },
  { id: 'stop', names: ['stop'], args: 'none' },
  { id: 'home', names: ['dom', 'home'], args: 'none' },
  { id: 'cs', names: ['czyść', 'czysc', 'cs', 'clearscreen'], args: 'none' },
  { id: 'pitchup', names: ['gora', 'góra', 'pitchup'], args: 'expr', only3d: true },
  { id: 'pitchdown', names: ['dol', 'dół', 'pitchdown'], args: 'expr', only3d: true },
  { id: 'rollright', names: ['pp', 'przechylprawo', 'rr', 'rollright'], args: 'expr', only3d: true },
  { id: 'rollleft', names: ['pl', 'przechyllewo', 'rl', 'rollleft'], args: 'expr', only3d: true },
];

const BY_NAME = new Map<string, CommandDef>();
for (const def of COMMANDS) {
  for (const name of def.names) BY_NAME.set(name, def);
}

/** Words that open or close a procedure definition. */
export const DEFINITION_WORDS: readonly string[] = ['oto', 'to'];
export const END_WORDS: readonly string[] = ['już', 'juz', 'end'];
const PARAM_WORD = 'ma';
export const REPEAT_VALUE_WORDS: readonly string[] = ['nrpowt', 'repcount'];

export function findCommand(lowerName: string): CommandDef | undefined {
  return BY_NAME.get(lowerName);
}

/** Words that can never be names of procedures, parameters or variables. */
export function isReservedWord(lowerName: string): boolean {
  return (
    BY_NAME.has(lowerName) ||
    DEFINITION_WORDS.includes(lowerName) ||
    END_WORDS.includes(lowerName) ||
    lowerName === PARAM_WORD ||
    REPEAT_VALUE_WORDS.includes(lowerName)
  );
}

export function commandAvailable(def: CommandDef, mode: Mode): boolean {
  return !def.only3d || mode === '3d';
}
