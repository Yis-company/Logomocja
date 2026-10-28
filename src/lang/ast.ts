import type { Token } from './lexer';
import type { CommandKind, Mode } from './spec';

/**
 * `tok` on an expression is the first token of the whole argument. Runtime
 * errors about an argument are reported there, so only the root node's `tok`
 * is ever read.
 */
export type Expr =
  | { kind: 'num'; value: number; tok: Token }
  | { kind: 'var'; name: string; tok: Token }
  | { kind: 'nrpowt'; tok: Token }
  | { kind: 'neg'; operand: Expr; tok: Token }
  | { kind: 'bin'; op: '+' | '-' | '*' | '/'; left: Expr; right: Expr; tok: Token };

export type ComparisonOp = '=' | '<' | '>' | '<=' | '>=' | '<>';

export interface Condition {
  left: Expr;
  op: ComparisonOp;
  right: Expr;
  tok: Token;
}

export interface ProcDef {
  name: string;
  nameTok: Token;
  params: string[];
  /** Names assigned with niech somewhere in this procedure's body. */
  declared: Set<string>;
  body: Stmt[];
}

export type Stmt =
  | { kind: 'cmd'; cmd: CommandKind; tok: Token; arg?: Expr; color?: string }
  | { kind: 'repeat'; tok: Token; count: Expr; body: Stmt[] }
  | { kind: 'let'; tok: Token; name: string; value: Expr }
  | { kind: 'if'; tok: Token; cond: Condition; body: Stmt[] }
  | { kind: 'ifelse'; tok: Token; cond: Condition; then: Stmt[]; otherwise: Stmt[] }
  | { kind: 'call'; tok: Token; proc: ProcDef; args: Expr[] };

export interface Program {
  mode: Mode;
  procs: Map<string, ProcDef>;
  body: Stmt[];
}
