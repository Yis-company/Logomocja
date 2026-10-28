import type { Token } from './lexer';

export type Mode = '2d' | '3d';

/** Expression instructions (postfix / reverse Polish order). */
export const OP_NUM = 0;
export const OP_VAR = 1;
export const OP_REP = 2;
export const OP_NEG = 3;
export const OP_ADD = 4;
export const OP_SUB = 5;
export const OP_MUL = 6;
export const OP_DIV = 7;

export interface Instr {
  op: number;
  v?: number;
  key?: string;
  name?: string;
}

export interface Expr {
  /** First token of the expression: run-time errors are reported here. */
  first: Token;
  last: Token;
  code: Instr[];
  /** True when the expression refers to a name or to `nrpowt`. */
  names: boolean;
}

export type Comparison = '<' | '>' | '=' | '<=' | '>=' | '<>';

export interface Condition {
  left: Expr;
  op: Comparison;
  right: Expr;
}

export type Axis = 'yaw' | 'pitch' | 'roll';

interface Base {
  /** The command token (used for highlighting and for errors about the command). */
  tok: Token;
}

export interface MoveStmt extends Base { kind: 'move'; dir: 1 | -1; arg: Expr }
export interface TurnStmt extends Base { kind: 'turn'; axis: Axis; sign: 1 | -1; arg: Expr }
export interface PenStmt extends Base { kind: 'pen'; down: boolean }
export interface ColorStmt extends Base { kind: 'color'; color: string }
export interface WidthStmt extends Base { kind: 'width'; arg: Expr }
export interface RepeatStmt extends Base { kind: 'repeat'; count: Expr; body: Stmt[]; close: Token }
export interface LetStmt extends Base { kind: 'let'; key: string; name: string; arg: Expr }
export interface IfStmt extends Base {
  kind: 'if';
  cond: Condition;
  then: Stmt[];
  thenClose: Token;
  else: Stmt[] | null;
  elseClose: Token | null;
}
export interface StopStmt extends Base { kind: 'stop' }
export interface HomeStmt extends Base { kind: 'home' }
export interface ClearStmt extends Base { kind: 'clear' }
export interface CallStmt extends Base { kind: 'call'; key: string; args: Expr[] }

export type Stmt =
  | MoveStmt | TurnStmt | PenStmt | ColorStmt | WidthStmt | RepeatStmt
  | LetStmt | IfStmt | StopStmt | HomeStmt | ClearStmt | CallStmt;

export interface Procedure {
  name: string;
  key: string;
  params: string[];
  paramNames: string[];
  body: Stmt[];
  nameTok: Token;
  endTok: Token;
}

export interface Program {
  mode: Mode;
  body: Stmt[];
  procs: Map<string, Procedure>;
}
