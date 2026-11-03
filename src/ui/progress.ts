import { store } from './storage';

interface Progress {
  [id: string]: { solvedAt: number };
}

const listeners = new Set<() => void>();

export function getProgress(): Progress {
  return store.getJSON<Progress>('progress', {});
}

export function isSolved(id: string) {
  return !!getProgress()[id];
}

export function markSolved(id: string) {
  const p = getProgress();
  if (!p[id]) {
    p[id] = { solvedAt: Date.now() };
    store.setJSON('progress', p);
    listeners.forEach((f) => f());
  }
}

export function resetProgress() {
  store.remove('progress');
  listeners.forEach((f) => f());
}

export function onProgress(f: () => void) {
  listeners.add(f);
}
