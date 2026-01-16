class KyranHeader extends HTMLElement {
  connectedCallback() {
    const activePage = this.getAttribute('active') || '';
    this.innerHTML = `
      <header>
        <div class="container nav">
          <a href="index.html" class="logo" aria-label="KYRAN - Accueil">
            <img src="logo.png" alt="KYRAN" />
          </a>

          <nav aria-label="Navigation principale">
            <ul id="menu-principal">
              <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Accueil</a></li>
              <li><a href="regle.html" class="${activePage === 'rules' ? 'active' : ''}">R&egrave;gles</a></li> <li><a href="minijeu.html" class="${activePage === 'game' ? 'active' : ''}">Jouer (D&eacute;mo)</a></li> <li><a href="dossier-presse.html" class="${activePage === 'press' ? 'active' : ''}">Presse</a></li>
              <li class="mobile-cta" style="display:none;">
                <a class="btn" href="https://www.amazon.fr/dp/B0G217LD87" target="_blank">Commander</a>
              </li>
            </ul>
          </nav>

          <button class="nav-toggle" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>

          <div class="cta">
            <a class="btn cta-pulse" href="https://www.amazon.fr/dp/B0G217LD87" target="_blank">Commander</a>
          </div>
        </div>
        <div class="backdrop" hidden></div>
      </header>
    `;

    // Logique Menu Mobile
    const navToggle = this.querySelector('.nav-toggle');
    const body = document.body;
    const backdrop = this.querySelector('.backdrop');
    const mobileCta = this.querySelector('.mobile-cta');

    function toggleMenu(){
        const isOpen = body.classList.toggle('menu-open');
        navToggle.setAttribute('aria-expanded', isOpen);
        backdrop.hidden = !isOpen;
        if(mobileCta) mobileCta.style.display = isOpen ? 'block' : 'none';
    }

    if (navToggle) navToggle.addEventListener('click', toggleMenu);
    if (backdrop) backdrop.addEventListener('click', toggleMenu);
  }
}

class KyranFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <div class="footer-grid">
          <div class="footer-col">
            <h4>KYRAN</h4>
            <p>Le jeu de cartes strat&eacute;gique o&ugrave; perdre est aussi important que gagner.</p> </div>
          <div class="footer-col">
            <h4>Liens</h4>
            <p><a href="regle.html">R&egrave;gles du jeu</a></p> <p><a href="dossier-presse.html">Espace Presse</a></p>
            <p><a href="mailto:contact@kyran-jeu.fr">Contact</a></p>
          </div>
          <div class="footer-col">
            <h4>Cr&eacute;dits</h4> <p>Design : Crea by Floh</p>
            <p>Auteur : Corentin Sence</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 KYRAN. Tous droits r&eacute;serv&eacute;s.</p> </div>
      </footer>
    `;
  }
}

customElements.define('kyran-header', KyranHeader);
customElements.define('kyran-footer', KyranFooter);