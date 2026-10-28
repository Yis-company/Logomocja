import { describe, test, expect } from 'bun:test';
import { challenges, checkChallenge } from '../src/challenges';
describe('sprawdzanie wyzwań', () => {
  for (const c of challenges) test(c.title, () => {
    expect(checkChallenge(c, c.target).pass).toBe(true);
    expect(checkChallenge(c, 'kolor "#cc00aa" grubosc 12 ' + c.target).pass).toBe(true);
    expect(checkChallenge(c, '').pass).toBe(false);
    expect(checkChallenge(c, 'np 5').pass).toBe(false);
    expect(checkChallenge(c, c.target + ' błąd').pass).toBe(false);
  });
  test('podział boków i odwrócona kolejność są dozwolone', () => {
    expect(checkChallenge(challenges[0], 'powtorz 4 [np 50 np 50 pw 90]').pass).toBe(true);
    expect(checkChallenge(challenges[0], 'pw 90 powtorz 4 [np 100 lw 90]').pass).toBe(true);
  });
  test('ta sama długość w złym miejscu nie wystarcza', () => {
    expect(checkChallenge(challenges[0], 'pod np 10 opu ' + challenges[0].target).pass).toBe(false);
    expect(checkChallenge(challenges[0], 'powtorz 4 [np 100 lw 90]').pass).toBe(false);
  });
});
