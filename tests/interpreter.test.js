import {describe,test,expect} from 'bun:test';
import {run,Execution,ALIASES} from '../src/interpreter.js';
import {examples} from '../src/examples.js';
import {challenges,checkDrawing} from '../src/challenges.js';
const end=s=>run(s).segments.at(-1)?.to;
describe('wyrażenia i składnia',()=>{
 test('kolejność działań i znaki',()=>{expect(end('np 20 - 5 - 3')[1]).toBe(12);expect(end('np 2 + 3 * 4')[1]).toBe(14);expect(end('np -(3 - 5)')[1]).toBe(2);expect(end('np - -2')[1]).toBe(2);expect(end('niech bok 3 np -bok')[1]).toBe(-3);expect(end('np .5')[1]).toBe(.5)});
 test('odstępy przy operatorach',()=>{for(const op of ['+','-','*','/']){expect(run(`np 10 ${op}5`).error).not.toBeNull();expect(run(`np 10${op} 5`).error).not.toBeNull();expect(run(`np 10 ${op} 5`).error).toBeNull();expect(run(`np 10${op}5`).error).toBeNull()}});
 test('nieprawidłowe liczby i kolory',()=>{for(const bad of ['1e3','0x10','NaN','Infinity','1.2.3'])expect(run('np '+bad).error).not.toBeNull();expect(run('kolor "#AABBCC" np 2').segments[0].color).toBe('#aabbcc');expect(run('kolor "red"').error.column).toBe(7)});
 test('cały program walidowany przed wykonaniem',()=>{expect(run('np 50\nnieznane').segments).toEqual([]);expect(run('np 50 grubosc 1 + 12').segments).toEqual([]);expect(run('np 50 powtorz -1 []').segments).toEqual([])});
 test('pozycje błędów argumentów',()=>{expect(run('np').error.column).toBe(1);expect(run('powtorz 1 [np ]').error.column).toBe(15);expect(run('np 10 -5').error.column).toBe(7);expect(run('np (3 + 1 / 0)').error.column).toBe(4);expect(run('niech x 0\nnp 5 np 2 / x').error).toMatchObject({line:2,column:9})});
 test('zagnieżdżenia i nieznane nazwy',()=>{expect(run('powtorz 2 [np 2').error).not.toBeNull();expect(run('np (2 + 3').error).not.toBeNull();expect(run('np bok').error.column).toBe(4);expect(run('np nrpowt').error.column).toBe(4)});
});
describe('zmienne, bloki i procedury',()=>{
 test('deklaracja późniejsza, lokalność i cieniowanie',()=>{expect(run('np 10 np x niech x 5').segments).toHaveLength(1);expect(run('np x niech x 5').error.column).toBe(4);expect(end('niech x 5\nf\nnp x\noto f\nniech x 20\nnp x\njuż')).toEqual([0,25,0]);expect(run('jeśli 1 = 2 [niech x 5] np x').error).not.toBeNull()});
 test('warunki są dokładne',()=>{expect(run('jeśli 0.1 + 0.2 = 0.3 [np 5]').segments).toHaveLength(0);expect(end('jeżeli 3<>4 [np 8] [np 9]')[1]).toBe(8)});
 test('definicje, legacy, wielkość liter i wyrażenia argumentów',()=>{expect(end('TEST 40 * 2 90\noto test ma: bok, kąt\nnp BOK pw :kąt\njuż')[1]).toBe(80);expect(end('oto krok :x\nnp :x\nend\nKROK 8')[1]).toBe(8);expect(run('oto np\njuż').error).not.toBeNull();expect(run('oto f\nnp 5').error).not.toBeNull()});
 test('parametr o nazwie procedury',()=>{expect(end('oto f ma: f\nnp f\njuż\nf 12')[1]).toBe(12)});
 test('nrpowt jest leksykalne i najbliższe',()=>{expect(run('oto f\nnp nrpowt\njuż\npowtorz 2 [f]').error).not.toBeNull();expect(end('powtorz 2 [powtorz 3 [np nrpowt] np nrpowt]')[1]).toBe(15)});
 test('stop kończy wywołanie z wnętrza bloku',()=>{expect(end('oto f\npowtorz 5 [np 4 jeśli 1=1 [stop] np 50]\nnp 60\njuż\nf np 2')[1]).toBe(6);expect(end('powtorz 2 [np 8 stop] np 80')[1]).toBe(8)});
 test('zła liczba argumentów',()=>{expect(run('oto f ma: a, b\nnp a\njuż\nf 1').error).not.toBeNull();expect(run('oto f ma: a\nnp a\njuż\nf 1 2').error).not.toBeNull()});
 test('brak zagnieżdżonych definicji',()=>expect(run('powtorz 2 [\noto f\nnp 8\njuż\n]').error).not.toBeNull());
});
describe('geometria i stan',()=>{
 test('kwadrat i identyczne płaskie tryby',()=>{const code='powtorz 4 [np 80 pw 90]';expect(run(code,'2d')).toEqual(run(code,'3d'));expect(Math.hypot(...end(code))).toBeLessThan(1e-10)});
 test('osie 3D i przechył',()=>{const e=new Execution('pp 90 gora 90 np 10','3d');e.finish();expect(e.turtle.position[0]).toBeCloseTo(10);expect(e.turtle.right[2]).toBeCloseTo(-1);expect(run('np 10 gora 20','2d').segments).toEqual([]);expect(run('gora 90 np 10','3d').segments[0].to[2]).toBeCloseTo(10)});
 test('dom zachowuje pisak, czyszczenie zachowuje stan',()=>{const e=new Execution('kolor "#ffffff" grubosc 5 np 10 czyść pw 90 np 20 dom');e.finish();expect(e.segments).toHaveLength(2);expect(e.turtle.heading).toEqual([0,1,0]);expect(e.turtle.color).toBe('#ffffff');expect(e.turtle.width).toBe(5);expect(run('np 0 pod np 10 dom').segments).toHaveLength(0)});
 test('błąd wykonania zachowuje odcinki',()=>{expect(run('np 10 np 1 / 0').segments).toHaveLength(1);expect(run('np 10 czyść np 5 np 1 / 0').segments).toHaveLength(1);expect(run('np 10 niech x 13 grubosc x').segments).toHaveLength(1)});
 test('krok i pełne wykonanie są zgodne',()=>{const source=examples[4].source,e=new Execution(source);while(!e.done)e.step();expect(e.result()).toEqual(run(source))});
 test('każdy alias polecenia',()=>{const args={forward:'1',back:'1',right:'10',left:'10',width:'3',color:'"#ABC123"',repeat:'1 [np 1]',let:'x 5',if:'1=1 [np 1]',ifelse:'1=1 [np 1] [np 2]',pitchup:'10',pitchdown:'10',rollright:'10',rollleft:'10'};for(const [key,aliases] of Object.entries(ALIASES)){if(['to','end','repcount'].includes(key))continue;for(const alias of aliases.split(' '))expect(run(alias+' '+(args[key]||''),'3d').error).toBeNull()}});
});
describe('limity i przykłady',()=>{
 test('limity znaków, tokenów, ramek, operacji, współrzędnych',()=>{expect(run(' '.repeat(50001)).error).not.toBeNull();expect(run('np 1 '.repeat(5001)).error).not.toBeNull();expect(run('oto f\nf\njuż\nf').error.message).toContain('32');expect(run('powtorz 10000 []').error.message).toContain('operacji');expect(run('np 100001').error.message).toContain('100 000');expect(run('powtorz 1 ['.repeat(33)+']'.repeat(33)).error.message).toContain('32')});
 test('każdy przykład działa',()=>{for(const example of examples){const r=run(example.source,example.mode);expect(r.error,example.name).toBeNull();expect(r.segments.length).toBeGreaterThan(0)}});
 test('zadania akceptują rozwiązania i odrzucają błędy',()=>{for(const c of challenges){expect(checkDrawing(c.solution,c.mode,c).pass,c.name).toBe(true);expect(checkDrawing('np 1',c.mode,c).pass).toBe(false)}expect(checkDrawing('powtorz 4 [np 40 np 40 pw 90]','2d',challenges[0]).pass).toBe(true)});
});

