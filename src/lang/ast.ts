import type { CommandId } from './keywords';
import type { Token } from './lexer';

export type Mode = '2d' | '3d';

/** Wyrażenie skompilowane do postaci odwrotnej notacji polskiej (bez rekurencji przy obliczaniu). */
export type ExprOp =
  | { o: 'num'; v: number }
  | { o: 'var'; name: string }
  | { o: 'rep' }
  | { o: 'neg' }
  | { o: 'add' }
  | { o: 'sub' }
  | { o: 'mul' }
  | { o: 'div' };

export interface Expr {
  ops: ExprOp[];
  /** Pierwszy symbol wyrażenia — tu zgłaszane są błędy wartości. */
  tok: Token;
  /** Wartość, jeśli wyrażenie nie zależy od nazw i da się je policzyć w czasie analizy. */
  const?: number;
}

export type CompareOp = '<' | '>' | '=' | '<=' | '>=' | '<>';

export interface Cond {
  left: Expr;
  op: CompareOp;
  right: Expr;
}

export type Stmt =
  | { t: 'cmd'; id: Exclude<CommandId, 'repeat' | 'let' | 'if' | 'ifelse' | 'color'>; arg?: Expr; tok: Token }
  | { t: 'color'; hex: string; tok: Token }
  | { t: 'repeat'; count: Expr; body: Stmt[]; tok: Token }
  | { t: 'let'; name: string; expr: Expr; tok: Token }
  | { t: 'if'; cond: Cond; then: Stmt[]; else?: Stmt[]; tok: Token }
  | { t: 'call'; proc: Proc; args: Expr[]; tok: Token };

export interface Proc {
  /** Znormalizowana nazwa. */
  name: string;
  /** Nazwa tak, jak zapisano w definicji. */
  label: string;
  params: string[];
  body: Stmt[];
  /** Symbol z nazwą w nagłówku. */
  nameTok: Token;
  /** Nazwy zadeklarowane w procedurze: parametry i zmienne z `niech`. */
  declared: Set<string>;
}

export interface Program {
  mode: Mode;
  body: Stmt[];
  procs: Map<string, Proc>;
  /** Zmienne globalne zadeklarowane `niech` na najwyższym poziomie. */
  globals: Set<string>;
}
