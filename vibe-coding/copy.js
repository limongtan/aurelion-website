var L = {zh: ['复制', '已复制', '按 Ctrl+C'], ms: ['Salin', 'Disalin', 'Tekan Ctrl+C']}[document.documentElement.lang] || ['Copy', 'Copied', 'Press Ctrl+C'];
document.querySelectorAll('button.copy').forEach(function (b) {
  b.addEventListener('click', function () {
    var pre = b.closest('.pcard').querySelector('pre');
    function done() { b.textContent = L[1]; b.setAttribute('data-done', ''); setTimeout(function () { b.textContent = L[0]; b.removeAttribute('data-done'); }, 1600); }
    function select() { var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = L[2]; }
    try { navigator.clipboard.writeText(pre.textContent).then(done, select); } catch (e) { select(); }
  });
});
