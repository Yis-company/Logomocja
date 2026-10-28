import type { Token } from './lexer';

export type Mode = '2d' | '3d';

export type Expr =
  | { k: 'num'; v: number }
  | { k: 'var'; tok: Token }
  | { k: 'rep'; tok: Token }
  | { k: 'neg'; e: Expr }
  | { k: 'bin'; op: '+' | '-' | '*' | '/'; l: Expr; r: Expr };

/** An expression argument; `tok` is its first token, where argument errors are reported. */
export interface Arg {
  e: Expr;
  tok: Token;
}

export interface Cond {
  l: Expr;
  op: string;
  r: Expr;
  /** First token of the condition. */
  tok: Token;
}

export type Stmt =
  | { op: 'fd' | 'bk' | 'rt' | 'lt' | 'width' | 'pitchup' | 'pitchdown' | 'rollright' | 'rollleft'; tok: Token; args: Arg[] }
  | { op: 'pu' | 'pd' | 'home' | 'cs' | 'stop'; tok: Token }
  | { op: 'color'; tok: Token; value: string }
  | { op: 'repeat'; tok: Token; count: Arg; body: Stmt[] }
  | { op: 'let'; tok: Token; name: string; value: Arg }
  | { op: 'if'; tok: Token; cond: Cond; body: Stmt[] }
  | { op: 'ifelse'; tok: Token; cond: Cond; body: Stmt[]; elseBody: Stmt[] }
  | { op: 'call'; tok: Token; name: string; args: Arg[] };

export interface Proc {
  name: string;
  tok: Token;
  params: { key: string; tok: Token }[];
  body: Stmt[];
}

export interface Program {
  top: Stmt[];
  procs: Map<string, Proc>;
  mode: Mode;
}
