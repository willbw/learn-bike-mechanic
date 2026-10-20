/* Interactive labs. Each lab: {title, intro, tasks:[{id,text}], mount(el, ctx) -> destroy()}
   ctx.complete(taskId) ticks a task. */

const DPR = Math.min(2, window.devicePixelRatio || 1);
const C = {
  bg: '#0e1822', panel: '#14212e', grid: 'rgba(120,170,220,0.10)', line: '#2a3b4d',
  text: '#d8e2ec', dim: '#8aa0b5', amber: '#f5a524', teal: '#2dd4bf', red: '#ef4444',
  blue: '#60a5fa', green: '#4ade80', orange: '#fb923c', steel: '#b8c2cc', dark: '#2a2f36'
};

function makeCanvas(parent, w, h) {
  const c = document.createElement('canvas');
  c.width = w * DPR; c.height = h * DPR;
  c.className = 'lab-cv';
  c.style.aspectRatio = `${w} / ${h}`;
  const g = c.getContext('2d');
  g.scale(DPR, DPR);
  parent.appendChild(c);
  return { c, g, w, h };
}

function animLoop(fn) {
  let last = performance.now(), alive = true;
  function f(t) {
    if (!alive) return;
    const dt = clamp((t - last) / 1000, 0, 0.05); last = t;
    fn(dt);
    requestAnimationFrame(f);
  }
  requestAnimationFrame(f);
  return () => { alive = false; };
}

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

function slider(label, min, max, step, value, fmt, onInput) {
  const w = el(`<label class="ctl"><span class="ctl-l">${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output></output></label>`);
  const inp = w.querySelector('input'), out = w.querySelector('output');
  const upd = () => { out.textContent = fmt(+inp.value); onInput(+inp.value); };
  inp.addEventListener('input', upd);
  out.textContent = fmt(value);
  w.set = v => { inp.value = v; upd(); };
  return w;
}

function choice(label, options, value, onChange) {
  const w = el(`<div class="ctl"><span class="ctl-l">${label}</span><div class="seg"></div></div>`);
  const seg = w.querySelector('.seg');
  options.forEach(o => {
    const v = typeof o === 'object' ? o.v : o, t = typeof o === 'object' ? o.t : o;
    const b = el(`<button type="button" class="seg-b${v === value ? ' on' : ''}">${t}</button>`);
    b.onclick = () => { seg.querySelectorAll('.seg-b').forEach(x => x.classList.remove('on')); b.classList.add('on'); onChange(v); };
    seg.appendChild(b);
  });
  return w;
}

function toggle(label, value, onChange) {
  const w = el(`<label class="ctl tog"><input type="checkbox" ${value ? 'checked' : ''}><span class="tog-ui"></span><span class="ctl-l">${label}</span></label>`);
  const inp = w.querySelector('input');
  inp.addEventListener('change', () => onChange(inp.checked));
  w.set = v => { inp.checked = v; onChange(v); };
  return w;
}

function readouts(items) {
  const w = el(`<div class="readouts">${items.map(i => `<div class="ro"><span>${i[1]}</span><b data-k="${i[0]}">–</b></div>`).join('')}</div>`);
  w.set = (k, v) => { const b = w.querySelector(`[data-k="${k}"]`); if (b && b.textContent !== String(v)) b.textContent = v; };
  return w;
}

function labLayout(root, explain) {
  root.innerHTML = `<div class="lab-grid"><div class="lab-stage"></div><div class="lab-side"><div class="lab-controls"></div>${explain ? `<div class="lab-explain">${explain}</div>` : ''}</div></div>`;
  return { stage: root.querySelector('.lab-stage'), controls: root.querySelector('.lab-controls'), explain: root.querySelector('.lab-explain') };
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

function drawGear(g, x, y, r, teeth, angle, fill, stroke) {
  g.save(); g.translate(x, y); g.rotate(angle);
  g.beginPath();
  const n = teeth, th = Math.min(6, r * 0.18);
  for (let i = 0; i < n; i++) {
    const a0 = i / n * Math.PI * 2, a1 = (i + 0.25) / n * Math.PI * 2, a2 = (i + 0.5) / n * Math.PI * 2, a3 = (i + 0.75) / n * Math.PI * 2;
    g.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
    g.lineTo(Math.cos(a1) * (r + th), Math.sin(a1) * (r + th));
    g.lineTo(Math.cos(a2) * (r + th), Math.sin(a2) * (r + th));
    g.lineTo(Math.cos(a3) * r, Math.sin(a3) * r);
  }
  g.closePath(); g.fillStyle = fill; g.fill();
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1.5; g.stroke(); }
  g.beginPath(); g.arc(0, 0, Math.max(3, r * 0.22), 0, Math.PI * 2); g.fillStyle = '#3b4450'; g.fill();
  g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(0, 0); g.lineTo(r * 0.75, 0); g.stroke();
  g.restore();
}

function gridBg(g, w, h) {
  g.fillStyle = C.bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = C.grid; g.lineWidth = 1;
  for (let x = 0; x < w; x += 20) { g.beginPath(); g.moveTo(x + .5, 0); g.lineTo(x + .5, h); g.stroke(); }
  for (let y = 0; y < h; y += 20) { g.beginPath(); g.moveTo(0, y + .5); g.lineTo(w, y + .5); g.stroke(); }
}

function label(g, text, x, y, color = C.dim, size = 12, align = 'center', weight = 600) {
  g.fillStyle = color; g.font = `${weight} ${size}px Barlow, system-ui, sans-serif`; g.textAlign = align; g.textBaseline = 'middle';
  g.fillText(text, x, y);
}

/* ======================================================= LAB: GEAR RATIOS */
const LAB_GEARS = {
  title: 'Gear Ratio Lab',
  intro: 'Choose a chainring and a rear cog, set your pedalling speed, and see how far each pedal turn takes you, and how hard it is to push up a 10% hill.',
  tasks: [
    { id: 'climb', text: 'Choose a <b>climbing gear</b>: ratio below 1.0' },
    { id: 'sprint', text: 'Choose a <b>sprint gear</b>: ratio above 3.5' },
    { id: 'cruise', text: 'Cruise at <b>30 km/h</b> (±2) with a comfy <b>90 rpm</b> cadence (±5)' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, `<p><b>Gear ratio</b> = chainring teeth ÷ cog teeth: how many times the wheel turns for each pedal turn.</p>
      <p>A high ratio covers more ground per pedal turn but needs more force. A low ratio is easy to push but slow. <b>Power = force × speed</b>, so gears let you trade one for the other.</p>
      <p>A motorbike gearbox does exactly this for the engine.</p>`);
    const cv = makeCanvas(L.stage, 760, 360);
    const s = { ring: 34, cog: 19, cad: 70, crank: 0, wheel: 0 };
    const rings = [24, 34, 44], cogs = [11, 13, 15, 17, 19, 21, 24, 28, 32, 36];
    const ro = readouts([['ratio', 'Gear ratio'], ['dev', 'Distance / pedal turn'], ['spd', 'Speed'], ['force', 'Pedal force, 10% hill']]);
    L.controls.append(
      choice('Chainring (front)', rings.map(r => ({ v: r, t: r + 'T' })), s.ring, v => s.ring = v),
      choice('Rear cog', cogs.map(r => ({ v: r, t: r })), s.cog, v => s.cog = v),
      slider('Cadence (pedal rpm)', 30, 130, 1, s.cad, v => v + ' rpm', v => s.cad = v),
      ro
    );
    const CIRC = 2.13, R = 0.34;
    const stop = animLoop(dt => {
      const ratio = s.ring / s.cog;
      const kmh = s.cad * ratio * CIRC / 60 * 3.6;
      const Fw = 90 * 9.81 * (0.0995 + 0.008), force = Fw * R * ratio / 0.17;
      ro.set('ratio', ratio.toFixed(2) + ' : 1');
      ro.set('dev', (ratio * CIRC).toFixed(2) + ' m');
      ro.set('spd', kmh.toFixed(1) + ' km/h');
      ro.set('force', Math.round(force) + ' N');
      if (ratio < 1) ctx.complete('climb');
      if (ratio > 3.5) ctx.complete('sprint');
      if (Math.abs(kmh - 30) <= 2 && Math.abs(s.cad - 90) <= 5) ctx.complete('cruise');

      s.crank += s.cad / 60 * Math.PI * 2 * dt;
      s.wheel += s.cad / 60 * Math.PI * 2 * dt * ratio;
      const g = cv.g; gridBg(g, cv.w, cv.h);
      const cy = 175, wx = 190, rx = 560;
      const rr = s.ring * 2.1, cr = s.cog * 2.1;
      // wheel
      g.save(); g.translate(wx, cy);
      g.beginPath(); g.arc(0, 0, 150, 0, Math.PI * 2); g.strokeStyle = '#1b1e22'; g.lineWidth = 16; g.stroke();
      g.beginPath(); g.arc(0, 0, 141, 0, Math.PI * 2); g.strokeStyle = C.steel; g.lineWidth = 3; g.stroke();
      g.rotate(s.wheel);
      g.strokeStyle = 'rgba(200,210,220,.35)'; g.lineWidth = 1;
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 140, Math.sin(a) * 140); g.stroke(); }
      g.fillStyle = C.amber; g.beginPath(); g.arc(141, 0, 7, 0, Math.PI * 2); g.fill();
      g.restore();
      // chain (external tangents)
      const d = rx - wx, sa = (rr - cr) / d, ca = Math.sqrt(1 - sa * sa);
      const t1 = [wx - cr * sa, cy - cr * ca], t2 = [rx - rr * sa, cy - rr * ca];
      const b1 = [wx - cr * sa, cy + cr * ca], b2 = [rx - rr * sa, cy + rr * ca];
      g.setLineDash([7, 4]); g.lineDashOffset = -s.crank * rr; g.strokeStyle = '#9aa4ad'; g.lineWidth = 4;
      g.beginPath(); g.moveTo(t1[0], t1[1]); g.lineTo(t2[0], t2[1]); g.stroke();
      g.beginPath(); g.moveTo(b2[0], b2[1]); g.lineTo(b1[0], b1[1]); g.stroke();
      g.setLineDash([]);
      drawGear(g, wx, cy, cr, s.cog, s.wheel, '#aab4be');
      drawGear(g, rx, cy, rr, s.ring, s.crank, '#c9d1d9');
      // crank arm + pedal
      g.save(); g.translate(rx, cy); g.rotate(s.crank);
      g.strokeStyle = '#e3e9ee'; g.lineWidth = 10; g.lineCap = 'round';
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 120); g.stroke();
      g.translate(0, 120); g.rotate(-s.crank); g.fillStyle = C.dark; g.fillRect(-18, -5, 36, 10);
      g.restore();
      label(g, `${s.cog}T cog`, wx, cy + 175, C.dim, 13);
      label(g, `${s.ring}T chainring`, rx, cy + 175, C.dim, 13);
      label(g, `Wheel turns ${ratio.toFixed(2)}× per pedal turn`, cv.w / 2, 22, C.amber, 16, 'center', 700);
      // effort bar
      const bx = 690, by = 60, bh = 240, f = clamp(force / 900, 0, 1);
      g.fillStyle = '#1b2733'; roundRect(g, bx, by, 34, bh, 6); g.fill();
      g.fillStyle = force > 700 ? C.red : force > 350 ? C.amber : C.green;
      roundRect(g, bx, by + bh * (1 - f), 34, bh * f, 6); g.fill();
      const wy = by + bh * (1 - 700 / 900);
      g.strokeStyle = C.text; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(bx - 8, wy); g.lineTo(bx + 42, wy); g.stroke(); g.setLineDash([]);
      label(g, 'body', bx - 26, wy - 6, C.dim, 11); label(g, 'weight', bx - 26, wy + 7, C.dim, 11);
      label(g, 'Hill effort', bx + 17, by - 14, C.dim, 12);
    });
    return stop;
  }
};

