// Snowy Winter theme: activation + snowfall.
// Auto-on from 1 Dec to 6 Jan. Override via URL: ?theme=winter (force on) or ?theme=off.
// No cookies / localStorage on purpose (DSGVO-friendly).
(function () {
  const params = new URLSearchParams(location.search);
  const force = params.get('theme');
  const now = new Date();
  const m = now.getMonth(), d = now.getDate();           // m: 0 = Jan
  const inSeason = m === 11 || (m === 0 && d <= 6);

  const active = force === 'winter' || (force !== 'off' && inSeason);
  if (!active) return;

  document.documentElement.setAttribute('data-theme', 'winter');
  const tc = document.querySelector('meta[name="theme-color"]');
  if (tc) tc.setAttribute('content', '#f3f7fb');

  // Respect reduced-motion: keep the colours, skip the snowfall.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'winter-snow';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let w, h, flakes = [], raf = null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.round(Math.min(140, Math.max(40, (w * h) / 14000)));
    while (flakes.length < target) flakes.push(makeFlake(true));
    flakes.length = Math.min(flakes.length, target);
  }

  function makeFlake(randomY) {
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -10,
      r: 1 + Math.random() * 2.6,
      vy: 0.35 + Math.random() * 0.9,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.004 + Math.random() * 0.012,
      drift: 0.15 + Math.random() * 0.35,
      a: 0.45 + Math.random() * 0.45
    };
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const f of flakes) {
      f.sway += f.swaySpeed;
      f.y += f.vy;
      f.x += Math.sin(f.sway) * f.drift;
      if (f.y > h + 10) Object.assign(f, makeFlake(false), { x: Math.random() * w });
      if (f.x < -10) f.x = w + 10; else if (f.x > w + 10) f.x = -10;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,' + f.a + ')';
      ctx.shadowColor = 'rgba(120,160,200,.55)';
      ctx.shadowBlur = 3;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) raf = requestAnimationFrame(tick);
  });
  window.addEventListener('resize', resize, { passive: true });

  resize();
  raf = requestAnimationFrame(tick);
})();
