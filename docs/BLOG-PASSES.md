# Passes éditoriales du blog

Le blog reçoit trois passes par semaine (lundi, mercredi, vendredi). À 6 h 50, heure de Paris, la
routine « Blog KYRAN passes (Sonnet 5.5) » réveille la session « Blog KYRAN — passes auto
lun/mer/ven », qui a ce dépôt attaché. Chaque passe produit **un** article neuf ou **un**
rafraîchissement, ou rien si aucun sujet ne tient. Le propriétaire a choisi, le 4 octobre 2026, une
publication entièrement automatique, sans relecture humaine : la passe ouvre sa PR puis la fusionne
elle-même dès que toutes ces conditions sont réunies : CI verte sur le dernier commit, aucun conflit,
aucun commentaire de relecture ouvert, et chaque point incertain sourcé ou retiré de l'article. Sinon
la PR reste ouverte et dit pourquoi. Publication visée : 9 h 30 le jour de la passe.

Ce fichier est lu en premier par chaque passe. Mettez-le à jour dans la PR de la passe : une ligne au
journal, et la liste « En attente » si un sujet est traité ou découvert.

## Protocole

1. **S'orienter** : `CLAUDE.md`, `_notes/lecon.md`, `docs/SEO-GEO.md` (dont le § 9 : audit Search
   Console du 4 octobre 2026, ce sont les données réelles disponibles), `scripts/content/README.md`
   (structure propre à chaque article : `layout`, `headings`, `authorNote`), la liste des articles
   (`scripts/content/roster.json`, y compris `redirects`, et `seo-keywords.json`) et les **PR ouvertes**.
2. **Juste avant d'écrire, puis juste avant de pousser** : `git fetch origin main` et relisez la liste
   des PR ouvertes ou fusionnées du jour. Une autre session peut retravailler le même article en
   parallèle (voir « Pièges connus »).
3. **Choisir** : données réelles d'abord (§ 9 : pages « explorées / détectées, non indexées ») ;
   sinon rafraîchir un article vieillissant ou rédigé à la main ; un article neuf seulement pour une
   intention de recherche absente du blog.
4. **Rechercher** : au moins 5 sources fiables réellement ouvertes (règles officielles en PDF, fiches
   éditeurs, Philibert…). Faits KYRAN : uniquement le dépôt. Aucun chiffre, prix, règle ou citation
   sans source liée.
5. **Rédiger** au format généré (`scripts/content/blog/<slug>.mjs`), avec une structure propre à
   l'article (le validateur signale le gabarit par défaut), sans jamais éditer le HTML généré.
   KYRAN : réponse honnête, jamais « sans élimination » ni « sans hasard ».
6. **Contrôler** : relecture adversariale de chaque fait, liens (200), `node scripts/validate-articles.mjs <slug>`,
   `npm run build`, `npm test`.
7. **PR** : sources, images (crédit + licence), section « À vérifier par le relecteur », résultat des
   tests ; puis fusion aux conditions ci-dessus. Personne ne relit : un fait sans source fiable est
   retiré avant la fusion, jamais laissé à un relecteur.
8. **Après la fusion** : vérifiez la page en ligne (kyran-jeu.fr/blog/<slug>.html, sitemap, flux).

## Pièges connus

- **Deux sessions sur le même article.** Le 4 octobre 2026, une passe a réécrit `jeux-cartes-6-joueurs`
  pendant que la PR #16 (audit Search Console) le fusionnait avec l'article à cinq joueurs et le
  faisait entrer dans `main`. La passe a dû abandonner sa version pour celle de `main` et n'y porter
  que ses corrections vérifiées. D'où l'étape 2 du protocole.
- Ne lancez pas le build avec `SITE_TODAY` dans le futur : `check-site` refuse un `lastmod` futur. Un
  rafraîchissement garde sa `date` de première publication ; `dateModified` prend la date du build.
- Un article rédigé à la main passe au format généré en déplaçant son slug de `handwritten` vers
  `generated` dans `roster.json` et en retirant son entrée de `handwritten.json` (même URL).
- Liens externes : peu nombreux (une référence par jeu depuis le § 9, plus les sources citées).
- BoardGameGeek bloque les accès automatiques (403) ; vérifiez un identifiant avec
  `https://api.geekdo.com/api/geekitems?objectid=<id>&objecttype=thing&subtype=boardgame`. Les PDF de
  règles des éditeurs (Gigamic, IELLO, Amigo, Ludonaute, Space Cowboys) répondent et se lisent avec
  `pdftotext`.
