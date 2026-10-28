import { describe, expect, test } from 'bun:test';
import { judge } from '../src/logo/check';
import { CHALLENGES } from '../src/logo/challenges';

const byId = (id: string) => CHALLENGES.find((c) => c.id === id)!;

describe('challenges', () => {
  test('there are at least five, with unique ids', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
  });

  test('every reference program passes its own challenge', () => {
    for (const c of CHALLENGES) {
      const v = judge(c.reference, c);
      expect(v.passed).toBe(true);
    }
  });

  test('a different shape fails with a reason', () => {
    const v = judge('powtorz 3 [np 100 pw 120]', byId('kwadrat'));
    expect(v.passed).toBe(false);
  });

  test('a square of another size fails', () => {
    const v = judge('powtorz 4 [np 50 pw 90]', byId('kwadrat'));
    expect(v.passed).toBe(false);
    expect(v.reason).toContain('Brakuje');
  });

  test('the same square drawn as four separate strokes still passes', () => {
    const v = judge('np 100 pw 90 np 100 pw 90 np 100 pw 90 np 100 pw 90', byId('kwadrat'));
    expect(v.passed).toBe(true);
  });

  test('a program with an error fails and names the position', () => {
    const v = judge('np 100 pw', byId('kwadrat'));
    expect(v.passed).toBe(false);
    expect(v.reason).toContain('wiersz 1');
  });

  test('an empty drawing fails', () => {
    expect(judge('pod powtorz 4 [np 100 pw 90]', byId('kwadrat')).passed).toBe(false);
  });

  test('a required keyword is enforced', () => {
    const flat = 'powtorz 6 [np 60 pw 60]';
    const v = judge(flat, byId('szesciokat'));
    expect(v.passed).toBe(false);
    expect(v.reason).toContain('oto');
  });
});
