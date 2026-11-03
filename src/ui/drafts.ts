import type { Mode } from '../lang/ast';
import { isDisposable } from '../examples';
import { store } from './storage';

export type DraftKey = Mode | `task:${string}`;

export function loadDraft(key: DraftKey): string | null {
  return store.get(`draft:${key}`);
}

export function saveDraft(key: DraftKey, text: string) {
  store.set(`draft:${key}`, text);
}

/** Keeps the learner's own work before something replaces it; examples and empty text are not worth keeping. */
export function backupDraft(key: DraftKey, text: string): boolean {
  if (isDisposable(text)) return false;
  store.setJSON(`backup:${key}`, { text, at: Date.now() });
  return true;
}

export function loadBackup(key: DraftKey): { text: string; at: number } | null {
  return store.getJSON<{ text: string; at: number } | null>(`backup:${key}`, null);
}

export function clearBackup(key: DraftKey) {
  store.remove(`backup:${key}`);
}
