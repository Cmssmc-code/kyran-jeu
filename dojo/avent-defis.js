/*
 * Calendrier de l'Avent KYRAN : données des défis (avent.html, dojo/avent.js).
 *
 * Source : _notes/avent/defis.md (game designer). Ne pas modifier DEFIS à la main : corriger le
 * fichier .md puis lancer `node scripts/avent-import.mjs`, qui vérifie chaque défi avec le moteur
 * et réécrit le bloc entre les repères <defis:debut> et <defis:fin>.
 *
 * Format d'un défi (objet) :
 *   jour        1 à 24 (0 pour le défi d'essai montré avant le 1er décembre)
 *   niveau      texte libre (« facile », « difficile : Pouvoirs et Mystique »…)
 *   joueurs     3 à 6 ; le joueur 0 est toujours « toi », puis dans le sens des aiguilles d'une montre
 *   cartes      cartes par main (2 à 5 ; jamais 1 : la manche Mystique se joue à l'aveugle)
 *   donneur     numéro du donneur ; le joueur à sa gauche (donneur + 1) ouvre le premier pli
 *   mains       { "0": [ids], "1": [ids], … } ; ids du moteur (dojo/engine.js, cardById) :
 *               n1 à n36 (cartes Nombre), m (Mystique, 0 ou 37), p<valeur> (Pouvoir : p11, p27, p20,
 *               p3 de 3 à 6 joueurs ; p23, p4, p9, p34 en plus à 5 ou 6 joueurs)
 *   reponse     plis que tu fais en jouant au mieux, même si tous les autres jouent contre toi
 *   explication texte affiché après la réponse (tutoiement)
 * Toutes les mains sont visibles. La question est toujours « Combien de plis fais-tu ? ».
 *
 * Contrôle : scripts/test/avent.test.mjs rejoue chaque donne dans tous les ordres possibles avec
 * dojo/engine.js (scripts/lib/avent-solver.mjs) et vérifie que la réponse est juste.
 */

/** Défi d'essai, jouable avant l'ouverture de la première case. */
export const DEFI_ESSAI = {
  jour: 0,
  niveau: 'essai',
  joueurs: 3,
  cartes: 2,
  donneur: 2,
  mains: {
    '0': ['n36', 'n1'],
    '1': ['n20', 'n2'],
    '2': ['n30', 'n3']
  },
  reponse: 1,
  explication: 'Ton 36 est la carte la plus forte de la table : il gagne son pli, quoi que jouent les autres. Ton 1 est la plus faible : n’importe quelle carte le bat. Tu fais donc exactement 1 pli.'
};

