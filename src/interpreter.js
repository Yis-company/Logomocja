const aliases = {};
for (const [key, words] of Object.entries({fd:'np naprzod naprzód fd forward',bk:'ws wstecz bk back',rt:'pw prawo rt right',lt:'lw lewo lt left',pu:'pod podnies podnieś pu penup',pd:'opu opusc opuść pd pendown',color:'kolor color',width:'grubosc grubość width',repeat:'powtorz powtórz repeat',let:'niech let',if:'jeśli jesli if',ifelse:'jeżeli jezeli ifelse',stop:'stop',home:'dom home',clear:'czyść czysc cs clearscreen',pitchup:'gora góra pitchup',pitchdown:'dol dół pitchdown',rollright:'pp przechylprawo rr rollright',rollleft:'pl przechyllewo rl rollleft'})) for(const w of words.split(' ')) aliases[w]=key;
const reserved = new Set([...Object.keys(aliases),'oto','to','już','juz','end','ma','nrpowt','repcount']);
const norm=s=>s.toLocaleLowerCase('pl');
class LogoError extends Error { constructor(message,t){super(message);this.line=t?.line||1;this.column=t?.col||1;} }
const fail=(m,t)=>{throw new LogoError(m,t)};
function lex(s){
 if(s.length>50000) fail('Program przekracza limit 50 000 znaków.',{line:1,col:1});
 let ts=[],i=0,line=1,col=1;
 while(i<s.length){let c=s[i]; if(c==='\n'){i++;line++;col=1;continue} if(/\s/.test(c)){i++;col++;continue} if(c===';'){while(i<s.length&&s[i]!=='\n'){i++;col++}continue}
 let start=i, l=line, x=col, value;
 if(c==='"'){i++;col++;while(i<s.length&&s[i]!=='"'&&s[i]!=='\n'){i++;col++} if(s[i]==='"'){i++;col++} value=s.slice(start,i)}
 else if(/[\p{L}_:]/u.test(c)){i++;col++;while(i<s.length&&/[\p{L}\p{N}_:]/u.test(s[i])){i++;col++}value=s.slice(start,i)}
 else if(/[0-9.]/.test(c)){i++;col++;while(i<s.length&&/[\p{L}\p{N}_.]/u.test(s[i])){i++;col++}value=s.slice(start,i)}
 else {i++;col++;if((c==='<'||c==='>')&&['=','>'].includes(s[i])){i++;col++}value=s.slice(start,i)}
 ts.push({v:value,low:norm(value),line:l,col:x,start,end:i});if(ts.length>10000)fail('Program przekracza limit 10 000 tokenów.',ts.at(-1));
 } return ts;
}
const nameOk=s=>/^:?\p{L}[\p{L}\p{N}_]*$/u.test(s);
const name=s=>norm(s.replace(/^:/,''));
export function parse(source,mode='2d'){
 const t=lex(source), defs=new Map(), top=[], headers=new Set();
 // Extract definitions before parsing so calls can precede declarations.
 let outerDepth=0; for(let i=0;i<t.length;){let a=t[i];if(['oto','to'].includes(a.low)){
 if(outerDepth)fail('Definicje są dozwolone tylko na najwyższym poziomie.',a);
 if(i>0&&t[i-1].line===a.line) fail('Definicja musi zaczynać się na początku wiersza.',a);
 let line=a.line, h=[];i++;while(i<t.length&&t[i].line===line)h.push(t[i++]);
 let n=h.shift();if(!n||!nameOk(n.v)||n.v.startsWith(':')||reserved.has(n.low))fail('Nieprawidłowa nazwa procedury.',n||a);
 let nm=name(n.v);if(defs.has(nm))fail('Procedura jest już zdefiniowana.',n);
 let params=[]; if(h.length){if(h[0].low==='ma:'){h.shift();let expect=true;for(const p of h){if(expect){if(!nameOk(p.v)||p.v.startsWith(':')||reserved.has(name(p.v)))fail('Nieprawidłowy parametr.',p);params.push(name(p.v));}else if(p.v!==',')fail('Oczekiwano przecinka.',p);expect=!expect}if(expect)fail('Brakuje parametru.',h.at(-1)||n)} else {for(const p of h){if(!p.v.startsWith(':')||!nameOk(p.v)||reserved.has(name(p.v)))fail('Nieprawidłowy parametr.',p);params.push(name(p.v))}}}
 if(new Set(params).size!==params.length)fail('Powtórzony parametr.',n);
 let body=[];while(i<t.length&&!['już','juz','end'].includes(t[i].low)){if(['oto','to'].includes(t[i].low))fail('Definicje nie mogą być zagnieżdżone.',t[i]);body.push(t[i++])}if(i===t.length)fail('Brakuje zakończenia już.',a);let end=t[i++];if((i<t.length&&t[i].line===end.line)||(body.length&&body.at(-1).line===end.line))fail('Słowo już musi być samo w wierszu.',end);
 defs.set(nm,{name:nm,params,raw:body,token:n});headers.add(nm);
 }else {if(a.v==='[')outerDepth++;if(a.v===']')outerDepth--;top.push(a);i++}}
 const globals=new Set(), locals=new Map();
 function collect(arr,set){for(let i=0;i<arr.length;i++)if(aliases[arr[i].low]==='let'&&arr[i+1]){let n=arr[i+1];if(!nameOk(n.v)||reserved.has(name(n.v))||headers.has(name(n.v)))fail('Nieprawidłowa nazwa zmiennej.',n);set.add(name(n.v))}}
 collect(top,globals);for(const d of defs.values()){let s=new Set(d.params);collect(d.raw,s);locals.set(d.name,s);d.locals=s}
 function parseBlock(tokens,local){let p=0,depth=0;
 const peek=()=>tokens[p]; const take=()=>tokens[p++];
 function expr(repeat,anchor,min=0){let tok=peek();if(!tok)fail('Brakuje argumentu.',anchor);let left;
 if(tok.v==='+'||tok.v==='-'){take();left={type:'unary',op:tok.v,right:expr(repeat,anchor,3),tok};}
 else if(tok.v==='('){take();left=expr(repeat,anchor);if(peek()?.v!==')')fail('Brakuje zamykającego nawiasu.',peek()||tok);take()}
 else if(/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(tok.v)){take();left={type:'num',value:Number(tok.v),tok}}
 else if(nameOk(tok.v)){take();let n=name(tok.v);if(n==='nrpowt'||n==='repcount'){if(!repeat)fail('nrpowt można użyć tylko wewnątrz powtórzenia.',tok);left={type:'rep',tok}}else {if(!local.has(n)&&!globals.has(n))fail('Nieznana zmienna: '+n+'.',tok);left={type:'var',name:n,tok}}}
 else fail('Oczekiwano wyrażenia.',tok);
 while(peek()&&['+','-','*','/'].includes(peek().v)){let op=peek(),prec=(op.v==='*'||op.v==='/')?2:1;if(prec<min)break;let before=op.start>tokens[p-1].end, after=tokens[p+1]&&tokens[p+1].start>op.end;if(before!==!!after)break;take();left={type:'binary',op:op.v,left,right:expr(repeat,anchor,prec+1),tok: left.tok}}
 return left}
 function block(repeat=0,bracket=false){let out=[];while(p<tokens.length){let a=take();if(a.v===']'){if(!bracket)fail('Nieoczekiwany nawias ].',a);depth--;return out}if(a.v==='[')fail('Nieoczekiwany nawias [.',a);let cmd=aliases[a.low], proc=defs.get(a.low);if(!cmd&&!proc)fail('Nieznane polecenie: '+a.v+'.',a);let node={cmd:cmd||'call',tok:a};
 const arg=()=>{let first=peek();let e=expr(repeat,a);e.argToken=first||a;return e};
 const body=()=>{let b=take();if(!b||b.v!=='[')fail('Oczekiwano nawiasu [.',b||a);if(++depth>32)fail('Przekroczono limit zagnieżdżenia nawiasów.',b);return block(repeat+(cmd==='repeat'?1:0),true)};
 if(['fd','bk','rt','lt','width','repeat','pitchup','pitchdown','rollright','rollleft'].includes(cmd)){node.expr=arg();if(mode==='2d'&&['pitchup','pitchdown','rollright','rollleft'].includes(cmd))fail('To polecenie działa tylko w trybie 3D.',a);if(cmd==='repeat')node.body=body();}
 else if(cmd==='color'){let v=take();if(!v||!/^"#[0-9a-f]{6}"$/i.test(v.v))fail('Oczekiwano koloru w formacie "#rrggbb".',v||a);node.color=v.v.slice(1,-1).toLowerCase()}
 else if(cmd==='let'){let v=take();if(!v||!nameOk(v.v)||reserved.has(name(v.v))||headers.has(name(v.v)))fail('Nieprawidłowa nazwa zmiennej.',v||a);node.name=name(v.v);node.expr=arg()}
 else if(cmd==='if'||cmd==='ifelse'){node.left=arg();let cmp=take();if(!cmp||!['<','>','=','<=','>=','<>'].includes(cmp.v))fail('Oczekiwano operatora porównania.',cmp||a);node.cmp=cmp.v;node.right=arg();node.body=body();if(cmd==='ifelse')node.other=body()}
 else if(proc){node.name=proc.name;node.args=proc.params.map(()=>arg())}
 if(['width','repeat'].includes(cmd)&&!hasName(node.expr)){try{let v=evaluate(node.expr,{},[],node.expr.argToken);if(cmd==='width'&&(!Number.isInteger(v)||v<1||v>12))fail('Grubość musi być liczbą całkowitą od 1 do 12.',node.expr.argToken);if(cmd==='repeat'&&(!Number.isInteger(v)||v<0||v>10000))fail('Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.',node.expr.argToken)}catch(e){if(!e.message.includes('zero')&&!e.message.includes('skończon'))throw e}}
 out.push(node)}if(bracket)fail('Brakuje nawiasu ].',tokens.at(-1));return out}
 return block()}
 const program=parseBlock(top,new Set());for(const d of defs.values())d.body=parseBlock(d.raw,locals.get(d.name));return {program,defs};
}
function hasName(e){return e.type==='var'||e.type==='rep'||(e.left&&hasName(e.left))||(e.right&&hasName(e.right))}
function evaluate(e,scope,reps,at){let v;if(e.type==='num')v=e.value;else if(e.type==='rep')v=reps.at(-1);else if(e.type==='var'){if(!(e.name in scope)||scope[e.name]===undefined)fail('Zmienna '+e.name+' nie ma jeszcze wartości.',at);v=scope[e.name]}else if(e.type==='unary'){v=evaluate(e.right,scope,reps,at)*(e.op==='-'?-1:1)}else {let a=evaluate(e.left,scope,reps,at),b=evaluate(e.right,scope,reps,at);if(e.op==='/'&&b===0)fail('Nie można dzielić przez zero.',at);v=e.op==='+'?a+b:e.op==='-'?a-b:e.op==='*'?a*b:a/b}if(!Number.isFinite(v))fail('Wynik nie jest liczbą skończoną.',at);return v}
const add=(a,b)=>a.map((x,i)=>x+b[i]), mul=(a,k)=>a.map(x=>x*k);
export function createExecution(source,mode='2d'){
 let parsed;try{parsed=parse(source,mode)}catch(e){return {segments:[],error:format(e),done:true}}
 let state={segments:[],position:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],pen:true,color:'#16866a',width:3,error:null,done:false,line:0,ops:0},globals=Object.create(null),reps=[],frames=0;
 function tick(t){if(++state.ops>10000)fail('Przekroczono limit 10 000 operacji.',t)}
 function move(distance,t){let next=add(state.position,mul(state.heading,distance));if(next.some(x=>!Number.isFinite(x)||Math.abs(x)>100000))fail('Przekroczono limit współrzędnych.',t);if(state.pen&&next.some((x,i)=>Math.abs(x-state.position[i])>1e-12)){if(state.segments.length>=10000)fail('Przekroczono limit odcinków.',t);state.segments.push({from:[...state.position],to:[...next],color:state.color,width:state.width})}state.position=next}
 function rotate(a,b,angle){let c=Math.cos(angle*Math.PI/180),s=Math.sin(angle*Math.PI/180),x=state[a],y=state[b];state[a]=add(mul(x,c),mul(y,s));state[b]=add(mul(y,c),mul(x,-s))}
 function* block(nodes,scope){for(const n of nodes){tick(n.tok);state.line=n.tok.line;yield state;let v=n.expr?evaluate(n.expr,scope,reps,n.expr.argToken):0;switch(n.cmd){
 case 'fd':move(v,n.expr.argToken);break;case 'bk':move(-v,n.expr.argToken);break;case 'rt':rotate('heading','right',v);break;case 'lt':rotate('heading','right',-v);break;case 'pitchup':rotate('heading','up',v);break;case 'pitchdown':rotate('heading','up',-v);break;case 'rollright':rotate('up','right',v);break;case 'rollleft':rotate('up','right',-v);break;
 case 'pu':state.pen=false;break;case 'pd':state.pen=true;break;case 'color':state.color=n.color;break;case 'width':if(!Number.isInteger(v)||v<1||v>12)fail('Grubość musi być liczbą całkowitą od 1 do 12.',n.expr.argToken);state.width=v;break;case 'let':scope[n.name]=v;break;case 'home':{let pos=state.position;let d=pos.map(x=>-x);if(state.pen&&d.some(x=>Math.abs(x)>1e-12)){if(state.segments.length>=10000)fail('Przekroczono limit odcinków.',n.tok);state.segments.push({from:[...pos],to:[0,0,0],color:state.color,width:state.width})}state.position=[0,0,0];state.heading=[0,1,0];state.right=[1,0,0];state.up=[0,0,1];break}case 'clear':state.segments.length=0;break;
 case 'repeat':if(!Number.isInteger(v)||v<0||v>10000)fail('Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.',n.expr.argToken);if(v){if(++frames>32)fail('Przekroczono limit ramek wykonania.',n.tok);for(let i=1;i<=v;i++){reps.push(i);let stopped=yield* block(n.body,scope);reps.pop();if(stopped){frames--;return true}tick(n.tok)}frames--}break;
 case 'if':case 'ifelse':{let a=evaluate(n.left,scope,reps,n.left.argToken),b=evaluate(n.right,scope,reps,n.right.argToken),ok=({'<':()=>a<b,'>':()=>a>b,'=':()=>a===b,'<=':()=>a<=b,'>=':()=>a>=b,'<>':()=>a!==b})[n.cmp]();let body=ok?n.body:n.other;if(body){if(yield* block(body,scope))return true;tick(n.tok)}break}
 case 'call':{let d=parsed.defs.get(n.name),args=n.args.map(e=>evaluate(e,scope,reps,e.argToken));if(++frames>32)fail('Przekroczono limit ramek wykonania.',n.tok);let local=Object.create(globals);d.locals.forEach(k=>local[k]=undefined);d.params.forEach((p,i)=>local[p]=args[i]);yield* block(d.body,local);frames--;tick(n.tok);break}case 'stop':return true;
 }}return false}
 let gen=block(parsed.program,globals);try{if(gen.next().done)state.done=true}catch(e){state.error=format(e);state.done=true}state.step=()=>{if(state.done)return state;try{let result=gen.next();if(result.done){state.done=true;state.line=0}}catch(e){state.error=format(e);state.done=true;state.line=0}return state};return state;
}
function format(e){return {message:e.message||'Błąd programu.',line:e.line||1,column:e.column||1}}
export function run(source,mode='2d'){let s=createExecution(source,mode);while(!s.done)s.step();return {segments:s.segments,error:s.error||null}}
