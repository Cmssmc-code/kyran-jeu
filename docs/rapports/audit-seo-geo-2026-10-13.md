# Audit SEO / GEO complet — kyran-jeu.fr — 13 octobre 2026

Sources : Google Search Console et Bing Webmaster Tools (serveurs MCP `gsc` et `bing-webmaster`,
données du 13 juillet au 12 octobre 2026), inspection d'URL GSC du 13 octobre, et audit technique
de toutes les pages HTML du dépôt (script cheerio : titles, descriptions, Hn, canoniques, og/twitter,
images, ancres, liens entrants, profondeur, poids, données structurées). Rapport précédent :
`docs/rapports/seo-geo-2026-10-11.md`.

## 1. Résumé

1. **Google, 3 mois** : 279 clics, 16 267 impressions, CTR 1,7 %, position moyenne 8,5. Bing : trafic
   marginal (moins de 30 impressions par requête sur la période), aucun problème d'exploration.
2. **Le site est sain techniquement** : sur 48 pages indexables, aucune canonique fausse, aucun lien
   interne cassé, aucune page orpheline, toutes à 2 clics de l'accueil au plus, une seule `<h1>`
   partout, toutes les images ont un `alt` et des dimensions, JSON-LD valide partout.
3. **Les gains restent dans le CTR** : les pages qui tirent les impressions sont en position 6 à 9
   avec un CTR de 0,7 à 1,6 %. Leurs titles ont été réécrits le 8 et le 11 octobre ; la mesure est
   prévue le 18 octobre. **Je ne les ai pas retouchés** pour ne pas fausser cette mesure (le CTR du
   Tarot Africain passe déjà de 0,7 % sur 3 mois à 1,1 % sur les 15 derniers jours).
4. **Corrigé** : 7 titles trop longs, une description trop longue, les balises Twitter de deux pages,
   un saut de titres, `llms.txt` / `llms-full.txt` (faits manquants, formulation fausse sur la manche
   Mystique, nouvelles questions tirées de GSC), les `sameAs` de « À propos », des auteurs JSON-LD sans
   identifiant, une liste de pays de livraison fausse dans `product.mjs`.
5. **Hors code (le vrai frein)** : toujours 0 lien entrant, `/idee-cadeau.html` inconnue de Google,
   `/video-regles.html` découverte mais non indexée, marque « kyran » seulement en position 5,6.

## 2. Données réelles

### 2.1 Google : pages (13 juil. → 12 oct.)

| Page | Clics | Impr. | CTR | Pos. |
|---|---|---|---|---|
| /blog/jeux-comme-skyjo.html | 75 | 4 604 | 1,6 % | 7,7 |
| /tarot-africain.html | 28 | 3 973 | 0,7 % | 7,4 |
| /blog/jeux-soiree-amis.html | 9 | 1 584 | 0,6 % | 15,6 |
| /blog/jeux-comme-codenames.html | 36 | 1 062 | 3,4 % | 6,1 |
| /regle.html | 15 | 972 | 1,5 % | 8,5 |
| /blog/jeux-comme-dixit.html | 35 | 779 | 4,5 % | 5,7 |
| / | 12 | 548 | 2,2 % | 6,0 |
| /alternative-skyjo.html (redirection) | 7 | 455 | 1,5 % | 9,9 |
| /blog/alternatives-uno.html | 7 | 413 | 1,7 % | 7,6 |
| /blog/cadeau-anniversaire.html | 4 | 334 | 1,2 % | 9,2 |
| /blog/meilleurs-jeux-apero.html | 4 | 315 | 1,3 % | 11,3 |

Les ancres `/tarot-africain.html#…` (100 à 375 impressions chacune) et `/regle.html#…` sont les liens
« Accéder à » sous le résultat principal : normal.

15 derniers jours (28 sept. → 12 oct.), après les titles du 8 octobre : `/tarot-africain.html`
12 clics / 1 067 impr. (CTR 1,1 %, pos. 7,2) ; `jeux-comme-skyjo` 7 / 316 (2,2 %) ; `jeux-comme-codenames`
2 / 220 (0,9 %) ; `/regle.html` 2 / 126 (1,6 %).

