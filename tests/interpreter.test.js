import { test, expect } from "bun:test";
import { run, createExecution } from "../src/interpreter.js";
import { examples } from "../src/examples.js";
const end = (s, m = "2d") => run(s, m).segments.at(-1)?.to;
test("all 13 standard programs", () => {
  expect(examples.length).toBe(13);
  for (let e of examples) {
    let r = run(e[4], e[2]);
    expect({ name: e[1], error: r.error }).toEqual({ name: e[1], error: null });
    expect(r.segments.length).toBeGreaterThan(0);
  }
});
test("precedence, unary signs, legacy variables and whitespace", () => {
  for (let [s, n] of [
    ["20 - 5 - 3", 12],
    ["2 + 3 * 4", 14],
    ["10-5", 5],
    ["-(3 - 5)", 2],
    ["- -2", 2],
    [".5", 0.5],
  ])
    expect(end("np " + s)[1]).toBe(n);
  expect(run("np 10 -5").segments).toEqual([]);
  expect(run("np 10 *2").error.column).toBe(7);
  expect(end("niech bok 4 np -bok np :bok")[1]).toBe(0);
});
test("all aliases and flat geometry", () => {
  expect(end("forward 5 right 90 back 3 left 90 fd 2")).toEqual([-3, 7, 0]);
  expect(run("np 4 pw 23 np 6", "2d").segments).toEqual(
    run("np 4 pw 23 np 6", "3d").segments,
  );
  expect(run("góra 20").error).not.toBeNull();
});
test("orientation pitch and roll", () => {
  let p = end("gora 90 np 10", "3d");
  expect(p[2]).toBeCloseTo(10);
  p = end("pp 90 gora 90 np 10", "3d");
  expect(p[0]).toBeCloseTo(10);
  p = end("pp 90 pw 90 np 10", "3d");
  expect(p[2]).toBeCloseTo(-10);
});
test("whole program validation and literal ranges", () => {
  for (let s of [
    "np 10 abc",
    "np 10 grubosc 13",
    "np 10 powtorz 1.5 []",
    "np 10 np foo",
    "np 10 np 1e3",
    "np 10 np 0x10",
    "np 10 np NaN",
    "np 10 np Infinity",
    'np 10 kolor "red"',
    "np 10 [",
    "np 10 nrpowt",
  ])
    expect(run(s).segments).toEqual([]);
});
test("runtime errors retain drawing and report argument start", () => {
  let r = run("np 10\nnp 2 / 0");
  expect(r.segments.length).toBe(1);
  expect(r.error).toMatchObject({ line: 2, column: 4 });
  r = run("np 10 niech x 13 grubosc x");
  expect(r.segments.length).toBe(1);
  expect(r.error.column).toBe(26);
  expect(run("np 10 czyść np 2 / 0").segments.length).toBe(0);
});
test("declarations, path and call scopes", () => {
  expect(run("np x niech x 2").error.column).toBe(4);
  expect(run("jeśli 0 = 1 [niech x 4] np x").error).not.toBeNull();
  expect(
    end("niech x 5\noto p ma: x\nniech x x + 2 np x\njuż\np 10 np x")[1],
  ).toBe(17);
  expect(run("oto p\nnp x\njuż\nniech x 3 p").error).toBeNull();
});
test("procedures, forward calls, recursion and stop", () => {
  expect(
    end("p 4\noto p ma: n\n jeśli n = 0 [stop]\n np 1 p n - 1\njuż")[1],
  ).toBe(4);
  expect(end("oto p :n\nnp :n stop np 100\nend\np 7 np 2")[1]).toBe(9);
  expect(run("oto p\np\njuż\np").error.message).toContain("32");
  expect(run("oto p\nnp 2").error).not.toBeNull();
  expect(run("powtorz 1 [oto p\nnp 1\njuż\n]").error).not.toBeNull();
});
test("lexical repeat count and exact comparisons", () => {
  expect(end("powtorz 3 [powtorz 2 [np nrpowt] np nrpowt]")[1]).toBe(15);
  expect(run("oto p\nnp nrpowt\njuż\npowtorz 2 [p]").error).not.toBeNull();
  expect(run("jeśli 0.1 + 0.2 = 0.3 [np 1]").segments).toHaveLength(0);
  expect(end("jeżeli 1 <> 2 [np 3] [np 4]")[1]).toBe(3);
});
test("home, clear and zero distance", () => {
  let r = run("np 10 pw 90 dom np 2");
  expect(r.segments).toHaveLength(3);
  expect(r.segments.at(-1).to).toEqual([0, 2, 0]);
  expect(run("np 0").segments).toHaveLength(0);
  expect(end("np 10 czysc np 3")[1]).toBe(13);
});
test("limits and step equivalence", () => {
  expect(run("powtorz 10000 [np 1]").error.message).toContain("operacji");
  expect(run("np 100001").error).not.toBeNull();
  expect(run(" ".repeat(50001)).error).not.toBeNull();
  expect(run("powtorz 1 [".repeat(33) + "]".repeat(33)).error).not.toBeNull();
  let e = createExecution("powtorz 4 [np 10 pw 90]");
  let steps = 0;
  while (!e.step().done) steps++;
  expect(steps).toBe(9);
  expect(e.state.segments).toEqual(run("powtorz 4 [np 10 pw 90]").segments);
});
test("parameter can share procedure name and be reassigned", () => {
  expect(end("oto bok ma: bok\nniech bok bok + 1 np bok\njuż\nbok 4")[1]).toBe(
    5,
  );
});
test("names are case insensitive and prototype safe", () => {
  expect(
    end(
      "OTO P ma: __proto__\nniech __proto__ __proto__ + 1 np __proto__\nJUŻ\np 4",
    )[1],
  ).toBe(5);
  expect(end("oto p\nniech __proto__ 9 np __proto__\njuż\np")[1]).toBe(9);
  expect(end("Niech DŁ 5 NP :dł")[1]).toBe(5);
});
test("expressions within token limit do not exhaust JS recursion", () => {
  expect(end("np " + "(".repeat(4000) + "2" + ")".repeat(4000))[1]).toBe(2);
  expect(end("np " + Array(4000).fill("1").join("+"))[1]).toBe(4000);
  expect(end("np " + "-".repeat(8000) + "2")[1]).toBe(2);
});

test("exact operation and token boundaries", () => {
  expect(run("powtorz 9999 []").error).toBeNull();
  expect(run("powtorz 10000 []").error.message).toContain("operacji");
  expect(run("pu ".repeat(10000)).error).toBeNull();
  expect(run("pu ".repeat(10001)).error.message).toContain("tokenów");
  expect(
    run("oto p\npd\njuż\n".replace("pd", "if 1=1 []".repeat(32)) + "p").error,
  ).toBeNull();
});

test("bad arguments and structural errors have precise positions", () => {
  for (const [source, line, column] of [
    ["np", 1, 1],
    ["powtorz 1 [np ]", 1, 15],
    ["np )", 1, 4],
    ["np 1\nnp z", 2, 4],
    ["np 1\ngrubosc (13)", 2, 9],
    ['np 1\nkolor "#123"', 2, 7],
    ["np 1\nniech x 2\ngrubosc x + 11", 3, 9],
  ])
    expect(run(source).error).toMatchObject({ line, column });
  expect(run("oto p ma: a, a\nnp a\njuż").error).not.toBeNull();
  expect(run("oto p\nnp 1\njuż np 2").error).not.toBeNull();
  expect(run("oto p\nnp 1\njuż\noto p\nnp 2\njuż").error).not.toBeNull();
});
