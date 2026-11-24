(() => {
'use strict';
const url = new URL(location.href);
const world = url.searchParams.get('world');
if (['space','city','interface','lab','warp','liquid'].includes(world)) { location.replace('/website/immersive.html?world=' + encodeURIComponent(world)); return; }

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = () => reduce ? 'auto' : 'smooth';

/* ---------- Fusion Lab data ---------- */
const FUSION = [
  {slug:'harbour-lane', no:'F-09', name:'Harbour Lane 港巷', a:'Neon Noir', b:'Swiss Listings', aud:'sme', audL:'SME · Property',
   pitch:'A Hong Kong property boutique under a flickering neon sign. Bilingual toggle, live property finder and mortgage maths.', c:['#0a1230','#16204a','#ff2e88','#19e3d1']},
  {slug:'forge-field', no:'F-07', name:'Forge & Field', a:'Risograph Print', b:'E-commerce', aud:'sme', audL:'SME · Retail',
   pitch:'A coffee roaster with print-shop soul. Tap the flavour wheel, build a subscription, watch the price per cup update live.', c:['#f3ecdc','#2c4bdc','#ff3fa4','#1f1d36']},
  {slug:'masjid', no:'F-11', name:'Masjid Al-Ihsan', a:'Islamic Geometry', b:'Contemporary Swiss', aud:'sme', audL:'Community · Mosque',
   pitch:'A contemporary mosque template: live prayer times and countdown, BM/EN toggle, programme timetable, infaq and facility booking.', c:['#f6f1e7','#0f3b36','#b8893b','#13201e']},
  {slug:'northbeam', no:'F-08', name:'Northbeam', a:'Cinematic Title', b:'Live Dashboard', aud:'sme', audL:'SME · B2B',
   pitch:'Freight software with the presence of a film opening. Animated route maps, live KPIs and an instant quote engine.', c:['#06080b','#0b1a22','#16e6cb','#e6eef2']},
  {slug:'cohort', no:'F-01', name:'Cohort', a:'Swiss Grid', b:'Game HUD', aud:'ld', audL:'L&D',
   pitch:'A learning-experience studio whose site plays like a level select. Unlock the skill tree, take the quiz, build a programme.', c:['#f2f0e9','#111111','#ff3b1f','#111']},
  {slug:'facilitators-table', no:'F-02', name:"The Facilitator's Table", a:'Editorial Magazine', b:'Warm Analog', aud:'ld', audL:'L&D',
   pitch:'An independent trainer’s site that reads like a magazine and closes like a sales team: workshop finder, ROI calculator, booking.', c:['#f4ecdc','#20402f','#c4562d','#1f2a22']},
  {slug:'nova-cut', no:'F-03', name:'NOVA/CUT', a:'Y2K Chrome', b:'Bento Dashboard', aud:'creator', audL:'Creator',
   pitch:'A creator media kit that sells itself: live platform stats and a rate card that totals as brands click.', c:['#07060c','#1a0f2e','#ff2ea6','#f2f0ff']},
  {slug:'low-frequency', no:'F-04', name:'Low Frequency', a:'CRT Terminal', b:'Audio App', aud:'creator', audL:'Creator',
   pitch:'A late-night podcast in phosphor amber. Live waveform player, chapter jumps and an episode deck that loads on click.', c:['#050403','#1a1206','#ffb23f','#ffb23f']},
  {slug:'sabai', no:'F-10', name:'Sabai', a:'Biomorphic', b:'Brutalist Timetable', aud:'creator', audL:'Creator · Wellness',
   pitch:'A yoga and breathwork teacher’s studio online. Breathe with the living blob, filter the timetable, pick a membership.', c:['#efe6d6','#a9b89a','#c9774f','#141310']},
  {slug:'mira-os', no:'F-05', name:'MIRA.OS', a:'Neo-Brutalism', b:'Retro Desktop', aud:'freelance', audL:'Freelancer',
   pitch:'A designer portfolio that boots up like an operating system. Drag the windows, open the projects, run hire_me.exe.', c:['#f4f1ea','#2b3cff','#e4ff3a','#0d0d0d']},
  {slug:'kai-dev', no:'F-06', name:'kai@dev', a:'Hacker Terminal', b:'Glassmorphism', aud:'freelance', audL:'Freelancer',
   pitch:'A developer portfolio you can actually type into. Real commands, flip-card case studies, a bookable availability calendar.', c:['#060b1f','#1b2a6b','#5ef2d6','#e8eefc']},
];

/* SME industry picker */
const SME = [
  {k:'fnb', label:'F&B · Cafés', title:'Restaurants, cafés & kopitiams', blurb:'Hungry people decide in seconds, on their phone. We make sure they decide on you.',
   feats:['Menu that loads instantly, with photos and prices','Table bookings and WhatsApp orders in one tap','Google Maps, hours and reviews front and centre','Promo pages for festive menus and set lunches'], ex:['demos/ember.html','demos/crumb.html','regional/hk-everyday-diner.html']},
  {k:'retail', label:'Retail · E-commerce', title:'Shops, brands & online stores', blurb:'A storefront that sells while you sleep, not a catalogue nobody finishes.',
   feats:['Online shop with cart, stock and checkout','Product finders and bundles that raise basket size','Subscriptions and repeat orders','Launch pages for new drops and sales'], ex:['fusion/forge-field.html','demos/forma.html','demos/carry.html']},
  {k:'clinic', label:'Clinics · Wellness', title:'Clinics, studios & wellness', blurb:'Trust is earned before the first appointment. Your site should feel like your best front desk.',
   feats:['Online appointment and class booking','Practitioner profiles and treatment pages','Bilingual FAQs that cut repeat calls','Memberships and packages'], ex:['fusion/sabai.html','demos/balance.html','demos/solace.html']},
  {k:'pro', label:'Professional services', title:'Law, accounting & consulting firms', blurb:'Clients shortlist you on credibility. We make credibility visible in five seconds.',
   feats:['Sharp positioning and service pages','Case studies and proof that close deals','Enquiry funnels and quote calculators','Team pages that show real expertise'], ex:['demos/counsel.html','demos/ledger.html','demos/meridian.html']},
  {k:'property', label:'Property · Construction', title:'Property, interiors & construction', blurb:'Big-ticket buyers browse for weeks. Give them a site worth coming back to.',
   feats:['Listing finder with filters and saved homes','Mortgage and budget calculators','Project galleries and floor plans','Viewing requests straight to WhatsApp'], ex:['fusion/harbour-lane.html','demos/atelier.html','demos/shelter.html']},
  {k:'training', label:'Training · Education', title:'Training providers & educators', blurb:'HR leads compare providers side by side. Be the one with the clearest answer.',
   feats:['Programme finder and course calendar','Training ROI calculators for HR buyers','Cohort and in-house booking flows','Learning journeys that show outcomes'], ex:['fusion/cohort.html','fusion/facilitators-table.html','demos/people-first.html']},
  {k:'b2b', label:'Logistics · B2B', title:'Logistics, manufacturing & B2B', blurb:'Your buyers are serious. Your website should look like you are too.',
   feats:['Instant quote engines','Capability and network pages','Lead capture that routes to the right team','Dashboards and data storytelling'], ex:['fusion/northbeam.html','demos/vector.html','demos/stack.html']},
  {k:'community', label:'Mosques · Community', title:'Mosques, churches & community groups', blurb:'A digital front door for your community: timely, welcoming and easy to run.',
   feats:['Live prayer or service times','Programme and class timetables','Donations with your official QR','Hall and facility booking in BM / EN / 中文'], ex:['fusion/masjid.html','demos/common-ground.html','demos/good-question.html']},
];

/* ---------- Nav ---------- */
const nav = $('.ex-nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll, {passive:true}); onScroll();
const burger = $('.ex-burger'), menu = $('.ex-menu');
const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.textContent = o ? 'Close' : 'Menu'; };
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('.ex-menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
const navLinks = $$('.ex-links a');
const secObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), {rootMargin:'-45% 0px -50% 0px'});
navLinks.forEach(a => { const t = $(a.getAttribute('href')); t && secObs.observe(t); });

/* ---------- Typed rotor ---------- */
const rot = $('[data-type]');
if (rot) {
  const lines = JSON.parse(rot.dataset.type); let i = 0;
  if (reduce) rot.textContent = lines[0];
  else (async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    await sleep(1400);
    for (;;) {
      const s = lines[i++ % lines.length];
      for (let k = 1; k <= s.length; k++) { rot.textContent = s.slice(0, k); await sleep(26 + Math.random() * 26); }
      await sleep(2400);
      for (let k = s.length; k >= 0; k--) { rot.textContent = s.slice(0, k); await sleep(10); }
      await sleep(240);
    }
  })();
}

