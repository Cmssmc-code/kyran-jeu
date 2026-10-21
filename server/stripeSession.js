// Lecture des champs d'une session Stripe Checkout, quelle que soit la version de l'API Stripe
// du webhook : depuis l'API 2025-03-31, l'adresse de livraison est dans
// `collected_information.shipping_details` (l'ancien `shipping_details` n'existe plus).

/** Destinataire et adresse de livraison ; à défaut, les coordonnées de facturation. */
export function shippingDetails(session) {
  return session?.collected_information?.shipping_details
    || session?.shipping_details
    || session?.customer_details
    || null;
}
