/* The final ride: a side-scrolling test track driven by the Drivetrain model,
   rendered with the bike the player assembled. */

const TRACK = (() => {
  const pts = [[0, 0], [40, 0], [70, 3], [90, 3], [110, 0], [190, 0], [250, 30], [268, 30], [322, 2], [335, 0],
    [392, 0], [450, 32], [470, 32], [526, 0], [640, 0]];
  function base(x) {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const t = (x - x0) / (x1 - x0), e = 0.5 * t + 0.5 * (1 - Math.cos(t * Math.PI)) / 2;
        return y0 + (y1 - y0) * e;
      }
    }
    return pts[pts.length - 1][1];
  }
  const height = x => {
    let y = base(x);
    if (x > 118 && x < 178) y += 0.5 * (1 - Math.cos(2 * Math.PI * (x - 118) / 6)) * 0.4;
    return y;
  };
  const isMud = x => x > 337 && x < 388;
  const signs = [
    { x: 8, t: ['START', 'Enter = start engine'] },
    { x: 112, t: ['WHOOPS', 'stand up, stay smooth'] },
    { x: 182, t: ['STEEP HILL ↑', 'shift down: 2nd or 3rd'] },
    { x: 266, t: ['DESCENT ↓', 'brake + engine braking'] },
    { x: 333, t: ['MUD', 'steady throttle, keep it moving'] },
    { x: 386, t: ['BIG CLIMB ↑', 'no run-up: 1st or 2nd!'] },
    { x: 538, t: ['FINISH AHEAD', 'stop in the box for a bonus'] }
  ];
  return { height, isMud, signs, finish: 565, box: [577, 593], end: 607 };
})();

function svgImg(inner, vb, w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}">${inner}</svg>`;
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  return img;
}

