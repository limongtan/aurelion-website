/* Aurelion sample-site kit: personalises an industry sample from the website finder.
   URL params: n = business name, a = area, l = en|ms|zh, g = enq|book|sell|cred, v = warm|bold|minimal|luxe, embed = 1 (inside the finder frame).
   Load in <head> (no defer) so html attributes are set before first paint:  <script src="/website/fusion/af-kit.js"></script>
   Page contract:
     - [data-af-name]     text replaced by the business name (keeps the sample name when none is given)
     - [data-af-area]     text replaced by the area
     - [data-af-initial]  first letter of the business name
     - html[data-goal]    always set (sample default from <html data-goal-default="book">); pages order their sections with CSS on it
     - html[data-vibe]    set only when the visitor picked a style; pages define palettes for it
     - html.af-embed      inside the finder: hide .exh-bar, set --exh:0
     - window.AFK         {n, a, l, g, v, embed, personal}; pages read AFK.l before their own saved language
     - window.afDemo(msg) small "this is a demo" toast for CTAs that would open the client's own WhatsApp / checkout */
(function () {
  'use strict';
  var p = new URLSearchParams(location.search), h = document.documentElement;
  var clean = function (k, max) { var v = (p.get(k) || '').trim().slice(0, max || 60); return v.replace(/[<>]/g, ''); };
  var pick = function (v, ok) { return ok.indexOf(v) >= 0 ? v : ''; };
  var K = window.AFK = {
    n: clean('n', 40), a: clean('a', 30),
    l: pick(p.get('l'), ['en', 'ms', 'zh']),
    g: pick(p.get('g'), ['enq', 'book', 'sell', 'cred']),
    v: pick(p.get('v'), ['warm', 'bold', 'minimal', 'luxe']),
    embed: p.get('embed') === '1'
  };
  K.personal = !!(K.n || K.a || K.g || p.get('i'));
  h.dataset.goal = K.g || h.dataset.goalDefault || 'enq';
  if (K.v) h.dataset.vibe = K.v;
  if (K.embed) h.classList.add('af-embed');
  if (K.l) { try { localStorage.setItem('af-lang', K.l); } catch (e) {} }

  var css = document.createElement('style');
  css.textContent = 'html.af-embed{--exh:0px!important}html.af-embed .exh-bar{display:none!important}' +
    '.af-toast{position:fixed;left:50%;bottom:22px;z-index:2147483000;transform:translate(-50%,20px);opacity:0;max-width:min(92vw,440px);padding:12px 16px;border-radius:12px;background:#111;color:#f4f2ec;font:500 13.5px/1.45 system-ui,sans-serif;box-shadow:0 18px 50px -12px #000a;transition:opacity .3s,transform .3s;pointer-events:none;text-align:center}' +
    '.af-toast.on{opacity:1;transform:translate(-50%,0)}' +
    '.exh-bar .af-b{color:#fff;font-weight:700}.exh-bar .af-wa{background:#25d366;color:#fff!important;padding:6px 12px;border-radius:99px;letter-spacing:.02em}';
  (document.head || h).appendChild(css);

  var demoMsg = {
    en: 'Demo: on your site this opens a WhatsApp chat with you, with the details pre-filled.',
    ms: 'Demo: di laman anda, ini membuka WhatsApp terus kepada anda dengan butiran sedia diisi.',
    zh: '演示：在你的网站上，这会直接打开与你的 WhatsApp 对话，并自动填好资料。'
  };
  var toastEl, tT;
  window.afDemo = function (msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'af-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    var l = (h.lang || 'en').slice(0, 2); l = l === 'zh' ? 'zh' : l === 'ms' ? 'ms' : 'en';
    toastEl.textContent = msg || demoMsg[l];
    toastEl.classList.add('on'); clearTimeout(tT); tT = setTimeout(function () { toastEl.classList.remove('on'); }, 3200);
  };

  var fill = function () {
    if (K.n) {
      document.querySelectorAll('[data-af-name]').forEach(function (el) { el.textContent = K.n; });
      document.querySelectorAll('[data-af-initial]').forEach(function (el) { el.textContent = K.n.charAt(0).toUpperCase(); });
      document.title = K.n + ' · ' + document.title.split('·').pop().trim();
    }
    if (K.a) document.querySelectorAll('[data-af-area]').forEach(function (el) { el.textContent = K.a; });
  };
  window.afFill = fill; /* pages call this again after re-rendering text for a language change */

  /* personalised preview bar (full-page preview opened from the finder) */
  var bar = function () {
    var b = document.querySelector('.exh-bar'); if (!b || K.embed || !K.personal) return;
    var slug = (location.pathname.split('/').pop() || '').replace('.html', '');
    var q = new URLSearchParams(); ['i', 'g', 'n', 'a', 'l', 'v'].forEach(function (k) { if (p.get(k)) q.set(k, p.get(k)); });
    var edit = '/website/?' + (q.toString() || 't=' + slug) + '#finder';
    var who = K.n || (document.querySelector('[data-af-name]') || {}).textContent || '';
    var lines = ['Hi Aurelion! I used the website finder and like this preview.', '', who ? '• Business: ' + who : '', K.a ? '• Area: ' + K.a : '', '', location.href, '', 'Can you send me a quote and the next step?'];
    var wa = 'https://wa.me/601110541499?text=' + encodeURIComponent(lines.filter(function (x, i, arr) { return x || arr[i - 1]; }).join('\n'));
    b.innerHTML = '<a href="' + edit + '">← Edit</a><span class="exh-mid">Aurelion · free preview' + (who ? ' for <span class="af-b"></span>' : '') + '</span><a class="exh-cta af-wa" href="' + wa + '" target="_blank" rel="noopener">Get my quote on WhatsApp →</a>';
    var nb = b.querySelector('.af-b'); if (nb) nb.textContent = who;
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { fill(); bar(); });
  else { fill(); bar(); }
})();
