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
const store = {get: k => { try { return localStorage.getItem(k); } catch (_) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} }};
const WA = '601110541499';
const fmt = n => Math.round(n).toLocaleString('en-MY');
const WA_SVG = '<svg class="wa-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41"/></svg>';

/* ---------- i18n ---------- */
const DICT = window.EX_I18N || {en:{}};
const LANGS = {en:'en', zh:'zh-Hans', ms:'ms'};
let lang = (url.searchParams.get('lang') || store.get('ex-lang') || 'en').toLowerCase();
if (!DICT[lang]) lang = 'en';
const t = (k, v = {}) => String((DICT[lang] && DICT[lang][k]) ?? DICT.en[k] ?? k).replace(/\{(\w+)\}/g, (m, x) => v[x] ?? m);
const L = o => (o && typeof o === 'object') ? (o[lang] ?? o.en) : o;
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

/* ---------- Data ---------- */
const FUSION = [
  {slug:'batu-beam', no:'F-12', name:'Batu & Beam', a:'Blueprint Drafting', b:'Material Swatch Board', aud:'sme', c:['#eef1f4','#1d3a5f','#c08a3e','#14202e'],
   pitch:{en:'A renovation and interior design contractor. Plans draw themselves, an illustrative cost estimator gives a ballpark, and the estimate goes to WhatsApp.', zh:'装修与室内设计公司。平面图自动绘出，示意报价器给出预算范围，再一键发到 WhatsApp。', ms:'Kontraktor ubah suai dan reka bentuk dalaman. Pelan terlukis sendiri, anggaran kos ilustrasi beri julat harga, dan anggaran dihantar ke WhatsApp.'}},
  {slug:'seri-dental', no:'F-13', name:'Seri Dental', a:'Japanese Wayfinding', b:'Soft Clinical', aud:'sme', c:['#f3f7f5','#1f6f63','#f2b84b','#13302b'],
   pitch:{en:'A family dental clinic: live open-now hours, a numbered treatment explorer with fees from, and appointment requests. Written to stay within clinic advertising rules.', zh:'家庭牙科诊所：实时营业状态、编号疗程导览与收费起价、在线预约申请。内容符合诊所广告规范。', ms:'Klinik pergigian keluarga: waktu buka langsung, peneroka rawatan bernombor dengan yuran bermula, dan permintaan temujanji. Ditulis mengikut peraturan iklan klinik.'}},
  {slug:'little-orbit', no:'F-14', name:'Little Orbit', a:'Sticker-book Play', b:'School Timetable', aud:'sme', c:['#fff8ec','#3b5bdb','#ff6b4a','#1b1f3b'],
   pitch:{en:'A tuition and enrichment centre parents can use at 11pm: find a class by age and subject, see seats left, book a free trial.', zh:'家长晚上 11 点也能用的补习与才艺中心：按年龄和科目找课、看剩余名额、预约免费试课。', ms:'Pusat tuisyen dan pengayaan yang ibu bapa boleh guna jam 11 malam: cari kelas ikut umur dan subjek, lihat tempat kosong, tempah kelas percubaan percuma.'}},
  {slug:'rumah-teduh', no:'F-15', name:'Rumah Teduh', a:'Batik Editorial', b:'Booking App', aud:'sme', c:['#f5ecdf','#1f3d5a','#c4643b','#1a2433'],
   pitch:{en:'A heritage shophouse stay in George Town. Shutters open, the calendar shows sample nightly rates, and guests book direct.', zh:'乔治市百年店屋民宿。百叶窗缓缓打开，日历显示示例房价，客人直接预订。', ms:'Penginapan rumah kedai warisan di George Town. Tingkap terbuka, kalendar tunjuk kadar sampel semalam, dan tetamu tempah terus.'}},
  {slug:'harbour-lane', no:'F-09', name:'Harbour Lane 港巷', a:'Neon Noir', b:'Swiss Listings', aud:'sme', c:['#0a1230','#16204a','#ff2e88','#19e3d1'],
   pitch:{en:'A Hong Kong property boutique under a flickering neon sign. Bilingual toggle, live property finder and mortgage maths.', zh:'霓虹招牌下的香港精品地产。双语切换、实时房源筛选和房贷计算。', ms:'Agensi hartanah butik Hong Kong di bawah papan tanda neon. Togol dwibahasa, pencari hartanah langsung dan kiraan pinjaman.'}},
  {slug:'forge-field', no:'F-07', name:'Forge & Field', a:'Risograph Print', b:'E-commerce', aud:'sme', c:['#f3ecdc','#2c4bdc','#ff3fa4','#1f1d36'],
   pitch:{en:'A coffee roaster with print-shop soul. Tap the flavour wheel, build a subscription, watch the price per cup update live.', zh:'带着印刷店灵魂的咖啡烘焙商。点选风味轮、组合订阅，每杯价格即时更新。', ms:'Pemanggang kopi berjiwa kedai cetak. Tekan roda perisa, bina langganan, lihat harga secawan dikemas kini serta-merta.'}},
  {slug:'masjid', no:'F-11', name:'Masjid Al-Ihsan', a:'Islamic Geometry', b:'Contemporary Swiss', aud:'sme', c:['#f6f1e7','#0f3b36','#b8893b','#13201e'],
   pitch:{en:'A contemporary mosque template: live prayer times and countdown, BM/EN toggle, programme timetable, infaq and facility booking.', zh:'当代清真寺网站模板：实时礼拜时间与倒数、马来文/英文切换、活动时间表、捐献与设施预约。', ms:'Templat laman web masjid kontemporari: waktu solat langsung dan kiraan detik, togol BM/EN, jadual program, infaq dan tempahan kemudahan.'}},
  {slug:'northbeam', no:'F-08', name:'Northbeam', a:'Cinematic Title', b:'Live Dashboard', aud:'sme', c:['#06080b','#0b1a22','#16e6cb','#e6eef2'],
   pitch:{en:'Freight software with the presence of a film opening. Animated route maps, live KPIs and an instant quote engine.', zh:'像电影片头一样震撼的货运软件。动态航线地图、实时 KPI 和即时报价。', ms:'Perisian kargo dengan aura pembukaan filem. Peta laluan animasi, KPI langsung dan enjin sebut harga segera.'}},
  {slug:'cohort', no:'F-01', name:'Cohort', a:'Swiss Grid', b:'Game HUD', aud:'ld', c:['#f2f0e9','#111111','#ff3b1f','#111'],
   pitch:{en:'A learning-experience studio whose site plays like a level select. Unlock the skill tree, take the quiz, build a programme.', zh:'像游戏选关一样的学习体验工作室。解锁技能树、做测验、现场组合课程。', ms:'Studio pengalaman pembelajaran yang dimainkan seperti pilih tahap. Buka pokok kemahiran, jawab kuiz, bina program.'}},
  {slug:'facilitators-table', no:'F-02', name:"The Facilitator's Table", a:'Editorial Magazine', b:'Warm Analog', aud:'ld', c:['#f4ecdc','#20402f','#c4562d','#1f2a22'],
   pitch:{en:'An independent trainer’s site that reads like a magazine and closes like a sales team: workshop finder, ROI calculator, booking.', zh:'读起来像杂志、成交像销售团队的独立培训师网站：工作坊查找、ROI 计算器、在线预约。', ms:'Laman jurulatih bebas yang dibaca seperti majalah dan menutup jualan seperti pasukan jualan: pencari bengkel, kalkulator ROI, tempahan.'}},
  {slug:'nova-cut', no:'F-03', name:'NOVA/CUT', a:'Y2K Chrome', b:'Bento Dashboard', aud:'creator', c:['#07060c','#1a0f2e','#ff2ea6','#f2f0ff'],
   pitch:{en:'A creator media kit that sells itself: live platform stats and a rate card that totals as brands click.', zh:'会自己推销的创作者媒体资料包：实时平台数据，品牌一点就自动加总的报价单。', ms:'Media kit pencipta yang menjual dirinya: statistik platform langsung dan kad kadar yang dijumlahkan semasa jenama klik.'}},
  {slug:'low-frequency', no:'F-04', name:'Low Frequency', a:'CRT Terminal', b:'Audio App', aud:'creator', c:['#050403','#1a1206','#ffb23f','#ffb23f'],
   pitch:{en:'A late-night podcast in phosphor amber. Live waveform player, chapter jumps and an episode deck that loads on click.', zh:'琥珀色荧光屏风格的深夜播客。实时波形播放器、章节跳转、一点即播的节目列表。', ms:'Podcast lewat malam dalam warna ambar fosfor. Pemain gelombang langsung, lompat bab dan senarai episod sekali klik.'}},
  {slug:'sabai', no:'F-10', name:'Sabai', a:'Biomorphic', b:'Brutalist Timetable', aud:'creator', c:['#efe6d6','#a9b89a','#c9774f','#141310'],
   pitch:{en:'A yoga and breathwork teacher’s studio online. Breathe with the living blob, filter the timetable, pick a membership.', zh:'瑜伽与呼吸导师的线上工作室。跟着会呼吸的形状一起呼吸、筛选课表、选择会籍。', ms:'Studio dalam talian guru yoga dan pernafasan. Bernafas bersama blob hidup, tapis jadual, pilih keahlian.'}},
  {slug:'mira-os', no:'F-05', name:'MIRA.OS', a:'Neo-Brutalism', b:'Retro Desktop', aud:'freelance', c:['#f4f1ea','#2b3cff','#e4ff3a','#0d0d0d'],
   pitch:{en:'A designer portfolio that boots up like an operating system. Drag the windows, open the projects, run hire_me.exe.', zh:'像操作系统一样开机的设计师作品集。拖动窗口、打开项目、运行 hire_me.exe。', ms:'Portfolio pereka yang dihidupkan seperti sistem operasi. Seret tetingkap, buka projek, jalankan hire_me.exe.'}},
  {slug:'kai-dev', no:'F-06', name:'kai@dev', a:'Hacker Terminal', b:'Glassmorphism', aud:'freelance', c:['#060b1f','#1b2a6b','#5ef2d6','#e8eefc'],
   pitch:{en:'A developer portfolio you can actually type into. Real commands, flip-card case studies, a bookable availability calendar.', zh:'真的可以打字的开发者作品集。真实指令、翻转案例卡片和可预约的档期日历。', ms:'Portfolio pembangun yang anda boleh taip. Arahan sebenar, kad kajian kes terbalik dan kalendar ketersediaan.'}},
];

