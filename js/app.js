/* Screens, build mechanic, quizzes and progress. */

const STORE_KEY = 'pedals-to-pistons-v1';
const store = {
  load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } },
  save(v) { try { localStorage.setItem(STORE_KEY, JSON.stringify(v)); } catch (e) { /* private mode */ } }
};
const state = Object.assign({ progress: {} }, store.load());
const save = () => store.save(state);

const prog = id => (state.progress[id] = state.progress[id] || { built: [], lab: false, quiz: false, done: false });
const isDone = id => !!(state.progress[id] && state.progress[id].done);
const isUnlocked = i => i === 0 || isDone(CHAPTERS[i - 1].id);

const app = document.getElementById('app');
let cleanup = null;
function setScreen(html) {
  if (cleanup) { cleanup(); cleanup = null; }
  closeModal();
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

/* ---------------------------------------------------------- utilities */
function toast(msg, kind = '') {
  const t = document.getElementById('toast');
  t.innerHTML = msg; t.className = 'show ' + kind;
  clearTimeout(toast._t); toast._t = setTimeout(() => t.className = '', 3200);
}

function modal(html, opts = {}) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="modal-bg"><div class="modal ${opts.cls || ''}" role="dialog" aria-modal="true">${html}</div></div>`;
  const bg = root.querySelector('.modal-bg');
  requestAnimationFrame(() => bg.classList.add('in'));
  root.querySelectorAll('[data-close]').forEach(b => b.onclick = () => { closeModal(); opts.onClose && opts.onClose(); });
  if (opts.dismissable !== false) bg.addEventListener('click', e => { if (e.target === bg) { closeModal(); opts.onClose && opts.onClose(); } });
  fitThumbs(root);
  const first = root.querySelector('[data-close], .btn'); if (first) first.focus();
  return root;
}
function closeModal() { document.getElementById('modal-root').innerHTML = ''; }
document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.querySelector('.modal-bg')) { const c = document.querySelector('.modal [data-close]'); c ? c.click() : closeModal(); } });

function thumb(id, cls = 'thumb') { return `<svg class="${cls}" viewBox="0 0 1000 600" data-fit><g>${partMarkup(id)}</g></svg>`; }
function fitThumbs(root) {
  root.querySelectorAll('svg[data-fit]').forEach(svg => {
    try {
      const b = svg.querySelector('g').getBBox();
      if (!b.width) return;
      const pad = Math.max(b.width, b.height) * 0.08;
      svg.setAttribute('viewBox', `${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`);
      svg.removeAttribute('data-fit');
    } catch (e) { }
  });
}

function installedSet(ch) {
  const set = new Set();
  if (ch.scene === 'dirtbike') {
    CHAPTERS.forEach(c => { if (c.scene === 'dirtbike' && c.num < ch.num) c.parts.forEach(p => set.add(p)); });
  }
  prog(ch.id).built.forEach(p => set.add(p));
  return set;
}
function sceneIds(scene) { return scene === 'bicycle' ? CHAPTERS[0].parts : DIRT_PARTS; }
const VIEWBOX = '70 50 860 490';

function sceneSVG(scene, installed, extra = '') {
  return `<svg class="scene" viewBox="${VIEWBOX}" role="img" aria-label="${scene} blueprint">
    ${SCENE_DEFS}
    <g class="parts">${sceneLayers(sceneIds(scene), { classFor: id => installed.has(id) ? 'on' : '' })}</g>
    ${extra}
  </svg>`;
}

function partCard(id) {
  const p = PARTS[id];
  return `<div class="card-head">${thumb(id, 'card-thumb')}<div><div class="eyebrow">Workshop card</div><h2>${p.name}</h2><p class="role">${p.role}</p></div></div>
    <div class="card-body">${p.body}</div>
    <div class="modal-foot"><button class="btn" data-close>Got it</button></div>`;
}
function showPart(id, onClose) { modal(partCard(id), { cls: 'card', onClose }); }

/* --------------------------------------------------------------- HOME */
function renderHome() {
  const any = Object.keys(state.progress).length > 0;
  const all = new Set(DIRT_PARTS);
  setScreen(`
    <section class="home">
      <div class="home-art">${sceneSVG('dirtbike', all)}</div>
      <div class="home-copy">
        <div class="eyebrow">A hands-on workshop game</div>
        <h1>Pedals <span>to</span> Pistons</h1>
        <p class="lead">Learn how a motorcycle really works by building one. Start with a bicycle. Then, part by part, turn it into a four-stroke dirt bike: suspension, engine, fuel, spark, cooling, clutch, and gearbox. Then ride it.</p>
        <ul class="home-points">
          <li><b>9 chapters</b>, each adding one system</li>
          <li><b>40+ parts</b>, each with a workshop card explaining how it works</li>
          <li><b>7 interactive labs</b>: gears, suspension, a four-stroke engine, carb jetting, ignition timing, cooling, clutch</li>
          <li>A <b>physics-based ride</b> where you can stall, lug, and slip the clutch for real</li>
        </ul>
        <div class="btnrow">
          <button class="btn big" id="go">${any ? 'Continue' : 'Start building'} →</button>
          ${any ? '<button class="btn ghost" id="reset">Reset progress</button>' : ''}
        </div>
      </div>
    </section>`);
  document.getElementById('go').onclick = renderMap;
  const r = document.getElementById('reset');
  if (r) r.onclick = () => {
    modal(`<h2>Reset progress?</h2><p>This clears every chapter you've completed.</p><div class="modal-foot"><button class="btn ghost" data-close>Cancel</button><button class="btn danger" id="yes">Reset</button></div>`);
    document.getElementById('yes').onclick = () => { state.progress = {}; save(); renderHome(); };
  };
  document.querySelectorAll('.home-art .part').forEach((p, i) => p.style.animationDelay = (i * 0.03) + 's');
}

