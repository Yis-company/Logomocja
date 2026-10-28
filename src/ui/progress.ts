import { storageGet, storageSet } from './util';

const KEY = 'logomocja.postep';

/** Ids of the challenges that have been passed. */
export function progressOf(): string[] {
  try {
    const v = JSON.parse(storageGet(KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function markPassed(id: string): void {
  const done = new Set(progressOf());
  done.add(id);
  storageSet(KEY, JSON.stringify([...done]));
}
