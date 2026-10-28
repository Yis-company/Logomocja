export type Mode = '2d' | '3d';
export type Vec = [number, number, number];
export interface Segment { from: Vec; to: Vec; color: string; width: number }
export interface LogoError { message: string; line: number; column: number }
export interface Result { segments: Segment[]; error: LogoError | null }
export interface Turtle { position: Vec; heading: Vec; right: Vec; up: Vec; pen: boolean; color: string; width: number }
export interface Token { kind: 'number' | 'name' | 'string' | 'symbol' | 'variable'; value: string; line: number; column: number; start: number; end: number }
const aliasGroups = {
  forward: ['np','naprzod','naprzód','fd','forward'], back: ['ws','wstecz','bk','back'],
  right: ['pw','prawo','rt','right'], left: ['lw','lewo','lt','left'],
  penup: ['pod','podnies','podnieś','pu','penup'], pendown: ['opu','opusc','opuść','pd','pendown'],
  color: ['kolor','color'], width: ['grubosc','grubość','width'], repeat: ['powtorz','powtórz','repeat'],
  let: ['niech','let'], if: ['jeśli','jesli','if'], ifelse: ['jeżeli','jezeli','ifelse'], stop: ['stop'],
  home: ['dom','home'], clear: ['czyść','czysc','cs','clearscreen'], pitchup: ['gora','góra','pitchup'],
  pitchdown: ['dol','dół','pitchdown'], rollright: ['pp','przechylprawo','rr','rollright'], rollleft: ['pl','przechyllewo','rl','rollleft'],
  to: ['oto','to'], end: ['już','juz','end'], repcount: ['nrpowt','repcount'],
} as const;
export const aliases = new Map<string, string>(Object.entries(aliasGroups).flatMap(([command, names]) => names.map(name => [name,command])));
const normalize = (s: string) => s.toLocaleLowerCase('pl');
class Fault extends Error {
  detail: LogoError;
  constructor(message: string, t: Pick<Token,'line'|'column'>) { super(message); this.detail = { message, line: t.line, column: t.column }; }
}
function fail(message: string, token: Pick<Token,'line'|'column'>): never { throw new Fault(message, token); }
const isNameStart = (s: string) => /[\p{L}_]/u.test(s);
const isNameChar = (s: string) => /[\p{L}\p{N}_]/u.test(s);
export function tokenize(source: string): Token[] {
  if (source.length > 50000) fail('Program przekracza limit 50 000 znaków.', {line:1,column:1});
  const result: Token[] = [];
  let i=0, line=1, column=1;
  const advance = () => { if(source[i++] === '\n') { line++;column=1; } else column++; };
  while(i < source.length) {
    const c=source[i];
    if (/\s/.test(c)) { advance(); continue; }
    if (c === ';') { while(i<source.length && source[i] !== '\n') advance(); continue; }
    const t: Token = {kind:'symbol',value:'',line,column,start:i,end:i};
    if (c==='"') {
      t.kind='string'; advance();
      while(i<source.length && source[i]!=='"' && source[i]!=='\n') advance();
      if(source[i]!=='"') fail('Niezamknięty napis. Kolor zapisz jako "#16866a".',t);
      advance(); t.value=source.slice(t.start,i);
    } else if (/\d/.test(c) || (c==='.' && /\d/.test(source[i+1] || ' '))) {
      t.kind='number';
      while(i<source.length && /[\d.]/.test(source[i])) advance();
      while(i<source.length && isNameChar(source[i])) advance();
      t.value=source.slice(t.start,i);
      if(!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(t.value)) fail(`Nieprawidłowa liczba „${t.value}”. Użyj zapisu dziesiętnego, np. 12.5.`,t);
    } else if(isNameStart(c) || (c===':' && isNameStart(source[i+1] || ' '))) {
      t.kind=c===':'?'variable':'name'; if(c===':') advance();
      const start=i; while(i<source.length && isNameChar(source[i])) advance();
      t.value=normalize(source.slice(start,i));
    } else if('[]()+-*/,<>=:'.includes(c)) {
      advance(); if('<>'.includes(c) && (source[i]==='=' || (c==='<' && source[i]==='>'))) advance();
      t.value=source.slice(t.start,i);
    } else fail(`Nieznany znak „${c}”.`,t);
    t.end=i; result.push(t);
    if(result.length>10000) fail('Program przekracza limit 10 000 tokenów.',t);
  }
  return result;
}
type Expr = { type:'number'; value:number; t:Token } | {type:'name'; name:string; t:Token} | {type:'rep'; t:Token} | {type:'unary'; op:string; arg:Expr; t:Token} | {type:'binary'; op:string; left:Expr; right:Expr; t:Token};
interface Statement { kind:string; t:Token; arg?:Expr; args?:Expr[]; name?:string; color?:string; body?:Statement[]; otherwise?:Statement[]; condition?:{left:Expr;op:string;right:Expr} }
interface Procedure { name:string; params:string[]; tokens:Token[]; body:Statement[]; locals:Set<string>; t:Token }
interface Program { body:Statement[]; procedures:Map<string,Procedure> }
const reserved = (name:string) => aliases.has(name) || name === 'ma';
const validName = (t:Token | undefined) => t && t.kind==='name' && !reserved(t.value);
const isAlias = (t:Token|undefined, command:string) => !!t && aliases.get(t.value)===command;
function parse(source:string, mode:Mode): Program {
  const tokens=tokenize(source), procedures=new Map<string,Procedure>(), top:Token[]=[];
  let i=0, depth=0;
  const firstOnLine=(idx:number) => idx===0 || tokens[idx-1].line!==tokens[idx].line;
  const aloneOnLine=(idx:number) => firstOnLine(idx) && (idx+1===tokens.length || tokens[idx+1].line!==tokens[idx].line);
  while(i<tokens.length) {
    const t=tokens[i];
    if(isAlias(t,'to')) {
      if(depth>0 || !firstOnLine(i)) fail('Definicja „oto” musi zaczynać osobny wiersz na najwyższym poziomie programu.',t);
      const header:Token[]=[]; let j=i+1;
      while(j<tokens.length && tokens[j].line===t.line) header.push(tokens[j++]);
      const name=header.shift(); if(!validName(name)) fail('Po „oto” podaj poprawną nazwę procedury.',name || t);
      if(procedures.has(name!.value)) fail(`Procedura „${name!.value}” jest już zdefiniowana.`,name!);
      const params:string[]=[];
      const addParam=(p:Token|undefined) => { if(!p || !['name','variable'].includes(p.kind) || reserved(p.value)) fail('Oczekiwano nazwy parametru.',p || name!); if(params.includes(p.value)) fail(`Parametr „${p.value}” jest powtórzony.`,p); params.push(p.value); };
      if(header.length && header[0].value==='ma') {
        header.shift(); const colon=header.shift(); if(colon?.value!==':') fail('Po „ma” wpisz dwukropek: ma: bok, kąt.',colon || name!);
        if(!header.length) fail('Po „ma:” podaj parametry.',colon!);
        while(header.length) { const p=header.shift(); if(p?.kind!=='name') fail('Oczekiwano nazwy parametru.',p || name!); addParam(p); if(header.length) { const comma=header.shift()!; if(comma.value!==',') fail('Oddziel parametry przecinkiem.',comma); if(!header.length) fail('Po przecinku podaj parametr.',comma); } }
      } else { for(const p of header) { if(p.kind!=='variable') fail('Parametry zapisz jako „ma: bok, kąt” lub „:bok :kąt”.',p); addParam(p); } }
      const body:Token[]=[];
      while(j<tokens.length && !isAlias(tokens[j],'end')) { if(isAlias(tokens[j],'to')) fail('Nie można definiować procedury wewnątrz innej procedury.',tokens[j]); body.push(tokens[j++]); }
      if(j===tokens.length) fail(`Brakuje „już” kończącego procedurę „${name!.value}”.`,t);
      if(!aloneOnLine(j)) fail('„już” musi być jedynym poleceniem w swoim wierszu.',tokens[j]);
      procedures.set(name!.value,{name:name!.value,params,tokens:body,body:[],locals:new Set(),t});
      i=j+1;
    } else {
      if(t.value==='[') depth++; if(t.value===']') depth--;
      top.push(t); i++;
    }
  }
  function declarations(list:Token[], params:string[]=[]):Set<string> {
    const set=new Set<string>();
    for(let k=0;k<list.length;k++) if(isAlias(list[k],'let')) {
      const t=list[k+1];
      if(!validName(t) || (procedures.has(t.value) && !params.includes(t.value))) fail('Po „niech” podaj nazwę zmiennej, która nie jest poleceniem ani procedurą.',t || list[k]);
      set.add(t.value);
    }
    return set;
  }
  const globals=declarations(top);
  for(const p of procedures.values()) p.locals=declarations(p.tokens,p.params);
  class Parser {
    at=0; nesting=0;
    constructor(public list:Token[], public known:Set<string>) {}
    peek() { return this.list[this.at]; }
    take() { return this.list[this.at++]; }
    expect(value:string, fallback:Token) { const t=this.peek(); if(t?.value!==value) fail(`Oczekiwano „${value}”.`,t || fallback); return this.take(); }
    expression(fallback:Token, repeatDepth:number):Expr {
      const values:Expr[]=[];
      const operators:{op:string;t:Token;unary:boolean}[]=[];
      let operand=true, parentheses=0;
      const precedence=(op:string)=>op==='+' || op==='-'?1:2;
      const reduce=()=> {
        const op=operators.pop()!;
        if(op.unary) {const arg=values.pop()!;values.push({type:'unary',op:op.op,arg,t:op.t});}
        else {const right=values.pop()!,left=values.pop()!;values.push({type:'binary',op:op.op,left,right,t:left.t});}
      };
      const unary=()=>{while(operators.at(-1)?.unary)reduce();};
      while(true) {
        const t=this.peek();
        if(operand) {
          if(!t)fail('Brakuje argumentu polecenia.',fallback);
          if(t.value==='+' || t.value==='-') {operators.push({op:t.value,t,unary:true});this.take();continue;}
          if(t.value==='(') {operators.push({op:'(',t,unary:false});parentheses++;this.take();continue;}
          let value:Expr;
          if(t.kind==='number')value={type:'number',value:Number(t.value),t};
          else if(isAlias(t,'repcount')) {if(!repeatDepth)fail('„nrpowt” działa tylko wewnątrz powtórzenia zapisanego w tym samym bloku.',t);value={type:'rep',t};}
          else if(t.kind==='name' || t.kind==='variable') {
            if(!this.known.has(t.value))fail(`Nieznana zmienna „${t.value}”. Zadeklaruj ją poleceniem „niech” lub jako parametr.`,t);
            value={type:'name',name:t.value,t};
          } else fail('Oczekiwano wyrażenia: liczby, zmiennej lub nawiasu.',t);
          this.take();values.push(value);operand=false;unary();continue;
        }
        if(t?.value===')' && parentheses) {
          while(operators.at(-1)!.op!=='(')reduce();
          const opener=operators.pop()!;const value=values.pop()!;values.push({...value,t:opener.t});
          parentheses--;this.take();unary();continue;
        }
        if(t && ['+','-','*','/'].includes(t.value)) {
          const before=t.start>0 && /\s/.test(source[t.start-1]),after=t.end<source.length && /\s/.test(source[t.end]);
          if(before===after) {
            while(operators.length && operators.at(-1)!.op!=='(' && precedence(operators.at(-1)!.op)>=precedence(t.value))reduce();
            operators.push({op:t.value,t,unary:false});this.take();operand=true;continue;
          }
        }
        if(parentheses)fail('Oczekiwano „)”.',t || [...operators].reverse().find(op=>op.op==='(')!.t);
        break;
      }
      while(operators.length)reduce();
      return values[0];
    }
    block(repeatDepth:number, opener?:Token):Statement[] {
      const result:Statement[]=[];
      while(this.peek() && this.peek().value!==']') result.push(this.statement(repeatDepth));
      if(opener) this.expect(']',opener);
      else if(this.peek()) fail('Nadmiarowy nawias „]”.',this.peek());
      return result;
    }
    bracket(repeatDepth:number, fallback:Token) {
      const opener=this.expect('[',fallback);
      if(++this.nesting>32) fail('Przekroczono limit 32 poziomów nawiasów kwadratowych.',opener);
      const body=this.block(repeatDepth,opener); this.nesting--; return body;
    }
    statement(repeatDepth:number):Statement {
      const t=this.take(); const kind=aliases.get(t.value);
      if(!kind && procedures.has(t.value) && t.kind==='name') {
        const p=procedures.get(t.value)!; const args:Expr[]=[];
        for(let n=0;n<p.params.length;n++) args.push(this.expression(t,repeatDepth));
        return {kind:'call',name:t.value,args,t};
      }
      if(!kind || t.kind!=='name') fail(`Nieznane polecenie „${source.slice(t.start,t.end)}”.`,t);
      if(['to','end'].includes(kind)) fail('Definicje procedur są dozwolone tylko na najwyższym poziomie, w osobnych wierszach.',t);
      if(kind==='repcount') fail('„nrpowt” jest wartością, a nie poleceniem.',t);
      if(mode==='2d' && ['pitchup','pitchdown','rollright','rollleft'].includes(kind)) fail('To polecenie przestrzenne. Przełącz studio w tryb 3D.',t);
      if(['forward','back','right','left','pitchup','pitchdown','rollright','rollleft','width','repeat'].includes(kind)) {
        const arg=this.expression(t,repeatDepth); const node:Statement={kind,t,arg};
        if(kind==='width' || kind==='repeat') {
          const constant=constantValue(arg);
          if(constant!==null) validateRange(kind,constant,arg.t);
        }
        if(kind==='repeat') node.body=this.bracket(repeatDepth+1,t);
        return node;
      }
      if(kind==='color') {
        const c=this.peek(); if(!c) fail('Brakuje koloru. Użyj np. "#16866a".',t);
        if(c.kind!=='string' || !/^"#[0-9a-f]{6}"$/i.test(c.value)) fail('Nieprawidłowy kolor. Użyj sześciu cyfr szesnastkowych w cudzysłowie, np. "#16866a".',c);
        this.take(); return {kind,t,color:c.value.slice(1,-1).toLowerCase()};
      }
      if(kind==='let') { const name=this.take(); const arg=this.expression(t,repeatDepth); return {kind,t,name:name.value,arg}; }
      if(kind==='if' || kind==='ifelse') {
        const left=this.expression(t,repeatDepth); const comparison=this.take();
        if(!comparison || !['<','>','=','<=','>=','<>'].includes(comparison.value)) fail('W warunku użyj porównania: <, >, =, <=, >= lub <>.',comparison || t);
        const right=this.expression(t,repeatDepth); const body=this.bracket(repeatDepth,t);
        return {kind,t,condition:{left,op:comparison.value,right},body,otherwise:kind==='ifelse'?this.bracket(repeatDepth,t):undefined};
      }
      return {kind,t};
    }
  }
  for(const p of procedures.values()) p.body=new Parser(p.tokens,new Set([...globals,...p.locals,...p.params])).block(0);
  return {body:new Parser(top,globals).block(0),procedures};
}
function constantValue(root:Expr):number|null {
  const stack:{e:Expr;visited:boolean}[]=[{e:root,visited:false}],values:number[]=[];
  while(stack.length) {
    const {e,visited}=stack.pop()!;
    if(e.type==='number') {values.push(e.value);continue;}
    if(e.type==='name' || e.type==='rep')return null;
    if(!visited) {stack.push({e,visited:true});if(e.type==='unary')stack.push({e:e.arg,visited:false});else stack.push({e:e.right,visited:false},{e:e.left,visited:false});continue;}
    const b=values.pop()!;
    if(e.type==='unary')values.push(e.op==='-'?-b:b);
    else {const a=values.pop()!;if(e.op==='/'&&b===0)return null;const n=e.op==='+'?a+b:e.op==='-'?a-b:e.op==='*'?a*b:a/b;if(!Number.isFinite(n))return null;values.push(n);}
  }
  return values[0];
}
function validateRange(kind:string, value:number, t:Token) {
  if(kind==='width' && (!Number.isInteger(value) || value<1 || value>12)) fail('Grubość musi być liczbą całkowitą od 1 do 12.',t);
  if(kind==='repeat' && (!Number.isInteger(value) || value<0 || value>10000)) fail('Liczba powtórzeń musi być całkowita i mieścić się od 0 do 10 000.',t);
}
const clone=(v:Vec):Vec => [...v];
const combine=(a:Vec,b:Vec,c:number,s:number):Vec => [a[0]*c+b[0]*s,a[1]*c+b[1]*s,a[2]*c+b[2]*s];
const initialTurtle=():Turtle => ({position:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],pen:true,color:'#16866a',width:3});
class Stop {}
interface Context { locals:Map<string,number>|null; repeats:number[] }
export class Execution {
  segments:Segment[]=[]; turtle=initialTurtle(); error:LogoError|null=null; done=false;
  current:{line:number;column:number}|null=null; operations=0; frames=0;
  private globals=new Map<string,number>(); private iterator:Generator<void>; private program:Program|null=null;
  constructor(source:string, mode:Mode='2d') {
    try { if(mode!=='2d' && mode!=='3d') fail('Nieznany tryb. Wybierz 2d lub 3d.',{line:1,column:1}); this.program=parse(source,mode); }
    catch(error) { this.error=this.asError(error); this.done=true; }
    this.iterator=this.execute();
  }
  private asError(error:unknown):LogoError { return error instanceof Fault?error.detail:{message:'Nie udało się przetworzyć programu: zbyt złożone wyrażenie.',line:this.current?.line || 1,column:this.current?.column || 1}; }
  private tick(t:Token) { this.current={line:t.line,column:t.column}; if(++this.operations>10000) fail('Przekroczono limit 10 000 wykonanych operacji.',t); }
  private frame(t:Token) { if(++this.frames>32) fail('Przekroczono limit 32 aktywnych wywołań i powtórzeń.',t); }
  private value(root:Expr, ctx:Context):number {
    const stack:{e:Expr;visited:boolean}[]=[{e:root,visited:false}],values:number[]=[],at=root.t;
    while(stack.length) {
      const {e,visited}=stack.pop()!;
      let n:number;
      if(e.type==='number')n=e.value;
      else if(e.type==='name') {
        const value=ctx.locals?.has(e.name)?ctx.locals.get(e.name):this.globals.get(e.name);
        if(value===undefined)fail(`Zmienna „${e.name}” nie ma jeszcze wartości na tej ścieżce programu.`,at);
        n=value;
      } else if(e.type==='rep')n=ctx.repeats[ctx.repeats.length-1];
      else if(!visited) {stack.push({e,visited:true});if(e.type==='unary')stack.push({e:e.arg,visited:false});else stack.push({e:e.right,visited:false},{e:e.left,visited:false});continue;}
      else if(e.type==='unary') {const a=values.pop()!;n=e.op==='-'?-a:a;}
      else {
        const b=values.pop()!,a=values.pop()!;
        if(e.op==='/'&&b===0)fail('Nie można dzielić przez zero.',at);
        n=e.op==='+'?a+b:e.op==='-'?a-b:e.op==='*'?a*b:a/b;
      }
      if(!Number.isFinite(n))fail('Wynik wyrażenia nie jest skończoną liczbą.',at);
      values.push(n);
    }
    return values[0];
  }
  private move(target:Vec, t:Token) {
    if(target.some(v=>!Number.isFinite(v) || Math.abs(v)>100000)) fail('Współrzędne żółwia muszą mieścić się od −100 000 do 100 000.',t);
    if(this.turtle.pen && target.some((v,i)=>v!==this.turtle.position[i])) {
      if(this.segments.length>=10000) fail('Przekroczono limit 10 000 zachowanych odcinków.',t);
      this.segments.push({from:clone(this.turtle.position),to:clone(target),color:this.turtle.color,width:this.turtle.width});
    }
    this.turtle.position=target;
  }
  private *block(body:Statement[],ctx:Context):Generator<void> { for(const statement of body) yield* this.statement(statement,ctx); }
  private *statement(n:Statement,ctx:Context):Generator<void> {
    this.tick(n.t);
    const t=this.turtle;
    if(n.kind==='repeat') {
      const count=this.value(n.arg!,ctx); validateRange('repeat',count,n.arg!.t); this.frame(n.t); yield;
      try {
        for(let i=1;i<=count;i++) { ctx.repeats.push(i); try { yield* this.block(n.body!,ctx); } finally { ctx.repeats.pop(); } this.tick(n.t); }
      } finally { this.frames--; }
      return;
    }
    if(n.kind==='if' || n.kind==='ifelse') {
      const condition=n.condition!, a=this.value(condition.left,ctx), b=this.value(condition.right,ctx);
      const ok=condition.op==='<'?a<b:condition.op==='>'?a>b:condition.op==='='?a===b:condition.op==='<='?a<=b:condition.op==='>='?a>=b:a!==b;
      const body=ok?n.body:n.otherwise; yield;
      if(body) { yield* this.block(body,ctx); this.tick(n.t); } return;
    }
    if(n.kind==='call') {
      const p=this.program!.procedures.get(n.name!)!; const values=n.args!.map(e=>this.value(e,ctx));
      this.frame(n.t); yield;
      try { yield* this.block(p.body,{locals:new Map(p.params.map((name,i)=>[name,values[i]])),repeats:[]}); }
      catch(error) { if(!(error instanceof Stop)) throw error; }
      this.frames--; this.tick(n.t); return;
    }
    if(n.kind==='let') (ctx.locals || this.globals).set(n.name!,this.value(n.arg!,ctx));
    else if(n.kind==='stop') { yield; throw new Stop(); }
    else if(n.kind==='color') t.color=n.color!;
    else if(n.kind==='penup') t.pen=false;
    else if(n.kind==='pendown') t.pen=true;
    else if(n.kind==='clear') this.segments.splice(0);
    else if(n.kind==='home') { this.move([0,0,0],n.t); t.heading=[0,1,0];t.right=[1,0,0];t.up=[0,0,1]; }
    else {
      const value=this.value(n.arg!,ctx);
      if(n.kind==='width') { validateRange('width',value,n.arg!.t); t.width=value; }
      else if(n.kind==='forward' || n.kind==='back') {
        const d=n.kind==='back'?-value:value;
        this.move(t.position.map((x,i)=>x+t.heading[i]*d) as Vec,n.arg!.t);
      } else {
        const angle=(value%360)*Math.PI/180, c=Math.cos(angle), s=Math.sin(angle);
        if(n.kind==='right' || n.kind==='left') { const a=n.kind==='left'?-s:s, h=t.heading; t.heading=combine(h,t.right,c,a); t.right=combine(t.right,h,c,-a); }
        if(n.kind==='pitchup' || n.kind==='pitchdown') { const a=n.kind==='pitchdown'?-s:s, h=t.heading; t.heading=combine(h,t.up,c,a); t.up=combine(t.up,h,c,-a); }
        if(n.kind==='rollright' || n.kind==='rollleft') { const a=n.kind==='rollleft'?-s:s, u=t.up; t.up=combine(u,t.right,c,a); t.right=combine(t.right,u,c,-a); }
      }
    }
    yield;
  }
  private *execute():Generator<void> {
    if(!this.program) return;
    try { yield* this.block(this.program.body,{locals:null,repeats:[]}); }
    catch(error) { if(!(error instanceof Stop)) throw error; }
  }
  step():boolean {
    if(this.done) return false;
    try { this.done=!!this.iterator.next().done; } catch(error) { this.error=this.asError(error); this.done=true; }
    return !this.done;
  }
  finish():Result { while(!this.done) this.step(); return {segments:this.segments,error:this.error}; }
}
export function run(source:string,mode:Mode='2d'):Result { return new Execution(source,mode).finish(); }
