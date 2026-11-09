import type { RunResult } from "../../bench/result";

const shots = import.meta.glob("../../bench/results/*/gallery/*.{png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/** Screenshot URLs by run id and program, from the files captured by the harness. */
function galleryOf(runId: string): Record<string, string> {
  const prefix = `../../bench/results/${runId}/gallery/`;
  return Object.fromEntries(
    Object.entries(shots)
      .filter(([path]) => path.startsWith(prefix))
      .map(([path, url]) => [path.slice(prefix.length).replace(/\.(png|webp)$/, ""), url]),
  );
}

export default function Gallery({ version, runs }: { version: string; runs: RunResult[] }) {
  const reference = { id: `reference-${version.split("/")[0]}`, label: "wzorzec", gallery: null as RunResult["gallery"] };
  const rows = [reference, ...runs.map((run) => ({ id: run.id, label: `${run.model} · ${run.effort ?? "domyślny"}`, gallery: run.gallery }))]
    .map((row) => ({ ...row, shots: galleryOf(row.id) }))
    .filter((row) => Object.keys(row.shots).length);
  const programs = [...new Set(rows.flatMap((row) => Object.keys(row.shots)))].sort(
    (a, b) => Number(a.startsWith("mobile-")) - Number(b.startsWith("mobile-")) || a.localeCompare(b),
  );
  if (!rows.length) return null;
  return (
    <>
      <h3>Programy wzorcowe</h3>
      <div className="table-scroll">
        <table className="gallery-table">
          <thead>
            <tr>
              <th>Model</th>
              {programs.map((program) => (
                <th key={program}>{program.replace("mobile-", "telefon: ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <code>{row.label}</code>
                </th>
                {programs.map((program) => {
                  const url = row.shots[program];
                  const mismatch = row.gallery?.[program] === false;
                  return (
                    <td key={program} className={mismatch ? "gallery-mismatch" : undefined}>
                      {url ? (
                        <a href={url} target="_blank" rel="noreferrer" title={mismatch ? `${program}: odcinki różne od wzorca` : program}>
                          <img src={url} alt={`${row.label}: ${program}`} loading="lazy" />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Zrzuty ekranu każdej aplikacji po wczytaniu programu wzorcowego przez <code>open</code>.
        Czerwona ramka: odcinki zwrócone przez aplikację różnią się od wzorca.
      </p>
    </>
  );
}
