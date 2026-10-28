const aliases = {};
for (const [key, words] of Object.entries({move:'np naprzod naprzód fd forward',back:'ws wstecz bk back',right:'pw prawo rt right',left:'lw lewo lt left',up:'pod podnies podnieś pu penup',down:'opu opusc opuść pd pendown',color:'kolor color',width:'grubosc grubość width',repeat:'powtorz powtórz repeat',let:'niech let',if:'jeśli jesli if',ifelse:'jeżeli jezeli ifelse',stop:'stop',home:'dom home',clear:'czyść czysc cs clearscreen',pitch:'gora góra pitchup',pitchdown:'dol dół pitchdown',roll:'pp przechylprawo rr rollright',rollleft:'pl przechyllewo rl rollleft'})) for (const w of words.split(' ')) aliases[w]=key;
const reserved = new Set([...Object.keys(aliases),'oto','to','już','juz','end','ma','nrpowt','repcount']);
const lower = s => s.toLocaleLowerCase('pl');
const fail = (t,message) => { throw {message,line:t?.line||1,column:t?.col||1}; };
function lex(source) {
 if(source.length>50000) fail({line:1,col:1},'Program przekracza limit 50 000 znaków.');
 const tokens=[]; let i=0,line=1,col=1;
 while(i<source.length){let c=source[i]; if(c==='\n'){i++;line++;col=1;continue} if(/\s/.test(c)){i++;col++;continue} if(c===';'){while(i<source.length&&source[i]!=='\n'){i++;col++}continue}
 const start=i, l=line, cc=col; let value;
 if(c==='"'){i++;col++;while(i<source.length&&source[i]!=='"'&&source[i]!=='\n'){i++;col++} if(source[i]==='"'){i++;col++} value=source.slice(start,i)}
 else if(/[\p{L}_:]/u.test(c)){i++;col++;while(i<source.length&&/[\p{L}\p{N}_]/u.test(source[i])){i++;col++}value=source.slice(start,i)}
 else if(/[0-9.]/.test(c)){i++;col++;while(i<source.length&&/[\p{L}\p{N}_.]/u.test(source[i])){i++;col++}value=source.slice(start,i)}
 else {i++;col++;if('<>='.includes(c)&&source[i]==='='||c==='<'&&source[i]==='>'){i++;col++}value=source.slice(start,i)}
 tokens.push({v:value,low:lower(value),line:l,col:cc,start,end:i}); if(tokens.length>10000) fail(tokens.at(-1),'Program przekracza limit 10 000 tokenów.');
 }
 return tokens;
}
const nameRe=/^[\p{L}_][\p{L}\p{N}_]*$/u;
const numRe=/^(?:\d+(?:\.\d+)?|\.\d+)$/;
function isName(t){return t && nameRe.test(t.v.replace(/^:/,''))}
function parse(source,mode){
 const ts=lex(source), defs=new Map(), excluded=new Set();
 // Collect headers and their boundaries first, so calls can precede definitions.
 let bracketDepth=0;for(let i=0;i<ts.length;i++){let t=ts[i]; if(t.v==='['){bracketDepth++;continue}if(t.v===']'){bracketDepth--;continue}if(!['oto','to'].includes(t.low))continue;if(bracketDepth!==0)fail(t,'Definicja procedury jest dozwolona tylko na najwyższym poziomie.');
 if(i>0&&ts[i-1].line===t.line) fail(t,'Definicja musi zaczynać się na początku wiersza.');
 let j=i+1, n=ts[j]; if(!isName(n)||n.line!==t.line||n.v.startsWith(':')||reserved.has(n.low)) fail(n||t,'Nieprawidłowa nazwa procedury.');
 let name=n.low; if(defs.has(name))fail(n,'Procedura jest już zdefiniowana.'); j++; let params=[];
 if(ts[j]?.line===t.line && ts[j].low==='ma' && ts[j+1]?.v===':'){j+=2; while(ts[j]?.line===t.line){let p=ts[j];if(!isName(p)||p.v.startsWith(':')||reserved.has(p.low))fail(p,'Nieprawidłowy parametr.');params.push(p.low);j++;if(ts[j]?.line===t.line){if(ts[j].v!==',')fail(ts[j],'Oczekiwano przecinka.');j++;if(!ts[j]||ts[j].line!==t.line)fail(ts[j-1],'Brakuje parametru.')}}}
 else while(ts[j]?.line===t.line){let p=ts[j];if(!p.v.startsWith(':')||!isName(p)||reserved.has(lower(p.v.slice(1))))fail(p,'Nieprawidłowy parametr.');params.push(lower(p.v.slice(1)));j++}
 if(new Set(params).size!==params.length)fail(n,'Powtórzony parametr.');
 let end=j;while(end<ts.length&&!['już','juz','end'].includes(ts[end].low))end++;
 if(end===ts.length)fail(t,'Brakuje zakończenia już.');
 if((end>0&&ts[end-1].line===ts[end].line)||(ts[end+1]&&ts[end+1].line===ts[end].line))fail(ts[end],'Zakończenie procedury musi być samo w wierszu.');
 defs.set(name,{name,params,start:j,end,token:t}); for(let k=i;k<=end;k++)excluded.add(k); i=end;
 }
 let global=new Set(), locals=new Map();
 function collect(start,end,set){for(let i=start;i<end;i++)if(aliases[ts[i].low]==='let'&&isName(ts[i+1]))set.add(lower(ts[i+1].v.replace(/^:/,'')))}
 collect(0,ts.length,global); // remove local declarations from globals below
 global=new Set(); for(let i=0;i<ts.length;i++)if(!excluded.has(i)&&aliases[ts[i].low]==='let'&&isName(ts[i+1]))global.add(lower(ts[i+1].v.replace(/^:/,'')));
 for(const d of defs.values()){let s=new Set(d.params);collect(d.start,d.end,s);locals.set(d.name,s)}
 function parseRange(start,end,scope,params=new Set()){let i=start;
 function peek(){return i<end?ts[i]:null} function take(){return i<end?ts[i++]:null} function missing(cmd,msg='Brakuje argumentu.'){fail(peek()||cmd,msg)}
 function expr(cmd,repeatDepth){const first=peek();if(!first)missing(cmd); function atom(){let t=take();if(!t)missing(cmd);if(t.v==='+'||t.v==='-')return {type:'unary',op:t.v,a:atom(),t};if(t.v==='('){let e=bin(0);if(peek()?.v!==')')fail(peek()||t,'Brakuje zamykającego nawiasu.');take();return e}if(numRe.test(t.v))return {type:'num',value:Number(t.v),t};if(t.low==='nrpowt'||t.low==='repcount'){if(!repeatDepth)fail(t,'nrpowt można użyć tylko wewnątrz powtórzenia.');return {type:'rep',t}}if(isName(t)){let n=lower(t.v.replace(/^:/,''));if(!scope.has(n)&&!global.has(n))fail(t,`Nieznana zmienna „${n}”.`);return {type:'var',name:n,t}}fail(t,'Oczekiwano wyrażenia.');}
 function bin(min){let left=atom();while(peek()&&['+','-','*','/'].includes(peek().v)){let op=peek(), prev=ts[i-1],next=ts[i+1], spacedL=op.start>prev.end, spacedR=next?next.start>op.end:false;if(spacedL!==spacedR)break;let p=op.v==='+'||op.v==='-'?1:2;if(p<min)break;take();let right=bin(p+1);left={type:'bin',op:op.v,a:left,b:right,t:op}}return left}return {tree:bin(0),token:first};}
 function block(depth,rd,cmd){let t=peek();if(!t||t.v!=='[')missing(cmd,'Oczekiwano nawiasu [ .');if(depth>=32)fail(t,'Przekroczono limit zagnieżdżenia nawiasów.');take();let body=commands(depth+1,rd,true);if(peek()?.v!==']')fail(peek()||t,'Brakuje nawiasu ].');take();return body}
 function commands(depth,rd,inBlock){let out=[];while(peek()){let t=peek();if(t.v===']'){if(inBlock)break;fail(t,'Nieoczekiwany nawias ].')}if(['oto','to','już','juz','end'].includes(t.low))fail(t,'Definicja procedury jest dozwolona tylko na najwyższym poziomie.');take();let kind=aliases[t.low];if(!kind&&!defs.has(t.low))fail(t,`Nieznane polecenie „${t.v}”.`);let n={kind:kind||'call',t};
 if(['move','back','right','left','width','pitch','pitchdown','roll','rollleft'].includes(kind)){if(mode==='2d'&&['pitch','pitchdown','roll','rollleft'].includes(kind))fail(t,'To polecenie działa tylko w trybie 3D.');n.arg=expr(t,rd);if(kind==='width'&&!hasName(n.arg.tree)){let v;try{v=evaluate(n.arg,{},[])}catch{}if(v!==undefined&&(!Number.isInteger(v)||v<1||v>12))fail(n.arg.token,'Grubość musi być liczbą całkowitą od 1 do 12.')}}
 else if(kind==='color'){let a=take();if(!a)missing(t);if(!/^"#[0-9a-f]{6}"$/i.test(a.v))fail(a,'Kolor musi mieć postać „#rrggbb”.');n.color=lower(a.v.slice(1,-1))}
 else if(kind==='let'){let a=take();if(!a)missing(t);let name=lower(a.v.replace(/^:/,''));if(!isName(a)||a.v.startsWith(':')||reserved.has(name)||(defs.has(name)&&!params.has(name)))fail(a,'Nieprawidłowa nazwa zmiennej.');n.name=name;n.arg=expr(t,rd)}
 else if(kind==='repeat'){n.arg=expr(t,rd);if(!hasName(n.arg.tree)){let v;try{v=evaluate(n.arg,{},[])}catch{}if(v!==undefined&&(!Number.isInteger(v)||v<0||v>10000))fail(n.arg.token,'Liczba powtórzeń musi być całkowita i mieścić się w zakresie 0–10000.')}n.body=block(depth,rd+1,t)}
 else if(kind==='if'||kind==='ifelse'){n.a=expr(t,rd);let op=take();if(!op||!['<','>','=','<=','>=','<>'].includes(op.v))fail(op||t,'Oczekiwano porównania.');n.op=op.v;n.b=expr(t,rd);n.body=block(depth,rd,t);if(kind==='ifelse')n.other=block(depth,rd,t)}
 else if(!kind){n.def=defs.get(t.low);n.args=[];for(let k=0;k<n.def.params.length;k++)n.args.push(expr(t,rd))}
 out.push(n)}return out}
 let out=commands(0,0,false);return out;
 }
 // Parse definitions independently and top-level chunks with definitions removed.
 for(const d of defs.values())d.body=parseRange(d.start,d.end,locals.get(d.name),new Set(d.params));
 // use filtered token list for top-level while preserving offsets
 const original=ts.slice(); const top=ts.filter((_,i)=>!excluded.has(i));ts.splice(0,ts.length,...top);let body=parseRange(0,ts.length,new Set());ts.splice(0,ts.length,...original);
 return {body,defs};
}
function hasName(e){return e.type==='var'||e.type==='rep'||(e.a&&hasName(e.a))||(e.b&&hasName(e.b))}
function evaluate(arg,env,reps){function val(e){if(e.type==='num')return e.value;if(e.type==='rep')return reps.at(-1);if(e.type==='var'){if(!(e.name in env))fail(arg.token,`Zmienna „${e.name}” nie ma jeszcze wartości.`);return env[e.name]}if(e.type==='unary')return e.op==='-'?-val(e.a):val(e.a);let a=val(e.a),b=val(e.b);if(e.op==='/'&&b===0)fail(arg.token,'Nie można dzielić przez zero.');return e.op==='+'?a+b:e.op==='-'?a-b:e.op==='*'?a*b:a/b}let v=val(arg.tree);if(!Number.isFinite(v))fail(arg.token,'Wynik wyrażenia nie jest liczbą skończoną.');return v}
const add=(a,b)=>a.map((x,i)=>x+b[i]);const scale=(a,k)=>a.map(x=>x*k);
export function createExecution(source,mode='2d'){
 let ast;try{if(!['2d','3d'].includes(mode))fail(null,'Nieznany tryb.');ast=parse(source,mode)}catch(error){return {segments:[],error,done:true,next(){return {done:true}}}}
 const state={segments:[],error:null,done:false,pos:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],pen:true,color:'#16866a',width:3,line:null};let ops=0,frames=0;const global=Object.create(null);
 function tick(t){if(++ops>10000)fail(t,'Przekroczono limit 10 000 operacji.')}
 function frame(t){if(++frames>32)fail(t,'Przekroczono limit 32 aktywnych wywołań i powtórzeń.')}
 function move(to,t){if(to.some(x=>!Number.isFinite(x)||Math.abs(x)>100000))fail(t,'Przekroczono limit współrzędnych ±100 000.');if(state.pen&&to.some((x,i)=>x!==state.pos[i])){if(state.segments.length>=10000)fail(t,'Przekroczono limit 10 000 odcinków.');state.segments.push({from:[...state.pos],to:[...to],color:state.color,width:state.width})}state.pos=to}
 function rotate(a,b,angle){let c=Math.cos(angle*Math.PI/180),s=Math.sin(angle*Math.PI/180);return [add(scale(a,c),scale(b,s)),add(scale(b,c),scale(a,-s))]}
 function* exec(body,env,reps){for(const n of body){tick(n.t);state.line=n.t.line;yield n;let v;switch(n.kind){case 'move':case 'back':v=evaluate(n.arg,env,reps)*(n.kind==='back'?-1:1);move(add(state.pos,scale(state.heading,v)),n.arg.token);break;
 case 'right':case 'left':v=evaluate(n.arg,env,reps)*(n.kind==='left'?-1:1);[state.heading,state.right]=rotate(state.heading,state.right,v);break;
 case 'pitch':case 'pitchdown':v=evaluate(n.arg,env,reps)*(n.kind==='pitchdown'?-1:1);[state.heading,state.up]=rotate(state.heading,state.up,v);break;
 case 'roll':case 'rollleft':v=evaluate(n.arg,env,reps)*(n.kind==='rollleft'?-1:1);[state.up,state.right]=rotate(state.up,state.right,v);break;
 case 'up':state.pen=false;break;case 'down':state.pen=true;break;case 'color':state.color=n.color;break;case 'width':v=evaluate(n.arg,env,reps);if(!Number.isInteger(v)||v<1||v>12)fail(n.arg.token,'Grubość musi być liczbą całkowitą od 1 do 12.');state.width=v;break;
 case 'let':env[n.name]=evaluate(n.arg,env,reps);break;case 'clear':state.segments.length=0;break;case 'home':move([0,0,0],n.t);state.heading=[0,1,0];state.right=[1,0,0];state.up=[0,0,1];break;case 'stop':return true;
 case 'repeat':v=evaluate(n.arg,env,reps);if(!Number.isInteger(v)||v<0||v>10000)fail(n.arg.token,'Liczba powtórzeń musi być całkowita i mieścić się w zakresie 0–10000.');frame(n.t);for(let j=1;j<=v;j++){if(yield* exec(n.body,env,[...reps,j])){frames--;return true}tick(n.t)}frames--;break;
 case 'if':case 'ifelse':{let a=evaluate(n.a,env,reps),b=evaluate(n.b,env,reps),ok={'<':a<b,'>':a>b,'=':a===b,'<=':a<=b,'>=':a>=b,'<>':a!==b}[n.op],chosen=ok?n.body:n.other;if(chosen){if(yield* exec(chosen,env,reps))return true;tick(n.t)}break}
 case 'call':{let args=n.args.map(a=>evaluate(a,env,reps));frame(n.t);let local=Object.create(global);n.def.params.forEach((p,i)=>local[p]=args[i]);yield* exec(n.def.body,local,[]);tick(n.t);frames--;break}
 }}return false}
 const gen=exec(ast.body,global,[]);state.next=()=>{if(state.done)return {done:true};try{let r=gen.next();if(r.done){state.done=true;state.line=null}return r}catch(e){state.error=e;state.done=true;state.line=null;return {done:true}}};return state;
}
export function run(source,mode='2d'){let s=createExecution(source,mode);while(!s.done)s.next();return {segments:s.segments,error:s.error}}
