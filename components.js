const AMAZON_URL = 'https://www.amazon.fr/dp/B0G217LD87';
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/eVqeVfaWz4k02yY1UqaEE00';
const INSTAGRAM_URL = 'https://www.instagram.com/kyran.jeu/';
const INSTAGRAM_HANDLE = '@kyran.jeu';
const ROOT = '/';
const ORDER_URL = rootPath('commander.html');

function rootPath(path) {
  if (!path) return ROOT;
  if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('#')) return path;
  if (path.startsWith('/')) return path;
  return ROOT + path;
}

function instagramLinkHtml(className, label) {
  const linkClass = className || 'social-link social-link--instagram';
  const linkLabel = label || INSTAGRAM_HANDLE;
  return (
    '<a class="' + linkClass + '" href="' + INSTAGRAM_URL + '" target="_blank" rel="noopener noreferrer me">' +
      '<span class="icon-instagram" aria-hidden="true"></span>' +
      '<span>' + linkLabel + '</span>' +
    '</a>'
  );
}

const ACTIVE_BY_PATH = {
  'index.html': 'home',
  'commander.html': 'order',
  'merci.html': 'order',
  'regle.html': 'rules',
  'minijeu.html': 'game',
  'dossier-presse.html': 'press',
  'jeu-apero.html': 'discover',
  'alternative-skyjo.html': 'discover',
  'tarot-africain.html': 'discover',
  'whist-moderne.html': 'discover',
  'comparatif-jeux-plis.html': 'discover',
  'faq.html': 'discover',
  'plan-du-site.html': 'discover',
  'mentions-legales.html': 'legal',
  'cgv.html': 'legal',
  'confidentialite.html': 'legal'
};

function resolveActivePage(explicit) {
  if (explicit) return explicit;
  var path = window.location.pathname.toLowerCase();
  if (path.indexOf('/blog') !== -1) return 'blog';
  var file = path.split('/').pop() || 'index.html';
  if (!file || file.endsWith('/')) file = 'index.html';
  if (!file.endsWith('.html') && ACTIVE_BY_PATH[file + '.html']) {
    return ACTIVE_BY_PATH[file + '.html'];
  }
  return ACTIVE_BY_PATH[file] || '';
}

const DISCOVER_ITEMS = [
  { href: '/jeu-apero.html', title: 'Jeu apéro', desc: 'Soirée 30 min, 3 à 6 joueurs' },
  { href: '/alternative-skyjo.html', title: 'Alternative Skyjo', desc: 'Même usage, mécaniques de plis' },
  { href: '/tarot-africain.html', title: 'Tarot Africain', desc: 'Héritage et genèse du jeu' },
  { href: '/whist-moderne.html', title: 'Whist moderne', desc: 'Contrat, plis et pari impitoyable' },
  { href: '/comparatif-jeux-plis.html', title: 'Jeux de plis', desc: 'KYRAN vs Wizard, Oh Hell…' },
  { href: '/faq.html', title: 'FAQ', desc: 'Questions fréquentes' }
];

function getBlogItemsForFooter() {
  if (typeof BLOG_ITEMS !== 'undefined') {
    return BLOG_ITEMS.slice(0, 5);
  }
  return [];
}

