import "./style.css";
import { Machine, run, aliases } from "./interpreter";
import { examples } from "./examples";
import { View } from "./view";
const $ = (s: string) => document.querySelector(s) as any;
const icons: Record<string, string> = {
  play: "M8 5l11 7-11 7z",
  step: "M5 5l10 7-10 7z M19 5v14",
  pause: "M8 5v14 M16 5v14",
  reset: "M4 10a8 8 0 1 1 1 8 M4 4v6h6",
  share: "M12 16V3 M7 8l5-5 5 5 M5 13v7h14v-7",
  download: "M12 3v12 M7 10l5 5 5-5 M4 17v4h16v-4",
  fit: "M9 4H4v5 M15 4h5v5 M4 15v5h5 M20 15v5h-5",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M19 5l-1 1 M6 18l-1 1",
  file: "M6 3h8l4 4v14H6z M14 3v5h4",
  book: "M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3z M12 6v15",
  chevron: "M9 5l7 7-7 7",
  close: "M6 6l12 12 M18 6L6 18",
  turtle:
    "M7 9l-3-3 M7 16l-3 3 M16 9l3-3 M16 16l3 3 M8 7h7l3 5-3 6H8l-3-6z M18 12h4 M2 12h3",
};
const icon = (name: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name] || icons.file}"/></svg>`;
const safeGet = (k: string, f = "") => {
  try {
    return localStorage.getItem(k) || f;
  } catch {
    return f;
  }
};
const save = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};
let mode = "2d",
  title = "Rozeta",
  source = safeGet("draft-2d", examples[2].code),
  machine = new Machine(source),
  playing = false,
  timer: any,
  selectedTask = -1;
