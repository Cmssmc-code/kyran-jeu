# Mémoire projet : KYRAN

> Mémoire condensée du dépôt pour les agents (Claude Code, Cursor…), générée le 2026-10-07 à partir
> du dépôt lui-même. Elle résume, elle ne remplace pas : en cas d'écart, le code et les docs citées
> font foi. Mettez-la à jour quand un fait structurant change (routine, pipeline, prix, règle).

> Dépôt GitHub `Cmssmc-code/kyran-jeu`, branche `main`. Domaine : **kyran-jeu.fr** (fichier `CNAME`), aussi `www.kyran-jeu.fr`.
> Ce fichier ne contient aucun secret. Les valeurs sensibles vivent dans les secrets GitHub, les variables Railway et Cloudflare, ou un `.env` local ignoré par git.

## 1. Le jeu KYRAN (faits canoniques)

Sources : `scripts/content/README.md` § « faits canoniques », `llms.txt`, `/regle.html`.

- **Jeu de plis avec pari obligatoire.** Bluff et stratégie, **3 à 6 joueurs** (il **ne se joue pas à deux**), environ 30 min, dès 8 ans. Sous-titre : « Maître des Mystiques ».
- **Auteur et éditeur :** Corentin Sence, entrepreneur individuel sous le nom commercial Kyran (SIREN 840 817 548, RCS Nanterre, activité commencée le 10/09/2025). **Illustrations :** Crea by Floh. Édition française. Édition actuelle : 2026.
- **Sortie : 31 janvier 2026.** Date confirmée par l'éditeur ; le Ludochrono de Ludovox est paru le même jour. Ne jamais écrire « février 2026 » ni « 2024 ».
- **Matériel :**
  - 36 cartes Nombre (1 à 36), 1 carte Mystique et 8 cartes Pouvoir, soit 45 cartes de jeu ;
  - 30 cartes Vie (5 par joueur, de 1 à 5 étoiles) et **7 cartes de règles** ;
  - cartes toilées, boîte rigide.
  - Ne jamais écrire « 55 cartes » : la mention a été retirée partout.
- **Manche :** chacun annonce le nombre exact de plis qu'il va gagner. **La somme des paris ne peut jamais égaler le nombre de plis** : le dernier à parler ne peut pas « boucler ». Au moins un joueur se trompe donc à chaque manche.
- **Pari raté :** le joueur perd autant de Vies que l'écart entre son pari et ses plis. Pari juste : il ne perd rien.
- **Suite des manches :** 7, 6, 5, 4, 3 puis 2 cartes, puis une **manche Mystique** à 1 carte posée sur le front (on voit les cartes des autres, pas la sienne ; on parie 0 ou 1). Le cycle repart ensuite à 7.
- **Fin de partie :** dès qu'un joueur n'a plus de Vies. Celui qui a le plus de Vies gagne.
- **Cartes Pouvoir** (chacune a deux valeurs) :
  - Sceau du Destin 27/4 : force un joueur à jouer une carte tirée au hasard dans sa main.
  - Clairvoyance Antique 11/23 : regarder en secret la plus forte carte d'un joueur.
  - Bénédiction des Ancêtres 20/9 : un joueur joue tout de suite sa plus faible carte.
  - Voile du Néant 3/34 : échanger la valeur de sa carte avec une carte déjà posée ce tour.
  - La Mystique vaut 0 ou 37 au choix.
  - À 3 ou 4 joueurs : 4 Pouvoirs + la Mystique. À 5 ou 6 : toutes les cartes.
  - Variante d'initiation : sans Pouvoirs ni Mystique.
- **Prix :** 9,99 € sur kyran-jeu.fr (`/commander.html`, Stripe Payment Link), 17,99 € sur Amazon.fr (ASIN B0G217LD87), 9,99 € + 2,99 € de port sur Etsy (boutique KyranJeu). `priceValidUntil` vaut 2026-12-31 dans le JSON-LD : **à renouveler avant cette date**.
- **Livraison :** France métropolitaine, Belgique, Luxembourg, Allemagne, Suisse, Italie, Espagne, Monaco, Andorre, Royaume-Uni. Retours gratuits sous 14 jours (`FreeReturn`).
- **Héritage :** Tarot Africain / Whist 22 (pages `/tarot-africain.html`, `/whist-22.html`, `/tarot-africain-a-3-joueurs.html`).
- **Interdits rédactionnels :** ne jamais écrire que KYRAN est « sans élimination » (le premier joueur à zéro Vie termine la partie) ni « sans hasard ». Ne jamais inventer de pouvoir.
- **Présence externe :**
  - Instagram @kyran.jeu, YouTube @Kyran-jeu ;
  - BoardGamesFlix, Ludochrono (Ludovox), Le Pirate Ludique ;
  - aucune fiche sur BoardGameGeek, Tric Trac ni Wikidata (reste à créer).

