import {run,type Mode,type Segment,type Result} from './interpreter';
export type Challenge={id:string;name:string;mode:Mode;description:string;hint:string;target:string;starter:string};
export const challenges:Challenge[]=[
 {id:'square',name:'Pierwszy kwadrat',mode:'2d',description:'Narysuj kwadrat o boku 100. Zacznij w środku układu, kierując się do góry. Zamknij wszystkie cztery boki.',hint:'Po każdym boku skręć w prawo o 90°. Przyda się powtorz.',target:'powtorz 4 [np 100 pw 90]',starter:'; Narysuj kwadrat o boku 100.\npowtorz 4 [\n  ; Twój ruch!\n]'},
 {id:'triangle',name:'Trzy równe boki',mode:'2d',description:'Narysuj trójkąt równoboczny o boku 120. Pierwszy bok biegnie od początku układu do góry, kolejne skręcają w prawo.',hint:'Kąt skrętu to kąt zewnętrzny: 360 / 3.',target:'powtorz 3 [np 120 pw 120]',starter:'; Trójkąt: trzy boki po 120.\n'},
 {id:'star',name:'Sięgnij gwiazd',mode:'2d',description:'Narysuj pięcioramienną gwiazdę z pięciu odcinków długości 150. Zacznij w początku układu, do góry i skręcaj w prawo.',hint:'W gwieździe żółw skręca o 144°, a nie o 72°.',target:'powtorz 5 [np 150 pw 144]',starter:'; Pięć odcinków. Jeden niezwykły kąt.\n'},
 {id:'dashes',name:'Przerwa na oddech',mode:'2d',description:'Narysuj trzy pionowe kreski długości 40, rozdzielone przerwami po 20. Zacznij w początku układu i idź do góry.',hint:'pod podnosi pisak, opu znów go opuszcza.',target:'powtorz 3 [np 40 pod np 20 opu]',starter:'; Trzy kreski i przerwy między nimi.\n'},
 {id:'stairs',name:'O jeden wymiar dalej',mode:'3d',description:'Narysuj cztery stopnie w przestrzeni. Każdy biegnie 40 w kierunku +Y, potem 25 w górę (+Z).',hint:'gora 90 podnosi nos żółwia, dol 90 przywraca kierunek.',target:'powtorz 4 [np 40 gora 90 np 25 dol 90]',starter:'; Cztery przestrzenne stopnie.\npowtorz 4 [\n  ; Poziomo, w górę i znów poziomo.\n]'}
];
function points(segments:Segment[]){return segments.flatMap(s=>{const length=Math.hypot(...s.to.map((v,i)=>v-s.from[i])),n=Math.max(1,Math.ceil(length/4));return Array.from({length:n+1},(_,j)=>s.from.map((v,i)=>v+(s.to[i]-v)*j/n));});}
function distance(p:number[],s:Segment){const v=s.to.map((x,i)=>x-s.from[i]),length=v.reduce((n,x)=>n+x*x,0),t=Math.min(1,Math.max(0,p.reduce((n,x,i)=>n+(x-s.from[i])*v[i],0)/length));return Math.hypot(...p.map((x,i)=>x-s.from[i]-t*v[i]));}
export function checkDrawing(challenge:Challenge,result:Result):{pass:boolean;reason:string}{
 if(result.error)return {pass:false,reason:`Najpierw popraw program: ${result.error.message}`};if(!result.segments.length)return {pass:false,reason:'Żółw nie zostawił śladu. Dodaj ruch z opuszczonym pisakiem.'};
 const expected=run(challenge.target,challenge.mode).segments,actual=result.segments;
 // Bidirectional sampled geometric coverage accepts split strokes, order and style differences.
 if(actual.length>1000)return {pass:false,reason:'Rysunek zawiera zbyt wiele odcinków. Spróbuj uprościć program.'};
 const length=(s:Segment[])=>s.reduce((n,x)=>n+Math.hypot(...x.to.map((v,i)=>v-x.from[i])),0),aLength=length(actual),eLength=length(expected);
 if(Math.abs(aLength-eLength)>eLength*.03)return {pass:false,reason:'Łączna długość linii jest inna niż we wzorze. Sprawdź długości boków, powtórzenia i podnoszenie pisaka.'};
 if(points(actual).some(p=>!expected.some(s=>distance(p,s)<1.5))||points(expected).some(p=>!actual.some(s=>distance(p,s)<1.5)))return {pass:false,reason:'Kształt nie pokrywa się ze wzorem. Sprawdź kąty, kierunek pierwszego ruchu i położenie przerw (tolerancja: 1,5 jednostki).'};
 return {pass:true,reason:'Wszystkie linie pasują do wzoru. Dobra robota — ten rysunek należy do ciebie!'};
}
