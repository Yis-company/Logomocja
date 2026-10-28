// Local storage only; every access is guarded because private modes can throw.
const PREFIX = 'logomocja.';

export function loadItem(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function saveItem(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    // Quota or privacy settings: the editor still works, the draft just is not kept.
  }
}

export function loadJson<T>(key: string, fallback: T): T {
  const raw = loadItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown): void {
  saveItem(key, JSON.stringify(value));
}
