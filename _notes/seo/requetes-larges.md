# 30 requêtes larges : position et page cible

Objectif (tâche t101, ordre du 26/11/2026) : au 31/12/2026, 10 de ces requêtes dans le top 3 d'au moins un
moteur (Google, Bing ou Brave). On vise d'abord les requêtes précises (apéro, ado, Noël 2026, pas cher, 2027),
puis les têtes (« jeux de cartes ») où Amazon, Philibert et la Fnac dominent : la 1re place n'y est pas promise.

Règles : aucun titre de page retouché avant 28 jours ; les pages nouvelles sont des sélections honnêtes où
KYRAN figure parmi d'autres jeux, comme les articles actuels du blog.

Volumes : estimation d'une IA gratuite (GLM-4.7-flash, 26/11), ordre de grandeur mensuel en France en
saison de Noël, non vérifié par un outil de mots-clés. Positions : Search Console et Bing Webmaster sur
28 jours (29/10 → 25/11) ; « - » veut dire aucune impression (au-delà de la 5e page environ). Les positions
Bing et Brave en direct sont relevées chaque lundi par la routine « Kyran · Relevé des 3 moteurs » dans
[`releve-moteurs.csv`](releve-moteurs.csv) (premier passage le 30/11).

| # | Requête | Volume | Difficulté | Google 28 j | Bing 28 j | Page cible |
|---|---------|--------|------------|-------------|-----------|------------|
| 1 | jeux de cartes | 50 000+ | forte | - | - | `/` (maillage interne) |
| 2 | jeu de cartes | 20 000+ | forte | - | - | `/` (maillage interne) |
| 3 | jeux de cartes 2026 | 1 000+ | faible | - | - | à créer : `blog/meilleurs-jeux-de-cartes-2026.html` |
| 4 | meilleur jeu de cartes 2026 | 1 000+ | faible | - | - | à créer : `blog/meilleurs-jeux-de-cartes-2026.html` |
| 5 | jeux de cartes 2027 | 500+ | faible | - | - | à créer : `blog/nouveaux-jeux-de-cartes-2027.html` |
| 6 | nouveau jeu de cartes | 2 000+ | moyenne | - | - | à créer : `blog/nouveaux-jeux-de-cartes-2027.html` |
| 7 | jeux de société pas cher | 30 000+ | moyenne | - | - | à créer : `blog/jeux-de-societe-pas-chers.html` |
| 8 | jeu de cartes pas cher | 20 000+ | forte | - | - | `blog/jeux-cartes-moins-de-15-euros.html` |
| 9 | petit cadeau jeu de société | 2 000+ | moyenne | - | - | `blog/cadeau-moins-de-10-euros.html` |
| 10 | idée cadeau jeu de cartes | 20 000+ | moyenne | - | - | à créer : `blog/idees-cadeaux-jeu-de-cartes.html` |
| 11 | jeux pour noël | 50 000+ | forte | - | - | `blog/cadeau-noel.html` |
| 12 | jeu de cartes noël 2026 | 500+ | faible | - | 1,0 | `blog/cadeau-noel.html` |
| 13 | jeux apéro | 5 000+ | moyenne | - | - | `blog/meilleurs-jeux-apero.html` |
| 14 | jeu de cartes apéro | 3 000+ | moyenne | - | 1,0 | `blog/meilleurs-jeux-apero.html` |
| 15 | jeux ado | 5 000+ | moyenne | - | - | `blog/jeux-cartes-ados.html` |
| 16 | jeu de cartes ado | 2 000+ | moyenne | - | 2,0 | `blog/jeux-cartes-ados.html` |
| 17 | jeu de cartes famille | 3 000+ | moyenne | - | - | `blog/jeux-famille.html` |
| 18 | jeu de cartes enfant 8 ans | 2 000+ | moyenne | - | - | à créer : `blog/jeux-cartes-enfants-8-ans.html` |
| 19 | jeu de cartes entre amis | 2 000+ | moyenne | - | - | `blog/jeux-soiree-amis.html` |
| 20 | jeux de société soirée entre amis | 3 000+ | moyenne | 15 | - | `blog/jeux-soiree-amis.html` |
| 21 | jeu de cartes 4 joueurs | 1 000+ | moyenne | 8 | - | `blog/jeux-cartes-4-joueurs.html` |
| 22 | jeu de cartes 6 joueurs | 1 000+ | moyenne | 12 | - | `blog/jeux-cartes-6-joueurs.html` |
| 23 | jeu de cartes original | 2 000+ | moyenne | - | - | à créer : `blog/jeux-cartes-originaux.html` |
| 24 | jeu de cartes stratégie | 2 000+ | moyenne | - | - | `blog/jeux-strategie-legere.html` |
| 25 | jeu de cartes rapide | 1 000+ | moyenne | - | - | `blog/jeux-30-minutes.html` |
| 26 | jeu de cartes simple à apprendre | 500+ | faible | - | - | `blog/jeux-debutants-adultes.html` |
| 27 | jeu de cartes voyage | 500+ | faible | - | - | `blog/jeux-vacances-voyage.html` |
| 28 | jeu de plis | 500+ | faible | 28,3 | - | `blog/guide-jeux-de-plis.html` |
| 29 | jeu de cartes comme uno | 500+ | faible | 7 | 2,0 | `blog/alternatives-uno.html` |
| 30 | jeu comme skyjo | 500+ | faible | 12,8 | 2,3 | `blog/jeux-comme-skyjo.html` |

## Pages à créer (rédactrice, 3 par semaine au moins)

Semaine du 30/11 : `meilleurs-jeux-de-cartes-2026`, `idees-cadeaux-jeu-de-cartes`, `jeux-de-societe-pas-chers`.
Semaine du 07/12 : `nouveaux-jeux-de-cartes-2027`, `jeux-cartes-enfants-8-ans`, `jeux-cartes-originaux`.
Ensuite : nouvelles requêtes larges repérées dans Search Console et Bing chaque lundi.

## Maillage interne vers l'accueil

Dans chaque page cible ci-dessus, une phrase du corps (jamais le titre) renvoie vers `/` avec une ancre de la
famille « jeu de cartes » (« jeu de cartes KYRAN », « jeu de cartes de plis et de paris »), une seule par page,
ancres variées d'une page à l'autre.

## Liens tiers

L'attachée de presse vise les classements « meilleurs jeux de cartes 2026 », « Noël », « apéro », « pas cher »
des blogs et médias pour y faire entrer KYRAN, sans jeu promis ni offert.

## Constat au départ (26/11)

- Longue traîne déjà bien placée sur Bing : « jeu de carte apéro » 1, « jeu de carte noel 2026 » 1,
  « jeu de carte ado » 2, « jeux comme skyjo » 2,3, « meilleurs jeux de cartes rapides en moins de 30 minutes » 2,2.
- Aucune impression sur les têtes « jeux de cartes », « jeu de cartes », « jeux de société pas cher »,
  « jeux pour noël » chez Google et Bing.
- Google : nos articles sortent surtout entre la 7e et la 45e place (« jeu de carte a 3 » 32,7 ;
  « jeu de bluff » 41,9 ; « jeu comme dixit » 6,4 ; « jeu comme le uno » 9,1).
