# KYRAN en 60 secondes : script et sources

Vidéo muette (aucune piste audio), sous-titres incrustés. Durée totale : 61,5 s, 30 images/s.

Fichiers :

- `kyran-en-60-secondes.mp4` : 1280×720, H.264.
- `kyran-en-60-secondes-vertical.mp4` : 1080×1920 (Instagram), même contenu recomposé ; un bandeau
  « KYRAN, Maître des Mystiques » reste en haut de l'écran entre le titre et le plan final, et
  « kyran-jeu.fr » en bas.
- `kyran-en-60-secondes.webp` : affiche 1280×720 (image du plan 1).

Abréviations des sources :

- **R** = `regle.html` (règles officielles) ;
- **M** = `_notes/memoire.md` § 1 « Le jeu KYRAN (faits canoniques) » ;
- **C** = `scripts/content/README.md` § « KYRAN — faits canoniques » ;
- **L** = `llms.txt`.

Les visuels sont les fichiers du site : boîte `boite-recto-kyran.webp`, médaillon `logo.png`, cartes
`hero-carte-*.webp`, `card-5/9/12/22/25.jpg` (cartes Nombre), `carte-pouvoir-*.webp`,
`carte-mystique.webp`, motif `img/motif-wax.svg`, étoile `dojo/img/etoile.png`. Les cartes Vie sont
un dessin simplifié (mention « VIE » et étoiles), pas une reproduction de la carte imprimée. Les
joueurs sont figurés par des jetons « J1 » à « J4 » et « Vous » (aucune photo de personne).

---

## Plan 1 : titre (0 → 4 s, 4 s)

À l'écran : médaillon, « KYRAN », « Maître des Mystiques », éventail de cartes (dos, 16, 33, Sceau
du Destin 27).

Sous-titre : **Le jeu de cartes où l'on parie ses plis.**

- « Maître des Mystiques » : M « Sous-titre : “Maître des Mystiques” » ; R, en-tête « KYRAN Maître des
  Mystiques ».
- « Le jeu de cartes où l'on parie ses plis » : R, balise `<title>` « Règles de KYRAN : le jeu de
  cartes où l'on parie ses plis ».

## Plan 2 : en bref (4 → 7,5 s, 3,5 s)

À l'écran : la boîte, étiquettes « 3 à 6 joueurs », « ≈ 30 min », « dès 8 ans ».

Sous-titre : **De 3 à 6 joueurs, environ 30 minutes, dès 8 ans.**

- R « En bref » : « 3–6 Joueurs · 30 min Partie · 8 ans + Âge ».
- L ligne 3 : « pour 3 à 6 joueurs (environ 30 minutes, dès 8 ans) » ; M « 3 à 6 joueurs […]
  environ 30 min, dès 8 ans ».

## Plan 3 : le pari (7,5 → 12,5 s, 5 s)

À l'écran : une main de 5 cartes Nombre et la bulle « Je fais 2 plis. »

Sous-titre : **À chaque manche, annoncez le nombre exact de plis que vous allez gagner.**

- R « Phase de paris » : « chacun annonce à voix haute combien de plis il pense gagner ».
- R « Fin de manche » : « Pari réussi : si un joueur a gagné exactement le nombre de plis
  annoncés » (le pari porte donc sur un nombre exact).
- M « Manche : chacun annonce le nombre exact de plis qu'il va gagner ».

## Plan 4 : la règle d'or (12,5 → 18 s, 5,5 s)

À l'écran : « Manche à 5 cartes : 5 plis » ; J1, J2, J3 parient 1, 2, 1 ; le « 1 » de J4 est barré ;
« 1 + 2 + 1 = 4 : le dernier ne peut pas dire 1 ».

Sous-titre : **Règle d'or : le total des paris ne doit jamais égaler le nombre de plis.**

- R « Phase de paris » : « Règle d'or : la somme totale des paris ne doit jamais être égale au
  nombre de plis en jeu. Le dernier joueur doit obligatoirement ajuster son annonce si nécessaire. »
