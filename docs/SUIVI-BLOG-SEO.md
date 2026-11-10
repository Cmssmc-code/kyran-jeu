# Suivi SEO du blog (passes du lundi)

Alimenté chaque lundi par la passe du blog (étape 9 de `docs/BLOG-PASSES.md`). Mesures : serveurs MCP
`gsc` et `bing-webmaster` (`docs/MCP_SEO.md`), lecture seule. Mesure indisponible : écrire « non mesuré ».
Mesure de référence avant ce suivi : `docs/rapports/seo-mesure-2026-10-18.md`.

## Bilans hebdomadaires

Plus récent en premier. Pour chaque lundi : pages et clusters publiés sur 7 jours ; clics, impressions,
CTR et position sur 28 jours, comparés au bilan précédent ; actions menées ; trois sujets proposés à
partir des requêtes réelles.

### Lundi 9 novembre 2026

- **Mesure** : les serveurs MCP `gsc` et `bing-webmaster` ne se sont pas connectés (« connection closed »). Search Console a été lue directement par l'API (compte de service de la routine SEO, portée `webmasters.readonly`, aucune écriture) ; **Bing non mesuré**. Période : 28 jours du 11 octobre au 7 novembre 2026, comparés aux 28 jours du 13 septembre au 10 octobre.
- **Site entier** : 199 clics, 8 515 impressions, CTR 2,34 %, position moyenne 8,6 (contre 70 clics, 4 331 impressions, 1,62 %, 9,1). **Blog** (`/blog/`) : 133 clics, 5 268 impressions, CTR 2,52 %, position 9,8 (contre 49 clics, 2 483 impressions, 1,97 %, 10,2). Les chiffres du bilan du 2 novembre venaient du relevé nocturne sur une autre fenêtre : ils ne se comparent pas ligne à ligne.
- **Pages du blog** : `jeux-comme-skyjo` en tête (17 clics, 922 impressions, CTR 1,84 %, position 8,4 ; requête n° 1 « variante skyjo », 74 impressions, position 10,5). En page 1 sous 2 % de CTR : `alternatives-uno` (1,39 %, position 7,5), `jeux-cartes-adultes` (1,33 %, 8,0), `jeux-cartes-seniors` (0 %, 7,8), `alternatives-belote-coinche` (1,73 %, 8,8). Au-delà de la position 15 : `jeux-3-joueurs` (18,9 ; « jeu de carte a 3 » en 38), `jeux-bluff-pari` (24,6 ; « jeux de bluff » en 45), `jeux-duo-couples` (18,8 ; « jeux de carte a deux » en 36), `jeux-soiree-amis` (24,1), `jeux-plis-comparatif` (15,1 ; « jeux de plis » en 27).
- **Réévaluation des titres du 8 au 11 octobre** (prévue le 5 novembre) : `/tarot-africain.html` passe de 14 clics, 1 441 impressions, CTR 0,97 %, position 7,7 à 35 clics, 2 583 impressions, CTR 1,36 %, position 6,6. Titre conservé.
- **Pistes CTR** : titres réécrits pour `alternatives-uno` (dernier changement le 2 octobre) et `jeux-cartes-adultes` (4 octobre), voir le journal des titres. Non retouchés car changés il y a 28 jours ou moins : `jeux-comme-skyjo` (14 octobre), `jeux-cartes-seniors` et `alternatives-belote-coinche` (12 octobre) ; à revoir lundi prochain.
- **Pistes classement** : un lien interne avec la requête en ancre vers chaque page mal classée : « jeux de cartes de bluff » depuis `jeux-cartes-adultes` vers `jeux-bluff-pari`, « jeux de cartes à deux » depuis `jeux-cartes-solo` vers `jeux-duo-couples`, « jeux de cartes à 3 » depuis `alternatives-belote-coinche` vers `jeux-3-joueurs`.
- **Pages non indexées** : `jeux-30-minutes` (« Explorée, non indexée ») et `communaute.html` (« URL inconnue »). Non traitées dans cette passe : notées dans « En attente » de `docs/BLOG-PASSES.md`.
- **Publié sur 7 jours** : `prix-jeux-de-cartes-releve` (6 novembre, essai), prix datés du relevé du 6 novembre dans `jeux-comme-skyjo`, `alternatives-uno`, `jeux-comme-dixit`, `jeux-cartes-4-joueurs` et `jeux-cartes-6-joueurs` (7 au 9 novembre), `jeux-comme-president` (9 novembre, guide neuf, cette PR).
- **Sujets proposés** (requêtes réelles) : variantes de règles de Skyjo (« variante skyjo », 74 impressions, position 10,5), à traiter en enrichissement de `jeux-comme-skyjo` ; enrichissement de `jeux-bluff-pari` face à « jeux de bluff » (position 45) ; enrichissement de `jeux-3-joueurs` face à « jeu de carte a 3 » (position 38).

### Lundi 2 novembre 2026

