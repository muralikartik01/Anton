# Anton.io Website Enhancement — Design Spec
**Date:** 2026-05-30  
**Project:** K:\Projects\Anton  
**Status:** Approved

---

## Overview

Enhance the existing `anton-io-v4.html` single-page marketing site for ANTON.IO. The work covers five areas: file structure reorganisation for deployment, navbar redesign, parallax scroll effects, animation enhancements, product modals, and a working waitlist form. The site deploys to `www.anton-io.com` via Netlify.

**Constraints:**
- Purple color palette is unchanged
- Logo is unchanged
- No backend required
- No build tools (pure HTML/CSS/JS)

---

## 1. File Structure

Rename and split the monolithic HTML file into a clean static-site structure:

```
K:\Projects\Anton\
├── index.html          ← was anton-io-v4.html (markup only)
├── css/
│   └── style.css       ← all <style> content extracted here
├── js/
│   └── main.js         ← all <script> content extracted here
└── netlify.toml        ← minimal Netlify config
```

`netlify.toml` content:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Deployment:** Push to GitHub → connect Netlify → point DNS of `www.anton-io.com` to Netlify. Automatic HTTPS via Let's Encrypt. Apex domain (`anton-io.com`) auto-redirects to `www`.

---

## 2. Navbar — Remove Fixed Positioning

**Current:** `position: fixed` with `nav.scrolled` scroll-triggered class.  
**New:** `position: relative` (static flow). The navbar scrolls away with the page.

Changes:
- Remove `position: fixed; top: 0; left: 0; right: 0; z-index: 500` from `nav`
- Remove `nav.scrolled` CSS rule
- Remove the `window.addEventListener('scroll', ...)` nav scroll handler from `main.js`
- Remove `padding-top` compensation on `.hero` that accounted for fixed nav height

**Floating scroll-to-top button:** A small `↑` button appears in the bottom-right corner after the user scrolls 300px. Clicking it smoothly scrolls to `#hero`.

```
Style: 44×44px circle, glass background, purple border, purple ↑ arrow
Position: fixed bottom-right, z-index 400
Visibility: opacity 0 + pointer-events none below 300px scroll; fades in above
```

**Z-index hierarchy:** scroll-to-top (400) < modal overlay (600) < cursor (9998/9999).

---

## 3. Parallax Scroll Effects

All parallax uses `requestAnimationFrame` / passive scroll listeners. `prefers-reduced-motion` disables all parallax. Existing hero-A parallax is kept and enhanced.

| Element | Effect | Speed multiplier |
|---|---|---|
| `.hero-a` (giant A) | Translates down on scroll (existing, keep) | `scrollY * 0.3` |
| `.hero-title` | Translates up slightly | `scrollY * -0.12` |
| `.hero-sub` | Translates up slightly slower | `scrollY * -0.07` |
| `.hero-badge` | Translates up very subtly | `scrollY * -0.05` |
| `.bg-grid` | Shifts via `background-position-y` (it's `position:fixed`, can't use transform) | `scrollY * 0.08` |
| `.stats-bar` | Translates up on scroll into view | `scrollY * -0.04` |

Implementation: Single `scroll` listener on `window` updates a `--scroll-y` CSS variable OR directly sets `transform` via JS for the above elements. Direct JS `transform` is preferred for performance.

---

## 4. Animation Enhancements

All new animations respect `prefers-reduced-motion`. No changes to existing color palette or logo.

### 4a. Product Card Hover
- Add `transform: scale(1.01)` on `.product-card:hover` (currently missing)
- Icon: on card hover, add `filter: drop-shadow(0 0 8px var(--rocky-c))` etc. per-card-class (`.card-rocky:hover .product-icon`, `.card-finy:hover .product-icon`, etc.)

### 4b. Nav Link Hover
- Add `letter-spacing` transition: `0.14em` → `0.18em` on hover (smooth, 0.2s ease)

### 4c. Stats Count-Up
- When `.stats-bar` enters the viewport (IntersectionObserver), animate each `.stat-num` from `0` to its target value over 1.2s using `requestAnimationFrame`
- Values: parse the existing text content (e.g. "4+", "10K+", "99.9%") — animate the numeric part, keep the suffix static

