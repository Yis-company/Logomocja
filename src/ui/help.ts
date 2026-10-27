export const HELP_HTML = `
<section>
  <h3>Polecenia</h3>
  <table class="ref">
    <thead><tr><th>Polecenie</th><th>Po angielsku</th><th>Argument</th><th>Działanie</th></tr></thead>
    <tbody>
      <tr><td><code>np</code>, <code>naprzód</code></td><td><code>fd</code>, <code>forward</code></td><td>liczba</td><td>idź naprzód</td></tr>
      <tr><td><code>ws</code>, <code>wstecz</code></td><td><code>bk</code>, <code>back</code></td><td>liczba</td><td>idź wstecz</td></tr>
      <tr><td><code>pw</code>, <code>prawo</code></td><td><code>rt</code>, <code>right</code></td><td>stopnie</td><td>obróć w prawo</td></tr>
      <tr><td><code>lw</code>, <code>lewo</code></td><td><code>lt</code>, <code>left</code></td><td>stopnie</td><td>obróć w lewo</td></tr>
      <tr><td><code>pod</code>, <code>podnieś</code></td><td><code>pu</code>, <code>penup</code></td><td>—</td><td>podnieś pisak (ruch bez rysowania)</td></tr>
      <tr><td><code>opu</code>, <code>opuść</code></td><td><code>pd</code>, <code>pendown</code></td><td>—</td><td>opuść pisak</td></tr>
      <tr><td><code>kolor</code></td><td><code>color</code></td><td><code>"#rrggbb"</code></td><td>kolor pisaka</td></tr>
      <tr><td><code>grubość</code></td><td><code>width</code></td><td>1–12</td><td>grubość linii</td></tr>
      <tr><td><code>powtórz</code></td><td><code>repeat</code></td><td>liczba <code>[ … ]</code></td><td>powtórz polecenia w nawiasach</td></tr>
      <tr><td><code>góra</code></td><td><code>pitchup</code></td><td>stopnie</td><td>unieś nos żółwia (tylko 3D)</td></tr>
      <tr><td><code>dół</code></td><td><code>pitchdown</code></td><td>stopnie</td><td>opuść nos żółwia (tylko 3D)</td></tr>
    </tbody>
  </table>
  <p>Wielkość liter nie ma znaczenia, a polskie znaki można pomijać (<code>powtorz</code>, <code>gora</code>). Średnik <code>;</code> rozpoczyna komentarz do końca wiersza.</p>
</section>
<section>
  <h3>Procedury</h3>
<pre class="sample">oto kwadrat ma: bok, kąt
  powtórz 4 [np bok pw kąt]
już

kwadrat 80 90</pre>
  <p>Definicja zaczyna się od <code>oto</code> na początku wiersza i kończy słowem <code>już</code> w osobnym wierszu. Parametry wymienia się po <code>ma:</code> (dawny zapis <code>oto kwadrat :bok :kąt</code> też działa). Parametr może zastąpić każdą liczbę w treści procedury. Procedura nie może wywoływać samej siebie.</p>
</section>
<section>
  <h3>Żółw</h3>
  <p>Startuje na środku, zwrócony do góry (oś Y), z opuszczonym pisakiem w kolorze <code>"#16866a"</code> o grubości 3. W trybie 3D oś Z wychodzi z ekranu; <code>góra</code> i <code>dół</code> obracają żółwia wokół jego prawego boku.</p>
</section>
<section>
  <h3>Skróty i obsługa</h3>
  <ul>
    <li><kbd>Ctrl</kbd>+<kbd>Enter</kbd> – uruchom program</li>
    <li><kbd>Tab</kbd> – wcięcie dwoma spacjami</li>
    <li>Rysunek: przeciągnij, by przesunąć; kółko lub szczypnięcie, by przybliżyć; dwuklik dopasowuje widok (2D)</li>
    <li>W 3D: lewy przycisk obraca, prawy (lub dwa palce) przesuwa, kółko przybliża</li>
  </ul>
</section>
<section>
  <h3>Ograniczenia</h3>
  <p>Program ma najwyżej 50 000 znaków i 10 000 słów; nawiasy i wywołania zagnieżdżają się do 32 poziomów; wykonuje się najwyżej 10 000 operacji i rysuje 10 000 odcinków; współrzędne mieszczą się w ±100 000.</p>
</section>
`;
