/* Car-specific labs, plus car-tuned versions of the shared ones. */

/* Mount several labs one after another on one page; tasks are concatenated.
   sections: [{ lab, heading, only? (task ids to keep) }] */
function composeLab(title, intro, sections) {
  const pick = s => s.lab.tasks.filter(t => !s.only || s.only.includes(t.id));
  return {
    title, intro,
    tasks: sections.flatMap(pick),
    mount(root, ctx) {
      root.innerHTML = sections.map((s, i) => `${s.heading ? `<h3 class="lab-sub">${s.heading}</h3>` : ''}<div class="lab-part" data-i="${i}"></div>`).join('');
      const stops = sections.map((s, i) => s.lab.mount(root.querySelector(`.lab-part[data-i="${i}"]`), ctx));
      return () => stops.forEach(f => f && f());
    }
  };
}

/* ================================================= LAB: STEERING GEOMETRY */
const LAB_STEERING = {
  title: 'Steering Geometry Lab',
  intro: 'Seen from above: steer the front wheels and extend a line through each wheel\'s axle. For clean turning, every line must meet at one point, the turning centre.',
  tasks: [
    { id: 'pivot', text: '<b>Centre-pivot</b> axle: steer past 30° and watch the base of the cart shrink' },
    { id: 'scrub', text: '<b>Parallel</b> steering: steer past 25° and see the axle lines miss (tyre scrub)' },
    { id: 'ackermann', text: '<b>Ackermann</b> steering: steer past 20° and see all the lines meet at one point' },
    { id: 'circle', text: 'With Ackermann steering, get the <b>turning circle under 11 m</b>' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, `<p>In a turn, every wheel should roll around the <b>same centre point</b>. The inside wheel follows a smaller circle than the outside wheel, so it must steer more sharply.</p>
      <p><b>Ackermann geometry</b> does this with angled steering arms. If the wheels steer in parallel instead, one tyre is always being dragged sideways: it <b>scrubs</b>, wearing out and fighting the other.</p>
      <p>A soapbox's centre-pivot axle gets the angles right, but the whole axle swings, so both front wheels tuck in under the cart and its base shrinks.</p>`);
    const cv = makeCanvas(L.stage, 760, 440);
    const s = { mode: 'pivot', ang: 15 };
    const ro = readouts([['in', 'Inner wheel'], ['out', 'Outer wheel'], ['r', 'Turning circle'], ['err', 'Scrub error'], ['base', 'Front track']]);
    L.controls.append(
      choice('Steering type', [{ v: 'pivot', t: 'Centre-pivot (cart)' }, { v: 'parallel', t: 'Parallel' }, { v: 'ackermann', t: 'Ackermann' }], s.mode, v => s.mode = v),
      slider('Steering angle (inner wheel)', 0, 40, 1, s.ang, v => v + '°', v => s.ang = v),
      ro);
    const Lw = 2.3, T = 1.45;
    const stop = animLoop(() => {
      const di = Math.max(0.001, s.ang * Math.PI / 180);
      let dOut, frontInner, frontOuter, track = T;
      const ackOut = Math.atan(Lw / (Lw / Math.tan(di) + T));
      // positions in metres: rear axle centre at (0,0), forward = -y, turning left (-x)
      if (s.mode === 'pivot') {
        dOut = di;
        // the whole axle swings about the king bolt, pulling both wheels inward
        frontInner = [-T / 2 * Math.cos(di), -Lw + T / 2 * Math.sin(di)];
        frontOuter = [T / 2 * Math.cos(di), -Lw - T / 2 * Math.sin(di)];
        track = T * Math.cos(di);
      } else {
        dOut = s.mode === 'parallel' ? di : ackOut;
        frontInner = [-T / 2, -Lw]; frontOuter = [T / 2, -Lw];
      }
      // Where each front wheel's axle line crosses the rear-axle line (y = 0).
      const hit = (p, d) => p[0] + p[1] / Math.tan(d);
      const xi = hit(frontInner, di), xo = hit(frontOuter, dOut);
      const err = Math.abs(dOut - ackOut) * 180 / Math.PI;
      const circle = 2 * (Math.hypot(-Math.min(xi, xo) + T / 2, Lw) + 0.4);
      ro.set('in', (di * 180 / Math.PI).toFixed(0) + '°');
      ro.set('out', (dOut * 180 / Math.PI).toFixed(1) + '°');
      ro.set('r', s.ang < 1 ? '∞ (straight)' : circle.toFixed(1) + ' m');
      ro.set('err', s.mode === 'parallel' ? err.toFixed(1) + '° (scrubbing)' : '0° (clean)');
      ro.set('base', Math.round(track / T * 100) + '%');
      if (s.mode === 'pivot' && s.ang >= 30) ctx.complete('pivot');
      if (s.mode === 'parallel' && s.ang >= 25) ctx.complete('scrub');
      if (s.mode === 'ackermann' && s.ang >= 20) ctx.complete('ackermann');
      if (s.mode === 'ackermann' && s.ang >= 1 && circle < 11) ctx.complete('circle');

      const g = cv.g; gridBg(g, cv.w, cv.h);
      const ppm = 52, ox = 600, oy = 330;
      const P = p => [ox + p[0] * ppm, oy + p[1] * ppm];
      // body
      const bodyPts = s.mode === 'pivot' ? [[-0.6, 0.5], [0.6, 0.5], [0.6, -Lw - 0.3], [-0.6, -Lw - 0.3]] : [[-0.85, 0.7], [0.85, 0.7], [0.85, -Lw - 0.7], [-0.85, -Lw - 0.7]];
      g.fillStyle = s.mode === 'pivot' ? 'rgba(185,129,73,.5)' : 'rgba(209,49,47,.35)';
      g.beginPath(); bodyPts.map(P).forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill();
      // rear axle line extended
      g.strokeStyle = 'rgba(138,160,181,.6)'; g.setLineDash([6, 5]); g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(0, oy); g.lineTo(cv.w, oy); g.stroke();
      const wheelRect = (p, d, col) => {
        const [x, y] = P(p);
        g.save(); g.translate(x, y); g.rotate(-d); g.fillStyle = col; g.fillRect(-7, -17, 14, 34); g.restore();
      };
      const axleLine = (p, d, col) => {
        const [x, y] = P(p);
        const dx = -Math.cos(d), dy = Math.sin(d);
        g.strokeStyle = col; g.setLineDash([6, 5]); g.lineWidth = 2;
        g.beginPath(); g.moveTo(x + dx * -40, y + dy * -40); g.lineTo(x + dx * 900, y + dy * 900); g.stroke();
      };
      if (s.ang >= 1) {
        axleLine(frontInner, di, C.blue);
        axleLine(frontOuter, dOut, C.amber);
      }
      g.setLineDash([]);
      if (s.mode === 'pivot') {
        const a = P(frontInner), b = P(frontOuter);
        g.strokeStyle = '#8a5a2e'; g.lineWidth = 8; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
        const c = P([0, -Lw]); g.fillStyle = '#c9d1d9'; g.beginPath(); g.arc(c[0], c[1], 5, 0, 7); g.fill();
        // support base: the triangle the cart stands on shrinks as the axle swings
        const r1p = P([-T / 2, 0]), r2p = P([T / 2, 0]);
        g.strokeStyle = s.ang >= 30 ? C.red : 'rgba(74,222,128,.7)'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(r1p[0], r1p[1]); g.lineTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(r2p[0], r2p[1]); g.closePath(); g.stroke();
        label(g, 'support base', b[0] + 40, (b[1] + r2p[1]) / 2, s.ang >= 30 ? C.red : C.green, 11);
      }
      wheelRect([-T / 2, 0], 0, '#111'); wheelRect([T / 2, 0], 0, '#111');
      wheelRect(frontInner, di, '#1e3a8a'); wheelRect(frontOuter, dOut, '#92400e');
      if (s.ang >= 1) {
        const pi = P([xi, 0]), po = P([xo, 0]);
        const same = Math.abs(xi - xo) < 0.05;
        if (same) {
          g.fillStyle = C.green; g.beginPath(); g.arc(pi[0], pi[1], 8, 0, 7); g.fill();
          label(g, 'one turning centre', pi[0], pi[1] + 22, C.green, 12, 'center', 700);
          g.strokeStyle = 'rgba(74,222,128,.25)'; g.lineWidth = 1.5;
          [[-T / 2, 0], [T / 2, 0], frontInner, frontOuter].forEach(w => { const rr = Math.hypot(w[0] - xi, w[1]) * ppm; g.beginPath(); g.arc(pi[0], pi[1], rr, -Math.PI / 2 - 0.9, -Math.PI / 2 + 0.9); g.stroke(); });
        } else {
          [[pi, C.blue], [po, C.amber]].forEach(([p, c]) => { if (p[0] > -20 && p[0] < cv.w + 20) { g.fillStyle = c; g.beginPath(); g.arc(p[0], p[1], 7, 0, 7); g.fill(); } });
          label(g, 'lines miss: one tyre is dragged sideways', Math.max(140, Math.min(cv.w - 140, (pi[0] + po[0]) / 2)), oy + 26, C.red, 12, 'center', 700);
        }
      }
      label(g, 'inner wheel', P(frontInner)[0], P(frontInner)[1] - 30, C.blue, 11);
      label(g, 'outer wheel', P(frontOuter)[0] + 6, P(frontOuter)[1] - 30, C.amber, 11);
      label(g, 'rear axle line', 70, oy - 10, C.dim, 11);
      label(g, 'FRONT ↑', ox, P([0, -Lw - 0.7])[1] - 16, C.dim, 11, 'center', 700);
    });
    return stop;
  }
};

