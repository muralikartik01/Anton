# Neural Network Hero Animation — Design Spec

**Date:** 2026-06-11
**Replaces:** `js/plasma.js` (plasma sun animation)

---

## Overview

Replace the existing plasma-sphere hero animation with a 3D depth-field neural network that simulates a model processing a request. Nodes and edges fill the edges and corners of the hero canvas while a smooth radial falloff keeps the center clear for the headline text. The animation is fully monochrome and adapts to both dark and light themes.

---

## Visual Design

### Layout
- **120 nodes** scattered in 3D space (`x ∈ [-1.2, 1.2]`, `y ∈ [-0.9, 0.9]`, `z ∈ [-0.6, 1.6]`)
- Rendered via simple perspective projection (`fov = 1.8`) on a Canvas 2D context — no Three.js scene graph needed
- A **smooth elliptical radial falloff** (`smoothstep` from inner radius 0.55 → outer 1.1 in normalized coordinates) scales node size and opacity to zero at center and full at edges
- Edges wider than `0.30` (normalized 3D distance) are not connected

### Node Sizing
- Size formula: `(depth * 6.0 + 1.5) * (0.4 + falloff * 0.6)`
- Far nodes (low depth): small and faint — creates natural depth-of-field feel
- Close nodes (high depth): large and bright
- All nodes additionally scaled by the center falloff — nodes near the text area shrink to nothing

### Color — Monochrome, theme-aware
| | Node RGB | Glow RGB |
|---|---|---|
| **Dark mode** | `255, 255, 255` | `220, 230, 255` |
| **Light mode** | `15, 15, 15` | `10, 10, 40` |

Edge opacity in dark: `0.08 + depth * 0.30`
Edge opacity in light: `0.12 + depth * 0.34`
Both multiplied by the center falloff and distance factor.

---

## Animation Behaviour

### Ambient drift
Each node drifts slowly in 3D space with a tiny velocity vector (`vx`, `vy`, `vz`). Velocity reverses when the node hits its bounding box. This keeps the network alive without any abrupt jumps.

### Pulse signals
- Every frame, a ~5% chance fires a new pulse along a random edge
- A pulse travels from one node to the other over ~0.6–0.9s
- On arrival, the destination node's `bright` value spikes to `0.8`, then decays at `0.015/frame`
- Bright nodes emit a soft radial glow
- Pulses respect the center falloff — they fade and shrink when crossing the clear zone

### Mouse interaction
- On `mousemove` over the hero, find the nearest projected node within 80px
- Throttled to one trigger per 0.35s of elapsed time
- Fires 2–4 pulses outward from that node and spikes its brightness

### Performance
- `IntersectionObserver` pauses the animation loop when the hero is off-screen (same pattern as existing `plasma.js`)
- `requestAnimationFrame` loop — no fixed timestep needed at this fidelity
- Node count (120) and edge count (~300–500 depending on random layout) are well within 60fps budget

---

## Implementation

### File changes
| File | Change |
|---|---|
| `js/plasma.js` | Full replacement — new neural network renderer |
| `index.html` | No structural changes needed; `#hero-canvas` and Three.js CDN script tag remain |
| `css/style.css` | No changes needed |

### Architecture
`plasma.js` is a self-contained IIFE. The replacement follows the same pattern:

```
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // 1. Build nodes array (120 nodes, random 3D positions + velocities)
  // 2. Build edges array (connect nodes within CONN_DIST = 0.30)
  // 3. project(node, W, H) → { sx, sy, depth }
  // 4. centerFalloff(sx, sy, W, H) → 0..1 smoothstep
  // 5. Animation loop:
  //    a. Drift nodes
  //    b. Fire ambient pulses (5% chance/frame)
  //    c. Handle mouse trigger (throttled)
  //    d. Draw edges (sorted back→front, alpha * falloff)
  //    e. Draw pulse dots
  //    f. Draw nodes (sorted back→front, size + alpha * falloff)
  // 6. Resize handler
  // 7. IntersectionObserver pause
  // 8. mousemove listener on hero section
})();
```

### Theme detection
Read `document.documentElement.getAttribute('data-theme')` each frame to determine dark vs light. This makes the animation react instantly when the user toggles the theme toggle (no reload needed).

---

## Out of Scope
- No Three.js scene graph — raw Canvas 2D with manual perspective math is sufficient and avoids the Three.js setup overhead for this use case
- No post-processing / bloom pass
- No mobile gyroscope interaction
- No sound
