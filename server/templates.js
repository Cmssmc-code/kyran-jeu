// Templates HTML adaptés pour Cloudflare Worker

function baseLayout({ title, previewText, contentHtml }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px;">
    ${previewText}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center;">
              <a href="https://kyran-jeu.fr" style="text-decoration: none;" target="_blank">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 4px; color: #fbbf24; text-transform: uppercase; font-family: 'Arial Black', Impact, sans-serif;">KYRAN</span>
              </a>
              <div style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #cbd5e1; margin-top: 4px;">Le Jeu de Cartes Tactique</div>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              ${contentHtml}
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                Créé avec passion par <strong>Corentin Sence</strong> · Édition officielle KYRAN
              </p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #94a3b8;">
                Une question ? Répondez directement à cet email ou écrivez à <a href="mailto:contact@kyran-jeu.fr" style="color: #d97706; text-decoration: underline;">contact@kyran-jeu.fr</a>
              </p>
              <div style="font-size: 11px; color: #cbd5e1;">
                <a href="https://kyran-jeu.fr/regle.html" style="color: #94a3b8; text-decoration: none; margin: 0 8px;">Règles du jeu</a> •
                <a href="https://kyran-jeu.fr/minijeu.html" style="color: #94a3b8; text-decoration: none; margin: 0 8px;">Dojo en ligne</a> •
                <a href="https://kyran-jeu.fr/cgv.html" style="color: #94a3b8; text-decoration: none; margin: 0 8px;">CGV</a>
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
  const addressBlock = shippingAddress ? `
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-top: 20px; font-size: 13px; line-height: 1.6; color: #334155;">
      <strong style="color: #0f172a; font-size: 13px; display: block; margin-bottom: 4px;">📍 Adresse de livraison :</strong>
      ${shippingAddress.name ? `<div>${shippingAddress.name}</div>` : ''}
      ${shippingAddress.line1 ? `<div>${shippingAddress.line1}</div>` : ''}
      ${shippingAddress.line2 ? `<div>${shippingAddress.line2}</div>` : ''}
      <div>${shippingAddress.postal_code || ''} ${shippingAddress.city || ''}</div>
      <div>${shippingAddress.country || 'France'}</div>
    </div>
  ` : '';

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 26px;">
      <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
        ✓ Commande confirmée
      </div>
      <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #0f172a;">
        Merci pour votre commande, ${customerName} !
      </h1>
      <p style="margin: 0; font-size: 14px; color: #64748b;">
        Votre paiement a bien été validé. Nous préparons votre boîte KYRAN avec soin.
      </p>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
      <tr style="background-color: #f8fafc;">
        <th align="left" style="padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Article</th>
        <th align="center" style="padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Qté</th>
        <th align="right" style="padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Total</th>
      </tr>
      <tr>
        <td style="padding: 16px; border-top: 1px solid #e2e8f0;">
          <strong style="color: #0f172a; font-size: 14px;">KYRAN — Édition Officielle</strong>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">55 cartes toilées vernies + Boîte cloche rigide</div>
        </td>
        <td align="center" style="padding: 16px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 600;">
          ${quantity}
        </td>
        <td align="right" style="padding: 16px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #0f172a; font-weight: 600;">
          ${subtotalAmount}
        </td>
      </tr>
      <tr>
        <td colspan="2" align="right" style="padding: 10px 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
          Livraison suivie :
        </td>
        <td align="right" style="padding: 10px 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #0f172a; font-weight: 600;">
          ${shippingCost}
        </td>
      </tr>
      <tr style="background-color: #faf5ff;">
        <td colspan="2" align="right" style="padding: 14px 16px; border-top: 2px solid #e2e8f0; font-size: 15px; font-weight: 700; color: #0f172a;">
          Total réglé (TTC) :
        </td>
        <td align="right" style="padding: 14px 16px; border-top: 2px solid #e2e8f0; font-size: 17px; font-weight: 800; color: #d97706;">
          ${totalAmount}
        </td>
      </tr>
    </table>

    ${addressBlock}

    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 18px; margin-top: 20px; font-size: 13px; line-height: 1.5; color: #1e40af;">
      <strong>🚚 Expédition sous 24h à 48h ouvrées :</strong>
      <div style="margin-top: 4px;">Délai d'acheminement estimé : <strong>${estimatedDelivery}</strong> via La Poste / Colissimo suivi.</div>
    </div>

    <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1px solid #fde68a; border-radius: 12px; padding: 22px; margin-top: 28px; text-align: center;">
      <div style="font-size: 16px; font-weight: 700; color: #92400e; margin-bottom: 6px;">
        🃏 En attendant votre colis, affrontez le Dojo !
      </div>
      <p style="font-size: 13px; color: #b45309; margin: 0 0 16px 0; line-height: 1.5;">
        Testez les règles, anticipez les plis et maîtrisez la manche Mystique grâce à notre simulateur interactif gratuit.
      </p>
      <a href="https://kyran-jeu.fr/minijeu.html" style="display: inline-block; background-color: #d97706; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 22px; border-radius: 50px; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3);" target="_blank">
        Jouer au Dojo en ligne →
      </a>
    </div>

    ${orderId ? `<div style="text-align: center; margin-top: 20px; font-size: 11px; color: #94a3b8;">Réf commande : ${orderId}</div>` : ''}
  `;

  return baseLayout({
    title: 'Confirmation de commande KYRAN',
    previewText: `Merci ${customerName} ! Votre boîte de jeu KYRAN est en préparation.`,
    contentHtml
  });
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
    <div style="text-align: center; margin: 24px 0;">
      <a href="${trackingUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 50px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);" target="_blank">
        Suivre mon colis en direct →
      </a>
    </div>
  ` : '';

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 26px;">
      <div style="display: inline-block; background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
        📦 Colis expédié
      </div>
      <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #0f172a;">
        Votre jeu KYRAN est en route !
      </h1>
      <p style="margin: 0; font-size: 14px; color: #64748b;">
        Votre commande a été remise au transporteur et arrive très bientôt chez vous.
      </p>
    </div>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">Transporteur & Numéro de suivi</div>
      <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 6px 0; font-family: monospace;">
        ${trackingNumber || 'En cours d\'actualisation'}
      </div>
      <div style="font-size: 13px; color: #64748b;">
        Acheminement par <strong>${carrier}</strong> · Réception estimée sous <strong>${estimatedDelivery}</strong>
      </div>
    </div>

    ${trackingButton}

    <div style="background-color: #fdf4ff; border: 1px solid #f0abfc; border-radius: 12px; padding: 18px; font-size: 13px; line-height: 1.6; color: #86198f;">
      <strong>💡 Préparez vos soirées :</strong>
      KYRAN se joue de 3 à 6 joueurs dès 8 ans. Partagez dès maintenant le simulateur ou le livret de règles avec vos partenaires de jeu pour qu'ils soient prêts dès l'ouverture de la boîte !
      <div style="margin-top: 10px;">
        <a href="https://kyran-jeu.fr/regle.html" style="color: #a21caf; font-weight: 700; text-decoration: underline;">Lire les règles (5 min) →</a>
      </div>
    </div>

    ${orderId ? `<div style="text-align: center; margin-top: 20px; font-size: 11px; color: #94a3b8;">Réf commande : ${orderId}</div>` : ''}
  `;

  return baseLayout({
    title: 'Votre jeu KYRAN a été expédié !',
    previewText: `Bonne nouvelle ${customerName} ! Votre colis KYRAN a été pris en charge par le transporteur.`,
    contentHtml
  });
}

export function renderRefundEmail({
  customerName = 'Cher joueur',
  orderId = '',
  refundAmount = '13,98 €',
  reason = 'Remboursement suite à votre demande'
}) {
  const contentHtml = `
    <div style="text-align: center; margin-bottom: 26px;">
      <div style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
        Remboursement effectué
      </div>
      <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #0f172a;">
        Remboursement confirmé
      </h1>
      <p style="margin: 0; font-size: 14px; color: #64748b;">
        Nous confirmons l'émission du remboursement de votre commande.
      </p>
    </div>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px; text-align: center; margin-bottom: 24px;">
      <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Montant crédité :</div>
      <div style="font-size: 28px; font-weight: 800; color: #0f172a;">${refundAmount}</div>
      ${reason ? `<div style="font-size: 13px; color: #64748b; margin-top: 8px;">Motif : ${reason}</div>` : ''}
    </div>

    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px 18px; font-size: 13px; line-height: 1.5; color: #1e40af;">
      <strong>⏱️ Délai de crédit sur votre compte :</strong>
      Selon votre établissement bancaire, le montant apparaîtra sur votre compte bancaire sous <strong>5 à 10 jours ouvrés</strong>.
    </div>

    ${orderId ? `<div style="text-align: center; margin-top: 20px; font-size: 11px; color: #94a3b8;">Réf Stripe : ${orderId}</div>` : ''}
  `;

  return baseLayout({
    title: 'Remboursement de votre commande KYRAN',
    previewText: `Votre remboursement de ${refundAmount} a été émis avec succès.`,
    contentHtml
  });
}