/* ============================================================ LAB: ABS */
const LAB_ABS = {
  title: 'ABS Lab', intro: 'Emergency stop from 100 km/h.',
  tasks: [
    { id: 'lock', text: 'Brake hard <b>without ABS</b> on a dry road and watch the wheels lock' },
    { id: 'abs', text: 'Turn <b>ABS on</b> and stop in a shorter distance' },
    { id: 'ice', text: 'Try an ABS stop <b>on ice</b>: how much further is it?' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, `<p>A tyre grips best when it's turning a little slower than the road, about <b>10–20% slip</b>. Fully locked (100% slip), grip drops by a third, and a sliding front tyre can't steer.</p>
      <p><b>ABS</b> watches each wheel. When one starts to lock, it dumps that brake's pressure, then re-applies it, many times a second, holding the tyre near the top of the grip curve.</p>`);
    const cv = makeCanvas(L.stage, 760, 380);
    const SURF = { dry: 1.0, wet: 0.7, ice: 0.25 };
    const s = { surf: 'dry', abs: false, run: false, v: 0, w: 0, x: 0, t: 0, p: 0, hist: [], lockedDist: null, absDist: null, last: null, slip: 0, marks: [] };
    const ro = readouts([['spd', 'Speed'], ['slip', 'Wheel slip'], ['dist', 'Distance'], ['st', 'Wheel']]);
    const go = el(`<button class="btn" type="button">Brake hard from 100 km/h</button>`);
    go.onclick = () => { Object.assign(s, { run: true, v: 27.8, w: 27.8 / 0.3, x: 0, t: 0, p: 0, hist: [], marks: [], maxSlip: 0 }); };
    L.controls.append(
      choice('Road surface', [{ v: 'dry', t: 'Dry' }, { v: 'wet', t: 'Wet' }, { v: 'ice', t: 'Ice' }], s.surf, v => s.surf = v),
      toggle('ABS', false, v => s.abs = v),
      go, ro);
    const mq = 1150 / 4, J = 1.2, R = 0.3, Tmax = 1600;
    const mu = (sl, pk) => pk * Math.sin(1.65 * Math.atan(10 * sl));
    const stop = animLoop(dt => {
      const sub = 300, h = dt * 1.5 / sub;  // 1.5× real time
      if (s.run) {
        for (let i = 0; i < sub && s.v > 0.05; i++) {
          const pk = SURF[s.surf];
          const sl = clamp((s.v - s.w * R) / Math.max(s.v, 0.5), 0, 1);
          s.slip = sl;
          if (s.abs) {
            if (sl > 0.2) s.p -= 25 * h; else if (sl < 0.1) s.p += 12 * h;
            s.p = clamp(s.p, 0, 1);
          } else s.p = Math.min(1, s.p + 12 * h);
          const F = mu(sl, pk) * mq * 9.81;
          s.v = Math.max(0, s.v - F / mq * h);
          const Tb = s.p * Tmax * (s.w > 0 ? 1 : 0);
          s.w = Math.max(0, s.w + (F * R - Tb) / J * h);
          s.x += s.v * h; s.t += h;
          s.maxSlip = Math.max(s.maxSlip, sl);
        }
        s.hist.push([s.t, s.v, s.w * R, s.slip]);
        if (s.slip > 0.5) s.marks.push(s.x);
        if (s.v <= 0.05) {
          s.run = false; s.v = 0;
          s.last = { dist: s.x, abs: s.abs, surf: s.surf };
          if (!s.abs && s.surf === 'dry' && s.maxSlip > 0.9) { s.lockedDist = s.x; ctx.complete('lock'); }
          if (s.abs && s.surf === 'dry') { s.absDist = s.x; if (s.lockedDist && s.x < s.lockedDist) ctx.complete('abs'); }
          if (s.abs && s.surf === 'ice') ctx.complete('ice');
        }
      }
      ro.set('spd', (s.v * 3.6).toFixed(0) + ' km/h');
      ro.set('slip', Math.round(s.slip * 100) + '%');
      ro.set('dist', s.x.toFixed(1) + ' m');
      ro.set('st', !s.run && !s.x ? 'ready' : s.slip > 0.9 ? 'LOCKED: no steering' : s.slip > 0.25 ? 'slipping' : s.run && s.abs && s.p < 0.95 ? 'ABS pulsing' : 'rolling');

      const g = cv.g; gridBg(g, cv.w, cv.h);
      // road strip with car
      const ry = 70, scale = 660 / Math.max(80, (s.last ? s.last.dist : 60) * 1.1, s.x * 1.1);
      g.fillStyle = s.surf === 'ice' ? '#a5c8e4' : s.surf === 'wet' ? '#2b3a48' : '#3a3d42'; g.fillRect(20, ry - 22, 720, 44);
      g.strokeStyle = 'rgba(255,255,255,.5)'; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(20, ry); g.lineTo(740, ry); g.stroke(); g.setLineDash([]);
      s.marks.forEach(m => { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(66 + m * scale, ry + 10, 2.5, 5); });
      const cx = 66 + s.x * scale;
      g.fillStyle = '#d1312f'; roundRect(g, cx - 34, ry - 14, 40, 22, 6); g.fill();
      g.fillStyle = '#111'; g.fillRect(cx - 28, ry + 6, 9, 6); g.fillRect(cx - 6, ry + 6, 9, 6);
      [[s.lockedDist, 'no ABS', C.red], [s.absDist, 'ABS', C.green]].forEach(([d, t, c]) => {
        if (d == null) return;
        const x = 66 + d * scale; g.strokeStyle = c; g.lineWidth = 2; g.beginPath(); g.moveTo(x, ry - 28); g.lineTo(x, ry + 28); g.stroke();
        label(g, `${t}: ${d.toFixed(1)} m`, x, ry - 36, c, 11, 'center', 700);
      });
      // speed traces
      const gx = 40, gy = 140, gw = 400, gh = 200;
      g.fillStyle = 'rgba(10,16,24,.85)'; roundRect(g, gx - 10, gy - 20, gw + 20, gh + 40, 8); g.fill();
      label(g, 'car speed vs wheel speed', gx, gy - 8, C.dim, 11, 'left');
      const tMax = Math.max(4, ...s.hist.map(h => h[0]));
      [[1, C.text, 'car'], [2, C.amber, 'wheel']].forEach(([k, c, n], j) => {
        g.strokeStyle = c; g.lineWidth = 2; g.beginPath();
        s.hist.forEach((h, i) => { const x = gx + h[0] / tMax * gw, y = gy + gh - h[k] / 28 * gh; i ? g.lineTo(x, y) : g.moveTo(x, y); });
        g.stroke(); label(g, n, gx + gw - 4, gy + 10 + j * 14, c, 11, 'right', 700);
      });
      label(g, 'time →', gx + gw / 2, gy + gh + 12, C.dim, 10);
      // grip curve
      const kx = 480, ky = 140, kw = 250, kh = 200, pk = SURF[s.surf];
      g.fillStyle = 'rgba(10,16,24,.85)'; roundRect(g, kx - 10, ky - 20, kw + 20, kh + 40, 8); g.fill();
      label(g, 'grip vs slip', kx, ky - 8, C.dim, 11, 'left');
      g.fillStyle = 'rgba(74,222,128,.12)'; g.fillRect(kx + 0.1 * kw, ky, 0.1 * kw, kh);
      g.strokeStyle = C.teal; g.lineWidth = 2; g.beginPath();
      for (let i = 0; i <= 100; i++) { const sl = i / 100, x = kx + sl * kw, y = ky + kh - mu(sl, pk) * kh; i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(kx + s.slip * kw, ky + kh - mu(s.slip, pk) * kh, 6, 0, 7); g.fill();
      label(g, 'ABS zone', kx + 0.15 * kw, ky + kh - 10, C.green, 10);
      label(g, '0%', kx, ky + kh + 12, C.dim, 10); label(g, 'locked 100%', kx + kw, ky + kh + 12, C.dim, 10, 'right');
    });
    return stop;
  }
};

/* ==================================================== LAB: FIRING ORDER */
const LAB_FIRING = {
  title: 'Firing Order Lab', intro: 'Four cylinders sharing one crankshaft.',
  tasks: [
    { id: 'order', text: 'Predict the <b>firing order</b>: which cylinder fires after cylinder 1?' },
    { id: 'smooth', text: 'Compare the crankshaft torque with <b>1 cylinder</b> and then <b>4 cylinders</b> firing' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, `<p>Pistons 1 and 4 move together, and so do 2 and 3, but each pair is half a cycle apart. So when 1 is on its power stroke, 4 is on intake, and so on.</p>
      <p>The firing order <b>1–3–4–2</b> spaces the power strokes every 180° of crank rotation. The torque graph shows why that's so much smoother than one big cylinder.</p>
      <div class="quizlet"><b>Which cylinder fires after cylinder 1?</b><div class="seg" id="fo"></div><div id="fo-fb" class="small"></div></div>`);
    const cv = makeCanvas(L.stage, 760, 360);
    const s = { th: 0, rpm: 30, n: 4, seen: new Set([4]) };
    const OFF = { 1: 0, 3: 180, 4: 360, 2: 540 };
    L.controls.append(
      slider('Engine speed (slow motion)', 5, 120, 1, s.rpm, v => v + ' rpm', v => s.rpm = v),
      choice('Cylinders firing', [{ v: 1, t: '1 only' }, { v: 2, t: '1 and 4' }, { v: 4, t: 'All 4' }], 4, v => { s.n = v; s.seen.add(v); if (s.seen.has(1) && s.seen.has(4)) ctx.complete('smooth'); })
    );
    const fo = L.explain.querySelector('#fo'), fb = L.explain.querySelector('#fo-fb');
    [2, 3, 4].forEach(n => {
      const b = el(`<button class="seg-b" type="button">${n}</button>`);
      b.onclick = () => {
        if (n === 3) { fb.innerHTML = '<span style="color:#4ade80">Right: 1, then 3, then 4, then 2.</span> Watch the flashes.'; ctx.complete('order'); }
        else fb.innerHTML = '<span style="color:#ef4444">Not quite.</span> Watch which cylinder flashes next.';
      };
      fo.appendChild(b);
    });
    const active = c => s.n === 4 || c === 1 || (s.n === 2 && c === 4);
    const torqueOne = a => { a = ((a % 720) + 720) % 720; if (a >= 360 && a < 540) return 3.2 * Math.sin((a - 360) / 180 * Math.PI) * Math.exp(-(a - 360) / 160); if (a >= 180 && a < 360) return -0.6 * Math.sin((a - 180) / 180 * Math.PI); return -0.08; };
    const torqueAll = a => [1, 2, 3, 4].reduce((sum, c) => sum + (active(c) ? torqueOne(a - OFF[c]) : (torqueOne(a - OFF[c]) < 0 ? torqueOne(a - OFF[c]) : 0)), 0);
    const stop = animLoop(dt => {
      s.th = (s.th + s.rpm * 6 * dt) % 720;
      const g = cv.g; gridBg(g, cv.w, cv.h);
      [1, 2, 3, 4].forEach((c, i) => {
        const a = ((s.th - OFF[c]) % 720 + 720) % 720, stroke = Math.floor(a / 180);
        const x = 70 + i * 90, crank = a * Math.PI / 180;
        const top = 60 + (1 - Math.cos(crank)) / 2 * 70;
        g.fillStyle = '#3a4a5c'; g.fillRect(x - 34, 40, 6, 150); g.fillRect(x + 28, 40, 6, 150);
        const cols = ['rgba(96,165,250,.45)', 'rgba(167,139,250,.6)', active(c) ? 'rgba(251,146,60,.85)' : 'rgba(167,139,250,.35)', 'rgba(156,163,175,.5)'];
        g.fillStyle = cols[stroke]; g.fillRect(x - 28, 40, 56, top - 40);
        g.fillStyle = '#c5ccd4'; g.fillRect(x - 27, top, 54, 34);
        if (stroke === 2 && a < 400 && active(c)) { g.fillStyle = 'rgba(253,224,71,.9)'; g.beginPath(); g.arc(x, 48, 12, 0, 7); g.fill(); }
        label(g, String(c), x, 214, C.text, 18, 'center', 800);
        label(g, ['intake', 'compress', 'POWER', 'exhaust'][stroke], x, 236, stroke === 2 && active(c) ? C.orange : C.dim, 11, 'center', 700);
      });
      label(g, 'cylinders 1 – 2 – 3 – 4 along the crank', 205, 20, C.dim, 11);
      // torque graph
      const gx = 420, gy = 40, gw = 320, gh = 200;
      g.fillStyle = 'rgba(10,16,24,.85)'; roundRect(g, gx - 10, gy - 20, gw + 20, gh + 50, 8); g.fill();
      label(g, 'torque on the crankshaft over one cycle', gx, gy - 6, C.dim, 11, 'left');
      const zy = gy + gh * 0.7;
      g.strokeStyle = C.line; g.beginPath(); g.moveTo(gx, zy); g.lineTo(gx + gw, zy); g.stroke();
      g.strokeStyle = C.orange; g.lineWidth = 2.5; g.beginPath();
      for (let a = 0; a <= 720; a += 4) { const x = gx + a / 720 * gw, y = zy - torqueAll(a) * gh * 0.2; a ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
      const cx = gx + s.th / 720 * gw; g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx, gy + 10); g.lineTo(cx, gy + gh); g.stroke();
      label(g, '0°', gx, gy + gh + 14, C.dim, 10); label(g, '720°', gx + gw, gy + gh + 14, C.dim, 10, 'right');
      label(g, s.n === 1 ? 'one big kick, then the flywheel coasts' : s.n === 2 ? 'two kicks per cycle' : 'a kick every 180°: much smoother', gx + gw / 2, gy + gh + 30, C.text, 12, 'center', 700);
    });
    return stop;
  }
};

/* =================================================== LAB: FUEL INJECTION */
const LAB_EFI = {
  title: 'Fuel Injection Lab',
  intro: 'Watch the ECU weigh the air, time the injectors, and correct itself with the oxygen sensor. Then break things and see how it copes.',
  tasks: [
    { id: 'closed', text: 'Warm engine, sensor connected: watch the ECU hold <b>λ = 1.00</b> (14.7:1)' },
    { id: 'leak', text: 'Add a <b>vacuum leak</b> and watch the fuel trim add fuel to compensate' },
    { id: 'open', text: '<b>Unplug the O₂ sensor</b> with a fault present and see the catalyst stop working' },
    { id: 'cold', text: 'Do a <b>cold start</b> and see the ECU run rich on purpose' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, `<p><b>λ (lambda)</b> is the actual air-fuel ratio divided by 14.7. λ = 1 is chemically perfect; below 1 is rich, above 1 is lean.</p>
      <p>The ECU <b>measures air</b> (MAF sensor), calculates fuel, then reads the <b>O₂ sensor</b> to see how it did. The correction it applies is the <b>fuel trim</b>. A trim stuck far from 0% means something upstream is wrong.</p>
      <p>The catalytic converter only cleans the exhaust well in a narrow window around λ = 1.</p>`);
    const cv = makeCanvas(L.stage, 760, 400);
    const s = { th: 0.1, leak: false, dirty: false, o2: true, temp: 90, trim: 0, lam: 1, closedT: 0, openT: 0, cold: false };
    const ro = readouts([['air', 'Air (true / measured)'], ['pw', 'Injector pulse'], ['lam', 'λ / AFR'], ['trim', 'Fuel trim'], ['cat', 'Catalyst efficiency'], ['mode', 'ECU mode']]);
    const coldBtn = el(`<button class="btn ghost" type="button">❄ Cold start (10 °C)</button>`);
    coldBtn.onclick = () => { s.temp = 10; s.trim = 0; s.cold = true; };
    L.controls.append(
      slider('Accelerator', 0, 100, 1, 10, v => v + '%', v => s.th = v / 100),
      toggle('Vacuum leak (unmetered air)', false, v => s.leak = v),
      toggle('Dirty MAF sensor (reads 20% low)', false, v => s.dirty = v),
      toggle('O₂ sensor connected', true, v => s.o2 = v),
      coldBtn, ro);
    let pulse = 0;
    const stop = animLoop(dt => {
      const rpm = 850 + s.th * 5600;
      const trueMetered = 2.5 + 115 * Math.pow(s.th, 1.1);
      const leakAir = s.leak ? 1.8 : 0;
      const trueAir = trueMetered + leakAir;
      const measured = trueMetered * (s.dirty ? 0.8 : 1);
      s.temp = Math.min(90, s.temp + dt * 4);
      const warm = s.temp > 60;
      const closed = s.o2 && warm;
      const enrich = warm ? 1 : 1 + 0.35 * (60 - s.temp) / 50;
      const fuel = measured / 14.7 * enrich * (1 + s.trim);
      s.lam = trueAir / (fuel * 14.7);
      if (closed) s.trim = clamp(s.trim + (s.lam - 1) * 0.8 * dt, -0.25, 0.25);
      else s.trim = lerp(s.trim, 0, Math.min(1, dt * 3));  // open loop: back to the base map
      const perInj = fuel * 1000 / (4 * rpm / 120);   // mg per injection
      const pw = perInj / 3 + 0.8;                    // 3 mg/ms injector + dead time
      const cat = !warm ? 0.2 : Math.exp(-Math.pow((s.lam - 1) / 0.03, 2));
      ro.set('air', `${trueAir.toFixed(1)} / ${measured.toFixed(1)} g/s`);
      ro.set('pw', pw.toFixed(1) + ' ms');
      ro.set('lam', `${s.lam.toFixed(2)} / ${(s.lam * 14.7).toFixed(1)}:1`);
      ro.set('trim', (s.trim >= 0 ? '+' : '') + Math.round(s.trim * 100) + '%' + (Math.abs(s.trim) >= 0.249 ? ' (maxed: fault!)' : ''));
      ro.set('cat', Math.round(cat * 100) + '%');
      ro.set('mode', closed ? 'closed loop' : !warm ? 'warm-up (open loop)' : 'open loop: no O₂ signal');
      if (closed && Math.abs(s.lam - 1) < 0.01) { s.closedT += dt; if (s.closedT > 2) ctx.complete('closed'); } else s.closedT = 0;
      if (s.leak && closed && s.trim > 0.1) ctx.complete('leak');
      if (!s.o2 && warm && (s.leak || s.dirty) && cat < 0.5) { s.openT += dt; if (s.openT > 1) ctx.complete('open'); } else s.openT = 0;
      if (s.cold && !warm && s.lam < 0.9) ctx.complete('cold');

      pulse += dt * rpm / 120 * 0.15;
      const g = cv.g; gridBg(g, cv.w, cv.h);
      const box = (x, y, w, h, t, sub, col) => {
        g.fillStyle = '#1b2733'; roundRect(g, x, y, w, h, 10); g.fill();
        g.strokeStyle = col || C.line; g.lineWidth = 2; roundRect(g, x, y, w, h, 10); g.stroke();
        label(g, t, x + w / 2, y + 18, C.text, 13, 'center', 700);
        if (sub) label(g, sub, x + w / 2, y + 38, C.amber, 13, 'center', 700);
      };
      const arrow = (x1, y1, x2, y2, col, txt) => {
        g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
        const a = Math.atan2(y2 - y1, x2 - x1); g.fillStyle = col; g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - 10 * Math.cos(a - 0.4), y2 - 10 * Math.sin(a - 0.4)); g.lineTo(x2 - 10 * Math.cos(a + 0.4), y2 - 10 * Math.sin(a + 0.4)); g.fill();
        if (txt) label(g, txt, (x1 + x2) / 2, (y1 + y2) / 2 - 10, C.dim, 10);
      };
      box(20, 40, 150, 56, 'MAF sensor', `${measured.toFixed(1)} g/s`, s.dirty ? C.red : null);
      box(300, 40, 160, 56, 'ECU', closed ? 'closed loop' : 'open loop', C.teal);
      box(590, 40, 150, 56, 'Injectors', `${pw.toFixed(1)} ms`);
      box(300, 170, 160, 70, 'Cylinders', `λ ${s.lam.toFixed(2)}`, s.lam < 0.97 ? '#92400e' : s.lam > 1.03 ? C.red : C.green);
      box(590, 170, 150, 56, 'O₂ sensor', s.o2 ? (s.lam < 1 ? 'reads RICH' : 'reads LEAN') : 'unplugged', s.o2 ? null : C.red);
      box(20, 170, 150, 56, 'Air in', `${trueAir.toFixed(1)} g/s`);
      arrow(170, 68, 296, 68, C.blue, 'air reading');
      arrow(460, 68, 586, 68, C.amber, 'pulse width');
      arrow(665, 96, 470, 182, C.amber, 'fuel');
      arrow(170, 198, 296, 205, C.blue);
      arrow(460, 205, 586, 198, '#9ca3af', 'exhaust');
      if (s.o2) { g.setLineDash([6, 5]); arrow(665, 170, 420, 100, C.green, 'feedback'); g.setLineDash([]); }
      if (s.leak) { label(g, '↓ leak: air the MAF never saw', 235, 252, C.red, 11, 'center', 700); arrow(235, 260, 300, 225, C.red); }
      // injector spray pulses
      for (let i = 0; i < 4; i++) {
        const on = ((pulse + i / 4) % 1) < 0.12 + pw / 80;
        g.fillStyle = on ? '#e2b13c' : '#2a3442'; g.beginPath(); g.arc(612 + i * 34, 120, 8, 0, 7); g.fill();
      }
      // lambda gauge + catalyst bar
      const gx = 160, gy = 330, gw = 440;
      g.fillStyle = '#1b2733'; roundRect(g, gx, gy, gw, 16, 8); g.fill();
      const lx = v => gx + clamp((v - 0.7) / 0.6, 0, 1) * gw;
      g.fillStyle = 'rgba(74,222,128,.35)'; g.fillRect(lx(0.97), gy, lx(1.03) - lx(0.97), 16);
      g.fillStyle = '#fff'; g.fillRect(lx(s.lam) - 2, gy - 6, 4, 28);
      label(g, 'RICH 0.7', gx, gy + 32, C.dim, 10, 'left'); label(g, 'λ = 1', lx(1), gy + 32, C.green, 10); label(g, '1.3 LEAN', gx + gw, gy + 32, C.dim, 10, 'right');
      label(g, `trim ${(s.trim >= 0 ? '+' : '') + Math.round(s.trim * 100)}%`, 680, gy + 8, Math.abs(s.trim) > 0.2 ? C.red : C.text, 13, 'center', 700);
      label(g, `coolant ${Math.round(s.temp)} °C`, 80, gy + 8, s.temp < 60 ? C.blue : C.text, 13, 'center', 700);
      g.fillStyle = '#1b2733'; roundRect(g, gx, gy - 46, gw, 10, 5); g.fill();
      g.fillStyle = cat > 0.8 ? C.green : cat > 0.4 ? C.amber : C.red; roundRect(g, gx, gy - 46, gw * cat, 10, 5); g.fill();
      label(g, 'catalytic converter efficiency', gx + gw / 2, gy - 56, C.dim, 10);
    });
    return stop;
  }
};

