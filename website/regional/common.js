(() => {
  'use strict';
  const toggle = document.querySelector('.region-menu-toggle');
  const navigation = document.querySelector('.region-nav');
  function closeNavigation() {
    if (!toggle || !navigation) return;
    navigation.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '開啟選單');
  }
  if (toggle && navigation) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '開啟選單');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      navigation.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
        closeNavigation();
        toggle.focus();
      }
    });
  }
  const triggers = [...document.querySelectorAll('[data-preview]')];
  if (!triggers.length) return;
  const create = (tag, className, content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
  };
  const dialog = create('dialog', 'region-concept-dialog');
  dialog.id = 'concept-dialog';
  dialog.setAttribute('aria-labelledby', 'region-dialog-title');
  dialog.setAttribute('aria-describedby', 'region-dialog-description');
  const close = create('button', 'region-dialog-close', '關閉');
  close.type = 'button';
  close.setAttribute('aria-label', '關閉風格體驗');
  const kicker = create('p', 'region-dialog-kicker', '生活風格體驗');
  const heading = create('h2');
  heading.id = 'region-dialog-title';
  const description = create('p', 'region-dialog-description');
  description.id = 'region-dialog-description';
  const save = create('button', 'region-button region-dialog-save', '收藏這個靈感');
  save.type = 'button';
  const status = create('p', 'region-dialog-status');
  status.setAttribute('role', 'status');
  const note = create('p', 'region-dialog-note', '此為設計體驗，尚未開放實際預約或交易。');
  dialog.append(close, kicker, heading, description, save, status, note);
  document.body.append(dialog);
  const saved = new Set();
  let opener = null;
  triggers.forEach(button => button.addEventListener('click', event => {
    if (button.tagName === 'A') event.preventDefault();
    opener = button;
    heading.textContent = button.dataset.preview || button.textContent.trim();
    description.textContent = button.dataset.description || '留一點時間，感受這個生活提案的細節。把喜歡的靈感收起來，慢慢找到屬於自己的節奏。';
    save.disabled = saved.has(heading.textContent);
    save.textContent = save.disabled ? '已收藏這個靈感' : '收藏這個靈感';
    status.textContent = save.disabled ? '這個提案已在本次瀏覽的靈感清單。' : '';
    dialog.showModal();
    close.focus();
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  save.addEventListener('click', () => {
    saved.add(heading.textContent);
    save.disabled = true;
    save.textContent = '已收藏這個靈感';
    status.textContent = '已放進本次瀏覽的靈感清單，繼續看看其他喜歡的風格。';
  });
})();