/* ============================================ LAB: SUSPENSION + BRAKES */
function twoPanels(root, subtitle) {
  root.innerHTML = `<div class="lab-grid"><div class="lab-stage"></div><div class="lab-side"><div class="lab-controls"></div></div></div>
    <h3 class="lab-sub">${subtitle}</h3>
    <div class="lab-grid"><div class="lab-stage b"></div><div class="lab-side"><div class="lab-controls b"></div></div></div>`;
  return {
    stage: root.querySelector('.lab-stage'), ctl: root.querySelector('.lab-controls'),
    stageB: root.querySelector('.lab-stage.b'), ctlB: root.querySelector('.lab-controls.b')
  };
}

/* Quarter-vehicle model: a sprung mass on a spring + damper over a wheel and tyre.
   cfg: P {ms, mu, kt, ct, L0, travel, R}, k/c/speed: [min, max, step, default],
   terrains: [{v, t, road(x), drop}], terrain (default), massLabel, ppm,
   check(s, contact, ctx) to tick tasks. */
function suspensionPanel(stage, ctl, ctx, cfg) {
  const cv = makeCanvas(stage, 760, 330);
  const P = cfg.P, TR = Object.fromEntries(cfg.terrains.map(t => [t.v, t]));
  const s = { k: cfg.k[3], c: cfg.c[3], speed: cfg.speed[3], sc: cfg.terrain, x: 0, scT: 0, hist: [], contactHist: [], bottoms: 0, wasB: false, maxc: 0 };
  const roadAt = x => TR[s.sc].road(x);
  const travelMm = Math.round(P.travel * 1000);
  function resetSim() {
    const g = 9.81, drop = TR[s.sc].drop || 0;
    s.zu = P.R - (P.ms + P.mu) * g / P.kt + drop; s.vu = 0; s.zs = s.zu + P.L0 - P.ms * g / s.k; s.vs = 0;
    s.x = 0; s.scT = 0; s.bottoms = 0; s.maxc = 0; s.hist = []; s.contactHist = []; s.wasB = false;
  }
  resetSim();
  const ro = readouts([['sag', 'Static sag'], ['used', 'Max travel used'], ['bot', 'Bottom-outs'], ['con', 'Tyre contact']]);
  const btnRun = el(`<button class="btn small" type="button">↺ Replay</button>`);
  btnRun.onclick = resetSim;
  ctl.append(
    choice('Terrain', cfg.terrains.map(t => ({ v: t.v, t: t.t })), s.sc, v => { s.sc = v; resetSim(); }),
    slider('Spring rate', cfg.k[0], cfg.k[1], cfg.k[2], s.k, v => (v / 1000).toFixed(1) + ' N/mm', v => { s.k = v; }),
    slider('Damping', cfg.c[0], cfg.c[1], cfg.c[2], s.c, v => v + ' Ns/m', v => { s.c = v; }),
    slider('Speed', cfg.speed[0], cfg.speed[1], cfg.speed[2], s.speed, v => v + ' m/s', v => { s.speed = v; }),
    ro, btnRun
  );
  function physStep(dt) {
    const g = 9.81;
    s.x += s.speed * dt;
    const r = roadAt(s.x), rd = (roadAt(s.x + 0.001) - r) / 0.001 * s.speed;
    const d = r + P.R - s.zu;
    let Ft = 0; if (d > 0) { Ft = Math.max(0, P.kt * d + P.ct * (rd - s.vu)); }
    const comp = P.L0 - (s.zs - s.zu), compv = -(s.vs - s.vu);
    // Top-out stop, a progressive bump rubber in the last 10% of travel, then a hard stop.
    let Fs = s.k * comp; if (comp < 0) Fs = 200000 * comp;
    const cush = P.travel * 0.1;
    if (comp > P.travel - cush) Fs += (P.cushK || 60000) * (comp - (P.travel - cush));
    if (comp > P.travel) Fs += 1e6 * (comp - P.travel);
    const F = Fs + s.c * compv;
    s.vs += (F - P.ms * g) / P.ms * dt; s.vu += (Ft - F - P.mu * g) / P.mu * dt;
    s.zs += s.vs * dt; s.zu += s.vu * dt;
    const isB = comp > P.travel - 0.005; if (isB && !s.wasB) s.bottoms++; s.wasB = isB;
    s.maxc = Math.max(s.maxc, comp);
    return { comp, contact: Ft > 0 };
  }
  let acc = 0;
  return animLoop(dt => {
    const sub = 40, h = dt / sub; let last, cn = 0;
    for (let i = 0; i < sub; i++) { last = physStep(h); if (last.contact) cn++; }
    s.scT += dt;
    s.contactHist.push(cn / sub); if (s.contactHist.length > 180) s.contactHist.shift();
    acc += dt; if (acc > 1 / 60) { acc = 0; s.hist.push(last.comp); if (s.hist.length > 300) s.hist.shift(); }
    if (TR[s.sc].drop && s.scT > 3) resetSim();
    const contact = s.contactHist.reduce((a, b) => a + b, 0) / Math.max(1, s.contactHist.length) * 100;
    ro.set('sag', (P.ms * 9.81 / s.k * 1000).toFixed(0) + ' mm');
    ro.set('used', (s.maxc * 1000).toFixed(0) + ` / ${travelMm} mm`);
    ro.set('bot', s.bottoms);
    ro.set('con', contact.toFixed(0) + '%');
    cfg.check(s, contact, ctx);

    const g = cv.g; gridBg(g, cv.w, cv.h);
    const ppm = cfg.ppm || 190, gx = 240;
    s.cam = lerp(s.cam || 0, Math.max(0, s.zu - P.R - 0.05), 0.15);
    const gy = 300 + s.cam * ppm;
    const toY = z => gy - z * ppm;
    g.beginPath(); g.moveTo(0, cv.h);
    for (let px = 0; px <= cv.w; px += 3) { const wx = s.x + (px - gx) / ppm; g.lineTo(px, toY(roadAt(wx))); }
    g.lineTo(cv.w, cv.h); g.closePath(); g.fillStyle = cfg.groundFill || '#5b4632'; g.fill();
    g.strokeStyle = cfg.groundEdge || '#8b6d4c'; g.lineWidth = 3; g.beginPath();
    for (let px = 0; px <= cv.w; px += 3) { const wx = s.x + (px - gx) / ppm; px ? g.lineTo(px, toY(roadAt(wx))) : g.moveTo(px, toY(roadAt(wx))); }
    g.stroke();
    const wy = toY(s.zu), wr = P.R * ppm;
    g.beginPath(); g.arc(gx, wy, wr - 10, 0, Math.PI * 2); g.strokeStyle = '#17191c'; g.lineWidth = 20; g.stroke();
    g.save(); g.translate(gx, wy); g.rotate(s.x / P.R);
    g.strokeStyle = 'rgba(200,210,220,.4)'; g.lineWidth = 1.2;
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * (wr - 22), Math.sin(a) * (wr - 22)); g.stroke(); }
    g.restore();
    g.beginPath(); g.arc(gx, wy, 10, 0, Math.PI * 2); g.fillStyle = C.steel; g.fill();
    const cyy = toY(s.zs);
    g.fillStyle = C.blue; roundRect(g, gx - 90, cyy - 40, 180, 40, 8); g.fill();
    label(g, cfg.massLabel, gx, cyy - 20, '#0b1220', 12, 'center', 700);
    const top = cyy, bot = wy - 12;
    g.strokeStyle = '#e5482f'; g.lineWidth = 4; g.beginPath();
    const n = 10; g.moveTo(gx - 26, top);
    for (let i = 1; i < n * 2; i++) { const t = i / (n * 2); g.lineTo(gx - 26 + (i % 2 ? 12 : -12), top + (bot - top) * t); }
    g.lineTo(gx - 26, bot); g.stroke();
    g.fillStyle = C.amber; g.fillRect(gx + 16, top, 18, (bot - top) * 0.55);
    g.strokeStyle = C.steel; g.lineWidth = 5; g.beginPath(); g.moveTo(gx + 25, top + (bot - top) * 0.5); g.lineTo(gx + 25, bot); g.stroke();
    g.strokeStyle = '#59616b'; g.lineWidth = 6; g.beginPath(); g.moveTo(gx - 40, bot); g.lineTo(gx + 40, bot); g.lineTo(gx, wy); g.closePath(); g.stroke();
    label(g, 'spring', gx - 58, (top + bot) / 2, '#e5482f', 12);
    label(g, 'damper', gx + 66, (top + bot) / 2, C.amber, 12);
    const ox = 470, oy = 30, ow = 270, oh = 130;
    g.fillStyle = 'rgba(10,16,24,.85)'; roundRect(g, ox, oy, ow, oh, 8); g.fill();
    g.strokeStyle = C.red; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(ox, oy + 12); g.lineTo(ox + ow, oy + 12); g.stroke(); g.setLineDash([]);
    label(g, `bottom (${travelMm} mm)`, ox + ow - 6, oy + 22, C.red, 10, 'right');
    g.strokeStyle = C.teal; g.lineWidth = 2; g.beginPath();
    s.hist.forEach((v, i) => { const px = ox + i / 300 * ow, py = oy + oh - 8 - clamp(v / P.travel, -0.05, 1.05) * (oh - 20); i ? g.lineTo(px, py) : g.moveTo(px, py); });
    g.stroke();
    label(g, 'suspension compression', ox + 8, oy + oh - 10, C.dim, 10, 'left');
    if (last && !last.contact) label(g, 'AIRBORNE / NO GRIP', gx, Math.min(cv.h - 14, gy + 16), C.red, 14, 'center', 700);
  });
}

/* Hydraulic brake calculator. cfg: forceLabel, F/dm/dc/rotor: [min, max, step, default],
   ratio (lever or pedal), servo (assist factor or 0), pistons per caliper, calipers
   (on the braked axle), circuitCalipers (for travel), share (fraction of braking this
   axle does), mass, tyreR, mu, maxTravel, travelBase, overTravel, check(r, ctx). */
