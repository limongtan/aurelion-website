(() => {
'use strict';
const url = new URL(location.href);
const world = url.searchParams.get('world');
if (['space','city','interface','lab','warp','liquid'].includes(world)) { location.replace('/website/immersive.html?world=' + encodeURIComponent(world)); return; }

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- Fusion Lab data ---------- */
const FUSION = [
  {slug:'cohort', no:'F-01', name:'Cohort', a:'Swiss Grid', b:'Game HUD', aud:'ld', audL:'L&D', size:'big',
   pitch:'A learning-experience studio whose site plays like a level select. Unlock the skill tree, take the quiz, build a programme live.', c:['#f2f0e9','#111111','#ff3b1f','#111']},
  {slug:'nova-cut', no:'F-03', name:'NOVA/CUT', a:'Y2K Chrome', b:'Bento Dashboard', aud:'creator', audL:'Creator', size:'',
   pitch:'A creator media kit that sells itself: live platform stats and a rate card that totals as brands click.', c:['#07060c','#1a0f2e','#ff2ea6','#f2f0ff']},
  {slug:'mira-os', no:'F-05', name:'MIRA.OS', a:'Neo-Brutalism', b:'Retro Desktop', aud:'freelance', audL:'Freelancer', size:'',
   pitch:'A designer portfolio that boots up like an operating system. Drag the windows, open the projects, run hire_me.exe.', c:['#f4f1ea','#2b3cff','#e4ff3a','#0d0d0d']},
  {slug:'northbeam', no:'F-08', name:'Northbeam', a:'Cinematic Title', b:'Live Dashboard', aud:'business', audL:'Business', size:'wide',
   pitch:'Freight software with the presence of a film opening. Animated route maps, live KPIs and an instant quote engine.', c:['#06080b','#0b1a22','#16e6cb','#e6eef2']},
  {slug:'facilitators-table', no:'F-02', name:"The Facilitator's Table", a:'Editorial Magazine', b:'Warm Analog', aud:'ld', audL:'L&D', size:'wide',
   pitch:'An independent trainer’s site that reads like a beautiful magazine and closes like a sales team: workshop finder, ROI calculator, live booking.', c:['#f4ecdc','#20402f','#c4562d','#1f2a22']},
  {slug:'kai-dev', no:'F-06', name:'kai@dev', a:'Hacker Terminal', b:'Glassmorphism', aud:'freelance', audL:'Freelancer', size:'',
   pitch:'A developer portfolio you can actually type into. Real commands, flip-card case studies and a bookable availability calendar.', c:['#060b1f','#1b2a6b','#5ef2d6','#e8eefc']},
  {slug:'low-frequency', no:'F-04', name:'Low Frequency', a:'CRT Terminal', b:'Audio App', aud:'creator', audL:'Creator', size:'',
   pitch:'A late-night podcast in glowing phosphor amber. Live waveform player, chapter jumps and an episode deck that loads on click.', c:['#050403','#1a1206','#ffb23f','#ffb23f']},
  {slug:'forge-field', no:'F-07', name:'Forge & Field', a:'Risograph Print', b:'E-commerce', aud:'business', audL:'Business', size:'',
   pitch:'A coffee roaster with print-shop soul. Tap the flavour wheel, build a subscription and watch the price per cup update live.', c:['#f3ecdc','#2c4bdc','#ff3fa4','#1f1d36']},
  {slug:'harbour-lane', no:'F-09', name:'Harbour Lane 港巷', a:'Neon Noir', b:'Swiss Listings', aud:'business', audL:'Business · HK', size:'wide',
   pitch:'A Hong Kong property boutique under a flickering neon sign. Bilingual toggle, live property finder and mortgage maths.', c:['#0a1230','#16204a','#ff2e88','#19e3d1']},
  {slug:'sabai', no:'F-10', name:'Sabai', a:'Biomorphic', b:'Brutalist Timetable', aud:'creator', audL:'Creator · Freelancer', size:'wide',
   pitch:'A yoga and breathwork teacher’s studio online. Breathe along with the living blob, filter the timetable, pick a membership.', c:['#efe6d6','#a9b89a','#c9774f','#141310']},
];
const AUD = {
  business:{label:'Businesses', also:'freelance', halls:['Business','Hospitality','Retail','Technology']},
  creator:{label:'Content creators', halls:['Lifestyle','Culture','Immersive']},
  freelance:{label:'Freelancers', halls:['Culture','Business','Immersive']},
  ld:{label:'L&D professionals', halls:['Business','Culture','Technology']},
};

/* ---------- Nav, progress, menu ---------- */
const nav = $('.ex-nav'), prog = $('.ex-progress');
const onScroll = () => {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  nav.classList.toggle('scrolled', y > 30);
  prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
};
addEventListener('scroll', onScroll, {passive:true}); onScroll();
const burger = $('.ex-burger'), menu = $('.ex-menu');
burger?.addEventListener('click', () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); burger.textContent = o ? 'Close' : 'Menu'; });
$$('.ex-menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); burger.textContent = 'Menu'; }));
const navLinks = $$('.ex-links a');
const secObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), {rootMargin:'-45% 0px -50% 0px'});
navLinks.forEach(a => { const t = $(a.getAttribute('href')); t && secObs.observe(t); });