/* ---------- Reveal ---------- */
const rvObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); } }), {threshold:.12});
const reveal = () => $$('.rv:not(.in),.sme-steps:not(.in)').forEach(el => rvObs.observe(el));

/* ---------- Collection cards ---------- */
const grid = $('.design-grid');
const cards = $$('.design-card', grid);
const ITEMS = cards.map((card, i) => {
  const a = $('.design-preview', card), mini = $('.mini-design', card);
  const no = 'EXH ' + String(i + 1).padStart(3, '0');
  const tag = document.createElement('span'); tag.className = 'exh-no'; tag.textContent = no; card.prepend(tag);
  const sw = mini?.style.getPropertyValue('--paper') || '', acc = mini?.style.getPropertyValue('--accent') || '';
  return {kind:'card', el:card, href:a.getAttribute('href'), name:$('h3', card).textContent.trim(), type:$('.design-caption p', card)?.textContent.trim() || '',
          cat:card.dataset.category, no, swatch: sw && acc ? `linear-gradient(135deg,${sw} 50%,${acc} 50%)` : 'linear-gradient(135deg,#2a2a2a,#f7a531)'};
});
const FITEMS = FUSION.map(f => ({kind:'fusion', href:'fusion/' + f.slug + '.html', name:f.name, type:`${f.a} × ${f.b}`, cat:'Fusion Lab', no:'EXH ' + f.no, f, swatch:`linear-gradient(135deg,${f.c[0]} 50%,${f.c[2]} 50%)`}));
const ALL = [...FITEMS, ...ITEMS];
const byHref = h => ALL.find(it => it.href === h);
$$('.mini-design>img').forEach(img => img.addEventListener('error', () => { img.hidden = true; img.parentElement.classList.add('image-unavailable'); }));

