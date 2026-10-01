import { Frame, FramePanel } from "../components/reui/frame";
const commands = [
  ["np / naprzód / naprzod", "fd / forward", "100", "Ruch do przodu"],
  ["ws / wstecz", "bk / back", "50", "Ruch do tyłu"],
  ["pw / prawo", "rt / right", "90", "Obrót w prawo"],
  ["lw / lewo", "lt / left", "90", "Obrót w lewo"],
  ["pod / podnieś / podnies", "pu / penup", "", "Podnieś pisak"],
  ["opu / opuść / opusc", "pd / pendown", "", "Opuść pisak"],
  ["kolor", "color", '"#16866a"', "Kolor #RRGGBB"],
  ["grubosc / grubość", "width", "3", "Grubość: 1–12"],
  [
    "powtorz / powtórz",
    "repeat",
    "4 [np 100 pw 90]",
    "Powtórzenie: całkowite 0–10 000",
  ],
  ["gora / góra", "pitchup", "90", "Obrót w górę — tylko 3D"],
  ["dol / dół", "pitchdown", "90", "Obrót w dół — tylko 3D"],
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
            Zdefiniuj procedurę raz, potem używaj jej nazwy. Parametr zaczyna
            się od dwukropka. Nazwy i polecenia nie rozróżniają wielkości liter.
          </p>
          <pre>{`oto kwadrat :bok\n  powtorz 4 [np :bok pw 90]\njuż\n\npowtorz 8 [kwadrat 90 lw 45]`}</pre>
          <p>
            Alias: <code>to / end</code>. Działa też <code>juz</code>. Nagłówek
            i zakończenie zajmują osobne wiersze. Definicje są poza
            powtórzeniami; możesz je umieścić przed lub po wywołaniu. Procedury
            nie mogą wywoływać siebie, nawet przez pomocnika.
          </p>
        </FramePanel>
      </Frame>
      <Frame className="reference-block">
        <FramePanel>
          <h2>Składnia i limity</h2>
          <p>
            Liczby dziesiętne, także ujemne; parametry mogą zastąpić liczby.
            Średnik rozpoczyna komentarz. Zagnieżdżaj powtórzenia w nawiasach{" "}
            <code>[ ]</code>. Kolory wpisuj jako literały szesnastkowe.
          </p>
          <p>
            Do 50 000 znaków, 10 000 tokenów i operacji, 32 poziomów nawiasów
            lub aktywnych ramek oraz 10 000 odcinków. Współrzędne: ±100 000.
            Brak arytmetyki, zmiennych globalnych i wartości zwracanych. Błąd
            wskazuje wiersz i kolumnę.
          </p>
        </FramePanel>
      </Frame>
    </>
  );
}
