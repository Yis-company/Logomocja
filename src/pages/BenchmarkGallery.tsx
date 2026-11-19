// biome-ignore-all lint/a11y/noNoninteractiveTabindex: The original-size screenshot region needs keyboard scrolling.
import { ExternalLink, Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Attempt } from "../benchmark-attempts";
import type { BenchmarkCopy } from "../benchmark-copy";
import { Button } from "../components/ui/button";

const shots = import.meta.glob<string>(
  [
    "../../bench/results/*/gallery/*.{png,webp}",
    "../../bench/comparisons/2026-11-19-gemini-4-medium/*/gallery/*.{png,webp}",
  ],
  { eager: true, query: "?url", import: "default" },
);

const byDirectory = new Map<string, Map<string, string>>();
for (const [path, url] of Object.entries(shots)) {
  const slash = path.lastIndexOf("/");
  const directory = path.slice(6, slash - "/gallery".length);
  const capture = path.slice(slash + 1).replace(/\.(png|webp)$/, "");
  const captures = byDirectory.get(directory) ?? new Map<string, string>();
  captures.set(capture, url);
  byDirectory.set(directory, captures);
}

type Viewport = "desktop" | "mobile";
type Side = "reference" | "generated";
type Capture = { url: string; label: string };
type Gallery = NonNullable<Attempt["gallery"]>;

function CaptureFigure({
  capture,
  copy,
  label,
  side,
  onEnlarge,
}: {
  capture?: Capture;
  copy: BenchmarkCopy;
  label: string;
  side: Side;
  onEnlarge: (capture: Capture) => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="benchmark-capture" data-side={side}>
      <figcaption>
        <strong>{label}</strong>
        {capture && !failed && (
          <div className="benchmark-capture-actions">
            <Button
              type="button"
              size="sm"
              variant="outline"
              aria-label={`${copy.enlarge}: ${capture.label}`}
              onClick={() => onEnlarge(capture)}
            >
              <Maximize2 aria-hidden size={14} />
              {copy.enlarge}
            </Button>
            <a
              className="text-link"
              href={capture.url}
              target="_blank"
              rel="noopener"
              aria-label={`${copy.original}: ${capture.label} (${copy.newTab})`}
            >
              {copy.original} <ExternalLink aria-hidden size={13} />
            </a>
          </div>
        )}
      </figcaption>
      {capture && !failed ? (
        <img
          src={capture.url}
          alt={capture.label}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <p className="benchmark-capture-empty">
          {failed ? copy.captureFailed : copy.captureMissing}
        </p>
      )}
    </figure>
  );
}

export default function BenchmarkGallery({
  gallery,
  prompt,
  copy,
}: {
  gallery: Gallery;
  prompt: Attempt["prompt"];
  copy: BenchmarkCopy;
}) {
  const generated = byDirectory.get(gallery.directory);
  const reference = byDirectory.get(`bench/results/reference-${prompt}`);
  const programs = [
    ...new Set(
      [...Object.keys(gallery.matches), ...(generated?.keys() ?? [])].map(
        (capture) => capture.replace(/^mobile-/, ""),
      ),
    ),
  ].sort((a, b) =>
    (copy.programNames[a] ?? a).localeCompare(copy.programNames[b] ?? b),
  );
  const [program, setProgram] = useState(
    programs.includes("drzewo") ? "drzewo" : programs[0],
  );
  const [chosenViewport, setViewport] = useState<Viewport>("desktop");
  const [side, setSide] = useState<Side>("generated");
  const [enlarged, setEnlarged] = useState<Capture>();
  const [actualSize, setActualSize] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (enlarged) dialog.current?.showModal();
  }, [enlarged]);

  if (!generated?.size) return <p>{copy.galleryEmpty}</p>;
  const hasCapture = (viewport: Viewport) => {
    const id = viewport === "mobile" ? `mobile-${program}` : program;
    return generated.has(id) || reference?.has(id);
  };
  const viewport = hasCapture(chosenViewport)
    ? chosenViewport
    : chosenViewport === "desktop" && hasCapture("mobile")
      ? "mobile"
      : "desktop";
  const captureId = viewport === "mobile" ? `mobile-${program}` : program;
  const programName = copy.programNames[program] ?? program;
  const match = gallery.matches[program];
  const captures = [
    { side: "reference", url: reference?.get(captureId) },
    { side: "generated", url: generated.get(captureId) },
  ] as const;
  function enlarge(capture: Capture) {
    setEnlarged(capture);
    setActualSize(false);
  }

  return (
    <section
      className="benchmark-gallery"
      aria-labelledby="benchmark-gallery-title"
    >
      <div className="benchmark-gallery-toolbar">
        <h3 id="benchmark-gallery-title">{copy.gallery}</h3>
        <div className="benchmark-gallery-controls">
          <label>
            {copy.program}
            <select
              value={program}
              onChange={(event) => setProgram(event.target.value)}
            >
              {programs.map((id) => (
                <option key={id} value={id}>
                  {copy.programNames[id] ?? id}
                </option>
              ))}
            </select>
          </label>
          <label>
            {copy.viewport}
            <select
              value={viewport}
              onChange={(event) => setViewport(event.target.value as Viewport)}
            >
              <option value="desktop" disabled={!hasCapture("desktop")}>
                {copy.desktop}
              </option>
              <option value="mobile" disabled={!hasCapture("mobile")}>
                {copy.mobile}
              </option>
            </select>
          </label>
        </div>
      </div>
      <p className="benchmark-drawing-match" data-match={match}>
        {match === undefined
          ? copy.matchUnknown
          : match
            ? copy.match
            : copy.mismatch}
      </p>
      <fieldset className="benchmark-capture-switch">
        <legend className="sr-only">{copy.screenshot}</legend>
        {captures.map(({ side: key }) => (
          <Button
            key={key}
            type="button"
            size="sm"
            variant={side === key ? "secondary" : "outline"}
            aria-pressed={side === key}
            onClick={() => setSide(key)}
          >
            {copy[key]}
          </Button>
        ))}
      </fieldset>
      <div
        className="benchmark-capture-pair"
        data-active={side}
        data-viewport={viewport}
      >
        {captures.map(({ side: key, url }) => (
          <CaptureFigure
            key={`${key}-${captureId}`}
            capture={
              url
                ? {
                    url,
                    label: `${copy[key]} · ${programName} · ${copy[viewport]}`,
                  }
                : undefined
            }
            copy={copy}
            label={copy[key]}
            side={key}
            onEnlarge={enlarge}
          />
        ))}
      </div>
      <dialog
        className="benchmark-image-dialog"
        ref={dialog}
        aria-labelledby="benchmark-image-title"
        onClose={() => setEnlarged(undefined)}
      >
        <div className="benchmark-image-toolbar">
          <h3 id="benchmark-image-title">{enlarged?.label}</h3>
          <div className="benchmark-capture-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActualSize(!actualSize)}
            >
              {actualSize ? copy.fit : copy.actualSize}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => dialog.current?.close()}
            >
              <X aria-hidden size={16} />
              {copy.closeImage}
            </Button>
          </div>
          {actualSize && <p>{copy.pan}</p>}
        </div>
        <section
          className="benchmark-image-scroll"
          tabIndex={0}
          aria-label={copy.screenshot}
        >
          {enlarged && (
            <img
              src={enlarged.url}
              alt={enlarged.label}
              data-actual-size={actualSize}
            />
          )}
        </section>
      </dialog>
    </section>
  );
}
