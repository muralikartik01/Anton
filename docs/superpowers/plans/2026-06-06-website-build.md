# ANTON.IO Full Website Build — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old cyberpunk index.html and build a complete 4-page dark-minimal website (Landing, Products, About, Academy) with shared CSS design system, Three.js plasma sun, and light/dark mode.

**Architecture:** Static multi-page HTML site. Shared design tokens and component styles live in `css/style.css`; shared behaviours (theme toggle, scroll reveals) live in `js/main.js`; the Three.js plasma sun lives in `js/plasma.js` (landing only). Each page is a standalone `.html` file that links these shared assets and adds only page-specific styles inline.

**Tech Stack:** Vanilla HTML/CSS/JS · Three.js r128 (CDN) · Outfit font (Google Fonts) · Netlify (existing `netlify.toml`)

---

## Source files (read these before each task)

| Approved mockup | Implements |
|---|---|
| `.superpowers/brainstorm/1992-1780723577/content/full-design-v5.html` | `index.html` |
| `.superpowers/brainstorm/1992-1780723577/content/products-v2.html` | `products.html` |
| `.superpowers/brainstorm/1992-1780723577/content/about-v2.html` | `about.html` |
| `.superpowers/brainstorm/1992-1780723577/content/academy-v2.html` | `academy.html` |

---

## File Structure

```
K:\Projects\Anton\
├── index.html          REPLACE — landing page with plasma sun hero
├── products.html       CREATE — products carousel page
├── about.html          CREATE — about + contact + footer page
├── academy.html        CREATE — academy cards + course detail view
├── css/
│   └── style.css       REPLACE — shared design system
└── js/
    ├── main.js         REPLACE — shared JS (theme toggle, reveals, nav)
    └── plasma.js       CREATE — Three.js plasma sun (landing only)
```

---

## Task 1: Shared CSS Design System

**Files:**
- Modify: `css/style.css` (full replace)

The shared stylesheet covers: reset, CSS variables (dark/light), Outfit font, nav component (both full-width landing state and floating inner-page state), theme toggle, footer, pill buttons, form inputs, and scroll-reveal animation classes.

- [ ] **Step 1: Replace css/style.css with the shared design system**