const SME = [
  {k:'reno', label:{en:'Renovation · ID', zh:'装修 · 室内设计', ms:'Ubah suai · ID'}, short:{en:'renovation', zh:'装修生意', ms:'ubah suai'},
   pain:{en:'A homeowner with a RM80k budget is choosing between three contractors. Two have a Facebook page. One has projects, a ballpark price and a clear process. Guess who gets the site visit.', zh:'一位预算 RM8 万的屋主正在三家装修公司之间选择。两家只有 Facebook 专页，一家有作品、预算范围和清楚流程。猜猜谁拿到看现场的机会？', ms:'Pemilik rumah dengan bajet RM80k sedang memilih antara tiga kontraktor. Dua ada halaman Facebook. Satu ada projek, julat harga dan proses yang jelas. Teka siapa dapat lawatan tapak.'},
   feats:{en:['Project gallery by property type and budget','Illustrative cost estimator that sends to WhatsApp','Process, timeline and warranty explained','Service areas so Google sends local homeowners'], zh:['按房型和预算分类的作品集','示意报价器，一键发到 WhatsApp','流程、工期与保修说明','服务地区页面，让 Google 带来附近屋主'], ms:['Galeri projek ikut jenis hartanah dan bajet','Anggaran kos ilustrasi yang dihantar ke WhatsApp','Proses, tempoh dan waranti diterangkan','Kawasan servis supaya Google bawa pemilik rumah tempatan']},
   ex:['fusion/batu-beam.html','demos/atelier.html','demos/groundwork.html']},
  {k:'fnb', label:{en:'F&B · Cafés', zh:'餐饮 · 咖啡馆', ms:'F&B · Kafe'}, short:{en:'restaurant/café', zh:'餐饮店', ms:'restoran/kafe'},
   pain:{en:'It’s 7pm. Someone hungry searches “dinner near me”. If your menu is a blurry PDF, they’re already walking into the shop next door.', zh:'晚上七点，有人饿着肚子搜「附近晚餐」。如果你的菜单是一张模糊的 PDF，他已经走进隔壁那家了。', ms:'Pukul 7 malam. Seseorang yang lapar cari “makan malam dekat sini”. Jika menu anda PDF yang kabur, dia sudah masuk kedai sebelah.'},
   feats:{en:['Menu that loads instantly, with photos and prices','Table bookings and WhatsApp orders in one tap','Google Maps, hours and reviews front and centre','Promo pages for festive menus and set lunches'], zh:['秒开菜单，附图片和价格','一键订位、WhatsApp 点餐','Google 地图、营业时间和评价一目了然','节庆菜单和套餐的促销页'], ms:['Menu yang dibuka serta-merta, dengan gambar dan harga','Tempahan meja dan pesanan WhatsApp sekali tekan','Google Maps, waktu operasi dan ulasan di depan','Halaman promosi untuk menu perayaan dan set makan tengah hari']},
   ex:['demos/ember.html','demos/crumb.html','regional/hk-everyday-diner.html']},
  {k:'retail', label:{en:'Retail · E-commerce', zh:'零售 · 电商', ms:'Runcit · E-dagang'}, short:{en:'retail', zh:'零售生意', ms:'runcit'},
   pain:{en:'They found your product on Instagram, tapped the link, and hit a slow page with no checkout. That sale just went to a marketplace.', zh:'他们在 Instagram 看到你的产品，点进链接，却遇上又慢又没法结账的页面。这笔生意就这样流向了电商平台。', ms:'Mereka nampak produk anda di Instagram, tekan pautan, dan jumpa halaman perlahan tanpa pembayaran. Jualan itu terus ke marketplace.'},
   feats:{en:['Online shop with cart, stock and checkout','Card, FPX and GrabPay payments','Product finders and bundles that raise basket size','Launch pages for new drops and sales'], zh:['带购物车、库存和结账的网店','支持银行卡、FPX 和 GrabPay 付款','提升客单价的产品推荐与组合','新品和促销的发布页'], ms:['Kedai dalam talian dengan troli, stok dan pembayaran','Bayaran kad, FPX dan GrabPay','Pencari produk dan pakej yang menaikkan nilai bakul','Halaman pelancaran untuk produk baharu dan jualan']},
   ex:['fusion/forge-field.html','demos/forma.html','demos/carry.html']},
  {k:'clinic', label:{en:'Clinics · Wellness', zh:'诊所 · 健康', ms:'Klinik · Kesejahteraan'}, short:{en:'clinic/wellness', zh:'诊所/健康生意', ms:'klinik/kesejahteraan'},
   pain:{en:'A new patient compares three clinics at midnight. The one with clear prices and online booking gets the appointment. The others get a missed call.', zh:'新病人半夜比较三家诊所。价格清楚、能在线预约的那家拿到了预约，其他的只收到未接来电。', ms:'Pesakit baharu banding tiga klinik pada tengah malam. Yang harganya jelas dan boleh tempah dalam talian dapat temujanji. Yang lain cuma dapat panggilan tak berjawab.'},
   feats:{en:['Online appointment and class booking','Practitioner profiles and treatment pages','Bilingual FAQs that cut repeat calls','Memberships and packages'], zh:['在线预约门诊与课程','医师介绍与疗程页面','双语常见问题，减少重复来电','会员与配套'], ms:['Tempahan temujanji dan kelas dalam talian','Profil pengamal dan halaman rawatan','Soalan lazim dwibahasa yang kurangkan panggilan berulang','Keahlian dan pakej']},
   ex:['fusion/seri-dental.html','fusion/sabai.html','demos/balance.html']},
  {k:'pro', label:{en:'Professional services', zh:'专业服务', ms:'Perkhidmatan profesional'}, short:{en:'professional services', zh:'专业服务', ms:'perkhidmatan profesional'},
   pain:{en:'Your next client is shortlisting firms right now. Five seconds on your homepage decides if you look “credible” or “small”.', zh:'你的下一个客户正在筛选事务所。你的首页五秒内就决定了你是「专业可靠」还是「小打小闹」。', ms:'Klien seterusnya sedang menyenarai pendek firma sekarang. Lima saat di laman utama menentukan sama ada anda nampak “berwibawa” atau “kecil”.'},
   feats:{en:['Sharp positioning and service pages','Case studies and proof that close deals','Enquiry funnels and quote calculators','Team pages that show real expertise'], zh:['清晰的定位与服务页面','能促成交易的案例与证明','询问流程与报价计算器','展现真实专业的团队页面'], ms:['Kedudukan dan halaman perkhidmatan yang tajam','Kajian kes dan bukti yang menutup urusan','Aliran pertanyaan dan kalkulator sebut harga','Halaman pasukan yang tunjukkan kepakaran sebenar']},
   ex:['demos/counsel.html','demos/ledger.html','demos/meridian.html']},
  {k:'property', label:{en:'Property · Construction', zh:'房产 · 建筑', ms:'Hartanah · Pembinaan'}, short:{en:'property', zh:'房产生意', ms:'hartanah'},
   pain:{en:'Buyers browse for weeks before they ever call. Every visit is a chance to earn their trust, or lose them to a slicker agency.', zh:'买家在打电话之前会浏览好几个星期。每一次浏览，都是赢得信任或输给更精致对手的机会。', ms:'Pembeli melayari berminggu-minggu sebelum menelefon. Setiap lawatan peluang untuk raih kepercayaan, atau kalah kepada agensi yang lebih kemas.'},
   feats:{en:['Listing finder with filters and saved homes','Mortgage and budget calculators','Project galleries and floor plans','Viewing requests straight to WhatsApp'], zh:['带筛选和收藏的房源搜索','房贷与预算计算器','项目图库与平面图','看房预约直达 WhatsApp'], ms:['Pencari senarai dengan penapis dan simpanan','Kalkulator pinjaman dan bajet','Galeri projek dan pelan lantai','Permintaan tontonan terus ke WhatsApp']},
   ex:['fusion/harbour-lane.html','demos/atelier.html','demos/shelter.html']},
  {k:'training', label:{en:'Training · Education', zh:'培训 · 教育', ms:'Latihan · Pendidikan'}, short:{en:'training', zh:'培训机构', ms:'latihan'},
   pain:{en:'HR has three proposals open in three tabs. The provider whose site explains the outcome clearly wins the budget.', zh:'HR 在三个分页里打开了三份方案。能把成果讲清楚的培训方，拿下了预算。', ms:'HR buka tiga cadangan dalam tiga tab. Penyedia yang terangkan hasil dengan jelas menang bajet.'},
   feats:{en:['Programme finder and course calendar','Training ROI calculators for HR buyers','Cohort and in-house booking flows','Learning journeys that show outcomes'], zh:['课程查找与课程日历','给 HR 的培训 ROI 计算器','公开班与内训预约流程','展示成果的学习旅程'], ms:['Pencari program dan kalendar kursus','Kalkulator ROI latihan untuk pembeli HR','Aliran tempahan kohort dan dalaman','Perjalanan pembelajaran yang tunjukkan hasil']},
   ex:['fusion/cohort.html','fusion/facilitators-table.html','demos/people-first.html']},
  {k:'edu', label:{en:'Tuition · Enrichment', zh:'补习 · 才艺', ms:'Tuisyen · Pengayaan'}, short:{en:'learning centre', zh:'教育中心', ms:'pusat pembelajaran'},
   pain:{en:'It’s 11pm and a parent is comparing centres for next term. The one that shows the class, the time and a free trial in 30 seconds gets the WhatsApp.', zh:'晚上 11 点，家长在比较下学期的中心。30 秒内就能看到课程、时间和免费试课的那家，拿到了 WhatsApp。', ms:'Jam 11 malam, ibu bapa membanding pusat untuk penggal depan. Yang tunjuk kelas, masa dan kelas percubaan percuma dalam 30 saat dapat mesej WhatsApp.'},
   feats:{en:['Class finder by age, subject and day','Free trial booking in a few taps','Teacher profiles and fees per term','Term calendar and parent FAQs in EN / BM / 中文'], zh:['按年龄、科目和日期找课','几下就能预约免费试课','老师介绍与每学期学费','学期日历与家长常见问题（英 / 马 / 中）'], ms:['Pencari kelas ikut umur, subjek dan hari','Tempahan kelas percubaan dalam beberapa tekan','Profil guru dan yuran sepenggal','Kalendar penggal dan soalan lazim ibu bapa dalam BM / EN / 中文']},
   ex:['fusion/little-orbit.html','fusion/cohort.html','demos/bright.html']},
  {k:'stay', label:{en:'Stays · Travel', zh:'住宿 · 旅游', ms:'Penginapan · Pelancongan'}, short:{en:'stay', zh:'住宿生意', ms:'penginapan'},
   pain:{en:'Guests find you on a booking platform, then search your name. If there’s no site to book direct, the platform keeps the guest and the commission.', zh:'客人在订房平台看到你，再去搜索你的名字。如果没有可以直接预订的网站，客人和佣金都留在平台。', ms:'Tetamu jumpa anda di platform tempahan, kemudian cari nama anda. Jika tiada laman untuk tempah terus, platform simpan tetamu dan komisennya.'},
   feats:{en:['Availability calendar and direct booking requests','Room pages with sizes, beds and rates','Direct-booking perks you choose','Neighbourhood guide and WhatsApp concierge'], zh:['空房日历与直接订房申请','房型页面：面积、床型与价格','你自定的直订优惠','周边指南与 WhatsApp 礼宾'], ms:['Kalendar kekosongan dan permintaan tempahan terus','Halaman bilik dengan saiz, katil dan kadar','Kelebihan tempahan terus pilihan anda','Panduan kejiranan dan concierge WhatsApp']},
   ex:['fusion/rumah-teduh.html','demos/haven.html','demos/olive-villa.html']},
  {k:'b2b', label:{en:'Logistics · B2B', zh:'物流 · B2B', ms:'Logistik · B2B'}, short:{en:'B2B', zh:'B2B 生意', ms:'B2B'},
   pain:{en:'Procurement checks your website before they reply to your email. An outdated site quietly tells them you’re a risk.', zh:'采购在回复你的邮件之前，会先看你的网站。一个过时的网站，会悄悄告诉他们：你是风险。', ms:'Pegawai perolehan semak laman web anda sebelum balas e-mel. Laman yang lapuk diam-diam beritahu mereka anda satu risiko.'},
   feats:{en:['Instant quote engines','Capability and network pages','Lead capture that routes to the right team','Dashboards and data storytelling'], zh:['即时报价系统','能力与网络介绍页','自动分派给对口团队的询问收集','数据看板与数据叙事'], ms:['Enjin sebut harga segera','Halaman keupayaan dan rangkaian','Tangkapan prospek yang terus ke pasukan betul','Papan pemuka dan penceritaan data']},
   ex:['fusion/northbeam.html','demos/vector.html','demos/stack.html']},
  {k:'community', label:{en:'Mosques · Community', zh:'清真寺 · 社区', ms:'Masjid · Komuniti'}, short:{en:'mosque/community', zh:'宗教/社区组织', ms:'masjid/komuniti'},
   pain:{en:'Your community wants prayer times, class schedules and how to give, on their phone, in their language. Last month’s Facebook post isn’t it.', zh:'社区成员想在手机上，用自己的语言，查礼拜时间、课程表和捐献方式。上个月的 Facebook 帖子做不到。', ms:'Jemaah mahu waktu solat, jadual kelas dan cara menderma, di telefon, dalam bahasa mereka. Hantaran Facebook bulan lepas tidak cukup.'},
   feats:{en:['Live prayer or service times','Programme and class timetables','Donations with your official QR','Hall and facility booking in BM / EN / 中文'], zh:['实时礼拜或活动时间','活动与课程时间表','附官方 QR 的捐献页','礼堂与设施预约（马来文 / 英文 / 中文）'], ms:['Waktu solat atau ibadat secara langsung','Jadual program dan kelas','Derma dengan QR rasmi anda','Tempahan dewan dan kemudahan dalam BM / EN / 中文']},
   ex:['fusion/masjid.html','demos/common-ground.html','demos/good-question.html']},
];