/* ===================================================== LAB: DIFFERENTIAL */
const LAB_DIFF = {
  title: 'Differential Lab', intro: 'The rear axle seen from above.',
  tasks: [
    { id: 'corner', text: 'Open diff in a <b>tight corner</b>: see the outside wheel turn faster' },
    { id: 'stuck', text: 'Open diff on a snowy slope with the <b>left wheel on ice</b>: floor it and get stuck' },
    { id: 'escape', text: 'Escape the ice with a <b>locked</b> or <b>limited-slip</b> diff' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, `<p><b>Open:</b> torque is always split 50/50, and the wheels can turn at any speed difference. Perfect in corners, but helpless when one wheel has no grip.</p>
      <p><b>Locked:</b> both wheels are forced to turn together. Great traction, but in a corner one tyre has to scrub.</p>
      <p><b>Limited-slip (LSD):</b> lets the wheels differ, but can send up to 4× more torque to the wheel with grip.</p>`);
    const cv = makeCanvas(L.stage, 760, 380);
    const s = { type: 'open', R: 0, ice: false, th: 0, v: 0, spinL: 0, a: [0, 0], stuckT: 0 };
    const ro = readouts([['v', 'Car speed'], ['wl', 'Left wheel'], ['wr', 'Right wheel'], ['tq', 'Torque split L / R'], ['sc', 'Tyre scrub']]);
    L.controls.append(
      choice('Differential', [{ v: 'open', t: 'Open' }, { v: 'locked', t: 'Locked' }, { v: 'lsd', t: 'Limited-slip' }], 'open', v => s.type = v),
      choice('Road', [{ v: 0, t: 'Straight' }, { v: 30, t: 'Bend (30 m)' }, { v: 8, t: 'Tight corner (8 m)' }], 0, v => s.R = v),
      toggle('Snowy 6% slope, left wheel on ice', false, v => { s.ice = v; if (v) { s.v = 0; } }),
      slider('Accelerator', 0, 100, 1, 0, v => v + '%', v => s.th = v / 100),
      ro);
    const m = 1150, N = m * 9.81 * 0.25, T = 1.45;
    const stop = animLoop(dt => {
      const muL = s.ice ? 0.08 : 0.9, muR = s.ice ? 0.5 : 0.9;
      const capL = muL * N, capR = muR * N;
      const Fd = s.th * 5000;
      const resist = 0.015 * m * 9.81 + (s.ice ? 0.06 * m * 9.81 : 0) + 0.4 * s.v * s.v;
      let FL, FR;
      if (s.type === 'open') { const f = Math.min(Fd / 2, capL, capR); FL = f; FR = f; }
      else if (s.type === 'locked') { const tot = Math.min(Fd, capL + capR); FL = Math.min(capL, tot / 2 + Math.max(0, tot / 2 - capR)); FR = tot - FL; }
      else { const lo = Math.min(capL, capR), tot = Math.min(Fd, lo * 5, capL + capR); FL = capL < capR ? Math.min(capL, tot) : tot - Math.min(capR, tot / 2); FR = tot - FL; }
      const drive = FL + FR;
      const acc = (drive - (s.v > 0.01 || drive > resist ? resist : drive)) / m;
      s.v = Math.max(0, Math.min(14, s.v + acc * dt));
      // The icy wheel spins up whenever it's offered more torque than it can grip
      // (a locked diff ties it to the other wheel, so it can't).
      s.spinL = lerp(s.spinL, Fd / 2 > capL + 1 && s.type !== 'locked' ? s.th * 12 : 0, dt * 2);
      const ratio = s.R ? T / 2 / s.R : 0;
      let vL = s.v * (1 - ratio), vR = s.v * (1 + ratio), scrub = 0;
      if (s.type === 'locked') { scrub = (vR - vL) / 2; vL = vR = s.v; }
      if (s.type === 'lsd') { scrub = (vR - vL) * 0.08; }
      vL += s.spinL;
      s.a[0] += vL / 0.3 * dt * 0.15; s.a[1] += vR / 0.3 * dt * 0.15;
      ro.set('v', (s.v * 3.6).toFixed(0) + ' km/h');
      ro.set('wl', (vL * 3.6).toFixed(0) + ' km/h' + (s.spinL > 1 ? ' (spinning!)' : ''));
      ro.set('wr', (vR * 3.6).toFixed(0) + ' km/h');
      const tot = FL + FR;
      ro.set('tq', tot > 1 ? `${Math.round(FL / tot * 100)}% / ${Math.round(FR / tot * 100)}%` : '–');
      ro.set('sc', scrub > 0.05 ? `${(scrub * 3.6).toFixed(1)} km/h (hopping!)` : 'none');
      if (s.type === 'open' && s.R === 8 && s.v > 2) ctx.complete('corner');
      if (s.type === 'open' && s.ice && s.th > 0.5 && s.v < 0.5) { s.stuckT += dt; if (s.stuckT > 1) ctx.complete('stuck'); } else s.stuckT = 0;
      if (s.type !== 'open' && s.ice && s.v > 1) ctx.complete('escape');

      const g = cv.g; gridBg(g, cv.w, cv.h);
      const cx = 380, cy = 210;
      g.fillStyle = s.ice ? 'rgba(220,235,250,.15)' : 'rgba(60,64,70,.6)'; g.fillRect(0, 60, cv.w, 300);
      if (s.ice) { g.fillStyle = 'rgba(165,200,228,.6)'; g.fillRect(0, cy - 90, cx - 40, 180); label(g, 'ICE', 120, cy - 100, '#a5c8e4', 13, 'center', 800); }
      if (s.R) {
        const k = 260 / Math.max(s.R, 8) * 2.2, ox = cx - s.R * k * 0.6;
        g.strokeStyle = 'rgba(255,255,255,.25)'; g.setLineDash([6, 6]);
        [s.R - T / 2, s.R + T / 2].forEach(r => { g.beginPath(); g.arc(ox, cy + 160, r * k * 0.6, -Math.PI / 2 - 0.5, -Math.PI / 2 + 0.5); g.stroke(); });
        g.setLineDash([]);
        label(g, 'inside wheel: shorter path', 130, 330, C.blue, 11); label(g, 'outside wheel: longer path', 630, 330, C.amber, 11);
      }
      g.strokeStyle = '#7d8792'; g.lineWidth = 10; g.beginPath(); g.moveTo(cx - 230, cy); g.lineTo(cx + 230, cy); g.stroke();
      g.strokeStyle = '#7d8792'; g.lineWidth = 9; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy - 160); g.stroke();
      label(g, 'propshaft from gearbox', cx + 10, cy - 150, C.dim, 11, 'left');
      g.fillStyle = '#59616b'; g.beginPath(); g.arc(cx, cy, 44, 0, 7); g.fill();
      drawGear(g, cx, cy, 30, 37, (s.a[0] + s.a[1]) / 2, COL.orange);
      drawGear(g, cx - 14, cy, 8, 10, s.a[0] * 3, '#c9d1d9'); drawGear(g, cx + 14, cy, 8, 10, -s.a[1] * 3, '#c9d1d9');
      label(g, s.type === 'open' ? 'OPEN DIFF' : s.type === 'locked' ? 'LOCKED' : 'LSD', cx, cy + 62, C.text, 12, 'center', 800);
      const wheel = (x, ang, col, spin) => {
        g.save(); g.translate(x, cy);
        g.fillStyle = '#111'; roundRect(g, -26, -60, 52, 120, 10); g.fill();
        for (let i = 0; i < 6; i++) { const y = ((ang * 40 + i * 20) % 120) - 60; g.fillStyle = col; g.fillRect(-26, y, 52, 4); }
        if (spin > 1) { g.fillStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(-30 - Math.random() * 30, 40 + Math.random() * 30, 4 + Math.random() * 6, 0, 7); g.fill(); } }
        g.restore();
      };
      wheel(cx - 260, s.a[0], C.blue, s.spinL);
      wheel(cx + 260, s.a[1], C.amber, 0);
      label(g, 'LEFT', cx - 260, cy - 76, C.blue, 12, 'center', 700);
      label(g, 'RIGHT', cx + 260, cy - 76, C.amber, 12, 'center', 700);
      if (s.ice && s.type === 'open' && s.th > 0.3 && s.v < 0.5) label(g, 'STUCK: the icy wheel spins, so the other gets just as little torque', cx, 40, C.red, 13, 'center', 700);
      if (scrub > 0.05) label(g, 'Locked diff in a corner: a tyre must scrub sideways', cx, 40, C.amber, 13, 'center', 700);
    });
    return stop;
  }
};

