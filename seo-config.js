(function () {
  /**
   * Configuration SEO / mesure — kyran-jeu.fr
   *
   * 1. Google Search Console : créer une propriété, copier le token de vérification
   *    dans googleSiteVerification ci-dessous, puis soumettre /sitemap.xml
   *
   * 2. GA4 (optionnel) : renseigner ga4MeasurementId
   *
   * 3. KPIs mensuels : voir seo-keywords.json (requêtes cibles + indicateurs)
   *    Surveiller dans Search Console : impressions/clics par page cluster
   */
  var ASSET_VERSION = '20260608';

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

  function injectFonts() {
    if (document.querySelector('link[href*="fonts.googleapis.com/css2"]')) {
      return;
    }
    var pre1 = document.createElement('link');
    pre1.rel = 'preconnect';
    pre1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pre1);

    var pre2 = document.createElement('link');
    pre2.rel = 'preconnect';
    pre2.href = 'https://fonts.gstatic.com';
    pre2.crossOrigin = '';
    document.head.appendChild(pre2);

    var fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;600;700&display=swap';
    document.head.appendChild(fonts);
  }

  injectFonts();
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