/* ---------- Hero field (interactive dot matrix) ---------- */
const cv = $('#ex-field');
if (cv) {
  const ctx = cv.getContext('2d');
  let W, H, dpr, pts = [], mx = -9999, my = -9999, tx = -9999, ty = -9999, run = true, t0 = 0;
  const build = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const gap = W < 700 ? 26 : 32; pts = [];
    for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2; x < W; x += gap) pts.push({x, y, o: Math.random() * 6.28});
  };
  const draw = t => {
    if (!run) return;
    mx += (tx - mx) * .12; my += (ty - my) * .12;
    ctx.clearRect(0, 0, W, H);
    const R = Math.min(260, W * .3), tt = t * .001;
    for (const p of pts) {
      const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
      const f = d < R ? (1 - d / R) : 0;
      const wave = Math.sin(tt + p.o + p.x * .004) * .5 + .5;
      const px = p.x + (f ? dx / d * f * 22 : 0), py = p.y + (f ? dy / d * f * 22 : 0);
      const r = .7 + wave * .5 + f * 2.2;
      ctx.fillStyle = f > .02 ? `rgba(247,${165 - f * 60 | 0},${49 + f * 20 | 0},${.25 + f * .75})` : `rgba(255,255,255,${.06 + wave * .07})`;
      ctx.beginPath(); ctx.arc(px, py, r, 0, 6.283); ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  build(); addEventListener('resize', () => { clearTimeout(cv._t); cv._t = setTimeout(build, 150); });
  const hero = $('.ex-hero');
  hero.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; if (mx < -999) { mx = tx; my = ty; } });
  hero.addEventListener('pointerleave', () => { tx = ty = -9999; });
  if (reduce) { run = true; draw(0); run = false; }
  else { new IntersectionObserver(([e]) => { const was = run; run = e.isIntersecting; if (run && !was) requestAnimationFrame(draw); }).observe(hero); requestAnimationFrame(draw); }
}

/* ---------- Typed rotor ---------- */
const rot = $('[data-type]');
if (rot) {
  const lines = JSON.parse(rot.dataset.type); let i = 0;
  if (reduce) rot.textContent = lines[0];
  else (async function loop() {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    for (;;) {
      const s = lines[i++ % lines.length];
      for (let k = 1; k <= s.length; k++) { rot.textContent = s.slice(0, k); await sleep(28 + Math.random() * 30); }
      await sleep(2300);
      for (let k = s.length; k >= 0; k--) { rot.textContent = s.slice(0, k); await sleep(12); }
      await sleep(250);
    }
  })();
}

/* ---------- Counters ---------- */
const countUp = el => {
  const end = +el.dataset.count, suf = el.dataset.suffix || '';
  if (reduce) { el.textContent = end + suf; return; }
  const t0 = performance.now(), dur = 1400;
  const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(end * e) + suf; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};

/* ---------- Reveal ---------- */
const rvObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); rvObs.unobserve(e.target);
  $$('[data-count]', e.target).forEach(countUp);
}), {threshold:.12});
const reveal = () => $$('.rv:not(.in)').forEach(el => rvObs.observe(el));

