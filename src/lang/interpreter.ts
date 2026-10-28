import type { Arg, Condition, Expr, Procedure, Program, Stmt } from './ast';
import { LIMITS, LogoFailure, big, type LogoError } from './errors';
import { clean, rotatePair, type Vec3 } from './geometry';
import { checkRepeat, checkWidth } from './parser';
import type { Token } from './lexer';

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export interface Pose {
  pos: Vec3;
  /** Kierunek (nos), prawy bok, góra żółwia. */
  h: Vec3;
  r: Vec3;
  u: Vec3;
}

export interface TurtleState extends Pose {
  pen: boolean;
  color: string;
  width: number;
}

/** Jeden wykonany krok programu – do animacji i pracy krokowej. */
export interface Step {
  line: number;
  col: number;
  start: number;
  end: number;
  /** Liczba odcinków narysowanych od początku (także później wyczyszczonych). */
  drawn: number;
  /** Indeks pierwszego widocznego odcinka (po ostatnim czyść). */
  visibleFrom: number;
  /** Stan żółwia po wykonaniu kroku. */
  state: TurtleState;
  /** Rodzaj kroku – animacja ruchu i obrotów. */
  kind: Stmt['k'];
}

export interface Execution {
  /** Odcinki widoczne na końcu (po ostatnim czyść). */
  segments: Segment[];
  /** Wszystkie narysowane odcinki w kolejności rysowania. */
  drawn: Segment[];
  steps: Step[];
  error: LogoError | null;
  final: TurtleState;
  operations: number;
}

export const INITIAL_COLOR = '#16866a';
export const INITIAL_WIDTH = 3;

export function initialState(): TurtleState {
  return {
    pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1],
    pen: true, color: INITIAL_COLOR, width: INITIAL_WIDTH,
  };
}

interface Frame {
  locals: Map<string, number> | null;
  /** Numery bieżących iteracji powtórzeń tej procedury (leksykalnie). */
  reps: number[];
}

const STOP = 1;
type Signal = typeof STOP | undefined;

class Machine {
  pos: Vec3 = [0, 0, 0];
  h: Vec3 = [0, 1, 0];
  r: Vec3 = [1, 0, 0];
  u: Vec3 = [0, 0, 1];
  pen = true;
  color = INITIAL_COLOR;
  width = INITIAL_WIDTH;
  drawn: Segment[] = [];
  visibleFrom = 0;
  ops = 0;
  frames = 0;
  globals = new Map<string, number>();
  steps: Step[] = [];

  constructor(readonly program: Program, readonly trace: boolean) {}

  state(): TurtleState {
    return {
      pos: [...this.pos], h: [...this.h], r: [...this.r], u: [...this.u],
      pen: this.pen, color: this.color, width: this.width,
    };
  }

  /** Liczy jedną operację; przekroczenie limitu jest błędem. */
  count(tok: Token): void {
    if (++this.ops > LIMITS.operations) {
      throw LogoFailure.at(tok, `Przekroczono limit ${big(LIMITS.operations)} wykonanych operacji. Program działa za długo – zmniejsz liczbę powtórzeń albo głębokość rekurencji.`);
    }
  }

  record(stmt: Stmt): void {
    if (!this.trace) return;
    const t = stmt.tok;
    this.steps.push({
      line: t.line, col: t.col, start: t.start, end: t.end,
      drawn: this.drawn.length, visibleFrom: this.visibleFrom,
      state: this.state(), kind: stmt.k,
    });
  }

  pushFrame(tok: Token): void {
    if (++this.frames > LIMITS.frames) {
      throw LogoFailure.at(tok, `Za dużo zagnieżdżonych wywołań i powtórzeń naraz – najwyżej ${LIMITS.frames}. Czy rekurencja ma warunek końca?`);
    }
  }

  value(arg: Arg, frame: Frame): number {
    return this.eval(arg.expr, frame, arg.first);
  }

  eval(e: Expr, frame: Frame, at: Token): number {
    switch (e.k) {
      case 'num': return e.value;
      case 'repcount': return frame.reps[frame.reps.length - 1]!;
      case 'var': {
        const local = frame.locals?.get(e.name);
        if (local !== undefined) return local;
        const global = this.globals.get(e.name);
        if (global !== undefined) return global;
        const display = e.tok.colon ? e.tok.text.slice(1) : e.tok.text;
        throw LogoFailure.at(at, `Zmienna „${display}” nie ma jeszcze wartości – nadaj ją wcześniej poleceniem „niech ${display} …”.`);
      }
      case 'neg': return clean(-this.eval(e.e, frame, at));
      case 'bin': {
        const a = this.eval(e.a, frame, at);
        const b = this.eval(e.b, frame, at);
        let v: number;
        switch (e.op) {
          case '+': v = a + b; break;
          case '-': v = a - b; break;
          case '*': v = a * b; break;
          case '/':
            if (b === 0) throw LogoFailure.at(at, 'Dzielenie przez zero.');
            v = a / b;
            break;
        }
        if (!Number.isFinite(v)) throw LogoFailure.at(at, 'Wynik obliczenia jest za duży – nie jest skończoną liczbą.');
        return v;
      }
    }
  }

