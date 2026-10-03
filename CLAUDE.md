# CLAUDE.md

Site du jeu de cartes KYRAN (kyran-jeu.fr) : site statique GitHub Pages, serveur webhook Node sur
Railway (`server/`), variante Cloudflare Worker (`worker/`). Après toute modification de pages,
composants ou contenus : `npm run build` puis `npm test` (la CI vérifie que les fichiers générés
sont à jour). Leçons anti-récidive : [`_notes/lecon.md`](_notes/lecon.md).

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
