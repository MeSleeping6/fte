/*
 * V5 CONTROLLER
 * -----------------------------------------------------------------------------
 * This controller is intentionally explicit. V5 separates three different
 * concepts that V4 blurred together:
 *
 * 1. editing a person's draft fields,
 * 2. saving those fields to the browser,
 * 3. editing/deleting connector geometry.
 *
 * The line-editing switch NEVER disables line deletion. Delete-line mode is a
 * separate operation so a user can lock down connector geometry while still
 * cleaning up unwanted connector segments.
 */
import {
  qs, svgEl, clone, fullName, splitLines, getPerson, getSegment,
  History, Store, ViewportState, isHorizontal, isVertical,
  orthogonalSegments, createPerson, clamp, downloadText, serialize,
  deserialize
} from './core.js';
import {TreeRenderer} from './renderer.js';
import {RelationshipBuilder} from './relations.js';

export class FamilyTreeEditor {
  constructor(svg, state) {
    this.svg = svg;
    this.state = state;
    this.originalState = clone(state);
    this.history = new History(state, 300);
    this.store = new Store();
    this.view = new ViewportState();
    this.renderer = new TreeRenderer(svg, state);
    this.relations = new RelationshipBuilder(state, this.renderer);

    this.selection = {personId: null, lineId: null};
    this.mode = 'select';
    this.lineEditingEnabled = true;
    this.panel = qs('#panel');
    this.canvas = qs('#canvasWrap');
    this.toastElement = qs('#toast');
    this.map = qs('#minimap');
    this.mapCanvas = qs('#mapCanvas');

    this.drag = null;
    this.panDrag = null;
    this.draw = null;
    this.movePersonDrag = null;
    this.personDraft = null;
    this.dirty = false;
    this.toastTimer = null;

    this.init();
  }

  /* -------------------------------------------------------------------------
   * Boot
   * ---------------------------------------------------------------------- */
  init() {
    this.renderer.initializeOriginalDom();
    this.renderer.setInteraction({lineEditing: true, deleteMode: false});
    this.bindToolbar();
    this.bindCanvas();
    this.render();
    this.fit();
    this.updateHistoryButtons();
    this.updateStatus('Original tree loaded — 59 people and 83 original connector segments');
  }

  bindToolbar() {
    qs('#selectTool').addEventListener('click', () => this.setMode('select'));
    qs('#moveTool').addEventListener('click', () => this.setMode('move'));
    qs('#drawTool').addEventListener('click', () => {
      if (!this.lineEditingEnabled) return;
      this.setMode('draw');
    });
    qs('#deleteLineTool').addEventListener('click', () => {
      this.setMode(this.mode === 'delete-line' ? 'select' : 'delete-line');
    });

    qs('#lineEditingToggle').addEventListener('change', event => {
      this.lineEditingEnabled = !!event.target.checked;
      this.renderer.setInteraction({
        lineEditing: this.lineEditingEnabled,
        deleteMode: this.mode === 'delete-line'
      });
      if (!this.lineEditingEnabled && this.mode === 'draw') {
        this.setMode('select');
      } else {
        this.render();
      }
      this.updateStatus(
        this.lineEditingEnabled
          ? 'Line editing enabled'
          : 'Line editing disabled — line deletion remains available'
      );
    });

    qs('#undoBtn').addEventListener('click', () => this.undo());
    qs('#redoBtn').addEventListener('click', () => this.redo());
    qs('#zoomOut').addEventListener('click', () => this.zoomAroundCenter(.8));
    qs('#zoomIn').addEventListener('click', () => this.zoomAroundCenter(1.25));
    qs('#fitBtn').addEventListener('click', () => this.fit());
    qs('#newPersonBtn').addEventListener('click', () => this.newPersonAtCenter());
    qs('#mapBtn').addEventListener('click', () => this.map.classList.toggle('hidden'));
    qs('#saveBtn').addEventListener('click', () => this.save());
    qs('#resetBtn').addEventListener('click', () => this.reset());
    qs('#exportBtn').addEventListener('click', () => this.export());
    qs('#importBtn').addEventListener('click', () => qs('#importFile').click());
    qs('#importFile').addEventListener('change', event => this.importFile(event));
  }

