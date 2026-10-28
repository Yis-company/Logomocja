import { type Condition, type Expr, LogoError, type ProcDef, type Program, type Stmt } from './ast';
import { EvalError, type EvalContext, evaluate } from './expr';
import type { Mode } from './keywords';
import type { Token } from './lexer';
import { MAX_REPEAT, MAX_WIDTH } from './parser';

export const MAX_OPS = 10_000;
export const MAX_FRAMES = 32;
export const MAX_SEGMENTS = 10_000;
export const MAX_COORD = 100_000;

export type Vec3 = [number, number, number];

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export interface TurtleState {
  pos: Vec3;
  /** Kierunek ruchu (nos żółwia). */
  fwd: Vec3;
  /** Prawa strona żółwia. */
  right: Vec3;
  /** Góra żółwia. */
  up: Vec3;
  penDown: boolean;
  color: string;
  width: number;
}

/** Opis właśnie wykonanej operacji – do podświetlania wiersza. */
export interface Step {
  line: number;
  col: number;
}

export const DEFAULT_COLOR = '#16866a';
export const DEFAULT_WIDTH = 3;

export function initialTurtle(): TurtleState {
  return {
    pos: [0, 0, 0],
    fwd: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    penDown: true,
    color: DEFAULT_COLOR,
    width: DEFAULT_WIDTH,
  };
}

/** [sin, cos] kąta w stopniach – dokładne dla wielokrotności 90°. */
function sinCos(deg: number): [number, number] {
  const d = deg % 360; // zachowuje znak; chroni przed przepełnieniem przy ogromnych kątach
  const a = (d + 360) % 360;
  if (a === 0) return [0, 1];
  if (a === 90) return [1, 0];
  if (a === 180) return [0, -1];
  if (a === 270) return [-1, 0];
  const r = (d * Math.PI) / 180;
  return [Math.sin(r), Math.cos(r)];
}

/** Obrót pary wektorów: a' = a·cos + b·sin, b' = b·cos − a·sin. */
function rotatePair(a: Vec3, b: Vec3, deg: number): void {
  const [s, c] = sinCos(deg);
  for (let i = 0; i < 3; i++) {
    const ai = a[i];
    const bi = b[i];
    a[i] = ai * c + bi * s + 0;
    b[i] = bi * c - ai * s + 0;
  }
}

interface Scope {
  /** Zmienne lokalne wywołania procedury; null na najwyższym poziomie. */
  locals: Map<string, number> | null;
}

type Run = Generator<Step, boolean, undefined>;

function at(tok: Token, message: string): LogoError {
  return new LogoError(message, tok.line, tok.col);
}

export class Machine {
  turtle: TurtleState = initialTurtle();
  segments: Segment[] = [];
  ops = 0;
  private frames = 0;
  private globals = new Map<string, number>();
  private scope: Scope = { locals: null };
  private evalCtx: EvalContext;

  constructor(
    private program: Program,
    readonly mode: Mode,
  ) {
    this.evalCtx = {
      rep: 1,
      getVar: (name) => {
        const loc = this.scope.locals;
        if (loc && loc.has(name)) return loc.get(name)!;
        const g = this.globals.get(name);
        if (g !== undefined) return g;
        throw new EvalError(`Zmienna „${name}” nie ma jeszcze wartości`);
      },
    };
  }

  /** Wykonuje program; po każdej operacji zwraca jej położenie w kodzie. */
  *execute(): Generator<Step, void, undefined> {
    yield* this.block(this.program.body, 0);
  }

  // ───────────────────────── pomocnicze ─────────────────────────

  private tick(tok: Token): void {
    if (++this.ops > MAX_OPS) {
      throw at(tok, `Przekroczono limit ${MAX_OPS} wykonanych operacji`);
    }
  }

  private num(e: Expr, rep: number): number {
    this.evalCtx.rep = rep;
    try {
      return evaluate(e, this.evalCtx);
    } catch (err) {
      if (err instanceof EvalError) throw at(e.tok, err.message);
      throw err;
    }
  }

  private cond(c: Condition, rep: number): boolean {
    const l = this.num(c.left, rep);
    const r = this.num(c.right, rep);
    switch (c.op) {
      case '<':
        return l < r;
      case '>':
        return l > r;
      case '=':
        return l === r;
      case '<=':
        return l <= r;
      case '>=':
        return l >= r;
      case '<>':
        return l !== r;
    }
  }

  private enterFrame(tok: Token): void {
    if (this.frames >= MAX_FRAMES) {
      throw at(
        tok,
        `Przekroczono limit ${MAX_FRAMES} jednocześnie aktywnych wywołań i powtórzeń (zbyt głęboka rekurencja?)`,
      );
    }
    this.frames++;
  }

  // ───────────────────────── wykonanie ─────────────────────────

  private *block(stmts: Stmt[], rep: number): Run {
    for (const s of stmts) {
      if (yield* this.stmt(s, rep)) return true;
    }
    return false;
  }

