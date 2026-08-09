/*
 * V5 TOOLKIT
 * -----------------------------------------------------------------------------
 * A deliberately dependency-free utility layer used by the V5 editor family.
 * The functions are small, deterministic and safe to call from future editor
 * modules. Keeping these operations in one place makes later V5.x changes much
 * easier without touching the original SVG renderer.
 */

export const V5Toolkit = {
  version: 5,
  name: 'Family Tree Editor V5 Toolkit'
};

export function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function finitePoint(point, fallback = {x: 0, y: 0}) {
  if (!point || !Number.isFinite(Number(point.x)) || !Number.isFinite(Number(point.y))) return {...fallback};
  return {x: Number(point.x), y: Number(point.y)};
}

export function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

export function safeString(value, fallback = '') {
  return value == null ? fallback : String(value);
}

export function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, finiteNumber(value, min)));
}

export function nearlyEqual(a, b, epsilon = 0.5) {
  return Math.abs(Number(a) - Number(b)) <= epsilon;
}

export function snapNumber(value, grid = 5) {
  const n = finiteNumber(value);
  const g = Math.abs(finiteNumber(grid, 1)) || 1;
  return Math.round(n / g) * g;
}

export function snapPoint(point, grid = 5) {
  const p = finitePoint(point);
  return {x: snapNumber(p.x, grid), y: snapNumber(p.y, grid)};
}

export function distance2D(a, b) {
  const p = finitePoint(a), q = finitePoint(b);
  return Math.hypot(q.x - p.x, q.y - p.y);
}

export function midpoint(a, b) {
  const p = finitePoint(a), q = finitePoint(b);
  return {x: (p.x + q.x) / 2, y: (p.y + q.y) / 2};
}

export function lerp(a, b, t) {
  return finiteNumber(a) + (finiteNumber(b) - finiteNumber(a)) * finiteNumber(t);
}

export function lerpPoint(a, b, t) {
  return {x: lerp(a?.x, b?.x, t), y: lerp(a?.y, b?.y, t)};
}

export function normalizeVector(vector) {
  const x = finiteNumber(vector?.x), y = finiteNumber(vector?.y);
  const length = Math.hypot(x, y);
  return length ? {x: x / length, y: y / length} : {x: 0, y: 0};
}

export function perpendicularVector(vector) {
  const v = finitePoint(vector);
  return {x: -v.y, y: v.x};
}

export function addPoints(a, b) {
  return {x: finiteNumber(a?.x) + finiteNumber(b?.x), y: finiteNumber(a?.y) + finiteNumber(b?.y)};
}

export function subtractPoints(a, b) {
  return {x: finiteNumber(a?.x) - finiteNumber(b?.x), y: finiteNumber(a?.y) - finiteNumber(b?.y)};
}

export function scalePoint(point, scale) {
  const p = finitePoint(point);
  const s = finiteNumber(scale, 1);
  return {x: p.x * s, y: p.y * s};
}

export function rotatePoint(point, center, radians) {
  const p = finitePoint(point), c = finitePoint(center);
  const cos = Math.cos(radians), sin = Math.sin(radians);
  const x = p.x - c.x, y = p.y - c.y;
  return {x: c.x + x * cos - y * sin, y: c.y + x * sin + y * cos};
}

export function rectangleFromPoints(points) {
  const list = safeArray(points).map(finitePoint);
  if (!list.length) return {minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0};
  const xs = list.map(p => p.x), ys = list.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  return {minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY};
}

export function expandRectangle(rect, amount) {
  const r = rect || {};
  const a = finiteNumber(amount);
  const minX = finiteNumber(r.minX) - a;
  const minY = finiteNumber(r.minY) - a;
  const maxX = finiteNumber(r.maxX) + a;
  const maxY = finiteNumber(r.maxY) + a;
  return {minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY};
}

export function rectangleContainsPoint(rect, point, padding = 0) {
  const r = rect || {}, p = finitePoint(point), pad = finiteNumber(padding);
  return p.x >= finiteNumber(r.minX) - pad && p.x <= finiteNumber(r.maxX) + pad && p.y >= finiteNumber(r.minY) - pad && p.y <= finiteNumber(r.maxY) + pad;
}

