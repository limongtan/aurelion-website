document.querySelectorAll('button.copy').forEach(function (b) {
  b.addEventListener('click', function () {
    var pre = b.closest('.pcard').querySelector('pre');
    function done() { b.textContent = 'Copied'; b.setAttribute('data-done', ''); setTimeout(function () { b.textContent = 'Copy'; b.removeAttribute('data-done'); }, 1600); }
    function select() { var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Press Ctrl+C'; }
    try { navigator.clipboard.writeText(pre.textContent).then(done, select); } catch (e) { select(); }
  });
});
