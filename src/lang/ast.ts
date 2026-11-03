import type { Token } from './lexer';

export type Mode = '2d' | '3d';

export type Expr =
  | { k: 'num'; v: number; tok: Token }
  | { k: 'var'; name: string; tok: Token }
  | { k: 'rep'; tok: Token }
  | { k: 'neg'; e: Expr; tok: Token }
  | { k: 'bin'; op: '+' | '-' | '*' | '/'; a: Expr; b: Expr; tok: Token };

/** An argument: an expression plus the token every argument error points at. */
export interface Arg {
  e: Expr;
  first: Token;
  /** true when the expression mentions no names and no nrpowt */
  constant: boolean;
}

export type CmpOp = '<' | '>' | '=' | '<=' | '>=' | '<>';

export interface Cond {
  a: Arg;
  op: CmpOp;
  b: Arg;
  first: Token;
}

export type Stmt =
  | { k: 'move'; sign: 1 | -1; arg: Arg; tok: Token }
  | { k: 'turn'; axis: 'yaw' | 'pitch' | 'roll'; sign: 1 | -1; arg: Arg; tok: Token }
  | { k: 'pen'; down: boolean; tok: Token }
  | { k: 'color'; color: string; tok: Token }
  | { k: 'width'; arg: Arg; tok: Token }
  | { k: 'repeat'; count: Arg; body: Stmt[]; tok: Token; close: Token }
  | { k: 'let'; name: string; arg: Arg; tok: Token }
  | { k: 'if'; cond: Cond; body: Stmt[]; tok: Token }
  | { k: 'ifelse'; cond: Cond; body: Stmt[]; elseBody: Stmt[]; tok: Token }
  | { k: 'stop'; tok: Token }
  | { k: 'home'; tok: Token }
  | { k: 'clear'; tok: Token }
  | { k: 'call'; name: string; args: Arg[]; tok: Token };

export interface Proc {
  name: string;
  display: string;
  params: string[];
  body: Stmt[];
  tok: Token;
}

export interface Program {
  mode: Mode;
  body: Stmt[];
  procs: Map<string, Proc>;
  /** what the program uses, for challenge requirements and the key */
  uses: Set<'repeat' | 'procedure' | 'variable' | 'if' | 'nrpowt' | 'recursion'>;
}
