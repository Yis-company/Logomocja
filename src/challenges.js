import {run} from './interpreter.js';
export const challenges=[
 {id:'square',name:'Pierwszy kwadrat',level:'Na rozgrzewkę',mode:'2d',description:'Narysuj kwadrat o boku 80. Zacznij w (0, 0), idź w górę i skręcaj w prawo. Wróć do początku.',hint:'Cztery razy wykonaj ruch i skręt o 90°.',solution:'powtorz 4 [np 80 pw 90]'},
 {id:'triangle',name:'Trzy dobre kroki',level:'Na rozgrzewkę',mode:'2d',description:'Narysuj trójkąt równoboczny o boku 100. Zacznij w (0, 0), pierwszy bok skieruj w górę, skręcaj w prawo.',hint:'Żółw obraca się o kąt zewnętrzny: 360 / 3.',solution:'powtorz 3 [np 100 pw 120]'},
 {id:'star',name:'Sięgnij gwiazd',level:'Małe wyzwanie',mode:'2d',description:'Narysuj pięcioramienną gwiazdę z pięciu odcinków długości 120. Zacznij w (0, 0), pierwszy odcinek w górę. Skręcaj w prawo.',hint:'Kąt gwiezdnego skrętu to 144°.',solution:'powtorz 5 [np 120 pw 144]'},
 {id:'stairs',name:'Coraz wyżej',level:'W przestrzeni',mode:'3d',description:'Zbuduj trzy schodki od (0, 0, 0): każdy najpierw 40 jednostek w kierunku +Y, potem 20 w kierunku +Z.',hint:'Unieś nos o 90°, wejdź w górę, a potem opuść nos o 90°.',solution:'powtorz 3 [np 40 gora 90 np 20 dol 90]'},
 {id:'circle',name:'Prawie okrąg',level:'Małe wyzwanie',mode:'2d',description:'Narysuj okrąg z 36 odcinków po 10 jednostek. Początek w (0, 0), pierwszy ruch w górę, skręty w prawo.',hint:'Pełny obrót to 360°. Podziel go na 36 skrętów.',solution:'powtorz 36 [np 10 pw 10]'},
 {id:'cube',name:'Własny sześcian',level:'W przestrzeni',mode:'3d',description:'Narysuj 12 krawędzi sześcianu o boku 80 w dodatnich kierunkach X, Y, Z. Jeden wierzchołek ma być w (0, 0, 0).',hint:'Zacznij od dwóch kwadratów na wysokości 0 i 80. Połącz ich wierzchołki.',solution:'powtorz 4 [np 80 pw 90] gora 90 np 80 dol 90 powtorz 4 [np 80 pw 90] powtorz 4 [np 80 dol 90 np 80 pod ws 80 opu gora 90 pw 90]'}
];
function distance(p,s){const v=s.to.map((x,i)=>x-s.from[i]),w=p.map((x,i)=>x-s.from[i]);const len=v.reduce((a,x)=>a+x*x,0);const t=Math.max(0,Math.min(1,w.reduce((a,x,i)=>a+x*v[i],0)/len));return Math.hypot(...p.map((x,i)=>x-s.from[i]-t*v[i]))}
function covered(a,b){for(const s of a){const length=Math.hypot(...s.from.map((v,i)=>s.to[i]-v));const count=Math.min(80,Math.max(2,Math.ceil(length/4)));for(let j=0;j<=count;j++){const p=s.from.map((v,i)=>v+(s.to[i]-v)*j/count);if(!b.some(t=>distance(p,t)<.8))return false}}return true}
export function checkDrawing(source,mode,challenge){
 const actual=run(source,mode);if(actual.error)return {pass:false,message:`Popraw program: ${actual.error.message} (wiersz ${actual.error.line}).`};
 if(mode!==challenge.mode)return {pass:false,message:`To zadanie wymaga trybu ${challenge.mode.toUpperCase()}.`};
 if(!actual.segments.length)return {pass:false,message:'Rysunek jest pusty. Opuść pisak i wykonaj pierwszy ruch.'};
 const expected=run(challenge.solution,challenge.mode).segments;
 if(!covered(actual.segments,expected))return {pass:false,message:'Część linii wychodzi poza wzór. Sprawdź długości, kąty i punkt początkowy.'};
 if(!covered(expected,actual.segments))return {pass:false,message:'Brakuje części rysunku. Sprawdź liczbę powtórzeń i stan pisaka.'};
 return {pass:true,message:'Świetnie! Wszystkie linie są na swoim miejscu. Zadanie ukończone.'};
}
