import { expect, test } from "bun:test";
import { CHALLENGES, checkChallenge, targetOf } from "../src/core/challenges";
import { compareDrawings } from "../src/core/check";
import { run } from "../src/core/interp";

test("jest co najmniej pięć zadań, a rozwiązania wzorcowe przechodzą", () => {
  expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
  for (const c of CHALLENGES) {
    expect(targetOf(c).length).toBeGreaterThan(0);
    expect(checkChallenge(c, c.solution).pass).toBe(true);
    expect(checkChallenge(c, c.starter).pass).toBe(false);
  }
});

test("inna kolejność, kierunek i podział odcinków też przechodzą", () => {
  const tri = CHALLENGES.find((c) => c.id === "trojkat")!;
  expect(checkChallenge(tri, "pw 30 powtorz 3 [np 50 np 50 pw 120]").pass).toBe(false);
  expect(checkChallenge(tri, "np 100 pw 120 np 100 pw 120 np 50 np 50").pass).toBe(true);
  expect(checkChallenge(tri, 'kolor "#ff0000" pod np 100 opu ws 100 np 100 pw 120 powtorz 2 [np 100 pw 120]').pass).toBe(true);
});

test("powody niepowodzenia", () => {
  const tri = CHALLENGES.find((c) => c.id === "trojkat")!;
  expect(checkChallenge(tri, "np 100").reason).toContain("Brakuje");
  expect(checkChallenge(tri, "powtorz 3 [np 100 pw 120] pw 180 np 60").reason).toContain("poza");
  expect(checkChallenge(tri, "powtorz 3 [np 50 pw 120]").pass).toBe(false);
  expect(checkChallenge(tri, "np 1 / 0").reason).toContain("błędzie");
  expect(checkChallenge(tri, "pod np 10").reason).toContain("żadnej kreski");
});

test("zadania 3D porównują się w przestrzeni", () => {
  const c = CHALLENGES.find((x) => x.id === "naroznik")!;
  expect(checkChallenge(c, "gora 90 np 80 ws 80 dol 90 np 80 ws 80 pw 90 np 80").pass).toBe(true);
  expect(checkChallenge(c, "np 80 ws 80 pw 90 np 80 ws 80 lw 90 dol 90 np 80").pass).toBe(false);
  const flat = run("powtorz 4 [np 100 pw 90]", "3d").segments;
  expect(compareDrawings(flat, flat).pass).toBe(true);
});
