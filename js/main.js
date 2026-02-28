/* ===== ZENTRALE MESSETERMINE ===== */
const MESSE_TERMINE = [
  { date: '2026-02-22', start: '07:00', end: '17:00', weekday: 'Sonntag', day: '22', month: 'Februar', year: '2026', location: 'Ballhausforum Unterschleißheim' },
  { date: '2026-03-29', start: '08:00', end: '17:00', weekday: 'Sonntag', day: '29', month: 'März', year: '2026', location: 'Ballhausforum Unterschleißheim' },
  { date: '2026-05-17', start: '08:00', end: '17:00', weekday: 'Sonntag', day: '17', month: 'Mai', year: '2026', location: 'Ballhausforum Unterschleißheim' },
  { date: '2026-06-28', start: '08:00', end: '17:00', weekday: 'Sonntag', day: '28', month: 'Juni', year: '2026', location: 'Ballhausforum Unterschleißheim' },
];

function getNextTermin() {
  const now = new Date();
  for (const t of MESSE_TERMINE) {
    const end = new Date(t.date + 'T' + t.end + ':00');
    if (end > now) return t;
  }
  return null;
}

function formatTerminShort(t) {
  return t.day + '. ' + t.month.substring(0, 3) + ' ' + t.year;
}

function formatTerminHero(t) {
  return t.weekday + ', ' + t.day + '. ' + t.month + ' ' + t.year
    + ' \u2003\u00B7\u2003' + t.start + ' \u2013 ' + t.end + ' Uhr'
    + ' \u2003\u00B7\u2003' + t.location;
}

/* ===== DYNAMISCHE TERMIN-AKTUALISIERUNG ===== */
(function updateAllTerminElements() {
  const next = getNextTermin();

  // Hero-Datum
  const heroDate = document.querySelector('.hero-date');
  if (heroDate) {
    heroDate.textContent = next
      ? formatTerminHero(next)
      : 'Neue Termine folgen in Kürze';
  }

  // Ticket Badge (Desktop)
  const badgeDate = document.querySelector('.ticket-badge-date');
  if (badgeDate) {
    badgeDate.textContent = next ? formatTerminShort(next) : '';
  }
  const ticketBadge = document.getElementById('ticketBadge');
  if (ticketBadge && !next) ticketBadge.style.display = 'none';

  // Ticket Banner (Mobile)
  const mobileBanner = document.querySelector('.ticket-banner-mobile');
  if (mobileBanner) {
    const mobileDate = mobileBanner.querySelector('span:first-child');
    if (mobileDate) mobileDate.textContent = next ? formatTerminShort(next) : '';
    if (!next) mobileBanner.style.display = 'none';
  }

  // Ticket-Section Daten
  const ticketDates = document.querySelectorAll('.ticket-date');
  if (next && ticketDates.length) {
    ticketDates[0].innerHTML = next.weekday + ', ' + next.day + '. ' + next.month + ' ' + next.year
      + ' &ensp;|&ensp; ' + next.start + ' \u2013 ' + next.end + ' Uhr';
    if (ticketDates[1]) {
      ticketDates[1].innerHTML = next.weekday + ', ' + next.day + '. ' + next.month + ' ' + next.year
        + ' &ensp;|&ensp; 10:30 \u2013 ' + next.end + ' Uhr';
    }
  }

  // Schema.org aktualisieren
  const schemaScript = document.querySelector('script[type="application/ld+json"]');
  if (schemaScript && next) {
    try {
      const schema = JSON.parse(schemaScript.textContent);
      schema.startDate = next.date + 'T' + next.start + ':00+01:00';
      schema.endDate = next.date + 'T' + next.end + ':00+01:00';
      schemaScript.textContent = JSON.stringify(schema, null, 2);
    } catch(e) {}
  }

  // Termin-Karten: vergangene ausblenden, nächste markieren
  const cards = document.querySelectorAll('.termin-card[data-date]');
  const now = new Date();
  cards.forEach(card => {
    const endTime = card.dataset.date + 'T17:00:00';
    const cardEnd = new Date(endTime);
    card.classList.remove('is-past', 'is-next');
    if (cardEnd < now) {
      card.style.display = 'none';
    } else if (next && card.dataset.date === next.date) {
      card.classList.add('is-next');
    }
  });

  // Wenn alle Termine vorbei: Hinweis in Termine-Sektion
  const termineGrid = document.getElementById('termineGrid');
  if (termineGrid && !next) {
    const visibleCards = termineGrid.querySelectorAll('.termin-card:not([style*="display: none"])');
    if (visibleCards.length === 0) {
      const notice = document.createElement('div');
      notice.className = 'termin-notice reveal';
      notice.innerHTML = '<p>Neue Termine folgen in Kürze.</p>';
      notice.style.cssText = 'text-align:center;padding:3rem 1rem;font-family:var(--font-display);font-size:1.3rem;color:var(--text-mid);grid-column:1/-1;';
      termineGrid.appendChild(notice);
    }
  }
})();

/* ===== LOADER ===== */
window.addEventListener('load',()=>{setTimeout(()=>{document.getElementById('loader').classList.add('hidden');animateHero();setTimeout(animateStickyNote,1200)},2200)});

/* ===== TICKET BADGE ===== */
function animateStickyNote(){
  const badge = document.getElementById('ticketBadge');
  if(!badge) return;
  if(badge.style.display === 'none') return;
  badge.classList.add('visible');
}

