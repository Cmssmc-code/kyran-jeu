const AMAZON_URL = 'https://www.amazon.fr/dp/B0G217LD87';
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/eVqeVfaWz4k02yY1UqaEE00';
const INSTAGRAM_URL = 'https://www.instagram.com/kyran.jeu/';
const INSTAGRAM_HANDLE = '@kyran.jeu';
const BGG_URL = 'https://boardgamegeek.com/boardgame/480678/kyran';
const ROOT = '/';
const ORDER_URL = rootPath('commander.html');

function rootPath(path) {
  if (!path || path === 'index.html' || path === '/index.html') return ROOT;
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
  'idee-cadeau.html': 'discover',
  'merci.html': 'order',
  'regle.html': 'rules',
  'minijeu.html': 'game',
  'dossier-presse.html': 'discover',
  'jeu-apero.html': 'discover',
  'jouer-en-ligne.html': 'discover',
  'avent.html': 'discover',
  'secret-santa.html': 'discover',
  'tarot-africain.html': 'discover',
  'tarot-africain-a-3-joueurs.html': 'discover',
  'whist-22.html': 'discover',
  'ressources-gratuites.html': 'discover',
  'regles-rikiki.html': 'discover',
  'a-propos.html': 'discover',
  'communaute.html': 'discover',
  'faq.html': 'faq',
  'plan-du-site.html': 'discover',
  'mentions-legales.html': 'legal',
  'cgv.html': 'legal',
  'confidentialite.html': 'legal'
};

function resolveActivePage(explicit, pathname) {
  if (explicit) return explicit;
  var path = String(pathname || window.location.pathname).toLowerCase();
  if (path.indexOf('/blog') !== -1) return 'blog';
  var file = path.split('/').pop() || 'index.html';
  if (!file || file.endsWith('/')) file = 'index.html';
  if (!file.endsWith('.html') && ACTIVE_BY_PATH[file + '.html']) {
    return ACTIVE_BY_PATH[file + '.html'];
  }
  return ACTIVE_BY_PATH[file] || '';
}

const DISCOVER_ITEMS = [
  { href: '/idee-cadeau.html', title: 'Idée cadeau', desc: 'Offrir KYRAN, délais de livraison' },
  { href: '/jouer-en-ligne.html', title: 'Jouer en ligne', desc: 'Contre l\'ordinateur, 2 à 5 adversaires' },
  { href: '/avent.html', title: 'Calendrier de l\'Avent', desc: '24 défis de plis, un par jour' },
  { href: '/secret-santa.html', title: 'Cadeau Secret Santa', desc: 'Un jeu à moins de 10 €' },
  { href: '/simulation.html', title: '10 000 parties simulées', desc: 'Comment gagner à KYRAN' },
  { href: '/jeu-apero.html', title: 'Jeu apéro', desc: 'Soirée 30 min, 3 à 6 joueurs' },
  { href: '/blog/jeux-comme-skyjo.html', title: 'Jeux comme Skyjo', desc: '10 alternatives et variantes' },
  { href: '/tarot-africain.html', title: 'Tarot Africain', desc: 'Règles, variantes et comptage' },
  { href: '/whist-22.html', title: 'Whist 22', desc: 'Définition et jeux proches' },
  { href: '/blog/jeux-plis-comparatif.html', title: 'Jeux de plis', desc: 'KYRAN vs Wizard, Oh Hell…' },
  { href: '/communaute.html', title: 'Communauté', desc: 'Vos parties en photos et vidéos' },
  { href: '/a-propos.html', title: 'À propos', desc: 'L\'auteur et notre méthode' },
  { href: '/dossier-presse.html', title: 'Presse', desc: 'Communiqué, visuels et contact' }
];

const FALLBACK_FOOTER_BLOG_ITEMS = [
  { slug: 'jeux-comme-skyjo', title: '10 jeux comme Skyjo' },
  { slug: 'meilleurs-jeux-apero', title: 'Les meilleurs jeux de cartes pour apéro' },
  { slug: 'jeux-soiree-amis', title: 'Jeux pour une soirée entre amis' },
  { slug: 'jeux-3-joueurs', title: 'Jeux de cartes à 3 joueurs' },
  { slug: 'jeux-plis-comparatif', title: 'Comparatif des jeux de plis' }
];

function getBlogItemsForFooter() {
  if (typeof BLOG_ITEMS !== 'undefined' && BLOG_ITEMS.length) {
    return BLOG_ITEMS.slice(0, 5);
  }
  return FALLBACK_FOOTER_BLOG_ITEMS;
}

function getBlogUrl(slug) {
  return '/blog/' + slug + '.html';
}

function formatBlogDate(isoDate) {
  if (!isoDate) return '';
  var parts = isoDate.split('-');
  var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var y = parts[0];
  var m = parseInt(parts[1], 10) - 1;
  var d = parseInt(parts[2], 10);
  return d + ' ' + (months[m] || '') + ' ' + y;
}