const TIERS = [
  {k:'landing', name:{en:'Landing Page', zh:'单页网站', ms:'Halaman Pendaratan'}, sub:{en:'1 page', zh:'1 页', ms:'1 halaman'}, was:3500, now:2500,
   tag:{en:'Fastest way online', zh:'最快上线', ms:'Cara terpantas ke dalam talian'},
   feats:{en:['One page that tells customers who you are and what you offer','WhatsApp / call button','Great for a new business, promotion or event'], zh:['一页说清楚你是谁、提供什么','WhatsApp / 来电按钮','适合新生意、促销或活动'], ms:['Satu halaman yang beritahu pelanggan siapa anda dan apa yang anda tawarkan','Butang WhatsApp / panggilan','Sesuai untuk perniagaan baharu, promosi atau acara']}},
  {k:'business', name:{en:'Business Website', zh:'企业网站', ms:'Laman Web Perniagaan'}, sub:{en:'5–8 pages', zh:'5–8 页', ms:'5–8 halaman'}, was:7500, now:6000, feat:true,
   tag:{en:'Recommended for most SMEs', zh:'推荐给大多数中小企业', ms:'Disyorkan untuk kebanyakan PKS'},
   feats:{en:['Home, About, Services, Gallery, Contact and more','Enquiry form sent to your email','Google Maps and opening hours','Photo gallery'], zh:['首页、关于、服务、图库、联系等','询问表格直达你的邮箱','Google 地图与营业时间','照片图库'], ms:['Utama, Tentang, Perkhidmatan, Galeri, Hubungi dan lain-lain','Borang pertanyaan terus ke e-mel anda','Google Maps dan waktu operasi','Galeri foto']}},
  {k:'shop', name:{en:'Online Shop', zh:'网店', ms:'Kedai Dalam Talian'}, sub:{en:'Card · FPX · GrabPay', zh:'银行卡 · FPX · GrabPay', ms:'Kad · FPX · GrabPay'}, was:13800, now:10000,
   tag:{en:'Biggest saving', zh:'省最多', ms:'Penjimatan terbesar'},
   feats:{en:['Sell online and get paid by card, FPX or GrabPay','Easy admin panel and phone app to add products and manage orders yourself','Product pages, cart and checkout'], zh:['在线销售，支持银行卡、FPX、GrabPay 收款','简单后台和手机应用，自己上架产品、管理订单','产品页、购物车与结账'], ms:['Jual dalam talian dan terima bayaran kad, FPX atau GrabPay','Panel admin dan aplikasi telefon yang mudah untuk tambah produk dan urus pesanan sendiri','Halaman produk, troli dan pembayaran']}},
];