class KyranHeader extends HTMLElement {
  connectedCallback() {
    const activePage = resolveActivePage(this.getAttribute('active'));
    const discoverActive = ['discover', 'apero', 'skyjo', 'tarot', 'whist', 'plis', 'faq'].includes(activePage);
    const submenu = DISCOVER_ITEMS.map(function (item) {
      return `<li><a href="${item.href}">${item.title}<span class="sub-desc">${item.desc}</span></a></li>`;
    }).join('');
    const drawerDiscover = DISCOVER_ITEMS.map(function (item) {
      return `<a class="nav-drawer-link" href="${item.href}">${item.title}<span>${item.desc}</span></a>`;
    }).join('');

    this.innerHTML = `
      <div class="top-announcement-bar" role="region" aria-label="Offre et livraison">
        <div class="container announcement-content">
          <span class="announcement-pill">Offre atelier</span>
          <span class="announcement-text">Jeu complet <strong>9,99€</strong> au lieu de 17,99€ · Expédié sous 24-48h suivie</span>
          <a href="${ORDER_URL}" class="announcement-link">Commander &rarr;</a>
        </div>
      </div>
      <header class="site-header">
        <div class="container nav">
          <div class="nav-brand-group">
            <a href="${ROOT}index.html" class="logo" aria-label="KYRAN - Accueil">
              <img src="${ROOT}logo.png" alt="KYRAN" />
            </a>

            <nav class="nav-primary" id="nav-primary" aria-label="Navigation principale">
              <ul class="nav-list" id="menu-principal">
                <li><a href="${ROOT}index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Accueil</a></li>
                <li><a href="${ROOT}regle.html" class="nav-link ${activePage === 'rules' ? 'active' : ''}">R&egrave;gles</a></li>
                <li><a href="${ROOT}minijeu.html" class="nav-link ${activePage === 'game' ? 'active' : ''}">Dojo</a></li>
                <li class="nav-dropdown nav-desktop-only">
                  <button type="button" class="nav-link nav-link--menu ${discoverActive ? 'active' : ''}" aria-haspopup="true" aria-expanded="false" aria-controls="nav-discover-menu" id="nav-discover-trigger">
                    D&eacute;couvrir<span class="nav-chevron" aria-hidden="true"></span>
                  </button>
                  <ul class="nav-submenu" id="nav-discover-menu" aria-label="Guides KYRAN">${submenu}</ul>
                </li>
                <li class="nav-mobile-only">
                  <details class="nav-discover-details">
                    <summary class="nav-discover-summary">D&eacute;couvrir</summary>
                    <div class="nav-drawer-links">${drawerDiscover}</div>
                  </details>
                </li>
                <li><a href="${ROOT}blog/index.html" class="nav-link ${activePage === 'blog' ? 'active' : ''}">Blog</a></li>
                <li><a href="${ROOT}dossier-presse.html" class="nav-link ${activePage === 'press' ? 'active' : ''}">Presse</a></li>
              </ul>
              <div class="nav-drawer-footer nav-mobile-only">
                <a class="btn btn-primary btn-block" href="${ORDER_URL}">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <span>Commander — 9,99&euro;</span>
                </a>
                ${instagramLinkHtml('social-link social-link--instagram social-link--block', 'Suivre sur Instagram')}
              </div>
            </nav>
          </div>

          <div class="nav-actions">
            <div class="cta cta-desktop">
              <a class="btn btn-header-cta" href="${ORDER_URL}" aria-label="Commander le jeu KYRAN">
                <svg class="cart-icon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Commander</span>
              </a>
            </div>
            <button type="button" class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav-primary">
              <span class="nav-toggle-lines" aria-hidden="true">
                <span></span><span></span><span></span>
              </span>
            </button>
          </div>
        </div>
        <div class="nav-backdrop" hidden></div>
      </header>

      <nav class="mobile-bottom-nav" aria-label="Navigation rapide mobile">
        <a href="${ROOT}index.html" class="mobile-nav-tab ${activePage === 'home' ? 'active' : ''}">
          <span class="mobile-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </span>
          <span class="mobile-nav-label">Accueil</span>
        </a>
        <a href="${ROOT}regle.html" class="mobile-nav-tab ${activePage === 'rules' ? 'active' : ''}">
          <span class="mobile-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </span>
          <span class="mobile-nav-label">Règles</span>
        </a>
        <a href="${ROOT}minijeu.html" class="mobile-nav-tab ${activePage === 'game' ? 'active' : ''}">
          <span class="mobile-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg>
          </span>
          <span class="mobile-nav-label">Dojo</span>
        </a>
        <a href="${ORDER_URL}" class="mobile-nav-tab mobile-nav-tab--highlight ${activePage === 'order' ? 'active' : ''}">
          <span class="mobile-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </span>
          <span class="mobile-nav-label">Acheter</span>
          <span class="mobile-nav-pill">9,99€</span>
        </a>
      </nav>
    `;

    const navToggle = this.querySelector('.nav-toggle');
    const backdrop = this.querySelector('.nav-backdrop');
    const dropdown = this.querySelector('.nav-dropdown');
    const discoverTrigger = this.querySelector('#nav-discover-trigger');
    const body = document.body;
    const closableLinks = this.querySelectorAll('.nav-link[href], .nav-drawer-link, .nav-drawer-footer a');

    function setDiscoverOpen(open) {
      if (!dropdown || !discoverTrigger) return;
      dropdown.classList.toggle('is-open', open);
      discoverTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function closeDiscoverMenu() {
      setDiscoverOpen(false);
    }

    function closeMenu() {
      if (!body.classList.contains('menu-open')) return;
      body.classList.remove('menu-open');
      body.style.overflow = '';
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Ouvrir le menu');
      backdrop.hidden = true;
    }

    function openMenu() {
      body.classList.add('menu-open');
      body.style.overflow = 'hidden';
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Fermer le menu');
      backdrop.hidden = false;
    }

    function toggleMenu() {
      if (body.classList.contains('menu-open')) closeMenu();
      else openMenu();
    }

    navToggle.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);
    closableLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    if (dropdown && discoverTrigger) {
      var discoverCloseTimer;

      dropdown.addEventListener('mouseenter', function () {
        if (window.innerWidth <= 900) return;
        clearTimeout(discoverCloseTimer);
        setDiscoverOpen(true);
      });

      dropdown.addEventListener('mouseleave', function () {
        if (window.innerWidth <= 900) return;
        discoverCloseTimer = setTimeout(closeDiscoverMenu, 140);
      });

      discoverTrigger.addEventListener('click', function (event) {
        if (window.innerWidth <= 900) return;
        event.preventDefault();
        setDiscoverOpen(!dropdown.classList.contains('is-open'));
      });

      document.addEventListener('click', function (event) {
        if (window.innerWidth <= 900) return;
        if (!dropdown.contains(event.target)) closeDiscoverMenu();
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeDiscoverMenu();
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
      else closeDiscoverMenu();
    });
  }
}

class KyranFooter extends HTMLElement {
  connectedCallback() {
    const exploreLinks = DISCOVER_ITEMS.map(function (item) {
      return `<p><a href="${item.href}">${item.title}</a></p>`;
    }).join('');

    const blogItems = getBlogItemsForFooter();
    const blogLinks = blogItems.map(function (item) {
      return `<p><a href="${getBlogUrl(item.slug)}">${item.title}</a></p>`;
    }).join('');
    const blogSection = blogLinks
      ? `<div class="footer-col"><h4>Blog</h4>${blogLinks}<p><a href="${ROOT}blog/index.html">Tous les articles</a></p></div>`
      : '';

    this.innerHTML = `
      <footer>
        <div class="footer-grid">
          <div class="footer-col">
            <h4>KYRAN</h4>
            <p>Jeu de cartes &middot; Ap&eacute;ro &middot; 3&ndash;6 joueurs &middot; ~30 min</p>
            <p>Le jeu de cartes strat&eacute;gique o&ugrave; perdre est aussi important que gagner.</p>
            <div class="footer-follow">
              <p class="footer-follow-label">Suivez le jeu</p>
              ${instagramLinkHtml('social-link social-link--instagram')}
            </div>
          </div>
          <div class="footer-col">
            <h4>Explorer</h4>
            ${exploreLinks}
          </div>
          ${blogSection}
          <div class="footer-col">
            <h4>Contact</h4>
            <p><a href="${ROOT}regle.html">R&egrave;gles du jeu</a></p>
            <p><a href="${ROOT}minijeu.html">Dojo interactif</a></p>
            <p><a href="${ROOT}dossier-presse.html">Espace Presse</a></p>
            <p><a href="mailto:contact@kyran-jeu.fr">contact@kyran-jeu.fr</a></p>
            <p class="footer-contact-social">${instagramLinkHtml('social-link social-link--instagram social-link--compact')}</p>
          </div>
          <div class="footer-col">
            <h4>Cr&eacute;dits</h4>
            <p>Design : Crea by Floh</p>
            <p>Auteur : Corentin Sence</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-trust-note">🔒 Paiement sécurisé Stripe · 📦 Expédition suivie sous 24-48h · 🇫🇷 Édition indépendante en France</p>
          <p class="footer-social">
            ${instagramLinkHtml('social-link social-link--instagram social-link--footer', 'Suivre @kyran.jeu sur Instagram')}
          </p>
          <p class="footer-credits">Illustrations &amp; identit&eacute; visuelle · Crea by Floh</p>
          <p class="footer-seo-links">
            <a href="${ROOT}mentions-legales.html">Mentions légales</a>
            <span aria-hidden="true"> · </span>
            <a href="${ROOT}cgv.html">CGV</a>
            <span aria-hidden="true"> · </span>
            <a href="${ROOT}confidentialite.html">Confidentialité</a>
            <span aria-hidden="true"> · </span>
            <a href="${ROOT}plan-du-site.html">Plan du site</a>
            <span aria-hidden="true"> · </span>
            <a href="${ROOT}sitemap.xml">Sitemap</a>
            <span aria-hidden="true"> · </span>
            <a href="${ROOT}llms.txt">llms.txt</a>
          </p>
          <p>&copy; 2026 KYRAN. Tous droits r&eacute;serv&eacute;s.</p>
        </div>
      </footer>
    `;
  }
}

class KyranBreadcrumb extends HTMLElement {
  connectedCallback() {
    let items = [];
    try {
      items = JSON.parse(this.getAttribute('items') || '[]');
    } catch (e) {
      items = [];
    }

    const parts = items.map(function (item, index) {
      const isLast = index === items.length - 1;
      const href = item.href ? rootPath(item.href) : '';
      if (isLast || !href) {
        return `<span class="breadcrumb-current" aria-current="page">${item.label}</span>`;
      }
      return `<a href="${href}">${item.label}</a><span class="breadcrumb-sep" aria-hidden="true">/</span>`;
    }).join('');

    this.innerHTML = `<nav class="breadcrumb" aria-label="Fil d'Ariane">${parts}</nav>`;
  }
}

class KyranPageHero extends HTMLElement {
  connectedCallback() {
    const eyebrow = this.getAttribute('eyebrow') || '';
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    let breadcrumbItems = [];
    try {
      breadcrumbItems = JSON.parse(this.getAttribute('breadcrumb') || '[]');
    } catch (e) {
      breadcrumbItems = [];
    }

    this.innerHTML = `
      <section class="page-hero">
        <div class="container">
          <div class="page-hero-breadcrumb"></div>
          ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
          <h1></h1>
          ${subtitle ? `<p class="hero-lead">${subtitle}</p>` : ''}
        </div>
      </section>
    `;

    this.querySelector('h1').innerHTML = title;
    if (breadcrumbItems.length) {
      const bc = document.createElement('kyran-breadcrumb');
      bc.setAttribute('items', JSON.stringify(breadcrumbItems));
      this.querySelector('.page-hero-breadcrumb').appendChild(bc);
    }
  }
}

class KyranDiscoverGrid extends HTMLElement {
  connectedCallback() {
    const cards = DISCOVER_ITEMS.map(function (item) {
      return `
        <a href="${item.href}" class="discover-card">
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <span class="card-arrow">Lire le guide</span>
        </a>
      `;
    }).join('');

    this.innerHTML = `<div class="discover-grid">${cards}</div>`;
  }
}

class KyranBlogGrid extends HTMLElement {
  connectedCallback() {
    if (typeof BLOG_ITEMS === 'undefined') {
      this.innerHTML = '';
      return;
    }

    const limit = parseInt(this.getAttribute('limit') || '0', 10);
    const category = this.getAttribute('category') || '';
    let items = BLOG_ITEMS.slice();

    if (category && category !== 'Tous') {
      items = items.filter(function (item) { return item.category === category; });
    }
    if (limit > 0) {
      items = items.slice(0, limit);
    }

    const cards = items.map(function (item) {
      const gc = (item.title.match(/^(\d+)/) || [])[1] || '8';
      return `
        <a href="${getBlogUrl(item.slug)}" class="blog-card" data-category="${item.category}">
          <div class="blog-card-image">
            <img src="${item.image}" alt="${item.title}" width="400" height="225" loading="lazy" decoding="async" />
            <span class="blog-badge">${item.category}</span>
            <span class="blog-card-games">${gc} jeux</span>
            <span class="blog-card-read">${item.readMinutes} min</span>
          </div>
          <div class="blog-card-body">
            <p class="blog-card-meta">${formatBlogDate(item.date)}</p>
            <h3>${item.title}</h3>
            <p class="blog-card-excerpt">${item.excerpt}</p>
            <span class="card-arrow">Lire l'article</span>
          </div>
        </a>
      `;
    }).join('');

    this.innerHTML = `<div class="blog-grid">${cards}</div>`;
  }
}

class KyranBlogFilters extends HTMLElement {
  connectedCallback() {
    if (typeof BLOG_CATEGORIES === 'undefined') return;

    const pills = BLOG_CATEGORIES.map(function (cat, index) {
      const active = index === 0 ? ' is-active' : '';
      return `<button type="button" class="blog-filter-pill${active}" data-filter="${cat}">${cat}</button>`;
    }).join('');

    this.innerHTML = `<div class="blog-filters" role="group" aria-label="Filtrer par catégorie">${pills}</div><p class="blog-filter-count" id="blog-filter-count"></p>`;

    const grid = document.querySelector('kyran-blog-grid .blog-grid');
    const countEl = this.querySelector('#blog-filter-count');
    if (!grid) return;

    function updateCount(filter) {
      if (!countEl) return;
      var visible = 0;
      grid.querySelectorAll('.blog-card').forEach(function (card) {
        var cat = card.getAttribute('data-category');
        if (filter === 'Tous' || cat === filter) visible++;
      });
      countEl.textContent = visible + ' article' + (visible > 1 ? 's' : '') + (filter !== 'Tous' ? ' · ' + filter : '');
    }

    updateCount('Tous');

    this.querySelectorAll('.blog-filter-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        const filter = pill.getAttribute('data-filter');
        pill.parentElement.querySelectorAll('.blog-filter-pill').forEach(function (p) {
          p.classList.remove('is-active');
        });
        pill.classList.add('is-active');

        grid.querySelectorAll('.blog-card').forEach(function (card) {
          const cat = card.getAttribute('data-category');
          const show = filter === 'Tous' || cat === filter;
          card.style.display = show ? '' : 'none';
        });
        updateCount(filter);
      });
    });
  }
}