function mountRide(root, opts) {
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
          <button data-k="throttle" class="big">THROTTLE</button>
        </div>
      </div>
      <div class="ride-bar">
        <button class="btn small ghost" data-act="restart">↺ Restart</button>
        <button class="btn small ghost" data-act="sound">🔊 Sound on</button>
        <span class="ride-keys"><kbd>Enter</kbd> start · <kbd>Space</kbd> clutch · <kbd>W</kbd> throttle · <kbd>S</kbd> brake · <kbd>Q</kbd>/<kbd>E</kbd> shift down/up · <kbd>K</kbd> kill</span>
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

  const bodyIds = DIRT_PARTS.filter(id => id !== 'm_rear_wheel' && id !== 'm_front_wheel');
  const imgBody = svgImg(sceneLayers(bodyIds), '0 0 1000 600', 2000, 1200);
  const imgRW = svgImg(ART.m_rear_wheel[1], '110 273 250 250', 500, 500);
  const imgFW = svgImg(ART.m_front_wheel[1], '635 257 266 266', 532, 532);

  const WB = 1.48, SVGM = WB / 533;
  let d, s;
  function reset() {
    d = new Drivetrain();
    s = { x: 4, t: 0, started: false, finished: false, finishT: 0, done: false, limiterT: 0, maxHeat: 0,
      keys: {}, throttle: 0, clutch: 0, brake: 0, msg: 'Press Enter (or START) to fire up the engine.', msgT: 999, msgC: C.amber,
      hintCD: 0, camY: 0, stopped: false, boxStop: false };
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
    const fire = d.rpm / 120, t = audio.ac.currentTime;
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
    s.keys[k] = on;
  }
  function hintGear() { if (d.gear === 0) say('Neutral (N): it sits between 1st and 2nd', C.dim, 1.2); }
  const kd = e => {
    if (e.repeat && !KEYMAP[e.code]) return;
    if (KEYMAP[e.code]) { e.preventDefault(); press(KEYMAP[e.code], true); }
    else if (e.code === 'KeyE') press('up', true);
    else if (e.code === 'KeyQ') press('down', true);
    else if (e.code === 'Enter') { e.preventDefault(); press('start', true); }
    else if (e.code === 'KeyK') press('kill', true);
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

  /* ---- loop ---- */
  const stop = animLoop(dt => {
    // input ramps
    s.throttle = clamp(s.throttle + (s.keys.throttle ? 3.5 : -7) * dt, 0, 1);
    s.clutch = clamp(s.clutch + (s.keys.clutch ? 8 : -1.3) * dt, 0, 1);
    s.brake = clamp(s.brake + (s.keys.brake ? 6 : -10) * dt, 0, 1);
    if (s.done) { s.throttle = 0; }

    const sub = 12, h = dt / sub;
    for (let i = 0; i < sub; i++) {
      const y0 = TRACK.height(s.x), y1 = TRACK.height(s.x + WB);
      const slope = Math.atan2(y1 - y0, WB);
      d.step(h, { throttle: s.throttle, clutch: s.clutch, brake: s.brake, slope, crr: (TRACK.isMud(s.x) ? 0.16 : 0.045) + 0.0015 * Math.abs(d.v) });
      s.x += d.v * Math.cos(slope) * h;
      if (s.x < 0) { s.x = 0; d.v = Math.max(0, d.v); }
      if (s.x > TRACK.end) { s.x = TRACK.end; if (d.v > 0) { d.v = 0; say('Bump! Into the hay bales.', C.amber); } }
    }
    if (s.started && !s.finished) s.t += dt;
    if (d.limiting) s.limiterT += dt;
    s.maxHeat = Math.max(s.maxHeat, d.clutchHeat);
    d.events.splice(0).forEach(e => say(e.msg, e.type === 'stall' || e.type === 'warn' ? C.red : C.green, e.type === 'stall' ? 4 : 2.5));

    // coaching hints
    s.hintCD -= dt;
    if (s.hintCD <= 0 && s.msgT <= 0) {
      const slope = Math.atan2(TRACK.height(s.x + WB) - TRACK.height(s.x), WB);
      if (!d.running && s.started) { say('Engine off. Pull the clutch (Space) or select N, then press Enter.', C.amber); }
      else if (d.running && d.gear === 0 && d.v < 0.5) say('In neutral. Hold the clutch (Space) and press Q for 1st gear.', C.amber);
      else if (d.running && d.gear === 1 && d.v < 0.5 && s.clutch > 0.8) say('Now add throttle (W) and release the clutch (Space) smoothly.', C.amber);
      else if (d.limiting) say('Bouncing off the rev limiter. Shift up (E)!', C.amber);
      else if (d.running && d.gear > 1 && d.rpm < 3500 && slope > 0.12 && s.throttle > 0.5) say('Lugging! The engine is below its power band. Shift down (Q).', C.amber);
      else if (d.clutchHeat > 60) say('The clutch is getting hot from slipping. Let it out fully!', C.red);
      else { s.hintCD = 0.5; }
      if (s.msgT > 0) s.hintCD = 4;
    }
    s.msgT -= dt;

    // finish
    if (!s.finished && s.x >= TRACK.finish) { s.finished = true; s.finishT = s.t; s.finishStalls = d.stalls; say(`Finish line! ${s.finishT.toFixed(1)} s. Now stop in the box.`, C.green, 3); }
    if (s.finished && !s.done && Math.abs(d.v) < 0.15 && (s.x > TRACK.finish + 2 || s.x >= TRACK.end)) {
      s.done = true;
      const box = s.x >= TRACK.box[0] && s.x <= TRACK.box[1];
      setTimeout(() => opts.onFinish({ time: s.finishT, stalls: s.finishStalls, limiter: s.limiterT, heat: s.maxHeat, box }), 700);
    }
    updAudio();
    draw();
  });

  function draw() {
    const ppm = clamp(W / 11, 48, 100);
    const camX = s.x + 0.74 - (W * 0.3) / ppm;
    const yB = (TRACK.height(s.x) + TRACK.height(s.x + 4)) / 2;
    s.camY = lerp(s.camY, yB, 0.2);
    const SX = x => (x - camX) * ppm, SY = y => H * 0.62 - (y - s.camY) * ppm;
    // sky
    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0d2236'); sky.addColorStop(1, '#2a4c62');
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    // parallax hills
    [[0.15, '#1b3446', 60, 0.013], [0.35, '#203d4a', 35, 0.03]].forEach(([par, col, amp, fr]) => {
      g.fillStyle = col; g.beginPath(); g.moveTo(0, H);
      for (let px = 0; px <= W; px += 8) { const wx = px / ppm + camX * par; g.lineTo(px, H * 0.42 - amp * (0.6 + 0.4 * Math.sin(wx * fr * 7) * Math.cos(wx * fr * 3.1))); }
      g.lineTo(W, H); g.fill();
    });
    // terrain
    g.fillStyle = '#4a3726'; g.beginPath(); g.moveTo(0, H);
    for (let px = -4; px <= W + 4; px += 4) g.lineTo(px, SY(TRACK.height(camX + px / ppm)));
    g.lineTo(W, H); g.fill();
    g.lineWidth = 5; g.lineCap = 'round';
    let prevMud = null;
    for (let px = -4; px <= W + 4; px += 4) {
      const wx = camX + px / ppm, mud = TRACK.isMud(wx);
      if (mud !== prevMud) { if (prevMud !== null) g.stroke(); g.strokeStyle = mud ? '#2d1f14' : '#8a6a3f'; g.beginPath(); g.moveTo(px, SY(TRACK.height(wx))); prevMud = mud; }
      else g.lineTo(px, SY(TRACK.height(wx)));
    }
    g.stroke();
    // mud puddles
    for (let x = 340; x < 387; x += 7) if (x > camX - 2 && x < camX + W / ppm + 2) { g.fillStyle = 'rgba(30,20,12,.8)'; g.beginPath(); g.ellipse(SX(x), SY(TRACK.height(x)) + 2, 0.9 * ppm, 0.08 * ppm, 0, 0, 7); g.fill(); }
    // signs
    TRACK.signs.forEach(sg => {
      if (sg.x < camX - 4 || sg.x > camX + W / ppm + 4) return;
      const x = SX(sg.x), y = SY(TRACK.height(sg.x));
      g.fillStyle = '#5b4632'; g.fillRect(x - 3, y - 1.6 * ppm, 6, 1.6 * ppm);
      const bw = Math.max(150, ppm * 1.9), bh = 44;
      g.fillStyle = '#f5c518'; roundRect(g, x - bw / 2, y - 1.6 * ppm - bh, bw, bh, 6); g.fill();
      label(g, sg.t[0], x, y - 1.6 * ppm - bh + 15, '#111', 14, 'center', 800);
      label(g, sg.t[1], x, y - 1.6 * ppm - bh + 32, '#333', 11, 'center', 600);
    });
    // finish + box
    const fx = SX(TRACK.finish), fy = SY(TRACK.height(TRACK.finish));
    for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? '#fff' : '#111'; g.fillRect(fx - 4, fy - 2.6 * ppm + i * 0.26 * ppm, 8, 0.26 * ppm); }
    g.fillStyle = 'rgba(74,222,128,.25)'; g.fillRect(SX(TRACK.box[0]), fy - 6, (TRACK.box[1] - TRACK.box[0]) * ppm, 12);
    label(g, 'STOP BOX', SX((TRACK.box[0] + TRACK.box[1]) / 2), fy + 18, C.green, 12, 'center', 700);
    g.fillStyle = '#c9a35a'; for (let i = 0; i < 3; i++) roundRect(g, SX(TRACK.end + 0.2) + i * 4, fy - (i + 1) * 0.45 * ppm, 0.9 * ppm, 0.45 * ppm, 4), g.fill();

    // bike
    const y0 = TRACK.height(s.x), y1 = TRACK.height(s.x + WB);
    const pitch = Math.atan2(y1 - y0, WB);
    const k = ppm * SVGM;
    g.save();
    g.translate(SX(s.x), SY(y0 + BIKE.wheelR));
    g.rotate(-pitch);
    g.scale(k, k);
    if (imgRW.complete) { g.save(); g.rotate(d.wheelAngle); g.drawImage(imgRW, -125, -125, 250, 250); g.restore(); }
    if (imgFW.complete) { g.save(); g.translate(533, -8); g.rotate(d.wheelAngle * 0.94); g.drawImage(imgFW, -133, -133, 266, 266); g.restore(); }
    // rider (behind the bodywork is fine for a schematic)
    drawRider(g);
    if (imgBody.complete) g.drawImage(imgBody, -235, -398, 1000, 600);
    drawRiderFront(g);
    // exhaust puffs
    if (d.running && s.throttle > 0.3 && Math.random() < 0.4) { g.fillStyle = 'rgba(200,200,200,.25)'; g.beginPath(); g.arc(-15 + Math.random() * -20, -190 + Math.random() * 10, 10 + Math.random() * 10, 0, 7); g.fill(); }
    g.restore();

    drawHUD();
  }

  function drawRider(g) {
    // legs and torso (drawn before the bike body)
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.strokeStyle = '#1e3a8a'; g.lineWidth = 34;
    g.beginPath(); g.moveTo(448 - 235, 396 - 398); g.lineTo(505 - 235, 300 - 398); g.lineTo(420 - 235, 225 - 398); g.stroke();
    g.strokeStyle = '#f5c518'; g.lineWidth = 46;
    g.beginPath(); g.moveTo(420 - 235, 225 - 398); g.lineTo(480 - 235, 110 - 398); g.stroke();
  }
  function drawRiderFront(g) {
    g.lineCap = 'round';
    g.strokeStyle = '#f5c518'; g.lineWidth = 22;
    g.beginPath(); g.moveTo(488 - 235, 120 - 398); g.lineTo(552 - 235, 150 - 398); g.lineTo(590 - 235, 100 - 398); g.stroke();
    g.fillStyle = '#111'; g.beginPath(); g.arc(493 - 235, 62 - 398, 36, 0, 7); g.fill();
    g.fillStyle = '#f5c518'; g.beginPath(); g.moveTo(493 - 235 + 20, 62 - 398 - 30); g.lineTo(493 - 235 + 62, 62 - 398 - 18); g.lineTo(493 - 235 + 30, 62 - 398 - 10); g.fill();
    g.fillStyle = '#93c5fd'; g.fillRect(493 - 235 + 6, 62 - 398 - 6, 30, 14);
    g.strokeStyle = '#111'; g.lineWidth = 26;
    g.beginPath(); g.moveTo(448 - 235, 392 - 398); g.lineTo(470 - 235, 392 - 398); g.stroke();
  }

  function drawHUD() {
    const hk = clamp(W / 720, 0.6, 1), W2 = W / hk, H2 = H / hk;
    g.save(); g.scale(hk, hk);
    // panel
    g.fillStyle = 'rgba(8,14,22,.82)'; roundRect(g, 10, 10, 300, 132, 12); g.fill();
    // tach
    const cx = 72, cy = 84, r = 50;
    const A = rpm => Math.PI * 0.8 + clamp(rpm / 13000, 0, 1) * Math.PI * 1.4;
    g.lineWidth = 8;
    g.strokeStyle = '#263445'; g.beginPath(); g.arc(cx, cy, r, A(0), A(13000)); g.stroke();
    g.strokeStyle = 'rgba(74,222,128,.6)'; g.beginPath(); g.arc(cx, cy, r, A(6000), A(11000)); g.stroke();
    g.strokeStyle = C.red; g.beginPath(); g.arc(cx, cy, r, A(12000), A(13000)); g.stroke();
    const na = A(d.rpm);
    g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(na) * (r - 6), cy + Math.sin(na) * (r - 6)); g.stroke();
    label(g, d.gearLabel, cx, cy + 4, d.gear ? C.amber : C.green, 30, 'center', 800);
    label(g, Math.round(d.rpm).toLocaleString() + ' rpm', cx, cy + 36, C.dim, 11);
    label(g, d.running ? (d.limiting ? 'LIMITER' : 'RUNNING') : (s.started ? 'ENGINE OFF' : 'READY'), cx, 22, d.running ? C.green : C.red, 11, 'center', 700);
    // speed
    label(g, Math.round(Math.abs(d.kmh)), 170, 52, C.text, 34, 'center', 800);
    label(g, 'km/h', 170, 76, C.dim, 11);
    // bars
    const bar = (x, y, wv, v, col, txt) => {
      g.fillStyle = '#1b2733'; roundRect(g, x, y, wv, 9, 4); g.fill();
      if (v > 0.03) { g.fillStyle = col; roundRect(g, x, y, wv * clamp(v, 0, 1), 9, 4); g.fill(); }
      label(g, txt, x - 4, y + 5, C.dim, 10, 'right');
    };
    bar(170, 94, 120, s.throttle, C.green, 'throttle');
    bar(170, 108, 120, s.clutch, d.slipping && d.gear ? C.orange : C.blue, 'clutch in');
    bar(170, 122, 120, d.clutchHeat / 100, d.clutchHeat > 60 ? C.red : C.amber, 'clutch heat');
    g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(170 + 120 * 0.15, 92, 120 * 0.7, 2);
    label(g, d.slipping && d.gear ? 'SLIPPING' : '', 260, 52, C.orange, 11, 'center', 700);
    if (s.brake > 0.05) label(g, 'BRAKE', 260, 70, C.red, 11, 'center', 700);
    // progress
    const px = W2 - 230;
    g.fillStyle = 'rgba(8,14,22,.82)'; roundRect(g, px, 10, 220, 58, 12); g.fill();
    label(g, `Time ${(s.finished ? s.finishT : s.t).toFixed(1)} s`, px + 12, 28, C.text, 13, 'left', 700);
    const stl = s.finished ? s.finishStalls : d.stalls;
    label(g, `Stalls ${stl}`, px + 208, 28, stl ? C.red : C.text, 13, 'right', 700);
    g.fillStyle = '#1b2733'; roundRect(g, px + 12, 44, 196, 10, 5); g.fill();
    g.fillStyle = C.teal; roundRect(g, px + 12, 44, 196 * clamp(s.x / TRACK.finish, 0, 1), 10, 5); g.fill();
    // message
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
