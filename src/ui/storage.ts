// Bezpieczny dostęp do localStorage (tryb prywatny, brak miejsca itp.).
const PREFIX = 'logomocja.';

export function load(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function save(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    /* brak miejsca lub zablokowany dostęp — trudno */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* nic */
  }
}

export function loadJSON<T>(key: string, fallback: T): T {
  const raw = load(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  save(key, JSON.stringify(value));
}