// <defis:debut> (généré par scripts/avent-import.mjs depuis _notes/avent/defis.md)
export const DEFIS = [
  {
    jour: 1,
    niveau: "facile",
    joueurs: 3,
    cartes: 2,
    donneur: 2,
    mains: {
      '0': ['n36', 'n35'],
      '1': ['n12', 'n3'],
      '2': ['n20', 'n7']
    },
    reponse: 2,
    explication: "Le 36 et le 35 sont les deux plus fortes cartes de la table. Personne ne peut les battre : tu ramasses les deux plis."
  },
  {
    jour: 2,
    niveau: "facile",
    joueurs: 3,
    cartes: 2,
    donneur: 0,
    mains: {
      '0': ['n2', 'n1'],
      '1': ['n15', 'n4'],
      '2': ['n27', 'n9']
    },
    reponse: 0,
    explication: "Ton 2 et ton 1 sont les plus petites cartes de la table : toutes les cartes des autres sont plus fortes. Aucun pli pour toi. Si tu as parié 0, c'est parfait !"
  },
  {
    jour: 3,
    niveau: "facile",
    joueurs: 3,
    cartes: 3,
    donneur: 1,
    mains: {
      '0': ['n36', 'n35', 'n1'],
      '1': ['n22', 'n14', 'n6'],
      '2': ['n30', 'n17', 'n9']
    },
    reponse: 2,
    explication: "Ton 36 et ton 35 gagnent chacun leur pli. Ton 1 est la plus petite carte du jeu : il ne bat jamais rien."
  },
  {
    jour: 4,
    niveau: "facile",
    joueurs: 4,
    cartes: 2,
    donneur: 3,
    mains: {
      '0': ['n36', 'n7'],
      '1': ['n5', 'n1'],
      '2': ['n6', 'n2'],
      '3': ['n4', 'n3']
    },
    reponse: 2,
    explication: "Ton 36 gagne, ça c'est facile. Et ton 7 ? Les autres n'ont que des cartes de 1 à 6 : même ton petit 7 bat tout le monde."
  },
  {
    jour: 5,
    niveau: "facile",
    joueurs: 3,
    cartes: 3,
    donneur: 2,
    mains: {
      '0': ['n33', 'n32', 'n31'],
      '1': ['n36', 'n35', 'n34'],
      '2': ['n20', 'n12', 'n5']
    },
    reponse: 0,
    explication: "Trois cartes rouges, et pourtant… Joueur 1 a le 34, le 35 et le 36. À chaque pli, il pose une carte plus forte que la tienne : 0 pli."
  },
  {
    jour: 6,
    niveau: "facile",
    joueurs: 4,
    cartes: 3,
    donneur: 0,
    mains: {
      '0': ['n36', 'n25', 'n3'],
      '1': ['n24', 'n10', 'n2'],
      '2': ['n18', 'n7', 'n1'],
      '3': ['n21', 'n14', 'n5']
    },
    reponse: 2,
    explication: "Ton 36 gagne. Ton 25 aussi : la plus forte carte en face, c'est le 24. Ton 3 ne gagnerait que si les trois autres posaient plus petit, mais Joueur 3 n'a rien sous 3."
  },
  {
    jour: 7,
    niveau: "facile",
    joueurs: 3,
    cartes: 3,
    donneur: 1,
    mains: {
      '0': ['n12', 'n11', 'n10'],
      '1': ['n9', 'n8', 'n7'],
      '2': ['n36', 'n6', 'n5']
    },
    reponse: 2,
    explication: "Joueur 2 a le 36 : il prend un pli, c'est sûr. Sur les deux autres plis, tes cartes battent tout ce qui reste en face (9 au plus)."
  },
  {
    jour: 8,
    niveau: "facile",
    joueurs: 6,
    cartes: 2,
    donneur: 4,
    mains: {
      '0': ['n36', 'n1'],
      '1': ['n20', 'n8'],
      '2': ['n33', 'n14'],
      '3': ['n27', 'n5'],
      '4': ['n30', 'n17'],
      '5': ['n24', 'n2']
    },
    reponse: 1,
    explication: "Ton 36 gagne son pli, même à 6 joueurs. Ton 1 est la plus petite carte du jeu : il ne bat personne."
  },
  {
    jour: 9,
    niveau: "moyen",
    joueurs: 3,
    cartes: 4,
    donneur: 0,
    mains: {
      '0': ['n35', 'n34', 'n33', 'n1'],
      '1': ['n36', 'n4', 'n3', 'n2'],
      '2': ['n8', 'n7', 'n6', 'n5']
    },
    reponse: 2,
    explication: "Tes 35, 34 et 33 battent tout, sauf le 36 de Joueur 1. Il le garde et le pose juste après toi, sur une de tes grosses cartes : tu n'arrives jamais à glisser ton 1 dessous. 2 plis."
  },
  {
    jour: 10,
    niveau: "moyen",
    joueurs: 4,
    cartes: 4,
    donneur: 2,
    mains: {
      '0': ['n36', 'n20', 'n19', 'n18'],
      '1': ['n22', 'n21', 'n2', 'n1'],
      '2': ['n17', 'n16', 'n15', 'n3'],
      '3': ['n7', 'n6', 'n5', 'n4']
    },
    reponse: 2,
    explication: "Ton 36 gagne. Tes 20, 19 et 18 ne craignent que le 22 et le 21 de Joueur 1 : il peut en battre deux, pas trois. 2 plis, quoi qu'il arrive."
  },
  {
    jour: 11,
    niveau: "moyen",
    joueurs: 4,
    cartes: 4,
    donneur: 3,
    mains: {
      '0': ['n30', 'n29', 'n28', 'n27'],
      '1': ['n36', 'n35', 'n3', 'n2'],
      '2': ['n34', 'n6', 'n5', 'n4'],
      '3': ['n10', 'n9', 'n8', 'n7']
    },
    reponse: 1,
    explication: "En face, trois cartes battent toutes les tiennes : le 36, le 35 et le 34. Chacune te prend un pli. Sur 4 plis, il t'en reste 1."
  },
  {
    jour: 12,
    niveau: "moyen",
    joueurs: 5,
    cartes: 4,
    donneur: 4,
    mains: {
      '0': ['n32', 'n26', 'n14', 'n3'],
      '1': ['n36', 'n8', 'n7', 'n6'],
      '2': ['n35', 'n11', 'n10', 'n9'],
      '3': ['n34', 'n15', 'n13', 'n12'],
      '4': ['n33', 'n18', 'n17', 'n16']
    },
    reponse: 0,
    explication: "Quatre adversaires ont chacun une carte plus forte que ton 32 : 36, 35, 34 et 33. Il y a 4 plis, et chaque fois l'un d'eux peut poser la sienne au-dessus de toi. 0 pli : même ton 32 ne passe pas."
  },
  {
    jour: 13,
    niveau: "moyen",
    joueurs: 6,
    cartes: 3,
    donneur: 0,
    mains: {
      '0': ['n33', 'n32', 'n1'],
      '1': ['n36', 'n3', 'n2'],
      '2': ['n35', 'n5', 'n4'],
      '3': ['n34', 'n7', 'n6'],
      '4': ['n10', 'n9', 'n8'],
      '5': ['n13', 'n12', 'n11']
    },
    reponse: 0,
    explication: "Trois adversaires ont une carte plus forte que ton 33 : le 36, le 35 et le 34. Toi, tu n'as que deux grosses cartes. Même si tu jettes ton 1 quand l'une d'elles tombe, il leur en reste une pour chacune des tiennes : 0 pli."
  },
  {
    jour: 14,
    niveau: "moyen",
    joueurs: 3,
    cartes: 5,
    donneur: 2,
    mains: {
      '0': ['n36', 'n35', 'n34', 'n33', 'n7'],
      '1': ['n32', 'n31', 'n30', 'n2', 'n1'],
      '2': ['n29', 'n28', 'n27', 'n4', 'n3']
    },
    reponse: 4,
    explication: "Tes 36, 35, 34 et 33 sont les quatre plus fortes : 4 plis sûrs. Ton 7 bat le 1, le 2, le 3 et le 4, mais quand tu le poses, les autres répondent avec une grosse carte. 4 plis."
  },
  {
    jour: 15,
    niveau: "moyen",
    joueurs: 4,
    cartes: 4,
    donneur: 0,
    mains: {
      '0': ['n31', 'n30', 'n2', 'n1'],
      '1': ['n36', 'n35', 'n4', 'n3'],
      '2': ['n32', 'n7', 'n6', 'n5'],
      '3': ['n11', 'n10', 'n9', 'n8']
    },
    reponse: 1,
    explication: "Tu joues en dernier au premier pli : si personne ne pose plus de 30, ton 30 gagne ; si une grosse carte tombe, tu glisses ton 1 dessous et elle est gâchée. Mais ils ont trois cartes plus fortes que tes 31 et 30 (36, 35, 32) : ils t'en prennent au moins une. 1 pli."
  },
  {
    jour: 16,
    niveau: "moyen",
    joueurs: 3,
    cartes: 5,
    donneur: 2,
    mains: {
      '0': ['n36', 'n33', 'n24', 'n12', 'n6'],
      '1': ['n35', 'n30', 'n22', 'n10', 'n2'],
      '2': ['n34', 'n28', 'n20', 'n9', 'n3']
    },
    reponse: 1,
    explication: "Ton 36 gagne un pli. Pour chacune de tes autres cartes, il y a plus fort en face : 35 ou 34 sur ton 33, 30 ou 28 sur ton 24, 22 ou 20 sur ton 12, 10 ou 9 sur ton 6. Les autres en ont assez pour toutes les battre : 1 pli."
  },
  {
    jour: 17,
    niveau: "difficile : Pouvoirs et Mystique",
    joueurs: 4,
    cartes: 4,
    donneur: 2,
    mains: {
      '0': ['m', 'n30', 'n12', 'n5'],
      '1': ['n36', 'n35', 'n8', 'n2'],
      '2': ['n34', 'n33', 'n7', 'n6'],
      '3': ['n32', 'n31', 'n4', 'n1']
    },
    reponse: 1,
    explication: "Ta Mystique, posée à 37, bat toutes les cartes de la table : 1 pli sûr. Le reste ne passe pas : six cartes en face battent ton 30 (du 31 au 36), et les autres ont bien plus de grosses cartes que toi."
  },
  {
    jour: 18,
    niveau: "difficile : Pouvoirs et Mystique",
    joueurs: 3,
    cartes: 2,
    donneur: 0,
    mains: {
      '0': ['p27', 'n1'],
      '1': ['n27', 'n2'],
      '2': ['n26', 'n3']
    },
    reponse: 1,
    explication: "Ton Sceau du Destin vaut 27, comme le 27 de Joueur 1. À égalité, une carte Pouvoir bat une carte Nombre : ton 27 bat le sien et le 26. Ton 1 ne gagne rien : 1 pli."
  },
  {
    jour: 19,
    niveau: "difficile : Pouvoirs et Mystique",
    joueurs: 3,
    cartes: 3,
    donneur: 2,
    mains: {
      '0': ['p20', 'n19', 'n1'],
      '1': ['n36', 'n35', 'n5'],
      '2': ['n4', 'n3', 'n2']
    },
    reponse: 1,
    explication: "Joueur 1 a le 36 et le 35 pour couvrir ton 20 et ton 19. Mais ta Bénédiction des Ancêtres l'oblige à poser tout de suite sa plus faible carte, le 5 : ton 20 gagne ce pli-là. Il lui reste ses deux grosses pour le reste : 1 pli."
  },
  {
    jour: 20,
    niveau: "difficile : Pouvoirs et Mystique",
    joueurs: 4,
    cartes: 3,
    donneur: 0,
    mains: {
      '0': ['p3', 'n2', 'n1'],
      '1': ['n36', 'n20', 'n10'],
      '2': ['n35', 'n19', 'n9'],
      '3': ['n34', 'n18', 'n8']
    },
    reponse: 1,
    explication: "Tu joues en dernier au premier pli. Pose ton Voile du Néant : il échange sa valeur (3) avec la plus forte carte déjà posée. Tu prends sa force, l'autre récupère ton 3 : tu gagnes le pli. Ton 2 et ton 1 ne battent personne : 1 pli."
  },
  {
    jour: 21,
    niveau: "difficile : Pouvoirs et Mystique",
    joueurs: 6,
    cartes: 2,
    donneur: 5,
    mains: {
      '0': ['p34', 'n1'],
      '1': ['n36', 'n2'],
      '2': ['n35', 'n3'],
      '3': ['n5', 'n4'],
      '4': ['n7', 'n6'],
      '5': ['n9', 'n8']
    },
    reponse: 0,
    explication: "Si tu ouvres avec ton Voile du Néant, il n'a rien à échanger : il vaut juste 34, et le 35 ou le 36 passe derrière. Si tu ouvres avec ton 1, les autres jettent leurs petites cartes : c'est Joueur 3, 4 ou 5 qui ouvre le pli suivant, ton Voile ne peut voler qu'une petite carte et Joueur 1 pose son 36 après toi. 0 pli."
  },
  {
    jour: 22,
    niveau: "difficile : Pouvoirs et Mystique",
    joueurs: 5,
    cartes: 2,
    donneur: 4,
    mains: {
      '0': ['m', 'n2'],
      '1': ['p34', 'n1'],
      '2': ['n20', 'n10'],
      '3': ['n21', 'n11'],
      '4': ['n22', 'n12']
    },
    reponse: 0,
    explication: "Joueur 1, juste à ta gauche, joue toujours après toi et garde son Voile du Néant (34). Dès que tu poses ta Mystique à 37, il pose son Voile et échange : il prend ton 37, toi son 34, et il gagne. Ton 2 ne bat personne : 0 pli."
  },
  {
    jour: 23,
    niveau: "difficile : Pouvoirs et Mystique",
    joueurs: 4,
    cartes: 3,
    donneur: 3,
    mains: {
      '0': ['m', 'n36', 'n2'],
      '1': ['n4', 'p3', 'n1'],
      '2': ['n35', 'n6', 'n5'],
      '3': ['n34', 'n8', 'n7']
    },
    reponse: 1,
    explication: "Joueur 1 joue juste après toi et son Voile du Néant vole la première grosse carte que tu poses : il prend sa valeur, tu récupères son 3. Mais il n'a qu'un Voile : une fois qu'il l'a joué, ta deuxième grosse carte (Mystique à 37 ou 36) passe. 1 pli."
  },
  {
    jour: 24,
    niveau: "difficile : Pouvoirs et Mystique",
    joueurs: 4,
    cartes: 3,
    donneur: 0,
    mains: {
      '0': ['m', 'p3', 'n1'],
      '1': ['n36', 'n35', 'n2'],
      '2': ['n34', 'n33', 'n4'],
      '3': ['n32', 'n31', 'n5']
    },
    reponse: 2,
    explication: "Au premier pli, tu joues en dernier : ton Voile du Néant vole la plus forte carte posée et gagne. Tu ouvres alors le pli suivant avec ta Mystique à 37 : personne ne la bat. 2 plis. Garde le Voile pour le premier pli : plus tard, tu risques de ne plus jouer en dernier, et posé en premier il ne fait rien."
  }
];

/** Défis de _notes/avent/defis.md refusés par le moteur (non publiés). */
export const DEFIS_ECARTES = [];
// <defis:fin>

/** Défi d'un jour (0 = essai), ou null s'il n'est pas publié. */
export function defiDuJour(jour) {
  if (jour === 0) return DEFI_ESSAI;
  return DEFIS.find(d => d.jour === jour) || null;
}
