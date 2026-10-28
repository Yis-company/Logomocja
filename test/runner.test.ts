import { beforeEach, describe, expect, test } from 'bun:test';
import { Runner, type RunnerSnapshot } from '../src/app/runner';

// Minimalny rAF, sterowany ręcznie.
let queue: ((t: number) => void)[] = [];
let now = 0;
beforeEach(() => {
  queue = [];
  now = 0;
  (globalThis as unknown as { requestAnimationFrame: unknown }).requestAnimationFrame = (cb: (t: number) => void) => {
    queue.push(cb);
    return queue.length;
  };
  (globalThis as unknown as { cancelAnimationFrame: unknown }).cancelAnimationFrame = () => {
    queue = [];
  };
});

function frame(ms = 16): void {
  now += ms;
  const q = queue;
  queue = [];
  for (const cb of q) cb(now);
}

function make() {
  const snaps: RunnerSnapshot[] = [];
  const runner = new Runner((s) => snaps.push(s));
  return { runner, snaps, last: () => snaps[snaps.length - 1] };
}

describe('Runner', () => {
  test('natychmiastowe wykonanie rysuje całość', () => {
    const { runner, last } = make();
    runner.runInstant('powtorz 4 [np 10 pw 90]', '2d');
    expect(last().state).toBe('done');
    expect(last().segments.length).toBe(4);
  });

  test('błąd składni nic nie rysuje, błąd wykonania zachowuje rysunek', () => {
    const { runner, last } = make();
    runner.runInstant('np 10 xyz', '2d');
    expect(last().state).toBe('error');
    expect(last().segments.length).toBe(0);
    expect(last().error?.column).toBe(7);
    runner.runInstant('np 10 np 1 / 0', '2d');
    expect(last().state).toBe('error');
    expect(last().segments.length).toBe(1);
  });

  test('krokowanie: każdy krok wykonuje jedno polecenie i wskazuje wiersz', () => {
    const { runner, last } = make();
    const src = 'np 10\npw 90\nnp 20';
    runner.stepOnce(src, '2d');
    expect(last().state).toBe('paused');
    expect(last().step).toEqual({ line: 1, col: 1 });
    expect(last().segments.length).toBe(1);
    runner.stepOnce(src, '2d');
    expect(last().step?.line).toBe(2);
    runner.stepOnce(src, '2d');
    expect(last().segments.length).toBe(2);
    runner.stepOnce(src, '2d');
    expect(last().state).toBe('done');
  });

  test('animacja, pauza i wznowienie', () => {
    const { runner, last } = make();
    runner.setSpeed(4); // 120 operacji na sekundę
    runner.start('powtorz 100 [np 1]', '2d');
    expect(last().state).toBe('running');
    frame(100); // ~12 operacji
    const n = last().segments.length;
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(100);
    runner.pause();
    expect(last().state).toBe('paused');
    frame(500);
    expect(last().segments.length).toBe(n);
    runner.resume();
    for (let i = 0; i < 100 && last().state === 'running'; i++) frame(100);
    expect(last().state).toBe('done');
    expect(last().segments.length).toBe(100);
  });

  test('edycja w trakcie działania przerywa, ale zostawia rysunek', () => {
    const { runner, last } = make();
    runner.setSpeed(4);
    runner.start('powtorz 100 [np 1]', '2d');
    frame(100);
    const n = last().segments.length;
    runner.interrupt('zmieniono kod');
    expect(last().state).toBe('idle');
    expect(last().note).toBe('zmieniono kod');
    expect(last().segments.length).toBe(n);
    frame(500);
    expect(last().segments.length).toBe(n);
  });

  test('tryb automatyczny dobiera tempo do wielkości programu', () => {
    const { runner, last } = make();
    runner.setSpeed(0);
    runner.start('powtorz 400 [np 1]', '2d');
    for (let i = 0; i < 5; i++) frame(100);
    const a = last().segments.length;
    expect(a).toBeGreaterThan(20);
    expect(a).toBeLessThan(400);
    for (let i = 0; i < 400 && last().state === 'running'; i++) frame(100);
    expect(last().state).toBe('done');
    expect(last().segments.length).toBe(400);
  });

  test('reset czyści rysunek', () => {
    const { runner, last } = make();
    runner.runInstant('np 10', '2d');
    runner.reset();
    expect(last().state).toBe('idle');
    expect(last().segments.length).toBe(0);
  });
});
