import { describe, test, expect } from 'bun:test';
import {run, compile, Machine, tokenize} from '../src/interpreter';
import {examples} from '../src/examples';
const good=(s:string,m:'2d'|'3d'='2d')=>{const r=run(s,m);expect(r.error).toBeNull();return r.segments;};
const bad=(s:string,line?:number,column?:number,m:'2d'|'3d'='2d')=>{const r=run(s,m);expect(r.error).not.toBeNull();if(line)expect(r.error!.line).toBe(line);if(column)expect(r.error!.column).toBe(column);return r;};
const near=(a:number[],b:number[])=>a.forEach((v,i)=>expect(v).toBeCloseTo(b[i],7));
describe('lexing and expressions',()=>{
 test('all standard programs run',()=>{for(const e of examples){const r=run(e.source,e.mode);expect(r.error, e.id).toBeNull();expect(r.segments.length).toBeGreaterThan(0);}});
 test('precedence, associativity, signs, decimals',()=>{expect(good('np 20 - 5 - 3')[0].to[1]).toBe(12);expect(good('np 2 + 3 * 4')[0].to[1]).toBe(14);expect(good('np -(3 - 5) np - -2 np .5')[2].to[1]).toBe(4.5);expect(good('niech bok 8 np -bok')[0].to[1]).toBe(-8);});
 test('binary whitespace rule',()=>{expect(good('np 10-5')[0].to[1]).toBe(5);for(const s of ['np 10 -5','np 10- 5','np 10 +5','np 10 *2','np 10/ 2'])expect(bad(s).segments).toHaveLength(0);});
 test('invalid number forms',()=>{for(const s of ['1e3','0x10','NaN','Infinity','2.3.4'])expect(bad('np '+s).segments).toHaveLength(0);});
 test('exact comparisons',()=>{expect(good('jeśli 0.1 + 0.2 = 0.3 [np 10]')).toHaveLength(0);expect(good('jeżeli 3<=3 [np 7] [np 8]')[0].to[1]).toBe(7);for(const c of ['<','>','=','<=','>=','<>'])expect(run(`jeżeli 1 ${c} 2 [np 3] [np 4]`).error).toBeNull();});
 test('comments and tokens',()=>{expect(good('; np 9\nNP 5 ; hi\nPw 90 NP 5')).toHaveLength(2);expect(tokenize('np(2+3)')[3].binary).toBe(true);});
});
describe('validation and positions',()=>{
 test('whole source validation leaves drawing empty',()=>{expect(bad('np 5\nnieznane',2,1).segments).toHaveLength(0);expect(bad('np 5\ngrubosc 1+12',2,9).segments).toHaveLength(0);expect(bad('np 5 powtorz 1.2 [np 8]').segments).toHaveLength(0);});
 test('missing and stray arguments',()=>{bad('powtorz 2 [np ]',1,15);bad('np',1,1);bad('np (2 + )',1,9);bad('np 5 7',1,6);bad('np (2',1,4);bad('np 1\n]',2,1);});
 test('runtime errors keep prior segments and argument location',()=>{const a=bad('np 5\nnp (2 / 0)',2,4);expect(a.segments).toHaveLength(1);expect(bad('np 5 niech x 0 np x / x',1,19).segments).toHaveLength(1);expect(bad('np 5 niech w 13 grubosc w').segments).toHaveLength(1);});
 test('unassigned vs undeclared',()=>{expect(bad('np 5 np x').segments).toHaveLength(0);const r=bad('np 5\nnp -x\nniech x 3',2,4);expect(r.segments).toHaveLength(1);expect(bad('jeśli 0=1 [niech x 2] np x').error!.message).toContain('wartości');});
 test('literal invalid widths/repeats even in skipped branches',()=>{for(const s of ['grubosc 0','grubosc 1.5','powtorz -1 []','powtorz 10001 []','jeśli 0=1 [grubosc 13]'])expect(bad('np 4 '+s).segments).toHaveLength(0);});
 test('malformed colors',()=>{for(const s of ['"red"','"#123"','"#gggggg"','123'])bad('kolor '+s,1,7);expect(good('color "#ABCDEF" fd 1')[0].color).toBe('#abcdef');});
 test('3D command in 2D validates even unreachable code',()=>{expect(bad('np 4 jeśli 0=1 [góra 20]').segments).toHaveLength(0);});
});
describe('scope and control flow',()=>{
 test('nested lexical repeat counts',()=>{expect(good('powtorz 2 [np nrpowt powtorz 2 [np repcount]]').map(s=>s.to[1])).toEqual([1,2,4,6,7,9]);bad('np nrpowt');bad('oto p\nnp nrpowt\njuż\npowtorz 2 [p]');});
 test('zero repeats, stop, clear, home, pen',()=>{expect(good('powtorz 0 [np 10] np 0')).toHaveLength(0);expect(good('np 5 stop np 20')).toHaveLength(1);const s=good('np 5 czysc pw 90 np 5 dom');expect(s).toHaveLength(2);near(s[0].from,[0,5,0]);near(s[1].to,[0,0,0]);expect(good('pod np 10 dom opu np 1')).toHaveLength(1);});
 test('procedure forward calls, legacy headers and argument expressions',()=>{const s=good('kwadrat 40 * 2 90\noto kwadrat :bok :kąt\npowtorz 4 [np :bok pw kąt]\nend');expect(s).toHaveLength(4);near(s[3].to,[0,0,0]);});
 test('locals, parameters and global reassignment',()=>{const s=good('niech x 10\np 2\nnp x\noto p ma: x\nniech x x + 1\nniech y 3\nnp x\njuż\np 4\nnp x');expect(s.map(s=>s.to[1])).toEqual([3,13,18,28]);bad('oto p\nniech x 3\njuż\nnp x');});
 test('parameter can share procedure name',()=>{expect(good('oto p ma: p\nniech p p + 1\nnp p\njuż\np 5')[0].to[1]).toBe(6);});
 test('recursive stop ends enclosing call',()=>{const s=good('oto p ma: n\njeśli n=0 [stop]\nnp n\npowtorz 2 [p n - 1 stop np 100]\nnp 100\njuż\np 3 np 9');expect(s.map(s=>s.to[1])).toEqual([3,5,6,15]);});
 test('definition errors',()=>{for(const s of ['oto p\nnp 1','oto p\njuż\noto p\njuż','powtorz 2 [oto p\njuż]','oto np\njuż','oto p ma: x, x\njuż','np 1 oto p\njuż','oto p\noto q\njuż\njuż','oto p\nnp 2 już'])bad(s);});
});
describe('geometry and limits',()=>{
 test('flat identical in both modes',()=>{for(const e of examples.filter(e=>e.mode==='2d'))expect(run(e.source,'2d')).toEqual(run(e.source,'3d'));});
 test('right-handed pitch and roll',()=>{near(good('gora 90 np 10','3d')[0].to,[0,0,10]);near(good('pp 90 gora 90 np 10','3d')[0].to,[10,0,0]);near(good('pl 90 gora 90 np 10','3d')[0].to,[-10,0,0]);near(good('pw 90 gora 90 np 10 dol 90 np 10','3d')[1].to,[10,0,10]);});
 test('home preserves style',()=>{const s=good('kolor "#123456" grubosc 7 np 10 dom np 1');expect(s[2].color).toBe('#123456');expect(s[2].width).toBe(7);near(s[2].to,[0,1,0]);});
 test('coordinate boundary',()=>{expect(good('np 100000')).toHaveLength(1);const r=bad('np 100000 np .1',1,14);expect(r.segments).toHaveLength(1);});
 test('source, tokens and bracket nesting limits',()=>{bad(';'+ 'a'.repeat(50000));bad('np 1 '.repeat(5001));good('powtorz 0 ['.repeat(32)+']'.repeat(32));bad('powtorz 0 ['.repeat(33)+']'.repeat(33));});
 test('active frames and executed operations',()=>{expect(bad('oto p\np\njuż\np').error!.message).toContain('32');const r=bad('powtorz 10000 [np 1]');expect(r.segments).toHaveLength(5000);expect(r.error!.message).toContain('operacji');});
 test('conditional completion counts and conditions do not add frames',()=>{const m=compile('jeśli 1=1 [np 1]');expect(m).toBeInstanceOf(Machine);(m as Machine).finish();expect((m as Machine).operations).toBe(3);expect(good('jeśli 1=1 ['.repeat(32)+'np 1'+']'.repeat(32))).toHaveLength(1);});
 test('step and run agree',()=>{for(const e of examples){const m=compile(e.source,e.mode) as Machine;while(m.step()){}expect({segments:m.segments,error:m.error}).toEqual(run(e.source,e.mode));}});
});

