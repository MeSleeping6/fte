/* V4 RENDERER — preserves the original SVG and adds interactive overlays. */
import {svgEl,COLORS,fullName,getPerson,getSegment,isHorizontal,isVertical,findPersonGroup,makeInitialState,uid} from './core.js';
export class TreeRenderer{
  constructor(svg,state){
    this.svg=svg;
    this.state=state;
    this.personDom=new Map();
    this.lineDom=new Map();
    this.overlay=document.createElementNS('http://www.w3.org/2000/svg','g');
    this.overlay.setAttribute('id','editorOverlay');
    this.lineOverlay=document.createElementNS('http://www.w3.org/2000/svg','g');
    this.personOverlay=document.createElementNS('http://www.w3.org/2000/svg','g');
    this.lineOverlay.setAttribute('id','lineHitLayer');
    this.personOverlay.setAttribute('id','personEditLayer');
    this.overlay.append(this.lineOverlay,this.personOverlay);
    this.svg.appendChild(this.overlay);
    this.originalLines=Array.from(this.svg.querySelectorAll('line')).filter(line=>!line.closest('#editorOverlay'));
    this.originalGroups=this.state.people.map(person=>findPersonGroup(this.originalCircle(person)));
  }
  originalCircle(person){
    if(person.domIndex==null)return null;
    const circles=Array.from(this.svg.querySelectorAll('circle'));
    return circles[person.domIndex] || null;
  }
  initializeOriginalDom(){
    this.state.people.forEach(person=>{
      const circle=this.originalCircle(person);
      const group=findPersonGroup(circle);
      if(group){
        group.dataset.personId=person.id;
        group.classList.add('fte-person');
        group.style.cursor='pointer';
      }
    });
    this.originalLines.forEach((line,index)=>{
      line.dataset.segmentId=this.state.segments[index]?.id || '';
      line.classList.add('fte-original-line');
      line.style.pointerEvents='none';
    });
  }
  clearEditorOverlays(){this.lineOverlay.innerHTML='';this.personOverlay.innerHTML='';this.lineDom.clear();this.personDom.clear();}
  render(selection){
    this.clearEditorOverlays();
    this.renderOriginalPeople(selection);
    this.renderOriginalLines(selection);
    this.renderNewPeople(selection);
    this.renderNewLines(selection);
  }
  renderOriginalPeople(selection){
    for(const person of this.state.people){
      if(person.domIndex==null)continue;
      const group=findPersonGroup(this.originalCircle(person));
      if(!group)continue;
      this.updateOriginalPersonDom(person,group);
      const hit=svgEl('circle',{cx:person.x,cy:person.y,r:(person.radius||24)+8,fill:'transparent'});
      hit.dataset.personId=person.id;
      hit.classList.add('person-hit');
      this.personOverlay.appendChild(hit);
      this.personDom.set(person.id,{group,hit});
      if(selection.personId===person.id)this.addSelectionRing(person);
    }
  }
  renderNewPeople(selection){
    for(const person of this.state.people){
      if(person.domIndex!=null)continue;
      const group=svgEl('g',{class:'fte-new-person',transform:`translate(${person.x} ${person.y})`});
      group.dataset.personId=person.id;
      const circle=svgEl('circle',{cx:0,cy:0,r:person.radius||24,fill:COLORS[person.category]||COLORS.unknown});
      circle.classList.add('fte-new-circle');
      if(person.placeholder)circle.classList.add('placeholder-circle');
      group.appendChild(circle);
      if(person.placeholder){const mark=svgEl('text',{x:0,y:5,class:'nm'});mark.textContent='?';group.appendChild(mark);}
      const name=svgEl('text',{x:0,y:44,class:'nm','text-anchor':'middle'});name.textContent=fullName(person);group.appendChild(name);
      (person.info||[]).forEach((line,index)=>{const t=svgEl('text',{x:0,y:56+index*11,class:index===0?'sb':'sb2','text-anchor':'middle'});t.textContent=line;group.appendChild(t);});
      this.personOverlay.appendChild(group);
      this.personDom.set(person.id,{group,hit:circle});
      if(selection.personId===person.id)this.addSelectionRing(person);
    }
  }
  updateOriginalPersonDom(person,group){
    const circle=group.querySelector(':scope > circle');
    const texts=Array.from(group.querySelectorAll(':scope > text'));
    if(!circle)return;
    circle.setAttribute('cx',person.x);circle.setAttribute('cy',person.y);circle.setAttribute('r',person.radius||24);
    circle.setAttribute('fill',COLORS[person.category]||COLORS.unknown);
    circle.classList.toggle('placeholder-circle',!!person.placeholder);
    const name=fullName(person);
    const nameText=texts.find(t=>t.classList.contains('nm'));
    if(nameText)nameText.textContent=name;
    const infoTexts=texts.filter(t=>!t.classList.contains('nm'));
    const info=person.info||[];
    infoTexts.forEach((t,i)=>{t.textContent=info[i]||'';t.style.display=info[i]?'':'none';});
    while(info.length>infoTexts.length){const t=svgEl('text',{class:infoTexts.length===0?'sb':'sb2',x:person.x,y:person.y+56+infoTexts.length*11,'text-anchor':'middle'});t.textContent=info[infoTexts.length];group.appendChild(t);infoTexts.push(t);}
  }
  renderOriginalLines(selection){
    for(const line of this.state.segments){
      if(!line.original)continue;
      const visible=this.originalLines.find(dom=>dom.dataset.segmentId===line.id);
      if(!visible)continue;
      visible.setAttribute('x1',line.x1);visible.setAttribute('y1',line.y1);visible.setAttribute('x2',line.x2);visible.setAttribute('y2',line.y2);
      const hit=svgEl('line',{x1:line.x1,y1:line.y1,x2:line.x2,y2:line.y2,class:'line-hit'});
      hit.dataset.segmentId=line.id;this.lineOverlay.appendChild(hit);this.lineDom.set(line.id,{visible,hit});
      if(selection.lineId===line.id)visible.classList.add('line-selection');else visible.classList.remove('line-selection');
    }
  }
  renderNewLines(selection){
    for(const line of this.state.segments){
      if(line.original)continue;
      const visible=svgEl('line',{x1:line.x1,y1:line.y1,x2:line.x2,y2:line.y2,class:'conn'});
      visible.classList.add('fte-generated-line');
      const hit=svgEl('line',{x1:line.x1,y1:line.y1,x2:line.x2,y2:line.y2,class:'line-hit'});
      hit.dataset.segmentId=line.id;
      if(selection.lineId===line.id)visible.classList.add('line-selection');
      this.lineOverlay.appendChild(visible);this.lineOverlay.appendChild(hit);this.lineDom.set(line.id,{visible,hit});
    }
  }
  addSelectionRing(person){
    const ring=svgEl('circle',{cx:person.x,cy:person.y,r:(person.radius||24)+5,class:'selection-ring'});ring.dataset.selection='person';this.personOverlay.appendChild(ring);
  }
  setState(state){this.state=state;}
  moveOriginalPersonDom(person){
    const circle=this.originalCircle(person);const group=findPersonGroup(circle);if(!group)return;
    const dx=person.x-Number(circle.getAttribute('cx'));const dy=person.y-Number(circle.getAttribute('cy'));
    group.setAttribute('transform',`translate(${dx} ${dy})`);
  }
  focusElement(person){
    const dom=this.personDom.get(person.id);if(!dom)return;
    dom.group.classList.add('person-focus');setTimeout(()=>dom.group.classList.remove('person-focus'),1000);
  }
  getScreenBounds(){return this.svg.getBoundingClientRect();}
}
export function preserveOriginalStyle(svg){
  const originalStyle={};
  Array.from(svg.querySelectorAll('circle,text,line')).forEach(el=>{originalStyle[el]=el.getAttribute('style')||'';});
  return originalStyle;
}
