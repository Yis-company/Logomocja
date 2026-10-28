import { expect, test } from "bun:test";
import { CHALLENGES, check } from "../src/challenges";

test("at least five challenges, each solvable by its own solution", () => {
  expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
  for (const c of CHALLENGES) expect(check(c, c.solution)).toMatchObject({ pass: true });
});
test("checker rejects wrong, partial, empty and broken programs", () => {
  const tri = CHALLENGES.find((c) => c.id === "trojkat")!;
  expect(check(tri, "powtorz 3 [np 100 pw 120]\nnp 50 lw 90 np 10").pass).toBe(false);
  expect(check(tri, "powtorz 2 [np 100 pw 120]").pass).toBe(false);
  expect(check(tri, "").pass).toBe(false);
  expect(check(tri, "np x").pass).toBe(false);
  // drawn differently but same picture: passes
  expect(check(tri, "pw 30 np 100 pw 120 np 100 pw 120 np 100").pass).toBe(false);
  expect(check(tri, "pw 60 np 100 lw 120 np 100 lw 120 np 100").pass).toBe(true);
});