/* ---------- Pointer spotlight on cards ---------- */
document.addEventListener('pointermove', e => {
  const c = e.target.closest?.('.aud,.design-card,.hall');
  if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
}, {passive:true});

/* ---------- Collection: gather cards ---------- */
const grid = $('.design-grid');
const cards = $$('.design-card', grid);
const ITEMS = cards.map((card, i) => {
  const a = $('.design-preview', card), mini = $('.mini-design', card);
  const no = 'EXH ' + String(i + 1).padStart(3, '0');
  const tag = document.createElement('span'); tag.className = 'exh-no'; tag.textContent = no; card.prepend(tag);
  const sw = mini?.style.getPropertyValue('--paper') || mini?.style.getPropertyValue('--bg') || '';
  const acc = mini?.style.getPropertyValue('--accent') || '';
  return {kind:'card', el:card, href:a.getAttribute('href'), name:$('h3', card).textContent.trim(), type:$('.design-caption p', card)?.textContent.trim() || '',
          cat:card.dataset.category, no, swatch: sw && acc ? `linear-gradient(135deg,${sw} 50%,${acc} 50%)` : 'linear-gradient(135deg,#2a2a33,#f7a531)'};
});
const FITEMS = FUSION.map(f => ({kind:'fusion', href:'fusion/' + f.slug + '.html', name:f.name, type:`${f.a} × ${f.b}`, cat:'Fusion Lab', no:'EXH ' + f.no, aud:f.aud, swatch:`linear-gradient(135deg,${f.c[0]} 50%,${f.c[2]} 50%)`, f}));
document.querySelectorAll('.mini-design>img').forEach(img => img.addEventListener('error', () => { img.hidden = true; img.parentElement.classList.add('image-unavailable'); }));

/* ---------- Fusion Lab render ---------- */
const fxGrid = $('.fx-grid');
fxGrid.innerHTML = FUSION.map((f, i) => `
  <article class="fx rv ${f.size}" tabindex="0" role="button" data-i="${i}" data-aud="${f.aud}" aria-label="Preview ${esc(f.name)}" style="--c1:${f.c[0]};--c2:${f.c[1]};--c3:${f.c[2]};--c4:${f.c[3]};--glow:${f.c[2]}88;transition-delay:${(i % 4) * 60}ms">
    <div class="fx-screen"><div class="fx-poster">${esc(f.name)}</div><iframe tabindex="-1" aria-hidden="true" scrolling="no" loading="lazy" data-src="fusion/${f.slug}.html" title=""></iframe>
      <div class="fx-tag"><span class="mono">EXH ${f.no}</span><span class="mono">${esc(f.audL)}</span></div>
      <span class="fx-play">Step inside <span aria-hidden="true">→</span></span></div>
    <div class="fx-body"><span class="mono formula">${esc(f.a)} × ${esc(f.b)}</span><h3>${esc(f.name)}</h3><p>${esc(f.pitch)}</p></div>
  </article>`).join('');
const fxEls = $$('.fx', fxGrid);
const fitFrame = (scr, ifr) => { const s = scr.clientWidth / 1440; ifr.style.transform = `scale(${s}) translateY(-36px)`; ifr.style.height = Math.ceil(scr.clientHeight / s + 36) + "px"; };
const ro = new ResizeObserver(es => es.forEach(e => { const f = $('iframe', e.target); f && fitFrame(e.target, f); }));
const ifObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const scr = e.target, f = $('iframe', scr); ifObs.unobserve(scr);
  f.addEventListener('load', () => { f.classList.add('ready'); try { f.contentWindow.scrollTo(0, 0); } catch (_) {} }, {once:true});
  f.src = f.dataset.src; fitFrame(scr, f); ro.observe(scr);
}), {rootMargin:'300px'});
fxEls.forEach(el => {
  ifObs.observe($('.fx-screen', el));
  const open = () => openViewer(FITEMS, +el.dataset.i);
  el.addEventListener('click', open);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  if (!reduce && matchMedia('(hover:hover)').matches) {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(1100px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  }
});

/* ---------- Audience selector ---------- */
const auds = $$('.aud'), note = $('.aud-note');
let curAud = null;
const setAud = k => {
  curAud = curAud === k ? null : k;
  auds.forEach(a => { a.classList.toggle('on', a.dataset.aud === curAud); a.setAttribute('aria-pressed', a.dataset.aud === curAud); });
  fxEls.forEach(el => el.classList.toggle('dimmed', !!curAud && el.dataset.aud !== curAud && !(curAud === 'freelance' && el.dataset.aud === 'creator' && FUSION[+el.dataset.i].slug === 'sabai')));
  if (!curAud) { note.innerHTML = 'Pick a lane above. The Fusion Lab below lights up the builds made for you.'; return; }
  const n = fxEls.filter(el => !el.classList.contains('dimmed')).length, A = AUD[curAud];
  note.innerHTML = `<b>${n} fusion builds</b> lit up for ${A.label.toLowerCase()}. Also worth a walk: ${A.halls.map(h => `<button type="button" data-hall="${h}">${h}</button>`).join(' · ')} <button type="button" data-clear>Show everything ×</button>`;
};
auds.forEach(a => a.addEventListener('click', () => { setAud(a.dataset.aud); if (curAud) $('#fusion').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}); }));
note.addEventListener('click', e => { const h = e.target.closest('[data-hall]'); if (h) goHall(h.dataset.hall); if (e.target.closest('[data-clear]')) { curAud = curAud; setAud(curAud); } });

