/** Local storage with JSON values. Failures (private mode, quota) are ignored. */

const PREFIX = 'logomocja.';

export function loadString(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function saveString(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    /* storage is unavailable; the app keeps working without persistence */
  }
}

export function loadJson<T>(key: string, fallback: T): T {
  const raw = loadString(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown): void {
  saveString(key, JSON.stringify(value));
}