test('long expressions use the published token limit, not the JavaScript call stack',()=>{
 expect(good('np '+'('.repeat(4000)+'1'+')'.repeat(4000))[0].to[1]).toBe(1);
 expect(good('np '+'-'.repeat(4000)+'2')[0].to[1]).toBe(2);
 expect(good('np '+Array(4000).fill('1').join('+'))[0].to[1]).toBe(4000);
});
test('command aliases are equivalent, including accented and uppercase words',()=>{
 const forms=[['NP','naprzod','naprzód','fd','forward'],['ws','wstecz','bk','back'],['pw','prawo','rt','right'],['lw','lewo','lt','left'],['pod','podnies','podnieś','pu','penup'],['opu','opusc','opuść','pd','pendown'],['grubosc','grubość','width'],['kolor','color'],['gora','góra','pitchup'],['dol','dół','pitchdown'],['pp','przechylprawo','rr','rollright'],['pl','przechyllewo','rl','rollleft']];
 for(const words of forms){const arg=words[0]==='kolor'?' "#123456"':words[0]==='grubosc'?' 4':['pod','opu'].includes(words[0])?'':' 40';const expected=run(words[0]+arg+' np 12','3d');for(const word of words)expect(run(word+arg+' np 12','3d')).toEqual(expected);}
});
test('legal names do not collide with JavaScript object properties',()=>{
 expect(good('oto constructor\nnp 5\njuż\nconstructor')[0].to[1]).toBe(5);
 expect(good('niech __proto__ 7 np __proto__')[0].to[1]).toBe(7);
});
test('a stopped procedure still counts its completed call',()=>{
 const m=compile('oto p\nstop\njuż\np') as Machine;m.finish();expect(m.operations).toBe(3);
});