### 2.2 Google : requêtes à fort volume et faible CTR (quick wins)

| Requête | Impr. | Clics | Pos. | Page |
|---|---|---|---|---|
| tarot africain | 828 | 4 | 7,5 | tarot-africain |
| kyran | 247 | 7 | 5,6 | accueil |
| tarot africain regle / regle tarot africain / tarot africain règle | 497 | 5 | 7,3 à 8,4 | tarot-africain |
| tarot africain autre nom | 173 | 1 | 8,0 | tarot-africain |
| tarot africain origine | 132 | 1 | 5,6 | tarot-africain |
| jeu de carte pari nombre de plis | 132 | 3 | 6,6 | regle |
| jeux entre amis | 117 | 0 | 26,8 | jeux-soiree-amis |
| jeu de carte annonce nombre de plis | 90 | 1 | 9,3 | regle |
| jeu style / type / comme skyjo, jeu qui ressemble au skyjo | 50 à 70 chacune | 0 à 1 | 6,8 à 11,3 | jeux-comme-skyjo |
| jeu comme code name | 31 | 0 | 6,3 | jeux-comme-codenames |
| magilano wikipédia | 22 | 0 | 7,5 | jeux-famille |

### 2.3 Google : indexation (inspection du 13 oct.)

| URL | État |
|---|---|
| / | Indexée, explorée le 7 oct. (extraits produit, fiche marchand ; « extraits d'avis » encore vus sur la version explorée avant le retrait de la note Amazon du JSON-LD) |
| /tarot-africain.html, /blog/jeux-comme-skyjo.html, /minijeu.html | Indexées (8-9 oct.) |
| /commander.html | Indexée, explorée le 17 sept. seulement |
| /video-regles.html | Découverte, non indexée |
| /idee-cadeau.html | **Inconnue de Google** (page créée après la dernière lecture du sitemap, le 8 oct.) |

Sitemap GSC : `https://kyran-jeu.fr/sitemap.xml`, lu le 8 oct. sans erreur (44 URL). Le sitemap du dépôt
en contient 47 aujourd'hui (`/idee-cadeau.html` et deux articles en plus).

### 2.4 Bing

306 lignes de requêtes sur la période. Les plus vues : « tarot africain » (25 impr., pos. 8,3),
« kyran » (18, pos. 3,9), « jeu comme skyjo » (7, pos. 2,1), « kyran jeu » (6, pos. 1,3), puis des
requêtes longues et descriptives de type assistant (« meilleurs jeux de cartes rapides en moins de
30 minutes », « jeu de cartes pari nombre de plis chaque tour une carte ajoutée… »). Problèmes
d'exploration : aucun.

## 3. Audit technique (48 pages indexables, 16 redirections, 6 pages noindex)

| Contrôle | Avant | Après |
|---|---|---|
| Canonique absente ou différente de l'URL (convention : https, `.html`, `/` et `/blog/`) | 0 | 0 |
| Liens internes cassés / vers une redirection | 0 | 0 |
| Pages orphelines (aucun lien entrant) | 0 | 0 |
| Profondeur de clic > 2 | 0 | 0 |
| `<h1>` absente ou multiple | 0 | 0 |
| Saut de niveau de titre (h1 → h3, h2 → h4) | 2 | 1 |
| Title > 60 caractères | 8 | 1 (FAQ corrigée ; reste un title gelé, voir § 5) |
| Title en double | 0 | 0 |
| Meta description hors 120-160 | 2 (commander 174, plan du site 104) | 0 |
| Meta description en double | 0 | 0 |
| og:/twitter: incomplets | 1 (blog : twitter:title et description) | 0 |
| og:image hors site | 1 (`/video-regles.html`, miniature YouTube de la vidéo : volontaire) | 1 |
| Images sans `alt` / sans width-height | 0 / 0 | 0 / 0 |
| Ancres vides | 0 | 0 |
| hreflang `fr-FR` + `x-default` | 48/48 | 48/48 |
| Poids HTML | 23 à 102 Ko (commander) | idem |
| JSON-LD invalide | 0 | 0 |
| Sitemap : page redirigée, noindex ou lastmod futur | 0 | 0 |
| robots.txt | Sitemap déclaré, robots IA autorisés, pages privées bloquées | idem |

Données structurées présentes : `WebSite`, `Organization`, `Product` + `Offer` (accueil, règles,
boutique), `Game`, `BreadcrumbList` partout, `FAQPage` sur les pages qui affichent leur FAQ
(contrôlé par `check:jsonld`), `BlogPosting` (author avec `@id`, `datePublished`, `dateModified`),
`Article` sur les guides statiques, `HowTo` (règles, Tarot Africain), `VideoObject` sur
`/video-regles.html`, `WebApplication` sur l'Initiation. Pas de note agrégée ni d'avis Amazon en
données structurées (consigne Google, retrait volontaire).

## 4. GEO (moteurs de réponse IA)

- **Définition de l'entité** : l'accueil dit dès le hero ce qu'est KYRAN (jeu de plis, 3 à 6 joueurs,
  30 min, dès 8 ans), le prix et le port ; la section « D'où vient KYRAN ? » nomme l'auteur et le
  Tarot Africain. Ajouté : la date de sortie (31 janvier 2026).