/* ============================================== car-tuned shared labs */
const CAR_SUSP = {
  title: 'Suspension Lab',
  intro: 'A quarter-car model: one corner of the car on its spring, damper, and tyre. Tune it for comfort and grip.',
  tasks: [
    { id: 'pogo', text: 'Set damping to <b>0</b> and drive over the <b>speed bump</b>. Watch it bounce.' },
    { id: 'kerb', text: 'Drive off the <b>50 cm ledge</b> without bottoming out' },
    { id: 'soft', text: 'Fit the <b>softest spring</b> and watch the car sag and bottom out on the speed bump' }
  ],
  mount(root, ctx) {
    const L = labLayout(root, `<p>The <b>spring</b> holds the car up and stores bump energy. The <b>damper</b> (shock absorber) turns motion into heat so the car doesn't keep bouncing.</p>
      <p>Too little damping and the body floats and wallows. Too much and every ripple goes straight to the body, and the tyre skips off the road. Real dampers react differently to slow body movements and fast wheel movements to get the best of both.</p>`);
    return suspensionPanel(L.stage, L.controls, ctx, {
      P: { ms: 280, mu: 40, kt: 220000, ct: 400, L0: 0.45, travel: 0.16, R: 0.3, cushK: 200000 },
      k: [20000, 120000, 1000, 55000], c: [0, 15000, 250, 3500], speed: [2, 30, 1, 10],
      massLabel: 'sprung mass (¼ of the car)', terrain: 'bump', ppm: 260,
      groundFill: '#3a3d42', groundEdge: '#6b7280',
      terrains: [
        { v: 'rough', t: 'Rough road', road: x => 0.02 * Math.abs(Math.sin(Math.PI * x / 0.5)) },
        { v: 'bump', t: 'Speed bump', road: x => { const p = ((x % 20) + 20) % 20; return (p > 6 && p < 7.2) ? 0.08 * Math.sin(Math.PI * (p - 6) / 1.2) : 0; } },
        { v: 'kerb', t: 'Ledge drop (50 cm)', road: () => 0, drop: 0.5 }
      ],
      check(s, contact, ctx) {
        if (s.sc === 'bump' && s.c <= 300 && s.scT > 4) ctx.complete('pogo');
        if (s.sc === 'kerb' && s.scT > 1.4 && s.bottoms === 0 && s.maxc > 0.05) ctx.complete('kerb');
        if (s.sc === 'bump' && s.k <= 20000 && s.bottoms > 0) ctx.complete('soft');
      }
    });
  }
};

