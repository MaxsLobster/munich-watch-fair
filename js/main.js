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

/* Zentrale Ziel-URLs (Mobile App-Bar) */
const TICKETS_URL = 'https://eventim-light.com/de/a/61256a72a91dc01b4b932fe4/';
const MAPS_ROUTE_URL = 'https://www.google.com/maps/dir/?api=1&destination=Ballhausforum+Unterschlei%C3%9Fheim%2C+Am+Haingraben+33%2C+85716+Unterschlei%C3%9Fheim';

/* ===== I18N TRANSLATION TABLES ===== */
let currentLang = 'de';

const I18N_MONTHS = {
  de: {Januar:'Januar',Februar:'Februar','März':'März',April:'April',Mai:'Mai',Juni:'Juni',Juli:'Juli',August:'August',September:'September',Oktober:'Oktober',November:'November',Dezember:'Dezember'},
  en: {Januar:'January',Februar:'February','März':'March',April:'April',Mai:'May',Juni:'June',Juli:'July',August:'August',September:'September',Oktober:'October',November:'November',Dezember:'December'},
  it: {Januar:'Gennaio',Februar:'Febbraio','März':'Marzo',April:'Aprile',Mai:'Maggio',Juni:'Giugno',Juli:'Luglio',August:'Agosto',September:'Settembre',Oktober:'Ottobre',November:'Novembre',Dezember:'Dicembre'}
};

const I18N_WEEKDAYS = {
  de: {Sonntag:'Sonntag',Montag:'Montag',Dienstag:'Dienstag',Mittwoch:'Mittwoch',Donnerstag:'Donnerstag',Freitag:'Freitag',Samstag:'Samstag'},
  en: {Sonntag:'Sunday',Montag:'Monday',Dienstag:'Tuesday',Mittwoch:'Wednesday',Donnerstag:'Thursday',Freitag:'Friday',Samstag:'Saturday'},
  it: {Sonntag:'Domenica',Montag:'Lunedì',Dienstag:'Martedì',Mittwoch:'Mercoledì',Donnerstag:'Giovedì',Freitag:'Venerdì',Samstag:'Sabato'}
};

const I18N_STRINGS = {
  de: { uhr:'Uhr', noTermin:'Neue Termine folgen in Kürze', tagesWithDate:'Von früh bis spät – so läuft der {d} ab.', tagesGeneric:'Von früh bis spät – so läuft Ihr Messetag ab.', barDays:'Noch {n} Tage', barDay:'Noch 1 Tag', barToday:'Heute geöffnet bis {t}', barTickets:'Tickets ab €20', barRoute:'Route starten' },
  en: { uhr:'', noTermin:'New dates coming soon', tagesWithDate:'From early to late – here is how {d} unfolds.', tagesGeneric:'From early to late – here is how your fair day unfolds.', barDays:'{n} days to go', barDay:'1 day to go', barToday:'Open today until {t}', barTickets:'Tickets from €20', barRoute:'Start route' },
  it: { uhr:'', noTermin:'Nuove date in arrivo', tagesWithDate:'Dall\'alba al tramonto – ecco come si svolge il {d}.', tagesGeneric:'Dall\'alba al tramonto – ecco la vostra giornata fieristica.', barDays:'Mancano {n} giorni', barDay:'Manca 1 giorno', barToday:'Aperto oggi fino alle {t}', barTickets:'Biglietti da €20', barRoute:'Avvia il percorso' }
};

function trMonth(m, lang) { return (I18N_MONTHS[lang] || I18N_MONTHS.de)[m] || m; }
function trWeekday(w, lang) { return (I18N_WEEKDAYS[lang] || I18N_WEEKDAYS.de)[w] || w; }