/* ---------- Filters ---------- */
const buttons = $$('.filter[data-category]'), search = $('#design-search'), countEl = $('#gallery-count'), empty = $('.empty-state');
const match = (card, c) => c === 'all' || card.dataset.category === c || card.dataset.mood === c || card.dataset.style === c;
buttons.forEach(b => { const n = b.dataset.category === 'all' ? cards.length : cards.filter(c => match(c, b.dataset.category)).length; b.insertAdjacentHTML('beforeend', ` <sup>${n}</sup>`); });
let category = 'all';
const visible = () => ITEMS.filter(it => !it.el.hidden);
function filterDesigns(animate = true) {
  const q = search.value.trim().toLowerCase(); let shown = 0;
  for (const card of cards) {
    const show = match(card, category) && card.dataset.search.includes(q);
    if (card.hidden === show) { card.hidden = !show; if (show && animate) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; } }
    if (show) shown++;
  }
  const lbl = category === 'all' ? 'the whole exhibition' : (buttons.find(b => b.dataset.category === category)?.firstChild.textContent.trim() || category);
  countEl.innerHTML = `Showing <b>${shown}</b> ${shown === 1 ? 'exhibit' : 'exhibits'} · ${esc(lbl)}${q ? ` · “${esc(q)}”` : ''}`;
  empty.hidden = shown > 0;
}
const setCat = (c, push = true) => {
  category = c;
  buttons.forEach(x => { const on = x.dataset.category === c; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on); if (on) x.scrollIntoView({block:'nearest', inline:'center', behavior:'smooth'}); });
  filterDesigns();
  if (push) { const u = new URL(location.href); c === 'all' ? u.searchParams.delete('category') : u.searchParams.set('category', c); history.replaceState(null, '', u.pathname + u.search + '#collection'); }
};
buttons.forEach(b => b.addEventListener('click', () => setCat(b.dataset.category)));
search.addEventListener('input', () => filterDesigns(false));
const goHall = h => { const b = buttons.find(x => x.dataset.category === h); if (b) setCat(h); $('#collection').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}); };

/* ---------- Halls ---------- */
const HALLS = [
  ['Business','Studios, firms, clinics, agencies','#f7a531'],['Hospitality','Hotels, restaurants, cafés','#ff6a3d'],['Retail','Shops, brands, product drops','#ff3d7f'],
  ['Lifestyle','Wellness, travel, personal brands','#c8f169'],['Culture','Galleries, books, music, events','#b28cff'],['Technology','SaaS, AI, fintech, devtools','#7cc4ff'],
  ['Immersive','Six worlds you can walk through','#19e3d0'],['Hong Kong','香港生活感 · street-level stories','#ff4fa3'],['Taiwan','台灣生活感 · tea, old houses, slow travel','#9fe3a4'],
  ['Blue Spring','藍色春日 · six light-blue concepts','#8fc7ff'],['Modern Mix','摩登生活組合 · urban lifestyle blends','#ffd27a']];
