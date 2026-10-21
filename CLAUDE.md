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

## Surveillance & réparation quotidiennes du site

Une routine Claude « Surveillance & réparation » tourne chaque jour à 05:07 (Europe/Paris) : recherche poussée (journal d'incidents du serveur, Railway, workflows, crawl Playwright de tout le site, parcours critiques, Stripe en lecture, e-mails, `npm audit`, veille), réparation des incidents (PR fusionnée, vérifiée en ligne, incident clôturé), rapport email quotidien à kyran.jeu@gmail.com. Mission [`_notes/surveillance-reparation-routine-mission.md`](_notes/surveillance-reparation-routine-mission.md), journal [`_notes/suivi-surveillance.md`](_notes/suivi-surveillance.md), rapports `docs/rapports/surveillance/`. Elle remplace depuis le 2026-10-21 la routine « Santé » de minuit (historique : [`_notes/suivi-sante.md`](_notes/suivi-sante.md)).

## SEO & GEO : où tout trouver

Tout le référencement de kyran-jeu.fr (Google, Bing, moteurs de réponse IA) est suivi dans **[`_notes/seo/`](_notes/seo/README.md)**. Commencer par [`_notes/seo/README.md`](_notes/seo/README.md) (index du dossier), puis [`base-connaissances.md`](_notes/seo/base-connaissances.md) (état complet : jeu, offre, pages, mots-clés, technique, concurrents, mentions, GEO, règles) et [`backlog.md`](_notes/seo/backlog.md) (priorités). Chiffres jour par jour : [`kpi-quotidiens.csv`](_notes/seo/kpi-quotidiens.csv). Journal nuit après nuit : [`_notes/suivi-seo.md`](_notes/suivi-seo.md). Une routine Claude met tout à jour chaque nuit à minuit selon [`_notes/seo-routine-mission.md`](_notes/seo-routine-mission.md). Tableau partagé : https://claude.ai/code/artifact/5d4cf936-dfeb-4516-bb57-2141b081edee. Toute question ou tâche SEO/GEO (titres, descriptions, sitemap, `llms.txt`, indexation, netlinking, citations IA) part de ce dossier ; après la tâche, mettre à jour la base et le journal.

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
2. Réparation par la routine Claude « Surveillance & réparation » (quotidienne, 05:07) depuis le
   2026-10-21 : elle lit le journal par le workflow `.github/workflows/auto-heal-incidents.yml` (jeton OIDC,
   aucun secret), corrige en PR (`npm run build` + `npm test`, fusion quand la CI est verte), vérifie en
   ligne puis clôture l'incident (`resolve` / `fail` / `ignore`). Mission :
   [`_notes/surveillance-reparation-routine-mission.md`](_notes/surveillance-reparation-routine-mission.md).
   L'ancienne passe horaire `auto-heal-hourly.yml` (agent `scripts/auto-heal-worker.mjs`) est manuelle :
   elle n'a plus d'auth Anthropic valide.
3. Un seul email par jour : le rapport de la routine, à kyran.jeu@gmail.com (le rapport 24 h du serveur,
   `daily-report`, n'est plus appelé).

Pour un bug de production : lire d'abord `_notes/lecon.md`, le journal d'incidents (workflow
`auto-heal-incidents.yml`, action `list`) et les logs Railway (préfixe `[AutoHeal]`). Une fausse alerte se corrige par un filtre
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