  bindCanvas() {
    this.canvas.addEventListener('pointerdown', event => this.onPointerDown(event));
    window.addEventListener('pointermove', event => this.onPointerMove(event));
    window.addEventListener('pointerup', event => this.onPointerUp(event));
    this.canvas.addEventListener('wheel', event => this.onWheel(event), {passive: false});
    this.canvas.addEventListener('click', event => this.onCanvasClick(event));
    window.addEventListener('keydown', event => this.onKeyDown(event));
    window.addEventListener('resize', () => this.drawMap());
  }

  /* -------------------------------------------------------------------------
   * Modes
   * ---------------------------------------------------------------------- */
  setMode(mode) {
    if (mode === 'draw' && !this.lineEditingEnabled) {
      this.showToast('Enable Line editing first');
      return;
    }

    this.mode = mode;
    if (mode !== 'delete-line') {
      this.selection.lineId = null;
    }

    ['select', 'move', 'draw'].forEach(name => {
      const button = qs('#' + name + 'Tool');
      if (button) button.classList.toggle('active', name === mode);
    });
    qs('#deleteLineTool').classList.toggle('delete-line-active', mode === 'delete-line');
    this.canvas.classList.toggle('draw-mode', mode === 'draw');

    this.renderer.setInteraction({
      lineEditing: this.lineEditingEnabled,
      deleteMode: mode === 'delete-line'
    });
    this.updateHelp();
    this.render();
  }

  updateHelp() {
    const text =
      this.mode === 'draw'
        ? 'Draw line: drag to create a straight orthogonal path · release to commit'
        : this.mode === 'move'
          ? 'Move person: drag a person to reposition it'
          : this.mode === 'delete-line'
            ? 'Delete line: click any connector to remove it · this remains available when line editing is disabled'
            : this.lineEditingEnabled
              ? 'Click a person to edit · click/drag a connector to edit it · drag empty space to pan · wheel to zoom'
              : 'Line editing is OFF · click a person to edit · drag empty space to pan · use Delete line to remove connectors';
    qs('#helpStrip').textContent = text;
  }

  /* -------------------------------------------------------------------------
   * Rendering and history
   * ---------------------------------------------------------------------- */
  render() {
    this.renderer.setState(this.state);
    this.renderer.setInteraction({
      lineEditing: this.lineEditingEnabled,
      deleteMode: this.mode === 'delete-line'
    });
    this.renderer.render(this.selection);
    this.updateTransform();
    this.drawMap();
    this.updateHistoryButtons();
  }

  commit(label = 'Change', persist = false) {
    this.history.push(this.state);
    this.dirty = true;
    this.updateHistoryButtons();
    this.updateStatus(label);
    if (persist) this.save(false);
  }

  undo() {
    const next = this.history.undo();
    if (!next) return;
    this.state = next;
    this.relations.state = next;
    this.renderer.setState(next);
    this.clearSelection();
    this.render();
    this.updateStatus('Undo');
  }

  redo() {
    const next = this.history.redo();
    if (!next) return;
    this.state = next;
    this.relations.state = next;
    this.renderer.setState(next);
    this.clearSelection();
    this.render();
    this.updateStatus('Redo');
  }

  updateHistoryButtons() {
    qs('#undoBtn').disabled = !this.history.canUndo();
    qs('#redoBtn').disabled = !this.history.canRedo();
  }

  /* -------------------------------------------------------------------------
   * Selection
   * ---------------------------------------------------------------------- */
  selectPerson(id) {
    const person = getPerson(this.state, id);
    if (!person) return;
    this.selection = {personId: id, lineId: null};
    this.renderer.render(this.selection);
    this.openPersonPanel(person);
    this.updateStatus('Selected ' + (fullName(person) || 'blank person'));
  }

  selectLine(id) {
    if (!this.lineEditingEnabled) return;
    const line = getSegment(this.state, id);
    if (!line) return;
    this.selection = {personId: null, lineId: id};
    this.renderer.render(this.selection);
    this.openLinePanel(line);
    this.updateStatus('Selected connector');
  }

  clearSelection() {
    this.selection = {personId: null, lineId: null};
    this.closePanel();
    this.renderer.render(this.selection);
  }

