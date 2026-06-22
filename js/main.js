// ── THEME TOGGLE ──
// Works on any page that has a .theme-toggle button and #hero-canvas (optional).
(function () {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const html = document.documentElement;
  btn.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    document.cookie = 'theme=' + next + ';path=/;max-age=' + (60 * 60 * 24 * 365);
  });
})();

// ── MOBILE NAV TOGGLE ──
(function () {
  const nav    = document.querySelector('nav');
  const burger = document.querySelector('.nav-burger');
  if (!nav || !burger) return;
  burger.addEventListener('click', () => nav.classList.toggle('nav-open'));
  nav.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('nav-open'));
  });
  document.addEventListener('click', e => {
    if (nav.classList.contains('nav-open') && !nav.contains(e.target)) {
      nav.classList.remove('nav-open');
    }
  });
})();

// ── NAV FLOAT + LOGO COLLAPSE (landing page only) ──
(function () {
  const nav      = document.getElementById('nav');
  const logoNton = document.getElementById('logo-nton');
  if (!nav || !logoNton) return; // not on landing page
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle('scrolled', scrolled);
    logoNton.style.maxWidth = scrolled ? '0px'   : '300px';
    logoNton.style.opacity  = scrolled ? '0'     : '1';
  }, { passive: true });
})();

// ── SCROLL REVEALS ──
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .stagger').forEach(el => io.observe(el));
})();

// ── PRODUCT CARDS STAGGER (landing page only) ──
(function () {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const cardIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        grid.querySelectorAll('.product-card').forEach((c, i) => {
          setTimeout(() => c.classList.add('visible'), i * 85);
        });
        cardIO.disconnect();
      }
    });
  }, { threshold: 0.05 });
  cardIO.observe(grid);
})();

// ── HERO TEXT ENTRANCE (landing page only) ──
(function () {
  const headline = document.getElementById('headline');
  if (!headline) return;
  window.addEventListener('load', () => {
    setTimeout(() => { const e = document.getElementById('heroEyebrow'); if (e) e.classList.add('visible'); }, 200);
    setTimeout(() => headline.classList.add('visible'), 380);
    setTimeout(() => { const s = document.getElementById('heroSub');     if (s) s.classList.add('visible'); }, 700);
    setTimeout(() => { const a = document.getElementById('heroActions'); if (a) a.classList.add('visible'); }, 900);
  });
})();
