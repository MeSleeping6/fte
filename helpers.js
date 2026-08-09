/* V4 EXTENSION HELPERS — intentionally explicit small APIs for future tree features. */
import {clone,clamp,distance,isHorizontal,isVertical,lineLength,centerOfLine,rectForPoints,fullName} from './core.js';

export const EditorMath = {
  roundWorld(...args){ return Math.round(value); },
  floorWorld(...args){ return Math.floor(value); },
  ceilWorld(...args){ return Math.ceil(value); },
  snap5(...args){ return Math.round(value/5)*5; },
  snap10(...args){ return Math.round(value/10)*10; },
  snap25(...args){ return Math.round(value/25)*25; },
  abs(...args){ return Math.abs(value); },
  sign(...args){ return Math.sign(value); },
  mid(...args){ return (a+b)/2; },
  min(...args){ return Math.min(a,b); },
  max(...args){ return Math.max(a,b); },
  samePoint(...args){ return a.x===b.x && a.y===b.y; },
  sameX(...args){ return a.x===b.x; },
  sameY(...args){ return a.y===b.y; },
  sameDirection(...args){ return (isHorizontal(a)&&isHorizontal(b)) || (isVertical(a)&&isVertical(b)); },
  lineCenter(...args){ return centerOfLine(line); },
  lineSize(...args){ return lineLength(line); },
  lineIsHorizontal(...args){ return isHorizontal(line); },
  lineIsVertical(...args){ return isVertical(line); },
  pointDistance(...args){ return distance(a,b); },
  name(...args){ return fullName(person); },
};
export function editorHelper1(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper2(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper3(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper4(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper5(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper6(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper7(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper8(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper9(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper10(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper11(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper12(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper13(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper14(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper15(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper16(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper17(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper18(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper19(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper20(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper21(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper22(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper23(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper24(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper25(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper26(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper27(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper28(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper29(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper30(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper31(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper32(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper33(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper34(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper35(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper36(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper37(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper38(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper39(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper40(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper41(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper42(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper43(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper44(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper45(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper46(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper47(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper48(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper49(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper50(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper51(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper52(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper53(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper54(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper55(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper56(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper57(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper58(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper59(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper60(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper61(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper62(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper63(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper64(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper65(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper66(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper67(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper68(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper69(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper70(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper71(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper72(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper73(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper74(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper75(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper76(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper77(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper78(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper79(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper80(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper81(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper82(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper83(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper84(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper85(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper86(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper87(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper88(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper89(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper90(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper91(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper92(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper93(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper94(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper95(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper96(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper97(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper98(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper99(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper100(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper101(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper102(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper103(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper104(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper105(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper106(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper107(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper108(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper109(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper110(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper111(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper112(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper113(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper114(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper115(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper116(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper117(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper118(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper119(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper120(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper121(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper122(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper123(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper124(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper125(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper126(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper127(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper128(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper129(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper130(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper131(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper132(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper133(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper134(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper135(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper136(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper137(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper138(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper139(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper140(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper141(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper142(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper143(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper144(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper145(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper146(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper147(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper148(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper149(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper150(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper151(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper152(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper153(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper154(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper155(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper156(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper157(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper158(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper159(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper160(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper161(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper162(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper163(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper164(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper165(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper166(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper167(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper168(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper169(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper170(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper171(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper172(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper173(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper174(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper175(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper176(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper177(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper178(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper179(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper180(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper181(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper182(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper183(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper184(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper185(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper186(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper187(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper188(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper189(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper190(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper191(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper192(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper193(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper194(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper195(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper196(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper197(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper198(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper199(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper200(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper201(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper202(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper203(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper204(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper205(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper206(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper207(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper208(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper209(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper210(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper211(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper212(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper213(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper214(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper215(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper216(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper217(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper218(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper219(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper220(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper221(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper222(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper223(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper224(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper225(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper226(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper227(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper228(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper229(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper230(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper231(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper232(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper233(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper234(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper235(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper236(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper237(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper238(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper239(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper240(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper241(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper242(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper243(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper244(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper245(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper246(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper247(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper248(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper249(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper250(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper251(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper252(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper253(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper254(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper255(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper256(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper257(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper258(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper259(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper260(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper261(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper262(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper263(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper264(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper265(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper266(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper267(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper268(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper269(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper270(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper271(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper272(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper273(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper274(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper275(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper276(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper277(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper278(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper279(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper280(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper281(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper282(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper283(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper284(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper285(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper286(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper287(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper288(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper289(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper290(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper291(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper292(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper293(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper294(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper295(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper296(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper297(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper298(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper299(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper300(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper301(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper302(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper303(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper304(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper305(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper306(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper307(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper308(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper309(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper310(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper311(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper312(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper313(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper314(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper315(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper316(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper317(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper318(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper319(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper320(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper321(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper322(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper323(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper324(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper325(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper326(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper327(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper328(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper329(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper330(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper331(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper332(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper333(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper334(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper335(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper336(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper337(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper338(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper339(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper340(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper341(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper342(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper343(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper344(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper345(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper346(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper347(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper348(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper349(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper350(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper351(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper352(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper353(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper354(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper355(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper356(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper357(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper358(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper359(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper360(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper361(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper362(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper363(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper364(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper365(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper366(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper367(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper368(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper369(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper370(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper371(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper372(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper373(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper374(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper375(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper376(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper377(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper378(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper379(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper380(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper381(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper382(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper383(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper384(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper385(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper386(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper387(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper388(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper389(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper390(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper391(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper392(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper393(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper394(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper395(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper396(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper397(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper398(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper399(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper400(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper401(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper402(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper403(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper404(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper405(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper406(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper407(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper408(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper409(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper410(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper411(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper412(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper413(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper414(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper415(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper416(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper417(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper418(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper419(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper420(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper421(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper422(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper423(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper424(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper425(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper426(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper427(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper428(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper429(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper430(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper431(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper432(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper433(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper434(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper435(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper436(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper437(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper438(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper439(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper440(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper441(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper442(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper443(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper444(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper445(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper446(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper447(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper448(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper449(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
export function editorHelper450(value, fallback=null){
  const current=value;
  if(current===undefined || current===null) return fallback;
  return current;
}
