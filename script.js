/* ==========================================================
   Portfolio One-Page
   - Preloader
   - Mobile nav toggle
   - Smooth scroll + scrollspy
   - Typewriter rotating titles
   - AOS (Intersection Observer)
   - Project modal
   - Contact form validation
   - Counter animation
   - Background constellation animation
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ----- Preloader -----
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    pre?.classList.add('hidden');
    setTimeout(() => pre?.remove(), 500);
  });

  // ----- Year in footer -----
  document.getElementById('year').textContent = new Date().getFullYear();

  // ----- Mobile nav toggle -----
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  navToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  // Close menu when click a link
  document.querySelectorAll('.nav-link').forEach(a =>
    a.addEventListener('click', () => navMenu.classList.remove('open'))
  );

  // ----- Smooth scroll -----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', id);
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }
    });
  });

  // ----- Scrollspy -----
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        link?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
  sections.forEach(s => spy.observe(s));

  // ----- AOS (tiny) -----
  const aosEls = document.querySelectorAll('.aos');
  const aos = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => e.target.classList.add('in'), Number(delay));
        aos.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  aosEls.forEach(el => aos.observe(el));

  // ----- Typewriter rotating -----
  const phrases = ["Sviluppatore Web", "UI/UX Designer", "Creatore di Soluzioni Digitali"];
  const twEl = document.querySelector('.typewriter');
  const typingSpeed = 70;
  const pause = 1200;
  const eraseSpeed = 45;
  let idx = 0, char = 0, typing = true;

  function tick() {
    const word = phrases[idx % phrases.length];
    if (typing) {
      twEl.textContent = word.slice(0, ++char);
      if (char === word.length) { typing = false; setTimeout(tick, pause); return; }
    } else {
      twEl.textContent = word.slice(0, --char);
      if (char === 0) { typing = true; idx++; }
    }
    setTimeout(tick, typing ? typingSpeed : eraseSpeed);
  }
  if (twEl) tick();

  // ----- Project Modal -----
  const PROJECTS = {
    p1: {
      title: "Medico Sereno",
      desc: "Gestionale per studi medici: pazienti, appuntamenti, cartelle cliniche e fatturazione. Migrazione da desktop (Tkinter) a web app.",
      bullets: [
        "Obiettivi: UX per medico singolo e piccoli studi.",
        "Sfide: conformità normativa italiana e performance.",
        "Ruolo: architettura, sviluppo full-stack e UI/UX."
      ],
      live: "#"
    },
    p2: {
      title: "Askhole",
      desc: "App mobile di chat AI dal tono brillante e sarcastico, modello freemium e backend Flask.",
      bullets: [
        "Obiettivi: intrattenimento e viralità social.",
        "Sfide: moderazione contenuti e scalabilità API.",
        "Ruolo: UX, Flutter client, integrazione AI."
      ],
      live: "#"
    },
    p3: {
      title: "Programma Ricami",
      desc: "Gestione lotti, taglie e PDF di produzione; flusso rapido dall’import alla selezione prodotti.",
      bullets: [
        "Obiettivi: ridurre errori e tempi in produzione.",
        "Sfide: coerenza taglie tra PDF e UI.",
        "Ruolo: design UX e sviluppo front/back."
      ],
      live: "#"
    }
  };

  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalList = document.getElementById('modal-list');
  const modalLive = document.getElementById('modal-live');
  const modalImg = document.getElementById('modal-img');

  function openModal(id) {
    const data = PROJECTS[id];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalList.innerHTML = '';

    const card = document.querySelector(`[data-project="${id}"]`)?.closest('.project-card');
    const cardImg = card ? card.querySelector('.project-media img') : null;
    if (modalImg && cardImg) {
      modalImg.src = cardImg.getAttribute('src');
      modalImg.alt = `Anteprima progetto: ${data.title}`;
    }

    data.bullets.forEach(b => {
      const li = document.createElement('li');
      li.textContent = b;
      modalList.appendChild(li);
    });
    modalLive.href = data.live || '#';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.project));
  });
  modal.addEventListener('click', e => {
    if (e.target.dataset.close === 'true') closeModal();
  });
  document.addEventListener('keydown', e => {
    if (!modal.hidden && e.key === 'Escape') closeModal();
  });

  // ----- Contact form validation -----
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    let ok = true;

    const setErr = (input, msg='') => {
      const field = input.closest('.form-field');
      const err = field.querySelector('.error');
      err.textContent = msg;
      if (msg) ok = false;
    };

    setErr(form.name);
    setErr(form.email);
    setErr(form.message);

    if (!name) setErr(form.name, 'Inserisci il tuo nome.');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRe.test(email)) setErr(form.email, 'Email non valida.');
    if (!message) setErr(form.message, 'Scrivi un messaggio.');

    if (ok) {
      alert('Grazie! Ti risponderò al più presto.');
      form.reset();
    }
  });

  // ----- Counters -----
  const counters = document.querySelectorAll('.metric-value');
  const runCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const prefix = el.getAttribute('data-prefix') || '';
    const dir = (el.getAttribute('data-direction') || 'up').toLowerCase();
    const fromAttr = el.getAttribute('data-from');
    const from = fromAttr != null ? parseFloat(fromAttr) : 0;
    const steps = 50;
    const totalDuration = parseInt(el.getAttribute('data-duration') || '1000', 10);
    const stepTime = totalDuration / steps;
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

    const distance = Math.abs(target - from);
    if (distance === 0) {
      el.textContent = prefix + (decimals ? target.toFixed(decimals) : Math.round(target));
      return;
    }
    const delta = (dir === 'down' ? -1 : 1) * (distance / steps);
    const fmt = (n) => prefix + (decimals ? n.toFixed(decimals) : Math.round(n));

    let current = from;
    el.textContent = fmt(current);
    const tick = () => {
      current += delta;
      const done = (dir === 'down') ? (current <= target) : (current >= target);
      if (done) {
        el.textContent = fmt(target);
        el.classList.add("pop");
        setTimeout(() => el.classList.remove("pop"), 500);
      } else {
        el.textContent = fmt(current);
        setTimeout(tick, stepTime);
      }
    };
    setTimeout(tick, stepTime);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  counters.forEach(counter => counterObserver.observe(counter));
});

// Parallax su hero text
const hero = document.querySelector('.hero-content');
document.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;
  const x = (e.clientX / innerWidth - 0.5) * 10;
  const y = (e.clientY / innerHeight - 0.5) * 10;
  hero.style.transform = `translate(${x}px, ${y}px)`;
});

const cards = document.querySelectorAll('.project-card');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
},{ threshold: 0.2 });
cards.forEach(card=>observer.observe(card));

if (window.AOS) {
  AOS.init({ once: false, duration: 600 });
}

// ================= BACKGROUND PARTICLE CONSTELLATION =================
const bgCanvas = document.getElementById("bgCanvas");
if (bgCanvas) {
  const bgCtx = bgCanvas.getContext("2d");

  let particles = [];
  const particleCount = 80;   // numero punti
  const maxDistance = 120;    // distanza massima per collegare le linee

  // full-screen e ridimensionamento
  function resizeBG() {
    bgCanvas.width  = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeBG, { passive: true });
  resizeBG();

  // crea particelle
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6
    });
  }

  // mouse globale (il canvas ha pointer-events:none)
  const mouse = { x: null, y: null };
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  window.addEventListener("mouseleave", () => {
    mouse.x = mouse.y = null;
  }, { passive: true });

  function animateBG() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // aggiorna e disegna punti
    particles.forEach(p => {
      // reazione al mouse (aggiorna le velocità per effetto più fluido)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150 && dist > 0.001) {
          p.vx += (dx / dist) * 0.05;
          p.vy += (dy / dist) * 0.05;
        }
      }

      // movimento base
      p.x += p.vx;
      p.y += p.vy;

      // rimbalzo bordi
      if (p.x < 0 || p.x > bgCanvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;

      // attrito leggero
      p.vx *= 0.99; p.vy *= 0.99;

      // disegna punto
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      bgCtx.fillStyle = "#17A2B8"; // ciano
      bgCtx.fill();
    });

    // disegna linee tra punti vicini
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < maxDistance) {
          const alpha = 1 - d / maxDistance;
          bgCtx.strokeStyle = `rgba(0, 123, 255, ${alpha * 0.6})`; // blu
          bgCtx.lineWidth = 1;
          bgCtx.beginPath();
          bgCtx.moveTo(a.x, a.y);
          bgCtx.lineTo(b.x, b.y);
          bgCtx.stroke();
        }
      }
    }

    requestAnimationFrame(animateBG);
  }
  animateBG();
}

// ============= HERO PARTICLE LAYER (big & slow) =============
(() => {
  const heroCanvas = document.getElementById('heroCanvas');
  if (!heroCanvas) return;
  const hCtx = heroCanvas.getContext('2d');

  // sizing al box hero (non full screen)
  function sizeHero() {
    const r = heroCanvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    heroCanvas.width  = Math.floor(r.width  * dpr);
    heroCanvas.height = Math.floor(r.height * dpr);
    heroCanvas.style.width  = r.width + 'px';
    heroCanvas.style.height = r.height + 'px';
    hCtx.setTransform(dpr, 0, 0, dpr, 0, 0); // coord in CSS px
  }
  window.addEventListener('resize', sizeHero, { passive: true });
  sizeHero();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const baseCount = Math.max(18, Math.floor((heroCanvas.clientWidth * heroCanvas.clientHeight) / 45000));
  const HCOUNT = prefersReduced ? Math.floor(baseCount * 0.5) : baseCount;

  const dots = [];
  for (let i = 0; i < HCOUNT; i++) {
    dots.push({
      x: Math.random() * heroCanvas.clientWidth,
      y: Math.random() * heroCanvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 2.2 + Math.random() * 1.6
    });
  }

  const mouse = { x: null, y: null, inside: false };
  function getRect(){ return heroCanvas.getBoundingClientRect(); }
  window.addEventListener('mousemove', e => {
    const r = getRect();
    mouse.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (mouse.inside) {
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
  }, { passive:true });

  const LINK_DIST = 140;
  const ATTRACTION = 0.02; // regola intensità

  function drawHero(){
    const w = heroCanvas.clientWidth, h = heroCanvas.clientHeight;
    hCtx.clearRect(0,0,w,h);

    dots.forEach(p=>{
      // drift
      p.x += p.vx; p.y += p.vy;

      // attrazione dolce se il mouse è nella hero
      if (mouse.inside && mouse.x != null) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 180 && d > 0.001) {
          p.vx += (dx / d) * ATTRACTION;
          p.vy += (dy / d) * ATTRACTION;
        }
      }

      // wrap ai bordi
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // punto
      hCtx.beginPath();
      hCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      hCtx.fillStyle = '#9ee9f0';      // ciano chiaro
      hCtx.globalAlpha = 0.9;
      hCtx.fill();
      hCtx.globalAlpha = 1;
    });

    // linee soft
    for(let i=0;i<dots.length;i++){
      for(let j=i+1;j<dots.length;j++){
        const a=dots[i], b=dots[j];
        const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
        if (d < LINK_DIST){
          const alpha = 1 - d/LINK_DIST;
          hCtx.strokeStyle = `rgba(0,123,255,${alpha * 0.35})`;
          hCtx.lineWidth = 1;
          hCtx.beginPath();
          hCtx.moveTo(a.x,a.y);
          hCtx.lineTo(b.x,b.y);
          hCtx.stroke();
        }
      }
    }

    requestAnimationFrame(drawHero);
  }

  if (!prefersReduced) requestAnimationFrame(drawHero);
})();
