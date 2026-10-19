# CLAUDE.md

Site du jeu de cartes KYRAN (kyran-jeu.fr) : site statique GitHub Pages, serveur webhook Node sur
Railway (`server/`), variante Cloudflare Worker (`worker/`). Après toute modification de pages,
composants ou contenus : `npm run build` puis `npm test` (la CI vérifie que les fichiers générés
sont à jour). Leçons anti-récidive : [`_notes/lecon.md`](_notes/lecon.md).
Mémoire condensée du projet (jeu, architecture, pipelines, routines) : [`_notes/memoire.md`](_notes/memoire.md).
Données Search Console et Bing Webmaster : serveurs MCP `gsc` et `bing-webmaster` ([`docs/MCP_SEO.md`](docs/MCP_SEO.md)).
Routine SEO & GEO nocturne (minuit) : mission [`_notes/seo-routine-mission.md`](_notes/seo-routine-mission.md),
base [`_notes/seo/`](_notes/seo/base-connaissances.md), journal [`_notes/suivi-seo.md`](_notes/suivi-seo.md).

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

## Gestion multi-comptes Stripe

Deux serveurs MCP Stripe :

1. `stripe-kyran` : compte `acct_1UBHzpPe2ed8eDFC` (produit KYRAN, boutique du jeu de cartes).
   - À utiliser en priorité dans ce projet pour toute action liée à KYRAN.
   - Déclaré au niveau projet dans `.mcp.json` (versionné) : la clé n'y est jamais écrite, elle est lue
     dans `${STRIPE_SECRET_KEY}`. Avant de lancer Claude Code, exporter la variable depuis `.env`
     (PowerShell : `$env:STRIPE_SECRET_KEY = (Select-String '^STRIPE_SECRET_KEY=' .env).Line.Split('=',2)[1]`).
   - Produit cible : `prod_VBfXBJYQzElac4` (KYRAN — Jeu de cartes).
   - Lien de paiement : `plink_1UBIC0Pe2ed8eDFCuudRl3Nq` (`https://buy.stripe.com/eVqeVfaWz4k02yY1UqaEE00`).
   - Ne jamais modifier sans accord : prix unitaire 9,99 €, frais de port 2,99 €, redirection après
     paiement `https://kyran-jeu.fr/merci.html`.

2. `stripe-majordia` : compte `acct_1TcQiAGThve4pFmw` (plateforme Majordia, forfaits SaaS).
   - Déclaré au niveau utilisateur (`claude mcp add -s user`), hors du repo.
   - Ne jamais l'utiliser pour une action e-commerce KYRAN. Le connecteur Stripe de claude.ai pointe
     aussi sur Majordia : même interdiction.

Règles de sécurité :

- Ne jamais commiter `.env` ni de clé Stripe (ni dans `.mcp.json`) ; vérifier que `.env` reste dans `.gitignore`.
- Toujours vérifier l'identifiant du compte (`account_id`, via `GET /v1/account`) avant toute mutation.