const PERSONAS = [
  {k:'creator', name:{en:'Creators', zh:'创作者', ms:'Pencipta kandungan'},
   pain:{en:'One algorithm change and your reach is gone.', zh:'算法一改，你的流量就没了。', ms:'Satu perubahan algoritma, capaian anda lenyap.'},
   promise:{en:'Your website is the audience nobody can take away: media kits that close brand deals, and a home base that grows your list.', zh:'网站是谁也拿不走的受众：能谈下品牌合作的媒体资料包，和不断增长订阅的个人主页。', ms:'Laman web ialah audiens yang tiada siapa boleh rampas: media kit yang menutup tawaran jenama, dan pangkalan yang mengembangkan senarai anda.'}},
  {k:'freelance', name:{en:'Freelancers', zh:'自由职业者', ms:'Pekerja bebas'},
   pain:{en:'Clients open twenty portfolios in twenty tabs. They close nineteen.', zh:'客户一次打开二十个作品集，关掉十九个。', ms:'Klien buka dua puluh portfolio dalam dua puluh tab. Sembilan belas ditutup.'},
   promise:{en:'Be the one they keep: a portfolio they play with, forward to their boss, and hire from.', zh:'成为留下的那一个：让人想玩、想转发给老板、最后直接聘请你的作品集。', ms:'Jadilah yang kekal: portfolio yang mereka main, kongsi dengan bos, dan terus upah.'}},
  {k:'ld', name:{en:'L&D professionals', zh:'培训与发展专业人士', ms:'Profesional L&D'},
   pain:{en:'HR has three proposals open. A PDF brochure loses to a site that shows the outcome.', zh:'HR 同时比较三份方案，PDF 简介输给了能展示成果的网站。', ms:'HR sedang banding tiga cadangan. Brosur PDF kalah kepada laman yang tunjukkan hasil.'},
   promise:{en:'Programme finders, ROI calculators and booking that turn curious HR leads into signed cohorts.', zh:'课程查找器、ROI 计算器和在线预约，把好奇的 HR 变成签约的学员。', ms:'Pencari program, kalkulator ROI dan tempahan yang menukar minat HR kepada kohort yang ditandatangani.'}},
];

const HALLS = [
  ['Business',{en:'Business',zh:'商业',ms:'Perniagaan'},{en:'Studios, firms, clinics, agencies',zh:'工作室、事务所、诊所、代理',ms:'Studio, firma, klinik, agensi'}],
  ['Hospitality',{en:'Hospitality',zh:'酒店餐饮',ms:'Hospitaliti'},{en:'Hotels, restaurants, cafés',zh:'酒店、餐厅、咖啡馆',ms:'Hotel, restoran, kafe'}],
  ['Retail',{en:'Retail',zh:'零售',ms:'Runcit'},{en:'Shops, brands, product drops',zh:'商店、品牌、新品发布',ms:'Kedai, jenama, pelancaran produk'}],
  ['Lifestyle',{en:'Lifestyle',zh:'生活方式',ms:'Gaya hidup'},{en:'Wellness, travel, personal brands',zh:'健康、旅行、个人品牌',ms:'Kesejahteraan, pelancongan, jenama peribadi'}],
  ['Culture',{en:'Culture',zh:'文化',ms:'Budaya'},{en:'Galleries, books, music, events',zh:'画廊、书籍、音乐、活动',ms:'Galeri, buku, muzik, acara'}],
  ['Technology',{en:'Technology',zh:'科技',ms:'Teknologi'},{en:'SaaS, AI, fintech, devtools',zh:'SaaS、AI、金融科技、开发工具',ms:'SaaS, AI, fintech, alat pembangun'}],
  ['Immersive',{en:'Immersive',zh:'沉浸式',ms:'Imersif'},{en:'Six worlds you can walk through',zh:'六个可以走进去的世界',ms:'Enam dunia yang boleh anda terokai'}],
  ['Hong Kong',{en:'Hong Kong',zh:'香港',ms:'Hong Kong'},'香港生活感'],
  ['Taiwan',{en:'Taiwan',zh:'台湾',ms:'Taiwan'},'台灣生活感'],
  ['Blue Spring',{en:'Blue Spring',zh:'蓝色春日',ms:'Musim Bunga Biru'},'藍色春日'],
  ['Modern Mix',{en:'Modern Mix',zh:'摩登组合',ms:'Gabungan Moden'},'摩登生活組合'],
];

