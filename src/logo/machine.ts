import { errorAt, type Pos } from './errors';
import type { Arg, Cond, Expr, Program, Stmt } from './parser';

export type Vec = [number, number, number];

export interface Segment {
  from: Vec;
  to: Vec;
  color: string;
  width: number;
}

export interface TurtleState {
  pos: Vec;
  heading: Vec;
  up: Vec;
  right: Vec;
  pen: boolean;
  color: string;
  width: number;
}

export const LIMITS = {
  ops: 10000,
  segments: 10000,
  frames: 32,
  coord: 100000,
  repeat: 10000,
};

type Sig = 'normal' | 'stop';
interface Frame {
  locals: Map<string, number>;
}

const ORIGIN: Vec = [0, 0, 0];
const HOME_HEADING: Vec = [0, 1, 0];
const HOME_UP: Vec = [0, 0, 1];
const HOME_RIGHT: Vec = [1, 0, 0];

/** Exact at multiples of 90 degrees, so flat programs land on whole coordinates. */
function cosd(a: number): number {
  const m = ((a % 360) + 360) % 360;
  if (m === 0) return 1;
  if (m === 90 || m === 270) return 0;
  if (m === 180) return -1;
  return Math.cos((a * Math.PI) / 180);
}

function sind(a: number): number {
  const m = ((a % 360) + 360) % 360;
  if (m === 0 || m === 180) return 0;
  if (m === 90) return 1;
  if (m === 270) return -1;
  return Math.sin((a * Math.PI) / 180);
}

const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k, a[2] * k];
const clean = (v: number): number => v || 0; // turns -0 into 0
const sameVec = (a: Vec, b: Vec) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

/**
 * Executes a parsed program. The execution is a generator: every statement yields its
 * position just before it runs, so the UI can step, pause and highlight it.
 */
export class Machine {
  readonly segments: Segment[] = [];
  private pos: Vec = [...ORIGIN];
  private heading: Vec = [...HOME_HEADING];
  private up: Vec = [...HOME_UP];
  private right: Vec = [...HOME_RIGHT];
  private pen = true;
  private color = '#16866a';
  private width = 3;
  private readonly globals = new Map<string, number>();
  private readonly frames: Frame[] = [];
  private readonly repeats: number[] = [];
  private active = 0;
  private ops = 0;

  constructor(private readonly prog: Program) {}

  get turtle(): TurtleState {
    return {
      pos: [...this.pos],
      heading: [...this.heading],
      up: [...this.up],
      right: [...this.right],
      pen: this.pen,
      color: this.color,
      width: this.width,
    };
  }

  *execute(): Generator<Pos, void, undefined> {
    yield* this.block(this.prog.top);
  }

  private *block(stmts: Stmt[]): Generator<Pos, Sig, undefined> {
    for (const s of stmts) {
      yield s.pos;
      if ((yield* this.stmt(s)) === 'stop') return 'stop';
    }
    return 'normal';
  }

  private *stmt(s: Stmt): Generator<Pos, Sig, undefined> {
    this.tick(s.pos);
    switch (s.t) {
      case 'cmd':
        this.command(s);
        return 'normal';
      case 'stop':
        return 'stop';
      case 'let':
        this.setVar(s.name, this.value(s.value));
        return 'normal';
      case 'if': {
        const body = this.test(s.cond) ? s.body : s.elseBody;
        if (!body) return 'normal';
        const sig = yield* this.block(body);
        this.tick(s.pos); // finishing the body
        return sig;
      }
      case 'repeat': {
        const n = this.count(s.count);
        this.enter(s.pos);
        let sig: Sig = 'normal';
        for (let k = 1; k <= n; k++) {
          this.repeats.push(k);
          sig = yield* this.block(s.body);
          this.repeats.pop();
          this.tick(s.pos); // finishing the iteration
          if (sig === 'stop') break;
        }
        this.active--;
        return sig;
      }
      case 'call': {
        const def = this.prog.procs.get(s.proc)!;
        const locals = new Map<string, number>();
        def.params.forEach((p, k) => locals.set(p, this.value(s.args[k])));
        this.enter(s.pos);
        this.frames.push({ locals });
        yield* this.block(def.body);
        this.frames.pop();
        this.active--;
        this.tick(s.pos); // finishing the call
        return 'normal';
      }
    }
  }

  private command(s: Extract<Stmt, { t: 'cmd' }>) {
    const a = s.args[0];
    switch (s.cmd) {
      case 'fd':
        return this.move(this.value(a), a.pos, s.pos);
      case 'bk':
        return this.move(-this.value(a), a.pos, s.pos);
      case 'rt':
        return this.turn(this.value(a), 1);
      case 'lt':
        return this.turn(this.value(a), -1);
      case 'pitchup':
        return this.pitch(this.value(a), 1);
      case 'pitchdown':
        return this.pitch(this.value(a), -1);
      case 'rollright':
        return this.roll(this.value(a), 1);
      case 'rollleft':
        return this.roll(this.value(a), -1);
      case 'pu':
        this.pen = false;
        return;
      case 'pd':
        this.pen = true;
        return;
      case 'color':
        this.color = s.color;
        return;
      case 'width': {
        const w = this.value(a);
        if (!Number.isInteger(w) || w < 1 || w > 12) {
          throw errorAt('Grubość musi być liczbą całkowitą od 1 do 12.', a.pos);
        }
        this.width = w;
        return;
      }
      case 'home':
        if (this.pen && !sameVec(this.pos, ORIGIN)) this.draw(this.pos, ORIGIN, s.pos);
        this.pos = [...ORIGIN];
        this.heading = [...HOME_HEADING];
        this.up = [...HOME_UP];
        this.right = [...HOME_RIGHT];
        return;
      case 'cs':
        this.segments.length = 0;
        return;
    }
  }

