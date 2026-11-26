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

Règle du relevé (PDG, 26/11) : position mesurée sans compte ni historique, publicités exclues ; une moyenne
Search Console ou Bing Webmaster n'est citée qu'à partir de 20 impressions sur 28 jours.

Méthode, pour chaque moteur :

- Google : moyenne Search Console sur 28 jours si 20 impressions ou plus, sinon « moins de 20 impressions ».
- Bing : DuckDuckGo version HTML (index Bing), par `python scripts/seo-releve-moteurs.py --fichier _notes/seo/releve-requetes.txt` (les 40 requêtes),
  sans cookie, annonces exclues. bing.com interrogé sans cookie renvoie des résultats sans rapport, et le
  navigateur de Trio porte un compte : ni l'un ni l'autre ne compte comme mesure.
- Brave : position en direct (`https://search.brave.com/search?q=…`), rang du premier domaine kyran-jeu.fr
  hors annonces ; « absent » au-delà de la 1re page. Brave ne personnalise pas ses résultats et aucun compte
  n'y est connecté ; curl est refusé (captcha), on passe donc par le navigateur.
- Réponses des IA (GEO), chaque lundi, sans compte : question « meilleurs jeux de cartes Noël 2026 » (puis
  « meilleurs jeux de cartes 2026 » après Noël) en mode IA de Google, sur Bing Copilot, dans la réponse IA de
  Brave et sur ChatGPT. Noter : KYRAN cité ou non, jeux cités, sources citées.

## Relevé de départ (26/11/2026, soir)

- Google (Search Console, 29/10 → 25/11, 20 impressions ou plus) : « kyran » 2,4 (accueil, 74 impressions) ;
  « tarot africain » 9,2 (401) ; « tarot africain règle » 5,0 (214) ; « tarot africain en ligne » 9,6 (100) ;
  « jeu de carte pari nombre de plis » 4,6 (27, `regle.html`).
- DuckDuckGo, index Bing (neutre) : « kyran jeu », « kyran jeu de cartes », « kyran jeu de pli » 1ers ; « kyran » 2e
  (`jouer-en-ligne.html`) ; « kyran maître des mystiques » 5e ; « tarot africain règle » 2e ; « tarot africain » 10e ;
  « tarot africain en ligne » absent ; « jeu de cartes annoncer ses plis » 2e ; « jeu de plis et paris » 8e.
- Bing Webmaster (20 impressions ou plus) : « kyran » 4,2 (23) ; « kyran jeu de pli » 9,0 (20, une seule semaine
  vers le 19/11) ; « tarot africain » 8,6 (81).
- Brave en direct : « kyran jeu de pli » 1er ; « kyran » 7e (1re page) ; « tarot africain » 7e ;
  « kyran jeu de cartes » 1er (relevé du PDG).
- Réponse IA de Google à « meilleurs jeux de cartes Noël 2026 » (Corentin) : KYRAN absent. Détail dans
  [`requetes-larges.md`](requetes-larges.md).

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
