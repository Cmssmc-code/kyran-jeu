const AMAZON_URL = 'https://www.amazon.fr/dp/B0G217LD87';
const INSTAGRAM_URL = 'https://www.instagram.com/kyran.jeu/';

const DISCOVER_ITEMS = [
  { href: 'jeu-apero.html', title: 'Jeu apéro', desc: 'Soirée 30 min, 3 à 6 joueurs' },
  { href: 'alternative-skyjo.html', title: 'Alternative Skyjo', desc: 'Même usage, mécaniques de plis' },
  { href: 'tarot-africain.html', title: 'Tarot Africain', desc: 'Héritage et genèse du jeu' },
  { href: 'whist-moderne.html', title: 'Whist moderne', desc: 'Contrat, plis et pari impitoyable' },
  { href: 'comparatif-jeux-plis.html', title: 'Jeux de plis', desc: 'KYRAN vs Wizard, Oh Hell…' },
  { href: 'faq.html', title: 'FAQ', desc: 'Questions fréquentes' }
];

class KyranHeader extends HTMLElement {
  connectedCallback() {
    const activePage = this.getAttribute('active') || '';
    const discoverActive = ['discover', 'apero', 'skyjo', 'tarot', 'whist', 'plis', 'faq'].includes(activePage);
    const submenu = DISCOVER_ITEMS.map(function (item) {
      return `<li><a href="${item.href}">${item.title}<span class="sub-desc">${item.desc}</span></a></li>`;
    }).join('');

    this.innerHTML = `
      <header>
        <div class="container nav">
          <a href="index.html" class="logo" aria-label="KYRAN - Accueil">
            <img src="logo.png" alt="KYRAN" />
          </a>

          <nav aria-label="Navigation principale">
            <ul id="menu-principal">
              <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Accueil</a></li>
              <li><a href="regle.html" class="${activePage === 'rules' ? 'active' : ''}">R&egrave;gles</a></li>
              <li><a href="minijeu.html" class="${activePage === 'game' ? 'active' : ''}">Dojo</a></li>
              <li class="nav-dropdown">
                <a href="jeu-apero.html" class="${discoverActive ? 'active' : ''}" aria-haspopup="true">D&eacute;couvrir</a>
                <ul class="nav-submenu" aria-label="Guides KYRAN">${submenu}</ul>
              </li>
              <li><a href="dossier-presse.html" class="${activePage === 'press' ? 'active' : ''}">Presse</a></li>
              <li class="mobile-cta" style="display:none;">
                <a class="btn btn-primary" href="${AMAZON_URL}" target="_blank" rel="noopener noreferrer">Commander</a>
              </li>
            </ul>
          </nav>

          <button class="nav-toggle" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>

          <div class="cta">
            <a class="btn btn-primary" href="${AMAZON_URL}" target="_blank" rel="noopener noreferrer">Commander</a>
          </div>
        </div>
        <div class="backdrop" hidden></div>
      </header>
    `;

    const navToggle = this.querySelector('.nav-toggle');
    const body = document.body;
    const backdrop = this.querySelector('.backdrop');
    const mobileCta = this.querySelector('.mobile-cta');

    function toggleMenu() {
      const isOpen = body.classList.toggle('menu-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      backdrop.hidden = !isOpen;
      if (mobileCta) mobileCta.style.display = isOpen ? 'block' : 'none';
    }

    if (navToggle) navToggle.addEventListener('click', toggleMenu);
    if (backdrop) backdrop.addEventListener('click', toggleMenu);
  }
}

class KyranFooter extends HTMLElement {
  connectedCallback() {
    const exploreLinks = DISCOVER_ITEMS.map(function (item) {
      return `<p><a href="${item.href}">${item.title}</a></p>`;
    }).join('');

    this.innerHTML = `
      <footer>
        <div class="footer-grid">
          <div class="footer-col">
            <h4>KYRAN</h4>
            <p>Jeu de cartes &middot; Ap&eacute;ro &middot; 3&ndash;6 joueurs &middot; ~30 min</p>
            <p>Le jeu de cartes strat&eacute;gique o&ugrave; perdre est aussi important que gagner.</p>
          </div>
          <div class="footer-col">
            <h4>Explorer</h4>
            ${exploreLinks}
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <p><a href="regle.html">R&egrave;gles du jeu</a></p>
            <p><a href="minijeu.html">Dojo interactif</a></p>
            <p><a href="dossier-presse.html">Espace Presse</a></p>
            <p><a href="mailto:contact@kyran-jeu.fr">contact@kyran-jeu.fr</a></p>
            <p><a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer me">Instagram @kyran.jeu</a></p>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-social">
            <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer me" aria-label="KYRAN sur Instagram">Instagram</a>
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
      if (isLast || !item.href) {
        return `<span class="breadcrumb-current" aria-current="page">${item.label}</span>`;
      }
      return `<a href="${item.href}">${item.label}</a><span class="breadcrumb-sep" aria-hidden="true">/</span>`;
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

class KyranStatBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="stat-bar" role="list">
        <div class="stat-item" role="listitem">
          <span class="stat-value">3–6</span>
          <span class="stat-label">Joueurs</span>
        </div>
        <div class="stat-item" role="listitem">
          <span class="stat-value">~30 min</span>
          <span class="stat-label">Dur&eacute;e</span>
        </div>
        <div class="stat-item" role="listitem">
          <span class="stat-value">8+</span>
          <span class="stat-label">&Acirc;ge</span>
        </div>
      </div>
    `;
  }
}

class KyranCtaBand extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Prêt à défier votre intuition ?';
    const text = this.getAttribute('text') || 'Commandez KYRAN ou apprenez les règles en quelques minutes.';
    const secondaryHref = this.getAttribute('secondary-href') || 'regle.html';
    const secondaryLabel = this.getAttribute('secondary-label') || 'Voir les règles';
    const showDojo = this.getAttribute('show-dojo') !== 'false';

    this.innerHTML = `
      <div class="cta-band">
        <h2>${title}</h2>
        <p>${text}</p>
        <div class="cta-band-actions">
          <a class="btn btn-primary" href="${AMAZON_URL}" target="_blank" rel="noopener noreferrer">Commander — 17,99&euro;</a>
          <a class="btn btn-secondary" href="${secondaryHref}">${secondaryLabel}</a>
          ${showDojo ? '<a class="btn btn-secondary" href="minijeu.html">Essayer le Dojo</a>' : ''}
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
customElements.define('kyran-stat-bar', KyranStatBar);
customElements.define('kyran-cta-band', KyranCtaBand);
