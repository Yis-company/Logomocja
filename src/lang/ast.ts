import { type Position } from './errors';
import { type CommandId } from './commands';
import { type Mode } from './limits';

export type Expr =
  | { k: 'num'; v: number }
  | { k: 'var'; name: string }
  | { k: 'nrpowt' }
  | { k: 'neg'; e: Expr }
  | { k: 'bin'; op: '+' | '-' | '*' | '/'; l: Expr; r: Expr };

/** One argument of a command, call or condition, with the position of its first token. */
export interface Arg {
  pos: Position;
  expr: Expr;
  /** The value when the expression has no names and no nrpowt; used for parse-time checks. */
  literal: number | null;
}

export type Comparison = '<' | '>' | '=' | '<=' | '>=' | '<>';

export interface Condition {
  left: Arg;
  op: Comparison;
  right: Arg;
}

export type Stmt =
  | { k: 'cmd'; op: CommandId; args: Arg[]; pos: Position; length: number }
  | { k: 'color'; value: string; pos: Position; length: number }
  | { k: 'let'; name: string; value: Arg; pos: Position; length: number }
  | { k: 'repeat'; count: Arg; body: Stmt[]; pos: Position; length: number }
  | { k: 'if'; cond: Condition; body: Stmt[]; elseBody: Stmt[] | null; pos: Position; length: number }
  | { k: 'call'; name: string; args: Arg[]; pos: Position; length: number };

export interface ProcDef {
  name: string;
  params: string[];
  /** Names that a procedure body may read: its parameters and every name it assigns with niech. */
  locals: ReadonlySet<string>;
  body: Stmt[];
  pos: Position;
}

export interface Program {
  mode: Mode;
  body: Stmt[];
  procs: ReadonlyMap<string, ProcDef>;
  /** Names assigned with niech at top level. */
  globals: ReadonlySet<string>;
}
