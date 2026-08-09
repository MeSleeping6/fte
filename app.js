(() => {
'use strict';

/* V3 is deliberately self-contained: the original tree is embedded here.
   It does NOT depend on fetch(), JSON loading, or an old localStorage version. */
const ORIGINAL = {"version":3,"title":"The Okrut & Karpenko Family Tree","subtitle":"Every person gathered so far — seven generations, drawn as one tree","canvas":{"width":3300.0,"height":1360.0},"people":[{"id":"p1","first":"Klim","middle":"","last":"Okrut","info":["b. c. 1848?","d. c. 1954? · wife Malanya died young"],"x":260.0,"y":90.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p2","first":"Malanya","middle":"","last":"","info":["Klim's wife; died young"],"x":400.0,"y":90.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p3","first":"Yakov","middle":"","last":"Beloushko","info":["Russo-Japanese War 1905 · St. George Cross"],"x":800.0,"y":90.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p4","first":"Marylya","middle":"","last":"Migas","info":["kept Orthodox faith through Soviet era"],"x":940.0,"y":90.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p5","first":"Prokop","middle":"","last":"Okrut","info":["did not fight in WWII"],"x":90.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p6","first":"Avdotya","middle":"","last":"","info":["wife of Prokop"],"x":210.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p7","first":"Klim","middle":"Okrut","last":"Jr.","info":["remembered from a family visit"],"x":330.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p8","first":"Agapa","middle":"","last":"Prokopchik","info":["wife of Klim Jr."],"x":450.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p9","first":"Yustin","middle":"(Ustin)","last":"Okrut","info":["b. 1902","d. 5/2/1945 · tailor"],"x":570.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p10","first":"Tekla","middle":"","last":"Beloushko","info":["\"Fekla\" · corrects earlier \"Zoya\""],"x":690.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p11","first":"Vasyl","middle":"","last":"Beloushko","info":["mobilized 1941 · killed in WWII"],"x":810.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p12","first":"Stepan","middle":"","last":"Beloushko","info":["mobilized 1944 · killed in WWII"],"x":930.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p13","first":"Andrey","middle":"","last":"Beloushko","info":["mobilized 1944 · killed in WWII"],"x":1050.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p14","first":"Vera","middle":"","last":"","info":["b. 1913 · ~Volga region"],"x":1250.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p15","first":"Musa","middle":"","last":"","info":["~Azerbaijan"],"x":1370.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p16","first":"Dmitri","middle":"","last":"Smirnov","info":["father of Nina"],"x":1570.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p17","first":"name","middle":"","last":"unknown","info":[],"x":1770.0,"y":330.0,"radius":24.0,"category":"unknown","placeholder":false,"locked":false},{"id":"p18","first":"Mikhail","middle":"","last":"Farafonov","info":[],"x":1890.0,"y":330.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p19","first":"Maria","middle":"","last":"Izosimovna","info":["~Volga region"],"x":2150.0,"y":330.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p20","first":"Alexander","middle":"","last":"Yakovlev","info":[],"x":2270.0,"y":330.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p21","first":"Anna","middle":"","last":"Tarasovich","info":[],"x":2390.0,"y":330.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p22","first":"Grigory","middle":"","last":"Tarasovich","info":[],"x":2510.0,"y":330.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p23","first":"Maria","middle":"","last":"Karpenko","info":[],"x":2750.0,"y":330.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p24","first":"Fedosey","middle":"","last":"Karpenko","info":[],"x":2870.0,"y":330.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p25","first":"Ivan","middle":"","last":"Okrut","info":["Semezhevo, Belarus","WWII memory: \"Simonovichi, June 27\""],"x":630.0,"y":570.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p26","first":"Maria","middle":"Ustinovna","last":"Okrut","info":["b. 1937","d. 11/5/2014"],"x":800.0,"y":570.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p27","first":"Ivan","middle":"","last":"Okrut","info":["her husband · distant relative · d. 2016"],"x":920.0,"y":570.0,"radius":24.0,"category":"collateral","placeholder":false,"locked":false},{"id":"p28","first":"Tanya","middle":"","last":"","info":["remembered from a family stay"],"x":1040.0,"y":570.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p29","first":"Andrey","middle":"","last":"Zlobich","info":["Tanya's husband"],"x":1160.0,"y":570.0,"radius":24.0,"category":"collateral","placeholder":false,"locked":false},{"id":"p30","first":"Sona","middle":"","last":"Okrut","info":["Baku, Azerbaijan","née Guseynova"],"x":1310.0,"y":570.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p31","first":"Nina","middle":"","last":"Farafonova","info":["6/26/1928","d. 2/23/1979 · née Smirnova"],"x":1570.0,"y":570.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p32","first":"Constantin","middle":"","last":"Farafonov","info":["b. 1923 · ~Russian Far East","d. 4/30/1979"],"x":1830.0,"y":570.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p33","first":"Anastasia","middle":"","last":"Galochkina","info":["~Volga region"],"x":2210.0,"y":570.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p34","first":"Vladimir","middle":"","last":"Kovalev","info":[],"x":2330.0,"y":570.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p35","first":"Valentina","middle":"","last":"Karpenko","info":["née Selezneva"],"x":2505.0,"y":570.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p36","first":"Grigory","middle":"","last":"Karpenko","info":["\"Grisha\" · military service"],"x":2625.0,"y":570.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p37","first":"Alena","middle":"","last":"","info":["adopted daughter"],"x":860.0,"y":810.0,"radius":24.0,"category":"collateral","placeholder":false,"locked":false},{"id":"p38","first":"Sergey","middle":"","last":"Okrut","info":["11/15/1956"],"x":970.0,"y":810.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p39","first":"Natalya","middle":"","last":"Farafonova","info":["12/29/1961","\"Natasha\""],"x":1700.0,"y":810.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p40","first":"Evgeny","middle":"","last":"Pereverzev","info":[],"x":2050.0,"y":810.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p41","first":"Tamara","middle":"","last":"Galochkina","info":[],"x":2200.0,"y":810.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p42","first":"Tatiana","middle":"","last":"Galochkina","info":["3/21/1954"],"x":2340.0,"y":810.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p43","first":"Yuri","middle":"","last":"Karpenko","info":["4/24/1954"],"x":2490.0,"y":810.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p44","first":"Ludmila","middle":"","last":"Karpenko","info":["married name Papakhin"],"x":2640.0,"y":810.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p45","first":"Maria","middle":"","last":"Okrut","info":["Anton's sister"],"x":1035.0,"y":1050.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p46","first":"Anton","middle":"","last":"Okrut","info":["9/14/1984 · Kharkiv, Ukraine"],"x":1635.0,"y":1050.0,"radius":24.0,"category":"paternal","placeholder":false,"locked":false},{"id":"p47","first":"Ilona","middle":"","last":"Karpenko","info":["1/23/1983 · Kyiv or Berdyansk"],"x":1835.0,"y":1050.0,"radius":24.0,"category":"merge","placeholder":false,"locked":false},{"id":"p48","first":"Oleg","middle":"","last":"Karpenko","info":[],"x":2035.0,"y":1050.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p49","first":"Ekaterina","middle":"","last":"Zabiyakina","info":["\"Katya\" · family lives in Russia"],"x":2235.0,"y":1050.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p50","first":"Vasily","middle":"","last":"Pereverzev","info":[],"x":2450.0,"y":1050.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p51","first":"Polina","middle":"","last":"Pereverzeva","info":[],"x":2600.0,"y":1050.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p52","first":"Aleksey","middle":"","last":"Papakhin","info":[],"x":2820.0,"y":1050.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p53","first":"Natalya","middle":"","last":"Papakhina","info":[],"x":2970.0,"y":1050.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p54","first":"Vasily","middle":"","last":"Veselovsky","info":[],"x":3120.0,"y":1050.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p55","first":"Michael","middle":"","last":"Okrut","info":["1/6/2011 · Bellevue, WA"],"x":1645.0,"y":1290.0,"radius":24.0,"category":"merge","placeholder":false,"locked":false},{"id":"p56","first":"Oliver","middle":"","last":"Okrut","info":[],"x":1825.0,"y":1290.0,"radius":24.0,"category":"merge","placeholder":false,"locked":false},{"id":"p57","first":"Egor","middle":"","last":"Karpenko","info":["lives in Russia"],"x":2135.0,"y":1290.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p58","first":"Viktoria","middle":"","last":"Papakhin","info":[],"x":2820.0,"y":1290.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false},{"id":"p59","first":"Alexandr","middle":"","last":"Veselovsky","info":[],"x":3045.0,"y":1290.0,"radius":24.0,"category":"maternal","placeholder":false,"locked":false}],"segments":[{"id":"s1","x1":330.0,"y1":114.0,"x2":330.0,"y2":195.0},{"id":"s2","x1":90.0,"y1":195.0,"x2":570.0,"y2":195.0},{"id":"s3","x1":90.0,"y1":195.0,"x2":90.0,"y2":306.0},{"id":"s4","x1":330.0,"y1":195.0,"x2":330.0,"y2":306.0},{"id":"s5","x1":570.0,"y1":195.0,"x2":570.0,"y2":306.0},{"id":"s6","x1":870.0,"y1":114.0,"x2":870.0,"y2":195.0},{"id":"s7","x1":690.0,"y1":195.0,"x2":1050.0,"y2":195.0},{"id":"s8","x1":690.0,"y1":195.0,"x2":690.0,"y2":306.0},{"id":"s9","x1":810.0,"y1":195.0,"x2":810.0,"y2":306.0},{"id":"s10","x1":930.0,"y1":195.0,"x2":930.0,"y2":306.0},{"id":"s11","x1":1050.0,"y1":195.0,"x2":1050.0,"y2":306.0},{"id":"s12","x1":630.0,"y1":354.0,"x2":630.0,"y2":435.0},{"id":"s13","x1":630.0,"y1":435.0,"x2":1160.0,"y2":435.0},{"id":"s14","x1":630.0,"y1":435.0,"x2":630.0,"y2":546.0},{"id":"s15","x1":800.0,"y1":435.0,"x2":800.0,"y2":546.0},{"id":"s16","x1":1160.0,"y1":435.0,"x2":1160.0,"y2":546.0},{"id":"s17","x1":1310.0,"y1":354.0,"x2":1310.0,"y2":546.0},{"id":"s18","x1":1570.0,"y1":354.0,"x2":1570.0,"y2":546.0},{"id":"s19","x1":1830.0,"y1":354.0,"x2":1830.0,"y2":546.0},{"id":"s20","x1":2210.0,"y1":354.0,"x2":2210.0,"y2":546.0},{"id":"s21","x1":2330.0,"y1":354.0,"x2":2330.0,"y2":546.0},{"id":"s22","x1":2565.0,"y1":354.0,"x2":2565.0,"y2":546.0},{"id":"s23","x1":2565.0,"y1":354.0,"x2":2505.0,"y2":354.0},{"id":"s24","x1":970.0,"y1":594.0,"x2":970.0,"y2":766.0},{"id":"s25","x1":800.0,"y1":594.0,"x2":800.0,"y2":766.0},{"id":"s26","x1":1700.0,"y1":594.0,"x2":1700.0,"y2":766.0},{"id":"s27","x1":2270.0,"y1":594.0,"x2":2270.0,"y2":610.0},{"id":"s28","x1":2200.0,"y1":610.0,"x2":2340.0,"y2":610.0},{"id":"s29","x1":2200.0,"y1":610.0,"x2":2200.0,"y2":766.0},{"id":"s30","x1":2340.0,"y1":610.0,"x2":2340.0,"y2":766.0},{"id":"s31","x1":2565.0,"y1":594.0,"x2":2565.0,"y2":610.0},{"id":"s32","x1":2490.0,"y1":610.0,"x2":2640.0,"y2":610.0},{"id":"s33","x1":2490.0,"y1":610.0,"x2":2490.0,"y2":766.0},{"id":"s34","x1":2640.0,"y1":610.0,"x2":2640.0,"y2":766.0},{"id":"s35","x1":1335.0,"y1":834.0,"x2":1335.0,"y2":900.0},{"id":"s36","x1":1035.0,"y1":900.0,"x2":1635.0,"y2":900.0},{"id":"s37","x1":1035.0,"y1":900.0,"x2":1035.0,"y2":1026.0},{"id":"s38","x1":1635.0,"y1":900.0,"x2":1635.0,"y2":1026.0},{"id":"s39","x1":2415.0,"y1":834.0,"x2":2415.0,"y2":870.0},{"id":"s40","x1":1835.0,"y1":870.0,"x2":2415.0,"y2":870.0},{"id":"s41","x1":1835.0,"y1":870.0,"x2":1835.0,"y2":1026.0},{"id":"s42","x1":2035.0,"y1":870.0,"x2":2035.0,"y2":1026.0},{"id":"s43","x1":860.0,"y1":594.0,"x2":860.0,"y2":766.0},{"id":"s44","x1":2200.0,"y1":834.0,"x2":2200.0,"y2":864.0},{"id":"s45","x1":2200.0,"y1":876.0,"x2":2200.0,"y2":900.0},{"id":"s46","x1":2200.0,"y1":900.0,"x2":2600.0,"y2":900.0},{"id":"s47","x1":2450.0,"y1":900.0,"x2":2450.0,"y2":1026.0},{"id":"s48","x1":2600.0,"y1":900.0,"x2":2600.0,"y2":1026.0},{"id":"s49","x1":2640.0,"y1":834.0,"x2":2640.0,"y2":875.0},{"id":"s50","x1":2640.0,"y1":875.0,"x2":2895.0,"y2":875.0},{"id":"s51","x1":2895.0,"y1":875.0,"x2":2895.0,"y2":900.0},{"id":"s52","x1":2820.0,"y1":900.0,"x2":2970.0,"y2":900.0},{"id":"s53","x1":2820.0,"y1":900.0,"x2":2820.0,"y2":1026.0},{"id":"s54","x1":2970.0,"y1":900.0,"x2":2970.0,"y2":1026.0},{"id":"s55","x1":1735.0,"y1":1074.0,"x2":1735.0,"y2":1155.0},{"id":"s56","x1":1645.0,"y1":1155.0,"x2":1825.0,"y2":1155.0},{"id":"s57","x1":1645.0,"y1":1155.0,"x2":1645.0,"y2":1266.0},{"id":"s58","x1":1825.0,"y1":1155.0,"x2":1825.0,"y2":1266.0},{"id":"s59","x1":2135.0,"y1":1074.0,"x2":2135.0,"y2":1266.0},{"id":"s60","x1":2820.0,"y1":1074.0,"x2":2820.0,"y2":1266.0},{"id":"s61","x1":3045.0,"y1":1074.0,"x2":3045.0,"y2":1266.0},{"id":"s62","x1":260.0,"y1":90.0,"x2":400.0,"y2":90.0},{"id":"s63","x1":800.0,"y1":90.0,"x2":940.0,"y2":90.0},{"id":"s64","x1":90.0,"y1":330.0,"x2":210.0,"y2":330.0},{"id":"s65","x1":330.0,"y1":330.0,"x2":450.0,"y2":330.0},{"id":"s66","x1":570.0,"y1":330.0,"x2":690.0,"y2":330.0},{"id":"s67","x1":1250.0,"y1":330.0,"x2":1370.0,"y2":330.0},{"id":"s68","x1":1770.0,"y1":330.0,"x2":1890.0,"y2":330.0},{"id":"s69","x1":2150.0,"y1":330.0,"x2":2270.0,"y2":330.0},{"id":"s70","x1":2390.0,"y1":330.0,"x2":2510.0,"y2":330.0},{"id":"s71","x1":2750.0,"y1":330.0,"x2":2870.0,"y2":330.0},{"id":"s72","x1":630.0,"y1":570.0,"x2":1310.0,"y2":570.0},{"id":"s73","x1":800.0,"y1":570.0,"x2":920.0,"y2":570.0},{"id":"s74","x1":1040.0,"y1":570.0,"x2":1160.0,"y2":570.0},{"id":"s75","x1":1570.0,"y1":570.0,"x2":1830.0,"y2":570.0},{"id":"s76","x1":2210.0,"y1":570.0,"x2":2330.0,"y2":570.0},{"id":"s77","x1":2505.0,"y1":570.0,"x2":2625.0,"y2":570.0},{"id":"s78","x1":970.0,"y1":810.0,"x2":1700.0,"y2":810.0},{"id":"s79","x1":2050.0,"y1":810.0,"x2":2200.0,"y2":810.0},{"id":"s80","x1":2340.0,"y1":810.0,"x2":2490.0,"y2":810.0},{"id":"s81","x1":1635.0,"y1":1050.0,"x2":1835.0,"y2":1050.0},{"id":"s82","x1":2035.0,"y1":1050.0,"x2":2235.0,"y2":1050.0},{"id":"s83","x1":2970.0,"y1":1050.0,"x2":3120.0,"y2":1050.0}]};
const STORAGE_KEY = 'fte-family-tree-v3';

const $ = id => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const viewport = $('viewport'), svg = $('tree');
const lineLayer = $('lineLayer'), personLayer = $('personLayer'), draftLayer = $('draftLayer');
const editor = $('editor'), map = $('map'), mapCanvas = $('mapCanvas'), ctx = mapCanvas.getContext('2d');

let data;
let selectedPerson = null, selectedLine = null;
let mode = 'select';
let zoom = .75, panX = 20, panY = 20;
let history = [], historyIndex = -1;
let draggingCanvas = false, panStart = null;
let lineDrag = null;
let drawing = false, drawStart = null, drawCurrent = null;
let saveTimer = null;

const colors = {
  paternal:'#2F5A73', maternal:'#8C3A34', merge:'#2F7358',
  unknown:'#C7BEA8', collateral:'#9C8659'
};

function deep(x){return JSON.parse(JSON.stringify(x));}
function uid(prefix){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);}
function getPerson(id){return data.people.find(p=>p.id===id);}
function getLine(id){return data.segments.find(s=>s.id===id);}
function fullName(p){return [p.first,p.middle,p.last].filter(Boolean).join(' ').trim();}
function esc(s){return String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');}
function make(tag,attrs={}){const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);return e;}

function resetToOriginal(){
  data=deep(ORIGINAL);
  selectedPerson=selectedLine=null;
  history=[deep(data)];historyIndex=0;
  closeEditor();render();fit();
}

function load(){
  try{
    const saved=localStorage.getItem(STORAGE_KEY);
    data=saved?JSON.parse(saved):deep(ORIGINAL);
  }catch(e){data=deep(ORIGINAL);}
  history=[deep(data)];historyIndex=0;
  render();
  setTimeout(fit,100);
}

function pushHistory(){
  history=history.slice(0,historyIndex+1);
  history.push(deep(data));
  if(history.length>100)history.shift();
  historyIndex=history.length-1;
  updateHistoryButtons();
}

function undo(){
  if(historyIndex<=0)return;
  historyIndex--;data=deep(history[historyIndex]);
  selectedPerson=selectedLine=null;closeEditor();render();
}
function redo(){
  if(historyIndex>=history.length-1)return;
  historyIndex++;data=deep(history[historyIndex]);
  selectedPerson=selectedLine=null;closeEditor();render();
}
function updateHistoryButtons(){
  $('undo').disabled=historyIndex<=0;$('redo').disabled=historyIndex>=history.length-1;
}

function render(){
  renderLines();renderPeople();updateTransform();drawMap();updateHistoryButtons();
}

function renderLines(){
  lineLayer.innerHTML='';
  for(const s of data.segments){
    const group=make('g');
    const hit=make('line',{x1:s.x1,y1:s.y1,x2:s.x2,y2:s.y2,class:'line-hit'});
    const vis=make('line',{x1:s.x1,y1:s.y1,x2:s.x2,y2:s.y2,class:'line-visible'+(selectedLine===s.id?' selected':'')});
    group.append(hit,vis);lineLayer.append(group);
    hit.addEventListener('pointerdown',e=>{
      if(mode!=='select')return;
      e.stopPropagation();selectLine(s.id);beginLineDrag(e,s.id);
    });
  }
}

function renderPeople(){
  personLayer.innerHTML='';
  for(const p of data.people){
    const g=make('g',{class:'person'+(p.placeholder?' placeholder':'')+(selectedPerson===p.id?' selected':''),transform:`translate(${p.x} ${p.y})`});
    const c=make('circle',{r:p.radius||24,class:'person-circle',fill:colors[p.category]||colors.unknown});
    g.appendChild(c);

    if(p.placeholder){
      const q=make('text',{x:0,y:5,class:'placeholder-mark'});
      q.textContent='?';g.appendChild(q);
    }

    const nm=make('text',{class:'nm',x:0,y:44});
    nm.textContent=fullName(p);g.appendChild(nm);

    (p.info||[]).forEach((txt,i)=>{
      const t=make('text',{class:(i===0?'sb':'sb2'),x:0,y:56+i*11});
      t.textContent=txt;g.appendChild(t);
    });

    g.addEventListener('pointerdown',e=>e.stopPropagation());
    g.addEventListener('click',e=>{e.stopPropagation();selectPerson(p.id);});
    personLayer.appendChild(g);
  }
}

function selectPerson(id){
  selectedPerson=id;selectedLine=null;render();openPersonEditor(getPerson(id));
  $('help').textContent='Person selected · edit their name and information on the left';
}
function selectLine(id){
  selectedLine=id;selectedPerson=null;render();openLineEditor(getLine(id));
  $('help').textContent='Line selected · drag it in its allowed direction';
}
function closeEditor(){editor.classList.add('hidden');editor.innerHTML='';}

function openPersonEditor(p){
  editor.classList.remove('hidden');
  editor.innerHTML=`
  <div class="panel">
    <div class="panel-head">
      <div><h2>${p.placeholder?'Blank person':'Edit person'}</h2><div class="panel-sub">${p.placeholder?'Placeholder — fill in the person whenever you are ready.':'Changes are applied directly to the tree.'}</div></div>
      <button class="close" id="close">×</button>
    </div>

    <div class="field"><label>First name</label><input id="first" value="${esc(p.first)}" autocomplete="off"></div>
    <div class="field"><label>Middle name (optional)</label><input id="middle" value="${esc(p.middle)}" autocomplete="off"></div>
    <div class="field"><label>Last name</label><input id="last" value="${esc(p.last)}" autocomplete="off"></div>
    <div class="field"><label>Text under the circle · press Enter for another line</label><textarea id="info">${esc((p.info||[]).join('\\n'))}</textarea></div>
    <div class="field"><label>Circle category / color</label>
      <select id="category">
        <option value="paternal" ${p.category==='paternal'?'selected':''}>Paternal · blue</option>
        <option value="maternal" ${p.category==='maternal'?'selected':''}>Maternal · red</option>
        <option value="merge" ${p.category==='merge'?'selected':''}>Merge · green</option>
        <option value="collateral" ${p.category==='collateral'?'selected':''}>Collateral · gold</option>
        <option value="unknown" ${p.category==='unknown'?'selected':''}>Unknown / placeholder · gray</option>
      </select>
    </div>

    <div class="section">
      <div class="section-title">Add connection</div>
      <div class="grid">
        <button class="action" id="addParents">＋ Parents</button>
        <button class="action" id="addSibling">＋ Sibling</button>
        <button class="action" id="addSpouse">＋ Spouse</button>
        <button class="action" id="addChild">＋ Child</button>
      </div>
      <div class="note">These create real editable placeholder circles. You can immediately give them names and notes.</div>
    </div>

    <div class="section">
      <div class="section-title">Person controls</div>
      <div class="grid">
        <button class="action" id="focus">Focus</button>
        <button class="action" id="lock">${p.locked?'Unlock':'Lock'}</button>
        <button class="action danger full" id="remove">${p.placeholder?'Delete placeholder':'Remove person → keep placeholder'}</button>
      </div>
    </div>

    <div class="section">
      <div class="tipbox">The original connector segments are independent objects. Removing a person therefore does <b>not</b> automatically erase the lines around that position.</div>
    </div>
  </div>`;

  $('close').onclick=closeEditor;
  const first=$('first'),middle=$('middle'),last=$('last'),info=$('info'),category=$('category');

  const changed=()=>{
    clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>pushHistory(),700);
  };
  first.oninput=()=>{p.first=first.value;p.placeholder=false;render();changed();};
  middle.oninput=()=>{p.middle=middle.value;p.placeholder=false;render();changed();};
  last.oninput=()=>{p.last=last.value;p.placeholder=false;render();changed();};
  info.oninput=()=>{p.info=info.value.replace(/\\r/g,'').split('\\n');render();changed();};
  category.onchange=()=>{p.category=category.value;pushHistory();render();openPersonEditor(p);};

  $('addParents').onclick=()=>addParents(p);
  $('addSibling').onclick=()=>addRelative(p,'sibling');
  $('addSpouse').onclick=()=>addRelative(p,'spouse');
  $('addChild').onclick=()=>addRelative(p,'child');
  $('focus').onclick=()=>focusPerson(p);
  $('lock').onclick=()=>{p.locked=!p.locked;pushHistory();render();openPersonEditor(p);};
  $('remove').onclick=()=>removePerson(p);
}

function openLineEditor(s){
  editor.classList.remove('hidden');
  const horiz=Math.abs(s.y2-s.y1)<0.5;
  editor.innerHTML=`
  <div class="panel">
    <div class="panel-head"><div><h2>Line</h2><div class="panel-sub">One independent connector segment</div></div><button class="close" id="close">×</button></div>
    <div class="tipbox">${horiz?'This is horizontal — drag it UP or DOWN.':'This is vertical — drag it LEFT or RIGHT.'}<br>It will stay perfectly straight.</div>
    <div class="section">
      <div class="section-title">Line controls</div>
      <button class="action danger full" id="delete">Delete this line</button>
    </div>
    <div class="note">For a new connector, use <b>Draw line</b> in the top toolbar. The editor automatically keeps the new path horizontal/vertical.</div>
  </div>`;
  $('close').onclick=closeEditor;
  $('delete').onclick=()=>{pushHistory();data.segments=data.segments.filter(x=>x.id!==s.id);selectedLine=null;closeEditor();render();};
}

function addPerson(x,y,category='unknown'){
  const p={id:uid('p'),first:'',middle:'',last:'',info:[],x,y,radius:24,category,placeholder:true,locked:false};
  data.people.push(p);return p;
}
function addSeg(x1,y1,x2,y2){data.segments.push({id:uid('s'),x1,y1,x2,y2});}
function connectParent(parent,child){
  const y=(parent.y+child.y)/2;
  addSeg(parent.x,parent.y+24,parent.x,y);
  addSeg(parent.x,y,child.x,y);
  addSeg(child.x,y,child.x,child.y-24);
}

function addParents(p){
  if(p.locked)return;
  pushHistory();
  const gap=155, y=p.y-205;
  const a=addPerson(p.x-gap,y,p.category),b=addPerson(p.x+gap,y,p.category);
  connectParent(a,p);connectParent(b,p);
  selectedPerson=a.id;render();openPersonEditor(a);
}
function addRelative(p,type){
  if(p.locked)return;
  pushHistory();
  let n;
  if(type==='spouse'){
    n=addPerson(p.x+150,p.y,p.category);
    addSeg(p.x+24,p.y,n.x-24,n.y);
  }else if(type==='sibling'){
    n=addPerson(p.x+190,p.y,p.category);
    const y=p.y-75;
    addSeg(p.x,p.y-24,p.x,y);
    addSeg(p.x,y,n.x,y);
    addSeg(n.x,y,n.x,n.y-24);
  }else{
    n=addPerson(p.x,p.y+190,p.category);
    connectParent(p,n);
  }
  selectedPerson=n.id;render();openPersonEditor(n);
}

function removePerson(p){
  pushHistory();
  if(p.placeholder) data.people=data.people.filter(x=>x.id!==p.id);
  else {
    p.first=p.middle=p.last='';
    p.info=[];p.placeholder=true;p.category='unknown';
  }
  selectedPerson=null;closeEditor();render();
}

function beginLineDrag(e,id){
  const s=getLine(id);if(!s)return;
  lineDrag={id,ox:e.clientX,oy:e.clientY,orig:deep(s),horizontal:Math.abs(s.y2-s.y1)<.5,changed:false};
  window.addEventListener('pointermove',moveLine);
  window.addEventListener('pointerup',endLine,{once:true});
}
function moveLine(e){
  if(!lineDrag)return;
  const s=getLine(lineDrag.id);if(!s)return;
  if(!lineDrag.changed){pushHistory();lineDrag.changed=true;}
  if(lineDrag.horizontal){
    const y=lineDrag.orig.y1+(e.clientY-lineDrag.oy)/zoom;
    s.y1=s.y2=y;
  }else{
    const x=lineDrag.orig.x1+(e.clientX-lineDrag.ox)/zoom;
    s.x1=s.x2=x;
  }
  render();
}
function endLine(){
  window.removeEventListener('pointermove',moveLine);lineDrag=null;
}

function worldPoint(e){
  const r=viewport.getBoundingClientRect();
  return {x:(e.clientX-r.left-panX)/zoom,y:(e.clientY-r.top-panY)/zoom};
}
function orthogonal(a,b){
  const mx=Math.round(((a.x+b.x)/2)/5)*5;
  return [
    {x1:a.x,y1:a.y,x2:mx,y2:a.y},
    {x1:mx,y1:a.y,x2:mx,y2:b.y},
    {x1:mx,y1:b.y,x2:b.x,y2:b.y}
  ].filter(s=>Math.hypot(s.x2-s.x1,s.y2-s.y1)>2);
}

function setMode(m){
  mode=m;
  $('selectMode').classList.toggle('active',m==='select');
  $('drawMode').classList.toggle('active',m==='draw');
  viewport.style.cursor=m==='draw'?'crosshair':'grab';
  $('help').textContent=m==='draw'?'Draw mode: click-drag to create a clean orthogonal line':'Click a person to edit · drag empty space to pan · wheel to zoom';
}
$('selectMode').onclick=()=>setMode('select');
$('drawMode').onclick=()=>setMode('draw');

viewport.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  if(mode==='draw'){
    drawing=true;drawStart=worldPoint(e);drawCurrent=drawStart;return;
  }
  if(e.target.closest('.person')||e.target.closest('.line-hit'))return;
  selectedPerson=selectedLine=null;closeEditor();render();
  draggingCanvas=true;panStart={x:e.clientX,y:e.clientY,px:panX,py:panY};
  viewport.classList.add('grabbing');
});
window.addEventListener('pointermove',e=>{
  if(drawing){
    drawCurrent=worldPoint(e);draftLayer.innerHTML='';
    orthogonal(drawStart,drawCurrent).forEach(s=>draftLayer.appendChild(make('line',{...s,class:'line-visible',stroke:'#2F5A73','stroke-dasharray':'5 4'})));
    return;
  }
  if(draggingCanvas){
    panX=panStart.px+e.clientX-panStart.x;panY=panStart.py+e.clientY-panStart.y;
    updateTransform();drawMap();
  }
});
window.addEventListener('pointerup',()=>{
  if(drawing){
    drawing=false;draftLayer.innerHTML='';
    if(drawStart&&drawCurrent&&Math.hypot(drawCurrent.x-drawStart.x,drawCurrent.y-drawStart.y)>7){
      pushHistory();orthogonal(drawStart,drawCurrent).forEach(s=>addSeg(s.x1,s.y1,s.x2,s.y2));render();
    }
    drawStart=drawCurrent=null;
  }
  draggingCanvas=false;viewport.classList.remove('grabbing');
});
viewport.addEventListener('wheel',e=>{
  e.preventDefault();
  const before=worldPoint(e),factor=e.deltaY<0?1.12:.89;
  const nz=Math.max(.1,Math.min(5,zoom*factor));
  const r=viewport.getBoundingClientRect();
  zoom=nz;panX=e.clientX-r.left-before.x*zoom;panY=e.clientY-r.top-before.y*zoom;
  updateTransform();drawMap();
},{passive:false});

