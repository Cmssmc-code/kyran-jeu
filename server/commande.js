// Création du paiement Stripe Checkout depuis le panneau d'achat du site (components.js) :
// quantité libre de 1 à 99, remise en main propre (port 0 €) ou livraison (port selon la grille
// de tarifs.js). Le montant facturé par Stripe est celui qu'affiche le site, au centime :
// les deux lisent la même grille. Sans clé Stripe, la route répond 503 et le site retombe
// sur les liens de paiement habituels.
import { PRIX_BOITE_CENTS, quantiteValide, fraisPort } from './tarifs.js';

export const PRODUIT_KYRAN = 'prod_VBfXBJYQzElac4';
const SITE = 'https://kyran-jeu.fr';
const PAYS_LIVRES = ['FR', 'BE', 'CH', 'LU', 'MC'];
const REF_RE = /^[A-Za-z0-9_-]{1,64}$/;

/** Valide le corps JSON du site : { mode, quantite, ref? }. Rend { mode, quantite, ref } ou { erreur }. */
export function lireCommande(body) {
  if (!body || typeof body !== 'object') return { erreur: 'Commande invalide' };
  const mode = body.mode;
  if (mode !== 'livraison' && mode !== 'main-propre') return { erreur: 'Mode invalide' };
  const quantite = body.quantite;
  if (!quantiteValide(quantite)) return { erreur: 'Quantité invalide (1 à 99)' };
  const ref = typeof body.ref === 'string' && REF_RE.test(body.ref) ? body.ref : '';
  return { mode, quantite, ref };
}

/** Paramètres (form-urlencoded) de la session Checkout, calqués sur les liens de paiement existants. */
export function parametresSession({ mode, quantite, ref }) {
  const p = new URLSearchParams();
  const mainPropre = mode === 'main-propre';
  p.set('mode', 'payment');
  p.set('locale', 'fr');
  p.set('line_items[0][quantity]', String(quantite));
  p.set('line_items[0][price_data][currency]', 'eur');
  p.set('line_items[0][price_data][product]', PRODUIT_KYRAN);
  p.set('line_items[0][price_data][unit_amount]', String(PRIX_BOITE_CENTS));
  p.set('metadata[quantity]', String(quantite));
  p.set('metadata[canal]', mainPropre ? 'sur-place' : 'livraison');
  p.set('cancel_url', SITE + '/');
  if (ref) p.set('client_reference_id', ref);
  if (mainPropre) {
    p.set('success_url', SITE + '/merci-sur-place.html?session_id={CHECKOUT_SESSION_ID}');
    p.set('custom_text[submit][message]', 'Remise en main propre, sans frais de port. On convient de la remise par mail.');
    return p;
  }
  p.set('success_url', SITE + '/merci.html');
  PAYS_LIVRES.forEach((pays, i) => p.set(`shipping_address_collection[allowed_countries][${i}]`, pays));
  p.set('phone_number_collection[enabled]', 'true');
  p.set('allow_promotion_codes', 'true');
  p.set('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
  p.set('shipping_options[0][shipping_rate_data][display_name]', 'Livraison standard suivie (2-4 jours)');
  p.set('shipping_options[0][shipping_rate_data][fixed_amount][amount]', String(fraisPort(quantite, 'livraison')));
  p.set('shipping_options[0][shipping_rate_data][fixed_amount][currency]', 'eur');
  p.set('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]', 'business_day');
  p.set('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]', '2');
  p.set('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]', 'business_day');
  p.set('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]', '4');
  p.set('invoice_creation[enabled]', 'true');
  p.set('invoice_creation[invoice_data][description]', 'Facture - Jeu de cartes KYRAN');
  p.set('invoice_creation[invoice_data][footer]', 'KYRAN (Corentin Sence EI) — TVA non applicable, art. 293 B du CGI.');
  return p;
}

/** Crée la session Checkout ; rend son URL. `apiBase` permet aux tests de viser un faux Stripe. */
export async function creerSession(commande, { cle, apiBase = 'https://api.stripe.com', fetchImpl = fetch } = {}) {
  const res = await fetchImpl(apiBase + '/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + cle,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: parametresSession(commande).toString(),
    signal: AbortSignal.timeout(10000)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || typeof data.url !== 'string') {
    const msg = data?.error?.message || ('HTTP ' + res.status);
    throw Object.assign(new Error('Stripe Checkout : ' + msg), { status: res.status });
  }
  return data.url;
}
