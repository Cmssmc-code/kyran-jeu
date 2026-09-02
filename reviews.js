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
    return '<span class="review-stars" aria-label="' + rating + ' sur 5 étoiles">' + stars + '</span>';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initReviewsWidget(data) {
    if (!data || !data.reviews || !data.reviews.length) {
      return;
    }

    var avg = data.averageRating || 4.7;
    var total = data.totalReviews || data.reviews.length;
    var reviews = data.reviews;

    // Rendu badge compact pour la page de commande si présente
    var orderBadge = document.getElementById('amazon-order-badge');
    if (orderBadge) {
      orderBadge.innerHTML = '<div class="amazon-order-rating-pill">' +
        '<span class="star-gold">★</span> <strong>' + avg.toFixed(1) + '/5</strong> sur Amazon ' +
        '<span class="amazon-rating-count">(' + total + ' évaluations)</span>' +
        '</div>';
    }

    var container = document.getElementById('amazon-reviews-widget');
    if (!container) {
      updateStructuredData(avg, total, reviews);
      return;
    }

    var html = '';

    // 1. Synthèse globale Amazon
    html += '<div class="amazon-summary-card">';
    html += '  <div class="amazon-summary-score">';
    html += '    <div class="amazon-score-number">' + avg.toFixed(1) + '<span>/5</span></div>';
    html += '    <div class="amazon-score-stars">' + renderStars(avg) + '</div>';
    html += '    <div class="amazon-score-total">Basé sur <strong>' + total + ' évaluations</strong> sur Amazon.fr</div>';
    html += '  </div>';
    html += '  <div class="amazon-summary-badge">';
    html += '    <div class="amazon-prime-tag">';
    html += '      <svg class="amazon-logo-svg" viewBox="0 0 100 30" width="85" height="26" aria-label="Amazon" fill="currentColor">';
    html += '        <path d="M57.6 19.3c-4.8 3.5-11.8 5.4-17.7 5.4-8.3 0-15.8-3.1-21.5-8.3-.4-.4-.1-.9.4-.6 6.1 3.5 13.7 5.7 21.6 5.7 5.3 0 11.2-1.3 16.7-4.1.8-.4 1.5.5.5 1.9z"/>';
    html += '        <path d="M59.4 17.5c-.6-.8-4.1-.4-5.6-.2-.5.1-.6-.3-.1-.6 2.9-2.1 7.7-1.5 8.2-.8.6.8-.2 5.7-3 8-0.5.4-.8.2-.6-.3.6-1.5 1.7-5.3 1.1-6.1z"/>';
    html += '        <path d="M43.7 13.9v-5.2c0-.3.2-.5.5-.5h2.8c.3 0 .5.2.5.5v10.3c0 2.8 1.4 4.1 3.7 4.1 1.6 0 2.9-.7 3.7-2.1V14c0-.3.2-.5.5-.5h2.7c.3 0 .5.2.5.5v13.8c0 .3-.2.5-.5.5h-2.5c-.3 0-.5-.2-.5-.5v-1.7c-1.1 1.6-2.9 2.5-5.1 2.5-3.8 0-6.6-2.3-6.6-6.4 0-.1 0-.3.1-.4h.4c0-2.8-.9-4.8-4.4-4.8-2.2 0-4.1 1.2-4.8 2.6-.2.4-.6.4-.8.1l-1.3-1.8c-.2-.3-.1-.7.2-.9 1.4-1.7 3.9-3 7.3-3 4.8 0 7.4 2.4 7.4 7.2v.5z"/>';
    html += '      </svg>';
    html += '      <span class="amazon-verified-pill"><span class="check-icon">✓</span> Avis vérifiés</span>';
    html += '    </div>';
    html += '    <a href="' + (data.reviewsUrl || 'https://www.amazon.fr/dp/B0G217LD87') + '" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-amazon-link">';
    html += '      Lire sur Amazon.fr <span aria-hidden="true">↗</span>';
    html += '    </a>';
    html += '  </div>';
    html += '</div>';

    // 2. Grille des avis clients
    html += '<div class="amazon-reviews-grid" id="amazon-reviews-list">';

    reviews.forEach(function (rev, index) {
      var hiddenClass = index >= 6 ? ' amazon-review-item--extra' : '';
      var badgeHtml = '';
      if (rev.verified) {
        badgeHtml = '<span class="review-badge-verified"><span class="badge-icon">✓</span> Achat vérifié</span>';
      } else if (rev.vine) {
        badgeHtml = '<span class="review-badge-vine">Club des Testeurs Vine</span>';
      }

      var cleanBody = escapeHtml(rev.body);
      var isLong = cleanBody.length > 240;

      html += '<div class="amazon-review-card' + hiddenClass + '">';
      html += '  <div class="review-card-header">';
      html += '    <div class="review-card-rating">' + renderStars(rev.rating) + '</div>';
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
      html += '      <span class="review-author-avatar">' + escapeHtml(rev.author.charAt(0).toUpperCase()) + '</span>';
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

    // 3. Bouton "Afficher plus d'avis"
    if (reviews.length > 6) {
      html += '<div class="amazon-reviews-actions">';
      html += '  <button type="button" id="btn-toggle-reviews" class="btn btn-secondary btn-outline">';
      html += '    <span>Afficher tous les avis (' + reviews.length + ')</span>';
      html += '  </button>';
      html += '</div>';
    }

    container.innerHTML = html;

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

    // Événement bouton "Afficher tous les avis"
    var toggleBtn = document.getElementById('btn-toggle-reviews');
    if (toggleBtn) {
      var allShown = false;
      toggleBtn.addEventListener('click', function () {
        var extras = container.querySelectorAll('.amazon-review-item--extra');
        allShown = !allShown;
        extras.forEach(function (el) {
          el.style.display = allShown ? 'flex' : 'none';
        });
        toggleBtn.querySelector('span').textContent = allShown
          ? 'Masquer les avis supplémentaires'
          : 'Afficher tous les avis (' + reviews.length + ')';
      });
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
            if (graph[g]['@type'] === 'BoardGame') {
              bg = graph[g];
              break;
            }
          }
          if (bg) {
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

  // Chargement des données : fetch 'reviews-data.json' avec fallback sur 'window.KYRAN_REVIEWS_DATA'
  function loadAndRender() {
    fetch('reviews-data.json?v=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        initReviewsWidget(data);
      })
      .catch(function () {
        // Fallback immédiat si CORS local ou fetch bloqué
        if (window.KYRAN_REVIEWS_DATA) {
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
