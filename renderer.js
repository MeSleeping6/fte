/*
 * V5 RENDERER
 * -----------------------------------------------------------------------------
 * The original SVG is the source of truth for the visual starting point.
 * Existing circles, text and connector geometry remain in the document. The
 * editor only overlays hit targets and updates the original DOM when a person
 * or line is changed. Missing records are explicitly hidden, which is the key
 * V5 fix for true person/line deletion.
 */
import {svgEl, COLORS, fullName, findPersonGroup} from './core.js';

export class TreeRenderer {
  constructor(svg, state) {
    this.svg = svg;
    this.state = state;
    this.personDom = new Map();
    this.lineDom = new Map();
    this.interaction = {lineEditing: true, deleteMode: false};

    this.overlay = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.overlay.setAttribute('id', 'editorOverlay');
    this.lineOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.personOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.lineOverlay.setAttribute('id', 'lineHitLayer');
    this.personOverlay.setAttribute('id', 'personEditLayer');
    this.overlay.append(this.lineOverlay, this.personOverlay);
    this.svg.appendChild(this.overlay);

    this.originalLines = Array.from(this.svg.querySelectorAll('line'))
      .filter(line => !line.closest('#editorOverlay'));
    this.originalCircles = Array.from(this.svg.querySelectorAll('circle'))
      .filter(circle => !circle.closest('#editorOverlay'));
  }

  colorFor(category) {
    return COLORS[category] || COLORS.unknown;
  }

  setState(state) {
    this.state = state;
  }

  setInteraction(options = {}) {
    this.interaction = {...this.interaction, ...options};
  }

  originalCircle(person) {
    if (person?.domIndex == null) return null;
    return this.originalCircles[person.domIndex] || null;
  }

  initializeOriginalDom() {
    for (const person of this.state.people) {
      const circle = this.originalCircle(person);
      const group = circle ? findPersonGroup(circle) : null;
      if (!group) continue;
      group.dataset.personId = person.id;
      group.classList.add('fte-person');
      group.style.cursor = 'pointer';
      group.classList.remove('fte-hidden-original');
    }

    this.originalLines.forEach((line, index) => {
      line.dataset.segmentId = this.state.segments[index]?.id || '';
      line.classList.add('fte-original-line');
      line.style.pointerEvents = 'none';
    });
  }

  clearEditorOverlays() {
    this.lineOverlay.innerHTML = '';
    this.personOverlay.innerHTML = '';
    this.lineDom.clear();
    this.personDom.clear();
  }

  render(selection) {
    this.clearEditorOverlays();
    this.hideAllOriginalPeople();
    this.hideAllOriginalLines();
    this.renderOriginalPeople(selection);
    this.renderOriginalLines(selection);
    this.renderNewPeople(selection);
    this.renderNewLines(selection);
  }

  hideAllOriginalPeople() {
    for (const circle of this.originalCircles) {
      const group = findPersonGroup(circle);
      if (group) group.classList.add('fte-hidden-original');
    }
  }

  hideAllOriginalLines() {
    for (const line of this.originalLines) {
      line.classList.add('fte-hidden-original');
    }
  }

  renderOriginalPeople(selection) {
    for (const person of this.state.people) {
      if (person.domIndex == null) continue;
      const circle = this.originalCircle(person);
      const group = circle ? findPersonGroup(circle) : null;
      if (!group) continue;

      group.classList.remove('fte-hidden-original');
      this.updateOriginalPersonDom(person, group);

      const hit = svgEl('circle', {
        cx: person.x,
        cy: person.y,
        r: (person.radius || 24) + 8,
        fill: 'transparent',
        class: 'person-hit'
      });
      hit.dataset.personId = person.id;
      this.personOverlay.appendChild(hit);
      this.personDom.set(person.id, {group, hit});

      if (selection.personId === person.id) this.addSelectionRing(person);
    }
  }

  renderNewPeople(selection) {
    for (const person of this.state.people) {
      if (person.domIndex != null) continue;

      const group = svgEl('g', {
        class: 'fte-new-person',
        transform: `translate(${person.x} ${person.y})`
      });
      group.dataset.personId = person.id;

      const circle = svgEl('circle', {
        cx: 0,
        cy: 0,
        r: person.radius || 24,
        fill: this.colorFor(person.category)
      });
      circle.classList.add('fte-new-circle');
      if (person.placeholder) circle.classList.add('placeholder-circle');
      group.appendChild(circle);

      if (person.placeholder) {
        const mark = svgEl('text', {x: 0, y: 5, class: 'nm'});
        mark.textContent = '?';
        group.appendChild(mark);
      }

      const name = svgEl('text', {
        x: 0,
        y: 44,
        class: 'nm',
        'text-anchor': 'middle'
      });
      name.textContent = fullName(person);
      group.appendChild(name);

      (person.info || []).forEach((line, index) => {
        const text = svgEl('text', {
          x: 0,
          y: 56 + index * 11,
          class: index === 0 ? 'sb' : 'sb2',
          'text-anchor': 'middle'
        });
        text.textContent = line;
        group.appendChild(text);
      });

      this.personOverlay.appendChild(group);
      this.personDom.set(person.id, {group, hit: circle});
      if (selection.personId === person.id) this.addSelectionRing(person);
    }
  }

