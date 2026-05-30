/* Hamburger */
const ham = document.getElementById('ham');
const drawer = document.getElementById('drawer');
let drawerOpen = false;

function updateBodyOverflow() {
  document.body.style.overflow = (drawerOpen || activeModal) ? 'hidden' : '';
}

ham.addEventListener('click', () => {
  drawerOpen = !drawerOpen;
  ham.classList.toggle('open', drawerOpen);
  drawer.classList.toggle('open', drawerOpen);
  updateBodyOverflow();
});
function closeDrawer() {
  drawerOpen = false;
  ham.classList.remove('open');
  drawer.classList.remove('open');
  updateBodyOverflow();
}
drawer.addEventListener('click', e => { if (e.target === drawer) closeDrawer(); });

/* Cursor */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
if (cur && window.matchMedia('(pointer:fine)').matches) {
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; cur.style.left=mx+'px'; cur.style.top=my+'px'; });
  (function animR(){ rx+=(mx-rx)*.13; ry+=(my-ry)*.13; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animR); })();
  document.querySelectorAll('button,a,.product-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.style.width='18px';cur.style.height='18px';});
    el.addEventListener('mouseleave',()=>{cur.style.width='10px';cur.style.height='10px';});
  });
}

/* Scroll to top */
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
}, {passive:true});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({top:0, behavior:'smooth'});
});

/* Parallax */
const noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
if (!noMotion) {
  const heroA     = document.querySelector('.hero-a');
  const heroTitle = document.querySelector('.hero-title');
  const heroSub   = document.querySelector('.hero-sub');
  const heroBadge = document.querySelector('.hero-badge');
  const bgGrid    = document.querySelector('.bg-grid');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroA)     heroA.style.transform     = `translate(-50%, calc(-50% + ${y * 0.3}px))`;
        if (heroTitle) heroTitle.style.transform  = `translateY(${y * -0.12}px)`;
        if (heroSub)   heroSub.style.transform    = `translateY(${y * -0.07}px)`;
        if (heroBadge) heroBadge.style.transform  = `translateY(${y * -0.05}px)`;
        if (bgGrid)    bgGrid.style.backgroundPositionY = `${y * 0.08}px`;
        ticking = false;
      });
      ticking = true;
    }
  }, {passive:true});
}

/* Scroll reveal */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold:0.1, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* Stats count-up */
function animateCount(el, target, suffix, duration) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    statsObs.unobserve(e.target);
    e.target.querySelectorAll('.stat-num').forEach(el => {
      const raw = el.textContent.trim();
      if (raw === '4')    animateCount(el, 4,   '',   1200);
      if (raw === '100%') animateCount(el, 100, '%',  1200);
      // '3D' and '∞' are non-numeric — intentionally left as static text
    });
  });
}, {threshold:0.5});

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObs.observe(statsBar);

/* Particles */
if (!noMotion) {
  setInterval(() => {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random()*100+'%';
    p.style.animationDuration = (10+Math.random()*14)+'s';
    p.style.animationDelay = '0s';
    p.style.setProperty('--dx', (Math.random()*80-40)+'px');
    p.style.width = p.style.height = (Math.random()>.5?2:3)+'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 25000);
  }, 3500);
}

/* Modals */
let activeModal = null;

function openModal(id) {
  if (activeModal) closeModal(false);
  const el = document.getElementById('modal-' + id);
  if (!el) return;
  activeModal = el;
  el.classList.add('open');
  updateBodyOverflow();
}

function closeModal(restoreScroll = true) {
  if (!activeModal) return;
  activeModal.classList.remove('open');
  activeModal = null;
  if (restoreScroll) updateBodyOverflow();
}

function switchModal(id) {
  openModal(id);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
});

/* Waitlist form */
function submitWaitlist() {
  const input   = document.getElementById('cta-email');
  const form    = document.getElementById('cta-form');
  const success = document.getElementById('form-success');
  const email   = input.value.trim();
  const valid   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!valid) {
    input.classList.remove('invalid');
    void input.offsetWidth;
    input.classList.add('invalid');
    setTimeout(() => input.classList.remove('invalid'), 600);
    return;
  }

  form.style.opacity = '0';
  form.style.transition = 'opacity .3s';
  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'flex';
    requestAnimationFrame(() => success.classList.add('visible'));
  }, 300);
}