/* The final ride/drive: a side-scrolling course driven by the Drivetrain model,
   rendered with the machine the player assembled.

   mountRide(root, opts) where opts (from GAME.ride) provides:
     physics   Drivetrain parameters (BIKE or CAR)
     track     { height(x), edge(x), crr(x), signs, finish, box, end, startX,
                 ground, decor(g, view), rules?: { stops, zones } }
     vehicle   { bodyIds, rear: [svgX, svgY], wheelbaseSvg, wheelbase (m),
                 wheels: [{ id, cx, cy, r }], noseM, exhaust: [svgX, svgY],
                 drawBack(g), drawFront(g) }  (drawing in svg units, rear hub at 0,0)
     words     { verb, startMsg, clutchIn, firstGear, neutralHint, keys }
     hud       { maxRpm, band: [lo, hi] }, cylinders, lugRpm, directGears
     onFinish(result) */

function svgImg(inner, vb, w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}">${inner}</svg>`;
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  return img;
}

/* Rolling profile from [x, y] control points, eased between points. */
function profile(pts) {
  return x => {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const t = (x - x0) / (x1 - x0), e = 0.5 * t + 0.5 * (1 - Math.cos(t * Math.PI)) / 2;
        return y0 + (y1 - y0) * e;
      }
    }
    return pts[pts.length - 1][1];
  };
}