export function rectanglesIntersect(a, b) {
  if (!a || !b) return false;
  return !(a.maxX < b.minX || a.minX > b.maxX || a.maxY < b.minY || a.minY > b.maxY);
}

export function lineIsHorizontal(line, epsilon = 0.5) {
  return !!line && Math.abs(finiteNumber(line.y2) - finiteNumber(line.y1)) <= epsilon;
}

export function lineIsVertical(line, epsilon = 0.5) {
  return !!line && Math.abs(finiteNumber(line.x2) - finiteNumber(line.x1)) <= epsilon;
}

export function lineIsZeroLength(line, epsilon = 0.5) {
  return !!line && Math.hypot(finiteNumber(line.x2) - finiteNumber(line.x1), finiteNumber(line.y2) - finiteNumber(line.y1)) <= epsilon;
}

export function lineLength2D(line) {
  if (!line) return 0;
  return Math.hypot(finiteNumber(line.x2) - finiteNumber(line.x1), finiteNumber(line.y2) - finiteNumber(line.y1));
}

export function normalizeLineGeometry(line) {
  const copy = {...(line || {})};
  copy.x1 = finiteNumber(copy.x1);
  copy.y1 = finiteNumber(copy.y1);
  copy.x2 = finiteNumber(copy.x2);
  copy.y2 = finiteNumber(copy.y2);
  if (lineIsHorizontal(copy)) copy.y2 = copy.y1;
  if (lineIsVertical(copy)) copy.x2 = copy.x1;
  return copy;
}

export function moveLineHorizontal(line, deltaY) {
  const copy = normalizeLineGeometry(line);
  const d = finiteNumber(deltaY);
  copy.y1 += d;
  copy.y2 += d;
  return copy;
}

export function moveLineVertical(line, deltaX) {
  const copy = normalizeLineGeometry(line);
  const d = finiteNumber(deltaX);
  copy.x1 += d;
  copy.x2 += d;
  return copy;
}

export function moveLineFree(line, deltaX, deltaY) {
  const copy = normalizeLineGeometry(line);
  const dx = finiteNumber(deltaX), dy = finiteNumber(deltaY);
  copy.x1 += dx; copy.x2 += dx; copy.y1 += dy; copy.y2 += dy;
  return copy;
}

export function lineCenter(line) {
  return midpoint({x: line?.x1, y: line?.y1}, {x: line?.x2, y: line?.y2});
}

export function projectPointOntoLine(point, line) {
  const p = finitePoint(point);
  if (!line) return p;
  const x1 = finiteNumber(line.x1), y1 = finiteNumber(line.y1);
  const x2 = finiteNumber(line.x2), y2 = finiteNumber(line.y2);
  const dx = x2 - x1, dy = y2 - y1, len2 = dx * dx + dy * dy;
  if (!len2) return {x: x1, y: y1};
  const t = clampNumber(((p.x - x1) * dx + (p.y - y1) * dy) / len2, 0, 1);
  return {x: x1 + t * dx, y: y1 + t * dy};
}

export function pointToLineDistance(point, line) {
  return distance2D(finitePoint(point), projectPointOntoLine(point, line));
}

export function lineBoundingBox(line) {
  if (!line) return rectangleFromPoints([]);
  return rectangleFromPoints([{x: line.x1, y: line.y1}, {x: line.x2, y: line.y2}]);
}

export function orthogonalRoute(start, end, prefer = 'vertical-first') {
  const a = finitePoint(start), b = finitePoint(end);
  const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
  if (prefer === 'horizontal-first') {
    return [
      {x1: a.x, y1: a.y, x2: b.x, y2: a.y},
      {x1: b.x, y1: a.y, x2: b.x, y2: b.y}
    ];
  }
  return [
    {x1: a.x, y1: a.y, x2: a.x, y2: b.y},
    {x1: a.x, y1: b.y, x2: b.x, y2: b.y}
  ];
}

export function cleanOrthogonalRoute(start, end, prefer = 'vertical-first') {
  return orthogonalRoute(start, end, prefer).filter(line => !lineIsZeroLength(line));
}

export function routeThroughPoint(start, waypoint, end) {
  const a = finitePoint(start), w = finitePoint(waypoint), b = finitePoint(end);
  return [
    {x1: a.x, y1: a.y, x2: w.x, y2: w.y},
    {x1: w.x, y1: w.y, x2: b.x, y2: b.y}
  ].filter(line => !lineIsZeroLength(line));
}

