import { lazy, Suspense } from "react";
import type { Drawing, Mode } from "../logo/types";
import type { Theme } from "../theme";
import Stage2D from "./Stage2D";
const Stage3D = lazy(() => import("./Stage3D"));
export function DrawingStage({
  drawing,
  mode,
  theme,
  viewVersion = 0,
}: {
  drawing: Drawing;
  mode: Mode;
  theme: Theme;
  viewVersion?: number;
}) {
  const z =
    Math.abs(drawing.turtle.position[2]) < 0.005
      ? 0
      : Number(drawing.turtle.position[2].toFixed(1));
  return (
    <div className="stage" data-segments={drawing.segments.length} data-z={z}>
      <Suspense
        fallback={
          <div className="stage-unavailable">Przygotowujemy przestrzeń 3D…</div>
        }
      >
        {mode === "2d" ? (
          <Stage2D key={`2d-${viewVersion}`} drawing={drawing} theme={theme} />
        ) : (
          <Stage3D key={`3d-${viewVersion}`} drawing={drawing} theme={theme} />
        )}
      </Suspense>
    </div>
  );
}
