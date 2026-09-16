/* =========================================================
   Printkite India — hero motion (GSAP 3 + ScrollTrigger)

   Owns every animation inside #hero:
     1. a one-shot entrance timeline (no scroll trigger, under 1.4s)
     2. ambient motion once that finishes — the media card floats, the
        decorative bubbles drift on their own randomised clocks
     3. scroll parallax separating the bubbles from the media card
     4. a desktop-only pointer tilt on the media card

   Nothing here touches main.js. Every tween animates transform / opacity /
   clip-path only, so it stays on the compositor.

   Transform ownership — one property owner per element, never two tweens
   fighting over the same transform:
     [data-hero="parallax"] → scroll y
     [data-hero="float"]    → ambient y
     [data-hero="tilt"]     → pointer x/y
     [data-hero="card"]     → entrance opacity / scale / clip-path
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var hero = document.getElementById('hero');

  /* Drop the anti-FOUC guard from index.html. Called on every path — including
     the bail-outs — so the hero copy can never be left invisible. */
  function reveal() {
    root.classList.remove('pk-hero-pending');
    if (hero) hero.classList.add('gsap-ready');
  }

  if (!hero) { reveal(); return; }

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* ancient browser: just animate */ }

  // No GSAP, or the visitor asked for less motion → final states, no tweens.
  if (!window.gsap || reduced) { reveal(); return; }

  var gsap = window.gsap;
  var hasST = !!window.ScrollTrigger;
  if (hasST) gsap.registerPlugin(window.ScrollTrigger);

  var one = function (n) { return hero.querySelector('[data-hero="' + n + '"]'); };
  var all = function (n) { return Array.prototype.slice.call(hero.querySelectorAll('[data-hero="' + n + '"]')); };

  var rule      = one('eyebrow-rule');
  var eyebrow   = one('eyebrow-text');
  var lines     = all('line');
  var word      = one('word');
  var para      = one('para');
  var ctaWrap   = one('cta');
  var ctas      = ctaWrap ? Array.prototype.slice.call(ctaWrap.children) : [];
  var tagline   = one('tagline');
  var card      = one('card');
  var tilt      = one('tilt');
  var floatBox  = one('float');
  var parallax  = one('parallax');
  var bubbleBox = one('bubbles');

  /* ---------------------------------------------------------
     Initial states — written as inline styles BEFORE the guard
     class is removed, so there is no flash between the two.
     --------------------------------------------------------- */
  gsap.set([eyebrow, para, tagline], { opacity: 0, y: 12 });
  gsap.set(ctas, { opacity: 0, y: 12 });
  gsap.set(lines, { opacity: 0, y: 40 });
  // nested inside its line: parent opacity 0 keeps it hidden until its own tween
  gsap.set(word, { opacity: 0, y: 24 });
  gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
  gsap.set(card, { opacity: 0, scale: 0.94, clipPath: 'inset(100% 0% 0% 0%)' });

  reveal();

  /* ---------------------------------------------------------
     Decorative bubbles. Built in JS so they never exist for
     reduced-motion visitors or when GSAP is unavailable.
     --------------------------------------------------------- */
  var bubbles = [];
  (function buildBubbles() {
    if (!bubbleBox) return;
    var COLORS = ['232,23,42', '247,148,29', '230,0,126', '11,11,11'];  // brand palette
    var count = window.innerWidth < 640 ? 10 : 18;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var size = gsap.utils.random(6, 26, 1);
      var el = document.createElement('span');
      el.className = 'pk-bubble';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = gsap.utils.random(2, 94, 1) + '%';
      el.style.top = gsap.utils.random(4, 88, 1) + '%';
      el.style.background = 'rgba(' + gsap.utils.random(COLORS) + ',' +
        gsap.utils.random(0.10, 0.28, 0.01) + ')';
      frag.appendChild(el);
      bubbles.push({ el: el, size: size });
    }
    bubbleBox.appendChild(frag);
  })();

  /* ---------------------------------------------------------
     1. Entrance — runs once, ends at ~1.35s
     --------------------------------------------------------- */
  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(rule,    { scaleX: 1, duration: 0.5 }, 0)
    .to(eyebrow, { opacity: 1, y: 0, duration: 0.45 }, 0.08)
    .to(lines,   { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.15)
    // the gradient word lands a beat later and slower than its line
    .to(word,    { opacity: 1, y: 0, duration: 0.8 }, 0.42)
    .to(para,    { opacity: 1, y: 0, duration: 0.55 }, 0.5)
    .to(ctas,    { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, 0.62)
    .to(tagline, { opacity: 1, y: 0, duration: 0.45 }, 0.75)
    // overlaps the copy so the card reads as simultaneous, not sequential
    .to(card,    { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85 }, 0.5);

  /* ---------------------------------------------------------
     2. Ambient motion, started once the entrance settles
     --------------------------------------------------------- */
  function startAmbient() {
    if (floatBox) {
      gsap.to(floatBox, {
        y: -10, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1
      });
    }

    bubbles.forEach(function (b) {
      // bigger bubbles move less, so the field reads as having depth
      var amp = gsap.utils.mapRange(6, 26, 26, 8, b.size);
      gsap.to(b.el, {
        y: gsap.utils.random(-amp, amp),
        x: gsap.utils.random(-amp * 0.6, amp * 0.6),
        duration: gsap.utils.random(4, 7),
        delay: gsap.utils.random(0, 2.5),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
    });
  }
  tl.eventCallback('onComplete', startAmbient);

  /* ---------------------------------------------------------
     3. Scroll parallax — foreground and background separate as
        the hero leaves. Bubbles travel further than the card.
     --------------------------------------------------------- */
  if (hasST) {
    var scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };

    if (parallax) {
      gsap.to(parallax, { y: 60, ease: 'none', scrollTrigger: scrub });
    }
    if (bubbleBox) {
      gsap.to(bubbleBox, { y: 100, ease: 'none', scrollTrigger: scrub });
    }
  }

  /* ---------------------------------------------------------
     4. Pointer tilt — desktop pointers only, never touch
     --------------------------------------------------------- */
  var fine = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
  if (fine.matches && tilt) {
    var MAX = 6;                                   // px of travel each way
    var xTo = gsap.quickTo(tilt, 'x', { duration: 0.6, ease: 'power3.out' });
    var yTo = gsap.quickTo(tilt, 'y', { duration: 0.6, ease: 'power3.out' });

    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var r = hero.getBoundingClientRect();
      xTo(((e.clientX - r.left) / r.width - 0.5) * MAX * 2);
      yTo(((e.clientY - r.top) / r.height - 0.5) * MAX * 2);
    }, { passive: true });

    hero.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
  }
})();