  test(c: Condition, frame: Frame): boolean {
    const a = this.value(c.a, frame);
    const b = this.value(c.b, frame);
    switch (c.op) {
      case '<': return a < b;
      case '>': return a > b;
      case '=': return a === b;
      case '<=': return a <= b;
      case '>=': return a >= b;
      case '<>': return a !== b;
    }
  }

  addSegment(from: Vec3, to: Vec3, tok: Token): void {
    if (this.drawn.length - this.visibleFrom >= LIMITS.segments) {
      throw LogoFailure.at(tok, `Przekroczono limit ${big(LIMITS.segments)} odcinków na rysunku.`);
    }
    this.drawn.push({
      from: [clean(from[0]), clean(from[1]), clean(from[2])],
      to: [clean(to[0]), clean(to[1]), clean(to[2])],
      color: this.color, width: this.width,
    });
  }

  move(d: number, tok: Token): void {
    const p = this.pos;
    const next: Vec3 = [p[0] + this.h[0] * d, p[1] + this.h[1] * d, p[2] + this.h[2] * d];
    const lim = LIMITS.coordinate;
    if (Math.abs(next[0]) > lim || Math.abs(next[1]) > lim || Math.abs(next[2]) > lim) {
      throw LogoFailure.at(tok, `Żółw wyszedłby poza dozwolony obszar: współrzędne muszą mieścić się w zakresie ±${big(lim)}.`);
    }
    const changed = next[0] !== p[0] || next[1] !== p[1] || next[2] !== p[2];
    if (this.pen && changed) this.addSegment(p, next, tok);
    this.pos = next;
  }

  block(body: Stmt[], frame: Frame): Signal {
    for (const s of body) {
      if (this.exec(s, frame) === STOP) return STOP;
    }
    return undefined;
  }

  exec(s: Stmt, frame: Frame): Signal {
    this.count(s.tok);
    switch (s.k) {
      case 'move':
        this.move(s.sign * this.value(s.arg, frame), s.tok);
        break;
      case 'turn':
        [this.h, this.r] = rotatePair(this.h, this.r, s.sign * this.value(s.arg, frame));
        break;
      case 'pitch':
        [this.h, this.u] = rotatePair(this.h, this.u, s.sign * this.value(s.arg, frame));
        break;
      case 'roll':
        [this.u, this.r] = rotatePair(this.u, this.r, s.sign * this.value(s.arg, frame));
        break;
      case 'pen':
        this.pen = s.down;
        break;
      case 'color':
        this.color = s.color;
        break;
      case 'width': {
        const v = this.value(s.arg, frame);
        checkWidth(v, s.arg.first);
        this.width = v;
        break;
      }
      case 'home': {
        const p = this.pos;
        if (this.pen && (p[0] !== 0 || p[1] !== 0 || p[2] !== 0)) this.addSegment(p, [0, 0, 0], s.tok);
        this.pos = [0, 0, 0];
        this.h = [0, 1, 0];
        this.r = [1, 0, 0];
        this.u = [0, 0, 1];
        break;
      }
      case 'clear':
        this.visibleFrom = this.drawn.length;
        break;
      case 'let': {
        const v = this.value(s.arg, frame);
        (frame.locals ?? this.globals).set(s.name, v);
        break;
      }
      case 'stop':
        this.record(s);
        return STOP;
      case 'repeat': {
        const n = this.value(s.count, frame);
        checkRepeat(n, s.count.first);
        this.pushFrame(s.tok);
        this.record(s);
        frame.reps.push(0);
        const depth = frame.reps.length - 1;
        let signal: Signal;
        for (let k = 1; k <= n; k++) {
          frame.reps[depth] = k;
          signal = this.block(s.body, frame);
          if (signal === STOP) break;
          this.count(s.tok);
        }
        frame.reps.pop();
        this.frames--;
        return signal;
      }
      case 'if':
      case 'ifelse': {
        const ok = this.test(s.cond, frame);
        this.record(s);
        const body = ok ? s.then : s.k === 'ifelse' ? s.else : null;
        if (body) {
          if (this.block(body, frame) === STOP) return STOP;
          this.count(s.tok);
        }
        return undefined;
      }
      case 'call':
        this.call(s.proc, s.args, s.tok, frame);
        return undefined;
    }
    this.record(s);
    return undefined;
  }

  call(proc: Procedure, args: Arg[], tok: Token, frame: Frame): void {
    const locals = new Map<string, number>();
    const values = args.map((a) => this.value(a, frame));
    proc.params.forEach((p, k) => locals.set(p, values[k]!));
    this.pushFrame(tok);
    this.record({ k: 'call', tok, proc, args });
    this.block(proc.body, { locals, reps: [] });
    this.count(tok);
    this.frames--;
  }
}

export interface ExecuteOptions {
  /** Czy zapisywać kroki (dla animacji). */
  trace?: boolean;
}

export function execute(program: Program, options: ExecuteOptions = {}): Execution {
  const m = new Machine(program, options.trace ?? false);
  let error: LogoError | null = null;
  try {
    m.block(program.main, { locals: null, reps: [] });
  } catch (e) {
    if (!(e instanceof LogoFailure)) throw e;
    error = e.toError('run');
  }
  return {
    segments: m.drawn.slice(m.visibleFrom),
    drawn: m.drawn,
    steps: m.steps,
    error,
    final: m.state(),
    operations: m.ops,
  };
}

