# Leçons anti-récidive — KYRAN

Journal des causes de bugs de production et de leur correctif, pour ne pas les reproduire.
L'agent Auto-Heal (`scripts/auto-heal-worker.mjs`) le consulte avant chaque correctif et y ajoute
une entrée à chaque correctif déployé. Fonctionnement du pipeline : [`docs/AUTO-HEAL.md`](../docs/AUTO-HEAL.md).

Format : `### AAAA-MM-JJ — [Auto-Heal] <référence> — <résumé>` puis trois puces
**Symptôme**, **Cause**, **Correctif**. Entrées les plus récentes en haut.

<!-- auto-heal:entries -->

### 2026-10-05 — Blog : image de Coup sans rapport avec le jeu, As d'Or mal attribué

- **Symptôme :** sur neuf articles, la fiche de Coup montrait une planche ancienne « Loterie aux petites images — À tout coup l'on gagne ! » au lieu du jeu. L'article `jeux-cartes-adultes`, publié le 4 octobre sans relecture humaine, disait Skull « As d'Or 2011 ex aequo avec SOS Octopus » (SOS Octopus avait l'As d'Or Enfant) et Star Realms « conçu exclusivement pour un duel » ; une vérification adversariale y a confirmé 20 erreurs. La description JSON-LD de chaque jeu était coupée au 200ᵉ caractère, en plein mot.
- **Cause :** `scripts/download-blog-images.mjs` prenait, faute de fichier Commons nommé, le premier résultat d'une recherche Commons sur « coup card game box », et personne n'a regardé l'image. La passe automatique a vérifié ses sources mais pas chaque formulation, ni les images et crédits. Le générateur tronquait avec `slice(0, 200)`.
- **Correctif :** image de Coup retirée (la fiche s'affiche sans figure quand l'image manque), plus de repli sur une recherche Commons, crédits du logo Wizard corrigés, 14 phrases corrigées, descriptions JSON-LD coupées sur une fin de phrase (`clipText`). Règle : regarder chaque image de jeu avec l'outil de lecture avant publication, vérifier son crédit sur la page Commons, et faire relire chaque fait par un agent qui cherche à prouver l'erreur.

### 2026-10-04 — Fiches de jeux : liens BoardGameGeek vers d'autres jeux, liens Wikipédia morts

- **Symptôme :** sur les fiches du blog, « BoardGameGeek » ouvrait un autre jeu pour Skull (un numéro de magazine), Wizard (« Operation Ironfist »), Colt Express (« Star Fleet Battles »), Skyjo (« Creature Quest »), Dixit, Oh Hell!, Parade, Schotten Totten (« Fluxx »), Letter Jam et Monopoly Deal ; 22 liens Wikipédia renvoyaient 404 ou une page d'homonymie (dont 4 dans l'article rédigé à la main). La fiche affichait aussi « Auteur Magilano » (l'éditeur de Skyjo) et « Steven Du Vernet » pour Just One. Les mêmes URL alimentent le `sameAs` JSON-LD, qui associait donc ces jeux à d'autres œuvres.
- **Cause :** identifiants BGG et titres Wikipédia saisis de mémoire dans `scripts/lib/game-links.mjs`, jamais vérifiés (BGG choisit la page d'après l'identifiant et ignore le slug ; il renvoie 403 aux robots, ce qui masque l'erreur).
- **Correctif :** tous les liens revérifiés (#18 puis passe dédiée) : identifiant BGG contrôlé par `api.geekdo.com/api/geekitems?objectid=<id>` (nom et auteur), page Wikipédia prise dans les sitelinks Wikidata (français, sinon anglais) et contrôlée par `curl` (200, ni redirection ni homonymie) ; pas de clé `wiki` quand aucun article n'existe. Même correction dans l'article rédigé à la main `jeux-cartes-adultes`. Règle : ne jamais ajouter un lien de jeu sans avoir vérifié qu'il ouvre le bon jeu.

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
