import type { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';
import { highlight } from '../editor/highlight';
import type { Mode } from '../lang/ast';
import { navigate } from '../state/router';
import { loadProgram } from '../state/studio';
import { ShortcutList } from './Dialogs';
import { Icon } from './icons';
import { Thumbnail } from './Thumbnail';

function Code({ children }: { children: string }) {
  return <code class="code-inline">{children}</code>;
}

interface ExampleProps {
  code: string;
  mode?: Mode;
  title: string;
  /** Show a preview of the drawing (default: true). */
  preview?: boolean;
}

/** A highlighted example with a preview and a button that opens it in the studio. */
function Example({ code, mode = '2d', title, preview = true }: ExampleProps) {
  const open = async () => {
    const ok = await loadProgram(code, mode, { title, animate: true });
    if (ok) navigate({ name: 'studio' });
  };
  return (
    <figure class="example">
      <pre class="code-block" aria-label={`Przykład: ${title}`}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code, null) }} />
      </pre>
      {preview && <Thumbnail code={code} mode={mode} width={180} height={130} label={`Rysunek przykładu: ${title}`} />}
      <figcaption>
        <button type="button" class="btn btn-small" onClick={open}>
          <Icon name="play" size={16} /> <span>Wypróbuj{mode === '3d' ? ' w 3D' : ''}</span>
        </button>
      </figcaption>
    </figure>
  );
}

interface CommandEntry {
  id: string;
  polish: string[];
  english: string[];
  arg: string;
  text: ComponentChildren;
  example: string;
  mode?: Mode;
}