function brakePanel(stage, ctl, ctx, cfg) {
  const cb = makeCanvas(stage, 760, 200);
  const b = { F: cfg.F[3], dm: cfg.dm[3], dc: cfg.dc[3], rotor: cfg.rotor[3], servo: !!cfg.servo };
  const roB = readouts([['p', 'Line pressure'], ['mult', 'Hydraulic multiplication'], ['clamp', 'Pad clamp force'], ['dec', 'Deceleration'], ['trav', cfg.travelLabel]]);
  ctl.append(slider(cfg.forceLabel, cfg.F[0], cfg.F[1], cfg.F[2], b.F, v => v + ' N', v => b.F = v));
  if (cfg.servo) ctl.append(toggle(`Brake servo (×${cfg.servo} assist)`, true, v => b.servo = v));
  ctl.append(
    slider('Master cylinder bore', cfg.dm[0], cfg.dm[1], cfg.dm[2], b.dm, v => v + ' mm', v => b.dm = v),
    slider(cfg.pistonLabel, cfg.dc[0], cfg.dc[1], cfg.dc[2], b.dc, v => v + ' mm', v => b.dc = v),
    slider('Rotor diameter', cfg.rotor[0], cfg.rotor[1], cfg.rotor[2], b.rotor, v => v + ' mm', v => b.rotor = v),
    roB
  );
  return animLoop(() => {
    const Am = Math.PI / 4 * b.dm * b.dm, Ac = cfg.pistons * Math.PI / 4 * b.dc * b.dc;
    const push = b.F * cfg.ratio * (b.servo && cfg.servo ? cfg.servo : 1);
    const p = push / Am;                      // N/mm^2 = MPa
    const clampF = p * Ac;                    // N
    const fric = cfg.mu * clampF * 2;         // two pad faces
    const torque = cfg.calipers * fric * (b.rotor / 2 - 15) / 1000;
    const decel = torque / cfg.tyreR / cfg.share / cfg.mass / 9.81;
    const travel = 0.3 * (Ac * cfg.circuitCalipers / Am) * cfg.ratio + cfg.travelBase;
    const bottomed = travel > cfg.maxTravel;
    const effDec = bottomed ? decel * cfg.maxTravel / travel * 0.6 : decel;
    roB.set('p', (p * 10).toFixed(1) + ' bar');
    roB.set('mult', '×' + (Ac / Am).toFixed(1));
    roB.set('clamp', (clampF / 1000).toFixed(2) + ' kN');
    roB.set('dec', effDec.toFixed(2) + ' g' + (effDec > 1.0 ? ' (wheels lock!)' : ''));
    roB.set('trav', travel.toFixed(0) + ' mm' + (bottomed ? ` (${cfg.overTravel})` : ''));
    cfg.check({ F: b.F, decel: effDec, bottomed, servo: b.servo }, ctx);
    const g = cb.g; gridBg(g, cb.w, cb.h);
    g.strokeStyle = C.steel; g.lineWidth = 8; g.lineCap = 'round';
    g.beginPath(); g.moveTo(40, 60); g.lineTo(140, 60 + Math.min(travel, 40) * 0.6); g.stroke();
    label(g, `${b.F} N`, 90, 30, C.amber, 14, 'center', 700);
    if (cfg.servo) label(g, b.servo ? `servo ×${cfg.servo}` : 'no servo', 90, 110, b.servo ? C.teal : C.red, 11, 'center', 700);
    const mh = b.dm * 2.4 * (cfg.drawScale || 1);
    g.fillStyle = '#3b4450'; roundRect(g, 150, 80 - mh / 2 - 4, 80, mh + 8, 4); g.fill();
    g.fillStyle = C.red; g.fillRect(156, 80 - mh / 2, 66, mh);
    g.fillStyle = C.steel; g.fillRect(150, 80 - mh / 2, 18, mh);
    label(g, 'master cyl.', 190, 80 + mh / 2 + 16, C.dim, 11);
    g.strokeStyle = C.red; g.lineWidth = 6; g.beginPath(); g.moveTo(230, 80); g.bezierCurveTo(330, 80, 380, 150, 470, 120); g.stroke();
    label(g, `${(p * 10).toFixed(0)} bar everywhere`, 360, 90, C.text, 12);
    const rr = b.rotor / 4;
    g.beginPath(); g.arc(640, 100, rr, 0, Math.PI * 2); g.strokeStyle = '#9aa4ae'; g.lineWidth = 12; g.stroke();
    const ch = b.dc * 2.4 * (cfg.drawScale || 1);
    g.fillStyle = '#c53030'; roundRect(g, 640 - rr - 70, 100 - ch / 2 - 8, 50, ch + 16, 6); g.fill();
    g.fillStyle = C.steel; g.fillRect(640 - rr - 62, 100 - ch / 2, 34, ch);
    g.strokeStyle = C.red; g.lineWidth = 6; g.beginPath(); g.moveTo(470, 120); g.lineTo(640 - rr - 70, 110); g.stroke();
    g.fillStyle = '#e8b04a'; g.fillRect(640 - rr - 20, 100 - ch / 2, 8, ch);
    label(g, 'caliper piston' + (cfg.pistons > 1 ? 's' : ''), 640 - rr - 45, 100 + ch / 2 + 22, C.dim, 11);
    label(g, 'rotor', 640, 100 + rr + 20, C.dim, 11);
    label(g, `${(clampF / 1000).toFixed(1)} kN`, 640 - rr - 45, 100 - ch / 2 - 22, C.amber, 14, 'center', 700);
    const mx = 740, f = clamp(effDec / 1.2, 0, 1);
    g.fillStyle = '#1b2733'; g.fillRect(mx - 8, 20, 16, 160);
    g.fillStyle = effDec > 1 ? C.red : effDec >= 0.9 ? C.green : C.amber;
    g.fillRect(mx - 8, 20 + 160 * (1 - f), 16, 160 * f);
    g.strokeStyle = C.text; g.lineWidth = 1;
    [0.9, 1.0].forEach(v => { const y = 20 + 160 * (1 - v / 1.2); g.beginPath(); g.moveTo(mx - 12, y); g.lineTo(mx + 12, y); g.stroke(); });
    label(g, 'g', mx, 192, C.dim, 11);
  });
}

const LAB_CHASSIS = {
  title: 'Suspension & Brakes Lab',
  intro: 'Tune the spring and damper on a quarter-bike model, then design a hydraulic front brake.',
  tasks: [
    { id: 'pogo', text: 'Set damping to <b>0</b> and hit the <b>big rock</b>. Watch it pogo.' },
    { id: 'jump', text: 'Land the <b>jump</b> without bottoming out' },
    { id: 'harsh', text: 'On <b>chatter bumps</b>, crank damping to max and watch tyre contact fall below 90%' },
    { id: 'brake', text: 'Brake design: <b>0.9–1.0 g</b> with only <b>100 N</b> at the lever, without the lever hitting the bar' }
  ],
  mount(root, ctx) {
    const L = twoPanels(root, 'Hydraulic brake designer');
    const a = suspensionPanel(L.stage, L.ctl, ctx, {
      P: { ms: 120, mu: 15, kt: 150000, ct: 200, L0: 0.6, travel: 0.30, R: 0.33 },
      k: [5000, 30000, 500, 12000], c: [0, 6000, 100, 1200], speed: [2, 20, 1, 8],
      massLabel: 'sprung mass (bike + rider)', terrain: 'rock',
      terrains: [
        { v: 'chatter', t: 'Chatter bumps', road: x => 0.02 * Math.abs(Math.sin(Math.PI * x / 0.7)) },
        { v: 'rock', t: 'Big rock', road: x => { const p = ((x % 14) + 14) % 14; return (p > 4 && p < 5.2) ? 0.22 * Math.sin(Math.PI * (p - 4) / 1.2) : 0; } },
        { v: 'jump', t: 'Jump landing', road: () => 0, drop: 1.2 }
      ],
      check(s, contact, ctx) {
        if (s.sc === 'rock' && s.c <= 200 && s.scT > 4) ctx.complete('pogo');
        if (s.sc === 'jump' && s.scT > 1.6 && s.bottoms === 0 && s.maxc > 0.1) ctx.complete('jump');
        if (s.sc === 'chatter' && s.c >= 5000 && s.contactHist.length >= 120 && contact < 90) ctx.complete('harsh');
      }
    });
    const b = brakePanel(L.stageB, L.ctlB, ctx, {
      forceLabel: 'Lever force', F: [20, 200, 5, 100], ratio: 5, servo: 0,
      dm: [8, 14, 0.5, 11], dc: [22, 34, 1, 27], rotor: [220, 320, 10, 260],
      pistons: 2, pistonLabel: 'Caliper pistons (2×)', calipers: 1, circuitCalipers: 1, share: 1,
      mu: 0.45, mass: 260, tyreR: 0.36, maxTravel: 35, travelBase: 5, travelLabel: 'Lever travel', overTravel: 'hits bar!',
      check(r, ctx) { if (r.F <= 100 && r.decel >= 0.9 && r.decel <= 1.0 && !r.bottomed) ctx.complete('brake'); }
    });
    return () => { a(); b(); };
  }
};