/* live, scaled iframe helper */
const lazyFrame = (box, src, w = 1440, h = 900) => {
  const f = document.createElement('iframe');
  f.setAttribute('tabindex', '-1'); f.setAttribute('aria-hidden', 'true'); f.setAttribute('scrolling', 'no'); f.title = '';
  f.style.width = w + 'px';
  const fit = () => { const s = box.clientWidth / w; f.style.transform = `scale(${s}) translateY(-36px)`; f.style.height = Math.ceil(box.clientHeight / s + 36) + 'px'; };
  box.appendChild(f);
  new ResizeObserver(fit).observe(box);
  const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); f.addEventListener('load', () => f.classList.add('ready'), {once:true}); f.src = src; fit(); }, {rootMargin:'400px'});
  io.observe(box);
  return f;
};

/* ---------- Zoom reveal ---------- */
const zoom = $('.ex-zoom');
if (zoom) {
  const frame = $('.zm-frame'), copy = $('.zm-copy');
  lazyFrame(frame, frame.dataset.src).classList.add('ready');
  let ticking = false;
  const upd = () => {
    ticking = false;
    const r = zoom.getBoundingClientRect(), total = r.height - innerHeight;
    const p = clamp(-r.top / (total * .7), 0, 1), e = 1 - Math.pow(1 - p, 3);
    const s0 = innerWidth < 800 ? .78 : .5, s = s0 + (1 - s0) * e;
    frame.style.transform = `scale(${s})`;
    frame.style.borderRadius = (28 / s) * (1 - e) + 'px';
    
    const c = clamp((p - .55) / .3, 0, 1);
    copy.style.opacity = String(c); frame.style.setProperty('--shade', String(c));
    copy.style.transform = `translateY(${(1 - c) * 30}px)`;
  };
  if (reduce) { frame.style.transform = 'none'; copy.style.opacity = 1; }
  else { addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, {passive:true}); addEventListener('resize', upd); upd(); }
  $('.zm-open').addEventListener('click', () => openViewer(FITEMS, FITEMS.findIndex(it => it.href === frame.dataset.src)));
}

