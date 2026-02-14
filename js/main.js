/* LOADER */
window.addEventListener('load',()=>{setTimeout(()=>{document.getElementById('loader').classList.add('hidden');animateHero();setTimeout(animateStickyNote,1200)},2200)});

/* NOTIFICATION BAR ANIMATION */
function animateStickyNote(){
  const bar = document.getElementById('stickyNote');
  if(!bar) return;

  // Reset
  bar.style.transition = 'none';
  bar.style.bottom = '-60px';
  bar.style.opacity = '0';

  // Force reflow
  bar.offsetHeight;

  // Slide up
  bar.style.transition = 'bottom 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, background 0.3s, box-shadow 0.3s, border-color 0.3s';
  bar.style.bottom = '20px';
  bar.style.opacity = '1';
}

// Notification bar close button
document.addEventListener('click', function(e){
  const closeBtn = e.target.closest('#stickyNoteClose');
  if(!closeBtn) return;
  e.preventDefault();
  e.stopPropagation();
  const bar = document.getElementById('stickyNote');
  if(!bar) return;
  bar.style.transition = 'bottom .4s cubic-bezier(.6,-.28,.74,.05), opacity .3s ease';
  bar.style.bottom = '-60px';
  bar.style.opacity = '0';
  setTimeout(() => bar.style.display = 'none', 400);
});

function animateHero(){
  const elements = document.querySelectorAll('[data-hero-anim]');
  const banner = document.getElementById('heroBanner');
  elements.forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = 'opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 150);
  });
  if(banner) setTimeout(() => banner.classList.add('animated'), 800);
  // Animate 3 SVG icons
  document.querySelectorAll('.hero-icon-item').forEach((icon, i) => {
    setTimeout(() => {
      icon.classList.add('visible');
      const svg = icon.querySelector('.hero-icon-svg');
      if(svg) svg.classList.add('drawn');
      // Start floating after draw animation finishes
      setTimeout(() => icon.classList.add('floating'), 2800);
    }, 1200 + i * 250);
  });
}

/* COUNTDOWN */
(function(){const t=new Date('2026-02-22T10:00:00+01:00').getTime(),e={d:document.getElementById('cd-days'),h:document.getElementById('cd-hours'),m:document.getElementById('cd-mins'),s:document.getElementById('cd-secs')};let p={};function pad(n){return String(n).padStart(2,'0')}function tick(el){el.classList.add('tick');setTimeout(()=>el.classList.remove('tick'),300)}function u(){const d=t-Date.now();if(d<=0){Object.values(e).forEach(x=>x.textContent='00');return}const v={d:Math.floor(d/864e5),h:Math.floor(d%864e5/36e5),m:Math.floor(d%36e5/6e4),s:Math.floor(d%6e4/1e3)};Object.keys(v).forEach(k=>{const s=pad(v[k]);if(p[k]!==s){e[k].textContent=s;tick(e[k]);p[k]=s}})}u();setInterval(u,1e3)})();

/* SCROLL REVEAL */
(function(){const i=document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');if(!('IntersectionObserver'in window)){i.forEach(e=>e.classList.add('visible'));return}const o=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -50px 0px'});i.forEach(e=>o.observe(e))})();

/* TIMELINE ANIMATION */
(function(){
  const items = document.querySelectorAll('.timeline-item');
  const fill = document.getElementById('timelineFill');
  const timeline = document.getElementById('timeline');
  if(!items.length || !fill || !timeline) return;

  // Staggered reveal of items
  const tObs = new IntersectionObserver(es => {
    es.forEach(e => {
      if(e.isIntersecting){
        const idx = Array.from(items).indexOf(e.target);
        setTimeout(() => e.target.classList.add('visible'), idx * 180);
        tObs.unobserve(e.target);
      }
    });
  }, {threshold:.15, rootMargin:'0px 0px -30px 0px'});
  items.forEach(i => tObs.observe(i));

  // Animated fill line on scroll
  function updateFill(){
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    if(rect.top > vh || rect.bottom < 0) return;
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height + vh * 0.3)));
    fill.style.height = (progress * 100) + '%';
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if(!ticking){ requestAnimationFrame(() => { updateFill(); ticking = false; }); ticking = true; }
  });
  updateFill();
})();