  private *stmt(s: Stmt, rep: number): Run {
    const tok = s.tok;
    switch (s.t) {
      case 'cmd': {
        this.tick(tok);
        const stop = this.command(s, rep);
        yield { line: tok.line, col: tok.col };
        return stop;
      }
      case 'let': {
        this.tick(tok);
        const v = this.num(s.value, rep);
        const loc = this.scope.locals;
        if (loc) loc.set(s.name, v);
        else this.globals.set(s.name, v);
        yield { line: tok.line, col: tok.col };
        return false;
      }
      case 'repeat': {
        this.tick(tok);
        const n = this.num(s.count, rep);
        if (!Number.isInteger(n) || n < 0 || n > MAX_REPEAT) {
          throw at(s.count.tok, `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${MAX_REPEAT}`);
        }
        this.enterFrame(tok);
        yield { line: tok.line, col: tok.col };
        for (let i = 1; i <= n; i++) {
          if (yield* this.block(s.body, i)) {
            this.frames--;
            return true;
          }
          this.tick(tok);
        }
        this.frames--;
        return false;
      }
      case 'if': {
        this.tick(tok);
        const holds = this.cond(s.cond, rep);
        yield { line: tok.line, col: tok.col };
        const body = holds ? s.then : s.else;
        if (body) {
          if (yield* this.block(body, rep)) return true;
          this.tick(tok);
        }
        return false;
      }
      case 'call': {
        this.tick(tok);
        const def = this.program.procs.get(s.proc) as ProcDef;
        const locals = new Map<string, number>();
        for (let i = 0; i < def.params.length; i++) {
          locals.set(def.params[i], this.num(s.args[i], rep));
        }
        this.enterFrame(tok);
        yield { line: tok.line, col: tok.col };
        const saved = this.scope;
        this.scope = { locals };
        try {
          yield* this.block(def.body, 0); // `stop` kończy tylko to wywołanie
        } finally {
          this.scope = saved;
        }
        this.frames--;
        this.tick(tok);
        return false;
      }
    }
  }

  /** Wykonuje polecenie; zwraca true dla `stop`. */
  private command(s: Extract<Stmt, { t: 'cmd' }>, rep: number): boolean {
    const t = this.turtle;
    switch (s.op) {
      case 'fd':
        this.move(this.num(s.arg!, rep), s.tok);
        break;
      case 'bk':
        this.move(-this.num(s.arg!, rep), s.tok);
        break;
      case 'rt':
        rotatePair(t.fwd, t.right, this.num(s.arg!, rep));
        break;
      case 'lt':
        rotatePair(t.fwd, t.right, -this.num(s.arg!, rep));
        break;
      case 'pitchup':
        rotatePair(t.fwd, t.up, this.num(s.arg!, rep));
        break;
      case 'pitchdown':
        rotatePair(t.fwd, t.up, -this.num(s.arg!, rep));
        break;
      case 'rr':
        rotatePair(t.up, t.right, this.num(s.arg!, rep));
        break;
      case 'rl':
        rotatePair(t.up, t.right, -this.num(s.arg!, rep));
        break;
      case 'pu':
        t.penDown = false;
        break;
      case 'pd':
        t.penDown = true;
        break;
      case 'color':
        t.color = s.color!;
        break;
      case 'width': {
        const w = this.num(s.arg!, rep);
        if (!Number.isInteger(w) || w < 1 || w > MAX_WIDTH) {
          throw at(s.arg!.tok, `Grubość musi być liczbą całkowitą od 1 do ${MAX_WIDTH}`);
        }
        t.width = w;
        break;
      }
      case 'stop':
        return true;
      case 'home':
        this.goTo([0, 0, 0], s.tok);
        t.fwd = [0, 1, 0];
        t.right = [1, 0, 0];
        t.up = [0, 0, 1];
        break;
      case 'cs':
        this.segments.length = 0;
        break;
    }
    return false;
  }

  private move(distance: number, tok: Token): void {
    const t = this.turtle;
    const to: Vec3 = [
      t.pos[0] + t.fwd[0] * distance + 0,
      t.pos[1] + t.fwd[1] * distance + 0,
      t.pos[2] + t.fwd[2] * distance + 0,
    ];
    this.goTo(to, tok);
  }

  private goTo(to: Vec3, tok: Token): void {
    const t = this.turtle;
    for (let i = 0; i < 3; i++) {
      if (!Number.isFinite(to[i]) || Math.abs(to[i]) > MAX_COORD) {
        throw at(tok, `Współrzędna wykracza poza dozwolony zakres ±${MAX_COORD}`);
      }
    }
    const from = t.pos;
    if (t.penDown && (from[0] !== to[0] || from[1] !== to[1] || from[2] !== to[2])) {
      if (this.segments.length >= MAX_SEGMENTS) {
        throw at(tok, `Przekroczono limit ${MAX_SEGMENTS} odcinków rysunku`);
      }
      this.segments.push({
        from: [from[0], from[1], from[2]],
        to: [to[0], to[1], to[2]],
        color: t.color,
        width: t.width,
      });
    }
    t.pos = to;
  }
}
