import { run, type Mode, type Segment } from './interpreter';
export interface Challenge { id:string; title:string; level:string; description:string; hint:string; mode:Mode; expected:string; starter:string }
export const challenges:Challenge[]=[
  {id:'square',title:'Zamknij kwadrat',level:'01 · Rozgrzewka',description:'Narysuj kwadrat o boku 100. Zacznij w punkcie (0, 0), skieruj się do przodu i skręcaj w prawo. Użyj pętli lub czterech ruchów.',hint:'Pełny obrót to 360°. Kwadrat ma cztery równe kąty.',mode:'2d',expected:'powtorz 4 [np 100 pw 90]',starter:'; Kwadrat o boku 100\npowtorz 4 [\n  np 100\n  ; Dodaj skręt\n]'},
  {id:'triangle',title:'Trzy równe boki',level:'02 · Kąty',description:'Narysuj trójkąt równoboczny o boku 120. Zacznij w (0, 0), rusz do przodu i skręcaj w prawo.',hint:'Żółw obraca się o kąt zewnętrzny: 360 podzielone przez liczbę boków.',mode:'2d',expected:'powtorz 3 [np 120 pw 120]',starter:'; Trzy boki i trzy skręty\n'},
  {id:'star',title:'Sięgnij gwiazd',level:'03 · Powtórzenia',description:'Narysuj pięcioramienną gwiazdę: pięć odcinków długości 150, po każdym skręt o 144° w prawo. Zacznij w (0, 0), do przodu.',hint:'Wystarczy jedno „powtorz 5” i dwie komendy w nawiasach.',mode:'2d',expected:'powtorz 5 [np 150 pw 144]',starter:'; Pięć odcinków, jedna gwiazda\n'},
  {id:'dash',title:'Przerwa na oddech',level:'04 · Pisak',description:'Na osi Y narysuj trzy odcinki po 40, z przerwami po 20. Pierwszy odcinek zaczyna się w (0, 0) i biegnie do przodu.',hint:'„pod” podnosi pisak, a „opu” opuszcza. Ruch z podniesionym pisakiem nie zostawia śladu.',mode:'2d',expected:'powtorz 3 [np 40 pod np 20 opu]',starter:'; Trzy kreski z przerwami\n'},
  {id:'stairs',title:'Schody do przestrzeni',level:'05 · Trzeci wymiar',description:'W 3D narysuj cztery stopnie. Każdy prowadzi 50 jednostek do przodu (+Y), a potem 25 w górę (+Z). Zacznij w (0, 0, 0).',hint:'Po „gora 90” żółw patrzy w górę. „dol 90” przywróci kierunek poziomy.',mode:'3d',expected:'powtorz 4 [np 50 gora 90 np 25 dol 90]',starter:'; Cztery kroki w przestrzeni\npowtorz 4 [\n  np 50\n  ; Teraz w górę\n]'},
  {id:'hexagon',title:'Własna procedura',level:'06 · Małe narzędzia',description:'Narysuj sześciokąt foremny o boku 80, zaczynając w (0, 0), do przodu i z zakrętami w prawo. Spróbuj użyć procedury z parametrem.',hint:'Procedurę zacznij od „oto sześciokąt ma: bok”, a zakończ słowem „już”. Kąt to 360 / 6.',mode:'2d',expected:'powtorz 6 [np 80 pw 60]',starter:'oto sześciokąt ma: bok\n  ; Twój kod\njuż\n\nsześciokąt 80'},
];
// Compare geometric coverage in both directions. Splitting or retracing a line,
// command choice, stroke colour and drawing order do not change the answer.
function distanceToSegment(p:number[],s:Segment):number {
  const d=s.to.map((x,i)=>x-s.from[i]); const length=d.reduce((a,x)=>a+x*x,0);
  const t=length?Math.max(0,Math.min(1,d.reduce((a,x,i)=>a+x*(p[i]-s.from[i]),0)/length)):0;
  return Math.hypot(...p.map((x,i)=>x-s.from[i]-d[i]*t));
}
function covered(a:Segment[],b:Segment[]) {
  return a.every(s=> {
    const length=Math.hypot(...s.to.map((x,i)=>x-s.from[i]));
    const steps=Math.max(2,Math.ceil(length/3));
    for(let k=0;k<=steps;k++) {
      const p=s.from.map((x,i)=>x+(s.to[i]-x)*k/steps);
      if(!b.some(target=>distanceToSegment(p,target)<=0.8)) return false;
    }
    return true;
  });
}
export function checkChallenge(challenge:Challenge,source:string):{pass:boolean;reason:string} {
  const result=run(source,challenge.mode);
  if(result.error) return {pass:false,reason:`Najpierw popraw program: ${result.error.message} (wiersz ${result.error.line}, kolumna ${result.error.column}).`};
  if(!result.segments.length) return {pass:false,reason:'Jeszcze nie ma rysunku. Opuść pisak i porusz żółwiem.'};
  const expected=run(challenge.expected,challenge.mode).segments;
  if(!covered(result.segments,expected)) return {pass:false,reason:'Część odcinków wychodzi poza wzór. Sprawdź długości, kąty i położenie początkowe.'};
  if(!covered(expected,result.segments)) return {pass:false,reason:'Brakuje części wzoru. Sprawdź liczbę powtórzeń i to, czy pisak jest opuszczony.'};
  return {pass:true,reason:'Wszystkie odcinki pasują. Dobra robota — kolejne wyzwanie czeka!'};
}
