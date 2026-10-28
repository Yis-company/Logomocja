import { type Arg, type Comparison, type Expr, type ProcDef, type Program, type Stmt } from './ast';
import { type LogoError, LogoFailure, type Position } from './errors';
import { LIMITS } from './limits';
import { initialTurtle, resetOrientation, rotate, type Rotation, type Turtle, type Vec3 } from './turtle';

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

/** The statement the interpreter is about to execute, for the editor highlight. */
export interface Highlight {
  line: number;
  column: number;
  length: number;
}

interface Frame {
  proc: ProcDef;
  vars: Map<string, number>;
}

type Flow = 'next' | 'stop';

const ROTATIONS: Partial<Record<string, Rotation>> = {
  rt: 'right',
  lt: 'left',
  pitchup: 'pitchUp',
  pitchdown: 'pitchDown',
  rollright: 'rollRight',
  rollleft: 'rollLeft',
};

function fail(message: string, at: Position): LogoFailure {
  return new LogoFailure(message, at);
}

function compare(l: number, op: Comparison, r: number): boolean {
  switch (op) {
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

/**
 * Executes a checked program one statement at a time.
 *
 * `current` is the statement about to run; `step()` runs it and moves on to the next one.
 * Drawing state (`segments`, `turtle`) is updated in place so a view can read it between steps.
 */
export class Interpreter {
  readonly segments: Segment[] = [];
  readonly turtle: Turtle = initialTurtle();
  /** Set when a run-time error stopped the program. Parse-time errors never reach here. */
  error: LogoError | null = null;
  finished = false;
  /** Executed operations so far, counted as the specification describes. */
  operations = 0;
  /** Changes whenever the drawing gains a segment or is cleared, so views know when to rebuild. */
  version = 0;

  private current: Stmt | null = null;
  private readonly globals = new Map<string, number>();
  private readonly repeats: { i: number }[] = [];
  private frames = 0;
  private readonly gen: Generator<Stmt, void, void>;

  constructor(private readonly program: Program) {
    this.gen = this.runProgram();
    this.advance();
  }

  /** Where the next statement is, or null when the program has finished. */
  get highlight(): Highlight | null {
    if (!this.current) return null;
    return { line: this.current.pos.line, column: this.current.pos.column, length: this.current.length };
  }

  /** Runs the statement that is about to execute and prepares the following one. Returns false when already finished. */
  step(): boolean {
    if (this.finished) return false;
    this.advance();
    return true;
  }

  runToEnd(): void {
    while (!this.finished) this.advance();
  }

  private advance(): void {
    try {
      const r = this.gen.next();
      if (r.done) this.finish();
      else this.current = r.value;
    } catch (e) {
      if (!(e instanceof LogoFailure)) throw e;
      this.error = e.toError();
      this.finish();
    }
  }

  private finish(): void {
    this.finished = true;
    this.current = null;
  }

  // ---- execution ----

  private *runProgram(): Generator<Stmt, void, void> {
    yield* this.block(this.program.body, null);
  }

  /** Yields each statement before running it, so the caller can highlight it. */
  private *block(stmts: readonly Stmt[], frame: Frame | null): Generator<Stmt, Flow, void> {
    for (const s of stmts) {
      yield s;
      if ((yield* this.exec(s, frame)) === 'stop') return 'stop';
    }
    return 'next';
  }

  private tick(at: Stmt): void {
    this.operations++;
    if (this.operations > LIMITS.operations) {
      throw fail(`Przekroczono limit operacji (${LIMITS.operations}).`, at.pos);
    }
  }

  private enterFrame(at: Position): void {
    if (this.frames + 1 > LIMITS.frames) {
      throw fail(`Przekroczono limit zagnieżdżonych wywołań i powtórzeń (${LIMITS.frames}).`, at);
    }
    this.frames++;
  }

  private *exec(s: Stmt, frame: Frame | null): Generator<Stmt, Flow, void> {
    switch (s.k) {
      case 'cmd':
        return this.execCommand(s, frame);
      case 'color':
        this.tick(s);
        this.turtle.color = s.value;
        return 'next';
      case 'let': {
        this.tick(s);
        const value = this.evalArg(s.value, frame);
        if (frame) frame.vars.set(s.name, value);
        else this.globals.set(s.name, value);
        return 'next';
      }
      case 'repeat':
        return yield* this.execRepeat(s, frame);
      case 'if':
        return yield* this.execIf(s, frame);
      case 'call':
        return yield* this.execCall(s, frame);
    }
  }

  private execCommand(s: Extract<Stmt, { k: 'cmd' }>, frame: Frame | null): Flow {
    this.tick(s);
    const t = this.turtle;
    const arg = (k = 0): number => this.evalArg(s.args[k]!, frame);
    const rotation = ROTATIONS[s.op];
    if (rotation) {
      rotate(t, rotation, arg());
      return 'next';
    }
    switch (s.op) {
      case 'fd':
        this.advanceBy(arg(), s);
        break;
      case 'bk':
        this.advanceBy(-arg(), s);
        break;
      case 'pu':
        t.pen = false;
        break;
      case 'pd':
        t.pen = true;
        break;
      case 'width': {
        const w = arg();
        const arg0 = s.args[0]!;
        if (!Number.isInteger(w) || w < LIMITS.widthMin || w > LIMITS.widthMax) {
          throw fail(`Grubość musi być liczbą całkowitą od ${LIMITS.widthMin} do ${LIMITS.widthMax} (podano ${w}).`, arg0.pos);
        }
        t.width = w;
        break;
      }
      case 'stop':
        return 'stop';
      case 'home':
        this.moveTo([0, 0, 0], s);
        resetOrientation(t);
        break;
      case 'cs':
        this.segments.length = 0;
        this.version++;
        break;
      default:
        break;
    }
    return 'next';
  }

  private *execRepeat(s: Extract<Stmt, { k: 'repeat' }>, frame: Frame | null): Generator<Stmt, Flow, void> {
    this.tick(s);
    const n = this.evalArg(s.count, frame);
    if (!Number.isInteger(n) || n < 0 || n > LIMITS.repeatMax) {
      throw fail(`Liczba powtórzeń musi być liczbą całkowitą od 0 do ${LIMITS.repeatMax} (podano ${n}).`, s.count.pos);
    }
    this.enterFrame(s.pos);
    const counter = { i: 0 };
    this.repeats.push(counter);
    let flow: Flow = 'next';
    for (let k = 1; k <= n; k++) {
      counter.i = k;
      flow = yield* this.block(s.body, frame);
      this.tick(s);
      if (flow === 'stop') break;
    }
    this.repeats.pop();
    this.frames--;
    return flow;
  }

  private *execIf(s: Extract<Stmt, { k: 'if' }>, frame: Frame | null): Generator<Stmt, Flow, void> {
    this.tick(s);
    const left = this.evalArg(s.cond.left, frame);
    const right = this.evalArg(s.cond.right, frame);
    const body = compare(left, s.cond.op, right) ? s.body : s.elseBody;
    if (!body) return 'next';
    const flow = yield* this.block(body, frame);
    this.tick(s);
    return flow;
  }

  private *execCall(s: Extract<Stmt, { k: 'call' }>, frame: Frame | null): Generator<Stmt, Flow, void> {
    this.tick(s);
    const proc = this.program.procs.get(s.name);
    if (!proc) throw fail(`Nieznane polecenie „${s.name}”.`, s.pos);
    const values = s.args.map((a) => this.evalArg(a, frame));
    this.enterFrame(s.pos);
    const callFrame: Frame = { proc, vars: new Map(proc.params.map((p, k): [string, number] => [p, values[k]!])) };
    // `stop` inside the body only ends this call, so the flow result is not needed here.
    yield* this.block(proc.body, callFrame);
    this.tick(s);
    this.frames--;
    return 'next';
  }

  // ---- drawing ----

  private advanceBy(distance: number, s: Stmt): void {
    if (distance === 0) return;
    const { pos, heading } = this.turtle;
    this.moveTo([pos[0] + heading[0] * distance, pos[1] + heading[1] * distance, pos[2] + heading[2] * distance], s);
  }

  private moveTo(to: Vec3, s: Stmt): void {
    const t = this.turtle;
    for (const c of to) {
      if (Math.abs(c) > LIMITS.coordinate) {
        throw fail(`Żółw wyszedł poza obszar rysowania (współrzędne w zakresie ±${LIMITS.coordinate}).`, s.pos);
      }
    }
    const from = t.pos;
    const moved = from[0] !== to[0] || from[1] !== to[1] || from[2] !== to[2];
    if (moved && t.pen) {
      if (this.segments.length >= LIMITS.segments) {
        throw fail(`Przekroczono limit odcinków (${LIMITS.segments}).`, s.pos);
      }
      this.segments.push({ from: [...from] as Vec3, to: [...to] as Vec3, color: t.color, width: t.width });
      this.version++;
    }
    t.pos = to;
  }

  // ---- expressions ----

  private evalArg(a: Arg, frame: Frame | null): number {
    return this.evalExpr(a.expr, frame, a.pos);
  }

  /** Evaluates an expression; run-time errors are reported at `at`, the first token of the enclosing argument. */
  private evalExpr(e: Expr, frame: Frame | null, at: Position): number {
    switch (e.k) {
      case 'num':
        return e.v;
      case 'var':
        return this.read(e.name, frame, at);
      case 'nrpowt': {
        const innermost = this.repeats[this.repeats.length - 1];
        if (!innermost) throw fail('„nrpowt” można użyć tylko wewnątrz powtórzenia.', at);
        return innermost.i;
      }
      case 'neg':
        return -this.evalExpr(e.e, frame, at);
      case 'bin': {
        const l = this.evalExpr(e.l, frame, at);
        const r = this.evalExpr(e.r, frame, at);
        let v: number;
        switch (e.op) {
          case '+':
            v = l + r;
            break;
          case '-':
            v = l - r;
            break;
          case '*':
            v = l * r;
            break;
          case '/':
            if (r === 0) throw fail('Dzielenie przez zero.', at);
            v = l / r;
            break;
        }
        if (!Number.isFinite(v)) throw fail('Wynik działania nie jest liczbą skończoną.', at);
        return v;
      }
    }
  }

  private read(name: string, frame: Frame | null, at: Position): number {
    if (frame) {
      const local = frame.vars.get(name);
      if (local !== undefined) return local;
      // A name the procedure assigns shadows the global, even before its niech runs.
      if (frame.proc.locals.has(name)) throw fail(`Zmienna „${name}” nie ma jeszcze wartości.`, at);
    }
    const global = this.globals.get(name);
    if (global !== undefined) return global;
    throw fail(`Zmienna „${name}” nie ma jeszcze wartości.`, at);
  }
}
