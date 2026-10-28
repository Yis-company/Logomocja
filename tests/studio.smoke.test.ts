import { beforeAll, describe, expect, test } from 'bun:test';
import { Window } from 'happy-dom';

beforeAll(() => {
  if (!(globalThis as { window?: unknown }).window) {
    const win = new Window({ url: 'http://localhost/' });
    Object.assign(globalThis, { window: win, document: win.document, localStorage: win.localStorage, HTMLElement: win.HTMLElement, HTMLCanvasElement: win.HTMLCanvasElement, Element: win.Element, Event: win.Event, CustomEvent: win.CustomEvent, DOMRect: win.DOMRect, Blob: win.Blob, KeyboardEvent: win.KeyboardEvent, getComputedStyle: win.getComputedStyle.bind(win), btoa, atob });
  }
  // Canvas and layout APIs that happy-dom does not provide.
  const ctxStub: Record<PropertyKey, unknown> = new Proxy({} as Record<PropertyKey, unknown>, {
    get: (t, k) => (k in t ? t[k] : () => ({ width: 0 })),
    set: (t, k, v) => ((t[k] = v), true),
  });
  HTMLCanvasElement.prototype.getContext = (() => ctxStub) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toBlob = function (cb: BlobCallback) { cb(new Blob(['x'], { type: 'image/png' })); };
  (globalThis as Record<string, unknown>).ResizeObserver ??= class { observe() {} disconnect() {} unobserve() {} };
  Element.prototype.getBoundingClientRect ??= () => ({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600, x: 0, y: 0, toJSON() {} }) as DOMRect;
  const raf = (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16) as unknown as number;
  const caf = (id: number) => clearTimeout(id);
  Object.assign(globalThis, { requestAnimationFrame: raf, cancelAnimationFrame: caf });
  Object.assign(window, { requestAnimationFrame: raf, cancelAnimationFrame: caf });
  const mm = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  Object.assign(globalThis, { matchMedia: mm });
  Object.assign(window, { matchMedia: mm });
});

describe('studio (DOM smoke test)', () => {
  test('mounts, runs, steps and reports a parse error', async () => {
    const { Studio } = await import('../src/ui/studio');
    const root = document.createElement('div');
    document.body.append(root);
    const s = new Studio(root, { kind: 'mode', mode: '2d' });
    await s.ready;
    expect(root.querySelector('[data-editor] textarea')).not.toBeNull();

    const ta = root.querySelector('textarea')!;
    ta.value = 'powtorz 4 [np 100 pw 90]';
    ta.dispatchEvent(new Event('input'));
    s.flushDraft();
    expect(localStorage.getItem('logomocja.szkic.2d')).toBe('powtorz 4 [np 100 pw 90]');

    const run = root.querySelector<HTMLButtonElement>('[data-act="run"]')!;
    run.click();
    await new Promise((r) => setTimeout(r, 50));
    s.destroy();
  });

  test('a parse error shows the Polish message with position', async () => {
    const { Studio } = await import('../src/ui/studio');
    const root = document.createElement('div');
    document.body.append(root);
    localStorage.setItem('logomocja.szkic.2d', 'np 10\nnp 5 blabla');
    const s = new Studio(root, { kind: 'mode', mode: '2d' });
    await s.ready;
    root.querySelector<HTMLButtonElement>('[data-act="run"]')!.click();
    const err = root.querySelector('[data-error]')!.textContent!;
    expect(err).toContain('Wiersz 2, kolumna 6');
    expect(err).toContain('blabla');
    s.destroy();
    localStorage.removeItem('logomocja.szkic.2d');
  });

  test('step moves the highlight one statement at a time', async () => {
    const { Studio } = await import('../src/ui/studio');
    const root = document.createElement('div');
    document.body.append(root);
    localStorage.setItem('logomocja.szkic.2d', 'np 10\npw 90\nnp 10');
    const s = new Studio(root, { kind: 'mode', mode: '2d' });
    await s.ready;
    const step = () => root.querySelector<HTMLButtonElement>('[data-act="step"]')!.click();
    const exec = () => root.querySelector('.gn.exec')?.textContent;
    step();
    expect(exec()).toBe('1');
    step();
    expect(exec()).toBe('2');
    step();
    expect(exec()).toBe('3');
    step();
    expect(root.querySelector('.gn.exec')).toBeNull();
    s.destroy();
    localStorage.removeItem('logomocja.szkic.2d');
  });

  test('a challenge panel checks a solution and records progress', async () => {
    const { Studio } = await import('../src/ui/studio');
    const { CHALLENGES } = await import('../src/logo/challenges');
    const root = document.createElement('div');
    document.body.append(root);
    const s = new Studio(root, { kind: 'challenge', challenge: CHALLENGES[0] });
    await s.ready;
    const ta = root.querySelector('textarea')!;
    ta.value = 'powtorz 4 [np 100 pw 90]';
    ta.dispatchEvent(new Event('input'));
    root.querySelector<HTMLButtonElement>('[data-act="check"]')!.click();
    expect(root.querySelector('.verdict')!.textContent).toContain('Zgadza się');
    expect(localStorage.getItem('logomocja.postep')).toContain('kwadrat');
    s.destroy();
    localStorage.removeItem('logomocja.postep');
    localStorage.removeItem('logomocja.wyzwanie.kwadrat');
  });
});
