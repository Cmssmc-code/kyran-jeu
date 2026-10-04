# Passes éditoriales du blog

Le blog reçoit trois passes par semaine (lundi, mercredi, vendredi, routine « Blog KYRAN passe
editoriale » lancée à 6 h 50, heure de Paris). Chaque passe produit **un** article neuf ou **un**
rafraîchissement, ou rien si aucun sujet ne tient. Elle ouvre une PR prête pour relecture : un humain
la relit et la fusionne (publication visée : 9 h 30 le jour de la passe). Aucune fusion automatique.

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
7. **PR** : sources, images (crédit + licence), section « À vérifier par le relecteur », résultat des tests.

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

## En attente

Rafraîchissements repérés (par ordre de priorité) :

1. **`jeux-cartes-adultes`** (rédigé à la main, 11 septembre 2026) : la fiche KYRAN indique encore
   « Auteur Corentin Sence · 2024 » (sortie : 31 janvier 2026). À passer au format généré, faits revérifiés.
2. **`alternatives-uno`** : parle d'une « manche finale à une seule carte » pour KYRAN ; la manche
   Mystique clôt chaque cycle, puis on repart à sept cartes.
3. **Contenu de première main** demandé au propriétaire dans `docs/SEO-GEO.md` § 9 (photos de parties,
   retours de test, `authorNote`) : à intégrer dès qu'il est fourni, en commençant par les articles
   du « jour 1 ».

Liens externes des fiches de jeux (`scripts/lib/game-links.mjs`), contrôlés le 4 octobre 2026 : ceux
de Skull, Wizard, Colt Express, For Sale, Saboteur et 6 qui prend ! sont corrigés (#18). Restent faux
(identifiant BGG d'un autre jeu) : Skyjo, Dixit, Oh Hell!, Parade, Schotten Totten, Letter Jam, Monopoly
Deal ; restent en 404 sur Wikipédia : Lost Cities, Timeline, Bang!, Oh Hell!, Parade, Schotten Totten,
Sushi Go!, Coup, No Thanks!, Letter Jam, Monopoly Deal, Llama, The Game. Ils nourrissent le `sameAs` du
JSON-LD : à corriger en une passe dédiée (Wikidata, propriété P2339, donne l'identifiant BGG et les
pages Wikipédia).

Écarts relevés dans `games.json` le 4 octobre 2026 et non corrigés (des textes en dépendent) :

| Jeu | `games.json` | Source officielle ou boutique |
|---|---|---|
| Codenames | 2 à 8+, ~20 € | Nouvelle édition 2025 : 4 à 8+ (CGE, IELLO) ; 21,95 € chez Philibert ; `cadeau-anniversaire` dit « 15 à 20 € » |
| Dixit | 3 à 6 | Édition actuelle : 3 à 8 (Libellud) ; 3 à 6 pour l'édition de 2008 |
| Coup | 10+, ~14 € | 13+ (Indie Boards & Cards) ; VO 20,50 € chez Philibert ; la VF « Complots » (Ferti) est un autre produit (2 à 8 joueurs) |
| 6 qui prend ! | 10+ | 8+ sur les fiches Gigamic et Amigo actuelles ; 10 ans dans la règle française de 2012 et chez Philibert |
