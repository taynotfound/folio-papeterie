// Static paper decorations — ink drops, coffee rings, pencil marks
(function () {

  // ── Full-page absolute decoration layer ───────────────────────────────────
  const wrap = document.createElement('div');
  wrap.id = 'paper-deco';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = `
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 0; overflow: hidden;
  `;
  // Make sure body is relative
  document.body.style.position = 'relative';

  wrap.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
         style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:visible"
         aria-hidden="true">
      <defs>
        <filter id="ink-bleed" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.06" numOctaves="3" seed="8" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="stain-blur">
          <feGaussianBlur stdDeviation="7"/>
        </filter>
        <filter id="stain-blur-sm">
          <feGaussianBlur stdDeviation="3.5"/>
        </filter>
        <!-- ink drop shadow: crisp, dark, small offset -->
        <filter id="drop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#1c1710" flood-opacity=".35"/>
        </filter>
        <!-- coffee stain shadow: softer, warmer -->
        <filter id="drop-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="5" stdDeviation="5" flood-color="#3a2210" flood-opacity=".25"/>
        </filter>
      </defs>

      <!-- ── INK STAINS (real PNGs) ────────────────────────────────────────── -->
      <!-- top-left, near hero -->
      <image href="ink1.png" x="-1%" y="180" width="260" opacity=".6"
        filter="url(#drop)"
        style="mix-blend-mode:multiply"/>

      <!-- top-right, rotated -->
      <image href="ink2.png" x="74%" y="90" width="220" opacity=".55"
        transform="rotate(12, 900, 200)"
        filter="url(#drop)"
        style="mix-blend-mode:multiply"/>

      <!-- mid-page left, flipped -->
      <image href="ink3.png" x="-2%" y="1100" width="200" opacity=".5"
        transform="scale(-1,1) translate(-200, 0)"
        filter="url(#drop)"
        style="mix-blend-mode:multiply"/>

      <!-- lower right -->
      <image href="ink4.png" x="76%" y="1800" width="240" opacity=".52"
        transform="rotate(-8, 1100, 1920)"
        filter="url(#drop)"
        style="mix-blend-mode:multiply"/>

      <!-- ── COFFEE STAINS ───────────────────────────────────────────────────── -->
      <image href="coffee-stain.png" x="78%" y="120" width="220" opacity=".6"
        filter="url(#drop-soft)"
        style="mix-blend-mode:multiply"/>

      <image href="coffee-stain2.png" x="-2%" y="1480" width="200" opacity=".50"
        transform="rotate(-22, 80, 1570)"
        filter="url(#drop-soft)"
        style="mix-blend-mode:multiply"/>

      <!-- ── PENCIL MARGIN LINE ─────────────────────────────────────────────── -->
      <line x1="7.5%" y1="0" x2="7.2%" y2="100%"
        stroke="#c4964a" stroke-width="0.5" opacity=".10"
        stroke-dasharray="8 22"/>

      <!-- ── SMALL PEN DOODLE ─ asterisk bottom-left ──────────────────────── -->
      <g transform="translate(80, 2300)" opacity=".12" stroke="#1c1710" stroke-width="0.9" stroke-linecap="round">
        <line x1="-5" y1="0" x2="5" y2="0"/>
        <line x1="0" y1="-5" x2="0" y2="5"/>
        <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5"/>
        <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5"/>
      </g>
    </svg>
  `;

  document.body.appendChild(wrap);

})();