export function pointKey(point, precision = 2) {
  const p = finitePoint(point), f = 10 ** precision;
  return `${Math.round(p.x * f) / f},${Math.round(p.y * f) / f}`;
}

export function lineKey(line, precision = 2) {
  const normalized = normalizeLineGeometry(line);
  return `${pointKey({x: normalized.x1, y: normalized.y1}, precision)}>${pointKey({x: normalized.x2, y: normalized.y2}, precision)}`;
}

export function uniqueLines(lines, precision = 2) {
  const map = new Map();
  for (const line of safeArray(lines)) map.set(lineKey(line, precision), line);
  return [...map.values()];
}

export function uniquePoints(points, precision = 2) {
  const map = new Map();
  for (const point of safeArray(points)) map.set(pointKey(point, precision), finitePoint(point));
  return [...map.values()];
}

export function shallowEqualObjects(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  return ak.every(key => Object.prototype.hasOwnProperty.call(b, key) && a[key] === b[key]);
}

export function stableStringify(value) {
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stableStringify(value[key])).join(',') + '}';
  }
  return JSON.stringify(value);
}

export function stateHash(value) {
  let hash = 2166136261;
  const text = stableStringify(value);
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function hasId(list, id) {
  return safeArray(list).some(item => item && item.id === id);
}

export function findById(list, id) {
  return safeArray(list).find(item => item && item.id === id) || null;
}

export function indexById(list) {
  const result = new Map();
  for (const item of safeArray(list)) if (item?.id != null) result.set(item.id, item);
  return result;
}

export function removeId(list, id) {
  return safeArray(list).filter(item => item?.id !== id);
}

export function replaceId(list, id, replacement) {
  return safeArray(list).map(item => item?.id === id ? replacement : item);
}

export function updateId(list, id, updater) {
  return safeArray(list).map(item => item?.id === id ? updater(item) : item);
}

export function personDisplayName(person) {
  return [person?.first, person?.middle, person?.last].filter(Boolean).join(' ').trim();
}

export function personHasContent(person) {
  return Boolean(personDisplayName(person) || safeArray(person?.info).some(line => safeString(line).trim()));
}

export function normalizePerson(person) {
  const p = {...safeObject(person)};
  p.id = safeString(p.id, 'person');
  p.first = safeString(p.first);
  p.middle = safeString(p.middle);
  p.last = safeString(p.last);
  p.info = safeArray(p.info).map(safeString);
  p.x = finiteNumber(p.x);
  p.y = finiteNumber(p.y);
  p.radius = clampNumber(p.radius, 1, 500);
  p.category = safeString(p.category, 'unknown');
  p.placeholder = Boolean(p.placeholder);
  p.locked = Boolean(p.locked);
  return p;
}

export function normalizePeople(people) {
  return safeArray(people).map(normalizePerson);
}

export function normalizeSegment(segment) {
  const s = normalizeLineGeometry(segment);
  s.id = safeString(s.id, 'segment');
  s.original = Boolean(s.original);
  s.locked = Boolean(s.locked);
  return s;
}

export function normalizeSegments(segments) {
  return safeArray(segments).map(normalizeSegment);
}

export function normalizeTreeState(state) {
  const source = safeObject(state);
  return {
    ...source,
    version: 5,
    people: normalizePeople(source.people),
    segments: normalizeSegments(source.segments),
    meta: {
      width: finiteNumber(source.meta?.width, 3300),
      height: finiteNumber(source.meta?.height, 1360)
    }
  };
}

export function validatePerson(person) {
  const errors = [];
  if (!person?.id) errors.push('Person has no id');
  if (!Number.isFinite(Number(person?.x))) errors.push('Person x is invalid');
  if (!Number.isFinite(Number(person?.y))) errors.push('Person y is invalid');
  return errors;
}

export function validateSegment(segment) {
  const errors = [];
  if (!segment?.id) errors.push('Segment has no id');
  for (const key of ['x1', 'y1', 'x2', 'y2']) {
    if (!Number.isFinite(Number(segment?.[key]))) errors.push(`Segment ${key} is invalid`);
  }
  return errors;
}

export function validateTreeState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return ['State is not an object'];
  if (!Array.isArray(state.people)) errors.push('People is not an array');
  if (!Array.isArray(state.segments)) errors.push('Segments is not an array');
  for (const person of safeArray(state.people)) errors.push(...validatePerson(person));
  for (const segment of safeArray(state.segments)) errors.push(...validateSegment(segment));
  return errors;
}