function updateTransform(){
  svg.style.transform=`translate(${panX}px,${panY}px) scale(${zoom})`;
  $('zoomText').textContent=Math.round(zoom*100)+'%';
}
function zoomBy(f){zoom=Math.max(.1,Math.min(5,zoom*f));updateTransform();drawMap();}
function fit(){
  const r=viewport.getBoundingClientRect(),pad=60;
  zoom=Math.min((r.width-pad)/W,(r.height-pad)/H,1);
  panX=(r.width-W*zoom)/2;panY=(r.height-H*zoom)/2;
  updateTransform();drawMap();
}
function focusPerson(p){
  const r=viewport.getBoundingClientRect();
  panX=r.width/2-p.x*zoom;panY=r.height/2-p.y*zoom;
  updateTransform();drawMap();
}
function drawMap(){
  const w=mapCanvas.width,h=mapCanvas.height,s=Math.min(w/W,h/H);
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#FAF6EC';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#B7AC94';ctx.lineWidth=1;
  for(const l of data.segments){ctx.beginPath();ctx.moveTo(l.x1*s,l.y1*s);ctx.lineTo(l.x2*s,l.y2*s);ctx.stroke();}
  for(const p of data.people){ctx.beginPath();ctx.arc(p.x*s,p.y*s,2,0,Math.PI*2);ctx.fillStyle=colors[p.category]||colors.unknown;ctx.fill();}
  const r=viewport.getBoundingClientRect(),x=-panX/zoom,y=-panY/zoom,vw=r.width/zoom,vh=r.height/zoom;
  ctx.strokeStyle='#2B2620';ctx.strokeRect(x*s,y*s,vw*s,vh*s);
}