- L'exemple affiché est celui de R : « Dans une manche à 5 cartes, trois joueurs ont parié 1, 2 et 1
  (total 4). Le dernier joueur ne peut pas annoncer 1 […]. Il doit obligatoirement dire 0, 2, 3, 4
  ou 5. »

## Plan 5 : quelqu'un se trompe (18 → 21,5 s, 3,5 s)

À l'écran : J4 annonce 3 (un des choix permis par l'exemple de R) ; « 7 plis annoncés, 5 plis en
jeu » ; étiquette « 7 ≠ 5 ».

Sous-titre : **Donc, à chaque manche, au moins un joueur se trompe.**

- M : « Au moins un joueur se trompe donc à chaque manche. »
- C : « au moins un joueur se trompera donc à chaque manche ».
- 1 + 2 + 1 + 3 = 7 : calcul.

## Plan 6 : le pli (21,5 → 26 s, 4,5 s)

À l'écran : quatre cartes Nombre (9, 16, 33, 22) posées ; le 33 s'élève, « 33 remporte le pli » ;
les cartes partent vers le gagnant ; compteur « Plis gagnés : 0 » puis « 1 ».

Sous-titre : **La plus forte carte remporte le pli.**

- R « Phase de jeu » : « La carte Nombre la plus forte remporte le pli. […] Le gagnant de chaque pli
  remporte les cartes et entame le pli suivant. »
- Simplification assumée : le sous-titre dit « la plus forte carte » ; R précise qu'en cas
  d'égalité entre une carte Nombre et une carte Pouvoir de même valeur, la carte Pouvoir l'emporte.
  L'exemple à l'écran ne montre que des cartes Nombre.

## Plan 7 : pari raté (26 → 31 s, 5 s)

À l'écran : « Pari : 3 », « Plis : 1 », « Écart : 2 » ; deux cartes Vie tombent de la pile ;
« − 2 Vies ».

Sous-titre : **Pari raté : vous perdez 1 carte Vie par pli d'écart.**

- R « Fin de manche » : « Pari raté : le joueur perd un nombre de cartes Vie égal à la différence
  entre son pari et ses plis remportés. Exemple : Un joueur a parié 3 plis mais n'en remporte qu'1.
  L'écart est de 2 : il perd immédiatement 2 cartes Vie. » (exemple repris tel quel).
- Pile de 5 cartes Vie : R « Mise en place » : « Chaque joueur reçoit un paquet de 5 cartes Vie ».

## Plan 8 : pari juste (31 → 33,5 s, 2,5 s)

À l'écran : « Pari : 2 », « Plis : 2 », coche verte, la pile de 5 cartes Vie reste entière.

Sous-titre : **Pari juste : vous ne perdez rien.**

- R « Fin de manche » : « Pari réussi : si un joueur a gagné exactement le nombre de plis annoncés,
  il ne perd aucune carte Vie. »

## Plan 9 : les manches (33,5 → 37,5 s, 4 s)

À l'écran : compteur 7, 6, 5, 4, 3, 2 « cartes par manche », l'éventail de dos de cartes rétrécit
d'autant.

Sous-titre : **Les manches passent de 7 à 2 cartes…**

- R « Déroulement d'une partie » : « Le nombre de cartes distribuées diminue progressivement :
  7 → 6 → 5 → 4 → 3 → 2, puis la célèbre manche Mystique à 1 carte. »

## Plan 10 : la manche Mystique (37,5 → 43 s, 5,5 s)

À l'écran : J1, J2, J3 ont chacun une carte visible au-dessus d'eux ; « Vous » n'a qu'un dos de carte
et un point d'interrogation ; étiquette « Pariez 0 ou 1 ».

Sous-titre : **…puis la manche Mystique : une carte sur le front. Vous voyez celles des autres, pas
la vôtre.**

- R « La Manche Mystique » : « Chaque joueur pioche 1 seule carte et la place contre son front […]
  visible par tous les autres joueurs mais totalement invisible pour lui-même. »
