import { commandId, fold, END_WORDS, REPCOUNT_WORDS, TO_WORDS } from "./interp";

const KEY = new Set([...TO_WORDS, ...END_WORDS, ...REPCOUNT_WORDS]);
const RE =
  /(;[^\n\r]*)|("[^"\n\r]*"?)|((?:\d+\.\d+|\d+|\.\d+)[\p{L}\p{N}\p{M}_.]*)|(:?[\p{L}_][\p{L}\p{N}\p{M}_]*:?)|([\[\]()])|(<=|>=|<>|[-+*\/<>=,])|(\r\n|\n|\r)|([^\S\n\r]+)|([\s\S])/gu;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export interface Mark {
  line: number;
  column: number;
}

/** Zamienia program na HTML z klasami kolorowania. `mark` wskazuje miejsce bieżącego błędu. */
export function highlight(src: string, mark?: Mark | null): string {
  let out = "";
  let line = 1;
  let col = 1;
  let marked = false;
  RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  const point = '<span class="e-point" data-err></span>';
  while ((m = RE.exec(src))) {
    let text = m[0];
    if (m[7]) {
      if (mark && !marked && mark.line === line) { out += point; marked = true; }
      out += "\n";
      line++;
      col = 1;
      continue;
    }
    let cls = "";
    if (m[1]) cls = "t-com";
    else if (m[2]) cls = "t-str";
    else if (m[3]) cls = "t-num";
    else if (m[4]) {
      let w = text;
      if (w.endsWith(":") && fold(w) !== "ma:") {
        // dwukropek na końcu należy do nazwy tylko w „ma:”
        w = w.slice(0, -1);
        RE.lastIndex -= 1;
        text = w;
      }
      const lc = fold(w);
      cls = lc === "ma:" || KEY.has(lc) || commandId(lc) ? "t-cmd" : "t-name";
    } else if (m[5]) cls = "t-br";
    else if (m[6]) cls = "t-op";
    const here = mark && !marked && mark.line === line && mark.column >= col && mark.column < col + text.length;
    if (here && (m[8] || !cls)) {
      out += point + esc(text);
      marked = true;
    } else if (here) {
      out += `<span class="${cls} e-mark" data-err>${esc(text)}</span>`;
      marked = true;
    } else {
      out += cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text);
    }
    col += text.length;
  }
  if (mark && !marked) out += point;
  return out;
}