/* ---------------------------------------------------------------- MAP */
function renderMap() {
  const doneCount = CHAPTERS.filter(c => isDone(c.id)).length;
  const showScene = isDone('ch1') ? 'dirtbike' : 'bicycle';
  const inst = showScene === 'bicycle' ? new Set(prog('ch1').built) : (() => { const s = new Set(); CHAPTERS.forEach(c => { if (c.scene === 'dirtbike' && isDone(c.id)) c.parts.forEach(p => s.add(p)); }); return s; })();
  setScreen(`
    <header class="topbar"><button class="link" id="home">← Pedals to Pistons</button><div class="pill">${doneCount} / ${CHAPTERS.length} chapters</div></header>
    <section class="map">
      <div class="map-hero">
        <div class="map-art">${sceneSVG(showScene, inst)}</div>
        <div><h1>Your workshop</h1><p class="lead">Each chapter adds a system to your machine. Finish a chapter's quiz to unlock the next one.</p>
        <div class="progress"><span style="width:${doneCount / CHAPTERS.length * 100}%"></span></div></div>
      </div>
      <div class="chapters">
        ${CHAPTERS.map((c, i) => {
          const un = isUnlocked(i), dn = isDone(c.id);
          const pr = state.progress[c.id];
          const started = pr && (pr.built.length || pr.lab);
          return `<button class="chap ${un ? '' : 'locked'} ${dn ? 'done' : ''}" data-i="${i}" ${un ? '' : 'disabled'}>
            <div class="chap-num">${dn ? '✓' : c.num}</div>
            <div class="chap-text"><h3>${c.title}</h3><p>${c.subtitle}</p>
            <div class="chap-meta">${c.ride ? 'Ride' : `${c.parts.length} parts${c.lab ? ' · lab' : ''} · quiz`}${!dn && started ? ' · <i>in progress</i>' : ''}${un ? '' : ' · 🔒 locked'}</div></div>
          </button>`;
        }).join('')}
      </div>
    </section>`);
  document.getElementById('home').onclick = renderHome;
  document.querySelectorAll('.chap').forEach(b => b.onclick = () => openChapter(CHAPTERS[+b.dataset.i].id));
}

