import "./styles.css";
import { runProgram, type RunResult } from "./lang";
import { App } from "./ui/app";

// Testing hook: interprets a program without touching the UI.
window.logomocja = {
  version: __APP_VERSION__,
  run(source: string, mode: "2d" | "3d"): RunResult {
    const m = String(mode ?? "2d").toLowerCase();
    if (m !== "2d" && m !== "3d") {
      return {
        segments: [],
        error: { message: `Nieznany tryb ${JSON.stringify(mode)}: użyj "2d" albo "3d".`, line: 1, column: 1 },
      };
    }
    return runProgram(String(source ?? ""), m);
  },
};

try {
  new App();
} catch (e) {
  console.error(e);
  const status = document.getElementById("status");
  if (status) {
    status.dataset.kind = "error";
    status.textContent = "Nie udało się uruchomić interfejsu Logomocji. Odśwież stronę.";
  }
}
