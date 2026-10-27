import { describe, expect, it } from "vitest";
import { parse } from "./parser";
import { Executor } from "./runtime";
import { LogoError, type Mode } from "./types";

function run(source: string, mode: Mode = "2d") {
  const runtime = new Executor(parse(source, mode));
  while (!runtime.done) runtime.tick();
  return runtime.drawing;
}
const y = (source: string, mode: Mode = "2d") => run(source, mode).turtle.position[1];
function failure(source: string, mode: Mode = "2d") {
  try {
    run(source, mode);
  } catch (error) {
    if (error instanceof LogoError) return { message: error.message, ...error.span };
    throw error;
  }
  throw new Error(`expected an error for ${source}`);
}

describe("expressions", () => {
  it("applies precedence, associativity, parentheses and unary signs", () => {
    expect(y("np 2 + 3 * 4")).toBe(14);
    expect(y("np (2 + 3) * 4")).toBe(20);
    expect(y("np 20 - 5 - 3")).toBe(12);
    expect(y("np 24 / 4 / 2")).toBe(3);
    expect(y("np -(3 - 5) + -1")).toBe(1);
    expect(y("np +3")).toBe(3);
    expect(y("np 1.5*2")).toBe(3);
  });
  it("reads a binary operator only with whitespace on both sides or on neither", () => {
    expect(y("np 10 - 5")).toBe(5);
    expect(y("np 10-5")).toBe(5);
    expect(run("np 10 - -5").turtle.position[1]).toBe(15);
    expect(failure("np 10 -5")).toMatchObject({ line: 1, column: 7 });
    expect(failure("np 10 *5")).toMatchObject({ line: 1, column: 7 });
    expect(failure("np 10- 5")).toMatchObject({ line: 1, column: 6 });
  });
  it("fails at run time on division by zero, at the first token of the argument", () => {
    expect(failure("np 10\nnp 4 / (2 - 2)")).toMatchObject({ message: /zero/, line: 2, column: 4 });
    expect(failure("np 10\nnp 1 + (4 / 0)")).toMatchObject({ message: /zero/, line: 2, column: 4 });
    expect(failure("niech x 0\nnp 1 + (4 / x)")).toMatchObject({ message: /zero/, line: 2, column: 4 });
    const runtime = new Executor(parse("np 10\nnp 4 / (2 - 2)", "2d"));
    expect(() => {
      while (!runtime.done) runtime.tick();
    }).toThrow(/zero/);
    expect(runtime.drawing.segments).toHaveLength(1);
  });
  it("validates literal width and repeat expressions before running, at the argument", () => {
    expect(failure("np 1 grubosc 6 * 3")).toMatchObject({ message: /Grubość/, line: 1, column: 14 });
    expect(failure("np 1 powtorz 1 / 2 [np 1]")).toMatchObject({ line: 1, column: 14 });
    expect(y("grubosc 2 * 3 np 1")).toBe(1);
  });
});

describe("variables", () => {
  it("declares globals with niech and reads them anywhere", () => {
    expect(y("niech bok 10\nnp bok\noto p\nnp bok * 2\njuż\np")).toBe(30);
    expect(y("oto p\nnp bok\njuż\nniech bok 4\np")).toBe(4);
  });
  it("keeps procedure variables local and lets them shadow globals", () => {
    expect(y("niech x 1\noto p\nniech x 100\nnp x\njuż\np np x")).toBe(101);
    expect(y("oto p ma: a\nniech a a * 2\nnp a\njuż\np 3")).toBe(6);
  });
  it("rejects unknown names at parse time and unassigned ones at run time", () => {
    expect(failure("np x")).toMatchObject({ message: /Nieznana nazwa/, line: 1, column: 4 });
    expect(failure("oto p\nnp x\njuż\noto q\nniech x 1\njuż\nq p")).toMatchObject({ line: 2, column: 4 });
    expect(failure("np 5\nnp x\nniech x 1")).toMatchObject({ message: /wartości/, line: 2, column: 4 });
    expect(failure("niech np 1")).toMatchObject({ line: 1, column: 7 });
    expect(failure("oto p\njuż\nniech p 1")).toMatchObject({ line: 3, column: 7 });
  });
});

