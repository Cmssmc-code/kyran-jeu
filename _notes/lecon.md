# Leçons anti-récidive — KYRAN

Journal des causes de bugs de production et de leur correctif, pour ne pas les reproduire.
L'agent Auto-Heal (`scripts/auto-heal-worker.mjs`) le consulte avant chaque correctif et y ajoute
une entrée à chaque correctif déployé. Fonctionnement du pipeline : [`docs/AUTO-HEAL.md`](../docs/AUTO-HEAL.md).

Format : `### AAAA-MM-JJ — [Auto-Heal] <référence> — <résumé>` puis trois puces
**Symptôme**, **Cause**, **Correctif**. Entrées les plus récentes en haut.

<!-- auto-heal:entries -->

### 2026-10-03 — Emails KYRAN envoyés depuis une adresse Majordia

- **Symptôme :** emails clients, alertes de vente et rapport Auto-Heal partaient de `contact@majordia.fr` (seul domaine vérifié dans Resend).
- **Cause :** expéditeur par défaut `contact@majordia.fr` dans `server/server.js`, `worker/index.js` et `worker/wrangler.toml`.
- **Correctif :** `server/mailer.js` impose une adresse KYRAN (`@kyran-jeu.fr` ou `kyran.jeu@gmail.com`, sinon `contact@kyran-jeu.fr`) ; transport SMTP de la boîte (OVH / Gmail) via `SMTP_PASSWORD`, sinon Resend avec le domaine `kyran-jeu.fr` vérifié. Règle : **jamais** d'adresse d'un autre produit (Majordia) dans un email KYRAN.

### 2026-10-03 — Mise en place du pipeline Auto-Heal (portage de Majordia)

- **Besoin :** remonter automatiquement les erreurs de production du site et du serveur, et les corriger sans intervention humaine, comme sur Majordia (alertes `support@majordia.fr` → table `production_incidents` → passe horaire Claude).
- **Mise en place :** `error-reporter.js` (inséré dans chaque page par `scripts/apply-csp.mjs`) → `POST /api/client-error` sur le serveur Railway ; erreurs serveur (webhook Stripe, notification de vente, exceptions) consignées par `recordServerIncident` ; journal `server/incidents.js` sur le volume Railway `/data` ; workflow horaire `.github/workflows/auto-heal-hourly.yml` → `scripts/auto-heal-worker.mjs`.
- **Règles :** ne jamais envoyer un email par erreur : toujours passer par le journal d'incidents (agrégation) ; une fausse alerte se corrige par un filtre précis dans `isBenignClientError`, jamais en masquant une vraie panne ; une page générée se corrige dans sa source (`scripts/content/`, générateurs), jamais directement.