  updateOriginalPersonDom(person, group) {
    const circle = group.querySelector(':scope > circle');
    const texts = Array.from(group.querySelectorAll(':scope > text'));
    if (!circle) return;

    const radius = person.radius || 24;
    circle.setAttribute('cx', person.x);
    circle.setAttribute('cy', person.y);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', this.colorFor(person.category));
    circle.classList.toggle('placeholder-circle', !!person.placeholder);

    const nameText = texts.find(text => text.classList.contains('nm'));
    if (nameText) {
      nameText.setAttribute('x', person.x);
      nameText.setAttribute('y', person.y + 44);
      nameText.textContent = fullName(person);
    }

    const infoTexts = texts.filter(text => !text.classList.contains('nm'));
    const info = person.info || [];

    infoTexts.forEach((text, index) => {
      text.setAttribute('x', person.x);
      text.setAttribute('y', person.y + 56 + index * 11);
      text.textContent = info[index] || '';
      text.style.display = info[index] ? '' : 'none';
    });

    while (info.length > infoTexts.length) {
      const index = infoTexts.length;
      const text = svgEl('text', {
        class: index === 0 ? 'sb' : 'sb2',
        x: person.x,
        y: person.y + 56 + index * 11,
        'text-anchor': 'middle'
      });
      text.textContent = info[index];
      group.appendChild(text);
      infoTexts.push(text);
    }
  }

  renderOriginalLines(selection) {
    const activeLineIds = new Set(this.state.segments.filter(line => line.original).map(line => line.id));

    for (const line of this.state.segments) {
      if (!line.original) continue;
      const visible = this.originalLines.find(dom => dom.dataset.segmentId === line.id);
      if (!visible) continue;

      visible.classList.remove('fte-hidden-original');
      visible.setAttribute('x1', line.x1);
      visible.setAttribute('y1', line.y1);
      visible.setAttribute('x2', line.x2);
      visible.setAttribute('y2', line.y2);

      const hit = svgEl('line', {
        x1: line.x1,
        y1: line.y1,
        x2: line.x2,
        y2: line.y2,
        class: 'line-hit'
      });
      hit.dataset.segmentId = line.id;
      hit.style.pointerEvents = (this.interaction.lineEditing || this.interaction.deleteMode) ? 'stroke' : 'none';
      this.lineOverlay.appendChild(hit);
      this.lineDom.set(line.id, {visible, hit});

      visible.classList.toggle('line-selection', selection.lineId === line.id && this.interaction.lineEditing);
    }

    /* Any original line whose state record was deleted remains in the DOM but
       is hidden. This is what makes line deletion real instead of cosmetic. */
    for (const dom of this.originalLines) {
      if (!activeLineIds.has(dom.dataset.segmentId)) {
        dom.classList.add('fte-hidden-original');
      }
    }
  }

  renderNewLines(selection) {
    for (const line of this.state.segments) {
      if (line.original) continue;

      const visible = svgEl('line', {
        x1: line.x1,
        y1: line.y1,
        x2: line.x2,
        y2: line.y2,
        class: 'conn fte-generated-line'
      });
      const hit = svgEl('line', {
        x1: line.x1,
        y1: line.y1,
        x2: line.x2,
        y2: line.y2,
        class: 'line-hit'
      });
      hit.dataset.segmentId = line.id;
      hit.style.pointerEvents = (this.interaction.lineEditing || this.interaction.deleteMode) ? 'stroke' : 'none';

      if (selection.lineId === line.id && this.interaction.lineEditing) {
        visible.classList.add('line-selection');
      }

      this.lineOverlay.appendChild(visible);
      this.lineOverlay.appendChild(hit);
      this.lineDom.set(line.id, {visible, hit});
    }
  }

  addSelectionRing(person) {
    const ring = svgEl('circle', {
      cx: person.x,
      cy: person.y,
      r: (person.radius || 24) + 5,
      class: 'selection-ring'
    });
    ring.dataset.selection = 'person';
    this.personOverlay.appendChild(ring);
  }

  focusElement(person) {
    const dom = this.personDom.get(person.id);
    if (!dom) return;
    dom.group.classList.add('person-focus');
    setTimeout(() => dom.group.classList.remove('person-focus'), 1000);
  }

  getScreenBounds() {
    return this.svg.getBoundingClientRect();
  }
}

export function preserveOriginalStyle(svg) {
  const originalStyle = {};
  Array.from(svg.querySelectorAll('circle,text,line')).forEach(el => {
    originalStyle[el] = el.getAttribute('style') || '';
  });
  return originalStyle;
}