/* ---------- SME picker ---------- */
const chips = $('.sme-chips'), panel = $('.sme-panel');
chips.innerHTML = SME.map((s, i) => `<button type="button" class="sme-chip${i ? '' : ' on'}" data-k="${s.k}" aria-pressed="${!i}">${esc(s.label)}</button>`).join('');
const thumbFor = (box, href) => {
  const it = byHref(href);
  if (it?.kind === 'card') box.append(...[...$('.design-preview', it.el).children].filter(n => !n.classList.contains('preview-link')).map(n => n.cloneNode(true)));
  else lazyFrame(box, href, 1440, 1080).classList.add('ready');
};
const showSme = k => {
  const s = SME.find(x => x.k === k) || SME[0];
  $$('.sme-chip', chips).forEach(c => { const on = c.dataset.k === s.k; c.classList.toggle('on', on); c.setAttribute('aria-pressed', on); });
  panel.innerHTML = `<div><h4>${esc(s.title)}</h4><p>${esc(s.blurb)}</p><ul>${s.feats.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>
    <div><p class="mono" style="color:var(--dim);margin:0 0 14px">See it live</p><div class="sme-ex">${s.ex.map(h => { const it = byHref(h); return it ? `<button type="button" data-href="${h}" data-cursor="Open"><div class="sme-thumb"></div><b>${esc(it.name)}</b><small>${esc(it.no)}</small></button>` : ''; }).join('')}</div></div>`;
  $$('.sme-ex button', panel).forEach(b => thumbFor($('.sme-thumb', b), b.dataset.href));
  panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
};
chips.addEventListener('click', e => { const c = e.target.closest('.sme-chip'); if (c) showSme(c.dataset.k); });
panel.addEventListener('click', e => { const b = e.target.closest('[data-href]'); if (!b) return; const list = $$('[data-href]', panel).map(x => byHref(x.dataset.href)).filter(Boolean); openViewer(list, list.findIndex(it => it.href === b.dataset.href)); });
showSme('fnb');

/* ---------- Fusion Lab track ---------- */
const track = $('.fx-track'), pin = $('.fx-pin'), bar = $('.fx-bar i'), fcount = $('.fx-count b');
track.innerHTML = FUSION.map((f, i) => `
  <article class="fx" tabindex="0" role="button" data-i="${i}" data-cursor="Step in" aria-label="Preview ${esc(f.name)}" style="--c1:${f.c[0]};--c4:${f.c[3]}">
    <div class="fx-screen"><div class="fx-inner"><div class="fx-poster">${esc(f.name)}</div></div></div>
    <div class="fx-cap"><span class="mono">${f.no}</span><h3>${esc(f.name)}</h3><span class="mono formula">${esc(f.a)} × ${esc(f.b)}</span><p>${esc(f.pitch)}</p></div>
  </article>`).join('') + `<div class="fx-end"><span class="mono" style="color:var(--acc)">F-${String(FUSION.length + 1).padStart(2, '0')} · Reserved</span><h3>Your two styles<br>go here<span class="dot"></span></h3><a class="ex-btn solid" href="/contact.html">Commission a fusion <span class="arr">→</span></a></div>`;
const fxEls = $$('.fx', track);
fxEls.forEach(el => {
  lazyFrame($('.fx-inner', el), 'fusion/' + FUSION[+el.dataset.i].slug + '.html');
  const open = () => openViewer(FITEMS, +el.dataset.i);
  el.addEventListener('click', open);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
});
let pinOn = false, travel = 0;
const movePin = () => {
  if (!pinOn) return;
  const r = pin.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, travel), 0, 1);
  track.style.transform = `translate3d(${-p * travel}px,0,0)`;
  bar.style.transform = `scaleX(${p})`;
  fcount.textContent = String(clamp(Math.round(p * (FUSION.length - 1)) + 1, 1, FUSION.length)).padStart(2, '0');
};
const sizePin = () => {
  pinOn = innerWidth > 800 && !reduce;
  if (!pinOn) { pin.style.height = ''; track.style.transform = ''; return; }
  travel = Math.max(0, track.scrollWidth - innerWidth);
  pin.style.height = (innerHeight + travel) + 'px';
  movePin();
};
addEventListener('scroll', () => requestAnimationFrame(movePin), {passive:true});
addEventListener('resize', () => { clearTimeout(sizePin._t); sizePin._t = setTimeout(sizePin, 120); });
sizePin(); addEventListener('load', sizePin);
track.addEventListener('scroll', () => { if (!pinOn) fcount.textContent = String(clamp(Math.round(track.scrollLeft / fxEls[0].offsetWidth) + 1, 1, FUSION.length)).padStart(2, '0'); }, {passive:true});