const CAR_BRAKE_DESIGN = {
  title: 'Brake Designer', intro: '',
  tasks: [
    { id: 'design', text: 'Brake design: <b>0.9–1.0 g</b> with only <b>100 N</b> on the pedal, without too much pedal travel' },
    { id: 'servo', text: 'Switch the <b>servo off</b> and see how weak 100 N becomes (below 0.4 g)' }
  ],
  mount(root, ctx) {
    root.innerHTML = `<div class="lab-grid"><div class="lab-stage"></div><div class="lab-side"><div class="lab-controls"></div></div></div>`;
    return brakePanel(root.querySelector('.lab-stage'), root.querySelector('.lab-controls'), ctx, {
      forceLabel: 'Pedal force', F: [20, 400, 10, 100], ratio: 4, servo: 3,
      dm: [16, 26, 0.5, 22], dc: [44, 62, 1, 54], rotor: [240, 330, 10, 280],
      pistons: 1, pistonLabel: 'Caliper piston', calipers: 2, circuitCalipers: 4, share: 0.7, drawScale: 0.5,
      mu: 0.4, mass: 1150, tyreR: 0.3, maxTravel: 60, travelBase: 10, travelLabel: 'Pedal travel', overTravel: 'hits the floor!',
      check(r, ctx) {
        if (r.F <= 100 && r.decel >= 0.9 && r.decel <= 1.0 && !r.bottomed && r.servo) ctx.complete('design');
        if (!r.servo && r.F >= 100 && r.decel < 0.4) ctx.complete('servo');
      }
    });
  }
};

