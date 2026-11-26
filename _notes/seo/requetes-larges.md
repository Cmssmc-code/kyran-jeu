# 30 requêtes larges : position et page cible

Objectif (tâche t101, ordre du 26/11/2026) : au 31/12/2026, 10 de ces requêtes dans le top 3 d'au moins un
moteur (Google, Bing ou Brave). On vise d'abord les requêtes précises (apéro, ado, Noël 2026, pas cher, 2027),
puis les têtes (« jeux de cartes ») où Amazon, Philibert et la Fnac dominent : la 1re place n'y est pas promise.

Règles : aucun titre de page retouché avant 28 jours ; les pages nouvelles sont des sélections honnêtes où
KYRAN figure parmi d'autres jeux, comme les articles actuels du blog.

Volumes : estimation d'une IA gratuite (GLM-4.7-flash, 26/11), ordre de grandeur mensuel en France en
saison de Noël, non vérifié par un outil de mots-clés.

Positions (règle du relevé, 26/11) : mesurées sans compte ni historique, publicités exclues. DuckDuckGo
version HTML (index Bing) par `scripts/seo-releve-moteurs.py`, rang dans les 10 premiers résultats, « absent »
au-delà. Une moyenne Search Console ou Bing Webmaster n'est citée qu'à partir de 20 impressions : aucune des
30 requêtes n'y arrive au 26/11. Brave et les réponses des IA sont relevés chaque lundi par la routine
« Kyran · Relevé des 3 moteurs » dans [`releve-moteurs.csv`](releve-moteurs.csv) (premier passage le 30/11).

| # | Requête | Volume | Difficulté | DuckDuckGo 26/11 | Page qui sort | Page cible |
|---|---------|--------|------------|-------------|-----------|------------|
| 1 | jeux de cartes | 50 000+ | forte | absent | - | `/` (maillage interne) |
| 2 | jeu de cartes | 20 000+ | forte | absent | - | `/` (maillage interne) |
| 3 | jeux de cartes 2026 | 1 000+ | faible | absent | - | à créer : `blog/meilleurs-jeux-de-cartes-2026.html` |
| 4 | meilleur jeu de cartes 2026 | 1 000+ | faible | absent | - | à créer : `blog/meilleurs-jeux-de-cartes-2026.html` |
| 5 | jeux de cartes 2027 | 500+ | faible | 3 | `/blog/marche-jeux-de-cartes-2026-2027.html` | à créer : `blog/nouveaux-jeux-de-cartes-2027.html` |
| 6 | nouveau jeu de cartes | 2 000+ | moyenne | absent | - | à créer : `blog/nouveaux-jeux-de-cartes-2027.html` |
| 7 | jeux de société pas cher | 30 000+ | moyenne | absent | - | à créer : `blog/jeux-de-societe-pas-chers.html` |
| 8 | jeu de cartes pas cher | 20 000+ | forte | absent | - | `blog/jeux-cartes-moins-de-15-euros.html` |
| 9 | petit cadeau jeu de société | 2 000+ | moyenne | absent | - | `blog/cadeau-moins-de-10-euros.html` |
| 10 | idée cadeau jeu de cartes | 20 000+ | moyenne | 9 | `/blog/cadeau-anniversaire.html` | à créer : `blog/idees-cadeaux-jeu-de-cartes.html` |
| 11 | jeux pour noël | 50 000+ | forte | absent | - | `blog/cadeau-noel.html` |
| 12 | jeu de cartes noël 2026 | 500+ | faible | 1 | `/blog/cadeau-noel.html` | `blog/cadeau-noel.html` |
| 13 | jeux apéro | 5 000+ | moyenne | absent | - | `blog/meilleurs-jeux-apero.html` |
| 14 | jeu de cartes apéro | 3 000+ | moyenne | 4 | `/blog/meilleurs-jeux-apero.html` | `blog/meilleurs-jeux-apero.html` |
| 15 | jeux ado | 5 000+ | moyenne | absent | - | `blog/jeux-cartes-ados.html` |
| 16 | jeu de cartes ado | 2 000+ | moyenne | 2 | `/blog/jeux-cartes-ados.html` | `blog/jeux-cartes-ados.html` |
| 17 | jeu de cartes famille | 3 000+ | moyenne | absent | - | `blog/jeux-famille.html` |
| 18 | jeu de cartes enfant 8 ans | 2 000+ | moyenne | absent | - | à créer : `blog/jeux-cartes-enfants-8-ans.html` |
| 19 | jeu de cartes entre amis | 2 000+ | moyenne | absent | - | `blog/jeux-soiree-amis.html` |
| 20 | jeux de société soirée entre amis | 3 000+ | moyenne | absent | - | `blog/jeux-soiree-amis.html` |
| 21 | jeu de cartes 4 joueurs | 1 000+ | moyenne | 3 | `/blog/jeux-cartes-4-joueurs.html` | `blog/jeux-cartes-4-joueurs.html` |
| 22 | jeu de cartes 6 joueurs | 1 000+ | moyenne | 6 | `/blog/jeux-cartes-6-joueurs.html` | `blog/jeux-cartes-6-joueurs.html` |
| 23 | jeu de cartes original | 2 000+ | moyenne | absent | - | à créer : `blog/jeux-cartes-originaux.html` |
| 24 | jeu de cartes stratégie | 2 000+ | moyenne | absent | - | `blog/jeux-strategie-legere.html` |
| 25 | jeu de cartes rapide | 1 000+ | moyenne | 5 | `/blog/jeux-30-minutes.html` | `blog/jeux-30-minutes.html` |
| 26 | jeu de cartes simple à apprendre | 500+ | faible | absent | - | `blog/jeux-debutants-adultes.html` |
| 27 | jeu de cartes voyage | 500+ | faible | absent | - | `blog/jeux-vacances-voyage.html` |
| 28 | jeu de plis | 500+ | faible | absent | - | `blog/jeux-plis-comparatif.html` |
| 29 | jeu de cartes comme uno | 500+ | faible | 4 | `/blog/alternatives-uno.html` | `blog/alternatives-uno.html` |
| 30 | jeu comme skyjo | 500+ | faible | 3 | `/blog/jeux-comme-skyjo.html` | `blog/jeux-comme-skyjo.html` |

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

