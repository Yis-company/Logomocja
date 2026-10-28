// Cienka warstwa nad localStorage: wszystko w try/catch (tryb prywatny, zablokowane
// ciasteczka, pełny magazyn) i pod wspólnym prefiksem.

const PREFIX = 'logomocja:v1:';

let memory: Record<string, string> = {};

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return memory[key] ?? null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(PREFIX + key, value);
  } catch {
    memory[key] = value;
  }
}

export const storage = {
  getString(key: string): string | null {
    return read(key);
  },
  setString(key: string, value: string): void {
    write(key, value);
  },
  getJSON<T>(key: string, fallback: T): T {
    const raw = read(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  setJSON(key: string, value: unknown): void {
    write(key, JSON.stringify(value));
  },
  remove(key: string): void {
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      delete memory[key];
    }
  },
  /** Tylko do testów. */
  _reset(): void {
    memory = {};
  },
};
