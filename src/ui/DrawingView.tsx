import { useEffect, useRef, useState } from 'preact/hooks';
import { plural } from '../lang/errors';
import { Viewport } from '../render/viewport';
import type { CameraPreset } from '../render/view3d';
import { attachViewport, detachViewport, mode, stats, status } from '../state/studio';
import { theme } from '../state/theme';
import { Icon } from './icons';

function fmt(v: number): string {
  const r = Math.round(v * 10) / 10;
  return (Object.is(r, -0) ? 0 : r).toLocaleString('pl-PL', { maximumFractionDigits: 1 });
}

export function DrawingView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const vpRef = useRef<Viewport | null>(null);
  const m = mode.value;
  const t = theme.value;

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let vp: Viewport;
    try {
      vp = new Viewport(canvasRef.current!);
    } catch {
      setFailed(true);
      return;
    }
    vpRef.current = vp;
    vp.onPaint = () => {
      const el = infoRef.current;
      const tu = vp.scene.turtle;
      if (!el || !tu) return;
      const [x, y, z] = tu.pos;
      let text = `x ${fmt(x)}  y ${fmt(y)}`;
      if (vp.mode === '3d') text += `  z ${fmt(z)}`;
      if (vp.mode === '2d') {
        let deg = (Math.atan2(tu.h[0], tu.h[1]) * 180) / Math.PI;
        if (deg < 0) deg += 360;
        text += `  ·  kierunek ${fmt(deg % 360)}°`;
      }
      text += tu.pen ? '  ·  pióro ↓' : '  ·  pióro ↑';
      if (el.textContent !== text) el.textContent = text;
    };
    attachViewport(vp);
    return () => {
      detachViewport(vp);
      vp.dispose();
      vpRef.current = null;
    };
  }, []);

  useEffect(() => {
    vpRef.current?.refreshPalette();
  }, [t]);

  const vp = () => vpRef.current;
  const preset = (p: CameraPreset) => vp()?.preset(p);
  const s = stats.value;
  const st = status.value;
  const label = s
    ? `Rysunek ${m === '2d' ? '2D' : '3D'}: ${s.segments} ${plural(s.segments, 'odcinek', 'odcinki', 'odcinków')}.`
    : `Rysunek ${m === '2d' ? '2D' : '3D'}${st === 'running' ? ' w trakcie rysowania' : ''}.`;

  return (
    <div class="drawing">
      <canvas
        ref={canvasRef}
        class="drawing-canvas"
        tabIndex={0}
        role="img"
        aria-label={label}
        aria-describedby="drawing-help"
      />
      <div class="drawing-tools" role="toolbar" aria-label="Widok rysunku">
        <button type="button" class="tool" onClick={() => vp()?.zoom(1.3)} aria-label="Powiększ" title="Powiększ (+)">
          <Icon name="zoomIn" />
        </button>
        <button type="button" class="tool" onClick={() => vp()?.zoom(1 / 1.3)} aria-label="Pomniejsz" title="Pomniejsz (−)">
          <Icon name="zoomOut" />
        </button>
        <button type="button" class="tool" onClick={() => vp()?.fitTo()} aria-label="Dopasuj widok do rysunku" title="Dopasuj do rysunku (0)">
          <Icon name="fit" />
        </button>
        <button type="button" class="tool" onClick={() => vp()?.resetView()} aria-label="Przywróć widok początkowy" title="Widok początkowy">
          <Icon name="target" />
        </button>
      </div>
      {m === '3d' && (
        <div class="drawing-presets" role="group" aria-label="Ustawienie kamery">
          <button type="button" class="chip" onClick={() => preset('default')}>Ukos</button>
          <button type="button" class="chip" onClick={() => preset('top')}>Z góry</button>
          <button type="button" class="chip" onClick={() => preset('front')}>Z przodu</button>
          <button type="button" class="chip" onClick={() => preset('side')}>Z boku</button>
        </div>
      )}
      <div class="drawing-info" ref={infoRef} aria-hidden="true" />
      {failed && (
        <p class="drawing-failed" role="alert">
          Ta przeglądarka nie pozwala rysować na elemencie canvas, więc rysunku nie da się pokazać. Program nadal można pisać, sprawdzać i
          pobierać.
        </p>
      )}
      <p class="drawing-help" id="drawing-help">
        {m === '2d'
          ? 'Przeciągnij, aby przesunąć; kółko myszy lub dwa palce — powiększenie. Klawisze: strzałki, + i −, 0 dopasowuje.'
          : 'Przeciągnij, aby obracać; z Shiftem lub prawym przyciskiem — przesuwać; kółko lub dwa palce — przybliżenie. Klawisze: strzałki obracają, Shift+strzałki przesuwają, + i −, 0 dopasowuje.'}
      </p>
    </div>
  );
}
