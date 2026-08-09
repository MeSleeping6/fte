/* V4 CONTROLLER — interaction, panel, editing, selection, lines, draw mode. */
import {qs,svgEl,clone,fullName,splitLines,getPerson,getSegment,History,Store,ViewportState,pointFromClient,isHorizontal,isVertical,orthogonalSegments,createPerson,createSegment,addPersonRecord,addSegmentRecord,removeById,clamp,downloadText,serialize,deserialize,COLORS} from './core.js';
import {TreeRenderer} from './renderer.js';
import {RelationshipBuilder} from './relations.js';
export class FamilyTreeEditor{
  constructor(svg,state){
    this.svg=svg;
    this.state=state;
    this.originalState=clone(state);
    this.history=new History(state,250);
    this.store=new Store();
    this.view=new ViewportState();
    this.renderer=new TreeRenderer(svg,state);
    this.relations=new RelationshipBuilder(state,this.renderer);
    this.selection={personId:null,lineId:null};
    this.mode='select';
    this.panel=qs('#panel');
    this.canvas=qs('#canvasWrap');
    this.toastElement=qs('#toast');
    this.map=qs('#minimap');
    this.mapCanvas=qs('#mapCanvas');
    this.drag=null;
    this.panDrag=null;
    this.draw=null;
    this.movePersonDrag=null;
    this.dirty=false;
    this.init();
  }
  init(){
    this.renderer.initializeOriginalDom();
    this.bindToolbar();
    this.bindCanvas();
    this.render();
    this.fit();
    this.updateHistoryButtons();
    this.updateStatus('Original tree loaded — 59 people and 83 original connector segments');
  }
  bindToolbar(){
    qs('#selectTool').addEventListener('click',()=>this.setMode('select'));
    qs('#drawTool').addEventListener('click',()=>this.setMode('draw'));
    qs('#moveTool').addEventListener('click',()=>this.setMode('move'));
    qs('#undoBtn').addEventListener('click',()=>this.undo());
    qs('#redoBtn').addEventListener('click',()=>this.redo());
    qs('#zoomOut').addEventListener('click',()=>this.zoomAroundCenter(.8));
    qs('#zoomIn').addEventListener('click',()=>this.zoomAroundCenter(1.25));
    qs('#fitBtn').addEventListener('click',()=>this.fit());
    qs('#newPersonBtn').addEventListener('click',()=>this.newPersonAtCenter());
    qs('#mapBtn').addEventListener('click',()=>qs('#minimap').classList.toggle('hidden'));
    qs('#saveBtn').addEventListener('click',()=>this.save());
    qs('#resetBtn').addEventListener('click',()=>this.reset());
    qs('#exportBtn').addEventListener('click',()=>this.export());
    qs('#importBtn').addEventListener('click',()=>qs('#importFile').click());
    qs('#importFile').addEventListener('change',event=>this.importFile(event));
  }
  bindCanvas(){
    this.canvas.addEventListener('pointerdown',event=>this.onPointerDown(event));
    window.addEventListener('pointermove',event=>this.onPointerMove(event));
    window.addEventListener('pointerup',event=>this.onPointerUp(event));
    this.canvas.addEventListener('wheel',event=>this.onWheel(event),{passive:false});
    this.canvas.addEventListener('click',event=>this.onCanvasClick(event));
    window.addEventListener('keydown',event=>this.onKeyDown(event));
    window.addEventListener('resize',()=>this.drawMap());
  }
  setMode(mode){
    this.mode=mode;
    ['select','draw','move'].forEach(name=>qs('#'+name+'Tool').classList.toggle('active',name===mode));
    this.canvas.classList.toggle('draw-mode',mode==='draw');
    this.updateHelp();
  }
  updateHelp(){
    const text=this.mode==='draw'?'Draw line: drag to create a straight orthogonal path · release to commit':this.mode==='move'?'Move person: drag a person to reposition it':'Click a person to edit · drag a connector in its allowed direction · drag empty space to pan · wheel to zoom';
    qs('#helpStrip').textContent=text;
  }
  render(){this.renderer.setState(this.state);this.renderer.render(this.selection);this.updateTransform();this.drawMap();}
  commit(label='Change'){
    this.history.push(this.state);this.dirty=true;this.updateHistoryButtons();this.updateStatus(label);
  }
  replaceState(state,label='State changed'){
    this.state=state;this.relations.state=state;this.renderer.setState(state);this.commit(label);this.render();
  }
  selectPerson(id){
    this.selection={personId:id,lineId:null};
    this.renderer.render(this.selection);
    this.openPersonPanel(getPerson(this.state,id));
    this.updateStatus('Selected person');
  }
  selectLine(id){
    this.selection={personId:null,lineId:id};
    this.renderer.render(this.selection);
    this.openLinePanel(getSegment(this.state,id));
    this.updateStatus('Selected connector');
  }
  clearSelection(){this.selection={personId:null,lineId:null};this.closePanel();this.renderer.render(this.selection);}
  onCanvasClick(event){
    if(event.target.closest('.person-hit')||event.target.closest('.fte-new-person')||event.target.closest('.line-hit'))return;
    if(this.mode==='select')this.clearSelection();
  }
  onPointerDown(event){
    if(event.button!==0)return;
    const personHit=event.target.closest('.person-hit,.fte-new-person');
    const lineHit=event.target.closest('.line-hit');
    if(this.mode==='draw'){
      if(personHit||lineHit)return;
      const start=this.clientToWorld(event);
      this.draw={start,current:start};
      this.renderDrawPreview();
      return;
    }
    if(lineHit&&this.mode==='select'){
      const id=lineHit.dataset.segmentId;
      this.selectLine(id);
      this.beginLineDrag(event,id);
      return;
    }
    if(personHit){
      const id=personHit.dataset.personId;
      const person=getPerson(this.state,id);
      if(!person)return;
      if(this.mode==='move'){
        if(person.locked)return;
        this.selectPerson(id);
        this.beginPersonDrag(event,id);
      }else{
        this.selectPerson(id);
      }
      return;
    }
    if(this.mode==='select'){
      this.panDrag={startX:event.clientX,startY:event.clientY,panX:this.view.panX,panY:this.view.panY};
      this.canvas.classList.add('grabbing');
    }
  }
  onPointerMove(event){
    if(this.draw){this.draw.current=this.clientToWorld(event);this.renderDrawPreview();return;}
    if(this.drag){this.moveLine(event);return;}
    if(this.movePersonDrag){this.movePerson(event);return;}
    if(this.panDrag){this.view.setPan(this.panDrag.panX+event.clientX-this.panDrag.startX,this.panDrag.panY+event.clientY-this.panDrag.startY);this.updateTransform();this.drawMap();}
  }
  onPointerUp(event){
    if(this.draw){this.finishDraw();return;}
    if(this.drag){this.finishLineDrag();return;}
    if(this.movePersonDrag){this.finishPersonDrag();return;}
    if(this.panDrag){this.panDrag=null;this.canvas.classList.remove('grabbing');}
  }
  beginLineDrag(event,id){
    const line=getSegment(this.state,id);if(!line||line.locked)return;
    this.drag={id,origin:clone(line),startX:event.clientX,startY:event.clientY,changed:false};
  }
  moveLine(event){
    const drag=this.drag;const line=getSegment(this.state,drag.id);if(!line)return;
    if(!drag.changed){this.history.push(this.state);drag.changed=true;this.dirty=true;}
    const dx=(event.clientX-drag.startX)/this.view.zoom;
    const dy=(event.clientY-drag.startY)/this.view.zoom;
    if(isHorizontal(drag.origin)){line.y1=drag.origin.y1+dy;line.y2=line.y1;}
    else if(isVertical(drag.origin)){line.x1=drag.origin.x1+dx;line.x2=line.x1;}
    else{line.x1=drag.origin.x1+dx;line.x2=drag.origin.x2+dx;line.y1=drag.origin.y1+dy;line.y2=drag.origin.y2+dy;}
    this.renderer.render(this.selection);this.updateTransform();this.drawMap();
  }
  finishLineDrag(){
    this.drag=null;this.updateHistoryButtons();this.updateStatus('Connector moved');
  }
  beginPersonDrag(event,id){
    const person=getPerson(this.state,id);if(!person)return;
    this.movePersonDrag={id,startX:event.clientX,startY:event.clientY,originX:person.x,originY:person.y,changed:false};
  }
  movePerson(event){
    const d=this.movePersonDrag;const person=getPerson(this.state,d.id);if(!person)return;
    if(!d.changed){this.history.push(this.state);d.changed=true;this.dirty=true;}
    person.x=d.originX+(event.clientX-d.startX)/this.view.zoom;
    person.y=d.originY+(event.clientY-d.startY)/this.view.zoom;
    this.renderer.render(this.selection);this.updateTransform();this.drawMap();
  }
  finishPersonDrag(){this.movePersonDrag=null;this.updateHistoryButtons();this.updateStatus('Person moved');}
  renderDrawPreview(){
    let preview=qs('#drawPreview');
    if(!preview){preview=svgEl('g',{id:'drawPreview'});this.svg.appendChild(preview);}
    preview.innerHTML='';
    if(!this.draw)return;
    const segments=orthogonalSegments(this.draw.start,this.draw.current);
    segments.forEach(segment=>preview.appendChild(svgEl('line',{x1:segment.x1,y1:segment.y1,x2:segment.x2,y2:segment.y2,class:'draw-preview'})));
  }
  finishDraw(){
    const draw=this.draw;this.draw=null;const preview=qs('#drawPreview');if(preview)preview.remove();
    if(!draw)return;
    const segments=orthogonalSegments(draw.start,draw.current);
    if(!segments.length)return;
    segments.forEach(segment=>this.state.segments.push(segment));
    this.commit('New connector drawn');this.render();
  }
  onWheel(event){
    event.preventDefault();
    const rect=this.canvas.getBoundingClientRect();
    const screen={x:event.clientX-rect.left,y:event.clientY-rect.top};
    const before=this.view.screenToWorld(screen);
    const factor=event.deltaY<0?1.1:.9;
    this.view.zoomBy(factor);
    const after=this.view.worldToScreen(before);
    this.view.panBy(screen.x-after.x,screen.y-after.y);
    this.updateTransform();this.drawMap();
  }
  zoomAroundCenter(factor){
    const rect=this.canvas.getBoundingClientRect();const center={x:rect.width/2,y:rect.height/2};const before=this.view.screenToWorld(center);this.view.zoomBy(factor);const after=this.view.worldToScreen(before);this.view.panBy(center.x-after.x,center.y-after.y);this.updateTransform();this.drawMap();
  }
  updateTransform(){
    this.svg.style.transform=`translate(${this.view.panX}px,${this.view.panY}px) scale(${this.view.zoom})`;
    qs('#zoomLabel').textContent=Math.round(this.view.zoom*100)+'%';
  }
  fit(){
    const rect=this.canvas.getBoundingClientRect();
    const width=this.state.meta.width||3300;const height=this.state.meta.height||1360;
    const usableW=Math.max(400,rect.width-80);const usableH=Math.max(400,rect.height-80);
    this.view.zoom=clamp(Math.min(usableW/width,usableH/height),.1,1);
    this.view.panX=Math.max(20,(rect.width-width*this.view.zoom)/2);
    this.view.panY=Math.max(20,(rect.height-height*this.view.zoom)/2);
    this.updateTransform();this.drawMap();
  }
  newPersonAtCenter(){
    const rect=this.canvas.getBoundingClientRect();const point=this.view.screenToWorld({x:rect.width/2,y:rect.height/2});
    const person=createPerson(point.x,point.y,'unknown');this.state.people.push(person);this.commit('New person');this.render();this.selectPerson(person.id);
  }
  addParents(person){this.relations.state=this.state;const people=this.relations.addParents(person);this.commit('Added two parents');this.render();if(people[0])this.selectPerson(people[0].id);}
  addSpouse(person){this.relations.state=this.state;const spouse=this.relations.addSpouse(person);this.commit('Added spouse');this.render();this.selectPerson(spouse.id);}
  addChild(person){this.relations.state=this.state;const child=this.relations.addChild(person);this.commit('Added child');this.render();this.selectPerson(child.id);}
  addSibling(person){this.relations.state=this.state;const sibling=this.relations.addSibling(person);this.commit('Added sibling');this.render();this.selectPerson(sibling.id);}
  updatePersonField(person,field,value){
    person[field]=value;
    if(field==='first'||field==='middle'||field==='last')person.placeholder=false;
    this.renderer.render(this.selection);this.updateStatus('Editing person');
  }
  updatePersonInfo(person,text){person.info=splitLines(text);person.placeholder=false;this.renderer.render(this.selection);}
  changeCategory(person,category){person.category=category;person.placeholder=false;this.commit('Changed circle category');this.render();this.openPersonPanel(person);}
  toggleLock(person){person.locked=!person.locked;this.commit(person.locked?'Person locked':'Person unlocked');this.render();this.openPersonPanel(person);}
  removePerson(person){
    if(person.placeholder){this.state.people=removeById(this.state.people,person.id);this.commit('Removed placeholder');}
    else{person.first='';person.middle='';person.last='';person.info=[];person.placeholder=true;person.category='unknown';this.commit('Person changed to placeholder');}
    this.clearSelection();this.render();
  }
  deleteLine(line){this.state.segments=removeById(this.state.segments,line.id);this.commit('Connector deleted');this.clearSelection();this.render();}
  openPersonPanel(person){
    if(!person){this.closePanel();return;}
    this.panel.classList.add('open');
    this.panel.innerHTML=this.personPanelHTML(person);
    this.bindPersonPanel(person);
  }
  personPanelHTML(person){
    return `<div class="editor-panel-inner">
      <button class="close-panel" id="closePanel">×</button>
      <h2>${person.placeholder?'Blank person':'Edit person'}</h2>
      <div class="small">${person.placeholder?'Placeholder circle. Fill in the person now or leave it blank.':'This is a direct editor for the selected person.'}</div>
      <div class="panel-row"><label>First name</label><input id="pFirst" value="${this.escape(fullName({first:person.first,middle:'',last:''}))}" autocomplete="off"></div>
      <div class="panel-row"><label>Middle name (optional)</label><input id="pMiddle" value="${this.escape(person.middle)}" autocomplete="off"></div>
      <div class="panel-row"><label>Last name</label><input id="pLast" value="${this.escape(person.last)}" autocomplete="off"></div>
      <div class="panel-row"><label>Notes under the circle · one line per row · Enter makes a new line</label><textarea id="pInfo">${this.escape((person.info||[]).join('\n'))}</textarea></div>
      <div class="panel-row"><label>Circle category</label><select id="pCategory">
        <option value="paternal" ${person.category==='paternal'?'selected':''}>Paternal · blue</option>
        <option value="maternal" ${person.category==='maternal'?'selected':''}>Maternal · red</option>
        <option value="merge" ${person.category==='merge'?'selected':''}>Merge · green</option>
        <option value="collateral" ${person.category==='collateral'?'selected':''}>Married in / adopted · gold</option>
        <option value="unknown" ${person.category==='unknown'?'selected':''}>Unknown / placeholder · gray</option>
      </select></div>
      <div class="panel-section"><div class="panel-title">Add connection</div>
        <div class="panel-buttons">
          <button id="addParents">＋ Parents</button><button id="addSibling">＋ Sibling</button>
          <button id="addSpouse">＋ Spouse</button><button id="addChild">＋ Child</button>
        </div>
      </div>
      <div class="panel-section"><div class="panel-title">Person controls</div>
        <div class="panel-buttons">
          <button id="focusPerson">Focus</button><button id="lockPerson">${person.locked?'Unlock':'Lock'}</button>
          <button id="removePerson" class="danger full">${person.placeholder?'Delete placeholder':'Remove person → leave gray placeholder'}</button>
        </div>
      </div>
      <div class="panel-section"><div class="small">People are not automatically rearranged. Connector segments remain independent so deleting a person does not destroy the surrounding tree geometry.</div></div>
    </div>`;
  }
  bindPersonPanel(person){
    qs('#closePanel').onclick=()=>this.closePanel();
    let timer=null;
    const delayed=()=>{clearTimeout(timer);timer=setTimeout(()=>this.commit('Person text edited'),500);};
    qs('#pFirst').oninput=e=>{person.first=e.target.value;person.placeholder=false;this.renderer.render(this.selection);delayed();};
    qs('#pMiddle').oninput=e=>{person.middle=e.target.value;person.placeholder=false;this.renderer.render(this.selection);delayed();};
    qs('#pLast').oninput=e=>{person.last=e.target.value;person.placeholder=false;this.renderer.render(this.selection);delayed();};
    qs('#pInfo').oninput=e=>{person.info=splitLines(e.target.value);person.placeholder=false;this.renderer.render(this.selection);delayed();};
    qs('#pCategory').onchange=e=>this.changeCategory(person,e.target.value);
    qs('#addParents').onclick=()=>this.addParents(person);
    qs('#addSibling').onclick=()=>this.addSibling(person);
    qs('#addSpouse').onclick=()=>this.addSpouse(person);
    qs('#addChild').onclick=()=>this.addChild(person);
    qs('#focusPerson').onclick=()=>this.focusPerson(person);
    qs('#lockPerson').onclick=()=>this.toggleLock(person);
    qs('#removePerson').onclick=()=>this.removePerson(person);
  }
  openLinePanel(line){
    if(!line){this.closePanel();return;}
    const direction=isHorizontal(line)?'horizontal — drag vertically':isVertical(line)?'vertical — drag horizontally':'free — drag both directions';
    this.panel.classList.add('open');
    this.panel.innerHTML=`<div class="editor-panel-inner">
      <button class="close-panel" id="closePanel">×</button><h2>Connector</h2>
      <div class="small">Selected segment: ${direction}.</div>
      <div class="panel-section"><div class="panel-title">Line geometry</div>
      <div class="small">Start: ${line.x1.toFixed(1)}, ${line.y1.toFixed(1)}<br>End: ${line.x2.toFixed(1)}, ${line.y2.toFixed(1)}</div></div>
      <div class="panel-section"><div class="panel-buttons"><button id="lockLine">${line.locked?'Unlock':'Lock'}</button><button id="deleteLine" class="danger">Delete line</button></div></div>
      <div class="panel-section"><div class="small">Existing vertical lines can be dragged left/right. Existing horizontal lines can be dragged up/down. New lines are drawn as straight orthogonal segments.</div></div>
    </div>`;
    qs('#closePanel').onclick=()=>this.closePanel();
    qs('#lockLine').onclick=()=>{line.locked=!line.locked;this.commit(line.locked?'Line locked':'Line unlocked');this.render();this.openLinePanel(line);};
    qs('#deleteLine').onclick=()=>this.deleteLine(line);
  }
  closePanel(){this.panel.classList.remove('open');this.panel.innerHTML='';}
  focusPerson(person){
    const rect=this.canvas.getBoundingClientRect();this.view.panX=rect.width/2-person.x*this.view.zoom;this.view.panY=rect.height/2-person.y*this.view.zoom;this.updateTransform();this.drawMap();this.renderer.focusElement(person);this.updateStatus('Focused on '+(fullName(person)||'blank person'));
  }
  escape(value){return String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');}
  undo(){const next=this.history.undo();if(!next)return;this.state=next;this.relations.state=next;this.renderer.setState(next);this.clearSelection();this.render();this.updateStatus('Undo');}
  redo(){const next=this.history.redo();if(!next)return;this.state=next;this.relations.state=next;this.renderer.setState(next);this.clearSelection();this.render();this.updateStatus('Redo');}
  updateHistoryButtons(){qs('#undoBtn').disabled=!this.history.canUndo();qs('#redoBtn').disabled=!this.history.canRedo();}
  save(){try{this.store.save(this.state);this.dirty=false;this.updateStatus('Saved locally in this browser');this.showToast('Saved');}catch(error){this.showToast('Could not save: '+error.message);}}
  reset(){if(!confirm('Reset the editor to the original Okrut & Karpenko tree? This removes your V4 browser edits.'))return;this.store.clear();this.state=clone(this.originalState);this.relations.state=this.state;this.history.reset(this.state);this.clearSelection();this.render();this.fit();this.updateStatus('Reset to original tree');}
  export(){downloadText('ok​rut-karpenko-family-tree-v4.json',serialize(this.state));this.updateStatus('Exported JSON');}
  importFile(event){
    const file=event.target.files?.[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>{try{const next=deserialize(reader.result);this.state=next;this.relations.state=next;this.history.reset(next);this.clearSelection();this.render();this.fit();this.updateStatus('Imported tree');}catch(error){this.showToast(error.message);}};reader.readAsText(file);event.target.value='';
  }
  onKeyDown(event){
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?this.redo():this.undo();return;}
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='y'){event.preventDefault();this.redo();return;}
    if(event.key==='Escape'){this.setMode('select');this.closePanel();}
  }
  updateStatus(text){qs('#status').textContent=text;}
  showToast(text){const el=this.toastElement;el.textContent=text;el.classList.add('show');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>el.classList.remove('show'),1500);}
  drawMap(){
    const canvas=this.mapCanvas;if(!canvas)return;const ctx=canvas.getContext('2d');const W=this.state.meta.width||3300,H=this.state.meta.height||1360;const sx=canvas.width/W,sy=canvas.height/H,s=Math.min(sx,sy);
    ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#FAF6EC';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.lineWidth=1;ctx.strokeStyle='#B7AC94';
    for(const line of this.state.segments){ctx.beginPath();ctx.moveTo(line.x1*s,line.y1*s);ctx.lineTo(line.x2*s,line.y2*s);ctx.stroke();}
    for(const person of this.state.people){ctx.beginPath();ctx.arc(person.x*s,person.y*s,2.3,0,Math.PI*2);ctx.fillStyle=COLORS[person.category]||COLORS.unknown;ctx.fill();}
    const rect=this.canvas.getBoundingClientRect();const worldX=-this.view.panX/this.view.zoom,worldY=-this.view.panY/this.view.zoom,worldW=rect.width/this.view.zoom,worldH=rect.height/this.view.zoom;ctx.strokeStyle='#2B2620';ctx.strokeRect(worldX*s,worldY*s,worldW*s,worldH*s);
  }
}