## 2. Architecture du site (statique, GitHub Pages)

- **Pages HTML à la racine** : `index.html`, `regle.html`, `commander.html`, `merci.html`, `faq.html`, `a-propos.html`, `dossier-presse.html`, `jeu-apero.html`, `tarot-africain*.html`, `whist-22.html`, `video-regles.html` (page de lecture de la vidéo Ludochrono), `minijeu.html`, `communaute.html`, `plan-du-site.html`, `cgv.html`, `mentions-legales.html`, `confidentialite.html`, `404.html` et `admin-emails.html` + `admin-emails.js` (interface d'administration des emails, protégée par `ADMIN_SECRET`).
- **Anciennes URL** : `alternative-skyjo.html`, `comparatif-jeux-plis.html` et `whist-moderne.html` sont de petites pages de redirection.
- **`components.js`** : Web Components rendus en HTML statique par `scripts/prerender.mjs`.
  - `<kyran-header>`, `-footer`, `-breadcrumb`, `-page-hero`, `-discover-grid`, `-blog-grid`, `-blog-filters`, `-related-articles`, `-stat-bar`, `-cta-band`.
  - Contient aussi les URL Amazon, Stripe et Instagram, et la table `ACTIVE_BY_PATH` (onglet actif du menu).
- **Autres scripts côté navigateur :**
  - `blog.js` et `blog-data.js` (données générées) ;
  - `reviews.js`, `reviews-data.json` et `reviews-data.js` (avis Amazon) ;
  - `hero-visual.js`, `error-reporter.js`, `style.css`, `css/`, `fonts/`, `vendor/` (canvas-confetti).
- **`seo-config.js`** : `ASSET_VERSION` (posé par le build) ; `googleSiteVerification`, `bingSiteVerification` et `ga4MeasurementId` sont vides. GA4 est désactivé : RGPD, il faudrait un bandeau de consentement.
- **`seo-keywords.json`** : clusters de requêtes cibles par page (primaires et secondaires) et KPI. Mis à jour le 2026-10-04.
- **Fichiers SEO et IA générés** : `sitemap.xml`, `llms.txt`, `llms-full.txt`, `robots.txt`, `blog/feed.xml`.
- **Autres fichiers SEO :** `google-merchant-feed.xml` / `.tsv`, `BingSiteAuth.xml`, la clé IndexNow (`<clé>.txt` à la racine, publique), `NETLINKING_ANNUAIRES.md`.
- **Blog** : `blog/<slug>.html` généré, `blog/index.html`, `blog/images/` (dont `parties/` pour les photos réelles).

### Génération : `npm run build` (`scripts/build.mjs`)

Le build est déterministe : la CI vérifie qu'il ne produit aucun diff. **Toujours commiter le résultat du build.** Étapes, dans l'ordre :

1. `generate-blog.mjs` : `scripts/content/blog/<slug>.mjs` → `blog/<slug>.html`.
2. `generate-redirects.mjs` : pages `meta refresh` + canonique, d'après `roster.json` → `redirects` (GitHub Pages ne sait pas faire de 301).
3. `generate-blog-infra.mjs` : `blog-data.js`, `blog/feed.xml`, `blog/index.html`.
4. `generate-community.mjs` : `communaute.html`, à partir de `scripts/content/communaute.json` et `communaute-reglages.json`.
5. `generate-seo.mjs` : sitemap, `llms*.txt`, plan du site, version des assets.
6. `prerender.mjs` : HTML statique des composants et des avis.
7. `stamp-dojo.mjs` : `?v=` des modules de `dojo/`.
8. `apply-csp.mjs` : balises CSP et referrer, insertion de `error-reporter.js`.

- Dates : `scripts/lastmod-manifest.json` alimente `<lastmod>` et `dateModified`. **Ne pas l'éditer à la main.** La date ne change que si le contenu utile de la page change.
- `SITE_TODAY` ne doit jamais être une date future : `check-site` refuse un lastmod futur.
- Bibliothèques : `scripts/lib/` (`article-model`, `asset-version`, `community`, `game-links` (liens BGG et Wikipédia des jeux), `image-size`, `items`, `lastmod`, `site-urls`).

### Contenu du blog : `scripts/content/`

- **`roster.json`**
  - `generated` : 29 slugs (jeux-comme-skyjo, alternatives-wizard, jeux-plis-comparatif, jeux-bluff-pari, meilleurs-jeux-apero, cadeau-noel, jeux-3-joueurs, jeux-cartes-6-joueurs, jeux-cartes-adultes, etc.).
  - `handwritten` : `science-jeux-de-cartes-cerveau` (texte dans `handwritten.json`).
  - `redirects` : fusions, par exemple `jeux-cartes-5-joueurs` → `jeux-cartes-6-joueurs`, `jeux-brise-glace-afterwork` → `meilleurs-jeux-apero`, `jeux-cartes-pas-chers` → `cadeau-anniversaire`, `guide-jeux-de-plis` → `jeux-plis-comparatif`. **Ne jamais lier vers un slug fusionné.**
- **`games.json`** : faits des jeux tiers (`name`, `players`, `duration`, `age`, `price`, `image`, `designer`, `year`). Les articles ne recopient pas ces faits.
  - Changer un prix ici modifie tous les articles : faire d'abord un `grep` dans `scripts/content/blog/`.
  - Écarts connus non corrigés (voir BLOG-PASSES) : Codenames, Dixit, Coup, 6 qui prend !, Timeline, Oh Hell!, The Crew.
- **`README.md`** : modèle d'article et règles de rédaction.
  - Champs du modèle : `slug`, `title`, `shortTitle` (32 caractères max), `metaTitle` (40 à 65), `description` (110 à 160), `category`, `date`, `hero*`, `intro`, `criteria` (300 mots min.), `games` (5 à 10), `verdict`, `conclusion`, `faq` (4 à 6), `related` (3 slugs).
  - Structure propre à chaque article : `layout` (`answerFirst`, `criteriaAfter`, `compare`, `numbered`, `summaryBox`, `shopLinks`, `groups`) et `headings`.
  - Contenu de première main : `authorNote` (avec la date `provided` obligatoire) et `photos`.
- **Règles de rédaction :**
  - aucun paragraphe ni phrase longue commune à deux articles ;
  - un seul lien externe par jeu ;
  - au moins 3 liens internes `class="text-link"` ;
  - pas de tutoiement, pas d'emoji ;
  - pas de chiffres ni d'anecdotes inventés ;
  - pas de `<h1>`/`<h2>` dans les champs HTML, ni de style en ligne, ni de script.
- **Autres fichiers :** `briefs.json`, `communaute*.json`, `instagram-jeton.json` (date et âge du jeton, pas sa valeur).

## 3. `server/` : webhook Node sur Railway

Projet Railway `kyran-webhook`, URL publique `https://kyran-webhook-production.up.railway.app` (variable de dépôt GitHub `KYRAN_API_URL`). Serveur `http` natif, sans dépendance. Railway redéploie tout seul à chaque push sur `main`.

**Fichiers**

- `server.js` (environ 740 lignes) : routes, vérification de la signature Stripe (tolérance 300 s, corps brut, 1 Mo max), CORS, en-têtes de sécurité.
- `mailer.js` : expéditeur forcé sur une adresse KYRAN. Transport Resend si `RESEND_API_KEY`, sinon SMTP (`SMTP_PASSWORD` ; OVH `ssl0.ovh.net` ou `smtp.gmail.com`). Railway bloque le SMTP sortant hors offre Pro.
- `templates.js` : emails de commande, de remboursement, d'expédition, de message personnalisé et d'alerte de vente à l'administrateur.
- `incidents.js` : `IncidentStore` et `isBenignClientError`.
- `githubOidc.js` : vérification du jeton OIDC GitHub.
- `autoHealReport.js` : rapport sur 24 h.
- Tests : `server/test/{auto-heal,mailer,security}.test.mjs`.

**Routes**

| Route | Rôle |
|---|---|
| `GET /`, `GET /health` | État du service, sans donnée sensible |
| `POST /webhook` (ou `POST /`) | Webhook Stripe : `checkout.session.completed` (email au client + alerte de vente à l'admin), `charge.refunded` (email de remboursement + alerte) |
| `POST /api/shipping` | Email d'expédition (numéro de suivi La Poste), admin seulement |
| `POST /api/send-custom-email` (`/api/custom-email`) | Message personnalisé, admin seulement |
| `POST /api/client-error` | Public : origines `ALLOWED_ORIGINS`, 20 requêtes/h/IP, 16 Ko max |
| `GET /api/auto-heal/incidents?limit=N` | Incidents en attente + quota (auth OIDC) |
| `POST /api/auto-heal/incidents/{resolve,fail,ignore}` | Changement de statut d'un incident |
| `GET`/`POST /api/auto-heal/daily-report` | Rapport email (08 h UTC, au plus une fois par 20 h, seulement si le système a agi) |
| `POST /api/auto-heal/test-email` | Email de test |

- Routes d'administration : en-tête lié à `ADMIN_SECRET`. Sans secret d'au moins 32 caractères, elles sont **désactivées** (fail closed).
- Auth Auto-Heal : jeton OIDC GitHub, audience `kyran-auto-heal`, dépôt `Cmssmc-code/kyran-jeu`. Repli manuel : en-tête `X-Cron-Secret` (`CRON_SECRET`, 32 caractères min.).
- Logs Railway : préfixe `[AutoHeal]`.

## 4. `worker/` : Cloudflare Worker (variante)

- `worker/index.js`, `templates.js`, `wrangler.toml` (nom `kyran-stripe-webhook`). Variables non sensibles : `SENDER_EMAIL=contact@kyran-jeu.fr`, `SENDER_NAME`, `REPLY_TO_EMAIL`, `SITE_URL`.
- Mêmes rôles que le serveur Railway, avec Resend :
  - `GET /` ou `/health` ;
  - `POST /api/shipping` ;
  - `POST /` ou `/webhook` pour `checkout.session.completed` et `charge.refunded`.
- Documentation : `worker/README.md` (reçus Stripe natifs, déploiement `npx wrangler deploy`). Branchement du webhook Stripe avec `scripts/setup-stripe-webhook.mjs create <url>`.
- Test : `worker/test/security.test.mjs`. Secrets du Worker posés par `wrangler secret` ou `.dev.vars` (ignoré par git).

## 5. `dojo/` : Initiation (`minijeu.html`, anciennement « Dojo »)

- Modules ES :
  - `engine.js` : règles officielles, sans DOM ;
  - `ai.js` : adversaires (personas Griot, Amazone, Caméléon, Anansi, Guérisseuse ; niveaux comme `adepte`) et conseils du **Bokonon** (devin du Fa) ;
  - `lessons.js` : **sept rites** du « collier d'initié » (Le pli, Le pari, La règle d'or, La carte Mystique, Les cartes Pouvoir, La manche Mystique, L'épreuve des Anciens) ;
  - `app.js` (interface) et `dojo.css`.
- Images : `dojo/img/` (avatars, `bokonon.jpg`, `nombre-3/11/20/27.jpg`).
- **Ne jamais utiliser `card-3/11/20/27.jpg` comme carte Nombre** : ce sont les illustrations des cartes Pouvoir de même valeur.
- Tests : `scripts/test/dojo.test.mjs`. Les `?v=` sont posés par `scripts/stamp-dojo.mjs`.

## 6. Scripts npm (`package.json`, ESM, devDeps : `@anthropic-ai/sdk`, `cheerio`)

**Build et génération**

- `build` (ou `generate:blog`) : build complet.
- `prerender`, `generate:seo`, `apply:csp`, `indexnow`.

**Tests et contrôles**

- `test` enchaîne `check:jsonld`, `validate:blog`, `check:site`, `check:duplicates`, `test:unit` et `test:security`.
  - `validate:blog` : `validate-articles.mjs [slug]`.
  - `check:site` : canoniques, liens internes, sitemap, redirections, `robots.txt`, `llms.txt`.
  - `check:duplicates` : recouvrement entre pages publiées, erreur au-delà de 20 %.
  - `test:unit` : `node --test scripts/test/*.test.mjs` (article-model, auto-heal-worker, community, dojo).
  - `test:security` : tests de `server/` et `worker/`.
- `test:seo` : `audit-seo.mjs`.
- Node 22 est requis pour les globs de `node --test`.

**Images et données**

- `optimize:images` (WebP), `images:blog`, `images:blog:fix`.
- `fetch:reviews`, `fetch:instagram`.

**Emails**

- `preview:emails`, `send:test-email`, `pitch:presse` (`scripts/send-press-pitch.mjs` + `presse-outreach.json`).
- Autres scripts : `send-client-email`, `send-shipping-email`, `send-mail-ovh`, `test-smtp`.

## 7. Workflows CI (`.github/workflows/`)

Toutes les actions sont épinglées sur un SHA de commit.

| Fichier | Déclencheur | Rôle |
|---|---|---|
| `ci.yml` (« Contrôles du site ») | PR, push sur `main`, manuel | JSON-LD, validation du blog, `check:site`, doublons, **build à jour** (`git diff --exit-code`, sauf `lastmod-manifest.json`), tests unitaires et de sécurité (Node 22) |
| `pages.yml` | push sur `main`, manuel | Ne publie que les fichiers publics. Exclus : `scripts/`, `server/`, `worker/`, `.github/`, `*.md`, `package*.json`, `.env.example`, `seo-keywords.json`. Ne fait rien si Pages n'est pas en mode « GitHub Actions » (le site est alors servi depuis la branche) |
| `indexnow.yml` | push sur `main` (pages modifiées), manuel (`all` : tout le sitemap) | Notifie Bing et Copilot via `scripts/indexnow.mjs --wait` |
| `instagram.yml` | cron `17 5 * * *` (vers 7 h, heure de Paris), manuel | Voir détail ci-dessous |
| `update-reviews.yml` | **manuel seulement** (cron désactivé : captchas Amazon) | `fetch-amazon-reviews.mjs` puis `prerender`, commit des avis, relance de Pages |
| `auto-heal-hourly.yml` | cron `17 * * * *`, manuel (`dry_run`, `smoke_test`, `test_email`) | Pipeline Auto-Heal (section 8) |

Détail d'`instagram.yml` :

- `scripts/instagram-token.mjs` vérifie l'âge du jeton et le renouvelle (avec `GH_SECRETS_TOKEN`).
- `fetch-instagram.mjs`, puis build, commit `[skip ci]`, relance de Pages et IndexNow.
- Ouvre l'issue « Synchronisation Instagram : action requise » si le jeton expire bientôt ou si la synchronisation échoue.
- Si le secret Instagram est absent, le workflow s'arrête sans rien modifier.

Les pushs faits avec `GITHUB_TOKEN` ne déclenchent aucun autre workflow. Il faut relancer explicitement `gh workflow run pages.yml` (et `ci.yml`).

## 8. Pipeline Auto-Heal (`docs/AUTO-HEAL.md`, porté depuis Majordia)

1. **Remontée des erreurs.**
   - Navigateur : `error-reporter.js` capte les erreurs JS, les promesses rejetées et les ressources introuvables (5 rapports max par page, uniquement sur kyran-jeu.fr, `sendBeacon` en text/plain) et les envoie à `POST /api/client-error`.
   - Serveur : `recordServerIncident` sur un événement Stripe qui échoue (500), une notification de vente qui échoue, une exception de route, `uncaughtException` et `unhandledRejection`.
2. **Filtre des fausses alertes** : `isBenignClientError` (robots, extensions, scripts tiers, « Script error. », coupures réseau, vidéo bloquée).
3. **Journal** : `server/incidents.js`, fichier JSON sur le volume Railway `/data` (`INCIDENTS_FILE`, sinon `./data/incidents.json`), écriture atomique.
   - Empreintes : `client|code|message|fichier` ou `api|code|chemin|statut`. Références `JS-XXXXXX` / `SRV-XXXXXX`.
   - Statuts : `pending` → `auto_fixed` | `ignored` | `failed` (après 3 tentatives).
   - Quota : 30 correctifs par 24 h. Rétention : 30 jours, 500 incidents.
   - Rattachement à un incident existant s'il est en attente, ou ignoré/abandonné depuis moins de 7 jours, ou corrigé depuis moins de 6 h.
4. **Workflow horaire**
   - Job `check` : 0 token consommé, sortie rapide. Il envoie aussi le rapport quotidien à 08 h UTC.
   - Job `heal` : lance `scripts/auto-heal-worker.mjs`.
   - Paramètres : modèle et effort fixés dans le workflow (`ANTHROPIC_MODEL`, `AUTO_HEAL_EFFORT`), 5 incidents max.
   - Auth Anthropic : Workload Identity Federation (OIDC). Repli : secret `ANTHROPIC_API_KEY`.
5. **Agent** : outils `read_file`, `list_dir`, `search_code`, `edit_file`, `run_checks`.
   - Chemins interdits : CI, `package*.json`, `.env`, auth Auto-Heal, `_notes/`, `vendor/`, `CNAME`.
   - Secrets et emails masqués dans le prompt ; `execFileSync` partout.
   - Avant tout push : `npm run build` puis `npm test`. En cas d'échec : `git reset --hard origin/main` et incident marqué `failed`.
   - Commits signés de l'auteur `auto-heal@kyran-jeu.fr`. Chaque correctif ajoute une entrée dans `_notes/lecon.md`.
6. **Après un push** : relance de `ci.yml` et `pages.yml`. Railway redéploie tout seul. Secret facultatif `AUTO_HEAL_PUSH_TOKEN` si `main` est protégée.
7. **Rapport 24 h** : envoyé depuis `contact@kyran-jeu.fr` à `AUTO_HEAL_REPORT_EMAILS` (sinon `ADMIN_NOTIFICATION_EMAILS`), seulement si le système a agi.

## 9. `docs/` : points clés

- **`docs/SEO-GEO.md`** : construction du site, ajout d'un article, dates, IndexNow, CI, page Communauté.
  - § 7 : à faire à la main (Search Console, Bing, netlinking BGG/Tric Trac/Wikidata, Merchant Center, YouTube).
  - § 8 : décisions du propriétaire, tranchées le 2 octobre 2026 (cartes, retours, livraison, prix, Kbis, date de sortie) ; points ouverts (fiches externes, origine du Tarot Africain, fabrication, photo pour « À propos »).
- **§ 9 (audit Search Console du 4 octobre 2026)** : ce sont les données réelles de référence.
  - Constat : 25 pages indexées, 37 non indexées (une vingtaine d'articles « explorés/détectés, non indexés »), 3 vidéos refusées (« pas sur une page de lecture »).
  - Cause probable : un gabarit identique sur tous les articles (mêmes H2, 8 jeux, ~33 liens externes).
  - Correctifs :
    - P1 : structure propre à chaque article, environ 10 liens externes au lieu de 28 ;
    - P2 : fusions d'articles ;
    - P3 : maillage interne ;
    - P4 : page `/video-regles.html`, vidéos chargées au clic ailleurs ;
    - P5 : `FAQPage` retirée de l'accueil.
  - Ordre des demandes d'indexation : jours 1, 2 et 3.
  - Reste à fournir : photos réelles de parties, retours de test chiffrés, `authorNote` signé.
- **`docs/BLOG-PASSES.md`** : trois passes automatiques par semaine (lundi, mercredi, vendredi, réveil à 6 h 50 heure de Paris), publication visée à 9 h 30.
  - Chaque passe produit 1 article neuf, 1 rafraîchissement, ou rien.
  - **Fusion automatique sans relecture humaine** (choix du propriétaire, 4 octobre 2026) si : CI verte, aucun conflit, aucun commentaire de relecture ouvert, chaque fait incertain sourcé ou retiré.
  - Protocole :
    1. S'orienter : `CLAUDE.md`, `lecon.md`, SEO-GEO § 9, `README.md` du contenu, `roster.json`, `seo-keywords.json`, PR ouvertes.
    2. `git fetch` avant d'écrire et avant de pousser (deux sessions peuvent travailler sur le même article).
    3. Choisir un sujet : données réelles d'abord.
    4. Au moins 5 sources fiables réellement ouvertes ; les faits KYRAN viennent uniquement du dépôt.
    5. Rédiger au format `.mjs`, sans jamais éditer le HTML généré.
    6. Relecture adversariale, liens (200), validation, build, tests.
    7. PR : sources, images (crédit et licence), « À vérifier ».
    8. Vérifier la page en ligne.
  - Le journal et la liste « En attente » se mettent à jour dans la PR de la passe.
  - BGG renvoie 403 aux robots : vérifier un identifiant avec `api.geekdo.com/api/geekitems?objectid=<id>`.
  - Sujets déjà pris, à ne pas reprendre : `jeux-cartes-adultes`, `alternatives-uno`, et les 4 articles corrigés le 2026-10-07.
- **`docs/INSTAGRAM.md`** : la page `/communaute.html` héberge les médias Instagram crédités (`📸 @pseudo`). Ce choix est meilleur pour le SEO et le RGPD qu'une intégration.
  - Les collaborations créées par un joueur ne remontent pas par l'API : il faut les ajouter à la liste `manual` de `communaute-reglages.json`.
  - L'app Meta « KYRAN site » utilise l'API Instagram Login (`instagram_business_basic`).
  - Le jeton se renouvelle tous les 30 jours.

## 10. Règles de `CLAUDE.md`

- Après toute modification de pages, de composants ou de contenu : `npm run build`, puis `npm test`, puis commiter les fichiers générés.
- **Style de réponse « caveman »** dans le chat avec l'utilisateur : phrases courtes, mots simples. Le code, les commits, les PR, la documentation et les fichiers restent écrits normalement.
- Bug de production :
  1. lire `_notes/lecon.md` ;
  2. lire l'historique du workflow « Hourly Auto-Heal » ;
  3. lire les logs Railway (`[AutoHeal]`).
- Une fausse alerte se corrige par un filtre précis dans `isBenignClientError`, jamais en masquant une vraie panne.
- Une page générée se corrige dans sa source (`scripts/content/`, générateurs), jamais directement.

## 11. `_notes/lecon.md` : leçons anti-récidive (les plus récentes d'abord)

- **2026-10-05.** Image de Coup sans rapport avec le jeu (planche de loterie), As d'Or de Skull mal attribué, 20 erreurs dans `jeux-cartes-adultes`, JSON-LD coupé au 200ᵉ caractère.
  - Règles : regarder chaque image avant publication ; vérifier le crédit sur Commons ; pas de repli sur une recherche Commons ; `clipText` coupe sur une fin de phrase ; relecture adversariale de chaque fait.
- **2026-10-04.** Liens BGG et Wikipédia de `scripts/lib/game-links.mjs` saisis de mémoire : ils ouvraient d'autres jeux ou des 404, ce qui polluait aussi `sameAs`.
  - Règles : vérifier un identifiant BGG avec l'API geekdo ; prendre la page Wikipédia dans les sitelinks Wikidata, puis contrôler avec `curl`.
- **2026-10-04.** Articles non indexés à cause du gabarit identique ; vidéos hors page de lecture ; `FAQPage` sans questions visibles.
  - Règles : structure propre à chaque article ; une vidéo à indexer a sa page dédiée ; pas de données structurées pour un contenu invisible.
- **2026-10-03.** Dojo : `card-3/11/20/27` sont des cartes Pouvoir, recomposées en cartes Nombre dans `dojo/img`. Le `will-change: transform` de `style.css` cassait les éléments `position: fixed` ; le `z-index` de `<main>` aussi.
- **2026-10-03.** Les emails KYRAN partaient de `contact@majordia.fr`. Règle : **jamais** l'adresse d'un autre produit. `mailer.js` impose `@kyran-jeu.fr` ou `kyran.jeu@gmail.com`.
- **2026-10-03.** Mise en place de l'Auto-Heal. Règles : toujours passer par le journal d'incidents, jamais d'email d'erreur direct ; filtre précis dans `isBenignClientError` ; corriger dans la source, pas dans la page générée.

## 12. Variables d'environnement (noms seulement)

- **Serveur et Worker :**
  - Stripe : `STRIPE_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY` (clé restreinte `rk_` conseillée), `STRIPE_PUBLIC_KEY`, `STRIPE_PAYMENT_LINK`.
  - Administration et réseau : `ADMIN_SECRET` (32 caractères min.), `ALLOWED_ORIGINS`, `ADMIN_NOTIFICATION_EMAILS`, `PORT`, `NODE_ENV`.
  - Auto-Heal : `AUTO_HEAL_REPORT_EMAILS`, `AUTO_HEAL_REPOSITORY`, `CRON_SECRET`, `INCIDENTS_FILE`.
  - Emails : `SENDER_EMAIL`, `SENDER_NAME`, `REPLY_TO_EMAIL`, `SITE_URL`, `RESEND_API_KEY`, `SMTP_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `EMAIL_TRANSPORT`, `OVH_SMTP_PASSWORD`, `OVH_MAIL_PASSWORD`.
- **Scripts :** `KYRAN_WEBHOOK_URL`, `SITE_TODAY`, `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, `INSTAGRAM_ROTATION_FILE`.
- **Auto-Heal (GitHub) :**
  - `ANTHROPIC_API_KEY` (repli) ;
  - variables de dépôt surchargeables : `ANTHROPIC_FEDERATION_RULE_ID`, `ANTHROPIC_SERVICE_ACCOUNT_ID`, `ANTHROPIC_WORKSPACE_ID` ;
  - variables fixées par le workflow : `ANTHROPIC_ORGANIZATION_ID`, `ANTHROPIC_MODEL`, `AUTO_HEAL_EFFORT`, `AUTO_HEAL_MAX_INCIDENTS`, `AUTO_HEAL_MAX_ITERATIONS`, `AUTO_HEAL_FALLBACKS`, `AUTO_HEAL_BRANCH`, `AUTO_HEAL_DRY_RUN`, `AUTO_HEAL_SMOKE`, `API_PUBLIC_URL`, `KYRAN_API_URL`.
- **Secrets GitHub :** `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, `GH_SECRETS_TOKEN`, `AUTO_HEAL_PUSH_TOKEN`, `ANTHROPIC_API_KEY`.
- Le modèle est dans `.env.example` : public, sans valeur secrète. Le vrai `.env` est ignoré par git.

## 13. Domaines, adresses et services

- **Site :** `kyran-jeu.fr` (+ `www`), hébergé sur GitHub Pages.
- **API :** `kyran-webhook-production.up.railway.app` (Railway, volume `/data`).
- **Worker :** `kyran-stripe-webhook` sur `*.workers.dev`.
- **Emails :** contact `contact@kyran-jeu.fr` ; Gmail `kyran.jeu@gmail.com` (destinataire du rapport Auto-Heal) ; commits de l'agent `auto-heal@kyran-jeu.fr`.
- **Services tiers :** Stripe (Payment Link `buy.stripe.com`), Resend, SMTP OVH, Amazon.fr, Etsy, Instagram @kyran.jeu, YouTube @Kyran-jeu, Ludovox (Ludochrono).
- **Projet frère :** Majordia, source du pipeline Auto-Heal. Ne jamais mélanger les adresses des deux produits.

## 14. Routines Claude Code (tâches planifiées)

Routines du compte du propriétaire (claude.ai → Routines). Chaque déclenchement ouvre une session
cloud neuve qui clone le dépôt elle-même (`add_repo`) si besoin.

| Routine | Planification | Rôle |
|---|---|---|
| « Blog KYRAN passes lun/mer/ven » (`trig_01Bx6MzhsHYAea6mEMstNjSs`) | `CRON_TZ=Europe/Paris 50 6 * * 1,3,5` | Suit `docs/BLOG-PASSES.md` : un article neuf, un rafraîchissement ou rien ; PR puis fusion automatique si CI verte, aucun conflit, aucun commentaire ouvert |
| « Blog Majordia quotidien » (`trig_016HyCXEDoFKD9uBLFXbq2xt`) | `CRON_TZ=Europe/Paris 53 2 * * *` | Dépôt frère Majordia : suit `_notes/blog-routine-mission.md` de ce dépôt |

Recréées le 2026-10-07 d'après la documentation des dépôts. Les routines créées par un agent ne
portent pas de connecteurs : si les outils `mcp__github__*` manquent dans une passe, la passe pousse sa
branche et documente le blocage plutôt que de fusionner à l'aveugle.

Workflows GitHub planifiés (indépendants des routines) : `auto-heal-hourly.yml` (`17 * * * *`) et
`instagram.yml` (`17 5 * * *`), voir § 7.
