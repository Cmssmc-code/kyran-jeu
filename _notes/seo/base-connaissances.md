# Base de connaissances SEO & GEO : KYRAN

> Condensé tenu par la routine SEO nocturne (`_notes/seo-routine-mission.md`). Chaque run corrige ce qui a
> changé (ligne datée), sans empiler : moins de 400 lignes. En cas d'écart, `_notes/memoire.md` § 1 (faits
> canoniques), `_notes/lecon.md`, le code et les API font foi. Version lisible et partagée : doc « KYRAN —
> Pilotage SEO & GEO » (https://claude.ai/code/artifact/5d4cf936-dfeb-4516-bb57-2141b081edee).
>
> État initial : 2026-10-19 (inventaire du dépôt, API Search Console et Bing, relevé web).

## 1. Le jeu et l'offre (faits canoniques, `_notes/memoire.md` § 1)

| Sujet | Fait |
|---|---|
| Jeu | KYRAN, « Maître des Mystiques » : jeu de plis avec pari exact obligatoire, bluff ; 3 à 6 joueurs (pas à 2), ~30 min, dès 8 ans ; sorti le 31/01/2026 |
| Règle | Chacun annonce son nombre exact de plis ; la somme des paris ne peut pas égaler le nombre de plis ; un pari raté coûte autant de Vies que l'écart ; manches de 7, 6, 5, 4, 3, 2 cartes puis manche Mystique à 1 carte sur le front ; fin quand un joueur n'a plus de Vies |
| Matériel | 36 cartes Nombre, 1 Mystique (0 ou 37), 8 Pouvoir (Sceau du Destin 27/4, Clairvoyance Antique 11/23, Bénédiction des Ancêtres 20/9, Voile du Néant 3/34), 30 cartes Vie, 7 cartes de règles ; boîte 11,5 × 8,5 × 2,8 cm, 175 g |
| Auteur | Corentin Sence (auteur et éditeur, EI) ; illustrations Crea by Floh |
| Vente | Lien Stripe 9,99 € + 2,99 € de port ; Amazon 17,99 € (ASIN B0G217LD87, 4,7/5 sur 33 avis au 19/10) ; Etsy 9,99 € + 2,99 € ; livraison FR, BE, LU, CH, MC ; GTIN 3770040368015 |
| Interdits | « 55 cartes », « février 2026 », « 2024 », « sans élimination », « sans hasard », « jeu primé », chiffres de ventes ; prix barré trompeur ; jamais d'adresse Majordia |

## 2. Le site

- `https://kyran-jeu.fr` (www et http en 301), GitHub Pages + Fastly (`cache-control: max-age=600`) ; dépôt
  **public obligatoire**. Pas de 301 possible : 16 pages en `meta refresh` + canonical.
- Mono-langue (`hreflang` fr-FR + x-default). 74 pages HTML : 50 indexables (17 pages + 33 articles), 8 en
  `noindex` (légal, merci, 404, plan du site, version imprimable), 16 redirections.
- Build `npm run build` (`scripts/build.mjs`, 9 étapes : blog, redirections, infra du blog, communauté, SEO
  (sitemap, `llms*.txt`, plan du site, `dateModified`, `?v=`), flux Merchant, prerender, stamp-dojo, CSP).
- Registres : `scripts/lib/site-urls.mjs` (pages), `scripts/content/roster.json` (articles, redirections),
  `scripts/lastmod-manifest.json` (dates, jamais à la main), `seo-keywords.json` (39 clusters, mis à jour le 04/10).
- CI « Contrôles du site » (`ci.yml`) : JSON-LD, validation du blog, `check:site`, doublons, build à jour, tests.
  IndexNow à chaque push (`indexnow.yml`). Workflow `pages.yml` publie ; un push par `GITHUB_TOKEN` ne le
  déclenche pas.
- Aucune mesure d'audience (GA4 vide, choix RGPD).

| Élément | Fichier |
|---|---|
| Titres, méta, JSON-LD des pages racine | les `.html` racine (zones hors `data-ssr`) |
| Articles | `scripts/content/blog/<slug>.mjs` (+ `roster.json`, `games.json`, `handwritten.json`) |
| Sitemap, `llms.txt`, `llms-full.txt`, plan du site | `scripts/generate-seo.mjs` |
| Navigation et pied de page | `components.js` |
| Produit (prix, port) | `scripts/lib/product.mjs`, `commander.html` (hors périmètre) |
| Contrôles | `npm run check:site`, `check:jsonld`, `test:seo` (`scripts/audit-seo.mjs`), `check:duplicates`, `validate:blog` |

## 3. Pages clés et mots-clés (28 jours au 17/10/2026)

| Page | Requête cible | Clics / impr. | Position |
|---|---|---|---|
| `/tarot-africain.html` | tarot africain, règle tarot africain | 22 / 1 742 | 7,3 |
| `/blog/jeux-comme-skyjo.html` | alternative skyjo | 12 / 665 | 8,9 |
| `/blog/jeux-comme-dixit.html` | alternative dixit | 17 / 395 | 6,2 |
| `/blog/jeux-comme-codenames.html` | alternative codenames | 7 / 390 | 6,1 |
| `/blog/jeux-soiree-amis.html` | jeu soirée amis | 2 / 385 | 22,7 |
| `/regle.html` | kyran règles, annonce du nombre de plis | 3 / 247 | 7,7 |
| `/` | kyran | 11 / 207 | 4,0 |
| `/blog/jeux-3-joueurs.html` | jeu 3 joueurs | 1 / 44 | 30,5 (page la plus citée par Copilot) |

Requêtes du relevé SERP : tarot africain règles ; jeu de plis ; jeu de cartes apéro ; alternative skyjo ; jeux
comme skull king ; jeu de cartes 3 joueurs ; jeu de cartes où l'on annonce ses plis ; idée cadeau jeu de cartes ;
whist 22 ; rikiki règles.

Pages sans cible dans `seo-keywords.json` : `video-regles`, `commander`, `idee-cadeau`, `regles-rikiki`,
`ressources-gratuites`, `dossier-presse`, `communaute`, Skull King, ados, seniors, science. Requêtes visées par
plusieurs pages : « jeu de plis », « jeu apéro cartes », « tarot africain », « whist 22 », « jeu 30 minutes »,
« alternative wizard », « jeu soirée amis ».

## 4. État technique (19/10/2026)

- `scripts/seo-health.py --sample 0` (50 URL) : 100 % en 200, 0 anomalie (canonical, titres, descriptions, H1,
  JSON-LD, `og:image`) ; TTFB médian 270 ms ; HTML médian 61 Ko.
- Inspection Google (2 relevés de 20 URL le 19/10) : 17 puis 18 indexées ; `/blog/` « Découverte, non indexée » ;
  `meilleurs-jeux-apero` « Explorée, non indexée » ; `/a-propos.html` inconnue de Google ; au 18/10 aussi : `video-regles`, `jeux-comme-skull-king` (détectées), `ressources-gratuites`,
  `regles-rikiki` (inconnues). `idee-cadeau` est indexée depuis le 18/10.
- PageSpeed mobile (11/10) : accueil 97, Tarot 98, Skyjo 92, 3 joueurs 99 ; SEO 100 ; CSS bloquant ~700 ms en 4G
  lente, `style.css` 117 Ko.
- Images de partage : `logo.png` 512 × 512 sur 10 pages ; PNG de 1,96 Mo sur `commander.html`.
- Bing : 56 pages dans l'index, 0 erreur d'exploration.
- `priceValidUntil` du Product : 31/12/2026.

## 5. Mesure : sources, fraîcheur, outils

| Source | Accès | Fraîcheur | Script |
|---|---|---|---|
| Search Console (`sc-domain:kyran-jeu.fr`) | `GSC_SERVICE_ACCOUNT_JSON` (compte `claude-gsc@majordia-seo`), lecture seule | `dataState: all` : la veille (provisoire) ; horaire sur 10 jours, ~10 h de retard | `scripts/seo-kpi-daily.py` |
| Inspection d'URL | même compte ; 2 000/jour | temps réel | `scripts/seo-health.py --inspect N` |
| Bing Webmaster (`https://kyran-jeu.fr/`) | `BING_WEBMASTER_API_KEY` | ~J-2 | `seo-kpi-daily.py` ; `GetCrawlIssues`, `GetQueryStats`, `GetPageStats`, `GetLinkCounts`, `GetUrlLinks` |
| Site en ligne | `curl`, Playwright (`/opt/pw-browsers/chromium`) | temps réel | `seo-health.py`, `npm run check:site` |
| PageSpeed / CrUX | `PAGESPEED_API_KEY` absente (quota anonyme en 429) | 28 j | `seo-health.py --psi` |
| Ventes | journaux Railway `kyran-webhook` (`checkout.session.completed`) ; Stripe (`stripe-kyran`) sans clé dans le cloud | temps réel | — |
| Rapport « IA générative » (GSC), « AI Performance » (Bing, citations Copilot) | interface seulement | — | relevé manuel du propriétaire |

Serveurs MCP (`.mcp.json`, `docs/MCP_SEO.md`) : `gsc` (présent dans la session de routine), `bing-webmaster`
(connexion lente), `stripe-kyran` (sans clé dans le cloud). Claude Docs porte un préfixe `mcp__<uuid>__`.

## 6. Indicateurs suivis

| Groupe | Indicateur | Source | Fréquence | Seuil d'alerte |
|---|---|---|---|---|
| Visibilité | Clics, impressions, CTR, position (jour, 7 j, 28 j) | GSC `dataState: all` | quotidien | −25 % sur 7 j |
| | Dernières 24 h vs mêmes heures J-7 | GSC horaire | quotidien | −40 % |
| | Pages et requêtes en hausse / baisse | GSC (`mouvements.json`) | quotidien | page clé en baisse 2 jours de suite |
| | CTR de « tarot africain » | GSC | quotidien | < 1 % après le 01/11 |
| | Clics de marque « kyran » | GSC | hebdo | −20 % sur 28 j |
| | Trafic Bing | Bing | quotidien | −25 % sur 7 j |
| Indexation | Verdict des pages clés + rotation ; pages hors index du backlog | GSC URL Inspection | quotidien | page clé non indexée |
| | Pages dans l'index Bing | Bing `GetCrawlStats` | quotidien | baisse > 10 % |
| Technique | Codes HTTP, canonical, titres, descriptions, H1, JSON-LD, og:image, robots.txt, llms.txt | `seo-health.py`, `check:site` | quotidien | toute anomalie |
| | Site publié | `curl -sI https://kyran-jeu.fr/` | quotidien | ≠ 200 |
| Performance | LCP, INP, CLS p75 ; score mobile | PSI / CrUX (clé requise) ou Lighthouse local | lundi | sortie de « bon » |
| Autorité | Liens entrants, domaines référents | Bing `GetLinkCounts` / `GetUrlLinks` | hebdo | — (0 au 19/10) |
| Marque | Mentions nouvelles ; note et avis Amazon ; fiche BGG (notes, possesseurs) | WebSearch, API geekdo | quotidien / hebdo | mention sans lien = opportunité |
| GEO | Prompts de test (C/M/—) | WebSearch, `_notes/geo-tests.md` | quotidien (3) / lundi (9) | −20 % |
| Conversion | Ventes par jour | Railway `kyran-webhook` | quotidien | 0 vente sur 14 j |

## 7. Concurrents et SERP (relevé du 19/10/2026)

- Sites de contenu qui tiennent les requêtes : regles2jeux.fr, Board Game Arena (doc Whist 22), Wikipédia
  (« Ascenseur (jeu de cartes) ») ; gusandco.net, ludum.fr, play-in.com, espritjeu, journaldugeek, worldofgeek.fr.
- Jeux concurrents : Skull King (pari exact, rival direct), Pili Pili, Wizard, Cat in the Box, Chouineurs ; voisins
  7 Yokai, The Crew, Skyjo, Trio.

## 8. Présence externe et mentions

| Où | État au 19/10/2026 |
|---|---|
| Ludovox, Ludochrono (31/01/2026) | vidéo 5 min, aucun lien vers le site |
| Le Pirate Ludique (YouTube) | vidéo « Kyran maître des mystiques » |
| BoardGameGeek 480678 | 0 note, 0 possesseur, description vide, mécanique « Predictive Bid » seule |
| Wikidata Q141623753 | libellés fr et en, P31, P2093, P577, P1872, P1873, P856 (site), P407 ; 0 référence ; absent des `sameAs` du site |
| Amazon.fr | 4,7/5 sur 33 évaluations |
| BoardGamesFlix | fiche descriptive |
| YouTube @Kyran-jeu | 1 vidéo, 101 vues |
| Trictrac, MyLudo, Philibert, presse | rien |
| Bruit | homonymes « Kyran » (footballeurs) ; PR publiques du dépôt (« audit SEO/GEO ») visibles sur la marque |

Liens entrants : **0** (Search Console et Bing).

## 9. GEO

- Copilot : 600 citations en 3 mois (257 pour `jeux-3-joueurs`), relevé du 14/10. ChatGPT : 8 sur 10 au test du
  11/10 (cite encore `/comparatif-jeux-plis.html`). Google AI Overviews : reprend `tarot-africain.html` sans nommer
  KYRAN.
- `llms.txt` factuel (13 Ko), `llms-full.txt` 40 Ko ; 17 robots IA autorisés dans `robots.txt`.
- Prompts : `_notes/geo-tests.md`.

## 10. Netlinking

Cibles, ressources offertes et suivi : `_notes/outreach/cibles.md` ; modèles : `_notes/outreach/modeles-mails.md`.
Objectif (14/10) : 10 liens de sites ludiques francophones d'ici mi-décembre 2026.
`NETLINKING_ANNUAIRES.md` contient des faits faux (pouvoirs inventés, « Player Elimination », fiche BGG « à créer ») :
ne pas le réutiliser tel quel.

## 11. Bonnes pratiques (octobre 2026)

- GEO = SEO selon Google ; `llms.txt` ignoré par Google ([guide IA, 10/07/2026](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)).
- AI Overviews en France depuis le 22/07/2026.
- Fiche marchande : `Product` + `Offer` avec `shippingDetails`, `hasMerchantReturnPolicy`, `priceValidUntil` ;
  livraison et retours déclarables dans Search Console ; Merchant Center gratuit (Content API arrêtée le
  18/08/2026 : Merchant API v1).
- Rich results FAQ arrêtés le 07/05/2026 ; HowTo retiré : garder les FAQ visibles, sans en ajouter pour Google.
- Mentions sur des sites tiers : premier facteur de visibilité IA ; YouTube : domaine le plus cité par les AI
  Overviews.
- Pages courtes et ciblées plus citées par ChatGPT que les « guides ultimes » (Kevin Indig, 13/04/2026).
- Titre : une hypothèse, 4 semaines d'écart, rien pendant une core update ; `lastmod` faux pire qu'absent.
- Dernières mises à jour Google : core 21/05/2026 ; spam 24/09 → ~07/10/2026.

## 12. Ce qui marche sur kyran-jeu.fr

| Date | Constat | Preuve |
|---|---|---|
| 2026-10-19 | Les guides « jeux comme X » au CTR le plus haut ont une promesse chiffrée et un public précis (Dixit 4,3 %, 6 joueurs 5,3 %) | GSC 28 j |
| 2026-10-19 | La refonte des 13-14/10 (titres orientés clic, pages nouvelles, images allégées) précède la meilleure semaine depuis juillet (44 clics en 6 jours) | GSC hebdo |

## 13. À faire par le propriétaire (comptes, décisions)

- `PAGESPEED_API_KEY` (clé Google gratuite) dans l'environnement cloud : Core Web Vitals chaque nuit.
- Mesure d'audience sans cookie (à décider) ; Merchant Center (flux prêt) ; livraison et retours dans Search Console.
- BGG (description, mécanique « Trick-taking », site), Trictrac, MyLudo, Philibert, références Wikidata.
- Relevé mensuel « AI Performance » (Bing) et « IA générative » (Search Console).
- Décision : `priceValidUntil` 2027 ; prix et port inchangés sans accord.

## 14. Routines voisines

| Routine | Heure (Paris) | Lien avec le SEO |
|---|---|---|
| SEO & GEO (celle-ci) | 00:00 | PR fusionnées avant 06:30 |
| Instagram (`instagram.yml`) | ~07:17 | régénère `communaute.html` |
| Blog lun/mer/ven | 06:50 | possède les articles neufs, bilan SEO du lundi, journal des titres partagé (`docs/SUIVI-BLOG-SEO.md`) |
| Ventes (mardi) | 06:47 | conversion de `commander.html`, contrôle prix Stripe |
| Auto-Heal | chaque heure à :17 | corrige les erreurs de production |
