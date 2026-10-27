const PREFIX = 'logomocja.';

function safeStorage(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = `${PREFIX}probe`;
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

const storage = safeStorage();

export function load(key: string): string | null {
  try {
    return storage?.getItem(PREFIX + key) ?? null;
  } catch {
    return null;
  }
}

export function save(key: string, value: string): void {
  try {
    storage?.setItem(PREFIX + key, value);
  } catch {
    // Quota exceeded or private mode: the draft simply is not persisted.
  }
}