describe("conditionals, recursion and stop", () => {
  it("runs jeśli and jeżeli on exact comparisons", () => {
    expect(y("niech a 3\njeśli a < 4 [np 1]\njeśli a = 3 [np 10]\njeśli a <> 3 [np 100]\njeżeli a >= 4 [np 1000] [np 10000]")).toBe(10011);
    expect(y("if 0.1 + 0.2 = 0.3 [np 1]")).toBe(0);
    expect(failure("jeśli 1 [np 1]")).toMatchObject({ message: /warunek/, line: 1, column: 9 });
  });
  it("supports recursion with a stop condition and stop at top level", () => {
    const source = "oto licz ma: n\njeśli n = 0 [stop]\nnp n\nlicz n - 1\njuż\nlicz 4";
    expect(y(source)).toBe(10);
    expect(run(source).segments).toHaveLength(4);
    expect(y("np 1 stop np 1")).toBe(1);
    expect(y("powtorz 3 [np 1 stop np 1]")).toBe(1);
  });
  it("stops only the current call, out of nested repeats", () => {
    expect(y("oto p\npowtorz 5 [np 1 jeśli nrpowt = 2 [stop]]\nnp 100\njuż\np np 1000")).toBe(1002);
  });
  it("limits recursion by active frames and keeps earlier segments", () => {
    const source = "oto p ma: n\nnp 1\np n + 1\njuż\np 1";
    expect(failure(source)).toMatchObject({ message: /ramek/ });
    const runtime = new Executor(parse(source, "2d"));
    expect(() => {
      while (!runtime.done) runtime.tick();
    }).toThrow(/ramek/);
    expect(runtime.drawing.segments).toHaveLength(32);
    expect(y("oto p ma: n\njeśli n = 32 [stop]\nnp 1\np n + 1\njuż\np 1")).toBe(31);
  });
});

describe("repeat counter", () => {
  it("counts from 1 in the innermost repeat", () => {
    expect(y("powtorz 4 [np nrpowt]")).toBe(10);
    expect(y("powtorz 2 [powtorz 3 [np nrpowt] np nrpowt * 100]")).toBe(312);
    expect(y("powtorz 2 [jeśli nrpowt = 2 [np repcount]]")).toBe(2);
  });
  it("is a parse error outside a repeat, lexically", () => {
    expect(failure("np nrpowt")).toMatchObject({ message: /nrpowt/, line: 1, column: 4 });
    expect(failure("oto p\nnp nrpowt\njuż\npowtorz 2 [p]")).toMatchObject({ line: 2, column: 4 });
    expect(y("oto p\npowtorz 2 [np nrpowt]\njuż\npowtorz 3 [p]")).toBe(9);
  });
});

describe("3D roll, home and clear", () => {
  it("rolls around the heading and composes with pitch and turn", () => {
    const { up, right, forward } = run("pp 90", "3d").turtle;
    expect(up.map((n) => Math.round(n))).toEqual([1, 0, 0]);
    expect(right.map((n) => Math.round(n))).toEqual([0, 0, -1]);
    expect(forward).toEqual([0, 1, 0]);
    const rolled = run("pp 90 gora 90 np 10", "3d").turtle.position.map((n) => Math.round(n));
    expect(rolled).toEqual([10, 0, 0]);
    const back = run("rl 30 pitchup 45 rt 60 lt 60 dol 45 pp 30 np 10", "3d").turtle.position;
    expect(back[0]).toBeCloseTo(0);
    expect(back[1]).toBeCloseTo(10);
    expect(back[2]).toBeCloseTo(0);
    expect(failure("pp 10")).toMatchObject({ message: /3D/, line: 1, column: 1 });
  });
  it("home draws the way back and resets the orientation", () => {
    const drawing = run("pw 90 np 10 gora 45 dom np 5", "3d");
    expect(drawing.segments).toHaveLength(3);
    expect(drawing.segments[1].from.map(Math.round)).toEqual([10, 0, 0]);
    expect(drawing.segments[1].to).toEqual([0, 0, 0]);
    expect(drawing.turtle.position).toEqual([0, 5, 0]);
    expect(run("pod np 10 dom").segments).toHaveLength(0);
    expect(run("dom np 1").segments).toHaveLength(1);
  });
  it("clear forgets the segments and keeps the turtle", () => {
    const drawing = run("np 10 pw 90 np 10 czyść np 5");
    expect(drawing.segments).toHaveLength(1);
    expect(drawing.segments[0]).toMatchObject({ from: [10, 10, 0], to: [15, 10, 0] });
    expect(run("np 10 cs").segments).toHaveLength(0);
  });
});
