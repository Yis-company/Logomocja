"""Per-app q1 scores from oxlint JSON. Usage: python3 -I aggregate.py <scratch> <repo> <out-dir>

Q (headline) = count of language-neutral findings per app, each weighted 1, lower is better.
Types = TypeScript-only findings, reported for TS apps only.
"""
import collections, json, re, statistics, sys
from pathlib import Path

S, REPO, OUT = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])

TS_ONLY_ANTI_SLOP = {
    "no-chained-type-assertions", "no-known-value-widening", "no-object-parameters",
    "no-unknown-parameters", "no-unknown-returns", "no-unknown-type-aliases",
    "no-unsafe-dictionary-type", "no-widen-then-assert", "require-safety-comment-for-type-assertion",
    "no-runtime-typeof",  # its type-guard exemption only exists in TS
}

def family(code):
    plugin, rule = re.match(r"([\w-]+)\((.+)\)", code).groups()
    if plugin == "typescript" or (plugin == "anti-slop" and rule in TS_ONLY_ANTI_SLOP): return "types"
    if plugin == "sonarjs" or rule == "max-depth": return "complexity"
    if plugin == "anti-slop": return "anti-slop"
    return "defects"

counts = collections.defaultdict(collections.Counter)
for d in json.loads((S / "ox.json").read_text())["diagnostics"]:
    counts[d["filename"].split("/")[0]][d["code"]] += 1

def conformance(app):
    f = REPO / "bench/results" / app / "result.json"
    if not f.exists(): return None
    c = json.loads(f.read_text()).get("conformance") or {}
    t = sum(s["total"] for s in c.values())
    return round(100 * sum(s["passed"] for s in c.values()) / t, 1) if t else None

apps = []
for files in sorted(S.glob("stage-*.files")):
    app = files.name[len("stage-"):-len(".files")]
    paths = files.read_text().split()
    lang = "ts" if any(p.endswith((".ts", ".tsx")) for p in paths) else "js"
    fam = collections.Counter()
    for code, n in counts[app].items(): fam[family(code)] += n
    loc = sum(1 for p in paths for l in (S / "stage" / app / p).read_text(errors="replace").splitlines() if l.strip())
    q = fam["complexity"] + fam["defects"] + fam["anti-slop"] if paths else None  # no source is not a clean zero
    apps.append({"app": app, "lang": lang, "loc": loc, "files": paths,
                 "Q": q,
                 "types": fam["types"] if lang == "ts" else None,
                 "families": dict(fam), "rules": dict(counts[app]), "conformancePct": conformance(app)})

def group(app):
    g = re.search(r"gemini-4-medium-\w+|claude-[a-z]+-\d-\d|gpt-[\d.]+-\w+", app).group(0)
    return re.sub(r"-(base|impeccable)$", "", g)

groups = collections.defaultdict(list)
for a in apps:
    if a["Q"] is not None: groups[group(a["app"])].append(a)
summary = []
for g, rows in groups.items():
    q = sorted(r["Q"] for r in rows)
    summary.append({"group": g, "n": len(rows), "medianQ": statistics.median(q), "minQ": q[0], "maxQ": q[-1],
                    "medianLoc": statistics.median(r["loc"] for r in rows)})
summary.sort(key=lambda r: r["group"])
(OUT / "scores.json").write_text(json.dumps({"apps": apps, "groups": summary}, indent=1))
for r in summary: print(f'{r["group"]:24} n={r["n"]} medianQ={r["medianQ"]:5} range={r["minQ"]}-{r["maxQ"]} medianLoc={r["medianLoc"]}')
