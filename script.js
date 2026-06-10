const toggle = document.querySelector('.menu-toggle');
const topbar = document.querySelector('.topbar');

if (toggle && topbar) {
  toggle.addEventListener('click', () => {
    const isOpen = topbar.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? '×' : '☰';
  });

  topbar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      topbar.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    });
  });
}