/* ===================================================== LAB: FOUR-STROKE */
const LAB_FOURSTROKE = {
  title: 'Four-Stroke Engine Lab',
  intro: 'A cut-away single-cylinder engine in slow motion. Watch the piston, valves and cams, then try firing the spark yourself.',
  tasks: [
    { id: 'cycle', text: 'Watch one complete cycle: <b>720°</b> of crank rotation' },
    { id: 'power', text: '<b>Pause</b> the engine during the <b>power</b> stroke' },
    { id: 'overlap', text: 'Pause at <b>valve overlap</b>, when intake and exhaust valves are both open' },
    { id: 'spark', text: 'Turn off auto-spark and fire <b>3 good sparks</b> yourself (10–40° before TDC on compression)' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, `<div class="stroke-info"></div>`);
    const cv = makeCanvas(L.stage, 780, 470);
    const s = { th: 0, rpm: 20, playing: true, auto: true, total: 0, burned: false, flash: 0, good: 0, msg: '', msgT: 0, kick: 0 };
    const playBtn = el(`<button class="btn" type="button">⏸ Pause</button>`);
    playBtn.onclick = () => { s.playing = !s.playing; playBtn.textContent = s.playing ? '⏸ Pause' : '▶ Play'; };
    const stepBtn = el(`<button class="btn ghost" type="button">⏭ Next stroke</button>`);
    stepBtn.onclick = () => { s.playing = false; playBtn.textContent = '▶ Play'; const nt = (Math.floor(s.th / 180) + 1) * 180; advance(nt - s.th + 0.01); };
    const sparkBtn = el(`<button class="btn spark" type="button" disabled>⚡ SPARK!</button>`);
    sparkBtn.onclick = () => manualSpark();
    const ro = readouts([['ang', 'Crank angle'], ['stroke', 'Stroke'], ['iv', 'Intake valve'], ['ev', 'Exhaust valve'], ['good', 'Good sparks']]);
    L.controls.append(
      el(`<div class="btnrow"></div>`),
      slider('Engine speed (slow motion)', 4, 120, 1, s.rpm, v => v + ' rpm', v => s.rpm = v),
      toggle('Automatic spark (ECU)', true, v => { s.auto = v; sparkBtn.disabled = v; }),
      ro
    );
    L.controls.firstChild.append(playBtn, stepBtn, sparkBtn);
    const info = L.explain.querySelector('.stroke-info');
    const keyFn = e => { if (e.code === 'Space' && !s.auto) { e.preventDefault(); manualSpark(); } };
    window.addEventListener('keydown', keyFn);

    const STROKES = [
      { n: 'Intake', c: C.blue, t: 'The piston moves <b>down</b> with the intake valves <b>open</b>. The falling pressure draws in fuel and air from the carburettor.' },
      { n: 'Compression', c: '#a78bfa', t: 'Both valves are <b>closed</b>. The piston rises and squeezes the mixture to about 1/13 of its volume, heating it up. Near the top, the spark fires.' },
      { n: 'Power', c: C.orange, t: 'The burning mixture reaches over 60 bar and drives the piston <b>down</b> hard. This is the <b>only</b> stroke that makes power. The flywheel stores some of it to carry the engine through the other three.' },
      { n: 'Exhaust', c: '#9ca3af', t: 'The exhaust valves open and the rising piston pushes the burnt gas out into the header. Near the top, the intake valves start opening too: that\'s <b>overlap</b>.' }
    ];
    const lift = (th, centre, dur) => { let d = ((th - centre + 360 + 720) % 720) - 360; return Math.abs(d) < dur / 2 ? Math.pow(Math.cos(d / dur * Math.PI), 1.5) : 0; };
    const intakeLift = th => lift(th, 112, 250);
    const exhaustLift = th => lift(th, 608, 250);

    function manualSpark() {
      if (s.auto) return;
      const th = s.th;
      const btdc = 360 - th;
      if (th > 175 && th < 360 && btdc >= 10 && btdc <= 40) {
        s.good++; s.burned = true; s.flash = 1; say(`Good spark at ${btdc.toFixed(0)}° BTDC!`, C.green);
        if (s.good >= 3) ctx.complete('spark');
      } else if (th > 175 && th < 360 && btdc > 40) {
        s.flash = 1; s.burned = true; s.kick = 1; say(`Too early (${btdc.toFixed(0)}° BTDC)! Pressure peaks while the piston is still rising. That's knock, or a kickback.`, C.red);
      } else if ((th >= 360 && th < 400) || (th > 175 && th < 360 && btdc < 10)) {
        s.flash = 1; s.burned = true; say('Too late: the piston is already moving away, so most of the push is wasted.', C.amber);
      } else {
        s.flash = 0.6; say('Wasted spark: there\'s no compressed mixture to light right now.', C.dim);
      }
    }
    function say(m, c) { s.msg = m; s.msgC = c; s.msgT = 3; }
    function advance(deg) {
      const prev = s.th;
      s.th += deg; s.total += deg;
      if (s.total >= 720) ctx.complete('cycle');
      if (s.auto && prev < 340 && s.th >= 340) { s.burned = true; s.flash = 1; }
      if (s.th >= 720) { s.th -= 720; }
      if (prev < 180 && s.th >= 180) s.burned = false; // new charge at compression start
    }
    let lastStroke = -1;
    const stop = animLoop(dt => {
      if (s.playing) advance(s.rpm * 6 * dt);
      const th = s.th, si = Math.floor(th / 180) % 4, st = STROKES[si];
      const il = intakeLift(th), el_ = exhaustLift(th);
      if (!s.playing) {
        if (si === 2) ctx.complete('power');
        if (il > 0.02 && el_ > 0.02) ctx.complete('overlap');
      }
      if (si !== lastStroke) { lastStroke = si; info.innerHTML = `<h4 style="color:${st.c}">${si + 1}. ${st.n}</h4><p>${st.t}</p>`; }
      ro.set('ang', `${th.toFixed(0)}° / 720°`);
      ro.set('stroke', st.n);
      ro.set('iv', il > 0.02 ? `open ${(il * 100).toFixed(0)}%` : 'closed');
      ro.set('ev', el_ > 0.02 ? `open ${(el_ * 100).toFixed(0)}%` : 'closed');
      ro.set('good', `${s.good} / 3`);
      s.flash = Math.max(0, s.flash - dt * 2.5); s.msgT -= dt; s.kick = Math.max(0, s.kick - dt * 3);

      const g = cv.g; gridBg(g, cv.w, cv.h);
      // geometry
      const cx = 250, cyC = 390, r = 46, l = 150, bore = 128;
      const rad = th * Math.PI / 180;
      const pinY = cyC - (r * Math.cos(rad) + Math.sqrt(l * l - r * r * Math.sin(rad) ** 2));
      const crankX = cx + r * Math.sin(rad), crankY = cyC - r * Math.cos(rad);
      const pTop = pinY - 26, roof = 132;
      const shake = s.kick * Math.sin(performance.now() / 20) * 3;
      g.save(); g.translate(shake, 0);
      // crankcase
      g.fillStyle = '#1d2733'; g.beginPath(); g.arc(cx, cyC, 80, 0, Math.PI * 2); g.fill();
      // cylinder walls + water jacket
      g.fillStyle = '#3a4a5c'; g.fillRect(cx - bore / 2 - 22, roof, 22, 200); g.fillRect(cx + bore / 2, roof, 22, 200);
      g.fillStyle = 'rgba(96,165,250,.25)'; g.fillRect(cx - bore / 2 - 16, roof + 10, 8, 150); g.fillRect(cx + bore / 2 + 8, roof + 10, 8, 150);
      // gas
      let gas = 'rgba(96,165,250,.35)';
      if (si === 0) gas = `rgba(96,165,250,${0.2 + 0.25 * il})`;
      if (si === 1) gas = `rgba(129,140,248,${0.35 + 0.35 * (th - 180) / 180})`;
      if (si === 2) gas = s.burned ? `rgba(251,146,60,${0.85 - 0.5 * (th - 360) / 180})` : 'rgba(129,140,248,.4)';
      if (si === 3) gas = `rgba(156,163,175,${0.55 - 0.35 * (th - 540) / 180})`;
      if (si === 1 && s.burned && th > 330) gas = 'rgba(251,146,60,.8)';
      g.fillStyle = gas; g.fillRect(cx - bore / 2, roof, bore, pTop - roof);
      // head
      g.fillStyle = '#4b5b6d';
      g.beginPath(); g.moveTo(cx - bore / 2 - 22, roof); g.lineTo(cx - bore / 2 - 22, 60); g.lineTo(cx + bore / 2 + 22, 60); g.lineTo(cx + bore / 2 + 22, roof);
      g.lineTo(cx + bore / 2, roof); g.lineTo(cx + 30, roof - 22); g.lineTo(cx - 30, roof - 22); g.lineTo(cx - bore / 2, roof); g.closePath(); g.fill();
      g.fillStyle = gas; g.beginPath(); g.moveTo(cx - bore / 2, roof); g.lineTo(cx - 30, roof - 22); g.lineTo(cx + 30, roof - 22); g.lineTo(cx + bore / 2, roof); g.closePath(); g.fill();
      // ports
      g.fillStyle = '#0e1822';
      g.beginPath(); g.moveTo(cx - 62, roof - 10); g.lineTo(cx - 150, 70); g.lineTo(cx - 150, 100); g.lineTo(cx - 70, roof + 2); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(cx + 62, roof - 10); g.lineTo(cx + 150, 70); g.lineTo(cx + 150, 100); g.lineTo(cx + 70, roof + 2); g.closePath(); g.fill();
      if (il > 0.05) { g.fillStyle = `rgba(96,165,250,${0.3 + il * 0.4})`; g.fillRect(cx - 150, 72, 60, 26); }
      if (el_ > 0.05) { g.fillStyle = `rgba(156,163,175,${0.3 + el_ * 0.5})`; g.fillRect(cx + 90, 72, 60, 26); }
      label(g, 'INTAKE', cx - 175, 60, C.blue, 11, 'center', 700);
      label(g, 'from carb', cx - 175, 74, C.dim, 10);
      label(g, 'EXHAUST', cx + 178, 60, '#9ca3af', 11, 'center', 700);
      label(g, 'to header', cx + 178, 74, C.dim, 10);
      // flow arrows
      const tnow = performance.now() / 1000;
      if (il > 0.1) for (let i = 0; i < 3; i++) { const f = (tnow * 1.5 + i / 3) % 1; g.fillStyle = C.blue; g.beginPath(); g.arc(cx - 150 + f * 80, 78 + f * 40, 3, 0, 7); g.fill(); }
      if (el_ > 0.1) for (let i = 0; i < 3; i++) { const f = (tnow * 1.5 + i / 3) % 1; g.fillStyle = '#9ca3af'; g.beginPath(); g.arc(cx + 70 + f * 80, roof - f * 40, 3, 0, 7); g.fill(); }
      // valves
      const drawValve = (x, liftv, col) => {
        const y = roof - 14 + liftv * 18;
        g.strokeStyle = C.steel; g.lineWidth = 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, 32); g.stroke();
        g.fillStyle = col; g.beginPath(); g.moveTo(x - 20, y + 4); g.lineTo(x + 20, y + 4); g.lineTo(x + 6, y - 4); g.lineTo(x - 6, y - 4); g.closePath(); g.fill();
      };
      drawValve(cx - 54, il, '#93c5fd'); drawValve(cx + 54, el_, '#d1d5db');
      // cams (half crank speed)
      const drawCam = (x, centre, col) => {
        const camA = (th - centre) / 2 * Math.PI / 180;
        g.save(); g.translate(x, 22); g.rotate(camA + Math.PI / 2);
        g.fillStyle = col; g.beginPath(); g.ellipse(4, 0, 18, 12, 0, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.arc(0, 0, 12, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#1d2733'; g.beginPath(); g.arc(0, 0, 3, 0, 7); g.fill();
        g.restore();
      };
      drawCam(cx - 54, 112, '#3b82f6'); drawCam(cx + 54, 608, '#9ca3af');
      label(g, 'cams turn at ½ crank speed', cx + 90, 22, C.dim, 10, 'left');
      // spark plug
      g.fillStyle = '#e5e7eb'; g.fillRect(cx - 7, 40, 14, 52);
      g.fillStyle = '#9ca3af'; g.fillRect(cx - 3, 92, 6, 14);
      if (s.flash > 0) {
        g.save(); g.globalAlpha = s.flash;
        const grd = g.createRadialGradient(cx, roof - 12, 2, cx, roof - 12, 70);
        grd.addColorStop(0, '#fffbe6'); grd.addColorStop(0.3, '#fde047'); grd.addColorStop(1, 'rgba(251,146,60,0)');
        g.fillStyle = grd; g.beginPath(); g.arc(cx, roof - 12, 70, 0, 7); g.fill();
        g.restore();
      }
      // piston
      g.fillStyle = '#c5ccd4'; g.fillRect(cx - bore / 2 + 2, pTop, bore - 4, 56);
      g.strokeStyle = '#6b7280'; g.lineWidth = 2;
      [8, 15, 22].forEach(o => { g.beginPath(); g.moveTo(cx - bore / 2 + 2, pTop + o); g.lineTo(cx + bore / 2 - 2, pTop + o); g.stroke(); });
      // con rod
      g.strokeStyle = '#94a3b8'; g.lineWidth = 16; g.lineCap = 'round';
      g.beginPath(); g.moveTo(cx, pinY); g.lineTo(crankX, crankY); g.stroke();
      g.fillStyle = '#475569'; g.beginPath(); g.arc(cx, pinY, 7, 0, 7); g.fill();
      // crank + flywheel
      g.save(); g.translate(cx, cyC); g.rotate(rad);
      g.fillStyle = '#64748b'; g.beginPath(); g.arc(0, 0, 66, Math.PI * 0.15 + Math.PI / 2, Math.PI * 0.85 + Math.PI / 2); g.lineTo(0, 0); g.fill();
      g.fillStyle = '#94a3b8'; g.fillRect(-10, -r - 8, 20, r + 16);
      g.restore();
      g.fillStyle = '#e2e8f0'; g.beginPath(); g.arc(crankX, crankY, 9, 0, 7); g.fill();
      g.fillStyle = '#334155'; g.beginPath(); g.arc(cx, cyC, 8, 0, 7); g.fill();
      g.restore();
      // TDC/BDC markers
      label(g, 'TDC', cx - bore / 2 - 44, cyC - r - l - 26, C.dim, 10);
      label(g, 'BDC', cx - bore / 2 - 44, cyC + r - l - 26, C.dim, 10);
      g.strokeStyle = 'rgba(138,160,181,.35)'; g.setLineDash([3, 3]);
      [cyC - r - l - 26, cyC + r - l - 26].forEach(y => { g.beginPath(); g.moveTo(cx - bore / 2 - 30, y); g.lineTo(cx - bore / 2 - 2, y); g.stroke(); });
      g.setLineDash([]);

      // right: cycle dial
      const dx = 600, dy = 130, dr = 90;
      STROKES.forEach((stk, i) => {
        g.beginPath(); g.moveTo(dx, dy);
        g.arc(dx, dy, dr, -Math.PI / 2 + i * Math.PI / 2, -Math.PI / 2 + (i + 1) * Math.PI / 2);
        g.closePath(); g.fillStyle = stk.c + (i === si ? 'ee' : '44'); g.fill();
        const am = -Math.PI / 2 + (i + 0.5) * Math.PI / 2;
        label(g, stk.n, dx + Math.cos(am) * dr * 0.6, dy + Math.sin(am) * dr * 0.6, i === si ? '#0b1220' : C.text, 12, 'center', 700);
      });
      const pa = -Math.PI / 2 + th / 720 * Math.PI * 2;
      g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(dx, dy); g.lineTo(dx + Math.cos(pa) * (dr + 8), dy + Math.sin(pa) * (dr + 8)); g.stroke();
      g.fillStyle = C.bg; g.beginPath(); g.arc(dx, dy, 22, 0, 7); g.fill();
      label(g, '720°', dx, dy, C.text, 12, 'center', 700);
      label(g, 'one cycle = 2 crank turns', dx, dy + dr + 18, C.dim, 11);
      // valve lift chart
      const gx0 = 470, gy0 = 290, gw = 280, gh = 110;
      g.fillStyle = 'rgba(10,16,24,.85)'; roundRect(g, gx0 - 10, gy0 - 20, gw + 20, gh + 50, 8); g.fill();
      label(g, 'valve lift vs crank angle', gx0, gy0 - 8, C.dim, 11, 'left');
      for (let i = 0; i <= 4; i++) { const x = gx0 + i / 4 * gw; g.strokeStyle = C.line; g.beginPath(); g.moveTo(x, gy0); g.lineTo(x, gy0 + gh); g.stroke(); label(g, i * 180 + '°', x, gy0 + gh + 12, C.dim, 10); }
      const plot = (fn, col) => { g.strokeStyle = col; g.lineWidth = 2.5; g.beginPath(); for (let a = 0; a <= 720; a += 4) { const x = gx0 + a / 720 * gw, y = gy0 + gh - fn(a) * (gh - 10); a ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); };
      plot(intakeLift, C.blue); plot(exhaustLift, '#9ca3af');
      const sx = gx0 + (s.auto ? 340 : 340) / 720 * gw;
      if (s.auto) { g.fillStyle = '#fde047'; g.beginPath(); g.moveTo(sx, gy0 + gh); g.lineTo(sx - 5, gy0 + gh - 10); g.lineTo(sx + 5, gy0 + gh - 10); g.fill(); }
      const cxp = gx0 + th / 720 * gw;
      g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cxp, gy0); g.lineTo(cxp, gy0 + gh); g.stroke();
      label(g, 'intake', gx0 + 30, gy0 + 14, C.blue, 11, 'left', 700);
      label(g, 'exhaust', gx0 + gw - 30, gy0 + 14, '#9ca3af', 11, 'right', 700);
      if (s.msgT > 0) {
        g.fillStyle = 'rgba(10,16,24,.9)'; roundRect(g, 20, cv.h - 44, cv.w - 40, 32, 8); g.fill();
        label(g, s.msg, cv.w / 2, cv.h - 28, s.msgC, 14, 'center', 700);
      } else if (!s.auto) {
        label(g, 'Press SPARK (or Space) when the piston is nearly at the top of the compression stroke', cv.w / 2, cv.h - 28, C.amber, 13);
      }
    });
    return () => { stop(); window.removeEventListener('keydown', keyFn); };
  }
};