mapCanvas.onclick=e=>{
  const r=mapCanvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
  const vr=viewport.getBoundingClientRect();panX=vr.width/2-x*zoom;panY=vr.height/2-y*zoom;
  updateTransform();drawMap();
};

$('undo').onclick=undo;$('redo').onclick=redo;
$('minus').onclick=()=>zoomBy(.8);$('plus').onclick=()=>zoomBy(1.25);$('fit').onclick=fit;
$('minimapToggle').onclick=()=>map.classList.toggle('hidden');
$('newPerson').onclick=()=>{
  pushHistory();
  const r=viewport.getBoundingClientRect();
  const p=addPerson((r.width/2-panX)/zoom,(r.height/2-panY)/zoom,'unknown');
  selectedPerson=p.id;render();openPersonEditor(p);
};
$('save').onclick=()=>{
  localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
  $('help').textContent='Saved in this browser.';
};
$('reset').onclick=()=>{
  if(confirm('Reset this editor to the original family tree? Your saved V3 browser copy will be replaced.')){localStorage.removeItem(STORAGE_KEY);resetToOriginal();}
};
$('export').onclick=()=>{
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='family-tree-v3.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);
};

window.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo();}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo();}
  if(e.key==='Escape'){setMode('select');closeEditor();}
});

load();
})();
