# Suivi de la routine SEO & GEO de KYRAN

Journal de la routine nocturne (`_notes/seo-routine-mission.md`), entrée la plus récente en haut. Chaque entrée :
date, verdict (« En progrès », « Stable », « À surveiller », « Incident »), KPI, veille en 5 lignes, actions et
PR, effets mesurés, à décider, hors périmètre signalé, `rev` du doc partagé en fin de run.

Doc partagé : https://claude.ai/code/artifact/5d4cf936-dfeb-4516-bb57-2141b081edee ·
Base : [`seo/base-connaissances.md`](seo/base-connaissances.md) · Backlog : [`seo/backlog.md`](seo/backlog.md) ·
Journal des titres (règle des 28 jours) : [`../docs/SUIVI-BLOG-SEO.md`](../docs/SUIVI-BLOG-SEO.md).

## Entrées

### 2026-10-30 : run nocturne n° 10

- **Verdict : Stable** (pas d'alerte ; aucune mise à jour Google en cours).
- **Google** (`dataState: all`, 23 → 29/10, dernier jour provisoire) : 7 j 45 clics (−10 %), 2 236 impressions (−2 %) ; 28 j 165 clics, 7 703 impressions, CTR 2,14 %, position 8,7. Hausse : `jeux-cartes-4-joueurs` 1 → 4 clics, `jeux-cartes-5-joueurs` 1 → 4, `regle` 1 → 3.
- **Bing** (21 → 27/10) : 5 clics, 142 impressions (+13 %) ; 64 pages dans l'index.
- **Technique** : sitemap 100 % en 200, 0 anomalie, TTFB médian 279 ms. Inspection : 27/30 ; « explorées, non indexées » : `jeux-memoire-concentration` (exploration du 27/09) et `jeux-debutants-adultes` (22/09), relevées par la rotation, plus `jeux-draft-encheres` (24/10). Toutes ont moins de 10 impressions en 90 jours et 2 à 5 liens depuis d'autres articles : signal de faible demande plutôt que défaut technique ; ajoutées au bloc 1 du prompt Chrome (demande manuelle).
- **Veille** : 24 h : routine Surveillance (wrangler, Node 26.13 sur Railway), rien sur la surface SEO. GEO (WebSearch, prompts 7 à 9) : 0 sur 3.
- **Actions** : pas de modification de page (les pistes du jour sont déjà traitées : « annonce nombre de plis » sur `regle`, « tarot congolais » sur `tarot-africain`, titre Tarot Africain bloqué jusqu'au 15/11). Netlinking : 2 messages prêts dans le doc partagé (Gus&Co, World of Geek), journalisés dans `_notes/outreach/cibles.md`. Prompt Chrome : 2 pages ajoutées au bloc 1.
- **À décider** : inchangé.

### 2026-10-29 : run nocturne n° 9 (pas de run le 28/10)

- **Run du 28/10 non exécuté** : le réveil programmé du 27/10 à 23:10 UTC n'a atteint la session que le 28/10 à 23:08 UTC, en même temps que celui du 29/10 ; un seul run, celui-ci.
- **Verdict : Stable** (pas d'alerte ; aucune mise à jour Google en cours). Les clics repartent : 7 j 50 clics (+4 %).
- **Google** (`dataState: all`, 22 → 28/10, dernier jour provisoire) : 50 clics (+4 %), 2 356 impressions (+8 %) ; 28 j 161 clics, 7 616 impressions, CTR 2,11 %, position 8,8. Hausse : `jeux-cartes-4-joueurs` 0 → 5 clics, `jeux-comme-codenames` 2 → 6, `jeux-cartes-5-joueurs` 1 → 4, `regle` 1 → 3. « tarot africain » : 286 impressions, position 10,0, 0 clic (titre modifié le 18/10 : réévaluable le 15/11).
- **Bing** (19 → 25/10) : 7 clics, 140 impressions ; 63 pages dans l'index.
- **Technique** : sitemap 100 % en 200, 0 anomalie, TTFB médian 288 ms. Inspection : 29/30 ; `jeux-draft-encheres` toujours « explorée, non indexée » (pas réexplorée depuis le 24/10 : demande manuelle dans le prompt Chrome).
- **Veille** : 48 h : routine blog (Spiel des Jahres étendu aux 770 nominés et recommandés, second fichier de données), routine ventes (date limite de Noël concrète sur `idee-cadeau`, `js/livraison.js` ; audit commercial du 27/10), routine Surveillance (wrangler). GEO (WebSearch, prompts 4 à 6) : 0 sur 3.
- **Actions** (PR du run) : `jeux-comme-skyjo` : question de FAQ reformulée en « Quelles variantes de Skyjo essayer pour ne pas s'en lasser ? », réponse qui nomme les cinq variantes de l'article (requêtes « variante skyjo » 66 impressions, position 10,6 ; « skyjo variante » 28, position 9,9, sur octobre). Réévaluation : 2026-11-26.
- **À décider** : inchangé.

### 2026-10-27 : run nocturne n° 8

- **Verdict : Stable** (pas d'alerte ; aucune mise à jour Google en cours).
- **Google** (`dataState: all`, 20 → 26/10, dernier jour provisoire) : 7 j 41 clics (−18 %), 2 369 impressions (+12 %) ; 28 j 150 clics, 7 300 impressions, CTR 2,05 %, position 8,8. Requête « kyran » 6 → 0 clic (20 impressions, position 2,5) et accueil 10 → 1 clic : les 6 clics de marque des 21 derniers jours tombent tous entre le 13 et le 18/10 (1 à 2 par jour) ; position stable, pas de défaut SEO, pic de notoriété passé. Hausse : `jeux-comme-codenames` 3 → 6 clics, `jeux-cartes-4-joueurs` 1 → 4 clics.
- **Bing** (18 → 24/10) : 8 clics (+33 %), 130 impressions ; 63 pages dans l'index.
- **Technique** : sitemap 100 % en 200, 0 anomalie, TTFB médian 287 ms. Inspection : 30/30 indexées ; nouvel article `spiel-des-jahres-gagnants-1979-2026` (26/10) détecté, pas encore exploré ; toujours hors index : `jeux-draft-encheres` (explorée le 24/10, avant les liens du 25/10), `communaute` (détectée).
- **Veille** : 24 h : article de la routine blog « Spiel des Jahres 1979-2026 » (essai et données ouvertes) : sitemap et `llms.txt` à jour, soumis à Bing. GEO (WebSearch, prompts 1 à 3) : 0 sur 3.
- **Actions** (PR du run) : `jeux-cartes-4-joueurs` : FAQ « jeux de cartes à 4 avec 52 cartes » enrichie (Whist, Dame de pique, Président, Oh Hell!, belote à 32 cartes) ; requête « jeu de carte à 4 » : 35 impressions, position 10,8 (90 j). Réévaluation : 2026-11-24. Note : le contrôle de longueur des réponses FAQ (20 à 90 mots) fait partie de `npm test`, vérifier son code de sortie et pas seulement les lignes TAP.
- **À décider** : inchangé.

### 2026-10-26 : run nocturne n° 7 (lundi)

- **Verdict : À surveiller** (pas d'incident ; aucune mise à jour Google en cours). Clics 7 j −30 % mais impressions +15 % et position stable : le recul vient du week-end (24-25/10 : 4 et 5 clics, le 25 provisoire, contre 12 et 10 le week-end précédent) ; requêtes des pages en baisse masquées par Google (`jeux-comme-dixit` 9 → 3 clics). Pas d'action sur titre (règle 12) ; à revoir avec la semaine complète.
- **Google** (`dataState: all`, 19 → 25/10) : 7 j 38 clics (−30 %), 2 318 impressions (+15 %) ; 28 j 148 clics, 7 076 impressions, CTR 2,09 %, position 8,8. Hausse : `tarot-africain` 934 impressions, `jeux-cartes-4-joueurs` 2 → 4 clics (position 10,2 → 7,9).
- **Bing** (17 → 23/10) : 6 clics, 120 impressions (−15 %) ; 62 pages dans l'index (+3) ; 0 problème d'exploration ; `GetLinkCounts` : aucun lien entrant remonté.
- **Technique** : sitemap 100 % en 200, 0 anomalie, TTFB médian 286 ms. Inspection : 28/30 ; hors index `communaute` (détectée, jamais explorée) et `meilleurs-jeux-apero` (explorée le 21/07).
- **Veille** : 24 h : routine Surveillance (compatibility_date du Worker), rien sur la surface SEO. GEO (lundi, 9 prompts) : 0 sur 9.
- **Actions** (PR du run) : `faq.html` : question « Qu'est-ce que le jeu KYRAN ? » en tête (FAQ visible et JSON-LD `FAQPage`) : nom complet, genre, auteur, date de sortie, filiation Tarot Africain. Réévaluation : test GEO n° 8 chaque lundi, puis 2026-11-23.
- **À décider** : inchangé.

### 2026-10-25 : run nocturne n° 6

- **Verdict : Stable** (pas d'alerte ; aucune mise à jour Google en cours). Le −28 % de clics sur 7 j vient du 24/10, jour provisoire (0 clic, 212 impressions à 17 h) : pas d'action (règle 12).
- **Google** (`dataState: all`, 18 → 24/10) : 7 j 39 clics (−28 %, dernier jour provisoire), 2 104 impressions (+7 %) ; 28 j 141 clics, 6 663 impressions, CTR 2,12 %, position 8,9. `tarot-africain` 9 → 12 clics, 826 impressions.
- **Bing** (16 → 22/10) : 6 clics (+50 %), 126 impressions ; 59 pages dans l'index (+2).
- **Technique** : sitemap 100 % en 200, 0 anomalie, TTFB médian 274 ms. Inspection : 29/30 ; `blog/jeux-draft-encheres` « explorée, non indexée » (exploration du 24/10 ; 0 impression sur 90 j ; un seul lien depuis un article).
- **Veille** : 24 h : routine Surveillance (undici du Worker, SDK, filtre Safari de l'Auto-Heal), rien sur la surface SEO. GEO (WebSearch, prompts 7 à 9) : 0 sur 3 ; « c'est quoi le jeu KYRAN » toujours sur des homonymes (nom complet ajouté le 23/10 : trop tôt). Gus & Co publie une « sélection des meilleurs jeux de plis récents » (11/01/2026) : cible de netlinking possible.
- **Actions** (PR du run) : liens contextuels vers `jeux-draft-encheres` depuis `jeux-bluff-pari` (section enchères) et `jeux-comme-6-qui-prend` (For Sale). Réévaluation : inspection au prochain passage de Googlebot, puis 2026-11-22.
- **À décider** : inchangé.

### 2026-10-24 : run nocturne n° 5

- **Verdict : Stable** (pas d'alerte ; aucune mise à jour Google en cours).
- **Google** (`dataState: all`, 17 → 23/10, dernier jour provisoire) : 7 j 45 clics (−2 %), 2 075 impressions (+10 %) ; 28 j 135 clics, 6 375 impressions, CTR 2,12 %, position 8,9. Dernières 24 h (jusqu'au 23/10 13 h) : 9 clics, 316 impressions (J-7 : 10 / 244). `tarot-africain` 9 → 11 clics, 761 impressions ; `jeux-comme-codenames` 1 → 5 clics.
- **Bing** (13 → 19/10, pas de jour neuf) : 6 clics, 129 impressions ; 57 pages dans l'index.
- **Technique** : sitemap 100 % en 200, 0 anomalie, TTFB médian 282 ms. Inspection : 30/30 indexées ; nouvel article `jeux-cartes-moins-de-15-euros` indexé le jour même (23/10) ; `/blog/` désormais indexé ; toujours hors index : `meilleurs-jeux-apero` (explorée le 21/07), `video-regles` (détectée).
- **Veille** : 24 h : article de la routine blog `jeux-cartes-moins-de-15-euros` (sitemap, `llms.txt`, 60 pages le lient), routine Surveillance (wrangler, `/health` 1.6.0). GEO (WebSearch, prompts 4 à 6) : 0 sur 3.
- **Actions** (PR du run) : `tarot-africain.html` : question « Où jouer au Tarot Africain en ligne ? » dans la FAQ visible et le JSON-LD `FAQPage` (requête « tarot africain en ligne » : 29 impressions, position 10,5 sur 28 j). Réévaluation : 2026-11-21.
- **À décider** : inchangé.

### 2026-10-23 : run nocturne n° 4

- **Verdict : Stable** (pas d'alerte ; aucune mise à jour Google en cours).
- **Google** (`dataState: all`, 7 j glissants) : 42 clics (−2 %), 2 071 impressions (+15 %) ; 28 j CTR 2,09 %, position 9,0.
- **Bing** : 6 clics (+100 %), 129 impressions (−2 %) ; 57 pages dans l'index ; 0 erreur.
- **Technique** : sitemap 100 % en 200, 0 anomalie (`seo-health.py`, inspection de 30 URL).
- **Veille** : GEO (WebSearch, prompts 1 à 3) : 0 sur 3, mêmes sources que le 20/10 (Skull King, Chouineurs, Pili Pili ; regles2jeux et Board Game Arena pour le tarot africain ; World of Geek pour Skyjo). Les homonymes de « KYRAN » (22/10) motivent l'action du run.
- **Actions** (PR du run) : nom complet « KYRAN, Maître des Mystiques » ajouté en `alternateName` du nœud `#game` (JSON-LD de l'accueil) et en tête de `llms.txt` / `llms-full.txt`, pour lier la marque au jeu dans les moteurs et les IA.
- **À décider** : inchangé.

### 2026-10-22 : run nocturne n° 3 (lancé à 09:12, réveil arrivé avec 9 h de retard)

- **Verdict : En progrès** (pas d'alerte ; aucune mise à jour Google en cours). Run de jour : pas de conflit avec la routine blog (jeudi).
- **Google** (`dataState: all`, 15 → 21/10, dernier jour provisoire) : 7 j 46 clics (+15 %), 2 112 impressions (+21 %) ; 28 j 128 clics, 6 170 impressions, CTR 2,07 %, position 9,1. Dernières 24 h (jusqu'au 21/10 19 h) : 7 clics, 283 impressions (J-7 : 2 / 228). `jeux-bluff-pari` remonte (position 35,1 → 16,6) ; `tarot-africain` 7 → 10 clics, position 6,5.
- **Bing** (13 → 19/10) : 6 clics, 129 impressions ; 57 pages dans l'index (+1) ; 0 erreur.
- **Technique** : 52/52 URL du sitemap en 200, 0 anomalie, TTFB médian 280 ms. Inspection (30 URL) : 29 indexées ; hors index `meilleurs-jeux-apero` (explorée le 21/07, non indexée).
- **Veille** : 48 h : deux articles neufs du blog (`jeux-cartes-week-end-gite`, `marche-jeux-de-cartes-2026-2027`, ancien slug 2025 redirigé) : title, description, canonical, sitemap, `llms.txt` et liens internes vérifiés ; PDF des règles et fiches Tric Trac, Myludo, Okkazeo liés (21/10) ; routine Surveillance à 05:07 remplace la routine Santé. GEO (WebSearch, prompts 7 à 9) : 0 sur 3 ; « c'est quoi le jeu KYRAN » ne trouve pas le site (homonymes).
- **Actions** (PR du run) : `seo-keywords.json` : 12 requêtes partagées entre plusieurs pages ramenées à une page chacune, d'après la page que Google montre (Search Console, 90 j) ; « jeu de cartes apéro » confié à `meilleurs-jeux-apero` seul (seule page qui ait eu des impressions sur ces requêtes). Hors PR : 7 URL soumises à Bing (2 articles neufs, 5 pages modifiées le 21/10).
- **À décider** : inchangé.
- **Doc partagé** : tableau de bord, veille, journal (2 lignes) ; `rev` 28.

### 2026-10-21 : run nocturne n° 2

- **Verdict : Stable** (pas d'alerte ; aucune mise à jour Google en cours).
- **Google** (`dataState: all`, 14 → 20/10, dernier jour provisoire) : 7 j 44 clics (+19 %), 1 889 impressions (+10 %) ; 28 j 122 clics, 5 832 impressions, CTR 2,09 %, position 9,2. Dernières 24 h (jusqu'au 20/10 11 h) : 2 clics, 288 impressions (J-7 : 6 / 184), variation d'un jour, pas d'action. « kyran » : 0 → 6 clics sur 7 j, position 2,2.
- **Bing** (12 → 18/10) : 7 clics, 137 impressions ; 56 pages dans l'index ; 0 erreur. Les pages soumises le 20/10 sont maintenant découvertes et explorées (`GetUrlInfo` : idee-cadeau, jeux-comme-skull-king).
- **Technique** : 50/50 en 200, 0 anomalie, TTFB médian 282 ms. Inspection (30 URL) : 27 indexées ; hors index `/blog/` et `/video-regles.html` (détectées). `jeux-comme-skull-king` et `regles-rikiki` sont indexées (inconnues le 18/10).
- **Veille** : 24 h : routine ventes (refs d'origine sur le blog) et santé (Auto-Heal : règle WIF de Majordia) ; GEO (WebSearch, prompts 4 à 6) : 0 sur 3 (Trio, 13 Feuilles, The Last Wizard cités) ; « Kyran Corentin Sence » introuvable dans WebSearch : la marque n'a pas de mentions externes indexées.
- **Actions** (PR du run) : section « Jouer au Tarot Africain en ligne » (`#en-ligne`, requête « tarot africain en ligne » : 24 impressions, position 10,6 sur 28 j ; réponse rapide reliée) ; cibles de requête pour les 11 pages du sitemap qui n'en avaient pas (`seo-keywords.json`). Aucun title ni description : aucun n'a 28 jours (journal des titres, réévaluation à partir du 05/11).
- **Netlinking** : rien de neuf noté par Corentin ; pas de nouveau message (les 2 du 20/10 attendent).
- **À décider** : inchangé.
- **Doc partagé** : tableau de bord, veille, journal (2 lignes) ; `rev` 27.

### 2026-10-20 : premier run nocturne

- **Verdict : En progrès** (pas d'alerte ; aucune mise à jour Google en cours : spam de septembre finie vers le 08/10).
- **Google** (`dataState: all`, 13 → 19/10, dernier jour provisoire) : 7 j 48 clics (+50 %), 1 912 impressions (+22 %) ; 28 j 123 clics, 5 652 impressions, CTR 2,18 %, position 9,3. Dernières 24 h (jusqu'au 19/10 12 h) : 8 clics, 339 impressions (J-7 : 11 / 280). Marque « kyran » : 1 → 6 clics sur 7 j, position 4,2 → 2,4.
- **Bing** (11 → 17/10) : 6 clics (+100 %), 146 impressions (+23 %) ; 56 pages dans l'index ; 0 erreur d'exploration ; sitemap et flux RSS déjà déclarés (lus le 19/10).
- **Technique** : 50/50 URL du sitemap en 200, 0 anomalie, TTFB médian 306 ms. Inspection Google (30 URL) : 26 indexées ; hors index `/blog/`, `/a-propos.html`, `/video-regles.html` (détectées), `/blog/cadeau-anniversaire.html` (explorée le 29/08, non indexée). Accueil réexploré le 19/10 (après la refonte).
- **Veille** : BGG 480678 a maintenant une description (vide le 19/10), toujours 0 note et pas de site ; WebSearch ne trouve ni « KYRAN Maître des Mystiques » ni « kyran-jeu.fr » (homonymes footballeurs) ; GEO (WebSearch, prompts 1 à 3) : 0 sur 3, cités à la place Skull King, Chouineurs, Pili Pili, regles2jeux, BGA, World of Geek.
- **Actions** (PR du run) : images de partage 1200 × 630 (`og-kyran.jpg`) au lieu du logo carré sur 10 pages ; réponse directe « jeu de carte où l'on annonce le nombre de plis » sur `/regle.html` (requête : 37 impressions, position 10 sur 28 j) + cible dans `seo-keywords.json` ; réponse rapide « version moderne du Tarot Africain » qui nomme KYRAN (`/tarot-africain.html`, GEO) ; pays de livraison exacts dans `docs/SEO-GEO.md`. Hors PR : 8 URL soumises à Bing (`SubmitUrlBatch`) : idee-cadeau, video-regles, ressources-gratuites, regles-rikiki, jeux-comme-skull-king, `/blog/`, whist-22, a-propos. Aucun title ni description changé.
- **Netlinking** : connecteur Gmail absent de la session : 2 messages prêts dans le doc (Ludovox, formulaire ; Règles2jeux, adresse à trouver, site en 503 cette nuit).
- **À décider** : inchangé (Merchant Center, `priceValidUntil` 2027, pages légales, domaine GitHub, fiches externes) . Gmail : non, décision de Corentin du 20/10 (messages seulement préparés dans le doc).
- **Effet** : changement d'image de partage = `lastmod` du 19/10 sur 4 pages (le build compte la méta comme contenu) ; réévaluation de `/regle.html` et `/tarot-africain.html` le 17/11/2026.
- **Doc partagé** : tableau de bord, veille, journal (4 lignes) et messages de netlinking prêts ; `rev` 26.

### 2026-10-19 (soir) : chantier « SEO intense » (session interactive, audit A à K)

- **Verdict : En progrès.** Base de référence et audit complet dans `docs/rapports/seo-intense-2026-10-19.md` et le Google Doc « Audit et plan SEO de kyran-jeu.fr (19 octobre 2026) ».
- **Google** (API, données au 17/10) : 28 j 118 clics, 5 492 impressions, CTR 2,15 %, position 9,4 (28 j précédents : 51 / 3 705) ; 90 j 307 / 17 083. Inspection des 74 URL connues : 44/50 du sitemap indexées ; 10 anciennes URL `meta refresh` encore indexées ; `/blog/index.html` indexée à la place de `/blog/`.
- **Bing** : 28 j 17 clics / 425 impressions, 56 pages en index, 0 lien entrant ; 5 pages d'octobre inconnues.
- **Lighthouse mobile local** (médiane de 3) : accueil 98, commander 99, règle 99, Skyjo 97, Tarot 99.
- **Audit** : 101 constats retenus après vérification contradictoire (P1 4, tous hors code ; P2 20 ; P3 77), 5 écartés. Analyses K1 (chute du blog depuis la mise à jour anti-spam du 18-21/08) et K2 (demande de recherche) non menées faute de quota : au backlog.
- **PR #78** : `pages.yml` ne publie plus `_notes/` ni `.claude/` (KPI internes servis en 200), IndexNow sans pages noindex, préchargement de l'élément LCP de l'accueil, comparatif Amazon et nombre de cartes Pouvoir corrigés, `llms*.txt` exacts, Wikidata dans `sameAs`, encart KYRAN rétabli sur `/tarot-africain.html`, lien ODR mort retiré des CGV. Aucun title ni description touché.
- **À décider** : Merchant Center, `priceValidUntil` 2027, pages légales, vérification du domaine sur GitHub, fiches externes (BGG, Tric Trac, Lokidia).
- **Piège de mesure** : le rapport du 18/10 additionnait les lignes requête × page (ancres comprises) ; « tarot africain » 9-17/10 = 221 impressions, CTR 0,9 % au niveau requête, pas 1 134 et 0,2 %.

### 2026-10-19 : état initial (mise en place, session interactive)

- **Verdict : En progrès.**
- **Google** (Search Console, `dataState: all`) : 7 j du 12 au 18/10 : 54 clics (+69 %), 2 003 impressions
  (+32 %) ; 28 j : 125 clics, 5 662 impressions, CTR 2,21 %, position 9,3. Dernières 24 h : 8 clics, 355
  impressions (303 une semaine plus tôt). Marque « kyran » : 1 → 6 clics sur 7 j.
- **Bing** : 7 j au 17/10 : 6 clics, 146 impressions (+23 %) ; 56 pages dans l'index.
- **Technique** (`seo-health.py`, 50 URL du sitemap) : 0 anomalie ; inspection Google : 17 puis 18 URL sur 20
  indexées, `/blog/` « Découverte, non indexée », `meilleurs-jeux-apero` « Explorée, non indexée »,
  `/a-propos.html` inconnue.
- **Veille** : règles du blog durcies le 19/10 ; refonte des 13-14/10 suivie de la meilleure semaine depuis
  juillet ; 0 lien entrant ; Wikidata Q141623753 existe mais n'est pas dans les `sameAs`.
- **Mis en place** : `_notes/seo/` (base, backlog, historique KPI sur 90 jours), `scripts/seo-kpi-daily.py`,
  `scripts/seo-health.py`, mission de la routine, doc partagé (rev 20), session dédiée
  `session_01VsKUWwrZ4NnxRCubDJY5sX`.
- **À décider** : mesure d'audience sans cookie ; `priceValidUntil` 2027 ; clé `PAGESPEED_API_KEY`.
- **Premier run** : 2026-10-20 à 00:00 ; priorité aux pages hors index et aux `sameAs` Wikidata.
