import { describe, expect, test } from 'bun:test';
import { run } from '../src/lang';
import { EXAMPLES } from '../src/data/examples';
import { REFERENCE } from '../src/data/reference';
import { CHALLENGES } from '../src/challenges/challenges';
import { checkChallenge, compareDrawings } from '../src/challenges/checker';

describe('standard programs', () => {
  test('there are thirteen, with the names and modes from the brief', () => {
    expect(EXAMPLES.map((e) => `${e.name}:${e.mode}`)).toEqual([
      'kwadrat:2d', 'gwiazda:2d', 'rozeta:2d', 'spirala:2d', 'wielokaty:2d', 'drzewo:2d', 'sniezynka:2d',
      'schody:3d', 'szescian:3d', 'pierscien:3d', 'kula:3d', 'helisa:3d', 'drzewo3d:3d',
    ]);
  });

  test('each runs without error and draws the expected number of strokes', () => {
    const expected: Record<string, number> = {
      kwadrat: 4, gwiazda: 5, rozeta: 48, spirala: 90, wielokaty: 42, drzewo: 255, sniezynka: 768,
      schody: 12, szescian: 17, pierscien: 36, kula: 432, helisa: 240, drzewo3d: 121,
    };
    for (const example of EXAMPLES) {
      const result = run(example.source, example.mode);
      expect({ name: example.name, error: result.error }).toEqual({ name: example.name, error: null });
      expect({ name: example.name, count: result.segments.length }).toEqual({
        name: example.name,
        count: expected[example.name],
      });
    }
  });

  test('every standard program ends with a newline, as a saved file would', () => {
    for (const example of EXAMPLES) expect(example.source.endsWith('\n')).toBe(true);
  });
});

describe('documentation examples', () => {
  test('every example in the reference runs without error', () => {
    const examples = REFERENCE.flatMap((section) => section.items.flatMap((item) => (item.example ? [{ id: item.id, ...item.example }] : [])));
    expect(examples.length).toBeGreaterThan(15);
    for (const example of examples) {
      const result = run(example.code, example.mode);
      expect({ id: example.id, error: result.error }).toEqual({ id: example.id, error: null });
      expect({ id: example.id, drawn: result.segments.length > 0 }).toEqual({ id: example.id, drawn: true });
    }
  });
});

describe('challenges', () => {
  test('there are at least five, with unique ids', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
  });

  test('every reference solution runs and passes its own check', () => {
    for (const challenge of CHALLENGES) {
      const result = checkChallenge(challenge, challenge.reference);
      expect({ id: challenge.id, passed: result.passed, message: result.message }).toEqual({
        id: challenge.id,
        passed: true,
        message: 'Zaliczone! Rysunek zgadza się ze wzorem.',
      });
    }
  });

  test('a square of the wrong size fails with a reason', () => {
    const square = CHALLENGES.find((c) => c.id === 'kwadrat-100')!;
    const result = checkChallenge(square, 'powtorz 4 [np 120 pw 90]');
    expect(result.passed).toBe(false);
    expect(result.message.length).toBeGreaterThan(10);
  });

  test('a drawing with the right shape but another start point fails', () => {
    const square = CHALLENGES.find((c) => c.id === 'kwadrat-100')!;
    expect(checkChallenge(square, 'np 30 powtorz 4 [np 100 pw 90]').passed).toBe(false);
  });

  test('the same drawing, drawn in another order, passes', () => {
    const square = CHALLENGES.find((c) => c.id === 'kwadrat-100')!;
    const reversed = 'np 100 pw 90 np 100 pw 90 np 100 pw 90 np 100 pw 90';
    expect(checkChallenge(square, reversed).passed).toBe(true);
    expect(checkChallenge(square, 'lw 90 np 100 lw 90 np 100 lw 90 np 100 lw 90 np 100').passed).toBe(false);
  });

  test('a program with an error fails and says where', () => {
    const square = CHALLENGES.find((c) => c.id === 'kwadrat-100')!;
    const result = checkChallenge(square, 'powtorz 4 [np 100 pw]');
    expect(result.passed).toBe(false);
    expect(result.message).toContain('linii 1');
  });

  test('small position differences within tolerance pass; larger ones do not', () => {
    const a = run('np 100', '2d').segments;
    expect(compareDrawings(a, run('np 100.5', '2d').segments).ok).toBe(true);
    expect(compareDrawings(a, run('np 102', '2d').segments).ok).toBe(false);
  });

  test('the checker is 2D and 3D aware: a vertical square fails as a flat one', () => {
    const vertical = CHALLENGES.find((c) => c.id === 'pionowy-kwadrat')!;
    expect(checkChallenge(vertical, 'powtorz 4 [np 80 pw 90]').passed).toBe(false);
  });
});