/* ------------------------------------------------------------ CHAPTER */
function stepsFor(ch) {
  if (ch.ride) return ['brief', 'ride'];
  return ['brief', 'build'].concat(ch.lab ? ['lab'] : [], ['quiz']);
}
function stepReachable(ch, step) {
  const p = prog(ch.id);
  const built = p.built.length >= ch.parts.length;
  if (step === 'brief' || step === 'build' || step === 'ride') return true;
  if (step === 'lab') return built;
  if (step === 'quiz') return built && (!ch.lab || p.lab);
  return false;
}
function defaultStep(ch) {
  const p = prog(ch.id);
  if (ch.ride) return p.briefed ? 'ride' : 'brief';
  if (p.done) return 'build';
  if (!p.briefed) return 'brief';
  const st = stepsFor(ch).filter(s => stepReachable(ch, s));
  if (p.built.length < ch.parts.length) return 'build';
  if (ch.lab && !p.lab) return 'lab';
  return st[st.length - 1];
}
const STEP_LABEL = { brief: 'Briefing', build: 'Build', lab: 'Lab', quiz: 'Quiz', ride: 'Ride' };

function openChapter(id, step) {
  const ch = CHAPTER_BY_ID[id];
  step = step || defaultStep(ch);
  setScreen(`
    <header class="topbar">
      <button class="link" id="back">← Workshop</button>
      <div class="chap-title"><span class="chip">Chapter ${ch.num}</span> ${ch.title}</div>
      <nav class="stepper">${stepsFor(ch).map((s, i) => `<button class="step ${s === step ? 'on' : ''}" data-s="${s}" ${stepReachable(ch, s) ? '' : 'disabled'}><span>${i + 1}</span>${STEP_LABEL[s]}</button>`).join('')}</nav>
    </header>
    <main class="chapter" id="body"></main>`);
  document.getElementById('back').onclick = renderMap;
  document.querySelectorAll('.step').forEach(b => b.onclick = () => openChapter(id, b.dataset.s));
  const body = document.getElementById('body');
  ({ brief: renderBrief, build: renderBuild, lab: renderLab, quiz: renderQuiz, ride: renderRide })[step](ch, body);
}

function renderBrief(ch, body) {
  body.innerHTML = `<article class="brief">
      <div class="eyebrow">Chapter ${ch.num} · ${ch.subtitle}</div>
      <h1>${ch.title}</h1>
      ${ch.brief}
      <div class="btnrow"><button class="btn big" id="next">${ch.ride ? 'Ride it →' : 'Start building →'}</button></div>
    </article>`;
  document.getElementById('next').onclick = () => { prog(ch.id).briefed = true; save(); openChapter(ch.id, ch.ride ? 'ride' : 'build'); };
}