const tasks = [
  {
    name: "Pierwszy kwadrat",
    desc: "Narysuj kwadrat o boku 100. Zacznij w punkcie (0, 0), kierując żółwia do góry.",
    code: "powtorz 4 [np 100 pw 90]",
  },
  {
    name: "Równy trójkąt",
    desc: "Narysuj trójkąt równoboczny o boku 120, skręcając w prawo.",
    code: "powtorz 3 [np 120 pw 120]",
  },
  {
    name: "Pięć ramion",
    desc: "Narysuj gwiazdę: pięć odcinków długości 150, skręt w prawo o 144°.",
    code: "powtorz 5 [np 150 pw 144]",
  },
  {
    name: "Dwa osobne boki",
    desc: "Narysuj pionowy odcinek długości 80. Podnieś pisak, przesuń się w prawo o 60 i narysuj drugi pionowy odcinek do góry, długości 80.",
    code: "np 80 pod pw 90 np 60 lw 90 opu np 80",
  },
  {
    name: "Sześć boków",
    desc: "Narysuj sześciokąt foremny o boku 70. Skręcaj w prawo.",
    code: "powtorz 6 [np 70 pw 60]",
  },
];
$("#app").innerHTML =
  `<header class="topbar"><a class="brand" href="#" aria-label="Logomocja, pracownia">${icon("turtle")}<strong>logomocja</strong></a><span class="brand-note">Małe polecenia. Wielkie możliwości.</span><nav aria-label="Nawigacja główna"><button class="nav active" data-page="studio">Pracownia</button><button class="nav" data-page="examples">Przykłady <span>13</span></button><button class="nav" data-page="tasks">Wyzwania</button><button class="nav" data-page="reference">Słownik poleceń</button></nav><button class="icon-button" id="theme" aria-label="Zmień motyw" title="Zmień motyw">${icon("sun")}</button></header>
<main><section id="studio"><div class="workspace-heading"><div><h1>Pracownia żółwia<span class="heading-dot">.</span></h1><p>Twój pomysł, kilka poleceń i miejsce na odkrycia.</p></div><div class="heading-actions"><span class="local-status"><i></i> Zapisano na tym urządzeniu</span><button id="share" class="button">${icon("share")} Udostępnij</button></div></div>
<div class="workbench"><section class="editor-panel" aria-label="Edytor programu"><div class="panel-bar"><div class="filename">${icon("file")}<span id="filename">rozeta.logo</span><span class="saved-dot"></span></div><div class="mode-switch" aria-label="Tryb rysowania"><button class="selected" data-mode="2d">2D</button><button data-mode="3d">3D</button></div></div><div class="editor-tools"><span>PROGRAM</span><div><button id="openfile" title="Otwórz plik .logo">Otwórz</button><button id="savefile" title="Pobierz program .logo">Zapisz</button></div></div><div class="code-area"><div id="lines" aria-hidden="true"></div><div class="code-scroll"><pre id="highlight" aria-hidden="true"></pre><textarea id="code" aria-label="Kod programu Logo" spellcheck="false" autocapitalize="off" autocomplete="off" wrap="off"></textarea></div></div><div id="error" role="status"></div><div class="editor-bottom"><span id="cursor">Wiersz 1, kol. 1</span><span>Logo · UTF-8</span></div><div class="execution"><button id="run" class="button primary">${icon("play")} Uruchom <kbd>⌘ ↵</kbd></button><button id="step" class="icon-button" aria-label="Wykonaj krok (F7)" title="Krok · F7">${icon("step")}</button><button id="pause" class="icon-button" aria-label="Pauza lub wznów (F8)" title="Pauza / wznów · F8">${icon("pause")}</button><button id="reset" class="icon-button" aria-label="Resetuj (F9)" title="Resetuj · F9">${icon("reset")}</button></div><div class="speed"><label for="speed">Tempo żółwia</label><input type="range" id="speed" min="1" max="100" value="75"><span id="speedlabel">Szybko</span></div></section>
<section class="drawing-panel" aria-label="Rysunek żółwia"><div class="panel-bar"><span class="canvas-title"><i></i> <span id="viewname">Płaszczyzna 2D</span></span><button class="subtle" id="png">${icon("download")} Eksportuj PNG</button></div><div class="canvas-wrap"><canvas tabindex="0" aria-label="Obszar rysowania. Przeciągnij, aby przesunąć; kółko lub plus i minus zmieniają powiększenie."></canvas><span class="canvas-badge" id="canvasbadge">X / Y</span><button id="pan3d" class="canvas-action" hidden aria-pressed="false">Przesuwanie: wył.</button><div class="view-controls"><button id="minus" aria-label="Oddal">−</button><span id="zoom">100%</span><button id="plus" aria-label="Przybliż">+</button><span class="divider"></span><button id="fit" aria-label="Dopasuj rysunek" title="Dopasuj rysunek">${icon("fit")}</button><button id="camera" aria-label="Resetuj widok" title="Resetuj widok">${icon("reset")}</button></div></div><div class="canvas-footer"><span id="state"><i></i> Gotowe do odkrywania</span><span id="stats">0 odcinków</span></div></section></div>
<div class="under-workspace"><div>${icon("turtle")}<span id="hint">Żółw lubi eksperymenty. Zmień <code>pw 30</code> na <code>pw 29</code> i zobacz różnicę.</span></div><button id="shortcuts">Skróty klawiszowe <kbd>?</kbd></button></div><section class="explore"><div class="section-heading"><h2>Od czego zaczniemy?</h2><button data-page="examples">Wszystkie przykłady ${icon("chevron")}</button></div><div class="example-strip"></div></section><div id="task-active" hidden></div><details class="draft-history"><summary>Odzyskaj poprzedni szkic</summary><p>Przed wczytaniem przykładu lub pliku zachowujemy Twój program.</p><button id="restore" class="button">Przywróć szkic</button></details></section><section id="library" hidden></section><section id="reference" hidden></section></main><footer><span>Logomocja — przestrzeń dla Twojej wyobraźni.</span><span>Bez konta. Bez pośpiechu. Po swojemu.</span></footer><div id="toast" role="status"></div><input type="file" accept=".logo,text/plain" id="file" hidden>`;
const editor = $("#code") as HTMLTextAreaElement;
editor.value = source;
const view = new View($("canvas"), machine);
$("canvas").addEventListener("viewchange", (e: CustomEvent) => {
  $("#zoom").textContent = Math.round(e.detail * 100) + "%";
  $("#stats").textContent =
    `${view.machine.segments.length} odcinków · ${Math.round(e.detail * 100)}%`;
});
$("#pan3d").onclick = () => {
  view.panMode = !view.panMode;
  $("#pan3d").setAttribute("aria-pressed", String(view.panMode));
  $("#pan3d").textContent = "Przesuwanie: " + (view.panMode ? "wł." : "wył.");
};
function theme() {
  let setting = safeGet("theme", "system");
  document.documentElement.dataset.theme =
    setting === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : setting;
  view.draw();
}
theme();
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", theme);
$("#theme").onclick = () => {
  save(
    "theme",
    document.documentElement.dataset.theme === "dark" ? "light" : "dark",
  );
  theme();
};
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function highlight() {
  let err = machine.error;
  let html = editor.value
    .split("\n")
    .map((line, index) => {
      let parts =
        line.match(
          /;.*$|"[^"\n]*"|[\p{L}_:][\p{L}\p{N}_:]*|(?:\d+(?:\.\d+)?|\.\d+)|[\[\]()]+|./gu,
        ) || [];
      let col = 1;
      const text = parts
        .map((t) => {
          let cls = t.startsWith(";")
            ? "comment"
            : t.startsWith('"')
              ? "string"
              : aliases[t.toLowerCase()]
                ? "command"
                : /^\d|^\.\d/.test(t)
                  ? "number"
                  : /^[\[\]()]/.test(t)
                    ? "bracket"
                    : /^[:\p{L}]/u.test(t)
                      ? "name"
                      : "";
          let mark =
            err &&
            index + 1 === err.line &&
            err.column >= col &&
            err.column < col + t.length;
          col += t.length;
          return `<span class="${cls}${mark ? " error-token" : ""}">${esc(t)}</span>`;
        })
        .join("");
      return `<div class="code-line ${err?.line === index + 1 ? "error-line" : !machine.done && machine.line === index + 1 ? "executing" : ""}">${text || " "}</div>`;
    })
    .join("");
  $("#highlight").innerHTML = html + "\n";
  $("#lines").innerHTML = editor.value
    .split("\n")
    .map(
      (_, i) =>
        `<div class="${err?.line === i + 1 ? "bad-number" : ""}">${i + 1}</div>`,
    )
    .join("");
  $("#error").innerHTML = err
    ? `<strong>Wiersz ${err.line}, kolumna ${err.column}</strong> ${esc(err.message)}`
    : "";
  $("#error").classList.toggle("visible", !!err);
}
function syncScroll() {
  $("#highlight").scrollTop = editor.scrollTop;
  $("#highlight").scrollLeft = editor.scrollLeft;
  $("#lines").scrollTop = editor.scrollTop;
}
editor.onscroll = syncScroll;
function stop() {
  playing = false;
  clearTimeout(timer);
}
editor.oninput = () => {
  stop();
  machine.done = true;
  source = editor.value;
  save("draft-" + mode, source);
  machine.error = null;
  highlight();
  $("#state").textContent = "Szkic zapisany · uruchom, aby zobaczyć zmiany";
};
editor.onkeyup = editor.onclick = () => {
  let text = editor.value.slice(0, editor.selectionStart);
  $("#cursor").textContent =
    `Wiersz ${text.split("\n").length}, kol. ${text.split("\n").at(-1)!.length + 1}`;
};
editor.onkeydown = (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    editor.setRangeText(
      "  ",
      editor.selectionStart,
      editor.selectionEnd,
      "end",
    );
    editor.dispatchEvent(new Event("input"));
  }
};
function update() {
  view.machine = machine;
  view.mode = mode;
  view.draw();
  highlight();
  $("#stats").textContent =
    `${machine.segments.length} odcinków · ${Math.round(view.scale * 100)}%`;
  $("#zoom").textContent = Math.round(view.scale * 100) + "%";
  $("#state").innerHTML =
    `<i class="${playing ? "running" : ""}"></i> ${machine.error ? "Popraw program i spróbuj ponownie" : playing ? "Żółw rysuje…" : machine.done ? "Rysunek gotowy" : machine.line ? "Wstrzymano · krok " + machine.line : "Gotowe do odkrywania"}`;
  $("#pause").setAttribute("aria-label", playing ? "Wstrzymaj" : "Wznów");
}
function fresh() {
  stop();
  machine = new Machine(editor.value, mode);
  view.machine = machine;
  update();
}
function animate() {
  if (!playing) return;
  let speed = Number($("#speed").value);
  for (let i = 0; i < Math.max(1, Math.floor(speed / 8)); i++) {
    machine.step();
    if (machine.done) break;
  }
  update();
  if (machine.done) {
    stop();
    view.fit();
    update();
  } else timer = setTimeout(animate, Math.max(4, 105 - speed));
}
$("#run").onclick = () => {
  fresh();
  if (!machine.done) {
    playing = true;
    animate();
  }
};
$("#step").onclick = () => {
  stop();
  if (machine.done || !machine.line) fresh();
  machine.step();
  update();
};
$("#pause").onclick = () => {
  if (playing) {
    stop();
    update();
  } else if (!machine.done) {
    playing = true;
    animate();
  } else toast("Uruchom program, aby rozpocząć.");
};
$("#reset").onclick = () => {
  fresh();
  view.reset();
  update();
};
$("#speed").oninput = () =>
  ($("#speedlabel").textContent =
    Number($("#speed").value) > 65
      ? "Szybko"
      : Number($("#speed").value) > 30
        ? "Spokojnie"
        : "Krok po kroku");
