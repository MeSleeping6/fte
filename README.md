# Family Tree Editor — Version 2

This is a working browser-based editor for the Okrut & Karpenko family tree.

## Files

- `index.html` — page
- `style.css` — visual styling
- `app.js` — editor behavior
- `family-tree.json` — tree data imported from the original HTML/SVG

## Current features

- Original tree data loaded from the supplied family-tree HTML
- People shown as circles with names/info underneath
- Click a person to edit first, middle, last name
- Unlimited info lines under each person; Enter makes a new line
- Add a person
- Add two parent placeholders
- Add sibling, spouse, and child placeholders
- Remove a person without deleting their existing connector segments
- Gray dashed placeholders for removed/unknown people
- Lock/unlock people
- Focus on a person
- Select existing connector segments
- Drag horizontal lines vertically and vertical lines horizontally
- Delete connector segments
- Draw new orthogonal (straight horizontal/vertical) connector paths
- Pan
- Mouse-wheel zoom
- 10%–500% zoom through the zoom controls
- Fit tree
- Minimap
- Undo/redo
- Browser-local save
- JSON export

## Important design choice

The visual tree is deliberately stored as separate `people` and `segments`. This means a person's removal does not automatically destroy the lines around their old position. That is important for preserving the user's hand-arranged layout.

The next versions can add smarter relationship metadata while continuing to preserve manually adjusted visual positions.