  /* -------------------------------------------------------------------------
   * Pointer interaction
   * ---------------------------------------------------------------------- */
  onCanvasClick(event) {
    if (
      event.target.closest('.person-hit') ||
      event.target.closest('.fte-new-person') ||
      event.target.closest('.line-hit')
    ) return;
    if (this.mode === 'select') this.clearSelection();
  }

  onPointerDown(event) {
    if (event.button !== 0) return;

    const personHit = event.target.closest('.person-hit,.fte-new-person');
    const lineHit = event.target.closest('.line-hit');

    if (this.mode === 'delete-line') {
      if (lineHit) {
        this.deleteLine(getSegment(this.state, lineHit.dataset.segmentId));
        return;
      }
      if (!personHit) this.startPan(event);
      return;
    }

    if (this.mode === 'draw') {
      if (personHit || lineHit) return;
      const start = this.clientToWorld(event);
      this.draw = {start, current: start};
      this.renderDrawPreview();
      return;
    }

    if (lineHit && this.mode === 'select') {
      if (!this.lineEditingEnabled) return;
      const id = lineHit.dataset.segmentId;
      this.selectLine(id);
      this.beginLineDrag(event, id);
      return;
    }

    if (personHit) {
      const id = personHit.dataset.personId;
      const person = getPerson(this.state, id);
      if (!person) return;
      if (this.mode === 'move') {
        if (person.locked) {
          this.showToast('This person is locked');
          return;
        }
        this.selectPerson(id);
        this.beginPersonDrag(event, id);
      } else {
        this.selectPerson(id);
      }
      return;
    }

    if (this.mode === 'select' || this.mode === 'move') this.startPan(event);
  }

  startPan(event) {
    this.panDrag = {
      startX: event.clientX,
      startY: event.clientY,
      panX: this.view.panX,
      panY: this.view.panY
    };
    this.canvas.classList.add('grabbing');
  }

  onPointerMove(event) {
    if (this.draw) {
      this.draw.current = this.clientToWorld(event);
      this.renderDrawPreview();
      return;
    }
    if (this.drag) {
      this.moveLine(event);
      return;
    }
    if (this.movePersonDrag) {
      this.movePerson(event);
      return;
    }
    if (this.panDrag) {
      this.view.setPan(
        this.panDrag.panX + event.clientX - this.panDrag.startX,
        this.panDrag.panY + event.clientY - this.panDrag.startY
      );
      this.updateTransform();
      this.drawMap();
    }
  }

  onPointerUp() {
    if (this.draw) {
      this.finishDraw();
      return;
    }
    if (this.drag) {
      this.finishLineDrag();
      return;
    }
    if (this.movePersonDrag) {
      this.finishPersonDrag();
      return;
    }
    if (this.panDrag) {
      this.panDrag = null;
      this.canvas.classList.remove('grabbing');
    }
  }

  /* -------------------------------------------------------------------------
   * Connector editing
   * ---------------------------------------------------------------------- */
  beginLineDrag(event, id) {
    if (!this.lineEditingEnabled) return;
    const line = getSegment(this.state, id);
    if (!line || line.locked) {
      if (line?.locked) this.showToast('This connector is locked');
      return;
    }
    this.drag = {
      id,
      origin: clone(line),
      startX: event.clientX,
      startY: event.clientY,
      changed: false
    };
  }

  moveLine(event) {
    if (!this.lineEditingEnabled || !this.drag) return;
    const drag = this.drag;
    const line = getSegment(this.state, drag.id);
    if (!line) return;

    if (!drag.changed) {
      this.history.push(this.state);
      drag.changed = true;
      this.dirty = true;
    }

    const dx = (event.clientX - drag.startX) / this.view.zoom;
    const dy = (event.clientY - drag.startY) / this.view.zoom;

    if (isHorizontal(drag.origin)) {
      line.y1 = drag.origin.y1 + dy;
      line.y2 = line.y1;
    } else if (isVertical(drag.origin)) {
      line.x1 = drag.origin.x1 + dx;
      line.x2 = line.x1;
    } else {
      line.x1 = drag.origin.x1 + dx;
      line.x2 = drag.origin.x2 + dx;
      line.y1 = drag.origin.y1 + dy;
      line.y2 = drag.origin.y2 + dy;
    }

    this.renderer.render(this.selection);
    this.updateTransform();
    this.drawMap();
  }

