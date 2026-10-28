import { test, expect } from "bun:test";
import { run } from "../src/interpreter";
import { challenges, checkChallenge } from "../src/challenges";
test("wzorce wszystkich wyzwań są akceptowane", () => {
  for (const c of challenges)
    expect(checkChallenge(c, run(c.target, c.mode)).passed, c.id).toBe(true);
});
test("sprawdzanie akceptuje podział linii, dowolny styl i inne polecenia", () => {
  expect(
    checkChallenge(
      challenges[0],
      run('kolor "#123456" grubosc 8 powtorz 10 [fd 10]'),
    ).passed,
  ).toBe(true);
});
test("sprawdzanie odrzuca pusty, niepełny, przesunięty i podwójny rysunek", () => {
  for (const s of [
    "",
    "np 50",
    "pod pw 90 np 10 lw 90 opu np 100",
    "np 100 ws 100",
  ])
    expect(checkChallenge(challenges[0], run(s)).passed, s).toBe(false);
  expect(checkChallenge(challenges[0], run("np 100 złe")).passed).toBe(false);
});
