---
name: anton-io-redesign
description: Full redesign of ANTON.IO landing page — dark minimal, plasma sun hero, System UI typography, light/dark mode
metadata:
  type: project
---

# ANTON.IO Landing Page Redesign

## Design System

### Colors
| Token | Dark Mode | Light Mode |
|---|---|---|
| `--bg` | `#0a0a0a` | `#f5f5f5` |
| `--surface` | `#111111` | `#ebebeb` |
| `--border` | `#1c1c1c` | `#e0e0e0` |
| `--text` | `#ffffff` | `#0a0a0a` |
| `--text-2` | `#888888` | `#666666` |
| `--text-3` | `#3a3a3a` | `#b0b0b0` |

### Typography
- **Body / UI:** System UI (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- **Logo:** Outfit Light (Google Fonts), 38px, letter-spacing 0.18em, uppercase
- **Hero headline:** System UI, 700 weight, clamp(28px → 68px), letter-spacing -1px
- **Section titles:** System UI, 600 weight, clamp(24px → 42px), letter-spacing -1.2px

### Motion Principles
- One signature moment: hero headline scales in from 0.82 → 1.0 on load
- All other sections: fade + translateY(28px) → 0 on scroll entry via IntersectionObserver
- Product cards: stagger-reveal, 85ms delay between each
- No decorative motion anywhere else

---

## Logo
- **Wordmark:** `/NTONIO` (Outfit Light, wide tracking) — the `/` stylises the A
- **Scroll state:** collapses to `/O` — `NTONI` fades out via max-width transition
- **Color:** `var(--text)` — white in dark mode, black in light mode

---

## Navigation
- **Default:** fixed, full-width, transparent, 88px tall
- **Scrolled:** floats — shrinks to 60px, insets 24px left/right, border-radius 20px, `rgba(12,12,12,0.35)` frosted glass, `backdrop-filter: blur(20px)`
- **Layout:** logo left | nav links + theme toggle right (grouped)
- **Theme toggle:** circular 36px button — sun SVG in dark mode, moon SVG in light mode

---

## Hero Section
- **Background:** Three.js plasma sun (WebGL) — `SphereGeometry(1.0, 256, 256)` with custom GLSL shader
  - Vertex: multi-octave simplex noise displacement (3 octaves: 2.2, 4.8, 9.5 frequency)
  - Fragment: boiling surface texture + Fresnel rim light (pow factor 2.8)
  - No corona layers
  - Slow Y-axis rotation + smooth mouse parallax (lerp factor 0.04)
- **Canvas mask:** `radial-gradient` vignette so text stays readable
- **Headline:** "REDEFINING POSSIBILITIES" in black (`#0a0a0a`) over the bright plasma
- **Sub-text:** spec-driven AI-native description, dark on bright
- **Buttons:** pill-shaped (border-radius 100px) — black fill + dark ghost outline
- **Light mode:** canvas gets `filter: invert(1)` making sun dark on light background

---

## Sections (below hero)

### Tagline Strip
Single row: `Redesigning Possibilities · Spec-Driven Development · Autonomous AI Products · Hyper-Individualized Solutions`

### Products — 3×2 Grid
Six products, bordered grid, stagger-reveal on scroll:
1. Rocky — AI Assistant
2. Finvy — Finance AI
3. Shopy — Commerce AI
4. Estate3D — Property AI
5. KissAI — Autonomous AI
6. Academy — Courses & Bootcamps (GenAI & Agentic AI · Soft Skills · NLP)

Each card: hover → `#0f0f0f` bg, arrow slides right

### About — 2-Column Split
Left: heading + short descriptor. Right: 3 paragraphs of real copy covering spec-driven development, AI-native model, hyper-individualized software philosophy.

### How We Operate — 4-Column Steps
01 Design → 02 Build → 03 Ship → 04 Iterate. Stagger-reveal.

### CTA — Centered
"Join the waitlist." headline + email input + pill-shaped submit button in a rounded form container.

### Footer
Single line: copyright left, Privacy / Terms / Contact links right.

---

## Light / Dark Mode
- Toggle in nav (sun ↔ moon icon)
- All colors via CSS custom properties on `:root` / `[data-theme="light"]`
- Canvas inverted via JS `filter: invert(1)` on theme switch
- Logo color via `var(--text)` — adapts automatically

---

## What Was Removed (vs current index.html)
- Custom cursor ring (`#cur`, `#cur-ring`)
- Floating particle divs
- Carbon grid / bg-grid background layers
- Teko / Rajdhani / Exo 2 font imports
- Heavy count-up stats animations
- All decorative motion except the hero signature + scroll reveals