/* NAV */
(function(){const n=document.querySelector('.nav');let t=!1;window.addEventListener('scroll',()=>{if(!t){requestAnimationFrame(()=>{n.classList.toggle('scrolled',window.scrollY>60);t=!1});t=!0}})})();
(function(){const t=document.querySelector('.nav-toggle'),l=document.querySelector('.nav-links');t.addEventListener('click',()=>{const o=l.classList.toggle('open');t.setAttribute('aria-expanded',o)});l.querySelectorAll('a').forEach(a=>{a.addEventListener('click',()=>{l.classList.remove('open');t.setAttribute('aria-expanded','false')})})})();

/* PARALLAX - removed, hero redesigned */

/* ===== AUSSTELLER AUTH SYSTEM ===== */
(function(){
  const overlay = document.getElementById('modalOverlay');
  const openBtn = document.getElementById('openModalBtn');
  const closeBtn = document.getElementById('modalClose');
  const gateBox = document.getElementById('gateBox');
  const pricingSection = document.getElementById('pricingSection');
  const welcomeBar = document.getElementById('welcomeBar');
  const welcomeName = document.getElementById('welcomeName');
  const logoutBtn = document.getElementById('logoutBtn');
  const tabs = document.querySelectorAll('.modal-tab');
  const formReg = document.getElementById('formRegister');
  const formLogin = document.getElementById('formLogin');
  const formSuccess = document.getElementById('formSuccess');

  // Check if already logged in
  const stored = sessionStorage.getItem('mwf_user');
  if (stored) { unlockPricing(JSON.parse(stored).name); }

  // Open modal
  openBtn.addEventListener('click', () => { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; });

  // Close modal
  function closeModal() { overlay.classList.remove('active'); document.body.style.overflow = ''; }
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      formReg.classList.toggle('active', tab.dataset.tab === 'register');
      formLogin.classList.toggle('active', tab.dataset.tab === 'login');
      formSuccess.style.display = 'none';
      document.getElementById('regError').style.display = 'none';
      document.getElementById('loginError').style.display = 'none';
    });
  });

  // Register
  document.getElementById('regSubmit').addEventListener('click', () => {
    const fn = document.getElementById('regFirstName').value.trim();
    const ln = document.getElementById('regLastName').value.trim();
    const em = document.getElementById('regEmail').value.trim();
    const priv = document.getElementById('regPrivacy').checked;
    const err = document.getElementById('regError');

    if (!fn || !ln || !em) { err.textContent = 'Bitte füllen Sie alle Pflichtfelder aus.'; err.style.display = 'block'; return; }
    if (!em.includes('@') || !em.includes('.')) { err.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'; err.style.display = 'block'; return; }
    if (!priv) { err.textContent = 'Bitte akzeptieren Sie die Datenschutzerklärung.'; err.style.display = 'block'; return; }

    err.style.display = 'none';
    const name = fn + ' ' + ln;

    // Save to session
    sessionStorage.setItem('mwf_user', JSON.stringify({ name, email: em }));

    // Show success
    formReg.classList.remove('active');
    formSuccess.style.display = 'block';

    setTimeout(() => {
      closeModal();
      unlockPricing(name);
      formSuccess.style.display = 'none';
      formReg.classList.add('active');
    }, 1500);
  });

  // Login
  document.getElementById('loginSubmit').addEventListener('click', () => {
    const em = document.getElementById('loginEmail').value.trim();
    const err = document.getElementById('loginError');

    if (!em || !em.includes('@')) { err.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'; err.style.display = 'block'; return; }

    err.style.display = 'none';
    const name = em.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    sessionStorage.setItem('mwf_user', JSON.stringify({ name, email: em }));

    formLogin.classList.remove('active');
    formSuccess.style.display = 'block';

    setTimeout(() => {
      closeModal();
      unlockPricing(name);
      formSuccess.style.display = 'none';
      formLogin.classList.add('active');
    }, 1500);
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('mwf_user');
    pricingSection.classList.remove('unlocked');
    welcomeBar.classList.remove('visible');
    gateBox.style.display = '';
  });

  function unlockPricing(name) {
    gateBox.style.display = 'none';
    welcomeName.textContent = name;
    welcomeBar.classList.add('visible');
    pricingSection.classList.add('unlocked');
    setTimeout(() => {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
})();

/* ===== 2. CURSOR SPOTLIGHT ===== */
(function(){
  if(window.innerWidth < 769) return;
  const spot = document.getElementById('cursorSpotlight');
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; spot.classList.add('active'); });
  document.addEventListener('mouseleave', () => { spot.classList.remove('active'); });
  function animate() {
    cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08;
    spot.style.left = cx + 'px'; spot.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===== 7. SVG WATCH SELF-DRAW ===== */
(function(){
  const wrap = document.getElementById('watchDraw');
  if(!wrap) return;
  const svg = wrap.querySelector('.watch-draw');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) { svg.classList.add('drawn'); obs.unobserve(wrap); }
    });
  }, { threshold: 0.3 });
  obs.observe(wrap);
})();