- **Cohérence des faits** (recherche dans tout le site) : 9,99 €, port 2,99 € par commande, 3 à 6
  joueurs, 30 min, dès 8 ans, 45 + 30 + 7 cartes, 11,5 × 8,5 × 2,8 cm, 175 g, sortie le 31 janvier
  2026, note Amazon 4,7/5 sur 33 évaluations : cohérents partout. Aucune occurrence de « 55 cartes »
  pour KYRAN (la seule est Dobble), ni de « février 2026 » comme date de sortie (les occurrences
  sont des dates d'avis Amazon), ni de pays de livraison hors FR BE LU CH MC dans les pages.
  **Écart trouvé** : `scripts/lib/product.mjs` listait encore dix pays (dont DE, IT, ES, AD, GB) ;
  corrigé (liste non utilisée par le flux, mais source « canonique » trompeuse).
- **`llms.txt` / `llms-full.txt`** : la manche Mystique y était dite « dernière manche du cycle »
  (faux : le cycle repart à 7) ; corrigé. Ajoutés : total 12,98 € pour une boîte livrée en France,
  « 45 cartes de jeu », chaîne YouTube officielle, et sept questions issues des requêtes réelles
  (pays livrés, jeu à deux, contenu de la boîte, date de sortie, « quel jeu de cartes consiste à
  parier le nombre de plis », « autre nom du Tarot Africain », Etsy).
- **`sameAs`** : Organisation de « À propos » alignée sur l'accueil (Instagram, YouTube, Amazon,
  Etsy). Le produit garde BoardGameGeek, BoardGamesFlix, Etsy, Amazon et les vidéos.
- **Auteurs** : `jeu-apero.html` et le communiqué de `dossier-presse.html` reliés à la fiche
  `#corentin-sence` ; le communiqué gagne `image` et `dateModified`.

## 5. Corrections faites (commit de ce rapport)

| Fichier | Changement | Raison |
|---|---|---|
| `scripts/generate-seo.mjs` | `llms*.txt` (voir § 4) ; description du plan du site 104 → 150 caractères | GEO, longueur |
| `scripts/generate-blog-infra.mjs` | `twitter:title` / `twitter:description` sur `/blog/` ; `<h2 class="sr-only">` avant la grille (h1 → h3 auparavant) | balises sociales, hiérarchie Hn |
| `scripts/lib/product.mjs`, `docs/MERCHANT.md` | pays FR BE LU CH MC | cohérence avec Stripe et les pages |
| 6 articles (`scripts/content/blog/*.mjs`) | metaTitle ramené à 60 caractères ou moins : cadeau-anniversaire, jeux-3-joueurs, jeux-cartes-6-joueurs, jeux-debutants-adultes, jeux-sans-elimination, jeux-vacances-voyage | troncature dans Google |
| `faq.html` | title 61 → 59 (title, og:title, nom du JSON-LD) | troncature |
| `commander.html` | description 174 → 151 caractères (« en France » ajouté, « paiement Stripe » retiré) | troncature |
| `regle.html` | `twitter:title` / `twitter:description` alignés sur le title (« KYRAN - Règles officielles » auparavant) | cohérence |
| `index.html` | « Il est sorti le 31 janvier 2026. » dans « D'où vient KYRAN ? » | fait citable |
| `a-propos.html`, `jeu-apero.html`, `dossier-presse.html` | `sameAs`, `author` avec `@id`, `image` / `dateModified` du communiqué | entité |
| Générés par `npm run build` | `llms*.txt`, `plan-du-site.html`, `blog/*.html`, `sitemap.xml`, `scripts/lastmod-manifest.json` | — |