function formatTerminShort(t, lang) {
  lang = lang || currentLang;
  var ms = t.month.substring(0, 3);
  var map = {de:{Jan:'Jan',Feb:'Feb','Mär':'Mär',Apr:'Apr',Mai:'Mai',Jun:'Jun',Jul:'Jul',Aug:'Aug',Sep:'Sep',Okt:'Okt',Nov:'Nov',Dez:'Dez'},en:{Jan:'Jan',Feb:'Feb','Mär':'Mar',Apr:'Apr',Mai:'May',Jun:'Jun',Jul:'Jul',Aug:'Aug',Sep:'Sep',Okt:'Oct',Nov:'Nov',Dez:'Dec'},it:{Jan:'Gen',Feb:'Feb','Mär':'Mar',Apr:'Apr',Mai:'Mag',Jun:'Giu',Jul:'Lug',Aug:'Ago',Sep:'Set',Okt:'Ott',Nov:'Nov',Dez:'Dic'}};
  return t.day + '. ' + ((map[lang] || map.de)[ms] || ms) + ' ' + t.year;
}

function formatTerminLong(t, lang) {
  lang = lang || currentLang;
  return t.day + '. ' + trMonth(t.month, lang) + ' ' + t.year;
}

function formatTerminHero(t, lang) {
  lang = lang || currentLang;
  var s = I18N_STRINGS[lang] || I18N_STRINGS.de;
  var timeStr = t.start + ' \u2013 ' + t.end + (s.uhr ? ' ' + s.uhr : '');
  return trWeekday(t.weekday, lang) + ', ' + t.day + '. ' + trMonth(t.month, lang) + ' ' + t.year
    + ' \u2003\u00B7\u2003' + timeStr
    + ' \u2003\u00B7\u2003' + t.location;
}

