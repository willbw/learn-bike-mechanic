/* Shared SVG drawing kit. Every part is drawn in a shared 1000x600 coordinate
   space (ground at y=520). A part can contribute markup to several z-layers so
   it can sit partly behind and partly in front of other parts. Each game's art
   file defines a global ART = { partId: { z: markup } }. */

const r1 = n => Math.round(n * 10) / 10;

const COL = {
  tyre: '#16181b', tyreEdge: '#3f4753', rim: '#c3ccd5', rimDark: '#2b3037',
  spoke: '#cfd6dd', hub: '#aeb7c1', steel: '#c9d1d9', alu: '#a9b3bd',
  aluDark: '#7d8792', dark: '#2a2f36', black: '#121417', rubber: '#1b1d20',
  bikeFrame: '#1fb5a3', motoFrame: '#3b7ddd', gold: '#e0a63c', chrome: '#e3e9ee',
  red: '#d6402f', plastic: '#f5c518', white: '#eef2f5', orange: '#ef8a2b',
  chain: '#8b939c', copper: '#c27a3a'
};

function spokes(cx, cy, rh, rr, n, cross, stroke, w) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const off = (i % 2 ? 1 : -1) * cross;
    d += `M${r1(cx + rh * Math.cos(a))} ${r1(cy + rh * Math.sin(a))}L${r1(cx + rr * Math.cos(a + off))} ${r1(cy + rr * Math.sin(a + off))}`;
  }
  return `<path d="${d}" stroke="${stroke}" stroke-width="${w}" fill="none"/>`;
}

function wheel(cx, cy, o) {
  const band = (o.rimR + o.tyreR) / 2;
  const bw = o.tyreR - o.rimR;
  return `
    <circle cx="${cx}" cy="${cy}" r="${band}" fill="none" stroke="${COL.tyre}" stroke-width="${bw}"/>
    ${o.knobs ? `<circle cx="${cx}" cy="${cy}" r="${o.tyreR - 2}" fill="none" stroke="#25282d" stroke-width="5" stroke-dasharray="${o.knobs}"/>` : ''}
    <circle cx="${cx}" cy="${cy}" r="${o.tyreR}" fill="none" stroke="${COL.tyreEdge}" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${o.rimR}" fill="none" stroke="${o.rim || COL.rim}" stroke-width="${o.rimW || 5}"/>
    ${spokes(cx, cy, o.hubR * 0.8, o.rimR - 2, o.spokes, o.cross, COL.spoke, o.spokeW || 1.2)}
    <circle cx="${cx}" cy="${cy}" r="${o.hubR}" fill="${COL.hub}" stroke="#6c7682" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${o.hubR * 0.35}" fill="#4a525c"/>`;
}

function coil(x1, y1, x2, y2, turns, w) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  const nx = -dy / L, ny = dx / L;
  let d = `M${r1(x1)} ${r1(y1)}`;
  const n = turns * 2;
  for (let i = 1; i < n; i++) {
    const t = i / n, s = i % 2 ? 1 : -1;
    d += `L${r1(x1 + dx * t + nx * w * s)} ${r1(y1 + dy * t + ny * w * s)}`;
  }
  return d + `L${r1(x2)} ${r1(y2)}`;
}

function sprocket(cx, cy, r, teeth, fill, holes) {
  const circ = 2 * Math.PI * (r + 2);
  const seg = circ / teeth;
  let h = '';
  if (holes) {
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * Math.PI * 2;
      h += `<circle cx="${r1(cx + r * 0.55 * Math.cos(a))}" cy="${r1(cy + r * 0.55 * Math.sin(a))}" r="${r1(r * 0.18)}" fill="#20252b"/>`;
    }
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="none" stroke="${fill}" stroke-width="4" stroke-dasharray="${r1(seg * 0.5)} ${r1(seg * 0.5)}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>${h}
    <circle cx="${cx}" cy="${cy}" r="${r1(r * 0.25)}" fill="#59616b"/>`;
}

function rotor(cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy}" r="${r - 5}" fill="none" stroke="#b9c2cb" stroke-width="10"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 5}" fill="none" stroke="#6b7480" stroke-width="3" stroke-dasharray="2 7"/>
    ${spokes(cx, cy, 10, r - 10, 6, 0.25, '#8d97a2', 4)}`;
}


/* Markup for one part, all layers, in z order. */
function partMarkup(id) {
  const layers = ART[id];
  return Object.keys(layers).map(Number).sort((a, b) => a - b).map(z => layers[z]).join('');
}

/* Full scene markup. `ids` is the list of parts belonging to the scene;
   each part is emitted once per layer as <g class="part" data-part=id>. */
function sceneLayers(ids, opts = {}) {
  const zs = new Set();
  ids.forEach(id => Object.keys(ART[id]).forEach(z => zs.add(+z)));
  let out = '';
  [...zs].sort((a, b) => a - b).forEach(z => {
    ids.forEach(id => {
      if (ART[id][z] !== undefined) {
        const cls = opts.classFor ? opts.classFor(id) : '';
        out += `<g class="part ${cls}" data-part="${id}">${ART[id][z]}</g>`;
      }
    });
  });
  return out;
}

const SCENE_DEFS = `
  <defs>
    <pattern id="grid-s" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0H0V20" fill="none" stroke="var(--grid)" stroke-width="1"/>
    </pattern>
    <pattern id="grid-l" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="url(#grid-s)"/>
      <path d="M100 0H0V100" fill="none" stroke="var(--grid-strong)" stroke-width="1.2"/>
    </pattern>
    <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="10" stroke="var(--grid-strong)" stroke-width="2"/>
    </pattern>
  </defs>
  <rect x="-500" y="-200" width="2000" height="1000" fill="url(#grid-l)"/>
  <rect x="-500" y="520" width="2000" height="40" fill="url(#hatch)"/>
  <line x1="-500" y1="520" x2="1500" y2="520" stroke="var(--grid-strong)" stroke-width="3"/>`;