### 4d. CTA Button Shimmer
- On `.btn-primary:hover`, a white shimmer sweep passes left-to-right across the button gradient
- Implemented as a `::after` pseudo-element with `background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` animated via `@keyframes shimmer`

### 4e. Modal Entry Animation
- Backdrop: `opacity: 0 → 1`, `backdrop-filter: blur(0) → blur(16px)` over 300ms
- Modal panel: `transform: translateY(40px) → translateY(0)` + `opacity: 0 → 1` over 300ms ease-out

---

## 5. Product Modals

Each product card becomes clickable and opens a full-screen modal overlay.

### Trigger
- Add `onclick="openModal('rocky')"` (etc.) to each `.product-card`
- Cursor changes to `pointer` on card hover (add to cursor enlargement list)

### Modal Structure (one per product, hidden by default)

```html
<div class="modal-overlay" id="modal-rocky" aria-modal="true" role="dialog">
  <div class="modal-panel glass">
    <button class="modal-close" onclick="closeModal('rocky')">✕</button>
    <div class="modal-body">
      <!-- LEFT col -->
      <div class="modal-info">
        <span class="product-num">01 / 04</span>
        <div class="product-name card-rocky">Rocky</div>
        <div class="product-subtitle">Personalized AI Assistant</div>
        <div class="modal-divider"></div>
        <p class="product-desc">...</p>
        <div class="product-features">...</div>
        <button class="btn-primary modal-cta">Join Waitlist</button>
      </div>
      <!-- RIGHT col -->
      <div class="modal-preview card-rocky">
        <!-- Mock UI dashboard for Rocky -->
      </div>
    </div>
    <!-- Bottom nav dots -->
    <div class="modal-dots">
      <span class="dot active" onclick="switchModal('rocky')"></span>
      <span class="dot" onclick="switchModal('finy')"></span>
      <span class="dot" onclick="switchModal('shopy')"></span>
      <span class="dot" onclick="switchModal('estate')"></span>
    </div>
  </div>
</div>
```

### Modal UI Preview Panels
Each product's right panel shows a simple mock dashboard using the product's accent color:
- **Rocky**: Good morning greeting + task count + recent command/response
- **Finy**: Balance overview + recent transactions + anomaly alert
- **Shopy**: Recent purchase + price comparison + delivery status
- **Estate**: Property listing card + AI recommendation chip

### Dismiss
- Click the `✕` button
- Click the overlay backdrop outside the panel
- Press `Escape` key

### Switching Products
- Bottom nav dots allow switching between product modals without closing
- Active dot matches current product's accent color

---

## 6. Waitlist Form

The existing CTA email input (`#contact` section) gets fully wired.

### States

| State | UI |
|---|---|
| **Default** | Input + "Get Access" button as-is |
| **Invalid** | Input shakes (CSS keyframe `@keyframes shake`), red border flash for 600ms |
| **Success** | Input + button fade out (opacity 0, height collapses) → success message fades in |

No loading state needed — there is no async operation (pure frontend).

### Success Message
```html
<div class="form-success">
  <div class="success-icon">✓</div>
  <p>You're on the list.</p>
  <span>We'll be in touch when early access opens.</span>
</div>
```
Styled with purple glow on the checkmark icon. No backend call — state is purely local.

### Validation
- Must be non-empty
- Must match basic email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

---

## 7. Deployment Checklist

1. Split HTML into `index.html` + `css/style.css` + `js/main.js`
2. Add `netlify.toml`
3. Initialize git repo in `K:\Projects\Anton`
4. Push to GitHub (new repo: `anton-io-website`)
5. Connect repo to Netlify (new site from Git)
6. In Netlify: Domain settings → add custom domain `www.anton-io.com`
7. At domain registrar: update DNS CNAME for `www` → Netlify's assigned subdomain
8. Wait for HTTPS certificate provisioning (~1 min)
9. Verify `https://www.anton-io.com` loads correctly

---

## Out of Scope

- Color palette changes
- Logo changes
- Backend / database
- New pages (multi-page routing)
- Blog, team, pricing, or testimonial sections
- Any build tooling (Vite, webpack, etc.)
