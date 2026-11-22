// Templates emails ultra-épurés pour KYRAN
// Design minimaliste, typographique, 0 surcharge visuelle, compatibilité 100% webmails.
//
// SÉCURITÉ : toute donnée dynamique (saisie admin, données Stripe) DOIT passer par
// esc() avant d'être insérée dans le HTML, et par safeUrl() avant d'être placée
// dans un attribut href. Ce fichier est dupliqué dans worker/templates.js : garder
// les deux copies identiques.

export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const esc = escapeHtml;

// N'autorise que les liens https:// (pas de javascript:, data:, http:, etc.)
export function safeUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(String(value).trim());
    return url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

// Adresse e-mail sûre pour un lien mailto:
function safeEmail(value) {
  const v = String(value || '').trim();
  return /^[^\s@<>"'()]+@[^\s@<>"'()]+\.[^\s@<>"'()]+$/.test(v) ? v : '';
}

function baseLayout({ title, previewText, contentHtml }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px;">
    ${esc(previewText)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          
          <!-- En-tête sobre -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <a href="https://kyran-jeu.fr" style="font-size: 20px; font-weight: 800; letter-spacing: 3px; color: #0f172a; text-decoration: none; font-family: 'Arial Black', Impact, sans-serif;">KYRAN</a>
                  </td>
                  <td align="right" style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                    Jeu de cartes
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Pied de page épuré -->
          <tr>
            <td style="padding: 20px 32px 28px 32px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; line-height: 1.5;">
              <div style="margin-bottom: 8px;">
                Une question ? Répondez simplement à cet email ou écrivez à <a href="mailto:contact@kyran-jeu.fr" style="color: #0f172a; text-decoration: underline;">contact@kyran-jeu.fr</a>.
              </div>
              <div>
                KYRAN · Édition officielle · <a href="https://kyran-jeu.fr" style="color: #94a3b8; text-decoration: none;">kyran-jeu.fr</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderOrderEmail({
  customerName = 'Cher joueur',
  orderId = '',
  quantity = 1,
  subtotalAmount = '9,99 €',
  totalAmount = '12,98 €',
  shippingCost = '2,99 €',
  shippingAddress = null,
  estimatedDelivery = '3 à 5 jours ouvrés',
  mainPropre = false
}) {
  // Vente sur place : pas de livraison, ni adresse, ni ligne de port.
  const addressHtml = !mainPropre && shippingAddress ? `
    <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #475569; line-height: 1.5;">
      <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">Livraison à :</div>
      ${shippingAddress.name ? `<div>${esc(shippingAddress.name)}</div>` : ''}
      ${shippingAddress.line1 ? `<div>${esc(shippingAddress.line1)}</div>` : ''}
      ${shippingAddress.line2 ? `<div>${esc(shippingAddress.line2)}</div>` : ''}
      <div>${esc(shippingAddress.postal_code || '')} ${esc(shippingAddress.city || '')}</div>
      <div>${esc(shippingAddress.country || 'France')}</div>
    </div>
  ` : '';

  const contentHtml = `
    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #059669; margin-bottom: 12px;">
      ✓ Commande confirmée
    </div>

    <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      Merci pour votre commande, ${esc(customerName)}.
    </h1>

    <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      ${mainPropre
        ? 'Paiement reçu, merci pour votre achat. Remise en main propre : nous vous écrivons très vite pour convenir du lieu et de la date.'
        : 'Paiement validé. Votre boîte KYRAN est en cours de préparation dans notre atelier.'}
    </p>

    <!-- Tableau simple récapitulatif -->
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px;">
        <tr>
          <td style="padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 500;">
            KYRAN — Édition Officielle × ${esc(quantity)}
          </td>
          <td align="right" style="padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
            ${esc(subtotalAmount)}
          </td>
        </tr>
        ${mainPropre ? '' : `<tr>
          <td style="padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">
            Livraison suivie (${esc(estimatedDelivery)})
          </td>
          <td align="right" style="padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">
            ${esc(shippingCost)}
          </td>
        </tr>`}
        <tr style="background-color: #fafaf9;">
          <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">
            Total réglé
          </td>
          <td align="right" style="padding: 12px 16px; color: #0f172a; font-weight: 700;">
            ${esc(totalAmount)}
          </td>
        </tr>
      </table>
    </div>

    ${addressHtml}

    <!-- Lien Initiation ultra simple -->
    <div style="margin-top: 28px; padding: 18px 20px; background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; font-size: 13px; line-height: 1.5;">
      <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">🃏 ${mainPropre ? 'Pour revoir les règles :' : 'En attendant votre colis :'}</div>
      <div style="color: #57534e; margin-bottom: 12px;">Découvrez les cartes et testez la manche Mystique sur notre simulateur en ligne gratuit.</div>
      <a href="https://kyran-jeu.fr/minijeu.html" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 8px 18px; border-radius: 6px; font-size: 12px; font-weight: 600;" target="_blank">
        Tester l’Initiation en ligne →
      </a>
    </div>

    ${orderId ? `<div style="margin-top: 24px; font-size: 11px; color: #94a3b8;">Référence : ${esc(orderId)}</div>` : ''}
  `;

  const html = baseLayout({
    title: 'Confirmation de commande KYRAN',
    previewText: `Merci ${customerName}, votre commande KYRAN est confirmée.`,
    contentHtml
  });

  const text = `Merci pour votre commande KYRAN, ${customerName} !

Votre paiement a bien été validé.
${mainPropre ? 'Paiement reçu, merci pour votre achat. Remise en main propre : nous vous écrivons très vite pour convenir du lieu et de la date.' : 'Votre boîte KYRAN est en cours de préparation.'}

Récapitulatif :
- Article : KYRAN — Édition Officielle × ${quantity} : ${subtotalAmount}
${mainPropre ? '' : `- Livraison suivie (${estimatedDelivery}) : ${shippingCost}
`}- Total réglé : ${totalAmount}

${mainPropre ? 'Pour revoir les règles' : 'En attendant votre colis'}, entraînez-vous sur le simulateur interactif :
https://kyran-jeu.fr/minijeu.html

Une question ? Répondez directement à cet email.
Édition officielle KYRAN — https://kyran-jeu.fr
`;

  return { html, text };
}

export function renderShippingEmail({
  customerName = 'Cher joueur',
  orderId = '',
  carrier = 'La Poste (Courrier Suivi)',
  trackingNumber = '',
  trackingUrl = '',
  estimatedDelivery = '2 à 4 jours ouvrés'
}) {
  const trackingHref = safeUrl(trackingUrl);
  const trackingButton = trackingHref ? `
    <div style="margin: 20px 0 24px 0;">
      <a href="${esc(trackingHref)}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-size: 13px; font-weight: 600;" target="_blank">
        Suivre mon colis en direct →
      </a>
    </div>
  ` : '';

  const contentHtml = `
    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #2563eb; margin-bottom: 12px;">
      📦 Colis expédié
    </div>

    <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      Votre jeu KYRAN est en route.
    </h1>

    <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Votre commande a été remise au transporteur (${esc(carrier)}) et arrive sous ${esc(estimatedDelivery)}.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; font-size: 13px; color: #334155;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px;">Numéro de suivi :</div>
      <div style="font-size: 16px; font-weight: 700; color: #0f172a; font-family: monospace;">${esc(trackingNumber || 'En cours d\'actualisation')}</div>
    </div>

    ${trackingButton}

    <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
      Astuce : préparez vos parties dès maintenant en consultant les règles du jeu sur <a href="https://kyran-jeu.fr/regle.html" style="color: #0f172a; text-decoration: underline;">kyran-jeu.fr/regle.html</a>.
    </div>

    ${orderId ? `<div style="margin-top: 24px; font-size: 11px; color: #94a3b8;">Référence commande : ${esc(orderId)}</div>` : ''}
  `;

  const html = baseLayout({
    title: 'Votre colis KYRAN a été expédié',
    previewText: `Votre jeu KYRAN est en route (${trackingNumber || 'Suivi La Poste'}).`,
    contentHtml
  });

  const text = `Bonjour ${customerName},

Votre commande KYRAN a été remise au transporteur (${carrier}) et arrive sous ${estimatedDelivery}.

Numéro de suivi : ${trackingNumber || 'Non renseigné'}
${trackingHref ? `Lien de suivi : ${trackingHref}` : ''}

Règles du jeu : https://kyran-jeu.fr/regle.html

Une question ? Répondez directement à cet email.
Édition officielle KYRAN — https://kyran-jeu.fr
`;

  return { html, text };
}

export function renderRefundEmail({
  customerName = 'Cher joueur',
  orderId = '',
  refundAmount = '12,98 €',
  reason = 'Demande client'
}) {
  const contentHtml = `
    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #475569; margin-bottom: 12px;">
      Remboursement confirmé
    </div>

    <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      Remboursement de votre commande
    </h1>

    <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Bonjour ${esc(customerName)}, le remboursement de votre commande KYRAN a bien été émis sur votre moyen de paiement initial.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; font-size: 13px; color: #334155; margin-bottom: 20px;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px;">Montant crédité :</div>
      <div style="font-size: 22px; font-weight: 800; color: #0f172a;">${esc(refundAmount)}</div>
      ${reason ? `<div style="margin-top: 6px; font-size: 12px; color: #64748b;">Motif : ${esc(reason)}</div>` : ''}
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
      Selon votre établissement bancaire, le crédit apparaîtra sur votre relevé sous <strong>5 à 10 jours ouvrés</strong>.
    </p>

    ${orderId ? `<div style="margin-top: 24px; font-size: 11px; color: #94a3b8;">Référence : ${esc(orderId)}</div>` : ''}
  `;

  const html = baseLayout({
    title: 'Remboursement commande KYRAN',
    previewText: `Confirmation de remboursement de ${refundAmount} pour votre commande KYRAN.`,
    contentHtml
  });

  const text = `Bonjour ${customerName},

Le remboursement de votre commande KYRAN a bien été émis sur votre moyen de paiement.

Montant remboursé : ${refundAmount}
${reason ? `Motif : ${reason}` : ''}

Délai bancaire : 5 à 10 jours ouvrés selon votre banque.

Une question ? Répondez directement à cet email.
Édition officielle KYRAN — https://kyran-jeu.fr
`;

  return { html, text };
}

export function renderCustomMessageEmail({
  customerName = 'Cher joueur',
  subject = 'Message concernant KYRAN',
  message = '',
  actionText = null,
  actionUrl = null
}) {
  const actionHref = safeUrl(actionUrl);
  const actionHtml = (actionText && actionHref) ? `
    <div style="margin: 24px 0 16px 0;">
      <a href="${esc(actionHref)}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-size: 13px; font-weight: 600;" target="_blank">
        ${esc(actionText)} →
      </a>
    </div>
  ` : '';

  const formattedMessage = message
    .split('\n\n')
    .map(p => `<p style="margin: 0 0 14px 0; font-size: 14px; color: #334155; line-height: 1.6;">${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');

  const contentHtml = `
    <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      ${esc(subject)}
    </h1>

    <div style="margin-bottom: 20px;">
      ${formattedMessage}
    </div>

    ${actionHtml}

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #64748b;">
      À très bientôt sur le jeu,<br>
      <strong>Corentin Sence</strong> · Édition officielle KYRAN
    </div>
  `;

  const html = baseLayout({
    title: subject,
    previewText: message.slice(0, 100).replace(/\n/g, ' '),
    contentHtml
  });

  const text = `${customerName ? `Bonjour ${customerName},\n\n` : ''}${message}

${(actionText && actionHref) ? `${actionText} : ${actionHref}\n\n` : ''}À très bientôt sur le jeu,
Corentin Sence · Édition officielle KYRAN
https://kyran-jeu.fr
`;

  return { html, text };
}

export function renderAdminOrderNotificationEmail({
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  orderId = '',
  paymentIntentId = '',
  quantity = 1,
  subtotalAmount = '',
  shippingCost = '',
  totalAmount = '',
  shippingAddress = null,
  mainPropre = false,
  orderDate = ''
}) {
  const addressFormatted = mainPropre ? 'Remis en main propre : aucun envoi, aucun bordereau.' : shippingAddress ? `
Nom : ${shippingAddress.name || customerName}
Adresse : ${shippingAddress.line1 || ''}${shippingAddress.line2 ? `\nComplément : ${shippingAddress.line2}` : ''}
Ville : ${shippingAddress.postal_code || ''} ${shippingAddress.city || ''}
Pays : ${shippingAddress.country || 'France'}
`.trim() : 'Non renseignée';

  const contentHtml = `
    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #b45309; margin-bottom: 8px;">
      ⚡ Alerte Vente KYRAN
    </div>

    <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3;">
      Nouvelle commande : ${esc(quantity)} boîte${quantity > 1 ? 's' : ''} (${esc(totalAmount)})
    </h1>

    <!-- Récap commande -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; margin-bottom: 20px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Quantité :</td>
          <td align="right" style="padding: 6px 0; color: #0f172a; font-weight: 700;">${esc(quantity)} exemplaire${quantity > 1 ? 's' : ''}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Sous-total :</td>
          <td align="right" style="padding: 6px 0; color: #0f172a; font-weight: 600;">${esc(subtotalAmount)}</td>
        </tr>
        ${mainPropre ? '' : `<tr>
          <td style="padding: 6px 0; color: #64748b;">Frais de port :</td>
          <td align="right" style="padding: 6px 0; color: #0f172a; font-weight: 600;">${esc(shippingCost)}</td>
        </tr>`}
        <tr>
          <td style="padding: 10px 0 4px 0; border-top: 1px solid #e2e8f0; color: #0f172a; font-weight: 800; font-size: 15px;">Total encaissé :</td>
          <td align="right" style="padding: 10px 0 4px 0; border-top: 1px solid #e2e8f0; color: #b45309; font-weight: 800; font-size: 16px;">${esc(totalAmount)}</td>
        </tr>
      </table>
    </div>

    <!-- Coordonnées Client -->
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; margin-bottom: 20px;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #475569; margin-bottom: 12px;">
        👤 Coordonnées client
      </div>
      <div style="font-size: 14px; margin-bottom: 6px;">
        <strong>Nom :</strong> ${esc(customerName || 'Non précisé')}
      </div>
      <div style="font-size: 14px; margin-bottom: 6px;">
        <strong>Email :</strong> <a href="mailto:${esc(safeEmail(customerEmail))}" style="color: #0f172a; text-decoration: underline;">${esc(customerEmail)}</a>
      </div>
      <div style="font-size: 14px;">
        <strong>Téléphone :</strong> ${esc(customerPhone || 'Non renseigné')}
      </div>
    </div>

    <!-- Adresse d'expédition pour bordereau -->
    <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 18px 20px; margin-bottom: 20px;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #92400e; margin-bottom: 10px;">
        ${mainPropre ? '🤝 Remise en main propre : convenir du lieu et de la date par mail' : '📦 Adresse de livraison (Format étiquette / bordereau)'}
      </div>
      <div style="font-family: monospace; font-size: 13px; color: #78350f; line-height: 1.6; white-space: pre-line;">${esc(addressFormatted)}</div>
    </div>

    <!-- Infos Stripe -->
    <div style="font-size: 11px; color: #94a3b8; line-height: 1.6;">
      <div>Réf Stripe : <code>${esc(orderId)}</code></div>
      ${paymentIntentId ? `<div>PaymentIntent : <code>${esc(paymentIntentId)}</code></div>` : ''}
      <div>Date : ${esc(orderDate || new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }))}</div>
    </div>
  `;

  const html = baseLayout({
    title: `Nouvelle commande KYRAN : ${quantity} boîte(s) (${totalAmount})`,
    previewText: `Commande de ${customerName} (${totalAmount}). ${mainPropre ? 'Remis en main propre.' : `Adresse : ${shippingAddress ? `${shippingAddress.city} (${shippingAddress.postal_code})` : 'Non renseignée'}.`}`,
    contentHtml
  });

  const text = `🚨 NOUVELLE COMMANDE KYRAN !

Quantité : ${quantity} boîte(s)
Total payé : ${totalAmount} (Sous-total: ${subtotalAmount}${mainPropre ? ', remis en main propre' : `, Port: ${shippingCost}`})

CLIENT :
- Nom : ${customerName}
- Email : ${customerEmail}
- Téléphone : ${customerPhone || 'Non renseigné'}

${mainPropre ? 'LIVRAISON' : 'ADRESSE DE LIVRAISON'} :
${addressFormatted}

RÉFÉRENCE STRIPE :
- Session ID : ${orderId}
- PaymentIntent : ${paymentIntentId || 'N/A'}
- Date : ${orderDate || new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
`;

  return { html, text };
}



// Liens d'avis (fixes) : Amazon (fiche ASIN B0G217LD87) et BoardGameGeek.
export const REVIEW_LINKS = Object.freeze({
  amazon: 'https://www.amazon.fr/review/create-review?asin=B0G217LD87',
  bgg: 'https://boardgamegeek.com/boardgame/480678/kyran'
});

export function renderReviewRequestEmail({ customerName = '', unsubscribeUrl = '' }) {
  const firstName = String(customerName || '').trim().split(/\s+/)[0] || '';
  const hello = firstName ? `Bonjour ${firstName},` : 'Bonjour,';
  const unsubHref = safeUrl(unsubscribeUrl);
  const button = (href, label) => `<a href="${esc(href)}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; margin: 0 8px 10px 0;" target="_blank">${esc(label)}</a>`;

  const contentHtml = `
    <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      Alors, cette première partie&nbsp;?
    </h1>

    <p style="margin: 0 0 14px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      ${esc(hello)} votre boîte de KYRAN est arrivée il y a quelques jours. J'espère que la carte sur le front a déjà fait rire (ou râler) autour de la table.
    </p>

    <p style="margin: 0 0 18px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      J'édite KYRAN moi-même, sans magasin ni publicité&nbsp;: un avis de quelques lignes aide vraiment d'autres joueurs à le découvrir. Une minute suffit, là où vous préférez&nbsp;:
    </p>

    <div style="margin: 0 0 18px 0;">
      ${button(REVIEW_LINKS.amazon, 'Laisser un avis sur Amazon')}
      ${button(REVIEW_LINKS.bgg, 'Noter KYRAN sur BoardGameGeek')}
    </div>

    <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Une remarque, une règle pas claire, un souci avec la boîte&nbsp;? Répondez simplement à ce mail, je lis tout.
    </p>
    <p style="margin: 0; font-size: 14px; color: #0f172a;">Corentin, auteur de KYRAN</p>

    ${unsubHref ? `<div style="margin-top: 24px; font-size: 11px; color: #94a3b8;">Vous recevez ce mail une seule fois, après votre commande. <a href="${esc(unsubHref)}" style="color: #94a3b8; text-decoration: underline;">Ne plus recevoir de demande d'avis</a>.</div>` : ''}
  `;

  const html = baseLayout({
    title: 'Votre avis sur KYRAN',
    previewText: 'Une minute pour aider un jeu d\'auteur indépendant ?',
    contentHtml
  });

  const text = `${hello}

Votre boîte de KYRAN est arrivée il y a quelques jours. J'espère que la carte sur le front a déjà fait rire (ou râler) autour de la table.

J'édite KYRAN moi-même, sans magasin ni publicité : un avis de quelques lignes aide vraiment d'autres joueurs à le découvrir.

- Avis sur Amazon : ${REVIEW_LINKS.amazon}
- Note sur BoardGameGeek : ${REVIEW_LINKS.bgg}

Une remarque ou un souci ? Répondez simplement à ce mail, je lis tout.

Corentin, auteur de KYRAN
${unsubHref ? `\nVous recevez ce mail une seule fois. Ne plus recevoir de demande d'avis : ${unsubHref}\n` : ''}`;

  return { html, text };
}

// Mail de confirmation d'inscription (POST /api/inscription) : court, la règle en PDF, le lien de désinscription.
// Liens https://kyran-jeu.fr en clair, sans raccourcisseur.
export const INSCRIPTION_LINKS = Object.freeze({
  regle: 'https://kyran-jeu.fr/regle-kyran.pdf',
  avent: 'https://kyran-jeu.fr/avent.html',
  confidentialite: 'https://kyran-jeu.fr/confidentialite.html'
});

export function renderInscriptionEmail({ source = 'site', unsubscribeUrl = '' }) {
  const unsubHref = safeUrl(unsubscribeUrl);
  const avent = source === 'avent';
  const link = href => `<a href="${esc(href)}" style="color: #0f172a; text-decoration: underline; word-break: break-all;" target="_blank">${esc(href)}</a>`;

  const contentHtml = `
    <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      Bienvenue autour de la table
    </h1>

    <p style="margin: 0 0 14px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Bonjour, merci pour votre inscription. Voici la règle du jeu KYRAN en PDF&nbsp;:<br>
      ${link(INSCRIPTION_LINKS.regle)}
    </p>
${avent ? `
    <p style="margin: 0 0 14px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Les défis du calendrier de l'Avent s'ouvrent chaque jour à minuit&nbsp;: ${link(INSCRIPTION_LINKS.avent)}
    </p>
` : ''}
    <p style="margin: 0 0 14px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Vous recevrez au plus un mail par semaine&nbsp;: nouveaux défis et nouvelles de KYRAN.
    </p>
    <p style="margin: 0; font-size: 14px; color: #0f172a;">Corentin, auteur de KYRAN</p>

    ${unsubHref ? `<div style="margin-top: 24px; font-size: 11px; color: #94a3b8;">Vous recevez ce mail parce que cette adresse a été inscrite sur kyran-jeu.fr. <a href="${esc(unsubHref)}" style="color: #94a3b8; text-decoration: underline;">Se désinscrire en un clic</a>.</div>` : ''}
  `;

  const html = baseLayout({
    title: 'La règle du jeu KYRAN',
    previewText: 'La règle du jeu KYRAN en PDF, et un mail par semaine au plus.',
    contentHtml
  });

  const text = `Bonjour,

Merci pour votre inscription. Voici la règle du jeu KYRAN en PDF :
${INSCRIPTION_LINKS.regle}
${avent ? `\nLes défis du calendrier de l'Avent s'ouvrent chaque jour à minuit : ${INSCRIPTION_LINKS.avent}\n` : ''}
Vous recevrez au plus un mail par semaine : nouveaux défis et nouvelles de KYRAN.

Corentin, auteur de KYRAN
${unsubHref ? `\nSe désinscrire en un clic : ${unsubHref}\n` : ''}`;

  return { html, text };
}