function renderHeaderHtml(active, pathname) {
    const activePage = resolveActivePage(active, pathname);
    const discoverActive = ['discover', 'apero', 'skyjo', 'tarot', 'whist', 'plis', 'press'].includes(activePage);
    const submenu = DISCOVER_ITEMS.map(function (item) {
      return `<li><a href="${item.href}">${item.title}<span class="sub-desc">${item.desc}</span></a></li>`;
    }).join('');
    const drawerDiscover = DISCOVER_ITEMS.map(function (item) {
      return `<a class="nav-drawer-link" href="${item.href}">${item.title}<span>${item.desc}</span></a>`;
    }).join('');

    return `
      <div class="top-announcement-bar" role="region" aria-label="Offre et livraison">
        <div class="container announcement-content">
          <a href="${rootPath('idee-cadeau.html')}" class="announcement-pill">Idée cadeau</a>
          <span class="announcement-text"><strong>9,99&nbsp;&euro;</strong> en direct du créateur<span class="announcement-extra"> · expédié sous 24 à 48&nbsp;h, suivi La Poste</span></span>
          <a href="${ORDER_URL}" class="announcement-link">Commander &rarr;</a>
        </div>
      </div>
      <header class="site-header">
        <div class="container nav">
          <div class="nav-brand-group">
            <a href="${ROOT}" class="logo" aria-label="KYRAN, retour à l'accueil">
              <img src="${ROOT}logo-96.webp" alt="" width="44" height="44" decoding="async" />
              <span class="logo-word" aria-hidden="true">KYRAN<small>Ma&icirc;tre des Mystiques</small></span>
            </a>

            <nav class="nav-primary" id="nav-primary" aria-label="Navigation principale">
              <ul class="nav-list" id="menu-principal">
                <li><a href="${ROOT}" class="nav-link ${activePage === 'home' ? 'active' : ''}">Accueil</a></li>
                <li><a href="${ROOT}regle.html" class="nav-link ${activePage === 'rules' ? 'active' : ''}">R&egrave;gles</a></li>
                <li><a href="${ROOT}minijeu.html" class="nav-link ${activePage === 'game' ? 'active' : ''}">Jouer</a></li>
                <li><a href="${ROOT}faq.html" class="nav-link ${activePage === 'faq' ? 'active' : ''}">FAQ</a></li>
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
                <li><a href="${ROOT}blog/" class="nav-link ${activePage === 'blog' ? 'active' : ''}">Blog</a></li>
              </ul>
              <div class="nav-drawer-footer nav-mobile-only">
                <a class="btn btn-primary btn-block" href="${ORDER_URL}">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <span>Commander · 9,99&nbsp;&euro;</span>
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
        <a href="${ROOT}" class="mobile-nav-tab ${activePage === 'home' ? 'active' : ''}">
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
          <span class="mobile-nav-label">Jouer</span>
        </a>
        <a href="${ORDER_URL}" class="mobile-nav-tab mobile-nav-tab--highlight ${activePage === 'order' ? 'active' : ''}">
          <span class="mobile-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </span>
          <span class="mobile-nav-label">Acheter</span>
          <span class="mobile-nav-pill">9,99&nbsp;€</span>
        </a>
      </nav>
    `;
}

// Un élément créé par le parseur HTML est connecté AVANT que ses enfants soient analysés :
// avec un rendu statique (data-ssr), on attend la fin de l'analyse avant de brancher les événements.
function whenParsed(callback) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
  else callback();
}

// Du 1er novembre au 16 décembre, le bandeau d'annonce rappelle la date limite de commande pour Noël
// (même règle que js/livraison.js : 16 décembre + 6 jours ouvrés = 24 décembre). Fait au chargement,
// car le HTML prérendu ne doit pas dépendre de la date du build.
function initNoelAnnouncement() {
  var now = new Date();
  var y = now.getFullYear();
  if (now < new Date(y, 10, 1) || now > new Date(y, 11, 16, 23, 59)) return;
  var text = document.querySelector('.announcement-text');
  if (!text) return;
  text.innerHTML = '<strong>9,99&nbsp;&euro;</strong> &middot; Noël&nbsp;: commandez avant le 16&nbsp;décembre';
}

if (typeof document !== 'undefined') whenParsed(initNoelAnnouncement);