const COMMANDS: CommandEntry[] = [
  {
    id: 'np',
    polish: ['np', 'naprzod', 'naprzód'],
    english: ['fd', 'forward'],
    arg: 'odległość (wyrażenie)',
    text: <>Żółw idzie naprzód o podaną odległość. Jeśli pióro jest opuszczone, rysuje odcinek. Liczba ujemna oznacza ruch do tyłu.</>,
    example: 'np 100',
  },
  {
    id: 'ws',
    polish: ['ws', 'wstecz'],
    english: ['bk', 'back'],
    arg: 'odległość (wyrażenie)',
    text: <>Żółw cofa się o podaną odległość, nie zmieniając kierunku.</>,
    example: 'np 80\npw 90\nws 50',
  },
  {
    id: 'pw',
    polish: ['pw', 'prawo'],
    english: ['rt', 'right'],
    arg: 'kąt w stopniach',
    text: <>Żółw obraca się w prawo (zgodnie z ruchem wskazówek zegara, patrząc z góry). Kąt może być ułamkiem lub liczbą ujemną.</>,
    example: 'np 80\npw 120\nnp 80',
  },
  {
    id: 'lw',
    polish: ['lw', 'lewo'],
    english: ['lt', 'left'],
    arg: 'kąt w stopniach',
    text: <>Żółw obraca się w lewo o podany kąt.</>,
    example: 'np 80\nlw 45\nnp 80',
  },
  {
    id: 'pod',
    polish: ['pod', 'podnies', 'podnieś'],
    english: ['pu', 'penup'],
    arg: 'brak',
    text: <>Podnosi pióro: żółw porusza się dalej, ale nie zostawia śladu.</>,
    example: 'np 40\npod\nnp 30\nopu\nnp 40',
  },
  {
    id: 'opu',
    polish: ['opu', 'opusc', 'opuść'],
    english: ['pd', 'pendown'],
    arg: 'brak',
    text: <>Opuszcza pióro: od tej chwili ruch znów rysuje. Na początku programu pióro jest opuszczone.</>,
    example: 'powtorz 5 [\n  np 15\n  pod np 10 opu\n]',
  },
  {
    id: 'kolor',
    polish: ['kolor'],
    english: ['color'],
    arg: 'kolor w cudzysłowie: "#rrggbb"',
    text: (
      <>
        Ustawia kolor pióra. Kolor zapisuje się szesnastkowo, jak w HTML: krzyżyk i sześć cyfr <Code>0–9</Code>, <Code>a–f</Code> (wielkość
        liter nie ma znaczenia), w cudzysłowie. Domyślny kolor to <Code>"#16866a"</Code>.
      </>
    ),
    example: 'kolor "#c1763d"\nnp 60\nkolor "#2b6fb3"\npw 90\nnp 60',
  },
  {
    id: 'grubosc',
    polish: ['grubosc', 'grubość'],
    english: ['width'],
    arg: 'liczba całkowita od 1 do 12',
    text: <>Ustawia grubość linii (w pikselach ekranu). Domyślna grubość to 3.</>,
    example: 'powtorz 6 [\n  grubosc nrpowt * 2\n  np 25\n  pw 60\n]',
  },
  {
    id: 'powtorz',
    polish: ['powtorz', 'powtórz'],
    english: ['repeat'],
    arg: 'liczba całkowita od 0 do 10 000, potem [ polecenia ]',
    text: (
      <>
        Wykonuje polecenia w nawiasach kwadratowych podaną liczbę razy. Powtórzenia można zagnieżdżać. Wewnątrz działa wartość{' '}
        <a href="#/opis/nrpowt">nrpowt</a>.
      </>
    ),
    example: 'powtorz 8 [np 50 pw 45]',
  },
  {
    id: 'niech',
    polish: ['niech'],
    english: ['let'],
    arg: 'nazwa, potem wartość (wyrażenie)',
    text: (
      <>
        Nadaje zmiennej wartość. Kolejne <Code>niech</Code> z tą samą nazwą zmienia wartość. Zobacz <a href="#/opis/zmienne">Zmienne</a>.
      </>
    ),
    example: 'niech bok 20\npowtorz 8 [\n  np bok pw 90\n  niech bok bok + 10\n]',
  },
  {
    id: 'jesli',
    polish: ['jeśli', 'jesli'],
    english: ['if'],
    arg: 'warunek, potem [ polecenia ]',
    text: <>Wykonuje polecenia w nawiasach tylko wtedy, gdy warunek jest spełniony.</>,
    example: 'powtorz 12 [\n  jeśli nrpowt > 6 [kolor "#c1763d"]\n  np 30 pw 30\n]',
  },
  {
    id: 'jezeli',
    polish: ['jeżeli', 'jezeli'],
    english: ['ifelse'],
    arg: 'warunek, potem [ gdy tak ] [ gdy nie ]',
    text: <>Wykonuje pierwszą część, gdy warunek jest spełniony, a drugą — gdy nie jest.</>,
    example: 'powtorz 10 [\n  jeżeli nrpowt < 6 [kolor "#16866a"] [kolor "#a478c0"]\n  np 40 pw 36\n]',
  },
  {
    id: 'stop',
    polish: ['stop'],
    english: ['stop'],
    arg: 'brak',
    text: (
      <>
        Kończy bieżącą procedurę (nawet ze środka powtórzenia czy warunku). Poza procedurą kończy cały program. Zobacz{' '}
        <a href="#/opis/procedury">Procedury</a>.
      </>
    ),
    example: 'powtorz 10 [\n  np 20 pw 90\n  jeśli nrpowt = 5 [stop]\n]',
  },
  {
    id: 'dom',
    polish: ['dom'],
    english: ['home'],
    arg: 'brak',
    text: (
      <>
        Żółw wraca do punktu (0, 0, 0) — rysując odcinek, jeśli pióro jest opuszczone — i ustawia się jak na starcie: przodem w stronę +Y. Stan
        pióra, kolor i grubość się nie zmieniają.
      </>
    ),
    example: 'np 80\npw 90\nnp 60\ndom',
  },
  {
    id: 'czysc',
    polish: ['czyść', 'czysc'],
    english: ['cs', 'clearscreen'],
    arg: 'brak',
    text: <>Usuwa wszystko, co do tej pory narysowano. Żółw zostaje tam, gdzie był, z tym samym kierunkiem i piórem.</>,
    example: 'np 100\nczyść\npw 90\nnp 50',
  },
  {
    id: 'gora',
    polish: ['gora', 'góra'],
    english: ['pitchup'],
    arg: 'kąt w stopniach (tylko 3D)',
    text: <>Zadziera nos żółwia: obraca kierunek ruchu w stronę jego „góry”. Po <Code>gora 90</Code> żółw leci tam, gdzie wcześniej miał grzbiet.</>,
    example: 'np 60\ngora 90\nnp 60',
    mode: '3d',
  },
  {
    id: 'dol',
    polish: ['dol', 'dół'],
    english: ['pitchdown'],
    arg: 'kąt w stopniach (tylko 3D)',
    text: <>Opuszcza nos żółwia — obrót przeciwny do <Code>gora</Code>.</>,
    example: 'np 60\ndol 45\nnp 60',
    mode: '3d',
  },
  {
    id: 'pp',
    polish: ['pp', 'przechylprawo'],
    english: ['rr', 'rollright'],
    arg: 'kąt w stopniach (tylko 3D)',
    text: (
      <>
        Przechyla żółwia na prawe skrzydło, wokół kierunku ruchu. Kierunek się nie zmienia, ale zmienia się, gdzie jest „góra” i „prawo” — więc
        kolejne <Code>pw</Code> i <Code>gora</Code> działają w innej płaszczyźnie.
      </>
    ),
    example: 'pp 90\npowtorz 4 [np 60 pw 90]',
    mode: '3d',
  },
  {
    id: 'pl',
    polish: ['pl', 'przechyllewo'],
    english: ['rl', 'rollleft'],
    arg: 'kąt w stopniach (tylko 3D)',
    text: <>Przechyla żółwia na lewe skrzydło — obrót przeciwny do <Code>pp</Code>.</>,
    example: 'powtorz 6 [\n  powtorz 4 [np 50 pw 90]\n  pl 30\n]',
    mode: '3d',
  },
];

