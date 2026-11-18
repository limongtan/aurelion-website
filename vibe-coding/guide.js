/* Shared navigation, reading layout and accessible video controls for all guide pages. */
(() => {
 'use strict';
 const body=document.body;if(!body.classList.contains('guide-page'))return;
 const locale=['zh','ms'].includes(document.documentElement.lang)?document.documentElement.lang:'en';
 const text={
  en:{all:'All guides',web:'Build a website',video:'Make videos',toolkit:'Toolkit',map:'Learning routes',contents:'On this page',navigation:'GUIDE NAVIGATION',previous:'Previous guide',next:'Next guide',home:'Back to all guides',footer:'A field guide for human ideas.',pause:'Pause video previews',resume:'Resume video previews',language:'English resource',english:'EN',skip:'Skip to the guide',extra:'Useful extras'},
  zh:{all:'全部指南',web:'制作网站',video:'制作视频',toolkit:'工具箱',map:'学习路线',contents:'本页目录',navigation:'指南导航',previous:'上一篇',next:'下一篇',home:'返回全部指南',footer:'从一个想法，开始动手创造。',pause:'暂停视频预览',resume:'继续视频预览',language:'英文资源',english:'英文',skip:'跳到指南内容',extra:'实用资源'},
  ms:{all:'Semua panduan',web:'Bina laman web',video:'Hasilkan video',toolkit:'Kotak alat',map:'Laluan pembelajaran',contents:'Dalam halaman ini',navigation:'NAVIGASI PANDUAN',previous:'Panduan sebelumnya',next:'Panduan seterusnya',home:'Kembali ke semua panduan',footer:'Panduan untuk idea manusia.',pause:'Jeda pratonton video',resume:'Sambung pratonton video',language:'Sumber bahasa Inggeris',english:'EN',skip:'Langkau ke panduan',extra:'Sumber tambahan'}
 }[locale];
 const names={en:{systems:'Choose your website',prompts:'Describe your idea',setup:'Set up your tools',example:'Build it step by step',golive:'Publish & connect',videos:'Make your first reel',effects:'Add motion & effects','reel-prompt':'The reel recipe',graphify:'Understand your project'},zh:{systems:'选择网站类型',prompts:'描述你的想法',setup:'准备工具',example:'一步步建立网站',golive:'上线与连接',videos:'制作第一个短视频',effects:'加入动态与特效','reel-prompt':'短视频制作配方',graphify:'理解项目结构'},ms:{systems:'Pilih jenis laman web',prompts:'Terangkan idea anda',setup:'Sediakan alat',example:'Bina langkah demi langkah',golive:'Terbit & sambungkan',videos:'Hasilkan reel pertama',effects:'Tambah gerakan & kesan','reel-prompt':'Resipi reel',graphify:'Fahami projek anda'}}[locale];
 const groups={web:['systems','prompts','setup','example','golive'],video:['videos','effects','reel-prompt'],toolkit:['prompts','setup','graphify']};
 const group=body.dataset.guideGroup||'web';const page=body.dataset.guidePage||location.pathname.split('/').pop().replace('.html','');
 const base='/vibe-coding/';const localized=locale==='en'?'':locale+'/';
 function href(key){return base+((locale!=='en'&&['graphify','reel-prompt'].includes(key))?'':localized)+key+'.html';}
 function el(tag,cls,content){const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=content;return n;}
 function link(label,url,cls){const a=el('a',cls,label);a.href=url;return a;}
 const wrap=document.querySelector('.wrap');const header=wrap?.querySelector('.gnav');if(!wrap||!header)return;
 document.documentElement.dataset.theme='light';
 const progress=el('div','guide-progress');progress.setAttribute('aria-hidden','true');body.prepend(progress);
 const skip=link(text.skip,'#guide-main','guide-skip');body.prepend(skip);
 const brand=header.querySelector('.brand');if(brand){brand.textContent='vibe coding';brand.href=base+localized;}
 const tracks=header.querySelector('.tracks');if(tracks){tracks.replaceChildren();tracks.setAttribute('aria-label',text.map);for(const key of ['web','video','toolkit']){const entry=key==='web'?'systems':key==='video'?'videos':'setup';const a=link(text[key],href(entry));if(key===group)a.setAttribute('aria-current','page');tracks.append(a);}}
 if(!header.querySelector('.langs'))header.append(el('span','guide-language-note',text.language));
 const title=document.querySelector('h1')?.textContent.trim()||names[page]||page;
 const context=el('div','guide-context');const crumb=el('nav','guide-breadcrumb');crumb.setAttribute('aria-label',locale==='zh'?'面包屑导航':locale==='ms'?'Jejak navigasi':'Breadcrumb');crumb.append(link(text.all,base+localized),el('span','separator','/'),link(text[group],href(group==='web'?'systems':group==='video'?'videos':'setup')),el('span','separator','/'));const current=el('span','current',title);current.setAttribute('aria-current','page');crumb.append(current);context.append(crumb);
 const layout=el('div','guide-layout'),article=el('main','guide-article');article.id='guide-main';
 for(const node of [...wrap.childNodes]){if(node===header||node.nodeName==='SCRIPT'||node.nodeType===3&&!node.textContent.trim())continue;article.append(node);}
 const rail=el('aside','guide-rail');rail.setAttribute('aria-label',text.navigation);rail.append(el('span','guide-mobile-title',text.navigation));
 const map=el('details','guide-map'),mapSummary=el('summary','',text.map);map.open=matchMedia('(min-width:851px)').matches;map.append(mapSummary);const groupContainer=el('div','guide-groups');
 for(const key of ['web','video','toolkit']){const section=el('div','guide-group');section.append(el('p','guide-group-name',text[key]));const list=el('ol');groups[key].forEach((name,i)=>{const li=el('li');const a=link('',href(name));a.append(el('span','step-no',String(i+1).padStart(2,'0')),el('span','',names[name]));if(name===page)a.setAttribute('aria-current','page');if(locale!=='en'&&['graphify','reel-prompt'].includes(name))a.append(el('span','english-badge',text.english));li.append(a);list.append(li);});section.append(list);groupContainer.append(section);}map.append(groupContainer);rail.append(map);
 const contents=el('details','guide-contents');contents.open=matchMedia('(min-width:851px)').matches;contents.append(el('summary','',text.contents));const toc=el('ol');const watched=[];let idx=0;
 for(const heading of article.querySelectorAll('h2')){if(heading.closest('.pcard,.phead,.gnav,.stepbar,.guide-summary'))continue;const section=heading.closest('section')||heading;const target=section;if(!target.id)target.id='guide-section-'+(++idx);const li=el('li'),a=link(heading.textContent.trim(),'#'+target.id);li.append(a);toc.append(li);watched.push({target,a});}
 if(watched.length){contents.append(toc);rail.append(contents);}const extras=el('div','guide-rail-footer');extras.append(el('strong','',text.extra),link(names.prompts,href('prompts')),link(names.graphify,href('graphify')),link(text.home,base+localized));rail.append(extras);
 layout.append(rail,article);wrap.append(context,layout);
 const sequence=groups[group]||groups.web;const at=sequence.indexOf(page);const pagination=el('nav','guide-pagination');pagination.setAttribute('aria-label',locale==='zh'?'指南翻页':locale==='ms'?'Navigasi panduan':'Guide pagination');
 const prev=at>0?sequence[at-1]:null,next=at>=0?sequence[at+1]:null;
 const prevLink=link('',prev?href(prev):base+localized,'previous-page');prevLink.append(el('small','','← '+(prev?text.previous:text.all)),el('strong','',prev?names[prev]:text.home));
 const nextLink=link('',next?href(next):base+localized,'next-page');nextLink.append(el('small','',(next?text.next:text.all)+' →'),el('strong','',next?names[next]:text.home));pagination.append(prevLink,nextLink);article.append(pagination);
 const footer=el('footer','guide-footer');footer.append(link('AURELION EARTH ↗','/'),el('span','',text.footer));wrap.append(footer);
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');const previews=[...article.querySelectorAll('video[autoplay]')];let pausePreviews=reduced.matches;
 const previewButton=el('button','guide-preview-toggle');previewButton.type='button';
 function applyVideoState(){previewButton.textContent=pausePreviews?text.resume:text.pause;previewButton.setAttribute('aria-pressed',String(pausePreviews));previews.forEach(v=>{v.controls=true;v.muted=true;if(pausePreviews){v.pause();v.removeAttribute('autoplay');}else if(!document.hidden)v.play().catch(()=>{});});}
 if(previews.length){context.append(previewButton);previewButton.addEventListener('click',()=>{pausePreviews=!pausePreviews;applyVideoState();});reduced.addEventListener('change',e=>{pausePreviews=e.matches;applyVideoState();});applyVideoState();}
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;for(const item of watched){if(item.target===entry.target)item.a.setAttribute('aria-current','location');else item.a.removeAttribute('aria-current');}}},{rootMargin:'-10% 0px -65% 0px',threshold:0});watched.forEach(x=>observer.observe(x.target));
 let ticking=false;function updateProgress(){const r=article.getBoundingClientRect();const distance=article.scrollHeight-innerHeight;progress.style.width=Math.max(0,Math.min(100,(-r.top/Math.max(1,distance))*100))+'%';ticking=false;}
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateProgress);}},{passive:true});addEventListener('resize',updateProgress,{passive:true});updateProgress();
 document.addEventListener('visibilitychange',()=>{if(document.hidden)previews.forEach(v=>v.pause());else if(!pausePreviews)previews.forEach(v=>v.play().catch(()=>{}));});
 // Native fragment navigation remains valid after the shared shell moves the article.
 if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)requestAnimationFrame(()=>target.scrollIntoView({behavior:'auto',block:'start'}));}
})();
