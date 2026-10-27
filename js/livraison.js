// Délais de livraison en France, partagés par /commander.html et /idee-cadeau.html.
// Jours ouvrés : lundi à vendredi, hors jours fériés. Préparation 24 à 48 h ouvrées
// + acheminement 2 à 4 jours ouvrés = 3 à 6 jours ouvrés après la commande.
// Noël : date limite conseillée le 16 décembre (16 décembre + 6 jours ouvrés = 24 décembre).
(function () {
  function easterSunday(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
    var f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }

  function isHoliday(d) {
    var md = (d.getMonth() + 1) + '-' + d.getDate();
    if (['1-1', '5-1', '5-8', '7-14', '8-15', '11-1', '11-11', '12-25'].indexOf(md) !== -1) return true;
    var easter = easterSunday(d.getFullYear());
    return [1, 39, 50].some(function (offset) {
      var x = new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + offset);
      return x.getMonth() === d.getMonth() && x.getDate() === d.getDate();
    });
  }

  function addBusinessDays(from, n) {
    var d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    while (n > 0) {
      d.setDate(d.getDate() + 1);
      var wd = d.getDay();
      if (wd !== 0 && wd !== 6 && !isHoliday(d)) n--;
    }
    return d;
  }

  var FMT = { weekday: 'long', day: 'numeric', month: 'long' };

  /** « Commandé aujourd’hui, livré en France entre le … et le …. » */
  function estimate(now) {
    now = now || new Date();
    return 'Commandé aujourd’hui, livré en France entre le ' +
      addBusinessDays(now, 3).toLocaleDateString('fr-FR', FMT) + ' et le ' +
      addBusinessDays(now, 6).toLocaleDateString('fr-FR', FMT) + '.';
  }

  /**
   * Période de Noël : 'avant' jusqu'au 16 décembre inclus, 'apres' du 17 au 24 décembre,
   * sinon ''. `from` (mois 0-11, jour) borne le début : 1er novembre pour la page de commande.
   */
  function noelPhase(now, from) {
    now = now || new Date();
    var y = now.getFullYear();
    var start = from ? new Date(y, from[0], from[1]) : new Date(y, 0, 1);
    var deadline = new Date(y, 11, 16, 23, 59);
    if (now >= start && now <= deadline) return 'avant';
    if (now > deadline && now < new Date(y, 11, 25)) return 'apres';
    return '';
  }

  window.KyranLivraison = {
    addBusinessDays: addBusinessDays,
    isHoliday: isHoliday,
    estimate: estimate,
    noelPhase: noelPhase
  };
})();
