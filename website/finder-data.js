/* Aurelion website finder: shared data for the finder (index.html) and the instant preview (preview.html). */
window.AF = (() => {
'use strict';
const END = Date.parse('2026-12-31T23:59:59+08:00');
const promo = () => Date.now() < END;

const TIERS = {
  landing:  {was:3500,  now:2500,  name:{en:'Landing Page', zh:'单页网站', ms:'Halaman Pendaratan'}, sub:{en:'1 page', zh:'1 页', ms:'1 halaman'}},
  business: {was:7500,  now:6000,  name:{en:'Business Website', zh:'企业网站', ms:'Laman Web Perniagaan'}, sub:{en:'5–8 pages', zh:'5–8 页', ms:'5–8 halaman'}},
  shop:     {was:13800, now:10000, name:{en:'Online Shop', zh:'网店', ms:'Kedai Dalam Talian'}, sub:{en:'Card · FPX · GrabPay', zh:'银行卡 · FPX · GrabPay', ms:'Kad · FPX · GrabPay'}},
};
const price = k => promo() ? TIERS[k].now : TIERS[k].was;

/* goals: what the site must do first */
const GOALS = {
  enq:  {en:'Get enquiries on WhatsApp', zh:'带来 WhatsApp 询问', ms:'Dapat pertanyaan WhatsApp'},
  book: {en:'Take bookings', zh:'接受预约', ms:'Terima tempahan'},
  sell: {en:'Sell online', zh:'在线销售', ms:'Jual dalam talian'},
  cred: {en:'Look credible to bigger clients', zh:'让大客户信任你', ms:'Nampak meyakinkan kepada klien besar'},
};

const VIBES = {
  warm:    {en:'Warm', zh:'温暖', ms:'Mesra'},
  bold:    {en:'Bold', zh:'大胆', ms:'Berani'},
  minimal: {en:'Minimal', zh:'简约', ms:'Minimalis'},
  luxe:    {en:'Luxe', zh:'奢华', ms:'Mewah'},
};

/* industries: tpl = closest live exhibit; goal = default goal; demo = sample business */
const IND = [
 {k:'reno', tpl:'fusion/batu-beam.html', goal:'enq',
  label:{en:'Renovation · Interior design', zh:'装修 · 室内设计', ms:'Ubah suai · Reka bentuk dalaman'},
  demo:{en:'Batu & Beam Renovation', zh:'石梁装修', ms:'Batu & Beam Renovation'},
  h1:{en:'Know the plan, the price and the timeline before we knock down a wall.', zh:'动工之前，先看清方案、预算和工期。', ms:'Tahu pelan, harga dan tempoh sebelum satu dinding pun diroboh.'},
  sub:{en:'Condo, landed and shoplot renovations with 3D design, clear quotes and one team from site visit to handover.', zh:'公寓、有地住宅和店屋装修：3D 设计、清楚报价，从看现场到交钥匙一个团队负责。', ms:'Ubah suai kondo, rumah teres dan kedai dengan reka bentuk 3D, sebut harga jelas dan satu pasukan dari lawatan tapak hingga serahan.'},
  svc:{en:['Kitchen & bathroom','Built-in carpentry','Full home makeover'], zh:['厨房与浴室','定制木工','全屋翻新'], ms:['Dapur & bilik air','Kabinet terbina dalam','Ubah suai seluruh rumah']}},
 {k:'clinic', tpl:'fusion/seri-dental.html', goal:'book',
  label:{en:'Clinic · Dental · Aesthetics', zh:'诊所 · 牙科 · 医美', ms:'Klinik · Pergigian · Estetik'},
  demo:{en:'Seri Dental Clinic', zh:'Seri 牙科诊所', ms:'Klinik Pergigian Seri'},
  h1:{en:'Gentle, unhurried care for the whole family.', zh:'不赶时间的温和照护，照顾全家人。', ms:'Rawatan yang lembut dan tidak tergesa-gesa untuk seluruh keluarga.'},
  sub:{en:'See our dentists, treatments and fees from, then pick a time that suits you. We speak English, BM and 中文.', zh:'先了解医生、疗程和收费起价，再选一个方便的时间。我们说英文、马来文和中文。', ms:'Kenali doktor gigi, rawatan dan yuran bermula, kemudian pilih masa yang sesuai. Kami bertutur BM, English dan 中文.'},
  svc:{en:['Check-up & cleaning','Braces & aligners','Kids’ dentistry'], zh:['检查与洗牙','牙套与隐形矫正','儿童牙科'], ms:['Pemeriksaan & pembersihan','Pendakap & aligner','Pergigian kanak-kanak']}},
 {k:'edu', tpl:'fusion/little-orbit.html', goal:'book',
  label:{en:'Tuition · Enrichment · Preschool', zh:'补习 · 才艺 · 幼儿园', ms:'Tuisyen · Pengayaan · Prasekolah'},
  demo:{en:'Little Orbit Learning', zh:'小轨道学习中心', ms:'Little Orbit Learning'},
  h1:{en:'Find the right class for your child in 30 seconds.', zh:'30 秒，为孩子找到合适的课程。', ms:'Cari kelas yang sesuai untuk anak anda dalam 30 saat.'},
  sub:{en:'Small classes, caring teachers and progress you can see. Book a free trial class tonight.', zh:'小班教学、用心的老师、看得见的进步。今晚就预约免费试课。', ms:'Kelas kecil, guru yang prihatin dan kemajuan yang boleh dilihat. Tempah kelas percubaan percuma malam ini.'},
  svc:{en:['Maths & science','Mandarin & phonics','Coding & robotics'], zh:['数学与科学','华文与拼读','编程与机器人'], ms:['Matematik & sains','Mandarin & fonik','Pengekodan & robotik']}},
 {k:'stay', tpl:'fusion/rumah-teduh.html', goal:'book',
  label:{en:'Homestay · Hotel · Travel', zh:'民宿 · 酒店 · 旅游', ms:'Homestay · Hotel · Pelancongan'},
  demo:{en:'Rumah Teduh Heritage Stay', zh:'Rumah Teduh 老屋民宿', ms:'Rumah Teduh Heritage Stay'},
  h1:{en:'Slow mornings in a hundred-year-old shophouse.', zh:'在百年店屋里，过一个慢悠悠的早晨。', ms:'Pagi yang tenang di rumah kedai berusia seratus tahun.'},
  sub:{en:'Six rooms in the heart of town. Check dates, pick your room and book direct with the people who run the house.', zh:'市中心的六间客房。查日期、选房间，直接向主人预订。', ms:'Enam bilik di tengah bandar. Semak tarikh, pilih bilik dan tempah terus dengan pemilik rumah.'},
  svc:{en:['Garden room','Family loft','Breakfast included'], zh:['花园房','家庭阁楼','含早餐'], ms:['Bilik taman','Loteng keluarga','Termasuk sarapan']}},
 {k:'fnb', tpl:'demos/ember.html', goal:'enq',
  label:{en:'F&B · Café · Catering', zh:'餐饮 · 咖啡馆 · 到会', ms:'F&B · Kafe · Katering'},
  demo:{en:'Ember & Salt Kitchen', zh:'炭与盐厨房', ms:'Ember & Salt Kitchen'},
  h1:{en:'Hungry? Here’s tonight’s menu.', zh:'饿了吗？这是今晚的菜单。', ms:'Lapar? Ini menu malam ini.'},
  sub:{en:'Fresh food, real prices and one-tap WhatsApp orders. Find us on Google Maps, open till late.', zh:'新鲜食物、清楚价格、一键 WhatsApp 点餐。Google 地图找得到我们，营业到很晚。', ms:'Makanan segar, harga jelas dan pesanan WhatsApp sekali tekan. Cari kami di Google Maps, buka hingga lewat.'},
  svc:{en:['Set lunch','Family dinners','Event catering'], zh:['午餐套餐','家庭晚餐','活动到会'], ms:['Set makan tengah hari','Makan malam keluarga','Katering majlis']}},
 {k:'retail', tpl:'fusion/forge-field.html', goal:'sell',
  label:{en:'Retail · Online shop', zh:'零售 · 网店', ms:'Runcit · Kedai dalam talian'},
  demo:{en:'Forge & Field Goods', zh:'Forge & Field 好物', ms:'Forge & Field Goods'},
  h1:{en:'Things worth keeping. Delivered to your door.', zh:'值得留下的好物，送到你家门口。', ms:'Barangan yang berbaloi disimpan. Dihantar ke pintu anda.'},
  sub:{en:'Shop the collection, pay by card, FPX or GrabPay, and get it delivered across Malaysia.', zh:'浏览商品，用银行卡、FPX 或 GrabPay 付款，全马送货。', ms:'Beli koleksi, bayar dengan kad, FPX atau GrabPay, dan terima di seluruh Malaysia.'},
  svc:{en:['New arrivals','Best sellers','Gift sets'], zh:['新品','热卖','礼盒'], ms:['Ketibaan baharu','Paling laris','Set hadiah']}},
 {k:'property', tpl:'fusion/harbour-lane.html', goal:'enq',
  label:{en:'Property · Real estate agent', zh:'房产 · 房地产经纪', ms:'Hartanah · Ejen hartanah'},
  demo:{en:'Harbour Lane Realty', zh:'港巷地产', ms:'Harbour Lane Realty'},
  h1:{en:'Find the home before you book the viewing.', zh:'先找到心仪的家，再约看房。', ms:'Jumpa rumah idaman sebelum menempah lawatan.'},
  sub:{en:'Listings with real photos, honest prices and a mortgage calculator. Viewing requests straight to WhatsApp.', zh:'真实照片、清楚价格的房源，附房贷计算器。看房预约直达 WhatsApp。', ms:'Senarai dengan gambar sebenar, harga jujur dan kalkulator pinjaman. Permintaan lawatan terus ke WhatsApp.'},
  svc:{en:['Buy','Rent','Sell with us'], zh:['买房','租房','委托出售'], ms:['Beli','Sewa','Jual bersama kami']}},
 {k:'pro', tpl:'demos/counsel.html', goal:'cred',
  label:{en:'Law · Accounting · Consulting', zh:'律师 · 会计 · 顾问', ms:'Guaman · Perakaunan · Perundingan'},
  demo:{en:'Meridian & Co.', zh:'子午律师事务所', ms:'Meridian & Co.'},
  h1:{en:'Clear advice for decisions that matter.', zh:'为重要决定，提供清楚的专业意见。', ms:'Nasihat jelas untuk keputusan yang penting.'},
  sub:{en:'A focused team for growing companies and families. Straight answers, fixed scopes, no surprises on the invoice.', zh:'专注服务成长中的企业和家庭。直接的答案、明确的范围，账单不会有意外。', ms:'Pasukan fokus untuk syarikat dan keluarga yang berkembang. Jawapan terus, skop tetap, tiada kejutan pada invois.'},
  svc:{en:['Corporate & commercial','Tax & accounting','Advisory'], zh:['企业与商业','税务与会计','咨询'], ms:['Korporat & komersial','Cukai & perakaunan','Khidmat nasihat']}},
 {k:'training', tpl:'fusion/facilitators-table.html', goal:'cred',
  label:{en:'Training provider · Coach', zh:'培训机构 · 教练', ms:'Penyedia latihan · Jurulatih'},
  demo:{en:'The Facilitator’s Table', zh:'引导者之桌', ms:'The Facilitator’s Table'},
  h1:{en:'Training your managers will still talk about next quarter.', zh:'让主管们下个季度还在谈论的培训。', ms:'Latihan yang pengurus anda masih bincangkan suku tahun depan.'},
  sub:{en:'Practical in-house programmes with outcomes HR can report. Find a programme, see the ROI, book a call.', zh:'实用的企业内训，成果 HR 可以汇报。找课程、看 ROI、约个电话。', ms:'Program dalaman praktikal dengan hasil yang HR boleh lapor. Cari program, lihat ROI, tempah panggilan.'},
  svc:{en:['Leadership','Team performance','Communication'], zh:['领导力','团队绩效','沟通'], ms:['Kepimpinan','Prestasi pasukan','Komunikasi']}},
 {k:'creator', tpl:'fusion/nova-cut.html', goal:'cred',
  label:{en:'Creator · Freelancer · Personal brand', zh:'创作者 · 自由职业 · 个人品牌', ms:'Pencipta · Pekerja bebas · Jenama peribadi'},
  demo:{en:'Nova Studio', zh:'Nova 工作室', ms:'Nova Studio'},
  h1:{en:'The work speaks. This is where it lives.', zh:'作品会说话，这里是它的家。', ms:'Hasil kerja bercakap sendiri. Di sinilah tempatnya.'},
  sub:{en:'Portfolio, rate card and a booking calendar in one place that no algorithm can take away.', zh:'作品集、报价单和档期日历都在一个地方，谁也拿不走。', ms:'Portfolio, kad kadar dan kalendar tempahan di satu tempat yang tiada algoritma boleh rampas.'},
  svc:{en:['Brand collaborations','Projects','Workshops'], zh:['品牌合作','项目','工作坊'], ms:['Kolaborasi jenama','Projek','Bengkel']}},
 {k:'community', tpl:'fusion/masjid.html', goal:'cred',
  label:{en:'Mosque · Church · Temple · NGO', zh:'清真寺 · 教会 · 庙宇 · 非营利', ms:'Masjid · Gereja · Kuil · NGO'},
  demo:{en:'Common Ground Community', zh:'同心社区', ms:'Komuniti Common Ground'},
  h1:{en:'Everything our community needs, in one place.', zh:'社区需要的一切，都在这里。', ms:'Semua yang komuniti kita perlukan, di satu tempat.'},
  sub:{en:'Service times, classes, events and how to give, on your phone, in your language.', zh:'活动时间、课程、活动和捐献方式，在手机上，用你的语言。', ms:'Waktu ibadat, kelas, acara dan cara menderma, di telefon anda, dalam bahasa anda.'},
  svc:{en:['This week','Classes & programmes','Give'], zh:['本周活动','课程与项目','捐献'], ms:['Minggu ini','Kelas & program','Derma']}},
 {k:'other', tpl:'demos/meridian.html', goal:'enq',
  label:{en:'Something else', zh:'其他行业', ms:'Lain-lain'},
  demo:{en:'Your Company Sdn Bhd', zh:'你的公司', ms:'Syarikat Anda Sdn Bhd'},
  h1:{en:'Good work, done properly. See what we do.', zh:'把事情做好、做对。看看我们做什么。', ms:'Kerja yang baik, dibuat dengan betul. Lihat apa yang kami buat.'},
  sub:{en:'Who we are, what we offer and how to reach us in one tap. Serving customers across Malaysia.', zh:'我们是谁、提供什么、如何一键联系我们。服务全马客户。', ms:'Siapa kami, apa yang kami tawarkan dan cara hubungi kami sekali tekan. Berkhidmat di seluruh Malaysia.'},
  svc:{en:['Our services','Projects','About us'], zh:['我们的服务','案例','关于我们'], ms:['Perkhidmatan kami','Projek','Tentang kami']}},
];

/* which industry a template slug belongs to (for "Build one like this" links) */
const SLUG = {'batu-beam':'reno','seri-dental':'clinic','little-orbit':'edu','rumah-teduh':'stay','forge-field':'retail','harbour-lane':'property',
  'masjid':'community','northbeam':'other','cohort':'training','facilitators-table':'training','nova-cut':'creator','low-frequency':'creator','sabai':'clinic',
  'mira-os':'creator','kai-dev':'creator'};

/* recommended package */
const tierFor = (k, goal) => goal === 'sell' ? 'shop' : (goal === 'enq' && ['fnb','creator','other'].includes(k)) ? 'landing' : 'business';

const ind = k => IND.find(x => x.k === k) || IND[IND.length - 1];
const L = (o, l) => (o && typeof o === 'object' && !Array.isArray(o)) ? (o[l] ?? o.en) : o;
const fmt = n => Math.round(n).toLocaleString('en-MY');

/* config <-> query string (the shareable preview link) */
const toQuery = c => { const p = new URLSearchParams(); ['i','g','n','a','l','v'].forEach(k => { if (c[k]) p.set(k, c[k]); }); return p.toString(); };
const fromQuery = s => { const p = new URLSearchParams(s); const c = {}; ['i','g','n','a','l','v'].forEach(k => { const v = p.get(k); if (v) c[k] = v.slice(0, 60); }); return c; };

return {END, promo, TIERS, price, GOALS, VIBES, IND, SLUG, tierFor, ind, L, fmt, toQuery, fromQuery, WA:'601110541499'};
})();
