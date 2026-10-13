# Visuels Instagram KYRAN : légendes et sources

Huit visuels prêts à poster pour @kyran.jeu. Six posts en 1080 × 1350 (4:5, feed ou carrousel) et deux stories
en 1080 × 1920 (aucun texte dans les 250 px du haut et du bas).

- Sources HTML : `src/*.htm` (extension `.htm` pour que les scripts du site ne les traitent pas comme des pages).
- Styles communs : `src/commun.css` (charte du site : safran, encre, terracotta, crème, kraft, Fredoka, Poppins, motif wax).
- Rendu : `node marketing/instagram/src/render.mjs [filtre]` (Playwright, puis réduction en 256 couleurs avec Pillow).
- Images utilisées : photos et cartes du dépôt (`boite-recto-kyran.png`, `carte-mystique.webp`, `carte-pouvoir-*.webp`,
  `card-*.jpg`, `hero-carte-dos.webp`, `logo.png`, `img/motif-wax.svg`). Aucun visuel inventé.

Ordre conseillé pour un carrousel : 01 → 06. Les stories 07 et 08 peuvent être publiées seules.

---

## 01-presentation.png (post)

Légende :

> KYRAN, le jeu de cartes où il faut gagner le nombre exact de plis annoncés. Ni plus, ni moins.
> De 3 à 6 joueurs, environ 30 minutes, dès 8 ans.
> Règles et commande sur kyran-jeu.fr
>
> #KYRAN #jeudecartes #jeudesociete #jeudeplis #soireejeux

Sources :
- « Plis, bluff et paris » : `og-kyran.jpg` (« Plis, bluff et paris : annoncez, jouez, gardez vos vies. »).
- « Le jeu où il faut gagner le nombre exact de plis annoncés. Ni plus, ni moins. » : pied de page du site (`components.js`, visible sur `regle.html`).
- 3 à 6 joueurs, 30 min, dès 8 ans : `regle.html` (« En bref »), `_notes/memoire.md` §1.

## 02-principe.png (post)

Légende :

> Le principe tient en une phrase : annoncez le nombre exact de plis que vous allez gagner.
> Pari juste : vous gardez vos Vies. Pari raté : vous perdez autant de Vies que l’écart entre votre pari et vos plis.
> Et la somme des paris ne peut jamais égaler le nombre de plis : au moins un joueur se trompe à chaque manche.
>
> #KYRAN #jeudeplis #jeudecartes #jeudebluff #soireejeux

Sources :
- Annonce du nombre exact de plis, pari réussi ou raté, perte égale à l’écart : `regle.html` (« Phase de paris », « Fin de manche & Résolution »).
- Somme des paris jamais égale au nombre de plis : `regle.html` (« Règle d’or »). « Au moins un joueur se trompe » : `_notes/memoire.md` §1.
- Cartes montrées : vraies cartes Nombre 5, 14, 23, 32 (`card-*.jpg`). La bulle « J’annonce 2 plis » est un exemple d’annonce, pas une citation.

## 03-manches.png (post)

Légende :

> Une carte de moins à chaque manche : 7, 6, 5, 4, 3, puis 2 cartes.
> Ensuite vient la manche Mystique : une seule carte, tenue contre le front. Vous voyez les cartes des autres, pas la vôtre.
> Puis un nouveau cycle repart à 7 cartes. La partie s’arrête dès qu’un joueur n’a plus de Vies : celui qui en a le plus gagne.
>
> #KYRAN #jeudecartes #jeudeplis #reglesdujeu #jeudesociete

Sources :
- Suite 7 → 6 → 5 → 4 → 3 → 2, manche Mystique à 1 carte, nouveau cycle à 7 : `regle.html` (« Déroulement d’une partie »).
- Carte contre le front, visible des autres seulement : `regle.html` (« La Manche Mystique »).
- Fin de partie : `regle.html` (« Fin du jeu »), `_notes/memoire.md` §1.
- Carte montrée : dos de carte (`hero-carte-dos.webp`).

## 04-mystique.png (post)

Légende :

> La carte Mystique vaut 0 ou 37. Vous choisissez sa valeur au moment de la poser.
> À 37, c’est la carte la plus forte du jeu.
> Pendant la manche Mystique, sa valeur suit votre pari : 37 si vous avez annoncé le pli, 0 sinon.
>
> #KYRAN #cartemystique #jeudecartes #jeudeplis #soireejeux

Sources :
- 0 ou 37 au choix au moment de la poser, carte la plus forte du jeu : `regle.html` (« Cartes aux effets spéciaux »).
- Valeur pendant la manche Mystique : `regle.html` (« Valeur de la Mystique »).
- Carte montrée : `carte-mystique.webp`.

