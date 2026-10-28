export const ALIASES = {
 forward:'np naprzod naprzód fd forward', back:'ws wstecz bk back', right:'pw prawo rt right', left:'lw lewo lt left',
 penup:'pod podnies podnieś pu penup', pendown:'opu opusc opuść pd pendown', color:'kolor color', width:'grubosc grubość width',
 repeat:'powtorz powtórz repeat', let:'niech let', if:'jeśli jesli if', ifelse:'jeżeli jezeli ifelse', stop:'stop', home:'dom home', clear:'czyść czysc cs clearscreen',
 pitchup:'gora góra pitchup', pitchdown:'dol dół pitchdown', rollright:'pp przechylprawo rr rollright', rollleft:'pl przechyllewo rl rollleft',
 to:'oto to', end:'już juz end', repcount:'nrpowt repcount'
};
export const KEYWORDS = new Map(Object.entries(ALIASES).flatMap(([key, aliases])=>aliases.split(' ').map(a=>[a,key])));
class LogoError extends Error {
 constructor(message, token={line:1,column:1}) { super(message); this.line=token.line; this.column=token.column; }
}
const fail=(message,token)=>{throw new LogoError(message,token)};
const publicError=e=>({message:e.message,line:e.line||1,column:e.column||1});
export function tokenize(source) {
 if(source.length>50000){const before=source.slice(0,50000).split('\n');fail('Program przekracza limit 50 000 znaków.',{line:before.length,column:before.at(-1).length+1})}
 const tokens=[]; let i=0,line=1,column=1;
 const advance=()=>{const c=source[i++]; if(c==='\n'){line++;column=1}else column++; return c};
 while(i<source.length) {
  if(/\s/u.test(source[i])){advance();continue}
  if(source[i]===';'){while(i<source.length&&source[i]!=='\n')advance();continue}
  const start=i,t={line,column,start}; const c=source[i]; let type,value;
  if(/[0-9.]/.test(c)) {
   const match=source.slice(i).match(/^(?:\d+(?:\.\d+)?|\.\d+)/);
   if(!match)fail('Nieprawidłowa liczba.',t);
   value=match[0]; for(let j=0;j<value.length;j++)advance(); type='number';
   if(i<source.length&&/[\p{L}\p{N}_.]/u.test(source[i]))fail('Nieprawidłowa liczba. Użyj zapisu dziesiętnego, np. 12.5.',t);
  } else if(c==='"') {
   advance(); while(i<source.length&&source[i]!=='"'&&source[i]!=='\n')advance();
   if(source[i]!=='"')fail('Niezamknięty kolor. Użyj zapisu "#16866a".',t);
   advance();value=source.slice(start,i);type='string';
   if(!/^"#[0-9a-f]{6}"$/i.test(value))fail('Kolor musi mieć postać "#rrggbb", np. "#16866a".',t);
  } else if(/[\p{L}_]/u.test(c)||(c===':'&&/[\p{L}_]/u.test(source[i+1]||''))) {
   if(c===':')advance();
   while(i<source.length&&/[\p{L}\p{N}_]/u.test(source[i]))advance();
   value=source.slice(start,i).toLocaleLowerCase('pl');type='word';
   if(value[0]===':'){t.legacy=true;value=value.slice(1)}
  } else if('[](),:+-*/<>= '.includes(c)) {
   value=advance(); if('<>'.includes(c)&&source[i]==='=')value+=advance();else if(c==='<'&&source[i]==='>')value+=advance();type='symbol';
  } else fail(`Nieznany znak „${c}”.`,t);
  tokens.push({...t,type,value,end:i,leftSpace:start>0&&/\s/.test(source[start-1]),rightSpace:i<source.length&&/\s/.test(source[i])});
  if(tokens.length>10000)fail('Przekroczono limit 10 000 tokenów.',t);
 }
 return tokens;
}
const spatial=new Set(['pitchup','pitchdown','rollright','rollleft']);
const argCommands=new Set(['forward','back','right','left','width',...spatial]);
const nameValid=(t)=>t?.type==='word'&&!t.legacy&&!KEYWORDS.has(t.value);
export function parse(source,mode='2d') {
 if(!['2d','3d'].includes(mode))fail('Nieznany tryb. Wybierz 2D lub 3D.');
 const tokens=tokenize(source), procedures=new Map(),top=[];let bracketDepth=0,parenDepth=0;
 const lineAlone=t=>source.slice(source.lastIndexOf('\n',t.start-1)+1,t.start).trim()==='';
 for(let i=0;i<tokens.length;) {
  const t=tokens[i],kind=KEYWORDS.get(t.value);
  if(kind==='to') {
   if(bracketDepth||parenDepth||!lineAlone(t))fail('Definicja „oto” musi zaczynać osobny wiersz na poziomie głównym.',t);
   let j=i+1;while(j<tokens.length&&tokens[j].line===t.line)j++;
   const header=tokens.slice(i+1,j),name=header.shift();
   if(!nameValid(name))fail('Oczekiwano poprawnej nazwy procedury.',name||t);
   if(procedures.has(name.value))fail(`Procedura „${name.value}” jest już zdefiniowana.`,name);
   const params=[];
   if(header.length) {
    if(header[0].value==='ma'&&header[1]?.value===':') {
     header.splice(0,2);if(!header.length)fail('Po „ma:” podaj parametr.',name);
     while(header.length){const p=header.shift();if(p.type!=='word'||p.legacy||KEYWORDS.has(p.value))fail('Oczekiwano nazwy parametru.',p);params.push(p);if(header.length){const comma=header.shift();if(comma.value!==','||!header.length)fail('Parametry rozdziel przecinkami.',comma)}}
    } else {for(const p of header){if(p.type!=='word'||!p.legacy||KEYWORDS.has(p.value))fail('Użyj „ma: bok, kąt” albo „:bok :kąt”.',p);params.push(p)}}
   }
   const seen=new Set();for(const p of params){if(seen.has(p.value))fail('Powtórzona nazwa parametru.',p);seen.add(p.value)}
   const begin=j;while(j<tokens.length&&KEYWORDS.get(tokens[j].value)!=='end'){if(KEYWORDS.get(tokens[j].value)==='to')fail('Nie można definiować procedury wewnątrz procedury.',tokens[j]);j++}
   if(j===tokens.length)fail(`Brakuje „już” kończącego procedurę „${name.value}”.`,t);
   if(!lineAlone(tokens[j])||tokens[j+1]?.line===tokens[j].line)fail('„już” musi być samo w osobnym wierszu.',tokens[j]);
   procedures.set(name.value,{name:name.value,params:params.map(p=>p.value),tokens:tokens.slice(begin,j),token:t,locals:new Set()});i=j+1;
  } else {if(t.value==='[')bracketDepth++;if(t.value===']')bracketDepth--;if(t.value==='(')parenDepth++;if(t.value===')')parenDepth--;top.push(t);i++}
 }
 const globals=new Set(),references=[];
 const parseBody=(list,localSet,params=[])=>{
  let pos=0;const peek=()=>list[pos];const take=()=>list[pos++];
  const expr=(fallback,repeatDepth)=>{
   const values=[],operators=[];let expectOperand=true;let openCount=0;
   const reduce=()=>{const op=operators.pop();if(op.unary){const inner=values.pop();values.push({kind:'unary',op:op.value,inner,token:op})}else{const right=values.pop(),left=values.pop();values.push({kind:'binary',op:op.value,left,right,token:left.token})}};
   const unary=()=>{while(operators.at(-1)?.unary)reduce()};
   while(true){
    const t=peek();
    if(expectOperand){
     if(!t)fail('Brakuje argumentu.',fallback);
     if(t.value==='+'||t.value==='-'){take();operators.push({...t,unary:true});continue}
     if(t.value==='('){take();operators.push(t);openCount++;continue}
     let node;
     if(t.type==='number'){take();node={kind:'number',value:Number(t.value),token:t}}
     else if(t.type==='word'&&(KEYWORDS.get(t.value)==='repcount'||!KEYWORDS.has(t.value))){
      take();if(KEYWORDS.get(t.value)==='repcount'){if(!repeatDepth)fail('„nrpowt” jest dostępne tylko wewnątrz powtórzenia.',t);node={kind:'repcount',token:t}}
      else{node={kind:'name',name:t.value,token:t};references.push({node,localSet,params})}
     }else fail('Oczekiwano wyrażenia liczbowego.',t);
     values.push(node);unary();expectOperand=false;
    }else{
     if(t?.value===')'&&openCount){while(operators.at(-1)?.value!=='(')reduce();const opening=operators.pop();take();openCount--;const node=values.pop();values.push({...node,token:opening});unary();continue}
     if(t&&['+','-','*','/'].includes(t.value)&&t.leftSpace===t.rightSpace){
      const precedence=['*','/'].includes(t.value)?2:1;
      while(operators.length&&operators.at(-1).value!=='('&&operators.at(-1).precedence>=precedence)reduce();
      operators.push({...take(),precedence});expectOperand=true;continue;
     }
     if(openCount)fail('Brakuje zamykającego nawiasu „)”.',t||operators.findLast(o=>o.value==='('));
     break;
    }
   }
   while(operators.length)reduce();return values[0];
  };
  const body=(depth=0,repeatDepth=0,opening=null)=>{
   const nodes=[];
   const block=(rd)=>{const t=peek();if(t?.value!=='[')fail('Oczekiwano „[” rozpoczynającego blok.',t||nodes.at(-1)?.token||opening||list.at(-1));take();if(depth+1>32)fail('Przekroczono limit 32 poziomów nawiasów.',t);return body(depth+1,rd,t)};
   while(pos<list.length) {
    const t=take();if(t.value===']'){if(!opening)fail('Nadmiarowy nawias „]”.',t);return nodes}
    if(t.type!=='word'||t.legacy)fail(`Nieoczekiwana wartość „${t.value}”. W tym miejscu podaj polecenie.`,t);
    const kind=KEYWORDS.get(t.value);const node={kind,token:t};nodes.push(node);
    if(spatial.has(kind)&&mode==='2d')fail('To polecenie działa tylko w trybie 3D.',t);
    if(argCommands.has(kind)){node.arg=expr(t,repeatDepth);if(kind==='width')validateLiteral(node.arg,'width')}
    else if(['penup','pendown','stop','home','clear'].includes(kind)){}
    else if(kind==='color'){const color=take();if(color?.type!=='string')fail('Oczekiwano koloru w postaci "#rrggbb".',color||t);node.color=color.value.slice(1,-1).toLowerCase()}
    else if(kind==='let'){
     const name=take();if(!nameValid(name)||(procedures.has(name.value)&&!params.includes(name.value)))fail('Nieprawidłowa nazwa zmiennej lub nazwa zajęta przez procedurę.',name||t);
     node.name=name.value;localSet.add(name.value);node.arg=expr(t,repeatDepth);
    } else if(kind==='repeat'){node.arg=expr(t,repeatDepth);validateLiteral(node.arg,'repeat');node.body=block(repeatDepth+1)}
    else if(kind==='if'||kind==='ifelse'){
     node.left=expr(t,repeatDepth);const comp=take();if(!['<','>','=','<=','>=','<>'].includes(comp?.value))fail('Oczekiwano porównania: <, >, =, <=, >= lub <>.',comp||t);node.op=comp.value;node.right=expr(t,repeatDepth);node.body=block(repeatDepth);if(kind==='ifelse')node.other=block(repeatDepth);
    } else if(procedures.has(t.value)){node.kind='call';node.name=t.value;node.args=procedures.get(t.value).params.map(()=>expr(t,repeatDepth))}
    else if(kind==='to'||kind==='end')fail('Definicje procedur są dozwolone tylko na poziomie głównym.',t);
    else fail(`Nieznane polecenie „${t.value}”.`,t);
   }
   if(opening)fail('Brakuje zamykającego nawiasu „]”.',opening);
   return nodes;
  };
  return body();
 };
 const body=parseBody(top,globals);
 for(const p of procedures.values())p.body=parseBody(p.tokens,p.locals,p.params);
 for(const {node,localSet,params} of references)if(!localSet.has(node.name)&&!params.includes(node.name)&&!globals.has(node.name))fail(`Nieznana zmienna „${node.name}”. Zadeklaruj ją poleceniem „niech”.`,node.token);
 return {body,procedures,globals};
}
const containsName=e=>{const stack=[e];while(stack.length){const n=stack.pop();if(n.kind==='name'||n.kind==='repcount')return true;if(n.inner)stack.push(n.inner);if(n.left)stack.push(n.left,n.right)}return false};
function validateRange(value,kind,token){
 if(kind==='width'&&(!Number.isInteger(value)||value<1||value>12))fail('Grubość musi być liczbą całkowitą od 1 do 12.',token);
 if(kind==='repeat'&&(!Number.isInteger(value)||value<0||value>10000))fail('Liczba powtórzeń musi być całkowita, od 0 do 10 000.',token);
}
function validateLiteral(e,kind){if(!containsName(e)){let v;try{v=evaluate(e,{},e.token)}catch{return}validateRange(v,kind,e.token)}}
function evaluate(e,ctx,root=e.token){
 const stack=[{node:e,ready:false}],values=[];
 while(stack.length){const {node:n,ready}=stack.pop();let v;
  if(!ready&&(n.kind==='unary'||n.kind==='binary')){stack.push({node:n,ready:true});if(n.kind==='unary')stack.push({node:n.inner,ready:false});else stack.push({node:n.right,ready:false},{node:n.left,ready:false});continue}
  switch(n.kind){
   case 'number':v=n.value;break;
   case 'name':if(ctx.local&&Object.hasOwn(ctx.local,n.name))v=ctx.local[n.name];else if(ctx.global&&Object.hasOwn(ctx.global,n.name))v=ctx.global[n.name];else fail(`Zmienna „${n.name}” nie ma jeszcze wartości.`,root);break;
   case 'repcount':v=ctx.reps.at(-1);break;
   case 'unary':v=(n.op==='-'?-1:1)*values.pop();break;
   case 'binary':{const b=values.pop(),a=values.pop();if(n.op==='/'&&b===0)fail('Nie można dzielić przez zero.',root);v=n.op==='+'?a+b:n.op==='-'?a-b:n.op==='*'?a*b:a/b;break;}
  }
  if(!Number.isFinite(v))fail('Wynik wyrażenia nie jest skończoną liczbą.',root);values.push(v);
 }
 return values[0];
}
const add=(a,b)=>a.map((v,i)=>v+b[i]);const mul=(a,k)=>a.map(v=>v*k);
const normalize=a=>mul(a,1/Math.hypot(...a));
const initial=()=>({position:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],pen:true,color:'#16866a',width:3});
export class Execution {
 constructor(source,mode='2d'){
  this.segments=[];this.turtle=initial();this.error=null;this.done=false;this.operations=0;this.frames=0;this.current=null;
  try{this.ast=parse(source,mode);this.iterator=this.program()}catch(e){this.error=publicError(e);this.done=true}
 }
 *operation(token){if(++this.operations>10000)fail('Przekroczono limit 10 000 operacji.',token);this.current=token}
 enter(token){if(++this.frames>32)fail('Przekroczono limit 32 aktywnych wywołań i powtórzeń.',token)}
 move(position,token){
  if(position.some(x=>!Number.isFinite(x)||Math.abs(x)>100000))fail('Współrzędne muszą mieścić się w granicach ±100 000.',token);
  if(this.turtle.pen&&position.some((x,i)=>x!==this.turtle.position[i])){if(this.segments.length>=10000)fail('Przekroczono limit 10 000 odcinków.',token);this.segments.push({from:[...this.turtle.position],to:[...position],color:this.turtle.color,width:this.turtle.width})}
  this.turtle.position=position;
 }
 rotate(kind,angle){
  const t=this.turtle,c=Math.cos(angle*Math.PI/180),s=Math.sin(angle*Math.PI/180);
  if(kind==='right'||kind==='left'){const h=t.heading,r=t.right;t.heading=normalize(add(mul(h,c),mul(r,s)));t.right=normalize(add(mul(r,c),mul(h,-s)))}
  else if(kind==='pitchup'||kind==='pitchdown'){const h=t.heading,u=t.up;t.heading=normalize(add(mul(h,c),mul(u,s)));t.up=normalize(add(mul(u,c),mul(h,-s)))}
  else {const u=t.up,r=t.right;t.up=normalize(add(mul(u,c),mul(r,s)));t.right=normalize(add(mul(r,c),mul(u,-s)))}
 }
 *list(nodes,ctx){
  for(const n of nodes){
   // Reserve the operation before its effects, and yield afterwards for single stepping.
   if(++this.operations>10000)fail('Przekroczono limit 10 000 operacji.',n.token);this.current=n.token;
   const value=()=>evaluate(n.arg,ctx),t=this.turtle;
   switch(n.kind){
    case 'forward':case 'back':this.move(add(t.position,mul(t.heading,value()*(n.kind==='back'?-1:1))),n.arg.token);break;
    case 'right':case 'left':case 'pitchup':case 'pitchdown':case 'rollright':case 'rollleft':this.rotate(n.kind,value()*(['left','pitchdown','rollleft'].includes(n.kind)?-1:1));break;
    case 'penup':t.pen=false;break;case 'pendown':t.pen=true;break;case 'color':t.color=n.color;break;
    case 'width':{const v=value();validateRange(v,'width',n.arg.token);t.width=v;break}
    case 'let':(ctx.local||ctx.global)[n.name]=value();break;
    case 'home':this.move([0,0,0],n.token);t.heading=[0,1,0];t.right=[1,0,0];t.up=[0,0,1];break;
    case 'clear':this.segments.length=0;break;
    case 'stop':yield n.token;return true;
    case 'repeat':{
     const count=value();validateRange(count,'repeat',n.arg.token);this.enter(n.token);yield n.token;
     for(let i=1;i<=count;i++){ctx.reps.push(i);const stop=yield* this.list(n.body,ctx);ctx.reps.pop();if(stop){this.frames--;return true}yield* this.operation(n.token)}this.frames--;continue;
    }
    case 'if':case 'ifelse':{
     const a=evaluate(n.left,ctx),b=evaluate(n.right,ctx);const yes=n.op==='<'?a<b:n.op==='>'?a>b:n.op==='='?a===b:n.op==='<='?a<=b:n.op==='>='?a>=b:a!==b;
     yield n.token;const branch=yes?n.body:n.other;if(branch){if(yield* this.list(branch,ctx))return true;yield* this.operation(n.token)}continue;
    }
    case 'call':{
     const p=this.ast.procedures.get(n.name),local=Object.create(null);n.args.forEach((a,i)=>local[p.params[i]]=evaluate(a,ctx));this.enter(n.token);yield n.token;
     yield* this.list(p.body,{global:ctx.global,local,reps:[]});this.frames--;yield* this.operation(n.token);continue;
    }
   }
   yield n.token;
  }
  return false;
 }
 *program(){yield* this.list(this.ast.body,{global:Object.create(null),local:null,reps:[]})}
 step(){if(this.done)return false;try{const next=this.iterator.next();this.done=next.done;return !this.done}catch(e){this.error=publicError(e);this.done=true;return false}}
 finish(){while(!this.done)this.step();return this.result()}
 result(){return {segments:this.segments,error:this.error}}
}
export function run(source,mode='2d'){return new Execution(source,mode).finish()}
