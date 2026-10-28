/** Sprawdza, czy przeglądarka potrafi utworzyć kontekst WebGL; zwraca powód niepowodzenia albo null. */
export function webglProblem(): string | null {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return 'przeglądarka nie udostępnia WebGL (może być wyłączony albo brakuje akceleracji grafiki)';
    return null;
  } catch (e) {
    return `nie udało się utworzyć kontekstu WebGL (${(e as Error).message})`;
  }
}