/* =================================================== LAB: CARBURETTOR */
const LAB_MIXTURE = {
  title: 'Carburettor & Mixture Lab',
  intro: 'Start a cold engine, warm it up, then jet the carb for full-throttle power. Watch the air-fuel ratio, the plug colour, and the exhaust.',
  tasks: [
    { id: 'cold', text: '<b>Cold start</b>: get the engine running (hint: what does a cold engine need?)' },
    { id: 'warm', text: 'Let it <b>warm up</b> (above 55 °C), then switch the choke <b>off</b> while it keeps running' },
    { id: 'jet', text: 'Pick a main jet for <b>full-throttle power</b>: AFR 12.4–13.4 at over 90% throttle' },
    { id: 'filter', text: 'Clog the <b>air filter</b> at full throttle and see what it does to the mixture' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, `<p><b>AFR</b> (air-fuel ratio) is kilograms of air per kilogram of fuel.</p>
      <ul><li><b>14.7</b>: chemically perfect ("stoichiometric")</li><li><b>12.5–13.3</b>: best power</li><li><b>Below 11</b>: rich, sooty, bogs down</li><li><b>Above 15.5</b>: lean, hot, risks seizing</li></ul>
      <p>The throttle slide controls <b>air</b>. The jets meter <b>fuel</b> according to how fast that air is moving.</p>`);
    const cv = makeCanvas(L.stage, 760, 420);
    const s = { th: 0, jet: 140, choke: false, dirty: false, temp: 15, running: false, cylT: 15, msg: '', msgT: 0, fullT: 0, dirtyT: 0, parts: [], drops: [], smoke: [], rpmS: 0 };
    const startBtn = el(`<button class="btn" type="button">🔑 Start engine</button>`);
    const stopBtn = el(`<button class="btn ghost" type="button">Stop</button>`);
    const resetBtn = el(`<button class="btn ghost" type="button">❄ Reset to cold</button>`);
    startBtn.onclick = () => {
      if (s.running) return;
      const a = afr();
      if (a > 18.5) say('It cranks but won\'t fire: the mixture is far too lean to ignite.', C.red);
      else if (a < 8.8) say('It cranks but won\'t fire: flooded, too rich.', C.red);
      else { s.running = true; say('It fires up!', C.green); }
    };
    stopBtn.onclick = () => { s.running = false; };
    resetBtn.onclick = () => { s.running = false; s.temp = 15; s.cylT = 15; };
    const ro = readouts([['afr', 'Air-fuel ratio'], ['pow', 'Power'], ['eng', 'Engine temp'], ['plug', 'Spark plug']]);
    const jetCtl = choice('Main jet size', [130, 140, 150, 155, 160, 165, 170, 180, 190].map(v => ({ v, t: v })), s.jet, v => s.jet = v);
    L.controls.append(el(`<div class="btnrow"></div>`),
      slider('Throttle', 0, 100, 1, 0, v => v + '%', v => s.th = v / 100),
      jetCtl,
      toggle('Choke (cold-start enrichment)', false, v => s.choke = v),
      toggle('Clogged air filter', false, v => s.dirty = v),
      ro);
    L.controls.firstChild.append(startBtn, stopBtn, resetBtn);
    function say(m, c) { s.msg = m; s.msgC = c; s.msgT = 3.5; }
    function afr() {
      const smooth = t => t * t * (3 - 2 * t);
      const main = 12.8 * Math.pow(160 / s.jet, 2);
      let a = lerp(13.8, main, smooth(clamp((s.th - 0.1) / 0.8, 0, 1)));
      a *= 1 + 0.35 * clamp((75 - s.temp) / 60, 0, 1);
      if (s.choke) a *= 0.62;
      if (s.dirty) a *= 0.85;
      return a;
    }
    const powerOf = a => (a < 8.8 || a > 18.5) ? 0 : Math.exp(-Math.pow((a - 12.9) / (a < 12.9 ? 2.8 : 2.2), 2));
    const stop = animLoop(dt => {
      const a = afr();
      if (s.running) {
        if (a > 18.5) { s.running = false; say('Stalled: too lean to keep burning.', C.red); }
        else if (a < 8.8) { s.running = false; say(s.choke && s.temp > 40 ? 'Stalled: the choke is still on and the warm engine flooded. Too rich!' : 'Stalled: flooded, too rich.', C.red); }
      }
      const p = s.running ? powerOf(a) : 0;
      s.rpmS = lerp(s.rpmS, s.running ? 0.15 + 0.85 * s.th * p : 0, dt * 3);
      if (s.running) s.temp = Math.min(85, s.temp + dt * (3 + s.th * 6));
      else s.temp = Math.max(15, s.temp - dt * 0.5);
      const leanHeat = s.running ? clamp((a - 13.5) / 3, 0, 1) * s.th : 0;
      s.cylT = lerp(s.cylT, s.running ? s.temp + 120 * s.th + 260 * leanHeat : s.temp, dt * 0.8);
      if (s.running) ctx.complete('cold');
      if (s.running && s.temp > 55 && !s.choke) ctx.complete('warm');
      if (s.running && s.th > 0.9 && a >= 12.4 && a <= 13.4) { s.fullT += dt; if (s.fullT > 1) ctx.complete('jet'); } else s.fullT = 0;
      if (s.running && s.th > 0.8 && s.dirty) { s.dirtyT += dt; if (s.dirtyT > 2) ctx.complete('filter'); } else s.dirtyT = 0;
      const plug = a < 11.5 ? 'black, sooty' : a < 13.8 ? 'tan, healthy' : a < 15 ? 'light tan' : 'white, overheating!';
      ro.set('afr', (s.running ? a.toFixed(1) : a.toFixed(1) + ' (off)') + ' : 1');
      ro.set('pow', Math.round(p * s.th * 100) + '%');
      ro.set('eng', Math.round(s.temp) + ' °C' + (s.temp < 40 ? ' (cold)' : ''));
      ro.set('plug', s.running ? plug : '–');
      s.msgT -= dt;

      const g = cv.g; gridBg(g, cv.w, cv.h);
      const by = 150, bh = 70, vx = 380;
      // air filter
      g.fillStyle = s.dirty ? '#6b4e2e' : C.orange; roundRect(g, 20, by - 30, 50, bh + 60, 8); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.3)'; for (let y = by - 24; y < by + bh + 26; y += 8) { g.beginPath(); g.moveTo(24, y); g.lineTo(66, y); g.stroke(); }
      label(g, 'air filter', 45, by - 44, C.dim, 11);
      // bore with venturi
      const slideDrop = (1 - s.th) * (bh - 8);
      g.fillStyle = '#5a6675';
      g.beginPath(); g.moveTo(70, by - 20); g.lineTo(700, by - 20); g.lineTo(700, by); g.lineTo(vx + 80, by); g.quadraticCurveTo(vx, by + 14, vx - 80, by); g.lineTo(70, by); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(70, by + bh + 20); g.lineTo(700, by + bh + 20); g.lineTo(700, by + bh); g.lineTo(vx + 80, by + bh); g.quadraticCurveTo(vx, by + bh - 14, vx - 80, by + bh); g.lineTo(70, by + bh); g.closePath(); g.fill();
      label(g, 'AIR →', 110, by + bh / 2, C.text, 13, 'center', 700);
      label(g, '→ ENGINE', 650, by + bh / 2, C.text, 13, 'center', 700);
      label(g, 'venturi: air speeds up, pressure drops', vx, by + bh + 36, C.dim, 11);
      // slide + needle
      g.fillStyle = '#c7cfd8'; g.fillRect(vx - 24, by - 70, 48, 70 + slideDrop);
      g.fillStyle = '#9aa4ae'; g.fillRect(vx - 24, by - 70, 48, 8);
      g.strokeStyle = '#e5e7eb'; g.lineWidth = 4; g.beginPath(); g.moveTo(vx, by + slideDrop); g.lineTo(vx, by + bh + 50); g.stroke();
      label(g, 'throttle slide', vx + 80, by - 50, C.dim, 11);
      label(g, 'needle', vx + 38, by + bh + 4, C.dim, 10);
      // float bowl
      const bowlY = by + bh + 50;
      g.fillStyle = '#4b5563'; roundRect(g, vx - 90, bowlY, 180, 110, 10); g.fill();
      g.fillStyle = 'rgba(234,179,8,.55)'; g.fillRect(vx - 84, bowlY + 40, 168, 64);
      g.fillStyle = '#d1d5db'; roundRect(g, vx - 70, bowlY + 30, 40, 22, 6); g.fill();
      label(g, 'float', vx - 50, bowlY + 64, C.dim, 10);
      g.fillStyle = '#b45309'; g.fillRect(vx - 7, bowlY + 70, 14, 12);
      label(g, `main jet #${s.jet}`, vx + 50, bowlY + 76, C.amber, 11, 'left', 700);
      label(g, 'float bowl', vx, bowlY + 124, C.dim, 11);
      g.strokeStyle = '#9ca3af'; g.lineWidth = 6; g.beginPath(); g.moveTo(vx, bowlY + 70); g.lineTo(vx, by + bh - 2); g.stroke();
      if (s.choke) { g.strokeStyle = C.teal; g.lineWidth = 5; g.beginPath(); g.moveTo(vx - 60, bowlY + 44); g.lineTo(vx - 60, by + bh + 10); g.lineTo(vx - 150, by + bh); g.stroke(); label(g, 'choke circuit', vx - 150, by + bh + 34, C.teal, 11); }
      // particles
      const flow = s.running ? 0.15 + s.th * 0.85 : 0;
      if (Math.random() < flow * 1.2) s.parts.push({ x: 75, y: by + 6 + Math.random() * (bh - 12) });
      const fuelRate = s.running ? flow * 14.7 / a : 0;
      if (Math.random() < fuelRate * 1.2) s.drops.push({ x: vx + (Math.random() - 0.5) * 10, y: by + bh - 6 - slideDrop * 0.2, vx: 0 });
      s.parts = s.parts.filter(pp => { const narrow = Math.abs(pp.x - vx) < 90 ? 2.2 : 1; pp.x += (120 + 260 * flow) * narrow * dt; return pp.x < 700; });
      s.drops = s.drops.filter(d => { d.x += (100 + 300 * flow) * dt * 1.5; d.y -= 20 * dt; return d.x < 700; });
      g.fillStyle = 'rgba(147,197,253,.8)'; s.parts.forEach(pp => { g.beginPath(); g.arc(pp.x, pp.y, 2.2, 0, 7); g.fill(); });
      g.fillStyle = '#facc15'; s.drops.forEach(d => { g.beginPath(); g.arc(d.x, d.y, 2.6, 0, 7); g.fill(); });
      // exhaust smoke
      if (s.running && a < 11 && Math.random() < 0.5) s.smoke.push({ x: 720, y: 380, r: 6, a: 0.7 });
      s.smoke = s.smoke.filter(k => { k.x += 30 * dt; k.y -= 25 * dt; k.r += 12 * dt; k.a -= 0.4 * dt; return k.a > 0; });
      s.smoke.forEach(k => { g.fillStyle = `rgba(20,20,20,${k.a})`; g.beginPath(); g.arc(k.x, k.y, k.r, 0, 7); g.fill(); });
      // AFR gauge
      const gx = 650, gy = 330, gr = 62;
      const ang = v => Math.PI + clamp((v - 8) / 12, 0, 1) * Math.PI;
      const zone = (a0, a1, col) => { g.strokeStyle = col; g.lineWidth = 12; g.beginPath(); g.arc(gx, gy, gr, ang(a0), ang(a1)); g.stroke(); };
      zone(8, 11, '#111827'); zone(11, 12.4, '#92400e'); zone(12.4, 13.4, C.green); zone(13.4, 15.5, '#ca8a04'); zone(15.5, 20, C.red);
      const na = ang(a);
      g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + Math.cos(na) * (gr - 4), gy + Math.sin(na) * (gr - 4)); g.stroke();
      label(g, a.toFixed(1), gx, gy + 14, C.text, 16, 'center', 700);
      label(g, 'RICH', gx - gr, gy + 14, C.dim, 10); label(g, 'LEAN', gx + gr, gy + 14, C.dim, 10);
      label(g, 'AFR', gx, gy - 22, C.dim, 11);
      // engine/tacho
      const tx = 160, ty = 360;
      g.fillStyle = s.running ? C.green : '#374151'; g.beginPath(); g.arc(tx - 100, ty, 8, 0, 7); g.fill();
      label(g, s.running ? 'RUNNING' : 'OFF', tx - 82, ty, s.running ? C.green : C.dim, 12, 'left', 700);
      g.fillStyle = '#1b2733'; roundRect(g, tx - 100, ty + 18, 200, 14, 7); g.fill();
      g.fillStyle = C.amber; roundRect(g, tx - 100, ty + 18, 200 * s.rpmS, 14, 7); g.fill();
      label(g, 'engine speed', tx, ty + 46, C.dim, 10);
      const ct = clamp((s.cylT - 15) / 360, 0, 1);
      g.fillStyle = '#1b2733'; roundRect(g, tx - 100, ty - 34, 200, 10, 5); g.fill();
      g.fillStyle = ct > 0.75 ? C.red : C.orange; roundRect(g, tx - 100, ty - 34, 200 * ct, 10, 5); g.fill();
      label(g, ct > 0.75 ? 'piston temp: DANGER (lean)' : 'piston temp', tx, ty - 46, ct > 0.75 ? C.red : C.dim, 10);
      if (s.msgT > 0) { g.fillStyle = 'rgba(10,16,24,.92)'; roundRect(g, 20, 14, cv.w - 40, 32, 8); g.fill(); label(g, s.msg, cv.w / 2, 30, s.msgC, 14, 'center', 700); }
    });
    return stop;
  }
};