/* ---------- Audience lists ---------- */
$$('.aud ul[data-aud]').forEach(ul => {
  const list = FITEMS.filter(it => it.f.aud === ul.dataset.aud);
  ul.innerHTML = list.map(it => `<li><button type="button" data-href="${it.href}" data-cursor="Open">${esc(it.name)} <span>${esc(it.f.no)} →</span></button></li>`).join('');
  ul.addEventListener('click', e => { const b = e.target.closest('[data-href]'); if (b) openViewer(list, list.findIndex(x => x.href === b.dataset.href)); });
});

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
  const lbl = category === 'all' ? 'Everything' : (buttons.find(b => b.dataset.category === category)?.firstChild.textContent.trim() || category);
  countEl.innerHTML = `<b>${shown}</b> ${shown === 1 ? 'exhibit' : 'exhibits'} · ${esc(lbl)}${q ? ` · “${esc(q)}”` : ''}`;
  empty.hidden = shown > 0;
}
const setCat = (c, push = true) => {
  category = c;
  buttons.forEach(x => { const on = x.dataset.category === c; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on); if (on) x.parentElement.scrollLeft = x.offsetLeft - x.parentElement.clientWidth / 2 + x.offsetWidth / 2; });
  filterDesigns();
  if (push) { const u = new URL(location.href); c === 'all' ? u.searchParams.delete('category') : u.searchParams.set('category', c); history.replaceState(null, '', u.pathname + u.search + '#collection'); }
};
buttons.forEach(b => b.addEventListener('click', () => setCat(b.dataset.category)));
search.addEventListener('input', () => filterDesigns(false));
const goHall = h => { setCat(h); $('#collection').scrollIntoView({behavior:smooth()}); };

/* ---------- Index with hover peek ---------- */
const HALLS = [
  ['Business','Studios, firms, clinics, agencies'],['Hospitality','Hotels, restaurants, cafés'],['Retail','Shops, brands, product drops'],
  ['Lifestyle','Wellness, travel, personal brands'],['Culture','Galleries, books, music, events'],['Technology','SaaS, AI, fintech, devtools'],
  ['Immersive','Six worlds you can walk through'],['Hong Kong','香港生活感'],['Taiwan','台灣生活感'],['Blue Spring','藍色春日'],['Modern Mix','摩登生活組合']];
const ix = $('.ix'), peek = $('.ix-peek');
ix.innerHTML = HALLS.map(([h, d], i) => `<button class="ix-row" type="button" data-hall="${h}" data-cursor="Filter"><span class="mono">${String(i + 1).padStart(2, '0')}</span><b>${esc(h)}</b><small>${esc(d)}</small><span class="n">${cards.filter(x => match(x, h)).length}</span></button>`).join('');
$$('.ix-row', ix).forEach(row => {
  row.addEventListener('click', () => goHall(row.dataset.hall));
  if (!fine) return;
  const pool = cards.filter(c => match(c, row.dataset.hall));
  row.addEventListener('pointerenter', () => {
    const c = pool[Math.floor(Math.random() * Math.min(pool.length, 6))]; if (!c) return;
    peek.replaceChildren(...[...$('.design-preview', c).children].filter(n => !n.classList.contains('preview-link')).map(n => n.cloneNode(true)));
    peek.classList.add('on');
  });
  row.addEventListener('pointerleave', () => peek.classList.remove('on'));
});
if (fine) {
  let px = 0, py = 0, tx = 0, ty = 0;
  ix.addEventListener('pointermove', e => { tx = e.clientX + 210; ty = e.clientY; if (!px) { px = tx; py = ty; } });
  (function follow() { px += (tx - px) * .15; py += (ty - py) * .15; peek.style.left = px + 'px'; peek.style.top = py + 'px'; requestAnimationFrame(follow); })();
}

/* ---------- Custom cursor ---------- */
const cur = $('.ex-cursor');
if (fine && !reduce) {
  let cx = -100, cy = -100, kx = -100, ky = -100;
  addEventListener('pointermove', e => {
    kx = e.clientX; ky = e.clientY;
    const t = e.target.closest?.('[data-cursor],.design-card');
    if (t && !e.target.closest('.ex-viewer,.ex-pal')) { cur.textContent = t.dataset.cursor || 'View'; cur.classList.add('on'); } else cur.classList.remove('on');
  }, {passive:true});
  (function loop() { cx += (kx - cx) * .2; cy += (ky - cy) * .2; cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; requestAnimationFrame(loop); })();
} else cur.remove();

