const aliases = {
 np:'move',naprzod:'move',naprzód:'move',fd:'move',forward:'move',ws:'back',wstecz:'back',bk:'back',back:'back',pw:'right',prawo:'right',rt:'right',right:'right',lw:'left',lewo:'left',lt:'left',left:'left',pod:'up',podnies:'up',podnieś:'up',pu:'up',penup:'up',opu:'down',opusc:'down',opuść:'down',pd:'down',pendown:'down',kolor:'color',color:'color',grubosc:'width',grubość:'width',width:'width',powtorz:'repeat',powtórz:'repeat',repeat:'repeat',niech:'let',let:'let',jeśli:'if',jesli:'if',if:'if',jeżeli:'ifelse',jezeli:'ifelse',ifelse:'ifelse',stop:'stop',dom:'home',home:'home',czyść:'clear',czysc:'clear',cs:'clear',clearscreen:'clear',gora:'pitchup',góra:'pitchup',pitchup:'pitchup',dol:'pitchdown',dół:'pitchdown',pitchdown:'pitchdown',pp:'rollright',przechylprawo:'rollright',rr:'rollright',rollright:'rollright',pl:'rollleft',przechyllewo:'rollleft',rl:'rollleft',rollleft:'rollleft'
};
const nameRe=/^[\p{L}_][\p{L}\p{N}_]*$/u;
const fail=(t,message)=>{throw {message,line:t?.line||1,column:t?.col||1}};
function lex(src){
 if(src.length>50000) fail({line:1,col:1},'Program przekracza limit 50 000 znaków.');
 let a=[],i=0,line=1,col=1;
 while(i<src.length){let c=src[i]; if(c==='\n'){i++;line++;col=1;continue} if(/\s/.test(c)){i++;col++;continue} if(c===';'){while(i<src.length&&src[i]!=='\n'){i++;col++}continue}
 let start=i,l=line,p=col,m;
 if(c==='"'){i++;col++;while(i<src.length&&src[i]!=='"'&&src[i]!=='\n'){i++;col++}if(src[i]==='"'){i++;col++}}
 else if((m=src.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)/))){i+=m[0].length;col+=m[0].length; if(/[\p{L}_\d.]/u.test(src[i]||'')){while(i<src.length&&/[\p{L}\p{N}_.]/u.test(src[i])){i++;col++}}}
 else if((m=src.slice(i).match(/^:?[\p{L}_][\p{L}\p{N}_]*/u))){i+=m[0].length;col+=m[0].length}
 else {i++;col++;if((c==='<'||c==='>')&&(/[=>]/.test(src[i]||''))){i++;col++}}
 a.push({v:src.slice(start,i),line:l,col:p,start,end:i}); if(a.length>10000)fail(a.at(-1),'Przekroczono limit 10 000 tokenów.');
 } return a;
}
function parse(src,mode){
 const tokens=lex(src), defs=new Map(), main=[];
 // Collect whole-line procedure definitions before parsing calls.
 let bracketDepth=0;
 for(let i=0;i<tokens.length;){let t=tokens[i],v=t.v.toLowerCase();
  if(v==='oto'||v==='to'){
   if(bracketDepth)fail(t,'Definicja jest dozwolona tylko na górnym poziomie.');
   if(i>0&&tokens[i-1].line===t.line)fail(t,'Definicja musi zaczynać się na początku wiersza.');
   let header=[];i++;while(i<tokens.length&&tokens[i].line===t.line)header.push(tokens[i++]);
   let n=header.shift();if(!n||!nameRe.test(n.v)||aliases[n.v.toLowerCase()])fail(n||t,'Nieprawidłowa nazwa procedury.');let name=n.v.toLowerCase();if(defs.has(name))fail(n,'Procedura jest już zdefiniowana.');
   let params=[];if(header.length){if(header[0].v.toLowerCase()==='ma'&&header[1]?.v===':'){header.splice(0,2);let want=true;for(const h of header){if(want){if(!nameRe.test(h.v))fail(h,'Nieprawidłowy parametr.');params.push(h.v.toLowerCase());}else if(h.v!==',')fail(h,'Oczekiwano przecinka.');want=!want;}if(want)fail(header.at(-1),'Brakuje parametru.');}else {for(const h of header){if(!h.v.startsWith(':')||!nameRe.test(h.v.slice(1)))fail(h,'Nieprawidłowy parametr.');params.push(h.v.slice(1).toLowerCase())}}}
   if(new Set(params).size!==params.length)fail(n,'Powtórzony parametr.');let body=[];while(i<tokens.length&&!['już','juz','end'].includes(tokens[i].v.toLowerCase()))body.push(tokens[i++]);if(i===tokens.length)fail(t,'Brakuje zakończenia już.');let e=tokens[i++];if((tokens[i]&&tokens[i].line===e.line)||(body.at(-1)?.line===e.line))fail(e,'Zakończenie procedury musi być w osobnym wierszu.');defs.set(name,{name,params,t,raw:body});
  }else {if(t.v==='[')bracketDepth++;if(t.v===']')bracketDepth--;main.push(t);i++}
 }
 function parseBody(ts,proc){let i=0,depth=0;const declared=new Set(proc?.params||[]); // declarations gathered across branches
  for(let k=0;k<ts.length;k++)if(['niech','let'].includes(ts[k].v.toLowerCase())&&ts[k+1])declared.add(ts[k+1].v.toLowerCase());
  return {ts,declared,parse(global){
   function expr(min=0){let t=ts[i];if(!t)fail(ts.at(-1),'Brakuje argumentu.');let node;let v=t.v.toLowerCase();
    if(v==='+'||v==='-'){i++;node={type:'unary',op:v,x:expr(3),t};}
    else if(v==='('){i++;node=expr();if(ts[i]?.v!==')')fail(ts[i]||t,'Brakuje nawiasu zamykającego.');i++;}
    else if(/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(v)){i++;node={type:'number',value:Number(v),t};}
    else if(nameRe.test(v.replace(/^:/,''))){i++;let n=v.replace(/^:/,'');if(n==='nrpowt'||n==='repcount'){if(!depth)fail(t,'nrpowt działa tylko wewnątrz powtórzenia.');node={type:'count',t};}else {if(!declared.has(n)&&!global.has(n))fail(t,'Nieznana zmienna: '+n+'.');node={type:'var',name:n,t};}}
    else fail(t,'Oczekiwano wyrażenia.');
    while(i<ts.length){let op=ts[i],prec=(op.v==='+'||op.v==='-')?1:(op.v==='*'||op.v==='/')?2:0;if(!prec||prec<min)break;let left=op.start>0&&/\s/.test(src[op.start-1]),right=op.end<src.length&&/\s/.test(src[op.end]);if(left!==right)break;i++;node={type:'binary',op:op.v,a:node,b:expr(prec+1),t:node.t};}return node;
   }
   function body(level=0){if(level>32)fail(ts[i-1],'Przekroczono głębokość nawiasów.');let out=[];while(i<ts.length&&ts[i].v!==']'){let t=ts[i++],key=t.v.toLowerCase(),cmd=aliases[key];if(key==='oto'||key==='to')fail(t,'Definicja jest dozwolona tylko na górnym poziomie.');if(!cmd&&!defs.has(key))fail(t,'Nieznane polecenie: '+t.v+'.');let n={cmd:cmd||'call',t};
    if(['move','back','right','left','width','repeat','pitchup','pitchdown','rollright','rollleft'].includes(cmd)){n.arg=expr();if(['pitchup','pitchdown','rollright','rollleft'].includes(cmd)&&mode==='2d')fail(t,'To polecenie jest dostępne tylko w 3D.');}
    if(cmd==='color'){let c=ts[i++];if(!c||!/^"#[0-9a-f]{6}"$/i.test(c.v))fail(c||t,'Oczekiwano koloru, np. "#16866a".');n.color=c.v.slice(1,-1).toLowerCase()}
    if(cmd==='let'){let x=ts[i++];if(!x||!nameRe.test(x.v)||aliases[x.v.toLowerCase()]||defs.has(x.v.toLowerCase()))fail(x||t,'Nieprawidłowa nazwa zmiennej.');n.name=x.v.toLowerCase();n.arg=expr();}
    if(cmd==='if'||cmd==='ifelse'){n.a=expr();let cmp=ts[i++];if(!cmp||!['<','>','=','<=','>=','<>'].includes(cmp.v))fail(cmp||t,'Oczekiwano porównania.');n.cmp=cmp.v;n.b=expr();}
    if(cmd==='repeat'||cmd==='if'||cmd==='ifelse'){function bracket(){if(ts[i]?.v!=='[')fail(ts[i]||t,'Oczekiwano nawiasu [.');i++;if(cmd==='repeat')depth++;let b=body(level+1);if(cmd==='repeat')depth--;if(ts[i]?.v!==']')fail(ts[i]||t,'Brakuje nawiasu ].');i++;return b}n.body=bracket();if(cmd==='ifelse')n.other=bracket();}
    if(n.cmd==='call'){n.name=key;n.args=defs.get(key).params.map(()=>expr());}
    if((cmd==='width'||cmd==='repeat')&&!hasVar(n.arg)){try{let val=evaluate(n.arg,{},[],{});if(!Number.isInteger(val)||val<(cmd==='width'?1:0)||val>(cmd==='width'?12:10000))fail(n.arg.t,cmd==='width'?'Grubość musi być liczbą całkowitą od 1 do 12.':'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.');}catch(e){if(e.message?.includes('Dzielenie')||e.message?.includes('skończon')){}else throw e;}}
    out.push(n);
   }return out}let result=body();if(i<ts.length)fail(ts[i],'Nieoczekiwany nawias ].');return result;
  }};
 }
 let top=parseBody(main,null),global=top.declared;let program=top.parse(global);for(const d of defs.values()){let p=parseBody(d.raw,d);d.body=p.parse(global)}return {program,defs};
}
function hasVar(n){return n.type==='var'||n.type==='count'||(n.x&&hasVar(n.x))||(n.a&&(hasVar(n.a)||hasVar(n.b)))}
function evaluate(n,env,counts,global){let v;if(n.type==='number')v=n.value;else if(n.type==='count')v=counts.at(-1);else if(n.type==='var'){v=Object.hasOwn(env,n.name)?env[n.name]:global[n.name];if(v===undefined)fail(n.t,'Zmienna '+n.name+' nie ma jeszcze wartości.');}else if(n.type==='unary'){let x=evaluate(n.x,env,counts,global);v=n.op==='-'?-x:x}else {let a=evaluate(n.a,env,counts,global),b=evaluate(n.b,env,counts,global);if(n.op==='/'&&b===0)fail(n.t,'Dzielenie przez zero.');v=n.op==='+'?a+b:n.op==='-'?a-b:n.op==='*'?a*b:a/b;}if(!Number.isFinite(v))fail(n.t,'Wynik nie jest liczbą skończoną.');return v}
const add=(a,b,s=1)=>a.map((x,i)=>x+b[i]*s), scale=(a,s)=>a.map(x=>x*s);
export function createExecution(source,mode='2d'){
 let state={segments:[],pos:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],pen:true,color:'#16866a',width:3,line:0,done:false,error:null}, parsed;
 try{parsed=parse(source,mode)}catch(e){state.error=e;state.done=true;return {state,step:()=>state}};
 let ops=0,frames=0,global={},counts=[];
 const tick=t=>{if(++ops>10000)fail(t,'Przekroczono limit 10 000 operacji.')};
 function* block(nodes,env){for(const n of nodes){tick(n.t);state.line=n.t.line;yield;let val=()=>{try{return evaluate(n.arg,env,counts,global)}catch(e){if(n.arg?.t){e.line=n.arg.t.line;e.column=n.arg.t.col}throw e}};
  const rotate=(a,b,angle)=>{let c=Math.cos(angle*Math.PI/180),s=Math.sin(angle*Math.PI/180),x=state[a],y=state[b];state[a]=add(scale(x,c),y,s);state[b]=add(scale(y,c),x,-s)};
  const move=dest=>{if(dest.some(x=>!Number.isFinite(x)||Math.abs(x)>100000))fail(n.arg?.t||n.t,'Przekroczono limit współrzędnych.');if(state.pen&&dest.some((x,i)=>Math.abs(x-state.pos[i])>1e-12)){if(state.segments.length>=10000)fail(n.t,'Przekroczono limit odcinków.');state.segments.push({from:[...state.pos],to:[...dest],color:state.color,width:state.width})}state.pos=dest};
  switch(n.cmd){case 'move':case 'back':move(add(state.pos,state.heading,val()*(n.cmd==='back'?-1:1)));break;case 'right':rotate('heading','right',val());break;case 'left':rotate('heading','right',-val());break;case 'pitchup':rotate('heading','up',val());break;case 'pitchdown':rotate('heading','up',-val());break;case 'rollright':rotate('up','right',val());break;case 'rollleft':rotate('up','right',-val());break;case 'up':state.pen=false;break;case 'down':state.pen=true;break;case 'color':state.color=n.color;break;case 'width':{let x=val();if(!Number.isInteger(x)||x<1||x>12)fail(n.arg.t,'Grubość musi być liczbą całkowitą od 1 do 12.');state.width=x;break}case 'let':env[n.name]=val();break;case 'clear':state.segments=[];break;case 'home':move([0,0,0]);state.heading=[0,1,0];state.right=[1,0,0];state.up=[0,0,1];break;case 'stop':return true;
  case 'repeat':{let x=val();if(!Number.isInteger(x)||x<0||x>10000)fail(n.arg.t,'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.');if(++frames>32)fail(n.t,'Przekroczono limit zagnieżdżenia wywołań.');for(let j=1;j<=x;j++){counts.push(j);let stopped=yield* block(n.body,env);counts.pop();if(stopped){frames--;return true}tick(n.t)}frames--;break}
  case 'if':case 'ifelse':{let a=evaluate(n.a,env,counts,global),b=evaluate(n.b,env,counts,global),yes=({'<':()=>a<b,'>':()=>a>b,'=':()=>a===b,'<=':()=>a<=b,'>=':()=>a>=b,'<>':()=>a!==b})[n.cmp]();let chosen=yes?n.body:n.other;if(chosen){if(yield* block(chosen,env))return true;tick(n.t)}break}
  case 'call':{if(++frames>32)fail(n.t,'Przekroczono limit wywołań.');let d=parsed.defs.get(n.name),local={};for(let j=0;j<d.params.length;j++){try{local[d.params[j]]=evaluate(n.args[j],env,counts,global)}catch(e){e.line=n.args[j].t.line;e.column=n.args[j].t.col;throw e}}yield* block(d.body,local);frames--;tick(n.t);break}
  }
 }}
 let iterator=block(parsed.program,global);return {state,step(){if(state.done)return state;try{let x=iterator.next();if(x.done){state.done=true;state.line=0}}catch(e){state.error=e;state.done=true;state.line=0}return state}};
}
export function run(source,mode='2d'){let ex=createExecution(source,mode);while(!ex.state.done)ex.step();return {segments:ex.state.segments,error:ex.state.error}}