/* ===================================================== LAB: IGNITION */
/* cfg: { low, high (rpm targets), maxRpm, chain: [labels for the spark path] } */
const makeIgnitionLab = cfg => ({
  title: 'Ignition Timing Lab',
  intro: 'The spark has to fire before top dead centre so that peak pressure lands about 14° after it. Find the best timing at low and high rpm.',
  tasks: [
    { id: 'low', text: `At <b>${cfg.low.toLocaleString()} rpm</b>, find the timing for best power (≥ 97%)` },
    { id: 'high', text: `At <b>${cfg.high.toLocaleString()} rpm</b>, find the timing for best power (≥ 97%)` },
    { id: 'knock', text: 'Over-advance the timing until the engine <b>knocks</b>' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, `<p>The flame needs time to burn across the chamber. At high rpm the piston covers more crank degrees in that time, so the ECU has to fire <b>earlier</b> (more advance).</p>
      <p><b>Too early:</b> pressure spikes while the piston is still rising. It fights the engine and causes <b>knock</b> (detonation), which can crack pistons.</p>
      <p><b>Too late:</b> the piston is already running away from the pressure. Power is wasted, and the exhaust runs hot.</p>`);
    const cv = makeCanvas(L.stage, 760, 420);
    const s = { adv: 10, rpm: cfg.low, pulse: 0, knockT: 0 };
    const ro = readouts([['pk', 'Peak pressure at'], ['pow', 'Power'], ['burn', 'Burn duration'], ['st', 'Status']]);
    L.controls.append(
      slider('Engine speed', 1000, cfg.maxRpm, 500, s.rpm, v => v.toLocaleString() + ' rpm', v => s.rpm = v),
      slider('Ignition advance', 0, 50, 1, s.adv, v => v + '° BTDC', v => s.adv = v),
      ro);
    const stop = animLoop(dt => {
      const burn = 50 + s.rpm * 0.0035;
      const pk = -s.adv + burn * 0.6;
      const eff = Math.exp(-Math.pow((pk - 14) / 20, 2));
      const knock = pk < 4;
      const power = knock ? eff * 0.8 : eff;
      ro.set('pk', (pk >= 0 ? pk.toFixed(0) + '° ATDC' : (-pk).toFixed(0) + '° BTDC'));
      ro.set('pow', Math.round(power * 100) + '%');
      ro.set('burn', burn.toFixed(0) + '° of crank');
      ro.set('st', knock ? 'KNOCKING!' : pk > 30 ? 'retarded: weak' : power > 0.97 ? 'optimal' : 'ok');
      if (s.rpm === cfg.low && power >= 0.97) ctx.complete('low');
      if (s.rpm === cfg.high && power >= 0.97) ctx.complete('high');
      if (knock) { s.knockT += dt; if (s.knockT > 0.6) ctx.complete('knock'); } else s.knockT = 0;
      s.pulse = (s.pulse + dt * Math.min(6, s.rpm / 2000)) % 1;

      const g = cv.g; gridBg(g, cv.w, cv.h);
      const x0 = 60, x1 = 720, y0 = 50, y1 = 300;
      const A0 = -60, A1 = 100;
      const X = a => x0 + (a - A0) / (A1 - A0) * (x1 - x0);
      const motoring = a => { const V = 1 + 12 * (1 - Math.cos(a * Math.PI / 180)) / 2; return Math.pow(13 / V, 1.3); };
      const P = a => {
        let p = motoring(a);
        if (a > -s.adv) {
          const comb = 50 * eff * (knock ? 1.25 : 1);
          p += comb * Math.exp(-Math.pow((a - pk) / (burn * 0.33), 2)) * clamp((a + s.adv) / 8, 0, 1);
          if (knock && a > pk - 3) p += 9 * Math.sin((a - pk) * 1.7) * Math.exp(-(a - pk) / 18);
        }
        return p;
      };
      const maxP = 75, Y = p => y1 - clamp(p / maxP, 0, 1.05) * (y1 - y0);
      g.strokeStyle = C.line; g.lineWidth = 1;
      for (let a = -60; a <= 100; a += 20) { g.beginPath(); g.moveTo(X(a), y0); g.lineTo(X(a), y1); g.stroke(); label(g, (a === 0 ? 'TDC' : a + '°'), X(a), y1 + 14, a === 0 ? C.text : C.dim, 11); }
      label(g, 'crank angle (degrees, relative to top dead centre)', (x0 + x1) / 2, y1 + 32, C.dim, 11);
      label(g, 'cylinder pressure', x0, y0 - 18, C.dim, 11, 'left');
      g.fillStyle = 'rgba(74,222,128,.08)'; g.fillRect(X(8), y0, X(20) - X(8), y1 - y0);
      label(g, 'ideal peak', X(14), y0 + 10, C.green, 10);
      g.strokeStyle = 'rgba(138,160,181,.6)'; g.setLineDash([5, 4]); g.lineWidth = 1.5; g.beginPath();
      for (let a = A0; a <= A1; a++) { const x = X(a), y = Y(motoring(a)); a === A0 ? g.moveTo(x, y) : g.lineTo(x, y); }
      g.stroke(); g.setLineDash([]);
      label(g, 'no spark (compression only)', X(60), Y(motoring(60)) - 12, C.dim, 10);
      g.strokeStyle = knock ? C.red : C.orange; g.lineWidth = 3; g.beginPath();
      for (let a = A0; a <= A1; a += 0.5) { const x = X(a), y = Y(P(a)); a === A0 ? g.moveTo(x, y) : g.lineTo(x, y); }
      g.stroke();
      const sx = X(-s.adv);
      g.strokeStyle = '#fde047'; g.lineWidth = 2; g.beginPath(); g.moveTo(sx, y0); g.lineTo(sx, y1); g.stroke();
      label(g, '⚡ spark', sx, y0 - 4, '#fde047', 12, 'center', 700);
      g.fillStyle = '#fff'; g.beginPath(); g.arc(X(pk), Y(P(pk)), 5, 0, 7); g.fill();
      if (knock) label(g, 'KNOCK! Pressure spikes before TDC and rings', X(Math.max(-40, pk)), y0 + 34, C.red, 14, 'left', 700);
      // spark chain
      const cy = 375, steps = cfg.chain;
      steps.forEach((t, i) => {
        const x = 90 + i * (580 / (steps.length - 1));
        g.fillStyle = '#1b2733'; roundRect(g, x - 60, cy - 16, 120, 32, 8); g.fill();
        const lit = Math.abs(s.pulse * steps.length - i - 0.5) < 0.6;
        g.strokeStyle = lit ? '#fde047' : C.line; g.lineWidth = 2; roundRect(g, x - 60, cy - 16, 120, 32, 8); g.stroke();
        label(g, t, x, cy, lit ? '#fde047' : C.text, 12, 'center', 600);
        if (i < steps.length - 1) { g.fillStyle = C.dim; g.beginPath(); g.moveTo(x + 64, cy - 5); g.lineTo(x + 78, cy); g.lineTo(x + 64, cy + 5); g.fill(); }
      });
    });
    return stop;
  }
});
const LAB_IGNITION = makeIgnitionLab({ low: 3000, high: 10000, maxRpm: 12000, chain: ['Flywheel magnets', 'Stator coil', 'ECU timing', 'Ignition coil', 'Spark plug'] });

/* ======================================================= LAB: COOLING */
/* cfg: { speedLabel, explain, scenarios: [{ v, t, m: [speed, load] }],
          survive: { v, text, short } }  (surviving 20 s in that scenario is a task) */