/* ---------- View toggle + surprise ---------- */
$$('.ex-viewset button').forEach(b => b.addEventListener('click', () => {
  $$('.ex-viewset button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
  grid.classList.toggle('compact', b.dataset.view === 'compact');
  try { localStorage.setItem('ex-view', b.dataset.view); } catch (_) {}
}));
try { if (localStorage.getItem('ex-view') === 'compact') $('.ex-viewset [data-view="compact"]').click(); } catch (_) {}
$('.ex-surprise').addEventListener('click', () => { const v = visible(); if (v.length) openViewer(v, Math.floor(Math.random() * v.length)); });
grid.addEventListener('click', e => {
  const a = e.target.closest('a'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  const card = a.closest('.design-card'); if (!card) return;
  e.preventDefault(); const v = visible(); openViewer(v, v.findIndex(it => it.el === card));
});

/* ---------- Viewer ---------- */
const vw = $('.ex-viewer'), vFrame = $('.vw-frame'), vIfr = $('.vw-frame iframe'), vStage = $('.vw-stage');
let vList = [], vI = 0, lastFocus = null;
function openViewer(list, i) {
  if (!list.length || i < 0) return;
  vList = list; lastFocus = document.activeElement;
  vw.classList.add('open'); vw.setAttribute('aria-hidden', 'false'); document.documentElement.style.overflow = 'hidden';
  if (cur?.isConnected) cur.classList.remove('on');
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
let sx = null; vStage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
vStage.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 70) showV(vI + (dx < 0 ? 1 : -1)); sx = null; });

/* ---------- Command palette ---------- */
const pal = $('.ex-pal'), pIn = $('.pal-box input'), pList = $('.pal-list');
let pRes = [], pSel = 0;
const renderPal = () => {
  const q = pIn.value.trim().toLowerCase();
  pRes = (q ? ALL.filter(it => (it.name + ' ' + it.type + ' ' + it.cat + ' ' + (it.el?.dataset.search || '') + ' ' + (it.f ? it.f.pitch + ' ' + it.f.audL : '')).toLowerCase().includes(q)) : ALL).slice(0, 40);
  pSel = Math.min(pSel, Math.max(0, pRes.length - 1));
  pList.innerHTML = pRes.length ? pRes.map((it, i) => `<button class="pal-item${i === pSel ? ' on' : ''}" data-i="${i}" role="option" aria-selected="${i === pSel}"><i style="--pc:${it.swatch}"></i><span><b>${esc(it.name)}</b><small>${esc(it.cat)}${it.type ? ' · ' + esc(it.type) : ''}</small></span><span class="mono">${esc(it.no)}</span></button>`).join('')
    : `<p style="padding:24px;color:var(--mut);margin:0">Nothing matches that yet. <a href="/contact.html" style="color:var(--acc)">Commission it →</a></p>`;
  $('.pal-item.on', pList)?.scrollIntoView({block:'nearest'});
};
const openPal = () => { pal.classList.add('open'); pal.setAttribute('aria-hidden', 'false'); pIn.value = ''; pSel = 0; renderPal(); setTimeout(() => pIn.focus(), 30); };
const closePal = () => { pal.classList.remove('open'); pal.setAttribute('aria-hidden', 'true'); };
const pickPal = i => { if (!pRes[i]) return; closePal(); openViewer(pRes, i); };
$$('[data-open-pal]').forEach(b => b.addEventListener('click', openPal));
pIn.addEventListener('input', () => { pSel = 0; renderPal(); });
pList.addEventListener('click', e => { const b = e.target.closest('.pal-item'); if (b) pickPal(+b.dataset.i); });
pal.addEventListener('click', e => { if (e.target === pal) closePal(); });

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
if (vh) { const i = ALL.findIndex(it => it.href === decodeURIComponent(vh[1])); if (i >= 0) openViewer(ALL, i); }
else if (location.hash === '#collection' || reqBtn) {
  const jump = () => { document.documentElement.style.scrollBehavior = 'auto'; $('#collection').scrollIntoView(); document.documentElement.style.scrollBehavior = ''; };
  let touched = false; ['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, () => { touched = true; }, {once:true, passive:true}));
  requestAnimationFrame(jump); addEventListener('load', () => { if (!touched) jump(); }, {once:true});
}
})();
