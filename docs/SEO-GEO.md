# SEO / GEO — fonctionnement et suivi

Ce document décrit comment le site est construit pour le référencement (Google, Bing) et pour les
réponses des assistants IA (ChatGPT, Copilot, Perplexity, Gemini, Claude), et ce qu'il reste à faire à la main.
Il suit l'audit d'octobre 2026 (`rapport-seo-geo-kyran`).

## 1. Construire le site

```bash
npm ci
npm run build        # articles, redirections, blog-data.js, sitemap, llms.txt, rendu statique, CSP
npm test             # JSON-LD, articles du blog, cohérence du site, tests de sécurité
```

`npm run build` est déterministe : relancé sans modification, il ne change rien (la CI le vérifie).
Toujours commiter le résultat du build avec les sources.

| Étape | Script | Produit |
|---|---|---|
| 1 | `generate-blog.mjs` | `blog/<slug>.html` à partir de `scripts/content/blog/<slug>.mjs` |
| 2 | `generate-redirects.mjs` | pages de redirection (`roster.json` → `redirects`) |
| 3 | `generate-blog-infra.mjs` | `blog-data.js`, `blog/feed.xml`, `blog/index.html` |
| 4 | `generate-community.mjs` | `communaute.html` (photos et vidéos Instagram de joueurs) |
| 5 | `generate-seo.mjs` | `sitemap.xml`, `llms.txt`, `llms-full.txt`, `plan-du-site.html`, version des assets |
| 6 | `prerender.mjs` | HTML statique des composants `<kyran-*>` et des avis |
| 7 | `apply-csp.mjs` | balises CSP / referrer |

Images : `node scripts/optimize-images.mjs` (WebP des images du blog) après l'ajout d'une image.

## 2. Ajouter ou modifier un article

1. Faits d'un jeu (joueurs, durée, âge, prix, image) : `scripts/content/games.json`.
2. Article : `scripts/content/blog/<slug>.mjs` (format et règles de rédaction : `scripts/content/README.md`).
3. Ajouter le slug dans `scripts/content/roster.json` (`generated`).
4. `node scripts/validate-articles.mjs <slug>` — refuse les phrases communes à deux articles, les liens
   vers des pages fusionnées, les articles sans critères, sans avis tranché, sans FAQ propre.
5. `npm run build`, puis commiter.