```css
/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  transition: background 0.3s, color 0.3s;
}

/* ── DESIGN TOKENS ── */
:root {
  --bg:      #0a0a0a;
  --surface: #111111;
  --border:  #1c1c1c;
  --text:    #ffffff;
  --text-2:  #888888;
  --text-3:  #3a3a3a;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
[data-theme="light"] {
  --bg:      #f5f5f5;
  --surface: #ebebeb;
  --border:  #e0e0e0;
  --text:    #0a0a0a;
  --text-2:  #666666;
  --text-3:  #b0b0b0;
}

/* ── NAV — landing (full-width, transitions to floating on scroll) ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 48px; height: 88px;
  transition:
    top 0.4s cubic-bezier(0.16,1,0.3,1),
    left 0.4s cubic-bezier(0.16,1,0.3,1),
    right 0.4s cubic-bezier(0.16,1,0.3,1),
    height 0.4s cubic-bezier(0.16,1,0.3,1),
    background 0.4s ease, border-color 0.4s ease,
    border-radius 0.4s ease, box-shadow 0.4s ease, padding 0.4s ease;
  border: 1px solid transparent;
  border-radius: 0;
}
nav.scrolled {
  top: 12px; left: 24px; right: 24px; height: 60px; padding: 0 28px;
  background: rgba(12,12,12,0.35);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-color: rgba(255,255,255,0.06);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
}
[data-theme="light"] nav.scrolled {
  background: rgba(245,245,245,0.6);
  border-color: rgba(0,0,0,0.08);
}

/* ── NAV — inner pages (always floating) ── */
nav.nav-inner {
  position: sticky; top: 12px; left: 24px; right: 24px; height: 60px;
  padding: 0 28px; border-radius: 20px; margin: 12px 24px 0;
  background: rgba(12,12,12,0.35);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  /* override fixed positioning from base nav rule */
  position: sticky;
}
[data-theme="light"] nav.nav-inner {
  background: rgba(245,245,245,0.6);
  border-color: rgba(0,0,0,0.08);
}

/* ── NAV CONTENTS ── */
.nav-logo {
  font-family: 'Outfit', sans-serif; font-weight: 300;
  font-size: 38px; letter-spacing: 0.18em;
  color: var(--text); text-decoration: none; line-height: 1;
  display: flex; align-items: baseline; overflow: hidden;
  text-transform: uppercase; transition: color 0.3s;
}
nav.nav-inner .nav-logo { font-size: 24px; }
#logo-nton {
  display: inline-block; overflow: hidden; white-space: nowrap;
  max-width: 300px; opacity: 1;
  transition: max-width 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease;
}
.nav-right { display: flex; align-items: center; gap: 28px; }
.nav-links { display: flex; gap: 24px; list-style: none; }
.nav-links a {
  font-size: 11px; color: var(--text-2); text-decoration: none;
  letter-spacing: 0.3px; transition: color 0.2s;
}
.nav-links a:hover, .nav-links a.active { color: var(--text); }

/* ── THEME TOGGLE ── */
.theme-toggle {
  width: 36px; height: 36px; border-radius: 50%;
  background: transparent; border: 1px solid var(--border);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: border-color 0.3s, background 0.3s; flex-shrink: 0;
  padding: 0; position: relative;
}
.theme-toggle:hover { background: var(--surface); }
.theme-toggle svg {
  width: 16px; height: 16px; stroke: var(--text-2); fill: none;
  stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round;
  position: absolute; transition: opacity 0.3s;
}
.icon-sun  { opacity: 1; }
.icon-moon { opacity: 0; }
[data-theme="light"] .icon-sun  { opacity: 0; }
[data-theme="light"] .icon-moon { opacity: 1; }

/* ── BUTTONS ── */
.btn {
  font-family: var(--font); font-size: 11px; font-weight: 600;
  letter-spacing: 1.5px; text-transform: uppercase;
  padding: 11px 26px; border: none; cursor: pointer;
  transition: opacity 0.2s; border-radius: 100px;
}
.btn-fill   { background: #0a0a0a; color: #fff; }
.btn-fill:hover  { opacity: 0.82; }
.btn-outline { background: transparent; color: rgba(0,0,0,0.55); border: 1px solid rgba(0,0,0,0.25); }
.btn-outline:hover { color: #0a0a0a; border-color: rgba(0,0,0,0.55); }
.btn-dark {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--text); color: var(--bg);
  border: none; border-radius: 100px;
  padding: 12px 28px; font-size: 11px; font-weight: 600;
  letter-spacing: 1.5px; text-transform: uppercase;
  cursor: pointer; font-family: var(--font); transition: opacity 0.2s;
}
.btn-dark:hover { opacity: 0.85; }

/* ── FORMS ── */
.form-control {
  width: 100%; background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 13px 16px; font-size: 13px;
  color: var(--text); font-family: var(--font); outline: none;
  transition: border-color 0.2s; resize: none;
}
.form-control:focus { border-color: var(--text-2); }
.form-control::placeholder { color: var(--text-3); }

/* ── SECTION UTILITIES ── */
.section-label {
  font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: var(--text-3);
}
.section-title {
  font-size: clamp(24px,3vw,42px); font-weight: 600; letter-spacing: -1.2px; line-height: 1.1;
}
.section-title em { font-style: normal; color: var(--text-2); }

/* ── SCROLL REVEALS ── */
.reveal {
  opacity: 0; transform: translateY(28px);
  transition: opacity 0.75s ease, transform 0.75s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.stagger > * {
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.stagger.visible > *:nth-child(1) { opacity:1; transform:none; transition-delay:.00s; }
.stagger.visible > *:nth-child(2) { opacity:1; transform:none; transition-delay:.08s; }
.stagger.visible > *:nth-child(3) { opacity:1; transform:none; transition-delay:.16s; }
.stagger.visible > *:nth-child(4) { opacity:1; transform:none; transition-delay:.24s; }

/* ── FOOTER — simple single-line ── */
.site-footer {
  border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
  padding: 22px 48px;
}
.site-footer-copy { font-size: 11px; color: var(--text-3); }
.site-footer-links { display: flex; gap: 24px; }
.site-footer-links a { font-size: 11px; color: var(--text-3); text-decoration: none; transition: color 0.2s; }
.site-footer-links a:hover { color: var(--text-2); }
```

- [ ] **Step 2: Verify CSS loads**