/* ---------- Theme ---------- */
const setTheme = th => {
  document.documentElement.dataset.theme = th;
  $$('img[data-logo]').forEach(img => { img.src = th === 'light' ? img.dataset.light : img.dataset.dark; });
  $$('.theme').forEach(b => b.setAttribute('aria-label', t(th === 'light' ? 'theme.dark' : 'theme.light')));
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', th === 'light' ? '#f5f4f0' : '#0a0a0a');
};
$$('.theme').forEach(b => b.addEventListener('click', () => { const th = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; setTheme(th); store.set('ex-theme', th); }));

/* ---------- Nav ---------- */
const nav = $('.ex-nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll, {passive:true}); onScroll();
const burger = $('.ex-burger'), menu = $('.ex-menu');
const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.textContent = t(o ? 'nav.close' : 'nav.menu'); };
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('.ex-menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
const navLinks = $$('.ex-links a');
const secObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), {rootMargin:'-45% 0px -50% 0px'});
navLinks.forEach(a => { const s = $(a.getAttribute('href')); s && secObs.observe(s); });

/* ---------- Reveal ---------- */
const rvObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); } }), {threshold:.12});
$$('.rv,.how').forEach(el => rvObs.observe(el));

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

/* live, scaled iframe */
const liveFrame = (box, src, w = 1440, eager = false) => {
  const f = document.createElement('iframe');
  f.className = 'live'; f.setAttribute('tabindex', '-1'); f.setAttribute('aria-hidden', 'true'); f.setAttribute('scrolling', 'no'); f.title = '';
  f.style.width = w + 'px';
  const fit = () => { const s = box.clientWidth / w; if (!s) return; f.style.transform = `scale(${s}) translateY(-36px)`; f.style.height = Math.ceil(box.clientHeight / s + 36) + 'px'; };
  f.addEventListener('load', () => { if (f.src && !f.src.endsWith('about:blank')) f.classList.add('ready'); });
  box.appendChild(f); new ResizeObserver(fit).observe(box);
  let want = src, started = false;
  const go = () => { started = true; f.classList.remove('ready'); f.src = want; fit(); };
  if (eager) go(); else { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); go(); } }, {rootMargin:'400px'}); io.observe(box); }
  return {f, get src() { return want; }, set(s) { if (s === want) return; want = s; if (started) go(); }};
};

/* lite mode: phones / touch get snapshots instead of live iframes */
const lite = !fine || innerWidth < 800;
const thumbOf = h => { const m = /^fusion\/([\w-]+)\.html$/.exec(h || ''); return m ? 'fusion/thumbs/' + m[1] + '.webp' : null; };
const media = (box, src, w = 1440, eager = false) => {
  if (lite && thumbOf(src)) {
    const img = document.createElement('img'); img.className = 'snap-img'; img.alt = ''; img.loading = eager ? 'eager' : 'lazy'; img.decoding = 'async'; img.src = thumbOf(src);
    box.appendChild(img);
    let want = src; return {get src() { return want; }, set(x) { if (x === want) return; want = x; img.src = thumbOf(x) || img.src; }};
  }
  return liveFrame(box, src, w, eager);
};

/* ---------- Hero before/after ---------- */
const cmp = $('.cmp');
if (cmp) {
  media($('.cmp-b', cmp), cmp.dataset.src, 1440, true);
  const range = $('input', cmp);
  const setPos = v => cmp.style.setProperty('--pos', v + '%');
  range.addEventListener('input', () => { cmp.dataset.touched = 1; setPos(range.value); });
  /* drag anywhere on the picture (iOS Safari only drags a range by its tiny thumb) */
  let dragging = false, sx0 = 0, sy0 = 0, decided = false;
  const posFrom = e => { const r = cmp.getBoundingClientRect(); const v = clamp((e.clientX - r.left) / r.width * 100, 0, 100); cmp.dataset.touched = 1; setPos(v); range.value = v; };
  cmp.addEventListener('pointerdown', e => { dragging = true; decided = e.pointerType === 'mouse'; sx0 = e.clientX; sy0 = e.clientY; if (decided) { cmp.setPointerCapture(e.pointerId); posFrom(e); } });
  cmp.addEventListener('pointermove', e => {
    if (!dragging) return;
    if (!decided) { const dx = Math.abs(e.clientX - sx0), dy = Math.abs(e.clientY - sy0); if (dx < 6 && dy < 6) return; if (dy > dx) { dragging = false; return; } decided = true; try { cmp.setPointerCapture(e.pointerId); } catch (_) {} }
    posFrom(e);
  });
  const end = e => { if (dragging && !decided && e.type === 'pointerup') posFrom(e); dragging = false; };
  cmp.addEventListener('pointerup', end); cmp.addEventListener('pointercancel', end);
  if (!reduce) {
    const t0 = performance.now() + 1600;
    const sweep = now => {
      if (cmp.dataset.touched) return;
      const k = (now - t0) / 2800;
      if (k < 0) return requestAnimationFrame(sweep);
      const v = k >= 1 ? 50 : 50 + Math.sin(k * Math.PI * 2) * 30 * (1 - k);
      setPos(v); range.value = v;
      if (k < 1) requestAnimationFrame(sweep);
    };
    requestAnimationFrame(sweep);
  }
}

/* ---------- Zoom reveal ---------- */
const zoom = $('.ex-zoom');
if (zoom) {
  const frame = $('.zm-frame'), copy = $('.zm-copy');
  media(frame, frame.dataset.src);
  let ticking = false;
  const upd = () => {
    ticking = false;
    const r = zoom.getBoundingClientRect(), total = r.height - innerHeight;
    const p = clamp(-r.top / (total * .7), 0, 1), e = 1 - Math.pow(1 - p, 3);
    const s0 = innerWidth < 800 ? .78 : .5, s = s0 + (1 - s0) * e;
    frame.style.transform = `scale(${s})`;
    frame.style.borderRadius = (28 / s) * (1 - e) + 'px';
    const c = clamp((p - .55) / .3, 0, 1);
    copy.style.opacity = String(c); copy.style.transform = `translateY(${(1 - c) * 30}px)`;
    frame.style.setProperty('--shade', String(c));
  };
  if (reduce) { frame.style.transform = 'none'; copy.style.opacity = 1; frame.style.setProperty('--shade', '1'); }
  else { addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, {passive:true}); addEventListener('resize', upd); upd(); }
  $('.zm-open').addEventListener('click', () => openViewer(FITEMS, FITEMS.findIndex(it => it.href === frame.dataset.src)));
}

