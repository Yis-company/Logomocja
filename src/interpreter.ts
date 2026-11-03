export type Mode = '2d' | '3d';
export type Vec = [number, number, number];
export type Segment = { from: Vec; to: Vec; color: string; width: number };
export type LogoError = { message: string; line: number; column: number };
export type Result = { segments: Segment[]; error: LogoError | null };
export type Token = { kind: string; value: string; start: number; end: number; line: number; column: number; binary?: boolean; legacy?: boolean };
class Fault extends Error {
  info: LogoError;
  constructor(message: string, token: Pick<Token, 'line' | 'column'>) { super(message); this.info = { message, line: token.line, column: token.column }; }
}
export const aliases: Record<string, string> = Object.create(null);
const groups: Record<string, string[]> = {
  fd: ['np','naprzod','naprzód','fd','forward'], bk: ['ws','wstecz','bk','back'], rt: ['pw','prawo','rt','right'], lt: ['lw','lewo','lt','left'],
  pu: ['pod','podnies','podnieś','pu','penup'], pd: ['opu','opusc','opuść','pd','pendown'], color: ['kolor','color'], width: ['grubosc','grubość','width'],
  repeat: ['powtorz','powtórz','repeat'], let: ['niech','let'], if: ['jeśli','jesli','if'], ifelse: ['jeżeli','jezeli','ifelse'], stop: ['stop'], home: ['dom','home'], cs: ['czyść','czysc','cs','clearscreen'],
  pitchup: ['gora','góra','pitchup'], pitchdown: ['dol','dół','pitchdown'], rollright: ['pp','przechylprawo','rr','rollright'], rollleft: ['pl','przechyllewo','rl','rollleft'],
  to: ['oto','to'], end: ['już','juz','end'], repcount: ['nrpowt','repcount'],
};
for (const [command, words] of Object.entries(groups)) for (const word of words) aliases[word] = command;
const letter = /[\p{L}_]/u;
const nameChar = /[\p{L}\p{N}_]/u;
export function tokenize(source: string): Token[] {
  if (source.length > 50000) throw new Fault('Program przekracza limit 50 000 znaków.', {line:1,column:1});
  const tokens: Token[] = []; let i=0, line=1, column=1;
  const advance = () => { if (source[i++] === '\n') { line++; column=1; } else column++; };
  const add = (kind:string, start:number, l:number, c:number, value?:string, legacy=false) => {
    const token:Token = {kind, value:value ?? source.slice(start,i).toLowerCase(),start,end:i,line:l,column:c,legacy};
    if (kind==='op') token.binary = /\s/.test(source[start-1] || '') === /\s/.test(source[i] || '');
    tokens.push(token); if (tokens.length>10000) throw new Fault('Program przekracza limit 10 000 tokenów.',token);
  };
  while(i<source.length) {
    if (/\s/.test(source[i])) {advance();continue;}
    if(source[i]===';') {while(i<source.length && source[i]!=='\n') advance();continue;}
    const start=i,l=line,c=column, ch=source[i];
    if (/\d/.test(ch) || ch==='.' && /\d/.test(source[i+1]||'')) {
      const match=source.slice(i).match(/^(?:\d+(?:\.\d+)?|\.\d+)/)![0]; for(let n=0;n<match.length;n++) advance();
      if(i<source.length && (nameChar.test(source[i]) || source[i]==='.')) throw new Fault('Niepoprawna liczba. Użyj zapisu dziesiętnego, np. 12.5.',{line:l,column:c});
      add('number',start,l,c);continue;
    }
    if(ch==='"') { advance(); while(i<source.length && source[i]!=='"' && source[i]!=='\n') advance(); if(source[i]!=='"') throw new Fault('Brakuje zamykającego cudzysłowu koloru.',{line:l,column:c});advance();add('string',start,l,c);continue; }
    if(letter.test(ch) || ch===':' && letter.test(source[i+1]||'')) {
      const legacy=ch===':'; if(legacy) advance(); const ns=i; while(i<source.length&&nameChar.test(source[i])) advance();
      const name=source.slice(ns,i).toLowerCase();
      if(name==='ma' && source[i]===':' && !legacy) {advance();add('header',start,l,c,'ma:');} else add('name',start,l,c,name,legacy);
      continue;
    }
    if('+-*/'.includes(ch)) {advance();add('op',start,l,c);continue;}
    if('<>='.includes(ch)) {advance();if((ch==='<'&&['=','>'].includes(source[i])) || ch==='>'&&source[i]==='=')advance();add('compare',start,l,c);continue;}
    if('[](),'.includes(ch)) {advance();add(ch,start,l,c);continue;}
    throw new Fault(`Nieznany znak „${ch}”.`,{line:l,column:c});
  }
  tokens.push({kind:'eof',value:'',start:i,end:i,line,column}); return tokens;
}
type Expr = { type:'number'|'name'|'repcount'|'unary'|'binary'; token:Token; value?:number|string; op?:string; left?:Expr; right?:Expr };
type Node = { command:string; token:Token; args:Expr[]; name?:string; color?:string; body?:Node[]; otherwise?:Node[]; comparison?:string };
type Procedure = {name:string; params:string[]; tokens:Token[]; token:Token; locals:Set<string>; body:Node[]};
export type Program = {body:Node[]; procedures:Map<string,Procedure>; globals:Set<string>; mode:Mode};
function error(message:string,token:Token):never {throw new Fault(message,token);}
function isReserved(name:string) {return Object.hasOwn(aliases,name);}
function syntheticEnd(token:Token):Token {return {...token,kind:'eof',value:''};}
function declared(tokens:Token[]):Set<string> {
  const set=new Set<string>(); for(let i=0;i<tokens.length-1;i++) if(aliases[tokens[i].value]==='let'&&tokens[i+1].kind==='name') set.add(tokens[i+1].value);return set;
}
export function parse(source:string,mode:Mode='2d'):Program {
  const tokens=tokenize(source), top:Token[]=[], procedures=new Map<string,Procedure>();let depth=0;
  const startsLine=(t:Token)=>source.slice(source.lastIndexOf('\n',t.start-1)+1,t.start).trim()==='';
  for(let i=0;i<tokens.length-1;) {
    const t=tokens[i], command=aliases[t.value];
    if(command==='to') {
      if(depth!==0) error('Procedurę można zdefiniować tylko na najwyższym poziomie.',t);
      if(!startsLine(t)) error('Definicja „oto” musi zaczynać wiersz.',t);
      let j=i+1; const header:Token[]=[];while(j<tokens.length-1&&tokens[j].line===t.line)header.push(tokens[j++]);
      const n=header.shift();if(!n||n.kind!=='name'||n.legacy||isReserved(n.value))error('Podaj poprawną nazwę procedury po „oto”.',n||t);
      if(procedures.has(n.value))error(`Procedura „${n.value}” jest już zdefiniowana.`,n);
      const params:string[]=[];
      const param=(p:Token|undefined) => {if(!p||p.kind!=='name'||isReserved(p.value))error('Oczekiwano nazwy parametru.',p||n);if(params.includes(p.value))error(`Parametr „${p.value}” występuje dwa razy.`,p);params.push(p.value);};
      if(header[0]?.kind==='header') {header.shift();if(!header.length)error('Po „ma:” podaj przynajmniej jeden parametr.',n);while(header.length){param(header.shift());if(header.length){const comma=header.shift()!;if(comma.kind!==',')error('Oddziel parametry przecinkami.',comma);if(!header.length)error('Po przecinku podaj parametr.',comma);}}}
      else for(const p of header){if(!p.legacy)error('Użyj nagłówka „ma: nazwa, nazwa” lub parametrów „:nazwa”.',p);param(p);}
      const body:Token[]=[]; let end:Token|undefined;
      while(j<tokens.length-1){const b=tokens[j];if(aliases[b.value]==='to')error('Nie można definiować procedury wewnątrz procedury.',b);
        if(aliases[b.value]==='end'){if(!startsLine(b)||tokens[j+1]?.kind!=='eof'&&tokens[j+1]?.line===b.line)error('„już” musi być samo w swoim wierszu.',b);end=b;j++;break;}body.push(b);j++;}
      if(!end)error(`Brakuje „już” kończącego procedurę „${n.value}”.`,t);
      body.push(syntheticEnd(end)); procedures.set(n.value,{name:n.value,params,tokens:body,token:t,locals:declared(body),body:[]});i=j;continue;
    }
    if(command==='end')error('„już” bez definicji procedury.',t);
    if(t.kind==='[')depth++;if(t.kind===']')depth--;top.push(t);i++;
  }
  top.push(tokens[tokens.length-1]);const globals=declared(top);
  const program:Program={body:[],procedures,globals,mode};
  for(const p of procedures.values())p.body=new Parser(p.tokens,program,p).body(0,0,false);
  program.body=new Parser(top,program).body(0,0,false);return program;
}
class Parser {
  i=0;
  constructor(private tokens:Token[], private program:Program, private proc?:Procedure){}
  get current(){return this.tokens[this.i]||this.tokens[this.tokens.length-1];}
  take(){const t=this.current;this.i++;return t;}
  argument(command:Token,repeatDepth:number):Expr {
    if(this.current.kind==='eof')error('Brakuje argumentu polecenia.',command);
    return this.expression(repeatDepth,0,command);
  }
  expression(repeatDepth:number,_minimum=0,fallback=this.current):Expr {
    const values:Expr[]=[], operators:{token:Token;unary:boolean;group:boolean}[]=[];
    let operand=true,groups=0;
    const precedence=(op:{token:Token;unary:boolean})=>op.unary?3:['*','/'].includes(op.token.value)?2:1;
    const reduce=()=>{const op=operators.pop()!,right=values.pop()!;if(op.unary)values.push({type:'unary',op:op.token.value,right,token:op.token});else {const left=values.pop()!;values.push({type:'binary',op:op.token.value,left,right,token:left.token});}};
    while(true){
      const t=this.current;
      if(operand){
        if(t.kind==='op'&&['+','-'].includes(t.value)){this.take();operators.push({token:t,unary:true,group:false});continue;}
        if(t.kind==='('){this.take();operators.push({token:t,unary:false,group:true});groups++;continue;}
        let expr:Expr;
        if(t.kind==='number')expr={type:'number',value:Number(t.value),token:t};
        else if(t.kind==='name'&&aliases[t.value]==='repcount'){if(!repeatDepth)error('„nrpowt” działa tylko w leksykalnym wnętrzu „powtorz”.',t);expr={type:'repcount',token:t};}
        else if(t.kind==='name'&&(this.proc?.params.includes(t.value)||this.proc?.locals.has(t.value)||this.program.globals.has(t.value)))expr={type:'name',value:t.value,token:t};
        else if(t.kind==='name'&&!isReserved(t.value)&&!this.program.procedures.has(t.value))error(`Nieznana zmienna „${t.value}”. Zadeklaruj ją poleceniem „niech”.`,t);
        else error('Oczekiwano liczby, zmiennej lub wyrażenia.',t.kind==='eof'?fallback:t);
        this.take();values.push(expr);operand=false;
      }else if(t.kind==='op'&&t.binary){
        const incoming={token:t,unary:false,group:false};
        while(operators.length&&!operators.at(-1)!.group&&precedence(operators.at(-1)!)>=precedence(incoming))reduce();
        this.take();operators.push(incoming);operand=true;
      }else if(t.kind===')'&&groups){
        while(!operators.at(-1)!.group)reduce();const open=operators.pop()!;values[values.length-1]={...values.at(-1)!,token:open.token};this.take();groups--;
      }else break;
    }
    if(groups){const open=[...operators].reverse().find(op=>op.group)!;error('Brakuje zamykającego nawiasu „)”.',this.current.kind==='eof'?open.token:this.current);}
    while(operators.length)reduce();return values[0];
  }
  block(depth:number,repeatDepth:number,command:Token):Node[]{
    if(this.current.kind!=='[')error('Oczekiwano „[” rozpoczynającego blok.',this.current.kind==='eof'?command:this.current);
    const t=this.take();if(depth>=32)error('Przekroczono limit 32 poziomów nawiasów kwadratowych.',t);
    return this.body(depth+1,repeatDepth,true);
  }
  body(depth:number,repeatDepth:number,closing:boolean):Node[]{
    const out:Node[]=[];
    while(this.current.kind!=='eof') {
      if(this.current.kind===']'){if(!closing)error('Nadmiarowy nawias „]”.',this.current);this.take();return out;}
      const t=this.take();if(t.kind!=='name'||t.legacy)error('W tym miejscu oczekiwano polecenia.',t);
      const c=aliases[t.value] || (this.program.procedures.has(t.value)?'call':'');if(!c)error(`Nieznane polecenie „${t.value}”.`,t);
      const node:Node={command:c,token:t,args:[]};
      if(['fd','bk','rt','lt','width','pitchup','pitchdown','rollright','rollleft'].includes(c)){
        if(this.program.mode==='2d'&&['pitchup','pitchdown','rollright','rollleft'].includes(c))error('To polecenie przestrzenne. Przełącz studio na tryb 3D.',t);
        node.args=[this.argument(t,repeatDepth)];if(c==='width')checkLiteral(node.args[0],'width');
      }else if(c==='color'){
        const v=this.current;if(v.kind!=='string'||!/^"#[\da-f]{6}"$/i.test(v.value))error('Kolor musi mieć postać „"#16866a"” — sześć cyfr szesnastkowych.',v.kind==='eof'?t:v);this.take();node.color=v.value.slice(1,-1).toLowerCase();
      }else if(c==='let'){
        const n=this.current;if(n.kind!=='name'||n.legacy||isReserved(n.value)||this.program.procedures.has(n.value)&&!this.proc?.params.includes(n.value))error('Podaj nazwę zmiennej, która nie jest poleceniem ani procedurą.',n.kind==='eof'?t:n);this.take();node.name=n.value;node.args=[this.argument(t,repeatDepth)];
      }else if(c==='repeat'){
        node.args=[this.argument(t,repeatDepth)];checkLiteral(node.args[0],'repeat');node.body=this.block(depth,repeatDepth+1,t);
      }else if(c==='if'||c==='ifelse'){
        node.args.push(this.argument(t,repeatDepth));const cmp=this.current;if(cmp.kind!=='compare')error('Warunek wymaga porównania: <, >, =, <=, >= lub <>.',cmp.kind==='eof'?t:cmp);this.take();node.comparison=cmp.value;node.args.push(this.argument(t,repeatDepth));node.body=this.block(depth,repeatDepth,t);if(c==='ifelse')node.otherwise=this.block(depth,repeatDepth,t);
      }else if(c==='call'){
        node.name=t.value;for(const _ of this.program.procedures.get(t.value)!.params)node.args.push(this.argument(t,repeatDepth));
      }else if(!['pu','pd','home','cs','stop'].includes(c))error('To słowo nie jest poleceniem w tym miejscu.',t);
      out.push(node);
    }
    if(closing)error('Brakuje nawiasu „]” zamykającego blok.',this.current);return out;
  }
}
function hasName(expr:Expr):boolean {const pending=[expr];while(pending.length){const e=pending.pop()!;if(e.type==='name'||e.type==='repcount')return true;if(e.left)pending.push(e.left);if(e.right)pending.push(e.right);}return false;}
function finite(n:number,token:Token):number {if(!Number.isFinite(n))error('Wynik wyrażenia nie jest skończoną liczbą.',token);return n;}
function evaluate(expr:Expr,lookup:(name:string)=>number,count:number|undefined,argument=expr.token):number {
  const pending:{node:Expr;visited:boolean}[]=[{node:expr,visited:false}],values:number[]=[];
  while(pending.length){const {node:e,visited}=pending.pop()!;
    if(!visited&&(e.type==='unary'||e.type==='binary')){pending.push({node:e,visited:true});pending.push({node:e.right!,visited:false});if(e.left)pending.push({node:e.left,visited:false});continue;}
    let value:number;
    if(e.type==='number')value=e.value as number;
    else if(e.type==='name')value=lookup(e.value as string);
    else if(e.type==='repcount'){if(count===undefined)error('Brak aktywnego powtórzenia.',argument);value=count;}
    else if(e.type==='unary')value=(e.op==='-'?-1:1)*values.pop()!;
    else {const b=values.pop()!,a=values.pop()!;if(e.op==='/'&&b===0)error('Nie można dzielić przez zero.',argument);value=e.op==='+'?a+b:e.op==='-'?a-b:e.op==='*'?a*b:a/b;}
    values.push(finite(value,argument));
  }
  return values[0];
}
function validateRange(n:number,kind:'repeat'|'width',token:Token){if(!Number.isInteger(n)||n<(kind==='width'?1:0)||n>(kind==='width'?12:10000))error(kind==='width'?'Grubość musi być liczbą całkowitą od 1 do 12.':'Liczba powtórzeń musi być całkowita, od 0 do 10 000.',token);}
function checkLiteral(e:Expr,kind:'repeat'|'width'){
  if(hasName(e))return;
  try{validateRange(evaluate(e,()=>0,undefined),kind,e.token);}catch(err){if(err instanceof Fault && (err.message.includes('dzielić')||err.message.includes('skończoną')))return;throw err;}
}
export type Turtle = {position:Vec;heading:Vec;right:Vec;up:Vec;pen:boolean;color:string;width:number};
export function initialTurtle():Turtle{return {position:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],pen:true,color:'#16866a',width:3};}
const add=(a:Vec,b:Vec,k=1):Vec=>a.map((v,i)=>v+b[i]*k) as Vec;
const mix=(a:Vec,b:Vec,c:number,s:number):Vec=>a.map((v,i)=>v*c+b[i]*s) as Vec;
const unit=(v:Vec):Vec=>{const length=Math.hypot(...v);return v.map(x=>x/length) as Vec;};
export class Machine {
  segments:Segment[]=[]; error:LogoError|null=null; turtle=initialTurtle(); operations=0; done=false; current:Token|null=null;
  private globals=new Map<string,number>(); private frames=0; private iterator:Generator<Token,void>;
  constructor(readonly program:Program){this.iterator=this.execute();}
  private operation(token:Token){if(++this.operations>10000)error('Przekroczono limit 10 000 wykonanych operacji.',token);}
  private enter(token:Token){if(this.frames>=32)error('Przekroczono limit 32 aktywnych wywołań i powtórzeń.',token);this.frames++;}
  private value(expr:Expr,local:Map<string,number>|null,count?:number){return evaluate(expr,name=>{if(local?.has(name))return local.get(name)!;if(this.globals.has(name))return this.globals.get(name)!;error(`Zmienna „${name}” nie ma jeszcze wartości. Przypisz ją poleceniem „niech”.`,expr.token);},count);}
  private move(position:Vec,token:Token){
    if(position.some(n=>!Number.isFinite(n)||Math.abs(n)>100000))error('Współrzędna przekracza zakres od −100 000 do 100 000.',token);
    const from=this.turtle.position;if(this.turtle.pen&&position.some((v,i)=>v!==from[i])){if(this.segments.length>=10000)error('Przekroczono limit 10 000 zachowanych odcinków.',token);this.segments.push({from:[...from],to:[...position],color:this.turtle.color,width:this.turtle.width});}this.turtle.position=position;
  }
  private *execute():Generator<Token,void>{try{yield* this.body(this.program.body,null,undefined);}catch(e){if(e!==STOP)throw e;}}
  private *body(nodes:Node[],local:Map<string,number>|null,count:number|undefined):Generator<Token,void>{
    for(const n of nodes){this.current=n.token;this.operation(n.token);const c=n.command;const arg=()=>this.value(n.args[0],local,count);
      if(c==='repeat'){
        const times=arg();validateRange(times,'repeat',n.args[0].token);this.enter(n.token);yield n.token;
        try{for(let i=1;i<=times;i++){yield* this.body(n.body!,local,i);this.operation(n.token);}}finally{this.frames--;}continue;
      }
      if(c==='if'||c==='ifelse'){
        const a=arg(),b=this.value(n.args[1],local,count),op=n.comparison;const yes=op==='<'?a<b:op==='>'?a>b:op==='='?a===b:op==='<='?a<=b:op==='>='?a>=b:a!==b;
        yield n.token;if(yes||n.otherwise){yield* this.body(yes?n.body!:n.otherwise!,local,count);this.operation(n.token);}continue;
      }
      if(c==='call'){
        const p=this.program.procedures.get(n.name!)!,values=n.args.map(e=>this.value(e,local,count)),scope=new Map(p.params.map((name,i)=>[name,values[i]]));
        this.enter(n.token);yield n.token;try{yield* this.body(p.body,scope,undefined);}catch(e){if(e!==STOP)throw e;}finally{this.frames--;}this.operation(n.token);continue;
      }
      if(c==='stop'){yield n.token;throw STOP;}
      if(c==='let')(local||this.globals).set(n.name!,arg());
      else if(c==='fd'||c==='bk'){const d=arg()*(c==='bk'?-1:1);this.move(add(this.turtle.position,this.turtle.heading,d),n.args[0].token);}
      else if(['rt','lt','pitchup','pitchdown','rollright','rollleft'].includes(c)){
        const angle=arg()%360*Math.PI/180*(c==='lt'||c==='pitchdown'||c==='rollleft'?-1:1),co=Math.cos(angle),si=Math.sin(angle),t=this.turtle;
        if(c==='rt'||c==='lt'){const h=t.heading,r=t.right;t.heading=unit(mix(h,r,co,si));t.right=unit(mix(r,h,co,-si));}
        else if(c==='pitchup'||c==='pitchdown'){const h=t.heading,u=t.up;t.heading=unit(mix(h,u,co,si));t.up=unit(mix(u,h,co,-si));}
        else {const u=t.up,r=t.right;t.up=unit(mix(u,r,co,si));t.right=unit(mix(r,u,co,-si));}
      }else if(c==='pu')this.turtle.pen=false;
      else if(c==='pd')this.turtle.pen=true;
      else if(c==='color')this.turtle.color=n.color!;
      else if(c==='width'){const width=arg();validateRange(width,'width',n.args[0].token);this.turtle.width=width;}
      else if(c==='cs')this.segments=[];
      else if(c==='home'){this.move([0,0,0],n.token);Object.assign(this.turtle,{heading:[0,1,0],right:[1,0,0],up:[0,0,1]});}
      yield n.token;
    }
  }
  step():boolean {
    if(this.done)return false;try{const next=this.iterator.next();this.done=!!next.done;if(!next.done)this.current=next.value;return !this.done;}catch(err){this.error=err instanceof Fault?err.info:{message:'Nie udało się wykonać programu.',line:this.current?.line||1,column:this.current?.column||1};this.done=true;return false;}
  }
  finish():Result{while(!this.done)this.step();return {segments:this.segments,error:this.error};}
}
const STOP=Symbol('stop');
export function compile(source:string,mode:Mode='2d'):Machine|LogoError {try{return new Machine(parse(source,mode));}catch(err){return err instanceof Fault?err.info:{message:'Program jest zbyt złożony. Uprość wyrażenie.',line:1,column:1};}}
export function run(source:string,mode:Mode='2d'):Result{const m=compile(source,mode);return m instanceof Machine?m.finish():{segments:[],error:m};}