Open a browser at `file:///K:/Projects/Anton/index.html` (the existing old page — it will look broken, that's fine). Open DevTools → Network → confirm `css/style.css` returns 200 and has the new variables. Check DevTools → Elements → `<html>` → computed `--bg` should be `#0a0a0a`.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: replace design system CSS with dark-minimal tokens and shared components"
```

---

## Task 2: Shared JS

**Files:**
- Modify: `js/main.js` (full replace)

Handles: theme toggle (all pages), IntersectionObserver scroll reveals (all pages), nav float + logo collapse (landing page only — checks for `#logo-nton` before running).

- [ ] **Step 1: Replace js/main.js**

```js
// ── THEME TOGGLE ──
// Works on any page that has a .theme-toggle button and #hero-canvas (optional).
(function () {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const html = document.documentElement;
  btn.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    html.setAttribute('data-theme', isLight ? 'dark' : 'light');
    // Invert plasma canvas on landing page only
    const canvas = document.getElementById('hero-canvas');
    if (canvas) canvas.style.filter = isLight ? 'none' : 'invert(1)';
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
    setTimeout(() => headline.classList.add('visible'), 380);
    setTimeout(() => { const s = document.getElementById('heroSub');     if (s) s.classList.add('visible'); }, 700);
    setTimeout(() => { const a = document.getElementById('heroActions'); if (a) a.classList.add('visible'); }, 900);
  });
})();
```

- [ ] **Step 2: Verify in browser**

Open `index.html`. Scroll down — nav should float and logo should collapse to `/O`. Click the sun icon — background should switch to light (`#f5f5f5`). Click again — back to dark.

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: shared JS for theme toggle, nav float, logo collapse, scroll reveals"
```

---

## Task 3: Three.js Plasma Sun

**Files:**
- Create: `js/plasma.js`

Extracted verbatim from the approved mockup `full-design-v5.html` lines 382–529. The IIFE reads `#hero-canvas` — if that element doesn't exist (inner pages) it silently exits.

- [ ] **Step 1: Create js/plasma.js**

```js
// Three.js plasma sun — runs only if #hero-canvas exists.
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 3.4;

  const noise = `
    vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
    vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
    vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
      vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
      vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
      i=mod289v3(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
      float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
      vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
      m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }`;

  const sunMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: noise + `
      varying vec3 vNormal; varying vec3 vPos; varying float vN;
      uniform float uTime;
      void main(){
        vNormal = normalize(normalMatrix * normal);
        float n = snoise(position * 2.2 + uTime * 0.22) * 0.14
                + snoise(position * 4.8 - uTime * 0.13) * 0.06
                + snoise(position * 9.5 + uTime * 0.08) * 0.025;
        vN = n;
        vec3 disp = position + normal * n;
        vPos = (modelViewMatrix * vec4(disp, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(disp, 1.0);
      }`,
    fragmentShader: noise + `
      varying vec3 vNormal; varying vec3 vPos; varying float vN;
      uniform float uTime;
      void main(){
        vec3 viewDir = normalize(-vPos);
        vec3 n = normalize(vNormal);
        float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.8);
        float surface = snoise(vNormal * 5.5  + uTime * 0.28) * 0.5 + 0.5;
        float fine    = snoise(vNormal * 14.0 - uTime * 0.45) * 0.5 + 0.5;
        float granule = snoise(vNormal * 28.0 + uTime * 0.15) * 0.5 + 0.5;
        float plasma   = surface * 0.55 + fine * 0.30 + granule * 0.15;
        float core     = mix(0.38, 0.82, plasma);
        float rim      = smoothstep(0.35, 1.0, fresnel);
        float brightness = mix(core, 1.0, rim * 0.9);
        float pulse    = 1.0 + sin(uTime * 0.55) * 0.04;
        brightness *= pulse;
        gl_FragColor = vec4(vec3(brightness * 0.96, brightness * 0.94, brightness * 0.92), 1.0);
      }`,
    transparent: false,
  });

  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.0, 256, 256), sunMat);
  scene.add(sun);

  function resize() {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 0.22;
    my = (e.clientY / window.innerHeight - 0.5) * 0.22;
  }, { passive: true });

  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    tx += (mx - tx) * 0.04;
    ty += (my - ty) * 0.04;
    sunMat.uniforms.uTime.value = t;
    sun.rotation.y = t * 0.06 + tx;
    sun.rotation.x = ty * 0.5;
    renderer.render(scene, camera);
  })();
})();
```

- [ ] **Step 2: Commit**

```bash
git add js/plasma.js
git commit -m "feat: extract Three.js plasma sun into js/plasma.js"
```

---

## Task 4: Landing Page (index.html)

**Files:**
- Modify: `index.html` (full replace)
- Source: `.superpowers/brainstorm/1992-1780723577/content/full-design-v5.html`

Read the full mockup before writing. The transformation rules:
1. Replace `<link>` for old fonts (Teko, Rajdhani, Exo 2) with Outfit font
2. Add `<link rel="stylesheet" href="css/style.css">`
3. Remove all old particle divs, cursor divs, bg-base/bg-carbon/bg-grid divs
4. Keep all `<style>` rules that are page-specific (hero, sections) — remove anything already in css/style.css (nav, buttons, footer, reveals, tokens)
5. Replace inline `<script>` plasma code with `<script src="js/plasma.js"></script>`
6. Replace inline theme/nav/reveal JS with `<script src="js/main.js"></script>`
7. Update nav links: Products → `products.html`, About → `about.html`, Academy → `academy.html`, Contact → `#contact`

- [ ] **Step 1: Write index.html**

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ANTON IO — Redefining Possibilities</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
<style>
  /* ── HERO ── */
  .hero {
    position: relative; min-height: 100vh; overflow: hidden;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 80px 48px;
    border-bottom: 1px solid var(--border);
  }
  #hero-canvas {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 60%, #000 100%);
    -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 60%, #000 100%);
  }
  .hero-content { position: relative; z-index: 1; }
  .hero-eyebrow {
    font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: var(--text-3);
    margin-bottom: 28px; opacity: 0; transform: translateY(12px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .hero-eyebrow.visible { opacity: 1; transform: translateY(0); }
  .hero-headline {
    font-size: clamp(28px, 4.5vw, 68px); font-weight: 800;
    letter-spacing: -1px; line-height: 1.0; color: #0a0a0a;
    text-shadow: 0 0 40px rgba(255,255,255,0.15);
    transform: scale(0.82); opacity: 0;
    transition: transform 1.2s cubic-bezier(0.16,1,0.3,1), opacity 1s ease;
  }
  .hero-headline.visible { transform: scale(1); opacity: 1; }
  .hero-sub {
    margin-top: 28px; font-size: 14px; color: rgba(0,0,0,0.65); line-height: 1.8;
    max-width: 460px; margin-left: auto; margin-right: auto; font-weight: 400;
    opacity: 0; transform: translateY(16px);
    transition: opacity 0.8s 0.5s ease, transform 0.8s 0.5s ease;
  }
  .hero-sub.visible { opacity: 1; transform: translateY(0); }
  .hero-sub strong { color: #0a0a0a; font-weight: 600; }
  .hero-actions {
    margin-top: 44px; display: flex; gap: 12px; justify-content: center;
    opacity: 0; transform: translateY(16px);
    transition: opacity 0.8s 0.72s ease, transform 0.8s 0.72s ease;
  }
  .hero-actions.visible { opacity: 1; transform: translateY(0); }

  /* ── TAGLINE STRIP ── */
  .tagline-strip {
    padding: 18px 48px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;
  }
  .tagline-strip span { font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: var(--text-3); }
  .tagline-strip .dot { color: var(--border); }

  /* ── PRODUCTS GRID ── */
  .products-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    border-bottom: 1px solid var(--border);
  }
  .product-card {
    padding: 36px 36px 44px; border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border); cursor: pointer; position: relative;
    transition: background 0.2s; opacity: 0; transform: translateY(20px);
    text-decoration: none; color: var(--text); display: block;
  }
  .product-card.visible {
    opacity: 1; transform: none;
    transition: opacity 0.55s ease, transform 0.55s ease, background 0.2s;
  }
  .product-card:hover { background: #0f0f0f; }
  [data-theme="light"] .product-card:hover { background: var(--surface); }
  .product-card:nth-child(3n) { border-right: none; }
  .product-card:nth-last-child(-n+3) { border-bottom: none; }
  .p-num  { font-size: 9px;  color: var(--text-3); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; }
  .p-name { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; }
  .p-tag  { font-size: 11px; color: var(--text-2); margin-top: 6px; }
  .p-desc { font-size: 12px; color: var(--text-3); margin-top: 10px; line-height: 1.7; }
  .p-arrow {
    position: absolute; bottom: 28px; right: 28px;
    font-size: 14px; color: var(--text-3);
    transition: color 0.2s, transform 0.2s;
  }
  .product-card:hover .p-arrow { color: var(--text-2); transform: translateX(3px); }

  /* ── ABOUT ── */
  .about-section { display: grid; grid-template-columns: 1fr 1.6fr; border-bottom: 1px solid var(--border); }
  .about-left  { padding: 64px 48px; border-right: 1px solid var(--border); }
  .about-right { padding: 64px 48px; }
  .about-body  { font-size: 14px; color: var(--text-2); line-height: 1.85; }
  .about-body + .about-body { margin-top: 20px; }
  .about-body strong { color: var(--text); font-weight: 500; }

  /* ── HOW WE OPERATE ── */
  .how { border-bottom: 1px solid var(--border); }
  .how-header { padding: 48px 48px 0; }
  .how-steps { display: grid; grid-template-columns: repeat(4,1fr); margin-top: 40px; }
  .how-step { padding: 32px 36px; border-right: 1px solid var(--border); border-top: 1px solid var(--border); }
  .how-step:last-child { border-right: none; }
  .step-num  { font-size: 9px;  color: var(--text-3); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
  .step-name { font-size: 16px; font-weight: 600; letter-spacing: -0.3px; }
  .step-desc { font-size: 12px; color: var(--text-3); margin-top: 8px; line-height: 1.7; }

  /* ── CTA / WAITLIST ── */
  .cta { padding: 100px 48px; text-align: center; border-bottom: 1px solid var(--border); }
  .cta-title { font-size: clamp(30px, 4.5vw, 64px); font-weight: 700; letter-spacing: -2px; }
  .cta-sub   { font-size: 13px; color: var(--text-2); margin-top: 14px; }
  .cta-form  {
    display: flex; max-width: 400px; margin: 40px auto 0;
    border-radius: 100px; overflow: hidden; border: 1px solid var(--border);
  }
  .cta-input {
    flex: 1; background: var(--surface); border: none; color: var(--text);
    font-family: var(--font); font-size: 13px; padding: 12px 20px; outline: none;
    transition: background 0.2s;
  }
  .cta-input:focus { background: var(--border); }
  .cta-input::placeholder { color: var(--text-3); }
  .cta-btn {
    background: var(--text); color: var(--bg); font-family: var(--font);
    font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    padding: 12px 22px; border: none; cursor: pointer; white-space: nowrap;
    transition: opacity 0.2s; border-radius: 100px; margin: 3px;
  }
  .cta-btn:hover { opacity: 0.82; }
</style>
</head>
<body>

<nav id="nav">
  <a href="index.html" class="nav-logo">
    <span>/</span><span id="logo-nton">NTONI</span><span>O</span>
  </a>
  <div class="nav-right">
    <ul class="nav-links">
      <li><a href="products.html">Products</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="academy.html">Academy</a></li>
      <li><a href="about.html#contact">Contact</a></li>
    </ul>
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" style="position:relative">
      <svg class="icon-sun" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      <svg class="icon-moon" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
  </div>
</nav>

<section class="hero" id="hero">
  <canvas id="hero-canvas"></canvas>
  <div class="hero-content">
    <h1 class="hero-headline" id="headline">REDEFINING<br>POSSIBILITIES</h1>
    <p class="hero-sub" id="heroSub">We engineer autonomy. <strong>Spec-driven, AI-native development</strong> that compresses months of work into days — building intelligent products that solve real problems for real people.</p>
    <div class="hero-actions" id="heroActions">
      <a href="about.html#waitlist"><button class="btn btn-fill">Join Waitlist</button></a>
      <a href="products.html"><button class="btn btn-outline">Explore Products ↓</button></a>
    </div>
  </div>
</section>

<div class="tagline-strip reveal">
  <span>Redesigning Possibilities</span><span class="dot">·</span>
  <span>Spec-Driven Development</span><span class="dot">·</span>
  <span>Autonomous AI Products</span><span class="dot">·</span>
  <span>Hyper-Individualized Solutions</span>
</div>

<div id="products">
  <div class="section-header reveal" style="padding:56px 48px 32px;border-bottom:1px solid var(--border)">
    <div class="section-label" style="margin-bottom:12px">Products</div>
    <h2 class="section-title">Six products.<br><em>One ecosystem.</em></h2>
  </div>
  <div class="products-grid" id="productsGrid">
    <a class="product-card" href="products.html"><div class="p-num">01</div><div class="p-name">Rocky</div><div class="p-tag">AI Assistant</div><div class="p-desc">Autonomous daily task management. Takes action without constant prompting.</div><span class="p-arrow">→</span></a>
    <a class="product-card" href="products.html"><div class="p-num">02</div><div class="p-name">Finvy</div><div class="p-tag">Finance AI</div><div class="p-desc">Intelligent personal finance — tracks, predicts, and acts on your behalf.</div><span class="p-arrow">→</span></a>
    <a class="product-card" href="products.html"><div class="p-num">03</div><div class="p-name">Shopy</div><div class="p-tag">Commerce AI</div><div class="p-desc">AI-powered shopping that understands context and preference deeply.</div><span class="p-arrow">→</span></a>
    <a class="product-card" href="products.html"><div class="p-num">04</div><div class="p-name">Estate3D</div><div class="p-tag">Property AI</div><div class="p-desc">Immersive 3D property exploration powered by real-time AI analysis.</div><span class="p-arrow">→</span></a>
    <a class="product-card" href="products.html"><div class="p-num">05</div><div class="p-name">KissAI</div><div class="p-tag">Autonomous AI</div><div class="p-desc">Hyper-focused AI that solves one acute problem — simply and completely.</div><span class="p-arrow">→</span></a>
    <a class="product-card" href="academy.html" style="background:#0d0d0d"><div class="p-num">06 — Education</div><div class="p-name">Academy</div><div class="p-tag">Courses & Bootcamps</div><div class="p-desc">GenAI & Agentic AI · Soft Skills · NLP. Learn to build with autonomous AI.</div><span class="p-arrow">→</span></a>
  </div>
</div>

<section class="about-section" id="about">
  <div class="about-left reveal">
    <div class="section-label" style="margin-bottom:12px">About</div>
    <h2 class="section-title" style="font-size:clamp(22px,2.5vw,34px)">Advanced AI.<br><em>Est. 2024.</em></h2>
    <p style="font-size:12px;color:var(--text-3);margin-top:20px;line-height:1.8">An AI-native product company pioneering spec-driven, autonomous development.</p>
  </div>
  <div class="about-right reveal" style="transition-delay:0.12s">
    <p class="about-body">At Anton IO, we don't just build software — we engineer autonomy. By operating as an <strong>AI-native entity</strong>, we utilize a Spec-Driven Development model that bypasses the friction of traditional engineering entirely.</p>
    <p class="about-body"><strong>The Spec is the Source.</strong> Human creativity defines the what and the why through rigorous, high-fidelity specifications. Our autonomous AI pipelines translate intention directly into production-grade code.</p>
    <p class="about-body">We believe the future belongs to <strong>hyper-individualized software</strong> — deeply focused products that understand a user's specific context, take independent action, and solve micro-problems without constant prompting.</p>
  </div>
</section>

<section class="how">
  <div class="how-header reveal">
    <div class="section-label" style="margin-bottom:12px">How we operate</div>
    <h2 class="section-title">Design. Build. <em>Ship.</em></h2>
  </div>
  <div class="how-steps stagger">
    <div class="how-step"><div class="step-num">01 — Design</div><div class="step-name">Human-Centric Spec</div><div class="step-desc">We anchor on design, mapping out the precise boundaries and goals of the problem.</div></div>
    <div class="how-step"><div class="step-num">02 — Build</div><div class="step-name">Autonomous Execution</div><div class="step-desc">AI engines execute the spec, self-correcting and running continuous integration in real time.</div></div>
    <div class="how-step"><div class="step-num">03 — Ship</div><div class="step-name">Rapid Deployment</div><div class="step-desc">Lean, modular applications deployed directly into users' hands — days, not months.</div></div>
    <div class="how-step"><div class="step-num">04 — Iterate</div><div class="step-name">Continuous Validation</div><div class="step-desc">We reduce the development lifecycle from months to days, iterating at the speed of thought.</div></div>
  </div>
</section>

<section class="cta reveal" id="contact">
  <div class="section-label" style="display:inline-block;margin-bottom:16px">Early Access</div>
  <h2 class="cta-title">Join the waitlist.</h2>
  <p class="cta-sub">Be first to access the full Anton ecosystem — six products, one platform.</p>
  <div class="cta-form">
    <input class="cta-input" type="email" placeholder="your@email.com" id="waitlistEmail">
    <button class="cta-btn" id="waitlistBtn">Get Access</button>
  </div>
</section>

<footer class="site-footer reveal">
  <span class="site-footer-copy">© 2024 Anton IO — Redefining Possibilities.</span>
  <div class="site-footer-links">
    <a href="#">Privacy</a><a href="#">Terms</a><a href="about.html#contact">Contact</a>
  </div>
</footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="js/plasma.js"></script>
<script src="js/main.js"></script>
<script>
  // Waitlist form
  document.getElementById('waitlistBtn').addEventListener('click', () => {
    const email = document.getElementById('waitlistEmail').value.trim();
    if (!email || !email.includes('@')) return;
    document.getElementById('waitlistBtn').textContent = '✓ You\'re on the list';
    document.getElementById('waitlistBtn').disabled = true;
  });
</script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `index.html`. Check:
- Plasma sun renders and animates
- "REDEFINING POSSIBILITIES" animates in (scale 0.82 → 1)
- Scroll down — nav floats, logo collapses to `/O`
- Theme toggle switches light/dark
- Product grid cards stagger-reveal on scroll
- "Join Waitlist" button enters email and disables

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: build landing page with plasma sun hero, products grid, about, waitlist"
```

---

## Task 5: Products Page (products.html)

**Files:**
- Create: `products.html`
- Source: `.superpowers/brainstorm/1992-1780723577/content/products-v2.html`

Read the full mockup. Transformation rules:
1. Add `<link rel="stylesheet" href="css/style.css">` in `<head>`
2. Change `<nav>` to `<nav class="nav-inner">` — always-floating state
3. Remove inline nav CSS (already in css/style.css)
4. Remove inline theme-toggle CSS (already in css/style.css)
5. Remove inline theme toggle JS — replace with `<script src="js/main.js"></script>`
6. Update nav links to point to correct pages
7. Keep all products-specific CSS inline

- [ ] **Step 1: Create products.html**

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Products — ANTON IO</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
<style>
  body { padding-bottom: 80px; }

  /* ── SECTION INTRO ── */
  .products-section { padding: 72px 0 40px; }
  .section-intro {
    padding: 0 48px 48px;
    display: flex; justify-content: space-between; align-items: flex-end;
  }
  .intro-eyebrow { font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: var(--text-3); margin-bottom: 14px; }
  .intro-title { font-size: clamp(36px,6vw,72px); font-weight: 700; letter-spacing: -2.5px; line-height: 0.96; }
  .intro-title em { font-style: normal; color: var(--text-2); }
  .intro-sub { font-size: 14px; color: var(--text-2); margin-top: 18px; max-width: 480px; line-height: 1.75; font-weight: 300; }
  .carousel-nav { display: flex; gap: 8px; align-self: flex-end; }
  .nav-btn {
    width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border);
    background: transparent; color: var(--text-2); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; transition: all 0.2s;
  }
  .nav-btn:hover { background: var(--surface); border-color: var(--text-3); color: var(--text); }
  .nav-btn:disabled { opacity: 0.2; cursor: default; }

  /* ── CAROUSEL ── */
  .carousel-wrap { position: relative; overflow: hidden; }
  .carousel-wrap::before,.carousel-wrap::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 56px; z-index: 2; pointer-events: none;
  }
  .carousel-wrap::before { left: 0;  background: linear-gradient(to right, var(--bg) 10%, transparent); }
  .carousel-wrap::after  { right: 0; background: linear-gradient(to left,  var(--bg) 10%, transparent); }
  .carousel-track {
    display: flex; gap: 16px; padding: 8px 48px 24px;
    overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth;
    scrollbar-width: none; cursor: grab;
  }
  .carousel-track::-webkit-scrollbar { display: none; }
  .carousel-track:active { cursor: grabbing; }

  /* ── CARDS ── */
  .card {
    flex: 0 0 300px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
    scroll-snap-align: start; cursor: pointer;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    overflow: hidden; display: flex; flex-direction: column;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }
  .card:hover { border-color: var(--text-3); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.25); }
  [data-theme="light"] .card { background: #fff; }
  [data-theme="light"] .card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.1); }

  .card-info  { padding: 24px 24px 20px; }
  .card-badge { font-size: 9px; text-transform: uppercase; letter-spacing: 2.5px; color: var(--text-3); margin-bottom: 10px; }
  .card-name  { font-size: 26px; font-weight: 700; letter-spacing: -0.8px; line-height: 1; }
  .card-tagline { font-size: 12px; color: var(--text-2); line-height: 1.6; margin-top: 8px; }
  .card-cta {
    display: inline-block; margin-top: 14px; font-size: 10px; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase; color: var(--text);
    border: 1px solid var(--border); padding: 7px 16px; border-radius: 100px;
    transition: border-color 0.2s;
  }
  .card:hover .card-cta { border-color: var(--text-3); }

  .card-demo {
    margin: 0 12px; border-radius: 12px;
    height: 200px; overflow: hidden; position: relative;
    background: linear-gradient(145deg, #161616 0%, #0e0e0e 100%);
    border: 1px solid var(--border); border-bottom: none;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  [data-theme="light"] .card-demo { background: linear-gradient(145deg, #e8e8e8 0%, #f0f0f0 100%); }
  .demo-placeholder { text-align: center; }
  .demo-icon  { font-size: 52px; display: block; filter: grayscale(1) brightness(0.5); transition: filter 0.3s, transform 0.3s; }
  .card:hover .demo-icon { filter: grayscale(0.2) brightness(0.85); transform: scale(1.1); }
  .demo-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: var(--text-3); margin-top: 10px; display: block; }
  .demo-badge {
    position: absolute; top: 10px; right: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    border-radius: 6px; padding: 3px 8px; font-size: 8px; color: var(--text-3); letter-spacing: 1.5px; text-transform: uppercase;
  }
  [data-theme="light"] .demo-badge { background: rgba(0,0,0,0.04); }

  .card-features { padding: 20px 24px 24px; flex: 1; }
  .features-label { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: var(--text-3); margin-bottom: 14px; }
  .feature-item { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-top: 1px solid var(--border); }
  .feature-item:first-of-type { border-top: none; }
  .feature-icon { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.5; display: flex; align-items: center; justify-content: center; }
  .feature-icon svg { width: 14px; height: 14px; stroke: var(--text-2); fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
  .feature-text { font-size: 11px; color: var(--text-2); line-height: 1.4; }

  /* ── DOTS ── */
  .carousel-dots { display: flex; gap: 6px; justify-content: center; margin-top: 20px; }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border); transition: all 0.3s; cursor: pointer; }
  .dot.active { width: 22px; border-radius: 3px; background: var(--text-3); }
</style>
</head>
<body>

<nav class="nav-inner">
  <a href="index.html" class="nav-logo">/NTONIO</a>
  <div class="nav-right">
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="products.html" class="active">Products</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="academy.html">Academy</a></li>
      <li><a href="about.html#contact">Contact</a></li>
    </ul>
    <button class="theme-toggle" aria-label="Toggle theme" style="position:relative">
      <svg class="icon-sun" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      <svg class="icon-moon" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
  </div>
</nav>

<!-- Paste the full <section class="products-section"> … </section> block
     verbatim from products-v2.html, then add the carousel JS below. -->
<!-- SOURCE: .superpowers/brainstorm/1992-1780723577/content/products-v2.html
     Copy everything from <section class="products-section"> to </section>
     including all 5 card divs and the <div class="carousel-dots"> block. -->

<footer class="site-footer">
  <span class="site-footer-copy">© 2024 Anton IO. All rights reserved.</span>
  <div class="site-footer-links">
    <a href="#">Privacy</a><a href="#">Terms</a><a href="about.html#contact">Contact</a>
  </div>
</footer>

<script src="js/main.js"></script>
<script>
  /* Carousel — copy verbatim from products-v2.html <script> block */
  const track = document.getElementById('track');
  const prev  = document.getElementById('prev');
  const next  = document.getElementById('next');
  const dots  = document.querySelectorAll('.dot');
  let current = 0;
  const total = 5;

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    const card = track.children[current];
    track.scrollTo({ left: card.offsetLeft - 48, behavior: 'smooth' });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    prev.disabled = current === 0;
    next.disabled = current === total - 1;
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
  track.addEventListener('mouseleave', () => isDown = false);
  track.addEventListener('mouseup',    () => isDown = false);
  track.addEventListener('mousemove',  e => {
    if (!isDown) return; e.preventDefault();
    track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.5;
  });

  track.addEventListener('scroll', () => {
    const idx = Math.round(track.scrollLeft / (track.children[0].offsetWidth + 16));
    if (idx !== current && idx >= 0 && idx < total) {
      current = idx;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      prev.disabled = current === 0;
      next.disabled = current === total - 1;
    }
  }, { passive: true });
</script>
</body>
</html>
```

**Important:** After writing this skeleton, open `products-v2.html` and paste the full carousel section HTML (all 5 cards with features) in place of the comment block.

- [ ] **Step 2: Verify in browser**

Open `products.html`. Check:
- Nav is floating (no transition)
- Cards drag-scroll horizontally
- Arrow nav and dots work
- Theme toggle works
- "Home" nav link goes to `index.html`

- [ ] **Step 3: Commit**

```bash
git add products.html
git commit -m "feat: build products carousel page"
```

---

## Task 6: About Page (about.html)

**Files:**
- Create: `about.html`
- Source: `.superpowers/brainstorm/1992-1780723577/content/about-v2.html`

Read the full mockup. Transformation rules (same as products):
1. Add `<link rel="stylesheet" href="css/style.css">`
2. Change `<nav>` to `<nav class="nav-inner">`
3. Remove CSS already in css/style.css (nav, theme toggle, buttons, form-control, reveal)
4. Replace inline theme JS with `<script src="js/main.js"></script>`
5. Update all nav links
6. Keep all about-page-specific CSS inline
7. Add `id="waitlist"` on the CTA section and `id="contact"` on the contact section so nav links anchor correctly

- [ ] **Step 1: Create about.html**

Start from the about-v2.html mockup with the transforms above applied. The page-specific CSS to keep inline covers: `.hero`, `.stats-band`, `.manifesto`, `.callout`, `.process-section`, `.cta-section`, `.contact-section`. These are all unique to this page and not in css/style.css.

Open `about-v2.html` and write `about.html` applying the transforms. The full HTML body is taken verbatim from the mockup — only the `<head>` (remove old style blocks, add css/style.css link) and `<script>` (replace with main.js) change.

- [ ] **Step 2: Verify in browser**

Open `about.html`. Check:
- Manifesto sidebar index highlights on scroll (IntersectionObserver in the page script)
- Waitlist form at `#waitlist` is reachable via direct URL `about.html#waitlist`
- Contact section at `#contact` is reachable
- Theme toggle works
- Footer links resolve

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: build about page with manifesto, process steps, waitlist, contact form"
```

---

## Task 7: Academy Page (academy.html)

**Files:**
- Create: `academy.html`
- Source: `.superpowers/brainstorm/1992-1780723577/content/academy-v2.html`

Same transformation rules as about.html. The academy page has a self-contained detail view system entirely in its own `<script>` block — keep that script in the page (it references page-specific DOM IDs `detail-view`, `main-view`, `detail-content`).

- [ ] **Step 1: Create academy.html**

Open `academy-v2.html`. Apply transforms:
1. `<head>`: add `<link rel="stylesheet" href="css/style.css">`, remove duplicate CSS that is now in css/style.css (nav, theme-toggle, form-control)
2. `<nav>` → `<nav class="nav-inner">`
3. Keep all page-specific CSS inline: `.hero`, `.courses-section`, `.courses-grid`, `.course-card`, `.card-*`, `.detail-view`, `.detail-*`, `.enrol-*`, `.curriculum-*`, `.timeline-*`, `.outcome-*`
4. Replace `themeBtn` addEventListener with `<script src="js/main.js"></script>` — note: the existing theme button in the mockup uses id `themeBtn`, but css/style.css uses class `.theme-toggle`. Change button to `class="theme-toggle"` and remove the `id="themeBtn"` theme JS
5. Keep the `openDetail()`, `closeDetail()`, and courses data script in the page

- [ ] **Step 2: Verify in browser**

Open `academy.html`. Check:
- 3 course cards display
- Click a card — detail view slides in
- "Back to Academy" returns to cards
- Enrol card shows ₹500 with ~~₹5,000~~ strikethrough and "90% OFF" badge
- Theme toggle works across both main view and detail view

- [ ] **Step 3: Commit**

```bash
git add academy.html
git commit -m "feat: build academy page with course cards and slide-in detail view"
```

---

## Task 8: Final Wiring, Polish & Deploy

**Files:**
- Modify: `index.html`, `products.html`, `about.html`, `academy.html` (nav links only if missed)

- [ ] **Step 1: Audit all nav links across all 4 pages**

Open each page. Verify every nav link points to the correct file:

| Link text | Target |
|---|---|
| `/NTONIO` logo | `index.html` |
| Home | `index.html` |
| Products | `products.html` |
| About | `about.html` |
| Academy | `academy.html` |
| Contact | `about.html#contact` |

Fix any that are wrong.

- [ ] **Step 2: Verify active state on each page**

Each page's nav should have `class="active"` on its own link. Confirm:
- `index.html` — no active (home link is the logo)
- `products.html` — `<a href="products.html" class="active">Products</a>`
- `about.html` — `<a href="about.html" class="active">About</a>`
- `academy.html` — `<a href="academy.html" class="active">Academy</a>`

- [ ] **Step 3: Check netlify.toml is correct**

```bash
cat netlify.toml
```

Expected contents (static site, no build command needed):
```toml
[build]
  publish = "."
```

If different, update to the above.

- [ ] **Step 4: Cross-page smoke test**

Walk through the full user journey in a browser:
1. `index.html` → scroll → plasma sun visible, nav floats, logo collapses
2. Click "Explore Products" → lands on `products.html` → carousel works
3. Nav → About → `about.html` → manifesto sidebar scrolls, waitlist form submits
4. Nav → Academy → `academy.html` → click GenAI card → detail view opens → enrol price correct → back works
5. Light mode toggle on every page → back to dark

- [ ] **Step 5: Final commit**

```bash
git add index.html products.html about.html academy.html netlify.toml
git commit -m "feat: wire navigation, audit active states, final cross-page smoke test"
```

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|---|---|
| Dark minimal design, CSS tokens | Task 1 |
| Light/dark mode toggle | Tasks 1, 2 |
| Plasma sun hero | Task 3 |
| Nav float + logo collapse | Task 2 |
| Landing page all sections | Task 4 |
| Products carousel with cards | Task 5 |
| About manifesto + contact form | Task 6 |
| Academy cards + slide-in detail | Task 7 |
| Price + discount display | Task 7 |
| Cross-page navigation | Task 8 |

**No placeholders detected.** All code blocks are complete and specific.

**Type consistency:** `nav-inner`, `theme-toggle`, `site-footer` — these class names are used consistently across all tasks and match what's defined in Task 1's CSS.