/* ---------- Fusion Lab track ---------- */
const track = $('.fx-track'), pin = $('.fx-pin'), bar = $('.fx-bar i'), fcount = $('.fx-count b');
track.innerHTML = FUSION.map((f, i) => `
  <article class="fx" tabindex="0" role="button" data-i="${i}" data-cursor="cur.step" aria-label="${esc(f.name)}" style="--c1:${f.c[0]};--c4:${f.c[3]}">
    <div class="fx-screen"><div class="fx-inner"><div class="fx-poster snap" style="background-image:url(fusion/thumbs/${f.slug}.webp)">${esc(f.name)}</div></div></div>
    <div class="fx-cap"><span class="mono">${f.no}</span><h3>${esc(f.name)}</h3><span class="mono formula">${esc(f.a)} × ${esc(f.b)}</span><p></p></div>
  </article>`).join('') + `<div class="fx-end"><span class="mono" style="color:var(--acc-t)">F-${String(FUSION.length + 1).padStart(2, '0')} · <span data-i18n="fx.reserved"></span></span><h3><span data-i18n-html="fx.endH"></span><span class="dot"></span></h3><a class="ex-btn solid" data-wa="wa.msg"><span data-i18n="fx.endBtn"></span> <span class="arr">→</span></a></div>`;
const fxEls = $$('.fx', track);
fxEls.forEach(el => {
  if (!lite) liveFrame($('.fx-inner', el), 'fusion/' + FUSION[+el.dataset.i].slug + '.html');
  const open = () => openViewer(FITEMS, +el.dataset.i);
  el.addEventListener('click', open);
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
});
const renderFusion = () => fxEls.forEach(el => { $('.fx-cap p', el).textContent = L(FUSION[+el.dataset.i].pitch); });
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
addEventListener('load', sizePin);
track.addEventListener('scroll', () => { if (!pinOn) fcount.textContent = String(clamp(Math.round(track.scrollLeft / fxEls[0].offsetWidth) + 1, 1, FUSION.length)).padStart(2, '0'); }, {passive:true});

/* ---------- FAQ card spotlight ---------- */
if (fine) $$('.faq-c').forEach(c => c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); }));

/* ---------- Why: who's building it? ---------- */
const w2 = $('.w2'), W2_OWN = {1: Array(8).fill('you'), 2: ['them', 'you', 'you', 'extra', 'maybe', 'them', 'extra', 'busy'], 3: Array(8).fill('us')};
let w2p = 1, w2auto = true;
function renderWhy(p = w2p, anim = false) {
  if (!w2) return;
  const prev = w2p; w2p = p; w2.dataset.p = p;
  $$('.w2-tabs button', w2).forEach(b => b.setAttribute('aria-selected', +b.dataset.p === p));
  const own = W2_OWN[p], left = own.filter(o => o !== 'us' && o !== 'them').length;
  $$('.w2-own', w2).forEach((el, n) => { el.className = 'w2-own own-' + own[n]; el.textContent = t('why2.o.' + own[n]); if (anim && W2_OWN[prev][n] !== own[n]) { void el.offsetWidth; el.classList.add('flip'); } });
  const arc = $('.w2-arc', w2); arc.style.strokeDashoffset = (326.7 * (1 - left / 8)).toFixed(1); arc.style.opacity = left ? 1 : 0;
  $('.w2-sub', w2).textContent = t('why2.sub' + p);
  $$('.w2-stats dd', w2).forEach(dd => { dd.textContent = t('why2.v' + p + '.' + dd.dataset.k); if (anim) { dd.classList.remove('swap'); void dd.offsetWidth; dd.classList.add('swap'); } });
  const num = $('.w2-num b', w2), from = +num.textContent || 0;
  if (!anim || reduce) num.textContent = left;
  else { const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / 700); num.textContent = Math.round(from + (left - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }
}
if (w2) {
  $$('.w2-tabs button', w2).forEach(b => b.addEventListener('click', () => { w2auto = false; renderWhy(+b.dataset.p, true); }));
  $('.w2-tabs', w2).addEventListener('keydown', e => { if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return; w2auto = false; const p = (w2p + (e.key === 'ArrowRight' ? 1 : 2)) % 3 + 1; renderWhy(p, true); $('.w2-tabs button[data-p="' + p + '"]', w2).focus(); });
  if (!reduce) { const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; io.disconnect(); setTimeout(() => { if (w2auto) renderWhy(2, true); }, 1800); setTimeout(() => { if (w2auto) renderWhy(3, true); }, 4200); }, {threshold: .45}); io.observe(w2); }
}

