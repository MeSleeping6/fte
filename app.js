(() => {
  "use strict";

  const raw = document.getElementById("treeData").textContent;
  let state = JSON.parse(raw);

  const svg = document.getElementById("treeSvg");
  const nodeLayer = document.getElementById("nodeLayer");
  const segmentLayer = document.getElementById("segmentLayer");
  const drawLayer = document.getElementById("drawLayer");
  const viewport = document.getElementById("canvasViewport");
  const sidePanel = document.getElementById("sidePanel");
  const panelContent = document.getElementById("panelContent");
  const status = document.getElementById("status");
  const mini = document.getElementById("minimap");
  const miniCanvas = document.getElementById("miniCanvas");
  const miniCtx = miniCanvas.getContext("2d");

  let selectedPersonId = null;
  let selectedSegmentId = null;
  let tool = "select";
  let zoom = 0.75;
  let panX = 60;
  let panY = 45;
  let panning = false;
  let panStart = null;
  let history = [];
  let historyIndex = -1;
  let dragSegment = null;
  let drawing = false;
  let drawStart = null;
  let drawCurrent = null;

  const colors = {
    paternal: "var(--pat)",
    maternal: "var(--mat)",
    merge: "var(--merge)",
    collateral: "var(--collateral)",
    unknown: "var(--unknown)"
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function snapshot() {
    return clone(state);
  }

  function pushHistory() {
    history = history.slice(0, historyIndex + 1);
    history.push(snapshot());
    if (history.length > 80) history.shift();
    historyIndex = history.length - 1;
    updateUndoRedo();
  }

  function undo() {
    if (historyIndex <= 0) return;
    historyIndex--;
    state = clone(history[historyIndex]);
    selectedPersonId = null;
    selectedSegmentId = null;
    render();
    openBlankPanel();
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    historyIndex++;
    state = clone(history[historyIndex]);
    selectedPersonId = null;
    selectedSegmentId = null;
    render();
    openBlankPanel();
  }

  function updateUndoRedo() {
    document.getElementById("undoBtn").disabled = historyIndex <= 0;
    document.getElementById("redoBtn").disabled = historyIndex >= history.length - 1;
  }

  function personById(id) {
    return state.people.find(p => p.id === id);
  }

  function displayName(p) {
    return [p.first, p.middle, p.last].filter(Boolean).join(" ").trim();
  }

  function safeText(value) {
    return String(value ?? "");
  }

  function makeSvg(tag, attrs = {}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function render() {
    renderSegments();
    renderPeople();
    updateTransform();
    drawMinimap();
    updateUndoRedo();
  }

  function renderSegments() {
    segmentLayer.innerHTML = "";
    state.segments.forEach(seg => {
      const g = makeSvg("g", { "data-segment-id": seg.id });

      const hit = makeSvg("line", {
        x1: seg.x1, y1: seg.y1, x2: seg.x2, y2: seg.y2,
        class: "conn hit"
      });
      const visible = makeSvg("line", {
        x1: seg.x1, y1: seg.y1, x2: seg.x2, y2: seg.y2,
        class: "conn" + (selectedSegmentId === seg.id ? " selected" : "")
      });

      g.appendChild(hit);
      g.appendChild(visible);
      segmentLayer.appendChild(g);

      hit.addEventListener("pointerdown", e => {
        if (tool !== "select") return;
        e.stopPropagation();
        selectSegment(seg.id);
        beginSegmentDrag(e, seg.id);
      });
      visible.addEventListener("click", e => {
        e.stopPropagation();
        if (tool === "select") selectSegment(seg.id);
      });
    });
  }

  function renderPeople() {
    nodeLayer.innerHTML = "";

    state.people.forEach(p => {
      const g = makeSvg("g", {
        class: "person" + (p.placeholder ? " placeholder" : "") + (selectedPersonId === p.id ? " selected" : ""),
        transform: `translate(${p.x} ${p.y})`,
        "data-person-id": p.id
      });

      const circle = makeSvg("circle", {
        r: 24,
        class: "person-circle",
        fill: p.placeholder ? "var(--unknown)" : (colors[p.category] || "var(--pat)")
      });
      g.appendChild(circle);

      const name = displayName(p) || "name unknown";
      const nm = makeSvg("text", { class: "nm", x: 0, y: 44, "text-anchor": "middle" });
      nm.textContent = name;
      g.appendChild(nm);

      const info = p.info || [];
      info.forEach((line, i) => {
        const t = makeSvg("text", {
          class: i === 0 ? "sb" : "sb2",
          x: 0,
          y: 56 + i * 11,
          "text-anchor": "middle"
        });
        t.textContent = line;
        g.appendChild(t);
      });

      g.addEventListener("click", e => {
        e.stopPropagation();
        selectPerson(p.id);
      });

      nodeLayer.appendChild(g);
    });
  }

  function updateTransform() {
    svg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    document.getElementById("zoomLabel").textContent = `${Math.round(zoom * 100)}%`;
  }

  function selectPerson(id) {
    selectedPersonId = id;
    selectedSegmentId = null;
    render();
    openPersonPanel(personById(id));
    status.textContent = "Person selected.";
  }

  function selectSegment(id) {
    selectedSegmentId = id;
    selectedPersonId = null;
    render();
    openSegmentPanel(state.segments.find(s => s.id === id));
    status.textContent = "Line selected — drag it sideways in its direction.";
  }

  function openBlankPanel() {
    sidePanel.classList.add("closed");
    panelContent.innerHTML = "";
  }

  function openPersonPanel(p) {
    sidePanel.classList.remove("closed");
    panelContent.innerHTML = `
      <div class="panel-inner">
        <div class="panel-title">${p.placeholder ? "Blank person" : "Edit person"}</div>
        <div class="panel-subtitle">${p.placeholder ? "Fill this placeholder with a person." : "Changes appear on the tree as you type."}</div>

        <div class="field">
          <label>First name</label>
          <input id="firstInput" value="${esc(p.first)}" autocomplete="off">
        </div>
        <div class="field">
          <label>Middle name (optional)</label>
          <input id="middleInput" value="${esc(p.middle)}" autocomplete="off">
        </div>
        <div class="field">
          <label>Last name</label>
          <input id="lastInput" value="${esc(p.last)}" autocomplete="off">
        </div>

        <div class="field">
          <label>Information under the circle — one line per entry</label>
          <textarea id="infoInput" placeholder="Birth/death dates, places, or any other short notes...">${esc((p.info || []).join("\\n"))}</textarea>
        </div>

        <div class="field">
          <label>Color category</label>
          <select id="categoryInput">
            <option value="paternal" ${p.category==="paternal"?"selected":""}>Paternal</option>
            <option value="maternal" ${p.category==="maternal"?"selected":""}>Maternal</option>
            <option value="merge" ${p.category==="merge"?"selected":""}>Merge</option>
            <option value="collateral" ${p.category==="collateral"?"selected":""}>Collateral / adopted</option>
            <option value="unknown" ${p.category==="unknown"?"selected":""}>Unknown / placeholder</option>
          </select>
        </div>

        <div class="panel-section">
          <div class="section-label">Add relative</div>
          <div class="action-grid">
            <button class="action" id="addParents">＋ Parents</button>
            <button class="action" id="addSibling">＋ Sibling</button>
            <button class="action" id="addSpouse">＋ Spouse</button>
            <button class="action" id="addChild">＋ Child</button>
          </div>
        </div>

        <div class="panel-section">
          <div class="section-label">Person actions</div>
          <div class="action-grid">
            <button class="action" id="focusPerson">Focus</button>
            <button class="action" id="lockPerson">${p.locked ? "Unlock" : "Lock"}</button>
            <button class="action danger full" id="removePerson">${p.placeholder ? "Delete placeholder" : "Remove person (keep connections)"}</button>
          </div>
        </div>

        <div class="panel-note">
          Removing a person turns them into a blank gray placeholder so the surrounding tree and connector layout remain intact.
        </div>
      </div>
    `;

    const first = document.getElementById("firstInput");
    const middle = document.getElementById("middleInput");
    const last = document.getElementById("lastInput");
    const info = document.getElementById("infoInput");
    const category = document.getElementById("categoryInput");

    let typingTimer;
    function changed() {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        pushHistory();
      }, 600);
    }

    [first, middle, last].forEach(input => {
      input.addEventListener("input", () => {
        p.first = first.value;
        p.middle = middle.value;
        p.last = last.value;
        p.placeholder = false;
        render();
        changed();
      });
    });

    info.addEventListener("input", () => {
      p.info = info.value.split("\\n");
      render();
      changed();
    });

    category.addEventListener("change", () => {
      p.category = category.value;
      render();
      pushHistory();
    });

    document.getElementById("addParents").onclick = () => addRelativePair(p, "parent");
    document.getElementById("addSibling").onclick = () => addRelative(p, "sibling");
    document.getElementById("addSpouse").onclick = () => addRelative(p, "spouse");
    document.getElementById("addChild").onclick = () => addRelative(p, "child");
    document.getElementById("focusPerson").onclick = () => focusPerson(p);
    document.getElementById("lockPerson").onclick = () => {
      p.locked = !p.locked;
      pushHistory();
      openPersonPanel(p);
      render();
    };
    document.getElementById("removePerson").onclick = () => removePerson(p);
  }

  function openSegmentPanel(seg) {
    sidePanel.classList.remove("closed");
    const horizontal = Math.abs(seg.y2 - seg.y1) < 0.01;
    panelContent.innerHTML = `
      <div class="panel-inner">
        <div class="panel-title">Connector</div>
        <div class="panel-subtitle">This first version treats existing connectors as editable visual segments.</div>

        <div class="help">
          ${horizontal
            ? "This is a horizontal segment. Drag it up or down."
            : "This is a vertical segment. Drag it left or right."}
          The line stays perfectly straight.
        </div>

        <div class="panel-section">
          <div class="section-label">Line actions</div>
          <div class="action-grid">
            <button class="action danger full" id="deleteSegment">Delete line segment</button>
          </div>
        </div>

        <div class="panel-note">
          Use <b>Draw line</b> in the top toolbar when you want to create a new straight/orthogonal line by hand.
        </div>
      </div>
    `;
    document.getElementById("deleteSegment").onclick = () => {
      pushHistory();
      state.segments = state.segments.filter(s => s.id !== seg.id);
      selectedSegmentId = null;
      render();
      openBlankPanel();
    };
  }

  function nextId(prefix) {
    const all = [
      ...state.people.map(p => p.id),
      ...state.segments.map(s => s.id)
    ];
    let n = 1;
    let id;
    do { id = `${prefix}${Date.now().toString(36)}${n++}`; } while (all.includes(id));
    return id;
  }

  function addPersonAt(x, y, category = "unknown") {
    const p = {
      id: nextId("p"),
      first: "",
      middle: "",
      last: "",
      info: [],
      x, y,
      category,
      placeholder: true,
      locked: false
    };
    state.people.push(p);
    return p;
  }

  function addRelative(p, type) {
    pushHistory();

    const offsets = {
      sibling: { x: 190, y: 0 },
      spouse: { x: 150, y: 0 },
      child: { x: 0, y: 180 }
    };
    const o = offsets[type];
    const np = addPersonAt(p.x + o.x, p.y + o.y, p.category);

    if (type === "spouse") {
      addSegment(p.x + 24, p.y, np.x - 24, np.y);
    } else if (type === "child") {
      addOrthogonalConnector(p, np);
    } else if (type === "sibling") {
      addSiblingConnector(p, np);
    }

    selectedPersonId = np.id;
    selectedSegmentId = null;
    render();
    openPersonPanel(np);
    status.textContent = `New ${type} placeholder added.`;
  }

  function addRelativePair(p, type) {
    pushHistory();

    const left = addPersonAt(p.x - 150, p.y - 190, p.category);
    const right = addPersonAt(p.x + 150, p.y - 190, p.category);

    addOrthogonalConnector(left, p, true);
    addOrthogonalConnector(right, p, true);

    selectedPersonId = left.id;
    selectedSegmentId = null;
    render();
    openPersonPanel(left);
    status.textContent = "Two parent placeholders added.";
  }

  function addSiblingConnector(a, b) {
    const barY = Math.min(a.y, b.y) - 70;
    addSegment(a.x, a.y - 24, a.x, barY);
    addSegment(a.x, barY, b.x, barY);
    addSegment(b.x, barY, b.x, b.y - 24);
  }

  function addOrthogonalConnector(parent, child, fromParentSide = false) {
    const barY = (parent.y + child.y) / 2;
    addSegment(parent.x, parent.y + (child.y > parent.y ? 24 : -24), parent.x, barY);
    addSegment(parent.x, barY, child.x, barY);
    addSegment(child.x, barY, child.x, child.y + (child.y > parent.y ? -24 : 24));
  }

  function addSegment(x1, y1, x2, y2) {
    state.segments.push({
      id: nextId("s"),
      x1, y1, x2, y2,
      kind: "connector"
    });
  }

  function removePerson(p) {
    pushHistory();

    if (p.placeholder) {
      state.people = state.people.filter(x => x.id !== p.id);
    } else {
      p.first = "";
      p.middle = "";
      p.last = "";
      p.info = [];
      p.placeholder = true;
      p.category = "unknown";
    }

    selectedPersonId = null;
    render();
    openBlankPanel();
    status.textContent = "Person removed; connector layout preserved.";
  }

  function focusPerson(p) {
    const wrap = viewport.getBoundingClientRect();
    zoom = Math.min(1.6, Math.max(.75, zoom));
    panX = wrap.width / 2 - p.x * zoom;
    panY = wrap.height / 2 - p.y * zoom;
    updateTransform();
    status.textContent = `Focused on ${displayName(p) || "blank person"}.`;
  }

  function beginSegmentDrag(e, id) {
    const seg = state.segments.find(s => s.id === id);
    if (!seg) return;

    const horizontal = Math.abs(seg.y2 - seg.y1) < 0.01;
    dragSegment = {
      id,
      horizontal,
      startX: e.clientX,
      startY: e.clientY,
      original: { x1: seg.x1, y1: seg.y1, x2: seg.x2, y2: seg.y2 },
      pushed: false
    };

    window.addEventListener("pointermove", onSegmentDrag);
    window.addEventListener("pointerup", endSegmentDrag, { once: true });
  }

  function onSegmentDrag(e) {
    if (!dragSegment) return;
    const seg = state.segments.find(s => s.id === dragSegment.id);
    if (!seg) return;

    if (!dragSegment.pushed) {
      pushHistory();
      dragSegment.pushed = true;
    }

    if (dragSegment.horizontal) {
      const dy = (e.clientY - dragSegment.startY) / zoom;
      const y = dragSegment.original.y1 + dy;
      seg.y1 = y;
      seg.y2 = y;
    } else {
      const dx = (e.clientX - dragSegment.startX) / zoom;
      const x = dragSegment.original.x1 + dx;
      seg.x1 = x;
      seg.x2 = x;
    }

    render();
  }

  function endSegmentDrag() {
    window.removeEventListener("pointermove", onSegmentDrag);
    dragSegment = null;
  }

  function setTool(next) {
    tool = next;
    document.getElementById("selectTool").classList.toggle("active", next === "select");
    document.getElementById("drawTool").classList.toggle("active", next === "draw");
    viewport.style.cursor = next === "draw" ? "crosshair" : "grab";
    status.textContent = next === "draw"
      ? "Draw line: click-drag from one point to another."
      : "Select a person or connector.";
  }

  function pointerToWorld(e) {
    const r = viewport.getBoundingClientRect();
    return {
      x: (e.clientX - r.left - panX) / zoom,
      y: (e.clientY - r.top - panY) / zoom
    };
  }

  function drawOrthogonalPath(a, b) {
    const midX = Math.round((a.x + b.x) / 2 / 5) * 5;
    return [
      { x1: a.x, y1: a.y, x2: midX, y2: a.y },
      { x1: midX, y1: a.y, x2: midX, y2: b.y },
      { x1: midX, y1: b.y, x2: b.x, y2: b.y }
    ];
  }

  viewport.addEventListener("pointerdown", e => {
    if (e.button !== 0) return;

    if (tool === "draw") {
      drawing = true;
      drawStart = pointerToWorld(e);
      drawCurrent = drawStart;
      drawLayer.innerHTML = "";
      return;
    }

    if (e.target.closest(".person") || e.target.closest(".hit")) return;

    selectedPersonId = null;
    selectedSegmentId = null;
    render();
    openBlankPanel();

    panning = true;
    panStart = {
      x: e.clientX,
      y: e.clientY,
      panX,
      panY
    };
    viewport.classList.add("dragging");
  });

  window.addEventListener("pointermove", e => {
    if (drawing) {
      drawCurrent = pointerToWorld(e);
      const path = drawOrthogonalPath(drawStart, drawCurrent);
      drawLayer.innerHTML = "";
      path.forEach(s => {
        drawLayer.appendChild(makeSvg("line", {
          x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2, class: "draw-preview"
        }));
      });
      return;
    }

    if (!panning) return;
    panX = panStart.panX + (e.clientX - panStart.x);
    panY = panStart.panY + (e.clientY - panStart.y);
    updateTransform();
  });

  window.addEventListener("pointerup", e => {
    if (drawing) {
      drawing = false;
      drawLayer.innerHTML = "";
      if (drawStart && drawCurrent) {
        const path = drawOrthogonalPath(drawStart, drawCurrent);
        pushHistory();
        path.forEach(s => addSegment(s.x1, s.y1, s.x2, s.y2));
        render();
        status.textContent = "New orthogonal line added.";
      }
      drawStart = null;
      drawCurrent = null;
    }

    if (panning) {
      panning = false;
      viewport.classList.remove("dragging");
    }
  });

  viewport.addEventListener("wheel", e => {
    e.preventDefault();

    const before = pointerToWorld(e);
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const next = Math.min(5, Math.max(.1, zoom * factor));

    const r = viewport.getBoundingClientRect();
    zoom = next;
    panX = e.clientX - r.left - before.x * zoom;
    panY = e.clientY - r.top - before.y * zoom;

    updateTransform();
    drawMinimap();
  }, { passive: false });

  function changeZoom(factor) {
    zoom = Math.min(5, Math.max(.1, zoom * factor));
    updateTransform();
    drawMinimap();
  }

  function fitTree() {
    const r = viewport.getBoundingClientRect();
    const pad = 80;
    zoom = Math.min(
      (r.width - pad) / state.canvas.width,
      (r.height - pad) / state.canvas.height,
      1.25
    );
    panX = (r.width - state.canvas.width * zoom) / 2;
    panY = (r.height - state.canvas.height * zoom) / 2;
    updateTransform();
  }

  function drawMinimap() {
    const w = miniCanvas.width;
    const h = miniCanvas.height;
    miniCtx.clearRect(0, 0, w, h);
    miniCtx.fillStyle = "#FAF6EC";
    miniCtx.fillRect(0, 0, w, h);

    const sx = w / state.canvas.width;
    const sy = h / state.canvas.height;
    const s = Math.min(sx, sy);

    miniCtx.strokeStyle = "#B7AC94";
    miniCtx.lineWidth = 1;

    state.segments.forEach(seg => {
      miniCtx.beginPath();
      miniCtx.moveTo(seg.x1 * s, seg.y1 * s);
      miniCtx.lineTo(seg.x2 * s, seg.y2 * s);
      miniCtx.stroke();
    });

    state.people.forEach(p => {
      miniCtx.beginPath();
      miniCtx.arc(p.x * s, p.y * s, 2.2, 0, Math.PI * 2);
      miniCtx.fillStyle = p.placeholder ? "#C7BEA8" : ({
        paternal: "#2F5A73",
        maternal: "#8C3A34",
        merge: "#2F7358",
        collateral: "#9C8659",
        unknown: "#C7BEA8"
      }[p.category] || "#2F5A73");
      miniCtx.fill();
    });

    const r = viewport.getBoundingClientRect();
    const viewW = r.width / zoom;
    const viewH = r.height / zoom;
    const viewX = -panX / zoom;
    const viewY = -panY / zoom;

    miniCtx.strokeStyle = "#2B2620";
    miniCtx.lineWidth = 1.5;
    miniCtx.strokeRect(viewX * s, viewY * s, viewW * s, viewH * s);
  }

  miniCanvas.addEventListener("click", e => {
    const rect = miniCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * state.canvas.width;
    const y = (e.clientY - rect.top) / rect.height * state.canvas.height;
    const r = viewport.getBoundingClientRect();
    panX = r.width / 2 - x * zoom;
    panY = r.height / 2 - y * zoom;
    updateTransform();
  });

  document.getElementById("selectTool").onclick = () => setTool("select");
  document.getElementById("drawTool").onclick = () => setTool("draw");
  document.getElementById("undoBtn").onclick = undo;
  document.getElementById("redoBtn").onclick = redo;
  document.getElementById("zoomOut").onclick = () => changeZoom(.8);
  document.getElementById("zoomIn").onclick = () => changeZoom(1.25);
  document.getElementById("fitBtn").onclick = fitTree;
  document.getElementById("miniBtn").onclick = () => mini.classList.toggle("hidden");

  document.getElementById("addPersonTop").onclick = () => {
    pushHistory();
    const r = viewport.getBoundingClientRect();
    const center = pointerToWorld({
      clientX: r.left + r.width / 2,
      clientY: r.top + r.height / 2
    });
    const p = addPersonAt(center.x, center.y, "unknown");
    selectedPersonId = p.id;
    selectedSegmentId = null;
    render();
    openPersonPanel(p);
    status.textContent = "New person added.";
  };

  document.getElementById("saveBtn").onclick = () => {
    localStorage.setItem("familyTreeEditorData", JSON.stringify(state));
    status.textContent = "Saved in this browser.";
  };

  document.getElementById("exportBtn").onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "family-tree.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  window.addEventListener("resize", drawMinimap);

  function esc(s) {
    return safeText(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Start with the repository's initial tree. Browser save is optional.
  const saved = localStorage.getItem("familyTreeEditorData");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.people && parsed.segments) {
        state = parsed;
      }
    } catch (_) {}
  }

  history = [snapshot()];
  historyIndex = 0;
  render();
  openBlankPanel();
  setTimeout(fitTree, 50);
})();
