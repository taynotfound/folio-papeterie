// Inject static handcrafted paper details
(function () {

  // ── 1. Paper texture overlay (SVG feTurbulence noise) ─────────────────────
  const grain = document.querySelector('.paper-grain');
  if (grain) {
    grain.style.cssText += `
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity: .18;
      mix-blend-mode: multiply;
    `;
  }

  // ── 2. SVG decoration layer ────────────────────────────────────────────────
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('id', 'paper-deco');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.style.cssText = `
    position: fixed; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
    overflow: visible;
  `;

  svg.innerHTML = `
    <defs>
      <!-- ink bleed filter -->
      <filter id="ink" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04 0.07" numOctaves="3" seed="8" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <!-- soft blur for stain -->
      <filter id="stain">
        <feGaussianBlur stdDeviation="6"/>
      </filter>
    </defs>

    <!-- ── ink drops ──────────────────────────────────────────────────────── -->
    <!-- top-left cluster -->
    <ellipse cx="4vw" cy="18vh" rx="6" ry="4" fill="#1c1710" opacity=".18" filter="url(#ink)"/>
    <ellipse cx="4.6vw" cy="18.4vh" rx="2" ry="2" fill="#1c1710" opacity=".14" filter="url(#ink)"/>
    <ellipse cx="3.4vw" cy="19.2vh" rx="1.2" ry="1" fill="#1c1710" opacity=".1"/>
    <!-- satellite splatter -->
    <circle cx="5.5vw" cy="17.2vh" r="1" fill="#1c1710" opacity=".12"/>
    <circle cx="3vw"   cy="17vh"   r=".7" fill="#1c1710" opacity=".09"/>

    <!-- right side large drop -->
    <ellipse cx="96vw" cy="42vh" rx="9" ry="6" fill="#1c1710" opacity=".13" filter="url(#ink)"/>
    <ellipse cx="97vw" cy="43.5vh" rx="3" ry="2" fill="#1c1710" opacity=".1" filter="url(#ink)"/>
    <circle  cx="94vw" cy="41vh" r="1.2" fill="#1c1710" opacity=".08"/>
    <circle  cx="97.5vw" cy="40.5vh" r=".8" fill="#1c1710" opacity=".08"/>

    <!-- bottom scatter -->
    <ellipse cx="88vw" cy="78vh" rx="5" ry="3.5" fill="#1c1710" opacity=".11" filter="url(#ink)"/>
    <ellipse cx="89vw" cy="79vh" rx="1.5" ry="1" fill="#1c1710" opacity=".08"/>
    <circle  cx="86.5vw" cy="77.5vh" r=".9" fill="#1c1710" opacity=".07"/>
    <ellipse cx="12vw" cy="82vh" rx="4" ry="2.5" fill="#1c1710" opacity=".09" filter="url(#ink)"/>
    <circle  cx="13.5vw" cy="80.8vh" r=".8" fill="#1c1710" opacity=".07"/>

    <!-- ── coffee / water ring stains ─────────────────────────────────────── -->
    <circle cx="91vw" cy="14vh" r="38" fill="none"
      stroke="#a07840" stroke-width="1.5" opacity=".09" filter="url(#stain)"/>
    <circle cx="91vw" cy="14vh" r="36" fill="none"
      stroke="#a07840" stroke-width=".5" opacity=".06"/>
    <!-- half-ring overlap -->
    <circle cx="93vw" cy="16vh" r="28" fill="none"
      stroke="#a07840" stroke-width="1" opacity=".07" filter="url(#stain)"/>

    <!-- faint stain left -->
    <circle cx="8vw" cy="68vh" r="30" fill="none"
      stroke="#8b6030" stroke-width="1.2" opacity=".07" filter="url(#stain)"/>
    <circle cx="8vw" cy="68vh" r="28.5" fill="none"
      stroke="#8b6030" stroke-width=".4" opacity=".05"/>

    <!-- ── pencil / ruling lines ───────────────────────────────────────────── -->
    <!-- faint margin line left edge -->
    <line x1="6.5vw" y1="0" x2="6.2vw" y2="100vh"
      stroke="#c4964a" stroke-width=".4" opacity=".08"
      stroke-dasharray="6 18"/>

    <!-- ── pen scribble / bracket marks ──────────────────────────────────── -->
    <!-- top-right corner bracket -->
    <path d="M 88vw 6vh Q 88.5vw 5.5vh 89vw 6vh" fill="none"
      stroke="#1c1710" stroke-width=".9" opacity=".12" stroke-linecap="round"/>
    <path d="M 93vw 6vh Q 93.5vw 5.5vh 94vw 6vh" fill="none"
      stroke="#1c1710" stroke-width=".9" opacity=".12" stroke-linecap="round"/>

    <!-- small asterisk doodle bottom-left -->
    <g transform="translate(calc(7vw), calc(90vh))" opacity=".1" stroke="#1c1710" stroke-width=".8" stroke-linecap="round">
      <line x1="-5" y1="0" x2="5" y2="0"/>
      <line x1="0" y1="-5" x2="0" y2="5"/>
      <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5"/>
      <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5"/>
    </g>
  `;

  document.body.appendChild(svg);

})();
