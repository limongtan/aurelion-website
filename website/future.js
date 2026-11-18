/* Aurelion: three original, real-time worlds. No rendering framework required. */
(() => {
  'use strict';
  const worlds = {
    space: {number:0, title:'Event Horizon', eyebrow:'01 / THE NEXT DIMENSION', headline:'BEYOND<br>THE <em>SCREEN.</em>', description:'The next version of your business deserves a world of its own. We design and build websites worth stepping into.', cta:'Build my next world', object:'OBJECT / EVENT HORIZON', meta:'DIGITAL SPACE · NO LIMITS', label:'A NEW WORLD IS WITHIN REACH'},
    city: {number:1, title:'Neo District', eyebrow:'02 / WELCOME TO YOUR TOMORROW', headline:'THE FUTURE<br>IS <em>BUILT.</em>', description:'Bold ideas need somewhere to live. Give your business a digital address in a world that moves forward.', cta:'Make your next move', object:'LOCATION / NEO DISTRICT', meta:'BEYOND THE FAMILIAR', label:'SOMEWHERE BETWEEN NOW AND NEXT'},
    interface: {number:2, title:'Human Interface', eyebrow:'03 / HUMAN IMAGINATION. DIGITAL FORM.', headline:'IDEAS,<br><em>UPGRADED.</em>', description:'Your imagination is the interface. We turn it into responsive websites, living identities and experiences that feel one step ahead.', cta:'Bring my idea online', object:'SYSTEM / HUMAN INTERFACE', meta:'IMAGINATION CONNECTED', label:'DESIGNED AROUND YOU'}
  };
  const $ = s => document.querySelector(s);
  let mode = 'space', time = 0, lastTime = 0, visible = true, frame = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  const pointer = {x:0,y:0,tx:0,ty:0};
  function setWorld(key, updateURL = true) {
    if (!Object.hasOwn(worlds,key)) key='space';
    mode=key; const w=worlds[key];
    document.documentElement.dataset.world=key;
    $('#headline').innerHTML=w.headline;
    $('#eyebrow').textContent=w.eyebrow;
    $('#description').textContent=w.description;
    $('#cta-text').textContent=w.cta;
    $('#object-label').textContent=w.object;
    $('#object-meta').textContent=w.meta;
    $('#scene-label').textContent=w.label;
    $('#direction').selectedIndex=w.number;
    document.title=w.title+' — Aurelion Website Experiences';
    document.querySelectorAll('[data-mode]').forEach(a => {if(a.dataset.mode===key)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(updateURL){const url=new URL(location.href);url.searchParams.set('world',key);history.pushState({world:key},'',url);}
    $('#announcement').textContent=w.title+' design world selected';
    if(paused) render();
  }
  document.querySelectorAll('[data-mode]').forEach(a=>a.addEventListener('click',e=>{
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    e.preventDefault();if(a.dataset.mode===mode)return;
    const transition=$('.transition');transition.classList.remove('flash');void transition.offsetWidth;transition.classList.add('flash');
    setTimeout(()=>setWorld(a.dataset.mode),190);
  }));
  addEventListener('popstate',()=>setWorld(new URL(location.href).searchParams.get('world'),false));
  let opener=null;
  document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('dialog[open]').forEach(d=>d.close());opener=b;$('#'+b.dataset.open).showModal();
  }));
  document.querySelectorAll('dialog').forEach(d=>{
    d.querySelector('.close').addEventListener('click',()=>d.close());
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});
    d.addEventListener('close',()=>opener?.focus());
  });
  $('#brief-form').addEventListener('submit',e=>{
    e.preventDefault();const data=new FormData(e.currentTarget);
    const text=['AURELION — WEBSITE PROJECT BRIEF','',...Array.from(data,([k,v])=>k.toUpperCase()+': '+v),'','Created at '+new Date().toISOString()].join('\n');
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='aurelion-project-brief.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#announcement').textContent='Your project brief has been downloaded.';
  });
  function motionLabel(){const b=$('#motion');b.setAttribute('aria-pressed',String(paused));b.setAttribute('aria-label',paused?'Resume animation':'Pause animation');b.querySelector('.pause-icon').textContent=paused?'▷':'Ⅱ';b.querySelector('.motion-label').textContent=paused?'Resume':'Pause';}
  $('#motion').addEventListener('click',()=>{paused=!paused;motionLabel();lastTime=0;if(!paused)requestAnimationFrame(loop);});
  reduced.addEventListener('change',e=>{paused=e.matches;motionLabel();lastTime=0;if(!paused)requestAnimationFrame(loop);});
  addEventListener('pointermove',e=>{pointer.tx=e.clientX/innerWidth*2-1;pointer.ty=e.clientY/innerHeight*2-1;},{passive:true});
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden;lastTime=0;if(visible&&!paused)requestAnimationFrame(loop);});

  const canvas=$('#universe');
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  let uniforms=null;
  const vertex=`attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
  const fragment=`precision highp float;