class KyranRelatedArticles extends HTMLElement {
  connectedCallback() {
    const slug = this.getAttribute('slug') || '';
    if (typeof getRelatedArticles === 'undefined') return;

    const related = getRelatedArticles(slug, 3);
    if (!related.length) {
      this.innerHTML = '';
      return;
    }

    const cards = related.map(function (item) {
      return `
        <a href="${getBlogUrl(item.slug)}" class="blog-card blog-card--compact">
          <div class="blog-card-image">
            <img src="${item.image}" alt="${item.title}" width="320" height="180" loading="lazy" decoding="async" />
          </div>
          <div class="blog-card-body">
            <p class="blog-card-meta">${item.category} · ${item.readMinutes} min</p>
            <h3>${item.title}</h3>
          </div>
        </a>
      `;
    }).join('');

    this.innerHTML = `
      <section class="related-articles">
        <h2>Articles similaires</h2>
        <div class="blog-grid blog-grid--compact">${cards}</div>
      </section>
    `;
  }
}

class KyranStatBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="stat-bar" role="list">
        <div class="stat-item" role="listitem">
          <span class="stat-icon" aria-hidden="true">👥</span>
          <span class="stat-value">3–6 joueurs</span>
        </div>
        <span class="stat-sep" aria-hidden="true">·</span>
        <div class="stat-item" role="listitem">
          <span class="stat-icon" aria-hidden="true">⏱️</span>
          <span class="stat-value">30 min</span>
        </div>
        <span class="stat-sep" aria-hidden="true">·</span>
        <div class="stat-item" role="listitem">
          <span class="stat-icon" aria-hidden="true">🎂</span>
          <span class="stat-value">Dès 8 ans</span>
        </div>
        <span class="stat-sep" aria-hidden="true">·</span>
        <div class="stat-item" role="listitem">
          <span class="stat-icon" aria-hidden="true">🃏</span>
          <span class="stat-value">55 cartes toilées</span>
        </div>
      </div>
    `;
  }
}

class KyranCtaBand extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Prêt à défier votre intuition ?';
    const text = this.getAttribute('text') || 'Commandez KYRAN ou apprenez les règles en quelques minutes.';
    const secondaryHref = rootPath(this.getAttribute('secondary-href') || 'regle.html');
    const secondaryLabel = this.getAttribute('secondary-label') || 'Voir les règles';
    const showDojo = this.getAttribute('show-dojo') !== 'false';

    this.innerHTML = `
      <div class="cta-band">
        <h2>${title}</h2>
        <p>${text}</p>
        <div class="cta-band-actions">
          <a class="btn btn-primary" href="${ORDER_URL}">Commander — 9,99&euro;</a>
          <a class="btn btn-secondary" href="${secondaryHref}">${secondaryLabel}</a>
          ${showDojo ? '<a class="btn btn-secondary" href="' + ROOT + 'minijeu.html">Essayer le Dojo</a>' : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('kyran-header', KyranHeader);
customElements.define('kyran-footer', KyranFooter);
customElements.define('kyran-breadcrumb', KyranBreadcrumb);
customElements.define('kyran-page-hero', KyranPageHero);
customElements.define('kyran-discover-grid', KyranDiscoverGrid);
customElements.define('kyran-blog-grid', KyranBlogGrid);
customElements.define('kyran-blog-filters', KyranBlogFilters);
customElements.define('kyran-related-articles', KyranRelatedArticles);
customElements.define('kyran-stat-bar', KyranStatBar);
customElements.define('kyran-cta-band', KyranCtaBand);

function initMobileCarouselDots() {
  if (typeof window === 'undefined' || window.innerWidth > 768) return;
  var selectors = [
    '.steps-grid',
    '.powers-grid',
    '.amazon-reviews-grid',
    '.product-perks',
    '.game-gallery-quotes',
    '.blog-section-home .blog-grid'
  ];

  selectors.forEach(function (sel) {
    var carousels = document.querySelectorAll(sel);
    carousels.forEach(function (carousel) {
      if (carousel.dataset.hasDots) return;
      var items = carousel.children;
      if (!items || items.length <= 1) return;
      carousel.dataset.hasDots = 'true';

      var dotsContainer = document.createElement('div');
      dotsContainer.className = 'mobile-carousel-dots';
      dotsContainer.setAttribute('role', 'tablist');
      dotsContainer.setAttribute('aria-label', 'Pagination carrousel');

      var dots = [];
      for (var i = 0; i < items.length; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'carousel-dot' + (idx === 0 ? ' is-active' : '');
          dot.setAttribute('aria-label', 'Afficher élément ' + (idx + 1));
          dot.addEventListener('click', function () {
            items[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          });
          dotsContainer.appendChild(dot);
          dots.push(dot);
        })(i);
      }

      carousel.parentNode.insertBefore(dotsContainer, carousel.nextSibling);

      var ticking = false;
      carousel.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            var carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
            var closestIndex = 0;
            var minDistance = Infinity;
            for (var j = 0; j < items.length; j++) {
              var itemCenter = items[j].offsetLeft + items[j].offsetWidth / 2;
              var dist = Math.abs(carouselCenter - itemCenter);
              if (dist < minDistance) {
                minDistance = dist;
                closestIndex = j;
              }
            }
            dots.forEach(function (d, k) {
              d.classList.toggle('is-active', k === closestIndex);
            });
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    });
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(initMobileCarouselDots, 250);
    });
  } else {
    setTimeout(initMobileCarouselDots, 250);
  }
  window.addEventListener('resize', function () {
    if (window.innerWidth <= 768) {
      initMobileCarouselDots();
    }
  });
}
