# Family Tree Editor V3

This version is self-contained. The original family-tree data is embedded directly in `app.js`, so GitHub Pages does not need to fetch `family-tree.json` for the tree to appear.

The V3 localStorage key is different from earlier versions, so an old empty/broken saved state cannot replace the original tree.

Features:
- Original 59 people and 83 connector segments
- Original Fraunces/Inter typography and colors
- Click person to edit
- First/middle/last name
- Unlimited info lines
- Add two parents, sibling, spouse, child
- Remove person while keeping a gray placeholder
- Lock/unlock
- Select and drag existing line segments
- Horizontal lines move vertically
- Vertical lines move horizontally
- Delete line
- Draw new orthogonal lines
- Pan and mouse-wheel zoom
- 10%–500% zoom
- Fit
- Minimap
- Undo/redo
- Browser save
- Reset to original
- JSON export

Files:
- index.html
- style.css
- app.js
