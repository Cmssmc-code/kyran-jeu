/**
 * KYRAN : animations d'interface (styles dans css/motion.css).
 * En-tête compact au défilement, révélations en cascade de l'accueil, inclinaison
 * des cartes de l'éventail (souris), retournement des cartes Pouvoir, pause du
 * bandeau hors écran. Rien n'est caché si ce script ne se charge pas ; rien ne
 * bouge sous prefers-reduced-motion.
 */
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement;
  function mq(q) { return !!(w.matchMedia && w.matchMedia(q).matches); }
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var fine = mq('(hover: hover) and (pointer: fine)');
  var hasIO = 'IntersectionObserver' in w;
  function raf(f) { return w.requestAnimationFrame ? w.requestAnimationFrame(f) : setTimeout(f, 16); }
  function each(sel, fn, ctx) { Array.prototype.forEach.call((ctx || d).querySelectorAll(sel), fn); }

  // iOS n'applique :active au toucher qu'avec un écouteur touchstart
  d.addEventListener('touchstart', function () {}, { passive: true });

  /* ── En-tête compact : une sentinelle de 140 px en haut de page ── */
  if (hasIO && d.body) {
    var s = d.createElement('div');
    s.setAttribute('aria-hidden', 'true');
    s.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:140px;pointer-events:none;visibility:hidden';
    d.body.appendChild(s);
    new IntersectionObserver(function (e) {
      root.classList.toggle('km-compact', !e[0].isIntersecting);
    }).observe(s);
  }

  /* ── Bandeau défilant : en pause hors écran ── */
  if (hasIO) {
    each('.kyran-ticker', function (t) {
      new IntersectionObserver(function (e) {
        t.classList.toggle('km-off', !e[0].isIntersecting);
      }).observe(t);
    });
  }

  if (reduce) return;

  /* ── Accueil : révélations en cascade ── */
  if (hasIO && d.querySelector('.hero-ecommerce')) {
    var STAGGER = '.steps-grid, .powers-grid, .box-list, .avis-highlight__quotes, .faq-accordion--home, .blog-grid, .amazon-store-grid';
    // pas de :is() : querySelectorAll lève une SyntaxError sur les navigateurs qui l'ignorent (Safari < 14)
    var SINGLE = ['.eyebrow', '.section-title', '.section-divider', '.section-sub'].map(function (c) {
      return 'main section:not(.hero) ' + c + ':not(.reveal-on-scroll)';
    }).join(', ') + ', .avis-highlight__photo, #amazon-reviews-widget, .heritage-visual, .heritage-copy > p, .section-actions';
    var vh = w.innerHeight, plan = [];
    // lecture groupée des positions, puis écriture des classes (pas de reflow en boucle)
    each(STAGGER, function (el) { plan.push([el, 1, el.getBoundingClientRect().top > vh]); });
    each(SINGLE, function (el) { plan.push([el, 0, el.getBoundingClientRect().top > vh]); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, n = el.classList.contains('km-stagger') ? Math.min(el.children.length, 8) : 1;
        io.unobserve(el);
        el.classList.add('is-visible');
        setTimeout(function () { el.classList.add('km-done'); }, 800 + n * 70);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -24px 0px' });
    var armed = [];
    plan.forEach(function (p) {
      var el = p[0];
      if (!p[2] || armed.some(function (a) { return a.contains(el) || el.contains(a); })) return;
      if (p[1]) {
        el.classList.add('km-stagger');
        for (var i = 0; i < el.children.length; i++) el.children[i].style.setProperty('--km-i', Math.min(i, 7));
      } else {
        el.classList.add('km-reveal');
      }
      armed.push(el);
      io.observe(el);
    });
    root.classList.add('km-js');
  }

  /* ── Éventail du hero : inclinaison 3D de la carte survolée ── */
  if (fine) {
    each('#heroProductStage .fan-card', function (c) {
      var flip = c.querySelector('.fan-card-flip'), r = null, x = 0, y = 0, q = 0;
      if (!flip) return;
      function put() {
        q = 0;
        flip.style.setProperty('--km-rx', (-y * 9).toFixed(2) + 'deg');
        flip.style.setProperty('--km-ry', (x * 12).toFixed(2) + 'deg');
      }
      function clamp(v) { return v < -1 ? -1 : v > 1 ? 1 : v; }
      c.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        if (!r) { r = c.getBoundingClientRect(); c.classList.add('km-tilt'); }
        x = clamp((e.clientX - r.left) / r.width * 2 - 1);
        y = clamp((e.clientY - r.top) / r.height * 2 - 1);
        if (!q) q = raf(put);
      }, { passive: true });
      function reset() { r = null; x = 0; y = 0; c.classList.remove('km-tilt'); raf(put); }
      c.addEventListener('pointerleave', reset);
      c.addEventListener('click', reset);
    });
  }

  /* ── Cartes Pouvoir : la carte se retourne quand on change de valeur ── */
  var orig = w.switchPowerCard;
  if (typeof orig === 'function') {
    w.switchPowerCard = function (key, src, val) {
      var t = d.getElementById('thumb-' + key);
      var item = t && t.closest('.power-card-item');
      if (!t || !item || !t.animate || t.getAttribute('src') === src) return orig(key, src, val);
      each('.power-pill', function (b) {
        var on = b.textContent.trim() === 'Val. ' + val;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      }, item);
      var img = new Image();
      img.src = src;
      function go() {
        var dur = 560;
        var p = 'perspective(700px) rotateY(';
        t.animate([
          { transform: p + '0deg)', easing: 'cubic-bezier(.55,0,.8,.4)' },
          { transform: p + '90deg) scale(1.05)', offset: 0.42 },
          { transform: p + '-90deg) scale(1.05)', offset: 0.42, easing: 'cubic-bezier(.2,.9,.3,1.2)' },
          { transform: p + '0deg)' }
        ], { duration: dur });
        setTimeout(function () { t.src = src; }, dur * 0.42);
      }
      (img.decode ? img.decode() : Promise.resolve()).then(go, go);
    };
  }
})();
