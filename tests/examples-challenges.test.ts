import { describe, expect, test } from 'bun:test';
import { EXAMPLES } from '../src/logo/examples';
import { CHALLENGES, checkChallenge } from '../src/logo/challenges';
import { runProgram } from '../src/logo/index';

describe('standard programs', () => {
  test('there are thirteen of them and each runs without error', () => {
    expect(EXAMPLES.length).toBe(13);
    for (const e of EXAMPLES) {
      const r = runProgram(e.source, e.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    }
  });
  test('the 3D examples only use commands that exist in 3D', () => {
    for (const e of EXAMPLES.filter((x) => x.mode === '2d')) {
      expect(runProgram(e.source, '2d').error).toBeNull();
    }
  });
  test('flat programs give the same drawing in 2D and 3D', () => {
    const flat = EXAMPLES.find((e) => e.name === 'wielokaty')!.source;
    expect(runProgram(flat, '3d').segments).toEqual(runProgram(flat, '2d').segments);
  });
});

describe('challenges', () => {
  test('each reference solution passes its own challenge', () => {
    for (const c of CHALLENGES) {
      const r = checkChallenge(c, c.expected);
      expect(r.ok).toBe(true);
    }
  });
  test('there are at least five challenges', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
  });
  test('a wrong drawing fails with a reason', () => {
    const c = CHALLENGES.find((x) => x.id === 'kwadrat-100')!;
    const r = checkChallenge(c, 'powtorz 3 [np 100 pw 120]');
    expect(r.ok).toBe(false);
    expect(r.reason.length).toBeGreaterThan(0);
  });
  test('a program with an error and an empty drawing fail', () => {
    const c = CHALLENGES[0];
    expect(checkChallenge(c, 'np').ok).toBe(false);
    expect(checkChallenge(c, '').reason).toContain('Nic');
  });
  test('the requirement check is applied', () => {
    const c = CHALLENGES.find((x) => x.id === 'szesciokat-procedura')!;
    expect(checkChallenge(c, 'powtorz 6 [np 50 pw 60]').ok).toBe(false);
  });
});