function mountRide(root, opts) {
  const T = opts.track, V = opts.vehicle, Wd = opts.words, P = opts.physics;
  root.innerHTML = `
    <div class="ride">
      <canvas class="ride-cv"></canvas>
      <div class="ride-touch">
        <div class="tgroup">
          <button data-k="clutch">CLUTCH</button>
          <button data-k="down">▼ Q</button>
          <button data-k="up">▲ E</button>
        </div>
        <div class="tgroup">
          <button data-k="start">START</button>
          <button data-k="brake">BRAKE</button>
          <button data-k="throttle" class="big">${Wd.throttleBtn || 'THROTTLE'}</button>
        </div>
      </div>
      <div class="ride-bar">
        <button class="btn small ghost" data-act="restart">↺ Restart</button>
        <button class="btn small ghost" data-act="sound">🔊 Sound on</button>
        <span class="ride-keys">${Wd.keys}</span>
      </div>
    </div>`;
  const cv = root.querySelector('.ride-cv');
  const g = cv.getContext('2d');
  let W = 960, H = 480;
  function resize() {
    const r = cv.getBoundingClientRect();
    W = Math.max(300, r.width); H = Math.max(300, Math.min(560, W * 0.52));
    cv.style.height = H + 'px';
    cv.width = W * DPR; cv.height = H * DPR; g.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const WB = V.wheelbase, SVGM = WB / V.wheelbaseSvg;
  const imgBody = svgImg(sceneLayers(V.bodyIds), '0 0 1000 600', 2000, 1200);
  const wheels = V.wheels.map(w => ({
    ...w,
    img: svgImg(partMarkup(w.id), `${w.cx - w.r} ${w.cy - w.r} ${2 * w.r} ${2 * w.r}`, 4 * w.r, 4 * w.r),
    spin: P.wheelR / (w.r * SVGM)
  }));

  let d, s;
  function reset() {
    d = new Drivetrain(P);
    s = { x: T.startX || 4, t: 0, started: false, finished: false, finishT: 0, done: false, limiterT: 0, maxHeat: 0,
      keys: {}, throttle: 0, clutch: 0, brake: 0, msg: Wd.startMsg, msgT: 999, msgC: C.amber,
      hintCD: 0, camY: 0, penalties: [], stopMin: {}, flash: 0 };
  }
  reset();
  window.__ride = { get d() { return d; }, get s() { return s; } };

  /* ---- audio ---- */
  let audio = null, soundOn = true;
  function initAudio() {
    if (audio || !soundOn) return;
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const o1 = ac.createOscillator(), o2 = ac.createOscillator(), f = ac.createBiquadFilter(), gn = ac.createGain();
      o1.type = 'sawtooth'; o2.type = 'square'; f.type = 'lowpass'; f.frequency.value = 400; gn.gain.value = 0;
      o1.connect(f); o2.connect(f); f.connect(gn); gn.connect(ac.destination); o1.start(); o2.start();
      audio = { ac, o1, o2, f, gn };
    } catch (e) { audio = null; }
  }
  function updAudio() {
    if (!audio) return;
    // A four-stroke fires each cylinder once every two revolutions.
    const fire = d.rpm / 120 * (opts.cylinders || 1), t = audio.ac.currentTime;
    audio.o1.frequency.setTargetAtTime(Math.max(20, fire * 2), t, 0.02);
    audio.o2.frequency.setTargetAtTime(Math.max(10, fire), t, 0.02);
    audio.f.frequency.setTargetAtTime(250 + s.throttle * 1400 + d.rpm * 0.05, t, 0.05);
    audio.gn.gain.setTargetAtTime(soundOn && d.running ? 0.04 + s.throttle * 0.07 : 0, t, 0.05);
  }

  /* ---- input ---- */
  const KEYMAP = { KeyW: 'throttle', ArrowUp: 'throttle', KeyS: 'brake', ArrowDown: 'brake', Space: 'clutch', ShiftLeft: 'clutch' };
  function press(k, on) {
    initAudio();
    if (k === 'up' && on) { if (d.shift(1)) hintGear(); return; }
    if (k === 'down' && on) { if (d.shift(-1)) hintGear(); return; }
    if (k === 'start' && on) { if (!s.done) { d.start(s.clutch); s.started = true; } return; }
    if (k === 'kill' && on) { d.kill(); return; }
    if (k.startsWith('gear') && on) { if (d.select(+k.slice(4))) hintGear(); return; }
    s.keys[k] = on;
  }
  function hintGear() {
    if (d.gear === 0 && Wd.neutralHint) say(Wd.neutralHint, C.dim, 1.2);
    if (d.gear > 0 && s.clutch < 0.5 && d.running && opts.directGears) say('Crunch! Press the clutch (Space) before changing gear.', C.amber, 1.5);
  }
  const kd = e => {
    if (e.repeat && !KEYMAP[e.code]) return;
    if (KEYMAP[e.code]) { e.preventDefault(); press(KEYMAP[e.code], true); }
    else if (e.code === 'KeyE') press('up', true);
    else if (e.code === 'KeyQ') press('down', true);
    else if (e.code === 'Enter') { e.preventDefault(); press('start', true); }
    else if (e.code === 'KeyK') press('kill', true);
    else if (opts.directGears && /^Digit[0-9]$/.test(e.code)) press('gear' + e.code.slice(5), true);
    else if (opts.directGears && e.code === 'KeyN') press('gear0', true);
  };
  const ku = e => { if (KEYMAP[e.code]) { e.preventDefault(); press(KEYMAP[e.code], false); } };
  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);
  root.querySelectorAll('.ride-touch button').forEach(b => {
    const k = b.dataset.k;
    b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); b.classList.add('on'); press(k, true); });
    const up = () => { b.classList.remove('on'); press(k, false); };
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
  });
  root.querySelector('[data-act="restart"]').onclick = () => { reset(); };
  const sb = root.querySelector('[data-act="sound"]');
  sb.onclick = () => { soundOn = !soundOn; sb.textContent = soundOn ? '🔊 Sound on' : '🔇 Sound off'; if (soundOn) initAudio(); updAudio(); };

  function say(m, c = C.text, t = 2.5) { s.msg = m; s.msgC = c; s.msgT = t; }
  const slopeAt = x => Math.atan2(T.height(x + WB) - T.height(x), WB);

  /* ---- rules: stop lines and speed cameras ---- */
  function checkRules(prevNose, nose) {
    const R = T.rules; if (!R) return;
    (R.stops || []).forEach((st, i) => {
      if (nose > st.x - 8 && nose <= st.x + 0.5) s.stopMin[i] = Math.min(s.stopMin[i] ?? 99, Math.abs(d.v));
      if (prevNose <= st.x + 0.5 && nose > st.x + 0.5) {
        if ((s.stopMin[i] ?? 99) > 0.3) { s.penalties.push(`Didn't stop at the ${st.label}`); say(`Penalty: you didn't come to a full stop at the ${st.label}.`, C.red, 3.5); }
        else say(st.ok || 'Good stop.', C.green, 2);
      }
    });
    (R.zones || []).forEach(z => {
      if (prevNose <= z.camera && nose > z.camera) {
        s.flash = 1;
        const k = Math.abs(d.kmh);
        if (k > z.limit + 0.5) { s.penalties.push(`Speed camera: ${Math.round(k)} km/h in a ${z.limit} zone`); say(`FLASH! ${Math.round(k)} km/h in a ${z.limit} zone.`, C.red, 3.5); }
        else say(`Camera: ${Math.round(k)} km/h. Under the limit.`, C.green, 2);
      }
    });
  }

  /* ---- loop ---- */
  const stop = animLoop(dt => {
    s.throttle = clamp(s.throttle + (s.keys.throttle ? 3.5 : -7) * dt, 0, 1);
    s.clutch = clamp(s.clutch + (s.keys.clutch ? 8 : -1.3) * dt, 0, 1);
    s.brake = clamp(s.brake + (s.keys.brake ? 6 : -10) * dt, 0, 1);
    if (s.done) s.throttle = 0;

    const sub = 12, h = dt / sub, prevNose = s.x + V.noseM;
    for (let i = 0; i < sub; i++) {
      const slope = slopeAt(s.x);
      d.step(h, { throttle: s.throttle, clutch: s.clutch, brake: s.brake, slope, crr: T.crr(s.x) + 0.0015 * Math.abs(d.v) });
      s.x += d.v * Math.cos(slope) * h;
      if (s.x < 0) { s.x = 0; d.v = Math.max(0, d.v); }
      if (s.x > T.end) { s.x = T.end; if (d.v > 0) { d.v = 0; say(T.endMsg, C.amber); } }
    }
    if (!s.finished) checkRules(prevNose, s.x + V.noseM);
    if (s.started && !s.finished) s.t += dt;
    if (d.limiting) s.limiterT += dt;
    s.maxHeat = Math.max(s.maxHeat, d.clutchHeat);
    s.flash = Math.max(0, s.flash - dt * 3);
    d.events.splice(0).forEach(e => say(e.msg, e.type === 'stall' || e.type === 'warn' ? C.red : C.green, e.type === 'stall' ? 4 : 2.5));

    // coaching hints
    s.hintCD -= dt;
    if (s.hintCD <= 0 && s.msgT <= 0) {
      const slope = slopeAt(s.x);
      if (!d.running && s.started) say(`Engine off. ${Wd.clutchIn} (Space) or select N, then press Enter.`, C.amber);
      else if (d.running && d.gear === 0 && d.v < 0.5) say(`In neutral. ${Wd.firstGear}`, C.amber);
      else if (d.running && d.gear === 1 && d.v < 0.5 && s.clutch > 0.8) say('Now add throttle (W) and release the clutch (Space) smoothly.', C.amber);
      else if (d.limiting) say('Bouncing off the rev limiter. Shift up!', C.amber);
      else if (d.running && d.gear > 1 && d.rpm < opts.lugRpm && slope > 0.08 && s.throttle > 0.5) say('Lugging! The engine is below its power band. Shift down.', C.amber);
      else if (d.clutchHeat > 60) say('The clutch is getting hot from slipping. Let it out fully!', C.red);
      else { s.hintCD = 0.5; }
      if (s.msgT > 0) s.hintCD = 4;
    }
    s.msgT -= dt;

    // finish
    if (!s.finished && s.x + V.noseM >= T.finish) { s.finished = true; s.finishT = s.t; s.finishStalls = d.stalls; say(`Finish line! ${s.finishT.toFixed(1)} s. Now stop in the box.`, C.green, 3); }
    if (s.finished && !s.done && Math.abs(d.v) < 0.15 && (s.x + V.noseM > T.finish + 2 || s.x >= T.end)) {
      s.done = true;
      const nose = s.x + V.noseM, box = nose >= T.box[0] && nose <= T.box[1];
      setTimeout(() => opts.onFinish({ time: s.finishT, stalls: s.finishStalls, limiter: s.limiterT, heat: s.maxHeat, box, penalties: s.penalties.slice() }), 700);
    }
    updAudio();
    draw();
  });

  function draw() {
    const ppm = clamp(W / (WB * 7.5), 48, 100) * (opts.zoom || 1);
    const camX = s.x + WB / 2 - (W * 0.3) / ppm;
    const yB = (T.height(s.x) + T.height(s.x + 4)) / 2;
    s.camY = lerp(s.camY, yB, 0.2);
    const SX = x => (x - camX) * ppm, SY = y => H * 0.62 - (y - s.camY) * ppm;
    const view = { SX, SY, camX, ppm, W, H, x0: camX - 4, x1: camX + W / ppm + 4 };
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0d2236'); sky.addColorStop(1, '#2a4c62');
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    [[0.15, '#1b3446', 60, 0.013], [0.35, '#203d4a', 35, 0.03]].forEach(([par, col, amp, fr]) => {
      g.fillStyle = col; g.beginPath(); g.moveTo(0, H);
      for (let px = 0; px <= W; px += 8) { const wx = px / ppm + camX * par; g.lineTo(px, H * 0.42 - amp * (0.6 + 0.4 * Math.sin(wx * fr * 7) * Math.cos(wx * fr * 3.1))); }
      g.lineTo(W, H); g.fill();
    });
    // ground and its surface edge, coloured per surface
    g.fillStyle = T.ground; g.beginPath(); g.moveTo(0, H);
    for (let px = -4; px <= W + 4; px += 4) g.lineTo(px, SY(T.height(camX + px / ppm)));
    g.lineTo(W, H); g.fill();
    g.lineWidth = 5; g.lineCap = 'round';
    let prev = null;
    for (let px = -4; px <= W + 4; px += 4) {
      const wx = camX + px / ppm, col = T.edge(wx);
      if (col !== prev) { if (prev !== null) { g.lineTo(px, SY(T.height(wx))); g.stroke(); } g.strokeStyle = col; g.beginPath(); g.moveTo(px, SY(T.height(wx))); prev = col; }
      else g.lineTo(px, SY(T.height(wx)));
    }
    g.stroke();
    if (T.decor) T.decor(g, view);
    drawRules(view);
    T.signs.forEach(sg => {
      if (sg.x < view.x0 || sg.x > view.x1) return;
      const x = SX(sg.x), y = SY(T.height(sg.x)), post = 1.6 * ppm;
      g.fillStyle = '#5b4632'; g.fillRect(x - 3, y - post, 6, post);
      const bw = Math.max(150, ppm * 1.9), bh = 44;
      g.fillStyle = '#f5c518'; roundRect(g, x - bw / 2, y - post - bh, bw, bh, 6); g.fill();
      label(g, sg.t[0], x, y - post - bh + 15, '#111', 14, 'center', 800);
      label(g, sg.t[1], x, y - post - bh + 32, '#333', 11, 'center', 600);
    });
    const fx = SX(T.finish), fy = SY(T.height(T.finish));
    for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? '#fff' : '#111'; g.fillRect(fx - 4, fy - 2.6 * ppm + i * 0.26 * ppm, 8, 0.26 * ppm); }
    g.fillStyle = 'rgba(74,222,128,.25)'; g.fillRect(SX(T.box[0]), fy - 6, (T.box[1] - T.box[0]) * ppm, 12);
    label(g, 'STOP BOX', SX((T.box[0] + T.box[1]) / 2), fy + 18, C.green, 12, 'center', 700);
    g.fillStyle = '#c9a35a'; for (let i = 0; i < 3; i++) roundRect(g, SX(T.end + V.noseM + 0.2) + i * 4, fy - (i + 1) * 0.45 * ppm, 0.9 * ppm, 0.45 * ppm, 4), g.fill();

    // vehicle: rear hub at the origin, svg units
    const y0 = T.height(s.x), pitch = slopeAt(s.x), k = ppm * SVGM;
    g.save();
    g.translate(SX(s.x), SY(y0 + P.wheelR));
    g.rotate(-pitch);
    g.scale(k, k);
    wheels.forEach(w => {
      if (!w.img.complete) return;
      g.save(); g.translate(w.cx - V.rear[0], w.cy - V.rear[1]); g.rotate(d.wheelAngle * w.spin);
      g.drawImage(w.img, -w.r, -w.r, 2 * w.r, 2 * w.r); g.restore();
    });
    if (V.drawBack) V.drawBack(g);
    if (imgBody.complete) g.drawImage(imgBody, -V.rear[0], -V.rear[1], 1000, 600);
    if (V.drawFront) V.drawFront(g);
    if (d.running && s.throttle > 0.3 && Math.random() < 0.4) {
      const ex = V.exhaust[0] - V.rear[0], ey = V.exhaust[1] - V.rear[1];
      g.fillStyle = 'rgba(200,200,200,.25)'; g.beginPath(); g.arc(ex - Math.random() * 20, ey + Math.random() * 10, 10 + Math.random() * 10, 0, 7); g.fill();
    }
    g.restore();
    if (s.flash > 0) { g.fillStyle = `rgba(255,255,255,${s.flash * 0.6})`; g.fillRect(0, 0, W, H); }
    drawHUD();
  }

  function drawRules(v) {
    const R = T.rules; if (!R) return;
    const { SX, SY, ppm } = v;
    (R.stops || []).forEach(st => {
      if (st.x < v.x0 || st.x > v.x1) return;
      const x = SX(st.x), y = SY(T.height(st.x));
      g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y - 4); g.lineTo(x, y + 8); g.stroke();
      g.fillStyle = '#9aa4ae'; g.fillRect(x + 6, y - 2.2 * ppm, 4, 2.2 * ppm);
      const r = 0.38 * ppm, cy = y - 2.2 * ppm;
      g.fillStyle = '#c81e1e'; g.beginPath();
      for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; g.lineTo(x + 8 + Math.cos(a) * r, cy + Math.sin(a) * r); }
      g.closePath(); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke();
      label(g, 'STOP', x + 8, cy, '#fff', Math.max(9, r * 0.6), 'center', 800);
    });
    (R.zones || []).forEach(z => {
      [[z.from, String(z.limit)], [z.to, 'END']].forEach(([zx, t]) => {
        if (zx < v.x0 || zx > v.x1) return;
        const x = SX(zx), y = SY(T.height(zx)), r = 0.4 * ppm, cy = y - 2.3 * ppm;
        g.fillStyle = '#9aa4ae'; g.fillRect(x - 2, cy, 4, 2.3 * ppm);
        g.fillStyle = '#fff'; g.beginPath(); g.arc(x, cy, r, 0, 7); g.fill();
        g.strokeStyle = t === 'END' ? '#111' : '#c81e1e'; g.lineWidth = Math.max(3, r * 0.22); g.beginPath(); g.arc(x, cy, r * 0.85, 0, 7); g.stroke();
        if (t === 'END') { g.beginPath(); g.moveTo(x - r * 0.6, cy + r * 0.6); g.lineTo(x + r * 0.6, cy - r * 0.6); g.stroke(); }
        else label(g, t, x, cy + 1, '#111', Math.max(10, r * 0.75), 'center', 800);
      });
      if (z.camera > v.x0 && z.camera < v.x1) {
        const x = SX(z.camera), y = SY(T.height(z.camera));
        g.fillStyle = '#6b7280'; g.fillRect(x - 3, y - 2.6 * ppm, 6, 2.6 * ppm);
        g.fillStyle = '#facc15'; roundRect(g, x - 0.35 * ppm, y - 3.1 * ppm, 0.7 * ppm, 0.55 * ppm, 4); g.fill();
        g.fillStyle = '#111'; g.beginPath(); g.arc(x - 0.2 * ppm, y - 2.83 * ppm, 0.12 * ppm, 0, 7); g.fill();
        label(g, 'CAMERA', x, y - 3.3 * ppm, C.dim, 10, 'center', 700);
      }
    });
  }

  function drawHUD() {
    const hk = clamp(W / 720, 0.6, 1), W2 = W / hk, H2 = H / hk;
    const M = opts.hud.maxRpm, [lo, hi] = opts.hud.band;
    g.save(); g.scale(hk, hk);
    g.fillStyle = 'rgba(8,14,22,.82)'; roundRect(g, 10, 10, 300, 132, 12); g.fill();
    const cx = 72, cy = 84, r = 50;
    const A = rpm => Math.PI * 0.8 + clamp(rpm / M, 0, 1) * Math.PI * 1.4;
    g.lineWidth = 8;
    g.strokeStyle = '#263445'; g.beginPath(); g.arc(cx, cy, r, A(0), A(M)); g.stroke();
    g.strokeStyle = 'rgba(74,222,128,.6)'; g.beginPath(); g.arc(cx, cy, r, A(lo), A(hi)); g.stroke();
    g.strokeStyle = C.red; g.beginPath(); g.arc(cx, cy, r, A(P.limiter), A(M)); g.stroke();
    const na = A(d.rpm);
    g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(na) * (r - 6), cy + Math.sin(na) * (r - 6)); g.stroke();
    label(g, d.gearLabel, cx, cy + 4, d.gear ? C.amber : C.green, 30, 'center', 800);
    label(g, Math.round(d.rpm).toLocaleString() + ' rpm', cx, cy + 36, C.dim, 11);
    label(g, d.running ? (d.limiting ? 'LIMITER' : 'RUNNING') : (s.started ? 'ENGINE OFF' : 'READY'), cx, 22, d.running ? C.green : C.red, 11, 'center', 700);
    label(g, Math.round(Math.abs(d.kmh)), 170, 52, C.text, 34, 'center', 800);
    label(g, 'km/h', 170, 76, C.dim, 11);
    const bar = (x, y, wv, v, col, txt) => {
      g.fillStyle = '#1b2733'; roundRect(g, x, y, wv, 9, 4); g.fill();
      if (v > 0.03) { g.fillStyle = col; roundRect(g, x, y, wv * clamp(v, 0, 1), 9, 4); g.fill(); }
      label(g, txt, x - 4, y + 5, C.dim, 10, 'right');
    };
    bar(170, 94, 120, s.throttle, C.green, Wd.throttleBar || 'throttle');
    bar(170, 108, 120, s.clutch, d.slipping && d.gear ? C.orange : C.blue, 'clutch in');
    bar(170, 122, 120, d.clutchHeat / 100, d.clutchHeat > 60 ? C.red : C.amber, 'clutch heat');
    g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(170 + 120 * 0.15, 92, 120 * 0.7, 2);
    label(g, d.slipping && d.gear ? 'SLIPPING' : '', 260, 52, C.orange, 11, 'center', 700);
    if (s.brake > 0.05) label(g, 'BRAKE', 260, 70, C.red, 11, 'center', 700);
    const px = W2 - 230;
    g.fillStyle = 'rgba(8,14,22,.82)'; roundRect(g, px, 10, 220, 58, 12); g.fill();
    label(g, `Time ${(s.finished ? s.finishT : s.t).toFixed(1)} s`, px + 12, 28, C.text, 13, 'left', 700);
    const stl = s.finished ? s.finishStalls : d.stalls;
    const right = T.rules ? `Stalls ${stl} · Penalties ${s.penalties.length}` : `Stalls ${stl}`;
    label(g, right, px + 208, 28, stl || s.penalties.length ? C.red : C.text, 13, 'right', 700);
    g.fillStyle = '#1b2733'; roundRect(g, px + 12, 44, 196, 10, 5); g.fill();
    g.fillStyle = C.teal; roundRect(g, px + 12, 44, 196 * clamp((s.x + V.noseM) / T.finish, 0, 1), 10, 5); g.fill();
    if (s.msgT > 0 && s.msg) {
      g.font = '700 15px Barlow, system-ui, sans-serif';
      const mw = Math.min(W2 - 40, g.measureText(s.msg).width + 40);
      g.fillStyle = 'rgba(8,14,22,.9)'; roundRect(g, W2 / 2 - mw / 2, H2 - 52, mw, 36, 10); g.fill();
      label(g, s.msg, W2 / 2, H2 - 34, s.msgC, 15, 'center', 700);
    }
    g.restore();
  }

  return () => {
    stop();
    window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('resize', resize);
    if (audio) { try { audio.ac.close(); } catch (e) { } }
  };
}
