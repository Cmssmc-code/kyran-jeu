# AGENTS.md : KYRAN (kyran-jeu.fr)

Point d'entrée pour toute IA ou tout agent de code (Claude, Codex, Cursor, Copilot, Gemini…) qui ouvre ce dépôt.
Les règles détaillées sont dans [`CLAUDE.md`](CLAUDE.md) ; en cas d'écart, `CLAUDE.md` fait foi.

## Le projet

Site du jeu de cartes **KYRAN** (jeu de plis avec pari exact, 3 à 6 joueurs, vendu 9,99 € + port) : site
statique sur GitHub Pages (`kyran-jeu.fr`), serveur webhook Node sur Railway (`server/`), variante Cloudflare
Worker (`worker/`), initiation jouable dans `dojo/` (`minijeu.html`).

## À lire avant d'agir

1. [`CLAUDE.md`](CLAUDE.md) : règles du dépôt (build, PR, Auto-Heal, Stripe).
2. [`_notes/lecon.md`](_notes/lecon.md) : leçons anti-récidive.
3. [`_notes/memoire.md`](_notes/memoire.md) : mémoire condensée (faits canoniques du jeu § 1, architecture, CI,
   routines).

## Règles essentielles

- Après toute modification de pages, composants ou contenus : `npm run build` puis `npm test`, et commiter les
  fichiers régénérés (la CI « Contrôles du site » vérifie que le build est à jour).
- Une page générée se corrige dans sa source (`scripts/content/`, générateurs), jamais dans le HTML produit.
- Pull request puis fusion par l'agent lui-même dès que la CI est verte, sans conflit ni commentaire ouvert.
- Faits du jeu : jamais « 55 cartes », « février 2026 », « sans élimination », « sans hasard ». Prix, port et
  paiement Stripe ne changent pas sans accord du propriétaire.
- Jamais d'adresse e-mail Majordia dans un e-mail KYRAN ; jamais de secret ni de `.env` commité.
- Le dépôt reste public (GitHub Pages gratuit).

## SEO & GEO : où tout trouver

Tout le référencement de kyran-jeu.fr (Google, Bing, moteurs de réponse IA) est suivi dans **[`_notes/seo/`](_notes/seo/README.md)**. Commencer par [`_notes/seo/README.md`](_notes/seo/README.md) (index du dossier), puis [`base-connaissances.md`](_notes/seo/base-connaissances.md) (état complet : jeu, offre, pages, mots-clés, technique, concurrents, mentions, GEO, règles) et [`backlog.md`](_notes/seo/backlog.md) (priorités). Chiffres jour par jour : [`kpi-quotidiens.csv`](_notes/seo/kpi-quotidiens.csv). Journal nuit après nuit : [`_notes/suivi-seo.md`](_notes/suivi-seo.md). Une routine Claude met tout à jour chaque nuit à minuit selon [`_notes/seo-routine-mission.md`](_notes/seo-routine-mission.md). Tableau partagé : https://claude.ai/code/artifact/5d4cf936-dfeb-4516-bb57-2141b081edee. Toute question ou tâche SEO/GEO (titres, descriptions, sitemap, `llms.txt`, indexation, netlinking, citations IA) part de ce dossier ; après la tâche, mettre à jour la base et le journal.