export function countNamedPeople(state) {
  return safeArray(state?.people).filter(person => personDisplayName(person)).length;
}

export function countPlaceholders(state) {
  return safeArray(state?.people).filter(person => person?.placeholder).length;
}

export function countOriginalSegments(state) {
  return safeArray(state?.segments).filter(segment => segment?.original).length;
}

export function countGeneratedSegments(state) {
  return safeArray(state?.segments).filter(segment => !segment?.original).length;
}

export function treeSummary(state) {
  return {
    people: safeArray(state?.people).length,
    namedPeople: countNamedPeople(state),
    placeholders: countPlaceholders(state),
    segments: safeArray(state?.segments).length,
    originalSegments: countOriginalSegments(state),
    generatedSegments: countGeneratedSegments(state),
    hash: stateHash(state)
  };
}

export function makeDraft(person) {
  return normalizePerson(person);
}

export function applyDraft(person, draft) {
  const next = normalizePerson({...person, ...draft});
  Object.assign(person, next);
  return person;
}

export function diffPerson(a, b) {
  const left = normalizePerson(a), right = normalizePerson(b);
  const keys = ['first', 'middle', 'last', 'info', 'x', 'y', 'radius', 'category', 'placeholder', 'locked'];
  const changed = {};
  for (const key of keys) {
    const av = stableStringify(left[key]), bv = stableStringify(right[key]);
    if (av !== bv) changed[key] = {before: left[key], after: right[key]};
  }
  return changed;
}

export function diffSegment(a, b) {
  const left = normalizeSegment(a), right = normalizeSegment(b);
  const changed = {};
  for (const key of ['x1', 'y1', 'x2', 'y2', 'locked']) {
    if (left[key] !== right[key]) changed[key] = {before: left[key], after: right[key]};
  }
  return changed;
}

export function serializeSafe(value) {
  return JSON.stringify(value, null, 2);
}

export function parseSafe(text, fallback = null) {
  try { return JSON.parse(text); } catch (_) { return fallback; }
}

export function encodeBase64(text) {
  try { return btoa(unescape(encodeURIComponent(String(text)))); } catch (_) { return ''; }
}

export function decodeBase64(text) {
  try { return decodeURIComponent(escape(atob(String(text)))); } catch (_) { return ''; }
}