const makeCoolingLab = cfg => ({
  title: 'Cooling System Lab',
  intro: 'Run the engine in different conditions and keep the coolant out of the red. Airflow, the fan, the thermostat, and the coolant level all matter.',
  tasks: [
    { id: 'thermo', text: 'Watch the <b>thermostat open</b>: warm the engine past 82 °C' },
    { id: cfg.survive.v, text: cfg.survive.text },
    { id: 'low', text: 'With <b>low coolant</b>, see the engine overheat even with the fan on' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, cfg.explain);
    const cv = makeCanvas(L.stage, 760, 380);
    const s = { speed: 0, load: 0.1, fan: false, low: false, T: 25, hist: [], flowPh: 0, trailT: 0, boiled: false, sc: 'idle', steam: [] };
    const ro = readouts([['T', 'Coolant temp'], ['th', 'Thermostat'], ['q', 'Heat from engine'], ['out', 'Heat removed']]);
    const spSl = slider(cfg.speedLabel, 0, cfg.maxSpeed || 100, 1, 0, v => v + ' km/h', v => { s.speed = v; s.sc = 'custom'; });
    const ldSl = slider('Engine load', 0, 100, 1, 10, v => v + '%', v => { s.load = v / 100; s.sc = 'custom'; });
    const fanT = toggle('Radiator fan', false, v => s.fan = v);
    const sc = choice('Scenario', cfg.scenarios.map(x => ({ v: x.v, t: x.t })), cfg.scenarios[0].v, v => {
      const m = cfg.scenarios.find(x => x.v === v).m;
      spSl.set(m[0]); ldSl.set(m[1]); s.sc = v; s.trailT = 0;
    });
    const resetBtn = el(`<button class="btn small ghost" type="button">↺ Cool down / refill</button>`);
    resetBtn.onclick = () => { s.T = 25; s.boiled = false; s.trailT = 0; };
    L.controls.append(sc, spSl, ldSl, fanT, toggle('Low coolant (leak)', false, v => s.low = v), ro, resetBtn);
    const stop = animLoop(dt => {
      const sim = dt * 2;
      const Ta = 25;
      const Q = s.boiled ? 0 : 2 + 18 * s.load;
      const air = s.speed / 60 + (s.fan ? 0.45 : 0) + 0.05;
      let UA = 0.5 * Math.pow(air, 0.8);
      if (s.low) UA *= 0.25;
      const open = clamp((s.T - 78) / 10, 0, 1), f = 0.08 + 0.92 * open;
      const out = UA * f * (s.T - Ta) + 0.02 * (s.T - Ta);
      const Cap = s.low ? 0.75 : 1.5;
      s.T += (Q - out) / Cap * sim;
      const boil = s.low ? 105 : 120;
      if (s.T > boil && !s.boiled) { s.boiled = true; }
      if (s.boiled) s.T = Math.max(Ta, s.T - 2 * sim);
      s.hist.push(s.T); if (s.hist.length > 400) s.hist.shift();
      if (s.T > 82 && open > 0.3) ctx.complete('thermo');
      if (s.sc === cfg.survive.v && !s.boiled) { s.trailT += dt; if (s.trailT >= 20) ctx.complete(cfg.survive.v); } else if (s.boiled) s.trailT = 0;
      if (s.low && s.fan && (s.T > 103 || s.boiled)) ctx.complete('low');
      ro.set('T', s.boiled ? 'BOILED OVER' : s.T.toFixed(0) + ' °C');
      ro.set('th', open < 0.02 ? 'closed' : open > 0.98 ? 'fully open' : `${Math.round(open * 100)}% open`);
      ro.set('q', Q.toFixed(1) + ' kW');
      ro.set('out', out.toFixed(1) + ' kW');
      s.flowPh += dt * (0.3 + 2 * f);

      const g = cv.g; gridBg(g, cv.w, cv.h);
      // loop diagram
      const ex = 70, ey = 70, rx = 380, ry = 60;
      const hot = clamp((s.T - 25) / 100, 0, 1);
      const coolCol = `rgb(${Math.round(60 + 195 * hot)},${Math.round(160 - 90 * hot)},${Math.round(250 - 200 * hot)})`;
      g.fillStyle = '#4b5563'; roundRect(g, ex, ey, 150, 150, 12); g.fill();
      label(g, 'ENGINE', ex + 75, ey + 20, C.text, 13, 'center', 700);
      const glow = s.load * (s.boiled ? 0 : 1);
      g.fillStyle = `rgba(251,146,60,${0.2 + glow * 0.6})`; roundRect(g, ex + 35, ey + 40, 80, 80, 8); g.fill();
      label(g, 'combustion heat', ex + 75, ey + 80, '#0b1220', 11, 'center', 700);
      g.fillStyle = '#374151'; roundRect(g, rx, ry, 120, 170, 6); g.fill();
      g.strokeStyle = '#6b7280'; for (let x = rx + 10; x < rx + 115; x += 9) { g.beginPath(); g.moveTo(x, ry + 8); g.lineTo(x, ry + 162); g.stroke(); }
      label(g, 'RADIATOR', rx + 60, ry - 12, C.text, 13, 'center', 700);
      // pipes
      const pipe = (pts) => { g.strokeStyle = coolCol; g.lineWidth = 10; g.lineJoin = 'round'; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); };
      pipe([[ex + 150, ey + 30], [rx, ry + 20]]);
      pipe([[rx, ry + 150], [ex + 150, ey + 130]]);
      g.setLineDash([6, 10]); g.lineDashOffset = -s.flowPh * 30 * (open > 0.02 ? 1 : 0.1); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(ex + 150, ey + 30); g.lineTo(rx, ry + 20); g.stroke();
      g.beginPath(); g.moveTo(rx, ry + 150); g.lineTo(ex + 150, ey + 130); g.stroke(); g.setLineDash([]);
      // thermostat
      const tx = (ex + 150 + rx) / 2, ty = (ey + 30 + ry + 20) / 2;
      g.fillStyle = open > 0.02 ? C.green : C.red; g.beginPath(); g.arc(tx, ty, 13, 0, 7); g.fill();
      label(g, open > 0.02 ? 'thermostat open' : 'thermostat closed', tx, ty - 24, C.dim, 11);
      label(g, 'water pump', (ex + 150 + rx) / 2, ey + 156, C.dim, 11);
      // airflow arrows
      const af = air;
      for (let i = 0; i < 6; i++) {
        const y = ry + 20 + i * 26, ph = (s.flowPh * af * 2 + i * 0.37) % 1;
        g.strokeStyle = `rgba(147,197,253,${clamp(af, 0.1, 1) * 0.8})`; g.lineWidth = 2;
        const x = rx + 140 + ph * 80; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 18, y); g.stroke();
      }
      label(g, s.fan ? 'airflow (+fan)' : 'airflow', rx + 190, ry + 186, C.blue, 11);
      // steam
      if (s.boiled || s.T > (s.low ? 100 : 115)) if (Math.random() < 0.4) s.steam.push({ x: rx + 60, y: ry, r: 6, a: 0.8 });
      s.steam = s.steam.filter(k => { k.y -= 40 * dt; k.r += 15 * dt; k.a -= 0.5 * dt; return k.a > 0; });
      s.steam.forEach(k => { g.fillStyle = `rgba(230,230,230,${k.a})`; g.beginPath(); g.arc(k.x + Math.sin(k.y / 10) * 6, k.y, k.r, 0, 7); g.fill(); });
      // gauge
      const gx = 660, gy = 140, gr = 70;
      const A = v => Math.PI * 0.75 + clamp((v - 20) / 110, 0, 1) * Math.PI * 1.5;
      const z = (a0, a1, col) => { g.strokeStyle = col; g.lineWidth = 12; g.beginPath(); g.arc(gx, gy, gr, A(a0), A(a1)); g.stroke(); };
      z(20, 75, '#3b82f6'); z(75, 100, C.green); z(100, boil, C.amber); z(boil, 130, C.red);
      g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(gx, gy); const na = A(s.T); g.lineTo(gx + Math.cos(na) * (gr - 6), gy + Math.sin(na) * (gr - 6)); g.stroke();
      label(g, s.T.toFixed(0) + '°C', gx, gy + 30, C.text, 18, 'center', 700);
      label(g, `boils at ${boil}°C`, gx, gy + 52, C.dim, 11);
      // history
      const hx = 40, hy = 260, hw = 680, hh = 100;
      g.fillStyle = 'rgba(10,16,24,.85)'; roundRect(g, hx, hy, hw, hh, 8); g.fill();
      const HY = v => hy + hh - 6 - clamp((v - 20) / 110, 0, 1) * (hh - 12);
      g.strokeStyle = C.red; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(hx, HY(boil)); g.lineTo(hx + hw, HY(boil)); g.stroke(); g.setLineDash([]);
      g.strokeStyle = C.green; g.setLineDash([2, 4]); g.beginPath(); g.moveTo(hx, HY(80)); g.lineTo(hx + hw, HY(80)); g.stroke(); g.setLineDash([]);
      label(g, 'thermostat opens', hx + hw - 6, HY(80) + 10, C.green, 10, 'right');
      g.strokeStyle = C.amber; g.lineWidth = 2; g.beginPath();
      s.hist.forEach((v, i) => { const x = hx + i / 400 * hw; i ? g.lineTo(x, HY(v)) : g.moveTo(x, HY(v)); }); g.stroke();
      if (s.sc === cfg.survive.v && !s.boiled) label(g, `${cfg.survive.short}: ${s.trailT.toFixed(0)} / 20 s`, hx + 10, hy + 14, C.text, 12, 'left', 700);
      if (s.boiled) label(g, 'BOILED OVER! Coolant is venting as steam. Cool down and refill to try again.', cv.w / 2, hy - 14, C.red, 14, 'center', 700);
    });
    return stop;
  }
});
const LAB_COOLING = makeCoolingLab({
  speedLabel: 'Riding speed',
  explain: `<p>Heat in comes from engine <b>load</b>. Heat out depends on <b>airflow</b> through the radiators (riding speed plus the fan) and on how much coolant the thermostat lets through.</p>
      <p>The 1.1-bar cap lets coolant reach about 120 °C before it boils. With low coolant there's less to soak up heat and less flowing through the radiator.</p>`,
  scenarios: [{ v: 'idle', t: 'Idle warm-up', m: [0, 10] }, { v: 'fire', t: 'Fast fire road', m: [70, 55] }, { v: 'trail', t: 'Tight technical trail', m: [6, 75] }],
  survive: { v: 'trail', text: 'Survive <b>20 seconds</b> on the <b>tight technical trail</b> without boiling over', short: 'Trail time' }
});

/* ==================================================== LAB: DRIVETRAIN */
/* cfg: { P (Drivetrain params), explain, startText, clutchLabel, hPattern,
          shaftLabels: [input, output], final: 'chain' | 'diff', tach: { max, band } } */
