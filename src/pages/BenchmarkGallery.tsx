import type { Attempt } from "../benchmark-attempts";
import type { BenchmarkCopy } from "../benchmark-copy";

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
  const program = path.slice(slash + 1).replace(/\.(png|webp)$/, "");
  const programs = byDirectory.get(directory) ?? new Map<string, string>();
  programs.set(program, url);
  byDirectory.set(directory, programs);
}

export default function BenchmarkGallery({
  run,
  copy,
}: {
  run: Attempt;
  copy: BenchmarkCopy;
}) {
  if (!run.gallery) return null;
  const { directory, matches } = run.gallery;
  const gallery = byDirectory.get(directory);
  if (!gallery?.size) return <p>{copy.galleryEmpty}</p>;
  const reference = byDirectory.get(`bench/results/reference-${run.prompt}`);
  return (
    <>
      <h3>{copy.gallery}</h3>
      <div className="benchmark-gallery">
        {[...gallery.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([program, url]) => {
            const ref = reference?.get(program);
            const mismatch = matches[program] === false;
            return (
              <figure key={program}>
                <figcaption>
                  {program}
                  {mismatch && ` · ${copy.mismatch}`}
                </figcaption>
                <div>
                  {ref && (
                    <a href={ref}>
                      <img
                        loading="lazy"
                        src={ref}
                        alt={`${copy.reference} – ${program}`}
                      />
                    </a>
                  )}
                  <a href={url}>
                    <img
                      loading="lazy"
                      src={url}
                      alt={`${run.model} – ${program}`}
                    />
                  </a>
                </div>
              </figure>
            );
          })}
      </div>
    </>
  );
}
