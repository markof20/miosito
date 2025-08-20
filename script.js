/* ==========================================================
   Portfolio One-Page
   - Preloader
   - Mobile nav toggle
   - Smooth scroll + scrollspy
   - Typewriter rotating titles
   - AOS (Intersection Observer)
   - Project modal
   - Contact form validation
   - Canvas "constellation" animation
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

  // ----- Smooth scroll (native CSS handles most; ensure focus & hash) -----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', id);
          // Move focus for a11y
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }
    });
  });

  // ----- Scrollspy (active link) -----
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
  const cursor = document.querySelector('.cursor');
  const typingSpeed = 70;     // ms per char
  const pause = 1200;         // pausa a fine parola
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
  // Cursor blink is CSS. If desired, could pause during typing.

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
  const modalGit = document.getElementById('modal-git');
  const modalImg = document.getElementById('modal-img');

  function openModal(id) {
    const data = PROJECTS[id];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalList.innerHTML = '';
   const cardImg = document.querySelector(`[data-project="${id}"], [data-project-card="${id}"]`) 
     ? document.querySelector(`[data-project="${id}"], [data-project-card="${id}"]`).closest('.project-card').querySelector('.project-media img')
     : document.querySelector('.projects-grid .open-modal[data-project="'+id+'"]').closest('.project-card').querySelector('.project-media img');

   if (modalImg && cardImg) {
  modalImg.src = cardImg.getAttribute('src');
  modalImg.alt = `Anteprima progetto: ${PROJECTS[id].title}`;
}
    data.bullets.forEach(b => {
      const li = document.createElement('li'); li.textContent = b; modalList.appendChild(li);
    });
    modalLive.href = data.live || '#';
    modalGit.href = data.git || '#';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    // focus management
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

  // ----- Contact form validation (client-side) -----
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
      // Qui potresti inviare i dati a un endpoint (es. fetch('/api/contact', …))
      alert('Grazie! Ti risponderò al più presto.');
      form.reset();
    }
  });

  // ----- Canvas Constellation (particelle connesse) -----
  // Leggera e reattiva al mouse; ottimizzata con requestAnimationFrame
  const canvas = document.getElementById('constellation');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles, mouse = { x: null, y: null };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function initParticles() {
      const count = Math.floor((w * h) / 9000); // densità in base all'area
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - .5) * .4,
        vy: (Math.random() - .5) * .4,
        r: Math.random() * 1.8 + .6
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // punti
      ctx.fillStyle = 'rgba(255,255,255,.8)';
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // connessioni
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p = particles[i], q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 120 * 120) {
            const alpha = 1 - dist2 / (120 * 120);
            const grad = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
            grad.addColorStop(0, `rgba(0,123,255,${alpha * .6})`);
            grad.addColorStop(1, `rgba(23,162,184,${alpha * .6})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      update();
      requestAnimationFrame(draw);
    }

    function update() {
      for (const p of particles) {
        // lieve attrazione verso il mouse
        if (mouse.x !== null) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) { p.vx += dx / d * 0.02; p.vy += dy / d * 0.02; }
        }
        p.x += p.vx; p.y += p.vy;
        // rimbalzo ai bordi
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        // leggera frizione
        p.vx *= 0.99; p.vy *= 0.99;
      }
    }

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });
    window.addEventListener('resize', resize, { passive: true });

    resize(); draw();
  }
});


