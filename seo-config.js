(function () {
  /**
   * Configuration SEO / mesure — kyran-jeu.fr
   *
   * 1. Google Search Console : créer une propriété, copier le token de vérification
   *    dans googleSiteVerification ci-dessous, puis soumettre /sitemap.xml
   *
   * 2. GA4 : ga4MeasurementId renseigné. Conformité CNIL/RGPD : gtag.js n'est chargé
   *    QU'APRÈS un clic sur « Accepter » dans le bandeau de consentement ci-dessous
   *    (choix en localStorage `kyran_consent`, redemandé après 6 mois). Aucun appel
   *    à Google avant. Lien « Gérer les cookies » (attribut data-kyran-cookies) pour
   *    changer d'avis ; description dans confidentialite.html (section 7).
   *
   * 3. KPIs mensuels : voir seo-keywords.json (requêtes cibles + indicateurs)
   *    Surveiller dans Search Console : impressions/clics par page cluster
   */
  var ASSET_VERSION = '19fdf6ad46';

  var config = {
    googleSiteVerification: '',
    bingSiteVerification: '',
    ga4MeasurementId: 'G-NSWMR405Q8'
  };

  function injectDnsPrefetch() {
    ['https://www.youtube.com', 'https://i.ytimg.com'].forEach(function (href) {
      if (document.querySelector('link[rel="dns-prefetch"][href="' + href + '"]')) return;
      var link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  injectDnsPrefetch();

  if (config.googleSiteVerification) {
    var meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = config.googleSiteVerification;
    document.head.appendChild(meta);
  }

  if (config.bingSiteVerification) {
    var bingMeta = document.createElement('meta');
    bingMeta.name = 'msvalidate.01';
    bingMeta.content = config.bingSiteVerification;
    document.head.appendChild(bingMeta);
  }

  // --- GA4 soumis au consentement (CNIL) ---------------------------------------
  var CONSENT_KEY = 'kyran_consent';
  var CONSENT_MAX_AGE = 183 * 24 * 3600 * 1000; // 6 mois
  var gaLoaded = false;

  function readConsent() {
    try {
      var c = JSON.parse(localStorage.getItem(CONSENT_KEY));
      if (c && (c.value === 'accepted' || c.value === 'refused') && Date.now() - c.ts < CONSENT_MAX_AGE) return c.value;
    } catch (e) { /* stockage indisponible : on redemande */ }
    return null;
  }

  function writeConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ value: value, ts: Date.now() })); } catch (e) { /* ignoré */ }
  }

  function loadGa() {
    if (!config.ga4MeasurementId || gaLoaded) return;
    gaLoaded = true;
    var gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.ga4MeasurementId;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', config.ga4MeasurementId, { anonymize_ip: true });
  }

  function removeGaCookies() {
    var host = location.hostname.split('.');
    var domains = [location.hostname, '.' + location.hostname];
    if (host.length > 2) domains.push('.' + host.slice(-2).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name !== '_ga' && name.indexOf('_ga_') !== 0 && name !== '_gid') return;
      domains.forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
      });
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
  }

  function hideBanner() {
    var b = document.getElementById('kyran-consent');
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function showBanner() {
    if (!config.ga4MeasurementId || document.getElementById('kyran-consent')) return;
    if (!document.getElementById('kyran-consent-style')) {
      var st = document.createElement('style');
      st.id = 'kyran-consent-style';
      st.textContent =
        '#kyran-consent{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:640px;margin:0 auto;' +
        'background:var(--k-cream,#FBF5E9);color:var(--k-ink,#231F22);border:2px solid var(--k-ink,#231F22);border-radius:14px;' +
        'box-shadow:4px 4px 0 var(--k-ink,#231F22);padding:14px 16px;font:400 .9rem/1.45 Poppins,system-ui,sans-serif}' +
        '#kyran-consent p{margin:0 0 12px}#kyran-consent a{color:inherit;text-decoration:underline}' +
        '#kyran-consent .kc-row{display:flex;gap:10px}' +
        '#kyran-consent button{flex:1;min-height:44px;padding:10px 16px;font:600 .95rem Poppins,system-ui,sans-serif;cursor:pointer;' +
        'background:var(--k-ink,#231F22);color:#fff;border:2px solid var(--k-ink,#231F22);border-radius:999px}' +
        '#kyran-consent button:hover{filter:brightness(1.25)}' +
        '#kyran-consent button:focus-visible{outline:3px solid #C98A0E;outline-offset:2px}' +
        '@media(max-width:380px){#kyran-consent .kc-row{flex-direction:column}}@media print{#kyran-consent{display:none}}';
      document.head.appendChild(st);
    }
    var box = document.createElement('div');
    box.id = 'kyran-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Choix des cookies de mesure d’audience');
    box.innerHTML =
      '<p>Nous utilisons Google Analytics pour mesurer l’audience du site, uniquement si vous l’acceptez. ' +
      'Vous pouvez changer d’avis à tout moment. <a href="/confidentialite.html#cookies">En savoir plus</a></p>' +
      '<div class="kc-row"><button type="button" data-kc="refused">Refuser</button>' +
      '<button type="button" data-kc="accepted">Accepter</button></div>';
    box.addEventListener('click', function (e) {
      var v = e.target && e.target.getAttribute && e.target.getAttribute('data-kc');
      if (!v) return;
      writeConsent(v);
      if (v === 'accepted') loadGa(); else removeGaCookies();
      hideBanner();
    });
    document.body.appendChild(box);
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-kyran-cookies]') : null;
    if (!t) return;
    e.preventDefault();
    try { localStorage.removeItem(CONSENT_KEY); } catch (err) { /* ignoré */ }
    removeGaCookies();
    showBanner();
  });

  // (le prérendu Node n'a pas de vrai DOM : pas de bandeau ni de GA hors navigateur)
  if (config.ga4MeasurementId && document.body && typeof document.body.appendChild === 'function') {
    var consent = readConsent();
    if (consent === 'accepted') loadGa();
    else if (consent === null) showBanner();
  }

  window.KYRAN_ASSET_VERSION = ASSET_VERSION;
})();


