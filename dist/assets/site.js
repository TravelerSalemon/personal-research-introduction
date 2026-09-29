(() => {
  const toggle = document.getElementById('language-toggle');
  const fields = document.querySelectorAll('[data-en]');
  let language = (() => { try { return localStorage.getItem('language') || 'zh'; } catch { return 'zh'; } })();
  function render() {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    fields.forEach(el => {
      if (!el.dataset.zh) el.dataset.zh = el.textContent;
      el.textContent = language === 'en' ? el.dataset.en : el.dataset.zh;
    });
    toggle.textContent = language === 'en' ? '中文' : 'EN';
    toggle.setAttribute('aria-label', language === 'en' ? '切换为中文' : 'Switch to English');
    document.title = document.body.dataset[language === 'en' ? 'titleEn' : 'titleZh'];
  }
  toggle.addEventListener('click', () => {
    language = language === 'en' ? 'zh' : 'en';
    try { localStorage.setItem('language', language); } catch {}
    render();
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  render();
})();
