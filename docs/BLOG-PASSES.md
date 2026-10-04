# Passes éditoriales du blog

Le blog reçoit trois passes par semaine (lundi, mercredi, vendredi, routine « Blog KYRAN passe
editoriale » lancée à 6 h 50, heure de Paris). Chaque passe produit **un** article neuf ou **un**
rafraîchissement, ou rien si aucun sujet ne tient. Elle ouvre une PR prête pour relecture : un humain
la relit et la fusionne (publication visée : 9 h 30 le jour de la passe). Aucune fusion automatique.

Ce fichier est lu en premier par chaque passe. Mettez-le à jour dans la PR de la passe : une ligne au
journal, et la liste « En attente » si un sujet est traité ou découvert.

## Protocole

1. **S'orienter** : `CLAUDE.md`, `_notes/lecon.md`, `docs/SEO-GEO.md`, `scripts/content/README.md`,
   la liste des articles (`scripts/content/roster.json`, `seo-keywords.json`) et les **PR ouvertes**
   (ne jamais reprendre un sujet en cours dans une PR non fusionnée).
2. **Choisir** : données réelles (exports Search Console / Bing fournis) d'abord ; sinon rafraîchir
   un article vieillissant ou rédigé à la main ; un article neuf seulement pour une intention de
   recherche absente du blog.
3. **Rechercher** : au moins 5 sources fiables réellement ouvertes (règles officielles en PDF, fiches
   éditeurs, Philibert…). Faits KYRAN : uniquement le dépôt. Aucun chiffre, prix, règle ou citation
   sans source liée.
4. **Rédiger** au format généré (`scripts/content/blog/<slug>.mjs`), sans jamais éditer le HTML
   généré. KYRAN : réponse honnête, jamais « sans élimination » ni « sans hasard ».
5. **Contrôler** : relecture adversariale de chaque fait, liens (200), `node scripts/validate-articles.mjs <slug>`,
   `npm run build`, `npm test`.
6. **PR** : sources, images (crédit + licence), section « À vérifier par le relecteur », résultat des tests.

## Pièges connus

- Ne lancez pas le build avec `SITE_TODAY` dans le futur : `check-site` refuse un `lastmod` futur. Un
  rafraîchissement garde sa `date` de première publication ; `dateModified` prend la date du build.
- Un article rédigé à la main passe au format généré en déplaçant son slug de `handwritten` vers
  `generated` dans `roster.json` et en retirant son entrée de `handwritten.json` (même URL).
- Liens externes : 4 à 8 URL distinctes. Un tableau de sources dans `extraSections` les regroupe bien.
- BoardGameGeek bloque les accès automatiques (403) ; les PDF de règles des éditeurs (Gigamic, IELLO,
  Amigo, Ludonaute, Space Cowboys) répondent et se lisent avec `pdftotext`.
- Changer un prix dans `games.json` modifie tous les articles qui citent ce jeu : vérifiez d'abord
  qu'aucun texte d'article ne cite l'ancien prix (`grep` dans `scripts/content/blog/`).

## Journal

| Date | Type | Article | Mot-clé principal | PR |
|---|---|---|---|---|
| 2026-10-04 | Rafraîchissement (passage au format généré) | `jeux-cartes-6-joueurs` | jeu de cartes 6 joueurs | branche `claude/busy-rubin-xb9jj9` |

## En attente

Rafraîchissements repérés (par ordre de priorité) :

1. **`jeux-cartes-adultes`** (rédigé à la main, 11 septembre 2026) : même génération que l'ancien
   article à six joueurs, avec la même erreur « Auteur Corentin Sence · 2024 » sur la fiche KYRAN
   (sortie : 31 janvier 2026). À passer au format généré, faits revérifiés.
2. **`science-jeux-de-cartes-cerveau`** (rédigé à la main) : allégations de santé, références à faire
   relire par une personne qualifiée (voir `docs/SEO-GEO.md`, § 8).
3. **`alternatives-uno`** : parle d'une « manche finale à une seule carte » pour KYRAN ; la manche
   Mystique clôt chaque cycle, puis on repart à sept cartes.

Écarts relevés dans `games.json` le 4 octobre 2026 (à corriger avec les textes qui en dépendent) :

| Jeu | `games.json` | Source officielle ou boutique |
|---|---|---|
| Skull | ~15 € | 17,95 € chez Philibert ; textes dépendants : FAQ de `cadeau-anniversaire`, fiche de `jeux-cartes-pas-chers` |
| Codenames | 2 à 8+, ~20 € | Nouvelle édition 2025 : 4 à 8+ (CGE, IELLO) ; 21,95 € chez Philibert |
| Dixit | 3 à 6 | Édition actuelle : 3 à 8 (Libellud) ; 3 à 6 pour l'édition de 2008 |
| Coup | 10+, ~14 € | 13+ (Indie Boards & Cards) ; VO 20,50 € chez Philibert ; la VF « Complots » (Ferti) est un autre produit (2 à 8 joueurs) |
| 6 qui prend ! | 10+ | 8+ sur les fiches Gigamic et Amigo actuelles ; 10 ans dans la règle française de 2012 et chez Philibert |
