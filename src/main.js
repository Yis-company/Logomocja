import "./style.css";
import { run, createExecution, aliases } from "./interpreter.js";
import { examples } from "./examples.js";
import { View } from "./view.js";
const $ = (s) => document.querySelector(s),
  esc = (s) =>
    s.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const read = (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch {
      return d;
    }
  },
  write = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  };
let mode = "2d",
  drafts = read("logo-drafts", {
    "2d": examples[2].source,
    "3d": examples[8].source,
  }),
  saved = read("logo-backups", []),
  active = "rozeta",
  execution,
  running = false,
  timer,
  line = 0,
  challenge = null;
const turtle = `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M12 12l-5-4M28 12l5-4M12 28l-5 4M28 28l5 4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><ellipse cx="20" cy="21" rx="11" ry="13" fill="currentColor"/><circle cx="20" cy="5" r="4" fill="currentColor"/><path d="M20 12l6 7-3 9h-6l-3-9z" stroke="var(--bg)" stroke-width="1.5"/></svg>`;
$("#app").innerHTML =
  `<header><a class="brand" href="#">${turtle}<span>logomocja<span class="brand-dot">.</span></span><small>MAŁE KOMENDY. WIELKIE MOŻLIWOŚCI.</small></a><nav aria-label="Główna nawigacja"><button class="nav active" data-page="studio">Studio</button><button class="nav" data-page="examples">Przykłady <span>13</span></button><button class="nav" data-page="challenges">Wyzwania</button><button class="nav" data-page="reference">Słownik poleceń ↗</button></nav><button id="theme" class="icon" aria-label="Zmień motyw" title="Motyw: systemowy">◐</button></header>
<main><section class="intro"><div><div class="eyebrow"><span></span> TWOJE MIEJSCE DO EKSPERYMENTÓW</div><h1>Pomysł. Kilka poleceń. <em>Rysunek.</em></h1><p>Poprowadź żółwia i zobacz, dokąd zaprowadzi Cię wyobraźnia.</p></div><div class="mode" role="group" aria-label="Tryb rysowania"><button data-mode="2d" class="selected">▱ <b>2D</b> Płaszczyzna</button><button data-mode="3d">◇ <b>3D</b> Przestrzeń</button></div></section>
<section id="studio"><div class="workspace"><section class="editor-panel"><div class="panel-head"><span><span class="tiny-icon">⌘</span> Twój program <small id="filename">rozeta.logo</small></span><button id="files" class="icon" aria-label="Pliki i kopie robocze">···</button></div><div class="editor-wrap"><div id="numbers" aria-hidden="true"></div><div class="code-area"><pre id="highlight" aria-hidden="true"></pre><textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Kod programu Logo" wrap="off"></textarea></div></div><div id="error" role="status"></div><div class="editor-bottom"><span id="cursor">Wiersz 1, kol. 1</span><span>Logo <i>●</i> zapisano lokalnie</span></div><div class="runbar"><button id="run" class="primary">▶ <span>Uruchom</span> <kbd>Ctrl ↵</kbd></button><button id="step" title="Krok (Alt+S)">▷ Krok</button><button id="pause" class="icon" aria-label="Pauza lub wznów (Alt+P)">Ⅱ</button><button id="reset" class="icon" aria-label="Resetuj (Alt+R)">↺</button></div><div class="speed"><label for="speed">Tempo żółwia</label><span class="speed-turtle">${turtle}</span><input id="speed" type="range" min="1" max="100" value="70"><span>↗</span></div></section>
<section class="drawing-panel"><div class="panel-head"><span><span class="live-dot"></span> <span id="view-title">Płaszczyzna 2D</span></span><div><button id="export" class="text-button">↓ PNG</button><button id="share" class="text-button">↗ Udostępnij</button></div></div><div class="canvas-wrap"><canvas id="canvas" tabindex="0" aria-label="Rysunek żółwia. Strzałki przesuwają lub obracają, plus i minus zmieniają skalę."></canvas><div class="canvas-tag">${turtle}<span id="canvas-label">Z perspektywy żółwia</span></div><div class="view-controls"><button id="pan" aria-label="Przełącz przesuwanie kamery" title="Przesuwanie / obracanie">✥</button><span></span><button id="zoom-in" aria-label="Powiększ">+</button><button id="zoom-out" aria-label="Pomniejsz">−</button><span></span><button id="fit" aria-label="Dopasuj rysunek" title="Dopasuj rysunek"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4"/></svg></button><button id="camera-reset" aria-label="Resetuj kamerę" title="Resetuj kamerę">↺</button></div></div><div class="drawing-bottom"><span id="status"><i>●</i> Gotowe do odkrywania</span><span id="coordinates">X: 0 &nbsp; Y: 0 &nbsp; Z: 0</span></div></section></div>
<div class="under-workspace"><span>✧ <b>Mała podpowiedź</b> Zmień kąt albo liczbę powtórzeń. Zobacz, co się stanie.</span><button id="shortcuts">Skróty klawiszowe <kbd>?</kbd></button></div>
<section class="examples-strip"><div class="section-title"><div><span class="eyebrow">OD CZEGO ZACZĄĆ?</span><h2>Jeden przykład, mnóstwo możliwości.</h2></div><button id="all-examples">Wszystkie przykłady <span>→</span></button></div><div id="cards" class="cards"></div></section></section>
<section id="other" hidden></section><footer><span>logomocja. <span>Stare dobre Logo. Nowa przestrzeń.</span></span><span>Bez konta. Bez pośpiechu. Po swojemu. <i>✳</i></span></footer></main><dialog id="dialog"><button class="close" aria-label="Zamknij">×</button><div id="dialog-body"></div></dialog><input id="file-input" type="file" accept=".logo,text/plain" hidden><div id="toast" role="status"></div>`;
const view = new View($("#canvas"));
const code = $("#code");
const commandSet = new Set(
  Object.values(aliases)
    .join(" ")
    .split(" ")
    .concat(["oto", "to", "już", "juz", "end", "ma:"]),
);
function highlight() {
  let source = code.value;
  $("#highlight").innerHTML = source
    .split("\n")
    .map((s, i) => {
      let html = "",
        re =
          /;.*|"[^"\n]*"|\b\d+(?:\.\d+)?|[\p{L}_:][\p{L}\p{N}_:]*|[\[\]()]+|./gu,
        m;
      while ((m = re.exec(s))) {
        let v = m[0],
          cl = v.startsWith(";")
            ? "comment"
            : v.startsWith('"')
              ? "string"
              : commandSet.has(v.toLowerCase())
                ? "command"
                : /^\d/.test(v)
                  ? "number"
                  : /^[\[\]()]/.test(v)
                    ? "bracket"
                    : /^[\p{L}:]/u.test(v)
                      ? "name"
                      : "";
        html += `<span class="${cl}">${esc(v)}</span>`;
      }
      let err = execution?.error;
      return `<div class="code-line ${line === i + 1 ? "executing" : ""} ${err?.line === i + 1 ? "invalid" : ""}">${html || " "}${err?.line === i + 1 ? `<span class="error-pointer" style="left:${err.column - 1}ch" title="${esc(err.message)}">⌃</span>` : ""}</div>`;
    })
    .join("");
  $("#numbers").innerHTML = source
    .split("\n")
    .map(
      (_, i) =>
        `<div class="${line === i + 1 ? "current" : ""}">${i + 1}</div>`,
    )
    .join("");
  syncScroll();
}
function syncScroll() {
  $("#highlight").scrollTop = code.scrollTop;
  $("#highlight").scrollLeft = code.scrollLeft;
  $("#numbers").scrollTop = code.scrollTop;
}
function persist() {
  drafts[mode] = code.value;
  write("logo-drafts", drafts);
}
function stop() {
  running = false;
  clearTimeout(timer);
  $("#pause").textContent = "Ⅱ";
}
function show() {
  view.segments = execution?.segments || [];
  view.state = execution?.state;
  view.mode = mode;
  view.draw();
  let e = execution?.error;
  $("#error").textContent = e
    ? `Wiersz ${e.line}, kolumna ${e.column}: ${e.message}`
    : "";
  $("#error").hidden = !e;
  $("#status").innerHTML = e
    ? "⚠ Popraw program i spróbuj ponownie"
    : `<i>●</i> ${running ? "Żółw rysuje…" : execution?.done ? "Gotowe" : "Gotowe do odkrywania"} <small>· ${view.segments.length} odcinków</small>`;
  if (view.state)
    $("#coordinates").textContent = view.state.pos
      .map((v, i) => `${"XYZ"[i]}: ${v.toFixed(0)}`)
      .join("   ");
  highlight();
}
function prepare() {
  stop();
  execution = createExecution(code.value, mode);
  line = 0;
  show();
}
function complete() {
  prepare();
  while (!execution.done) execution.step();
  show();
  view.fit();
  return execution.result();
}
function animate() {
  if (!running) return;
  let count = Number($("#speed").value) > 90 ? 20 : 1;
  for (let i = 0; i < count && !execution.done; i++) {
    let t = execution.step();
    if (t) line = t.line;
  }
  if (execution.done) stop();
  show();
  if (running)
    timer = setTimeout(
      animate,
      Math.max(2, 300 - Number($("#speed").value) * 3),
    );
}
function start() {
  prepare();
  running = !execution.done;
  animate();
}
function backup() {
  if (code.value.trim()) {
    saved.unshift({
      source: code.value,
      mode,
      date: new Date().toLocaleString("pl-PL"),
    });
    saved = saved.slice(0, 30);
    write("logo-backups", saved);
  }
}
function switchMode(m) {
  persist();
  stop();
  mode = m;
  code.value = drafts[m] || "";
  active = "";
  updateMode();
  prepare();
}
function updateMode() {
  document
    .querySelectorAll("[data-mode]")
    .forEach((b) => b.classList.toggle("selected", b.dataset.mode === mode));
  $("#view-title").textContent =
    mode === "2d" ? "Płaszczyzna 2D" : "Przestrzeń 3D";
  $("#canvas-label").textContent =
    mode === "2d"
      ? "Z perspektywy żółwia"
      : "Przeciągnij, aby obrócić przestrzeń";
  $("#filename").textContent = (active || "moj-program") + ".logo";
  view.mode = mode;
}
function backupTarget(m) {
  if (m !== mode && drafts[m]?.trim()) {
    saved.unshift({
      source: drafts[m],
      mode: m,
      date: new Date().toLocaleString("pl-PL"),
    });
    saved = saved.slice(0, 30);
    write("logo-backups", saved);
  }
}
function load(ex) {
  backup();
  backupTarget(ex.mode);
  persist();
  mode = ex.mode;
  code.value = ex.source;
  active = ex.id;
  persist();
  updateMode();
  page("studio");
  complete();
  toast("Przykład wczytany. Poprzedni szkic jest w Plikach → Kopie.");
}
function toast(s) {
  $("#toast").textContent = s;
  $("#toast").classList.add("visible");
  setTimeout(() => $("#toast").classList.remove("visible"), 4200);
}
function modal(html) {
  $("#dialog-body").innerHTML = html;
  $("#dialog").showModal();
}
function download(blob, name) {
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function thumbnail(ex) {
  let r = run(ex.source, ex.mode),
    tmp = { mode: ex.mode, yaw: -0.55, tilt: 0.65 };
  let project = (p) => View.prototype.project.call(tmp, p);
  let pts = r.segments.flatMap((s) => [project(s.from), project(s.to)]),
    xs = pts.map((p) => p[0]),
    ys = pts.map((p) => p[1]),
    x = Math.min(...xs),
    y = Math.min(...ys),
    w = Math.max(...xs) - x,
    h = Math.max(...ys) - y,
    pad = Math.max(w, h) * 0.12 || 10;
  return `<svg viewBox="${x - pad} ${y - pad} ${w + pad * 2} ${h + pad * 2}" aria-hidden="true">${r.segments.map((s) => `<path d="M${project(s.from).join(",")}L${project(s.to).join(",")}" fill="none" stroke="${s.color}" stroke-width="1.25" vector-effect="non-scaling-stroke"/>`).join("")}</svg>`;
}
function cards(list) {
  return list
    .map(
      (ex) =>
        `<button class="example-card ${ex.id === active ? "chosen" : ""}" data-example="${ex.id}"><div class="preview">${thumbnail(ex)}<span>${ex.mode.toUpperCase()}</span></div><div class="card-label"><b>${ex.name}</b><span>↗</span></div><p>${ex.description}</p></button>`,
    )
    .join("");
}
$("#cards").innerHTML = cards([
  examples[0],
  examples[1],
  examples[2],
  examples[5],
  examples[8],
]);
const tasks = [
  [
    "Kwadrat",
    "Narysuj kwadrat o boku 100. Zacznij w (0, 0), w kierunku +Y.",
    "powtorz 4 [np 100 pw 90]",
  ],
  [
    "Trójkąt",
    "Narysuj trójkąt równoboczny o boku 120. Skręcaj w prawo.",
    "powtorz 3 [np 120 pw 120]",
  ],
  [
    "Gwiazda",
    "Narysuj pięcioramienną gwiazdę: 5 odcinków długości 150, skręty w prawo o 144°.",
    "powtorz 5 [np 150 pw 144]",
  ],
  [
    "Przerwana linia",
    "Narysuj dwa odcinki długości 50 wzdłuż +Y, oddzielone przerwą długości 30.",
    "np 50 pod np 30 opu np 50",
  ],
  [
    "Schody w przestrzeni",
    "W 3D narysuj trzy stopnie: 40 do przodu (+Y), 20 w górę (+Z).",
    "powtorz 3 [np 40 gora 90 np 20 dol 90]",
    "3d",
  ],
];
let progress = read("logo-progress", {});
function page(name) {
  $("#studio").hidden = name !== "studio";
  $("#other").hidden = name === "studio";
  document
    .querySelectorAll("[data-page]")
    .forEach((b) => b.classList.toggle("active", b.dataset.page === name));
  if (name === "examples")
    $("#other").innerHTML =
      `<div class="page-title"><span class="eyebrow">13 POMYSŁÓW NA POCZĄTEK</span><h2>Odkrywaj przez rysowanie.</h2><p>Wczytaj przykład i zmień coś po swojemu. Twój szkic zachowamy w kopiach.</p></div><div class="gallery">${cards(examples)}</div>`;
  if (name === "challenges")
    $("#other").innerHTML =
      `<div class="page-title"><span class="eyebrow">UCZ SIĘ PRZEZ PRÓBOWANIE</span><h2>Małe wyzwania. Duża satysfakcja.</h2><p>Sprawdzamy geometrię, z tolerancją 0,5 jednostki. Kolor i grubość wybierasz Ty.</p></div><div class="task-grid">${tasks.map((t, i) => `<article><span class="eyebrow">WYZWANIE 0${i + 1} ${progress[i] ? "✓ UKOŃCZONE" : ""}</span><h3>${t[0]}</h3><div class="task-preview">${thumbnail({ source: t[2], mode: t[3] || "2d" })}</div><p>${t[1]}</p><button class="primary" data-task="${i}">Spróbuj →</button></article>`).join("")}</div>`;
  if (name === "reference") reference();
  if (name === "studio") requestAnimationFrame(() => view.draw());
}
const descriptions = [
  "Ruch do przodu",
  "Ruch do tyłu",
  "Skręt w prawo",
  "Skręt w lewo",
  "Podnieś pisak",
  "Opuść pisak",
  "Ustaw kolor",
  "Grubość 1–12",
  "Powtórz 0–10000 razy",
  "Przypisz zmienną",
  "Warunek",
  "Warunek z alternatywą",
  "Zakończ procedurę lub program",
  "Wróć do początku i wyzeruj orientację",
  "Usuń odcinki; zachowaj stan żółwia",
  "Nos do góry (3D)",
  "Nos w dół (3D)",
  "Przechył w prawo (3D)",
  "Przechył w lewo (3D)",
];
const samples = [
  "np 80",
  "ws 20",
  "pw 90",
  "lw 45",
  "pod",
  "opu",
  'kolor "#16866a"',
  "grubosc 3",
  "powtorz 4 [np 80 pw 90]",
  "niech bok 80",
  "jeśli bok > 10 [np bok]",
  "jeżeli bok = 80 [pw 90] [lw 90]",
  "stop",
  "dom",
  "czyść",
  "gora 30",
  "dol 30",
  "pp 15",
  "pl 15",
];
function reference() {
  $("#other").innerHTML =
    `<div class="page-title"><span class="eyebrow">SŁOWNIK POLECEŃ</span><h2>Język małych możliwości bez końca.</h2><p>Polskie i angielskie nazwy są równoważne. Wielkość liter nie ma znaczenia.</p></div><div class="reference"><table><thead><tr><th>Polecenie i aliasy</th><th>Działanie</th><th>Przykład</th></tr></thead><tbody>${Object.values(
      aliases,
    )
      .map(
        (a, i) =>
          `<tr><td><code>${a.split(" ").join(", ")}</code></td><td>${descriptions[i]}</td><td><code>${esc(samples[i])}</code></td></tr>`,
      )
      .join(
        "",
      )}</tbody></table><h3>Wyrażenia i zmienne</h3><p>Liczby: 80, 12.5, .5. Bez notacji wykładniczej. Operatory + − * /, mnożenie i dzielenie przed dodawaniem. Równorzędne działania od lewej. Nawiasy grupują: <code>np -(3 - 5)</code>. Znaki jednoargumentowe można powtarzać: <code>np - -2</code>. Operator dwuargumentowy ma spacje po obu stronach albo żadnej: <code>10 - 5</code> i <code>10-5</code> są poprawne, <code>10 -5</code> nie.</p><p><code>niech bok 80 np bok</code> przypisuje i odczytuje zmienną. Działa też <code>:bok</code>. Nazwa musi być zadeklarowana gdzieś w swoim zakresie; odczyt przed przypisaniem to błąd wykonania. W procedurze przypisanie jest lokalne, poza nią globalne. Nazwy zaczynają się literą lub podkreśleniem; dalej dopuszczalne są cyfry. Nie mogą być poleceniami ani nazwami procedur. Parametr może mieć nazwę procedury.</p><h3>Powtórzenia i warunki</h3><p><code>powtorz 10 [np nrpowt * 5 pw 90]</code>. Wartość <code>nrpowt</code> (alias <code>repcount</code>) liczy od 1 w najbliższej leksykalnie pętli. Nie jest dostępna w procedurze tylko dlatego, że wywołano ją z pętli. Porównania: &lt; &gt; = &lt;= &gt;= &lt;&gt;. Są dokładne, więc 0.1 + 0.2 nie równa się 0.3. Bloki [ ] można zagnieżdżać.</p><h3>Procedury i rekurencja</h3><pre>oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\nkwadrat 40 * 2 90</pre><p><code>oto</code> / <code>to</code> zaczyna wiersz; nagłówek kończy się w tym samym wierszu. <code>już</code> / <code>juz</code> / <code>end</code> jest osobnym wierszem. Starszy zapis: <code>oto kwadrat :bok :kąt</code>. Definicje wyłącznie na najwyższym poziomie, także po wywołaniu; jedna definicja na nazwę. Argumenty są pozycyjne. Procedury mogą wywoływać siebie. Nie zwracają wartości. <code>stop</code> wychodzi z całej procedury, również z wnętrza pętli, a na najwyższym poziomie kończy program.</p><h3>Przestrzeń, pisak i komentarze</h3><p>Start: (0, 0, 0), kierunek +Y, prawa strona +X, góra +Z. Pisak opuszczony, #16866a, grubość 3. Układ prawoskrętny. Obrót w prawo odbywa się wokół lokalnej góry, pochylenie ku górze wokół prawej strony, przechył obraca górę ku prawej stronie wokół kierunku. Kąty w stopniach; ujemne obracają przeciwnie. Płaskie komendy dają te same współrzędne w obu trybach. Ruch zerowy nie rysuje. <code>dom</code> rysuje powrót przy opuszczonym pisaku, nie zmienia koloru ani grubości. <code>czyść</code> usuwa tylko odcinki. Średnik zaczyna komentarz do końca wiersza.</p><h3>Limity i błędy</h3><p>50 000 znaków, 10 000 tokenów, 32 poziomy nawiasów kwadratowych, 32 aktywne wywołania i pętle, 10 000 operacji, 10 000 przechowywanych odcinków, współrzędne ±100 000. Każda komenda, przypisanie, warunek, pętla i wywołanie to operacja; zakończenie iteracji, wykonanego bloku warunku i wywołania to dodatkowa operacja. Wyrażenia nie liczą się jako operacje. Warunki nie zajmują ramek. Błąd składni nie rysuje nic. Błąd wykonania (np. dzielenie przez zero) zachowuje dotychczasowy rysunek. Błędy wskazują wiersz i kolumnę, przy błędach wartości — początek argumentu.</p><h3>Sterowanie</h3><p>Ctrl/⌘ + Enter: uruchom. Alt+S: krok. Alt+P: pauza/wznów. Alt+R: reset. Na rysunku: przeciąganie przesuwa w 2D, obraca w 3D. Shift + przeciąganie przesuwa kamerę 3D. Możesz też włączyć przycisk przesuwania. Kółko / + / −: skala. Strzałki działają po zaznaczeniu rysunku; Shift ze strzałkami przesuwa w 3D. Widok 3D korzysta z Canvas i nie wymaga WebGL.</p></div>`;
}
function checkTask() {
  if (mode !== (tasks[challenge][3] || "2d")) {
    toast(
      "Przełącz tryb na " +
        (tasks[challenge][3] || "2d").toUpperCase() +
        " przed sprawdzeniem.",
    );
    return;
  }
  let r = complete(),
    expected = run(tasks[challenge][2], mode).segments;
  let near = (a, b) => a.every((x, i) => Math.abs(x - b[i]) < 0.5);
  let remaining = [...r.segments];
  let ok =
    !r.error &&
    expected.length === remaining.length &&
    expected.every((s) => {
      let i = remaining.findIndex(
        (t) =>
          (near(s.from, t.from) && near(s.to, t.to)) ||
          (near(s.from, t.to) && near(s.to, t.from)),
      );
      if (i < 0) return false;
      remaining.splice(i, 1);
      return true;
    });
  if (ok) {
    progress[challenge] = true;
    write("logo-progress", progress);
  }
  toast(
    ok
      ? "Brawo! Rysunek zgadza się ze wzorem. Wyzwanie ukończone."
      : r.error
        ? `Najpierw popraw błąd: ${r.error.message}`
        : r.segments.length !== expected.length
          ? `Oczekiwano ${expected.length} odcinków, narysowano ${r.segments.length}.`
          : "Sprawdź długości, kierunki i początkową pozycję odcinków.",
  );
}
document.addEventListener("click", (e) => {
  let b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.page) page(b.dataset.page);
  if (b.dataset.mode) switchMode(b.dataset.mode);
  if (b.dataset.example) load(examples.find((x) => x.id === b.dataset.example));
  if (b.dataset.task) {
    challenge = Number(b.dataset.task);
    backup();
    backupTarget(tasks[challenge][3] || "2d");
    switchMode(tasks[challenge][3] || "2d");
    code.value = `; Wyzwanie: ${tasks[challenge][0]}\n; ${tasks[challenge][1]}\n`;
    persist();
    prepare();
    page("studio");
    $("#challenge-bar")?.remove();
    let bar = document.createElement("div");
    bar.id = "challenge-bar";
    bar.innerHTML = `<span><b>${tasks[challenge][0]}</b> · ${tasks[challenge][1]}</span><button id="check-task" class="primary">Sprawdź rysunek ✓</button><button id="close-task" aria-label="Zakończ wyzwanie">×</button>`;
    $("#studio").prepend(bar);
  }
  if (b.id === "check-task") checkTask();
  if (b.id === "close-task") {
    $("#challenge-bar").remove();
    challenge = null;
  }
  if (b.dataset.backup) {
    let old = saved[Number(b.dataset.backup) - 1];
    $("#dialog").close();
    load({ ...old, id: "kopia" });
  }
});
$("#run").onclick = start;
$("#step").onclick = () => {
  stop();
  if (!execution || execution.done) prepare();
  let t = execution.step();
  line = t?.line || 0;
  show();
};
$("#pause").onclick = () => {
  if (running) {
    stop();
    $("#pause").textContent = "▶";
    show();
  } else if (execution && !execution.done) {
    running = true;
    animate();
  }
};
$("#reset").onclick = prepare;
code.addEventListener("input", () => {
  stop();
  execution = null;
  line = 0;
  active = "";
  persist();
  highlight();
  $("#error").hidden = true;
  $("#filename").textContent = "moj-program.logo";
  $("#status").textContent = "Program zmieniony — uruchom, by zobaczyć wynik";
});
code.addEventListener("scroll", syncScroll);
code.addEventListener("click", cursor);
code.addEventListener("keyup", cursor);
function cursor() {
  let before = code.value.slice(0, code.selectionStart).split("\n");
  $("#cursor").textContent =
    `Wiersz ${before.length}, kol. ${before.at(-1).length + 1}`;
}
code.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    code.setRangeText("  ", code.selectionStart, code.selectionEnd, "end");
    code.dispatchEvent(new Event("input"));
  }
});
$("#zoom-in").onclick = () => view.zoom(1.2);
$("#zoom-out").onclick = () => view.zoom(1 / 1.2);
$("#fit").onclick = () => view.fit();
$("#camera-reset").onclick = () => view.reset();
$("#pan").onclick = () => {
  view.pan = !view.pan;
  $("#pan").setAttribute("aria-pressed", String(view.pan));
};
$("#all-examples").onclick = () => page("examples");
$(".close").onclick = () => $("#dialog").close();
$("#dialog").addEventListener("click", (e) => {
  if (e.target === $("#dialog")) $("#dialog").close();
});
$("#shortcuts").onclick = () =>
  modal(
    "<h2>Pod ręką.</h2><p>Ctrl / ⌘ + Enter — uruchom program</p><p>Alt + S — następny krok</p><p>Alt + P — pauza / wznów</p><p>Alt + R — resetuj żółwia i rysunek</p><p>Strzałki na rysunku — przesuwanie / obrót. Shift — przesuwanie w 3D. + / − — skala.</p>",
  );
