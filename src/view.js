const plus=(a,b)=>a.map((v,i)=>v+b[i]);const scale=(a,n)=>a.map(v=>v*n);
export class DrawingView {
 constructor(canvas,{interactive=true,grid=true,turtle=true,onChange=()=>{}}={}){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.mode='2d';this.segments=[];this.turtle=null;this.grid=grid;this.showTurtle=turtle;this.onChange=onChange;this.zoom=1;this.offset=[0,0];this.center=[0,0,0];this.yaw=-0.65;this.elevation=0.6;this.pointers=new Map();this.panMode=false;
  this.observer=new ResizeObserver(()=>{this.resize();this.fit()});this.observer.observe(canvas);
  if(interactive)this.bind();this.resize();
 }
 resize(){const r=this.canvas.getBoundingClientRect();this.w=r.width||300;this.h=r.height||200;const dpr=Math.min(window.devicePixelRatio||1,2);this.canvas.width=Math.round(this.w*dpr);this.canvas.height=Math.round(this.h*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);this.draw()}
 set(mode,segments,turtle){if(this.mode!==mode){this.mode=mode;this.reset()}this.segments=segments;this.turtle=turtle;this.draw()}
 project(p){const d=p.map((v,i)=>v-this.center[i]);if(this.mode==='2d')return [d[0],-d[1],d[2]];const c=Math.cos(this.yaw),s=Math.sin(this.yaw),ce=Math.cos(this.elevation),se=Math.sin(this.elevation);return [d[0]*c-d[1]*s,(d[0]*s+d[1]*c)*se-d[2]*ce,(d[0]*s+d[1]*c)*ce+d[2]*se]}
 screen(p){const q=this.project(p);return [this.w/2+q[0]*this.zoom+this.offset[0],this.h/2+q[1]*this.zoom+this.offset[1]]}
 fit(){
  const points=this.segments.flatMap(s=>[s.from,s.to]);if(!points.length)points.push([0,0,0],this.turtle?.position||[0,0,0]);
  this.center=this.mode==='3d'?[0,1,2].map(i=>{let lo=Infinity,hi=-Infinity;for(const p of points){lo=Math.min(lo,p[i]);hi=Math.max(hi,p[i])}return (lo+hi)/2}):[0,0,0];let min=[Infinity,Infinity],max=[-Infinity,-Infinity];for(const p of points){const q=this.project(p);for(let i=0;i<2;i++){min[i]=Math.min(min[i],q[i]);max[i]=Math.max(max[i],q[i])}}
  const padding=this.grid?Math.min(120,this.h*.3):Math.min(45,this.h*.28);this.zoom=Math.max(.0001,Math.min((this.w-padding)/Math.max(20,max[0]-min[0]),(this.h-padding)/Math.max(20,max[1]-min[1]),3));this.offset=[-(max[0]+min[0])/2*this.zoom,-(max[1]+min[1])/2*this.zoom];this.draw();this.onChange();
 }
 reset(){this.yaw=-0.65;this.elevation=0.6;this.offset=[0,0];this.center=[0,0,0];this.zoom=1;this.fit()}
 zoomBy(factor){this.zoom=Math.max(.0001,Math.min(30,this.zoom*factor));this.draw();this.onChange()}
 line(a,b,color,width=1,dash=[]){const ctx=this.ctx,p=this.screen(a),q=this.screen(b);ctx.beginPath();ctx.setLineDash(dash);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.moveTo(...p);ctx.lineTo(...q);ctx.stroke();ctx.setLineDash([])}
 draw(){
  if(!this.ctx)return;const ctx=this.ctx,dark=document.documentElement.dataset.theme==='dark';const paper=dark?'#182522':'#fcfdfb',grid=dark?'#2d3e37':'#e4eae3',muted=dark?'#91a59a':'#647468';ctx.clearRect(0,0,this.w,this.h);ctx.fillStyle=paper;ctx.fillRect(0,0,this.w,this.h);ctx.lineCap='round';ctx.lineJoin='round';
  if(this.grid){
   if(this.mode==='2d'){
    const gap=25*this.zoom*Math.pow(5,Math.max(0,Math.ceil(Math.log(12/(25*this.zoom))/Math.log(5))));const o=this.screen([0,0,0]);ctx.fillStyle=grid;
    for(let x=((o[0]%gap)+gap)%gap;x<this.w;x+=gap)for(let y=((o[1]%gap)+gap)%gap;y<this.h;y+=gap){ctx.beginPath();ctx.arc(x,y,.9,0,Math.PI*2);ctx.fill()}
    ctx.strokeStyle=grid;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,o[1]);ctx.lineTo(this.w,o[1]);ctx.moveTo(o[0],0);ctx.lineTo(o[0],this.h);ctx.stroke();
   }else{
    const extent=Math.max(200,Math.min(100000,400/this.zoom));const step=Math.pow(10,Math.floor(Math.log10(extent/6)));for(let k=-Math.ceil(extent/step);k<=Math.ceil(extent/step);k++){this.line([k*step,-extent,0],[k*step,extent,0],grid);this.line([-extent,k*step,0],[extent,k*step,0],grid)}
    this.line([0,0,0],[extent,0,0],dark?'#986e65':'#d5a297');this.line([0,0,0],[0,extent,0],dark?'#568d75':'#8eb9a0');this.line([0,0,0],[0,0,extent],dark?'#627d9b':'#9bb2ca');
   }
   const o=this.screen([0,0,0]);ctx.fillStyle=muted;ctx.font='10px \"Studio Mono\", monospace';ctx.fillText('0, 0',o[0]+9,o[1]+17);ctx.strokeStyle=muted;ctx.beginPath();ctx.arc(o[0],o[1],3,0,Math.PI*2);ctx.stroke();
  }
  const sorted=this.mode==='3d'?[...this.segments].sort((a,b)=>this.project(a.from)[2]-this.project(b.from)[2]):this.segments;
  for(const s of sorted)this.line(s.from,s.to,s.color,Math.max(.6,s.width*Math.min(this.zoom,2)));
  if(this.showTurtle&&this.turtle){
   const t=this.turtle,p=this.screen(t.position),h=this.project(plus(t.position,t.heading)),base=this.project(t.position),angle=Math.atan2(h[1]-base[1],h[0]-base[0]);
   ctx.save();ctx.translate(...p);ctx.rotate(angle);ctx.shadowColor='#16866a25';ctx.shadowBlur=10;ctx.fillStyle=dark?'#8bd5b8':'#eff9f0';ctx.strokeStyle='#16866a';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-8,-7);ctx.lineTo(-4,0);ctx.lineTo(-8,7);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
   if(this.mode==='3d'){const len=22/this.zoom;this.line(t.position,plus(t.position,scale(t.right,len)),'#cd826c',2);this.line(t.position,plus(t.position,scale(t.up,len)),'#7392c2',2)}
  }
  if(this.mode==='3d'&&this.grid){ctx.font='600 11px \"Studio Sans\", sans-serif';const origin=[this.w-90,50];for(const [v,c,l] of [[[1,0,0],'#c17663','X'],[[0,1,0],'#16866a','Y'],[[0,0,1],'#678eb7','Z']]){const q=this.project(v),z=this.project([0,0,0]),p=[origin[0]+(q[0]-z[0])*22,origin[1]+(q[1]-z[1])*22];ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(...origin);ctx.lineTo(...p);ctx.stroke();ctx.fillStyle=c;ctx.fillText(l,p[0]-3,p[1]-5)}}
 }
 bind(){const c=this.canvas;
  c.addEventListener('contextmenu',e=>e.preventDefault());
  c.addEventListener('pointerdown',e=>{c.focus({preventScroll:true});c.setPointerCapture(e.pointerId);this.pointers.set(e.pointerId,[e.clientX,e.clientY]);this.drag={x:e.clientX,y:e.clientY,pan:e.button===2||e.shiftKey||this.panMode};if(this.pointers.size===2)this.pinch=this.distance()});
  c.addEventListener('pointermove',e=>{if(!this.pointers.has(e.pointerId))return;const old=this.pointers.get(e.pointerId);this.pointers.set(e.pointerId,[e.clientX,e.clientY]);if(this.pointers.size===2){const next=this.distance();if(this.pinch)this.zoomBy(next/this.pinch);this.pinch=next;this.offset[0]+=(e.clientX-old[0])/2;this.offset[1]+=(e.clientY-old[1])/2}else if(this.mode==='3d'&&!this.drag.pan){this.yaw+=(e.clientX-old[0])*.008;this.elevation=Math.max(-1.5,Math.min(1.5,this.elevation+(e.clientY-old[1])*.008))}else{this.offset[0]+=e.clientX-old[0];this.offset[1]+=e.clientY-old[1]}this.draw()});
  const release=e=>{this.pointers.delete(e.pointerId);this.pinch=null};c.addEventListener('pointerup',release);c.addEventListener('pointercancel',release);
  c.addEventListener('wheel',e=>{e.preventDefault();this.zoomBy(Math.exp(-e.deltaY*.001))},{passive:false});
  c.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0'].includes(e.key)){e.preventDefault();if(e.key==='+'||e.key==='=')this.zoomBy(1.2);else if(e.key==='-')this.zoomBy(1/1.2);else if(e.key==='0')this.reset();else if(this.mode==='3d'&&!e.shiftKey&&!this.panMode){this.yaw+=e.key==='ArrowLeft'?-.12:e.key==='ArrowRight'?.12:0;this.elevation=Math.max(-1.5,Math.min(1.5,this.elevation+(e.key==='ArrowUp'?.1:e.key==='ArrowDown'?-.1:0)));this.draw()}else{this.offset[0]+=e.key==='ArrowLeft'?-20:e.key==='ArrowRight'?20:0;this.offset[1]+=e.key==='ArrowUp'?-20:e.key==='ArrowDown'?20:0;this.draw()}}});
 }
 distance(){const [a,b]=[...this.pointers.values()];return Math.hypot(a[0]-b[0],a[1]-b[1])}
 destroy(){this.observer.disconnect()}
}
