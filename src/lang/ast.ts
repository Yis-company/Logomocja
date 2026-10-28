import type { Token } from './lexer';

export type Mode = '2d' | '3d';

export type Expr =
  | { k: 'num'; value: number }
  | { k: 'var'; name: string; tok: Token }
  | { k: 'repcount' }
  | { k: 'neg'; e: Expr }
  | { k: 'bin'; op: '+' | '-' | '*' | '/'; a: Expr; b: Expr };

/** Argument polecenia: wyrażenie wraz z jego pierwszym tokenem (miejsce błędów). */
export interface Arg {
  expr: Expr;
  first: Token;
  /** Czy wyrażenie nie zawiera nazw ani nrpowt (wartość znana przed uruchomieniem). */
  literal: boolean;
}

export type Comparison = '<' | '>' | '=' | '<=' | '>=' | '<>';

export interface Condition {
  a: Arg;
  op: Comparison;
  b: Arg;
  first: Token;
}

export type Stmt =
  | { k: 'move'; tok: Token; sign: 1 | -1; arg: Arg }
  | { k: 'turn'; tok: Token; sign: 1 | -1; arg: Arg }
  | { k: 'pitch'; tok: Token; sign: 1 | -1; arg: Arg }
  | { k: 'roll'; tok: Token; sign: 1 | -1; arg: Arg }
  | { k: 'pen'; tok: Token; down: boolean }
  | { k: 'color'; tok: Token; color: string }
  | { k: 'width'; tok: Token; arg: Arg }
  | { k: 'repeat'; tok: Token; count: Arg; body: Stmt[] }
  | { k: 'let'; tok: Token; name: string; arg: Arg }
  | { k: 'if'; tok: Token; cond: Condition; then: Stmt[] }
  | { k: 'ifelse'; tok: Token; cond: Condition; then: Stmt[]; else: Stmt[] }
  | { k: 'stop'; tok: Token }
  | { k: 'home'; tok: Token }
  | { k: 'clear'; tok: Token }
  | { k: 'call'; tok: Token; proc: Procedure; args: Arg[] };

export interface Procedure {
  name: string;
  /** Nazwa tak, jak zapisano ją w definicji. */
  display: string;
  params: string[];
  /** Nazwy przypisywane przez niech w ciele procedury. */
  locals: Set<string>;
  tok: Token;
  body: Stmt[];
}

export interface Program {
  mode: Mode;
  main: Stmt[];
  procedures: Map<string, Procedure>;
  globals: Set<string>;
}