- DuckDuckGo (neutre) : top 3 sur 5 requêtes larges (« jeu de cartes noël 2026 » 1, « jeu de cartes ado » 2,
  « jeux de cartes 2027 » 3, « jeu de cartes 4 joueurs » 3, « jeu comme skyjo » 3), 4e à 10e sur 5 autres,
  absent sur 20, dont toutes les têtes (« jeux de cartes », « jeu de cartes », « jeux pour noël »,
  « jeux de société pas cher »).
- Mesure du PDG le même soir (DuckDuckGo) : « jeu de carte apéro » 8e, « jeu de carte noel 2026 » 1er,
  « jeu de carte ado » 3e ; les « 1,0 » de Bing Webmaster ne reposaient que sur 2 à 5 impressions.
- Réponse IA de Google à « meilleurs jeux de cartes Noël 2026 » (relevé de Corentin, 26/11) : KYRAN absent ;
  jeux cités Flip 7, Trio, Skyjo, Ipso, Faraway, Dnup, Carnival of Sins, Wingspan Pocket ; sources Ludum,
  Marie Claire, Monsieur Dé, Playin, Cosmopolitan, Ludiquement, Asmodee France, Règles de jeux. Notre page
  `cadeau-noel` est 1re sur DuckDuckGo mais n'est pas citée : l'IA reprend les sélections des autres sites.

## Contrôle technique des pages cibles (nuit du 26 au 27/11)

24 pages cibles contrôlées (vitesse, JSON-LD, liens, lien vers l'accueil). JSON-LD valide partout
(BlogPosting complet, FAQPage dont toutes les questions sont visibles, ItemList de jeux) ; les pages du
blog n'ont pas de bloc Product, réservé à l'accueil et à la commande. 0 lien interne cassé, 98 liens
externes testés sans lien mort (BoardGameGeek, Facebook, Asmodee et Magilano refusent seulement les robots).

Défauts corrigés : cible de « jeu de plis » qui pointait vers une redirection (`guide-jeux-de-plis`) ;
aucun lien vers `/` dans le corps de `idees-cadeaux-jeu-de-cartes`, `jeux-de-societe-pas-chers` et
`meilleurs-jeux-de-cartes-2026` ; image de la boîte KYRAN servie en pleine taille (WebP 1048 px, 144 Ko)
sur 23 pages, remplacée par les variantes 360 et 740 px (37 et 56 Ko).
