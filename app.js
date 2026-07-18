// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Scroll-reveal via IntersectionObserver
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // stagger siblings
      const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(e.target);
      e.target.style.transitionDelay = (idx * 0.1) + 's';
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// Wax seal SVG circular text
const seal = document.querySelector('.wax-seal');
if (seal) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 160 160');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'sealCircle');
  path.setAttribute('d', 'M 80,80 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0');
  path.setAttribute('fill', 'none');
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('font-size', '7.5');
  text.setAttribute('fill', 'rgba(255,255,255,0.55)');
  text.setAttribute('font-family', 'Inter, sans-serif');
  text.setAttribute('letter-spacing', '2.8');
  const tp = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
  tp.setAttribute('href', '#sealCircle');
  tp.textContent = 'FOLIO PAPETERIE \u00B7 GOTTINGEN \u00B7 SEIT 1985 \u00B7';
  text.appendChild(tp);
  svg.appendChild(path);
  svg.appendChild(text);
  // Remove the span-based text, add SVG
  seal.querySelector('.seal-text').replaceWith(svg);
}
