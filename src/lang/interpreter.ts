import type { Arg, Expr, Mode, Program, Stmt } from './ast';
import { LogoError } from './errors';
import { EvalFault, compare, evaluate } from './evaluate';
import type { Token } from './lexer';
import { checkRepeat, checkWidth, parse } from './parser';

export type Vec3 = [number, number, number];

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export interface Turtle {
  pos: Vec3;
  /** Kierunek, w którym patrzy żółw. */
  heading: Vec3;
  /** Prawy bok żółwia. */
  right: Vec3;
  /** Grzbiet żółwia. */
  up: Vec3;
  penDown: boolean;
  color: string;
  width: number;
}

export const MAX_FRAMES = 32;
export const MAX_OPS = 10_000;
export const MAX_SEGMENTS = 10_000;
export const MAX_COORD = 100_000;
export const DEFAULT_COLOR = '#16866a';
export const DEFAULT_WIDTH = 3;

export function initialTurtle(): Turtle {
  return {
    pos: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    penDown: true,
    color: DEFAULT_COLOR,
    width: DEFAULT_WIDTH,
  };
}

/** Sinus i cosinus kąta w stopniach, dokładne dla wielokrotności 90°. */
export function sinCosDeg(deg: number): [number, number] {
  const r = ((deg % 360) + 360) % 360;
  if (r === 0) return [0, 1];
  if (r === 90) return [1, 0];
  if (r === 180) return [0, -1];
  if (r === 270) return [-1, 0];
  const rad = (r * Math.PI) / 180;
  return [Math.sin(rad), Math.cos(rad)];
}

/** Obraca parę wektorów: `a` w stronę `b` o dany kąt. */
function rotatePair(a: Vec3, b: Vec3, deg: number): [Vec3, Vec3] {
  const [s, c] = sinCosDeg(deg);
  return [
    [a[0] * c + b[0] * s, a[1] * c + b[1] * s, a[2] * c + b[2] * s],
    [b[0] * c - a[0] * s, b[1] * c - a[1] * s, b[2] * c - a[2] * s],
  ];
}

const STOP = Symbol('stop');
type Flow = typeof STOP | undefined;

interface Frame {
  locals: Map<string, number>;
  reps: number[];
}

/**
 * Wykonanie programu krok po kroku. Generator zatrzymuje się przed każdym
 * poleceniem, więc interfejs może animować rysunek i podświetlać wiersz.
 */
export class Execution {
  readonly program: Program;
  segments: Segment[] = [];
  /** Rośnie przy każdym `czyść` — pozwala widokom wykryć wyczyszczenie. */
  clearCount = 0;
  turtle: Turtle = initialTurtle();
  ops = 0;
  error: LogoError | null = null;
  finished = false;
  /** Polecenie, które wykona się jako następne. */
  current: Stmt | null = null;

  private frames = 0;
  private readonly globals = new Map<string, number>();
  private readonly gen: Generator<Stmt, void, void>;

  constructor(program: Program) {
    this.program = program;
    this.gen = this.main();
  }

  /** Wykonuje jedno polecenie (pierwsze wywołanie tylko ustawia się na początku). Zwraca false po zakończeniu. */
  step(): boolean {
    if (this.finished) return false;
    try {
      const r = this.gen.next();
      if (r.done) {
        this.finished = true;
        this.current = null;
        return false;
      }
      this.current = r.value;
      return true;
    } catch (e) {
      this.finished = true;
      this.current = null;
      if (e instanceof LogoError) {
        this.error = e;
        return false;
      }
      throw e;
    }
  }

  runToEnd(): void {
    while (this.step());
  }

  private *main(): Generator<Stmt, void, void> {
    const frame: Frame = { locals: this.globals, reps: [] };
    yield* this.block(this.program.body, frame);
  }

  private fail(message: string, at: Token): never {
    throw new LogoError(message, at, 'run');
  }

  private tick(at: Token): void {
    this.ops++;
    if (this.ops > MAX_OPS) {
      this.fail('Przekroczono limit 10 000 wykonanych operacji. Czy program nie wykonuje się w nieskończoność?', at);
    }
  }

  private enter(at: Token): void {
    if (this.frames >= MAX_FRAMES) {
      this.fail(
        `Za dużo jednocześnie aktywnych wywołań procedur i powtórzeń (limit ${MAX_FRAMES}). Czy rekurencja ma warunek zakończenia?`,
        at,
      );
    }
    this.frames++;
  }

  private value(arg: Arg | { expr: Expr; first: Token }, frame: Frame): number {
    try {
      return evaluate(arg.expr, (e) => {
        if (e.k === 'rep') return frame.reps[frame.reps.length - 1];
        const local = frame.locals.get(e.name);
        if (local !== undefined) return local;
        const global = this.globals.get(e.name);
        if (global !== undefined) return global;
        throw new EvalFault(`Zmienna ${'„' + e.tok.text.replace(/^:/, '') + '”'} nie ma jeszcze wartości — nadaj ją wcześniej poleceniem „niech”.`);
      });
    } catch (e) {
      if (e instanceof EvalFault) this.fail(e.message, arg.first);
      throw e;
    }
  }