/* ---------- Calculator ---------- */
const calc = $('.calc');
let lift = 1;
const calcUpd = () => {
  const v = +$('#c-vis').value, val = +$('#c-val').value;
  $('#c-vis-o').textContent = fmt(v); $('#c-val-o').textContent = 'RM ' + fmt(val);
  const cust = v * lift / 100, month = cust * val;
  const big = $('.calc-big b');
  const from = +big.dataset.v || 0, to = month, t0 = performance.now();
  big.dataset.v = to;
  const step = now => { const k = reduce ? 1 : Math.min(1, (now - t0) / 500); big.textContent = '+RM ' + fmt(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
  $('.calc-sub').textContent = t('calc.extra', {c: cust < 10 ? cust.toFixed(1) : fmt(cust), y: fmt(month * 12)});
  $('.calc-out .ex-btn').href = waLink(t('wa.msg'));
  const pay = $('.calc-pay'); if (pay) { const days = month > 0 ? 6000 / (month / 30.4) : 0; pay.hidden = !month; pay.innerHTML = t('calc.pay', {d: days < 1 ? '&lt;1' : fmt(Math.ceil(days))}); }
};
$$('#c-vis,#c-val', calc).forEach(i => i.addEventListener('input', calcUpd));
$$('.calc-lift button', calc).forEach(b => b.addEventListener('click', () => { lift = +b.dataset.l; $$('.calc-lift button', calc).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); calcUpd(); }));

/* ---------- SME picker ---------- */
const chips = $('.sme-chips'), panel = $('.sme-panel');
let curSme = 'fnb';
const thumbFor = (box, href) => {
  const it = byHref(href);
  if (it?.kind === 'card') box.append(...[...$('.design-preview', it.el).children].filter(n => !n.classList.contains('preview-link')).map(n => n.cloneNode(true)));
  else media(box, href, 1440);
};
const showSme = (k, anim = true) => {
  curSme = k; const s = SME.find(x => x.k === k) || SME[0];
  chips.innerHTML = SME.map(x => `<button type="button" class="sme-chip${x.k === s.k ? ' on' : ''}" data-k="${x.k}" aria-pressed="${x.k === s.k}">${esc(L(x.label))}</button>`).join('');
  panel.innerHTML = `<div><div class="moment"><span class="mono">${esc(t('pick.moment'))}</span><p>${esc(L(s.pain))}</p></div><h4 class="mono">${esc(t('pick.build'))}</h4><ul>${L(s.feats).map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>
    <div><h4 class="mono" style="margin-bottom:14px">${esc(t('pick.live'))}</h4><div class="sme-ex">${s.ex.map(h => { const it = byHref(h); return it ? `<button type="button" data-href="${h}" data-cursor="cur.open"><div class="sme-thumb"></div><b>${esc(it.name)}</b><small>${esc(it.no)}</small></button>` : ''; }).join('')}</div>
    <a class="ex-btn wa" href="${waLink(t('wa.ind', {x: L(s.short)}))}" target="_blank" rel="noopener">${WA_SVG}${esc(t('pick.cta', {x: L(s.short)}))}</a></div>`;
  $$('.sme-ex button', panel).forEach(b => thumbFor($('.sme-thumb', b), b.dataset.href));
  if (anim) { panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap'); }
};
chips.addEventListener('click', e => { const c = e.target.closest('.sme-chip'); if (c) showSme(c.dataset.k); });
panel.addEventListener('click', e => { const b = e.target.closest('[data-href]'); if (!b) return; const list = $$('[data-href]', panel).map(x => byHref(x.dataset.href)).filter(Boolean); openViewer(list, list.findIndex(it => it.href === b.dataset.href)); });

/* ---------- Pricing ---------- */
const tiersEl = $('.tiers');
const renderPricing = () => {
  tiersEl.innerHTML = TIERS.map(x => `<article class="tier${x.feat ? ' feat' : ''}"><span class="tier-tag">${esc(L(x.tag))}</span>
    <div><span class="sub">${esc(L(x.sub))}</span><h3>${esc(L(x.name))}</h3></div>
    <div class="tier-price"><b><small>RM</small>${fmt(x.now)}</b><s>${esc(t('price.was'))} RM${fmt(x.was)}</s></div>
    <div class="tier-save"><span>${esc(t('price.save', {x: fmt(x.was - x.now)}))}</span><small>${esc(t('price.day', {d: Math.round(x.now / 365)}))}</small></div>
    <ul>${L(x.feats).map(f => `<li>${esc(f)}</li>`).join('')}</ul>
    <a class="ex-btn ${x.feat ? 'wa' : 'solid'}" href="${waLink(t('price.msg', {t: L(x.name), p: 'RM' + fmt(x.now)}))}" target="_blank" rel="noopener">${WA_SVG}${esc(t('price.cta'))}</a></article>`).join('');
  const cny = $('.price-cny'); if (cny) cny.textContent = t('price.cny');
  $('.inc-chips').innerHTML = [1,2,3,4,5,6,7,8].map(i => `<span>${esc(t('price.inc' + i))}</span>`).join('');
};
const END = new Date('2026-12-31T23:59:59+08:00').getTime();
const cd = $('.cd'), barCd = $('.bar-cd');
const parts = () => { const ms = Math.max(0, END - Date.now()); return {ms, d: Math.floor(ms / 864e5), h: Math.floor(ms % 864e5 / 36e5), m: Math.floor(ms % 36e5 / 6e4), s: Math.floor(ms % 6e4 / 1e3)}; };
const pad = n => String(n).padStart(2, '0');
const tick = () => {
  const p = parts();
  if (p.ms <= 0) { cd.textContent = t('price.over'); document.documentElement.classList.remove('has-bar'); return; }
  cd.innerHTML = `<span class="lbl">${esc(t('price.ends'))}</span><div class="cd-cells">${[['d', p.d], ['h', pad(p.h)], ['m', pad(p.m)], ['s', pad(p.s)]].map(([k, v]) => `<div><b>${v}</b><small>${esc(t('cd.' + k))}</small></div>`).join('')}</div>`;
  if (barCd) barCd.textContent = `${t('bar.ends')} ${p.d}${lang === 'en' ? 'd' : (lang === 'zh' ? t('cd.d') : ' ' + t('cd.d'))} ${pad(p.h)}:${pad(p.m)}:${pad(p.s)}`;
};
setInterval(tick, 1000);

/* ---------- Personas ---------- */
const psTabs = $('.ps-tabs'), psChips = $('.ps-chips');
let psI = 0, psEx = 0, psTimer = null, psFrame = null, psPaused = false, psSeen = false;
const psList = () => FITEMS.filter(it => it.f.aud === PERSONAS[psI].k);
const renderPersonas = () => {
  psTabs.innerHTML = PERSONAS.map((p, i) => `<button type="button" class="ps-tab${i === psI ? ' on' : ''}" data-i="${i}" aria-pressed="${i === psI}"><span class="mono">${esc(L(p.name))}</span><b>${esc(L(p.pain))}</b><p>${esc(L(p.promise))}</p><i></i></button>`).join('');
  const list = psList();
  psChips.innerHTML = list.map((it, j) => `<button type="button" class="${j === psEx ? 'on' : ''}" data-j="${j}">${esc(it.name)}</button>`).join('');
  const src = list[psEx]?.href;
  if (!psFrame) psFrame = media($('.ps-screen'), src); else psFrame.set(src);
};
const psArm = () => { clearTimeout(psTimer); if (!psPaused && !reduce && psSeen) psTimer = setTimeout(() => { psI = (psI + 1) % PERSONAS.length; psEx = 0; renderPersonas(); psArm(); }, 8000); };
const psPause = () => { psPaused = true; clearTimeout(psTimer); psTabs.classList.add('paused'); };
psTabs.addEventListener('click', e => { const b = e.target.closest('.ps-tab'); if (b) { psPause(); psI = +b.dataset.i; psEx = 0; renderPersonas(); } });
psChips.addEventListener('click', e => { const b = e.target.closest('[data-j]'); if (b) { psPause(); psEx = +b.dataset.j; renderPersonas(); } });
$('.ps-screen').addEventListener('click', () => openViewer(psList(), psEx));
$('.ps-open').addEventListener('click', () => openViewer(psList(), psEx));
new IntersectionObserver(([e]) => { psSeen = e.isIntersecting; if (psSeen) psArm(); else clearTimeout(psTimer); }, {threshold:.3}).observe($('.ps'));

/* ---------- Filters ---------- */
const buttons = $$('.filter[data-category]'), search = $('#design-search'), countEl = $('#gallery-count'), empty = $('.empty-state');
const match = (card, c) => c === 'all' || card.dataset.category === c || card.dataset.mood === c || card.dataset.style === c;
buttons.forEach(b => { const n = b.dataset.category === 'all' ? cards.length : cards.filter(c => match(c, b.dataset.category)).length; b.dataset.orig = b.firstChild.textContent.trim(); b.insertAdjacentHTML('beforeend', ` <sup>${n}</sup>`); });
let category = 'all';
const visible = () => ITEMS.filter(it => !it.el.hidden);
const filterLabel = b => DICT.en['f.' + b.dataset.category] ? t('f.' + b.dataset.category) : b.dataset.orig;
function filterDesigns(animate = true) {
  const q = search.value.trim().toLowerCase(); let shown = 0;
  for (const card of cards) {
    const show = match(card, category) && card.dataset.search.includes(q);
    if (card.hidden === show) { card.hidden = !show; if (show && animate) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; } }
    if (show) shown++;
  }
  const b = buttons.find(x => x.dataset.category === category);
  const lbl = category === 'all' ? t('col.all') : (b ? filterLabel(b) : category);
  countEl.innerHTML = t('col.count', {n: shown, l: esc(lbl)}) + (q ? ` · “${esc(q)}”` : '');
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
const ix = $('.ix'), peek = $('.ix-peek');
const renderIndex = () => {
  ix.innerHTML = HALLS.map(([h, n, d], i) => `<button class="ix-row" type="button" data-hall="${h}" data-cursor="cur.filter"><span class="mono">${String(i + 1).padStart(2, '0')}</span><b>${esc(L(n))}</b><small>${esc(L(d))}</small><span class="n">${cards.filter(x => match(x, h)).length}</span></button>`).join('');
};
ix.addEventListener('click', e => { const r = e.target.closest('.ix-row'); if (r) goHall(r.dataset.hall); });
if (fine) {
  ix.addEventListener('pointerover', e => {
    const row = e.target.closest('.ix-row'); if (!row || row === ix._cur) return; ix._cur = row;
    const pool = cards.filter(c => match(c, row.dataset.hall)); const c = pool[Math.floor(Math.random() * Math.min(pool.length, 6))]; if (!c) return;
    peek.replaceChildren(...[...$('.design-preview', c).children].filter(n => !n.classList.contains('preview-link')).map(n => n.cloneNode(true)));
    peek.classList.add('on');
  });
  ix.addEventListener('pointerleave', () => { ix._cur = null; peek.classList.remove('on'); });
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
    const el = e.target.closest?.('[data-cursor],.design-card');
    if (el && !e.target.closest('.ex-viewer,.ex-pal')) { cur.textContent = t(el.dataset.cursor || 'cur.view'); cur.classList.add('on'); } else cur.classList.remove('on');
  }, {passive:true});
  (function loop() { cx += (kx - cx) * .2; cy += (ky - cy) * .2; cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; requestAnimationFrame(loop); })();
} else cur.remove();