/* ===== DYNAMISCHE TERMIN-AKTUALISIERUNG ===== */
function updateAllTerminElements() {
  var lang = currentLang;
  var s = I18N_STRINGS[lang] || I18N_STRINGS.de;
  var next = getNextTermin();

  // Hero-Datum
  var heroDate = document.querySelector('.hero-date');
  if (heroDate) {
    heroDate.textContent = next ? formatTerminHero(next, lang) : s.noTermin;
  }

  // Ticket Badge (Desktop)
  var badgeDate = document.querySelector('.ticket-badge-date');
  if (badgeDate) {
    badgeDate.textContent = next ? formatTerminShort(next, lang) : '';
  }
  var ticketBadge = document.getElementById('ticketBadge');
  if (ticketBadge && !next) ticketBadge.style.display = 'none';

  // Mobile App-Bar (Chip + CTA + Route, kontextsensitiv)
  var mobileBar = document.querySelector('.ticket-banner-mobile');
  if (mobileBar) {
    var barChip = document.getElementById('mobileBarChip');
    var barCta = document.getElementById('mobileBarCta');
    var barNow = new Date();
    var todayStr = barNow.getFullYear() + '-' + ('0' + (barNow.getMonth() + 1)).slice(-2) + '-' + ('0' + barNow.getDate()).slice(-2);
    var isMesseTag = !!next && next.date === todayStr;
    mobileBar.classList.toggle('is-eventday', isMesseTag);
    mobileBar.classList.toggle('no-chip', !next);
    if (barChip) {
      if (!next) {
        barChip.textContent = '';
      } else if (isMesseTag) {
        barChip.textContent = s.barToday.replace('{t}', next.end);
      } else {
        var restTage = Math.ceil((new Date(next.date + 'T00:00:00') - barNow) / 86400000);
        barChip.textContent = restTage === 1 ? s.barDay : s.barDays.replace('{n}', restTage);
      }
    }
    if (barCta) {
      if (isMesseTag) {
        barCta.textContent = s.barRoute;
        barCta.href = MAPS_ROUTE_URL;
      } else {
        barCta.textContent = s.barTickets;
        barCta.href = TICKETS_URL;
      }
    }
  }

  // Ticket-Section Daten
  var ticketDates = document.querySelectorAll('.ticket-date');
  if (next && ticketDates.length) {
    var uhrStr = s.uhr ? ' ' + s.uhr : '';
    ticketDates[0].innerHTML = trWeekday(next.weekday, lang) + ', ' + next.day + '. ' + trMonth(next.month, lang) + ' ' + next.year
      + ' &ensp;|&ensp; ' + next.start + ' \u2013 ' + next.end + uhrStr;
    if (ticketDates[1]) {
      ticketDates[1].innerHTML = trWeekday(next.weekday, lang) + ', ' + next.day + '. ' + trMonth(next.month, lang) + ' ' + next.year
        + ' &ensp;|&ensp; 10:30 \u2013 ' + next.end + uhrStr;
    }
  }

  // CTA-Banner Datum
  var ctaDate = document.getElementById('ctaDate');
  if (ctaDate) {
    ctaDate.textContent = next
      ? formatTerminLong(next, lang) + ' \u00B7 ' + next.location
      : s.noTermin;
  }

  // Tagesablauf Subtitle
  var tagesablaufSub = document.getElementById('tagesablaufSubtitle');
  if (tagesablaufSub) {
    tagesablaufSub.textContent = next
      ? s.tagesWithDate.replace('{d}', formatTerminLong(next, lang))
      : s.tagesGeneric;
  }

  // Termin-Karten: vergangene ausblenden, nächste markieren
  var cards = document.querySelectorAll('.termin-card[data-date]');
  var now = new Date();
  cards.forEach(function(card) {
    var cardEnd = new Date(card.dataset.date + 'T17:00:00');
    card.classList.remove('is-past', 'is-next');
    if (cardEnd < now) {
      card.style.display = 'none';
    } else if (next && card.dataset.date === next.date) {
      card.classList.add('is-next');
    }
  });

  // Wenn alle Termine vorbei: Hinweis in Termine-Sektion
  var termineGrid = document.getElementById('termineGrid');
  if (termineGrid && !next) {
    var visibleCards = termineGrid.querySelectorAll('.termin-card:not([style*="display: none"])');
    if (visibleCards.length === 0 && !termineGrid.querySelector('.termin-notice')) {
      var notice = document.createElement('div');
      notice.className = 'termin-notice reveal';
      notice.innerHTML = '<p>' + s.noTermin + '.</p>';
      notice.style.cssText = 'text-align:center;padding:3rem 1rem;font-family:var(--font-display);font-size:1.3rem;color:var(--text-mid);grid-column:1/-1;';
      termineGrid.appendChild(notice);
    }
  }

  // Meta description aktualisieren (nur DE fuer SEO)
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && next) {
    metaDesc.setAttribute('content',
      'Europas führende Uhrenbörse seit 1989. Luxusuhren, Sammleruhren, Schmuck & Accessoires. 9× im Jahr im Ballhausforum Unterschleißheim bei München. Nächster Termin: ' + formatTerminLong(next, 'de') + '.');
  }
}
updateAllTerminElements();

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
      countdownWrap.innerHTML = '<p style="font-family:var(--font-display);font-size:1.2rem;color:var(--text-mid);text-align:center;opacity:0;" data-hero-anim data-i18n-de="Neue Termine folgen in Kürze" data-i18n-en="New dates coming soon" data-i18n-it="Nuove date in arrivo">Neue Termine folgen in Kürze</p>';
    }
    return;
  }
  const t = new Date(next.date + 'T' + next.start + ':00').getTime();
  const e={d:document.getElementById('cd-days'),h:document.getElementById('cd-hours'),m:document.getElementById('cd-mins'),s:document.getElementById('cd-secs')};
  let p={};

  // Chronographen-Zeiger der vier Subdials (Null-Guards: Fallback-HTML hat keine .cd-hand)
  function handOf(el){
    if(!el) return null;
    const dial = el.closest('.countdown-dial');
    return dial ? dial.querySelector('.cd-hand') : null;
  }
  const hands={d:handOf(e.d),h:handOf(e.h),m:handOf(e.m),s:handOf(e.s)};
  // Kumulative Rotation pro Zeiger: der Zähler wächst nur, damit der Zeiger beim
  // Wrap (z.B. Sek 0 -> 59) vorwärts über 360° weiterdreht statt rückwärts zu springen.
  const rot={d:0,h:0,m:0,s:0};
  let handsInit=false;
  function setHands(target){
    Object.keys(hands).forEach(k=>{
      const hand=hands[k];
      if(!hand) return;
      const cur=((rot[k]%360)+360)%360;
      rot[k]+=((target[k]-cur)%360+360)%360; // nur vorwärts drehen
      if(!handsInit){hand.style.transition='none'}
      hand.style.transform='rotate('+rot[k]+'deg)';
      if(!handsInit){hand.getBoundingClientRect();hand.style.transition=''} // Startstellung ohne Anfahr-Animation
    });
    handsInit=true;
  }

  function pad(n){return String(n).padStart(2,'0')}
  function tick(el){el.classList.add('tick');setTimeout(()=>el.classList.remove('tick'),300)}
  function u(){
    const d=t-Date.now();
    if(d<=0){Object.values(e).forEach(x=>x.textContent='00');setHands({d:0,h:0,m:0,s:0});return}
    const v={d:Math.floor(d/864e5),h:Math.floor(d%864e5/36e5),m:Math.floor(d%36e5/6e4),s:Math.floor(d%6e4/1e3)};
    Object.keys(v).forEach(k=>{const s=pad(v[k]);if(p[k]!==s){e[k].textContent=s;tick(e[k]);p[k]=s}});
    // Deadbeat-Tick: Sek/Min 6° pro Schritt, Std 15° (24h-Skala), Tage 12° (30-Tage-Skala).
    // Zeiger laufen vorwärts und stehen bei 0 ihrer Einheit exakt auf 12 Uhr.
    setHands({
      d:(v.d%30)*12,
      h:((24-v.h)%24)*15,
      m:((60-v.m)%60)*6,
      s:((60-v.s)%60)*6
    });
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

  // Mini-Zifferblätter: Zeiger schwenken von der Uhrzeit der vorherigen Station zur eigenen
  const itemArr = Array.from(items);
  const dialReduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function dialAngles(timeStr){
    const parts = (timeStr || '').split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return { h: (h % 12) * 30 + m * 0.5, m: m * 6 };
  }

  function setHands(node, hDeg, mDeg, withTransition){
    const handH = node.querySelector('.dial-hand-h');
    const handM = node.querySelector('.dial-hand-m');
    if(!handH || !handM) return;
    const t = withTransition ? 'transform .9s var(--ease-spring)' : 'none';
    handH.style.transition = t;
    handM.style.transition = t;
    handH.style.transform = 'rotate(' + hDeg + 'deg)';
    handM.style.transform = 'rotate(' + mDeg + 'deg)';
  }

  function swingDial(item, idx){
    const node = item.querySelector('.timeline-node');
    if(!node || node.dataset.dialSwung) return;
    node.dataset.dialSwung = '1';
    const target = dialAngles(item.dataset.time);
    if(dialReduceMotion){
      setHands(node, target.h, target.m, false);
      return;
    }
    // Startposition: Uhrzeit der vorherigen Station (erster Node: 12:00)
    const start = idx > 0 ? dialAngles(itemArr[idx - 1].dataset.time) : { h: 0, m: 0 };
    // Immer vorwärts drehen: Zielwinkel kumulativ über den Startwinkel heben
    let endH = target.h, endM = target.m;
    while(endH <= start.h) endH += 360;
    while(endM <= start.m) endM += 360;
    setHands(node, start.h, start.m, false);
    node.getBoundingClientRect(); // Reflow erzwingen, damit die Transition vom Startwinkel aus greift
    requestAnimationFrame(() => setHands(node, endH, endM, true));
  }

  // Staggered reveal of items
  const tObs = new IntersectionObserver(es => {
    es.forEach(e => {
      if(e.isIntersecting){
        const idx = itemArr.indexOf(e.target);
        setTimeout(() => { e.target.classList.add('visible'); swingDial(e.target, idx); }, idx * 180);
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

/* ===== GRAVUR-ICONS SELBSTZEICHNUNG ===== */
(function(){
  const icons = document.querySelectorAll('.icon-engrave.icon-draw');
  if(!icons.length) return;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion || !('IntersectionObserver' in window)){
    icons.forEach(svg => svg.classList.add('drawn'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('drawn'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  icons.forEach(svg => obs.observe(svg));
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

/* ===== ICS-KALENDER-EXPORT ===== */
(function(){
  var ICS_LOCATION = 'Ballhausforum Unterschleißheim, Am Haingraben 33, 85716 Unterschleißheim';
  var ICS_URL = 'https://www.munichwatchfair.com';
  var ICS_DESC = {
    de: 'Munich Watch Fair – Europas führende Uhrenbörse seit 1989. Einlass: 08:00 Uhr (Early Bird) / 10:30 Uhr (regulär). Infos & Tickets: ' + ICS_URL,
    en: 'Munich Watch Fair – Europe\'s leading watch fair since 1989. Doors open: 08:00 (Early Bird) / 10:30 (regular). Info & tickets: ' + ICS_URL,
    it: 'Munich Watch Fair – la principale borsa di orologi d\'Europa dal 1989. Apertura: ore 08:00 (Early Bird) / ore 10:30 (regolare). Info e biglietti: ' + ICS_URL
  };

  // Sonderzeichen nach RFC 5545 escapen (Backslash zuerst!)
  function icsEscape(s){
    return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  }
  // Zeilen falten (max. 75 Oktette; 60 Zeichen lassen Puffer für UTF-8-Umlaute)
  function icsFold(line){
    var out = '';
    while(line.length > 60){ out += line.slice(0, 60) + '\r\n '; line = line.slice(60); }
    return out + line;
  }
  function compact(t){ return t.date.replace(/-/g, ''); }
  function compactTime(hm){ return hm.replace(':', '') + '00'; }

  // Ein VEVENT pro Termin: floating local time (ohne Z/TZID) – korrekt für das deutsche Publikum
  function buildEvent(t){
    return [
      'BEGIN:VEVENT',
      'UID:' + t.date + '@munichwatchfair.com',
      'DTSTAMP:' + compact(t) + 'T000000Z',
      'DTSTART:' + compact(t) + 'T' + compactTime(t.start),
      'DTEND:' + compact(t) + 'T' + compactTime(t.end),
      'SUMMARY:Munich Watch Fair',
      'LOCATION:' + icsEscape(ICS_LOCATION),
      'DESCRIPTION:' + icsEscape(ICS_DESC[currentLang] || ICS_DESC.de),
      'URL:' + ICS_URL,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Munich Watch Fair',
      'TRIGGER:-P1D',
      'END:VALARM',
      'END:VEVENT'
    ];
  }

  function buildCalendar(termine){
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Munich Watch Fair//DE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    termine.forEach(function(t){ lines = lines.concat(buildEvent(t)); });
    lines.push('END:VCALENDAR');
    return lines.map(icsFold).join('\r\n') + '\r\n';
  }

  function downloadICS(filename, content){
    var blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  }

  function futureTermine(){
    var now = new Date();
    return MESSE_TERMINE.filter(function(t){ return new Date(t.date + 'T' + t.end + ':00') > now; });
  }

  // Event-Delegation für alle ICS-Buttons (Hero, Termin-Karten, Sammel-Button)
  document.addEventListener('click', function(e){
    var btn = e.target.closest ? e.target.closest('.js-ics-btn') : null;
    if(!btn) return;
    var kind = btn.dataset.ics;
    if(kind === 'all'){
      var list = futureTermine();
      if(list.length) downloadICS('munich-watch-fair-termine.ics', buildCalendar(list));
      return;
    }
    var t = null;
    if(kind === 'next'){
      t = getNextTermin();
    } else if(kind === 'card'){
      var card = btn.closest('.termin-card');
      var date = card ? card.dataset.date : null;
      t = MESSE_TERMINE.filter(function(x){ return x.date === date; })[0] || null;
    }
    if(t) downloadICS('munich-watch-fair-' + t.date + '.ics', buildCalendar([t]));
  });

  // Keine zukünftigen Termine: Sammel-Button ausblenden
  // (den Hero-Button entfernt der Countdown-Fallback per innerHTML bereits selbst)
  if(!getNextTermin()){
    var allWrap = document.querySelector('.termine-ics-all');
    if(allWrap) allWrap.style.display = 'none';
  }
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
function reapplyTitleEffects() {
  // Re-wrap GSAP-manipulated titles after language switch so text stays visible
  var termineTitle = document.getElementById('termine-title');
  if (termineTitle) {
    var html = termineTitle.innerHTML;
    termineTitle.innerHTML = html.replace(/<[^>]+>|(\S+)/g, function(m, word) {
      return word ? '<span class="reveal-word" style="opacity:1;transform:none">' + word + '</span>' : m;
    });
  }
  var tagesTitle = document.getElementById('tagesablauf-title');
  if (tagesTitle) {
    var html2 = tagesTitle.innerHTML;
    tagesTitle.innerHTML = html2.replace(/<[^>]+>|(\S+)/g, function(m, word) {
      return word ? '<span class="reveal-word" style="opacity:1;transform:none">' + word + '</span>' : m;
    });
  }
  var anfahrtTitle = document.getElementById('anfahrt-title');
  if (anfahrtTitle) {
    var text = anfahrtTitle.innerHTML;
    var result = '';
    var inTag = false;
    for (var i = 0; i < text.length; i++) {
      if (text[i] === '<') inTag = true;
      if (inTag) { result += text[i]; if (text[i] === '>') inTag = false; }
      else if (text[i] === ' ') { result += ' '; }
      else { result += '<span class="reveal-letter" style="opacity:1;transform:none">' + text[i] + '</span>'; }
    }
    anfahrtTitle.innerHTML = result;
  }
}

(function(){
  var btns = document.querySelectorAll('.lang-btn');

  function applyLanguage(lang) {
    currentLang = lang;
    // Update button states
    btns.forEach(function(b) { b.classList.toggle('active', b.dataset.lang === lang); });
    // Update html lang attribute
    document.documentElement.lang = lang;
    // Swap static text via data-i18n attributes
    document.querySelectorAll('[data-i18n-' + lang + ']').forEach(function(el) {
      if (el.dataset.i18nDynamic === 'true') return;
      var val = el.getAttribute('data-i18n-' + lang);
      if (el.dataset.i18nHtml === 'true') { el.innerHTML = val; } else { el.textContent = val; }
    });
    // Update placeholders
    document.querySelectorAll('[data-i18n-ph-' + lang + ']').forEach(function(el) {
      el.placeholder = el.getAttribute('data-i18n-ph-' + lang);
    });
    // Re-run dynamic date content
    updateAllTerminElements();
    // Fix GSAP-wrapped titles
    reapplyTitleEffects();
    // Persist
    try { sessionStorage.setItem('mwf-lang', lang); } catch(e) {}
  }

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() { applyLanguage(btn.dataset.lang); });
  });

  // Restore saved language on load
  try {
    var saved = sessionStorage.getItem('mwf-lang');
    if (saved && saved !== 'de' && (saved === 'en' || saved === 'it')) {
      window.addEventListener('load', function() {
        setTimeout(function() { applyLanguage(saved); }, 150);
      });
    }
  } catch(e) {}

  window.applyLanguage = applyLanguage;
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

  // Goldfolien-Sheen: wandernder Lichtreflex beim ersten Einscrollen.
  // Verlauf + Endzustand "100% 0" kommen aus CSS (GOLDFOLIEN-VERLAUFSTEXT) —
  // ohne Tween (kein GSAP / reduced motion) bleibt die Folie statisch auf 100% 0.
  // Der Sweep 0% -> 100% schiebt den hellen Reflex (#F4E5B8 bei 18%) einmal durchs
  // Sichtfenster; Ruhezustand ist immer das dunkle Gold-Fenster (Kontrast >=3:1).
  // immediateRender:false: Elemente warten im Ruhezustand (100% 0) und springen
  // erst beim Trigger auf 0% — nichts haengt dauerhaft im hellen Fenster (Hero-
  // Countdown ist beim Load bereits im Viewport, dort feuert der Trigger sofort).
  const foilReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!foilReduce){
    gsap.utils.toArray('.section-title .orange, .ticket-price, .countdown-value, .termin-day').forEach(el => {
      gsap.fromTo(el,
        { backgroundPosition: '0% 0%' },
        { backgroundPosition: '100% 0%', duration: 1.4, ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
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

  // Logo-"A": die zwei Uhrzeiger-Polygone (Pivot/Treffpunkt oben bei 20,0).
  // A_FOLD = Winkel, die beide Zeiger deckungsgleich auf die Senkrechte legen
  // (aus der Polygon-Geometrie gemessen: linker Fusspunkt (6,58) -> -13.57°,
  //  rechter Fusspunkt (34,46) -> +16.93°).
  const aHands = banner.querySelectorAll('.logo-a-svg polygon');
  const A_FOLD = [-13.57, 16.93];
  const reduceHeroMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let aSwingDone = false; // Load-Geste abgeschlossen -> Hover-Mini-Swing freigeben
  let aSwingBusy = false; // Guard gegen Mehrfach-Trigger bei Hover

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

    // Position für den "A"-Zeiger-Schwenk merken: während WATCH sichtbar wird,
    // kurz bevor "Fair" einsetzt (Tween selbst wird weiter unten mit absoluter
    // Position eingefügt, damit keine bestehenden Tweens verschoben werden).
    const aSwingPos = Math.max(tl.duration() - 0.5, 0);

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

    // Logo-"A": Beide Uhrzeiger starten deckungsgleich senkrecht (12-Uhr-Stellung)
    // und schwingen in ihre A-Position auseinander — wie Zeiger auf "10 nach 10".
    // Absolute Position (aSwingPos), nach allen relativen Tweens eingefügt.
    if(aHands.length === 2 && !reduceHeroMotion){
      tl.from(aHands[0], { rotation: A_FOLD[0], svgOrigin: '20 0', duration: 0.8, ease: 'back.out(2)' }, aSwingPos);
      tl.from(aHands[1], {
        rotation: A_FOLD[1], svgOrigin: '20 0', duration: 0.8, ease: 'back.out(2)',
        onComplete: () => { aSwingDone = true; }
      }, aSwingPos);
    } else {
      // prefers-reduced-motion oder unerwartetes Markup: Endzustand steht bereits
      // statisch korrekt im HTML, keine Animation.
      aSwingDone = true;
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

  // Bonus: Hover auf das Logo wiederholt die Zeiger-Geste als 0.5s-Mini-Swing
  // (erst nach abgeschlossener Load-Animation, mit Busy-Flag + Cooldown).
  const heroLogo = banner.querySelector('.hero-logo');
  if(heroLogo && aHands.length === 2 && !reduceHeroMotion){
    heroLogo.addEventListener('mouseenter', () => {
      if(!aSwingDone || aSwingBusy) return;
      aSwingBusy = true;
      const mini = gsap.timeline({
        onComplete: () => { setTimeout(() => { aSwingBusy = false; }, 400); }
      });
      aHands.forEach((hand, i) => {
        mini.to(hand, { rotation: A_FOLD[i] * 0.45, svgOrigin: '20 0', duration: 0.18, ease: 'power2.in' }, 0)
            .to(hand, { rotation: 0, svgOrigin: '20 0', duration: 0.32, ease: 'back.out(2)' }, 0.18);
      });
    });
  }

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
