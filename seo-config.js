(function () {
  /**
   * Configuration SEO / mesure — kyran-jeu.fr
   *
   * 1. Google Search Console : créer une propriété, copier le token de vérification
   *    dans googleSiteVerification ci-dessous, puis soumettre /sitemap.xml
   *
   * 2. GA4 (optionnel) : renseigner ga4MeasurementId
   *    ⚠️ RGPD : GA4 dépose des cookies de mesure d'audience soumis au consentement
   *    préalable (CNIL). Ne l'activer qu'avec un bandeau de consentement et après mise
   *    à jour de confidentialite.html (section Cookies).
   *
   * 3. KPIs mensuels : voir seo-keywords.json (requêtes cibles + indicateurs)
   *    Surveiller dans Search Console : impressions/clics par page cluster
   */
  var ASSET_VERSION = '0e10dcdcda';

  var config = {
    googleSiteVerification: '',
    bingSiteVerification: '',
    ga4MeasurementId: ''
  };

  function injectDnsPrefetch() {
    ['https://www.youtube.com', 'https://i.ytimg.com', 'https://www.google-analytics.com'].forEach(function (href) {
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

  if (config.ga4MeasurementId) {
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

  window.KYRAN_ASSET_VERSION = ASSET_VERSION;
})();