function backup() {
  save("backup-" + mode, editor.value);
}
function setMode(m: string) {
  stop();
  save("draft-" + mode, editor.value);
  mode = m;
  document
    .querySelectorAll("[data-mode]")
    .forEach((b) =>
      b.classList.toggle("selected", (b as HTMLElement).dataset.mode === mode),
    );
  $("#viewname").textContent =
    mode === "2d" ? "Płaszczyzna 2D" : "Przestrzeń 3D";
  $("#canvasbadge").textContent = mode === "2d" ? "X / Y" : "X / Y / Z";
  $("#pan3d").hidden = mode !== "3d";
  $("canvas").setAttribute(
    "aria-label",
    mode === "2d"
      ? "Rysunek 2D. Przeciągnij, aby przesuwać."
      : "Rysunek 3D. Przeciągnij, aby obracać; Shift i przeciąganie przesuwa kamerę.",
  );
}
document.querySelectorAll("[data-mode]").forEach(
  (b) =>
    ((b as HTMLButtonElement).onclick = () => {
      setMode((b as HTMLElement).dataset.mode!);
      editor.value = safeGet(
        "draft-" + mode,
        mode === "2d" ? examples[2].code : examples[8].code,
      );
      title = "Mój program";
      $("#filename").textContent = "moj-program.logo";
      fresh();
      machine.run();
      view.mode = mode;
      view.fit();
      update();
    }),
);
async function open(s: string, m: string) {
  stop();
  backup();
  setMode(m);
  editor.value = s;
  source = s;
  save("draft-" + mode, s);
  machine = new Machine(s, m);
  const result = machine.run();
  view.machine = machine;
  view.mode = mode;
  view.fit();
  update();
  page("studio");
  await new Promise(requestAnimationFrame);
  view.fit();
  return result;
}
(window as any).logomocja = { version: "1.0.0", run, open };
function loadExample(e: (typeof examples)[number]) {
  backup();
  open(e.code, e.mode);
  title = e.name;
  $("#filename").textContent = e.id + ".logo";
  toast("Przykład wczytany. Poprzedni szkic możesz odzyskać.");
}
$("#restore").onclick = () => {
  let old = safeGet("backup-" + mode);
  if (!old) return toast("Nie ma jeszcze poprzedniego szkicu.");
  open(old, mode);
  $("#filename").textContent = "moj-szkic.logo";
  toast("Przywrócono poprzedni szkic.");
};
function thumb(code: string, mode = "2d") {
  let r = run(code, mode),
    pts = r.segments.flatMap((s) => [s.from, s.to]);
  let project = (p: number[]) =>
    mode === "2d" ? [p[0], -p[1]] : [p[0] + p[1] * 0.5, -p[2] - p[1] * 0.5];
  let ps = pts.map(project);
  if (!ps.length) return "";
  let xs = ps.map((p) => p[0]),
    ys = ps.map((p) => p[1]),
    x = Math.min(...xs),
    y = Math.min(...ys),
    w = Math.max(...xs) - x,
    h = Math.max(...ys) - y;
  return `<svg viewBox="${x - 20} ${y - 20} ${w + 40} ${h + 40}" aria-hidden="true">${r.segments
    .map((s) => {
      let a = project(s.from),
        b = project(s.to);
      return `<path d="M${a}L${b}" stroke="${s.color}" stroke-width="${Math.max(w, h) / 120 + 1}" fill="none"/>`;
    })
    .join("")}</svg>`;
}
const featured = [examples[0], examples[1], examples[5], examples[8]];
$(".example-strip").innerHTML = featured
  .map(
    (e) =>
      `<button class="example-preview" data-example="${e.id}"><div class="mini-drawing">${thumb(e.code, e.mode)}</div><div><strong>${e.name}<span>${e.mode.toUpperCase()}</span></strong><p>${e.desc}</p></div>${icon("chevron")}</button>`,
  )
  .join("");
