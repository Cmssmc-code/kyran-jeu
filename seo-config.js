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
  var config = {
    googleSiteVerification: "",
    ga4MeasurementId: ""
  };

  if (config.googleSiteVerification) {
    var meta = document.createElement("meta");
    meta.name = "google-site-verification";
    meta.content = config.googleSiteVerification;
    document.head.appendChild(meta);
  }

  if (config.ga4MeasurementId) {
    var gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=" + config.ga4MeasurementId;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", config.ga4MeasurementId, { anonymize_ip: true });
  }
})();
