const groups = {
  forward:'np naprzod naprzód fd forward', back:'ws wstecz bk back', right:'pw prawo rt right', left:'lw lewo lt left', up:'pod podnies podnieś pu penup', down:'opu opusc opuść pd pendown', color:'kolor color', width:'grubosc grubość width', repeat:'powtorz powtórz repeat', let:'niech let', if:'jeśli jesli if', ifelse:'jeżeli jezeli ifelse', stop:'stop', home:'dom home', clear:'czyść czysc cs clearscreen', pitchup:'gora góra pitchup', pitchdown:'dol dół pitchdown', rollright:'pp przechylprawo rr rollright', rollleft:'pl przechyllewo rl rollleft'
};
const aliases = Object.fromEntries(Object.entries(groups).flatMap(([k,v])=>v.split(' ').map(a=>[a,k])));
const specials = new Set(['oto','to','już','juz','end','ma','nrpowt','repcount']);
const norm = s => s.toLocaleLowerCase('pl');
class LogoError extends Error { constructor(message,t){super(message);this.line=t?.line||1;this.column=t?.col||1;} }
function fail(message,t){throw new LogoError(message,t)}
function lex(source){
 if(source.length>50000) fail('Program przekracza limit 50 000 znaków.',{line:1,col:1});
 const out=[]; let i=0,line=1,col=1;
 while(i<source.length){let c=source[i]; if(c==='\n'){i++;line++;col=1;continue} if(/\s/.test(c)){i++;col++;continue} if(c===';'){while(i<source.length&&source[i]!=='\n'){i++;col++}continue}
  const start=i, l=line, p=col; let m;
  if(c==='"'){i++;col++;while(i<source.length&&source[i]!=='"'&&source[i]!=='\n'){i++;col++} if(source[i]==='"'){i++;col++} out.push({v:source.slice(start,i),line:l,col:p,start,end:i,type:'string'});}
  else if((m=source.slice(i).match(/^(?:\d+(?:\.\d+)?|\.\d+)/))){i+=m[0].length;col+=m[0].length;out.push({v:m[0],line:l,col:p,start,end:i,type:'number'});}
  else if((m=source.slice(i).match(/^:?[\p{L}_][\p{L}\p{N}_]*/u))){i+=m[0].length;col+=m[0].length;out.push({v:norm(m[0]),line:l,col:p,start,end:i,type:'name'});}
  else if((m=source.slice(i).match(/^(<=|>=|<>|[+*/=<>()\[\],:-])/))){i+=m[0].length;col+=m[0].length;out.push({v:m[0],line:l,col:p,start,end:i,type:'symbol'});}
  else fail('Nieznany znak „'+c+'”.',{line:l,col:p});
  if(out.length>10000) fail('Program przekracza limit 10 000 tokenów.',out.at(-1));
 }
 return out;
}
const isName=t=>t?.type==='name'&&!t.v.startsWith(':');
const nameOf=t=>t.v.replace(/^:/,'');
function parse(source,mode){
 const tokens=lex(source), defs=new Map(), top=[];
 // Separate complete top-level definitions before parsing calls, preserving locations.
 let topDepth=0; for(let i=0;i<tokens.length;){const t=tokens[i];if(t.v==='[')topDepth++;if(t.v===']')topDepth--;if(t.v==='oto'||t.v==='to'){
   if(topDepth!==0)fail('Definicja procedury musi być na poziomie głównym.',t);
   if(i>0&&tokens[i-1].line===t.line) fail('Definicja musi zaczynać się na początku wiersza.',t);
   const header=[];let j=i+1;while(j<tokens.length&&tokens[j].line===t.line) header.push(tokens[j++]);
   const n=header.shift();if(!isName(n)||aliases[n.v]||specials.has(n.v)) fail('Niepoprawna nazwa procedury.',n||t);if(defs.has(n.v))fail('Procedura jest już zdefiniowana.',n);
   let params=[];if(header.length){if(header[0].v==='ma'&&header[1]?.v===':'){header.splice(0,2);let expect=true;for(const h of header){if(expect){if(!isName(h)) fail('Oczekiwano nazwy parametru.',h);params.push(h.v)}else if(h.v!==',')fail('Oczekiwano przecinka.',h);expect=!expect}if(expect)fail('Brakuje parametru.',header.at(-1)||n)}else{for(const h of header){if(h.type!=='name'||!h.v.startsWith(':'))fail('Niepoprawny parametr.',h);params.push(nameOf(h))}}}
   if(new Set(params).size!==params.length||params.some(p=>aliases[p]||specials.has(p)))fail('Niepoprawna lub powtórzona nazwa parametru.',n);
   let end=j;while(end<tokens.length&&!['już','juz','end'].includes(tokens[end].v))end++;if(end===tokens.length)fail('Brakuje zakończenia „już”.',t);
   if((end>j&&tokens[end-1].line===tokens[end].line)||(tokens[end+1]?.line===tokens[end].line))fail('„już” musi być samo w wierszu.',tokens[end]);
   defs.set(n.v,{name:n.v,params,t,bodyTokens:tokens.slice(j,end)});i=end+1;
  }else{top.push(t);i++}}
 const declared = ts=>new Set(ts.flatMap((t,i)=>aliases[t.v]==='let'&&isName(ts[i+1])?[ts[i+1].v]:[]));
 const globals=declared(top);
 for(const d of defs.values())d.locals=declared(d.bodyTokens);
 function parseBody(ts,def){let i=0,depth=0;
  const peek=()=>ts[i], take=()=>ts[i++];
  function expr(repeatDepth,min=0,anchor){
   const values=[],operators=[];let expecting=true,parens=0;
   const reduce=()=>{const op=operators.pop();if(op.unary){const a=values.pop();values.push({kind:'unary',op:op.v,a,t:op.t})}else{const b=values.pop(),a=values.pop();values.push({kind:'binary',op:op.v,a,b,t:a.t})}};
   while(true){let t=peek();
    if(expecting){if(!t)fail('Brakuje argumentu.',anchor);take();
     if(t.v==='+'||t.v==='-'){operators.push({v:t.v,t,unary:true,prec:3});continue}
     if(t.v==='('){operators.push({v:'(',t});parens++;continue}
     let node;if(t.type==='number'){node={kind:'number',value:Number(t.v),t};if(peek()&&peek().start===t.end&&peek().type==='name')fail('Niepoprawna liczba.',peek())}
     else if(t.type==='name'){let n=nameOf(t);if(n==='nrpowt'||n==='repcount'){if(!repeatDepth)fail('nrpowt działa tylko wewnątrz powtórzenia.',t);node={kind:'rep',t}}else{if(!globals.has(n)&&!def?.locals.has(n)&&!def?.params.includes(n))fail('Nieznana zmienna „'+n+'”.',t);node={kind:'var',name:n,t}}}
     else fail('Oczekiwano wyrażenia.',t);
     values.push(node);expecting=false;continue
    }
    if(t?.v===')'&&parens){while(operators.at(-1)?.v!=='(')reduce();let open=operators.pop();take();parens--;values[values.length-1]={...values.at(-1),t:open.t};continue}
    if(t&&['+','-','*','/'].includes(t.v)){let prev=ts[i-1],next=ts[i+1];if(!next)break;let leftSpace=t.start>prev.end,rightSpace=next.start>t.end;if(leftSpace!==rightSpace)break;let prec=t.v==='*'||t.v==='/'?2:1;while(operators.length&&operators.at(-1).v!=='('&&operators.at(-1).prec>=prec)reduce();operators.push({v:t.v,t,prec});take();expecting=true;continue}
    if(parens)fail('Brakuje nawiasu zamykającego.',t||operators.findLast(o=>o.v==='(')?.t);break
   }
   if(parens)fail('Brakuje nawiasu zamykającego.',peek()||operators.findLast(o=>o.v==='(')?.t);while(operators.length)reduce();return values[0]
  }
  function block(rd){const open=take();if(open?.v!=='[')fail('Oczekiwano nawiasu [.',open||ts[i-1]);if(++depth>32)fail('Przekroczono głębokość nawiasów.',open);let body=commands(rd,true);depth--;return body}
  function commands(rd,bracket=false){const body=[];while(i<ts.length){let t=take();if(t.v===']'){if(!bracket)fail('Nieoczekiwany nawias ].',t);return body}if(t.v==='[')fail('Nieoczekiwany nawias [.',t);if(['oto','to','już','juz','end'].includes(t.v))fail('Definicja procedury w niedozwolonym miejscu.',t);
    let cmd=aliases[t.v],d=defs.get(t.v),n={cmd:cmd||'call',t};if(!cmd&&!d)fail('Nieznane polecenie „'+t.v+'”.',t);
    if(['forward','back','right','left','width','pitchup','pitchdown','rollright','rollleft'].includes(cmd)){if(mode==='2d'&&['pitchup','pitchdown','rollright','rollleft'].includes(cmd))fail('To polecenie działa tylko w trybie 3D.',t);n.arg=expr(rd,0,t);}
    else if(cmd==='color'){let c=take();if(!c||c.type!=='string'||!/^"#[0-9a-f]{6}"$/i.test(c.v))fail('Kolor musi mieć postać "#rrggbb".',c||t);n.color=c.v.slice(1,-1).toLowerCase()}
    else if(cmd==='let'){let x=take();if(!isName(x)||aliases[x.v]||specials.has(x.v)||(defs.has(x.v)&&!def?.params.includes(x.v)))fail('Niepoprawna nazwa zmiennej.',x||t);n.name=x.v;n.arg=expr(rd,0,t)}
    else if(cmd==='repeat'){n.arg=expr(rd,0,t);n.body=block(rd+1)}
    else if(cmd==='if'||cmd==='ifelse'){n.a=expr(rd,0,t);let op=take();if(!op||!['<','>','=','<=','>=','<>'].includes(op.v))fail('Oczekiwano porównania.',op||t);n.op=op.v;n.b=expr(rd,0,op);n.body=block(rd);if(cmd==='ifelse')n.other=block(rd)}
    else if(!cmd){n.name=t.v;n.args=d.params.map(()=>expr(rd,0,t))}
    body.push(n);
   }if(bracket)fail('Brakuje nawiasu ].',ts.at(-1));return body}
  return commands(0)
 }
 for(const d of defs.values())d.body=parseBody(d.bodyTokens,d);
 const body=parseBody(top,null);
 // Literal width and repeat expressions are validated before execution, excluding arithmetic runtime faults.
 function constant(e){return evaluateExpression(e,()=>null,false)}
 function check(nodes){for(const n of nodes){if(n.cmd==='width'||n.cmd==='repeat'){let x=constant(n.arg);if(x!==null&&(!Number.isInteger(x)||x<(n.cmd==='width'?1:0)||x>(n.cmd==='width'?12:10000)))fail(n.cmd==='width'?'Grubość musi być liczbą całkowitą od 1 do 12.':'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.',n.arg.t)}if(n.body)check(n.body);if(n.other)check(n.other)}}
 check(body);for(const d of defs.values())check(d.body);return {body,defs};
}
function evaluateExpression(root,resolve,strict){
 const pending=[[root,false]],values=[];
 while(pending.length){const [node,ready]=pending.pop();if(!ready&&(node.kind==='binary'||node.kind==='unary')){pending.push([node,true]);if(node.kind==='binary')pending.push([node.b,false]);pending.push([node.a,false]);continue}
  let x;if(node.kind==='number')x=node.value;else if(node.kind==='var'||node.kind==='rep')x=resolve(node);else if(node.kind==='unary'){let a=values.pop();x=a===null?null:node.op==='-'?-a:a}else{let b=values.pop(),a=values.pop();if(a===null||b===null)x=null;else if(node.op==='/'&&b===0){if(strict)fail('Nie można dzielić przez zero.',root.t);x=null}else x=node.op==='+'?a+b:node.op==='-'?a-b:node.op==='*'?a*b:a/b}
  if(x!==null&&!Number.isFinite(x)){if(strict)fail('Wynik nie jest liczbą skończoną.',root.t);x=null}values.push(x)
 }
 return values[0]
}
const initial=()=>({pos:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],pen:true,color:'#16866a',width:3,segments:[]});
const add=(a,b,k)=>a.map((x,i)=>x+b[i]*k);
const clean=x=>Math.abs(x)<1e-10?0:x;
function* execute(ast){let state=initial(),globals=new Map(),ops=0,frames=0;
 const count=t=>{if(++ops>10000)fail('Przekroczono limit 10 000 operacji.',t)};
 function value(e,local,reps){return evaluateExpression(e,node=>{if(node.kind==='rep')return reps.at(-1);if(local?.has(node.name))return local.get(node.name);if(globals.has(node.name))return globals.get(node.name);fail('Zmienna „'+node.name+'” nie ma jeszcze wartości.',e.t)},true)}
 function move(pos,t){pos=pos.map(clean);if(pos.some(x=>!Number.isFinite(x)||Math.abs(x)>100000))fail('Przekroczono granicę współrzędnych.',t);if(state.pen&&pos.some((x,i)=>x!==state.pos[i])){if(state.segments.length>=10000)fail('Przekroczono limit odcinków.',t);state.segments.push({from:[...state.pos],to:[...pos],color:state.color,width:state.width})}state.pos=pos}
 function rotate(a,b,angle){let c=Math.cos(angle/180*Math.PI),s=Math.sin(angle/180*Math.PI),x=state[a],y=state[b];state[a]=x.map((v,i)=>clean(v*c+y[i]*s));state[b]=y.map((v,i)=>clean(v*c-x[i]*s))}
 function* body(nodes,local,reps){for(const n of nodes){count(n.t);yield {state,line:n.t.line};let x;switch(n.cmd){
 case 'forward':case 'back':x=value(n.arg,local,reps);move(add(state.pos,state.heading,x*(n.cmd==='back'?-1:1)),n.arg.t);break;
 case 'right':case 'left':rotate('heading','right',value(n.arg,local,reps)*(n.cmd==='left'?-1:1));break;
 case 'pitchup':case 'pitchdown':rotate('heading','up',value(n.arg,local,reps)*(n.cmd==='pitchdown'?-1:1));break;
 case 'rollright':case 'rollleft':rotate('up','right',value(n.arg,local,reps)*(n.cmd==='rollleft'?-1:1));break;
 case 'up':state.pen=false;break;case 'down':state.pen=true;break;case 'color':state.color=n.color;break;
 case 'width':x=value(n.arg,local,reps);if(!Number.isInteger(x)||x<1||x>12)fail('Grubość musi być liczbą całkowitą od 1 do 12.',n.arg.t);state.width=x;break;
 case 'clear':state.segments.length=0;break;case 'home':move([0,0,0],n.t);state.heading=[0,1,0];state.right=[1,0,0];state.up=[0,0,1];break;
 case 'let':(local||globals).set(n.name,value(n.arg,local,reps));break;
 case 'stop':return true;
 case 'repeat':x=value(n.arg,local,reps);if(!Number.isInteger(x)||x<0||x>10000)fail('Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.',n.arg.t);if(x){if(++frames>32)fail('Przekroczono limit zagnieżdżenia wykonania.',n.t);for(let j=1;j<=x;j++){if(yield* body(n.body,local,[...reps,j])){frames--;return true}count(n.t)}frames--}break;
 case 'if':case 'ifelse':{let a=value(n.a,local,reps),b=value(n.b,local,reps);let ok=n.op==='<'?a<b:n.op==='>'?a>b:n.op==='='?a===b:n.op==='<='?a<=b:n.op==='>='?a>=b:a!==b;let chosen=ok?n.body:n.other;if(chosen){if(yield* body(chosen,local,reps))return true;count(n.t)}break}
 case 'call':{let d=ast.defs.get(n.name),args=n.args.map(a=>value(a,local,reps));if(++frames>32)fail('Przekroczono limit zagnieżdżenia wykonania.',n.t);yield* body(d.body,new Map(d.params.map((p,i)=>[p,args[i]])),[]);frames--;count(n.t);break}
 }}return false}
 try{yield* body(ast.body,null,[]);return {state,error:null}}catch(e){if(!(e instanceof LogoError))throw e;return {state,error:{message:e.message,line:e.line,column:e.column}}}
}
export function createExecution(source,mode='2d'){try{return {iterator:execute(parse(source,mode)),error:null}}catch(e){if(!(e instanceof LogoError))throw e;return {iterator:null,error:{message:e.message,line:e.line,column:e.column}}}}
export function run(source,mode='2d'){let {iterator,error}=createExecution(source,mode);if(error)return {segments:[],error};let r;do{r=iterator.next()}while(!r.done);return {segments:r.value.state.segments,error:r.value.error}}
