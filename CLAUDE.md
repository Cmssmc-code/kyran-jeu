# CLAUDE.md

Site du jeu de cartes KYRAN (kyran-jeu.fr) : site statique GitHub Pages, serveur webhook Node sur
Railway (`server/`), variante Cloudflare Worker (`worker/`). Après toute modification de pages,
composants ou contenus : `npm run build` puis `npm test` (la CI vérifie que les fichiers générés
sont à jour). Leçons anti-récidive : [`_notes/lecon.md`](_notes/lecon.md).
Mémoire condensée du projet (jeu, architecture, pipelines, routines) : [`_notes/memoire.md`](_notes/memoire.md).

Initiation (`minijeu.html`, anciennement « Dojo ») : modules ES dans `dojo/` — `engine.js` (règles officielles, sans DOM),
`ai.js` (adversaires et conseils du Bokonon), `lessons.js` (sept rites), `app.js`
(interface), `dojo.css`, visuels tirés des cartes dans `dojo/img/`. Tests : `scripts/test/dojo.test.mjs`. Les `?v=` sont posés par
`scripts/stamp-dojo.mjs` (inclus dans `npm run build`).

## Style de réponse : caveman

Toujours parler comme caveman dans les réponses au user (chat). Phrases courtes. Mots simples.
Exception : code, commits, PR, commentaires GitHub, docs et fichiers du repo restent écrits normalement.

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