describe('granice semantyki',()=>{
 test('głębokie wyrażenia mieszczące się w limitach nie zależą od stosu JS',()=>{expect(end('np '+'('.repeat(3000)+'1'+')'.repeat(3000))[1]).toBe(1);expect(end('np '+'1+'.repeat(4000)+'1')[1]).toBe(4001);expect(end('np '+'-'.repeat(4000)+'1')[1]).toBe(1)});
 test('dokładne liczenie końców bloków',()=>{const e=new Execution('powtorz 2 [jeśli 1=1 [np 1]]');e.finish();expect(e.operations).toBe(9);const f=new Execution('oto f\nnp 1\njuż\nf');f.finish();expect(f.operations).toBe(3);const empty=new Execution('powtorz 9999 []');expect(empty.finish().error).toBeNull();expect(empty.operations).toBe(10000)});
 test('przypisanie parametru o nazwie procedury',()=>expect(end('oto f ma: f\nniech f f + 1\nnp f\njuż\nf 2')[1]).toBe(3));
 test('dynamiczna grubość i liczba powtórzeń wskazują początek wyrażenia',()=>{expect(run('niech x 13\nnp 4 grubosc (x)').error).toMatchObject({line:2,column:14});expect(run('niech x -1\nnp 4 powtorz x []').error).toMatchObject({line:2,column:14})});
 test('lokalne nazwy nie są widoczne w innych wywołaniach',()=>{expect(run('oto a\nniech x 1\nb\njuż\noto b\nnp x\njuż\na').error.message).toContain('Nieznana zmienna');expect(end('niech x 5\noto a\nniech x 10\nb\njuż\noto b\nnp x\njuż\na')[1]).toBe(5)});
 test('trzy obroty po 90 stopni tworzą właściwą bazę',()=>{const e=new Execution('gora 90 pp 90 pw 90 np 5','3d');e.finish();expect(e.turtle.position[1]).toBeCloseTo(5);expect(e.turtle.up[0]).toBeCloseTo(1);expect(e.turtle.right[2]).toBeCloseTo(-1)});
 test('niezależność uruchomień',()=>{run('kolor "#ffffff" grubosc 12 pod np 5');expect(run('np 1').segments[0]).toEqual({from:[0,0,0],to:[0,1,0],color:'#16866a',width:3})});
});
test('definicja nie może pojawić się wewnątrz wyrażenia',()=>expect(run('np (\noto f\nnp 5\njuż\n5)').error).not.toBeNull());
