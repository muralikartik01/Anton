# Anton.io Website Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance `anton-io-v4.html` with product modals, parallax effects, animation polish, a working waitlist form, and restructure it as a deployment-ready static site for `www.anton-io.com` on Netlify.

**Architecture:** Split the single monolithic HTML file into `index.html` + `css/style.css` + `js/main.js` + `netlify.toml`. All enhancements are added as isolated CSS rules and JS functions — no build tooling, no dependencies beyond what already exists.

**Tech Stack:** HTML5, CSS3, vanilla JS (ES6+), Netlify (static hosting), Git/GitHub

**Spec:** `docs/superpowers/specs/2026-05-30-anton-io-enhancement-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `index.html` | Create (from `anton-io-v4.html`) | Markup only — no inline `<style>` or `<script>` |
| `css/style.css` | Create | All styles extracted from `<style>` block + new enhancement styles |
| `js/main.js` | Create | All scripts extracted from `<script>` block + new enhancement JS |
| `netlify.toml` | Create | Netlify redirect config for SPA-style URL handling |
| `.gitignore` | Create | Ignore `.superpowers/`, `node_modules/` |

---

## Task 1: Split into HTML + CSS + JS Files

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/main.js`
- Create: `netlify.toml`
- Create: `.gitignore`

- [ ] **Step 1: Create `css/style.css`**

Open `anton-io-v4.html`. Copy every line between (but not including) `<style>` and `</style>` — that is lines 13–375 — and paste into a new file `css/style.css`. The file should start with the `*,` reset rule and end with the last `@keyframes` or media query block.

- [ ] **Step 2: Create `js/main.js`**

From `anton-io-v4.html`, copy every line between (but not including) `<script>` and `</script>` — lines 639–703 — and paste into `js/main.js`. The file should start with the `/* Hamburger */` comment.

- [ ] **Step 3: Create `index.html`**

Copy `anton-io-v4.html` to `index.html`. Then make two edits:

Replace the entire `<style>...</style>` block (lines 13–376) with:
```html
<link rel="stylesheet" href="css/style.css">
```

Replace the entire `<script>...</script>` block (lines 638–703) with:
```html
<script src="js/main.js" defer></script>
```

- [ ] **Step 4: Create `netlify.toml`**

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] **Step 5: Create `.gitignore`**

```
.superpowers/
node_modules/
.DS_Store
Thumbs.db
```

- [ ] **Step 6: Verify in browser**

Open `index.html` directly in a browser (double-click or drag-drop). Confirm:
- Site renders identically to `anton-io-v4.html`
- Custom cursor works
- Hamburger menu opens/closes
- Scroll reveal animations fire
- No console errors (open DevTools → Console tab)

- [ ] **Step 7: Commit**

```bash
cd "K:/Projects/Anton"
git init
git add index.html css/style.css js/main.js netlify.toml .gitignore
git commit -m "feat: split into index.html + css/style.css + js/main.js, add netlify.toml"
```

---

## Task 2: Static Navbar + Scroll-to-Top Button

**Files:**
- Modify: `css/style.css` — nav positioning, hero padding, scroll-to-top styles
- Modify: `js/main.js` — remove nav scroll handler, add scroll-to-top logic
- Modify: `index.html` — add scroll-to-top button markup, remove safe-area nav padding

- [ ] **Step 1: Update nav CSS in `css/style.css`**

Find the `nav{` rule. Replace:
```css
nav{
  position:fixed;top:0;left:0;right:0;z-index:500;
  padding:calc(var(--safe-top) + 14px) max(var(--safe-left),clamp(16px,4vw,56px)) 14px max(var(--safe-right),clamp(16px,4vw,56px));
```
With:
```css
nav{
  position:relative;z-index:100;
  padding:14px max(var(--safe-left),clamp(16px,4vw,56px)) 14px max(var(--safe-right),clamp(16px,4vw,56px));
```

- [ ] **Step 2: Remove `nav.scrolled` rule from `css/style.css`**

Delete this entire line:
```css
nav.scrolled{padding-top:calc(var(--safe-top) + 10px);padding-bottom:10px;background:rgba(5,5,7,.9);}
```

- [ ] **Step 3: Fix hero top padding in `css/style.css`**

