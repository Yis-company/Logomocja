/** Czy przeglądarka udostępnia WebGL (bez ładowania three.js). */
export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    // Zwalniamy próbny kontekst, żeby nie zajmował limitu kontekstów WebGL.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}