$('.ex-halls').innerHTML = `<button class="hall rv" type="button" data-hall="fusion" style="--hc:#f7a531"><span class="cnt">${FUSION.length}</span><span class="mono">Hall F · New</span><div><b>Fusion Lab</b><br><small>Two styles in, one site out</small></div></button>` +
  HALLS.map(([h, d, c], i) => { const n = cards.filter(x => match(x, h)).length; return `<button class="hall rv" type="button" data-hall="${h}" style="--hc:${c};transition-delay:${(i % 6) * 40}ms"><span class="cnt">${n}</span><span class="mono">Hall ${String(i + 1).padStart(2, '0')}</span><div><b>${esc(buttons.find(b => b.dataset.category === h)?.firstChild.textContent.trim() === h ? h : (h))}</b><br><small>${esc(d)}</small></div></button>`; }).join('');
$$('.hall').forEach(b => b.addEventListener('click', () => b.dataset.hall === 'fusion' ? $('#fusion').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}) : goHall(b.dataset.hall)));

/* ---------- View toggle + surprise ---------- */
$$('.ex-viewset button').forEach(b => b.addEventListener('click', () => {
  $$('.ex-viewset button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
  grid.classList.toggle('compact', b.dataset.view === 'compact');
  try { localStorage.setItem('ex-view', b.dataset.view); } catch (_) {}
}));
try { if (localStorage.getItem('ex-view') === 'compact') $('.ex-viewset [data-view="compact"]').click(); } catch (_) {}
$('.ex-surprise').addEventListener('click', () => { const v = visible(); if (v.length) openViewer(v, Math.floor(Math.random() * v.length)); });

/* intercept card clicks → viewer (modifier-click still opens normally) */
grid.addEventListener('click', e => {
  const a = e.target.closest('a'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  const card = a.closest('.design-card'); if (!card) return;
  e.preventDefault();
  const v = visible(); openViewer(v, v.findIndex(it => it.el === card));
});

/* ---------- Viewer ---------- */
const vw = $('.ex-viewer'), vFrame = $('.vw-frame'), vIfr = $('.vw-frame iframe'), vStage = $('.vw-stage');
let vList = [], vI = 0, lastFocus = null;
function openViewer(list, i) {
  if (!list.length || i < 0) return;
  vList = list; lastFocus = document.activeElement;
  vw.classList.add('open'); vw.setAttribute('aria-hidden', 'false'); document.documentElement.style.overflow = 'hidden';
  showV(i); setTimeout(() => $('.vw-close').focus(), 50);
}
function showV(i) {
  vI = (i + vList.length) % vList.length; const it = vList[vI];
  $('.vw-meta .mono').textContent = `${it.no} · ${it.cat}${it.type ? ' · ' + it.type : ''}`;
  $('.vw-meta b').textContent = it.name;
  $('.vw-open').href = it.href; $('.vw-count').textContent = `${vI + 1} / ${vList.length}`;
  vStage.classList.add('busy'); vFrame.classList.add('loading');
  vIfr.src = it.href;
  history.replaceState(null, '', location.pathname + location.search + '#view=' + encodeURIComponent(it.href));
}
vIfr.addEventListener('load', () => { vStage.classList.remove('busy'); vFrame.classList.remove('loading'); });
function closeViewer() {
  vw.classList.remove('open'); vw.setAttribute('aria-hidden', 'true'); document.documentElement.style.overflow = '';
  setTimeout(() => { if (!vw.classList.contains('open')) vIfr.src = 'about:blank'; }, 400);
  history.replaceState(null, '', location.pathname + location.search);
  lastFocus?.focus?.({preventScroll:true});
}
$('.vw-close').addEventListener('click', closeViewer);
$('.vw-prev').addEventListener('click', () => showV(vI - 1));
$('.vw-next').addEventListener('click', () => showV(vI + 1));
$$('.vw-dev button').forEach(b => b.addEventListener('click', () => {
  $$('.vw-dev button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
  vFrame.className = 'vw-frame ' + (b.dataset.dev === 'desktop' ? '' : b.dataset.dev);
}));
/* swipe on the bar area for touch */
let sx = null; vStage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
vStage.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 70) showV(vI + (dx < 0 ? 1 : -1)); sx = null; });

