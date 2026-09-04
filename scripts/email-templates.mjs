// Templates emails ultra-épurés pour KYRAN
// Design minimaliste, typographique, 0 surcharge visuelle, compatibilité 100% webmails.

function baseLayout({ title, previewText, contentHtml }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px;">
    ${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
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
  totalAmount = '13,98 €',
  shippingCost = '3,99 €',
  shippingAddress = null,
  estimatedDelivery = '3 à 5 jours ouvrés'
}) {
  const addressHtml = shippingAddress ? `
    <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #475569; line-height: 1.5;">
      <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">Livraison à :</div>
      ${shippingAddress.name ? `<div>${shippingAddress.name}</div>` : ''}
      ${shippingAddress.line1 ? `<div>${shippingAddress.line1}</div>` : ''}
      ${shippingAddress.line2 ? `<div>${shippingAddress.line2}</div>` : ''}
      <div>${shippingAddress.postal_code || ''} ${shippingAddress.city || ''}</div>
      <div>${shippingAddress.country || 'France'}</div>
    </div>
  ` : '';

  const contentHtml = `
    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #059669; margin-bottom: 12px;">
      ✓ Commande confirmée
    </div>

    <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      Merci pour votre commande, ${customerName}.
    </h1>

    <p style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6;">
      Paiement validé. Votre boîte KYRAN est en cours de préparation dans notre atelier.
    </p>

    <!-- Tableau simple récapitulatif -->
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px;">
        <tr>
          <td style="padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 500;">
            KYRAN — Édition Officielle × ${quantity}
          </td>
          <td align="right" style="padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 600;">
            ${subtotalAmount}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">
            Livraison suivie (${estimatedDelivery})
          </td>
          <td align="right" style="padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">
            ${shippingCost}
          </td>
        </tr>
        <tr style="background-color: #fafaf9;">
          <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">
            Total réglé
          </td>
          <td align="right" style="padding: 12px 16px; color: #0f172a; font-weight: 700;">
            ${totalAmount}
          </td>
        </tr>
      </table>
    </div>

    ${addressHtml}

    <!-- Lien Dojo ultra simple -->
    <div style="margin-top: 28px; padding: 18px 20px; background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; font-size: 13px; line-height: 1.5;">
      <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">🃏 En attendant votre colis :</div>
      <div style="color: #57534e; margin-bottom: 12px;">Découvrez les cartes et testez la manche Mystique sur notre simulateur en ligne gratuit.</div>
      <a href="https://kyran-jeu.fr/minijeu.html" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 8px 18px; border-radius: 6px; font-size: 12px; font-weight: 600;" target="_blank">
        Tester le Dojo en ligne →
      </a>
    </div>

    ${orderId ? `<div style="margin-top: 24px; font-size: 11px; color: #94a3b8;">Référence : ${orderId}</div>` : ''}
  `;

  const html = baseLayout({
    title: 'Confirmation de commande KYRAN',
    previewText: `Merci ${customerName}, votre commande KYRAN est confirmée.`,
    contentHtml
  });

  const text = `Merci pour votre commande KYRAN, ${customerName} !

Votre paiement a bien été validé.
Votre boîte KYRAN est en cours de préparation.

Récapitulatif :
- Article : KYRAN — Édition Officielle × ${quantity} : ${subtotalAmount}
- Livraison suivie (${estimatedDelivery}) : ${shippingCost}
- Total réglé : ${totalAmount}

En attendant votre colis, entraînez-vous sur le simulateur interactif :
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
  const trackingButton = trackingUrl ? `
    <div style="margin: 20px 0 24px 0;">
      <a href="${trackingUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-size: 13px; font-weight: 600;" target="_blank">
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
      Votre commande a été remise au transporteur (${carrier}) et arrive sous ${estimatedDelivery}.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; font-size: 13px; color: #334155;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px;">Numéro de suivi :</div>
      <div style="font-size: 16px; font-weight: 700; color: #0f172a; font-family: monospace;">${trackingNumber || 'En cours d\'actualisation'}</div>
    </div>

    ${trackingButton}

    <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
      Astuce : préparez vos parties dès maintenant en consultant les règles du jeu sur <a href="https://kyran-jeu.fr/regle.html" style="color: #0f172a; text-decoration: underline;">kyran-jeu.fr/regle.html</a>.
    </div>

    ${orderId ? `<div style="margin-top: 24px; font-size: 11px; color: #94a3b8;">Référence commande : ${orderId}</div>` : ''}
  `;

  const html = baseLayout({
    title: 'Votre colis KYRAN a été expédié',
    previewText: `Votre jeu KYRAN est en route (${trackingNumber || 'Suivi La Poste'}).`,
    contentHtml
  });

  const text = `Bonjour ${customerName},

Votre commande KYRAN a été remise au transporteur (${carrier}) et arrive sous ${estimatedDelivery}.

Numéro de suivi : ${trackingNumber || 'Non renseigné'}
${trackingUrl ? `Lien de suivi : ${trackingUrl}` : ''}

Règles du jeu : https://kyran-jeu.fr/regle.html

Une question ? Répondez directement à cet email.
Édition officielle KYRAN — https://kyran-jeu.fr
`;

  return { html, text };
}

export function renderRefundEmail({
  customerName = 'Cher joueur',
  orderId = '',
  refundAmount = '13,98 €',
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
      Bonjour ${customerName}, le remboursement de votre commande KYRAN a bien été émis sur votre moyen de paiement initial.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; font-size: 13px; color: #334155; margin-bottom: 20px;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px;">Montant crédité :</div>
      <div style="font-size: 22px; font-weight: 800; color: #0f172a;">${refundAmount}</div>
      ${reason ? `<div style="margin-top: 6px; font-size: 12px; color: #64748b;">Motif : ${reason}</div>` : ''}
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
      Selon votre établissement bancaire, le crédit apparaîtra sur votre relevé sous <strong>5 à 10 jours ouvrés</strong>.
    </p>

    ${orderId ? `<div style="margin-top: 24px; font-size: 11px; color: #94a3b8;">Référence : ${orderId}</div>` : ''}
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