- Changer un prix dans `games.json` modifie tous les articles qui citent ce jeu : vérifiez d'abord
  qu'aucun texte d'article ne cite l'ancien prix (`grep` dans `scripts/content/blog/`).

## Journal

| Date | Type | Article | Mot-clé principal | PR |
|---|---|---|---|---|
| 2026-10-04 | Corrections sur l'article « 5 ou 6 joueurs » de #16 (la réécriture « 6 joueurs » de la passe a été abandonnée), liens des fiches, prix | `jeux-cartes-6-joueurs` | jeu de cartes 6 joueurs | [#18](https://github.com/Cmssmc-code/kyran-jeu/pull/18) |
| 2026-10-04 | Rafraîchissement : passage au format généré, fiche KYRAN corrigée (« 2024 » → sortie 31 janvier 2026), 7 jeux revérifiés (Love Letter retiré). **Sujet pris : ne pas le reprendre.** | `jeux-cartes-adultes` | jeu de cartes adulte | (à venir) |
| 2026-10-05 | Rafraîchissement : faits des 8 jeux revérifiés, fiche KYRAN corrigée (manche Mystique), « Skyjo supprime la défausse » corrigé, Love Letter (édition actuelle), structure propre. **Sujet pris : ne pas le reprendre.** | `alternatives-uno` | alternatives à uno | (cette PR) |

## En attente

Rafraîchissements repérés (par ordre de priorité) :

1. **Contenu de première main** demandé au propriétaire dans `docs/SEO-GEO.md` § 9 (photos de parties,
   retours de test, `authorNote`) : à intégrer dès qu'il est fourni, en commençant par les articles
   du « jour 1 ».
2. **Autres articles à revérifier** (relevé du 5 octobre 2026 lors de `alternatives-uno`) : Love Letter existe
   en deux éditions (classique 2012 : 16 cartes, 2 à 4 joueurs ; Z-Man 2025 : 21 cartes, 2 à 6 joueurs ;
   Philibert affiche « dès 14 ans », Z-Man 10+). Les articles qui parlent de « seize cartes » ou de
   « 2 à 4 joueurs » (par ex. `jeux-3-joueurs`) sont à préciser. Jungle Speed : année incertaine selon les
   sources (BGG 1997, Wikipédia 1991 ou 1996) : ne pas l'afficher sans source primaire.

Liens externes des fiches de jeux (`scripts/lib/game-links.mjs`) : tous revérifiés le 4 octobre 2026
(#18 puis passe dédiée). Chaque identifiant BGG est contrôlé par l'API geekdo (nom et auteur), chaque
lien Wikipédia vient des sitelinks Wikidata (article français s'il existe, sinon anglais) et répond 200.
Timeline, Parade, Letter Jam, L.L.A.M.A. et The Game n'ont d'article ni en français ni en anglais :
pas de clé `wiki`. Les liens de l'article rédigé à la main `jeux-cartes-adultes` ont été corrigés de
la même façon.

Écarts relevés dans `games.json` le 4 octobre 2026 et non corrigés (des textes en dépendent) :

| Jeu | `games.json` | Source officielle ou boutique |
|---|---|---|
| Codenames | 2 à 8+, ~20 € | Nouvelle édition 2025 : 4 à 8+ (CGE, IELLO) ; 21,95 € chez Philibert ; `cadeau-anniversaire` dit « 15 à 20 € » |
| Dixit | 3 à 6 | Édition actuelle : 3 à 8 (Libellud) ; 3 à 6 pour l'édition de 2008 |
| Coup | 10+, ~14 € | 13+ (Indie Boards & Cards) ; VO 20,50 € chez Philibert ; la VF « Complots » (Ferti) est un autre produit (2 à 8 joueurs) |
| 6 qui prend ! | 10+ | 8+ sur les fiches Gigamic et Amigo actuelles ; 10 ans dans la règle française de 2012 et chez Philibert |
| Timeline | 2011 | La fiche BGG liée (« Timeline: Classic », Frédéric Henry) date de 2018 ; la série commence en 2010 (« Timeline: Inventions ») |
| Oh Hell! | auteur « Traditionnel » | Publié en JSON-LD comme `Person` nommée « Traditionnel » ; jeu traditionnel sans auteur |