/* ---------- Command palette ---------- */
const pal = $('.ex-pal'), pIn = $('.pal-box input'), pList = $('.pal-list');
const ALL = [...FITEMS, ...ITEMS];
let pRes = [], pSel = 0;
const renderPal = () => {
  const q = pIn.value.trim().toLowerCase();
  pRes = (q ? ALL.filter(it => (it.name + ' ' + it.type + ' ' + it.cat + ' ' + (it.el?.dataset.search || '') + ' ' + (it.f ? it.f.pitch + ' ' + it.f.audL : '')).toLowerCase().includes(q)) : ALL).slice(0, 40);
  pSel = Math.min(pSel, Math.max(0, pRes.length - 1));
  pList.innerHTML = pRes.length ? pRes.map((it, i) => `<button class="pal-item${i === pSel ? ' on' : ''}" data-i="${i}" role="option" aria-selected="${i === pSel}"><i style="--pc:${it.swatch}"></i><span><b>${esc(it.name)}</b><small>${esc(it.cat)}${it.type ? ' · ' + esc(it.type) : ''}</small></span><span class="mono">${esc(it.no)}</span></button>`).join('')
    : `<p style="padding:24px;color:var(--mut);margin:0">Nothing in the exhibition matches that. Yet. <a href="/contact.html" style="color:var(--sun)">Commission it →</a></p>`;
  $('.pal-item.on', pList)?.scrollIntoView({block:'nearest'});
};
const openPal = () => { pal.classList.add('open'); pal.setAttribute('aria-hidden', 'false'); pIn.value = ''; pSel = 0; renderPal(); setTimeout(() => pIn.focus(), 30); };
const closePal = () => { pal.classList.remove('open'); pal.setAttribute('aria-hidden', 'true'); };
const pickPal = i => { const it = pRes[i]; if (!it) return; closePal(); openViewer(pRes, i); };
$$('[data-open-pal]').forEach(b => b.addEventListener('click', openPal));
pIn.addEventListener('input', () => { pSel = 0; renderPal(); });
pList.addEventListener('click', e => { const b = e.target.closest('.pal-item'); if (b) pickPal(+b.dataset.i); });
pal.addEventListener('click', e => { if (e.target === pal) closePal(); });

/* ---------- Keyboard ---------- */
document.addEventListener('keydown', e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing && !vw.classList.contains('open'))) { e.preventDefault(); pal.classList.contains('open') ? closePal() : openPal(); return; }
  if (pal.classList.contains('open')) {
    if (e.key === 'Escape') closePal();
    else if (e.key === 'ArrowDown') { e.preventDefault(); pSel = Math.min(pRes.length - 1, pSel + 1); renderPal(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); pSel = Math.max(0, pSel - 1); renderPal(); }
    else if (e.key === 'Enter') { e.preventDefault(); pickPal(pSel); }
    return;
  }
  if (vw.classList.contains('open')) {
    if (e.key === 'Escape') closeViewer();
    else if (e.key === 'ArrowRight') showV(vI + 1);
    else if (e.key === 'ArrowLeft') showV(vI - 1);
    else if (e.key === 'Tab') { const f = $$('button,a[href]', vw).filter(x => x.offsetParent); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  }
});

/* ---------- Boot ---------- */
reveal();
const requested = url.searchParams.get('category');
const reqBtn = requested && buttons.find(b => b.dataset.category.toLowerCase() === requested.toLowerCase());
if (reqBtn) setCat(reqBtn.dataset.category, false); else filterDesigns(false);
const vh = location.hash.match(/^#view=(.+)$/);
if (vh) { const href = decodeURIComponent(vh[1]); const i = ALL.findIndex(it => it.href === href); if (i >= 0) openViewer(ALL, i); }
else if (location.hash === '#collection' || reqBtn) {
  const jump = () => { document.documentElement.style.scrollBehavior = 'auto'; $('#collection').scrollIntoView(); document.documentElement.style.scrollBehavior = ''; };
  let touched = false; ['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, () => { touched = true; }, {once:true, passive:true}));
  requestAnimationFrame(jump);
  addEventListener('load', () => { if (!touched) jump(); }, {once:true});
}
})();