## 05-pouvoirs.png (post)

Légende :

> Quatre Pouvoirs, deux cartes chacun. Leur effet s’active dès qu’on les pose.
> Sceau du Destin (27 et 4), Clairvoyance Antique (11 et 23), Bénédiction des Ancêtres (20 et 9), Voile du Néant (3 et 34).
> À 3 ou 4 joueurs, on garde 4 cartes Pouvoir et la Mystique. À 5 ou 6, toutes les cartes.
>
> #KYRAN #cartespouvoir #jeudecartes #jeudesociete #jeudeplis

Sources :
- Noms, valeurs et effets : `regle.html` (« Cartes aux effets spéciaux »). Effets reformulés au vouvoiement sans changer le sens.
- Activation immédiate : `regle.html` (« Phase de jeu »).
- Composition selon le nombre de joueurs : `regle.html` (« Mise en place & Matériel »).
- Exception non reprise sur le visuel, faute de place : « Si vous êtes le dernier à jouer ce tour, l’effet est annulé » (Sceau, Bénédiction) et « Si vous êtes le premier à jouer, l’effet est annulé » (Voile). Elles restent écrites sur les cartes montrées.
- Cartes montrées : `carte-pouvoir-sceau-27.webp`, `-clairvoyance-11`, `-benediction-20`, `-voile-34`.

## 06-boite.png (post)

Légende :

> Dans la boîte : 36 cartes Nombre (de 1 à 36), 1 carte Mystique, 8 cartes Pouvoir, soit 45 cartes de jeu.
> Plus 30 cartes Vie (5 par joueur) et 7 cartes de règles.
> Cartes toilées, boîte rigide de 11,5 × 8,5 × 2,8 cm pour 175 g.
>
> #KYRAN #jeudecartes #jeudesociete #jeudevoyage #ideecadeau

Sources :
- Contenu : `regle.html` (« Mise en place & Matériel »), `_notes/memoire.md` §1.
- Dimensions, poids, cartes toilées, boîte rigide : pages du site (par exemple `commander.html`, `faq.html` : « 11,5 × 8,5 × 2,8 cm pour 175 g »), `_notes/memoire.md` §1.
- Photo : `boite-recto-kyran.png`.

## 07-story-essayer.png (story)

Texte à ajouter dans Instagram : un autocollant « Lien » vers `https://kyran-jeu.fr/minijeu.html`, placé dans la zone basse
(sous le bandeau noir, au-dessus du motif).

Légende (si la story est aussi publiée en post) :

> Essayez KYRAN gratuitement, dans le navigateur et sans inscription : 7 rites guidés, puis des parties contre l’ordinateur.
> kyran-jeu.fr/minijeu.html
>
> #KYRAN #jeuenligne #jeudecartes #jeudeplis

Sources :
- Gratuit, dans le navigateur, sans inscription, 7 rites, parties contre l’ordinateur : `minijeu.html` (balises description et texte de la page).

## 08-story-commander.png (story)

Texte à ajouter dans Instagram : un autocollant « Lien » vers `https://kyran-jeu.fr/commander.html`.

Légende (si la story est aussi publiée en post) :

> Noté 4,7/5 sur Amazon (33 évaluations).
> Commandez KYRAN sur kyran-jeu.fr : 9,99 € la boîte, 2,99 € de port par commande, quel que soit le nombre de boîtes (12,98 € pour une boîte).
>
> #KYRAN #jeudecartes #jeudesociete #ideecadeau

Sources :
- 4,7/5 sur 33 évaluations Amazon : `reviews-data.json` (`averageRating`, `totalReviews`), note vérifiée le 2026-10-13 (brief du chantier). La répartition des étoiles n’est pas connue : le visuel ne montre que la moyenne. À mettre à jour si la note change.
- 9,99 € : `commander.html`, `_notes/memoire.md` §1. Port de 2,99 € par commande (total 12,98 € pour une boîte) : décision du propriétaire du 2026-10-13, transmise par le chef de projet ; les pages du site affichaient encore 3,99 € au moment du rendu, elles sont mises à jour par un autre lot.
- Photo : `boite-recto-kyran.png`.

---

## Vérifications faites

- Aucun avis, aucune citation, aucune promotion, aucune urgence, aucun stock.
- Pas d’emoji dans les visuels. Espaces insécables avant « : » et dans « 9,99 € ».
- Chaque PNG relu à l’écran. Poids : de 70 à 240 Ko.
