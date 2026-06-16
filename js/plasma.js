(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  // ── Constants ──
  const NODE_COUNT = 120;
  const CONN_DIST  = 0.30;
  const FOV        = 1.8;

  // ── Nodes ──
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x:  (Math.random() - 0.5) * 2.4,
    y:  (Math.random() - 0.5) * 1.8,
    z:  Math.random() * 2.2 - 0.6,
    vx: (Math.random() - 0.5) * 0.0007,
    vy: (Math.random() - 0.5) * 0.0005,
    vz: (Math.random() - 0.5) * 0.0004,
    bright: 0,
    phase:  Math.random() * Math.PI * 2
  }));

  // ── Edges ──
  const edges = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dz = nodes[i].z - nodes[j].z;
      const d  = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (d < CONN_DIST) edges.push({ i, j, d });
    }
  }

  // ── Pulses ──
  const pulses = [];

  // ── Perspective projection ──
  // Returns screen-space {sx, sy} and depth 0..1 (0=far, 1=close)
  function project(n) {
    const scale = FOV / (FOV + n.z + 1.2);
    return {
      sx:    W / 2 + n.x * scale * W * 0.44,
      sy:    H / 2 + n.y * scale * H * 0.50,
      depth: (n.z + 0.6) / 2.2
    };
  }

  // ── Radial center falloff ──
  // Returns 0 at center (text zone), 1 at edges — smooth elliptical gradient
  function centerFalloff(sx, sy) {
    const dx = (sx - W / 2) / (W * 0.38);
    const dy = (sy - H / 2) / (H * 0.32);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const inner = 0.55, outer = 1.1;
    const t = Math.max(0, Math.min(1, (dist - inner) / (outer - inner)));
    return t * t * (3 - 2 * t); // smoothstep
  }

  // ── Theme ──
  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  // ── Draw edges ──
  function drawEdges(proj) {
    edges
      .slice()
      .sort((a, b) => {
        const da = (proj[a.i].depth + proj[a.j].depth) / 2;
        const db = (proj[b.i].depth + proj[b.j].depth) / 2;
        return da - db;
      })
      .forEach(e => {
        const a = proj[e.i], b = proj[e.j];
        const avgDepth = (a.depth + b.depth) / 2;
        const midFalloff = centerFalloff((a.sx + b.sx) / 2, (a.sy + b.sy) / 2);
        const baseAlpha = isDark()
          ? 0.18 + avgDepth * 0.55
          : 0.45 + avgDepth * 0.55;
        const alpha = midFalloff * baseAlpha * (0.4 + 0.6 * (1 - e.d / CONN_DIST));
        if (alpha < 0.008) return;

        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.strokeStyle = isDark()
          ? `rgba(255,255,255,${alpha})`
          : `rgba(0,0,0,${alpha})`;
        ctx.lineWidth = avgDepth * 1.2 + 0.4;
        ctx.stroke();
      });
  }

  // ── Draw nodes ──
  function drawNodes(proj) {
    nodes
      .map((n, i) => ({ n, i, p: proj[i] }))
      .sort((a, b) => a.p.depth - b.p.depth)
      .forEach(({ n, p }) => {
        const falloff = centerFalloff(p.sx, p.sy);
        if (falloff < 0.02) return;

        const baseAlpha = isDark()
          ? 0.45 + p.depth * 0.55
          : 0.65 + p.depth * 0.35;
        const alpha = Math.min(1, (baseAlpha + n.bright * 0.5) * falloff);
        const size  = (p.depth * 10.0 + 3.0) * (0.2 + falloff * 0.8);

        // Glow halo when activated
        if (n.bright > 0.05) {
          const glowRGB = isDark() ? '220,230,255' : '0,0,0';
          const gr = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, size * 5);
          gr.addColorStop(0, `rgba(${glowRGB},${n.bright * p.depth * falloff * (isDark() ? 0.45 : 0.20)})`);
          gr.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, size * 5, 0, Math.PI * 2);
          ctx.fillStyle = gr;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fillStyle = isDark()
          ? `rgba(255,255,255,${alpha})`
          : `rgba(0,0,0,${alpha})`;
        ctx.fill();
      });
  }

  // ── Fire a pulse along a random edge ──
  function firePulse(fromNodeIndex) {
    const myEdges = edges.filter(e => e.i === fromNodeIndex || e.j === fromNodeIndex);
    if (!myEdges.length) return;
    myEdges
      .sort(() => Math.random() - 0.5)
      .slice(0, 2 + Math.floor(Math.random() * 2))
      .forEach(e => {
        pulses.push({
          from:  e.i === fromNodeIndex ? e.i : e.j,
          to:    e.i === fromNodeIndex ? e.j : e.i,
          prog:  0,
          speed: 0.016 + Math.random() * 0.018
        });
      });
  }

  // ── Draw in-flight pulses ──
  function drawPulses(proj) {
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.prog = Math.min(1, p.prog + p.speed);

      const a  = proj[p.from], b = proj[p.to];
      const px = a.sx + (b.sx - a.sx) * p.prog;
      const py = a.sy + (b.sy - a.sy) * p.prog;
      const pd = a.depth + (b.depth - a.depth) * p.prog;
      const fo = centerFalloff(px, py);
      const ps = (pd * 4.5 + 1.5) * Math.max(0.3, fo);

      if (fo > 0.05) {
        const glowRGB = isDark() ? '220,230,255' : '0,0,0';
        const g = ctx.createRadialGradient(px, py, 0, px, py, ps * 5);
        g.addColorStop(0, `rgba(${glowRGB},${pd * fo * (isDark() ? 0.45 : 0.22)})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(px, py, ps * 5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();

        ctx.beginPath(); ctx.arc(px, py, ps, 0, Math.PI * 2);
        ctx.fillStyle = isDark()
          ? `rgba(255,255,255,${Math.min(1, pd * 0.9 + 0.1)})`
          : `rgba(0,0,0,${Math.min(1, pd * 0.9 + 0.1)})`;
        ctx.fill();
      }

      if (p.prog >= 1) {
        nodes[p.to].bright = Math.min(1, nodes[p.to].bright + 0.8);
        pulses.splice(i, 1);
      }
    }
  }

  // ── Resize ──
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Mouse: trigger pulses from nearest node ──
  let mouseX = -9999, mouseY = -9999, lastMouseTrigger = 0, elapsed = 0;

  const heroEl = document.getElementById('hero');
  if (heroEl) {
    heroEl.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }, { passive: true });
    heroEl.addEventListener('mouseleave', () => {
      mouseX = -9999; mouseY = -9999;
    }, { passive: true });
  }

  // ── Pause when hero is off-screen ──
  let visible = true;
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
  }, { threshold: 0 }).observe(canvas);

  // ── Animation loop ──
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;

    elapsed += 0.012;
    ctx.clearRect(0, 0, W, H);

    // Drift nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
      if (Math.abs(n.x) > 1.3) n.vx *= -1;
      if (Math.abs(n.y) > 0.9) n.vy *= -1;
      if (n.z < -0.6 || n.z > 1.6) n.vz *= -1;
      n.bright = Math.max(0, n.bright - 0.015);
    });

    // Ambient pulses
    if (Math.random() < 0.05) {
      firePulse(Math.floor(Math.random() * NODE_COUNT));
    }

    const proj = nodes.map(project);

    // Mouse-triggered pulses (throttled to 0.35s)
    if (mouseX !== -9999 && elapsed - lastMouseTrigger > 0.35) {
      let best = -1, bestD = Infinity;
      proj.forEach((p, i) => {
        const dx = p.sx - mouseX, dy = p.sy - mouseY;
        const d  = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; best = i; }
      });
      if (best >= 0 && Math.sqrt(bestD) < 80) {
        firePulse(best);
        nodes[best].bright = 1;
        lastMouseTrigger = elapsed;
      }
    }

    drawEdges(proj);
    drawPulses(proj);
    drawNodes(proj);
  })();
})();
