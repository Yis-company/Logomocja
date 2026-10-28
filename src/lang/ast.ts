import type { Token } from './lexer';
import type { Command } from './keywords';

export class LogoError extends Error {
  line: number;
  column: number;
  constructor(message: string, line: number, column: number) {
    super(message);
    this.name = 'LogoError';
    this.line = line;
    this.column = column;
  }
}

export type Expr =
  | { k: 'num'; v: number; tok: Token }
  | { k: 'var'; name: string; tok: Token }
  | { k: 'rep'; tok: Token }
  | { k: 'neg'; e: Expr; tok: Token }
  /** Nawias albo jednoargumentowy plus – `tok` to pierwszy token wyrażenia. */
  | { k: 'paren'; e: Expr; tok: Token }
  /** a ± b ± c … – lewostronnie łączny łańcuch o jednakowym priorytecie. */
  | { k: 'sum'; first: Expr; rest: { op: '+' | '-'; e: Expr }[]; tok: Token }
  | { k: 'prod'; first: Expr; rest: { op: '*' | '/'; e: Expr }[]; tok: Token };

export type CmpOp = '<' | '>' | '=' | '<=' | '>=' | '<>';

export interface Condition {
  left: Expr;
  op: CmpOp;
  right: Expr;
}

export type Stmt =
  | { t: 'cmd'; op: Command; arg?: Expr; color?: string; tok: Token }
  | { t: 'repeat'; count: Expr; body: Stmt[]; tok: Token }
  | { t: 'let'; name: string; value: Expr; tok: Token; global: boolean }
  | { t: 'if'; cond: Condition; then: Stmt[]; else?: Stmt[]; tok: Token }
  | { t: 'call'; proc: string; args: Expr[]; tok: Token };

export interface ProcDef {
  name: string;
  params: string[];
  body: Stmt[];
  tok: Token;
  nameTok: Token;
}

export interface Program {
  procs: Map<string, ProcDef>;
  body: Stmt[];
}