  finishLineDrag() {
    if (this.drag?.changed) this.updateStatus('Connector moved');
    this.drag = null;
    this.updateHistoryButtons();
  }

  deleteLine(line) {
    if (!line) return;
    const before = this.state.segments.length;
    this.state.segments = this.state.segments.filter(segment => segment.id !== line.id);
    if (this.state.segments.length === before) return;
    this.commit('Connector deleted', true);
    this.selection = {personId: null, lineId: null};
    this.closePanel();
    this.render();
    this.showToast('Connector deleted');
  }

  openLinePanel(line) {
    if (!line || !this.lineEditingEnabled) return;
    const direction = isHorizontal(line)
      ? 'horizontal — drag vertically'
      : isVertical(line)
        ? 'vertical — drag horizontally'
        : 'angled — drag freely';

    this.panel.classList.add('open');
    this.panel.innerHTML = `
      <div class="editor-panel-inner">
        <button class="close-panel" id="closePanel">×</button>
        <h2>Connector</h2>
        <div class="small">Selected segment: ${this.escape(direction)}.</div>
        <div class="panel-section">
          <div class="panel-title">Line geometry</div>
          <div class="small">
            Start: ${line.x1.toFixed(1)}, ${line.y1.toFixed(1)}<br>
            End: ${line.x2.toFixed(1)}, ${line.y2.toFixed(1)}
          </div>
        </div>
        <div class="panel-section">
          <div class="panel-buttons">
            <button id="lockLine">${line.locked ? 'Unlock' : 'Lock'}</button>
            <button id="deleteLine" class="danger">Delete line</button>
          </div>
        </div>
        <div class="panel-section">
          <div class="small">
            The Delete line tool in the top bar works even when Line editing is OFF.
          </div>
        </div>
      </div>`;

    qs('#closePanel').onclick = () => this.closePanel();
    qs('#lockLine').onclick = () => {
      line.locked = !line.locked;
      this.commit(line.locked ? 'Line locked' : 'Line unlocked', true);
      this.render();
      this.openLinePanel(line);
    };
    qs('#deleteLine').onclick = () => this.deleteLine(line);
  }

  /* -------------------------------------------------------------------------
   * Manual drawing
   * ---------------------------------------------------------------------- */
  renderDrawPreview() {
    let preview = qs('#drawPreview');
    if (!preview) {
      preview = svgEl('g', {id: 'drawPreview'});
      this.svg.appendChild(preview);
    }
    preview.innerHTML = '';
    if (!this.draw) return;

    orthogonalSegments(this.draw.start, this.draw.current).forEach(segment => {
      preview.appendChild(svgEl('line', {
        x1: segment.x1,
        y1: segment.y1,
        x2: segment.x2,
        y2: segment.y2,
        class: 'draw-preview'
      }));
    });
  }

  finishDraw() {
    const draw = this.draw;
    this.draw = null;
    const preview = qs('#drawPreview');
    if (preview) preview.remove();
    if (!draw || !this.lineEditingEnabled) return;

    const segments = orthogonalSegments(draw.start, draw.current);
    if (!segments.length) return;

    segments.forEach(segment => this.state.segments.push(segment));
    this.commit('New connector drawn', true);
    this.render();
  }

