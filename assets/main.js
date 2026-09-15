// 기록 창고 — 공용 스크립트 (스크롤 탑 버튼)
document.addEventListener('DOMContentLoaded', () => {
  const fab = document.querySelector('[data-fab-top]');
  if (!fab) return;
  const toggle = () => {
    if (window.scrollY > 400) fab.classList.add('is-visible');
    else fab.classList.remove('is-visible');
  };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
