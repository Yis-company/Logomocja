import { test, expect } from "bun:test";
import { run, createMachine, groups } from "./interpreter.js";
import { examples } from "./examples.js";
const end = (s) => run(s).segments.at(-1)?.to;
const good = (s, mode = "2d") => {
  const r = run(s, mode);
  expect(r.error).toBeNull();
  return r;
};
const bad = (s, line, column, kept = 0, mode = "2d") => {
  let r = run(s, mode);
  expect(r.error).not.toBeNull();
  if (line) expect(r.error.line).toBe(line);
  if (column) expect(r.error.column).toBe(column);
  expect(r.segments.length).toBe(kept);
  return r;
};
test("13 standard programs and flat parity", () => {
  const counts = [4, 5, 48, 90, 42, 255, 768, 12, 17, 36, 432, 240, 121];
  examples.forEach((e, i) => {
    expect(good(e.source, e.mode).segments.length).toBe(counts[i]);
    if (e.mode === "2d")
      expect(run(e.source, "3d")).toEqual(run(e.source, "2d"));
  });
});
test("arithmetic precedence, unary and whitespace", () => {
  for (const [s, n] of [
    ["20 - 5 - 3", 12],
    ["2 + 3 * 4", 14],
    ["10-5", 5],
    ["-(3 - 5)", 2],
    ["- -2", 2],
    [".5", 0.5],
    ["+ +2", 2],
  ])
    expect(end("np " + s)[1]).toBe(n);
  bad("np 10 -5", 1, 7);
  bad("np 10+ 5", 1, 6);
  bad("np 10 /2", 1, 7);
  expect(end("niech bok 4 np -bok")[1]).toBe(-4);
});
test("invalid numeric formats and tokens", () => {
  for (const n of ["1e3", "0x10", "NaN", "Infinity", "1.2.3"])
    bad("np " + n, 1, 4);
  bad("np 5\n?", 2, 1);
  bad("np 5\nnieznane", 2, 1);
  bad('np 5 kolor "#fff"', 1, 12);
});
test("whole validation and runtime preservation", () => {
  bad("np 5 grubosc 13", 1, 14);
  bad("np 5 powtorz 1.5 []", 1, 14);
  bad("np 5 np 1 / 0", 1, 9, 1);
  bad("np 5 niech a 13 grubosc a", 1, 25, 1);
  bad("np 5 czysc np 2 np 1 / 0", 1, 20, 1);
  expect(good("np 5 czysc np 2").segments[0].from).toEqual([0, 5, 0]);
});
test("variables and paths", () => {
  bad("np x", 1, 4);
  bad("np x niech x 4", 1, 4);
  bad("jeśli 1 = 0 [niech x 3] np 2 + x", 1, 28);
  expect(end("niech x 2 niech X x * 4 np :x")[1]).toBe(8);
  expect(end("jeżeli 1 < 2 [np 3] [np 4]")[1]).toBe(3);
  expect(good("jeśli 0.1 + 0.2 = 0.3 [np 4]").segments.length).toBe(0);
});
test("procedure declarations, parameters, forward calls, scope", () => {
  expect(end("kw 3 4\noto kw ma: a, b\nnp a * b\njuż")[1]).toBe(12);
  expect(end("oto foo :x\nnp :x\nend\nfoo 4")[1]).toBe(4);
  expect(end("niech x 9\noto p ma: p\nniech x p np x\njuż\np 3 np x")[1]).toBe(
    12,
  );
  bad("oto p\nnp nrpowt\njuż\npowtorz 2 [p]", 2, 4);
  bad("oto p ma: x, x\nnp x\njuż");
  bad("powtorz 2 [oto a\njuż]");
  bad("oto p\nnp 1");
  bad("oto p\nnp 1 już");
  bad("oto p\nnp 1\njuż\noto p\njuż");
});
test("stop unwinds procedures and repeats", () => {
  expect(
    good("powtorz 4 [np 1 jeśli 1 = 1 [stop] np 3] np 9").segments.length,
  ).toBe(1);
  expect(end("oto p\npowtorz 4 [np 1 stop]\njuż\np np 8")[1]).toBe(9);
});
test("lexical repeat counter and nested loops", () => {
  bad("np nrpowt", 1, 4);
  expect(
    end("powtorz 2 [np nrpowt powtorz 2 [np repcount] np nrpowt]")[1],
  ).toBe(12);
  good("powtorz 0 [np 1 / 0]");
});
test("home, pen, clear, colors and widths", () => {
  const r = good('kolor "#ABCDEF" grubosc 12 np 10 dom pod np 2 opu np 0 np 1');
  expect(r.segments.length).toBe(3);
  expect(r.segments[1].to).toEqual([0, 0, 0]);
  expect(r.segments[2].color).toBe("#abcdef");
  expect(r.segments[2].width).toBe(12);
});
test("3D basis rotations", () => {
  const near = (source, point) => {
    let p = good(source, "3d").segments.at(-1).to;
    point.forEach((v, i) => expect(p[i]).toBeCloseTo(v, 8));
  };
  near("gora 90 np 10", [0, 0, 10]);
  near("pp 90 gora 90 np 10", [10, 0, 0]);
  near("pp 90 pw 90 np 10", [0, 0, -10]);
  near("pw 90 np 10", [10, 0, 0]);
  near("gora 90 dom np 10", [0, 10, 0]);
  for (const s of ["gora", "dol", "pp", "pl"]) bad("np 2 " + s + " 90", 1, 6);
});
test("all movement aliases", () => {
  for (const [k, group] of Object.entries(groups)) {
    if (
      [
        "fd",
        "bk",
        "rt",
        "lt",
        "pitchup",
        "pitchdown",
        "rollright",
        "rollleft",
      ].includes(k)
    ) {
      for (const alias of group.split(" "))
        expect(good(alias.toUpperCase() + " 37 np 3", "3d")).toEqual(
          good(k + " 37 np 3", "3d"),
        );
    }
  }
});
test("limits", () => {
  bad(" ".repeat(50001), 1, 1);
  bad("np 1 ".repeat(5001));
  bad("np 100001", 1, 1);
  bad("oto p\np\njuż\np");
  bad("powtorz 10000 [] np 1");
  good("powtorz 9999 []");
  bad("powtorz 1 [".repeat(33) + "]".repeat(33));
  good("powtorz 1 [".repeat(32) + "]".repeat(32));
  bad("powtorz 10001 []", 1, 9);
});
test("missing arguments point to actual token or command at EOF", () => {
  bad("powtorz 1 [np ]", 1, 15);
  bad("np", 1, 1);
  bad("np (3 + )", 1, 9);
  bad("np 3 ]", 1, 6);
  bad("oto p ma: a, b\nnp a\njuż\np 4", 4, 1);
});
test("stepping shares synchronous execution", () => {
  const source = examples[3].source,
    m = createMachine(source);
  let steps = 0;
  while (!m.state.done) {
    m.step();
    steps++;
  }
  expect(steps).toBeGreaterThan(90);
  expect({ segments: m.state.segments, error: m.state.error }).toEqual(
    run(source),
  );
});
test("long expressions stay within language limits without JS stack errors", () => {
  expect(end("np " + "(".repeat(4000) + "2" + ")".repeat(4000))[1]).toBe(2);
  expect(end("np " + "- ".repeat(9000) + "2")[1]).toBe(2);
  expect(end("np " + Array(4500).fill("1").join("+"))[1]).toBe(4500);
  good("grubosc " + Array(4000).fill("0").join("+") + "+3");
});
test("ordinary identifiers never collide with JavaScript object prototypes", () => {
  expect(
    end("niech constructor 4 niech __proto__ 3 np constructor + __proto__")[1],
  ).toBe(7);
  expect(
    end("oto constructor\nniech __proto__ 3 np __proto__\njuż\nconstructor")[1],
  ).toBe(3);
});
test('local assignments shadow globals from execution until the call ends', () => {
  expect(end('niech x 9\noto p\nnp x niech x 3 np x\njuż\np np x')[1]).toBe(21);
  bad('oto p\nnp x niech x 3\njuż\np', 2, 4);
});
test('large finite angles cannot overflow the degree conversion', () => {
  good('pw ' + '1' + '0'.repeat(308) + ' np 10');
});