  /* -------------------------------------------------------------------------
   * People
   * ---------------------------------------------------------------------- */
  beginPersonDrag(event, id) {
    const person = getPerson(this.state, id);
    if (!person || person.locked) return;
    this.movePersonDrag = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      originX: person.x,
      originY: person.y,
      changed: false
    };
  }

  movePerson(event) {
    const drag = this.movePersonDrag;
    const person = getPerson(this.state, drag.id);
    if (!person) return;

    if (!drag.changed) {
      this.history.push(this.state);
      drag.changed = true;
      this.dirty = true;
    }

    person.x = drag.originX + (event.clientX - drag.startX) / this.view.zoom;
    person.y = drag.originY + (event.clientY - drag.startY) / this.view.zoom;
    this.renderer.render(this.selection);
    this.updateTransform();
    this.drawMap();
  }

  finishPersonDrag() {
    if (this.movePersonDrag?.changed) this.updateStatus('Person moved');
    this.movePersonDrag = null;
    this.updateHistoryButtons();
  }

  newPersonAtCenter() {
    const rect = this.canvas.getBoundingClientRect();
    const point = this.view.screenToWorld({x: rect.width / 2, y: rect.height / 2});
    const person = createPerson(point.x, point.y, 'unknown');
    this.state.people.push(person);
    this.commit('New person');
    this.render();
    this.selectPerson(person.id);
  }

  addParents(person) {
    if (person.locked) return this.showToast('This person is locked');
    this.relations.state = this.state;
    const people = this.relations.addParents(person);
    this.commit('Added two parents');
    this.render();
    if (people[0]) this.selectPerson(people[0].id);
  }

  addSpouse(person) {
    if (person.locked) return this.showToast('This person is locked');
    this.relations.state = this.state;
    const spouse = this.relations.addSpouse(person);
    this.commit('Added spouse');
    this.render();
    this.selectPerson(spouse.id);
  }

  addChild(person) {
    if (person.locked) return this.showToast('This person is locked');
    this.relations.state = this.state;
    const child = this.relations.addChild(person);
    this.commit('Added child');
    this.render();
    this.selectPerson(child.id);
  }

  addSibling(person) {
    if (person.locked) return this.showToast('This person is locked');
    this.relations.state = this.state;
    const sibling = this.relations.addSibling(person);
    this.commit('Added sibling');
    this.render();
    this.selectPerson(sibling.id);
  }

  removePerson(person) {
    if (!person) return;
    const exists = this.state.people.some(p => p.id === person.id);
    if (!exists) return;

    /* V5 requirement: delete the person completely. Do NOT touch segments. */
    this.state.people = this.state.people.filter(p => p.id !== person.id);
    this.commit('Person deleted — connector lines preserved', true);
    this.selection = {personId: null, lineId: null};
    this.closePanel();
    this.render();
    this.showToast('Person deleted; connector lines preserved');
  }

  changeCategory(person, category) {
    person.category = category;
    person.placeholder = false;
    this.commit('Changed circle category');
    this.render();
    this.openPersonPanel(person);
  }

  toggleLock(person) {
    person.locked = !person.locked;
    this.commit(person.locked ? 'Person locked' : 'Person unlocked');
    this.render();
    this.openPersonPanel(person);
  }

  /* -------------------------------------------------------------------------
   * Person panel: explicit Save Changes button
   * ---------------------------------------------------------------------- */
  openPersonPanel(person) {
    if (!person) {
      this.closePanel();
      return;
    }

    this.personDraft = clone(person);
    this.panel.classList.add('open');
    this.panel.innerHTML = this.personPanelHTML(person);
    this.bindPersonPanel(person);
  }

  personPanelHTML(person) {
    return `
      <div class="editor-panel-inner">
        <button class="close-panel" id="closePanel">×</button>
        <h2>${person.placeholder ? 'Blank person' : 'Edit person'}</h2>
        <div class="small">
          Edit the fields below, then press <b>Save changes</b>. The Save button
          writes the edited person into the tree and stores the current tree in this browser.
        </div>

        <div class="panel-row">
          <label>First name</label>
          <input id="pFirst" value="${this.escape(person.first)}" autocomplete="off">
        </div>
        <div class="panel-row">
          <label>Middle name (optional)</label>
          <input id="pMiddle" value="${this.escape(person.middle)}" autocomplete="off">
        </div>
        <div class="panel-row">
          <label>Last name</label>
          <input id="pLast" value="${this.escape(person.last)}" autocomplete="off">
        </div>
        <div class="panel-row">
          <label>Notes under the circle · one line per row · Enter makes a new line</label>
          <textarea id="pInfo">${this.escape((person.info || []).join('\n'))}</textarea>
        </div>
        <div class="panel-row">
          <label>Circle category</label>
          <select id="pCategory">
            <option value="paternal" ${person.category === 'paternal' ? 'selected' : ''}>Paternal · blue</option>
            <option value="maternal" ${person.category === 'maternal' ? 'selected' : ''}>Maternal · red</option>
            <option value="merge" ${person.category === 'merge' ? 'selected' : ''}>Merge · green</option>
            <option value="collateral" ${person.category === 'collateral' ? 'selected' : ''}>Married in / adopted · gold</option>
            <option value="unknown" ${person.category === 'unknown' ? 'selected' : ''}>Unknown · gray</option>
          </select>
        </div>

        <div class="panel-section">
          <div class="panel-buttons">
            <button id="savePerson" class="full panel-save">✓ Save changes</button>
          </div>
        </div>

        <div class="panel-section">
          <div class="panel-title">Add connection</div>
          <div class="panel-buttons">
            <button id="addParents">＋ Parents</button>
            <button id="addSibling">＋ Sibling</button>
            <button id="addSpouse">＋ Spouse</button>
            <button id="addChild">＋ Child</button>
          </div>
        </div>

        <div class="panel-section">
          <div class="panel-title">Person controls</div>
          <div class="panel-buttons">
            <button id="focusPerson">Focus</button>
            <button id="lockPerson">${person.locked ? 'Unlock' : 'Lock'}</button>
            <button id="removePerson" class="danger full">Delete person completely</button>
          </div>
        </div>

        <div class="panel-section">
          <div class="small">
            Deleting this person removes the circle, name, notes and person record.
            All existing connector segments remain exactly where they are.
          </div>
        </div>
      </div>`;
  }

  bindPersonPanel(person) {
    qs('#closePanel').onclick = () => this.closePanel();

    const first = qs('#pFirst');
    const middle = qs('#pMiddle');
    const last = qs('#pLast');
    const info = qs('#pInfo');
    const category = qs('#pCategory');
    const saveButton = qs('#savePerson');

    const draftChange = () => {
      person.first = first.value;
      person.middle = middle.value;
      person.last = last.value;
      person.info = splitLines(info.value);
      person.placeholder = !fullName(person) && person.info.every(line => !line.trim());
      this.renderer.render(this.selection);
      saveButton.classList.add('panel-dirty');
      this.updateStatus('Unsaved person changes');
    };

    first.oninput = draftChange;
    middle.oninput = draftChange;
    last.oninput = draftChange;
    info.oninput = draftChange;

    category.onchange = event => {
      person.category = event.target.value;
      person.placeholder = false;
      this.renderer.render(this.selection);
      saveButton.classList.add('panel-dirty');
      this.updateStatus('Unsaved person changes');
    };

    saveButton.onclick = () => {
      this.commit('Person changes saved', true);
      this.personDraft = clone(person);
      saveButton.classList.remove('panel-dirty');
      this.openPersonPanel(person);
      this.showToast('Person saved');
    };

    qs('#addParents').onclick = () => this.addParents(person);
    qs('#addSibling').onclick = () => this.addSibling(person);
    qs('#addSpouse').onclick = () => this.addSpouse(person);
    qs('#addChild').onclick = () => this.addChild(person);
    qs('#focusPerson').onclick = () => this.focusPerson(person);
    qs('#lockPerson').onclick = () => this.toggleLock(person);
    qs('#removePerson').onclick = () => this.removePerson(person);
  }

  closePanel() {
    this.panel.classList.remove('open');
    this.panel.innerHTML = '';
    this.personDraft = null;
  }

  /* -------------------------------------------------------------------------
   * Viewport
   * ---------------------------------------------------------------------- */
  clientToWorld(event) {
    const rect = this.canvas.getBoundingClientRect();
    return this.view.screenToWorld({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }

  onWheel(event) {
    event.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const screen = {x: event.clientX - rect.left, y: event.clientY - rect.top};
    const before = this.view.screenToWorld(screen);
    const factor = event.deltaY < 0 ? 1.1 : .9;
    this.view.zoomBy(factor);
    const after = this.view.worldToScreen(before);
    this.view.panBy(screen.x - after.x, screen.y - after.y);
    this.updateTransform();
    this.drawMap();
  }

  zoomAroundCenter(factor) {
    const rect = this.canvas.getBoundingClientRect();
    const center = {x: rect.width / 2, y: rect.height / 2};
    const before = this.view.screenToWorld(center);
    this.view.zoomBy(factor);
    const after = this.view.worldToScreen(before);
    this.view.panBy(center.x - after.x, center.y - after.y);
    this.updateTransform();
    this.drawMap();
  }

  updateTransform() {
    this.svg.style.transform = `translate(${this.view.panX}px,${this.view.panY}px) scale(${this.view.zoom})`;
    qs('#zoomLabel').textContent = Math.round(this.view.zoom * 100) + '%';
  }

  fit() {
    const rect = this.canvas.getBoundingClientRect();
    const width = this.state.meta.width || 3300;
    const height = this.state.meta.height || 1360;
    const usableW = Math.max(400, rect.width - 80);
    const usableH = Math.max(400, rect.height - 80);
    this.view.zoom = clamp(Math.min(usableW / width, usableH / height), .1, 1);
    this.view.panX = Math.max(20, (rect.width - width * this.view.zoom) / 2);
    this.view.panY = Math.max(20, (rect.height - height * this.view.zoom) / 2);
    this.updateTransform();
    this.drawMap();
  }

  focusPerson(person) {
    const rect = this.canvas.getBoundingClientRect();
    this.view.panX = rect.width / 2 - person.x * this.view.zoom;
    this.view.panY = rect.height / 2 - person.y * this.view.zoom;
    this.updateTransform();
    this.drawMap();
    this.renderer.focusElement(person);
    this.updateStatus('Focused on ' + (fullName(person) || 'blank person'));
  }

  /* -------------------------------------------------------------------------
   * Persistence
   * ---------------------------------------------------------------------- */
  save(showToast = true) {
    try {
      this.store.save(this.state);
      this.dirty = false;
      this.updateStatus('Saved locally in this browser');
      if (showToast) this.showToast('Tree saved');
    } catch (error) {
      this.showToast('Could not save: ' + error.message);
    }
  }

  reset() {
    if (!confirm('Reset the editor to the original Okrut & Karpenko tree? This removes your saved V5 browser edits.')) return;
    this.store.clear();
    this.state = clone(this.originalState);
    this.relations.state = this.state;
    this.history.reset(this.state);
    this.clearSelection();
    this.render();
    this.fit();
    this.updateStatus('Reset to original tree');
  }

  export() {
    downloadText(
      'okrut-karpenko-family-tree-v5.json',
      serialize(this.state)
    );
    this.updateStatus('Exported JSON');
  }

  importFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = deserialize(reader.result);
        this.state = next;
        this.relations.state = next;
        this.history.reset(next);
        this.clearSelection();
        this.render();
        this.fit();
        this.updateStatus('Imported tree');
      } catch (error) {
        this.showToast(error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  /* -------------------------------------------------------------------------
   * Minimap
   * ---------------------------------------------------------------------- */
  drawMap() {
    const canvas = this.mapCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = this.state.meta.width || 3300;
    const H = this.state.meta.height || 1360;
    const s = Math.min(canvas.width / W, canvas.height / H);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FAF6EC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#B7AC94';

    for (const line of this.state.segments) {
      ctx.beginPath();
      ctx.moveTo(line.x1 * s, line.y1 * s);
      ctx.lineTo(line.x2 * s, line.y2 * s);
      ctx.stroke();
    }

    for (const person of this.state.people) {
      ctx.beginPath();
      ctx.arc(person.x * s, person.y * s, 2.3, 0, Math.PI * 2);
      ctx.fillStyle = this.renderer.colorFor(person.category);
      ctx.fill();
    }

    const rect = this.canvas.getBoundingClientRect();
    const worldX = -this.view.panX / this.view.zoom;
    const worldY = -this.view.panY / this.view.zoom;
    const worldW = rect.width / this.view.zoom;
    const worldH = rect.height / this.view.zoom;
    ctx.strokeStyle = '#2B2620';
    ctx.strokeRect(worldX * s, worldY * s, worldW * s, worldH * s);
  }

  /* -------------------------------------------------------------------------
   * Keyboard / feedback
   * ---------------------------------------------------------------------- */
  onKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      event.shiftKey ? this.redo() : this.undo();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      this.redo();
      return;
    }
    if (event.key === 'Escape') {
      this.setMode('select');
      this.closePanel();
    }
  }

  updateStatus(text) {
    qs('#status').textContent = text;
  }

  showToast(text) {
    this.toastElement.textContent = text;
    this.toastElement.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastElement.classList.remove('show');
    }, 1800);
  }

  escape(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }
}