/* -------------------------------------------------------------- BUILD */
function renderBuild(ch, body) {
  const p = prog(ch.id);
  const inst = installedSet(ch);
  const zoneMarkup = () => ch.parts.filter(id => !inst.has(id)).map(id => {
    const z = PARTS[id].zone;
    return `<g class="zone" data-zone="${id}" transform="translate(${z.x} ${z.y})"><circle r="${z.r}"/><path d="M-6 0H6M0 -6V6"/></g>`;
  }).join('');
  body.innerHTML = `
    <div class="build">
      <div class="stage">
        <div class="stage-svg">${sceneSVG(ch.scene, inst, `<g class="zones">${zoneMarkup()}</g>`)}</div>
        <div class="stage-bar">
          <div class="build-progress"><b id="count"></b> parts fitted</div>
          <button class="btn small ghost" id="hint">💡 Hint</button>
        </div>
      </div>
      <aside class="side">
        <h3>Parts bin</h3>
        <p class="side-help">Drag a part onto its slot, or tap a part and then tap the slot.</p>
        <div class="bin" id="bin"></div>
        <h3>Fitted this chapter</h3>
        <ul class="fitted" id="fitted"></ul>
      </aside>
    </div>
    <div id="done-banner"></div>`;
  const svg = body.querySelector('svg.scene');
  const bin = body.querySelector('#bin');
  let selected = null;

  function refresh() {
    const left = ch.parts.filter(id => !inst.has(id));
    body.querySelector('#count').textContent = `${ch.parts.length - left.length} / ${ch.parts.length}`;
    bin.innerHTML = left.map(id => `<button class="bin-item ${selected === id ? 'sel' : ''}" data-id="${id}">${thumb(id)}<span><b>${PARTS[id].name}</b><small>${PARTS[id].role}</small></span></button>`).join('')
      || '<p class="side-help">Bin empty: everything is fitted!</p>';
    fitThumbs(bin);
    body.querySelector('#fitted').innerHTML = ch.parts.filter(id => inst.has(id)).map(id => `<li><button class="link" data-info="${id}">${PARTS[id].name}</button></li>`).join('') || '<li class="side-help">Nothing yet.</li>';
    body.querySelectorAll('[data-info]').forEach(b => b.onclick = () => showPart(b.dataset.info));
    bin.querySelectorAll('.bin-item').forEach(attachDrag);
    if (!left.length) showDone();
  }

  function showDone() {
    const nextStep = ch.lab ? 'lab' : 'quiz';
    body.querySelector('#done-banner').innerHTML = `<div class="banner"><div><b>${ch.title}: build complete!</b> Click any part on the blueprint to re-read its card.</div>
      <button class="btn" id="to-next">${ch.lab ? 'On to the lab →' : 'Take the quiz →'}</button></div>`;
    body.querySelector('#to-next').onclick = () => openChapter(ch.id, nextStep);
    const st = document.querySelector(`.step[data-s="${nextStep}"]`); if (st) st.disabled = false;
  }

  function svgPoint(cx, cy) {
    const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
  function zoneAt(x, y) {
    let best = null, bd = 1e9;
    svg.querySelectorAll('.zone').forEach(z => {
      const zz = PARTS[z.dataset.zone].zone, dd = Math.hypot(zz.x - x, zz.y - y);
      if (dd <= zz.r + 10 && dd < bd) { bd = dd; best = z.dataset.zone; }
    });
    return best;
  }
  function tryPlace(id, x, y) {
    const part = PARTS[id], z = part.zone;
    const onTarget = Math.hypot(z.x - x, z.y - y) <= z.r + 12;
    if (onTarget) {
      const missing = part.requires.filter(r => !inst.has(r));
      if (missing.length) {
        toast(`The <b>${part.name}</b> mounts onto the <b>${missing.map(m => PARTS[m].name).join(' and ')}</b>. Fit that first.`, 'warn');
        return false;
      }
      install(id); return true;
    }
    const other = zoneAt(x, y);
    if (other) toast(`That slot is for a different part. Hint: ${part.hint}`, 'warn');
    else toast('Drop it onto one of the dashed slots on the blueprint.');
    return false;
  }
  function install(id) {
    inst.add(id); p.built.push(id); save();
    selected = null; svg.classList.remove('placing');
    document.getElementById('toast').className = '';
    svg.querySelectorAll(`.part[data-part="${id}"]`).forEach(g => { g.classList.add('on', 'pop'); });
    const z = svg.querySelector(`.zone[data-zone="${id}"]`); if (z) z.remove();
    refresh();
    showPart(id);
  }

  // dragging
  function attachDrag(item) {
    const id = item.dataset.id;
    item.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY;
      let ghost = null, moved = false, hoverZ = null;
      const move = ev => {
        if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) {
          moved = true;
          ghost = document.createElement('div'); ghost.className = 'drag-ghost';
          ghost.innerHTML = item.querySelector('svg').outerHTML;
          document.body.appendChild(ghost);
          item.classList.add('dragging');
        }
        if (ghost) {
          ghost.style.transform = `translate(${ev.clientX - 45}px, ${ev.clientY - 35}px)`;
          const pt = svgPoint(ev.clientX, ev.clientY), zid = zoneAt(pt.x, pt.y);
          if (zid !== hoverZ) {
            svg.querySelectorAll('.zone.hover').forEach(z => z.classList.remove('hover'));
            if (zid) svg.querySelector(`.zone[data-zone="${zid}"]`).classList.add('hover');
            hoverZ = zid;
          }
        }
      };
      const up = ev => {
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
        item.classList.remove('dragging');
        svg.querySelectorAll('.zone.hover').forEach(z => z.classList.remove('hover'));
        if (ghost) {
          ghost.remove();
          const r = svg.getBoundingClientRect();
          if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
            const pt = svgPoint(ev.clientX, ev.clientY); tryPlace(id, pt.x, pt.y);
          }
        } else {
          selected = selected === id ? null : id;
          bin.querySelectorAll('.bin-item').forEach(b => b.classList.toggle('sel', b.dataset.id === selected));
          svg.classList.toggle('placing', !!selected);
          if (selected) toast(`Now tap where the <b>${PARTS[id].name}</b> goes.`);
        }
      };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    });
  }

  svg.addEventListener('click', e => {
    if (selected) {
      const pt = svgPoint(e.clientX, e.clientY);
      if (tryPlace(selected, pt.x, pt.y)) svg.classList.remove('placing');
      return;
    }
    const g = e.target.closest('.part.on');
    if (g) showPart(g.dataset.part);
  });

  body.querySelector('#hint').onclick = () => {
    const left = ch.parts.filter(id => !inst.has(id));
    if (!left.length) return;
    const ready = left.filter(id => PARTS[id].requires.every(r => inst.has(r)));
    const id = selected && left.includes(selected) ? selected : (ready[0] || left[0]);
    svg.querySelectorAll(`.part[data-part="${id}"]`).forEach(g => { g.classList.add('ghost'); setTimeout(() => g.classList.remove('ghost'), 2600); });
    const z = svg.querySelector(`.zone[data-zone="${id}"]`); if (z) { z.classList.add('hint'); setTimeout(() => z.classList.remove('hint'), 2600); }
    toast(`<b>${PARTS[id].name}</b>: ${PARTS[id].hint}`);
  };

  refresh();
}

