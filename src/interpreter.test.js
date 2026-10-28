import { test, expect, describe } from "bun:test";
import { run, createExecution, aliases } from "./interpreter.js";
import { examples } from "./examples.js";
const end = (s, m) => run(s, m).segments.at(-1)?.to;
const error = (s, m) => {
  let r = run(s, m);
  expect(r.error).not.toBeNull();
  expect(r.error.line).toBeGreaterThan(0);
  expect(r.error.column).toBeGreaterThan(0);
  return r;
};
describe("standard programs", () => {
  let counts = [4, 5, 48, 90, 42, 255, 768, 12, 17, 36, 432, 240, 121];
  examples.forEach((e, i) =>
    test(e.name, () => {
      let r = run(e.source, e.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBe(counts[i]);
      if (e.mode === "2d") expect(run(e.source, "3d")).toEqual(r);
    }),
  );
});
test("all aliases and case insensitivity", () => {
  let args = {
    fd: "5",
    bk: "5",
    rt: "90",
    lt: "90",
    color: '"#AbCdEf"',
    width: "4",
    repeat: "2 [np 5]",
    let: "bok 7",
    if: "1 < 2 [np 5]",
    ifelse: "1 = 2 [np 5] [np 8]",
    pitch: "30",
    down: "30",
    roll: "30",
    rollleft: "30",
  };
  for (let [key, names] of Object.entries(aliases)) {
    let source = names.split(" ")[0] + " " + (args[key] || "");
    let expected = run(source, "3d");
    for (let n of names.split(" "))
      expect(run(n.toUpperCase() + " " + (args[key] || ""), "3d")).toEqual(
        expected,
      );
  }
});
test("arithmetic precedence, unary signs and whitespace", () => {
  for (let [s, n] of [
    ["20 - 5 - 3", 12],
    ["2 + 3 * 4", 14],
    ["10-5", 5],
    ["10 - 5", 5],
    ["-(3 - 5)", 2],
    ["- -2", 2],
    ["+(2+3)*4", 20],
    ["12 / 3 / 2", 2],
    [".5", 0.5],
  ])
    expect(end("np " + s)).toEqual([0, n, 0]);
  for (let s of ["10 -5", "10- 5", "10 +5", "10 *5", "10 /5"])
    expect(error("np " + s).segments).toEqual([]);
});
test("forbidden numeric forms", () => {
  for (let s of ["1e3", "0x10", "NaN", "Infinity", "1.2.3"])
    expect(error("np " + s).segments).toEqual([]);
});
test("whole-program validation", () => {
  expect(error("np 20\nxyz").segments).toEqual([]);
  expect(error("np 20\ngrubosc 13").segments).toEqual([]);
  expect(error("np 20\npowtorz 1.5 [np 1]").segments).toEqual([]);
});
test("runtime errors preserve drawing and report argument start", () => {
  for (let [s, col] of [
    ["np 5 np (1 / 0)", 9],
    ["np 5 niech x 13 grubosc x", 25],
    ["np 5 np x niech x 2", 9],
  ]) {
    let r = error(s);
    expect(r.segments.length).toBe(1);
    expect(r.error.column).toBe(col);
  }
});
test("unassigned and undeclared variables", () => {
  expect(error("np foo").segments).toEqual([]);
  expect(error("np 4 np x niech x 2").segments.length).toBe(1);
  expect(error("jeśli 0 = 1 [niech x 2] np x").error.column).toBe(28);
  expect(run("niech constructor 8 np constructor").error).toBeNull();
});
test("variables, scopes and forward procedures", () => {
  let s = "niech x 10\nf 20\nnp x\noto f ma: x\n niech x x + 5\n np x\njuż";
  expect(end(s)).toEqual([0, 35, 0]);
  expect(end("niech x 5\nf\nnp x\noto f\n niech x 9\n np x\njuż")).toEqual([
    0, 14, 0,
  ]);
  expect(end("oto f :x\n np :x\nend\nf 12")).toEqual([0, 12, 0]);
  expect(end("oto f ma: f\n np f\njuż\nf 5")).toEqual([0, 5, 0]);
});
test("repeat lexical count", () => {
  expect(end("powtorz 2 [np nrpowt powtorz 2 [np repcount]]")).toEqual([
    0, 9, 0,
  ]);
  error("np nrpowt");
  error("oto f\nnp nrpowt\njuż\npowtorz 2 [f]");
  expect(run("powtorz 0 [np 2]").segments).toEqual([]);
});
test("conditionals exact comparison and stop", () => {
  expect(end("jeżeli 2 >= 2 [np 8] [np 4]")).toEqual([0, 8, 0]);
  expect(run("jeśli 0.1 + 0.2 = 0.3 [np 5]").segments).toEqual([]);
  expect(end("powtorz 5 [np 4 jeśli 1 = 1 [stop] np 8] np 9")).toEqual([
    0, 4, 0,
  ]);
  expect(end("oto f\npowtorz 5 [np 4 stop]\njuż\nf np 7")).toEqual([0, 11, 0]);
});
test("procedure syntax and nested definitions rejected", () => {
  for (let s of [
    "oto f\nnp 2",
    "oto f\nnp 2 już",
    "np 2 oto f\njuż",
    "oto f\njuż\noto f\njuż",
    "powtorz 2 [\noto f\nnp 2\njuż\nf\n]",
    "oto f ma: x, x\njuż",
    "oto f ma: x\nnp x\njuż\nf",
    "oto f ma: x\nnp x\njuż\nf 2 3",
  ])
    error(s);
});
test("right handed local basis", () => {
  let e = createExecution("pp 90 gora 90 np 10", "3d");
  while (!e.done) e.step();
  expect(e.state.pos[0]).toBeCloseTo(10);
  expect(e.state.pos[1]).toBeCloseTo(0);
  expect(e.state.pos[2]).toBeCloseTo(0);
  expect(end("gora 90 np 10", "3d")[2]).toBeCloseTo(10);
  expect(end("pw 90 np 10")[0]).toBeCloseTo(10);
  for (let s of ["gora", "dol", "pp", "pl"]) error(s + " 10", "2d");
});
test("pen, home, clear, lowercase colors and width", () => {
  let r = run('kolor "#ABCDEF" grubosc 5 np 10 pod np 10 dom opu np 8');
  expect(r.error).toBeNull();
  expect(r.segments.length).toBe(2);
  expect(r.segments[1]).toEqual({
    from: [0, 0, 0],
    to: [0, 8, 0],
    color: "#abcdef",
    width: 5,
  });
  expect(run("np 4 czyść np 3").segments).toEqual([
    { from: [0, 4, 0], to: [0, 7, 0], color: "#16866a", width: 3 },
  ]);
  expect(run("np 0").segments).toEqual([]);
  expect(run("np 5 dom").segments.length).toBe(2);
});
test("limits", () => {
  error(" ".repeat(50001));
  error("np 0 ".repeat(5001));
  error("powtorz 1 [".repeat(33) + "]".repeat(33));
  error("oto f\nf\njuż\nf");
  expect(error("powtorz 10000 []").segments).toEqual([]);
  expect(error("np 100000 np 1").segments.length).toBe(1);
  expect(run("powtorz 4999 [np 1 czyść]").error).not.toBeNull();
});
test("missing args and stray values location", () => {
  expect(error("np").error.column).toBe(1);
  expect(error("powtorz 1 [np ]").error.column).toBe(15);
  expect(error("np 1 2").error.column).toBe(6);
  expect(error("np (2 + )").error.column).toBe(9);
});
test("stepping and synchronous run are identical", () => {
  for (let ex of examples) {
    let e = createExecution(ex.source, ex.mode),
      steps = 0;
    while (!e.done) {
      e.step();
      steps++;
    }
    expect(e.result()).toEqual(run(ex.source, ex.mode));
    expect(steps).toBeLessThanOrEqual(10002);
  }
});
test("parameter sharing procedure name can be reassigned", () => {
  expect(end("oto f ma: f\nniech f f + 1\nnp f\njuż\nf 5")).toEqual([0, 6, 0]);
});