Règle d'or : aucun paragraphe ne doit exister dans deux articles. Le contrôle de page
`node scripts/check-duplicates.mjs` mesure le recouvrement réel entre pages publiées (seuil d'erreur : 20 %).

Fusionner ou supprimer un article : ajouter l'ancienne URL dans `roster.json` → `redirects`
(GitHub Pages ne gère pas les 301 : une page `meta refresh` + canonique est générée).

## 3. Dates de modification

`sitemap.xml` (`<lastmod>`) et les `dateModified` JSON-LD viennent de `scripts/lastmod-manifest.json` :
la date ne change que si le contenu utile de la page change (les numéros de version d'assets, l'en-tête
et le pied de page rendus statiquement n'y comptent pas). Ne modifiez pas ce fichier à la main.

## 4. IndexNow (Bing, Copilot)

- Clé : fichier `<clé>.txt` à la racine (publique par conception).
- `.github/workflows/indexnow.yml` envoie à chaque push sur `main` les pages HTML modifiées, après avoir
  attendu que la clé soit en ligne. Lancement manuel possible (« Run workflow ») pour renvoyer tout le sitemap.
- Test local : `node scripts/indexnow.mjs --all --dry-run`.

## 5. CI

`.github/workflows/ci.yml` : JSON-LD valide partout, validation des articles, cohérence du site
(canoniques, liens internes, sitemap, redirections, robots.txt, llms.txt), build à jour, tests de sécurité.

## 6. Page Communauté (Instagram)

`/communaute.html` publie les photos et vidéos de joueurs partagées avec @kyran.jeu. Republications
(automatiques) : fichiers hébergés sur le site, sitemap image et vidéo, `ImageObject` / `VideoObject` avec
le crédit de l'auteur. Collaborations créées par un joueur (liste manuelle, l'API ne les renvoie pas) :
intégration Instagram affichée directement (iframe à chargement différé), `SocialMediaPosting`.
Synchronisation quotidienne par `.github/workflows/instagram.yml`. Mise en place, liste manuelle et
renouvellement du jeton : `docs/INSTAGRAM.md`.

## 7. À faire à la main (Corentin)

Après déploiement :

- **Search Console** : inspecter `/`, puis « Demander une indexation » pour `/`, `/tarot-africain.html`,
  `/tarot-africain-a-3-joueurs.html`, `/whist-22.html`, `/regle.html`, `/commander.html`, `/a-propos.html`
  et les articles réécrits (environ 10 par jour). Relancer « Valider la correction » sur « Explorée, actuellement
  non indexée ». Supprimer l'ancien sitemap en cache si besoin et le re-soumettre.
- **Search Console → Pages** : les anciennes URL fusionnées apparaîtront en « Page avec redirection » : normal.
- **Bing Webmaster Tools** : vérifier que les envois IndexNow arrivent (rapport IndexNow) ; re-soumettre le sitemap.
- **GitHub → Settings → Pages** : si la publication est en mode « GitHub Actions », le workflow `pages.yml`
  publie sur `main` ; sinon le site est servi directement depuis la branche.

Hors code (indispensable pour viser la première place — le site n'a aucun lien entrant) :

1. Fiches de référence : BoardGameGeek (voir `NETLINKING_ANNUAIRES.md`), Tric Trac, Wikidata (élément « KYRAN »,
   jeu de cartes, auteur, date de sortie), Philibert / Ludum si distribution. Ajouter ensuite ces URL au
   `sameAs` de l'Organisation dans `index.html` et dans `a-propos.html`.
2. Tests et avis : lien vers le site dans la description de la vidéo Ludochrono ; envoyer des boîtes à
   Gus & Co, Vin d'jeu, Un Monde de Jeux, comptes Instagram / TikTok jeux.
3. Communautés : Reddit (r/jeuxdesociete, r/boardgames), forums Tric Trac, groupes Facebook — participation honnête.
4. Presse locale, festivals, concours (As d'Or, Double 6, etc.).
5. Amazon : davantage d'avis vérifiés.
6. Google Merchant Center : brancher `google-merchant-feed.xml` (onglet Shopping proposé par la Search Console).
7. Google Business Profile si une adresse professionnelle peut être affichée.
8. YouTube : vidéos « Comment jouer à KYRAN en 3 minutes » et « Règles du Tarot Africain en vidéo », avec
   lien vers le site. La chaîne officielle (https://www.youtube.com/@Kyran-jeu) est déjà dans les `sameAs`.

## 8. Décisions du propriétaire et points restants

Tranchés (2 octobre 2026) :

| Sujet | Décision appliquée |
|---|---|
| Nombre de cartes | 36 Nombre + 1 Mystique + 8 Pouvoir (45 cartes de jeu) + 30 Vie + **7 cartes de règles** (confirmé par l'éditeur le 2 octobre 2026). « 55 cartes » retiré partout (site, CGV, flux Merchant, barre de stats). |
| Avis « Amélie » | Citation supprimée de l'accueil. Les citations de Toto et Patrick sont maintenant des extraits exacts de leurs avis. |
| Retours | Retours gratuits confirmés : CGV (art. 6), page commander, FAQ et JSON-LD alignés (`FreeReturn`). |
| Livraison | France métropolitaine et pays limitrophes : Belgique, Luxembourg, Allemagne, Suisse, Italie, Espagne, Monaco, Andorre, Royaume-Uni (liste du flux Merchant). CGV, JSON-LD, page commander et FAQ alignés. |
| Prix | 9,99 € sur kyran-jeu.fr (confirmé). |
| Flux Merchant | « Dès 10 ans » corrigé en « Dès 8 ans ». |
| Kbis | Cohérent avec les mentions légales (SIREN 840 817 548, RCS Nanterre). Activité commencée le 10/09/2025 : ajoutée dans `llms.txt` et au JSON-LD de l'Organisation (`foundingDate`). Le domicile du Kbis n'est pas republié. |

Restent ouverts :

| Sujet | Constat | Action |
|---|---|---|
| Liens externes | Fiches trouvées et ajoutées à « À propos » (références), au `sameAs` de l'accueil ou à `llms.txt` : fiche BoardGamesFlix (https://boardgamesflix.com/boardgames/kyran, titre « Kyran : Maître des Mystiques », 3 à 6 joueurs, 8 ans, 30 min) ; Ludochrono de Ludovox (https://ludovox.fr/ludochrono-kyran/, 31 janvier 2026) ; vidéo « kyran maître des mystiques » de la chaîne Le Pirate Ludique ; annonce Etsy ; fiche Amazon. BoardGamesFlix signale aussi une fiche Okkazeo (non vérifiée : site inaccessible depuis l'environnement de build). Toujours aucune fiche BoardGameGeek, Tric Trac ni Wikidata. Amazon, Etsy et BGG bloquent les accès automatiques : avis et fiches non récupérés. | Créer les fiches BGG / Tric Trac / Wikidata (voir § 6) puis donner les URL pour le `sameAs`. |
| Etsy | Boutique « KyranJeu » : https://www.etsy.com/fr/shop/KyranJeu (URL fournie par l'éditeur). Annonce : https://www.etsy.com/fr/listing/4585329666/kyran-le-jeu-de-bluff-et-de-strategie, 9,99 € + 2,99 € de livraison (même tarif que le site), retours et échanges acceptés. Offre Etsy dans le JSON-LD de l'accueil (livraison France), boutique dans le `sameAs` de l'Organisation. | Aucune. Délai de livraison Etsy et conditions de retour non publiés (non confirmés). |
| Date de sortie | **31 janvier 2026** (confirmée par l'éditeur ; cohérent avec le Ludochrono de Ludovox du 31 janvier 2026). Remplace « février 2026 » du dossier de presse : accueil (`releaseDate`, `datePublished`), À propos, dossier de presse, llms.txt. Le Kbis indique une activité depuis septembre 2025. |
| `priceValidUntil` | 2026-12-31 dans les offres JSON-LD. | À renouveler avant cette date. |
| Origine du Tarot Africain | Aucune source sur le site : les pages restent prudentes. | Fournir une source si vous voulez répondre précisément à « tarot africain origine ». |
| Fabrication | Un avis Amazon parle d'un jeu « imaginé en Guadeloupe et fabriqué en Chine ». Le site ne le dit pas. | À confirmer si vous voulez l'écrire dans « À propos ». |
| Page « À propos » | Pas de photo ni d'histoire de création dans les sources. | Ajouter une photo, le récit de création, un profil personnel (`sameAs` de la Person). |
| Références scientifiques | Deux références erronées de l'article sur le cerveau ont été corrigées (Altschul & Deary 2020 ; Dartigues et al. 2013). | Faire relire par une personne qualifiée avant d'insister sur les allégations de santé. |

## 9. Audit Search Console du 4 octobre 2026

Constat (données arrêtées au 21/09) : 25 pages indexées, 37 non indexées, dont une vingtaine d'articles
« explorés » ou « détectés, actuellement non indexés » ; 3 vidéos non indexées (« la vidéo n'est pas sur une
page de lecture ») ; sitemap lu à 58 URL. Cause la plus probable : une série d'articles au gabarit identique
(mêmes H2, 8 jeux, ~33 liens externes) sur un domaine jeune, et un maillage interne faible.

### Ce qui a été changé dans le site

| Priorité | Changement |
|---|---|
| P1 gabarit | Le générateur accepte une structure propre à chaque article (`layout`, `headings` : réponse d'abord, critères après la sélection, fiches regroupées par thème, tableau absent ou déplacé, libellés de sections propres). Une seule référence externe par jeu (BoardGameGeek, ou la boutique pour les guides d'achat), plus de boutons de partage X / Facebook / LinkedIn : ~10 liens externes par article au lieu de ~28. Le validateur signale les articles restés au gabarit par défaut. |
| P1 articles | Restructurés, avec un nombre de jeux propre à chacun : jeux-3-joueurs (6), jeux-duo-couples (7), jeux-memoire-concentration (6), jeux-vacances-voyage (7), jeux-30-minutes (9), jeux-debutants-adultes (5), jeux-bluff-pari (7), jeux-sans-elimination (5, KYRAN retiré : ce n'est pas un jeu sans élimination), jeux-coop-cartes (6), jeux-strategie-legere (7), puis alternatives-wizard, alternatives-belote-coinche, cadeau-noel, jeux-cartes-4-joueurs, jeux-comme-exploding-kittens. Article « science » : erreurs sur le matériel KYRAN corrigées, allégations santé ramenées à ce que disent les études, section « Ce que ces études ne disent pas ». |
| P2 fusions | `jeux-cartes-5-joueurs` → `jeux-cartes-6-joueurs` (désormais « à 5 ou 6 joueurs », article généré) ; `jeux-brise-glace-afterwork` → `meilleurs-jeux-apero` ; `jeux-cartes-pas-chers` → `cadeau-anniversaire`. Pages « déplacées » + canonique, hors sitemap. |
| P3 maillage | Accueil : index « Trouver le bon jeu de cartes » vers 25 articles. Règles, Tarot Africain, page apéro : liens vers les articles proches non indexés et vers `/tarot-africain-a-3-joueurs.html`. 3 à 5 liens contextuels dans le corps de chaque article retravaillé. |
| P4 vidéo | Nouvelle page de lecture `/video-regles.html` (Ludochrono en tête de page, `VideoObject` complet, entrée `video:video` dans le sitemap). Accueil et règles : vidéos chargées au clic (rien d'intégré pour les robots), `VideoObject` retirés de l'accueil et des règles. Le QR code de la boîte (`/#video`) mène à la page de lecture. |
| P5 nettoyage | `FAQPage` retirée de l'accueil (questions invisibles sur la page et redondantes avec `/faq.html`). `/whist-moderne.html` retirée des pages connues ; aucun lien interne ni le flux RSS ne pointent vers des pages fusionnées (contrôlé par `check-site`). |

`dateModified` et `<lastmod>` ne changent que pour les pages dont le contenu a changé (manifeste
`scripts/lastmod-manifest.json`) ; les changements de gabarit seuls ne les modifient pas.

### À faire à la main dans Search Console, après déploiement

1. **Sitemaps** : renvoyer `https://kyran-jeu.fr/sitemap.xml` (44 URL au lieu de 46 : trois fusions, une page vidéo).
2. **Vidéos** : inspecter `/video-regles.html`, demander l'indexation, puis « Valider la correction » sur « La vidéo n'est pas sur une page de lecture ».
3. **Demander l'indexation** (environ 10 par jour), dans cet ordre :
   - jour 1 : `/video-regles.html`, `/blog/jeux-cartes-6-joueurs.html`, `/blog/meilleurs-jeux-apero.html`, `/blog/cadeau-anniversaire.html`, `/blog/alternatives-wizard.html`, `/blog/jeux-bluff-pari.html`, `/blog/jeux-duo-couples.html`, `/blog/jeux-comme-exploding-kittens.html`, `/`, `/regle.html` ;
   - jour 2 : `/blog/jeux-3-joueurs.html`, `/blog/jeux-cartes-4-joueurs.html`, `/blog/alternatives-belote-coinche.html`, `/blog/cadeau-noel.html`, `/blog/jeux-coop-cartes.html`, `/blog/jeux-strategie-legere.html`, `/blog/jeux-debutants-adultes.html`, `/blog/jeux-30-minutes.html`, `/blog/jeux-vacances-voyage.html`, `/blog/jeux-memoire-concentration.html` ;
   - jour 3 : `/blog/jeux-sans-elimination.html`, `/blog/science-jeux-de-cartes-cerveau.html`, `/faq.html`, `/tarot-africain.html`, `/jeu-apero.html`.
4. **Ne plus demander l'indexation** de `/blog/jeux-cartes-5-joueurs.html`, `/blog/jeux-brise-glace-afterwork.html`, `/blog/jeux-cartes-pas-chers.html` : ce sont maintenant des pages déplacées ; elles sortiront seules du rapport (« Autre page avec balise canonique correcte »).
5. Les validations « Explorée / Détectée, actuellement non indexée » lancées le 24/09 suivent leur cours : ne pas les relancer avant leur conclusion.

### Ce qu'il reste à fournir (contenu de première main, impossible à rédiger à votre place)

Le levier le plus fort contre le refus d'indexation reste ce qu'aucun autre site n'a :

- **Photos réelles de parties** des jeux cités (votre table, vos boîtes) : à déposer dans `blog/images/parties/` puis à
  déclarer dans le champ `photos` de l'article.
- **Retours de test chiffrés** : durée mesurée d'une partie, nombre de joueurs, nombre de parties jouées, ce qui a
  coincé. Ils iront dans un `authorNote` ou une `extraSections`, avec la date et le contexte.
- **Avis signé de l'auteur** (`authorNote`, voir `scripts/content/README.md`) : quelques lignes par article, écrites
  par vous ; le validateur exige la date à laquelle vous les avez fournies.

Commencer par les articles des jours 1 et 2 ci-dessus.
