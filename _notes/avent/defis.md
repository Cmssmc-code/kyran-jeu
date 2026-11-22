# Calendrier de l'Avent KYRAN : 24 défis de plis

Un défi par jour, du 1er au 24 décembre. Rédaction : Game designer (tâche t49), le 22/11/2026.

## Conventions (pour l'intégration)

- Joueurs numérotés dans le sens des aiguilles d'une montre : joueur 0 = toi, joueur 1 à ta gauche, etc.
- Le joueur à gauche du donneur ouvre le premier pli ; le gagnant d'un pli ouvre le suivant. Pas de couleur à fournir : la plus forte carte gagne.
- Ids du moteur (`dojo/engine.js`) : `n1`..`n36` cartes Nombre, `m` Mystique (0 ou 37 au choix quand on la pose), `p<valeur>` cartes Pouvoir. À égalité de valeur, une carte Pouvoir bat une carte Nombre.
- Toutes les mains sont visibles. Question unique : « Combien de plis fais-tu ? ». La réponse est le nombre de plis que tu fais si tu joues au mieux, même si tous les autres jouent pour t'en faire perdre.
- Contrôle : chaque donne a été jouée dans tous les ordres possibles avec `dojo/engine.js` (règles officielles, `bestPlay` pour le gagnant du pli, tous les choix de Pouvoir et de valeur de la Mystique). La ligne « Contrôle » donne la réponse et la fourchette si tout le monde, toi compris, joue n'importe comment.
- Pouvoirs utilisés selon le nombre de joueurs : à 3 ou 4, seulement 11, 27, 20 et 3 ; à 5 ou 6, aussi 23, 4, 9 et 34. Pas de manche Mystique à 1 carte (tu n'y vois pas ta carte) : les donnes vont de 2 à 5 cartes.

## Jour 1

- Niveau : facile
- Joueurs : 3
- Cartes : 2
- Donneur : joueur 2 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : n36, n35
  - Joueur 1 : n12, n3
  - Joueur 2 : n20, n7
- Question : Combien de plis fais-tu ?
- Réponse : 2
- Explication : Le 36 et le 35 sont les deux plus fortes cartes de la table. Personne ne peut les battre : tu ramasses les deux plis.
- Contrôle : 2 plis au mieux contre tous ; toujours le même chiffre, quoi que fasse chacun.

## Jour 2

- Niveau : facile
- Joueurs : 3
- Cartes : 2
- Donneur : toi (ouvre le premier pli : joueur 1)
- Mains :
  - Joueur 0 (toi) : n2, n1
  - Joueur 1 : n15, n4
  - Joueur 2 : n27, n9
- Question : Combien de plis fais-tu ?
- Réponse : 0
- Explication : Ton 2 et ton 1 sont les plus petites cartes de la table : toutes les cartes des autres sont plus fortes. Aucun pli pour toi. Si tu as parié 0, c'est parfait !
- Contrôle : 0 pli au mieux contre tous ; toujours le même chiffre, quoi que fasse chacun.

## Jour 3

- Niveau : facile
- Joueurs : 3
- Cartes : 3
- Donneur : joueur 1 (ouvre le premier pli : joueur 2)
- Mains :
  - Joueur 0 (toi) : n36, n35, n1
  - Joueur 1 : n22, n14, n6
  - Joueur 2 : n30, n17, n9
- Question : Combien de plis fais-tu ?
- Réponse : 2
- Explication : Ton 36 et ton 35 gagnent chacun leur pli. Ton 1 est la plus petite carte du jeu : il ne bat jamais rien.
- Contrôle : 2 plis au mieux contre tous ; toujours le même chiffre, quoi que fasse chacun.

## Jour 4

- Niveau : facile
- Joueurs : 4
- Cartes : 2
- Donneur : joueur 3 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : n36, n7
  - Joueur 1 : n5, n1
  - Joueur 2 : n6, n2
  - Joueur 3 : n4, n3
- Question : Combien de plis fais-tu ?
- Réponse : 2
- Explication : Ton 36 gagne, ça c'est facile. Et ton 7 ? Les autres n'ont que des cartes de 1 à 6 : même ton petit 7 bat tout le monde.
- Contrôle : 2 plis au mieux contre tous ; toujours le même chiffre, quoi que fasse chacun.

## Jour 5

- Niveau : facile
- Joueurs : 3
- Cartes : 3
- Donneur : joueur 2 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : n33, n32, n31
  - Joueur 1 : n36, n35, n34
  - Joueur 2 : n20, n12, n5
- Question : Combien de plis fais-tu ?
- Réponse : 0
- Explication : Trois cartes rouges, et pourtant… Joueur 1 a le 34, le 35 et le 36. À chaque pli, il pose une carte plus forte que la tienne : 0 pli.
- Contrôle : 0 pli au mieux contre tous ; toujours le même chiffre, quoi que fasse chacun.

## Jour 6

- Niveau : facile
- Joueurs : 4
- Cartes : 3
- Donneur : toi (ouvre le premier pli : joueur 1)
- Mains :
  - Joueur 0 (toi) : n36, n25, n3
  - Joueur 1 : n24, n10, n2
  - Joueur 2 : n18, n7, n1
  - Joueur 3 : n21, n14, n5
- Question : Combien de plis fais-tu ?
- Réponse : 2
- Explication : Ton 36 gagne. Ton 25 aussi : la plus forte carte en face, c'est le 24. Ton 3 ne gagnerait que si les trois autres posaient plus petit, mais Joueur 3 n'a rien sous 3.
- Contrôle : 2 plis au mieux contre tous ; toujours le même chiffre, quoi que fasse chacun.

## Jour 7

- Niveau : facile
- Joueurs : 3
- Cartes : 3
- Donneur : joueur 1 (ouvre le premier pli : joueur 2)
- Mains :
  - Joueur 0 (toi) : n12, n11, n10
  - Joueur 1 : n9, n8, n7
  - Joueur 2 : n36, n6, n5
- Question : Combien de plis fais-tu ?
- Réponse : 2
- Explication : Joueur 2 a le 36 : il prend un pli, c'est sûr. Sur les deux autres plis, tes cartes battent tout ce qui reste en face (9 au plus).
- Contrôle : 2 plis au mieux contre tous ; toujours le même chiffre, quoi que fasse chacun.

## Jour 8

- Niveau : facile
- Joueurs : 6
- Cartes : 2
- Donneur : joueur 4 (ouvre le premier pli : joueur 5)
- Mains :
  - Joueur 0 (toi) : n36, n1
  - Joueur 1 : n20, n8
  - Joueur 2 : n33, n14
  - Joueur 3 : n27, n5
  - Joueur 4 : n30, n17
  - Joueur 5 : n24, n2
- Question : Combien de plis fais-tu ?
- Réponse : 1
- Explication : Ton 36 gagne son pli, même à 6 joueurs. Ton 1 est la plus petite carte du jeu : il ne bat personne.
- Contrôle : 1 pli au mieux contre tous ; toujours le même chiffre, quoi que fasse chacun.

## Jour 9

- Niveau : moyen
- Joueurs : 3
- Cartes : 4
- Donneur : toi (ouvre le premier pli : joueur 1)
- Mains :
  - Joueur 0 (toi) : n35, n34, n33, n1
  - Joueur 1 : n36, n4, n3, n2
  - Joueur 2 : n8, n7, n6, n5
- Question : Combien de plis fais-tu ?
- Réponse : 2
- Explication : Tes 35, 34 et 33 battent tout, sauf le 36 de Joueur 1. Il le garde et le pose juste après toi, sur une de tes grosses cartes : tu n'arrives jamais à glisser ton 1 dessous. 2 plis.
- Contrôle : 2 plis au mieux contre tous ; de 2 à 3 si tout le monde joue n'importe comment.

## Jour 10

- Niveau : moyen
- Joueurs : 4
- Cartes : 4
- Donneur : joueur 2 (ouvre le premier pli : joueur 3)
- Mains :
  - Joueur 0 (toi) : n36, n20, n19, n18
  - Joueur 1 : n22, n21, n2, n1
  - Joueur 2 : n17, n16, n15, n3
  - Joueur 3 : n7, n6, n5, n4
- Question : Combien de plis fais-tu ?
- Réponse : 2
- Explication : Ton 36 gagne. Tes 20, 19 et 18 ne craignent que le 22 et le 21 de Joueur 1 : il peut en battre deux, pas trois. 2 plis, quoi qu'il arrive.
- Contrôle : 2 plis au mieux contre tous ; de 2 à 3 si tout le monde joue n'importe comment.

## Jour 11

- Niveau : moyen
- Joueurs : 4
- Cartes : 4
- Donneur : joueur 3 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : n30, n29, n28, n27
  - Joueur 1 : n36, n35, n3, n2
  - Joueur 2 : n34, n6, n5, n4
  - Joueur 3 : n10, n9, n8, n7
- Question : Combien de plis fais-tu ?
- Réponse : 1
- Explication : En face, trois cartes battent toutes les tiennes : le 36, le 35 et le 34. Chacune te prend un pli. Sur 4 plis, il t'en reste 1.
- Contrôle : 1 pli au mieux contre tous ; de 1 à 2 si tout le monde joue n'importe comment.

## Jour 12

- Niveau : moyen
- Joueurs : 5
- Cartes : 4
- Donneur : joueur 4 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : n32, n26, n14, n3
  - Joueur 1 : n36, n8, n7, n6
  - Joueur 2 : n35, n11, n10, n9
  - Joueur 3 : n34, n15, n13, n12
  - Joueur 4 : n33, n18, n17, n16
- Question : Combien de plis fais-tu ?
- Réponse : 0
- Explication : Quatre adversaires ont chacun une carte plus forte que ton 32 : 36, 35, 34 et 33. Il y a 4 plis, et chaque fois l'un d'eux peut poser la sienne au-dessus de toi. 0 pli : même ton 32 ne passe pas.
- Contrôle : 0 pli au mieux contre tous ; de 0 à 2 si tout le monde joue n'importe comment.

## Jour 13

- Niveau : moyen
- Joueurs : 6
- Cartes : 3
- Donneur : toi (ouvre le premier pli : joueur 1)
- Mains :
  - Joueur 0 (toi) : n33, n32, n1
  - Joueur 1 : n36, n3, n2
  - Joueur 2 : n35, n5, n4
  - Joueur 3 : n34, n7, n6
  - Joueur 4 : n10, n9, n8
  - Joueur 5 : n13, n12, n11
- Question : Combien de plis fais-tu ?
- Réponse : 0
- Explication : Trois adversaires ont une carte plus forte que ton 33 : le 36, le 35 et le 34. Toi, tu n'as que deux grosses cartes. Même si tu jettes ton 1 quand l'une d'elles tombe, il leur en reste une pour chacune des tiennes : 0 pli.
- Contrôle : 0 pli au mieux contre tous ; de 0 à 2 si tout le monde joue n'importe comment.

## Jour 14

- Niveau : moyen
- Joueurs : 3
- Cartes : 5
- Donneur : joueur 2 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : n36, n35, n34, n33, n7
  - Joueur 1 : n32, n31, n30, n2, n1
  - Joueur 2 : n29, n28, n27, n4, n3
- Question : Combien de plis fais-tu ?
- Réponse : 4
- Explication : Tes 36, 35, 34 et 33 sont les quatre plus fortes : 4 plis sûrs. Ton 7 bat le 1, le 2, le 3 et le 4, mais quand tu le poses, les autres répondent avec une grosse carte. 4 plis.
- Contrôle : 4 plis au mieux contre tous ; de 4 à 5 si tout le monde joue n'importe comment.

## Jour 15

- Niveau : moyen
- Joueurs : 4
- Cartes : 4
- Donneur : toi (ouvre le premier pli : joueur 1)
- Mains :
  - Joueur 0 (toi) : n31, n30, n2, n1
  - Joueur 1 : n36, n35, n4, n3
  - Joueur 2 : n32, n7, n6, n5
  - Joueur 3 : n11, n10, n9, n8
- Question : Combien de plis fais-tu ?
- Réponse : 1
- Explication : Tu joues en dernier au premier pli : si personne ne pose plus de 30, ton 30 gagne ; si une grosse carte tombe, tu glisses ton 1 dessous et elle est gâchée. Mais ils ont trois cartes plus fortes que tes 31 et 30 (36, 35, 32) : ils t'en prennent au moins une. 1 pli.
- Contrôle : 1 pli au mieux contre tous ; de 0 à 2 si tout le monde joue n'importe comment.

## Jour 16

- Niveau : moyen
- Joueurs : 3
- Cartes : 5
- Donneur : joueur 2 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : n36, n33, n24, n12, n6
  - Joueur 1 : n35, n30, n22, n10, n2
  - Joueur 2 : n34, n28, n20, n9, n3
- Question : Combien de plis fais-tu ?
- Réponse : 1
- Explication : Ton 36 gagne un pli. Pour chacune de tes autres cartes, il y a plus fort en face : 35 ou 34 sur ton 33, 30 ou 28 sur ton 24, 22 ou 20 sur ton 12, 10 ou 9 sur ton 6. Les autres en ont assez pour toutes les battre : 1 pli.
- Contrôle : 1 pli au mieux contre tous ; de 1 à 5 si tout le monde joue n'importe comment.

## Jour 17

- Niveau : difficile : Pouvoirs et Mystique
- Joueurs : 4
- Cartes : 4
- Donneur : joueur 2 (ouvre le premier pli : joueur 3)
- Mains :
  - Joueur 0 (toi) : m, n30, n12, n5 (Mystique)
  - Joueur 1 : n36, n35, n8, n2
  - Joueur 2 : n34, n33, n7, n6
  - Joueur 3 : n32, n31, n4, n1
- Question : Combien de plis fais-tu ?
- Réponse : 1
- Explication : Ta Mystique, posée à 37, bat toutes les cartes de la table : 1 pli sûr. Le reste ne passe pas : six cartes en face battent ton 30 (du 31 au 36), et les autres ont bien plus de grosses cartes que toi.
- Contrôle : 1 pli au mieux contre tous ; de 0 à 3 si tout le monde joue n'importe comment.

## Jour 18

- Niveau : difficile : Pouvoirs et Mystique
- Joueurs : 3
- Cartes : 2
- Donneur : toi (ouvre le premier pli : joueur 1)
- Mains :
  - Joueur 0 (toi) : p27, n1 (Sceau du Destin 27)
  - Joueur 1 : n27, n2
  - Joueur 2 : n26, n3
- Question : Combien de plis fais-tu ?
- Réponse : 1
- Explication : Ton Sceau du Destin vaut 27, comme le 27 de Joueur 1. À égalité, une carte Pouvoir bat une carte Nombre : ton 27 bat le sien et le 26. Ton 1 ne gagne rien : 1 pli.
- Contrôle : 1 pli au mieux contre tous ; toujours le même chiffre, quoi que fasse chacun.

## Jour 19

- Niveau : difficile : Pouvoirs et Mystique
- Joueurs : 3
- Cartes : 3
- Donneur : joueur 2 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : p20, n19, n1 (Bénédiction des Ancêtres 20)
  - Joueur 1 : n36, n35, n5
  - Joueur 2 : n4, n3, n2
- Question : Combien de plis fais-tu ?
- Réponse : 1
- Explication : Joueur 1 a le 36 et le 35 pour couvrir ton 20 et ton 19. Mais ta Bénédiction des Ancêtres l'oblige à poser tout de suite sa plus faible carte, le 5 : ton 20 gagne ce pli-là. Il lui reste ses deux grosses pour le reste : 1 pli.
- Contrôle : 1 pli au mieux contre tous ; de 0 à 1 si tout le monde joue n'importe comment.

## Jour 20

- Niveau : difficile : Pouvoirs et Mystique
- Joueurs : 4
- Cartes : 3
- Donneur : toi (ouvre le premier pli : joueur 1)
- Mains :
  - Joueur 0 (toi) : p3, n2, n1 (Voile du Néant 3)
  - Joueur 1 : n36, n20, n10
  - Joueur 2 : n35, n19, n9
  - Joueur 3 : n34, n18, n8
- Question : Combien de plis fais-tu ?
- Réponse : 1
- Explication : Tu joues en dernier au premier pli. Pose ton Voile du Néant : il échange sa valeur (3) avec la plus forte carte déjà posée. Tu prends sa force, l'autre récupère ton 3 : tu gagnes le pli. Ton 2 et ton 1 ne battent personne : 1 pli.
- Contrôle : 1 pli au mieux contre tous ; de 0 à 1 si tout le monde joue n'importe comment.

## Jour 21

- Niveau : difficile : Pouvoirs et Mystique
- Joueurs : 6
- Cartes : 2
- Donneur : joueur 5 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : p34, n1 (Voile du Néant 34)
  - Joueur 1 : n36, n2
  - Joueur 2 : n35, n3
  - Joueur 3 : n5, n4
  - Joueur 4 : n7, n6
  - Joueur 5 : n9, n8
- Question : Combien de plis fais-tu ?
- Réponse : 0
- Explication : Si tu ouvres avec ton Voile du Néant, il n'a rien à échanger : il vaut juste 34, et le 35 ou le 36 passe derrière. Si tu ouvres avec ton 1, les autres jettent leurs petites cartes : c'est Joueur 3, 4 ou 5 qui ouvre le pli suivant, ton Voile ne peut voler qu'une petite carte et Joueur 1 pose son 36 après toi. 0 pli.
- Contrôle : 0 pli au mieux contre tous ; de 0 à 1 si tout le monde joue n'importe comment.

## Jour 22

- Niveau : difficile : Pouvoirs et Mystique
- Joueurs : 5
- Cartes : 2
- Donneur : joueur 4 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : m, n2 (Mystique)
  - Joueur 1 : p34, n1 (Voile du Néant 34)
  - Joueur 2 : n20, n10
  - Joueur 3 : n21, n11
  - Joueur 4 : n22, n12
- Question : Combien de plis fais-tu ?
- Réponse : 0
- Explication : Joueur 1, juste à ta gauche, joue toujours après toi et garde son Voile du Néant (34). Dès que tu poses ta Mystique à 37, il pose son Voile et échange : il prend ton 37, toi son 34, et il gagne. Ton 2 ne bat personne : 0 pli.
- Contrôle : 0 pli au mieux contre tous ; de 0 à 2 si tout le monde joue n'importe comment.

## Jour 23

- Niveau : difficile : Pouvoirs et Mystique
- Joueurs : 4
- Cartes : 3
- Donneur : joueur 3 (ouvre le premier pli : toi)
- Mains :
  - Joueur 0 (toi) : m, n36, n2 (Mystique)
  - Joueur 1 : n4, p3, n1 (Voile du Néant 3)
  - Joueur 2 : n35, n6, n5
  - Joueur 3 : n34, n8, n7
- Question : Combien de plis fais-tu ?
- Réponse : 1
- Explication : Joueur 1 joue juste après toi et son Voile du Néant vole la première grosse carte que tu poses : il prend sa valeur, tu récupères son 3. Mais il n'a qu'un Voile : une fois qu'il l'a joué, ta deuxième grosse carte (Mystique à 37 ou 36) passe. 1 pli.
- Contrôle : 1 pli au mieux contre tous ; de 0 à 2 si tout le monde joue n'importe comment.

## Jour 24

- Niveau : difficile : Pouvoirs et Mystique
- Joueurs : 4
- Cartes : 3
- Donneur : toi (ouvre le premier pli : joueur 1)
- Mains :
  - Joueur 0 (toi) : m, p3, n1 (Mystique ; Voile du Néant 3)
  - Joueur 1 : n36, n35, n2
  - Joueur 2 : n34, n33, n4
  - Joueur 3 : n32, n31, n5
- Question : Combien de plis fais-tu ?
- Réponse : 2
- Explication : Au premier pli, tu joues en dernier : ton Voile du Néant vole la plus forte carte posée et gagne. Tu ouvres alors le pli suivant avec ta Mystique à 37 : personne ne la bat. 2 plis. Garde le Voile pour le premier pli : plus tard, tu risques de ne plus jouer en dernier, et posé en premier il ne fait rien.
- Contrôle : 2 plis au mieux contre tous ; de 0 à 2 si tout le monde joue n'importe comment.
