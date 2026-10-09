/**
 * Visuel de l'accueil : boîte KYRAN et éventail de cartes.
 * La chorégraphie (arrivée, éventail, retournement, reflets) est en CSS (style.css,
 * « VISUEL HERO »). Ce script ajoute :
 *  - le départ de l'intro une fois la boîte et les cartes décodées (pas d'animation
 *    sur des images encore vides, pas d'à-coup au premier affichage) ;
 *  - l'inclinaison de la boîte et la parallaxe qui suivent la souris, lissées selon
 *    le temps écoulé (même douceur à 60, 90 ou 120 images par seconde) et posées
 *    directement sur les quelques éléments concernés (pas de recalcul de toute la scène) ;
 *  - la carte « présentée » au clic / toucher (Échap, clic ailleurs ou second clic la range),
 *    avec une image haute définition chargée à la demande ;
 *  - les braises dorées ;
 *  - la pause de toutes les animations quand la scène sort de l'écran.
 */
(function () {
  'use strict';

  var stage = document.getElementById('heroProductStage');
  if (!stage) return;

  var cards = Array.prototype.slice.call(stage.querySelectorAll('.fan-card'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ── Départ de l'intro quand les images sont prêtes ── */
  function start() {
    // deux images d'affichage : les calques sont en place avant la première frame animée
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { stage.classList.remove('is-waiting'); });
    });
  }

  if (stage.classList.contains('is-waiting')) {
    var imgs = Array.prototype.slice.call(stage.querySelectorAll('.hero-box-img, .fan-card-face, .fan-card-back'));
    var ready = imgs.map(function (img) {
      if (img.decode) return img.decode().catch(function () {});
      return img.complete ? Promise.resolve() : new Promise(function (r) {
        img.addEventListener('load', r, { once: true });
        img.addEventListener('error', r, { once: true });
      });
    });
    var timeout = new Promise(function (r) { setTimeout(r, 1800); });
    Promise.race([Promise.all(ready), timeout]).then(start);
  }

  /* ── Braises ── */
  var embers = stage.querySelector('.hero-embers');
  if (embers && !reduceMotion.matches) {
    var count = window.innerWidth < 600 ? 8 : 13;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var e = document.createElement('span');
      e.className = 'hero-ember';
      e.style.setProperty('--x', (8 + Math.random() * 84).toFixed(1) + '%');
      e.style.setProperty('--size', (3 + Math.random() * 4).toFixed(1) + 'px');
      e.style.setProperty('--dur', (6.5 + Math.random() * 5).toFixed(2) + 's');
      e.style.setProperty('--delay', (1.4 + Math.random() * 8).toFixed(2) + 's');
      e.style.setProperty('--drift', ((Math.random() - 0.5) * 16).toFixed(1) + 'cqw');
      e.style.setProperty('--alpha', (0.55 + Math.random() * 0.45).toFixed(2));
      frag.appendChild(e);
    }
    embers.appendChild(frag);
  }

  /* ── Pause hors écran ── */
  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      stage.classList.toggle('is-offscreen', !visible);
    }).observe(stage);
  }

  /* ── Inclinaison et parallaxe à la souris ── */
  var TAU = 140; // constante de lissage (ms) : plus grand = plus doux
  var target = { x: 0, y: 0 };
  var current = { x: 0, y: 0 };
  var rafId = null;
  var lastT = 0;
  var rect = null;

  var aura = stage.querySelector('.hero-stage-aura');
  var boxTilt = stage.querySelector('.hero-box-tilt');
  var glare = stage.querySelector('.hero-box-glare > span');
  var shadow = stage.querySelector('.hero-stage-shadow');

  function apply(x, y) {
    if (aura) aura.style.transform = 'translate3d(' + (x * 3).toFixed(3) + 'cqw,' + (y * 2).toFixed(3) + 'cqw,0)';
    if (boxTilt) boxTilt.style.transform = 'rotateX(' + (y * -7).toFixed(3) + 'deg) rotateY(' + (x * 9).toFixed(3) + 'deg)';
    if (glare) glare.style.transform = 'translate3d(' + (x * 26).toFixed(2) + '%,' + (y * 30).toFixed(2) + '%,0)';
    if (shadow) shadow.style.translate = (x * -2).toFixed(3) + 'cqw 0';
    var cardShift = (x * -2.2).toFixed(3) + 'cqw ' + (y * -1.4).toFixed(3) + 'cqw';
    for (var c = 0; c < cards.length; c++) cards[c].style.translate = cardShift;
  }

  function tick(t) {
    var dt = lastT ? Math.min(t - lastT, 64) : 16.7;
    lastT = t;
    var k = 1 - Math.exp(-dt / TAU);
    current.x += (target.x - current.x) * k;
    current.y += (target.y - current.y) * k;
    var settled = Math.abs(target.x - current.x) < 0.0015 && Math.abs(target.y - current.y) < 0.0015;
    if (settled) {
      current.x = target.x;
      current.y = target.y;
    }
    apply(current.x, current.y);
    if (settled || !visible) {
      rafId = null;
      lastT = 0;
      if (target.x === 0 && target.y === 0) stage.classList.remove('is-tilting');
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function run() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function measure() { rect = stage.getBoundingClientRect(); }
  function invalidate() { rect = null; }
  window.addEventListener('scroll', invalidate, { passive: true });
  window.addEventListener('resize', invalidate, { passive: true });

  var area = stage.closest('.hero-visual') || stage;

  area.addEventListener('pointermove', function (ev) {
    if (ev.pointerType !== 'mouse' || reduceMotion.matches || !finePointer.matches) return;
    if (!rect) measure();
    target.x = Math.max(-1, Math.min(1, ((ev.clientX - rect.left) / rect.width) * 2 - 1));
    target.y = Math.max(-1, Math.min(1, ((ev.clientY - rect.top) / rect.height) * 2 - 1));
    stage.classList.add('is-tilting');
    run();
  }, { passive: true });

  area.addEventListener('pointerleave', function () {
    target.x = 0;
    target.y = 0;
    run();
  }, { passive: true });

  /* ── Carte présentée ── */
  var presented = null;

  // Image haute définition : chargée et décodée hors écran, puis échangée sans clignotement
  function upgrade(card) {
    var img = card.querySelector('.fan-card-face[data-xl]');
    if (!img) return;
    var src = img.getAttribute('data-xl');
    img.removeAttribute('data-xl');
    var hd = new Image();
    hd.src = src;
    (hd.decode ? hd.decode() : Promise.reject()).then(function () { img.src = src; }, function () {});
  }

  function release() {
    if (!presented) return;
    var card = presented;
    presented = null;
    card.classList.remove('is-presented');
    card.setAttribute('aria-pressed', 'false');
    stage.classList.remove('has-presented');
    if (reduceMotion.matches) return;
    card.classList.add('is-returning');
    card.addEventListener('animationend', function done(ev) {
      if (ev.target !== card || ev.animationName !== 'heroCardReturn') return;
      card.removeEventListener('animationend', done);
      card.classList.remove('is-returning');
    });
  }

  function present(card) {
    if (presented === card) {
      release();
      return;
    }
    release();
    card.classList.remove('is-returning');
    upgrade(card);
    presented = card;
    card.classList.add('is-presented');
    card.setAttribute('aria-pressed', 'true');
    stage.classList.add('has-presented');
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function (ev) {
      ev.stopPropagation();
      present(card);
    });
  });

  document.addEventListener('click', function (ev) {
    if (presented && !presented.contains(ev.target)) release();
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && presented) {
      var card = presented;
      release();
      card.focus();
    }
  });
})();