const CAR_DRIVETRAIN = makeDrivetrainLab({
  P: CAR, final: 'diff', hPattern: true, tach: { max: 8000, band: [2500, 6500] },
  startText: '<b>Start</b> the engine (it only cranks with the clutch pressed or in neutral)',
  clutchLabel: 'Clutch pedal (0 = up, 100 = pressed)',
  shaftLabels: ['input shaft (from clutch)', 'layshaft → output'],
  explain: `<p><b>Pulling away:</b> clutch down → 1st gear → a little throttle (20–30%) → bring the clutch up slowly to the <b>biting point</b>, then all the way.</p>
      <p>The plates <span style="color:#fb923c">glow</span> while the clutch slips. That's energy turning into heat in the friction disc.</p>
      <p>This is an <b>H-pattern</b> box: pick any gear directly. Press the clutch first!</p>`
});

Object.assign(LABS, {
  steering: LAB_STEERING,
  carchassis: CAR_SUSP,
  carbrakes: composeLab('Brakes & ABS Lab', 'Design a hydraulic brake system, then see how ABS keeps the tyres at their peak grip.', [
    { lab: CAR_BRAKE_DESIGN, heading: 'Hydraulic brake designer' },
    { lab: LAB_ABS, heading: 'Anti-lock brakes' }
  ]),
  carengine: composeLab('Engine Lab', 'First, one cylinder in slow motion. Then four cylinders sharing a crankshaft.', [
    { lab: LAB_FOURSTROKE, heading: 'One cylinder, four strokes', only: ['cycle', 'power', 'spark'] },
    { lab: LAB_FIRING, heading: 'Inline-four firing order' }
  ]),
  efi: LAB_EFI,
  ignition: makeIgnitionLab({ low: 2000, high: 6000, maxRpm: 7500, chain: ['Crank sensor', 'ECU timing map', 'Coil-on-plug', 'Spark plug'] }),
  carcooling: makeCoolingLab({
    speedLabel: 'Road speed', maxSpeed: 130,
    explain: `<p>Heat in comes from engine <b>load</b>. Heat out depends on <b>airflow</b> through the radiator (road speed plus the electric fan) and on how much coolant the thermostat lets through.</p>
      <p>The pressure cap lets coolant reach about 120 °C before it boils. With low coolant there's less to soak up heat and less flowing through the radiator.</p>`,
    scenarios: [{ v: 'idle', t: 'Idle warm-up', m: [0, 10] }, { v: 'motorway', t: 'Motorway cruise', m: [110, 45] }, { v: 'jam', t: 'Summer traffic jam', m: [5, 55] }],
    survive: { v: 'jam', text: 'Survive <b>20 seconds</b> in the <b>summer traffic jam</b> without boiling over', short: 'Traffic jam' }
  }),
  cardrive: composeLab('Drivetrain Lab', 'Drive the see-through drivetrain, then see what the differential does in corners and on ice.', [
    { lab: CAR_DRIVETRAIN },
    { lab: LAB_DIFF, heading: 'The differential' }
  ])
});
