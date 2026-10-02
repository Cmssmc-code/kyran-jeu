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
      '<span class="star-gold">★</span> <strong>' + n.avg.toFixed(1) + '/5</strong> sur Amazon ' +
      '<span class="amazon-rating-count">(' + n.total + ' évaluations)</span>' +
      '</a>';
  }

  function buildWidgetHtml(n) {
    var avg = n.avg;
    var total = n.total;
    var reviews = n.reviews;
    var reviewsUrl = n.reviewsUrl;
    var html = '';

    // 1. Synthèse globale Amazon avec répartition des notes
    html += '<div class="amazon-summary-card">';
    html += '  <div class="amazon-summary-score">';
    html += '    <div class="amazon-score-header">';
    html += '      <div class="amazon-score-number">' + avg.toFixed(1) + '<span>/5</span></div>';
    html += '      <div>';
    html += '        <div class="amazon-score-stars">' + renderStars(avg) + '</div>';
    html += '        <div class="amazon-score-total">Basé sur <strong>' + total + ' évaluations</strong> sur Amazon.fr</div>';
    html += '      </div>';
    html += '    </div>';
    html += '    <div class="amazon-breakdown-bars">';
    html += '      <div class="amazon-bar-row"><span>5 étoiles</span><div class="bar-track"><div class="bar-fill" style="width: 82%;"></div></div><span>82%</span></div>';
    html += '      <div class="amazon-bar-row"><span>4 étoiles</span><div class="bar-track"><div class="bar-fill" style="width: 18%;"></div></div><span>18%</span></div>';
    html += '      <div class="amazon-bar-row muted"><span>3, 2, 1 étoiles</span><div class="bar-track"><div class="bar-fill" style="width: 0%;"></div></div><span>0%</span></div>';
    html += '    </div>';
    html += '  </div>';
    html += '  <div class="amazon-summary-badge">';
    html += '    <div class="amazon-prime-tag">';
    html += '      <span class="amazon-verified-pill"><span class="check-icon">✓</span> 100% avis vérifiés &amp; testeurs</span>';
    html += '    </div>';
    html += '    <a href="' + reviewsUrl + '" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-amazon-link">';
    html += '      Voir les ' + total + ' évaluations sur Amazon.fr <span aria-hidden="true">↗</span>';
    html += '    </a>';
    html += '  </div>';
    html += '</div>';

    // 2. Grille de TOUS les avis clients (100% visibles directement)
    html += '<div style="text-align: center;"><div class="mobile-swipe-indicator" aria-hidden="true"><span>👉 Glissez pour faire défiler les avis</span></div></div>';
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

    // 3. Bouton direct vers Amazon.fr
    html += '<div class="amazon-reviews-actions">';
    html += '  <a href="' + reviewsUrl + '" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-outline">';
    html += '    <span>Consulter toutes les ' + total + ' évaluations sur Amazon.fr ↗</span>';
    html += '  </a>';
    html += '</div>';

    return html;
  }

  function initReviewsWidget(data) {
    if (!data || !data.reviews || !data.reviews.length) {
      return;
    }

    var n = normalizeData(data);
    var avg = n.avg;
    var total = n.total;
    var reviews = n.reviews;

    // Rendu badge compact pour la page de commande si présente (cliquable vers #avis)
    var orderBadge = document.getElementById('amazon-order-badge');
    if (orderBadge && !orderBadge.hasAttribute('data-ssr')) {
      orderBadge.innerHTML = buildOrderBadgeHtml(n);
    }

    var container = document.getElementById('amazon-reviews-widget');
    if (!container) {
      updateStructuredData(avg, total, reviews);
      return;
    }

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

    // Mise à jour dynamique du Schema.org pour SEO Google Rich Snippet
    updateStructuredData(avg, total, reviews);
  }

  function updateStructuredData(avg, total, reviews) {
    try {
      var scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (var s = 0; s < scripts.length; s++) {
        var text = scripts[s].textContent;
        if (text.indexOf('"@id": "https://kyran-jeu.fr/#boardgame"') !== -1 || text.indexOf('"KYRAN"') !== -1) {
          var schema = JSON.parse(text);
          var graph = schema['@graph'] || [schema];
          var bg = null;
          for (var g = 0; g < graph.length; g++) {
            var item = graph[g];
            var t = item['@type'];
            var isTarget = (item['@id'] === 'https://kyran-jeu.fr/#boardgame') ||
              (Array.isArray(t) ? (t.indexOf('Product') !== -1 || t.indexOf('BoardGame') !== -1) : (t === 'BoardGame' || t === 'Product'));
            if (isTarget) {
              bg = item;
              break;
            }
          }
          if (bg) {
            // Google Review Snippets requiert Product en type scalaire unique
            bg['@type'] = 'Product';
            bg.aggregateRating = {
              '@type': 'AggregateRating',
              'ratingValue': avg.toFixed(1),
              'reviewCount': total.toString(),
              'bestRating': '5',
              'worstRating': '1'
            };
            if (reviews && reviews.length) {
              bg.review = reviews.slice(0, 5).map(function (r) {
                return {
                  '@type': 'Review',
                  'author': { '@type': 'Person', 'name': r.author },
                  'reviewRating': {
                    '@type': 'Rating',
                    'ratingValue': r.rating.toString(),
                    'bestRating': '5'
                  },
                  'reviewBody': r.body,
                  'name': r.title || 'Avis Amazon sur KYRAN'
                };
              });
            }
            scripts[s].textContent = JSON.stringify(schema, null, 2);
          }
          break;
        }
      }
    } catch (e) {
      // ignore silently if JSON parse fails
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
