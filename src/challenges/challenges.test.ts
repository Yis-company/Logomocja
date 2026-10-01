import { describe, expect, it } from "vitest";
import { compareGeometry, runChallenge, validateSource } from "./judge";
import {
  CHALLENGE_KEY,
  readChallenges,
  recordFor,
  writeChallenges,
} from "./storage";
import { challenges, expectedDrawing, starter } from "./tasks";

const task = (id: string) => {
  const found = challenges.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Missing task ${id}`);
  return found;
};
const square = task("kwadrat");
const segment = (a: [number, number, number], b: [number, number, number]) => ({
  from: a,
  to: b,
  color: "red",
  width: 9,
});

describe("challenge geometry", () => {
  it("accepts reversed, subdivided and overlapping traces", () => {
    const expected = expectedDrawing(square, [60]);
    const split = expected.flatMap(({ from, to }) => {
      const middle = from.map((value, i) => (value + to[i]) / 2) as [
        number,
        number,
        number,
      ];
      return [segment(to, middle), segment(middle, from)];
    });
    expect(
      compareGeometry(expected, [...split.reverse(), split[0]]).passed,
    ).toBe(true);
  });

  it("rejects a missing edge, a gap, an extra connector and a displacement", () => {
    const expected = expectedDrawing(square, [60]);
    expect(compareGeometry(expected, expected.slice(0, 3)).passed).toBe(false);
    expect(
      compareGeometry(expected, [...expected, segment([0, 0, 0], [60, 60, 0])])
        .passed,
    ).toBe(false);
    expect(
      compareGeometry(
        expected,
        expected.map(({ from, to }) =>
          segment([from[0] + 1, from[1], 0], [to[0] + 1, to[1], 0]),
        ),
      ).passed,
    ).toBe(false);
    const withGap = [
      ...expected.slice(1),
      segment([0, 0, 0], [0, 20, 0]),
      segment([0, 20.01, 0], [0, 60, 0]),
    ];
    expect(compareGeometry(expected, withGap).passed).toBe(false);
  });

  it("has anchored independent fixtures for all six tasks", () => {
    expect(challenges).toHaveLength(6);
    for (const challenge of challenges) {
      const fixture = expectedDrawing(challenge, challenge.sample);
      expect(fixture.length).toBeGreaterThan(0);
      expect(fixture.length).toBeLessThan(128);
      expect(fixture[0].from).toEqual([0, 0, 0]);
      expect(compareGeometry(fixture, fixture).passed).toBe(true);
      expect(
        compareGeometry(
          fixture,
          fixture.map(({ from, to }) => segment(from, to)),
        ).passed,
      ).toBe(true);
    }
    expect(expectedDrawing(task("schody3d"), [2, 40, 25]).at(-1)?.to).toEqual([
      0, 80, 50,
    ]);
    expect(expectedDrawing(task("rozeta"), [60])[4].to[0]).toBeCloseTo(
      -60 / Math.sqrt(2),
    );
  });
});

describe("challenge source and execution", () => {
  it("matches independent fixtures with real Logo solutions across every task and boundary", async () => {
    globalThis.requestAnimationFrame = (callback) =>
      setTimeout(() => callback(performance.now()), 0) as unknown as number;
    const solutions: Record<string, string> = {
      kwadrat: "oto kwadrat :x\npowtorz 4 [np :x pw 90]\njuż",
      gwiazda: "oto gwiazda :x\npowtorz 5 [np :x pw 144]\njuż",
      schody:
        "oto schody :ile :dl\npowtorz :ile [np :dl pw 90 np :dl lw 90]\njuż",
      rzad: "oto rzad :ile :dl\npowtorz :ile [powtorz 4 [np :dl pw 90] pod pw 90 np :dl np :dl lw 90 opu]\njuż",
      rozeta: "oto rozeta :dl\npowtorz 8 [powtorz 4 [np :dl pw 90] lw 45]\njuż",
      schody3d:
        "oto schody3d :ile :dl :h\npowtorz :ile [np :dl gora 90 np :h dol 90]\njuż",
    };
    for (const challenge of challenges) {
      const answer = await runChallenge(
        solutions[challenge.id],
        challenge,
        challenge.cases,
      );
      expect(answer?.error, challenge.id).toBeUndefined();
      expect(answer?.passed, challenge.id).toBe(6);
      expect(
        answer?.cases.every(
          (item) =>
            compareGeometry(expectedDrawing(challenge, item.args), item.actual)
              .passed,
        ),
        challenge.id,
      ).toBe(true);
    }
  });

  it("requires only definitions with the exact procedure contract", () => {
    expect(() => validateSource(`${starter(square)}\nnp 10`, square)).toThrow(
      /poza nimi/,
    );
    expect(() =>
      validateSource("oto kwadrat :x :y\nnp :x\njuż", square),
    ).toThrow(/parametrów/);
    expect(
      validateSource("oto kwadrat :x\nnp :x\njuż", square).instructions,
    ).toHaveLength(0);
    expect(() => validateSource("oto inne :bok\nnp :bok\njuż", square)).toThrow(
      /kwadrat/,
    );
    expect(
      validateSource("oto kwadrat :bok\npowtorz 4 [np :bok pw 90]\njuż", square)
        .instructions,
    ).toHaveLength(0);
  });

  it("checks varied inputs and rejects a single hardcoded sample", async () => {
    globalThis.requestAnimationFrame = (callback) =>
      setTimeout(() => callback(performance.now()), 0) as unknown as number;
    const good = await runChallenge(
      "oto kwadrat :bok\npowtorz 4 [np :bok pw 90]\njuż",
      square,
      square.cases,
    );
    expect(good?.passed).toBe(6);
    const hardcoded = await runChallenge(
      "oto kwadrat :bok\npowtorz 4 [np 60 pw 90]\njuż",
      square,
      square.cases,
    );
    expect(hardcoded?.passed).toBe(1);
  });

  it("reports runtime limits and honors cancellation", async () => {
    globalThis.requestAnimationFrame = (callback) =>
      setTimeout(() => callback(performance.now()), 0) as unknown as number;
    const huge = await runChallenge(
      "oto kwadrat :bok\npowtorz 10000 [np 1]\njuż",
      square,
      [square.sample],
    );
    expect(huge?.cases[0].passed).toBe(false);
    expect(huge?.cases[0].message).toMatch(/limit/);
    const controller = new AbortController();
    controller.abort();
    expect(
      await runChallenge(starter(square), square, square.cases, {
        signal: controller.signal,
      }),
    ).toBeNull();
  });
});

describe("challenge storage", () => {
  it("keeps drafts and completions by task and version", () => {
    const data = new Map<string, string>();
    const store = {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => {
        data.set(key, value);
      },
    };
    expect(
      writeChallenges(store, {
        kwadrat: { version: 1, draft: "own", completed: true },
      }),
    ).toBe(true);
    expect(recordFor(readChallenges(store), square)).toEqual({
      version: 1,
      draft: "own",
      completed: true,
    });
    expect(recordFor(readChallenges(store), task("gwiazda")).draft).toBe(
      starter(task("gwiazda")),
    );
    data.set(
      CHALLENGE_KEY,
      JSON.stringify({
        version: 1,
        records: { kwadrat: { version: 2, draft: "old", completed: true } },
      }),
    );
    expect(readChallenges(store).kwadrat).toBeUndefined();
  });

  it("stays usable if browser storage fails", () => {
    expect(
      readChallenges({
        getItem: () => {
          throw Error("denied");
        },
      }),
    ).toEqual({});
    expect(
      writeChallenges(
        {
          setItem: () => {
            throw Error("denied");
          },
        },
        {},
      ),
    ).toBe(false);
  });
});
