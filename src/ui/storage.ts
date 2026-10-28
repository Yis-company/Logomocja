import type { Mode } from '../lang/types';

const P = 'logomocja.';

export function get(key: string): string | null {
  try { return localStorage.getItem(P + key); } catch { return null; }
}
export function set(key: string, value: string): void {
  try { localStorage.setItem(P + key, value); } catch { /* storage unavailable or full */ }
}
export function remove(key: string): void {
  try { localStorage.removeItem(P + key); } catch { /* ignore */ }
}
function json<T>(key: string, fallback: T): T {
  try {
    const v = get(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
}

export const loadDraft = (m: Mode) => get(`draft.${m}`);
export const saveDraft = (m: Mode, s: string) => set(`draft.${m}`, s);
export const loadBackup = (m: Mode) => get(`backup.${m}`);
export const saveBackup = (m: Mode, s: string) => set(`backup.${m}`, s);
export const clearBackup = (m: Mode) => remove(`backup.${m}`);

export const loadMode = (): Mode => (get('mode') === '3d' ? '3d' : '2d');
export const saveMode = (m: Mode) => set('mode', m);

export type ThemePref = 'system' | 'light' | 'dark';
export const loadTheme = (): ThemePref => {
  const v = get('theme');
  return v === 'light' || v === 'dark' ? v : 'system';
};
export const saveTheme = (t: ThemePref) => set('theme', t);

export const loadSpeed = (): number => {
  const n = Number(get('speed'));
  return Number.isInteger(n) && n >= 1 && n <= 8 ? n : 5;
};
export const saveSpeed = (n: number) => set('speed', String(n));

export interface Progress {
  solved: Record<string, string>;
  drafts: Record<string, string>;
}
export const loadProgress = (): Progress => {
  const p = json<Partial<Progress>>('progress', {});
  return { solved: p.solved ?? {}, drafts: p.drafts ?? {} };
};
export const saveProgress = (p: Progress) => set('progress', JSON.stringify(p));