const TOC: [string, string][] = [
  ['start', 'Pierwsze kroki'],
  ['polecenia', 'Wszystkie polecenia'],
  ['powtorz-opis', 'Powtórzenia i nrpowt'],
  ['wyrazenia', 'Liczby i wyrażenia'],
  ['zmienne', 'Zmienne'],
  ['warunki', 'Warunki'],
  ['procedury', 'Procedury'],
  ['przestrzen', 'Rysowanie w 3D'],
  ['bledy', 'Błędy'],
  ['limity', 'Ograniczenia'],
  ['skroty', 'Skróty klawiszowe'],
];

function Section({ id, title, children }: { id: string; title: string; children: ComponentChildren }) {
  return (
    <section id={id} class="ref-section" aria-labelledby={`${id}-h`} tabIndex={-1}>
      <h2 id={`${id}-h`}>{title}</h2>
      {children}
    </section>
  );
}

export function ReferencePage({ section }: { section: string | null }) {
  useEffect(() => {
    if (!section) {
      window.scrollTo(0, 0);
      return;
    }
    const target = document.getElementById(section === 'nrpowt' ? 'powtorz-opis' : section);
    if (target) {
      target.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
    }
  }, [section]);

  return (
    <main class="page page-ref" id="main" tabIndex={-1}>
      <header class="page-head">
        <h1>Opis języka</h1>
        <p>
          Logomocja mówi dialektem języka Logo z polskimi poleceniami. Żółw chodzi po płaszczyźnie (tryb 2D) albo lata w przestrzeni (tryb 3D) i
          rysuje swoim piórem. Każde polecenie ma też angielski odpowiednik — oba zapisy działają tak samo.
        </p>
      </header>
      <div class="ref-layout">
        <nav class="ref-toc" aria-label="Spis treści">
          <h2 class="ref-toc-title">Spis treści</h2>
          <ol>
            {TOC.map(([id, label]) => (
              <li key={id}>
                <a href={`#/opis/${id}`} aria-current={section === id ? 'location' : undefined}>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div class="ref-content">
          <Section id="start" title="Pierwsze kroki">
            <p>
              Program to ciąg poleceń dla żółwia. Polecenia oddziela się spacjami lub nowymi liniami; wielkość liter nie ma znaczenia
              (<Code>NP</Code>, <Code>Np</Code> i <Code>np</Code> to to samo), a polskie litery można pominąć (<Code>powtórz</Code> i{' '}
              <Code>powtorz</Code> działają tak samo). Średnik zaczyna komentarz, który trwa do końca linii.
            </p>
            <Example title="Pierwszy program" code={'; Mój pierwszy program\nnp 100   ; naprzód o 100\npw 90    ; w prawo o 90 stopni\nnp 50'} />
            <p>
              Na starcie żółw stoi w punkcie (0, 0, 0) i patrzy w stronę +Y (w górę ekranu). Oś X biegnie w prawo, a w trybie 3D oś Z wychodzi z
              kartki w stronę patrzącego. Pióro jest opuszczone, kolor to <Code>"#16866a"</Code>, a grubość 3. Kolor, grubość i stan pióra
              obowiązują, dopóki ich nie zmienisz.
            </p>
            <p>
              Przycisk <strong>Uruchom</strong> wykonuje cały program i pokazuje, jak żółw rysuje (tempo zmienisz suwakiem).{' '}
              <strong>Krok</strong> wykonuje jedno polecenie, <strong>Pauza</strong> wstrzymuje rysowanie, a <strong>Od nowa</strong> czyści rysunek.
              Wykonywane polecenie jest podświetlone w edytorze.
            </p>
          </Section>

          <Section id="polecenia" title="Wszystkie polecenia">
            <div class="table-wrap">
              <table class="ref-table">
                <caption class="sr-only">Polecenia języka</caption>
                <thead>
                  <tr>
                    <th scope="col">Polecenie</th>
                    <th scope="col">Po angielsku</th>
                    <th scope="col">Argument</th>
                  </tr>
                </thead>
                <tbody>
                  {COMMANDS.map((c) => (
                    <tr key={c.id}>
                      <th scope="row">
                        <a href={`#/opis/cmd-${c.id}`}>{c.polish.join(', ')}</a>
                        {c.mode === '3d' && <span class="badge">3D</span>}
                      </th>
                      <td>{c.english.join(', ')}</td>
                      <td>{c.arg}</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">
                      <a href="#/opis/powtorz-opis">nrpowt</a>
                    </th>
                    <td>repcount</td>
                    <td>— to wartość, nie polecenie</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <a href="#/opis/procedury">oto … już</a>
                    </th>
                    <td>to … end</td>
                    <td>definicja procedury</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {COMMANDS.map((c) => (
              <article key={c.id} id={`cmd-${c.id}`} class="command" tabIndex={-1}>
                <h3>
                  <code>{c.polish[0]}</code>
                  {c.mode === '3d' && <span class="badge">tylko 3D</span>}
                </h3>
                <p class="command-aliases">
                  Inne zapisy: {[...c.polish.slice(1), ...c.english].map((a, i) => (
                    <>
                      {i > 0 && ', '}
                      <Code>{a}</Code>
                    </>
                  ))}
                  . Argument: {c.arg}.
                </p>
                <p>{c.text}</p>
                <Example title={c.polish[0]} code={c.example} mode={c.mode} />
              </article>
            ))}
          </Section>

          <Section id="powtorz-opis" title="Powtórzenia i nrpowt">
            <p>
              <Code>powtorz n [ … ]</Code> wykonuje polecenia w nawiasach <Code>n</Code> razy. Liczba powtórzeń musi być liczbą całkowitą od 0
              do 10 000 (przy 0 nic się nie dzieje). W nawiasach może stać wszystko: inne powtórzenia, warunki, wywołania procedur.
            </p>
            <p>
              <Code>nrpowt</Code> (po angielsku <Code>repcount</Code>) to numer bieżącego obrotu najbliższego otaczającego powtórzenia, licząc od
              1. Liczy się miejsce zapisu: <Code>nrpowt</Code> musi stać wewnątrz nawiasów <Code>powtorz</Code> w tej samej procedurze (lub w
              programie głównym). Napisane poza powtórzeniem jest błędem — nawet jeśli procedura jest wywoływana z wnętrza powtórzenia.
            </p>
            <Example title="Rosnące boki" code={'powtorz 36 [\n  np nrpowt * 4\n  pw 50\n]'} />
            <Example title="Zagnieżdżone powtórzenia" code={'powtorz 6 [\n  powtorz 3 [np 40 pw 120]\n  pw 60\n]'} />
          </Section>

          <Section id="wyrazenia" title="Liczby i wyrażenia">
            <p>
              Liczby zapisuje się cyframi, z kropką dziesiętną: <Code>80</Code>, <Code>12.5</Code>, <Code>.5</Code>. Inne zapisy, takie jak{' '}
              <Code>1e3</Code> czy <Code>0x10</Code>, są błędem. Znak minus nie jest częścią liczby — to działanie.
            </p>
            <p>
              Tam, gdzie polecenie oczekuje liczby, można napisać wyrażenie: liczbę, nazwę parametru lub zmiennej (także w starym zapisie{' '}
              <Code>:bok</Code>), <Code>nrpowt</Code>, wyrażenie w nawiasach okrągłych, wyrażenie poprzedzone znakiem <Code>-</Code> lub{' '}
              <Code>+</Code>, albo dwa wyrażenia połączone działaniem <Code>+</Code>, <Code>-</Code>, <Code>*</Code>, <Code>/</Code>.
            </p>
            <ul>
              <li>
                Mnożenie i dzielenie wykonuje się przed dodawaniem i odejmowaniem: <Code>np 2 + 3 * 4</Code> idzie o 14.
              </li>
              <li>
                Działania o tym samym priorytecie liczy się od lewej: <Code>np 20 - 5 - 3</Code> idzie o 12.
              </li>
              <li>
                Znaki można łączyć i stawiać przed każdą wartością: <Code>np -(3 - 5)</Code>, <Code>np - -2</Code>, <Code>np -bok</Code>.
              </li>
              <li>Dzielenie przez zero i wynik nieskończony są błędem wykonania.</li>
            </ul>
            <div class="callout">
              <h3>Ważne: spacje wokół działań</h3>
              <p>
                Operator <Code>+</Code>, <Code>-</Code>, <Code>*</Code> lub <Code>/</Code> między dwiema wartościami musi mieć spacje po obu
                stronach albo po żadnej. <Code>np 10 - 5</Code> i <Code>np 10-5</Code> idą o 5. Natomiast <Code>np 10 -5</Code> to polecenie{' '}
                <Code>np 10</Code>, po którym stoi osobna wartość <Code>-5</Code> — a to błąd. Dzięki tej zasadzie wywołanie{' '}
                <Code>kwadrat 10 -5</Code> przekazuje procedurze dwa argumenty: 10 i −5. Zasada nie dotyczy porównań.
              </p>
            </div>
            <Example title="Wyrażenia" code={'niech bok 30\nnp bok * 2 + 10\npw 180 / 2\nnp (bok + 10) * 2\npw 90\nnp -bok'} />
          </Section>

          <Section id="zmienne" title="Zmienne">
            <p>
              <Code>niech nazwa wartość</Code> zapamiętuje wartość pod nazwą. Nazwy zaczynają się od litery i mogą zawierać litery (także polskie),
              cyfry i podkreślnik; wielkość liter nie ma znaczenia. Nazwa zmiennej nie może być poleceniem języka ani nazwą procedury.
            </p>
            <ul>
              <li>
                <Code>niech</Code> w programie głównym tworzy lub zmienia zmienną globalną, widoczną także w procedurach.
              </li>
              <li>
                <Code>niech</Code> wewnątrz procedury tworzy zmienną lokalną tego wywołania. Od tej chwili do końca wywołania przesłania ona
                zmienną globalną o tej samej nazwie i znika po zakończeniu procedury. Tak samo można zmieniać parametry.
              </li>
              <li>
                Nazwy wolno użyć w wyrażeniu tylko wtedy, gdy jest parametrem bieżącej procedury albo gdzieś w tej procedurze lub w programie
                głównym stoi <Code>niech</Code> z tą nazwą (przed użyciem lub po nim). Inaczej program się nie uruchomi.
              </li>
              <li>Odczyt zmiennej, która w danej chwili jeszcze nie dostała wartości, jest błędem wykonania.</li>
            </ul>
            <Example title="Zmienna globalna" code={'niech krok 10\npowtorz 12 [\n  np krok\n  pw 90\n  niech krok krok + 10\n]'} />
          </Section>

          <Section id="warunki" title="Warunki">
            <p>
              Warunek to dwa wyrażenia połączone porównaniem: <Code>&lt;</Code> (mniejsze), <Code>&gt;</Code> (większe), <Code>=</Code>{' '}
              (równe), <Code>&lt;=</Code>, <Code>&gt;=</Code>, <Code>&lt;&gt;</Code> (różne). Porównania są dokładne, więc{' '}
              <Code>jeśli 0.1 + 0.2 = 0.3 [ … ]</Code> nie wykona nawiasu — ułamki dziesiętne nie zawsze dają się zapisać w komputerze
              dokładnie.
            </p>
            <p>
              <Code>jeśli warunek [ … ]</Code> wykonuje nawias, gdy warunek jest spełniony. <Code>jeżeli warunek [ … ] [ … ]</Code> wykonuje
              pierwszy nawias, gdy jest spełniony, a drugi — gdy nie jest.
            </p>
            <Example
              title="Na zmianę"
              code={'niech parzysty 0\npowtorz 12 [\n  jeżeli parzysty = 0 [kolor "#c1763d"] [kolor "#16866a"]\n  niech parzysty 1 - parzysty\n  np 40\n  pw 30\n]'}
            />
          </Section>

          <Section id="procedury" title="Procedury">
            <p>
              Procedura to nowe polecenie zbudowane z innych. Definicja zaczyna się słowem <Code>oto</Code> (lub <Code>to</Code>) na początku
              linii; w tej samej linii stoi nazwa i — opcjonalnie — <Code>ma:</Code> z listą parametrów oddzielonych przecinkami. Treść zaczyna się
              w następnej linii, a kończy słowem <Code>już</Code> (lub <Code>juz</Code>, <Code>end</Code>) stojącym samotnie w osobnej linii.
            </p>
            <Example title="Kwadrat z parametrami" code={'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90'} />
            <ul>
              <li>
                Działa też stary nagłówek <Code>oto kwadrat :bok :kąt</Code>, a w treści parametr można pisać jako <Code>:bok</Code> albo po
                prostu <Code>bok</Code>.
              </li>
              <li>
                Wywołanie podaje dokładnie tyle argumentów, ile procedura ma parametrów, oddzielonych spacjami. Każdy argument jest wyrażeniem:{' '}
                <Code>kwadrat 40 * 2 90</Code> przekazuje 80 i 90.
              </li>
              <li>
                Procedury definiuje się tylko na najwyższym poziomie programu (nie wewnątrz nawiasów ani innej procedury), przed użyciem lub po
                nim. Każdą nazwę można zdefiniować raz.
              </li>
              <li>
                Parametr może nazywać się tak jak procedura: jako polecenie ta nazwa wywołuje procedurę, a jako argument oznacza parametr.
              </li>
              <li>
                Procedura może wywoływać samą siebie (rekurencja). <Code>stop</Code> natychmiast kończy bieżące wywołanie — także ze środka
                powtórzenia lub warunku. Procedury nie zwracają wartości.
              </li>
            </ul>
            <Example
              title="Rekurencja"
              code={'oto gałąź ma: dł\n  jeśli dł < 8 [stop]\n  np dł\n  lw 30 gałąź dł * 0.65\n  pw 60 gałąź dł * 0.65\n  lw 30\n  pod ws dł opu\njuż\n\ngałąź 60'}
            />
          </Section>

          <Section id="przestrzen" title="Rysowanie w 3D">
            <p>
              W trybie 3D żółw ma trzy kierunki: przód (kierunek ruchu), prawe skrzydło i grzbiet („górę”). <Code>pw</Code> i <Code>lw</Code>{' '}
              obracają go wokół grzbietu, <Code>gora</Code> i <Code>dol</Code> — wokół skrzydeł, a <Code>pp</Code> i <Code>pl</Code> — wokół
              kierunku ruchu. Na rysunku żółw jest strzałką: jasny wierzch, ciemny spód i pomarańczowa płetwa na grzbiecie.
            </p>
            <p>
              Program złożony tylko z poleceń płaskich (bez <Code>gora</Code>, <Code>dol</Code>, <Code>pp</Code>, <Code>pl</Code>) rysuje w 3D
              dokładnie ten sam kształt co w 2D — na podłodze, czyli w płaszczyźnie XY. Widok „Z góry” pokazuje go tak jak tryb 2D. W trybie 2D
              polecenia przestrzenne są błędem.
            </p>
            <p>
              Kamerą steruje się myszą (przeciąganie obraca, z klawiszem Shift lub prawym przyciskiem przesuwa, kółko przybliża), palcami (jeden
              obraca, dwa przesuwają i przybliżają) albo klawiaturą po kliknięciu rysunku.
            </p>
            <Example title="Spirala w górę" mode="3d" code={'kolor "#2b6fb3"\npowtorz 60 [\n  np 12\n  pw 20\n  gora 3\n]'} />
            <Example title="Kwiat z kwadratów w przestrzeni" mode="3d" code={'powtorz 8 [\n  powtorz 4 [np 60 pw 90]\n  pp 45\n]'} />
          </Section>

          <Section id="bledy" title="Błędy">
            <p>
              Przed narysowaniem czegokolwiek Logomocja sprawdza cały program. Jeśli znajdzie błąd (np. nieznane polecenie, brak argumentu, zły
              kolor, niedomknięty nawias, brak <Code>już</Code>), nic nie rysuje i pokazuje w edytorze dokładne miejsce: linię, kolumnę i opis
              po polsku. Edytor sprawdza program także na bieżąco, w trakcie pisania.
            </p>
            <p>
              Niektóre błędy wychodzą dopiero w trakcie wykonania: dzielenie przez zero, zmienna bez wartości, grubość lub liczba powtórzeń
              obliczona ze zmiennej i niemieszcząca się w zakresie, przekroczony limit. Wtedy wykonanie się zatrzymuje, a to, co narysowano
              wcześniej, zostaje na ekranie. Błąd w argumencie jest wskazywany na początku tego argumentu, a brakujący argument — w miejscu, gdzie
              powinien się zacząć.
            </p>
            <Example title="Błąd wykonania" preview={false} code={'niech d 3\npowtorz 5 [\n  np 30 pw 72\n  niech d d - 1\n  np 60 / d\n]'} />
          </Section>

          <Section id="limity" title="Ograniczenia">
            <p>Aby żaden program nie zawiesił przeglądarki, obowiązują limity. Przekroczenie któregokolwiek jest błędem.</p>
            <div class="table-wrap">
              <table class="ref-table">
                <caption class="sr-only">Limity</caption>
                <tbody>
                  <tr><th scope="row">Długość programu</th><td>50 000 znaków</td></tr>
                  <tr><th scope="row">Liczba elementów</th><td>10 000 (słowa, liczby, teksty, a także operatory, nawiasy i przecinki)</td></tr>
                  <tr><th scope="row">Zagnieżdżenie nawiasów [ ]</th><td>32 poziomy</td></tr>
                  <tr><th scope="row">Jednocześnie trwające wywołania procedur i powtórzenia</th><td>32 (warunki się nie liczą)</td></tr>
                  <tr>
                    <th scope="row">Wykonane operacje</th>
                    <td>
                      10 000 — liczy się każde polecenie, <Code>niech</Code>, warunek, powtórzenie i wywołanie, a także zakończenie każdego obrotu
                      powtórzenia, wykonanego nawiasu warunku i wywołania procedury (obliczanie wyrażeń się nie liczy)
                    </td>
                  </tr>
                  <tr><th scope="row">Odcinki na rysunku</th><td>10 000 (po <Code>czyść</Code> liczone od nowa)</td></tr>
                  <tr><th scope="row">Współrzędne żółwia</th><td>od −100 000 do 100 000</td></tr>
                  <tr><th scope="row">Grubość</th><td>liczba całkowita od 1 do 12</td></tr>
                  <tr><th scope="row">Liczba powtórzeń</th><td>liczba całkowita od 0 do 10 000</td></tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="skroty" title="Skróty klawiszowe">
            <ShortcutList />
          </Section>
        </div>
      </div>
    </main>
  );
}
