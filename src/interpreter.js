const aliases = {
  move:'np naprzod naprzód fd forward', back:'ws wstecz bk back', right:'pw prawo rt right', left:'lw lewo lt left', up:'pod podnies podnieś pu penup', down:'opu opusc opuść pd pendown', color:'kolor color', width:'grubosc grubość width', repeat:'powtorz powtórz repeat', let:'niech let', if:'jeśli jesli if', ifelse:'jeżeli jezeli ifelse', stop:'stop', home:'dom home', clear:'czyść czysc cs clearscreen', pitchup:'gora góra pitchup', pitchdown:'dol dół pitchdown', rollright:'pp przechylprawo rr rollright', rollleft:'pl przechyllewo rl rollleft'
};
export const words = Object.fromEntries(Object.entries(aliases).flatMap(([k,v])=>v.split(' ').map(x=>[x,k])));
const lower=s=>s.toLocaleLowerCase('pl');
class LogoError extends Error { constructor(message,t){super(message);this.line=t?.line||1;this.column=t?.column||1;} }
function lex(source){
 if(source.length>50000) throw new LogoError('Program przekracza limit 50 000 znaków.',{line:1,column:1});
 let a=[], i=0,line=1,col=1;
 while(i<source.length){let c=source[i],start=i,l=line,p=col;
  if(/\s/.test(c)){if(c==='\n'){line++;col=1}else col++;i++;continue}
  if(c===';'){while(i<source.length&&source[i]!=='\n'){i++;col++}continue}
  let value;
  if(c==='"'){i++;col++;while(i<source.length&&source[i]!=='"'&&source[i]!=='\n'){i++;col++}if(source[i]==='"'){i++;col++}value=source.slice(start,i)}
  else if(/[\p{L}_:]/u.test(c)){i++;col++;while(i<source.length&&/[\p{L}\p{N}_]/u.test(source[i])){i++;col++}value=source.slice(start,i)}
  else if(/[0-9.]/.test(c)){i++;col++;while(i<source.length&&/[\p{L}\p{N}_.]/u.test(source[i])){i++;col++}value=source.slice(start,i)}
  else {i++;col++;if((c==='<'||c==='>')&&(source[i]==='='||(c==='<'&&source[i]==='>'))){i++;col++}value=source.slice(start,i)}
  a.push({value,low:lower(value),line:l,column:p,start,end:i});if(a.length>10000)throw new LogoError('Program przekracza limit 10 000 tokenów.',a.at(-1));
 }
 return a;
}
const isName=t=>!!t&&/^:?[\p{L}_][\p{L}\p{N}_]*$/u.test(t.value);
const name=t=>lower(t.value.replace(/^:/,''));
const isNum=t=>!!t&&/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(t.value);
const specials=new Set(['oto','to','już','juz','end','ma','ma:','nrpowt','repcount']);
const reserved=n=>!!words[n]||specials.has(n);
function parse(source,mode){
 const ts=lex(source), defs=new Map(), globals=new Set(); let i=0;
 // Collect definitions and their exact header/body boundaries before parsing calls.
 for(let j=0;j<ts.length;j++) if(['oto','to'].includes(ts[j].low)){
  let t=ts[j];if(j&&ts[j-1].line===t.line)throw new LogoError('Definicja musi zaczynać się na początku wiersza.',t);
  let n=ts[++j];if(!isName(n)||n.line!==t.line||reserved(name(n)))throw new LogoError('Niepoprawna nazwa procedury.',n||t);
  let key=name(n);if(defs.has(key))throw new LogoError('Procedura jest już zdefiniowana.',n);
  let params=[];while(ts[j+1]?.line===t.line){let q=ts[++j];if(q.low==='ma'&&ts[j+1]?.value===':'){j++;continue}if(q.low==='ma:')continue;if(q.value===',')continue;if(!isName(q)||reserved(name(q))||params.includes(name(q)))throw new LogoError('Niepoprawny parametr.',q);params.push(name(q))}
  let start=j+1,k=start;while(k<ts.length&&!['już','juz','end'].includes(ts[k].low))k++;
  if(k===ts.length)throw new LogoError('Brakuje zakończenia „już”.',t);
  if((ts[k-1]&&ts[k-1].line===ts[k].line)||(ts[k+1]&&ts[k+1].line===ts[k].line))throw new LogoError('„Już” musi być samo w wierszu.',ts[k]);
  defs.set(key,{name:key,params,start,end:k,token:t});j=k;
 }
 // Gather declarations in each lexical scope.
 const ranges=[...defs.values()];
 for(let j=0;j<ts.length;j++)if(words[ts[j].low]==='let'){
  let n=ts[j+1];if(!isName(n)||reserved(name(n))||defs.has(name(n)))throw new LogoError('Niepoprawna nazwa zmiennej.',n||ts[j]);
  let d=ranges.find(x=>j>=x.start&&j<x.end);if(d){(d.locals ||= new Set()).add(name(n))}else globals.add(name(n));
 }
 let scope=null, depth=0, repeatDepth=0;
 function fail(msg,t=ts[i]||ts[i-1]){throw new LogoError(msg,t)}
 function expr(min=0){let t=ts[i];if(!t)fail('Brakuje wyrażenia.');let node;
  if(t.value==='+'||t.value==='-'){i++;node={type:'unary',op:t.value,a:expr(3),token:t}}
  else if(t.value==='('){i++;node=expr();if(ts[i]?.value!==')')fail('Brakuje nawiasu zamykającego.',ts[i]||t);i++}
  else if(isNum(t)){i++;node={type:'number',value:Number(t.value),token:t}}
  else if(isName(t)) {let n=name(t);if(n==='nrpowt'||n==='repcount'){if(!repeatDepth)fail('Nrpowt można użyć tylko wewnątrz powtórzenia.',t);i++;node={type:'rep',token:t}}else if(scope?.params.includes(n)||scope?.locals?.has(n)||globals.has(n)){i++;node={type:'var',name:n,token:t}}else fail('Nieznana zmienna: '+t.value,t)}
  else fail('Oczekiwano wyrażenia.',t);
  while(ts[i]&&['+','-','*','/'].includes(ts[i].value)) {let op=ts[i],prec=op.value==='+'||op.value==='-'?1:2;if(prec<min)break;let prev=ts[i-1],next=ts[i+1];let left=prev.end<op.start,right=next?op.end<next.start:false;if(left!==right)break;i++;node={type:'binary',op:op.value,a:node,b:expr(prec+1),token:op}}
  return node;
 }
 function argument(command){if(!ts[i]||[']',')','['].includes(ts[i].value))fail('Brakuje argumentu.',ts[i]||command);let start=ts[i];return {tree:expr(),token:start}}
 function block(){let t=ts[i];if(t?.value!=='[')fail('Oczekiwano nawiasu [.',t);i++;if(++depth>32)fail('Przekroczono limit zagnieżdżenia nawiasów.',t);let body=commands(']');depth--;if(ts[i]?.value!==']')fail('Brakuje nawiasu ].',t);i++;return body}
 function condition(cmd){let a=argument(cmd),op=ts[i];if(!op||!['<','>','=','<=','>=','<>'].includes(op.value))fail('Oczekiwano porównania.',op||cmd);i++;return {a,op:op.value,b:argument(cmd)}}
 function commands(end){let out=[];while(i<ts.length&&ts[i].value!==end){let t=ts[i++],key=t.low,kind=words[key];
  if(['oto','to'].includes(key)){let d=defs.get(name(ts[i]));if(scope||depth||!d||d.token!==t)fail('Definicja procedury jest dozwolona tylko na najwyższym poziomie.',t);i=d.start;scope=d;d.body=commands('__end');if(i!==d.end)fail('Niepoprawna definicja.',t);i++;scope=null;continue}
  if(['już','juz','end'].includes(key)){if(end==='__end'){i--;break}fail('Nieoczekiwane zakończenie procedury.',t)}
  if(kind){let n={kind,token:t};if(['move','back','right','left','width','pitchup','pitchdown','rollright','rollleft'].includes(kind)){if(mode==='2d'&&['pitchup','pitchdown','rollright','rollleft'].includes(kind))fail('To polecenie działa tylko w trybie 3D.',t);n.arg=argument(t)}
   else if(kind==='color'){let c=ts[i];if(!c||!/^"#[0-9a-fA-F]{6}"$/.test(c.value))fail('Oczekiwano koloru, np. "#16866a".',c||t);i++;n.color=c.value.slice(1,-1).toLowerCase()}
   else if(kind==='let'){let v=ts[i++];if(!isName(v)||reserved(name(v))||defs.has(name(v)))fail('Niepoprawna nazwa zmiennej.',v||t);n.name=name(v);n.arg=argument(t)}
   else if(kind==='repeat'){n.arg=argument(t);repeatDepth++;n.body=block();repeatDepth--}
   else if(kind==='if'||kind==='ifelse'){n.condition=condition(t);n.body=block();if(kind==='ifelse')n.other=block()}
   if((kind==='width'||kind==='repeat')&&!hasVariable(n.arg.tree)){try{let v=evaluate(n.arg.tree,{},[],n.arg.token);validate(kind,v,n.arg.token)}catch(e){if(!/zero|skończon/.test(e.message))throw e}}
   out.push(n);continue;
  }
  let d=defs.get(name(t));if(d&&isName(t)){let n={kind:'call',token:t,def:d,args:[]};for(let p of d.params)n.args.push(argument(t));out.push(n);continue}
  fail('Nieznane polecenie: '+t.value,t);
 }return out}
 const body=commands(null);return {body,defs};
}
function hasVariable(n){return n.type==='var'||n.type==='rep'||(n.a&&hasVariable(n.a))||(n.b&&hasVariable(n.b))}
function evaluate(n,env,reps,origin){let v;if(n.type==='number')v=n.value;else if(n.type==='var'){v=env[n.name];if(v===undefined)throw new LogoError('Zmienna „'+n.name+'” nie ma jeszcze wartości.',origin)}else if(n.type==='rep')v=reps.at(-1);else if(n.type==='unary'){v=evaluate(n.a,env,reps,origin)*(n.op==='-'?-1:1)}else{let a=evaluate(n.a,env,reps,origin),b=evaluate(n.b,env,reps,origin);if(n.op==='/'&&b===0)throw new LogoError('Dzielenie przez zero.',origin);v=n.op==='+'?a+b:n.op==='-'?a-b:n.op==='*'?a*b:a/b}if(!Number.isFinite(v))throw new LogoError('Wynik nie jest liczbą skończoną.',origin);return v}
function validate(kind,v,t){if(kind==='width'&&(!Number.isInteger(v)||v<1||v>12))throw new LogoError('Grubość musi być liczbą całkowitą od 1 do 12.',t);if(kind==='repeat'&&(!Number.isInteger(v)||v<0||v>10000))throw new LogoError('Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.',t)}
const add=(a,b)=>a.map((x,i)=>x+b[i]), mul=(a,s)=>a.map(x=>x*s);
function rotate(a,b,angle){let c=Math.cos(angle*Math.PI/180),s=Math.sin(angle*Math.PI/180);return [add(mul(a,c),mul(b,s)),add(mul(b,c),mul(a,-s))]}
export function createExecution(source,mode='2d'){
 let parsed;try{parsed=parse(source,mode)}catch(e){return {error:format(e),segments:[],done:true}}
 let state={segments:[],pos:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],pen:true,color:'#16866a',width:3,line:0,done:false,error:null}, globals={},ops=0,reps=[],frames=0;
 function tick(t){if(++ops>10000)throw new LogoError('Przekroczono limit 10 000 operacji.',t)}
 function val(a,env){return evaluate(a.tree,env,reps,a.token)}
 function move(distance,t){let end=add(state.pos,mul(state.heading,distance));if(end.some(x=>!Number.isFinite(x)||Math.abs(x)>100000))throw new LogoError('Przekroczono granicę współrzędnych.',t);if(state.pen&&distance!==0){if(state.segments.length>=10000)throw new LogoError('Przekroczono limit odcinków.',t);state.segments.push({from:[...state.pos],to:[...end],color:state.color,width:state.width})}state.pos=end}
 function* execute(body,local=null){for(let n of body){tick(n.token);state.line=n.token.line;yield n.token;let env=local?Object.assign(Object.create(null),globals,local):globals;
  switch(n.kind){case 'move':move(val(n.arg,env),n.arg.token);break;case 'back':move(-val(n.arg,env),n.arg.token);break;
  case 'right':[state.heading,state.right]=rotate(state.heading,state.right,val(n.arg,env));break;case 'left':[state.heading,state.right]=rotate(state.heading,state.right,-val(n.arg,env));break;
  case 'pitchup':[state.heading,state.up]=rotate(state.heading,state.up,val(n.arg,env));break;case 'pitchdown':[state.heading,state.up]=rotate(state.heading,state.up,-val(n.arg,env));break;
  case 'rollright':[state.up,state.right]=rotate(state.up,state.right,val(n.arg,env));break;case 'rollleft':[state.up,state.right]=rotate(state.up,state.right,-val(n.arg,env));break;
  case 'up':state.pen=false;break;case 'down':state.pen=true;break;case 'color':state.color=n.color;break;case 'width':{let v=val(n.arg,env);validate('width',v,n.arg.token);state.width=v;break}case 'let':(local||globals)[n.name]=val(n.arg,env);break;
  case 'home':{let end=[0,0,0];if(state.pen&&state.pos.some(x=>x!==0)){if(state.segments.length>=10000)throw new LogoError('Przekroczono limit odcinków.',n.token);state.segments.push({from:[...state.pos],to:end,color:state.color,width:state.width})}state.pos=end;state.heading=[0,1,0];state.right=[1,0,0];state.up=[0,0,1];break}case 'clear':state.segments=[];break;
  case 'stop':return true;
  case 'repeat':{let count=val(n.arg,env);validate('repeat',count,n.arg.token);if(++frames>32)throw new LogoError('Przekroczono limit wywołań i powtórzeń.',n.token);for(let j=1;j<=count;j++){reps.push(j);let stop=yield* execute(n.body,local);reps.pop();if(stop){frames--;return true}tick(n.token)}frames--;break}
  case 'if':case 'ifelse':{let c=n.condition,a=val(c.a,env),b=val(c.b,env),yes=({'<':()=>a<b,'>':()=>a>b,'=':()=>a===b,'<=':()=>a<=b,'>=':()=>a>=b,'<>':()=>a!==b})[c.op]();let branch=yes?n.body:n.other;if(branch){let stop=yield* execute(branch,local);if(stop)return true;tick(n.token)}break}
  case 'call':{let args=n.args.map(a=>val(a,env));if(++frames>32)throw new LogoError('Przekroczono limit wywołań i powtórzeń.',n.token);let vars=Object.create(null);n.def.params.forEach((p,j)=>vars[p]=args[j]);yield* execute(n.def.body,vars);frames--;tick(n.token);break}
 }}return false}
 let gen=execute(parsed.body);state.step=()=>{if(state.done)return;try{let r=gen.next();if(r.done){state.done=true;state.line=0}}catch(e){state.error=format(e);state.done=true;state.line=0}};return state;
}
function format(e){return {message:e.message||'Błąd programu.',line:e.line||1,column:e.column||1}}
export function run(source,mode='2d'){let s=createExecution(source,mode);while(!s.done)s.step();return {segments:s.segments,error:s.error}}
