/* script.js - full page interactions: smooth scroll, nav highlight, speakers, agenda, modal, canvas, sponsors scroll */
document.addEventListener('DOMContentLoaded', function () {
  /* Smooth scroll for anchors with data-scroll */
  document.querySelectorAll('[data-scroll]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      const el = document.querySelector(href);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Scrollspy: highlight nav */
  const navLinks = Array.from(document.querySelectorAll('.nav a'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  function onScroll(){
    const pos = window.scrollY + 160;
    let current = sections[0] && sections[0].id;
    for (const s of sections) {
      if (s.offsetTop <= pos) current = s.id;
    }
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', throttle(onScroll, 120));
  onScroll();

  /* Mobile menu toggle */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      if (!mainNav) return;
      mainNav.style.display = mainNav.style.display === 'flex' ? '' : 'flex';
    });
  }

  /* ----------------- Speakers data + render ----------------- */
  const speakers = [
    { id:1, name:'Aisha Al Harthy', title:'Head of CX, Retail', tag:'cx', bio:'Aisha leads CX transformation initiatives across retail and e-commerce, focusing on customer journeys and loyalty.', img:'/static/images/aisha.avif' },
    { id:2, name:'Omar Rahman', title:'VP Loyalty, Telecom', tag:'loyalty', bio:'Omar specialises in loyalty programs for large telcos, increasing retention through data-driven offers.', img:'/static/images/omar.jpg' },
    { id:3, name:'Sara Mahmoud', title:'Head Data & Analytics', tag:'data', bio:'Sara builds data-driven CX strategies to personalize experiences at scale.', img:'/static/images/sara.avif' },
    { id:4, name:'Rashid Khan', title:'Chief Digital Officer', tag:'cx', bio:'Rashid focuses on digital journeys and platform-driven customer experience.', img:'/static/images/rashid.jpg' },
    { id:5, name:'Nora Al Saud', title:'Head Loyalty Programs', tag:'loyalty', bio:'Nora created successful loyalty ecosystems across hospitality and retail.', img:'/static/images/nora.avif' },
    { id:6, name:'Khaled Ibrahim', title:'Customer Insights Lead', tag:'data', bio:'Khaled turns insights into action with pragmatic analytics approaches.', img:'/static/images/khalid.avif' }
  ];
  const grid = document.getElementById('speakersGrid');
  function renderSpeakers(list) {
    grid.innerHTML = '';
    for (const s of list) {
      const card = document.createElement('button');
      card.className = 'speaker-card';
      card.setAttribute('data-id', s.id);
      card.innerHTML = `
        <img class="speaker-photo" src="${s.img}" alt="${s.name}" />
        <div class="speaker-meta">
          <h4>${s.name}</h4>
          <p class="muted">${s.title}</p>
        </div>`;
      card.addEventListener('click', () => openModal(s));
      grid.appendChild(card);
    }
  }
  renderSpeakers(speakers.slice(0, 6));

  /* Filters */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      if (f === 'all') renderSpeakers(speakers);
      else renderSpeakers(speakers.filter(s => s.tag === f));
    });
  });

  /* Load more */
  const loadMore = document.getElementById('loadMore');
  loadMore && loadMore.addEventListener('click', () => {
    renderSpeakers(speakers);
    loadMore.style.display = 'none';
  });

  /* Modal logic */
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  function openModal(s) {
    modalContent.innerHTML = `
      <div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap">
        <img src="${s.img}" alt="${s.name}" style="width:140px;border-radius:12px;object-fit:cover"/>
        <div style="flex:1">
          <h3 style="margin:0;color:var(--gold)">${s.name}</h3>
          <p style="margin:6px 0;color:rgba(255,255,255,0.85)">${s.title}</p>
          <p style="color:var(--muted);line-height:1.6">${s.bio}</p>
        </div>
      </div>`;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose && modalClose.focus();
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  modalClose && modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* Agenda content */
  const agenda = {
    1: [
      { time:'09:00', title:'Registration & Coffee', speaker:'' },
      { time:'09:30', title:'Welcome & Opening Remarks', speaker:'Conference Chair' },
      { time:'10:00', title:'Keynote: CX at scale', speaker:'Aisha Al Harthy' },
      { time:'11:00', title:'Panel: Loyalty programs that work', speaker:'Omar Rahman' },
    ],
    2: [
      { time:'09:00', title:'Morning workshop: Personalisation', speaker:'Sara Mahmoud' },
      { time:'11:00', title:'Customer analytics case study', speaker:'Khaled Ibrahim' },
    ]
  };
  const agendaContent = document.getElementById('agendaContent');
  function renderAgenda(day=1) {
    agendaContent.innerHTML = '';
    const items = agenda[day] || [];
    for (const it of items) {
      const div = document.createElement('div');
      div.className = 'agenda-item';
      div.innerHTML = `<div class="agenda-time">${it.time}</div><div class="agenda-desc"><h5>${it.title}</h5><p class="muted">${it.speaker}</p></div>`;
      agendaContent.appendChild(div);
    }
  }
  document.querySelectorAll('.agenda-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.agenda-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderAgenda(Number(btn.getAttribute('data-day')));
    });
  });
  renderAgenda(1);

  /* Registration form (demo) */
  const regForm = document.getElementById('regForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(regForm);
      alert(`Thanks ${f.get('name')} — we'll follow up at ${f.get('email')}. (Demo)`);
      regForm.reset();
    });
  }

  /* Sponsors auto-scroll */
  (function sponsorsAutoScroll(){
    const track = document.getElementById('sponsorsTrack');
    if (!track) return;
    let pos = 0;
    function step() {
      pos += 0.35;
      if (pos >= track.scrollWidth/2) pos = 0;
      track.scrollLeft = pos;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  })();

  /* ----------------- Canvas particles (over video) ----------------- */
  (function particles(){
    const canvas = document.getElementById('bgParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', {alpha:true});
    const DPR = window.devicePixelRatio || 1;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    function fit() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);
    }
    fit(); window.addEventListener('resize', debounce(fit, 120));

    let particles = [];
    const COUNT = Math.max(6, Math.floor(window.innerWidth * 0.02));
    function rand(a,b){ return Math.random()*(b-a)+a; }
    function create() {
      particles = [];
      for (let i=0;i<COUNT;i++){
        particles.push({ x: rand(0,W), y: rand(0,H), r: rand(24,110), vx: rand(-0.12,0.12), vy: rand(-0.06,0.06), o: rand(0.03,0.14) });
      }
    }
    create();

    let mx = W/2, my = H/2;
    window.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    });

    let px = W/2, py = H/2;
    function draw(){
      ctx.clearRect(0,0,W,H);
      px += (mx - px) * 0.03;
      py += (my - py) * 0.03;
      for (const p of particles){
        p.x += p.vx; p.y += p.vy;
        if (p.x - p.r > W) p.x = -p.r;
        if (p.x + p.r < 0) p.x = W + p.r;
        if (p.y - p.r > H) p.y = -p.r;
        if (p.y + p.r < 0) p.y = H + p.r;
        const ox = (px - W/2) * (p.r / 9000), oy = (py - H/2) * (p.r / 9000);
        const cx = p.x + ox, cy = p.y + oy;
        const rg = ctx.createRadialGradient(cx, cy, p.r*0.05, cx, cy, p.r);
        rg.addColorStop(0, `rgba(255,255,255,${Math.min(0.18,p.o+0.04)})`);
        rg.addColorStop(0.25, `rgba(255,215,0,${Math.min(0.12,p.o)})`);
        rg.addColorStop(0.6, `rgba(217,59,79,${Math.min(0.09,p.o*0.9)})`);
        rg.addColorStop(1, 'rgba(23,51,90,0.0)');
        ctx.beginPath(); ctx.fillStyle = rg; ctx.arc(cx,cy,p.r,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* Helpers */
  function throttle(fn, t){ let last = 0; return function(...a){ const now = Date.now(); if (now-last>t){ last = now; fn.apply(this,a); } }; }
  function debounce(fn, t){ let id; return function(...a){ clearTimeout(id); id = setTimeout(()=>fn.apply(this,a), t); }; }
});