- « Pariez 0 ou 1 » : R « chaque joueur parie à tour de rôle s'il va remporter le pli (1) ou non
  (0) ».

## Plan 11 : les cartes Pouvoir (43 → 48 s, 5 s)

À l'écran : Sceau du Destin 27, Clairvoyance Antique 11, Bénédiction des Ancêtres 20, Voile du
Néant 3, étiquette « À 3 ou 4 joueurs : ces 4 » ; puis « + » Sceau 4, Clairvoyance 23,
Bénédiction 9, Voile 34, étiquette « À 5 ou 6 joueurs : les 8 ».

Sous-titre : **Les cartes Pouvoir agissent dès qu'elles sont posées.**

- R « Phase de jeu » : « Les cartes Pouvoir s'activent immédiatement au moment où elles sont
  posées. »
- R « Mise en place » : « Pour 3 et 4 joueurs : prendre uniquement Clairvoyance Antique (11), Sceau
  du Destin (27), Bénédiction des Ancêtres (20), Voile du Néant (3) et la carte Mystique. Pour 5 et
  6 joueurs : prendre toutes les cartes Pouvoir et la carte Mystique. »
- Les quatre cartes du premier groupe sont exactement celles citées par R pour 3 et 4 joueurs.
- Exception non montrée : en manche Mystique, R précise que « les effets de texte des cartes
  Pouvoir ne sont pas activés ».

## Plan 12 : la Mystique (48 → 51 s, 3 s)

À l'écran : la carte Mystique se retourne, entre « 0 » et « 37 », « ou ».

Sous-titre : **La carte Mystique vaut 0 ou 37, au choix.**

- R « Cartes aux effets spéciaux » : « Carte Mystique — Lorsqu'elle est jouée hors manche
  Mystique, le joueur choisit librement la valeur 0 ou 37 au moment de la poser. »
- M : « La Mystique vaut 0 ou 37 au choix. »
- Exception non montrée : en manche Mystique, R fixe sa valeur selon le pari (37 si son
  propriétaire a parié qu'il remportait le pli, 0 sinon).

## Plan 13 : fin de partie (51 → 57 s, 6 s)

À l'écran : J1 4 Vies, J2 2 Vies, J3 1 Vie, J4 3 Vies ; la dernière carte Vie de J3 tombe, « 0 Vie » ;
puis J1 s'illumine, « J1 gagne ».

Sous-titres :

1. (51 → 54 s) **La partie s'arrête dès qu'un joueur n'a plus de Vies.**
   - R « Fin du jeu » : « Le premier joueur à perdre toutes ses cartes Vie est déclaré éliminé et la
     partie prend fin. »
2. (54 → 57 s) **Celui qui a le plus de Vies devient Maître des Mystiques.**
   - R « Fin du jeu » : « Le joueur possédant le plus grand nombre de cartes Vie restantes est sacré
     Maître des Mystiques. »
   - Cas non montré : en cas d'égalité, R prévoit une ultime manche Mystique entre les survivants.

## Plan 14 : fin (57 → 61,5 s, 4,5 s)

À l'écran : la boîte, médaillon, « KYRAN », « 9,99 € », « kyran-jeu.fr ».

Sous-titre : **9,99 € sur kyran-jeu.fr**

- M « Prix : 9,99 € sur kyran-jeu.fr (`/commander.html` […]) ».
- L ligne 18 : « Prix : 9,99 € sur https://kyran-jeu.fr/commander.html ».
- R, bandeau d'annonce : « Le jeu complet 9,99€ en direct du créateur ».
- Les frais de port (3,99 € par commande d'après M) ne sont pas mentionnés : la vidéo donne le
  prix du jeu, comme le site.

---

## Ce que la vidéo ne dit pas, volontairement

Aucun avis, note, chiffre de ventes, promotion ni urgence. Aucune affirmation « sans élimination » ou
« sans hasard ». Aucun pouvoir n'est inventé : seules les huit cartes Pouvoir et la Mystique du jeu
apparaissent.
