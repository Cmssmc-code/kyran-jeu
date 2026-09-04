# 📧 Système d'Emails Transactionnels KYRAN

Ce dossier contient l'infrastructure complète pour les emails de commande, remboursement et expédition du jeu **KYRAN**.

---

## 1. Emails Natifs Stripe (Garantie Immédiate 0 Maintenance)

Pour que chaque client reçoive automatiquement un reçu/facture officiel dès l'achat :

1. Rendez-vous sur le **Dashboard Stripe** : [dashboard.stripe.com/settings/emails](https://dashboard.stripe.com/settings/emails)
2. Cochez :
   - ✅ **Envoyer des reçus de paiement aux clients**
   - ✅ **Envoyer des notifications de remboursement aux clients**
3. Rendez-vous sur la personnalisation de marque : [dashboard.stripe.com/settings/branding](https://dashboard.stripe.com/settings/branding)
   - Couleur principale : `#d97706` (Or KYRAN)
   - Couleur secondaire / texte : `#0f172a` (Sombre KYRAN)
   - Logo / Icône : Téléversez le logo KYRAN

---

## 2. Emails Personnalisés KYRAN (Cloudflare Worker + Resend)

Le worker écoute les événements Stripe et envoie des emails brandés avec le lien direct vers le **Dojo en ligne** (`minijeu.html`), le récapitulatif détaillé et les règles du jeu.

### Événements gérés :
- `checkout.session.completed` : Email de confirmation d'achat + accès immédiat Dojo.
- `charge.refunded` : Notification de remboursement avec délais bancaires (5-10 jours).
- `POST /api/shipping` : Notification d'expédition avec numéro de suivi La Poste.

### Déploiement Cloudflare Worker :

```bash
cd "Site web/kyran-site/worker"
npx wrangler login
npx wrangler deploy
```

Ajout des secrets dans Cloudflare :
```bash
npx wrangler secret put RESEND_API_KEY
# Coller la clé API Resend

npx wrangler secret put STRIPE_WEBHOOK_SECRET
# Coller le secret généré à l'étape suivante
```

---

## 3. Liaison automatique du Webhook Stripe

Une fois le worker déployé et son URL obtenue (ex: `https://kyran-stripe-webhook.votre-compte.workers.dev`) :

```bash
cd "Site web/kyran-site"
node scripts/setup-stripe-webhook.mjs create https://kyran-stripe-webhook.votre-compte.workers.dev
```

Le script configure directement le compte Stripe KYRAN et affiche le `STRIPE_WEBHOOK_SECRET` à enregistrer dans le Worker.

---

## 4. Envoi de l'Email d'Expédition (Colis & Suivi)

Dès qu'une boîte est expédiée :

```bash
cd "Site web/kyran-site"
node scripts/send-shipping-email.mjs --to client@email.com --name "Jean Dupont" --tracking "1L99988877766" --order "cs_live_xxx"
```
