/**
 * Visuel de l'accueil : boîte KYRAN et éventail de cartes.
 * La chorégraphie (arrivée, éventail, retournement, reflets) est en CSS (style.css,
 * « VISUEL HERO »). Ce script ajoute :
 *  - l'inclinaison de la boîte et la parallaxe qui suivent la souris (lissées) ;
 *  - la carte « présentée » au clic / toucher (Échap, clic ailleurs ou second clic la range) ;
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

  /* ── Braises ── */
  var embers = stage.querySelector('.hero-embers');
  if (embers && !reduceMotion.matches) {
    var count = window.innerWidth < 600 ? 9 : 14;
    for (var i = 0; i < count; i++) {
      var e = document.createElement('span');
      e.className = 'hero-ember';
      e.style.setProperty('--x', (8 + Math.random() * 84).toFixed(1) + '%');
      e.style.setProperty('--size', (3 + Math.random() * 4).toFixed(1) + 'px');
      e.style.setProperty('--dur', (6 + Math.random() * 5).toFixed(2) + 's');
      e.style.setProperty('--delay', (1.2 + Math.random() * 8).toFixed(2) + 's');
      e.style.setProperty('--drift', ((Math.random() - 0.5) * 16).toFixed(1) + 'cqw');
      e.style.setProperty('--alpha', (0.55 + Math.random() * 0.45).toFixed(2));
      embers.appendChild(e);
    }
  }

  /* ── Pause hors écran ── */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      stage.classList.toggle('is-offscreen', !entries[0].isIntersecting);
    }).observe(stage);
  }

  /* ── Inclinaison et parallaxe à la souris ── */
  var target = { x: 0, y: 0 };
  var current = { x: 0, y: 0 };
  var rafId = null;

  function tick() {
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
    var settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
    if (settled) {
      current.x = target.x;
      current.y = target.y;
    }
    stage.style.setProperty('--px', current.x.toFixed(4));
    stage.style.setProperty('--py', current.y.toFixed(4));
    if (settled) {
      rafId = null;
      if (target.x === 0 && target.y === 0) stage.classList.remove('is-tilting');
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function run() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  var area = stage.closest('.hero-visual') || stage;

  area.addEventListener('pointermove', function (ev) {
    if (ev.pointerType !== 'mouse' || reduceMotion.matches || !finePointer.matches) return;
    var r = stage.getBoundingClientRect();
    target.x = Math.max(-1, Math.min(1, ((ev.clientX - r.left) / r.width) * 2 - 1));
    target.y = Math.max(-1, Math.min(1, ((ev.clientY - r.top) / r.height) * 2 - 1));
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

  function cleanup(card) {
    card.classList.remove('is-returning');
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
      if (ev.animationName !== 'heroCardReturn') return;
      card.removeEventListener('animationend', done);
      cleanup(card);
    });
  }

  function present(card) {
    if (presented === card) {
      release();
      return;
    }
    release();
    cleanup(card);
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