/* ===== 10. MAGNET BUTTONS ===== */
(function(){
  if(window.innerWidth < 769) return;
  document.querySelectorAll('.btn-magnet').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.3) + 'px,' + (y * 0.3) + 'px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ===== PARTICLE WATCH ANIMATION ===== */
(function(){
  const canvas = document.getElementById('particleCanvas');
  if(!canvas || window.innerWidth < 600) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let startTime = 0;

  function resize(){
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Draw a gear/cog shape
  function drawGear(x, y, outerR, innerR, teeth, rotation, color, alpha){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    const step = Math.PI / teeth;
    for(let i = 0; i < teeth * 2; i++){
      const a = i * step;
      const r = i % 2 === 0 ? outerR : innerR;
      if(i === 0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r);
      else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
    }
    ctx.closePath();
    ctx.fillStyle = color.replace('ALPHA', alpha);
    ctx.fill();
    // Inner circle cutout
    ctx.beginPath();
    ctx.arc(0, 0, innerR * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(224,219,212,' + Math.min(alpha * 1.2, 0.9) + ')';
    ctx.fill();
    // Tiny center dot
    ctx.beginPath();
    ctx.arc(0, 0, innerR * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = color.replace('ALPHA', alpha * 0.6);
    ctx.fill();
    ctx.restore();
  }

  // Generate watch shape points
  function getWatchPoints(cx, cy, r){
    const pts = [];
    for(let i = 0; i < 80; i++){
      const a = (i/80)*Math.PI*2;
      pts.push({x:cx+Math.cos(a)*r, y:cy+Math.sin(a)*r});
    }
    for(let i = 0; i < 60; i++){
      const a = (i/60)*Math.PI*2;
      pts.push({x:cx+Math.cos(a)*(r*0.82), y:cy+Math.sin(a)*(r*0.82)});
    }
    for(let i = 0; i < 40; i++){
      const a = (i/40)*Math.PI*2;
      pts.push({x:cx+Math.cos(a)*(r*0.65), y:cy+Math.sin(a)*(r*0.65)});
    }
    for(let i = 0; i < 12; i++){
      const a = (i/12)*Math.PI*2 - Math.PI/2;
      for(let t = 0; t < 3; t++){
        const f = t/2;
        pts.push({x:cx+Math.cos(a)*(r*0.68+(r*0.1)*f), y:cy+Math.sin(a)*(r*0.68+(r*0.1)*f)});
      }
    }
    const ha = -Math.PI/3;
    for(let t = 0; t < 12; t++){
      pts.push({x:cx+Math.cos(ha)*r*0.45*(t/11), y:cy+Math.sin(ha)*r*0.45*(t/11)});
    }
    const ma = -Math.PI/2;
    for(let t = 0; t < 15; t++){
      pts.push({x:cx+Math.cos(ma)*r*0.6*(t/14), y:cy+Math.sin(ma)*r*0.6*(t/14)});
    }
    for(let t = 0; t < 6; t++){
      pts.push({x:cx+r*1.08+(t%3)*2, y:cy-4+t*1.6});
    }
    for(let i = 0; i < 5; i++){
      const a = (i/5)*Math.PI*2;
      pts.push({x:cx+Math.cos(a)*3, y:cy+Math.sin(a)*3});
    }
    return pts;
  }

  const watchR = Math.min(W, H) * 0.18;
  const watchCx = W * 0.5;
  const watchCy = H * 0.48;
  const targets = getWatchPoints(watchCx, watchCy, watchR);
  const N = targets.length;

  // Gear properties per particle
  const teethOptions = [5, 6, 7, 8];

  for(let i = 0; i < N; i++){
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.max(W, H) * 0.8 + Math.random() * 300;
    const isGold = Math.random() > 0.3;
    particles.push({
      x: watchCx + Math.cos(angle) * dist,
      y: watchCy + Math.sin(angle) * dist,
      startX: watchCx + Math.cos(angle) * dist,
      startY: watchCy + Math.sin(angle) * dist,
      tx: targets[i].x, ty: targets[i].y,
      fx: 0, fy: 0,
      size: 2 + Math.random() * 3,
      alpha: 0,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      teeth: teethOptions[Math.floor(Math.random() * teethOptions.length)],
      color: isGold ? 'hsla(35,75%,55%,ALPHA)' : 'hsla(215,45%,40%,ALPHA)',
      floatAngle: Math.random() * Math.PI * 2,
      floatSpeed: 0.2 + Math.random() * 0.5,
      floatRadius: 30 + Math.random() * 80,
    });
  }

  // Ambient floating gears
  for(let i = 0; i < 40; i++){
    const isGold = Math.random() > 0.4;
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      startX: 0, startY: 0,
      tx: 0, ty: 0,
      fx: Math.random() * W, fy: Math.random() * H,
      size: 1.5 + Math.random() * 3,
      alpha: 0,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      teeth: teethOptions[Math.floor(Math.random() * teethOptions.length)],
      color: isGold ? 'hsla(35,75%,55%,ALPHA)' : 'hsla(215,45%,40%,ALPHA)',
      floatAngle: Math.random() * Math.PI * 2,
      floatSpeed: 0.15 + Math.random() * 0.35,
      floatRadius: 40 + Math.random() * 100,
      ambient: true
    });
  }

  const FORM_DELAY = 2800;
  const FORM_DURATION = 2000;
  const HOLD_DURATION = 1800;
  const DISPERSE_DURATION = 2000;

  function easeOutCubic(t){ return 1 - Math.pow(1-t,3); }
  function easeInOutQuad(t){ return t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; }

  function animate(time){
    if(!startTime) startTime = time;
    const elapsed = time - startTime;
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Always spin
      p.rotation += p.rotSpeed;

      if(p.ambient){
        p.alpha = Math.min(p.alpha + 0.002, 0.12);
        p.floatAngle += p.floatSpeed * 0.008;
        p.x = p.fx + Math.cos(p.floatAngle) * p.floatRadius;
        p.y = p.fy + Math.sin(p.floatAngle) * p.floatRadius * 0.6;
      } else if(elapsed < FORM_DELAY){
        p.alpha = Math.min((elapsed/FORM_DELAY)*0.25, 0.25);
      } else if(elapsed < FORM_DELAY + FORM_DURATION){
        const t = easeOutCubic((elapsed-FORM_DELAY)/FORM_DURATION);
        p.x = p.startX + (p.tx - p.startX) * t;
        p.y = p.startY + (p.ty - p.startY) * t;
        p.alpha = 0.25 + t * 0.75;
        // Slow down spinning as they form
        p.rotSpeed *= 0.999;
      } else if(elapsed < FORM_DELAY + FORM_DURATION + HOLD_DURATION){
        p.x = p.tx + Math.sin(time*0.002+p.floatAngle)*0.8;
        p.y = p.ty + Math.cos(time*0.002+p.floatAngle)*0.8;
        p.alpha = 0.75 + Math.sin(time*0.004+p.floatAngle)*0.2;
      } else if(elapsed < FORM_DELAY + FORM_DURATION + HOLD_DURATION + DISPERSE_DURATION){
        const t = easeInOutQuad((elapsed-FORM_DELAY-FORM_DURATION-HOLD_DURATION)/DISPERSE_DURATION);
        if(!p.fx){
          p.fx = p.tx + (Math.random()-0.5)*W*0.9;
          p.fy = p.ty + (Math.random()-0.5)*H*0.9;
          p.rotSpeed = (Math.random()-0.5)*0.03;
        }
        p.x = p.tx + (p.fx-p.tx)*t;
        p.y = p.ty + (p.fy-p.ty)*t;
        p.alpha = 1 - t*0.75;
      } else {
        p.floatAngle += p.floatSpeed * 0.006;
        p.x = p.fx + Math.cos(p.floatAngle)*p.floatRadius;
        p.y = p.fy + Math.sin(p.floatAngle)*p.floatRadius*0.5;
        p.alpha = Math.max(0.06, p.alpha*0.9985);
      }

      // Draw gear
      const outerR = p.size;
      const innerR = p.size * 0.7;
      drawGear(p.x, p.y, outerR, innerR, p.teeth, p.rotation, p.color, p.alpha);
    });

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

/* ===== MESSETERMINE – AUTO DATE LOGIC ===== */
(function(){
  const cards = document.querySelectorAll('.termin-card[data-date]');
  if(!cards.length) return;
  const now = new Date();
  now.setHours(0,0,0,0);
  let nextFound = false;
  cards.forEach(card => {
    const d = new Date(card.dataset.date + 'T00:00:00');
    if(d < now){
      card.classList.add('is-past');
    } else if(!nextFound){
      card.classList.add('is-next');
      nextFound = true;
    }
  });
})();

/* ===== FAQ ACCORDION ===== */
(function(){
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded','false');
      });
      // Toggle clicked
      if(!isOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });
})();

