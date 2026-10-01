import { describe, expect, it } from "vitest";
import { examples } from "../examples";
import { appendCall, parse } from "./parser";
import { Executor } from "./runtime";
import { LIMITS, LogoError, type Mode } from "./types";
function run(source: string, mode: Mode = "2d") {
  const runtime = new Executor(parse(source, mode));
  while (!runtime.done) runtime.tick();
  return runtime.drawing;
}
describe("Logo drawing behavior", () => {
  it("closes a square and accepts Polish/English aliases", () => {
    const polish = run("POWTÓRZ 4 [ NAPRZÓD 80 PRAWO 90 ]");
    const english = run("repeat 4 [ forward 80 right 90 ]");
    expect(polish.segments).toEqual(english.segments);
    polish.turtle.position.forEach((n) => {
      expect(n).toBeCloseTo(0);
    });
    expect(polish.segments).toHaveLength(4);
    expect(polish.turtle.forward[1]).toBeCloseTo(1);
  });
  it("supports decimals, backward movement, nested repeats and comments", () => {
    const drawing = run("; start\n repeat 2 [repeat 2 [fd 2.5]] bk -1.5");
    expect(drawing.turtle.position).toEqual([0, 11.5, 0]);
    expect(drawing.segments).toHaveLength(5);
  });
  it("preserves pen gaps, per-segment color and width", () => {
    const drawing = run('fd 10 pu fd 10 pd color "#cc3300" width 7 fd 10');
    expect(drawing.segments).toHaveLength(2);
    expect(drawing.segments[0]).toMatchObject({
      from: [0, 0, 0],
      to: [0, 10, 0],
      width: 3,
    });
    expect(drawing.segments[1]).toEqual({
      from: [0, 20, 0],
      to: [0, 30, 0],
      color: "#cc3300",
      width: 7,
    });
  });
  it("matches planar movement across both modes", () => {
    const source = "repeat 16 [fd 12 rt 72 bk 2 lt 17]";
    expect(run(source, "2d").segments).toEqual(run(source, "3d").segments);
  });
  it("turns within a local 3D frame and preserves an orthonormal orientation", () => {
    const drawing = run("gora 90 np 40 pw 90 np 20", "3d");
    expect(drawing.turtle.position[0]).toBeCloseTo(20);
    expect(drawing.turtle.position[1]).toBeCloseTo(0);
    expect(drawing.turtle.position[2]).toBeCloseTo(40);
    const { forward, right, up } = run(
      "repeat 100 [rt 31 pitchup 19 lt 7 pitchdown 11]",
      "3d",
    ).turtle;
    [forward, right, up].forEach((v) => {
      expect(Math.hypot(...v)).toBeCloseTo(1);
    });
    expect(forward.reduce((sum, n, i) => sum + n * right[i], 0)).toBeCloseTo(0);
    expect(forward.reduce((sum, n, i) => sum + n * up[i], 0)).toBeCloseTo(0);
    expect(right.reduce((sum, n, i) => sum + n * up[i], 0)).toBeCloseTo(0);
  });
  it.each(examples)("runs example $id within limits", (example) => {
    const drawing = run(example.source, example.mode);
    expect(drawing.segments.length).toBeGreaterThan(0);
    if (example.mode === "3d")
      expect(drawing.segments.some((s) => Math.abs(s.to[2]) > 1)).toBe(true);
  });
  it("snapshots retain prior output after further execution", () => {
    const runtime = new Executor(parse("fd 10 fd 10 rt 90", "2d"));
    runtime.tick();
    const before = runtime.snapshot();
    runtime.tick();
    runtime.tick();
    expect(before.turtle.position).toEqual([0, 10, 0]);
    expect(before.turtle.forward).toEqual([0, 1, 0]);
    expect(before.segments).toHaveLength(1);
  });
});
describe("finite execution and source errors", () => {
  it("reports the source position of an unknown command", () => {
    try {
      parse("; comment\nfd 20\n  no_such_command 30", "2d");
      throw new Error("expected rejection");
    } catch (error) {
      expect(error).toBeInstanceOf(LogoError);
      expect((error as LogoError).span).toEqual({ line: 3, column: 3 });
    }
  });
  it.each([
    "constructor 1",
    "__proto__ 1",
    "fd NaN",
    "fd Infinity",
    "fd 1e3",
    "fd",
    "fd 2 + 3",
    "repeat 2 [ fd 10",
    "repeat 2.5 []",
    "repeat -1 []",
    "repeat 10001 []",
    "width 0",
    "color red",
    'color "#fff"',
    "]",
  ])("rejects unsupported source %s", (source) => {
    expect(() => parse(source, "2d")).toThrow(LogoError);
  });
  it("rejects spatial commands in 2D even inside a zero-count repeat", () => {
    expect(() => parse("repeat 0 [pitchup 90]", "2d")).toThrow(/3D/);
  });
  it("rejects oversized source, token count and nesting before execution", () => {
    expect(() => parse(" ".repeat(LIMITS.source + 1), "2d")).toThrow(
      /za długi/,
    );
    expect(() => parse("pu ".repeat(LIMITS.tokens + 1), "2d")).toThrow(
      /tokenów/,
    );
    expect(() => parse("repeat 1 [".repeat(33) + "]".repeat(33), "2d")).toThrow(
      /zagnieżdżonych/,
    );
  });
  it("bounds huge nested empty loops without expanding them", () => {
    const runtime = new Executor(parse("repeat 10000 [repeat 10000 []]", "2d"));
    expect(() => {
      for (let i = 0; i <= LIMITS.operations; i++) runtime.tick();
    }).toThrow(/operacji/);
    expect(runtime.drawing.segments).toHaveLength(0);
  });
  it("preserves the last valid position when the coordinate bound is exceeded", () => {
    const runtime = new Executor(parse("fd 10 fd 100000", "2d"));
    runtime.tick();
    expect(() => runtime.tick()).toThrow(/współrzędnych/);
    expect(runtime.drawing.turtle.position).toEqual([0, 10, 0]);
    expect(runtime.drawing.segments).toHaveLength(1);
  });
  it("completes zero-count repeats and empty programs", () => {
    expect(run("repeat 0 [fd 10]").segments).toHaveLength(0);
    expect(run("").commands).toBe(0);
  });
});

