import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import type { Mode, Segment, Turtle, Vec } from './interpreter';
const blankTurtle=():Turtle=>({position:[0,0,0],heading:[0,1,0],right:[1,0,0],up:[0,0,1],pen:true,color:'#16866a',width:3});
export class DrawingView {
  mode:Mode='2d'; segments:Segment[]=[]; turtle:Turtle=blankTurtle(); dark=false;
  canvas:HTMLCanvasElement; private ctx:CanvasRenderingContext2D;
  private width=1; private height=1; private scale=1.3; private cx=0;private cy=0;
  private renderer?:THREE.WebGLRenderer; private scene?:THREE.Scene; private camera?:THREE.PerspectiveCamera;
  private controls?:OrbitControls; private strokes?:THREE.Group; private marker?:THREE.Group;
  private grid?:THREE.GridHelper; private axes?:THREE.Group; private dragging=false;
  private webglError:HTMLElement; gridVisible=true;
  onChange?:()=>void;
  constructor(public container:HTMLElement) {
    this.canvas=document.createElement('canvas'); this.canvas.className='drawing-canvas'; this.canvas.tabIndex=0;
    this.canvas.setAttribute('aria-label','Płótno 2D. Przeciągnij, aby przesunąć. Kółko myszy lub klawisze plus i minus zmieniają powiększenie. Strzałki przesuwają widok. Zero dopasowuje rysunek.');
    this.ctx=this.canvas.getContext('2d')!; container.append(this.canvas);
    this.webglError=document.createElement('div'); this.webglError.className='webgl-error'; this.webglError.hidden=true;
    this.webglError.innerHTML='<strong>Widok 3D jest niedostępny</strong><p>Przeglądarka nie udostępnia WebGL. Włącz akcelerację sprzętową lub użyj innej przeglądarki. Studio 2D nadal działa.</p>';
    container.append(this.webglError);
    let lastX=0,lastY=0;
    this.canvas.addEventListener('pointerdown',e=>{ this.dragging=true;lastX=e.clientX;lastY=e.clientY;this.canvas.setPointerCapture(e.pointerId);this.canvas.classList.add('dragging'); });
    this.canvas.addEventListener('pointermove',e=>{ if(!this.dragging)return;this.cx-=(e.clientX-lastX)/this.scale;this.cy+=(e.clientY-lastY)/this.scale;lastX=e.clientX;lastY=e.clientY;this.render(); });
    const release=()=>{this.dragging=false;this.canvas.classList.remove('dragging');};
    this.canvas.addEventListener('pointerup',release);this.canvas.addEventListener('pointercancel',release);
    this.canvas.addEventListener('wheel',e=>{ e.preventDefault();const r=this.canvas.getBoundingClientRect();this.zoom(Math.exp(-e.deltaY*.0015),e.clientX-r.left,e.clientY-r.top); },{passive:false});
    this.canvas.addEventListener('keydown',e=>{
      if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
        e.preventDefault();if(e.key==='+' || e.key==='=')this.zoom(1.2);if(e.key==='-')this.zoom(1/1.2);if(e.key==='0')this.fit();
        if(e.key==='ArrowLeft')this.cx-=25/this.scale;if(e.key==='ArrowRight')this.cx+=25/this.scale;
        if(e.key==='ArrowUp')this.cy+=25/this.scale;if(e.key==='ArrowDown')this.cy-=25/this.scale;this.render();
      }
    });
    new ResizeObserver(()=>this.resize()).observe(container); this.resize();
  }
  private resize() {
    this.width=this.container.clientWidth;this.height=this.container.clientHeight;
    const dpr=Math.min(window.devicePixelRatio || 1,2);this.canvas.width=this.width*dpr;this.canvas.height=this.height*dpr;
    this.ctx.setTransform(dpr,0,0,dpr,0,0);
    if(this.renderer) {this.renderer.setSize(this.width,this.height);this.camera!.aspect=this.width/this.height;this.camera!.updateProjectionMatrix();this.updateResolution();}
    this.render();
  }
  setMode(mode:Mode) {
    this.mode=mode;this.canvas.hidden=mode==='3d';this.webglError.hidden=true;
    if(mode==='3d' && !this.renderer) this.init3d();
    if(this.renderer) this.renderer.domElement.hidden=mode!=='3d';
    if(mode==='3d' && !this.renderer) this.webglError.hidden=false;
    this.render();
  }
  private init3d() {
    try {
      this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)); this.renderer.setSize(this.width,this.height);
      this.renderer.domElement.className='drawing-canvas';this.renderer.domElement.tabIndex=0;
      this.renderer.domElement.setAttribute('aria-label','Płótno 3D. Przeciągnij, aby obrócić kamerę. Prawy przycisk lub dwa palce przesuwają. Kółko powiększa. Strzałki przesuwają kamerę, plus i minus powiększają, zero resetuje.');
      this.container.append(this.renderer.domElement);
      this.scene=new THREE.Scene(); this.camera=new THREE.PerspectiveCamera(35,this.width/this.height,.1,1000000);this.camera.up.set(0,0,1);
      this.camera.position.set(300,-450,330);
      this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,50,30);this.controls.enableDamping=false;
      this.controls.listenToKeyEvents(this.renderer.domElement);this.controls.addEventListener('change',()=>this.render());
      this.renderer.domElement.addEventListener('keydown',e=>{if(['+','=','-','0'].includes(e.key)){e.preventDefault();if(e.key==='0')this.fit();else this.zoom(e.key==='-'?1/1.2:1.2);}});
      this.grid=new THREE.GridHelper(2000,100,0xc8d3c8,0xe4e8df);this.grid.rotation.x=Math.PI/2;this.grid.position.z=-.08;this.scene.add(this.grid);
      this.axes=new THREE.Group();
      [[0xd17d68,[1000,0,0]],[0x6a9b86,[0,1000,0]],[0x8c9dcb,[0,0,1000]]].forEach(([color,end])=>{
        const endpoint=end as number[];const geom=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...endpoint.map(v=>-v) as Vec),new THREE.Vector3(...endpoint as Vec)]);
        this.axes!.add(new THREE.Line(geom,new THREE.LineBasicMaterial({color:color as number,transparent:true,opacity:.65})));
      });
      this.axes.add(new THREE.AxesHelper(60));
      (['X','Y','Z'] as const).forEach((label,index)=>{
        const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;
        const context=canvas.getContext('2d')!;context.font='500 34px sans-serif';context.textAlign='center';context.textBaseline='middle';context.fillStyle=['#be7661','#4d9071','#7188b7'][index];context.fillText(label,32,32);
        const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),depthTest:false}));
        sprite.position.set(index===0?70:0,index===1?70:0,index===2?70:0);sprite.scale.set(12,12,12);this.axes!.add(sprite);
      });
      this.scene.add(this.axes);
      this.strokes=new THREE.Group();this.scene.add(this.strokes);
      this.marker=new THREE.Group();
      const cone=new THREE.Mesh(new THREE.ConeGeometry(5,15,3),new THREE.MeshBasicMaterial({color:0x16866a}));cone.position.y=3;this.marker.add(cone);
      const fin=new THREE.ArrowHelper(new THREE.Vector3(0,0,1),new THREE.Vector3(),14,0xc1763d,4,3);this.marker.add(fin);
      const side=new THREE.ArrowHelper(new THREE.Vector3(1,0,0),new THREE.Vector3(),11,0x2b6fb3,3,2);this.marker.add(side);
      this.scene.add(this.marker);this.update3d();this.fit();
    } catch { this.renderer?.dispose();this.renderer=undefined;this.webglError.hidden=false; }
  }
  setData(segments:Segment[],turtle:Turtle) { this.segments=segments;this.turtle=turtle; if(this.renderer)this.update3d(); this.render(); }
  setTheme(dark:boolean) { this.dark=dark;if(this.grid) {const materials=Array.isArray(this.grid.material)?this.grid.material:[this.grid.material];materials.forEach(m=>m.color.set(dark?'#303e36':'#dce2d8'));}this.render(); }
  private updateResolution() {this.strokes?.children.forEach(object=>((object as LineSegments2).material as LineMaterial).resolution.set(this.width,this.height));}
  private update3d() {
    if(!this.strokes || !this.marker)return;
    while(this.strokes.children.length) {const child=this.strokes.children[0] as LineSegments2;this.strokes.remove(child);child.geometry.dispose();(child.material as LineMaterial).dispose();}
    // Consecutive style runs keep the original drawing order.
    let group:{key:string;points:number[];color:string;width:number}|undefined;
    const groups:NonNullable<typeof group>[]=[];
    for(const s of this.segments) {const key=`${s.color}/${s.width}`;if(group?.key!==key){group={key,points:[],color:s.color,width:s.width};groups.push(group);}group!.points.push(...s.from,...s.to);}
    for(const g of groups) {
      const geometry=new LineSegmentsGeometry();geometry.setPositions(g.points);
      const material=new LineMaterial({color:g.color,linewidth:g.width,resolution:new THREE.Vector2(this.width,this.height)});
      this.strokes.add(new LineSegments2(geometry,material));
    }
    this.marker.position.set(...this.turtle.position);
    const basis=new THREE.Matrix4().makeBasis(new THREE.Vector3(...this.turtle.right),new THREE.Vector3(...this.turtle.heading),new THREE.Vector3(...this.turtle.up));
    this.marker.quaternion.setFromRotationMatrix(basis);
    (this.marker.children[0] as THREE.Mesh<THREE.BufferGeometry,THREE.MeshBasicMaterial>).material.color.set(this.turtle.color);
  }
  fit() {
    const points:Vec[]=[this.turtle.position,...this.segments.flatMap(s=>[s.from,s.to])];
    const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
    for(const p of points)for(let i=0;i<3;i++){min[i]=Math.min(min[i],p[i]);max[i]=Math.max(max[i],p[i]);}
    const center=min.map((v,i)=>(v+max[i])/2) as Vec;
    if(this.mode==='2d') {this.cx=center[0];this.cy=center[1];this.scale=Math.min((this.width-110)/Math.max(80,max[0]-min[0]),(this.height-110)/Math.max(80,max[1]-min[1]));this.scale=Math.max(.001,Math.min(8,this.scale));}
    else if(this.camera && this.controls) {
      const radius=Math.max(65,Math.hypot(...max.map((v,i)=>v-min[i]))/2);
      const distance=radius/Math.sin(35*Math.PI/360)*1.2/Math.min(1,this.width/this.height);
      this.controls.target.set(...center);this.camera.position.copy(new THREE.Vector3(...center).add(new THREE.Vector3(1.25,-1.8,1.3).normalize().multiplyScalar(distance)));
      this.camera.near=Math.max(.1,distance/10000);this.camera.far=Math.max(10000,distance*100);this.camera.updateProjectionMatrix();this.controls.update();
    }
    this.render();this.onChange?.();
  }
  resetCamera() { this.fit(); }
  zoom(factor:number,x=this.width/2,y=this.height/2) {
    if(this.mode==='2d') {
      const old=this.scale;this.scale=Math.max(.001,Math.min(100,this.scale*factor));
      this.cx+=(x-this.width/2)*(1/old-1/this.scale);this.cy-=(y-this.height/2)*(1/old-1/this.scale);
    } else if(this.camera && this.controls) {this.camera.position.sub(this.controls.target).multiplyScalar(1/factor).add(this.controls.target);this.controls.update();}
    this.render();this.onChange?.();
  }
  get zoomPercent() {return Math.round(this.scale*100);}
  toggleGrid() {this.gridVisible=!this.gridVisible;this.render();}
  render() {
    if(this.mode==='3d') {
      if(this.renderer && this.scene && this.camera) {this.scene.background=new THREE.Color(this.dark?'#1c2520':'#fbfcf7');if(this.grid)this.grid.visible=this.gridVisible;if(this.axes)this.axes.visible=true;this.renderer.render(this.scene,this.camera);}return;
    }
    const c=this.ctx,w=this.width,h=this.height;if(!w || !h)return;
    c.clearRect(0,0,w,h);c.fillStyle=this.dark?'#1c2520':'#fbfcf7';c.fillRect(0,0,w,h);
    const sx=(x:number)=>w/2+(x-this.cx)*this.scale,sy=(y:number)=>h/2-(y-this.cy)*this.scale;
    if(this.gridVisible) {
      const units=20*Math.pow(2,Math.floor(Math.log2(1/this.scale))),spacing=units*this.scale;
      const offsetX=((sx(0)%spacing)+spacing)%spacing,offsetY=((sy(0)%spacing)+spacing)%spacing;
      c.fillStyle=this.dark?'#3a463d':'#dce2d6';
      for(let x=offsetX;x<w;x+=spacing)for(let y=offsetY;y<h;y+=spacing){c.beginPath();c.arc(x,y,.72,0,Math.PI*2);c.fill();}
    }
    const ox=sx(0),oy=sy(0);c.strokeStyle=this.dark?'#3b4940':'#dbe2d7';c.lineWidth=1;c.setLineDash([4,5]);
    c.beginPath();c.moveTo(0,oy);c.lineTo(w,oy);c.moveTo(ox,0);c.lineTo(ox,h);c.stroke();c.setLineDash([]);
    c.lineCap='round';c.lineJoin='round';
    for(const s of this.segments) {c.strokeStyle=s.color;c.lineWidth=s.width*this.scale;c.beginPath();c.moveTo(sx(s.from[0]),sy(s.from[1]));c.lineTo(sx(s.to[0]),sy(s.to[1]));c.stroke();}
    c.fillStyle=this.dark?'#a1b1a4':'#8c9a8b';c.font='10px "DM Mono",monospace';c.fillText('0',ox-12,oy+16);c.fillText('x',w-19,Math.max(18,Math.min(h-12,oy-8)));c.fillText('y',Math.max(8,Math.min(w-18,ox+8)),19);
    c.fillStyle=this.dark?'#b8c6b9':'#9baa97';c.beginPath();c.arc(ox,oy,2.3,0,Math.PI*2);c.fill();
    c.save();c.translate(sx(this.turtle.position[0]),sy(this.turtle.position[1]));c.rotate(Math.atan2(this.turtle.heading[0],this.turtle.heading[1]));
    c.strokeStyle=this.turtle.color;c.lineWidth=1.6;c.fillStyle=this.dark?'#243d30':'#e0eee0';
    c.beginPath();c.moveTo(0,-13);c.lineTo(10,8);c.lineTo(0,4);c.lineTo(-10,8);c.closePath();c.fill();c.stroke();
    c.beginPath();c.moveTo(0,-5);c.lineTo(0,3);c.stroke();c.restore();
  }
  async exportPNG():Promise<Blob> {
    this.render();const canvas=this.mode==='3d'?this.renderer?.domElement:this.canvas;
    if(!canvas)throw new Error('Widok 3D jest niedostępny.');
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Nie udało się zapisać obrazu.')),'image/png'));
  }
}
export function drawThumbnail(canvas:HTMLCanvasElement,segments:Segment[],mode:Mode='2d',dark=false) {
  const width=canvas.clientWidth||230,height=canvas.clientHeight||130,dpr=2;canvas.width=width*dpr;canvas.height=height*dpr;
  const ctx=canvas.getContext('2d')!;ctx.scale(dpr,dpr);ctx.clearRect(0,0,width,height);
  const project=(p:Vec):[number,number]=>mode==='2d'?[p[0],-p[1]]:[p[0]*.8+p[1]*.58,p[0]*.3-p[1]*.4-p[2]*.9];
  const pts=segments.flatMap(s=>[project(s.from),project(s.to)]);if(!pts.length)return;
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const scale=Math.min((width-48)/Math.max(20,maxX-minX),(height-28)/Math.max(20,maxY-minY));
  ctx.lineCap='round';for(const s of segments){const a=project(s.from),b=project(s.to);ctx.strokeStyle=s.color;ctx.globalAlpha=dark?.95:.9;ctx.lineWidth=Math.min(2,s.width*.6);ctx.beginPath();ctx.moveTo((a[0]-(minX+maxX)/2)*scale+width/2,(a[1]-(minY+maxY)/2)*scale+height/2);ctx.lineTo((b[0]-(minX+maxX)/2)*scale+width/2,(b[1]-(minY+maxY)/2)*scale+height/2);ctx.stroke();}
}
