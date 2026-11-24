// Tarifs de KYRAN : source unique, lue par le site (panneau d'achat de components.js) et par le
// serveur Railway (création du paiement Stripe). Le serveur en reçoit une copie générée
// (server/tarifs.js, scripts/sync-moteur.mjs) : ne modifier qu'ici, puis `npm run build`.
// Grille de port fixée le 20/11/2026 (boîte de 205 g, 214 g avec son enveloppe).

/** Prix d'une boîte, en centimes. */
export const PRIX_BOITE_CENTS = 999;

/** Quantité maximale par commande ; l'alerte de confirmation apparaît au-delà de SEUIL_ALERTE. */
export const QUANTITE_MAX = 99;
export const SEUIL_ALERTE = 10;

/** Port en livraison : jusqu'à `max` boîtes, `cents` centimes. */
export const GRILLE_PORT = [
  { max: 1, cents: 299 },
  { max: 2, cents: 499 },
  { max: 4, cents: 599 },
  { max: 10, cents: 799 },
  { max: 15, cents: 999 },
  { max: 40, cents: 1599 },
  { max: 99, cents: 2599 }
];

/** true si `q` est une quantité acceptée (entier de 1 à QUANTITE_MAX). */
export function quantiteValide(q) {
  return Number.isInteger(q) && q >= 1 && q <= QUANTITE_MAX;
}

/** Port en centimes pour `q` boîtes (livraison). */
export function fraisPort(q, mode = 'livraison') {
  if (!quantiteValide(q)) throw new RangeError('Quantité invalide : ' + q);
  return GRILLE_PORT.find(palier => q <= palier.max).cents;
}

/** Montants en centimes : boîtes, port et total. */
export function totalCommande(q, mode = 'livraison') {
  const boites = PRIX_BOITE_CENTS * q;
  const port = fraisPort(q, mode);
  return { boites, port, total: boites + port };
}

/** « 12,98 € » */
export function euros(cents) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}
