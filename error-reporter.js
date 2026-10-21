/*
 * Remontée automatique des erreurs du site vers le serveur KYRAN (pipeline Auto-Heal).
 * Chargé en tête de chaque page (inséré par scripts/apply-csp.mjs) pour capter aussi
 * les erreurs des scripts suivants. Chaque erreur est envoyée une seule fois par page,
 * 5 au maximum, sans aucune donnée personnelle (ni cookie, ni saisie de formulaire).
 * Le serveur agrège les erreurs ; la routine Claude « Surveillance & réparation » les corrige chaque jour.
 */
(function () {
  'use strict';
  var ENDPOINT = 'https://kyran-webhook-production.up.railway.app/api/client-error';
  var MAX_REPORTS = 5;
  var host = location.hostname;
  // Uniquement en production : pas de bruit depuis un serveur local ou un aperçu.
  if (host !== 'kyran-jeu.fr' && host !== 'www.kyran-jeu.fr') return;
  if (/bot|crawl|spider|headless|lighthouse/i.test(navigator.userAgent || '')) return;

  var sent = 0;
  var seen = {};

  function clip(value, max) {
    var s = value == null ? '' : String(value);
    return s.length > max ? s.slice(0, max) : s;
  }

  function send(report) {
    if (sent >= MAX_REPORTS) return;
    var key = report.kind + '|' + report.message + '|' + report.file;
    if (seen[key]) return;
    seen[key] = true;
    sent++;
    report.page = location.pathname;
    var script = document.currentScript || document.querySelector('script[src*="error-reporter.js"]');
    var version = script && /[?&]v=([\w-]+)/.exec(script.src || '');
    report.version = version ? version[1] : '';
    var body = JSON.stringify(report);
    try {
      // text/plain : requête « simple », sans pré-vérification CORS
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain' }))) return;
      fetch(ENDPOINT, { method: 'POST', body: body, keepalive: true, mode: 'no-cors', credentials: 'omit' });
    } catch (e) { /* jamais d'erreur en cascade */ }
  }

  window.addEventListener('error', function (event) {
    var target = event.target;
    // Ressource (image, script, feuille de style) introuvable sur le site
    if (target && target !== window && (target.src || target.href)) {
      var url = target.currentSrc || target.src || target.href;
      if (!/^https:\/\/(www\.)?kyran-jeu\.fr\//.test(url)) return;
      var tag = target.tagName.toLowerCase();
      var report = { kind: 'resource', message: 'Ressource introuvable : <' + tag + '> ' + url, file: url };
      // Une coupure réseau du visiteur (ou une page quittée en plein chargement) déclenche aussi « error »
      // sur un fichier pourtant en ligne : vidéo (JS-894824), images et scripts (JS-29AAB2, JS-B632F4…,
      // toutes les ressources d'une page en échec à la même milliseconde). On ne signale que si le fichier
      // manque vraiment (HEAD en erreur HTTP) ; HEAD impossible (hors ligne) : rien à signaler.
      if (window.fetch) {
        fetch(url, { method: 'HEAD', cache: 'no-store', credentials: 'omit' }).then(function (res) {
          if (!res.ok) send(report);
        }, function () { /* hors ligne : rien à signaler */ });
        return;
      }
      send(report);
      return;
    }
    var err = event.error;
    send({
      kind: 'error',
      message: clip(event.message || (err && err.message), 1000),
      file: clip(event.filename, 500),
      line: event.lineno || null,
      column: event.colno || null,
      stack: clip(err && err.stack, 6000)
    });
  }, true);

  window.addEventListener('unhandledrejection', function (event) {
    var reason = event.reason;
    var message = reason && reason.message ? reason.message : clip(reason, 1000);
    send({
      kind: 'rejection',
      message: clip(message, 1000),
      file: '',
      stack: clip(reason && reason.stack, 6000)
    });
  });
})();
