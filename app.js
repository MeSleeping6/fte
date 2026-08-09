(() => {
"use strict";

const NS="http://www.w3.org/2000/svg";
const $=id=>document.getElementById(id);
const svg=$("tree"), viewport=$("viewport"), lines=$("lines"), peopleLayer=$("people"), drawing=$("drawing");
const panel=$("panel"), mini=$("minimap"), miniCanvas=$("miniCanvas"), mctx=miniCanvas.getContext("2d");

let data=null;
let selectedPerson=null, selectedLine=null;
let mode="select";
let zoom=.75, panX=40, panY=30;
let history=[], hIndex=-1;
let panning=false, panStart=null;
let lineDrag=null;
let drawingLine=false, drawA=null, drawB=null;
let draftTimer=null;

function uid(prefix){ return prefix+"_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7); }
function clone(x){return JSON.parse(JSON.stringify(x));}
function person(id){return data.people.find(p=>p.id===id);}
function line(id){return data.segments.find(s=>s.id===id);}
function nameOf(p){return [p.first,p.middle,p.last].filter(Boolean).join(" ").trim();}
function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function svgEl(tag,attrs={}){
  const e=document.createElementNS(NS,tag);
  for(const [k,v] of Object.entries(attrs)) e.setAttribute(k,v);
  return e;
}
function saveHistory(){
  history=history.slice(0,hIndex+1);
  history.push(clone(data));
  if(history.length>100)history.shift();
  hIndex=history.length-1;
  buttonsState();
}
function restoreHistory(i){
  if(i<0||i>=history.length)return;
  data=clone(history[i]);selectedPerson=null;selectedLine=null;render();closePanel();
}
function undo(){if(hIndex>0){hIndex--;restoreHistory(hIndex)}}
function redo(){if(hIndex<history.length-1){hIndex++;restoreHistory(hIndex)}}
function buttonsState(){
  $("undoBtn").disabled=hIndex<=0;
  $("redoBtn").disabled=hIndex>=history.length-1;
}

function colorFor(p){
  return ({
    paternal:"#2f5a73",maternal:"#8c3a34",merge:"#32745a",
    collateral:"#9b8456",unknown:"#c9c0ad"
  })[p.category]||"#c9c0ad";
}

function render(){
  renderLines();renderPeople();updateView();drawMini();buttonsState();
}

function renderLines(){
  lines.innerHTML="";
  for(const s of data.segments){
    const g=svgEl("g",{"data-line":s.id});
    const hit=svgEl("line",{x1:s.x1,y1:s.y1,x2:s.x2,y2:s.y2,class:"line-hit"});
    const vis=svgEl("line",{x1:s.x1,y1:s.y1,x2:s.x2,y2:s.y2,class:"line"+(selectedLine===s.id?" selected":"")});
    g.append(hit,vis);lines.appendChild(g);
    hit.addEventListener("pointerdown",e=>{
      if(mode!=="select")return;
      e.stopPropagation();selectLine(s.id);startLineDrag(e,s.id);
    });
    vis.addEventListener("click",e=>{e.stopPropagation();if(mode==="select")selectLine(s.id)});
  }
}

function renderPeople(){
  peopleLayer.innerHTML="";
  for(const p of data.people){
    const g=svgEl("g",{
      class:"person"+(p.placeholder?" placeholder":"")+(selectedPerson===p.id?" selected":""),
      transform:`translate(${p.x} ${p.y})`, "data-person":p.id
    });
    g.appendChild(svgEl("circle",{r:p.radius||24,class:"person-circle",fill:colorFor(p)}));

    const nm=svgEl("text",{class:"name",x:0,y:(p.radius||24)+20});
    nm.textContent=nameOf(p)||"";
    g.appendChild(nm);

    (p.info||[]).forEach((txt,i)=>{
      const t=svgEl("text",{class:"info",x:0,y:(p.radius||24)+33+i*11});
      t.textContent=txt;
      g.appendChild(t);
    });

    if(p.placeholder){
      const mark=svgEl("text",{x:0,y:4,"text-anchor":"middle",fill:"#716a5f","font-size":"16"});
      mark.textContent="?";
      g.appendChild(mark);
    }

    g.addEventListener("click",e=>{e.stopPropagation();selectPerson(p.id)});
    peopleLayer.appendChild(g);
  }
}

function selectPerson(id){
  selectedPerson=id;selectedLine=null;render();openPersonPanel(person(id));
  $("tip").textContent="Person selected • edit their name/info on the left";
}
function selectLine(id){
  selectedLine=id;selectedPerson=null;render();openLinePanel(line(id));
  $("tip").textContent="Line selected • drag it in its direction or delete it";
}
function closePanel(){panel.classList.add("closed");panel.innerHTML="";}

function openPersonPanel(p){
  panel.classList.remove("closed");
  panel.innerHTML=`
  <div class="panel-body">
    <h2>${p.placeholder?"Blank person":"Edit person"}</h2>
    <div class="sub">${p.placeholder?"This gray placeholder keeps the tree's connections intact.":"Changes appear directly on the tree."}</div>

    <div class="field"><label>First name</label><input id="f" value="${esc(p.first)}" autocomplete="off"></div>
    <div class="field"><label>Middle name (optional)</label><input id="m" value="${esc(p.middle)}" autocomplete="off"></div>
    <div class="field"><label>Last name</label><input id="l" value="${esc(p.last)}" autocomplete="off"></div>

    <div class="field">
      <label>Information under circle — press Enter for another line</label>
      <textarea id="info" placeholder="Birth/death date, etc.">${esc((p.info||[]).join("\\n"))}</textarea>
    </div>

    <div class="field">
      <label>Circle category</label>
      <select id="cat">
        <option value="paternal" ${p.category==="paternal"?"selected":""}>Paternal</option>
        <option value="maternal" ${p.category==="maternal"?"selected":""}>Maternal</option>
        <option value="merge" ${p.category==="merge"?"selected":""}>Merge</option>
        <option value="collateral" ${p.category==="collateral"?"selected":""}>Collateral</option>
        <option value="unknown" ${p.category==="unknown"?"selected":""}>Unknown / placeholder</option>
      </select>
    </div>

    <div class="panel-section">
      <div class="section-title">Add connection</div>
      <div class="grid">
        <button class="action" id="parents">＋ Parents</button>
        <button class="action" id="sibling">＋ Sibling</button>
        <button class="action" id="spouse">＋ Spouse</button>
        <button class="action" id="child">＋ Child</button>
      </div>
      <div class="note">Each option adds a new placeholder person and automatically creates an initial straight/orthogonal connection. You can then edit the new person.</div>
    </div>

    <div class="panel-section">
      <div class="section-title">Person controls</div>
      <div class="grid">
        <button class="action" id="focus">Focus</button>
        <button class="action" id="lock">${p.locked?"Unlock":"Lock"}</button>
        <button class="action danger full" id="remove">${p.placeholder?"Delete placeholder":"Remove person → keep blank placeholder"}</button>
      </div>
    </div>

    <div class="note">A removed person is never allowed to break the existing connector layout. Their circle becomes a gray placeholder.</div>
  </div>`;

  const f=$("f"),m=$("m"),l=$("l"),info=$("info"),cat=$("cat");
  const typeTimer=()=>{clearTimeout(draftTimer);draftTimer=setTimeout(saveHistory,800)};
  [f,m,l].forEach(inp=>inp.addEventListener("input",()=>{
    p.first=f.value;p.middle=m.value;p.last=l.value;p.placeholder=false;render();typeTimer();
  }));
  info.addEventListener("input",()=>{
    p.info=info.value.replace(/\r/g,"").split("\n");render();typeTimer();
  });
  cat.addEventListener("change",()=>{p.category=cat.value;p.placeholder=cat.value==="unknown"&&nameOf(p)==="";saveHistory();render()});

  $("parents").onclick=()=>addParents(p);
  $("sibling").onclick=()=>addConnection(p,"sibling");
  $("spouse").onclick=()=>addConnection(p,"spouse");
  $("child").onclick=()=>addConnection(p,"child");
  $("focus").onclick=()=>focus(p);
  $("lock").onclick=()=>{p.locked=!p.locked;saveHistory();openPersonPanel(p);render()};
  $("remove").onclick=()=>removePerson(p);
}

function openLinePanel(s){
  panel.classList.remove("closed");
  const horizontal=Math.abs(s.y2-s.y1)<.5;
  panel.innerHTML=`
  <div class="panel-body">
    <h2>Line</h2>
    <div class="sub">Individual connector segment</div>
    <div class="help">${horizontal?"Horizontal line: drag it up or down.":"Vertical line: drag it left or right."} The segment stays perfectly straight.</div>
    <div class="panel-section">
      <div class="section-title">Line controls</div>
      <div class="grid"><button class="action danger full" id="deleteLine">Delete this line</button></div>
    </div>
    <div class="note">Use <b>Draw</b> in the top toolbar to draw a new line. New drawn connections snap to a clean orthogonal shape.</div>
  </div>`;
  $("deleteLine").onclick=()=>{
    saveHistory();data.segments=data.segments.filter(x=>x.id!==s.id);
    selectedLine=null;render();closePanel();
  };
}

function addPerson(x,y,category="unknown"){
  const p={id:uid("p"),first:"",middle:"",last:"",info:[],x,y,radius:24,category,placeholder:true,locked:false};
  data.people.push(p);return p;
}
function addSegment(x1,y1,x2,y2){data.segments.push({id:uid("s"),x1,y1,x2,y2});}

function addParents(p){
  if(p.locked)return;
  saveHistory();
  const gap=180, py=p.y-190;
  const a=addPerson(p.x-gap/1.8,py,p.category==="maternal"?"maternal":p.category);
  const b=addPerson(p.x+gap/1.8,py,p.category==="paternal"?"paternal":p.category);
  connectParentToChild(a,p);connectParentToChild(b,p);
  selectedPerson=a.id;selectedLine=null;render();openPersonPanel(a);
}
function addConnection(p,type){
  if(p.locked)return;
  saveHistory();
  let np;
  if(type==="spouse"){
    np=addPerson(p.x+150,p.y,p.category);
    addSegment(p.x+(p.radius||24),p.y,np.x-(np.radius||24),np.y);
  }else if(type==="sibling"){
    np=addPerson(p.x+190,p.y,p.category);
    const barY=p.y-70;
    addSegment(p.x,p.y-24,p.x,barY);
    addSegment(p.x,barY,np.x,barY);
    addSegment(np.x,barY,np.x,np.y-24);
  }else{
    np=addPerson(p.x,p.y+190,p.category);
    connectParentToChild(p,np);
  }
  selectedPerson=np.id;selectedLine=null;render();openPersonPanel(np);
}
function connectParentToChild(parent,child){
  const y=(parent.y+child.y)/2;
  const up=child.y>parent.y;
  addSegment(parent.x,parent.y+(up?24:-24),parent.x,y);
  addSegment(parent.x,y,child.x,y);
  addSegment(child.x,y,child.x,child.y+(up?-24:24));
}
function removePerson(p){
  saveHistory();
  if(p.placeholder){data.people=data.people.filter(x=>x.id!==p.id)}
  else{p.first="";p.middle="";p.last="";p.info=[];p.placeholder=true;p.category="unknown"}
  selectedPerson=null;render();closePanel();
}

function startLineDrag(e,id){
  const s=line(id);if(!s)return;
  lineDrag={id,startX:e.clientX,startY:e.clientY,orig:clone(s),horizontal:Math.abs(s.y2-s.y1)<.5,pushed:false};
  window.addEventListener("pointermove",dragLine);
  window.addEventListener("pointerup",endLineDrag,{once:true});
}
function dragLine(e){
  if(!lineDrag)return;
  const s=line(lineDrag.id);if(!s)return;
  if(!lineDrag.pushed){saveHistory();lineDrag.pushed=true}
  if(lineDrag.horizontal){
    const dy=(e.clientY-lineDrag.startY)/zoom,sY=lineDrag.orig.y1+dy;
    s.y1=sY;s.y2=sY;
  }else{
    const dx=(e.clientX-lineDrag.startX)/zoom,sX=lineDrag.orig.x1+dx;
    s.x1=sX;s.x2=sX;
  }
  render();
}
function endLineDrag(){
  window.removeEventListener("pointermove",dragLine);lineDrag=null;
}

function setMode(next){
  mode=next;
  $("selectBtn").classList.toggle("active",next==="select");
  $("drawBtn").classList.toggle("active",next==="draw");
  viewport.style.cursor=next==="draw"?"crosshair":"grab";
  $("tip").textContent=next==="draw"?"Draw: click-drag a new orthogonal line":"Click a person to edit • Drag empty space to move around • Wheel to zoom";
}
function world(e){
  const r=viewport.getBoundingClientRect();
  return{x:(e.clientX-r.left-panX)/zoom,y:(e.clientY-r.top-panY)/zoom};
}
function orthPath(a,b){
  // Always produce straight horizontal/vertical segments with one 90-degree corner.
  const midX=Math.round(((a.x+b.x)/2)/5)*5;
  return [
    {x1:a.x,y1:a.y,x2:midX,y2:a.y},
    {x1:midX,y1:a.y,x2:midX,y2:b.y},
    {x1:midX,y1:b.y,x2:b.x,y2:b.y}
  ];
}

viewport.addEventListener("pointerdown",e=>{
  if(e.button!==0)return;
  if(mode==="draw"){
    drawingLine=true;drawA=world(e);drawB=drawA;drawing.innerHTML="";return;
  }
  if(e.target.closest(".person")||e.target.closest(".line-hit"))return;
  selectedPerson=null;selectedLine=null;render();closePanel();
  panning=true;panStart={x:e.clientX,y:e.clientY,px:panX,py:panY};viewport.classList.add("grabbing");
});
window.addEventListener("pointermove",e=>{
  if(drawingLine){
    drawB=world(e);drawing.innerHTML="";
    orthPath(drawA,drawB).forEach(s=>drawing.appendChild(svgEl("line",{x1:s.x1,y1:s.y1,x2:s.x2,y2:s.y2,class:"draw-path"})));
    return;
  }
  if(panning){
    panX=panStart.px+(e.clientX-panStart.x);panY=panStart.py+(e.clientY-panStart.y);updateView();drawMini();
  }
});
window.addEventListener("pointerup",()=>{
  if(drawingLine){
    drawingLine=false;drawing.innerHTML="";
    if(drawA&&drawB){
      const dx=Math.abs(drawB.x-drawA.x),dy=Math.abs(drawB.y-drawA.y);
      if(dx>5||dy>5){
        saveHistory();orthPath(drawA,drawB).forEach(s=>addSegment(s.x1,s.y1,s.x2,s.y2));render();
      }
    }
    drawA=drawB=null;
  }
  if(panning){panning=false;viewport.classList.remove("grabbing")}
});

viewport.addEventListener("wheel",e=>{
  e.preventDefault();
  const before=world(e),factor=e.deltaY<0?1.12:.89;
  const nz=Math.max(.1,Math.min(5,zoom*factor));
  const r=viewport.getBoundingClientRect();
  zoom=nz;panX=e.clientX-r.left-before.x*zoom;panY=e.clientY-r.top-before.y*zoom;
  updateView();drawMini();
},{passive:false});

function updateView(){
  svg.style.transform=`translate(${panX}px,${panY}px) scale(${zoom})`;
  $("zoomValue").textContent=Math.round(zoom*100)+"%";
}
function zoomBy(f){zoom=Math.max(.1,Math.min(5,zoom*f));updateView();drawMini()}
function fit(){
  const r=viewport.getBoundingClientRect(),pad=70;
  zoom=Math.min((r.width-pad)/data.canvas.width,(r.height-pad)/data.canvas.height,1.2);
  panX=(r.width-data.canvas.width*zoom)/2;panY=(r.height-data.canvas.height*zoom)/2;
  updateView();drawMini();
}
function focus(p){
  const r=viewport.getBoundingClientRect();
  zoom=Math.max(.7,Math.min(1.5,zoom));
  panX=r.width/2-p.x*zoom;panY=r.height/2-p.y*zoom;updateView();drawMini();
}
function drawMini(){
  const w=miniCanvas.width,h=miniCanvas.height;
  mctx.clearRect(0,0,w,h);mctx.fillStyle="#fbf7ee";mctx.fillRect(0,0,w,h);
  const s=Math.min(w/data.canvas.width,h/data.canvas.height);
  mctx.strokeStyle="#b8ad98";mctx.lineWidth=1;
  data.segments.forEach(x=>{mctx.beginPath();mctx.moveTo(x.x1*s,x.y1*s);mctx.lineTo(x.x2*s,x.y2*s);mctx.stroke()});
  data.people.forEach(p=>{mctx.beginPath();mctx.arc(p.x*s,p.y*s,2.1,0,Math.PI*2);mctx.fillStyle=colorFor(p);mctx.fill()});
  const r=viewport.getBoundingClientRect(),vx=-panX/zoom,vy=-panY/zoom,vw=r.width/zoom,vh=r.height/zoom;
  mctx.strokeStyle="#2d2924";mctx.lineWidth=1.2;mctx.strokeRect(vx*s,vy*s,vw*s,vh*s);
}
miniCanvas.addEventListener("click",e=>{
  const r=miniCanvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*data.canvas.width,y=(e.clientY-r.top)/r.height*data.canvas.height;
  const vr=viewport.getBoundingClientRect();panX=vr.width/2-x*zoom;panY=vr.height/2-y*zoom;updateView();drawMini();
});

$("selectBtn").onclick=()=>setMode("select");
$("drawBtn").onclick=()=>setMode("draw");
$("undoBtn").onclick=undo;
$("redoBtn").onclick=redo;
$("zoomOut").onclick=()=>zoomBy(.8);
$("zoomIn").onclick=()=>zoomBy(1.25);
$("fitBtn").onclick=fit;
$("mapBtn").onclick=()=>mini.classList.toggle("hidden");

$("addBtn").onclick=()=>{
  saveHistory();
  const r=viewport.getBoundingClientRect();
  const p=addPerson((r.width/2-panX)/zoom,(r.height/2-panY)/zoom,"unknown");
  selectedPerson=p.id;selectedLine=null;render();openPersonPanel(p);
};

$("saveBtn").onclick=()=>{
  localStorage.setItem("fte-family-tree",JSON.stringify(data));
  $("tip").textContent="Saved in this browser.";
};
$("exportBtn").onclick=()=>{
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="family-tree.json";a.click();URL.revokeObjectURL(url);
};

window.addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();e.shiftKey?redo():undo()}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){e.preventDefault();redo()}
  if(e.key==="Escape"){setMode("select");closePanel()}
});

async function init(){
  try{
    const saved=localStorage.getItem("fte-family-tree");
    if(saved)data=JSON.parse(saved);
  }catch(_){}
  if(!data){
    const response=await fetch("family-tree.json",{cache:"no-store"});
    data=await response.json();
  }
  if(!data.people||!data.segments)throw new Error("Invalid family-tree.json");
  history=[clone(data)];hIndex=0;
  render();setMode("select");
  setTimeout(fit,80);
}
init().catch(err=>{
  console.error(err);
  $("tip").textContent="Could not load family-tree.json. Check that it is in the repository root.";
});
})();
