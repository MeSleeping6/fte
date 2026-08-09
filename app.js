import {V5Toolkit, treeSummary, validateTreeState} from './v5-toolkit.js';
/* V5 MAIN ENTRY — bootstrap and safety checks. */
import {makeInitialState,clone,Store,STORAGE_KEY} from './core.js';
import {FamilyTreeEditor} from './controller.js';

function boot(){
  const svg=document.querySelector('.scroller > svg');
  if(!svg){
    document.body.insertAdjacentHTML('beforeend','<div style="padding:30px;font-family:Inter,sans-serif;color:#8C3A34">Family tree SVG was not found.</div>');
    return;
  }
  const original=makeInitialState(svg);
  const store=new Store(STORAGE_KEY);
  let state=store.load();
  if(!state || !Array.isArray(state.people) || state.people.length<1){state=clone(original);store.clear();}
  const editor=new FamilyTreeEditor(svg,state);
  window.familyTreeEditor=editor;
  window.familyTreeV5={editor,original,toolkit:V5Toolkit,summary:()=>treeSummary(editor.state),validate:()=>validateTreeState(editor.state)};
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
