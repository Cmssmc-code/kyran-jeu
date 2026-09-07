(function () {
  'use strict';

  var stage = document.getElementById('heroProductStage');
  if (!stage) return;

  var container = stage.closest('.hero-visual') || stage;
  var cards = Array.from(stage.querySelectorAll('.fan-card'));

  // Détecter préférence mouvement réduit
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Variables Lerp pour tilt ultra-fluide sans à-coups
  var targetX = 0;
  var targetY = 0;
  var currentX = 0;
  var currentY = 0;
  var isHovered = false;
  var rafId = null;

  function updatePointer(e) {
    var rect = container.getBoundingClientRect();
    var clientX = e.clientX;
    var clientY = e.clientY;

    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    if (clientX === undefined || clientY === undefined) return;

    // Calcul ratio relatif normalisé [-1, 1]
    var x = ((clientX - rect.left) / rect.width) * 2 - 1;
    var y = ((clientY - rect.top) / rect.height) * 2 - 1;

    targetX = Math.max(-1, Math.min(1, x));
    targetY = Math.max(-1, Math.min(1, y));

    if (!isHovered) {
      isHovered = true;
      stage.classList.add('is-interactive');
      startLoop();
    }
  }

  function resetPointer() {
    targetX = 0;
    targetY = 0;
    isHovered = false;
  }

  function tick() {
    // Amortissement lerp pour inertie naturelle
    var ease = 0.085;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    var rotX = -currentY * 8.5; // Inclinaison haut/bas
    var rotY = currentX * 10;   // Inclinaison gauche/droite
    var shiftX = currentX * 12; // Déplacement latéral
    var shiftY = currentY * 8;  // Déplacement vertical
    var shadowX = -currentX * 18;
    var shadowY = -currentY * 6;

    stage.style.setProperty('--stage-rot-x', rotX.toFixed(2) + 'deg');
    stage.style.setProperty('--stage-rot-y', rotY.toFixed(2) + 'deg');
    stage.style.setProperty('--stage-shift-x', shiftX.toFixed(2) + 'px');
    stage.style.setProperty('--stage-shift-y', shiftY.toFixed(2) + 'px');
    stage.style.setProperty('--shadow-x', shadowX.toFixed(2) + 'px');
    stage.style.setProperty('--shadow-y', shadowY.toFixed(2) + 'px');

    // Arrêt intelligent de la boucle RAF quand l'élément est au repos
    if (!isHovered && Math.abs(currentX) < 0.001 && Math.abs(currentY) < 0.001) {
      currentX = 0;
      currentY = 0;
      stage.style.removeProperty('--stage-rot-x');
      stage.style.removeProperty('--stage-rot-y');
      stage.style.removeProperty('--stage-shift-x');
      stage.style.removeProperty('--stage-shift-y');
      stage.style.removeProperty('--shadow-x');
      stage.style.removeProperty('--shadow-y');
      stage.classList.remove('is-interactive');
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }

  container.addEventListener('mousemove', updatePointer, { passive: true });
  container.addEventListener('mouseleave', resetPointer, { passive: true });

  // Support tactile mobile / tablette
  container.addEventListener('touchstart', function (e) {
    updatePointer(e);
  }, { passive: true });
  container.addEventListener('touchmove', function (e) {
    updatePointer(e);
  }, { passive: true });
  container.addEventListener('touchend', function () {
    setTimeout(resetPointer, 800);
  }, { passive: true });

  // Clic / Tap sur une carte : mode focus tactile et mise en avant
  cards.forEach(function (card) {
    function toggleFocus(e) {
      if (e) e.stopPropagation();
      var wasActive = card.classList.contains('is-active');
      cards.forEach(function (c) { c.classList.remove('is-active'); });
      if (!wasActive) {
        card.classList.add('is-active');
        stage.classList.add('has-active-card');
      } else {
        stage.classList.remove('has-active-card');
      }
    }

    card.addEventListener('click', toggleFocus);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFocus(e);
      }
    });
  });

  // Clic extérieur pour refermer la carte active
  document.addEventListener('click', function (e) {
    if (!stage.contains(e.target)) {
      cards.forEach(function (c) { c.classList.remove('is-active'); });
      stage.classList.remove('has-active-card');
    }
  });
})();
