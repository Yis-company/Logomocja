const aliases = {};
for (const [key, words] of Object.entries({forward:'np naprzod naprzód fd forward',back:'ws wstecz bk back',right:'pw prawo rt right',left:'lw lewo lt left',up:'pod podnies podnieś pu penup',down:'opu opusc opuść pd pendown',color:'kolor color',width:'grubosc grubość width',repeat:'powtorz powtórz repeat',pitchup:'gora góra pitchup',pitchdown:'dol dół pitchdown'})) for (const word of words.split(' ')) aliases[word]=key;
const numberPattern=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
const lower=s=>s.toLocaleLowerCase('pl');
function problem(token,message){ throw {message,line:token?.line||1,column:token?.column||1}; }
function lex(source){
 if(source.length>50000) problem({line:1,column:1},'Program przekracza limit 50 000 znaków.');
 const tokens=[]; let i=0,line=1,column=1;
 while(i<source.length){let c=source[i]; if(c==='\n'){i++;line++;column=1;continue} if(/\s/.test(c)){i++;column++;continue} if(c===';'){while(i<source.length&&source[i]!=='\n'){i++;column++}continue} let start=i, col=column;
 if('[],'.includes(c)){i++;column++} else if(c==='"'){i++;column++;while(i<source.length&&source[i]!=='"'&&source[i]!=='\n'){i++;column++} if(source[i]==='"'){i++;column++}} else {while(i<source.length&&!/[\s\[\],;]/.test(source[i])){i++;column++}}
 tokens.push({text:source.slice(start,i),line,column:col}); if(tokens.length>10000) problem(tokens.at(-1),'Program przekracza limit 10 000 tokenów.');
 } return tokens;
}
function parse(source,mode){
 const ts=lex(source), defs=new Map(), main=[]; let i=0;
 const eof=()=>ts[i]||{line:source.split('\n').length,column:(source.split('\n').at(-1)||'').length+1};
 // Extract definitions first so calls can precede them.
 const remaining=[]; let bracketDepth=0;
 while(i<ts.length){const t=ts[i], w=lower(t.text);
 if(w==='oto'||w==='to'){
 if(bracketDepth>0) problem(t,'Definicja procedury jest w niedozwolonym miejscu.');
 if(i>0&&ts[i-1].line===t.line) problem(t,'Definicja musi zaczynać się na początku wiersza.');
 const header=[]; i++; while(i<ts.length&&ts[i].line===t.line) header.push(ts[i++]);
 const name=header.shift(); if(!name||!/^[:\p{L}_][\p{L}\p{N}_]*$/u.test(name.text)||name.text.startsWith(':')) problem(name||t,'Brakuje poprawnej nazwy procedury.');
 const key=lower(name.text); if(defs.has(key)||aliases[key]||['oto','to','już','juz','end'].includes(key)) problem(name,'Ta nazwa procedury jest już zajęta.');
 let params=[]; if(header.length){if(lower(header[0].text)==='ma:'){header.shift(); let expect=true; for(const h of header){if(expect){if(!/^[:]?\p{L}[\p{L}\p{N}_]*$/u.test(h.text)) problem(h,'Oczekiwano nazwy parametru.');params.push(lower(h.text.replace(/^:/,'')));expect=false}else{if(h.text!==',') problem(h,'Oczekiwano przecinka między parametrami.');expect=true}} if(expect) problem(header.at(-1)||name,'Brakuje parametru.');}else{for(const h of header){if(!/^:\p{L}[\p{L}\p{N}_]*$/u.test(h.text)) problem(h,'Oczekiwano parametru z dwukropkiem.');params.push(lower(h.text.slice(1)))}}}
 if(new Set(params).size!==params.length) problem(name,'Nazwa parametru powtarza się.');
 const body=[]; let ended=false; while(i<ts.length){const q=ts[i]; if(['już','juz','end'].includes(lower(q.text))){if((i>0&&ts[i-1].line===q.line)||(ts[i+1]&&ts[i+1].line===q.line)) problem(q,'Koniec procedury musi być sam w wierszu.');i++;ended=true;break} if(['oto','to'].includes(lower(q.text))) problem(q,'Nie można zagnieżdżać definicji.');body.push(q);i++} if(!ended) problem(name,'Brakuje zakończenia „już”.'); defs.set(key,{name,params,tokens:body,body:null});
 } else {if(t.text==='[') bracketDepth++; else if(t.text===']') bracketDepth--; remaining.push(t);i++}}
 function parseBody(tokens,params){let p=0; const end=()=>tokens[p]||tokens.at(-1)||eof();
 function arg(kind){const t=tokens[p];if(!t||t.text===']'||t.text==='['||t.text===',') problem(t||end(),'Brakuje argumentu liczbowego.');p++; if(kind==='color'){if(!/^"#[0-9a-f]{6}"$/i.test(t.text)) problem(t,'Kolor musi mieć postać "#16866a".');return {literal:lower(t.text.slice(1,-1)),token:t}}
 if(numberPattern.test(t.text)&&Number.isFinite(Number(t.text))) return {literal:Number(t.text),token:t};const k=lower(t.text.replace(/^:/,'')); if(params.includes(k)) return {param:k,token:t};problem(t,'Oczekiwano liczby lub parametru procedury.');}
 function seq(depth,bracket){if(depth>32) problem(tokens[p-1]||end(),'Przekroczono limit zagnieżdżenia nawiasów.');const out=[];while(p<tokens.length){let t=tokens[p++],w=lower(t.text);if(t.text===']'){if(!bracket)problem(t,'Nieoczekiwany nawias zamykający.');return out} if(t.text==='[') problem(t,'Nieoczekiwany nawias otwierający.'); if(['oto','to','już','juz','end'].includes(w)) problem(t,'Definicja procedury jest w niedozwolonym miejscu.');const op=aliases[w];if(op){if((op==='pitchup'||op==='pitchdown')&&mode==='2d')problem(t,'Polecenie pochylenia jest dostępne tylko w 3D.');let node={op,token:t};if(['forward','back','right','left','width','repeat','pitchup','pitchdown'].includes(op))node.arg=arg('number');if(op==='color')node.arg=arg('color');if(op==='repeat'){const b=tokens[p++];if(!b||b.text!=='[')problem(b||end(),'Po liczbie powtórzeń oczekiwano „[”.');node.body=seq(depth+1,true)} if(node.arg&&node.arg.literal!==undefined){const n=node.arg.literal;if(op==='width'&&(!Number.isInteger(n)||n<1||n>12))problem(node.arg.token,'Grubość musi być liczbą całkowitą od 1 do 12.');if(op==='repeat'&&(!Number.isInteger(n)||n<0||n>10000))problem(node.arg.token,'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.')}out.push(node)}else if(defs.has(w)){const def=defs.get(w),args=def.params.map(()=>arg('number'));out.push({op:'call',name:w,args,token:t})}else problem(t,`Nieznane polecenie „${t.text}”.`)}if(bracket)problem(end(),'Brakuje nawiasu zamykającego „]”.');return out}return seq(0,false)}
 for(const def of defs.values()) def.body=parseBody(def.tokens,def.params); const root=parseBody(remaining,[]);
 const visiting=new Set(),done=new Set();function visit(name){if(visiting.has(name))problem(defs.get(name).name,'Procedury nie mogą wywoływać się rekurencyjnie.');if(done.has(name))return;visiting.add(name);function walk(nodes){for(const n of nodes){if(n.op==='call')visit(n.name);if(n.body)walk(n.body)}}walk(defs.get(name).body);visiting.delete(name);done.add(name)}for(const name of defs.keys())visit(name);
 return {root,defs};
}
const add=(a,b)=>a.map((x,i)=>x+b[i]); const mul=(a,n)=>a.map(x=>x*n); const rot=(a,b,angle)=>{const c=Math.cos(angle*Math.PI/180),s=Math.sin(angle*Math.PI/180);return [add(mul(a,c),mul(b,s)),add(mul(b,c),mul(a,-s))]};
export function prepare(source,mode){try{if(mode!=='2d'&&mode!=='3d')problem(null,'Nieznany tryb.');return {program:parse(source,mode),error:null}}catch(error){return {program:null,error}}}
export function* execute(program){let pos=[0,0,0],heading=[0,1,0],right=[1,0,0],up=[0,0,1],pen=true,color='#16866a',width=3,ops=0,count=0;const value=(a,env)=>a.param!==undefined?env[a.param]:a.literal;
 function* walk(nodes,env,depth){for(const n of nodes){if(++ops>10000)problem(n.token,'Przekroczono limit 10 000 operacji.');let a=n.arg?value(n.arg,env):null,segment=null;if(n.op==='width'&&(!Number.isInteger(a)||a<1||a>12))problem(n.arg.token,'Grubość musi być liczbą całkowitą od 1 do 12.');if(n.op==='repeat'&&(!Number.isInteger(a)||a<0||a>10000))problem(n.arg.token,'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.');
 switch(n.op){case 'forward':case 'back':{let next=add(pos,mul(heading,a*(n.op==='back'?-1:1)));if(next.some(x=>!Number.isFinite(x)||Math.abs(x)>100000))problem(n.token,'Przekroczono dopuszczalny zakres współrzędnych.');if(pen&&a!==0){if(++count>10000)problem(n.token,'Przekroczono limit 10 000 odcinków.');segment={from:pos.slice(),to:next.slice(),color,width}}pos=next;break}case 'right':[heading,right]=rot(heading,right,a);break;case 'left':[heading,right]=rot(heading,right,-a);break;case 'pitchup':[heading,up]=rot(heading,up,a);break;case 'pitchdown':[heading,up]=rot(heading,up,-a);break;case 'up':pen=false;break;case 'down':pen=true;break;case 'color':color=a;break;case 'width':width=a;break;}
 yield {segment,pos:pos.slice(),heading:heading.slice(),token:n.token};
 if(n.op==='repeat'||n.op==='call'){if(depth>=32)problem(n.token,'Przekroczono limit zagnieżdżenia wykonania.');if(n.op==='repeat'){for(let j=0;j<a;j++){if(++ops>10000)problem(n.token,'Przekroczono limit 10 000 operacji.');yield* walk(n.body,env,depth+1)}}else{const def=program.defs.get(n.name),local={};def.params.forEach((p,i)=>local[p]=value(n.args[i],env));yield* walk(def.body,local,depth+1)}}}}
 yield* walk(program.root,{},0);
}
export function run(source,mode){const parsed=prepare(source,mode);if(parsed.error)return {segments:[],error:parsed.error};const segments=[];try{for(const step of execute(parsed.program))if(step.segment)segments.push(step.segment);return {segments,error:null}}catch(error){return {segments,error}}}