class KyranHeader extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-ssr')) {
      whenParsed(() => this.bindBehavior());
    } else {
      this.innerHTML = renderHeaderHtml(this.getAttribute('active'));
      this.bindBehavior();
    }
  }

  bindBehavior() {

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
      document.documentElement.style.overflow = '';
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Ouvrir le menu');
      backdrop.hidden = true;
    }

    const siteHeader = this.querySelector('.site-header');

    function openMenu() {
      // Le tiroir démarre sous la barre de navigation, où qu'elle soit (barre d'annonce visible ou non).
      if (siteHeader) {
        var top = Math.max(0, Math.round(siteHeader.getBoundingClientRect().bottom));
        document.documentElement.style.setProperty('--nav-drawer-top', top + 'px');
      }
      body.classList.add('menu-open');
      document.documentElement.style.overflow = 'hidden';
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

function renderFooterHtml() {
    const exploreLinks = DISCOVER_ITEMS.map(function (item) {
      return `<p><a href="${item.href}">${item.title}</a></p>`;
    }).join('');

    const blogItems = getBlogItemsForFooter();
    const blogLinks = blogItems.map(function (item) {
      return `<p><a href="${getBlogUrl(item.slug)}">${item.title}</a></p>`;
    }).join('');
    const blogSection = blogLinks
      ? `<div class="footer-col footer-col--blog"><p class="footer-heading">Blog</p>${blogLinks}<p><a href="${ROOT}blog/">Tous les articles</a></p></div>`
      : '';

    return `
      <footer>
        <div class="footer-grid">
          <div class="footer-col footer-col--brand">
            <p class="footer-heading footer-brand"><img src="${ROOT}logo-96.webp" alt="" width="40" height="40" loading="lazy" decoding="async" /><span>KYRAN</span></p>
            <p>Jeu de cartes de plis et de paris &middot; 3 &agrave; 6 joueurs &middot; 30&nbsp;min &middot; d&egrave;s 8 ans</p>
            <p class="footer-desc">Le jeu o&ugrave; il faut gagner le nombre exact de plis annonc&eacute;s. Ni plus, ni moins.</p>
            <div class="footer-follow">
              <p class="footer-follow-label">Suivez le jeu</p>
              ${instagramLinkHtml('social-link social-link--instagram')}
              <a class="footer-bgg-link" href="${BGG_URL}" target="_blank" rel="noopener noreferrer">Fiche BoardGameGeek</a>
            </div>
          </div>
          <div class="footer-col footer-col--explore">
            <p class="footer-heading">Explorer</p>
            ${exploreLinks}
          </div>
          ${blogSection}
          <div class="footer-col footer-col--contact">
            <p class="footer-heading">Contact</p>
            <p><a href="${ROOT}regle.html">R&egrave;gles du jeu</a></p>
            <p><a href="${ROOT}minijeu.html">Jouer à KYRAN</a></p>
            <p><a href="${ROOT}ressources-gratuites.html">Ressources gratuites</a></p>
            <p><a href="${ROOT}dossier-presse.html">Espace Presse</a></p>
            <p><a href="mailto:contact@kyran-jeu.fr">contact@kyran-jeu.fr</a></p>
          </div>
          <div class="footer-col footer-col--credits">
            <p class="footer-heading">Cr&eacute;dits</p>
            <p>Design : <a href="https://graphiste.com/pictures/542454" target="_blank" rel="noopener noreferrer">Crea by Floh</a></p>
            <p>Auteur : Corentin Sence</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-trust-note">Paiement sécurisé par Stripe · Expédié sous 24 à 48&nbsp;h avec suivi · Édité en France</p>
          <p class="footer-seo-links">
            <a href="${ROOT}mentions-legales.html">Mentions légales</a>
            <span aria-hidden="true"> · </span>
            <a href="${ROOT}cgv.html">CGV</a>
            <span aria-hidden="true"> · </span>
            <a href="${ROOT}confidentialite.html">Confidentialité</a>
            <span aria-hidden="true"> · </span>
            <a href="#" data-kyran-cookies>Gérer les cookies</a>
            <span aria-hidden="true"> · </span>
            <a href="${ROOT}plan-du-site.html">Plan du site</a>
            <span aria-hidden="true"> · </span>
            <a href="${ROOT}sitemap.xml">Sitemap</a>
            <span aria-hidden="true"> · </span>
            <a href="${ROOT}llms.txt">llms.txt</a>
          </p>
          <p class="footer-copyright">&copy; 2026 KYRAN. Tous droits r&eacute;serv&eacute;s.</p>
        </div>
      </footer>
    `;
}

class KyranFooter extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-ssr')) return;
    this.innerHTML = renderFooterHtml();
  }
}

function renderBreadcrumbHtml(items) {
  const esc = function (v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  const parts = items.map(function (item, index) {
    const isLast = index === items.length - 1;
    const href = item.href && !/^\s*(javascript|data|vbscript):/i.test(item.href) ? rootPath(item.href) : '';
    if (isLast || !href) {
      return `<span class="breadcrumb-current" aria-current="page">${esc(item.label)}</span>`;
    }
    return `<a href="${esc(href)}">${esc(item.label)}</a><span class="breadcrumb-sep" aria-hidden="true">/</span>`;
  }).join('');

  return `<nav class="breadcrumb" aria-label="Fil d'Ariane">${parts}</nav>`;
}

class KyranBreadcrumb extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-ssr')) return;
    let items = [];
    try {
      items = JSON.parse(this.getAttribute('items') || '[]');
    } catch (e) {
      items = [];
    }
    this.innerHTML = renderBreadcrumbHtml(items);
  }
}

class KyranPageHero extends HTMLElement {
  connectedCallback() {
    // Contenu hero déjà pré-rendu en HTML statique pour le SEO.
    // Zéro manipulation DOM pour éviter tout doublon d'affichage.
  }
}

function renderDiscoverGridHtml() {
  const cards = DISCOVER_ITEMS.map(function (item) {
    return `
        <a href="${item.href}" class="discover-card">
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <span class="card-arrow">Lire le guide</span>
        </a>
      `;
  }).join('');

  return `<div class="discover-grid">${cards}</div>`;
}

class KyranDiscoverGrid extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-ssr')) return;
    this.innerHTML = renderDiscoverGridHtml();
  }
}

function blogImageHtml(item, width, height) {
  const img = `<img src="${item.image}" alt="${item.title}" width="${width}" height="${height}" loading="lazy" decoding="async" />`;
  return item.webp ? `<picture><source srcset="${item.webp}" type="image/webp" />${img}</picture>` : img;
}

