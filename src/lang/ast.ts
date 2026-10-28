import type { Token } from './lexer';

export type BinaryOp = '+' | '-' | '*' | '/';
export type CompareOp = '<' | '>' | '=' | '<=' | '>=' | '<>';

export type Expr =
  | { k: 'num'; value: number; tok: Token }
  | { k: 'var'; name: string; tok: Token }
  | { k: 'rep'; tok: Token }
  | { k: 'neg'; e: Expr; tok: Token }
  | { k: 'bin'; op: BinaryOp; a: Expr; b: Expr; tok: Token };

/** Argument polecenia: wyrażenie i jego pierwszy token (do zgłaszania błędów). */
export interface Arg {
  expr: Expr;
  first: Token;
  /** Wyrażenie bez nazw i bez nrpowt — można je policzyć przed uruchomieniem. */
  literal: boolean;
}

export interface Condition {
  a: Expr;
  op: CompareOp;
  b: Expr;
  first: Token;
}

export type TurnAxis = 'yaw' | 'pitch' | 'roll';

export type Stmt =
  | { k: 'move'; sign: 1 | -1; arg: Arg; tok: Token }
  | { k: 'turn'; axis: TurnAxis; sign: 1 | -1; arg: Arg; tok: Token }
  | { k: 'pen'; down: boolean; tok: Token }
  | { k: 'color'; value: string; tok: Token }
  | { k: 'width'; arg: Arg; tok: Token }
  | { k: 'repeat'; count: Arg; body: Stmt[]; tok: Token; close: Token }
  | { k: 'let'; name: string; arg: Arg; tok: Token }
  | { k: 'if'; cond: Condition; then: Stmt[]; else: Stmt[] | null; tok: Token }
  | { k: 'stop'; tok: Token }
  | { k: 'home'; tok: Token }
  | { k: 'clear'; tok: Token }
  | { k: 'call'; name: string; args: Arg[]; tok: Token };

export interface ProcDef {
  name: string;
  display: string;
  params: string[];
  body: Stmt[];
  tok: Token;
}

export interface Program {
  body: Stmt[];
  procs: Map<string, ProcDef>;
  mode: Mode;
}

export type Mode = '2d' | '3d';
