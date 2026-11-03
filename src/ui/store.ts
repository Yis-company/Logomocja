// Pamięć przeglądarki. Każdy dostęp w try/catch: w trybie prywatnym localStorage potrafi rzucać.

const P = 'logomocja.';

export function load(key: string): string | null {
  try {
    return localStorage.getItem(P + key);
  } catch {
    return null;
  }
}

export function save(key: string, value: string) {
  try {
    localStorage.setItem(P + key, value);
  } catch {
    /* brak miejsca albo zablokowana pamięć: szkic zostaje tylko w tej karcie */
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

export function saveJSON(key: string, value: unknown) {
  save(key, JSON.stringify(value));
}

export interface Progress {
  [taskId: string]: { solved: boolean; at?: number };
}