document.addEventListener("keydown", (e) => {
  let id =
    (e.ctrlKey || e.metaKey) && e.key === "Enter"
      ? "run"
      : e.altKey
        ? { s: "step", p: "pause", r: "reset" }[e.key.toLowerCase()]
        : null;
  if (id) {
    e.preventDefault();
    $("#" + id).click();
  }
});
$("#files").onclick = () => {
  modal(
    `<h2>Twoje programy</h2><p>Pliki zostają na Twoim urządzeniu.</p><div class="file-actions"><button id="save-file" class="primary">↓ Pobierz .logo</button><button id="open-file">↑ Otwórz .logo</button></div><h3>Kopie poprzednich szkiców</h3><p>Automatycznie zachowujemy 30 ostatnich zastąpionych programów.</p>${saved.length ? saved.map((s, i) => `<button class="backup" data-backup="${i + 1}">${esc(s.date)} · ${s.mode.toUpperCase()} <span>Przywróć ↗</span></button>`).join("") : "<p>Tu pojawią się kopie po wczytaniu przykładu.</p>"}`,
  );
  $("#save-file").onclick = () =>
    download(
      new Blob([code.value], { type: "text/plain;charset=utf-8" }),
      (active || "program") + ".logo",
    );
  $("#open-file").onclick = () => $("#file-input").click();
};
$("#file-input").onchange = async (e) => {
  let f = e.target.files[0];
  if (f) {
    let source = await f.text();
    if (source.length > 50000) {
      toast("Plik przekracza limit 50 000 znaków.");
      return;
    }
    $("#dialog").close();
    load({ source, mode, id: f.name.replace(/\.logo$/, "") });
    e.target.value = "";
  }
};
$("#export").onclick = () => {
  $("#canvas").toBlob((blob) => {
    if (blob) download(blob, "logomocja.png");
  });
};
$("#share").onclick = async () => {
  let data = JSON.stringify({ source: code.value, mode }),
    bytes = new TextEncoder().encode(data),
    base = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join("")),
    url = location.href.split("#")[0] + "#program=" + encodeURIComponent(base);
  try {
    await navigator.clipboard.writeText(url);
    toast("Link do programu skopiowany!");
  } catch {
    modal(
      `<h2>Udostępnij program</h2><p>Skopiuj ten link:</p><textarea id="share-url" readonly aria-label="Link do programu">${esc(url)}</textarea>`,
    );
    $("#share-url").select();
  }
};
let theme = read("logo-theme", "system");
const media = matchMedia("(prefers-color-scheme: dark)");
function applyTheme() {
  document.documentElement.dataset.theme =
    theme === "system" ? (media.matches ? "dark" : "light") : theme;
  $("#theme").title =
    "Motyw: " + { system: "systemowy", light: "jasny", dark: "ciemny" }[theme];
  view.draw();
}
$("#theme").onclick = () => {
  theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
  write("logo-theme", theme);
  applyTheme();
  toast($("#theme").title);
};
media.addEventListener("change", applyTheme);
applyTheme();
window.logomocja = {
  version: "1.0.0",
  run,
  async open(source, m) {
    backup();
    backupTarget(m);
    persist();
    mode = m === "3d" ? "3d" : "2d";
    code.value = source;
    active = "";
    persist();
    updateMode();
    page("studio");
    let result = complete();
    await new Promise((resolve) =>
      requestAnimationFrame(() => {
        view.fit();
        resolve();
      }),
    );
    return result;
  },
};
code.value = drafts[mode];
updateMode();
complete();
function fromHash() {
  if (location.hash.startsWith("#program=")) {
    try {
      let raw = atob(decodeURIComponent(location.hash.slice(9))),
        data = JSON.parse(
          new TextDecoder().decode(
            Uint8Array.from(raw, (c) => c.charCodeAt(0)),
          ),
        );
      if (typeof data.source !== "string" || !["2d", "3d"].includes(data.mode))
        throw Error();
      window.logomocja.open(data.source, data.mode);
    } catch {
      toast("Nie udało się odczytać programu z linku.");
    }
  }
}
fromHash();
window.addEventListener("hashchange", fromHash);