describe("procedures", () => {
  it("accepts forward calls, aliases, Unicode names, case-insensitive parameters and fresh local scope", () => {
    const drawing = run("RYSUJ 2 5\nto Rysuj :Ile :Dystans\nrepeat :ILE [ fd :dystans ]\nend\nrysuj 1 3");
    expect(drawing.segments).toHaveLength(3);
    expect(drawing.turtle.position).toEqual([0, 13, 0]);
    expect(run("oto Żółw :Krok\nnp :krok\njuż\nżÓŁW 4").turtle.position).toEqual([0, 4, 0]);
    expect(run("oto x\nfd 2\njuz\nx x").segments).toHaveLength(2);
  });
  it("counts calls and returns as work, but only primitives as commands", () => {
    const runtime = new Executor(parse("to move :x\nfd :x\nend\nmove 4", "2d"));
    expect(runtime.tick()).toBe("work");
    expect(runtime.drawing.commands).toBe(0);
    expect(runtime.tick()).toBe("command");
    expect(runtime.drawing.commands).toBe(1);
    expect(runtime.tick()).toBe("work");
    expect(runtime.tick()).toBe("done");
    const stepped = new Executor(parse("to move\nfd 4\nend\nmove", "2d"));
    expect(stepped.step()).toBe("command");
    expect(stepped.drawing.commands).toBe(1);
    expect(stepped.step()).toBe("done");
  });
  it("bounds many empty calls by the shared operation budget", () => {
    const runtime = new Executor(parse("to empty\nend\nrepeat 10000 [ empty ]", "2d"));
    expect(() => {
      for (let i = 0; i <= LIMITS.operations; i++) runtime.tick();
    }).toThrow(/operacji/);
    expect(runtime.drawing.commands).toBe(0);
  });
  it("validates resolved width and repeat arguments before changing the drawing", () => {
    const width = new Executor(parse("fd 2\nto draw :w\nwidth :w\nend\ndraw 13", "2d"));
    while (width.drawing.commands < 1) width.tick();
    expect(() => { while (!width.done) width.tick(); }).toThrow(/Grubość/);
    expect(width.drawing.turtle.position).toEqual([0, 2, 0]);
    expect(width.drawing.turtle.width).toBe(3);
    expect(() => run("to x :n\nrepeat :n [fd 1]\nend\nx 1.5")).toThrow(/Liczba powtórzeń/);
    try {
      run("to x :w\nwidth :w\nend\nx 13");
      throw new Error("expected invalid width");
    } catch (error) {
      expect((error as LogoError).span).toEqual({ line: 2, column: 7 });
    }
  });
  it("limits active call and repeat frames beyond the root", () => {
    const definitions = Array.from({ length: 33 }, (_, i) =>
      `to p${i}\n${i === 32 ? "fd 1" : `p${i + 1}`}\nend`,
    ).join("\n");
    const runtime = new Executor(parse(`${definitions}\np0`, "2d"));
    expect(() => { while (!runtime.done) runtime.tick(); }).toThrow(/ramek/);
    expect(runtime.drawing.commands).toBe(0);
  });
  it("requires the procedure header to start its own line", () => {
    expect(() => parse("fd 1 to a\nend", "2d")).toThrow(/nowy wiersz/);
  });
  it("locates recursion at the call that closes the cycle", () => {
    try {
      parse("to a\nb\nend\nto b\na\nend", "2d");
      throw new Error("expected recursion error");
    } catch (error) {
      expect(error).toBeInstanceOf(LogoError);
      expect((error as LogoError).span).toEqual({ line: 5, column: 1 });
    }
  });
  it("rejects a terminator after a command on its line", () => {
    try {
      parse("to a\nfd 1 end", "2d");
      throw new Error("expected non-standalone terminator");
    } catch (error) {
      expect(error).toBeInstanceOf(LogoError);
      expect((error as LogoError).span).toEqual({ line: 2, column: 6 });
    }
  });
  it("resolves a forward call inside repeat and checks unused mutual recursion", () => {
    expect(run("repeat 2 [ draw 3 ]\nto draw :n\nfd :n\nend").turtle.position).toEqual([0, 6, 0]);
    expect(() => parse("to a\nb\nend\nto b\na\nend\nfd 1", "2d")).toThrow(/rekurencyjnie/);
  });
  it("can append a typed challenge call without changing the parsed program", () => {
    const program = parse("to draw :n\nfd :n\nend", "2d");
    const called = appendCall(program, "DRAW", [7]);
    expect(program.instructions).toHaveLength(0);
    const runtime = new Executor(called);
    while (!runtime.done) runtime.tick();
    expect(runtime.drawing.turtle.position).toEqual([0, 7, 0]);
    expect(() => appendCall(program, "draw", [1, 2])).toThrow(/argumentów/);
  });
  it.each([
    "to a\nfd 1\nend\nto A\nfd 2\nend",
    "to fd\nend",
    "to a :x :X\nend",
    "to a :fd\nend",
    "to a\nunknown\nend",
    "to a :x\nfd :missing\nend",
    "to a\npitchup 5\nend",
    "to a\nend\na 1",
    "to a :x\nend\na",
    "to a\nto b\nend\nend",
    "repeat 1 [to a\nend]",
    "to a\nend fd 1",
    "to a\na\nend",
    "to a\nb\nend\nto b\na\nend",
  ])("rejects invalid definitions and calls: %s", (source) => {
    expect(() => parse(source, "2d")).toThrow(LogoError);
  });
});