Find the `.hero{` rule. Replace:
```css
.hero{position:relative;z-index:10;min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:calc(var(--safe-top) + 110px) clamp(20px,5vw,60px) 80px;overflow:hidden;}
```
With:
```css
.hero{position:relative;z-index:10;min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:clamp(40px,6vw,80px) clamp(20px,5vw,60px) 80px;overflow:hidden;}
```

- [ ] **Step 4: Add scroll-to-top button styles to the end of `css/style.css`**

```css
/* SCROLL TO TOP */
#scroll-top{
  position:fixed;bottom:clamp(20px,3vw,36px);right:clamp(20px,3vw,36px);
  width:44px;height:44px;border-radius:50%;
  background:var(--glass-bg);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(168,85,247,.35);
  color:var(--purple-hi);font-size:1.1rem;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;z-index:400;
  opacity:0;pointer-events:none;
  transition:opacity .3s,transform .2s,box-shadow .2s;
  box-shadow:0 0 0 rgba(124,58,237,0);
}
#scroll-top.visible{opacity:1;pointer-events:all;}
#scroll-top:hover{transform:translateY(-2px);box-shadow:0 0 22px rgba(124,58,237,.45);}
```

- [ ] **Step 5: Add scroll-to-top button HTML in `index.html`**

Just before `</body>`, after the `<footer>` block, add:
```html
<button id="scroll-top" aria-label="Back to top">↑</button>
```

- [ ] **Step 6: Remove nav scroll handler from `js/main.js`**

Delete these lines:
```js
/* Nav scroll */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 70); }, {passive:true});
```

- [ ] **Step 7: Add scroll-to-top logic to `js/main.js`**

After the cursor block, add:
```js
/* Scroll to top */
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
}, {passive:true});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({top:0, behavior:'smooth'});
});
```

- [ ] **Step 8: Verify in browser**

Open `index.html`. Confirm:
- Nav is no longer stuck to the top when scrolling
- Nav scrolls away naturally with the page
- After scrolling 300px, the `↑` button appears bottom-right
- Clicking `↑` smoothly returns to top
- No layout jump at the top of the page

- [ ] **Step 9: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: static navbar, scroll-to-top button"
```

---

## Task 3: Parallax Scroll Effects

**Files:**
- Modify: `js/main.js` — add multi-element parallax handler
- Modify: `css/style.css` — ensure `.bg-grid` has no `transform` that conflicts

- [ ] **Step 1: Add parallax JS to `js/main.js`**

Replace the existing parallax block:
```js
/* Parallax A */
const heroA = document.querySelector('.hero-a');
const noMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
if (heroA && !noMotion) {
  window.addEventListener('scroll', () => {
    heroA.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * .3}px))`;
  }, {passive:true});
}
```

With this expanded version:
```js
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
```

- [ ] **Step 2: Verify in browser**