Contrôles : `npm run build` (relancé : aucun changement), `npm test` (dont `check:jsonld`,
`validate:blog`, `check:site`, `check:duplicates`) au vert. Contrôle visuel Playwright de l'accueil
et de `/blog/` à 390 et 1440 px : pas de débordement, aucune erreur console.

### Ce que je n'ai volontairement pas fait

- **Titles des pages réécrites le 8 et le 11 octobre** (Tarot Africain, Skyjo, Codenames, Dixit,
  soirée entre amis, règles) : mesure prévue le 18 octobre. Propositions prêtes si le CTR reste bas :
  - `/tarot-africain.html` : « Tarot Africain (Whist 22) : règles et feuille de score PDF » (58),
    description « Le Tarot Africain, aussi appelé Whist 22, se joue de 3 à 5 avec 22 cartes de tarot.
    Chacun parie ses plis au pli près. Règle pas à pas, exemple et feuille PDF. » (159). Le mot-clé
    principal passe en tête et répond à « tarot africain autre nom » (173 impr.).
  - `jeux-comme-skyjo` : « Jeux comme Skyjo : 10 jeux qui lui ressemblent (2026) » (53), description
    qui commence par les noms des jeux (« Llama, No Thanks!, 6 qui prend !, Parade… »).
  - `jeux-comme-codenames` : retirer « (2026) » pour passer de 62 à 55 caractères.
- **`VideoObject` pour « KYRAN en 60 secondes » et le teaser** : sur l'accueil et les règles, ces
  vidéos se chargent au clic (rien n'est visible pour un robot) ; sur la boutique, le teaser est
  secondaire. Google refuse ces vidéos (« la vidéo n'est pas sur une page de lecture », leçon du
  2026-10-04 dans `_notes/lecon.md`). Pour les indexer, il faut une page de lecture dédiée par vidéo
  (nouvelle URL) : décision du propriétaire.
- **`dossier-presse.html`** : les quatre pouvoirs sont en `<h4>` sous un `<h2>` ; la mise en forme
  dépend de `.power-card h4` dans `style.css` (fichier d'un autre agent). Impact SEO négligeable.
- **`/blog/jeux-soiree-amis.html`** (position 15 à 27 sur « jeux entre amis ») : c'est un problème de
  contenu et d'autorité, pas de balises.

## 6. Points restants pour le propriétaire

1. **Search Console** : renvoyer le sitemap (47 URL), puis demander l'indexation de
   `/idee-cadeau.html` (inconnue de Google, page de Noël : urgent), `/video-regles.html` et
   `/commander.html` (pas explorée depuis le 17 septembre).
2. **18 octobre** : mesurer le CTR des titles du 8 octobre ; appliquer les propositions du § 5 si le
   Tarot Africain reste sous 2 %.
3. **Marque « kyran » en position 5,6** sur Google (247 impressions) : créer les fiches Wikidata et
   Tric Trac, puis donner leurs URL pour le `sameAs` ; lien vers le site dans la description du
   Ludochrono et de la chaîne YouTube.
4. **Liens entrants : 0.** Priorité : Ludovox, BoardGameGeek (lien vers le site sur la fiche), forums
   Tarot Africain (la feuille de score PDF est le meilleur argument).
5. **Vidéos** : décider s'il faut une page de lecture pour « KYRAN en 60 secondes ».
6. **`priceValidUntil`** (2026-12-31) à renouveler avant la fin de l'année.