export function csvEscape(value) {
  const text = safeString(value);
  return /[",\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

export function personToCsvRow(person) {
  return [person?.id, person?.first, person?.middle, person?.last, safeArray(person?.info).join(' | '), person?.x, person?.y, person?.category, person?.locked].map(csvEscape).join(',');
}

export function peopleToCsv(state) {
  const header = 'id,first,middle,last,info,x,y,category,locked';
  return [header, ...safeArray(state?.people).map(personToCsvRow)].join('\n');
}

export function segmentToCsvRow(segment) {
  return [segment?.id, segment?.x1, segment?.y1, segment?.x2, segment?.y2, segment?.original, segment?.locked].map(csvEscape).join(',');
}

export function segmentsToCsv(state) {
  const header = 'id,x1,y1,x2,y2,original,locked';
  return [header, ...safeArray(state?.segments).map(segmentToCsvRow)].join('\n');
}

export function worldToScreen(point, view) {
  const p = finitePoint(point), zoom = finiteNumber(view?.zoom, 1);
  return {x: p.x * zoom + finiteNumber(view?.panX), y: p.y * zoom + finiteNumber(view?.panY)};
}

export function screenToWorld(point, view) {
  const p = finitePoint(point), zoom = finiteNumber(view?.zoom, 1) || 1;
  return {x: (p.x - finiteNumber(view?.panX)) / zoom, y: (p.y - finiteNumber(view?.panY)) / zoom};
}

export function zoomAroundPoint(view, factor, screenPoint) {
  const before = screenToWorld(screenPoint, view);
  const nextZoom = clampNumber(finiteNumber(view?.zoom, 1) * finiteNumber(factor, 1), 0.1, 5);
  const after = worldToScreen(before, {...view, zoom: nextZoom});
  return {...view, zoom: nextZoom, panX: finiteNumber(view?.panX) + screenPoint.x - after.x, panY: finiteNumber(view?.panY) + screenPoint.y - after.y};
}

export function fitWorldToViewport(worldWidth, worldHeight, viewportWidth, viewportHeight, padding = 40) {
  const w = Math.max(1, finiteNumber(worldWidth)), h = Math.max(1, finiteNumber(worldHeight));
  const vw = Math.max(1, finiteNumber(viewportWidth) - padding * 2), vh = Math.max(1, finiteNumber(viewportHeight) - padding * 2);
  const zoom = clampNumber(Math.min(vw / w, vh / h), 0.1, 5);
  return {zoom, panX: (finiteNumber(viewportWidth) - w * zoom) / 2, panY: (finiteNumber(viewportHeight) - h * zoom) / 2};
}

export function colorIsKnown(category) {
  return ['paternal', 'maternal', 'merge', 'unknown', 'collateral'].includes(category);
}

export function normalizeCategory(category) {
  return colorIsKnown(category) ? category : 'unknown';
}

export function safeFilename(value, fallback = 'family-tree') {
  const text = safeString(value, fallback).replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '');
  return text || fallback;
}

export function timestampId(prefix = 'id') {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${time}_${random}`;
}

export function eventPath(target) {
  const path = [];
  let node = target;
  while (node) { path.push(node); node = node.parentElement; }
  return path;
}

export function closestFromPath(target, selector) {
  for (const node of eventPath(target)) {
    if (node?.matches?.(selector)) return node;
  }
  return null;
}

export function isEditableElement(element) {
  if (!element) return false;
  const tag = element.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || element.isContentEditable;
}

export function shouldHandleShortcut(event) {
  return !isEditableElement(event?.target);
}

export function preventDefault(event) {
  if (event?.preventDefault) event.preventDefault();
  return false;
}

export function consumeEvent(event) {
  if (event?.stopPropagation) event.stopPropagation();
  if (event?.preventDefault) event.preventDefault();
  return false;
}

export function makeNoop() { return undefined; }

/*
 * The remainder of this module intentionally exposes a family of named,
 * composable helpers rather than hidden global state. These wrappers are useful
 * to future editor tools, importers, validators, and UI tests.
 */

export function v5Utility1(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility2(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility3(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility4(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility5(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility6(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility7(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility8(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility9(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility10(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility11(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility12(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility13(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility14(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility15(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility16(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility17(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility18(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility19(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility20(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility21(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility22(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility23(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility24(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility25(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility26(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility27(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility28(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility29(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility30(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility31(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility32(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility33(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility34(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility35(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility36(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility37(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility38(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility39(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility40(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility41(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility42(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility43(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility44(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility45(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility46(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility47(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility48(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility49(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility50(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility51(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility52(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility53(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility54(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility55(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility56(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility57(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility58(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility59(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility60(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility61(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility62(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility63(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility64(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility65(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility66(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility67(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility68(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility69(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility70(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility71(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility72(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility73(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility74(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility75(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility76(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility77(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility78(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility79(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility80(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility81(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility82(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility83(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility84(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility85(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility86(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility87(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility88(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility89(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility90(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility91(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility92(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility93(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility94(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility95(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility96(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility97(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility98(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility99(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility100(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility101(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility102(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility103(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility104(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility105(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility106(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility107(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility108(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility109(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility110(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility111(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility112(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility113(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility114(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility115(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility116(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility117(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility118(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility119(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility120(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility121(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility122(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility123(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility124(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility125(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility126(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility127(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility128(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility129(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility130(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility131(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility132(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility133(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility134(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility135(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility136(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility137(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility138(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility139(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility140(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility141(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility142(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility143(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility144(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility145(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility146(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility147(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility148(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility149(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility150(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility151(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility152(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility153(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility154(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility155(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility156(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility157(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility158(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility159(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility160(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility161(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility162(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility163(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility164(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility165(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility166(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility167(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility168(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility169(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility170(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility171(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility172(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility173(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility174(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility175(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility176(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility177(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility178(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility179(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility180(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility181(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility182(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility183(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility184(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility185(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility186(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility187(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility188(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility189(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility190(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility191(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility192(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility193(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility194(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility195(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility196(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility197(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility198(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility199(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility200(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility201(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility202(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility203(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility204(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility205(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility206(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility207(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility208(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility209(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility210(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility211(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility212(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility213(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility214(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility215(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility216(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility217(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility218(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility219(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility220(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility221(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility222(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility223(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility224(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility225(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility226(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility227(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility228(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility229(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility230(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility231(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility232(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility233(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility234(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility235(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility236(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility237(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility238(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility239(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility240(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility241(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility242(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility243(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility244(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility245(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility246(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility247(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility248(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility249(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility250(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility251(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility252(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility253(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility254(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility255(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility256(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility257(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility258(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility259(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility260(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility261(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility262(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility263(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility264(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility265(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility266(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility267(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility268(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility269(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility270(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility271(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility272(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility273(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility274(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility275(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility276(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility277(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility278(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility279(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility280(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility281(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility282(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility283(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility284(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility285(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility286(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility287(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility288(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility289(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility290(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility291(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility292(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility293(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility294(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility295(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility296(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility297(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility298(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility299(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility300(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility301(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility302(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility303(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility304(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility305(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility306(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility307(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility308(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility309(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility310(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility311(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility312(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility313(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility314(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility315(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility316(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility317(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility318(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility319(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility320(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility321(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility322(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility323(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility324(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility325(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility326(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility327(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility328(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility329(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility330(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility331(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility332(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility333(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility334(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility335(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility336(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility337(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility338(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility339(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility340(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility341(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility342(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility343(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility344(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility345(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility346(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility347(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility348(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility349(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility350(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility351(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility352(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility353(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility354(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility355(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility356(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility357(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility358(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility359(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility360(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility361(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility362(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility363(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility364(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility365(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility366(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility367(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility368(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility369(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility370(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility371(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility372(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility373(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility374(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility375(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility376(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility377(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility378(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility379(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility380(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility381(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility382(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility383(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility384(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility385(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility386(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility387(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility388(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility389(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility390(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility391(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility392(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility393(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility394(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility395(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility396(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility397(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility398(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility399(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility400(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility401(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility402(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility403(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility404(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility405(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility406(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility407(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility408(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility409(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility410(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility411(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility412(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility413(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility414(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility415(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility416(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility417(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility418(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility419(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility420(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility421(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility422(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility423(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility424(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility425(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility426(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility427(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility428(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility429(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility430(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility431(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility432(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility433(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility434(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility435(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility436(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility437(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility438(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility439(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility440(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility441(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility442(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility443(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility444(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility445(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility446(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility447(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility448(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility449(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility450(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility451(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility452(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility453(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility454(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility455(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility456(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility457(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility458(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility459(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility460(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility461(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility462(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility463(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility464(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility465(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility466(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility467(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility468(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility469(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility470(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility471(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility472(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility473(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility474(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility475(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility476(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility477(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility478(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility479(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility480(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility481(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility482(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility483(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility484(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility485(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility486(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility487(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility488(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility489(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility490(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility491(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility492(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility493(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility494(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility495(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility496(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility497(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility498(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility499(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility500(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility501(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility502(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility503(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility504(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility505(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility506(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility507(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility508(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility509(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility510(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility511(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility512(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility513(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility514(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility515(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility516(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility517(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility518(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility519(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility520(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility521(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility522(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility523(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility524(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility525(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility526(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility527(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility528(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility529(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility530(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility531(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility532(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility533(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility534(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility535(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility536(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility537(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility538(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility539(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility540(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility541(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility542(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility543(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility544(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility545(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility546(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility547(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility548(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility549(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility550(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility551(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility552(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility553(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility554(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility555(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility556(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility557(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility558(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility559(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility560(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility561(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility562(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility563(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility564(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility565(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility566(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility567(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility568(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility569(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility570(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility571(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility572(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility573(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility574(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility575(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility576(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility577(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility578(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility579(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility580(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility581(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility582(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility583(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility584(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility585(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility586(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility587(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility588(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility589(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility590(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility591(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility592(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility593(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility594(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility595(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility596(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility597(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility598(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility599(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility600(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility601(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility602(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility603(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility604(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility605(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility606(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility607(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility608(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility609(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility610(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility611(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility612(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility613(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility614(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility615(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility616(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility617(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility618(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility619(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility620(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility621(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility622(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility623(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility624(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility625(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility626(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility627(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility628(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility629(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility630(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility631(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility632(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility633(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility634(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility635(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility636(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility637(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility638(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility639(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility640(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility641(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility642(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility643(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility644(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility645(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility646(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility647(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility648(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility649(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility650(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility651(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility652(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility653(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility654(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility655(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility656(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility657(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility658(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility659(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility660(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility661(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility662(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility663(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility664(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility665(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility666(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility667(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility668(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility669(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility670(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility671(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility672(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility673(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility674(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility675(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility676(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility677(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility678(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility679(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility680(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility681(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility682(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility683(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility684(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility685(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility686(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility687(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility688(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility689(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility690(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility691(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility692(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility693(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility694(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility695(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility696(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility697(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility698(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility699(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility700(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility701(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility702(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility703(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility704(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility705(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility706(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility707(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility708(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility709(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility710(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility711(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility712(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility713(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility714(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility715(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility716(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility717(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility718(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility719(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility720(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility721(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility722(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility723(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility724(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility725(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility726(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility727(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility728(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility729(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility730(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility731(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility732(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility733(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility734(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility735(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility736(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility737(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility738(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility739(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility740(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility741(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility742(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility743(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility744(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility745(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility746(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility747(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility748(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility749(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility750(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility751(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility752(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility753(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility754(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility755(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility756(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility757(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility758(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility759(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility760(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility761(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility762(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility763(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility764(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility765(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility766(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility767(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility768(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility769(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility770(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility771(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility772(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility773(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility774(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility775(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility776(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility777(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility778(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility779(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility780(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility781(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility782(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility783(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility784(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility785(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility786(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility787(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility788(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility789(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility790(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility791(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility792(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility793(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility794(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility795(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility796(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility797(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility798(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility799(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility800(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility801(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility802(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility803(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility804(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility805(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility806(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility807(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility808(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility809(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility810(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility811(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility812(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility813(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility814(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility815(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility816(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility817(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility818(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility819(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility820(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility821(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility822(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility823(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility824(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility825(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility826(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility827(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility828(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility829(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility830(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility831(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility832(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility833(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility834(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility835(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility836(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility837(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility838(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility839(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility840(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility841(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility842(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility843(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility844(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility845(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility846(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility847(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility848(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility849(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility850(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility851(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility852(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility853(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility854(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility855(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility856(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility857(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility858(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility859(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility860(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility861(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility862(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility863(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility864(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility865(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility866(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility867(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility868(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility869(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility870(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility871(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility872(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility873(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility874(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility875(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility876(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility877(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility878(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility879(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility880(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility881(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility882(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility883(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility884(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility885(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility886(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility887(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility888(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility889(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility890(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility891(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility892(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility893(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility894(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility895(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility896(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility897(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility898(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility899(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility900(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility901(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility902(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility903(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility904(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility905(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility906(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility907(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility908(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility909(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility910(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility911(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility912(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility913(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility914(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility915(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility916(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility917(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility918(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility919(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility920(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility921(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility922(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility923(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility924(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility925(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility926(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility927(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility928(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility929(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility930(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility931(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility932(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility933(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility934(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility935(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility936(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility937(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility938(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility939(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility940(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility941(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility942(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility943(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility944(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility945(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility946(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility947(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility948(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility949(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility950(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility951(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility952(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility953(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility954(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility955(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility956(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility957(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility958(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility959(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility960(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility961(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility962(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility963(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility964(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility965(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility966(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility967(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility968(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility969(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility970(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility971(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility972(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility973(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility974(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility975(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility976(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility977(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility978(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility979(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility980(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility981(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility982(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility983(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility984(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility985(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility986(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility987(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility988(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility989(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility990(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility991(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility992(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility993(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility994(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility995(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility996(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility997(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility998(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility999(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1000(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1001(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1002(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1003(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1004(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1005(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1006(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1007(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1008(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1009(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1010(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1011(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1012(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1013(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1014(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1015(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1016(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1017(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1018(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1019(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1020(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1021(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1022(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1023(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1024(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1025(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1026(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1027(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1028(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1029(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1030(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1031(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1032(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1033(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1034(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1035(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1036(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1037(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1038(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1039(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1040(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1041(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1042(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1043(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1044(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1045(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1046(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1047(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1048(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1049(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1050(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1051(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1052(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1053(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1054(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1055(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1056(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1057(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1058(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1059(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1060(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1061(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1062(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1063(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1064(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1065(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1066(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1067(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1068(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1069(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1070(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1071(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1072(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1073(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1074(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1075(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1076(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1077(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1078(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1079(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1080(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1081(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1082(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1083(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1084(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1085(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1086(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1087(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1088(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1089(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1090(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1091(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1092(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1093(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1094(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1095(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1096(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1097(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1098(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1099(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1100(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1101(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1102(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1103(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1104(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1105(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1106(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1107(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1108(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1109(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1110(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1111(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1112(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1113(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1114(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1115(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1116(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1117(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1118(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1119(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1120(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1121(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1122(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1123(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1124(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1125(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1126(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1127(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1128(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1129(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1130(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1131(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1132(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1133(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1134(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1135(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1136(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1137(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1138(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1139(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1140(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1141(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1142(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1143(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1144(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1145(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1146(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1147(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1148(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1149(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}

export function v5Utility1150(value = 0, delta = 0, limit = 1000000) {
  const base = Number.isFinite(Number(value)) ? Number(value) : 0;
  const change = Number.isFinite(Number(delta)) ? Number(delta) : 0;
  const result = base + change;
  return Math.max(-Math.abs(limit), Math.min(Math.abs(limit), result));
}
