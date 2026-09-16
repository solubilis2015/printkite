/* =========================================================
   Printkite India — site behaviour
   Header, drawer, carousels, accordion, enquiry scroll, form,
   GSAP hero banner + GSAP cursor glitter.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- AOS ---------- */
  if (window.AOS) AOS.init({ duration: 650, once: true, offset: 60, easing: 'ease-out-cubic' });

  /* ---------- year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- sticky header ---------- */
  const header = document.getElementById('pkHeader');
  const onScroll = () => header && header.classList.toggle('is-stuck', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile drawer ---------- */
  const drawer = document.getElementById('navDrawer');
  const overlay = document.getElementById('navOverlay');
  const toggle = document.getElementById('navToggle');
  const closeBtn = document.getElementById('navClose');

  function openNav() {
    drawer.classList.add('open'); overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    toggle && toggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    drawer.classList.remove('open'); overlay.classList.add('hidden');
    document.body.style.overflow = '';
    toggle && toggle.setAttribute('aria-expanded', 'false');
  }
  toggle && toggle.addEventListener('click', openNav);
  closeBtn && closeBtn.addEventListener('click', closeNav);
  overlay && overlay.addEventListener('click', closeNav);
  drawer && drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  /* Single static cover image — used by the "What we do" cards.
     Same box as the carousel viewport (4:3, rounded, cropped to fill),
     so the card layout is identical either way. data-fallback keeps the
     card filled with the old artwork until the new cover is dropped in. */
  function coverMarkup(src, alt, fallback) {
    return `
      <div class="pk-cover">
        <img src="${src}" alt="${alt}" loading="lazy"${fallback ? ` data-fallback="${fallback}"` : ''} />
      </div>`;
  }

  /* =========================================================
     Image carousel — used by each service accordion panel on
     services.html. Autoplays, pauses on hover, supports
     arrows, dots and swipe.
     ========================================================= */
  function carouselMarkup(images, alt) {
    return `
      <div class="pk-carousel" data-carousel role="group" aria-roledescription="carousel" aria-label="${alt}">
        <div class="pk-carousel__viewport">
          ${images.map((src, i) => `
            <div class="pk-carousel__slide${i === 0 ? ' active' : ''}" aria-hidden="${i === 0 ? 'false' : 'true'}">
              <img src="${src}" alt="${alt} ${i + 1}" loading="lazy" />
            </div>`).join('')}
        </div>
        <button type="button" class="pk-carousel__btn prev" aria-label="Previous image">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button type="button" class="pk-carousel__btn next" aria-label="Next image">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="pk-carousel__dots">
          ${images.map((_, i) => `<button type="button" class="pk-carousel__dot${i === 0 ? ' active' : ''}" aria-label="Go to image ${i + 1}" aria-current="${i === 0}"></button>`).join('')}
        </div>
      </div>`;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function initCarousels(scope) {
    (scope || document).querySelectorAll('[data-carousel]').forEach(root => {
      if (root.dataset.ready) return;
      root.dataset.ready = '1';
      const slides = [...root.querySelectorAll('.pk-carousel__slide')];
      const dots = [...root.querySelectorAll('.pk-carousel__dot')];
      if (slides.length < 2) {
        root.querySelectorAll('.pk-carousel__btn, .pk-carousel__dots').forEach(el => el.remove());
        return;
      }
      let i = 0, timer = null;
      const go = n => {
        i = (n + slides.length) % slides.length;
        slides.forEach((s, k) => {
          s.classList.toggle('active', k === i);
          s.setAttribute('aria-hidden', String(k !== i));
        });
        dots.forEach((d, k) => {
          d.classList.toggle('active', k === i);
          d.setAttribute('aria-current', String(k === i));
        });
      };
      const stop = () => { if (timer) clearInterval(timer); timer = null; };
      const play = () => {
        stop();
        if (prefersReduced.matches || document.hidden) return;
        timer = setInterval(() => go(i + 1), 4000);
      };

      root.querySelector('.prev').addEventListener('click', e => { e.stopPropagation(); go(i - 1); play(); });
      root.querySelector('.next').addEventListener('click', e => { e.stopPropagation(); go(i + 1); play(); });
      dots.forEach((d, k) => d.addEventListener('click', e => { e.stopPropagation(); go(k); play(); }));
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', play);
      root.addEventListener('focusin', stop);
      root.addEventListener('focusout', play);

      // keyboard: arrow keys step through the slides
      root.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { go(i - 1); play(); }
        else if (e.key === 'ArrowRight') { go(i + 1); play(); }
      });

      // touch swipe
      let x0 = null, y0 = null;
      root.addEventListener('touchstart', e => {
        x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; stop();
      }, { passive: true });
      root.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        const dy = e.changedTouches[0].clientY - y0;
        // ignore mostly-vertical gestures so page scrolling still feels natural
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? i + 1 : i - 1);
        x0 = y0 = null; play();
      });

      // pause while the tab is in the background
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
      if (prefersReduced.addEventListener) prefersReduced.addEventListener('change', play);

      play();
    });
  }

  /* ---------- images with a graceful fallback ----------
     Used by the hero banner tiles and the service card covers: point src
     at the new artwork and data-fallback at an image that already ships,
     so the page still renders correctly until the new files are dropped
     in. Call again for any markup injected after load.                */
  function initFallbacks(scope) {
    (scope || document).querySelectorAll('img[data-fallback]').forEach(img => {
      const swap = () => {
        const alt = img.dataset.fallback;
        if (!alt || img.dataset.fellBack) return;
        img.dataset.fellBack = '1';
        img.src = alt;
      };
      img.addEventListener('error', swap);
      if (img.complete && img.naturalWidth === 0) swap();  // already failed before this ran
    });
  }
  initFallbacks();

  /* ---------- renderers: home page ---------- */
  const whyGrid = document.getElementById('whyGrid');
  if (whyGrid && window.PK_WHY) {
    whyGrid.innerHTML = PK_WHY.map(t => `
      <li class="pk-why-item">
        <span class="mark" aria-hidden="true"></span>
        <p>${t}</p>
      </li>`).join('');
  }

  const preview = document.getElementById('servicePreview');
  if (preview && window.PK_SERVICES) {
    preview.innerHTML = PK_SERVICES.map(s => `
      <article class="tile group flex flex-col">
        ${coverMarkup(s.cover, s.title, s.images && s.images[0])}
        <div class="p-6 flex flex-col flex-1">
          <h3 class="font-bold text-lg">${s.title}</h3>
          <p class="mt-2 text-sm text-gray-500 leading-relaxed flex-1">${s.blurb}</p>
          <a href="services.html#${s.id}" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pk-red"
             aria-label="Learn more about ${s.title}">
            Learn more
            <svg class="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </article>`).join('');
    initFallbacks(preview);
  }

  /* ---------- clients: looping logo carousel ----------
     PK_CLIENTS accepts a plain name or { name, logo }. A logo that is
     missing or fails to load falls back to the client's name, so logos
     can be added one at a time without breaking the strip.            */
  const clientTrack = document.getElementById('clientTrack');
  if (clientTrack && window.PK_CLIENTS) {
    const clients = PK_CLIENTS.map(c => (typeof c === 'string' ? { name: c } : c));
    // A card with a logo starts in the has-logo state (name hidden) so the strip
    // never flashes text before the image arrives; a load failure removes the
    // image and drops the class, revealing the name again.
    // These are not lazy-loaded: the whole strip scrolls continuously, so every
    // logo is on its way on-screen from the start.
    const cell = (c, clone) => `
      <div class="pk-client${c.logo ? ' has-logo' : ''}${clone ? ' pk-client--clone' : ''}"${clone ? ' aria-hidden="true"' : ''}>
        ${c.logo ? `<img src="${c.logo}" alt="${c.name}" decoding="async" data-client-logo />` : ''}
        <span class="name">${c.name}</span>
      </div>`;
    const row = clone => clients.map(c => cell(c, clone)).join('');
    clientTrack.innerHTML = row(false) + row(true);   // second copy makes the loop seamless

    clientTrack.querySelectorAll('img[data-client-logo]').forEach(img => {
      const fail = () => { const p = img.parentElement; img.remove(); p.classList.remove('has-logo'); };
      img.addEventListener('error', fail);
      if (img.complete && !img.naturalWidth) fail();
    });
  }

  const franchiseGrid = document.getElementById('franchiseGrid');
  if (franchiseGrid && window.PK_FRANCHISE) {
    franchiseGrid.innerHTML = PK_FRANCHISE.map(f => `
      <div class="pk-franchise-card">
        <p class="name">${f.name}</p>
        <p class="area">${f.area}</p>
        <ul class="notes">
          ${PK_FRANCHISE_NOTE.map(n => `
            <li><span class="mark" aria-hidden="true"></span><span>${n}</span></li>`).join('')}
        </ul>
      </div>`).join('');
  }

  /* ---------- renderers: services page ---------- */
  const accWrap = document.getElementById('serviceAccordion');
  if (accWrap && window.PK_SERVICES) {
    accWrap.innerHTML = PK_SERVICES.map((s, i) => `
      <div class="acc-item" id="${s.id}" data-aos="fade-up" data-aos-delay="${i * 40}">
        <button class="acc-trigger" aria-expanded="false" aria-controls="panel-${s.id}">
          <span class="acc-icon brand-gradient">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v5H4zM4 11h7v9H4zM13 11h7v9h-7z"/></svg>
          </span>
          <span class="flex-1">
            <span class="block font-bold text-lg leading-tight">${s.title}</span>
            <span class="block text-sm text-gray-500 mt-1">${s.blurb}</span>
          </span>
          <span class="hidden sm:inline text-xs font-semibold text-gray-400 mr-1">${s.items.length} items</span>
          <svg class="acc-chevron w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="acc-panel" id="panel-${s.id}">
          <div class="px-6 pb-7 pt-1 grid md:grid-cols-3 gap-7">
            <div class="md:col-span-1">${carouselMarkup(s.images, s.title)}</div>
            <div class="md:col-span-2">
              ${s.intro ? `<p class="service-intro">${s.intro}</p>` : ''}
              <div class="grid sm:grid-cols-2 gap-x-4">
                ${s.items.map(item => `
                  <button type="button" class="service-item" data-service="${s.title}" data-item="${item}">
                    <span class="dot"></span><span>${item}</span>
                  </button>`).join('')}
              </div>
              ${s.note ? `<p class="mt-5 rounded-xl bg-[#FFF4F5] text-[13.5px] px-4 py-3 leading-relaxed">
                    <strong class="text-pk-red">Employee Kit:</strong> ${s.note.replace('Employee Kit:', '').trim()}
                  </p>` : ''}
              <p class="mt-5 text-[13px] text-gray-400">Click any item above to enquire about it.</p>
            </div>
          </div>
        </div>
      </div>`).join('');

    initCarousels(accWrap);

    // accordion open/close
    accWrap.querySelectorAll('.acc-item').forEach(item => {
      const trigger = item.querySelector('.acc-trigger');
      const panel = item.querySelector('.acc-panel');
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        accWrap.querySelectorAll('.acc-item.open').forEach(other => {
          other.classList.remove('open');
          other.querySelector('.acc-panel').style.maxHeight = null;
          other.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    window.addEventListener('resize', () => {
      const open = accWrap.querySelector('.acc-item.open .acc-panel');
      if (open) open.style.maxHeight = open.scrollHeight + 'px';
    });

    // service item -> prefill + smooth scroll to enquiry
    accWrap.addEventListener('click', e => {
      const btn = e.target.closest('.service-item');
      if (!btn) return;
      const service = btn.dataset.service;
      const item = btn.dataset.item;
      const sel = document.getElementById('enqService');
      const msg = document.getElementById('enqMessage');
      const chip = document.getElementById('enqChip');
      if (sel) sel.value = service;
      if (msg && !msg.value.trim()) msg.value = `I would like a quote for: ${item} (${service}).`;
      if (chip) { chip.textContent = item; chip.parentElement.classList.remove('hidden'); }
      const target = document.getElementById('enquiry');
      if (target) {
        // scroll, then correct once more after images/layout settle so a late
        // reflow can't leave the visitor past the form
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          const top = target.getBoundingClientRect().top;
          if (Math.abs(top) > 120) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 700);
      }
    });

    // open the accordion matching the URL hash (e.g. services.html#printing)
    const openFromHash = () => {
      const id = location.hash.replace('#', '');
      const item = id && document.getElementById(id);
      if (item && item.classList.contains('acc-item')) {
        item.querySelector('.acc-trigger').click();
        setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
      }
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);

    // populate the enquiry <select>
    const sel = document.getElementById('enqService');
    if (sel) {
      PK_SERVICES.forEach(s => {
        const o = document.createElement('option');
        o.value = s.title; o.textContent = s.title;
        sel.appendChild(o);
      });
      const other = document.createElement('option');
      other.value = 'Other'; other.textContent = 'Other / Not sure';
      sel.appendChild(other);
    }
  }

  /* ---------- renderers: portfolio page ---------- */
  const grid = document.getElementById('portfolioGrid');
  const filters = document.getElementById('portfolioFilters');
  if (grid && window.PK_PORTFOLIO) {
    const render = (cat) => {
      const items = cat === 'all' ? PK_PORTFOLIO : PK_PORTFOLIO.filter(p => p.category === cat);
      grid.innerHTML = items.map(p => `
        <figure class="tile group">
          <div class="overflow-hidden bg-white">
            <img src="${p.src}" alt="${p.title}" loading="lazy"
                 class="w-full h-full object-cover group-hover:scale-[1.04] transition duration-500" />
          </div>
          <figcaption class="px-4 py-3 text-sm font-medium text-gray-600 border-t border-gray-100">${p.title}</figcaption>
        </figure>`).join('');
      if (window.AOS) AOS.refreshHard();
    };

    if (filters && window.PK_PORTFOLIO_CATEGORIES) {
      filters.innerHTML = PK_PORTFOLIO_CATEGORIES.map((c, i) => `
        <button data-cat="${c.id}"
          class="pf-btn px-5 py-2.5 rounded-full text-sm font-medium border transition ${i === 0
            ? 'bg-pk-black text-white border-pk-black'
            : 'border-gray-200 text-gray-600 hover:border-pk-red hover:text-pk-red'}">${c.label}</button>`).join('');
      filters.addEventListener('click', e => {
        const b = e.target.closest('.pf-btn');
        if (!b) return;
        filters.querySelectorAll('.pf-btn').forEach(x => {
          x.className = 'pf-btn px-5 py-2.5 rounded-full text-sm font-medium border transition border-gray-200 text-gray-600 hover:border-pk-red hover:text-pk-red';
        });
        b.className = 'pf-btn px-5 py-2.5 rounded-full text-sm font-medium border transition bg-pk-black text-white border-pk-black';
        render(b.dataset.cat);
      });
    }
    render('all');
  }

  /* ---------- enquiry form (Formspree) ---------- */
  const form = document.getElementById('enquiryForm');
  if (form) {
    const status = document.getElementById('formStatus');
    const submit = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const endpoint = form.getAttribute('action') || '';
      status.className = 'mt-4 text-sm';

      if (endpoint.includes('YOUR_FORM_ID')) {
        status.textContent = 'Form endpoint not configured yet — add your Formspree ID in services.html.';
        status.classList.add('text-amber-600');
        return;
      }
      submit.disabled = true;
      const original = submit.textContent;
      submit.textContent = 'Sending…';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          const wrap = document.getElementById('enqChipWrap');
          if (wrap) wrap.classList.add('hidden');
          status.textContent = 'Thank you — your enquiry has been sent. We will get back to you shortly.';
          status.classList.add('text-green-600');
        } else {
          throw new Error('Request failed');
        }
      } catch (err) {
        status.innerHTML = 'Sorry, something went wrong. Please email <a class="underline" href="mailto:printkiteindia@gmail.com">printkiteindia@gmail.com</a> or call +91 9655 66 5713.';
        status.classList.add('text-pk-red');
      } finally {
        submit.disabled = false;
        submit.textContent = original;
      }
    });
  }

  /* =========================================================
     GSAP — hero banner bubbles (canvas behind the hero copy)
     Bubbles drift upward; the cursor pushes them away and pops
     new ones on move. Desktop only, purely decorative.
     ========================================================= */
  const canvas = document.getElementById('bannerCanvas');
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && window.gsap && !reduced) {
    const ctx = canvas.getContext('2d');
    const COLORS = ['232,23,42', '247,148,29', '230,0,126', '11,11,11'];
    let w = 0, h = 0, bubbles = [], mouse = { x: -999, y: -999 };

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeBubble = (x, y, burst) => ({
      x: x != null ? x : gsap.utils.random(0, w),
      y: y != null ? y : gsap.utils.random(0, h),
      r: gsap.utils.random(burst ? 2 : 3, burst ? 6 : 14),
      vx: gsap.utils.random(-0.25, 0.25),
      vy: burst ? gsap.utils.random(-1.2, -0.4) : gsap.utils.random(-0.35, -0.12),
      a: gsap.utils.random(0.08, burst ? 0.4 : 0.22),
      decay: burst ? gsap.utils.random(0.004, 0.009) : 0,
      c: gsap.utils.random(COLORS)
    });

    const seed = () => {
      const count = Math.min(46, Math.round(w / 26));
      bubbles = Array.from({ length: count }, () => makeBubble());
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        // gentle repulsion from the cursor
        const dx = b.x - mouse.x, dy = b.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          const f = (14000 - d2) / 14000 * 0.6;
          b.x += dx / Math.sqrt(d2 || 1) * f * 2;
          b.y += dy / Math.sqrt(d2 || 1) * f * 2;
        }
        b.x += b.vx; b.y += b.vy; b.a -= b.decay;
        if (b.y + b.r < 0 || b.a <= 0) {
          if (b.decay) { bubbles.splice(i, 1); continue; }
          b.y = h + b.r; b.x = gsap.utils.random(0, w);
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${b.c},${Math.max(b.a, 0)})`;
        ctx.fill();
      }
    };

    resize(); seed();
    gsap.ticker.add(tick);
    window.addEventListener('resize', () => { resize(); seed(); });

    if (!coarse) {
      let last = 0;
      canvas.parentElement.addEventListener('pointermove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
        const now = performance.now();
        if (now - last > 90 && bubbles.length < 120) {   // throttled, capped
          last = now;
          bubbles.push(makeBubble(mouse.x, mouse.y, true));
        }
      });
      canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
    }
  }

  /* =========================================================
     GSAP — premium cursor glitter (desktop only)
     Small star particles scatter from the pointer and fade out;
     each element removes itself when its tween completes.
     ========================================================= */
  if (window.gsap && !coarse && !reduced) {
    const layer = document.createElement('div');
    layer.id = 'pkGlitter';
    document.body.appendChild(layer);

    const GLYPHS = ['✦', '✧', '✶', '⋆', '★'];
    const TONES = ['', 'gold', 'ink'];
    const MAX = 26;                  // hard cap on live particles
    let live = 0, last = 0, lastX = 0, lastY = 0;

    function spark(x, y) {
      if (live >= MAX) return;
      const el = document.createElement('span');
      el.className = 'pk-star ' + gsap.utils.random(TONES);
      el.textContent = gsap.utils.random(GLYPHS);
      el.style.fontSize = gsap.utils.random(8, 18, 1) + 'px';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      layer.appendChild(el);
      live++;

      const angle = gsap.utils.random(0, Math.PI * 2);
      const dist = gsap.utils.random(18, 64);

      gsap.fromTo(el,
        { x: 0, y: 0, scale: gsap.utils.random(0.5, 1.1), rotation: gsap.utils.random(-90, 90), opacity: gsap.utils.random(0.65, 1) },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist + gsap.utils.random(6, 26),   // slight downward drift
          rotation: '+=' + gsap.utils.random(-200, 200),
          scale: gsap.utils.random(0.15, 0.45),
          opacity: 0,
          duration: gsap.utils.random(0.7, 1.4),
          ease: 'power2.out',
          onComplete() { el.remove(); live--; }
        }
      );
    }

    window.addEventListener('pointermove', e => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const now = performance.now();
      const moved = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (now - last < 45 || moved < 8) return;                  // throttle: light on the CPU
      last = now; lastX = e.clientX; lastY = e.clientY;
      const n = moved > 90 ? 2 : 1;                              // a touch denser on fast moves
      for (let i = 0; i < n; i++) {
        spark(e.clientX + gsap.utils.random(-6, 6), e.clientY + gsap.utils.random(-6, 6));
      }
    }, { passive: true });

    // stop spawning while the tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { gsap.killTweensOf(layer.children); layer.innerHTML = ''; live = 0; }
    });
  }
})();
