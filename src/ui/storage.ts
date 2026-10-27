/** localStorage access that degrades to "nothing saved" when storage is blocked or full. */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private mode or quota: the program still works, it just is not remembered.
  }
}
