// ── STATIC STARFIELD ──
// Draws a static (non-animated) star field into #hero-canvas.
// Redraws on resize and on theme change.
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function isLight() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const baseColor = isLight() ? '10,10,11' : '255,255,255';
    const count = Math.floor((W * H) / 6500);

    for (let i = 0; i < count; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const cx = W / 2, cy = H / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const distFalloff = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 1.2);

      const r = Math.random() < 0.93 ? Math.random() * 0.8 + 0.3 : Math.random() * 1.4 + 0.9;
      const baseAlpha = (isLight() ? 0.22 : 0.55) * (0.35 + 0.65 * Math.random()) * (0.4 + 0.6 * distFalloff);

      // Soft glow for the brighter ~7% of stars
      if (r > 1) {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
        grad.addColorStop(0, `rgba(${baseColor},${baseAlpha * 0.6})`);
        grad.addColorStop(1, `rgba(${baseColor},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = `rgba(${baseColor},${baseAlpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  draw();
  window.addEventListener('resize', draw);

  // Redraw whenever the theme toggle flips data-theme
  new MutationObserver(draw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