- **Mesure** : les serveurs MCP `gsc` et `bing-webmaster` n'ont pas pu se connecter pendant la passe (« connection closed ») : requêtes, pages classées, pages hors index et CTR par page, **non mesurés**. Aucun titre n'a été réécrit : la réévaluation des titres changés du 8 au 11 octobre est fixée au 5 novembre.
- **Chiffres du site entier** (relevé de la routine SEO nocturne, `_notes/seo/kpi-quotidiens.csv`, Search Console ; les 31 octobre et 1er novembre sont provisoires) : du 26 octobre au 1er novembre, 44 clics et 1 930 impressions (CTR 2,28 %), contre 38 clics et 2 318 impressions du 19 au 25 octobre ; sur 28 jours (5 octobre au 1er novembre), 173 clics et 7 975 impressions (CTR 2,17 %), contre 148 clics et 7 076 impressions (CTR 2,09 %) au bilan précédent. Ces chiffres ne distinguent pas le blog du reste du site.
- **Publié sur 7 jours** : `spiel-des-jahres-gagnants-1979-2026` étendu aux nominés et recommandés (28 octobre), section d'octobre ajoutée à `marche-jeux-de-cartes-2026-2027` (30 octobre), images d'en-tête et de fiches refaites sur tout le blog (1er et 2 novembre), `jeux-cartes-solo` (2 novembre, guide neuf).
- **Sujets proposés** (sans requête réelle, faute de mesure ; à confirmer par les données du lundi suivant) : règles de fin de partie de quinze jeux de plis (article de référence, prochain article neuf selon l'alternance) ; prix constatés de dix jeux de cartes dans trois boutiques ; jeux de cartes à deux joueurs relevés chez les éditeurs, en complément de `jeux-duo-couples`.

### Lundi 26 octobre 2026

- **Mesure** : les serveurs MCP `gsc` et `bing-webmaster` n'étaient pas disponibles dans la session de la passe : requêtes, pages classées, pages hors index et CTR par page, **non mesurés**. Aucun titre n'a été réécrit (rien à justifier, et le dernier changement de titres date du 8 au 11 octobre : réévaluation au 5 novembre).
- **Chiffres du site entier** (relevé de la routine SEO nocturne, `_notes/seo/kpi-quotidiens.csv`, Search Console ; les 24 et 25 octobre sont provisoires) : du 19 au 25 octobre, 38 clics et 2 318 impressions (CTR 1,64 %), contre 54 clics et 2 018 impressions du 12 au 18 octobre ; sur 28 jours (28 septembre au 25 octobre), 148 clics et 7 076 impressions (CTR 2,09 %), contre 55 clics et 3 395 impressions sur les 28 jours précédents. Ces chiffres ne distinguent pas le blog du reste du site.
- **Publié sur 7 jours** : `marche-jeux-de-cartes-2026-2027` et `jeux-cartes-week-end-gite` (21 octobre), `as-dor-palmares-1988-2026` (22 octobre, avec jeu de données), `jeux-cartes-moins-de-15-euros` (23 octobre), `spiel-des-jahres-gagnants-1979-2026` (26 octobre, avec jeu de données).
- **Sujets proposés** (sans requête réelle, faute de mesure ; à confirmer par les données du lundi suivant) : prix constatés de dix jeux de cartes dans trois boutiques ; règles de fin de partie de quinze jeux de plis ; fiches de jeux de cartes relevées chez les éditeurs.

## Journal des titres

Un titre (`metaTitle` et `description`) ne se retouche pas avant 28 jours. Réévaluer à la date indiquée.

| Date | Page | Requête n° 1 | Ancien `metaTitle` | Nouveau `metaTitle` | Réévaluer le |
|---|---|---|---|---|---|
| 2026-11-09 | `/blog/alternatives-uno.html` | alternative uno (ex aequo avec « jeu comme le uno ») | Alternatives à Uno : 8 jeux de cartes plus fun en 2026 | Alternative à Uno : 8 jeux de cartes, dès 6 ans ou entre adultes | 2026-12-07 |
| 2026-11-09 | `/blog/jeux-cartes-adultes.html` | jeu de cartes pour adultes | Jeux de cartes pour adultes : 7 choix selon la table | Jeu de cartes pour adultes : 7 jeux pour parier, bluffer, coopérer | 2026-12-07 |
| 2026-10-08 à 11 | `/tarot-africain.html`, autres pages (rapport du 13 octobre) | voir `docs/rapports/seo-mesure-2026-10-18.md` | — | — | 2026-11-05 |
| 2026-11-10 | `/blog/jeux-30-minutes.html` | Bing (octobre) : « meilleurs jeux de cartes rapides en moins de 30 minutes », 8 impressions, position 2,2, 0 clic ; page : 34 impressions, position 2,4, 1 clic | Jeux de 30 minutes max : 9 jeux de cartes rapides à jouer | Meilleurs jeux de cartes rapides (moins de 30 min) : 9 choix | 2026-12-08 |
| 2026-11-10 | `/tarot-africain.html` (description seule) | « tarot africain » : 695 impressions, position 9,6, 3 clics (Google, 12/10 → 08/11) ; « tarot africain en ligne » : 73 impressions, position 9,5 | inchangé (Tarot Africain (Whist 22) : règles + feuille de score PDF) | inchangé ; description : « … Règle pas à pas, exemple, feuille PDF et où jouer en ligne. » | 2026-12-08 |
| 2026-11-10 | `/blog/jeux-comme-skyjo.html` | « variante skyjo » : 101 impressions, position ~10 (Google, 28 j) ; « skyjo avec jeu de carte classique » position 21,5 ; « jeux comme skyjo » 4 impressions, position 22 | Jeux comme Skyjo : 10 alternatives + Skyjo avec 52 cartes | Skyjo : 5 variantes, règle à 52 cartes et 10 jeux similaires | 2026-12-08 |