/* ---------- View toggle + surprise ---------- */
$$('.ex-viewset button').forEach(b => b.addEventListener('click', () => {
  $$('.ex-viewset button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
  grid.classList.toggle('compact', b.dataset.view === 'compact'); store.set('ex-view', b.dataset.view);
}));
if (store.get('ex-view') === 'compact') $('.ex-viewset [data-view="compact"]').click();
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
  vw.classList.add('open'); vw.setAttribute('aria-hidden', 'false'); document.documentElement.style.overflow = 'hidden'; document.body.classList.add('vw-open'); document.body.classList.remove('mbar-on');
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
vIfr.addEventListener('load', () => {
  vStage.classList.remove('busy'); vFrame.classList.remove('loading');
  let doc; try { doc = vIfr.contentDocument; } catch (_) { return; }
  if (!doc || !vw.classList.contains('open')) return;
  const isShowcase = u => u.origin === location.origin && /^\/website\/?(index\.html)?$/.test(u.pathname);
  if (isShowcase(new URL(doc.location.href))) { closeViewer(); return; }
  doc.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    const u = new URL(a.getAttribute('href'), doc.baseURI);
    if (isShowcase(u)) { e.preventDefault(); closeViewer(); }
    else if (u.origin === location.origin && /^\/contact(\.html)?$/.test(u.pathname)) { e.preventDefault(); window.open(waLink(t('vw.like', {n: vList[vI]?.name || ''})), '_blank', 'noopener'); }
  }, true);
});
function closeViewer() {
  vw.classList.remove('open'); vw.setAttribute('aria-hidden', 'true'); document.documentElement.style.overflow = ''; document.body.classList.remove('vw-open');
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
/* click the dark area around the site to close */
vStage.addEventListener('click', e => { if (e.target === vStage || e.target.classList.contains('vw-hint')) closeViewer(); });
vw.addEventListener('click', e => { if (e.target === vw) closeViewer(); });
vStage.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 70) showV(vI + (dx < 0 ? 1 : -1)); sx = null; });

/* ---------- Command palette ---------- */
const pal = $('.ex-pal'), pIn = $('.pal-box input'), pList = $('.pal-list');
let pRes = [], pSel = 0;
const renderPal = () => {
  const q = pIn.value.trim().toLowerCase();
  pRes = (q ? ALL.filter(it => (it.name + ' ' + it.type + ' ' + it.cat + ' ' + (it.el?.dataset.search || '') + ' ' + (it.f ? Object.values(it.f.pitch).join(' ') : '')).toLowerCase().includes(q)) : ALL).slice(0, 40);
  pSel = Math.min(pSel, Math.max(0, pRes.length - 1));
  pList.innerHTML = pRes.length ? pRes.map((it, i) => `<button class="pal-item${i === pSel ? ' on' : ''}" data-i="${i}" role="option" aria-selected="${i === pSel}"><i style="--pc:${it.swatch}"></i><span><b>${esc(it.name)}</b><small>${esc(it.cat)}${it.type ? ' · ' + esc(it.type) : ''}</small></span><span class="mono">${esc(it.no)}</span></button>`).join('')
    : `<p style="padding:24px;color:var(--mut);margin:0">${esc(t('pal.none'))} <a href="${waLink(t('wa.msg'))}" target="_blank" rel="noopener" style="color:var(--acc)">WhatsApp →</a></p>`;
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
  const ae = document.activeElement;
  const typing = /INPUT|TEXTAREA|SELECT/.test(ae?.tagName) && ae.type !== 'range';
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

/* ---------- WhatsApp bubble ---------- */
const bub = $('.wa-bub');
if (!store.get('ex-wa-bub')) setTimeout(() => { if (!document.body.classList.contains('vw-open')) { bub.classList.add('on'); setTimeout(() => bub.classList.remove('on'), 9000); } }, 9000);
$('button', bub).addEventListener('click', () => { bub.classList.remove('on'); store.set('ex-wa-bub', '1'); });

/* ---------- Urgency: offer bar, mobile CTA bar, exit intent ---------- */
const ss = {get: k => { try { return sessionStorage.getItem(k); } catch (_) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (_) {} }};
if (END > Date.now() && !ss.get('ex-bar-x')) document.documentElement.classList.add('has-bar');
$('.ex-bar button')?.addEventListener('click', () => { document.documentElement.classList.remove('has-bar'); ss.set('ex-bar-x', '1'); requestAnimationFrame(sizePin); });
const heroEl = $('.ex-hero');
const mbarUpd = () => document.body.classList.toggle('mbar-on', scrollY > heroEl.offsetHeight * .75 && !document.body.classList.contains('vw-open'));
addEventListener('scroll', mbarUpd, {passive:true});
const exitEl = $('.ex-exit');
if (exitEl) {
  const openExit = () => { if (exitEl.classList.contains('open') || document.body.classList.contains('vw-open') || store.get('ex-exit') || END <= Date.now()) return; store.set('ex-exit', '1'); $('.exit-box h3').innerHTML = t('exit.h', {d: parts().d}); exitEl.classList.add('open'); exitEl.setAttribute('aria-hidden', 'false'); setTimeout(() => $('.exit-box .ex-btn').focus(), 50); };
  const closeExit = () => { exitEl.classList.remove('open'); exitEl.setAttribute('aria-hidden', 'true'); };
  const armedAt = Date.now() + 12000;
  if (fine) document.addEventListener('mouseout', e => { if (!e.relatedTarget && e.clientY <= 4 && Date.now() > armedAt) openExit(); });
  exitEl.addEventListener('click', e => { if (e.target === exitEl || e.target.closest('.x,.no,[href="#pricing"]')) closeExit(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && exitEl.classList.contains('open')) closeExit(); });
}

/* ---------- Apply language ---------- */
function applyLang(l) {
  lang = DICT[l] ? l : 'en'; store.set('ex-lang', lang);
  document.documentElement.lang = LANGS[lang];
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n, {n: el.dataset.n}); });
  $$('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml, {n: el.dataset.n}); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh, {n: el.dataset.n}); });
  $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  $$('[data-wa]').forEach(a => { a.href = waLink(t(a.dataset.wa)); a.target = '_blank'; a.rel = 'noopener'; });
  $$('.lang button').forEach(b => { const on = b.dataset.lang === lang; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  buttons.forEach(b => { b.firstChild.textContent = filterLabel(b) + ' '; });
  burger.textContent = t(menu.classList.contains('open') ? 'nav.close' : 'nav.menu');
  setTheme(document.documentElement.dataset.theme || 'dark');
  renderFusion(); renderWhy(); showSme(curSme, false); renderPricing(); renderPersonas(); renderIndex(); calcUpd(); tick(); filterDesigns(false);
  if (pal.classList.contains('open')) renderPal();
  requestAnimationFrame(sizePin);
}
$$('.lang button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ---------- Boot ---------- */
applyLang(lang);
const requested = url.searchParams.get('category');
const reqBtn = requested && buttons.find(b => b.dataset.category.toLowerCase() === requested.toLowerCase());
if (reqBtn) setCat(reqBtn.dataset.category, false);
const vh = location.hash.match(/^#view=(.+)$/);
if (vh) { const i = ALL.findIndex(it => it.href === decodeURIComponent(vh[1])); if (i >= 0) openViewer(ALL, i); }
else if (location.hash === '#collection' || reqBtn) {
  const jump = () => { document.documentElement.style.scrollBehavior = 'auto'; $('#collection').scrollIntoView(); document.documentElement.style.scrollBehavior = ''; };
  let touched = false; ['wheel', 'touchstart', 'keydown'].forEach(ev => addEventListener(ev, () => { touched = true; }, {once:true, passive:true}));
  requestAnimationFrame(jump); addEventListener('load', () => { if (!touched) jump(); }, {once:true});
}
})();
