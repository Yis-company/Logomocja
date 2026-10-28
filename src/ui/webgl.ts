/** Why 3D cannot be shown, or null when WebGL is available. Does not load three.js. */
export function webglProblem(): string | null {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'przeglądarka nie udostępnia WebGL (akceleracja grafiki jest wyłączona lub nieobsługiwana)';
    return null;
  } catch {
    return 'nie udało się utworzyć kontekstu WebGL';
  }
}
