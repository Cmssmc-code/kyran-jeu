/**
 * Faits produit canoniques de KYRAN, en un seul endroit.
 *
 * Utilisé par scripts/generate-merchant-feed.mjs (flux Google Merchant Center) et
 * scripts/generate-seo.mjs (llms.txt). Chaque valeur cite sa source dans le dépôt :
 * ne rien ajouter qui n'y soit pas écrit. Un changement de prix ou de port se fait
 * d'abord sur Stripe, puis ici, puis dans les pages (voir docs/VENTES-PASSES.md, étape 2).
 */

export const PRODUCT = {
  id: 'KYRAN-01', // SKU du JSON-LD (commander.html, nœud Product unique #boardgame)
  brand: 'KYRAN',
  name: 'KYRAN',
  subtitle: 'Maître des Mystiques', // titre imprimé sur la boîte (boite-recto-kyran.jpg)
  // GTIN écrit dans mentions-legales.html (« Code-barres officiel (GS1) ») et cgv.html art. 2 ;
  // clé de contrôle EAN-13 valide. À comparer au code-barres imprimé sur la boîte.
  gtin: '3770040368015',
  url: 'https://kyran-jeu.fr/',
  orderUrl: 'https://kyran-jeu.fr/commander.html',
  images: {
    main: 'https://kyran-jeu.fr/boite-recto-kyran.jpg', // 1048 × 1500, boîte seule sur fond clair
    // Photos sans texte promotionnel incrusté (kyran-cartes-pouvoirs.jpg en a un : exclue).
    additional: [
      'https://kyran-jeu.fr/kyran-cartes-table.jpg', // 1080 × 1440, boîte et cartes Nombre
      'https://kyran-jeu.fr/jeu-kyran-ami.webp' // 1208 × 1500, partie à quatre joueurs
    ]
  },
  // Prix boutique : commander.html, cgv.html art. 3 (9,99 € TTC, TVA non applicable art. 293 B CGI).
  price: { amount: '9.99', currency: 'EUR', label: '9,99 €' },
  // index.html (« En stock · expédié sous 24 à 48 h ») et JSON-LD InStock.
  availability: 'in_stock',
  condition: 'new',
  players: { min: 3, max: 6 },
  durationMinutes: 30,
  minAge: 8,
  // cgv.html art. 2, regle.html, _notes/memoire.md § 1.
  contents: '36 cartes Nombre, 1 carte Mystique, 8 cartes Pouvoir, 30 cartes Vie et 7 cartes de règles en français',
  // cgv.html art. 2, commander.html (JSON-LD weight / width / height / depth).
  weight: { value: 175, unit: 'g' },
  dimensions: { length: 11.5, width: 8.5, height: 2.8, unit: 'cm', label: '11,5 × 8,5 × 2,8 cm' },
  author: 'Corentin Sence',
  illustrator: 'Crea by Floh',
  releaseDate: '2026-01-31',
  language: 'Français',
  shipping: {
    // Pays acceptés par la page de paiement Stripe (vérifiée le 2026-10-13, _notes/memoire.md § 1) :
    // la même liste que commander.html, la FAQ et llms.txt.
    countries: ['FR', 'BE', 'LU', 'CH', 'MC'],
    handlingDays: { min: 1, max: 2 }, // « expédition sous 24 à 48 heures ouvrées »
    // Seul le port France est connu : 2,99 € par commande, quel que soit le nombre de boîtes
    // (décision du propriétaire du 2026-10-13 ; cgv.html art. 3). Stripe facturait encore 3,99 €
    // ce jour-là : à aligner sur Stripe avant de soumettre le flux (docs/MERCHANT.md).
    // Autres pays : calculé au paiement, montant non publié.
    rates: [{ country: 'FR', price: '2.99', label: '2,99 €', transitDays: { min: 2, max: 4 } }],
    otherTransitDays: { min: 3, max: 6 }
  },
  // cgv.html art. 6 : 14 jours à compter de la réception, frais de retour à la charge du vendeur,
  // remboursement intégral (frais d'expédition initiaux compris).
  returns: { days: 14, freeReturn: true, url: 'https://kyran-jeu.fr/cgv.html#art6' },
  // reviews-data.json ; valeurs revues sur Amazon.fr le 2026-10-13. Note d'un autre site :
  // à afficher en texte avec sa source, jamais en données structurées (consignes Google).
  amazon: {
    url: 'https://www.amazon.fr/dp/B0G217LD87',
    price: '17,99 €',
    rating: '4,7',
    ratingCount: 33,
    checked: '2026-10-13',
    checkedLabel: '13 octobre 2026'
  }
};
