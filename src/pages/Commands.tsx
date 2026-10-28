import { Frame, FramePanel } from "../components/reui/frame";
const commands = [
  ["np / naprzód / naprzod", "fd / forward", "100", "Ruch do przodu"],
  ["ws / wstecz", "bk / back", "50", "Ruch do tyłu"],
  ["pw / prawo", "rt / right", "90", "Obrót w prawo"],
  ["lw / lewo", "lt / left", "90", "Obrót w lewo"],
  ["pod / podnieś / podnies", "pu / penup", "", "Podnieś pisak"],
  ["opu / opuść / opusc", "pd / pendown", "", "Opuść pisak"],
  ["kolor", "color", '"#16866a"', "Kolor #RRGGBB"],
  ["grubosc / grubość", "width", "3", "Grubość: całkowita 1–12"],
  ["powtorz / powtórz", "repeat", "4 [np 100 pw 90]", "Powtórzenie: całkowite 0–10 000"],
  ["nrpowt", "repcount", "np nrpowt * 5", "Numer bieżącego powtórzenia, od 1 (tylko wewnątrz powtórz)"],
  ["niech", "let", "bok 50", "Zmienna: globalna na najwyższym poziomie, lokalna w procedurze"],
  ["jeśli / jesli", "if", "bok < 10 [stop]", "Wykonaj blok, gdy warunek jest spełniony"],
  ["jeżeli / jezeli", "ifelse", "n > 2 [np 1] [np 2]", "Pierwszy blok, gdy warunek spełniony; inaczej drugi"],
  ["stop", "stop", "", "Zakończ bieżącą procedurę (na najwyższym poziomie: program)"],
  ["dom", "home", "", "Wróć do początku: pozycja (0, 0, 0), kierunek +Y"],
  ["czyść / czysc", "cs / clearscreen", "", "Usuń narysowane odcinki, żółw zostaje"],
  ["gora / góra", "pitchup", "90", "Obrót w górę — tylko 3D"],
  ["dol / dół", "pitchdown", "90", "Obrót w dół — tylko 3D"],
  ["pp / przechylprawo", "rr / rollright", "90", "Przechył w prawo wokół kierunku — tylko 3D"],
  ["pl / przechyllewo", "rl / rollleft", "90", "Przechył w lewo wokół kierunku — tylko 3D"],
];
export function Commands() {
  return (
    <>
      <div className="workspace-heading">
        <div>
          <h1 tabIndex={-1}>Polecenia</h1>
          <p>Mały słownik, wiele możliwości.</p>
        </div>
      </div>
      <Frame>
        <FramePanel>
          <div className="table-scroll">
            <table className="command-table">
              <thead>
                <tr>
                  <th>Polecenie</th>
                  <th>Angielski alias</th>
                  <th>Argument / przykład</th>
                  <th>Działanie</th>
                </tr>
              </thead>
              <tbody>
                {commands.map(([command, alias, arg, description]) => (
                  <tr key={command}>
                    <td>
                      <code>{command}</code>
                    </td>
                    <td>{alias}</td>
                    <td>
                      <code>{arg}</code>
                    </td>
                    <td>{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FramePanel>
      </Frame>
      <Frame className="reference-block">
        <FramePanel>
          <h2>Twoje własne polecenia</h2>
          <p>
            Zdefiniuj procedurę raz, potem używaj jej nazwy. Po <code>ma:</code>{" "}
            wymień parametry, oddzielając je przecinkami. W środku używaj ich
            nazw, a przy wywołaniu podaj wartości w tej samej kolejności,
            oddzielone spacjami. Nazwy i polecenia nie rozróżniają wielkości liter.
          </p>
          <pre>{`oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90`}</pre>
          <p>
            Alias: <code>to / end</code>. Działa też <code>juz</code>. Nagłówek
            i zakończenie zajmują osobne wiersze; nazwa i cała lista parametrów
            są w wierszu nagłówka. Bez parametrów wystarczy <code>oto nazwa</code>.
            Działa też starszy zapis <code>oto kwadrat :bok</code> i odwołanie{" "}
            <code>:bok</code> w środku. Parametry są lokalne dla procedury.
            Definicje są poza powtórzeniami; możesz je umieścić przed lub po
            wywołaniu. Procedura może wywoływać samą siebie; <code>stop</code>{" "}
            kończy ją, a limit 32 aktywnych ramek chroni przed nieskończoną
            rekurencją.
          </p>
          <pre>{`oto gałąź ma: dł\n  jeśli dł < 6 [stop]\n  np dł\n  lw 25 gałąź dł * 0.7\n  pw 50 gałąź dł * 0.7\n  lw 25 pod ws dł opu\njuż`}</pre>
        </FramePanel>
      </Frame>
      <Frame className="reference-block">
        <FramePanel>
          <h2>Wyrażenia i zmienne</h2>
          <p>
            Każdy argument liczbowy może być wyrażeniem: liczby, nazwy,{" "}
            <code>+ - * /</code>, nawiasy i minus jednoargumentowy, np.{" "}
            <code>np bok * 2 + 1</code> albo <code>pw 360 / n</code>. Operator
            dwuargumentowy ma spacje po obu stronach albo po żadnej:{" "}
            <code>np 10 - 5</code> i <code>np 10-5</code> to 5, a{" "}
            <code>np 10 -5</code> to błąd. Dzielenie przez zero zatrzymuje
            program.
          </p>
          <p>
            <code>niech nazwa wartość</code> tworzy zmienną: globalną na
            najwyższym poziomie, lokalną w procedurze. Nazwa musi być parametrem
            albo zmienną z <code>niech</code> w tej procedurze lub na najwyższym
            poziomie. <code>nrpowt</code> to numer bieżącego powtórzenia.
          </p>
        </FramePanel>
      </Frame>
      <Frame className="reference-block">
        <FramePanel>
          <h2>Składnia i limity</h2>
          <p>
            Średnik rozpoczyna komentarz. Zagnieżdżaj powtórzenia i bloki
            warunków w nawiasach <code>[ ]</code>. Warunek to porównanie{" "}
            <code>{"< > = <= >= <>"}</code>. Kolory wpisuj jako literały
            szesnastkowe.
          </p>
          <p>
            Do 50 000 znaków, 10 000 tokenów i operacji, 32 poziomów nawiasów
            lub aktywnych ramek oraz 10 000 odcinków. Współrzędne: ±100 000.
            Błąd wskazuje wiersz i kolumnę, a dla złego argumentu jego pierwszy
            token.
          </p>
        </FramePanel>
      </Frame>
    </>
  );
}