function renderBlogGridHtml(limit, category) {
  if (typeof BLOG_ITEMS === 'undefined') return '';

  let items = BLOG_ITEMS.slice();
  if (category && category !== 'Tous') {
    items = items.filter(function (item) { return item.category === category; });
  }
  if (limit > 0) {
    items = items.slice(0, limit);
  }

  const cards = items.map(function (item) {
    const gc = item.gameCount;
    return `
        <a href="${getBlogUrl(item.slug)}" class="blog-card" data-category="${item.category}">
          <div class="blog-card-image">
            ${blogImageHtml(item, 400, 225)}
            <span class="blog-badge">${item.category}</span>
            ${gc ? '<span class="blog-card-games">' + gc + ' jeux</span>' : ''}
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

  return `<div class="blog-grid">${cards}</div>`;
}

class KyranBlogGrid extends HTMLElement {
  connectedCallback() {
    // Grille déjà pré-rendue statiquement (data-ssr) : ne rien réécrire
    if (this.hasAttribute('data-ssr')) return;
    this.innerHTML = renderBlogGridHtml(parseInt(this.getAttribute('limit') || '0', 10), this.getAttribute('category') || '');
  }
}

function renderBlogFiltersHtml() {
  const pills = BLOG_CATEGORIES.map(function (cat, index) {
    const active = index === 0 ? ' is-active' : '';
    return `<button type="button" class="blog-filter-pill${active}" data-filter="${cat}">${cat}</button>`;
  }).join('');

  return `<div class="blog-filters" role="group" aria-label="Filtrer par catégorie">${pills}</div><p class="blog-filter-count" id="blog-filter-count"></p>`;
}

class KyranBlogFilters extends HTMLElement {
  connectedCallback() {
    if (typeof BLOG_CATEGORIES === 'undefined') return;

    if (this.hasAttribute('data-ssr')) {
      whenParsed(() => this.bindBehavior());
    } else {
      this.innerHTML = renderBlogFiltersHtml();
      whenParsed(() => this.bindBehavior());
    }
  }

  bindBehavior() {

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

function renderRelatedHtml(slug) {
  if (typeof getRelatedArticles === 'undefined') return '';

  const related = getRelatedArticles(slug, 3);
  if (!related.length) return '';

  const cards = related.map(function (item) {
    return `
        <a href="${getBlogUrl(item.slug)}" class="blog-card blog-card--compact">
          <div class="blog-card-image">
            ${blogImageHtml(item, 320, 180)}
          </div>
          <div class="blog-card-body">
            <p class="blog-card-meta">${item.category} · ${item.readMinutes} min</p>
            <h3>${item.title}</h3>
          </div>
        </a>
      `;
  }).join('');

  return `
      <section class="related-articles">
        <h2>Articles similaires</h2>
        <div class="blog-grid blog-grid--compact">${cards}</div>
      </section>
    `;
}

class KyranRelatedArticles extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-ssr')) return;
    this.innerHTML = renderRelatedHtml(this.getAttribute('slug') || '');
  }
}

function renderStatBarHtml() {
  return `
      <div class="stat-bar stat-bar--specs" role="list" aria-label="Caractéristiques du jeu">
        <div class="stat-cell" role="listitem">
          <svg class="stat-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <div class="stat-info">
            <span class="stat-num">3–6</span>
            <span class="stat-desc">Joueurs</span>
          </div>
        </div>

        <div class="stat-cell" role="listitem">
          <svg class="stat-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div class="stat-info">
            <span class="stat-num">30 min</span>
            <span class="stat-desc">Partie</span>
          </div>
        </div>

        <div class="stat-cell" role="listitem">
          <svg class="stat-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <div class="stat-info">
            <span class="stat-num">8 ans +</span>
            <span class="stat-desc">Âge</span>
          </div>
        </div>

        <div class="stat-cell" role="listitem">
          <svg class="stat-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="13" height="17" rx="2"></rect>
            <path d="M7 5V3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2"></path>
          </svg>
          <div class="stat-info">
            <span class="stat-num">45 cartes</span>
            <span class="stat-desc">+ 30 cartes Vie</span>
          </div>
        </div>
      </div>
    `;
}

class KyranStatBar extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-ssr')) return;
    this.innerHTML = renderStatBarHtml();
  }
}

function renderCtaBandHtml(attr) {
  const title = attr('title') || 'Votre prochaine soirée, avec KYRAN ?';
  const text = attr('text') || 'Commandez KYRAN ou apprenez les règles en quelques minutes.';
  const secondaryHref = rootPath(attr('secondary-href') || 'regle.html');
  const secondaryLabel = attr('secondary-label') || 'Voir les règles';
  const showDojo = attr('show-dojo') !== 'false';

  return `
      <div class="cta-band">
        <h2>${title}</h2>
        <p>${text}</p>
        <div class="cta-band-actions">
          <a class="btn btn-primary" href="${ORDER_URL}">Commander · 9,99&nbsp;&euro;</a>
          <a class="btn btn-secondary" href="${secondaryHref}">${secondaryLabel}</a>
          ${showDojo ? '<a class="btn btn-secondary" href="' + ROOT + 'minijeu.html">Jouer à KYRAN</a>' : ''}
        </div>
        <p class="cta-band-gift">Une boîte de 205&nbsp;g, expédiée sous 24 à 48&nbsp;h avec suivi.</p>
      </div>
    `;
}

class KyranCtaBand extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute('data-ssr')) return;
    const el = this;
    this.innerHTML = renderCtaBandHtml(function (name) { return el.getAttribute(name); });
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
    '.amazon-reviews-grid',
    '.product-perks',
    '.game-gallery-quotes',
    '.blog-section-home .blog-grid'
  ];

  selectors.forEach(function (sel) {
    var carousels = document.querySelectorAll(sel);
    carousels.forEach(function (carousel) {
      if (carousel.dataset.hasDots) return;
      // Ne pas dupliquer si des dots existent déjà après le carrousel
      var nextEl = carousel.nextElementSibling;
      if (nextEl && nextEl.classList.contains('mobile-carousel-dots')) {
        carousel.dataset.hasDots = 'true';
        return;
      }
      var existingInParent = carousel.parentNode.querySelector('.mobile-carousel-dots');
      if (existingInParent) {
        carousel.dataset.hasDots = 'true';
        return;
      }

      var items = carousel.children;
      if (!items || items.length <= 1) return;
      carousel.dataset.hasDots = 'true';

      var dotsContainer = document.createElement('div');
      dotsContainer.className = 'mobile-carousel-dots';
      
      var dots = [];
      for (var i = 0; i < items.length; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'carousel-dot' + (idx === 0 ? ' is-active' : '');
          dot.setAttribute('aria-label', 'Afficher élément ' + (idx + 1));
          dot.addEventListener('click', function () {
            carousel.scrollTo({
              left: items[idx].offsetLeft - (carousel.clientWidth - items[idx].offsetWidth) / 2,
              behavior: 'smooth'
            });
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

// Vidéos chargées au clic (accueil, règles) : rien n'est intégré tant qu'on ne clique pas, la
// vidéo des règles n'a donc qu'une page de lecture (/video-regles.html) pour les moteurs.
function initVideoFacades() {
  document.querySelectorAll('[data-video-facade]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.parentNode;
      var el;
      if (btn.dataset.youtube) {
        el = document.createElement('iframe');
        el.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(btn.dataset.youtube) + '?autoplay=1';
        el.title = btn.dataset.title || 'Vidéo';
        el.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        el.referrerPolicy = 'strict-origin-when-cross-origin';
        el.allowFullscreen = true;
      } else if (btn.dataset.mp4) {
        el = document.createElement('video');
        el.src = btn.dataset.mp4;
        el.controls = true;
        el.autoplay = true;
        el.playsInline = true;
      } else {
        return;
      }
      box.replaceChild(el, btn);
      if (el.focus) el.focus();
    }, { once: true });
  });
}

if (typeof document !== 'undefined') whenParsed(initVideoFacades);

// Panneau d'achat (décisions de Corentin et du PDG du 20/11/2026, pour tous les visiteurs) : chaque bouton
// d'achat (liens vers /commander.html et lien Stripe habituel) ouvre un panneau unique : deux gros choix
// (« En main propre », port 0 € ; « Livraison », port selon la grille), la quantité avec + et − (1 à 99,
// alerte rouge dès 11), le total qui se met à jour et le bouton « Payer ». Les prix et la grille sont lus
// dans /js/tarifs.js, la même source que le serveur, qui crée la session Stripe (/api/commande) : le total
// affiché est celui de Stripe, au centime. Serveur injoignable : repli sur les liens de paiement habituels.
// Le repère festival=1, posé par /bienvenue.html (QR des festivals) et gardé en sessionStorage, ne sert
// qu'aux statistiques.
const FESTIVAL_KEY = 'kyranFestival';
const MAIN_PROPRE_STRIPE_URL = 'https://buy.stripe.com/6oU00laWzg2IflK42yaEE01';
const COMMANDE_API = 'https://kyran-webhook-production.up.railway.app/api/commande';

function isFestivalVisitor() {
  try {
    if (new URLSearchParams(location.search).get('festival') === '1') {
      sessionStorage.setItem(FESTIVAL_KEY, '1');
    }
    return sessionStorage.getItem(FESTIVAL_KEY) === '1';
  } catch (e) {
    return false;
  }
}

function isBuyLink(link) {
  const href = link.getAttribute('href') || '';
  if (href.indexOf(STRIPE_CHECKOUT_URL) === 0) return true;
  try {
    const url = new URL(href, location.href);
    return url.origin === location.origin && /\/commander(\.html)?$/.test(url.pathname);
  } catch (e) {
    return false;
  }
}

function trackAchat(name, params) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({ transport_type: 'beacon' }, params));
  } catch (e) { /* analytique facultative */ }
}

function initPurchaseChoice() {
  // Rendu au build (DOM simulé) ou navigateur sans <dialog> : le lien d'achat reste tel quel.
  if (typeof window === 'undefined' || typeof window.HTMLDialogElement !== 'function' || !document.body || typeof document.body.appendChild !== 'function') return;
  const festival = isFestivalVisitor() ? '1' : '0';
  // Grille lue au plus tard toutes les 10 minutes (cache de GitHub Pages) : jamais d'écart durable avec le serveur.
  const tarifsPromise = import('/js/tarifs.js?t=' + Math.floor(Date.now() / 600000)).catch(function () { return null; });
  const style = document.createElement('style');
  style.textContent = [
    '.achat-choix{position:fixed;inset:0;margin:auto;height:fit-content;border:2px solid var(--k-ink);border-radius:20px;padding:0;max-width:420px;width:calc(100% - 24px);max-height:calc(100% - 24px);overflow:auto;background:var(--k-cream);color:var(--k-ink);box-shadow:0 8px 0 var(--k-ink);}',
    '.achat-choix::backdrop{background:rgba(35,31,34,.6);}',
    '.achat-choix__body{padding:18px 18px 16px;}',
    '.achat-choix__tete{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 14px;}',
    '.achat-choix h2{font-size:1.25rem;margin:0;line-height:1.2;}',
    '.achat-choix__close{flex:none;width:40px;height:40px;border:2px solid var(--k-ink);border-radius:50%;background:#fff;color:var(--k-ink);font-size:1.4rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;}',
    '.achat-choix fieldset{border:0;margin:0 0 14px;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
    '.achat-choix legend{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);}',
    '.achat-choix__option{position:relative;display:flex;flex-direction:column;gap:2px;padding:12px 12px 10px;border:2px solid var(--k-ink);border-radius:14px;background:#fff;cursor:pointer;line-height:1.25;}',
    '.achat-choix__titre{font-weight:800;font-size:1.02rem;}',
    '.achat-choix__prix{font-weight:700;font-size:.95rem;}',
    '.achat-choix__info{font-size:.8rem;opacity:.75;}',
    '.achat-choix__option input{position:absolute;opacity:0;width:1px;height:1px;}',
    '.achat-choix__option.est-choisi{background:var(--k-saffron-hi);box-shadow:0 4px 0 var(--k-ink);}',
    '.achat-choix__option.est-choisi::after{content:"✓";position:absolute;top:-10px;right:-10px;width:24px;height:24px;border-radius:50%;background:var(--k-ink);color:#fff;font-size:.8rem;font-weight:800;display:flex;align-items:center;justify-content:center;}',
    '.achat-choix__option:focus-within{outline:3px solid var(--k-blue);outline-offset:2px;}',
    '.achat-choix__qte{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0;}',
    '.achat-choix__qte label{font-weight:700;white-space:nowrap;}',
    '.achat-choix__stepper{display:inline-flex;align-items:stretch;border:2px solid var(--k-ink);border-radius:12px;overflow:hidden;background:#fff;}',
    '.achat-choix__stepper button{width:42px;height:44px;border:0;margin:0;padding:0;background:#fff;color:var(--k-ink);font-size:1.4rem;font-weight:700;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;}',
    '.achat-choix__stepper button:disabled{opacity:.3;cursor:default;}',
    '.achat-choix__stepper input{width:48px;height:44px;border:0;border-left:2px solid var(--k-ink);border-right:2px solid var(--k-ink);border-radius:0;margin:0;padding:0;text-align:center;font:inherit;font-size:1.15rem;font-weight:700;background:#fff;color:var(--k-ink);-moz-appearance:textfield;}',
    '.achat-choix__stepper input::-webkit-inner-spin-button,.achat-choix__stepper input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}',
    '.achat-choix__alerte{min-height:1.3em;margin:6px 0 8px;font-size:.85rem;font-weight:600;color:var(--k-red);text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.achat-choix__recap{margin:0 0 14px;padding:10px 0 0;border-top:2px dashed rgba(35,31,34,.25);}',
    '.achat-choix__ligne{display:flex;justify-content:space-between;gap:12px;margin:0 0 4px;}',
    '.achat-choix__ligne--total{margin:6px 0 0;font-weight:800;font-size:1.15rem;}',
    '.achat-choix .btn{display:flex;align-items:center;justify-content:center;width:100%;min-height:54px;font-size:1.1rem;}',
    '.achat-choix__mp{margin:6px 0 0;font-size:.85rem;font-weight:600;}' +
    '.achat-choix__secu{margin:8px 0 0;text-align:center;font-size:.78rem;opacity:.7;}'
  ].join('');
  document.head.appendChild(style);

  const dialog = document.createElement('dialog');
  dialog.className = 'achat-choix';
  dialog.setAttribute('aria-labelledby', 'achat-choix-title');
  dialog.innerHTML =
    '<form class="achat-choix__body" method="dialog">' +
    '<div class="achat-choix__tete"><h2 id="achat-choix-title">Votre commande KYRAN</h2>' +
    '<button type="button" class="achat-choix__close" aria-label="Fermer">×</button></div>' +
    '<fieldset><legend>Comment voulez-vous votre jeu ?</legend>' +
    '<label class="achat-choix__option"><input type="radio" name="achat-mode" value="main-propre">' +
    '<span class="achat-choix__titre">Main propre</span><span class="achat-choix__prix">9,99&nbsp;€ la boîte</span>' +
    '<span class="achat-choix__info">Sans frais de port</span></label>' +
    '<label class="achat-choix__option"><input type="radio" name="achat-mode" value="livraison">' +
    '<span class="achat-choix__titre">Livraison</span><span class="achat-choix__prix">9,99&nbsp;€ + port</span>' +
    '<span class="achat-choix__info">Port dès 2,99&nbsp;€</span></label>' +
    '</fieldset>' +
    '<div class="achat-choix__qte">' +
    '<label for="achat-qte">Nombre de boîtes</label>' +
    '<div class="achat-choix__stepper">' +
    '<button type="button" class="achat-choix__moins" aria-label="Une boîte de moins">−</button>' +
    '<input id="achat-qte" type="number" inputmode="numeric" min="1" max="99" step="1" value="1">' +
    '<button type="button" class="achat-choix__plus" aria-label="Une boîte de plus">+</button>' +
    '</div></div>' +
    '<p class="achat-choix__alerte" aria-live="polite"></p>' +
    '<div class="achat-choix__recap" aria-live="polite"></div>' +
    '<button type="submit" class="btn btn-primary achat-choix__payer" value="payer">Payer</button>' +
    '<p class="achat-choix__secu">Paiement sécurisé par Stripe</p>' +
    '</form>';
  document.body.appendChild(dialog);

  const form = dialog.querySelector('form');
  const qte = dialog.querySelector('#achat-qte');
  const moins = dialog.querySelector('.achat-choix__moins');
  const plus = dialog.querySelector('.achat-choix__plus');
  const alerte = dialog.querySelector('.achat-choix__alerte');
  const total = dialog.querySelector('.achat-choix__recap');
  const payer = dialog.querySelector('.achat-choix__payer');
  let tarifs = null;
  let livraisonHref = STRIPE_CHECKOUT_URL;
  tarifsPromise.then(function (t) { tarifs = t; maj(); });

  function mode() {
    const checked = form.querySelector('input[name="achat-mode"]:checked');
    return checked ? checked.value : '';
  }

  function quantite() {
    const n = parseInt(qte.value, 10);
    const max = tarifs ? tarifs.QUANTITE_MAX : 99;
    return Number.isInteger(n) ? Math.min(max, Math.max(1, n)) : 1;
  }

  function maj() {
    const q = quantite();
    const max = tarifs ? tarifs.QUANTITE_MAX : 99;
    moins.disabled = q <= 1;
    plus.disabled = q >= max;
    const seuil = tarifs ? tarifs.SEUIL_ALERTE : 10;
    alerte.textContent = q > seuil ? 'Êtes-vous sûr de commander ' + q + ' boîtes ?' : '';
    const m = mode();
    form.querySelectorAll('.achat-choix__option').forEach(function (label) {
      label.classList.toggle('est-choisi', label.querySelector('input').checked);
    });
    payer.disabled = !m;
    if (!tarifs || !m) {
      total.textContent = m ? '' : 'Choisissez la remise en main propre ou la livraison.';
      if (!payer.dataset.envoi) payer.textContent = 'Payer';
      return;
    }
    const t = tarifs.totalCommande(q, m);
    const ligne = function (libelle, montant, classe) {
      return '<p class="achat-choix__ligne' + (classe || '') + '"><span>' + libelle + '</span><span>' + montant + '</span></p>';
    };
    total.innerHTML = ligne(q + (q > 1 ? ' boîtes' : ' boîte') + ' × 9,99&nbsp;€', tarifs.euros(t.boites)) +
      ligne(m === 'main-propre' ? 'Main propre' : 'Livraison', m === 'main-propre' ? 'sans frais' : tarifs.euros(t.port)) +
      ligne('Total', tarifs.euros(t.total), ' achat-choix__ligne--total');
    if (m === 'main-propre') total.innerHTML += '<p class="achat-choix__mp">On convient de la remise par mail.</p>';
    if (!payer.dataset.envoi) payer.textContent = 'Payer ' + tarifs.euros(t.total);
  }

  function regler(n) {
    qte.value = String(n);
    maj();
  }

  moins.addEventListener('click', function () { regler(quantite() - 1); });
  plus.addEventListener('click', function () { regler(quantite() + 1); });
  qte.addEventListener('input', maj);
  qte.addEventListener('change', function () { regler(quantite()); });
  // Événements GA4 nommés : choix de l'option, puis paiement.
  form.querySelectorAll('input[name="achat-mode"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      trackAchat(radio.value === 'main-propre' ? 'achat_choix_main_propre' : 'achat_choix_livraison', { festival: festival });
      maj();
    });
  });
  dialog.querySelector('.achat-choix__close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const m = mode();
    if (!m) return;
    const q = quantite();
    trackAchat('achat_payer', { festival: festival, mode: m, quantite: q });
    payer.disabled = true;
    payer.dataset.envoi = '1';
    payer.textContent = 'Ouverture du paiement…';
    const ref = new URLSearchParams(location.search).get('ref') || (festival === '1' ? 'festival' : '');
    const repli = m === 'main-propre' ? MAIN_PROPRE_STRIPE_URL : livraisonHref;
    fetch(COMMANDE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: m, quantite: q, ref: ref })
    }).then(function (res) {
      return res.ok ? res.json() : null;
    }).then(function (data) {
      location.href = data && typeof data.url === 'string' && /^https:\/\/(checkout|buy)\.stripe\.com\//.test(data.url) ? data.url : repli;
    }).catch(function () {
      location.href = repli;
    });
  });

  document.addEventListener('click', function (event) {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link || dialog.contains(link) || !isBuyLink(link)) return;
    if (typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    // Un lien Stripe de la page (ex. avec client_reference_id sur /commander.html) sert de repli pour la livraison.
    const href = link.getAttribute('href');
    livraisonHref = href.indexOf(STRIPE_CHECKOUT_URL) === 0 ? href : STRIPE_CHECKOUT_URL;
    delete payer.dataset.envoi;
    if (!mode()) {
      const defaut = form.querySelector('input[value="' + (festival === '1' ? 'main-propre' : 'livraison') + '"]');
      if (defaut) defaut.checked = true;
    }
    maj();
    dialog.showModal();
  }, true);

  // Retour arrière depuis Stripe (page restaurée du cache) : le bouton redevient utilisable.
  window.addEventListener('pageshow', function () {
    delete payer.dataset.envoi;
    maj();
  });
}

if (typeof document !== 'undefined') whenParsed(initPurchaseChoice);

// Bloc d'inscription par mail <kyran-inscription source="festival-qr|avent|site" titre="…" [festival-only]>.
// Rendu dans le navigateur seulement (jamais prérendu). Envoie l'adresse au serveur Railway (/api/inscription)
// avec la source, l'accord (case obligatoire) et les utm de la visite ; champ piège « site_web » caché pour
// les robots. Avec festival-only, le bloc n'apparaît qu'aux visiteurs venus du QR (repère kyranFestival).
// Événement GA4 : inscription_mail (paramètre source). Défini ici, après FESTIVAL_KEY (initialisé plus haut).
const INSCRIPTION_API = 'https://kyran-webhook-production.up.railway.app/api/inscription';
const INSCRIPTION_SOURCES = ['festival-qr', 'avent', 'site'];
const UTM_KEY = 'kyranUtm';
const INSCRIPTION_ACCORD = "J'accepte de recevoir par mail la règle et les nouvelles de KYRAN (un mail par semaine au plus). Désinscription en un clic.";

function visitUtm() {
  const utm = {};
  try {
    const params = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      const v = params.get(k);
      if (v) utm[k] = v.slice(0, 100);
    });
    if (Object.keys(utm).length) sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
    else return JSON.parse(sessionStorage.getItem(UTM_KEY) || '{}') || {};
  } catch (e) { /* stockage indisponible */ }
  return utm;
}

let inscriptionStyled = false;
function styleInscription() {
  if (inscriptionStyled) return;
  inscriptionStyled = true;
  const style = document.createElement('style');
  style.textContent = [
    '.inscription-mail{max-width:560px;margin:28px auto;padding:18px;border:2px solid var(--k-ink);border-radius:18px;background:var(--k-cream,#FBF6EC);box-shadow:0 5px 0 var(--k-ink);}',
    '.inscription-mail h2{font-size:1.2rem;margin:0 0 6px;line-height:1.25;}',
    '.inscription-mail p{margin:0 0 10px;}',
    '.inscription-mail__ligne{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px;}',
    '.inscription-mail__ligne input[type=email]{flex:1 1 220px;min-height:46px;border:2px solid var(--k-ink);border-radius:12px;padding:0 12px;font:inherit;background:#fff;color:var(--k-ink);}',
    '.inscription-mail__ligne .btn{flex:0 0 auto;min-height:46px;}',
    '.inscription-mail__accord{display:flex;gap:8px;align-items:flex-start;font-size:.85rem;line-height:1.4;margin:0 0 6px;}',
    '.inscription-mail__accord input{flex:none;width:20px;height:20px;margin:1px 0 0;}',
    '.inscription-mail__piege{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;}',
    '.inscription-mail__etat{min-height:1.2em;font-size:.9rem;font-weight:600;margin:6px 0 0;}',
    '.inscription-mail__etat.est-erreur{color:var(--k-red);}'
  ].join('');
  document.head.appendChild(style);
}

class KyranInscription extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendu) return;
    const source = INSCRIPTION_SOURCES.indexOf(this.getAttribute('source')) >= 0 ? this.getAttribute('source') : 'site';
    if (this.hasAttribute('festival-only') && !isFestivalVisitor()) return;
    this.dataset.rendu = '1';
    styleInscription();
    const uid = 'inscription-' + source;
    const titre = this.getAttribute('titre') || 'Recevez la règle du jeu en PDF par mail';
    const texte = this.getAttribute('texte') || '';
    this.innerHTML =
      '<form class="inscription-mail" novalidate>' +
      '<h2>' + titre + '</h2>' +
      (texte ? '<p>' + texte + '</p>' : '') +
      '<div class="inscription-mail__ligne">' +
      '<label class="sr-only" for="' + uid + '-email">Votre adresse mail</label>' +
      '<input id="' + uid + '-email" type="email" name="email" autocomplete="email" inputmode="email" placeholder="Votre adresse mail" required maxlength="254">' +
      '<button type="submit" class="btn btn-primary">Recevoir</button>' +
      '</div>' +
      '<div class="inscription-mail__piege" aria-hidden="true"><label>Site web <input type="text" name="site_web" tabindex="-1" autocomplete="off"></label></div>' +
      '<label class="inscription-mail__accord"><input type="checkbox" name="accord" required>' +
      '<span>' + INSCRIPTION_ACCORD + ' <a href="/confidentialite.html#inscription-mail">Politique de confidentialité</a></span></label>' +
      '<p class="inscription-mail__etat" role="status" aria-live="polite"></p>' +
      '</form>';
    const form = this.querySelector('form');
    const etat = form.querySelector('.inscription-mail__etat');
    const bouton = form.querySelector('button[type=submit]');
    const dire = function (msg, erreur) {
      etat.textContent = msg;
      etat.classList.toggle('est-erreur', Boolean(erreur));
    };
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = form.elements.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return dire('Vérifiez votre adresse mail.', true);
      if (!form.elements.accord.checked) return dire('Cochez la case d’accord pour recevoir les mails.', true);
      bouton.disabled = true;
      dire('Envoi…');
      fetch(INSCRIPTION_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, source: source, consentement: true, utm: visitUtm(), site_web: form.elements.site_web.value })
      }).then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        trackAchat('inscription_mail', { source: source, festival: isFestivalVisitor() ? '1' : '0' });
        form.innerHTML = '<h2>C’est noté&nbsp;!</h2><p>Un mail de confirmation part vers ' +
          email.replace(/[<>&"]/g, '') + ', avec la règle du jeu KYRAN en PDF.</p>';
      }).catch(function () {
        bouton.disabled = false;
        dire('L’inscription n’a pas abouti. Réessayez dans un instant.', true);
      });
    });
  }
}

if (typeof customElements !== 'undefined') customElements.define('kyran-inscription', KyranInscription);

// Fonctions de rendu pures, utilisées par scripts/prerender.mjs pour écrire le HTML statique.
var KyranRender = {
  header: renderHeaderHtml,
  footer: renderFooterHtml,
  breadcrumb: renderBreadcrumbHtml,
  discoverGrid: renderDiscoverGridHtml,
  blogGrid: renderBlogGridHtml,
  blogFilters: renderBlogFiltersHtml,
  related: renderRelatedHtml,
  statBar: renderStatBarHtml,
  ctaBand: renderCtaBandHtml
};
