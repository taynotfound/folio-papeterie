// Winter theme: activation, fairy-light garland, fine snowfall.
// Season: 29 Oct – 6 Jan. Override via URL: ?theme=winter (force on) or ?theme=off.
// No cookies / localStorage on purpose (DSGVO-friendly).
(function () {
  const SEASON_START = { month: 9, day: 29 };            // month: 0 = Jan → 29 Oct
  const SEASON_END   = { month: 0, day: 6 };             // 6 Jan

  const params = new URLSearchParams(location.search);
  const force = params.get('theme');
  const now = new Date();
  const m = now.getMonth(), d = now.getDate();
  const inSeason =
    m === 10 || m === 11 ||
    (m === SEASON_START.month && d >= SEASON_START.day) ||
    (m === SEASON_END.month && d <= SEASON_END.day);

  const active = force === 'winter' || (force !== 'off' && inSeason);
  if (!active) return;

  document.documentElement.setAttribute('data-theme', 'winter');
  const tc = document.querySelector('meta[name="theme-color"]');
  if (tc) tc.setAttribute('content', '#f4f1ea');

  // ── Fairy-light garland under the nav: warm white + champagne only ─────────
  const TONES = ['#f6dfa6', '#ffffff', '#e9c981', '#fff3d1'];
  function buildGarland() {
    const old = document.getElementById('winter-lights');
    if (old) old.remove();
    const nav = document.getElementById('nav');
    const g = document.createElement('div');
    g.id = 'winter-lights';
    g.setAttribute('aria-hidden', 'true');
    if (!nav) g.classList.add('is-fixed');          // legal pages have no nav

    const W = window.innerWidth;
    const S = W < 600 ? 54 : 74;                    // width of one swag
    const sag = 12;
    const n = Math.ceil(W / S) + 1;

    let path = 'M0,0';
    for (let i = 0; i < n; i++) path += ' Q' + (i * S + S / 2) + ',' + (sag * 2) + ' ' + ((i + 1) * S) + ',0';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', path);
    svg.appendChild(p);
    g.appendChild(svg);

    for (let i = 0; i < n; i++) {
      const b = document.createElement('span');
      b.className = 'bulb';
      b.style.left = (i * S + S / 2) + 'px';
      b.style.top = (sag + 2) + 'px';
      b.style.setProperty('--c', TONES[i % TONES.length]);
      b.style.setProperty('--d', (-(i * 0.91) % 3.6).toFixed(2) + 's');
      g.appendChild(b);
    }
    (nav || document.body).appendChild(g);
  }
  buildGarland();
  let rt, lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastW) return;        // ignore mobile URL-bar resizes
    lastW = window.innerWidth;
    clearTimeout(rt); rt = setTimeout(buildGarland, 150);
  }, { passive: true });

  // Respect reduced-motion: keep the lights, skip the snowfall.
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
    // sparse and slow: a quiet flurry, not a blizzard
    const target = Math.round(Math.min(70, Math.max(24, (w * h) / 26000)));
    while (flakes.length < target) flakes.push(makeFlake(true));
    flakes.length = Math.min(flakes.length, target);
  }

  function makeFlake(randomY) {
    const depth = Math.random();                    // 0 far … 1 near
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -10,
      r: 0.8 + depth * 1.8,
      vy: 0.22 + depth * 0.5,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.003 + Math.random() * 0.007,
      drift: 0.1 + Math.random() * 0.25,
      a: 0.3 + depth * 0.45
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
      ctx.shadowColor = 'rgba(150,170,200,.5)';
      ctx.shadowBlur = 4;
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