  private move(d: number, argPos: Pos, cmdPos: Pos) {
    const target = add(this.pos, scale(this.heading, d));
    if (target.some((v) => Math.abs(v) > LIMITS.coord)) {
      throw errorAt(`Współrzędna poza zakresem ±${LIMITS.coord}.`, argPos);
    }
    if (this.pen && d !== 0) this.draw(this.pos, target, cmdPos);
    this.pos = target;
  }

  private draw(from: Vec, to: Vec, at: Pos) {
    if (this.segments.length >= LIMITS.segments) {
      throw errorAt(`Przekroczono limit ${LIMITS.segments} odcinków.`, at);
    }
    this.segments.push({
      from: from.map(clean) as Vec,
      to: to.map(clean) as Vec,
      color: this.color,
      width: this.width,
    });
  }

  /** Right turn (dir 1) or left turn (dir -1) around the up vector. */
  private turn(a: number, dir: 1 | -1) {
    const c = cosd(a);
    const s = sind(a) * dir;
    const h = this.heading;
    const r = this.right;
    this.heading = add(scale(h, c), scale(r, s));
    this.right = add(scale(r, c), scale(h, -s));
  }

  /** Nose up (dir 1) or down (dir -1), rotating around the right vector. */
  private pitch(a: number, dir: 1 | -1) {
    const c = cosd(a);
    const s = sind(a) * dir;
    const h = this.heading;
    const u = this.up;
    this.heading = add(scale(h, c), scale(u, s));
    this.up = add(scale(u, c), scale(h, -s));
  }

  /** Roll right (dir 1) or left (dir -1), rotating the up vector around the heading. */
  private roll(a: number, dir: 1 | -1) {
    const c = cosd(a);
    const s = sind(a) * dir;
    const u = this.up;
    const r = this.right;
    this.up = add(scale(u, c), scale(r, s));
    this.right = add(scale(r, c), scale(u, -s));
  }

  private tick(at: Pos) {
    this.ops++;
    if (this.ops > LIMITS.ops) throw errorAt(`Przekroczono limit ${LIMITS.ops} operacji.`, at);
  }

  private enter(at: Pos) {
    if (this.active >= LIMITS.frames) {
      throw errorAt(`Przekroczono limit ${LIMITS.frames} aktywnych wywołań i powtórzeń.`, at);
    }
    this.active++;
  }

  private count(a: Arg): number {
    const n = this.value(a);
    if (!Number.isInteger(n) || n < 0 || n > LIMITS.repeat) {
      throw errorAt('Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.', a.pos);
    }
    return n;
  }

  private test(c: Cond): boolean {
    const a = this.ev(c.a.e, c.a.pos);
    const b = this.ev(c.b.e, c.b.pos);
    switch (c.op) {
      case '<': return a < b;
      case '>': return a > b;
      case '=': return a === b;
      case '<=': return a <= b;
      case '>=': return a >= b;
      case '<>': return a !== b;
    }
  }

  private value(a: Arg): number {
    return this.ev(a.e, a.pos);
  }

  private ev(e: Expr, at: Pos): number {
    switch (e.k) {
      case 'num':
        return e.v;
      case 'un':
        return e.sign * this.ev(e.e, at);
      case 'nrpowt': {
        const n = this.repeats[this.repeats.length - 1];
        if (n === undefined) throw errorAt('Wartość „nrpowt” można użyć tylko wewnątrz powtórz.', at);
        return n;
      }
      case 'ref': {
        const local = this.frames[this.frames.length - 1]?.locals;
        if (local?.has(e.name)) return local.get(e.name)!;
        if (this.globals.has(e.name)) return this.globals.get(e.name)!;
        throw errorAt(`Zmienna „${e.name}” nie ma jeszcze wartości.`, at);
      }
      case 'bin': {
        const a = this.ev(e.a, at);
        const b = this.ev(e.b, at);
        let r: number;
        switch (e.op) {
          case '+': r = a + b; break;
          case '-': r = a - b; break;
          case '*': r = a * b; break;
          case '/':
            if (b === 0) throw errorAt('Dzielenie przez zero.', at);
            r = a / b;
            break;
        }
        if (!Number.isFinite(r)) throw errorAt('Wynik nie jest liczbą skończoną.', at);
        return r;
      }
    }
  }

  private setVar(name: string, v: number) {
    const frame = this.frames[this.frames.length - 1];
    if (frame) frame.locals.set(name, v);
    else this.globals.set(name, v);
  }
}


