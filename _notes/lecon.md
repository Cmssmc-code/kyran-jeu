# Leçons anti-récidive — KYRAN

Journal des causes de bugs de production et de leur correctif, pour ne pas les reproduire.
L'agent Auto-Heal (`scripts/auto-heal-worker.mjs`) le consulte avant chaque correctif et y ajoute
une entrée à chaque correctif déployé. Fonctionnement du pipeline : [`docs/AUTO-HEAL.md`](../docs/AUTO-HEAL.md).

Format : `### AAAA-MM-JJ — [Auto-Heal] <référence> — <résumé>` puis trois puces
**Symptôme**, **Cause**, **Correctif**. Entrées les plus récentes en haut.

<!-- auto-heal:entries -->

### 2026-10-04 — Fiches de jeux : liens BoardGameGeek vers d'autres jeux, liens Wikipédia morts

- **Symptôme :** sur les fiches du blog, « BoardGameGeek » ouvrait un autre jeu pour Skull (un numéro de magazine), Wizard (« Operation Ironfist ») et Colt Express (« Star Fleet Battles ») ; les liens Wikipédia de 6 qui prend !, For Sale, Skull et Saboteur renvoyaient 404. Les mêmes URL alimentent le `sameAs` JSON-LD, qui associait donc ces jeux à d'autres œuvres.
- **Cause :** identifiants BGG et titres Wikipédia saisis de mémoire dans `scripts/lib/game-links.mjs`, jamais vérifiés (BGG choisit la page d'après l'identifiant et ignore le slug ; il renvoie 403 aux robots, ce qui masque l'erreur).
- **Correctif :** liens des six jeux corrigés après vérification (`api.geekdo.com/api/geekitems?objectid=<id>` pour BGG, Wikidata P2339 et `curl` 200 pour Wikipédia). Règle : ne jamais ajouter un lien de jeu sans avoir vérifié qu'il ouvre le bon jeu ; les liens encore faux sont listés dans `docs/BLOG-PASSES.md`.

### 2026-10-04 — Search Console : articles non indexés, vidéos hors page de lecture

- **Symptôme :** une vingtaine d'articles « explorés / détectés, actuellement non indexés » ; 3 vidéos refusées (« la vidéo n'est pas sur une page de lecture ») ; `FAQPage` de l'accueil sans questions visibles.
- **Cause :** tous les articles générés partageaient le même gabarit (mêmes H2, 8 jeux, ~33 liens externes), plusieurs sujets se chevauchaient, et les vidéos n'étaient intégrées que dans des pages dont elles ne sont pas l'élément principal.
- **Correctif :** structure propre à chaque article (`layout`, `headings`, voir `scripts/content/README.md`), un seul lien externe par jeu, fusion des doublons (`roster.json` → `redirects`), page de lecture `/video-regles.html`, vidéos chargées au clic ailleurs, `FAQPage` retirée de l'accueil. Règles : ne jamais publier de données structurées pour un contenu invisible ; une vidéo à indexer a sa page dédiée ; un nouvel article ne reprend pas le gabarit par défaut (avertissement du validateur).

### 2026-10-03 — Dojo : cartes 3, 11, 20 et 27 affichées avec l'image d'une carte Pouvoir

- **Symptôme :** l'ancien Dojo montrait la carte Voile du Néant pour un 3, Clairvoyance pour un 11, Bénédiction pour un 20 et Sceau du Destin pour un 27 ; les fenêtres du nouveau Dojo s'ouvraient hors de l'écran sur mobile.
- **Cause :** `card-3/11/20/27.jpg` sont les illustrations des cartes Pouvoir de même valeur, pas des cartes Nombre. Par ailleurs, `style.css` pose `will-change: transform` sur `section > .container`, ce qui fait d'un élément `position: fixed` un enfant de ce conteneur, et `<main>` a `z-index: 1`.
- **Correctif :** ces quatre cartes Nombre sont recomposées à partir des vraies cartes (`dojo/img/nombre-3/11/20/27.jpg` : motif et chiffres d'autres cartes Nombre, recolorés) ; `dojo/dojo.css` annule `will-change` sur le conteneur du Dojo et `<main>` perd son `z-index` quand une fenêtre ou le plein écran est ouvert. Règle : ne jamais utiliser `card-N.jpg` pour N = 3, 11, 20, 27 comme carte Nombre ; tester tout élément fixé dans une section de page.

### 2026-10-03 — Emails KYRAN envoyés depuis une adresse Majordia

- **Symptôme :** emails clients, alertes de vente et rapport Auto-Heal partaient de `contact@majordia.fr` (seul domaine vérifié dans Resend).
- **Cause :** expéditeur par défaut `contact@majordia.fr` dans `server/server.js`, `worker/index.js` et `worker/wrangler.toml`.
- **Correctif :** `server/mailer.js` impose une adresse KYRAN (`@kyran-jeu.fr` ou `kyran.jeu@gmail.com`, sinon `contact@kyran-jeu.fr`) ; transport SMTP de la boîte (OVH / Gmail) via `SMTP_PASSWORD`, sinon Resend avec le domaine `kyran-jeu.fr` vérifié. Règle : **jamais** d'adresse d'un autre produit (Majordia) dans un email KYRAN.

### 2026-10-03 — Mise en place du pipeline Auto-Heal (portage de Majordia)

- **Besoin :** remonter automatiquement les erreurs de production du site et du serveur, et les corriger sans intervention humaine, comme sur Majordia (alertes `support@majordia.fr` → table `production_incidents` → passe horaire Claude).
- **Mise en place :** `error-reporter.js` (inséré dans chaque page par `scripts/apply-csp.mjs`) → `POST /api/client-error` sur le serveur Railway ; erreurs serveur (webhook Stripe, notification de vente, exceptions) consignées par `recordServerIncident` ; journal `server/incidents.js` sur le volume Railway `/data` ; workflow horaire `.github/workflows/auto-heal-hourly.yml` → `scripts/auto-heal-worker.mjs`.
- **Règles :** ne jamais envoyer un email par erreur : toujours passer par le journal d'incidents (agrégation) ; une fausse alerte se corrige par un filtre précis dans `isBenignClientError`, jamais en masquant une vraie panne ; une page générée se corrige dans sa source (`scripts/content/`, générateurs), jamais directement.