Open `index.html`. Scroll slowly through the hero section. Confirm:
- The giant `A` drifts downward as you scroll (existing behaviour preserved)
- The hero title drifts upward slightly faster than the page
- The subtitle drifts at a slightly slower rate than the title
- The badge drifts the least of the three
- The background grid lines shift position subtly
- All effects are smooth (no jank)
- Setting OS "Reduce motion" disables all parallax

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: multi-element parallax on hero and bg-grid"
```

---

## Task 4: Animation Enhancements

**Files:**
- Modify: `css/style.css` — card scale, icon glow, nav letter-spacing, CTA shimmer, stats count-up CSS

- [ ] **Step 1: Add card hover scale to `css/style.css`**

Find `.product-card:hover::after` rule. Add a new rule directly above it:
```css
.product-card:hover{transform:scale(1.01);}
.product-card{transition:background .4s,box-shadow .4s,transform .3s;}
```

Note: The existing `.product-card` rule already has `transition:background .4s,box-shadow .4s` — replace that `transition` value with `background .4s,box-shadow .4s,transform .3s`.

- [ ] **Step 2: Add per-card icon glow to `css/style.css`**

After the existing `.card-estate:hover .product-icon` rule, add:
```css
.card-rocky:hover  .product-icon svg { filter:drop-shadow(0 0 8px var(--rocky-c));  }
.card-finy:hover   .product-icon svg { filter:drop-shadow(0 0 8px var(--finy-c));   }
.card-shopy:hover  .product-icon svg { filter:drop-shadow(0 0 8px var(--shopy-c));  }
.card-estate:hover .product-icon svg { filter:drop-shadow(0 0 8px var(--estate-c)); }
```

Also add `transition:filter .3s;` to `.product-icon svg`:
```css
.product-icon svg{width:clamp(20px,2.5vw,26px);height:clamp(20px,2.5vw,26px);transition:filter .3s;}
```

- [ ] **Step 3: Add nav link letter-spacing hover to `css/style.css`**

Find `.nav-links a` rule. Add `letter-spacing` to its transition and a hover override:
```css
.nav-links a{font-family:var(--font-brand);font-size:clamp(.72rem,1.1vw,.82rem);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);text-decoration:none;transition:color .25s,letter-spacing .2s;position:relative;}
```
Then add after `.nav-links a:hover::after{width:100%;}`:
```css
.nav-links a:hover{color:var(--purple-hi);letter-spacing:.18em;}
```

- [ ] **Step 4: Add CTA button shimmer to `css/style.css`**

Add after the `.btn-primary:hover` rule:
```css
.btn-primary{position:relative;overflow:hidden;}
.btn-primary::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.15) 50%,transparent 100%);
  transform:translateX(-100%);
  transition:transform 0s;
  pointer-events:none;
}
.btn-primary:hover::after{
  transform:translateX(100%);
  transition:transform .5s ease;
}
```

- [ ] **Step 5: Add stats count-up JS to `js/main.js`**

After the scroll reveal block, add:
```js
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
      if (raw === '4')    animateCount(el, 4,    '',    1200);
      if (raw === '100%') animateCount(el, 100,  '%',   1200);
    });
  });
}, {threshold:0.5});

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObs.observe(statsBar);
```

Note: `3D` and `∞` are left as static text — they can't meaningfully animate numerically.

- [ ] **Step 6: Verify in browser**

Open `index.html`. Confirm:
- Hovering a product card lifts it slightly (scale 1.01)
- Hovering a card makes its icon glow in the card's accent colour
- Hovering a nav link widens the letter spacing smoothly
- Hovering the "Explore Products" button shows a shimmer sweep
- Scrolling to the stats bar triggers the `4` counting up from 0 and `100%` counting up from 0%
- `3D` and `∞` remain static

- [ ] **Step 7: Commit**

```bash
git add css/style.css js/main.js
git commit -m "feat: card hover scale, icon glow, nav letter-spacing, shimmer, stats count-up"
```

---

## Task 5: Product Modals

**Files:**
- Modify: `index.html` — add 4 modal overlay blocks + "Learn More" indicator on cards
- Modify: `css/style.css` — modal styles
- Modify: `js/main.js` — openModal, closeModal, switchModal functions

- [ ] **Step 1: Add modal styles to `css/style.css`**

Append to the end of `css/style.css`:
```css
/* MODALS */
.modal-overlay{
  position:fixed;inset:0;z-index:600;
  display:flex;align-items:center;justify-content:center;
  padding:clamp(16px,3vw,40px);
  background:rgba(5,5,7,0);
  backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);
  opacity:0;pointer-events:none;
  transition:opacity .3s,backdrop-filter .3s,background .3s;
}
.modal-overlay.open{
  opacity:1;pointer-events:all;
  background:rgba(5,5,7,.82);
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
}
.modal-panel{
  width:100%;max-width:860px;max-height:90vh;overflow-y:auto;
  padding:clamp(24px,4vw,48px);
  position:relative;
  transform:translateY(40px);opacity:0;
  transition:transform .3s ease-out,opacity .3s ease-out;
}
.modal-overlay.open .modal-panel{transform:translateY(0);opacity:1;}
.modal-close{
  position:absolute;top:16px;right:16px;
  width:34px;height:34px;border-radius:8px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);
  color:var(--muted);font-size:.9rem;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:border-color .2s,color .2s;
}
.modal-close:hover{border-color:rgba(168,85,247,.5);color:var(--purple-hi);}
.modal-body{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,3vw,36px);align-items:start;}
.modal-info{display:flex;flex-direction:column;gap:0;}
.modal-divider{width:32px;height:1px;background:rgba(168,85,247,.25);margin:14px 0;}
.modal-cta{margin-top:clamp(18px,2vw,24px);align-self:flex-start;}
.modal-preview{
  border-radius:12px;overflow:hidden;
  border:1px solid;
  min-height:260px;
  display:flex;flex-direction:column;
}
.modal-overlay.modal-rocky  .modal-preview{border-color:rgba(192,132,252,.2);background:rgba(192,132,252,.04);}
.modal-overlay.modal-finy   .modal-preview{border-color:rgba(52,211,153,.2); background:rgba(52,211,153,.04);}
.modal-overlay.modal-shopy  .modal-preview{border-color:rgba(251,146,60,.2); background:rgba(251,146,60,.04);}
.modal-overlay.modal-estate .modal-preview{border-color:rgba(96,165,250,.2); background:rgba(96,165,250,.04);}
.preview-chrome{
  padding:8px 14px;border-bottom:1px solid rgba(255,255,255,.06);
  display:flex;align-items:center;gap:6px;
}
.preview-chrome span{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.08);}
.preview-chrome .preview-title{margin-left:8px;font-size:.58rem;color:#4b5563;letter-spacing:.08em;}
.preview-body{flex:1;padding:14px;display:flex;flex-direction:column;gap:8px;}
.preview-row{background:rgba(255,255,255,.03);border-radius:6px;padding:8px 12px;border:1px solid rgba(255,255,255,.04);}
.preview-row .pr-label{font-size:.55rem;color:#6b7280;margin-bottom:3px;}
.preview-row .pr-val{font-size:.68rem;}
.preview-cmd{background:rgba(255,255,255,.02);border-radius:6px;padding:8px 12px;border:1px solid rgba(255,255,255,.04);}
.preview-cmd .pc-in{font-size:.6rem;color:#9ca3af;margin-bottom:4px;}
.preview-cmd .pc-out{font-size:.58rem;color:#4b5563;}
.modal-dots{
  display:flex;align-items:center;justify-content:center;gap:6px;
  margin-top:clamp(16px,2vw,24px);
}
.modal-dot{
  height:4px;border-radius:2px;cursor:pointer;
  transition:width .25s,background .25s;
  background:rgba(255,255,255,.12);width:8px;
}
.modal-dot.active{width:22px;}
.modal-overlay.modal-rocky  .modal-dot.active{background:var(--rocky-c);}
.modal-overlay.modal-finy   .modal-dot.active{background:var(--finy-c);}
.modal-overlay.modal-shopy  .modal-dot.active{background:var(--shopy-c);}
.modal-overlay.modal-estate .modal-dot.active{background:var(--estate-c);}
/* card click hint */
.product-card-link{cursor:pointer;}
.card-hint{
  margin-top:clamp(14px,2vw,20px);
  font-family:var(--font-brand);font-size:clamp(.58rem,.78vw,.66rem);
  letter-spacing:.12em;text-transform:uppercase;
  display:flex;align-items:center;gap:8px;opacity:.45;
  transition:opacity .3s;
}
.product-card:hover .card-hint{opacity:1;}
.card-rocky  .card-hint{color:var(--rocky-c);}
.card-finy   .card-hint{color:var(--finy-c);}
.card-shopy  .card-hint{color:var(--shopy-c);}
.card-estate .card-hint{color:var(--estate-c);}
.card-hint::after{content:'→';font-size:.8rem;}

@media(max-width:640px){
  .modal-body{grid-template-columns:1fr;}
  .modal-preview{display:none;}
}
```

- [ ] **Step 2: Add "Learn More" hint to each product card in `index.html`**

Inside each product card, after the last `<div class="product-features">...</div>` block, add `<div class="card-hint">Learn More</div>`.

Do this for all four cards (Rocky, Finy, Shopy, Estate3D). Also add `onclick="openModal('rocky')"` etc. to each `.product-card` div's opening tag:

Rocky: `<div class="product-card glass card-rocky reveal" onclick="openModal('rocky')">`
Finy:  `<div class="product-card glass card-finy reveal" style="transition-delay:.1s" onclick="openModal('finy')">`
Shopy: `<div class="product-card glass card-shopy reveal" style="transition-delay:.2s" onclick="openModal('shopy')">`
Estate: `<div class="product-card glass card-estate reveal" style="transition-delay:.3s" onclick="openModal('estate')">`

- [ ] **Step 3: Add the 4 modal HTML blocks to `index.html`**

Just before `<script src="js/main.js" defer></script>`, add:

```html
<!-- MODALS -->
<div class="modal-overlay modal-rocky" id="modal-rocky" role="dialog" aria-modal="true" aria-label="Rocky product details">
  <div class="modal-panel glass card-rocky">
    <button class="modal-close" onclick="closeModal()" aria-label="Close">✕</button>
    <div class="modal-body">
      <div class="modal-info">
        <span class="product-num">01 / 04</span>
        <div class="product-name" style="color:var(--rocky-c)">Rocky</div>
        <div class="product-subtitle">Personalized AI Assistant</div>
        <div class="modal-divider"></div>
        <p class="product-desc">Your intelligent personal companion — Rocky learns your habits, manages your schedule, handles reminders, and acts on your behalf across every corner of your digital life.</p>
        <div class="product-features">
          <div class="feat">Learns your preferences over time</div>
          <div class="feat">Autonomous scheduling & reminders</div>
          <div class="feat">Multi-channel communication</div>
          <div class="feat">Context-aware task execution</div>
        </div>
        <button class="btn-primary modal-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'});closeModal()">Join Waitlist</button>
      </div>
      <div class="modal-preview">
        <div class="preview-chrome"><span></span><span></span><span></span><div class="preview-title" style="color:var(--rocky-c)">Rocky — Dashboard</div></div>
        <div class="preview-body">
          <div class="preview-row"><div class="pr-label">Good morning, Anton</div><div class="pr-val" style="color:var(--rocky-c)">3 tasks scheduled today</div></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div class="preview-row"><div class="pr-label">Next meeting</div><div class="pr-val" style="color:var(--rocky-c)">2:30 PM</div></div>
            <div class="preview-row"><div class="pr-label">Reminders</div><div class="pr-val" style="color:var(--rocky-c)">5 pending</div></div>
          </div>
          <div class="preview-cmd"><div class="pc-in">"Rocky, reschedule my 3pm call to tomorrow"</div><div class="pc-out">→ Done. Moved to Thursday 3:00 PM ✓</div></div>
        </div>
      </div>
    </div>
    <div class="modal-dots">
      <div class="modal-dot active" onclick="switchModal('rocky')"></div>
      <div class="modal-dot" onclick="switchModal('finy')"></div>
      <div class="modal-dot" onclick="switchModal('shopy')"></div>
      <div class="modal-dot" onclick="switchModal('estate')"></div>
    </div>
  </div>
</div>

<div class="modal-overlay modal-finy" id="modal-finy" role="dialog" aria-modal="true" aria-label="Finy product details">
  <div class="modal-panel glass card-finy">
    <button class="modal-close" onclick="closeModal()" aria-label="Close">✕</button>
    <div class="modal-body">
      <div class="modal-info">
        <span class="product-num">02 / 04</span>
        <div class="product-name" style="color:var(--finy-c)">Finy</div>
        <div class="product-subtitle">Financial Assistance</div>
        <div class="modal-divider"></div>
        <p class="product-desc">Finy connects to your bank, watches every transaction, and proactively alerts you before spending goes sideways — your autonomous personal finance manager.</p>
        <div class="product-features">
          <div class="feat">Live bank account integration</div>
          <div class="feat">Real-time anomaly detection</div>
          <div class="feat">Smart spend categorization</div>
          <div class="feat">Savings & investment nudges</div>
        </div>
        <button class="btn-primary modal-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'});closeModal()">Join Waitlist</button>
      </div>
      <div class="modal-preview">
        <div class="preview-chrome"><span></span><span></span><span></span><div class="preview-title" style="color:var(--finy-c)">Finy — Finance</div></div>
        <div class="preview-body">
          <div class="preview-row"><div class="pr-label">Balance</div><div class="pr-val" style="color:var(--finy-c)">$4,821.50</div></div>
          <div class="preview-row"><div class="pr-label">This month</div><div class="pr-val" style="color:var(--finy-c)">−$1,240 spent · +$3,200 income</div></div>
          <div class="preview-cmd"><div class="pc-in" style="color:#f87171">⚠ Unusual charge detected: $340 at Vendor XYZ</div><div class="pc-out">→ Flagged for review. Reply to approve or dispute.</div></div>
        </div>
      </div>
    </div>
    <div class="modal-dots">
      <div class="modal-dot" onclick="switchModal('rocky')"></div>
      <div class="modal-dot active" onclick="switchModal('finy')"></div>
      <div class="modal-dot" onclick="switchModal('shopy')"></div>
      <div class="modal-dot" onclick="switchModal('estate')"></div>
    </div>
  </div>
</div>

<div class="modal-overlay modal-shopy" id="modal-shopy" role="dialog" aria-modal="true" aria-label="Shopy product details">
  <div class="modal-panel glass card-shopy">
    <button class="modal-close" onclick="closeModal()" aria-label="Close">✕</button>
    <div class="modal-body">
      <div class="modal-info">
        <span class="product-num">03 / 04</span>
        <div class="product-name" style="color:var(--shopy-c)">Shopy</div>
        <div class="product-subtitle">AI Autonomous Shopping</div>
        <div class="modal-divider"></div>
        <p class="product-desc">Just tell Shopy what you need — it figures out exactly what you want, finds the best deal across the web, and handles the purchase. Ask Shopy, it does the rest.</p>
        <div class="product-features">
          <div class="feat">Natural language product discovery</div>
          <div class="feat">Cross-platform price comparison</div>
          <div class="feat">Autonomous checkout & ordering</div>
          <div class="feat">Delivery tracking & returns</div>
        </div>
        <button class="btn-primary modal-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'});closeModal()">Join Waitlist</button>
      </div>
      <div class="modal-preview">
        <div class="preview-chrome"><span></span><span></span><span></span><div class="preview-title" style="color:var(--shopy-c)">Shopy — Orders</div></div>
        <div class="preview-body">
          <div class="preview-cmd"><div class="pc-in">"Find me the best wireless headphones under $150"</div><div class="pc-out">→ Found 3 options. Best deal: Sony WH-CH720N $98 on Amazon ✓</div></div>
          <div class="preview-row"><div class="pr-label">Last order</div><div class="pr-val" style="color:var(--shopy-c)">Sony WH-CH720N · Out for delivery</div></div>
          <div class="preview-row"><div class="pr-label">Savings this month</div><div class="pr-val" style="color:var(--shopy-c)">$64 saved vs. retail</div></div>
        </div>
      </div>
    </div>
    <div class="modal-dots">
      <div class="modal-dot" onclick="switchModal('rocky')"></div>
      <div class="modal-dot" onclick="switchModal('finy')"></div>
      <div class="modal-dot active" onclick="switchModal('shopy')"></div>
      <div class="modal-dot" onclick="switchModal('estate')"></div>
    </div>
  </div>
</div>

<div class="modal-overlay modal-estate" id="modal-estate" role="dialog" aria-modal="true" aria-label="Estate3D product details">
  <div class="modal-panel glass card-estate">
    <button class="modal-close" onclick="closeModal()" aria-label="Close">✕</button>
    <div class="modal-body">
      <div class="modal-info">
        <span class="product-num">04 / 04</span>
        <div class="product-name" style="color:var(--estate-c)">Estate3D</div>
        <div class="product-subtitle">Immersive Property Platform</div>
        <div class="modal-divider"></div>
        <p class="product-desc">Sellers scan their property with a phone — Estate3D converts the footage into a photorealistic Gaussian Splat buyers can walk through from anywhere in the world.</p>
        <div class="product-features">
          <div class="feat">Phone-camera 3D capture</div>
          <div class="feat">Gaussian Splat rendering engine</div>
          <div class="feat">AI-powered valuation</div>
          <div class="feat">Apartments, villas & commercial</div>
        </div>
        <button class="btn-primary modal-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'});closeModal()">Join Waitlist</button>
      </div>
      <div class="modal-preview">
        <div class="preview-chrome"><span></span><span></span><span></span><div class="preview-title" style="color:var(--estate-c)">Estate3D — Listings</div></div>
        <div class="preview-body">
          <div class="preview-row"><div class="pr-label">Featured property</div><div class="pr-val" style="color:var(--estate-c)">3-bed Villa, Dubai Marina · $1.2M</div></div>
          <div class="preview-row"><div class="pr-label">3D tour status</div><div class="pr-val" style="color:var(--estate-c)">Ready to view ● Live</div></div>
          <div class="preview-cmd"><div class="pc-in">AI Valuation</div><div class="pc-out">→ Estimated market value: $1.18M–$1.24M (confidence: 94%)</div></div>
        </div>
      </div>
    </div>
    <div class="modal-dots">
      <div class="modal-dot" onclick="switchModal('rocky')"></div>
      <div class="modal-dot" onclick="switchModal('finy')"></div>
      <div class="modal-dot" onclick="switchModal('shopy')"></div>
      <div class="modal-dot active" onclick="switchModal('estate')"></div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Add modal JS to `js/main.js`**

Append to the end of `js/main.js`:
```js
/* Modals */
let activeModal = null;

function openModal(id) {
  if (activeModal) closeModal(false);
  const el = document.getElementById('modal-' + id);
  if (!el) return;
  activeModal = el;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(restoreScroll = true) {
  if (!activeModal) return;
  activeModal.classList.remove('open');
  activeModal = null;
  if (restoreScroll) document.body.style.overflow = '';
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
```

- [ ] **Step 5: Verify in browser**

Open `index.html`. Confirm:
- Clicking Rocky card opens the Rocky modal with purple accent
- Clicking Finy card opens Finy modal with green accent
- Clicking Shopy card opens Shopy modal with orange accent
- Clicking Estate3D card opens Estate3D modal with blue accent
- Each modal shows two columns: info left, mock UI preview right
- `✕` button closes the modal
- Clicking outside the panel closes the modal
- Pressing `Escape` closes the modal
- Nav dots at the bottom switch between modals
- "Join Waitlist" scrolls to the CTA section and closes the modal
- On mobile (< 640px), the preview panel hides and it's single column

- [ ] **Step 6: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: product modals with rich detail panel and nav dots"
```

---

## Task 6: Working Waitlist Form

**Files:**
- Modify: `index.html` — add success message markup, wire form IDs
- Modify: `css/style.css` — shake, success state styles
- Modify: `js/main.js` — form submit handler

- [ ] **Step 1: Add IDs to the form elements in `index.html`**

Find the CTA form in the `#contact` section:
```html
<div class="cta-form">
  <input type="email" placeholder="your@email.com" autocomplete="email">
  <button type="button">Get Access</button>
</div>
```

Replace with:
```html
<div class="cta-form" id="cta-form">
  <input id="cta-email" type="email" placeholder="your@email.com" autocomplete="email">
  <button id="cta-submit" type="button" onclick="submitWaitlist()">Get Access</button>
</div>
<div class="form-success" id="form-success">
  <div class="success-icon">✓</div>
  <p>You're on the list.</p>
  <span>We'll be in touch when early access opens.</span>
</div>
```

- [ ] **Step 2: Add form styles to `css/style.css`**

Append:
```css
/* WAITLIST FORM */
@keyframes shake{
  0%,100%{transform:translateX(0);}
  20%{transform:translateX(-8px);}
  40%{transform:translateX(8px);}
  60%{transform:translateX(-5px);}
  80%{transform:translateX(5px);}
}
.cta-form input.invalid{
  border-color:rgba(239,68,68,.6)!important;
  animation:shake .5s ease;
}
.form-success{
  display:none;flex-direction:column;align-items:center;gap:10px;
  opacity:0;transform:translateY(10px);
  transition:opacity .4s,transform .4s;
}
.form-success.visible{display:flex;opacity:1;transform:translateY(0);}
.success-icon{
  width:52px;height:52px;border-radius:50%;
  border:2px solid var(--purple-hi);
  display:flex;align-items:center;justify-content:center;
  font-size:1.4rem;color:var(--purple-hi);
  box-shadow:0 0 28px rgba(192,132,252,.4);
  animation:blink 2s ease-in-out infinite;
}
.form-success p{font-family:var(--font-brand);font-size:clamp(1rem,1.8vw,1.3rem);color:var(--white);letter-spacing:.06em;}
.form-success span{font-size:clamp(.78rem,1.2vw,.9rem);color:var(--muted);}
```

- [ ] **Step 3: Add form submit JS to `js/main.js`**

Append:
```js
/* Waitlist form */
function submitWaitlist() {
  const input  = document.getElementById('cta-email');
  const form   = document.getElementById('cta-form');
  const success = document.getElementById('form-success');
  const email  = input.value.trim();
  const valid  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!valid) {
    input.classList.remove('invalid');
    void input.offsetWidth; // force reflow to re-trigger animation
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
```

- [ ] **Step 4: Verify in browser**

Open `index.html`. Scroll to the "Early Access" section. Confirm:
- Clicking "Get Access" with an empty field shakes the input
- Clicking "Get Access" with `not-an-email` shakes the input
- Clicking "Get Access" with `test@example.com` fades out the form
- The success message fades in with `✓ You're on the list.`
- The checkmark glows purple

- [ ] **Step 5: Commit**

```bash
git add index.html css/style.css js/main.js
git commit -m "feat: working waitlist form with validation and success state"
```

---

## Task 7: Deploy to Netlify + www.anton-io.com

**Files:**
- No code changes — this is infrastructure setup

- [ ] **Step 1: Create GitHub repo**

Go to https://github.com/new and create a repo named `anton-io-website`. Set it to **Private** (recommended). Do not initialize with README.

- [ ] **Step 2: Push to GitHub**

```bash
cd "K:/Projects/Anton"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/anton-io-website.git
git branch -M main
git push -u origin main
```

Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username.

- [ ] **Step 3: Connect Netlify**

1. Go to https://app.netlify.com → "Add new site" → "Import an existing project"
2. Choose GitHub → authorize → select `anton-io-website`
3. Build settings: leave **Build command** empty, set **Publish directory** to `.` (root)
4. Click "Deploy site"
5. Wait ~30 seconds for first deploy to complete

- [ ] **Step 4: Add custom domain in Netlify**

1. In Netlify dashboard → your site → "Domain management" → "Add a domain"
2. Enter `www.anton-io.com` → "Verify" → "Add domain"
3. Netlify will show you a CNAME record to add

- [ ] **Step 5: Update DNS at your domain registrar**

At wherever `anton-io.com` is registered (GoDaddy, Namecheap, Cloudflare, etc.):
- Add a **CNAME** record: Name = `www`, Value = `<your-netlify-site>.netlify.app`
- Add an **A** record (or ALIAS/ANAME) for the apex (`@`): Value = Netlify's load balancer IP (shown in Netlify domain settings)

DNS propagation typically takes 5–30 minutes.

- [ ] **Step 6: Enable HTTPS**

In Netlify → Domain management → HTTPS → "Verify DNS configuration" → "Provision certificate". This is automatic once DNS resolves.

- [ ] **Step 7: Verify live site**

Open `https://www.anton-io.com` in a browser. Confirm:
- Site loads correctly with HTTPS padlock
- All fonts, animations, modals, and form work identically to local
- `http://anton-io.com` redirects to `https://www.anton-io.com`
- No mixed-content warnings in DevTools console

---

## Self-Review: Spec Coverage

| Spec section | Covered by task |
|---|---|
| File structure split | Task 1 |
| Navbar non-fixed | Task 2 |
| Scroll-to-top button | Task 2 |
| Parallax effects (hero title, subtitle, badge, bg-grid) | Task 3 |
| Product card hover scale | Task 4 |
| Icon glow per card | Task 4 |
| Nav letter-spacing hover | Task 4 |
| CTA button shimmer | Task 4 |
| Stats count-up | Task 4 |
| Modal entry animation | Task 5 (CSS) |
| 4 product modals (Rocky, Finy, Shopy, Estate3D) | Task 5 |
| Modal Rich Detail Panel (two-column) | Task 5 |
| Modal UI preview per product | Task 5 |
| Modal dismiss (✕, backdrop, Escape) | Task 5 |
| Modal nav dots / switching | Task 5 |
| Waitlist form validation | Task 6 |
| Waitlist shake animation | Task 6 |
| Waitlist success state | Task 6 |
| Deployment to Netlify + www.anton-io.com | Task 7 |
| Purple palette unchanged | Constraint — no palette changes in any task |
| Logo unchanged | Constraint — logo markup not touched |
