# Family Tree Editor

First working version of the Okrut & Karpenko family-tree editor.

Files:

- `index.html` — page/editor shell
- `style.css` — visual design
- `app.js` — editor behavior
- `family-tree.json` — editable tree data

The initial data was built from the uploaded Okrut & Karpenko SVG/HTML tree.

Current features:

- Existing tree loaded on startup
- Same general Fraunces/Inter visual style
- Click a person to edit first/middle/last name
- Unlimited information lines under a person
- Add a person
- Add parent placeholders, sibling, spouse, and child
- Remove a person without destroying their existing connector layout
- Select and drag existing horizontal/vertical connector segments
- Delete connector segments
- Draw new orthogonal lines
- Pan and zoom
- Minimap
- Undo/redo
- Browser save and JSON export

This is intentionally the first version. The next iterations can improve relationship intelligence, connector routing, publishing/export, and other features.
