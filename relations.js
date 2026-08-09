/* V5 RELATIONSHIP BUILDER — explicit relationship creation helpers. */
import {createPerson,createSegment,addPersonRecord,addSegmentRecord} from './core.js';

export class RelationshipBuilder {
  constructor(state, renderer) {
    this.state = state;
    this.renderer = renderer;
  }

  selectedCategory(person) {
    return person?.category || 'unknown';
  }

  makePlaceholder(x, y, category) {
    const person = createPerson(x, y, category);
    addPersonRecord(this.state, person);
    return person;
  }

  addParents(person) {
    const gap = 150;
    const y = person.y - 210;
    const left = this.makePlaceholder(person.x - gap, y, this.selectedCategory(person));
    const right = this.makePlaceholder(person.x + gap, y, this.selectedCategory(person));
    this.connectParentToChild(left, person);
    this.connectParentToChild(right, person);
    return [left, right];
  }

  addSpouse(person) {
    const point = this.findOpenPlacement(person, 'spouse');
    const spouse = this.makePlaceholder(point.x, point.y, this.selectedCategory(person));
    this.addMarriage(person, spouse);
    return spouse;
  }

  addChild(person) {
    const point = this.findOpenPlacement(person, 'child');
    const child = this.makePlaceholder(point.x, point.y, this.selectedCategory(person));
    this.connectParentToChild(person, child);
    return child;
  }

  addSibling(person) {
    const point = this.findOpenPlacement(person, 'sibling');
    const sibling = this.makePlaceholder(point.x, point.y, this.selectedCategory(person));
    const barY = person.y - 70;
    this.addSegment(person.x, person.y - person.radius, person.x, barY);
    this.addSegment(person.x, barY, sibling.x, barY);
    this.addSegment(sibling.x, barY, sibling.x, sibling.y - sibling.radius);
    return sibling;
  }

  connectParentToChild(parent, child) {
    const bridgeY = (parent.y + child.y) / 2;
    this.addSegment(parent.x, parent.y + parent.radius, parent.x, bridgeY);
    this.addSegment(parent.x, bridgeY, child.x, bridgeY);
    this.addSegment(child.x, bridgeY, child.x, child.y - child.radius);
  }

  addMarriage(a, b) {
    this.addSegment(a.x + a.radius, a.y, b.x - b.radius, b.y);
  }

  addSegment(x1, y1, x2, y2) {
    const segment = createSegment(x1, y1, x2, y2);
    addSegmentRecord(this.state, segment);
    return segment;
  }

  placeRelativeTo(person, relation) {
    const offsets = {
      parent: {x: 0, y: -205},
      spouse: {x: 150, y: 0},
      child: {x: 0, y: 205},
      sibling: {x: 180, y: 0}
    };
    const offset = offsets[relation] || {x: 100, y: 100};
    return {x: person.x + offset.x, y: person.y + offset.y};
  }

  hasExistingNearbyPerson(point, threshold = 55) {
    return this.state.people.some(person => Math.hypot(person.x - point.x, person.y - point.y) < threshold);
  }

  findOpenPlacement(person, relation) {
    let point = this.placeRelativeTo(person, relation);
    let tries = 0;
    while (this.hasExistingNearbyPerson(point, 70) && tries < 30) {
      tries += 1;
      if (relation === 'spouse' || relation === 'sibling') point.x += 100;
      else point.y += relation === 'parent' ? -80 : 80;
    }
    return point;
  }

  addRelationship(person, relation) {
    if (relation === 'parents') return this.addParents(person);
    if (relation === 'spouse') return this.addSpouse(person);
    if (relation === 'child') return this.addChild(person);
    if (relation === 'sibling') return this.addSibling(person);
    return null;
  }
}
