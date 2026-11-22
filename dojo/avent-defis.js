/*
 * Calendrier de l'Avent KYRAN : données des défis (avent.html, dojo/avent.js).
 *
 * Un défi par jour du 1er au 24 décembre, plus un défi d'essai (jour 0) jouable avant le 1er.
 * Format d'un défi :
 *   jour        0 (essai) ou 1 à 24
 *   joueurs     3 à 6 ; le joueur 0 est toujours « toi »
 *   cartes      nombre de cartes par main
 *   donneur     numéro du donneur ; le joueur à sa gauche (donneur + 1) ouvre le premier pli
 *   mains       { 0: [ids], 1: [ids], ... } ; ids du moteur (dojo/engine.js, cardById) :
 *               n1 à n36 (cartes Nombre), m (Mystique), p<valeur> (cartes Pouvoir : p3, p34,
 *               p11, p23, p20, p9, p27, p4)
 *   montrer     'moi' (seule ta main est visible) ou 'tous' (toutes les mains sont visibles)
 *   reponse     nombre de plis que tu fais (0 à cartes)
 *   explication texte affiché après la réponse (tutoiement, comme l'Initiation)
 *
 * Règle des réponses : la réponse doit être la même quelle que soit la façon de jouer de chacun
 * (sinon la question n'a pas de bonne réponse unique). scripts/test/avent.test.mjs le vérifie en
 * jouant toutes les suites possibles pour les défis à cartes Nombre dont toutes les mains sont
 * visibles.
 *
 * Jours 3 à 24 : à compléter avec les défis du game designer (_notes/avent/defis.md).
 * Une case sans défi affiche « Défi bientôt prêt ».
 */

export const DEFI_ESSAI = {
  jour: 0,
  joueurs: 3,
  cartes: 2,
  donneur: 2,
  mains: {
    0: ['n36', 'n1'],
    1: ['n20', 'n2'],
    2: ['n30', 'n3']
  },
  montrer: 'tous',
  reponse: 1,
  explication: 'Ton 36 est la carte la plus forte de la table : il gagne son pli, quoi que jouent les autres. Ton 1 est la plus faible : n’importe quelle carte le bat. Tu fais donc exactement 1 pli.'
};

export const DEFIS = [
  {
    jour: 1,
    joueurs: 4,
    cartes: 3,
    donneur: 3,
    mains: {
      0: ['n35', 'n2', 'n3'],
      1: ['n10', 'n22', 'n34'],
      2: ['n4', 'n15', 'n28'],
      3: ['n7', 'n19', 'n31']
    },
    montrer: 'tous',
    reponse: 1,
    explication: 'La plus forte carte des autres est le 34 : ton 35 gagne donc son pli à coup sûr. La plus faible carte des autres est le 4 : ton 2 et ton 3 perdent toujours. Peu importe l’ordre de jeu, tu fais 1 pli, ni plus ni moins.'
  },
  {
    jour: 2,
    joueurs: 4,
    cartes: 3,
    donneur: 3,
    mains: {
      0: ['n28', 'n29', 'n30'],
      1: ['n1', 'n2', 'n33'],
      2: ['n3', 'n4', 'n5'],
      3: ['n6', 'n7', 'n8']
    },
    montrer: 'tous',
    reponse: 2,
    explication: 'Une seule carte des autres bat les tiennes : le 33. Or on ne pose qu’une carte par pli, donc le 33 ne prend qu’un seul pli. Dans les deux autres plis, ton 28, ton 29 ou ton 30 bat tout ce qui reste. Tu fais 2 plis.'
  }
  // Jours 3 à 24 : à compléter (_notes/avent/defis.md).
];

/** Défi d'un jour (0 = essai), ou null s'il n'est pas encore écrit. */
export function defiDuJour(jour) {
  if (jour === 0) return DEFI_ESSAI;
  return DEFIS.find(d => d.jour === jour) || null;
}