/* ===== LANGUAGE SWITCHER ===== */
(function(){
  const btns = document.querySelectorAll('.lang-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();

/* ===== SCROLL PROGRESS BAR ===== */
(function(){
  const bar = document.getElementById('scrollProgress');
  if(!bar) return;
  let ticking = false;
  function update(){
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', () => {
    if(!ticking){ requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; }
  });
  update();
})();

/* ===== CUSTOM CURSOR – DOT ONLY (Desktop) ===== */
(function(){
  if(window.innerWidth < 1024 || 'ontouchstart' in window) return;
  const dot = document.getElementById('cursorDot');
  if(!dot) return;
  document.body.classList.add('custom-cursor-active');
  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    dot.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
})();

/* ===== PARALLAX (Desktop only) ===== */
(function(){
  if(window.innerWidth < 768) return;
  const heroBg = document.querySelector('.hero-bg');
  let ticking = false;
  function update(){
    const sy = window.scrollY;
    if(heroBg && sy < window.innerHeight * 1.5){
      heroBg.style.transform = 'translate3d(0,' + (sy * 0.3) + 'px,0)';
    }
  }
  window.addEventListener('scroll', () => {
    if(!ticking){ requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; }
  });
})();

/* ===== 3D TILT ON CARDS (Desktop only) ===== */
(function(){
  if(window.innerWidth < 1024) return;
  document.querySelectorAll('.info-card-glass, .termin-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transition = 'none';
      card.style.transform = 'perspective(800px) rotateX(' + (y * -5) + 'deg) rotateY(' + (x * 5) + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .5s var(--ease)';
      card.style.transform = '';
    });
  });
})();

