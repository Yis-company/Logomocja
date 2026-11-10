import { test, expect } from "bun:test";
import { CHALLENGES, check } from "../src/challenges";
import { EXAMPLES } from "../src/examples";
import { run } from "../src/interp/machine";

test("jest co najmniej pięć wyzwań, a każde wzorcowe rozwiązanie przechodzi", () => {
  expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
  for (const ch of CHALLENGES) expect({ id: ch.id, pass: check(ch, ch.solution).pass }).toEqual({ id: ch.id, pass: true });
});

test("pusty program i cudze rozwiązanie nie przechodzą", () => {
  for (const [i, ch] of CHALLENGES.entries()) {
    expect(check(ch, "").pass).toBe(false);
    const other = CHALLENGES[(i + 1) % CHALLENGES.length];
    if (other.mode === ch.mode) expect({ id: ch.id, pass: check(ch, other.solution).pass }).toEqual({ id: ch.id, pass: false });
  }
});

test("trójkąt: obrót i odbicie zaliczają, zła wielkość, nadmiar i błąd nie", () => {
  const ch = CHALLENGES.find((c) => c.id === "trojkat")!;
  expect(check(ch, "powtorz 3 [np 100 lw 120]").pass).toBe(true);
  expect(check(ch, "pw 90 powtorz 3 [np 100 pw 120]").pass).toBe(true);
  expect(check(ch, "powtorz 3 [np 50 lw 120]").pass).toBe(false);
  expect(check(ch, "powtorz 3 [np 100 lw 120] pw 90 np 30").pass).toBe(false);
  expect(check(ch, "np 100 pw 120 np 100").pass).toBe(false);
  expect(check(ch, "powtorz 3 [np 100 pw 120] np 1 / 0").pass).toBe(false);
});

test("programy wzorcowe: 13 sztuk, wszystkie wykonują się bez błędu", () => {
  expect(EXAMPLES.length).toBe(13);
  for (const ex of EXAMPLES) {
    const r = run(ex.source, ex.mode);
    expect({ id: ex.id, error: r.error }).toEqual({ id: ex.id, error: null });
    expect(r.segments.length).toBeGreaterThan(0);
  }
});
