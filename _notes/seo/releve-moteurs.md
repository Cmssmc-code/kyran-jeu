# Relevé des positions sur Google, Bing et Brave

Objectif (tâche t100, ordre du 26/11/2026) : au 31/12/2026, n°1 sur « kyran jeu », « kyran jeu de cartes »
et « kyran jeu de pli » sur les trois moteurs ; « kyran » dans le top 3 Google et Bing, 1re page Brave ;
« tarot africain » de la position 9 à 5 ou mieux sur Google.

Les 30 requêtes larges de la tâche t101 sont dans [`requetes-larges.md`](requetes-larges.md) et relevées par la même routine.

Relevé refait chaque lundi par la routine « Kyran · Relevé des 3 moteurs » (Haiku), lignes ajoutées dans
[`releve-moteurs.csv`](releve-moteurs.csv). Aucun titre de page retouché avant 28 jours (règle de Corentin).

## Les 10 requêtes fixes

| # | Requête | Famille |
|---|---------|---------|
| 1 | kyran | marque |
| 2 | kyran jeu | marque |
| 3 | kyran jeu de cartes | marque |
| 4 | kyran jeu de pli | marque |
| 5 | kyran maître des mystiques | marque |
| 6 | tarot africain | tarot africain |
| 7 | tarot africain règle | tarot africain |
| 8 | tarot africain en ligne | tarot africain |
| 9 | jeu de cartes annoncer ses plis | jeu de plis |
| 10 | jeu de plis et paris | jeu de plis |

Méthode, pour chaque moteur :

- Google : position moyenne Search Console sur 28 jours (requête exacte, toutes pages), plus la page qui sort.
- Bing : position en direct dans le navigateur de Trio (`https://www.bing.com/search?q=…&setmkt=fr-FR`,
  rang du premier résultat kyran-jeu.fr parmi les `li.b_algo`), et position moyenne Bing Webmaster si la requête y figure.
- Brave : position en direct (`https://search.brave.com/search?q=…`), rang du premier domaine kyran-jeu.fr
  dans la liste des résultats ; « absent » au-delà de la 1re page.

## Relevé de départ (26/11/2026, soir)

- Google (Search Console, 29/10 → 25/11) : « kyran » 2,4 (accueil, 74 impressions) ; « kyran paris » 1 ;
  « tarot africain » 9,2 (401 impressions, notre plus grosse requête) ; « tarot africain règle » 5,0 ;
  « tarot africain en ligne » 9,6 ; « jeu de carte pari nombre de plis » 4,6 (`regle.html`).
- Bing en direct : « kyran jeu de pli » 1er (`regle.html`, l'accueil 2e) ; « kyran » 6e (`jouer-en-ligne.html`,
  l'accueil 8e, derrière 5 sites de prénoms).
- Bing Webmaster (moyennes) : « kyran jeu » 1,5 ; « kyran » 4,2 ; « kyran jeu de pli » 9,0 (une seule semaine,
  20 impressions, vers le 19/11 ; le direct du 26/11 donne 1er, donc rien à corriger) ; « tarot africain » 8,6.
- Brave en direct : « kyran jeu de pli » 1er ; « kyran » 7e (1re page, après des sites de prénoms et kyran.com) ;
  « tarot africain » 7e ; « kyran jeu de cartes » 1er (relevé du PDG).

## Brave : index et leviers sans argent

- `site:kyran-jeu.fr` : accueil, blog et articles bien indexés.
- Défaut : l'extrait de l'accueil chez Brave affiche encore « Le jeu y est à 17,99 € », ancien prix Amazon absent
  du site depuis octobre. Brave n'a pas d'outil de soumission : l'extrait se rafraîchira au prochain passage
  de son robot. À revérifier chaque lundi.
- Leviers : fiche BoardGameGeek 480678 (champ « site officiel » vide, à remplir), page Tric Trac (déjà 4e sur
  Bing pour « kyran jeu de pli »), annuaires de jeux, données structurées `Product` et `Game` déjà en place.

## Bing

- IndexNow : envoyé à chaque push sur `main` (5 passages réussis le 26/11).
- Sitemap : 70 URL en ligne ; Bing en a lu 66 au dernier passage (vers le 23/11), statut « Success ».

## Google : plan « tarot africain » de 9 à 5

1. La description de `tarot-africain.html` reste verrouillée jusqu'au 08/12 (backlog). Le titre date du
   18/10 : il peut changer, mais on attend le 08/12 pour changer titre et description ensemble, autour de la
   réponse que Google affiche.
2. Contenu : compléter la page sur ce qui manque face aux trois premiers (tarot-africain.fr, jejeu.org,
   tarot-africain.app) : partie en ligne (lien vers l'Initiation et `jouer-en-ligne.html`), variantes
   régionales, exemple de manche chiffré.
3. Requête « tarot africain en ligne » (9,6) : bloc « Jouer en ligne » en haut de page avec lien vers
   l'Initiation.
4. Liens tiers : citer la page dans les fiches BoardGameGeek, Tric Trac et annuaires (texte « tarot africain »).
5. Mesure chaque lundi dans le relevé ; bilan le 03/12 puis le 15/12.
