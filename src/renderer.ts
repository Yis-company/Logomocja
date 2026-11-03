import { initialTurtle, type Mode, type Vec, type Segment, type Turtle } from './interpreter';
const dot=(a:Vec,b:Vec)=>a.reduce((v,x,i)=>v+x*b[i],0);
export class DrawingView {
  mode:Mode='2d';segments:Segment[]=[];turtle:Turtle=initialTurtle();scale=1;pan=[0,0];target:Vec=[0,0,0];azimuth=-0.65;elevation=0.65;grid=true;width=600;height=600;
  private ctx:CanvasRenderingContext2D; private points=new Map<number,{x:number;y:number}>(); private lastDistance=0;
  onChange?:()=>void;
  constructor(readonly canvas:HTMLCanvasElement){
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Twoja przeglądarka nie obsługuje Canvas 2D.');this.ctx=ctx;
    new ResizeObserver(()=>this.resize()).observe(canvas);
    canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoom(Math.exp(-e.deltaY*.001));},{passive:false});
    canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(this.points.size===2)this.lastDistance=this.distance();canvas.classList.add('dragging');});
    canvas.addEventListener('pointermove',e=>{const p=this.points.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(this.points.size===2){const distance=this.distance();if(this.lastDistance)this.scale=Math.max(.0001,Math.min(50,this.scale*distance/this.lastDistance));this.lastDistance=distance;this.pan[0]+=dx/2;this.pan[1]+=dy/2;}
      else if(this.mode==='3d'&&!e.shiftKey&&e.button!==2&&!(e.buttons&2)){this.azimuth-=dx*.008;this.elevation=Math.max(-1.45,Math.min(1.45,this.elevation+dy*.008));}
      else {this.pan[0]+=dx;this.pan[1]+=dy;}this.draw();this.onChange?.();
    });
    const up=(e:PointerEvent)=>{this.points.delete(e.pointerId);this.lastDistance=0;if(!this.points.size)canvas.classList.remove('dragging');};canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('contextmenu',e=>e.preventDefault());
    canvas.addEventListener('keydown',e=>{let handled=true;if(e.key==='+ '||e.key==='+'||e.key==='=')this.zoom(1.2);else if(e.key==='-')this.zoom(1/1.2);else if(e.key==='0')this.fit();else if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){
      if(this.mode==='3d'&&!e.shiftKey){this.azimuth+=(e.key==='ArrowRight'?.1:e.key==='ArrowLeft'?-.1:0);this.elevation=Math.max(-1.45,Math.min(1.45,this.elevation+(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0)));}
      else {this.pan[0]+=(e.key==='ArrowRight'?20:e.key==='ArrowLeft'?-20:0);this.pan[1]+=(e.key==='ArrowDown'?20:e.key==='ArrowUp'?-20:0);}this.draw();}else handled=false;if(handled)e.preventDefault();});
  }
  private distance(){const p=[...this.points.values()];return Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
  resize(){const box=this.canvas.getBoundingClientRect();if(!box.width||!box.height)return;this.width=box.width;this.height=box.height;const dpr=Math.min(window.devicePixelRatio||1,2);this.canvas.width=Math.round(box.width*dpr);this.canvas.height=Math.round(box.height*dpr);this.draw();}
  basis():[Vec,Vec,Vec]{if(this.mode==='2d')return [[1,0,0],[0,1,0],[0,0,1]];const a=this.azimuth,e=this.elevation;return [[Math.cos(a),Math.sin(a),0],[-Math.sin(a)*Math.sin(e),Math.cos(a)*Math.sin(e),Math.cos(e)],[Math.sin(a)*Math.cos(e),-Math.cos(a)*Math.cos(e),Math.sin(e)]];}
  raw(p:Vec):[number,number,number]{const [r,u,d]=this.basis();return [dot(p,r),-dot(p,u),dot(p,d)];}
  project(p:Vec):[number,number]{const a=this.raw(p),b=this.raw(this.target);return [(a[0]-b[0])*this.scale+this.width/2+this.pan[0],(a[1]-b[1])*this.scale+this.height/2+this.pan[1]];}
  set(mode:Mode,segments:Segment[],turtle:Turtle){this.mode=mode;this.segments=segments;this.turtle=turtle;this.draw();}
  zoom(factor:number){this.scale=Math.max(.0001,Math.min(50,this.scale*factor));this.draw();this.onChange?.();}
  fit(resetCamera=false){
    if(resetCamera){this.azimuth=-.65;this.elevation=.65;}
    this.pan=[0,-18];const points=this.segments.flatMap(s=>[s.from,s.to]);points.push(this.turtle.position);
    if(!this.segments.length){this.target=[0,0,0];this.scale=1;this.draw();this.onChange?.();return;}
    const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),zs=points.map(p=>p[2]);this.target=[(Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2,(Math.min(...zs)+Math.max(...zs))/2];
    const projected=points.map(p=>this.raw(p)),px=projected.map(p=>p[0]),py=projected.map(p=>p[1]);
    this.scale=Math.max(.0001,Math.min(3,(this.width-100)/Math.max(40,Math.max(...px)-Math.min(...px)),(this.height-160)/Math.max(40,Math.max(...py)-Math.min(...py))));this.draw();this.onChange?.();
  }
  draw(){
    const c=this.ctx,dpr=this.canvas.width/this.width;c.setTransform(dpr,0,0,dpr,0,0);const style=getComputedStyle(document.documentElement),bg=style.getPropertyValue('--canvas').trim()||'#fcfcfa',grid=style.getPropertyValue('--grid').trim()||'#e9ece7',ink=style.getPropertyValue('--muted').trim()||'#777f76';c.fillStyle=bg;c.fillRect(0,0,this.width,this.height);
    const line=(from:Vec,to:Vec,color:string,width=1)=>{const a=this.project(from),b=this.project(to);c.beginPath();c.moveTo(...a);c.lineTo(...b);c.strokeStyle=color;c.lineWidth=width;c.stroke();};
    if(this.grid){
      const unitStep=25/this.scale,magnitude=10**Math.floor(Math.log10(unitStep));const step=magnitude*([1,2,5,10].find(x=>x*magnitude>=unitStep)||10),spacing=step*this.scale;
      if(this.mode==='2d'){
        const origin=this.project([0,0,0]);c.strokeStyle=grid;c.lineWidth=1;c.beginPath();for(let x=(origin[0]%spacing+spacing)%spacing;x<this.width;x+=spacing){c.moveTo(x,0);c.lineTo(x,this.height);}for(let y=(origin[1]%spacing+spacing)%spacing;y<this.height;y+=spacing){c.moveTo(0,y);c.lineTo(this.width,y);}c.stroke();
      }else {const extent=Math.max(200,Math.ceil(Math.max(this.width,this.height)/this.scale/step)*step);const cx=Math.round(this.target[0]/step)*step,cy=Math.round(this.target[1]/step)*step;for(let i=-extent;i<=extent;i+=step){line([cx+i,cy-extent,0],[cx+i,cy+extent,0],grid);line([cx-extent,cy+i,0],[cx+extent,cy+i,0],grid);}}
    }
    const origin=this.project([0,0,0]);c.setLineDash([4,5]);
    if(this.mode==='2d'){line([-100000,0,0],[100000,0,0],grid);line([0,-100000,0],[0,100000,0],grid);}else {line([0,0,0],[100,0,0],'#cb9284');line([0,0,0],[0,100,0],'#7da991');line([0,0,0],[0,0,100],'#7d9dbf');}
    c.setLineDash([]);
    const segments=this.mode==='3d'?[...this.segments].sort((a,b)=>this.raw(a.from)[2]-this.raw(b.from)[2]):this.segments;
    c.lineCap='round';c.lineJoin='round';for(const s of segments)line(s.from,s.to,s.color,Math.max(.6,s.width*this.scale));
    if(origin[0]>-10&&origin[0]<this.width+10&&origin[1]>-10&&origin[1]<this.height+10){c.fillStyle=bg;c.beginPath();c.arc(...origin,3,0,Math.PI*2);c.fill();c.strokeStyle=ink;c.lineWidth=1;c.stroke();c.fillStyle=ink;c.font='10px ui-monospace,monospace';c.fillText('0, 0',origin[0]+9,origin[1]+14);}
    const t=this.turtle,p=this.project(t.position),h=this.project(t.heading.map((v,i)=>t.position[i]+v*20) as Vec),r=this.project(t.right.map((v,i)=>t.position[i]+v*10) as Vec);
    const hx=h[0]-p[0],hy=h[1]-p[1],hl=Math.hypot(hx,hy)||1,rx=r[0]-p[0],ry=r[1]-p[1],rl=Math.hypot(rx,ry)||1;
    c.beginPath();c.moveTo(p[0]+hx/hl*12,p[1]+hy/hl*12);c.lineTo(p[0]-hx/hl*7+rx/rl*7,p[1]-hy/hl*7+ry/rl*7);c.lineTo(p[0]-hx/hl*4,p[1]-hy/hl*4);c.lineTo(p[0]-hx/hl*7-rx/rl*7,p[1]-hy/hl*7-ry/rl*7);c.closePath();c.fillStyle=t.pen?'#16866a':bg;c.fill();c.strokeStyle=bg;c.lineWidth=2;c.stroke();
    if(this.mode==='3d') {const up=this.project(t.up.map((v,i)=>t.position[i]+v*20) as Vec),ux=up[0]-p[0],uy=up[1]-p[1],len=Math.hypot(ux,uy)||1;c.beginPath();c.moveTo(...p);c.lineTo(p[0]+ux/len*18,p[1]+uy/len*18);c.strokeStyle='#b58acb';c.lineWidth=2;c.stroke();this.drawCompass();}
  }
  private drawCompass(){const c=this.ctx,base=[this.width-42,this.height-44];for(const [v,color,label] of [[[1,0,0],'#b77266','X'],[[0,1,0],'#16866a','Y'],[[0,0,1],'#6e89ae','Z']] as [Vec,string,string][]){const p=this.raw(v);c.beginPath();c.moveTo(...base as [number,number]);c.lineTo(base[0]+p[0]*24,base[1]+p[1]*24);c.strokeStyle=color;c.lineWidth=1.5;c.stroke();c.fillStyle=color;c.font='bold 10px sans-serif';c.fillText(label,base[0]+p[0]*32-3,base[1]+p[1]*32+3);}}
  exportPNG(){this.draw();this.canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='logomocja.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},'image/png');}
}
export function thumbnail(canvas:HTMLCanvasElement,segments:Segment[],spatial=false){
  const c=canvas.getContext('2d')!;canvas.width=96;canvas.height=96;const raw=(v:Vec)=>spatial?[v[0]*.8+v[1]*.4,-v[2]*.9-v[1]*.5+v[0]*.2]:[v[0],-v[1]];
  const points=segments.flatMap(s=>[raw(s.from),raw(s.to)]);if(!points.length)return;const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),scale=66/Math.max(maxX-minX,maxY-minY,1),cx=(minX+maxX)/2,cy=(minY+maxY)/2;
  c.lineWidth=2;c.lineCap='round';for(const s of segments){const a=raw(s.from),b=raw(s.to);c.strokeStyle=s.color;c.beginPath();c.moveTo((a[0]-cx)*scale+48,(a[1]-cy)*scale+48);c.lineTo((b[0]-cx)*scale+48,(b[1]-cy)*scale+48);c.stroke();}
}
