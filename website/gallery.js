(() => {
 'use strict';
 const world=new URL(location.href).searchParams.get('world');
 if(['space','city','interface','lab','warp','liquid'].includes(world)){location.replace('/website/immersive.html?world='+encodeURIComponent(world));return;}
 const buttons=[...document.querySelectorAll('[data-category].filter')],cards=[...document.querySelectorAll('.design-card')],search=document.querySelector('#design-search'),count=document.querySelector('#gallery-count'),empty=document.querySelector('.empty-state');
 let category='all';
 function filterDesigns(){const query=search.value.trim().toLowerCase();let shown=0;for(const card of cards){const show=(category==='all'||card.dataset.category===category)&&card.dataset.search.includes(query);card.hidden=!show;if(show)shown++;}count.textContent=shown+' '+(shown===1?'design':'designs')+' to explore';empty.hidden=shown>0;}
 buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;buttons.forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});filterDesigns();}));
 search.addEventListener('input',filterDesigns);
 const requested=new URL(location.href).searchParams.get('category');
 if(requested){const button=buttons.find(b=>b.dataset.category.toLowerCase()===requested.toLowerCase());if(button)button.click();}
 document.querySelectorAll('.mini-design>img').forEach(img=>{img.addEventListener('error',()=>{img.hidden=true;img.parentElement.classList.add('image-unavailable');});});
})();
