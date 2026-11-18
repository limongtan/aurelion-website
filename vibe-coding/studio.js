(() => {
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const language=['zh','ms'].includes(document.documentElement.lang)?document.documentElement.lang:'en';
  const labels={en:{pause:'Pause animation',resume:'Resume animation',pauseMotion:'Pause motion',resumeMotion:'Resume motion',guide:'GUIDE TO GET YOU GOING',guides:'GUIDES TO GET YOU GOING',shown:n=>n+' guide'+(n===1?'':'s')+' shown',copied:'Copied. Paste it into your AI chat and start making.',manual:'Select and copy the prompt above (Ctrl+C / Command+C).'},zh:{pause:'暂停动画',resume:'继续动画',pauseMotion:'暂停动态',resumeMotion:'继续动态',guide:'份指南，开始动手',guides:'份指南，开始动手',shown:n=>'显示 '+n+' 份指南',copied:'已复制。粘贴到 AI 对话中，就可以开始。',manual:'请选中上方提示词并复制（Ctrl+C / Command+C）。'},ms:{pause:'Jeda animasi',resume:'Sambung animasi',pauseMotion:'Jeda gerakan',resumeMotion:'Sambung gerakan',guide:'PANDUAN UNTUK BERMULA',guides:'PANDUAN UNTUK BERMULA',shown:n=>n+' panduan dipaparkan',copied:'Disalin. Tampal dalam sembang AI anda untuk bermula.',manual:'Pilih dan salin prompt di atas (Ctrl+C / Command+C).'}}[language];
  const videos=[...document.querySelectorAll('.reel-shell video')];
  const allVideos=[...document.querySelectorAll('video')];
  const canvas=document.querySelector('#ribbon');
  const ctx=canvas.getContext('2d');
  let paused=reduce.matches,raf=0,last=0,time=0,visible=true;
  let px=0,py=0,targetX=0,targetY=0;
  const status=document.querySelector('#announcement');
  function updateMotion(){const b=document.querySelector('#motion');b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',paused?labels.resume:labels.pause);document.querySelector('#motion-icon').textContent=paused?'▷':'Ⅱ';document.querySelector('#motion-label').textContent=paused?labels.resumeMotion:labels.pauseMotion;videos.forEach(v=>{if(paused||!visible)v.pause();else v.play().catch(()=>{});});}
  function setPaused(value){paused=value;cancelAnimationFrame(raf);last=0;updateMotion();if(paused){allVideos.forEach(v=>v.pause());draw();}else if(visible)raf=requestAnimationFrame(loop);}
  document.querySelector('#motion').addEventListener('click',()=>setPaused(!paused));
  reduce.addEventListener('change',e=>setPaused(e.matches));
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
    const filter=b.dataset.filter;let count=0;
    document.querySelectorAll('[data-filter]').forEach(x=>{const on=x===b;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on));});
    document.querySelector('.projects').classList.toggle('filtered',filter!=='all');
    document.querySelectorAll('[data-category]').forEach(p=>{p.hidden=filter!=='all'&&p.dataset.category!==filter;if(!p.hidden){count++;p.classList.remove('filtering');void p.offsetWidth;p.classList.add('filtering');}else p.querySelectorAll('video').forEach(v=>v.pause());});
    document.querySelector('#result-count').textContent=String(count).padStart(2,'0')+' '+(count===1?labels.guide:labels.guides);status.textContent=labels.shown(count);
  }));
  document.querySelector('#copy').addEventListener('click',async()=>{
    const text=document.querySelector('#starter').textContent;
    try{await navigator.clipboard.writeText(text);document.querySelector('#copy-status').textContent=labels.copied;}
    catch{const range=document.createRange();range.selectNodeContents(document.querySelector('#starter'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);document.querySelector('#copy-status').textContent=labels.manual;}
  });
  const cursor=document.querySelector('.cursor-label');
  const fine=matchMedia('(pointer:fine)');
  document.querySelectorAll('.project-image').forEach(a=>{a.addEventListener('pointerenter',()=>{if(fine.matches&&!reduce.matches)cursor.classList.add('visible');});a.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));a.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';});a.addEventListener('click',()=>cursor.classList.remove('visible'));});
  const stage=document.querySelector('.showcase');
  stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*2;targetY=((e.clientY-r.top)/r.height-.5)*2;},{passive:true});
  stage.addEventListener('pointerleave',()=>{targetX=0;targetY=0;});
  const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.target===stage){visible=entry.isIntersecting&&!document.hidden;cancelAnimationFrame(raf);last=0;updateMotion();if(visible&&!paused)raf=requestAnimationFrame(loop);}});},{threshold:0.05});io.observe(stage);
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);last=0;if(document.hidden){allVideos.forEach(v=>v.pause());visible=false;}else{const r=stage.getBoundingClientRect();visible=r.bottom>0&&r.top<innerHeight;updateMotion();if(visible&&!paused)raf=requestAnimationFrame(loop);}});
  function resize(){const r=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);draw();}
  function point(a,b,t){const radius=1.55+.37*Math.cos(3*a+t*.2);let x=radius*Math.cos(2*a+t*.1),y=radius*Math.sin(2*a+t*.1),z=.7*Math.sin(3*a+t*.2);const tube=.16;x+=tube*Math.cos(b)*Math.cos(a);y+=tube*Math.cos(b)*Math.sin(a);z+=tube*Math.sin(b);const angle=.8+px*.13;const xx=x*Math.cos(angle)+z*Math.sin(angle),zz=-x*Math.sin(angle)+z*Math.cos(angle);const tilt=.5+py*.1;return{x:xx,y:y*Math.cos(tilt)-zz*Math.sin(tilt),z:y*Math.sin(tilt)+zz*Math.cos(tilt)};}
  function draw(){if(!ctx)return;const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);const cx=w*.64,cy=h*.43,scale=Math.min(w,h)*.34;const strips=[];for(let i=0;i<130;i++){const a=i/130*Math.PI*2;const p=point(a,0,time),p2=point(a+.05,0,time);strips.push({a,p,p2});}strips.sort((a,b)=>a.p.z-b.p.z);for(const s of strips){const {p,p2}=s;const f=3.8/(4.4-p.z),f2=3.8/(4.4-p2.z);const x=cx+p.x*scale*f,y=cy+p.y*scale*f;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(cx+p2.x*scale*f2,cy+p2.y*scale*f2);const bright=Math.round(48+(p.z+2)*16);ctx.strokeStyle='hsla('+(226+Math.sin(s.a*2)*16)+',85%,'+bright+'%,.65)';ctx.lineWidth=Math.max(2,scale*.21*f);ctx.lineCap='round';ctx.stroke();ctx.beginPath();ctx.moveTo(x-scale*.015,y-scale*.015);ctx.lineTo(cx+p2.x*scale*f2-scale*.015,cy+p2.y*scale*f2-scale*.015);ctx.lineWidth=Math.max(1,scale*.013*f);ctx.strokeStyle='rgba(175,199,255,'+(.1+Math.max(0,p.z)*.17)+')';ctx.stroke();}ctx.fillStyle='rgba(185,204,255,.5)';for(let i=0;i<38;i++){const x=(Math.sin(i*43.13)*.5+.5)*w,y=(Math.cos(i*17.73)*.5+.5)*h;ctx.beginPath();ctx.arc(x,y,Math.max(.5,w*.0007),0,Math.PI*2);ctx.fill();}}
  function loop(now){if(paused||!visible)return;if(last&&now-last<32){raf=requestAnimationFrame(loop);return;}time+=last?Math.min((now-last)/1000,.08):0;last=now;px+=(targetX-px)*.045;py+=(targetY-py)*.045;document.querySelector('.reel-sculpture').style.transform='rotateY('+(px*5)+'deg) rotateX('+(-py*3)+'deg)';draw();raf=requestAnimationFrame(loop);}
  const ro=new ResizeObserver(resize);ro.observe(stage);resize();updateMotion();if(!paused)raf=requestAnimationFrame(loop);
})();
