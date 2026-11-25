/* Aurelion website finder. Needs finder-data.js. Mounts into #finder. */
(() => {
'use strict';
const A = window.AF, root = document.getElementById('finder');
if (!A || !root) return;
const $ = (s, r = root) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store = {get: k => { try { return localStorage.getItem(k); } catch (_) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} }};
const langNow = () => { const l = (document.documentElement.lang || 'en').slice(0, 2); return l === 'zh' ? 'zh' : l === 'ms' ? 'ms' : 'en'; };

const T = {
 en:{label:'<b>✦</b> · Website finder', label2:'2 taps · no sign-up', h2:'See your website <em>before you pay.</em>',
   lead:'Answer two questions. We match you with a design, show the price, and build a live preview of your homepage on the spot.',
   prom:['Free preview, instantly','Price shown upfront','No sign-up, no card'],
   q1:'What kind of business is it?', s1:'Pick the closest one.', q2:'What should the website do first?', s2:'You can have all of them. This decides the layout.',
   back:'← Back', match:'Your match', seeTpl:'See the full sample site', rec:'Recommended package', save:'Save RM{x}', normal:'normally RM{x}',
   split:'Pay RM{x} to start, RM{x} at launch', cd:'Holiday price ends in {d}d {h}h {m}m', cdOff:'Live in 1 week to 1 month',
   hooks:['We design your homepage first. You see it before we build the rest.','Pay 50% to start, 50% at launch','Domain, hosting and SSL for year one included','English, BM and 中文 included','Domain registered in your business name','Live in 1 week to 1 month · a real team on WhatsApp'],
   perso:'Personalise your preview (optional)', fName:'Business name', fArea:'Area / city', fLang:'Language', fVibe:'Style',
   wa:'Get my quote on WhatsApp', open:'Open my full preview', copy:'Copy preview link', copied:'Preview link copied',
   start:'Just starting out? A Landing Page is RM{p}.', other:'Need something bigger (booking system, member area, app)? <a href="{wa}" target="_blank" rel="noopener">Ask us</a>.',
   live:'Live preview', capL:'This updates as you type.', capR:'Open full size ↗', fab:'See your website free →',
   waIntro:'Hi Aurelion! I used the website finder.', waAsk:'Can you send me a quote and the next step?'},
 zh:{label:'<b>✦</b> · 网站找寻器', label2:'点两下 · 无需注册', h2:'付款之前，<em>先看到你的网站。</em>',
   lead:'回答两个问题。我们帮你配对设计、直接显示价格，并当场生成你的首页实时预览。',
   prom:['即时免费预览','价格先说清楚','无需注册、无需信用卡'],
   q1:'你做什么生意？', s1:'选最接近的一个。', q2:'网站首先要帮你做到什么？', s2:'全部都可以做到，这个决定版面重点。',
   back:'← 返回', match:'为你配对', seeTpl:'看完整样本网站', rec:'推荐配套', save:'省 RM{x}', normal:'原价 RM{x}',
   split:'先付 RM{x} 开工，上线时再付 RM{x}', cd:'假期优惠还剩 {d} 天 {h} 小时 {m} 分', cdOff:'1 周至 1 个月上线',
   hooks:['先设计首页给你看，满意了才做其余部分','先付 50% 开工，上线时再付 50%','包含第一年域名、主机和 SSL','包含英文、马来文和中文','域名以你的公司名义注册','1 周至 1 个月上线 · 真人团队 WhatsApp 支援'],
   perso:'个性化你的预览（可选）', fName:'商家名称', fArea:'地区 / 城市', fLang:'语言', fVibe:'风格',
   wa:'WhatsApp 获取报价', open:'打开完整预览', copy:'复制预览链接', copied:'已复制预览链接',
   start:'刚起步？单页网站只需 RM{p}。', other:'需要更大的系统（预约系统、会员区、应用）？<a href="{wa}" target="_blank" rel="noopener">问我们</a>。',
   live:'实时预览', capL:'输入时会即时更新。', capR:'全屏打开 ↗', fab:'免费看看你的网站 →',
   waIntro:'你好 Aurelion！我用了网站找寻器。', waAsk:'可以给我报价和下一步吗？'},
 ms:{label:'<b>✦</b> · Pencari laman web', label2:'2 tekan · tanpa daftar', h2:'Lihat laman web anda <em>sebelum membayar.</em>',
   lead:'Jawab dua soalan. Kami padankan reka bentuk, tunjuk harga, dan bina pratonton langsung laman utama anda serta-merta.',
   prom:['Pratonton percuma serta-merta','Harga ditunjuk awal','Tanpa daftar, tanpa kad'],
   q1:'Apakah jenis perniagaan anda?', s1:'Pilih yang paling hampir.', q2:'Apa yang laman web perlu buat dahulu?', s2:'Semuanya boleh. Ini menentukan susun atur.',
   back:'← Kembali', match:'Padanan anda', seeTpl:'Lihat laman sampel penuh', rec:'Pakej disyorkan', save:'Jimat RM{x}', normal:'biasa RM{x}',
   split:'Bayar RM{x} untuk mula, RM{x} semasa pelancaran', cd:'Harga cuti tamat dalam {d}h {h}j {m}m', cdOff:'Siap dalam 1 minggu hingga 1 bulan',
   hooks:['Kami reka laman utama dahulu. Anda lihat sebelum kami bina selebihnya.','Bayar 50% untuk mula, 50% semasa pelancaran','Domain, hosting dan SSL tahun pertama termasuk','English, BM dan 中文 termasuk','Domain didaftarkan atas nama perniagaan anda','Siap dalam 1 minggu hingga 1 bulan · pasukan sebenar di WhatsApp'],
   perso:'Peribadikan pratonton anda (pilihan)', fName:'Nama perniagaan', fArea:'Kawasan / bandar', fLang:'Bahasa', fVibe:'Gaya',
   wa:'Dapatkan sebut harga di WhatsApp', open:'Buka pratonton penuh', copy:'Salin pautan pratonton', copied:'Pautan pratonton disalin',
   start:'Baru bermula? Halaman Pendaratan hanya RM{p}.', other:'Perlukan sistem lebih besar (tempahan, ruang ahli, aplikasi)? <a href="{wa}" target="_blank" rel="noopener">Tanya kami</a>.',
   live:'Pratonton langsung', capL:'Dikemas kini semasa anda menaip.', capR:'Buka saiz penuh ↗', fab:'Lihat laman web anda percuma →',
   waIntro:'Hai Aurelion! Saya guna pencari laman web.', waAsk:'Boleh hantar sebut harga dan langkah seterusnya?'},
};
const VIBE_C = {warm:['#f6efe4','#c0623b'], bold:['#0e0e0e','#d6ff3d'], minimal:['#ffffff','#2f5bff'], luxe:['#0f2a24','#c9a45c']};
const GOAL_ORDER = ['enq','book','sell','cred'];

/* state: from ?i=&g=… (shared link / "Edit"), or ?t=<template slug> (Build one like this), or saved */
const qs = new URLSearchParams(location.search);
let st = A.fromQuery(location.search);
if (!st.i && qs.get('t') && A.SLUG[qs.get('t')]) st.i = A.SLUG[qs.get('t')];
if (!st.i) { try { st = {...JSON.parse(store.get('af-state') || '{}'), ...st}; } catch (_) {} }
let step = st.i && st.g ? 3 : st.i ? 2 : 1;
if (st.i && !st.g && qs.get('t')) { st.g = A.ind(st.i).goal; step = 3; }

const cfg = () => ({i: st.i || 'reno', g: st.g || A.ind(st.i || 'reno').goal, n: st.n || '', a: st.a || '', l: st.l || langNow(), v: st.v || 'warm'});
const previewUrl = (embed) => '/website/preview.html?' + A.toQuery(cfg()) + (embed ? '&embed=1' : '');
const shareUrl = () => location.origin + '/website/preview.html?' + A.toQuery(cfg());
const waUrl = () => {
  const l = langNow(), t = T[l], c = cfg(), I = A.ind(c.i), tk = A.tierFor(c.i, c.g);
  const lines = [t.waIntro, '', `• ${A.L(I.label, 'en')}`, `• Goal: ${A.L(A.GOALS[c.g], 'en')}`];
  if (c.n) lines.push(`• Business: ${c.n}`); if (c.a) lines.push(`• Area: ${c.a}`);
  lines.push(`• Recommended: ${A.L(A.TIERS[tk].name, 'en')} RM${A.fmt(A.price(tk))}`, '', shareUrl(), '', t.waAsk);
  return `https://wa.me/${A.WA}?text=${encodeURIComponent(lines.join('\n'))}`;
};
const save = () => store.set('af-state', JSON.stringify(st));
const track = (ev, p) => { try { (window.dataLayer = window.dataLayer || []).push({event: ev, ...p}); if (window.gtag) window.gtag('event', ev, p); } catch (_) {} };

root.innerHTML = `
<div class="fd-head rv in">
  <div><div class="ex-label mono" style="margin:0"><span data-f="label"></span><span data-f="label2"></span></div><h2 class="ex-h2" data-fh="h2"></h2><div class="fd-promise" data-f-list="prom"></div></div>
  <p class="ex-lead" data-f="lead"></p>
</div>
<div class="fd-grid">
  <div class="fd-panel"><div class="fd-steps" aria-hidden="true"><i></i><i></i><i></i></div><div class="fd-body" aria-live="polite"></div></div>
  <div class="fd-dev">
    <div class="fd-frame"><div class="fd-chrome"><i></i><i></i><i></i><span class="fd-url"></span></div>
      <div class="fd-view"><span class="fd-live" data-f="live"></span><iframe title="Website preview" loading="lazy" tabindex="-1"></iframe></div></div>
    <div class="fd-cap"><span data-f="capL"></span><a class="fd-full" target="_blank" rel="noopener" data-f="capR"></a></div>
  </div>
</div>`;
const toast = document.createElement('div'); toast.className = 'fd-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast);

const body = $('.fd-body'), frame = $('.fd-view iframe'), view = $('.fd-view');

/* preview iframe, scaled to fit */
const fit = () => { const w = view.clientWidth, h = view.clientHeight; const vw = w < 560 ? 400 : 1280; const s = w / vw;
  frame.style.width = vw + 'px'; frame.style.height = Math.ceil(h / s) + 'px'; frame.style.transform = `scale(${s})`; };
let pTimer, lastSrc = '';
const refresh = (now) => { clearTimeout(pTimer); pTimer = setTimeout(() => {
  const src = previewUrl(true); if (src !== lastSrc) { lastSrc = src; frame.src = src; }
  $('.fd-url').textContent = (st.n ? st.n.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'yourbusiness' : 'yourbusiness') + '.com.my';
  $('.fd-full').href = previewUrl(false); }, now ? 0 : 350); };
let seen = false;
new IntersectionObserver(es => { if (es[0].isIntersecting && !seen) { seen = true; fit(); refresh(true); track('finder_view', {}); } }, {rootMargin: '300px'}).observe(root);
addEventListener('resize', fit, {passive: true});

const countdown = t => { const ms = A.END - Date.now(); if (ms <= 0) return t.cdOff;
  return t.cd.replace('{d}', Math.floor(ms / 864e5)).replace('{h}', Math.floor(ms / 36e5) % 24).replace('{m}', Math.floor(ms / 6e4) % 60); };

const render = () => {
  const l = langNow(), t = T[l];
  root.querySelectorAll('[data-f]').forEach(el => { el.innerHTML = t[el.dataset.f]; });
  root.querySelectorAll('[data-fh]').forEach(el => { el.innerHTML = t[el.dataset.fh]; });
  root.querySelectorAll('[data-f-list]').forEach(el => { el.innerHTML = t[el.dataset.fList].map(x => `<span>${esc(x)}</span>`).join(''); });
  root.querySelectorAll('.fd-steps i').forEach((el, i) => el.classList.toggle('on', i < step));
  if (step === 1) {
    body.innerHTML = `<div class="fd-pane"><p class="fd-q">${esc(t.q1)}</p><p class="fd-sub">${esc(t.s1)}</p><div class="fd-opts">${A.IND.map((x, i) =>
      `<button type="button" class="fd-opt" data-i="${x.k}" aria-pressed="${st.i === x.k}"><b>${String(i + 1).padStart(2, '0')}</b>${esc(A.L(x.label, l))}</button>`).join('')}</div></div>`;
  } else if (step === 2) {
    body.innerHTML = `<div class="fd-pane"><button type="button" class="fd-back">${esc(t.back)}</button><p class="fd-q">${esc(t.q2)}</p><p class="fd-sub">${esc(t.s2)}</p><div class="fd-opts g4">${GOAL_ORDER.map((g, i) =>
      `<button type="button" class="fd-opt" data-g="${g}" aria-pressed="${st.g === g}"><b>${String.fromCharCode(65 + i)}</b>${esc(A.L(A.GOALS[g], l))}</button>`).join('')}</div></div>`;
  } else {
    const c = cfg(), I = A.ind(c.i), tk = A.tierFor(c.i, c.g), tier = A.TIERS[tk], promo = A.promo();
    const priceHtml = promo
      ? `<b><small>RM</small>${A.fmt(tier.now)}</b><s>${esc(t.normal.replace('{x}', A.fmt(tier.was)))}</s><em class="save">${esc(t.save.replace('{x}', A.fmt(tier.was - tier.now)))}</em>`
      : `<b><small>RM</small>${A.fmt(tier.was)}</b>`;
    const langOpts = [['en','English'],['ms','Bahasa Melayu'],['zh','中文']].map(([k, n]) => `<option value="${k}"${c.l === k ? ' selected' : ''}>${n}</option>`).join('');
    const vibes = Object.keys(A.VIBES).map(v => `<button type="button" data-v="${v}" aria-pressed="${c.v === v}"><i style="background:linear-gradient(135deg,${VIBE_C[v][0]} 50%,${VIBE_C[v][1]} 50%);border:1px solid var(--line2)"></i>${esc(A.L(A.VIBES[v], l))}</button>`).join('');
    body.innerHTML = `<div class="fd-pane">
      <button type="button" class="fd-back">${esc(t.back)}</button>
      <div class="fd-match"><span class="mono">${esc(t.match)}</span><span>${esc(A.L(I.label, l))} · ${esc(A.L(A.GOALS[c.g], l))}</span><a href="${esc(I.tpl)}" target="_blank" rel="noopener">${esc(t.seeTpl)} ↗</a></div>
      <p class="fd-q">${esc(t.rec)}: ${esc(A.L(tier.name, l))} <span style="color:var(--mut);font-weight:400;font-size:.6em">${esc(A.L(tier.sub, l))}</span></p>
      <div class="fd-price">${priceHtml}</div>
      <p class="fd-split">${esc(t.split.split('{x}').join(A.fmt(A.price(tk) / 2)))}</p>
      <div class="fd-cd">${esc(countdown(t))}</div>
      <ul class="fd-hooks">${t.hooks.map(h => `<li>${esc(h)}</li>`).join('')}</ul>
      <details class="fd-perso"${st.n || st.a ? ' open' : ''}><summary>${esc(t.perso)}</summary><div class="fd-fields">
        <label>${esc(t.fName)}<input name="n" maxlength="40" value="${esc(c.n)}" placeholder="${esc(A.L(I.demo, l))}" autocomplete="organization"></label>
        <label>${esc(t.fArea)}<input name="a" maxlength="30" value="${esc(c.a)}" placeholder="Petaling Jaya"></label>
        <label>${esc(t.fLang)}<select name="l">${langOpts}</select></label>
        <label>${esc(t.fVibe)}<span class="fd-vibes">${vibes}</span></label>
      </div></details>
      <div class="fd-acts">
        <a class="ex-btn wa fd-wa" href="${esc(waUrl())}" target="_blank" rel="noopener"><span>${esc(t.wa)}</span> →</a>
        <div class="fd-row"><a class="ex-btn fd-open" href="${esc(previewUrl(false))}" target="_blank" rel="noopener">${esc(t.open)} ↗</a><button type="button" class="ex-btn fd-copy">${esc(t.copy)}</button></div>
      </div>
      <p class="fd-mini">${tk !== 'landing' ? esc(t.start.replace('{p}', A.fmt(A.price('landing')))) + ' ' : ''}${t.other.replace('{wa}', esc(`https://wa.me/${A.WA}?text=${encodeURIComponent(t.waIntro)}`))}</p>
    </div>`;
  }
  refresh(false);
};
const syncLinks = () => { const w = $('.fd-wa'), o = $('.fd-open'); if (w) w.href = waUrl(); if (o) o.href = previewUrl(false); };

body.addEventListener('click', e => {
  const b = e.target.closest('button, a'); if (!b) return;
  if (b.dataset.i) { st.i = b.dataset.i; step = 2; save(); track('finder_industry', {industry: st.i}); render(); refresh(true); }
  else if (b.dataset.g) { st.g = b.dataset.g; step = 3; save(); track('finder_result', {industry: st.i, goal: st.g, tier: A.tierFor(st.i, st.g)}); render(); refresh(true);
    if (innerWidth < 900) root.querySelector('.fd-panel').scrollIntoView({behavior: 'smooth', block: 'start'}); }
  else if (b.classList.contains('fd-back')) { step = Math.max(1, step - 1); render(); }
  else if (b.dataset.v) { st.v = b.dataset.v; save(); b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); syncLinks(); refresh(true); }
  else if (b.classList.contains('fd-copy')) {
    const u = shareUrl(), ok = () => { toast.textContent = T[langNow()].copied; toast.classList.add('on'); setTimeout(() => toast.classList.remove('on'), 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(u).then(ok, () => prompt('', u)); else prompt('', u);
    track('finder_copy', {industry: st.i});
  }
  else if (b.classList.contains('fd-wa')) track('finder_whatsapp', {industry: st.i, goal: st.g, tier: A.tierFor(st.i, st.g)});
  else if (b.classList.contains('fd-open')) track('finder_open_preview', {industry: st.i});
});
body.addEventListener('input', e => { const f = e.target; if (!f.name) return; st[f.name] = f.value.trim(); save(); syncLinks(); refresh(f.tagName === 'SELECT'); });

/* follow the page language switch */
new MutationObserver(() => render()).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
setInterval(() => { const el = $('.fd-cd'); if (el) el.textContent = countdown(T[langNow()]); }, 30000);
render();
if (location.hash === '#finder') setTimeout(() => { const el = step === 3 ? root.querySelector('.fd-panel') : root; const y = el.getBoundingClientRect().top + scrollY - (document.querySelector('.ex-nav')?.offsetHeight || 72) - 56; scrollTo(0, Math.max(0, y)); }, 120);
})();
