// Any link with data-form="<FormHug URL>" opens that form in a pop-up.
// Without <dialog> support the link just opens the form page in a new tab.
(function(){
  var links=document.querySelectorAll("a[data-form]");
  if(!links.length)return;
  var d=document.createElement("dialog");
  if(!d.showModal)return;
  d.setAttribute("aria-label","Send an enquiry");
  d.style.cssText="border:0;padding:0;width:min(560px,94vw);height:min(720px,90vh);border-radius:18px;overflow:hidden;background:#fff";
  d.innerHTML='<button type="button" aria-label="Close" style="position:absolute;top:8px;right:10px;z-index:2;background:rgba(255,255,255,.9);border:0;border-radius:999px;width:34px;height:34px;font-size:22px;line-height:1;cursor:pointer">&times;</button><iframe title="Enquiry form" style="width:100%;height:100%;border:0;display:block"></iframe>';
  var css=document.createElement("style");css.textContent="dialog::backdrop{background:rgba(0,0,0,.55)}";
  document.head.appendChild(css);document.body.appendChild(d);
  var f=d.querySelector("iframe");
  links.forEach(function(a){a.addEventListener("click",function(e){
    e.preventDefault();if(f.getAttribute("src")!==a.href)f.src=a.href;d.showModal();})});
  d.querySelector("button").onclick=function(){d.close()};
  d.addEventListener("click",function(e){if(e.target===d)d.close()});
})();
