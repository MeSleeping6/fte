/* V4 CORE — state, history, persistence, geometry, and DOM utilities. */
export const SVG_NS = 'http://www.w3.org/2000/svg';
export const STORAGE_KEY = 'fte-family-tree-editor-v5-state';
export const COLORS = {
  paternal: '#2F5A73',
  maternal: '#8C3A34',
  merge: '#2F7358',
  unknown: '#C7BEA8',
  collateral: '#9C8659'
};
export function qs(selector, root=document){ return root.querySelector(selector); }
export function qsa(selector, root=document){ return Array.from(root.querySelectorAll(selector)); }
export function svgEl(tag, attrs={}){
  const el=document.createElementNS(SVG_NS,tag);
  Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,String(value)));
  return el;
}
export function uid(prefix='id'){
  return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
}
export function clone(value){ return JSON.parse(JSON.stringify(value)); }
export function clamp(value,min,max){ return Math.max(min,Math.min(max,value)); }
export function distance(a,b){ return Math.hypot(b.x-a.x,b.y-a.y); }
export function splitLines(value){
  return String(value ?? '').replace(/\r/g,'').split('\n');
}
export function joinLines(lines){ return (lines || []).join('\n'); }
export function fullName(person){
  return [person.first,person.middle,person.last].filter(Boolean).join(' ').trim();
}
export function safeText(value){ return String(value ?? ''); }
export function pointFromClient(event, element, zoom, panX, panY){
  const rect=element.getBoundingClientRect();
  return {x:(event.clientX-rect.left-panX)/zoom,y:(event.clientY-rect.top-panY)/zoom};
}
export function isHorizontal(line){ return Math.abs(line.y2-line.y1) <= 0.5; }
export function isVertical(line){ return Math.abs(line.x2-line.x1) <= 0.5; }
export function lineLength(line){ return Math.hypot(line.x2-line.x1,line.y2-line.y1); }
export function normalizeLine(line){
  const copy=clone(line);
  if(isHorizontal(copy)) copy.y2=copy.y1;
  if(isVertical(copy)) copy.x2=copy.x1;
  return copy;
}
export function centerOfLine(line){ return {x:(line.x1+line.x2)/2,y:(line.y1+line.y2)/2}; }
export function rectForPoints(points){
  const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
  return {minX:Math.min(...xs),minY:Math.min(...ys),maxX:Math.max(...xs),maxY:Math.max(...ys)};
}
export function makeInitialState(svg){
  const people=[];
  const circles=Array.from(svg.querySelectorAll('circle'));
  circles.forEach((circle,index)=>{
    const group=findPersonGroup(circle);
    const texts=group ? Array.from(group.querySelectorAll('text')) : [];
    const nameText=texts.find(t=>t.classList.contains('nm'));
    const infoTexts=texts.filter(t=>!t.classList.contains('nm'));
    const name=(nameText?.textContent || '').trim();
    const parts=name.split(/\s+/).filter(Boolean);
    let first='',middle='',last='';
    if(parts.length===1) first=parts[0];
    else if(parts.length===2){ first=parts[0];last=parts[1]; }
    else { first=parts[0];last=parts.at(-1);middle=parts.slice(1,-1).join(' '); }
    const fill=circle.getAttribute('fill') || 'var(--unknown)';
    people.push({
      id:'person_'+String(index+1),
      first,middle,last,
      info:infoTexts.map(t=>t.textContent.trim()),
      x:Number(circle.getAttribute('cx')||0),
      y:Number(circle.getAttribute('cy')||0),
      radius:Number(circle.getAttribute('r')||24),
      category:categoryFromFill(fill),
      placeholder:false,
      locked:false,
      domIndex:index
    });
  });
  const segments=[];
  Array.from(svg.querySelectorAll('line')).forEach((line,index)=>{
    segments.push({
      id:'segment_'+String(index+1),
      x1:Number(line.getAttribute('x1')||0),
      y1:Number(line.getAttribute('y1')||0),
      x2:Number(line.getAttribute('x2')||0),
      y2:Number(line.getAttribute('y2')||0),
      original:true,
      locked:false
    });
  });
  return {version:5,people,segments,meta:{width:Number(svg.getAttribute('width')||3300),height:Number(svg.getAttribute('height')||1360)}};
}
export function categoryFromFill(fill){
  if(fill.includes('pat')) return 'paternal';
  if(fill.includes('mat')) return 'maternal';
  if(fill.includes('merge')) return 'merge';
  if(fill.includes('collateral')) return 'collateral';
  return 'unknown';
}
export function findPersonGroup(circle){
  let node=circle.parentElement;
  while(node && node.tagName.toLowerCase()!=='svg'){
    const circles=node.querySelectorAll(':scope > circle');
    if(circles.length===1) return node;
    node=node.parentElement;
  }
  return circle.parentElement;
}
export function getPerson(state,id){ return state.people.find(person=>person.id===id) || null; }
export function getSegment(state,id){ return state.segments.find(segment=>segment.id===id) || null; }
export function addPersonRecord(state,record){ state.people.push(record); return record; }
export function addSegmentRecord(state,record){ state.segments.push(record); return record; }
export function createPerson(x,y,category='unknown'){
  return {id:uid('person'),first:'',middle:'',last:'',info:[],x,y,radius:24,category,placeholder:true,locked:false,domIndex:null};
}
export function createSegment(x1,y1,x2,y2,extra={}){
  return normalizeLine({id:uid('segment'),x1,y1,x2,y2,original:false,locked:false,...extra});
}
export function snapshot(state){ return clone(state); }
export function serialize(state){ return JSON.stringify(state); }
export function deserialize(text){
  const parsed=JSON.parse(text);
  if(!parsed || !Array.isArray(parsed.people) || !Array.isArray(parsed.segments)) throw new Error('Invalid family-tree editor file.');
  return parsed;
}
export class History{
  constructor(initial,max=200){ this.items=[snapshot(initial)];this.index=0;this.max=max; }
  current(){ return snapshot(this.items[this.index]); }
  canUndo(){ return this.index>0; }
  canRedo(){ return this.index<this.items.length-1; }
  push(state){
    const next=snapshot(state);
    this.items=this.items.slice(0,this.index+1);
    this.items.push(next);
    if(this.items.length>this.max)this.items.shift();
    this.index=this.items.length-1;
  }
  undo(){ if(!this.canUndo())return null;this.index--;return this.current(); }
  redo(){ if(!this.canRedo())return null;this.index++;return this.current(); }
  reset(state){ this.items=[snapshot(state)];this.index=0; }
}
export class Store{
  constructor(key=STORAGE_KEY){ this.key=key; }
  load(){
    const raw=localStorage.getItem(this.key);
    if(!raw)return null;
    try{return deserialize(raw);}catch(error){console.warn('Ignoring invalid saved state',error);return null;}
  }
  save(state){ localStorage.setItem(this.key,serialize(state)); }
  clear(){ localStorage.removeItem(this.key); }
  has(){ return localStorage.getItem(this.key)!==null; }
}
export class ViewportState{
  constructor(){ this.zoom=.55;this.panX=30;this.panY=10;this.minZoom=.1;this.maxZoom=5; }
  setZoom(value){this.zoom=clamp(value,this.minZoom,this.maxZoom);}
  zoomBy(factor){this.setZoom(this.zoom*factor);}
  setPan(x,y){this.panX=x;this.panY=y;}
  panBy(dx,dy){this.panX+=dx;this.panY+=dy;}
  worldToScreen(point){return{x:point.x*this.zoom+this.panX,y:point.y*this.zoom+this.panY};}
  screenToWorld(point){return{x:(point.x-this.panX)/this.zoom,y:(point.y-this.panY)/this.zoom};}
}
export function orthogonalSegments(start,end){
  const middleX=Math.round(((start.x+end.x)/2)/5)*5;
  const segments=[];
  if(Math.abs(middleX-start.x)>2)segments.push(createSegment(start.x,start.y,middleX,start.y));
  if(Math.abs(end.y-start.y)>2)segments.push(createSegment(middleX,start.y,middleX,end.y));
  if(Math.abs(end.x-middleX)>2)segments.push(createSegment(middleX,end.y,end.x,end.y));
  return segments;
}
export function directHorizontal(a,b){return createSegment(a.x,a.y,b.x,a.y);}
export function directVertical(a,b){return createSegment(a.x,a.y,a.x,b.y);}
export function removeById(array,id){return array.filter(item=>item.id!==id);}
export function replaceById(array,id,value){return array.map(item=>item.id===id?value:item);}
export function findNearestPerson(state,point,maxDistance=100){
  let best=null,bestDistance=maxDistance;
  for(const person of state.people){const d=distance(person,point);if(d<bestDistance){best=person;bestDistance=d;}}
  return best;
}
export function estimatePersonBounds(person){
  return {left:person.x-person.radius,right:person.x+person.radius,top:person.y-person.radius,bottom:person.y+person.radius};
}
export function pointInsidePerson(person,point,padding=0){return distance(person,point)<=person.radius+padding;}
export function lineAtPoint(line,point,tolerance=10){
  if(isHorizontal(line)) return point.y>=Math.min(line.y1,line.y2)-tolerance && point.y<=Math.max(line.y1,line.y2)+tolerance && Math.abs(point.y-line.y1)<=tolerance;
  if(isVertical(line)) return point.x>=Math.min(line.x1,line.x2)-tolerance && point.x<=Math.max(line.x1,line.x2)+tolerance && Math.abs(point.x-line.x1)<=tolerance;
  const dx=line.x2-line.x1,dy=line.y2-line.y1;
  const len=Math.hypot(dx,dy);if(!len)return distance(point,line)<=tolerance;
  const t=clamp(((point.x-line.x1)*dx+(point.y-line.y1)*dy)/(len*len),0,1);
  return distance(point,{x:line.x1+t*dx,y:line.y1+t*dy})<=tolerance;
}
export function formatCoordinate(value){return Number(value).toFixed(1);}
export function copyText(text){
  if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(text);
  const area=document.createElement('textarea');area.value=text;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();return Promise.resolve();
}
export function downloadText(filename,text,type='application/json'){
  const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
}