/* ===== GSAP SCROLL ANIMATIONS ===== */
(function(){
  if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('gsap-ready');

  // Reveal: fade up
  gsap.utils.toArray('.reveal').forEach(el => {
    if(el.closest('.hero') || el.classList.contains('visible')) return;
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // Reveal: slide left
  gsap.utils.toArray('.reveal-left').forEach(el => {
    if(el.classList.contains('visible')) return;
    gsap.fromTo(el,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // Reveal: slide right
  gsap.utils.toArray('.reveal-right').forEach(el => {
    if(el.classList.contains('visible')) return;
    gsap.fromTo(el,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // Reveal: scale
  gsap.utils.toArray('.reveal-scale').forEach(el => {
    if(el.classList.contains('visible')) return;
    gsap.fromTo(el,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  // Termin cards – staggered
  const terminCards = gsap.utils.toArray('.termin-card');
  if(terminCards.length){
    gsap.fromTo(terminCards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: '.termine-grid', start: 'top 82%', once: true }
      }
    );
  }

  // FAQ items – staggered
  const faqItems = gsap.utils.toArray('.faq-item');
  if(faqItems.length){
    gsap.fromTo(faqItems,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.faq-list', start: 'top 82%', once: true }
      }
    );
  }

  // Footer columns – staggered
  const footerCols = gsap.utils.toArray('.footer-col');
  if(footerCols.length){
    gsap.fromTo(footerCols,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.footer-new-inner', start: 'top 92%', once: true }
      }
    );
  }

  // Timeline items – staggered with node animation
  const timelineItems = gsap.utils.toArray('.timeline-item');
  if(timelineItems.length){
    timelineItems.forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
          delay: i * 0.18,
          scrollTrigger: { trigger: item, start: 'top 88%', once: true },
          onComplete: () => { item.classList.add('visible'); }
        }
      );
    });
  }

  // Section header parallax (subtle offset on scroll)
  if(window.innerWidth >= 768){
    gsap.utils.toArray('#termine .section-header, #faq .section-header, #location .section-header').forEach(header => {
      gsap.to(header, {
        y: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: header.closest('.section'),
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: 0.5
        }
      });
    });
  }
})();

/* ===== VIDEO HERO FALLBACK ===== */
(function(){
  const video = document.querySelector('.hero-video');
  const wrap = document.getElementById('heroVideoWrap');
  if(!video || !wrap) return;
  video.addEventListener('canplaythrough', () => { wrap.classList.add('loaded'); });
  video.addEventListener('error', () => { wrap.style.display = 'none'; });
  setTimeout(() => { if(!wrap.classList.contains('loaded')) wrap.style.display = 'none'; }, 5000);
})();

/* ===== 1. CINEMATIC HERO – Letter-by-letter reveal ===== */
(function(){
  if(typeof gsap === 'undefined') return;
  const hero = document.getElementById('hero');
  const banner = document.getElementById('heroBanner');
  if(!hero || !banner) return;

  hero.classList.add('hero-cinematic');

  // Split logo text into letters
  function splitIntoLetters(el){
    const text = el.textContent;
    el.textContent = '';
    text.split('').forEach(ch => {
      const span = document.createElement('span');
      span.className = 'hero-letter';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      el.appendChild(span);
    });
  }

  const logoMunich = banner.querySelector('.logo-munich');
  const logoFair = banner.querySelector('.logo-fair');
  if(logoMunich) splitIntoLetters(logoMunich);
  if(logoFair) splitIntoLetters(logoFair);

  // Typewriter for date
  const heroDate = document.querySelector('.hero-date');
  let dateText = '';
  if(heroDate){
    dateText = heroDate.textContent;
    heroDate.textContent = '';
    heroDate.style.opacity = '1';
    heroDate.style.transform = 'none';
  }

  // After loader hides, start cinematic sequence
  function startCinematic(){
    const tl = gsap.timeline({ delay: 0.3 });

    // Banner fades in
    tl.to(banner, { opacity: 1, duration: 0.6, ease: 'power2.out' });

    // Logo letters reveal
    const munichLetters = banner.querySelectorAll('.logo-munich .hero-letter');
    const fairLetters = banner.querySelectorAll('.logo-fair .hero-letter');

    tl.to(munichLetters, {
      opacity: 1, y: 0, rotateX: 0,
      duration: 0.5, stagger: 0.04, ease: 'back.out(1.5)'
    }, '-=0.2');

    // W + A SVG area handled by existing code, just show it
    const logoWatch = banner.querySelector('.logo-watch');
    if(logoWatch){
      tl.fromTo(logoWatch,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );
    }

    tl.to(fairLetters, {
      opacity: 1, y: 0, rotateX: 0,
      duration: 0.5, stagger: 0.04, ease: 'back.out(1.5)'
    }, '-=0.4');

    // Banner line + badge
    const line = banner.querySelector('.hero-banner-line');
    const badge = banner.querySelector('.hero-banner-badge');
    if(line) tl.to(line, { opacity: 0.5, duration: 0.6 }, '-=0.1');
    if(badge) tl.to(badge, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

    // Typewriter date
    if(heroDate && dateText){
      tl.add(() => {
        let i = 0;
        const interval = setInterval(() => {
          if(i < dateText.length){
            heroDate.textContent += dateText[i];
            i++;
          } else { clearInterval(interval); }
        }, 25);
      }, '-=0.1');
    }

    // Countdown
    const countdown = document.querySelector('.countdown');
    if(countdown){
      tl.to(countdown, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '+=0.3');
    }

    // Scroll indicator
    const scrollInd = document.getElementById('heroScrollIndicator');
    if(scrollInd){
      tl.to(scrollInd, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '+=0.2');
    }
  }

  // Hook into loader completion
  const origLoad = window.addEventListener;
  const loaderCheck = setInterval(() => {
    const loader = document.getElementById('loader');
    if(loader && loader.classList.contains('hidden')){
      clearInterval(loaderCheck);
      setTimeout(startCinematic, 200);
    }
  }, 100);

  // Hero fade-out on scroll
  if(typeof ScrollTrigger !== 'undefined'){
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: self => {
        const p = self.progress;
        const heroContent = hero.querySelector('.hero-banner');
        const heroIcons = document.getElementById('heroIcons');
        const heroInfo = hero.querySelector('.hero-info');
        const heroCW = hero.querySelector('.hero-countdown-wrap');
        const scrollInd = document.getElementById('heroScrollIndicator');
        const fade = Math.max(0, 1 - p * 2.5);
        const ty = p * 80;
        [heroContent, heroIcons, heroInfo, heroCW].forEach(el => {
          if(el){
            el.style.opacity = fade;
            el.style.transform = 'translateY(-' + ty + 'px)';
          }
        });
        if(scrollInd) scrollInd.style.opacity = Math.max(0, 1 - p * 5);
      }
    });
  }
})();

/* ===== 3. REVEAL-ON-SCROLL TEXT EFFECTS ===== */
(function(){
  if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // "Alle Termine 2026" — word-by-word stagger
  const termineTitle = document.getElementById('termine-title');
  if(termineTitle){
    const html = termineTitle.innerHTML;
    const wrapped = html.replace(/(\S+)/g, '<span class="reveal-word">$1</span>');
    termineTitle.innerHTML = wrapped;
    const words = termineTitle.querySelectorAll('.reveal-word');
    gsap.to(words, {
      opacity: 1, y: 0,
      duration: 0.6, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: termineTitle, start: 'top 85%', once: true }
    });
  }

  // "Häufige Fragen" — horizontal wipe
  const faqTitle = document.getElementById('faq-title');
  if(faqTitle){
    const spans = faqTitle.querySelectorAll('.orange');
    // Wipe the whole title
    faqTitle.style.clipPath = 'inset(0 100% 0 0)';
    gsap.to(faqTitle, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2, ease: 'power3.inOut',
      scrollTrigger: { trigger: faqTitle, start: 'top 85%', once: true }
    });
  }

  // "Anfahrt & Location" — letters drop from above
  const anfahrtTitle = document.getElementById('anfahrt-title');
  if(anfahrtTitle){
    const text = anfahrtTitle.innerHTML;
    // Wrap each non-tag character in a span
    let result = '';
    let inTag = false;
    for(let i = 0; i < text.length; i++){
      if(text[i] === '<') inTag = true;
      if(inTag){
        result += text[i];
        if(text[i] === '>') inTag = false;
      } else if(text[i] === ' '){
        result += ' ';
      } else {
        result += '<span class="reveal-letter">' + text[i] + '</span>';
      }
    }
    anfahrtTitle.innerHTML = result;
    const letters = anfahrtTitle.querySelectorAll('.reveal-letter');
    gsap.to(letters, {
      opacity: 1, y: 0,
      duration: 0.4, stagger: 0.03, ease: 'bounce.out',
      scrollTrigger: { trigger: anfahrtTitle, start: 'top 85%', once: true }
    });
  }

  // "Tickets sichern" — scale burst
  const ticketsTitle = document.getElementById('tickets-title');
  if(ticketsTitle){
    gsap.fromTo(ticketsTitle,
      { opacity: 0, scale: 0.6, rotateX: -20 },
      { opacity: 1, scale: 1, rotateX: 0,
        duration: 0.9, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: ticketsTitle, start: 'top 85%', once: true }
      }
    );
  }

  // "Aussteller werden" — slide from left
  const ausstellerTitle = document.getElementById('aussteller-title');
  if(ausstellerTitle){
    gsap.fromTo(ausstellerTitle,
      { opacity: 0, x: -80 },
      { opacity: 1, x: 0,
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: ausstellerTitle, start: 'top 85%', once: true }
      }
    );
  }

  // "Ihr Tag auf der Messe" — word stagger
  const tagesTitle = document.getElementById('tagesablauf-title');
  if(tagesTitle){
    const html = tagesTitle.innerHTML;
    const wrapped = html.replace(/(\S+)/g, '<span class="reveal-word">$1</span>');
    tagesTitle.innerHTML = wrapped;
    const words = tagesTitle.querySelectorAll('.reveal-word');
    gsap.to(words, {
      opacity: 1, y: 0,
      duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: tagesTitle, start: 'top 85%', once: true }
    });
  }
})();

/* ===== 4. LENIS SMOOTH SCROLL ===== */
(function(){
  if(typeof Lenis === 'undefined' || window.innerWidth < 1024) return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: function(t){ return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2
  });

  // Integrate Lenis with GSAP ScrollTrigger
  if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'){
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
})();
