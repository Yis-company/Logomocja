import type { Pos } from './errors';

/** A numeric argument: a literal or a reference to a procedure parameter. */
export type NumArg =
  | { kind: 'num'; value: number; pos: Pos }
  | { kind: 'param'; name: string; index: number; pos: Pos };

export type Stmt =
  | { kind: 'move'; sign: 1 | -1; arg: NumArg; pos: Pos; word: string }
  | { kind: 'yaw'; sign: 1 | -1; arg: NumArg; pos: Pos; word: string }
  | { kind: 'pitch'; sign: 1 | -1; arg: NumArg; pos: Pos; word: string }
  | { kind: 'pen'; down: boolean; pos: Pos; word: string }
  | { kind: 'color'; value: string; pos: Pos; word: string }
  | { kind: 'width'; arg: NumArg; pos: Pos; word: string }
  | { kind: 'repeat'; count: NumArg; body: Stmt[]; pos: Pos; word: string }
  | { kind: 'call'; name: string; args: NumArg[]; pos: Pos; word: string };

export interface ProcDef {
  name: string;
  /** Display name as first written in the source. */
  displayName: string;
  params: string[];
  body: Stmt[];
  pos: Pos;
}

export interface Program {
  main: Stmt[];
  procs: Map<string, ProcDef>;
  mode: Mode;
}

export type Mode = '2d' | '3d';

export interface Segment {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  width: number;
}