/* ---------------------------------------------------------------- LAB */
function renderLab(ch, body) {
  const lab = LABS[ch.lab], p = prog(ch.id);
  const done = new Set(p.labTasks || []);
  body.innerHTML = `
    <div class="lab-head">
      <div><div class="eyebrow">Lab</div><h1>${lab.title}</h1><p class="lead">${lab.intro}</p></div>
      <div class="tasks"><h3>Tasks</h3><ul id="tasks">${lab.tasks.map(t => `<li data-t="${t.id}" class="${done.has(t.id) ? 'ok' : ''}"><span class="tick"></span><span>${t.text}</span></li>`).join('')}</ul>
      <div class="btnrow"><button class="btn" id="cont" ${done.size >= lab.tasks.length || p.lab ? '' : 'disabled'}>Continue to quiz →</button>
      <button class="link small" id="skip">Skip lab</button></div></div>
    </div>
    <div id="lab-root"></div>`;
  const cont = body.querySelector('#cont');
  const ctx = {
    complete(tid) {
      if (done.has(tid)) return;
      done.add(tid); p.labTasks = [...done]; save();
      const li = body.querySelector(`[data-t="${tid}"]`); if (li) { li.classList.add('ok', 'flash'); }
      const t = lab.tasks.find(x => x.id === tid);
      toast('✓ ' + t.text, 'ok');
      if (done.size >= lab.tasks.length) { p.lab = true; save(); cont.disabled = false; cont.classList.add('pulse'); const st = document.querySelector('.step[data-s="quiz"]'); if (st) st.disabled = false; }
    }
  };
  cleanup = lab.mount(body.querySelector('#lab-root'), ctx);
  cont.onclick = () => openChapter(ch.id, 'quiz');
  body.querySelector('#skip').onclick = () => { p.lab = true; save(); openChapter(ch.id, 'quiz'); };
}