uniform vec2 resolution;uniform float time;uniform float world;uniform vec2 mouse;uniform float compact;
#define PI 3.14159265359
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
float fbm(vec2 p){float f=0.;f+=.5*noise(p);p=p*2.02+7.;f+=.25*noise(p);p=p*2.03+7.;f+=.125*noise(p);p=p*2.01+7.;f+=.0625*noise(p);return f;}
mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
float stars(vec2 uv,float scale){vec2 p=uv*scale;vec2 id=floor(p);vec2 f=fract(p)-.5;float n=hash(id);float a=smoothstep(.035,0.,length(f));return a*step(.973,n)*(.4+.6*sin(n*100.+time*.3));}
vec3 space(vec2 uv){
 vec2 q=uv-vec2(mix(.73,0.,compact),mix(.08,.65,compact));q+=mouse*vec2(.035,-.02);
 float r=length(q);float angle=atan(q.y,q.x);vec3 col=vec3(.008,.016,.027);
 float n=fbm(uv*2.+vec2(time*.008,0.));
 col+=vec3(.015,.038,.065)*pow(n,3.)*3.;
 col+=vec3(.7,.85,1.)*(stars(uv+mouse*.008,38.)+stars(uv*.9,72.)*.35);
 vec2 ellipse=q;ellipse.x*=.82;ellipse=rot(-.35)*ellipse;ellipse.y*=1.13;
 float ring=length(ellipse);float a=atan(ellipse.y,ellipse.x);
 float size=mix(.91,.52,compact);
 float turbulence=fbm(vec2(a*6.+time*.09,ring*24.-time*.1));
 float edge=abs(ring-size+(.008*sin(a*8.+time*.2)));
 float glow=.0035/(edge*edge+.0018);
 float thin=.002/(edge+.003);
 float filaments=pow(max(0.,sin(ring*400.+turbulence*12.+a*8.-time*.25)),10.);
 float band=exp(-edge*edge*380.);
 float brightness=.55+.45*sin(a+.8);
 col+=vec3(.14,.47,.82)*glow*brightness;
 col+=vec3(.66,.91,1.)*(thin*.65+filaments*band*.65);
 float inside=1.-smoothstep(size-.035,size-.01,ring);
 col*=1.-inside*.97;
 float inner=fbm(q*4.+vec2(time*.012));
 col+=inside*vec3(.02,.055,.09)*inner*(.3+.5*ring);
 float beams=pow(max(0.,sin(a*14.+turbulence*3.+time*.06)),16.);
 col+=vec3(.08,.22,.38)*beams*exp(-edge*7.)*.35;
 float disc=exp(-abs(q.y+q.x*.13)*80.)*exp(-abs(q.x)*.7);
 col+=vec3(.32,.63,.83)*disc*.22;
 col+=vec3(.025,.08,.12)*exp(-edge*5.);
 return col;
}
float box(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float cityMap(vec3 p){vec2 id=floor((p.xz+.75)/1.5);vec2 local=mod(p.xz+.75,1.5)-.75;float h=1.6+hash(id)*6.;float b=box(vec3(local.x,p.y-h*.5,local.y),vec3(.48,h*.5,.5));return abs(p.x)<1.35?max(b,1.35-abs(p.x)):b;}
vec3 city(vec2 uv){
 vec2 q=uv;q.y+=mix(.12,-.1,compact);q.x+=mouse.x*.06;
 vec3 ro=vec3(mouse.x*.12,1.2, time*.14);vec3 rd=normalize(vec3(q.x*.65,q.y*.65,1.35));
 vec3 col=mix(vec3(.09,.035,.10),vec3(.34,.13,.13),exp(-abs(q.y)*2.));
 float sun=length(q-vec2(0.,.27));col+=vec3(1.,.28,.09)*exp(-sun*sun*5.)*.32;
 col+=vec3(.75,.3,.19)*(1.-smoothstep(.27,.28,sun))*.4*(.7+.3*step(.5,fract(q.y*45.)));
 float t=0.;float d=0.;vec3 p=ro;
 for(int i=0;i<80;i++){p=ro+rd*t;d=min(cityMap(p),p.y);if(d<.008||t>45.)break;t+=d*.78;}
 if(t<45.){
   float fog=1.-exp(-t*.055);
   vec3 material=vec3(.025,.022,.04);
   if(p.y<.025){
     vec2 g=abs(fract(p.xz*vec2(1.,.4))-.5);float grid=1.-smoothstep(.008,.02,min(g.x,g.y));
     material+=vec3(.22,.065,.06)*grid*.5;
     float lane=exp(-abs(abs(p.x)-.85)*90.);material+=vec3(1.,.24,.07)*lane*.8;
     float stripe=pow(max(0.,sin(p.z*.8-time*2.)),22.);material+=vec3(.85,.18,.07)*lane*stripe;
     material+=vec3(.2,.04,.04)*exp(-p.x*p.x)*(.3+noise(p.xz*10.)*.4);
   }else{
     vec2 id=floor((p.xz+.75)/1.5);float n=hash(id);
     vec3 face=abs(mod(p+vec3(.75,0.,.75),1.5)-.75);
     float wx=fract((face.x>face.z?p.z:p.x)*7.);float wy=fract(p.y*5.);
     float windows=step(.22,wx)*step(wx,.48)*step(.18,wy)*step(wy,.65);
     windows*=step(.25,hash(floor(vec2((face.x>face.z?p.z:p.x)*7.,p.y*5.))));
     material+=mix(vec3(.15,.48,.58),vec3(.95,.34,.13),n)*windows*(.2+.6*n);
     float trim=exp(-abs(fract(p.y*.23)-.5)*70.);material+=vec3(.5,.08,.11)*trim;
   }
   col=mix(material,col,fog);
 }
 col+=vec3(.35,.12,.14)*exp(-abs(q.x)*8.)*exp(-abs(q.y)*6.);
 return col;
}
vec3 spatial(vec2 uv){
 vec2 q=uv-vec2(mix(.74,0.,compact),mix(.08,.68,compact));q+=mouse*vec2(.03,-.02);
 float size=mix(.79,.43,compact);float r=length(q);
 vec3 col=vec3(.014,.037,.031);
 vec2 grid=abs(fract(uv*14.)-.5);col+=vec3(.035,.09,.065)*(1.-smoothstep(.008,.015,min(grid.x,grid.y)))*.3;
 col+=vec3(.055,.22,.14)*exp(-r*r*2.)*.45;
 if(r<size){
   float z=sqrt(max(0.,size*size-r*r));vec3 p=vec3(q,z)/size;p.xz=rot(time*.09+mouse.x*.1)*p.xz;p.yz=rot(.35)*p.yz;
   float lat=asin(p.y),lon=atan(p.z,p.x);
   float lines=pow(max(0.,cos(lat*23.)),36.)+pow(max(0.,cos(lon*23.)),36.);
   float dots=pow(max(0.,cos(lat*47.)),30.)*pow(max(0.,cos(lon*47.)),30.);
   float edge=pow(1.-z/size,2.);
   float patch=fbm(vec2(lon*4.,lat*6.));
   col+=vec3(.16,.56,.34)*(lines*.22+dots*.85+edge*.6+step(.58,patch)*.25);
   col+=vec3(.5,1.,.72)*pow(edge,8.)*.55;
 }
 vec2 orbit=rot(-.37)*q;orbit.y*=2.7;float ring=abs(length(orbit)-size*1.2);
 col+=vec3(.25,.8,.5)*.0014/(ring+.006)*(.65+.35*sin(atan(orbit.y,orbit.x)*6.+time*.5));
 float scan=exp(-abs(q.y-sin(time*.35)*size)*95.)*step(r,size);col+=vec3(.23,.7,.44)*scan*.3;
 col+=vec3(.6,.9,.75)*stars(uv,50.)*.25;
 return col;
}
void main(){vec2 uv=(2.*gl_FragCoord.xy-resolution)/resolution.y;vec3 c;if(world<.5)c=space(uv);else if(world<1.5)c=city(uv);else c=spatial(uv);float vignette=1.-.2*length(uv*.6);c*=vignette;c+=hash(gl_FragCoord.xy+fract(time))*.008;gl_FragColor=vec4(pow(max(c,0.),vec3(.88)),1.);}`;
  function compile(type, source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.error(gl.getShaderInfoLog(s));throw new Error('Scene shader could not compile');}return s;}
  if(gl){
    try{
      const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Scene could not link');gl.useProgram(program);
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const attr=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
      uniforms=Object.fromEntries(['resolution','time','world','mouse','compact'].map(k=>[k,gl.getUniformLocation(program,k)]));
    }catch(e){console.warn('Using the static scene fallback.',e.message);}
  }
  function resize(){const dpr=Math.min(devicePixelRatio||1,1.35);const scale=innerWidth<700?.85:1;canvas.width=Math.round(innerWidth*dpr*scale);canvas.height=Math.round(innerHeight*dpr*scale);if(gl)gl.viewport(0,0,canvas.width,canvas.height);if(paused)render();}
  function render(){
    if(!gl||!uniforms)return;
    gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);gl.uniform1f(uniforms.time,time);gl.uniform1f(uniforms.world,worlds[mode].number);gl.uniform2f(uniforms.mouse,pointer.x,pointer.y);gl.uniform1f(uniforms.compact,innerWidth<700?1:0);gl.drawArrays(gl.TRIANGLES,0,6);
  }
  function loop(now){if(paused||!visible)return;if(lastTime&&now-lastTime<31){frame=requestAnimationFrame(loop);return;}time+=lastTime?Math.min((now-lastTime)/1000,.07):0;lastTime=now;pointer.x+=(pointer.tx-pointer.x)*.035;pointer.y+=(pointer.ty-pointer.y)*.035;render();frame=requestAnimationFrame(loop);}
  addEventListener('resize',resize,{passive:true});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  setWorld(new URL(location.href).searchParams.get('world'),false);motionLabel();resize();render();if(!paused)requestAnimationFrame(loop);
})();
