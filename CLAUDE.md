# CLAUDE.md

Site du jeu de cartes KYRAN (kyran-jeu.fr) : site statique GitHub Pages, serveur webhook Node sur
Railway (`server/`), variante Cloudflare Worker (`worker/`). Après toute modification de pages,
composants ou contenus : `npm run build` puis `npm test` (la CI vérifie que les fichiers générés
sont à jour). Leçons anti-récidive : [`_notes/lecon.md`](_notes/lecon.md).
Mémoire condensée du projet (jeu, architecture, pipelines, routines) : [`_notes/memoire.md`](_notes/memoire.md).
Données Search Console et Bing Webmaster : serveurs MCP `gsc` et `bing-webmaster` ([`docs/MCP_SEO.md`](docs/MCP_SEO.md)).

Initiation (`minijeu.html`, anciennement « Dojo ») : modules ES dans `dojo/` — `engine.js` (règles officielles, sans DOM),
`ai.js` (adversaires et conseils du Bokonon), `lessons.js` (sept rites), `app.js`
(interface), `dojo.css`, visuels tirés des cartes dans `dojo/img/`. Tests : `scripts/test/dojo.test.mjs`. Les `?v=` sont posés par
`scripts/stamp-dojo.mjs` (inclus dans `npm run build`).

## Style de réponse : caveman

Toujours parler comme caveman dans les réponses au user (chat). Phrases courtes. Mots simples.
Exception : code, commits, PR, commentaires GitHub, docs et fichiers du repo restent écrits normalement.

## Pull requests : fusion automatique

Toujours fusionner soi-même ses PR, sans attendre de validation : dès que la CI (« Contrôles du site »)
est verte sur le dernier commit, sans conflit ni commentaire de revue ouvert, passer la PR de brouillon
à prête puis la fusionner dans `main`. Si la CI échoue, corriger et repousser jusqu'au vert, puis fusionner.

## Erreurs de production — Auto-Heal

Pipeline décrit dans [`docs/AUTO-HEAL.md`](docs/AUTO-HEAL.md) (portage du pipeline Majordia) :

1. Erreurs du site (`error-reporter.js`) et du serveur (`recordServerIncident`) → journal
   `server/incidents.js` sur le volume Railway `/data` (projet Railway `kyran-webhook`).
2. Passe horaire `.github/workflows/auto-heal-hourly.yml` → `scripts/auto-heal-worker.mjs`
   (Claude corrige, `npm run build` + `npm test`, push sur `main`).
3. Rapport email 24 h vers `ADMIN_NOTIFICATION_EMAILS` seulement si le système a agi.

Pour un bug de production : lire d'abord `_notes/lecon.md`, l'historique du workflow « Hourly
Auto-Heal » et les logs Railway (préfixe `[AutoHeal]`). Une fausse alerte se corrige par un filtre
précis dans `isBenignClientError`, jamais en masquant une vraie panne.

## Directives Stripe - Projet KYRAN

- **Compte cible** : KYRAN uniquement (`acct_1UBHzpPe2ed8eDFC`), JAMAIS Majordia (`acct_1TcQiAGThve4pFmw`).
  Le connecteur Stripe de claude.ai pointe sur Majordia : ne pas l'utiliser pour KYRAN.
- **Outils prioritaires** : serveur MCP `stripe` déclaré au niveau projet dans `.mcp.json`. La clé n'y est
  jamais écrite : `.mcp.json` est versionné, il lit `${STRIPE_SECRET_KEY}` dans l'environnement. Avant de
  lancer Claude Code, exporter la variable depuis `.env` (ex. PowerShell :
  `$env:STRIPE_SECRET_KEY = (Select-String '^STRIPE_SECRET_KEY=' .env).Line.Split('=',2)[1]`).
- **Vérifications obligatoires avant toute modification** :
  1. Vérifier que le produit cible est bien `prod_VBfXBJYQzElac4` (KYRAN — Jeu de cartes).
  2. Vérifier que le lien de paiement cible est bien `plink_1UBIC0Pe2ed8eDFCuudRl3Nq`
     (`https://buy.stripe.com/eVqeVfaWz4k02yY1UqaEE00`).
  3. Ne JAMAIS modifier sans accord :
     - Prix unitaire : 9,99 €
     - Frais de port : 2,99 €
     - URL de redirection après paiement : `https://kyran-jeu.fr/merci.html`
- **Sécurité** :
  - Ne jamais commiter `.env` ni de clé Stripe (ni dans `.mcp.json`).
  - Toujours vérifier la présence de `.env` dans `.gitignore`.