/* ===== HERO ANIMATION ===== */
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

/* ===== NAVY BAND POSITIONING ===== */
(function(){
  function positionBand(){
    const banner=document.getElementById('heroBanner');
    const band=document.querySelector('.hero-banner-band');
    if(!banner||!band)return;
    const hero=banner.closest('.hero');
    if(!hero)return;
    const heroRect=hero.getBoundingClientRect();
    const bannerRect=banner.getBoundingClientRect();
    const bannerCenter=bannerRect.top+bannerRect.height/2-heroRect.top;
    const bandH=bannerRect.height*0.35;
    band.style.top=(bannerCenter-bandH/2)+'px';
    band.style.height=bandH+'px';
  }
  window.addEventListener('load',()=>setTimeout(positionBand,100));
  window.addEventListener('resize',positionBand);
})();

/* ===== COUNTDOWN ===== */
(function(){
  const next = getNextTermin();
  const countdownWrap = document.querySelector('.hero-countdown-wrap');
  if (!next) {
    // Alle Termine vorbei: Countdown durch Hinweis ersetzen
    if (countdownWrap) {
      countdownWrap.innerHTML = '<p style="font-family:var(--font-display);font-size:1.2rem;color:var(--text-mid);text-align:center;opacity:0;" data-hero-anim>Neue Termine folgen in Kürze</p>';
    }
    return;
  }
  const t = new Date(next.date + 'T' + next.start + ':00+01:00').getTime();
  const e={d:document.getElementById('cd-days'),h:document.getElementById('cd-hours'),m:document.getElementById('cd-mins'),s:document.getElementById('cd-secs')};
  let p={};
  function pad(n){return String(n).padStart(2,'0')}
  function tick(el){el.classList.add('tick');setTimeout(()=>el.classList.remove('tick'),300)}
  function u(){
    const d=t-Date.now();
    if(d<=0){Object.values(e).forEach(x=>x.textContent='00');return}
    const v={d:Math.floor(d/864e5),h:Math.floor(d%864e5/36e5),m:Math.floor(d%36e5/6e4),s:Math.floor(d%6e4/1e3)};
    Object.keys(v).forEach(k=>{const s=pad(v[k]);if(p[k]!==s){e[k].textContent=s;tick(e[k]);p[k]=s}});
  }
  u();setInterval(u,1e3);
})();

/* ===== SCROLL REVEAL ===== */
(function(){const i=document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');if(!('IntersectionObserver'in window)){i.forEach(e=>e.classList.add('visible'));return}const o=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -50px 0px'});i.forEach(e=>o.observe(e))})();

/* ===== TIMELINE ANIMATION ===== */
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
    fill.style.width = (progress * 100) + '%';
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if(!ticking){ requestAnimationFrame(() => { updateFill(); ticking = false; }); ticking = true; }
  });
  updateFill();
})();

/* ===== NAVIGATION ===== */
(function(){const n=document.querySelector('.nav');let t=!1;window.addEventListener('scroll',()=>{if(!t){requestAnimationFrame(()=>{n.classList.toggle('scrolled',window.scrollY>60);t=!1});t=!0}})})();
(function(){const t=document.querySelector('.nav-toggle'),l=document.querySelector('.nav-links');t.addEventListener('click',()=>{const o=l.classList.toggle('open');t.setAttribute('aria-expanded',o)});l.querySelectorAll('a').forEach(a=>{a.addEventListener('click',()=>{l.classList.remove('open');t.setAttribute('aria-expanded','false')})})})();

/* ===== CURSOR SPOTLIGHT ===== */
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

/* ===== SVG WATCH SELF-DRAW ===== */
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

/* ===== MAGNET BUTTONS ===== */
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

/* ===== MESSETERMINE – AUTO DATE LOGIC (now handled by central MESSE_TERMINE) ===== */

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

  // Info cards – asymmetric slide-in
  const infoFeatured = document.querySelector('.info-card-featured');
  const infoRight = gsap.utils.toArray('.info-card-glass:not(.info-card-featured)');
  if(infoFeatured){
    gsap.fromTo(infoFeatured,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.info-grid', start: 'top 82%', once: true }
      }
    );
  }
  if(infoRight.length){
    gsap.fromTo(infoRight,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', stagger: 0.2,
        scrollTrigger: { trigger: '.info-grid', start: 'top 82%', once: true }
      }
    );
  }

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

/* ===== CINEMATIC HERO – Letter-by-letter reveal ===== */
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

/* ===== REVEAL-ON-SCROLL TEXT EFFECTS ===== */
(function(){
  if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // "Alle Termine 2026" — word-by-word stagger
  const termineTitle = document.getElementById('termine-title');
  if(termineTitle){
    const html = termineTitle.innerHTML;
    const wrapped = html.replace(/<[^>]+>|(\S+)/g, function(m,word){ return word ? '<span class="reveal-word">'+word+'</span>' : m; });
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
    const wrapped = html.replace(/<[^>]+>|(\S+)/g, function(m,word){ return word ? '<span class="reveal-word">'+word+'</span>' : m; });
    tagesTitle.innerHTML = wrapped;
    const words = tagesTitle.querySelectorAll('.reveal-word');
    gsap.to(words, {
      opacity: 1, y: 0,
      duration: 0.5, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: tagesTitle, start: 'top 85%', once: true }
    });
  }
})();

/* ===== LENIS SMOOTH SCROLL ===== */
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