/* --------------------------------------------------------------- QUIZ */
function renderQuiz(ch, body) {
  const queue = ch.quiz.map((_, i) => i);
  let firstTry = 0, answered = 0;
  const total = ch.quiz.length;
  function show() {
    if (!queue.length) return finish();
    const qi = queue[0], q = ch.quiz[qi];
    body.innerHTML = `<div class="quiz">
      <div class="quiz-top"><div class="eyebrow">Quiz · ${ch.title}</div><div class="progress"><span style="width:${(total - queue.length) / total * 100}%"></span></div></div>
      <h2>${q.q}</h2>
      <div class="opts">${q.options.map((o, i) => `<button class="opt" data-i="${i}"><span class="key">${'ABCD'[i]}</span>${o}</button>`).join('')}</div>
      <div class="feedback" id="fb"></div>
    </div>`;
    body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      const i = +b.dataset.i, ok = i === q.answer;
      body.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.i === q.answer) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      queue.shift();
      if (ok) { if (!q._missed) firstTry++; } else { q._missed = true; queue.push(qi); }
      answered++;
      body.querySelector('#fb').innerHTML = `<div class="fb ${ok ? 'ok' : 'bad'}"><b>${ok ? 'Correct!' : 'Not quite.'}</b> ${q.explain}${ok ? '' : ' <i>You\'ll get this one again at the end.</i>'}</div>
        <button class="btn" id="nx">${queue.length ? 'Next question →' : 'Finish'}</button>`;
      body.querySelector('#nx').onclick = show;
      body.querySelector('#nx').focus();
    });
  }
  function finish() {
    ch.quiz.forEach(q => delete q._missed);
    const p = prog(ch.id); p.quiz = true; p.done = true; save();
    const idx = CHAPTERS.indexOf(ch), next = CHAPTERS[idx + 1];
    body.innerHTML = `<div class="quiz done">
      <div class="big-tick">✓</div>
      <h1>Chapter ${ch.num} complete!</h1>
      <p class="lead">${firstTry} of ${total} right first time.${firstTry === total ? ' Flawless!' : ' Every one answered correctly in the end.'}</p>
      ${next ? `<p>Unlocked: <b>Chapter ${next.num}: ${next.title}</b>. ${next.subtitle}.</p>` : ''}
      <div class="btnrow">${next ? `<button class="btn big" id="nextc">Start Chapter ${next.num} →</button>` : ''}<button class="btn ghost" id="map">Back to workshop</button></div>
    </div>`;
    if (next) body.querySelector('#nextc').onclick = () => openChapter(next.id);
    body.querySelector('#map').onclick = renderMap;
  }
  show();
}

/* --------------------------------------------------------------- RIDE */
function renderRide(ch, body) {
  body.innerHTML = `<div id="ride-root"></div>`;
  cleanup = mountRide(body.querySelector('#ride-root'), {
    onFinish(r) {
      const medal = r.stalls === 0 && r.time <= 55 ? 'gold' : r.stalls <= 2 && r.time <= 90 ? 'silver' : 'bronze';
      const p = prog(ch.id); p.done = true;
      p.best = p.best && p.best.time < r.time ? p.best : r; save();
      modal(`<div class="cert ${medal}">
        <div class="medal">${{ gold: '🥇', silver: '🥈', bronze: '🥉' }[medal]}</div>
        <div class="eyebrow">Certificate of completion</div>
        <h1>Dirt-bike mechanic</h1>
        <p class="lead">You built a dirt bike from a bicycle up, learned what every part does, and rode it across the test track.</p>
        <div class="stats">
          <div><b>${r.time.toFixed(1)} s</b><span>time</span></div>
          <div><b>${r.stalls}</b><span>stalls</span></div>
          <div><b>${r.limiter.toFixed(1)} s</b><span>on the limiter</span></div>
          <div><b>${r.box ? 'Yes!' : 'No'}</b><span>stopped in the box</span></div>
        </div>
        <p class="small">${medal === 'gold' ? 'Gold: clean and quick, a real rider.' : 'For gold: finish under 55 s with zero stalls. Tip: shift down before the climbs, and keep some throttle on as the clutch comes out.'}</p>
        <div class="modal-foot"><button class="btn ghost" id="again">Ride again</button><button class="btn" id="home2">Back to workshop</button></div>
      </div>`, { dismissable: false });
      document.getElementById('again').onclick = () => openChapter(ch.id, 'ride');
      document.getElementById('home2').onclick = renderMap;
    }
  });
}

renderHome();
