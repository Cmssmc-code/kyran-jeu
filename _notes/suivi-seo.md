# Suivi de la routine SEO & GEO de KYRAN

Journal de la routine nocturne (`_notes/seo-routine-mission.md`), entrée la plus récente en haut. Chaque entrée :
date, verdict (« En progrès », « Stable », « À surveiller », « Incident »), KPI, veille en 5 lignes, actions et
PR, effets mesurés, à décider, hors périmètre signalé, `rev` du doc partagé en fin de run.

Doc partagé : https://claude.ai/code/artifact/5d4cf936-dfeb-4516-bb57-2141b081edee ·
Base : [`seo/base-connaissances.md`](seo/base-connaissances.md) · Backlog : [`seo/backlog.md`](seo/backlog.md) ·
Journal des titres (règle des 28 jours) : [`../docs/SUIVI-BLOG-SEO.md`](../docs/SUIVI-BLOG-SEO.md).

## Entrées

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
