import type { Mode } from '../logo/index';

/** localStorage that never throws, e.g. in private windows where storage is refused. */
export const store = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable: the draft lives only for this page */
    }
  },
};

export const draftKey = (mode: Mode) => `logomocja.szkic.${mode}`;
export const copyKey = (mode: Mode) => `logomocja.kopia.${mode}`;
export const solvedKey = 'logomocja.wyzwania';
export const themeKey = 'logomocja.motyw';

export function solvedChallenges(): string[] {
  try {
    const v = JSON.parse(store.get(solvedKey) ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function markSolved(id: string) {
  const all = new Set(solvedChallenges());
  all.add(id);
  store.set(solvedKey, JSON.stringify([...all]));
}
