/**
 * reviews.js - Affichage dynamique des avis Amazon pour Kyran
 */
(function () {
  'use strict';

  function renderStars(rating) {
    var stars = '';
    var fullStars = Math.floor(rating);
    var hasHalf = (rating - fullStars) >= 0.3 && (rating - fullStars) < 0.8;
    var extraFull = (rating - fullStars) >= 0.8;
    if (extraFull) fullStars++;

    for (var i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars += '<span class="star-icon star-full" aria-hidden="true">★</span>';
      } else if (i === fullStars + 1 && hasHalf) {
        stars += '<span class="star-icon star-half" aria-hidden="true">★</span>';
      } else {
        stars += '<span class="star-icon star-empty" aria-hidden="true">☆</span>';
      }
    }
    return '<span class="review-stars" role="img" aria-label="' + rating + ' sur 5 étoiles">' + stars + '</span>';
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Les données proviennent d'un scraping Amazon : n'accepter qu'un lien https vers amazon
  function safeAmazonUrl(value) {
    var fallback = 'https://www.amazon.fr/dp/B0G217LD87#customerReviews';
    try {
      var u = new URL(String(value));
      return (u.protocol === 'https:' && /(^|\.)amazon\.fr$/.test(u.hostname)) ? u.href : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function toNumber(value, fallback) {
    var n = parseFloat(value);
    return isFinite(n) ? n : fallback;
  }

  function normalizeData(data) {
    return {
      avg: Math.min(5, Math.max(0, toNumber(data.averageRating, 4.7))),
      total: Math.max(0, Math.round(toNumber(data.totalReviews, data.reviews.length))),
      reviews: data.reviews,
      reviewsUrl: escapeHtml(safeAmazonUrl(data.reviewsUrl))
    };
  }

  function buildOrderBadgeHtml(n) {
    return '<a href="#avis" class="amazon-order-rating-pill" style="text-decoration:none;cursor:pointer;" title="Voir les avis des joueurs">' +
      '<span class="star-gold">★</span> <strong>' + n.avg.toFixed(1).replace('.', ',') + '/5</strong> sur Amazon ' +
      '<span class="amazon-rating-count">(' + n.total + ' évaluations)</span>' +
      '</a>';
  }

  function buildWidgetHtml(n) {
    var avg = n.avg;
    var total = n.total;
    var reviews = n.reviews;
    var reviewsUrl = n.reviewsUrl;
    var html = '';

    // 1. Synthèse : note et nombre d'évaluations relevés sur Amazon.fr (reviews-data.json).
    // La répartition par étoiles n'est pas connue : elle n'est pas affichée.
    html += '<div class="amazon-summary-card">';
    html += '  <div class="amazon-score-header">';
    html += '    <div class="amazon-score-number">' + avg.toFixed(1).replace('.', ',') + '<span>/5</span></div>';
    html += '    <div>';
    html += '      <div class="amazon-score-stars">' + renderStars(avg) + '</div>';
    html += '      <div class="amazon-score-total"><strong>' + total + ' évaluations</strong> sur Amazon.fr</div>';
    html += '    </div>';
    html += '  </div>';
    html += '  <a href="' + reviewsUrl + '" target="_blank" rel="noopener noreferrer" class="amazon-summary-link">Lire tous les avis sur Amazon <span aria-hidden="true">↗</span></a>';
    html += '</div>';

    // 2. Grille de TOUS les avis clients (100% visibles directement)
    html += '<div style="text-align: center;"><div class="mobile-swipe-indicator" aria-hidden="true"><span>Glissez pour voir les avis</span></div></div>';
    html += '<div class="amazon-reviews-grid" id="amazon-reviews-list">';

    reviews.forEach(function (rev, index) {
      var badgeHtml = '';
      if (rev.verified) {
        badgeHtml = '<span class="review-badge-verified"><span class="badge-icon">✓</span> Achat vérifié</span>';
      } else if (rev.vine) {
        badgeHtml = '<span class="review-badge-vine">Club des Testeurs Vine</span>';
      }

      var cleanBody = escapeHtml(rev.body);
      var isLong = cleanBody.length > 240;

      html += '<div class="amazon-review-card">';
      html += '  <div class="review-card-header">';
      html += '    <div class="review-card-rating">' + renderStars(Math.min(5, Math.max(0, toNumber(rev.rating, 5)))) + '</div>';
      if (rev.date) {
        html += '    <span class="review-card-date">' + escapeHtml(rev.date) + '</span>';
      }
      html += '  </div>';

      if (rev.title) {
        html += '  <h3 class="review-card-title">' + escapeHtml(rev.title) + '</h3>';
      }

      html += '  <div class="review-card-body">';
      if (isLong) {
        html += '    <div class="review-text-clamp" id="rev-text-' + index + '">' + cleanBody + '</div>';
        html += '    <button type="button" class="btn-read-more" data-target="rev-text-' + index + '">Lire la suite</button>';
      } else {
        html += '    <p>' + cleanBody + '</p>';
      }
      html += '  </div>';

      html += '  <div class="review-card-footer">';
      html += '    <div class="review-author-info">';
      html += '      <span class="review-author-avatar">' + escapeHtml(String(rev.author || '?').charAt(0).toUpperCase()) + '</span>';
      html += '      <div>';
      html += '        <strong class="review-author-name">' + escapeHtml(rev.author) + '</strong>';
      if (badgeHtml) {
        html += '        <div class="review-badges-row">' + badgeHtml + '</div>';
      }
      html += '      </div>';
      html += '    </div>';
      html += '  </div>';
      html += '</div>';
    });

    html += '</div>';

    return html;
  }

  function initReviewsWidget(data) {
    if (!data || !data.reviews || !data.reviews.length) {
      return;
    }

    // La note Amazon reste en texte visible : elle n'est pas injectée dans le JSON-LD
    // (Google refuse les notes agrégées depuis un autre site).
    var n = normalizeData(data);

    // Rendu badge compact pour la page de commande si présente (cliquable vers #avis)
    var orderBadge = document.getElementById('amazon-order-badge');
    if (orderBadge && !orderBadge.hasAttribute('data-ssr')) {
      orderBadge.innerHTML = buildOrderBadgeHtml(n);
    }

    var container = document.getElementById('amazon-reviews-widget');
    if (!container) return;

    // Rendu statique déjà présent (scripts/prerender.mjs) : on n'écrase pas, on branche seulement les boutons
    if (!container.hasAttribute('data-ssr')) container.innerHTML = buildWidgetHtml(n);

    // Événement boutons "Lire la suite"
    var moreBtns = container.querySelectorAll('.btn-read-more');
    moreBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-target');
        var textEl = document.getElementById(targetId);
        if (!textEl) return;
        var expanded = textEl.classList.toggle('expanded');
        btn.textContent = expanded ? 'Réduire' : 'Lire la suite';
      });
    });

    if (typeof initMobileCarouselDots === 'function') {
      setTimeout(initMobileCarouselDots, 100);
    }
  }


  if (typeof window !== 'undefined') {
    window.KyranReviews = {
      normalizeData: normalizeData,
      buildWidgetHtml: buildWidgetHtml,
      buildOrderBadgeHtml: buildOrderBadgeHtml
    };
  }

  // Chargement des données : fetch 'reviews-data.json' avec fallback sur 'window.KYRAN_REVIEWS_DATA'
  function loadAndRender() {
    fetch('reviews-data.json?v=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.reviews || !data.reviews.length) {
          throw new Error('Données avis vides dans JSON');
        }
        initReviewsWidget(data);
      })
      .catch(function () {
        // Fallback immédiat si CORS local, fetch bloqué ou JSON vide
        if (window.KYRAN_REVIEWS_DATA && window.KYRAN_REVIEWS_DATA.reviews && window.KYRAN_REVIEWS_DATA.reviews.length) {
          initReviewsWidget(window.KYRAN_REVIEWS_DATA);
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndRender);
  } else {
    loadAndRender();
  }
})();
