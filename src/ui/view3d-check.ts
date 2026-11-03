// WebGL probe kept out of the 3D chunk, so 2D never loads Three.js.
export function webglAvailable(): string | null {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return 'Ta przeglądarka nie udostępnia WebGL, więc widok 3D jest wyłączony. Tryb 2D działa normalnie.';
    (gl.getExtension('WEBGL_lose_context') as { loseContext(): void } | null)?.loseContext();
    return null;
  } catch {
    return 'Nie udało się uruchomić WebGL, więc widok 3D jest wyłączony. Tryb 2D działa normalnie.';
  }
}