  private moveTo(to: Vec3, at: Token): void {
    const t = this.turtle;
    if (to.some((c) => Math.abs(c) > MAX_COORD)) {
      this.fail('Żółw wyszedłby poza obszar rysowania: współrzędne muszą mieścić się w zakresie ±100 000.', at);
    }
    const from = t.pos;
    const moved = from[0] !== to[0] || from[1] !== to[1] || from[2] !== to[2];
    if (t.penDown && moved) {
      if (this.segments.length >= MAX_SEGMENTS) {
        this.fail('Przekroczono limit 10 000 odcinków na rysunku. Użyj „czyść”, aby zacząć od nowa.', at);
      }
      this.segments.push({ from, to, color: t.color, width: t.width });
    }
    t.pos = to;
  }

  private *block(stmts: Stmt[], frame: Frame): Generator<Stmt, Flow, void> {
    for (const s of stmts) {
      yield s;
      const flow = yield* this.exec(s, frame);
      if (flow === STOP) return STOP;
    }
    return undefined;
  }

  private *exec(s: Stmt, frame: Frame): Generator<Stmt, Flow, void> {
    const t = this.turtle;
    this.tick(s.tok);
    switch (s.k) {
      case 'move': {
        const d = s.sign * this.value(s.arg, frame);
        if (d === 0) return undefined;
        const h = t.heading;
        const p = t.pos;
        this.moveTo([p[0] + h[0] * d, p[1] + h[1] * d, p[2] + h[2] * d], s.tok);
        return undefined;
      }
      case 'turn': {
        const a = s.sign * this.value(s.arg, frame);
        if (s.axis === 'yaw') [t.heading, t.right] = rotatePair(t.heading, t.right, a);
        else if (s.axis === 'pitch') [t.heading, t.up] = rotatePair(t.heading, t.up, a);
        else [t.up, t.right] = rotatePair(t.up, t.right, a);
        return undefined;
      }
      case 'pen':
        t.penDown = s.down;
        return undefined;
      case 'color':
        t.color = s.value;
        return undefined;
      case 'width': {
        const w = this.value(s.arg, frame);
        checkWidth(w, s.arg.first, 'run');
        t.width = w;
        return undefined;
      }
      case 'home': {
        this.moveTo([0, 0, 0], s.tok);
        t.heading = [0, 1, 0];
        t.right = [1, 0, 0];
        t.up = [0, 0, 1];
        return undefined;
      }
      case 'clear':
        this.segments = [];
        this.clearCount++;
        return undefined;
      case 'stop':
        return STOP;
      case 'let':
        frame.locals.set(s.name, this.value(s.arg, frame));
        return undefined;
      case 'if': {
        const c = s.cond;
        const a = this.value({ expr: c.a, first: c.first }, frame);
        const b = this.value({ expr: c.b, first: c.first }, frame);
        const body = compare(c.op, a, b) ? s.then : s.else;
        if (!body) return undefined;
        const flow = yield* this.block(body, frame);
        if (flow === STOP) return STOP;
        this.tick(s.tok);
        return undefined;
      }
      case 'repeat': {
        const n = this.value(s.count, frame);
        checkRepeat(n, s.count.first, 'run');
        this.enter(s.tok);
        frame.reps.push(0);
        for (let i = 1; i <= n; i++) {
          frame.reps[frame.reps.length - 1] = i;
          const flow = yield* this.block(s.body, frame);
          if (flow === STOP) {
            frame.reps.pop();
            this.frames--;
            return STOP;
          }
          this.tick(s.tok);
        }
        frame.reps.pop();
        this.frames--;
        return undefined;
      }
      case 'call': {
        const proc = this.program.procs.get(s.name)!;
        const locals = new Map<string, number>();
        proc.params.forEach((p, i) => locals.set(p, this.value(s.args[i], frame)));
        this.enter(s.tok);
        yield* this.block(proc.body, { locals, reps: [] });
        this.frames--;
        this.tick(s.tok);
        return undefined;
      }
    }
  }
}

export interface RunResult {
  segments: Segment[];
  error: { message: string; line: number; column: number } | null;
}

function clean(n: number): number {
  return n === 0 ? 0 : n;
}

export function exportSegments(segments: Segment[]): Segment[] {
  return segments.map((s) => ({
    from: [clean(s.from[0]), clean(s.from[1]), clean(s.from[2])],
    to: [clean(s.to[0]), clean(s.to[1]), clean(s.to[2])],
    color: s.color,
    width: s.width,
  }));
}

export type ParseOutcome = { program: Program; error: null } | { program: null; error: LogoError };

export function compile(source: string, mode: Mode): ParseOutcome {
  try {
    return { program: parse(source, mode), error: null };
  } catch (e) {
    if (e instanceof LogoError) return { program: null, error: e };
    if (e instanceof RangeError) {
      return { program: null, error: new LogoError('Program jest zbyt głęboko zagnieżdżony.', { line: 1, col: 1 }) };
    }
    throw e;
  }
}

/** Uruchamia program do końca, bez interfejsu. */
export function run(source: string, mode: Mode): RunResult {
  const compiled = compile(String(source ?? ''), mode === '3d' ? '3d' : '2d');
  if (compiled.error) return { segments: [], error: compiled.error.toInfo() };
  const exec = new Execution(compiled.program);
  exec.runToEnd();
  return { segments: exportSegments(exec.segments), error: exec.error ? exec.error.toInfo() : null };
}
