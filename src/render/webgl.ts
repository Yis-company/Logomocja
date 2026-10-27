/** Returns why WebGL cannot be used, or null when it is available. Does not load three.js. */
export function webglProblem(): string | null {
  try {
    const canvas = document.createElement('canvas');
    if (canvas.getContext('webgl2') || canvas.getContext('webgl')) return null;
    return 'ta przeglądarka nie udostępnia WebGL';
  } catch {
    return 'nie udało się sprawdzić obsługi WebGL';
  }
}
