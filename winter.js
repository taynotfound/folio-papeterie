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

  // ── Festive icons: swap the sprite symbols for Christmas variants ─────────
  // Self-contained (no extra request): symbols are injected and <use> is remapped.
  const NS = 'http://www.w3.org/2000/svg';
  const star = 'M18 3l.6 1.6L20.2 5l-1.6.6L18 7.2l-.6-1.6L15.8 5l1.6-.4z';
  const SYMS = {
    'i-sparkles':       '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 6.8l2.5-2.3M9.5 19.5L12 17.2l2.5 2.3"/>',          // snowflake
    'i-circle-small':   '<path d="M12 6l1.6 4.4L18 12l-4.4 1.6L12 18l-1.6-4.4L6 12l4.4-1.6z"/>',                                         // little star
    'i-gift':           '<path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12"/><path d="M12 9c-2.5 0-5-1-4-3.2 1-1.8 4 .2 4 3.2zM12 9c2.5 0 5-1 4-3.2-1-1.8-4 .2-4 3.2z"/>',  // gift with bow
    'i-pin':            '<path d="M19 10c0 5.5-7 11-7 11s-7-5.5-7-11a7 7 0 0 1 14 0z"/><path d="M12 6.5l1 2.2 2.3.3-1.7 1.6.5 2.3-2.1-1.2-2.1 1.2.5-2.3-1.7-1.6 2.3-.3z"/>', // pin with star
    'i-hourglass-half': '<path d="M12 3l1.5 3.2L17 6.7l-2.5 2.4.6 3.4L12 10.9 8.9 12.5l.6-3.4L7 6.7l3.5-.5z"/><path d="M12 13v8M8.5 17.5L12 21l3.5-3.5"/>',      // star over arrow → "seit"
    'i-envelope-open-text': '<path d="M3 9l9-6 9 6v11H3z"/><path d="M3 9l9 6 9-6"/><path d="M12 11.6c-1-1.5-3-.6-2.2.9.5.9 2.2 1.9 2.2 1.9s1.7-1 2.2-1.9c.8-1.5-1.2-2.4-2.2-.9z"/>', // card with heart
    'i-pen-nib':        '<path d="M12 19l7-7 3 3-7 7z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/><path d="M2 2l7.6 7.6"/><path d="'+star+'"/>',
    'i-bag-shopping':   '<path d="M5 9h14l-1 12H6z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/><path d="M10 14l2 1.8 2-1.8"/>',
    'i-notebook':       '<path d="M6 3h13v18H6z"/><path d="M6 7H3M6 12H3M6 17H3"/><path d="M12.5 8l-1 4.5h3zM12.5 12.5V15"/>' // tiny fir
  };
  const sprite = document.createElementNS(NS, 'svg');
  sprite.setAttribute('width', '0'); sprite.setAttribute('height', '0');
  sprite.setAttribute('aria-hidden', 'true'); sprite.style.position = 'absolute';
  sprite.innerHTML = '<defs>' + Object.keys(SYMS).map(k =>
    '<symbol id="w-' + k.slice(2) + '" viewBox="0 0 24 24">' + SYMS[k] + '</symbol>').join('') + '</defs>';
  document.body.insertBefore(sprite, document.body.firstChild);
  document.querySelectorAll('use[href^="#i-"]').forEach(u => {
    const id = u.getAttribute('href').slice(1);
    if (SYMS[id]) u.setAttribute('href', '#w-' + id.slice(2));
  });

  // ── Festive wording: only the week before Christmas (18–26 Dec) ────────────
  // ?greet=on forces it for previewing.
  const christmasWeek = m === 11 && d >= 18 && d <= 26;
  if (christmasWeek || params.get('greet') === 'on') {
    const since = document.querySelector('.hero-since');
    if (since) since.insertAdjacentHTML('afterend', '<p class="winter-greet">Frohe Weihnachten &amp; eine besinnliche Adventszeit</p>');
    const flogo = document.querySelector('.footer-logo');
    if (flogo) flogo.insertAdjacentHTML('afterend', '<p class="winter-greet winter-greet--foot">Frohe Weihnachten &amp; ein gutes neues Jahr</p>');
  }

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

  // ── Snow caps & banks ──────────────────────────────────────────────────────
  // Each cap is a small inline SVG drawn from a seeded, smoothed noise profile:
  // a mound that thins out towards the ends, a lip hanging over the front edge
  // with the odd drip, a cool underside and a faint contact shadow. Static, so
  // it costs nothing once drawn; redrawn only on resize or when snow is lost.
  const SVGNS = 'http://www.w3.org/2000/svg';
  const defs = document.createElementNS(SVGNS, 'svg');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
  defs.setAttribute('aria-hidden', 'true'); defs.style.position = 'absolute';
  defs.innerHTML =
    '<defs>' +
    '<linearGradient id="w-snow-body" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#fbfcfe"/><stop offset="1" stop-color="#e7edf4"/>' +
    '</linearGradient>' +
    '<linearGradient id="w-snow-under" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#c9d5e3" stop-opacity="0"/><stop offset="1" stop-color="#aebdcf" stop-opacity=".5"/>' +
    '</linearGradient>' +
    '</defs>';
  document.body.insertBefore(defs, document.body.firstChild);

  function rng(seed) { let x = seed * 9301 + 49297; return () => ((x = (x * 16807) % 2147483647) / 2147483647); }

  // Catmull-Rom through the points → cubic Béziers
  function curve(p) {
    let d = '';
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += ' C' + (b[0] + (c[0] - a[0]) / 6).toFixed(1) + ',' + (b[1] + (c[1] - a[1]) / 6).toFixed(1) +
           ' ' + (c[0] - (e[0] - b[0]) / 6).toFixed(1) + ',' + (c[1] - (e[1] - b[1]) / 6).toFixed(1) +
           ' ' + c[0].toFixed(1) + ',' + c[1].toFixed(1);
    }
    return d;
  }

  const KINDS = {
    //        overhang, mound depth, lip, drips per 100px, drip length, end rounding (lower = flatter)
    button: { ov: 2, depth: 8,  lip: 2,   drips: .45, drip: 4,  round: .5,  drape: 3 },
    card:   { ov: 2, depth: 14, lip: 3,   drips: .5,  drip: 7,  round: .42, drape: 5 },
    bank:   { ov: 10, depth: 12, lip: 4.5, drips: .45, drip: 12, round: .05, drape: 0 }
  };

  function drawSnow(cap) {
    const k = KINDS[cap.kind], R = rng(cap.seed);
    const W = Math.round(cap.el.offsetWidth + k.ov * 2);
    if (W < 20) return;
    const E = k.depth + 1;                                    // y of the surface the snow sits on
    const H = E + k.lip + k.drip + k.drape + 4;
    const f1 = 2 + R() * 3, f2 = 7 + R() * 6, p1 = R() * 6.3, p2 = R() * 6.3, p3 = R() * 6.3;
    const env = t => Math.pow(Math.max(0, Math.sin(Math.PI * t)), k.round);
    const drips = [];
    const nd = Math.max(cap.kind === 'bank' ? 2 : 0, Math.round(W / 100 * k.drips * (0.6 + R() * 0.8)));
    for (let i = 0; i < nd; i++) drips.push({ x: (0.06 + 0.88 * (i + 0.5 + (R() - 0.5) * 0.8) / nd) * W, w: 2.5 + R() * 6, l: k.drip * (0.35 + R() * 0.65) });

    // a handful of soft mounds, so the surface looks piled rather than wavy
    const mounds = [];
    for (let i = 0, n = Math.max(3, Math.round(W / 55)); i < n; i++)
      mounds.push({ c: R(), w: 0.05 + R() * 0.12, a: 0.4 + R() * 0.6 });
    let mMax = 0;
    const mound = t => mounds.reduce((s, m) => s + m.a * Math.exp(-Math.pow((t - m.c) / m.w, 2)), 0);
    for (let t = 0; t <= 1; t += 0.01) mMax = Math.max(mMax, mound(t));

    const step = Math.max(4, W / 70), top = [], bot = [];
    for (let x = 0; x <= W + 0.01; x += step) {
      const t = x / W, e = env(t);
      const n = 0.5 + 0.42 * mound(t) / mMax + 0.08 * Math.sin(t * f2 * 6.28 + p2);
      // ends curl down over the corners instead of stopping flat
      const corner = k.drape * (Math.exp(-Math.pow(x / (k.ov + 3), 2)) + Math.exp(-Math.pow((W - x) / (k.ov + 3), 2)));
      top.push([x, E - cap.amount * k.depth * e * n + corner]);
      let lip = k.lip * Math.sqrt(e) * (0.55 + 0.45 * Math.sin(t * f1 * 4.1 + p3)) * (0.5 + cap.amount * 0.5) + corner;
      for (const d of drips) lip += d.l * cap.amount * Math.exp(-Math.pow((x - d.x) / d.w, 2));
      bot.push([x, E + Math.max(0, lip)]);
    }
    top[0][1] = bot[0][1]; top[top.length - 1][1] = bot[bot.length - 1][1];
    top[0][0] = bot[0][0] = 0.5; top[top.length - 1][0] = bot[bot.length - 1][0] = W - 0.5;
    const rev = bot.slice().reverse();
    const body = 'M' + top[0].join(',') + curve(top) + ' L' + rev[0].join(',') + curve(rev) + 'Z';
    const under = 'M0,' + (E - 1.5) + ' L' + W + ',' + (E - 1.5) + ' L' + rev[0].join(',') + curve(rev) + 'Z';
    const shadowPts = bot.map(([x, y]) => [x, y + 1.2 * env(x / W)]).reverse();
    const shadow = 'M' + top[0].join(',') + curve(top) + ' L' + shadowPts[0].join(',') + curve(shadowPts) + 'Z';
    const rim = 'M' + top[0].join(',') + curve(top);

    cap.svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    cap.svg.setAttribute('width', W); cap.svg.setAttribute('height', H);
    cap.svg.style.left = (-k.ov) + 'px'; cap.svg.style.top = (-E) + 'px';
    cap.svg.innerHTML =
      (cap.kind === 'bank' ? '' : '<path d="' + shadow + '" fill="#0f1a2b" opacity=".09"/>') +
      '<path d="' + body + '" fill="url(#w-snow-body)"/>' +
      '<path d="' + under + '" fill="url(#w-snow-under)" opacity=".75"/>' +
      '<path d="' + rim + '" fill="none" stroke="#a7b7ca" stroke-opacity=".38" stroke-width=".6"/>';
    cap.E = E;
  }

  const targets = [
    ...[...document.querySelectorAll('.btn-primary')].map(el => [el, 'button']),
    ...[...document.querySelectorAll('.card')].map(el => [el, 'card']),
    ...[...document.querySelectorAll('#besuch, body > footer:not(.legal-foot)')].map(el => [el, 'bank'])
  ];
  const caps = targets.map(([el, kind], i) => {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'snow-cap snow-cap--' + kind);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    el.insertBefore(svg, el.firstChild);
    const cap = { el, svg, kind, seed: 7 + i * 131, amount: 1, w: 0 };
    drawSnow(cap);
    cap.w = el.offsetWidth;
    return cap;
  });
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => caps.forEach(c => {
      if (c.el.offsetWidth !== c.w) { c.w = c.el.offsetWidth; drawSnow(c); }
    }));
    caps.forEach(c => ro.observe(c.el));
  }

  // Weak hardware gets a light snowfall (few flakes, 30 fps, no shedding);
  // reduced-motion gets none. It also bails out by itself if frames get slow.
  const weak = params.get('snow') !== 'on' &&
    ((navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('winter-calm');
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'winter-snow';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let w, h, flakes = [], raf = null;
  const dpr = 1;                                    // snow is soft: no need for hi-dpi

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // sparse and slow: a quiet flurry, not a blizzard
    const target = weak ? 16 : Math.round(Math.min(36, Math.max(14, (w * h) / 50000)));
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

  const SPR = 16, sprite0 = document.createElement('canvas');
  sprite0.width = sprite0.height = SPR;
  (function () {
    const c = sprite0.getContext('2d'), g = c.createRadialGradient(SPR/2, SPR/2, 0, SPR/2, SPR/2, SPR/2);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.45, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, SPR, SPR);
  })();

  // ── Snow slides off the caps while scrolling ──────────────────────────────
  // A jolt knocks a little snow off the ends and the lip: a couple of clumps
  // that drop, plus fine powder that drifts. The cap visibly thins and slowly
  // builds back up while it keeps snowing.
  const bits = [];
  const shedCaps = caps.filter(c => c.kind !== 'bank');
  let lastY = window.scrollY, ticking = false, lastShed = 0;
  function shed() {
    ticking = false;
    if (weak) return;
    const y = window.scrollY, dy = y - lastY;
    lastY = y;
    const t = performance.now();
    if (Math.abs(dy) < 6 || t - lastShed < 220) return;
    const vis = shedCaps.filter(c => {
      if (c.amount < 0.4) return false;
      const r = c.svg.getBoundingClientRect();
      return r.bottom > 40 && r.top < h - 20;
    });
    if (!vis.length || Math.random() > Math.min(0.85, Math.abs(dy) / 60)) return;
    lastShed = t;
    const c = vis[Math.floor(Math.random() * vis.length)];
    const r = c.el.getBoundingClientRect();
    const k = KINDS[c.kind], big = c.kind === 'card';
    const side = Math.random() < 0.65;                        // most of it slides off an end
    const fromLeft = Math.random() < 0.5;
    const ox = side ? (fromLeft ? r.left - k.ov + 2 + Math.random() * 6 : r.right + k.ov - 2 - Math.random() * 6)
                    : r.left + (0.15 + Math.random() * 0.7) * r.width;
    const oy = r.top + (side ? -1 : 2);
    const push = side ? (fromLeft ? -1 : 1) : (Math.random() - 0.5);
    const clumps = big ? 2 + (Math.random() * 2 | 0) : 1 + (Math.random() * 2 | 0);
    for (let i = 0; i < clumps && bits.length < 80; i++) {
      bits.push({ x: ox + (Math.random() - .5) * 5, y: oy, vx: push * (.25 + Math.random() * .45), vy: Math.random() * .4,
                  g: .1 + Math.random() * .04, r: (big ? 1.9 : 1.4) + Math.random() * 1.3, a: 1, fade: .008, lump: true });
    }
    for (let i = 0, n = big ? 9 : 5; i < n && bits.length < 80; i++) {
      bits.push({ x: ox + (Math.random() - .5) * 10, y: oy + Math.random() * 3, vx: push * Math.random() * .5 + (Math.random() - .5) * .5,
                  vy: -.2 + Math.random() * .4, g: .015 + Math.random() * .02, r: .5 + Math.random() * .7, a: .9, fade: .012 + Math.random() * .01 });
    }
    c.amount = Math.max(0.35, c.amount - (big ? 0.12 : 0.2));
    drawSnow(c);
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(shed); }
  }, { passive: true });
  if (!weak) setInterval(() => {                              // snow settles back on
    if (document.hidden) return;
    for (const c of shedCaps) if (c.amount < 1) { c.amount = Math.min(1, c.amount + 0.04); drawSnow(c); }
  }, 2500);

  let lastT = 0, slow = 0, nF = 0;
  function tick(now) {
    if (weak && now - lastT < 33) { raf = requestAnimationFrame(tick); return; }   // ~30 fps
    if (lastT) {                                      // give up quietly if the machine can't keep up
      slow += (now - lastT > 70) ? 1 : -1; slow = Math.max(0, slow);
      if (slow > 40) { canvas.remove(); raf = null; return; }
    }
    lastT = now;
    ctx.clearRect(0, 0, w, h);
    for (const f of flakes) {
      f.sway += f.swaySpeed;
      f.y += f.vy;
      f.x += Math.sin(f.sway) * f.drift;
      if (f.y > h + 10) Object.assign(f, makeFlake(false), { x: Math.random() * w });
      if (f.x < -10) f.x = w + 10; else if (f.x > w + 10) f.x = -10;
      ctx.globalAlpha = f.a;
      ctx.drawImage(sprite0, f.x - f.r * 2, f.y - f.r * 2, f.r * 4, f.r * 4);
    }
    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i];
      b.vy += b.g; b.vx *= .985; b.x += b.vx; b.y += b.vy; b.a -= b.fade;
      if (b.a <= 0 || b.y > h) { bits.splice(i, 1); continue; }
      ctx.globalAlpha = b.a;
      ctx.drawImage(sprite0, b.x - b.r * 2, b.y - b.r * 2, b.r * 4, b.r * 4);
      if (b.lump) ctx.drawImage(sprite0, b.x + b.r * .6 - b.r * 1.5, b.y - b.r * .5 - b.r * 1.5, b.r * 3, b.r * 3);
    }
    ctx.globalAlpha = 1;
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