function wireExamples() {
  document
    .querySelectorAll("[data-example]")
    .forEach(
      (el) =>
        ((el as HTMLElement).onclick = () =>
          loadExample(
            examples.find((e) => e.id === (el as HTMLElement).dataset.example)!,
          )),
    );
}
wireExamples();
function page(p: string) {
  $("#studio").hidden = p !== "studio";
  $("#library").hidden = !["examples", "tasks"].includes(p);
  $("#reference").hidden = p !== "reference";
  document
    .querySelectorAll(".nav")
    .forEach((b) =>
      b.classList.toggle("active", (b as HTMLElement).dataset.page === p),
    );
  if (p === "examples") library();
  if (p === "tasks") challenges();
  if (p === "reference") reference();
  if (p === "studio") requestAnimationFrame(() => view.draw());
}
document
  .querySelectorAll("[data-page]")
  .forEach(
    (b) =>
      ((b as HTMLElement).onclick = () =>
        page((b as HTMLElement).dataset.page!)),
  );
$(".brand").onclick = (e: Event) => {
  e.preventDefault();
  page("studio");
};
function library() {
  $("#library").innerHTML =
    `<div class="page-heading"><h1>Pomysł na pierwszy krok.</h1><p>13 programów do uruchamiania, zmieniania i odkrywania. Twój szkic jest bezpieczny.</p></div><div class="library-grid">${examples.map((e) => `<button class="library-item" data-example="${e.id}"><div class="library-image">${thumb(e.code, e.mode)}</div><div><span class="mode-tag">${e.mode.toUpperCase()}</span><h2>${e.name}</h2><p>${e.desc}</p><span class="text-link">Otwórz w pracowni →</span></div></button>`).join("")}</div>`;
  wireExamples();
}
function challenges() {
  let done = JSON.parse(safeGet("progress", "[]"));
  $("#library").innerHTML =
    `<div class="page-heading"><h1>Małe wyzwania, wielka satysfakcja.</h1><p>Odtwórz rysunek własnym programem. Ukończono ${done.length} z ${tasks.length}.</p></div><div class="challenge-list">${tasks.map((t, i) => `<article><div class="challenge-image">${thumb(t.code)}</div><div><h2>${t.name} ${done.includes(i) ? '<span class="passed">Ukończone</span>' : ""}</h2><p>${t.desc}</p><button class="button" data-task="${i}">Podejmij wyzwanie →</button></div></article>`).join("")}</div>`;
  document.querySelectorAll("[data-task]").forEach(
    (b) =>
      ((b as HTMLElement).onclick = () => {
        selectedTask = Number((b as HTMLElement).dataset.task);
        backup();
        setMode("2d");
        editor.value = "; " + tasks[selectedTask].name + "\n";
        save("draft-2d", editor.value);
        fresh();
        page("studio");
        $("#task-active").hidden = false;
        $("#task-active").innerHTML =
          `<h2>${tasks[selectedTask].name}</h2><p>${tasks[selectedTask].desc}</p><button class="button primary" id="check">Sprawdź rysunek</button> <button class="button" id="endtask">Zakończ ćwiczenie</button><p id="feedback" role="status"></p>`;
        $("#check").onclick = check;
        $("#endtask").onclick = () => {
          $("#task-active").hidden = true;
          selectedTask = -1;
        };
        $("#task-active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }),
  );
}
function check() {
  let r = run(editor.value, mode),
    target = run(tasks[selectedTask].code, "2d");
  if (r.error) {
    $("#feedback").textContent = "Popraw błąd: " + r.error.message;
    return;
  }
  const dist = (a: number[], b: number[]) =>
    Math.hypot(...a.map((v, i) => v - b[i]));
  const samples = (ss: any[]) =>
    ss.flatMap((s) =>
      Array.from({ length: 21 }, (_, i) =>
        s.from.map((v: number, j: number) => v + ((s.to[j] - v) * i) / 20),
      ),
    );
  const distance = (p: number[], s: any) => {
    let v = s.to.map((x: number, i: number) => x - s.from[i]),
      len = v.reduce((a: number, b: number) => a + b * b, 0),
      t = Math.max(
        0,
        Math.min(1, p.reduce((a, x, i) => a + (x - s.from[i]) * v[i], 0) / len),
      );
    return dist(
      p,
      s.from.map((x: number, i: number) => x + t * v[i]),
    );
  };
  const close = (a: any[], b: any[]) =>
    samples(a).every((p) => b.some((s) => distance(p, s) < 1.5));
  const ok =
    r.segments.length &&
    close(r.segments, target.segments) &&
    close(target.segments, r.segments);
  $("#feedback").textContent = ok
    ? "Brawo! Rysunek zgadza się z celem. Wyzwanie ukończone."
    : "Jeszcze nie. Sprawdź długości, kąty i położenie rysunku. Tolerancja wynosi 1,5 jednostki; kolor i grubość są dowolne.";
  if (ok) {
    let done = JSON.parse(safeGet("progress", "[]"));
    save("progress", JSON.stringify([...new Set([...done, selectedTask])]));
  }
}
function toast(s: string) {
  $("#toast").textContent = s;
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 4000);
}
function download(blob: Blob, name: string) {
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$("#savefile").onclick = () =>
  download(
    new Blob([editor.value], { type: "text/plain;charset=utf-8" }),
    title.toLowerCase().replace(/\s/g, "-") + ".logo",
  );
$("#openfile").onclick = () => $("#file").click();
$("#file").onchange = async () => {
  let f = $("#file").files[0];
  if (f) {
    if (f.size > 200000)
      return toast("Plik jest za duży. Limit programu: 50 000 znaków.");
    open(await f.text(), mode);
    $("#filename").textContent = f.name;
  }
  $("#file").value = "";
};
$("#png").onclick = () => {
  view.draw();
  $("canvas").toBlob((b: Blob) => download(b, "logomocja.png"));
};
$("#share").onclick = async () => {
  let payload = btoa(
    Array.from(
      new TextEncoder().encode(JSON.stringify({ source: editor.value, mode })),
      (b) => String.fromCharCode(b),
    ).join(""),
  );
  let url =
    location.href.split("#")[0] + "#program=" + encodeURIComponent(payload);
  history.replaceState(null, "", url);
  try {
    await navigator.clipboard.writeText(url);
    toast("Link do Twojego programu skopiowany.");
  } catch {
    toast("Link jest gotowy w pasku adresu. Skopiuj go, aby udostępnić.");
  }
};
$("#plus").onclick = () => {
  view.zoom(1.2);
  update();
};
$("#minus").onclick = () => {
  view.zoom(1 / 1.2);
  update();
};
$("#fit").onclick = () => {
  view.fit();
  update();
};
$("#camera").onclick = () => {
  view.reset();
  update();
};
$("#shortcuts").onclick = () => {
  page("reference");
  setTimeout(() => $("#keyboard").scrollIntoView(), 0);
};
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    $("#run").click();
  }
  if (["F7", "F8", "F9"].includes(e.key)) {
    e.preventDefault();
    $({ F7: "#step", F8: "#pause", F9: "#reset" }[e.key]!).click();
  }
  if (e.key === "?" && e.target !== editor) $("#shortcuts").click();
});
const commands = [
  [
    "np / naprzód / fd / forward",
    "np 80",
    "Ruch do przodu. Inne aliasy: naprzod.",
  ],
  ["ws / wstecz / bk / back", "ws 40", "Ruch wstecz."],
  ["pw / prawo / rt / right", "pw 90", "Obrót w prawo w stopniach."],
  ["lw / lewo / lt / left", "lw 45", "Obrót w lewo."],
  ["pod / podnieś / pu / penup", "pod np 50", "Podnieś pisak. Alias: podnies."],
  ["opu / opuść / pd / pendown", "opu np 50", "Opuść pisak. Alias: opusc."],
  [
    "kolor / color",
    'kolor "#16866a"',
    "Kolor jako sześciocyfrowy kod hex w cudzysłowie.",
  ],
  ["grubość / grubosc / width", "grubosc 3", "Grubość: liczba całkowita 1–12."],
  [
    "powtórz / powtorz / repeat",
    "powtorz 4 [np 80 pw 90]",
    "Powtórz ciało 0–10 000 razy. nrpowt (repcount) to numer iteracji od 1, dostępny leksykalnie w ciele powtórzenia.",
  ],
  [
    "niech / let",
    "niech bok 80 np bok",
    "Utwórz lub zmień zmienną. W procedurze zmienna jest lokalna; na zewnątrz globalna.",
  ],
  [
    "jeśli / jesli / if",
    "jeśli bok > 50 [np bok]",
    "Wykonaj ciało, gdy porównanie jest prawdziwe.",
  ],
  [
    "jeżeli / jezeli / ifelse",
    "jeżeli bok = 80 [np 80] [ws 80]",
    "Wybierz pierwsze lub drugie ciało.",
  ],
  [
    "stop",
    "jeśli bok < 5 [stop]",
    "Zakończ bieżącą procedurę lub cały program na najwyższym poziomie.",
  ],
  [
    "dom / home",
    "dom",
    "Powrót do (0,0,0) i orientacji początkowej. Opuszczony pisak rysuje drogę powrotu.",
  ],
  [
    "czyść / czysc / cs / clearscreen",
    "czysc",
    "Usuń wszystkie odcinki, zachowując pozycję, orientację i pisak.",
  ],
  [
    "góra / gora / pitchup",
    "gora 90 np 80",
    "Tylko 3D: pochyl nos ku górze wokół prawego boku żółwia.",
  ],
  ["dół / dol / pitchdown", "dol 30", "Tylko 3D: pochyl nos w dół."],
  [
    "pp / przechylprawo / rr / rollright",
    "pp 90",
    "Tylko 3D: przechyl górę żółwia ku jego prawej stronie. Kierunek pozostaje ten sam.",
  ],
  [
    "pl / przechyllewo / rl / rollleft",
    "pl 45",
    "Tylko 3D: przechyl żółwia w lewo.",
  ],
];
function reference() {
  $("#reference").innerHTML =
    `<div class="page-heading"><h1>Język małych kroków.</h1><p>Cały słownik Logo pod ręką. Wielkość liter nie ma znaczenia.</p></div><div class="reference-layout"><aside><a href="#commands">Polecenia</a><a href="#expressions">Wyrażenia i zmienne</a><a href="#procedures">Procedury</a><a href="#limits">Granice i błędy</a><a href="#keyboard">Skróty i widok</a></aside><div class="reference-body"><h2 id="commands">Polecenia</h2><p>Żółw startuje w (0, 0, 0), patrzy w +Y, ma prawy bok w +X, górę w +Z, opuszczony pisak, kolor #16866a i grubość 3. W 2D rysuje na płaszczyźnie XY. Skręty w 3D odbywają się wokół lokalnych osi żółwia.</p><div class="command-table">${commands.map((c) => `<article><h3>${c[0]}</h3><p>${c[2]}</p><code>${esc(c[1])}</code></article>`).join("")}</div><h2 id="expressions">Wyrażenia, zmienne i warunki</h2><p>Liczby: 80, 12.5, .5. Znaki + i − są operatorami; zapis wykładniczy, hex, NaN i Infinity są niedozwolone. Nazwy mogą zawierać litery Unicode, cyfry (po pierwszej literze) i podkreślenia. Nazwy poleceń i procedur są zarezerwowane dla zmiennych.</p><pre>niech bok 40
np 2 + 3 * 4 ; 14
np -(3 - 5) ; 2
np :bok / 2 ; starszy zapis zmiennej
jeżeli bok >= 40 [kolor "#16866a"] [kolor "#c1763d"]</pre><p>Mnożenie i dzielenie mają pierwszeństwo. Operatory tego samego poziomu liczymy od lewej. Nawiasy zmieniają kolejność, znaki jednoargumentowe można łączyć: np - -2. Operator dwuargumentowy wymaga spacji z obu stron albo z żadnej: 10 - 5 i 10-5 działają, 10 -5 jest błędem. Porównania: &lt; &gt; = &lt;= &gt;= &lt;&gt;. Porównania są dokładne: 0.1 + 0.2 nie równa się 0.3.</p><p>Zmienna musi być zadeklarowana przez niech gdzieś w swoim zakresie lub być parametrem. Odczyt przed przypisaniem na bieżącej ścieżce jest błędem wykonania. Zmienne lokalne przesłaniają globalne i znikają po zakończeniu wywołania. Średnik rozpoczyna komentarz do końca wiersza. Ciała w nawiasach kwadratowych mogą się zagnieżdżać.</p><h2 id="procedures">Procedury i rekurencja</h2><pre>oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już
kwadrat 40 * 2 90</pre><p>Definicja zaczyna wiersz słowem oto (to), nazwa i parametry są w tym samym wierszu. Ciało zaczyna się w następnym, kończy słowem już (juz, end) samotnie w wierszu. Starszy nagłówek: oto kwadrat :bok :kąt. Wywołania mogą poprzedzać definicje. Definicje są tylko na najwyższym poziomie, każda nazwa raz. Procedury mogą wywoływać siebie, nie zwracają wartości. Parametr może mieć nazwę procedury. stop wewnątrz pętli kończy całe wywołanie. nrpowt w procedurze wymaga powtórzenia wewnątrz tej procedury.</p><h2 id="limits">Granice i błędy</h2><p>50 000 znaków, 10 000 tokenów, głębokość nawiasów 32, 32 aktywne ramki procedur i powtórzeń, 10 000 operacji, 10 000 zachowanych odcinków. Każda współrzędna mieści się w ±100 000. Operacją jest każde polecenie, przypisanie, warunek, powtórzenie, wywołanie oraz zakończenie iteracji, wykonanego ciała warunku lub wywołania. Wyrażenia nie liczą się jako operacje.</p><p>Cały program jest sprawdzany przed rysowaniem. Błąd składni niczego nie rysuje; błąd wykonania zachowuje dotychczasowy rysunek (po ewentualnym czyść). Dzielenie przez zero i wynik nieskończony zatrzymują wykonanie. Błędy wskazują wiersz i kolumnę, a błąd argumentu jego pierwszy token. Stała błędna grubość lub liczba powtórzeń jest odrzucana przed wykonaniem.</p><h2 id="keyboard">Skróty i sterowanie widokiem</h2><dl><dt>Ctrl / ⌘ + Enter</dt><dd>Uruchom od początku</dd><dt>F7</dt><dd>Wykonaj krok</dd><dt>F8</dt><dd>Pauza / wznów</dd><dt>F9</dt><dd>Resetuj</dd><dt>?</dt><dd>Otwórz skróty (poza edytorem)</dd></dl><p>2D: przeciągnij, aby przesuwać. 3D: przeciągnij, aby orbitować; Shift + przeciąganie lub prawy przycisk przesuwa kamerę. Kółko myszy lub + / − przybliża. Strzałki przesuwają widok z fokusem na płótnie. Alt + strzałki obracają kamerę 3D. Dwuklik dopasowuje rysunek. Na telefonie przeciągaj jednym palcem i używaj przycisków powiększenia. W 3D włącz przycisk Przesuwanie, aby przesunąć kamerę zamiast ją obracać. Przestrzeń 3D działa na Canvas, bez wymagania WebGL.</p><p>Zmiana kodu wstrzymuje odtwarzanie. Szkice obu trybów zapisują się lokalnie. Wczytanie przykładu zachowuje poprzedni szkic w sekcji odzyskiwania. Plik .logo to zwykły tekst UTF-8. Udostępniany adres zawiera cały program; odbiorca otworzy go bez konta.</p></div></div>`;
  $("#reference")
    .querySelectorAll("aside a")
    .forEach(
      (a: HTMLAnchorElement) =>
        (a.onclick = (e: Event) => {
          e.preventDefault();
          $(a.getAttribute("href")!).scrollIntoView({ behavior: "smooth" });
        }),
    );
}
highlight();
machine.run();
view.machine = machine;
requestAnimationFrame(() => {
  view.fit();
  update();
});
if (location.hash.startsWith("#program=")) {
  try {
    let data = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(decodeURIComponent(location.hash.slice(9))), (c) =>
          c.charCodeAt(0),
        ),
      ),
    );
    if (typeof data.source === "string" && ["2d", "3d"].includes(data.mode))
      open(data.source, data.mode);
    else throw Error();
  } catch {
    toast("Nie udało się odczytać programu z adresu.");
  }
}
