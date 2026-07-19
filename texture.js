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
      </defs>

      <!-- ── INK DROPS ─ top-left cluster ─────────────────────────────────── -->
      <ellipse cx="5.5%" cy="320" rx="7" ry="5" fill="#1c1710" opacity=".22" filter="url(#ink-bleed)"/>
      <ellipse cx="6.2%" cy="328" rx="2.5" ry="1.8" fill="#1c1710" opacity=".16" filter="url(#ink-bleed)"/>
      <circle  cx="4.3%" cy="315" r="1.2" fill="#1c1710" opacity=".13"/>
      <circle  cx="7.1%" cy="312" r="0.8" fill="#1c1710" opacity=".10"/>
      <circle  cx="4.8%" cy="334" r="0.6" fill="#1c1710" opacity=".09"/>

      <!-- ── INK DROPS ─ right edge mid-page ──────────────────────────────── -->
      <ellipse cx="97%" cy="780" rx="10" ry="7" fill="#1c1710" opacity=".17" filter="url(#ink-bleed)"/>
      <ellipse cx="97.8%" cy="793" rx="3.5" ry="2.5" fill="#1c1710" opacity=".12" filter="url(#ink-bleed)"/>
      <circle  cx="95.2%" cy="775" r="1.4" fill="#1c1710" opacity=".10"/>
      <circle  cx="98.5%" cy="771" r="0.9" fill="#1c1710" opacity=".09"/>
      <circle  cx="96.5%" cy="799" r="0.7" fill="#1c1710" opacity=".08"/>

      <!-- ── INK DROPS ─ bottom-left scatter ──────────────────────────────── -->
      <ellipse cx="9%" cy="1980" rx="5.5" ry="3.5" fill="#1c1710" opacity=".14" filter="url(#ink-bleed)"/>
      <ellipse cx="9.8%" cy="1987" rx="2" ry="1.4" fill="#1c1710" opacity=".10"/>
      <circle  cx="7.5%" cy="1977" r="1" fill="#1c1710" opacity=".08"/>

      <!-- ── COFFEE RING ─ top right ───────────────────────────────────────── -->
      <circle cx="91%" cy="260" r="48" fill="rgba(160,110,50,.06)" filter="url(#stain-blur)"/>
      <circle cx="91%" cy="260" r="47" fill="none" stroke="#a07840" stroke-width="1.8" opacity=".11" filter="url(#stain-blur)"/>
      <circle cx="91%" cy="260" r="45.5" fill="none" stroke="#a07840" stroke-width=".5" opacity=".07"/>
      <!-- offset second ring -->
      <circle cx="93.5%" cy="278" r="34" fill="none" stroke="#a07840" stroke-width="1.2" opacity=".09" filter="url(#stain-blur)"/>

      <!-- ── COFFEE RING ─ lower left ──────────────────────────────────────── -->
      <circle cx="7%" cy="1650" r="38" fill="rgba(140,90,40,.05)" filter="url(#stain-blur)"/>
      <circle cx="7%" cy="1650" r="37" fill="none" stroke="#8b6030" stroke-width="1.4" opacity=".09" filter="url(#stain-blur)"/>
      <circle cx="7%" cy="1650" r="35.5" fill="none" stroke="#8b6030" stroke-width=".4" opacity=".06"/>

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
