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

  // ── Resize ──
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Stub loop (will be filled in later tasks) ──
  (function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);
  })();
})();