const makeDrivetrainLab = cfg => ({
  title: 'Clutch & Gearbox Lab',
  intro: 'A see-through drivetrain on a flat road. Start the engine, use the clutch to pull away, and work up through the gears.',
  tasks: [
    { id: 'start', text: cfg.startText },
    { id: 'pull', text: 'Pull away in <b>1st gear</b> without stalling (reach 10 km/h)' },
    { id: 'third', text: 'Shift up to <b>3rd</b> and reach <b>50 km/h</b>' },
    { id: 'stall', text: '<b>Stall it on purpose</b>: stopped in 1st, let the clutch out with no throttle' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, cfg.explain);
    const cv = makeCanvas(L.stage, 780, 400);
    const BP = cfg.P, NG = BP.ratios.length;
    const d = new Drivetrain(BP);
    const s = { th: 0, cl: 0, brake: false, a: { crank: 0, basket: 0, counter: 0, wheel: 0 }, msg: '', msgT: 0 };
    const startBtn = el(`<button class="btn" type="button">🔑 Start</button>`);
    const killBtn = el(`<button class="btn ghost" type="button">Kill</button>`);
    const dn = el(`<button class="btn ghost" type="button">▼ Shift down</button>`);
    const up = el(`<button class="btn ghost" type="button">▲ Shift up</button>`);
    const brk = el(`<button class="btn ghost" type="button">Hold brake</button>`);
    startBtn.onclick = () => d.start(s.cl);
    killBtn.onclick = () => d.kill();
    dn.onclick = () => d.shift(-1);
    up.onclick = () => d.shift(1);
    ['pointerdown'].forEach(e => brk.addEventListener(e, () => s.brake = true));
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(e => brk.addEventListener(e, () => s.brake = false));
    const thSl = slider('Throttle', 0, 100, 1, 0, v => v + '%', v => s.th = v / 100);
    const clSl = slider(cfg.clutchLabel, 0, 100, 1, 0, v => v + '%', v => s.cl = v / 100);
    const ro = readouts([['rpm', 'Engine'], ['gear', 'Gear'], ['cl', 'Clutch'], ['spd', 'Road speed'], ['ov', 'Overall ratio']]);
    L.controls.append(el(`<div class="btnrow"></div>`), el(`<div class="btnrow"></div>`), thSl, clSl, ro);
    L.controls.children[0].append(startBtn, killBtn, brk);
    if (cfg.hPattern) {
      // An H-pattern box: pick any gear directly with the lever.
      const gl = el(`<div class="seg gearlever"></div>`);
      BP.gearOrder.forEach(gr => {
        const b = el(`<button type="button" class="seg-b">${gr === 0 ? 'N' : gr}</button>`);
        b.onclick = () => d.select(gr);
        gl.appendChild(b);
      });
      L.controls.children[1].append(gl);
      ro.gl = gl;
    } else L.controls.children[1].append(dn, up);
    let armed = false;
    const stop = animLoop(dt => {
      const sub = 10;
      for (let i = 0; i < sub; i++) {
        // Armed when sitting still in 1st with the clutch in; a stall before
        // the bike gets going (with no real throttle) counts as a clutch dump.
        if (d.gear === 1 && d.v < 0.3 && s.cl > 0.5 && d.running) armed = true;
        if (d.v > 3 || s.th > 0.15 || d.gear !== 1) armed = false;
        const wasR = d.running;
        d.step(dt / sub, { throttle: s.th, clutch: s.cl, brake: s.brake ? 1 : 0, slope: 0, crr: 0.03 });
        if (wasR && !d.running && armed) { ctx.complete('stall'); armed = false; }
      }
      d.events.splice(0).forEach(e => { s.msg = e.msg; s.msgT = 3.5; s.msgC = e.type === 'stall' || e.type === 'warn' ? C.red : C.green; });
      if (d.running) ctx.complete('start');
      if (d.running && d.gear === 1 && d.kmh >= 10) ctx.complete('pull');
      if (d.running && d.gear === 3 && d.kmh >= 50) ctx.complete('third');
      s.msgT -= dt;
      const eng = clamp((0.85 - s.cl) / 0.7, 0, 1);
      const clState = d.gear === 0 ? 'neutral: nothing to drive' : eng <= 0 ? 'disengaged' : d.slipping ? 'SLIPPING' : 'locked';
      ro.set('rpm', Math.round(d.rpm).toLocaleString() + ' rpm' + (d.running ? '' : ' (off)'));
      ro.set('gear', d.gearLabel);
      if (ro.gl) ro.gl.querySelectorAll('.seg-b').forEach(b => b.classList.toggle('on', b.textContent === d.gearLabel));
      ro.set('cl', clState);
      ro.set('spd', d.kmh.toFixed(1) + ' km/h');
      ro.set('ov', d.gear ? d.ratio().toFixed(1) + ' : 1' : '–');

      // visual angles (slowed down so you can follow them)
      const k = 0.04;
      const wBasket = d.we / BP.primary;
      const wCounter = d.gear ? d.v / BP.wheelR * BP.final : 0;
      s.a.crank += d.we * k * dt; s.a.basket += wBasket * k * dt; s.a.counter += wCounter * k * dt; s.a.wheel += d.v / BP.wheelR * k * dt;

      const g = cv.g; gridBg(g, cv.w, cv.h);
      const cy = 180;
      // engine crank
      g.fillStyle = '#1d2733'; g.beginPath(); g.arc(70, cy, 48, 0, 7); g.fill();
      g.save(); g.translate(70, cy); g.rotate(s.a.crank);
      g.fillStyle = '#64748b'; g.beginPath(); g.arc(0, 0, 40, 0.6, 2.5); g.lineTo(0, 0); g.fill();
      g.fillStyle = '#e2e8f0'; g.beginPath(); g.arc(0, -26, 8, 0, 7); g.fill();
      g.restore();
      label(g, 'CRANKSHAFT', 70, cy - 66, C.text, 11, 'center', 700);
      label(g, Math.round(d.rpm) + ' rpm', 70, cy + 64, d.limiting ? C.red : C.amber, 12, 'center', 700);
      if (BP.primary > 1) {
        drawGear(g, 128, cy - 34, 18, 16, s.a.crank, '#9aa4ae');
        drawGear(g, 190, cy - 34, 46, 40, -s.a.basket, '#c9a53a');
        label(g, `primary drive ${BP.primary}:1`, 160, cy - 96, C.dim, 10);
      } else {
        // Car: the flywheel bolts to the crank and the clutch clamps against it.
        g.strokeStyle = '#94a3b8'; g.lineWidth = 8; g.beginPath(); g.moveTo(118, cy); g.lineTo(250, cy); g.stroke();
        g.beginPath(); g.arc(178, cy, 52, 0, 7); g.fillStyle = '#4b5563'; g.fill();
        g.save(); g.translate(178, cy); g.rotate(s.a.crank); g.fillStyle = '#9aa4ae'; g.fillRect(-4, -52, 8, 18); g.restore();
        label(g, 'FLYWHEEL', 178, cy - 66, C.text, 11, 'center', 700);
      }
      // clutch pack
      const px = 250, gap = 3 + clamp(s.cl, 0, 1) * 6, plates = 7;
      const slipGlow = d.slipping && d.gear ? clamp(Math.abs(d.clutchTorque) / 60, 0.2, 1) : 0;
      for (let i = 0; i < plates; i++) {
        const x = px + i * (6 + gap);
        const fr = i % 2 === 0;
        g.fillStyle = fr ? (slipGlow ? `rgba(251,146,60,${0.5 + slipGlow * 0.5})` : '#8b5a2b') : '#c0c7cf';
        g.fillRect(x, cy - (fr ? 60 : 52), 6, fr ? 120 : 104);
      }
      const pw = plates * (6 + gap);
      g.strokeStyle = '#c9a53a'; g.lineWidth = 3; g.strokeRect(px - 8, cy - 66, pw + 14, 132);
      label(g, 'CLUTCH', px + pw / 2, cy - 82, C.text, 11, 'center', 700);
      label(g, 'friction', px + pw / 2, cy + 80, '#c08457', 10);
      label(g, '+ steel plates', px + pw / 2, cy + 93, '#c0c7cf', 10);
      label(g, s.cl > 0.85 ? 'clutch IN: plates apart' : s.cl > 0.15 ? 'friction zone' : 'springs clamp plates', px + pw / 2, cy + 112, C.dim, 10);
      // gearbox
      const gx0 = 370, mainY = cy - 50, cntY = cy + 50, spacing = 260 / NG;
      g.fillStyle = '#1b2430'; roundRect(g, gx0 - 20, cy - 120, NG * spacing + 30, 240, 10); g.fill();
      g.strokeStyle = '#94a3b8'; g.lineWidth = 6;
      g.beginPath(); g.moveTo(px + pw + 6, mainY); g.lineTo(gx0 + NG * spacing, mainY); g.stroke();
      g.beginPath(); g.moveTo(gx0 - 10, cntY); g.lineTo(gx0 + NG * spacing + 70, cntY); g.stroke();
      label(g, cfg.shaftLabels[0], gx0 - 14, cy + 132, C.dim, 10, 'left');
      label(g, cfg.shaftLabels[1], gx0 + NG * spacing + 6, cy + 132, C.dim, 10, 'right');
      BP.ratios.forEach((R, i) => {
        const x = gx0 + 10 + i * spacing, cd = 100 * Math.min(1, 4.6 / (1 + BP.ratios[0])), gw = Math.min(20, spacing - 10);
        const rm = cd / (1 + R), rc = cd * R / (1 + R);
        const on = d.gear === i + 1;
        g.fillStyle = on ? C.amber : '#4b5563';
        roundRect(g, x, mainY - rm * 0.92, gw, rm * 1.84, 3); g.fill();
        roundRect(g, x, cntY - rc * 0.92, gw, rc * 1.84, 3); g.fill();
        if (on) { g.fillStyle = C.teal; g.fillRect(x + gw + 1, cntY - 14, 5, 28); }
        label(g, String(i + 1), x + gw / 2, cy - 104, on ? C.amber : C.dim, 13, 'center', 700);
        label(g, R.toFixed(2), x + gw / 2, cy + 110, on ? C.amber : C.dim, 10);
      });
      label(g, 'GEARBOX (all pairs always meshed; the dog ring locks one)', gx0 + NG * spacing / 2, cy - 134, C.text, 11, 'center', 700);
      const sx = gx0 + NG * spacing + 70, wx = 700;
      g.beginPath(); g.arc(wx, cntY, 70, 0, 7); g.strokeStyle = '#17191c'; g.lineWidth = 14; g.stroke();
      if (cfg.final === 'chain') {
        drawGear(g, sx, cntY, 14, 13, s.a.counter, '#9aa4ae');
        g.strokeStyle = '#6b7280'; g.lineWidth = 3; g.setLineDash([5, 3]); g.lineDashOffset = -s.a.counter * 14;
        g.beginPath(); g.moveTo(sx, cntY - 14); g.lineTo(wx, cntY - 44); g.stroke();
        g.beginPath(); g.moveTo(wx, cntY + 44); g.lineTo(sx, cntY + 14); g.stroke(); g.setLineDash([]);
        drawGear(g, wx, cntY, 42, 48, s.a.wheel, COL.orange);
        label(g, `final drive ${BP.rearTeeth}/${BP.frontTeeth}`, (sx + wx) / 2, cntY + 64, C.dim, 10);
      } else {
        // Propshaft to the differential's pinion, which turns the ring gear.
        g.strokeStyle = '#94a3b8'; g.lineWidth = 8; g.beginPath(); g.moveTo(sx - 70, cntY); g.lineTo(wx - 50, cntY); g.stroke();
        for (let i = 0; i < 4; i++) { const ph = ((s.a.counter * 0.5 + i / 4) % 1); g.fillStyle = '#e2e8f0'; g.fillRect(sx - 70 + ph * (wx - 50 - sx + 70), cntY - 5, 3, 10); }
        drawGear(g, wx - 42, cntY, 10, 9, s.a.counter, '#9aa4ae');
        drawGear(g, wx, cntY, 34, 37, s.a.wheel, COL.orange);
        label(g, 'propshaft', (sx + wx) / 2 - 30, cntY - 14, C.dim, 10);
        label(g, `diff: ring & pinion ${BP.final}:1`, (sx + wx) / 2, cntY + 64, C.dim, 10);
      }
      label(g, 'REAR WHEEL', wx, cntY - 92, C.text, 11, 'center', 700);
      label(g, d.kmh.toFixed(0) + ' km/h', wx, cntY + 92, C.amber, 14, 'center', 700);
      // tach bar
      const tx = 30, ty = 360, tw = 720, TM = cfg.tach.max, [blo, bhi] = cfg.tach.band;
      g.fillStyle = '#1b2733'; roundRect(g, tx, ty, tw, 14, 7); g.fill();
      const rf = clamp(d.rpm / TM, 0, 1);
      g.fillStyle = d.rpm > BP.limiter - 1000 ? C.red : d.rpm > blo ? C.green : C.amber; roundRect(g, tx, ty, tw * rf, 14, 7); g.fill();
      g.fillStyle = 'rgba(74,222,128,.25)'; g.fillRect(tx + tw * blo / TM, ty - 4, tw * (bhi - blo) / TM, 4);
      label(g, 'power band', tx + tw * (blo + bhi) / 2 / TM, ty - 12, C.green, 10);
      if (s.msgT > 0) { g.fillStyle = 'rgba(10,16,24,.92)'; roundRect(g, 20, 8, cv.w - 40, 30, 8); g.fill(); label(g, s.msg, cv.w / 2, 23, s.msgC, 13, 'center', 700); }
    });
    return stop;
  }
});
const LAB_DRIVETRAIN = makeDrivetrainLab({
  P: BIKE, final: 'chain', hPattern: false, tach: { max: 13000, band: [6000, 11000] },
  startText: '<b>Start</b> the engine (it only cranks in neutral or with the clutch pulled in)',
  clutchLabel: 'Clutch lever (0 = out, 100 = pulled in)',
  shaftLabels: ['mainshaft (from clutch)', 'countershaft (output)'],
  explain: `<p><b>Pulling away:</b> clutch in → 1st gear → add some throttle (30–40%) → slide the clutch out slowly through the <b>friction zone</b>.</p>
      <p>Watch the plates: when they're <span style="color:#fb923c">glowing</span>, they're slipping, and the speed difference between them is turning into heat.</p>
      <p>The gearbox pattern is <b>1–N–2–3–4–5</b>.</p>`
});

var LABS = { gears: LAB_GEARS, chassis: LAB_CHASSIS, fourstroke: LAB_FOURSTROKE, mixture: LAB_MIXTURE, ignition: LAB_IGNITION, cooling: LAB_COOLING, drivetrain: LAB_DRIVETRAIN };
